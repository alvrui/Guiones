# Fix: Error de Conexión Frontend -> Backend (ECONNREFUSED ::1:8000)

## Problema Reportado
```
Error: connect ECONNREFUSED ::1:8000
```

El frontend (Vite) no podía conectarse al backend (FastAPI) debido a un problema de resolución de hostname.

## Causa del Error

El error `ECONNREFUSED ::1:8000` ocurre porque:

1. **El navegador/Node.js resuelve `localhost` a `::1` (IPv6)** - Esto es el comportamiento por defecto en sistemas modernos
2. **El backend solo escuchaba en IPv4** (`0.0.0.0:8000`) - No estaba configurado para escuchar en IPv6
3. **El proxy de Vite usaba `localhost`** - Que se resolvía a `::1` (IPv6)

Resultado: El navegador intentaba conectarse a `[::1]:8000` pero el backend solo escuchaba en `127.0.0.1:8000` (IPv4).

## Soluciones Aplicadas

### Solución 1: Backend escucha en IPv6 (Recomendada)

Cambiar el host de Uvicorn de `0.0.0.0` a `::` para escuchar en todas las interfaces IPv6 e IPv4.

**Comando de inicio del backend:**
```bash
# Antes:
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000

# Después:
uvicorn backend.main:app --reload --host :: --port 8000
```

**Resultado:**
- El backend escucha en `::` (todas las direcciones IPv6)
- También escucha en `0.0.0.0` (todas las direcciones IPv4)
- Responde a `::1:8000` (IPv6 localhost)
- Responde a `127.0.0.1:8000` (IPv4 localhost)

### Solución 2: Cambiar proxy de Vite a IPv4

Modificar el target del proxy en `vite.config.ts` para usar `127.0.0.1` en lugar de `localhost`.

**Archivo:** `frontend/vite.config.ts`

```typescript
// Antes:
'/api': {
  target: 'http://localhost:8000',
  changeOrigin: true,
}

// Después:
'/api': {
  target: 'http://127.0.0.1:8000',
  changeOrigin: true,
}
```

**Ventaja:** El proxy de Vite forzó el uso de IPv4.

## Estado Actual

✅ **Ambas soluciones aplicadas:**
- Backend escucha en IPv6 (`::`) e IPv4 (`0.0.0.0`)
- Proxy de Vite configurado para `127.0.0.1:8000`

**Resultados:**
- `http://[::1]:8000/` → ✅ Funciona
- `http://127.0.0.1:8000/` → ✅ Funciona  
- `http://localhost:8000/` → ✅ Funciona
- Proxy Vite `/api/*` → ✅ Redirige correctamente

## Verificación

### Desde la terminal:
```bash
# IPv6
curl http://[::1]:8000/api/proyectos/
# Result: [] (HTTP 200)

# IPv4
curl http://127.0.0.1:8000/api/proyectos/
# Result: [] (HTTP 200)
```

### Desde Node.js (frontend):
```javascript
const axios = require('axios');
axios.get('http://127.0.0.1:8000/api/proyectos/')
  .then(r => console.log('✅ Conexión OK', r.status))
// Result: ✅ Conexión OK 200
```

## Archivos Modificados

1. **vite.config.ts** - Cambiado `target: 'http://localhost:8000'` a `target: 'http://127.0.0.1:8000'`

## Comandos de Inicio

### Backend (con IPv6):
```bash
cd /media/alvaro/service/project-stack/guiones
source backend/venv/bin/activate
uvicorn backend.main:app --reload --host :: --port 8000
```

### Frontend:
```bash
cd /media/alvaro/service/project-stack/guiones/frontend
npm run dev
```

## Notas

- El host `::` en Uvicorn hace que escuche en todas las interfaces IPv6
- IPv6 `::` incluye `::1` (localhost IPv6) y también `0.0.0.0` (IPv4)
- Esta es la solución más robusta ya que funciona en cualquier sistema
- El cambio en vite.config.ts es un backup por si hay problemas con IPv6 en algún entorno
