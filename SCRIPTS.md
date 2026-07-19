# Scripts de Gestión - Aplicación Guiones

## 🚀 Script Principal: `start.sh`

El script `start.sh` permite gestionar el backend y frontend de la aplicación Guiones de forma sencilla.

### Ubicación
```
/media/alvaro/service/project-stack/guiones/start.sh
```

### Requisitos
- Permisos de ejecución: `chmod +x start.sh`
- Entorno virtual de Python creado en `backend/venv/`
- Dependencias de Node.js instaladas en `frontend/`

---

## 📜 Uso

### 1. Iniciar la aplicación completa
```bash
cd /media/alvaro/service/project-stack/guiones
./start.sh start
```

Esto iniciará:
- **Backend:** FastAPI en http://localhost:8000
- **Frontend:** Vite en http://localhost:3000

### 2. Iniciar solo el backend
```bash
./start.sh backend
```
- Inicia solo el servidor FastAPI en http://localhost:8000

### 3. Iniciar solo el frontend
```bash
./start.sh frontend
```
- Inicia solo el servidor de desarrollo Vite en http://localhost:3000

### 4. Detener todos los servicios
```bash
./start.sh stop
```
- Detiene el backend y el frontend
- Elimina todos los procesos relacionados
- Libera los puertos 3000 y 8000

### 5. Reiniciar la aplicación
```bash
./start.sh restart
```
- Detiene todos los servicios
- Espera 1 segundo
- Inicia backend y frontend

### 6. Verificar el estado
```bash
./start.sh status
```
Muestra el estado de:
- Backend (PID y URL)
- Frontend (PID y URL)

### 7. Mostrar ayuda
```bash
./start.sh help
./start.sh -h
./start.sh --help
```

---

## 📊 Puertos Utilizados

| Servicio | Puerto | Tipo | URL |
|----------|--------|------|-----|
| Backend (FastAPI) | 8000 | IPv6 | http://localhost:8000 |
| Frontend (Vite) | 3000 | IPv6 | http://localhost:3000 |

**Nota:** El backend escucha en IPv6 (`::`) lo que permite conexiones desde:
- `http://localhost:8000`
- `http://127.0.0.1:8000`
- `http://[::1]:8000`

---

## 📁 Archivos de Log

Los logs de los servicios se guardan en:
- **Backend:** `/tmp/guiones_backend.log`
- **Frontend:** `/tmp/guiones_frontend.log`

Para ver los logs:
```bash
# Ver log del backend
tail -f /tmp/guiones_backend.log

# Ver log del frontend
tail -f /tmp/guiones_frontend.log
```

---

## 🔧 Configuración

### Backend
- **Framework:** FastAPI 0.109.0
- **Servidor ASGI:** Uvicorn 0.27.0
- **Host:** `::` (IPv6, compatible con IPv4)
- **Puerto:** 8000
- **Recarga automática:** Habilitada (`--reload`)

### Frontend
- **Framework:** Vite 5.4.21
- **Servidor:** Node.js
- **Host:** localhost
- **Puerto:** 3000
- **Proxy:** `/api/*` → http://127.0.0.1:8000

---

## 🎯 Comandos Manuales

Si prefieres ejecutar los servicios manualmente:

### Backend
```bash
cd /media/alvaro/service/project-stack/guiones
source backend/venv/bin/activate
uvicorn backend.main:app --reload --host :: --port 8000
```

### Frontend
```bash
cd /media/alvaro/service/project-stack/guiones/frontend
npm run dev
```

---

## ⚠️ Solución de Problemas

### "Puerto X en uso"
```bash
# Ver qué proceso usa el puerto
lsof -i :8000
lsof -i :3000

# Matar el proceso (reemplazar PID)
kill -9 <PID>

# O usar el script de stop
./start.sh stop
```

### "ModuleNotFoundError"
Asegúrate de:
1. Estar en el directorio correcto
2. El entorno virtual esté activado (para backend)
3. Las dependencias estén instaladas (para frontend)

### "Connection refused"
Verifica que:
1. El backend esté en ejecución (`./start.sh status`)
2. El puerto 8000 esté escuchando (`lsof -i :8000`)
3. El proxy del frontend esté configurado correctamente

---

## 📝 Notas

- El script usa colores para diferencia los mensajes:
  - 🔵 **Azul:** Información
  - 🟢 **Verde:** Éxito
  - 🟡 **Amarillo:** Espera
  - 🔴 **Rojo:** Error

- El warning "setlocale: LC_ALL: cannot change locale (en_US.UTF-8)" es inofensivo y puede ignorarse.

- Para detener el script mientras se está ejecutando, usa `Ctrl+C`.

---

## 🎉 Ejemplo de Flujo de Trabajo

```bash
# Navegar al proyecto
cd /media/alvaro/service/project-stack/guiones

# Iniciar la aplicación
./start.sh start

# Ver el estado
./start.sh status

# Ver logs en tiempo real
tail -f /tmp/guiones_backend.log &
tail -f /tmp/guiones_frontend.log &

# Detener la aplicación
./start.sh stop
```

---

## ✅ Estado Actual

Después de ejecutar `./start.sh start`:
- ✅ Backend disponible en http://localhost:8000
- ✅ Frontend disponible en http://localhost:3000
- ✅ Conexión entre frontend y backend establecida
- ✅ Todas las rutas API funcionando (HTTP 200)
