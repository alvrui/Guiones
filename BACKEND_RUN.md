# Backend - Comandos de Ejecución

## Estado Actual
✅ **Backend en ejecución** en http://localhost:8000

## Endpoints Disponibles
- **Raíz:** `http://localhost:8000/` - Mensaje de bienvenida
- **Health Check:** `http://localhost:8000/health` - Estado del servidor
- **Documentación Swagger:** `http://localhost:8000/docs` - API interactiva
- **Redoc:** `http://localhost:8000/redoc` - Documentación alternativa

## API Endpoints

### Proyectos
- `GET /api/proyectos/` - Listar proyectos
- `POST /api/proyectos/` - Crear proyecto
- `GET /api/proyectos/{id}` - Obtener proyecto
- `PUT /api/proyectos/{id}` - Actualizar proyecto
- `DELETE /api/proyectos/{id}` - Eliminar proyecto

### Personajes
- `GET /api/personajes/` - Listar personajes
- `POST /api/personajes/` - Crear personaje
- `GET /api/personajes/{id}` - Obtener personaje
- `PUT /api/personajes/{id}` - Actualizar personaje
- `DELETE /api/personajes/{id}` - Eliminar personaje

### Narrativas
- `GET /api/narrativas/` - Listar narrativas
- `POST /api/narrativas/` - Crear narrativa
- `GET /api/narrativas/{id}` - Obtener narrativa
- `PUT /api/narrativas/{id}` - Actualizar narrativa
- `DELETE /api/narrativas/{id}` - Eliminar narrativa

### Tramas
- `GET /api/tramas/` - Listar tramas
- `POST /api/tramas/` - Crear trama
- `GET /api/tramas/{id}` - Obtener trama
- `PUT /api/tramas/{id}` - Actualizar trama
- `DELETE /api/tramas/{id}` - Eliminar trama

### Estructura Narrativa
- `GET /api/estructura/` - Listar estructura narrativa
- `POST /api/estructura/` - Crear elemento de estructura
- `GET /api/estructura/{id}` - Obtener elemento
- `PUT /api/estructura/{id}` - Actualizar elemento
- `DELETE /api/estructura/{id}` - Eliminar elemento

### IA - Asistentes
- `POST /api/ai/character/` - Generar personaje con IA
- `POST /api/ai/plot/` - Generar trama con IA
- `POST /api/ai/scene/` - Generar escena con IA
- `POST /api/ai/narrative/` - Generar narrativa con IA

## Iniciar el Backend

### Desde el directorio del proyecto:
```bash
cd /media/alvaro/service/project-stack/guiones
source backend/venv/bin/activate
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

### En segundo plano:
```bash
cd /media/alvaro/service/project-stack/guiones
source backend/venv/bin/activate
nohup uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000 > /tmp/backend.log 2>&1 &
```

## Detener el Backend

### Encontrar el PID:
```bash
ps aux | grep uvicorn
```

### Detener por PID:
```bash
kill -9 <PID>
```

### Detener todos los procesos uvicorn:
```bash
pkill -9 -f uvicorn
```

## Configuración
- **Framework:** FastAPI 0.109.0
- **Servidor ASGI:** Uvicorn 0.27.0
- **Base de datos:** SQLite (configurable)
- **Python:** 3.13.5
- **Host:** 0.0.0.0 (accesible desde cualquier interfaz de red)
- **Puerto:** 8000
- **Recarga automática:** Habilitada (--reload)

## Base de Datos
El backend usa SQLite por defecto. La base de datos se crea automáticamente en:
```
backend/database.db
```

## Variables de Entorno
Crea un archivo `.env` en el directorio `backend/` con:
```
DATABASE_URL=sqlite:///./database.db
MISTRAL_API_KEY=tu_api_key_aqui
```
