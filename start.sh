#!/bin/bash

# =============================================================================
# Script de Inicio - Aplicación Guiones
# =============================================================================
# Este script permite iniciar el backend y frontend de la aplicación Guiones
# de forma sencilla.
#
# Uso:
#   ./start.sh          - Inicia ambos servicios (backend + frontend)
#   ./start.sh backend  - Inicia solo el backend
#   ./start.sh frontend - Inicia solo el frontend
#   ./start.sh stop     - Detiene ambos servicios
#   ./start.sh status   - Muestra el estado de los servicios
# =============================================================================

set -e

# Colores para salida
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Rutas
BACKEND_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/backend" && pwd)"
FRONTEND_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/frontend" && pwd)"
PID_FILE="/tmp/guiones.pids"
LOG_BACKEND="/tmp/guiones_backend.log"
LOG_FRONTEND="/tmp/guiones_frontend.log"

# Función para mostrar ayuda
show_help() {
    echo "Uso: $0 [comando]"
    echo ""
    echo "Comandos:"
    echo "  start     - Inicia backend y frontend"
    echo "  backend  - Inicia solo el backend"
    echo "  frontend - Inicia solo el frontend"
    echo "  stop     - Detiene ambos servicios"
    echo "  restart  - Reinicia ambos servicios"
    echo "  status   - Muestra el estado de los servicios"
    echo "  help     - Muestra esta ayuda"
    echo ""
    echo "Ejemplo: $0 start"
}

# Función para iniciar el backend
start_backend() {
    echo -e "${BLUE}[INFO]${NC} Iniciando backend..."
    
    # Verificar si el entorno virtual existe
    if [ ! -d "$BACKEND_DIR/venv" ]; then
        echo -e "${RED}[ERROR]${NC} Entorno virtual no encontrado en $BACKEND_DIR/venv"
        echo "Ejecute: python -m venv venv"
        exit 1
    fi
    
    # Usar el python del entorno virtual directamente
    VENV_PYTHON="$BACKEND_DIR/venv/bin/python"
    
    # Ejecutar desde el directorio raíz de guiones (donde está backend/)
    nohup bash -c "cd $BACKEND_DIR/.. && $VENV_PYTHON -m uvicorn backend.main:app --reload --host :: --port 8002" > "$LOG_BACKEND" 2>&1 &
    BACKEND_PID=$!
    
    # Guardar PID
    echo "$BACKEND_PID" > "$PID_FILE.backend"
    
    # Esperar a que el backend esté listo
    echo -e "${YELLOW}[WAIT]${NC} Esperando a que el backend esté listo..."
    sleep 3
    
    # Verificar si el backend está funcionando
    if curl -s http://localhost:8002/health > /dev/null 2>&1; then
        echo -e "${GREEN}[OK]${NC} Backend iniciado en http://localhost:8002 (PID: $BACKEND_PID)"
        echo -e "  Log: $LOG_BACKEND"
    else
        echo -e "${RED}[ERROR]${NC} No se pudo iniciar el backend. Ver log: $LOG_BACKEND"
        tail -20 "$LOG_BACKEND"
    fi
}

# Función para iniciar el frontend
start_frontend() {
    echo -e "${BLUE}[INFO]${NC} Iniciando frontend..."
    cd "$FRONTEND_DIR"
    
    # Verificar si node_modules existe
    if [ ! -d "node_modules" ]; then
        echo -e "${RED}[ERROR]${NC} node_modules no encontrado. Ejecute: npm install"
        exit 1
    fi
    
    # Iniciar vite en puerto 3002, accesible desde red local
    PORT=3002 HOST=0.0.0.0 nohup npm run dev > "$LOG_FRONTEND" 2>&1 &
    FRONTEND_PID=$!
    
    # Guardar PID
    echo "$FRONTEND_PID" > "$PID_FILE.frontend"
    
    # Esperar a que el frontend esté listo
    echo -e "${YELLOW}[WAIT]${NC} Esperando a que el frontend esté listo..."
    sleep 3
    
    # Verificar si el frontend está funcionando
    if curl -s http://localhost:3002 > /dev/null 2>&1; then
        echo -e "${GREEN}[OK]${NC} Frontend iniciado en http://localhost:3002 (PID: $FRONTEND_PID)"
        echo -e "  Log: $LOG_FRONTEND"
    else
        echo -e "${RED}[ERROR]${NC} No se pudo iniciar el frontend. Ver log: $LOG_FRONTEND"
        tail -20 "$LOG_FRONTEND"
    fi
}

