# Guiones - Aplicación de Creación de Guiones con IA

## Instalación Completada

Este proyecto ha sido configurado y todas las dependencias han sido instaladas.

## Estructura del Proyecto

```
guiones/
├── backend/
│   ├── venv/              # Entorno virtual de Python
│   ├── main.py           # Punto de entrada del backend
│   ├── requirements.txt  # Dependencias del backend
│   ├── models.py         # Modelos de SQLAlchemy
│   ├── schemas.py        # Schemas de Pydantic
│   ├── crud.py           # Operaciones CRUD
│   ├── routers/          # Rutas de la API
│   ├── agents/           # Agentes de IA
│   └── database.py       # Configuración de la base de datos
│
├── frontend/
│   ├── node_modules/     # Dependencias de Node.js
│   ├── package.json      # Configuración del frontend
│   ├── vite.config.ts    # Configuración de Vite
│   ├── src/              # Código fuente React/TypeScript
│   └── index.html        # Página principal
│
├── README.md             # Documentación original
└── README_INSTALACION.md # Este archivo
```

## Dependencias Instaladas

### Backend (Python)
- FastAPI 0.109.0
- Uvicorn 0.27.0
- SQLAlchemy 2.0.51 (actualizado para compatibilidad con Python 3.13)
- Pydantic 2.13.4
- Pydantic-settings 2.1.0
- MistralAI 0.3.0
- Python-dotenv 1.0.0
- PyYAML 6.0.1
- aiosqlite 0.19.0
- y más...

### Frontend (Node.js)
- React 18.2.0
- TypeScript 5.3.3
- Vite 5.4.21
- react-router-dom 6.21.0
- axios 1.6.2
- react-force-graph 1.44.0
- react-force-graph-2d (instalado adicionalmente)
- TailwindCSS 3.4.0
- y más...

## Cómo Ejecutar

### Backend

1. Navegar al directorio del backend:
   ```bash
   cd /media/alvaro/service/project-stack/guiones/backend
   ```

2. Activar el entorno virtual:
   ```bash
   source venv/bin/activate
   ```

3. Iniciar el servidor:
   ```bash
   python -m backend.main
   ```
   o
   ```bash
   uvicorn backend.main:app --reload
   ```

   El backend estará disponible en: http://localhost:8000
   Documentación Swagger: http://localhost:8000/docs

### Frontend

1. Navegar al directorio del frontend:
   ```bash
   cd /media/alvaro/service/project-stack/guiones/frontend
   ```

2. Iniciar el servidor de desarrollo:
   ```bash
   npm run dev
   ```

   El frontend estará disponible en: http://localhost:3000

## Cambios Realizados para Compatibilidad

1. **Backend**:
   - Actualizado SQLAlchemy de 2.0.23 a 2.0.51 para compatibilidad con Python 3.13
   - Actualizado Pydantic de 2.5.3 a 2.13.4 para compatibilidad con Python 3.13
   - Corregido import de ENUM en models.py (cambiado de `sqlalchemy.dialects.sqlite` a `sqlalchemy`)
   - Actualizado validador en schemas.py de `@validator` a `@field_validator` (sintaxis Pydantic V2)
   - Instalado react-force-graph-2d para el frontend

2. **Frontend**:
   - Instalado paquete adicional `react-force-graph-2d` que era requerido pero no estaba en package.json

## Notas

- El backend usa FastAPI con SQLite como base de datos
- El frontend usa React con TypeScript y Vite
- Ambas partes están configuradas para trabajar juntas
- El backend tiene CORS configurado para permitir conexiones desde http://localhost:3000
