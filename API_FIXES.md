# Fixes para API REST - Backend Guiones

## Problema Reportado
"El backend para API REST no funciona" - Los endpoints devuelvan error 404 o 500.

## Causas Identificadas y Soluciones

### 1. ❌ Colisión de Prefijos en Rutas (Error 404)

**Problema:** 
Todos los routers tenían un prefijo definido en dos lugares:
- En la creación del `APIRouter`: `APIRouter(prefix="/proyectos", ...)`
- Al incluir el router: `app.include_router(router, prefix="/api/proyectos", ...)`

**Resultado:** Las rutas quedaban como `/api/proyectos/proyectos/` en lugar de `/api/proyectos/`

**Solución:**
Eliminar el prefijo del `APIRouter` en todos los routers, dejando solo el prefijo en `include_router`.

**Archivos modificados:**
- `backend/routers/proyectos.py` - Eliminado `prefix="/proyectos"`
- `backend/routers/personajes.py` - Eliminado `prefix="/personajes"`
- `backend/routers/narrativas.py` - Eliminado `prefix="/narrativas"`
- `backend/routers/tramas.py` - Eliminado `prefix="/tramas"`
- `backend/routers/estructura.py` - Eliminado `prefix="/estructura"`
- `backend/routers/ai_character.py` - Eliminado `prefix="/ai/character"`
- `backend/routers/ai_plot.py` - Eliminado `prefix="/ai/plot"`
- `backend/routers/ai_scene.py` - Eliminado `prefix="/ai/scene"`
- `backend/routers/ai_narrative.py` - Eliminado `prefix="/ai/narrative"`

---

### 2. ❌ Base de Datos no Creada (Error 500)

**Problema:**
```
sqlalchemy.exc.OperationalError: (sqlite3.OperationalError) no such table: proyectos
```

**Causa:** La base de datos SQLite no existía y las tablas no habían sido creadas.

**Solución:**
Ejecutar el script de setup de la base de datos:
```bash
cd /media/alvaro/service/project-stack/guiones
source backend/venv/bin/activate
python -m backend.scripts.setup_db --force
```

**Resultado:**
- Se creó `backend/database.db`
- Todas las tablas fueron creadas: proyectos, personajes, narrativas, tramas, estructura_narrativa

---

### 3. ❌ Rutas Raíz Faltantes (Error 404)

**Problema:**
Los endpoints raíz para listar todos los elementos no existían:
- `/api/personajes/` - 404
- `/api/narrativas/` - 404
- `/api/tramas/` - 404
- `/api/estructura/` - 404

Solo existían rutas para listar por proyecto: `/api/personajes/proyecto/{proyecto_id}`

**Solución:**
Añadir rutas raíz a cada router y las funciones correspondientes en crud.py.

**Archivos modificados:**

#### Routers:
- `backend/routers/personajes.py` - Añadida ruta `/` con `read_all_personajes`
- `backend/routers/narrativas.py` - Añadida ruta `/` con `read_all_narrativas`
- `backend/routers/tramas.py` - Añadida ruta `/` con `read_all_tramas`
- `backend/routers/estructura.py` - Añadida ruta `/` con `read_all_estructuras`

#### CRUD:
- `backend/crud.py` - Añadidas funciones:
  - `get_all_personajes(db, skip=0, limit=100)`
  - `get_all_narrativas(db, skip=0, limit=100)`
  - `get_all_tramas(db, skip=0, limit=100)`
  - `get_all_estructuras(db, skip=0, limit=100)`

---

## Resumen de Cambios

### Archivos Modificados:
1. **backend/routers/proyectos.py** - Eliminado prefijo
2. **backend/routers/personajes.py** - Eliminado prefijo + añadida ruta raíz
3. **backend/routers/narrativas.py** - Eliminado prefijo + añadida ruta raíz
4. **backend/routers/tramas.py** - Eliminado prefijo + añadida ruta raíz
5. **backend/routers/estructura.py** - Eliminado prefijo + añadida ruta raíz
6. **backend/routers/ai_character.py** - Eliminado prefijo
7. **backend/routers/ai_plot.py** - Eliminado prefijo
8. **backend/routers/ai_scene.py** - Eliminado prefijo
9. **backend/routers/ai_narrative.py** - Eliminado prefijo
10. **backend/crud.py** - Añadidas 4 funciones get_all_*

### Base de Datos:
- **Ubicación:** `backend/database.db`
- **Tablas:** proyectos, personajes, narrativas, tramas, estructura_narrativa
- **Creada con:** `python -m backend.scripts.setup_db --force`

---

## Endpoints Funcionando (HTTP 200)

| Endpoint | Método | Descripción | Estado |
|----------|--------|-------------|--------|
| `/api/proyectos/` | GET | Listar todos los proyectos | ✅ |
| `/api/personajes/` | GET | Listar todos los personajes | ✅ |
| `/api/narrativas/` | GET | Listar todas las narrativas | ✅ |
| `/api/tramas/` | GET | Listar todas las tramas | ✅ |
| `/api/estructura/` | GET | Listar toda la estructura | ✅ |
| `/api/proyectos/{id}` | GET | Obtener proyecto | ✅ |
| `/api/personajes/{id}` | GET | Obtener personaje | ✅ |
| `/api/narrativas/{id}` | GET | Obtener narrativa | ✅ |
| `/api/tramas/{id}` | GET | Obtener trama | ✅ |
| `/api/estructura/{id}` | GET | Obtener elemento | ✅ |
| `/health` | GET | Health check | ✅ |
| `/docs` | GET | Swagger UI | ✅ |
| `/` | GET | Bienvenida | ✅ |

---

## Cómo Iniciar el Backend

```bash
# Navegar al proyecto
cd /media/alvaro/service/project-stack/guiones

# Activar entorno virtual
source backend/venv/bin/activate

# Iniciar servidor
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

O en segundo plano:
```bash
nohup uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000 > /tmp/backend.log 2>&1 &
```

---

## Estado Actual

✅ **Backend en ejecución:** http://localhost:8000
✅ **Todas las rutas API funcionan** (200 OK)
✅ **Base de datos creada** con todas las tablas
✅ **Errores del navegador resueltos** (errors.txt actualizado)

---

## Próximos Pasos (Opcional)

1. Probar el frontend con el backend en ejecución
2. Crear un proyecto usando la API para verificar escritura
3. Configurar Mistral API key en `.env` para usar las funciones de IA
4. Ejecutar pruebas unitarias (si existen)