# Función para detener los servicios
stop_services() {
    echo -e "${BLUE}[INFO]${NC} Deteniendo servicios..."
    
    # Matar todos los procesos relacionados
    # Backend (uvicorn)
    pkill -9 -f "uvicorn" 2>/dev/null || true
    pkill -9 -f "backend.main:app" 2>/dev/null || true
    pkill -9 -f "python.*uvicorn" 2>/dev/null || true
    
    # Frontend (vite/node)
    pkill -9 -f "vite" 2>/dev/null || true
    pkill -9 -f "node.*vite" 2>/dev/null || true
    pkill -9 -f "npm run dev" 2>/dev/null || true
    
    # Matar por puerto usando lsof
    if lsof -t -i :8002 2>/dev/null | grep -q .; then
        lsof -t -i :8002 2>/dev/null | xargs kill -9 2>/dev/null || true
    fi
    if lsof -t -i :3002 2>/dev/null | grep -q .; then
        lsof -t -i :3002 2>/dev/null | xargs kill -9 2>/dev/null || true
    fi
    
    # Limpiar archivos PID
    rm -f "$PID_FILE.backend" "$PID_FILE.frontend"
    
    echo -e "${GREEN}[OK]${NC} Todos los servicios detenidos"
}

# Función para mostrar el estado
show_status() {
    echo -e "${BLUE}Estado de los servicios Guiones:${NC}"
    echo "========================================"
    
    # Verificar backend - priorizar el puerto sobre el archivo PID
    if lsof -i :8002 > /dev/null 2>&1; then
        BACKEND_PID=$(lsof -t -i :8002 2>/dev/null | head -1)
        echo -e "${GREEN}Backend:${NC}   EJECUTÁNDOSE (PID: $BACKEND_PID)"
        echo "             URL: http://localhost:8002"
        # Actualizar archivo PID
        echo "$BACKEND_PID" > "$PID_FILE.backend"
    else
        # Limpiar archivo PID si existe pero el proceso no
        rm -f "$PID_FILE.backend"
        echo -e "${RED}Backend:${NC}   DETENIDO"
    fi
    
    # Verificar frontend - priorizar el puerto sobre el archivo PID
    if lsof -i :3002 > /dev/null 2>&1; then
        FRONTEND_PID=$(lsof -t -i :3002 2>/dev/null | head -1)
        echo -e "${GREEN}Frontend:${NC}  EJECUTÁNDOSE (PID: $FRONTEND_PID)"
        echo "             URL: http://localhost:3002"
        # Actualizar archivo PID
        echo "$FRONTEND_PID" > "$PID_FILE.frontend"
    else
        # Limpiar archivo PID si existe pero el proceso no
        rm -f "$PID_FILE.frontend"
        echo -e "${RED}Frontend:${NC}  DETENIDO"
    fi
    
    echo "========================================"
}

# Función principal
main() {
    case "$1" in
        start)
            echo -e "${BLUE}Iniciando aplicación Guiones...${NC}"
            echo "========================================"
            start_backend
            start_frontend
            echo "========================================"
            echo -e "${GREEN}Aplicación Guiones iniciada!${NC}"
            echo "Backend:  http://localhost:8002"
            echo "Frontend: http://localhost:3002"
            echo ""
            echo "Presione Ctrl+C para detener"
            ;;
        backend)
            start_backend
            ;;
        frontend)
            start_frontend
            ;;
        stop)
            stop_services
            ;;
        restart)
            stop_services
            sleep 1
            start_backend
            start_frontend
            ;;
        status)
            show_status
            ;;
        help|--help|-h|"")
            show_help
            ;;
        *)
            show_help
            exit 1
            ;;
    esac
}

# Ejecutar
main "$@"
