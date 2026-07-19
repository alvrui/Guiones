# 📜 Plan de Desarrollo - Aplicación Guiones

> **Versión:** 1.0  
> **Última actualización:** 2026-07-19  
> **Objetivo:** Facilitar y acelerar la creación de guiones coherentes con asistencia de IA.  
> **Alcance:** Aplicación local (offline) para uso individual.

---

## 🎯 **Visión General**

La aplicación **Guiones** permite a los usuarios crear, editar y organizar proyectos de guiones con una estructura detallada (proyecto, personajes, narrativas, tramas, estructura narrativa). La innovación clave es la **integración de agentes IA especializados** (usando Mistral API) para generar contenido contextual (trasfondos, diálogos, tramas, etc.) y garantizar coherencia narrativa.

---

## 📌 **Principios Clave**

1. **Pragmatismo:** Diseño orientado a resultados, priorizando funcionalidad sobre perfección.
2. **Coherencia:** Integridad referencial entre secciones (ej: personajes → tramas → escenas).
3. **Asistencia IA:** La IA **sugiere** contenido, pero el usuario **valida y edita** antes de aceptar.
4. **Local-first:** Todo funciona en el equipo del usuario (SQLite + Mistral API).
5. **Experiencia de usuario:** Interfaz intuitiva con pestañas y visualización gráfica de relaciones.

---

## 🏗️ **Arquitectura Técnica**

### **Backend**
- **Lenguaje:** Python 3.10+
- **Framework:** FastAPI (para API REST local)
- **Base de datos:** SQLite (relacional, local, con claves foráneas)
- **ORM:** SQLAlchemy (para modelos y consultas)
- **Validación:** Pydantic (esquemas de datos)
- **IA:** Mistral API (agentes especializados por sección)
- **Configuración:** Archivos YAML para prompts de IA

### **Frontend**
- **Framework:** React 18 + TypeScript
- **Build:** Vite (para desarrollo rápido)
- **Estilos:** Tailwind CSS (utilidades para diseño ágil)
- **Grafo:** `react-force-graph` (visualización interactiva de relaciones)
- **Formularios:** React Hook Form + Zod (validación)
- **HTTP:** Axios (llamadas a FastAPI)

### **Estructura de Archivos**
```
Guiones/
├── backend/                  # Servidor FastAPI
│   ├── main.py               # App principal y endpoints
│   ├── database.py           # Conexión a SQLite
│   ├── models.py             # Modelos SQLAlchemy
│   ├── schemas.py            # Esquemas Pydantic
│   ├── crud.py               # Operaciones CRUD
│   ├── agents/               # Agentes IA
│   │   ├── __init__.py
│   │   ├── character_agent.py
│   │   ├── plot_agent.py
│   │   ├── scene_agent.py
│   │   └── narrative_agent.py
│   ├── prompts/              # Prompts para IA
│   │   ├── character_prompts.yaml
│   │   ├── plot_prompts.yaml
│   │   ├── scene_prompts.yaml
│   │   └── narrative_prompts.yaml
│   └── config.py             # Configuración (API keys)
│
├── frontend/                 # Interfaz React
│   ├── public/               # Assets estáticos
│   ├── src/
│   │   ├── components/       # Componentes reutilizables
│   │   │   ├── ProjectForm.tsx
│   │   │   ├── CharacterForm.tsx
│   │   │   ├── PlotForm.tsx
│   │   │   ├── SceneForm.tsx
│   │   │   ├── NarrativeForm.tsx
│   │   │   ├── AIButton.tsx    # Botón 🤖 para IA
│   │   │   └── GraphView.tsx   # Visualización de grafo
│   │   ├── pages/            # Páginas (pestañas)
│   │   │   ├── ProjectPage.tsx
│   │   │   ├── CharactersPage.tsx
│   │   │   ├── NarrativesPage.tsx
│   │   │   ├── PlotsPage.tsx
│   │   │   └── StructurePage.tsx
│   │   ├── hooks/            # Custom hooks
│   │   │   ├── useProject.ts
│   │   │   ├── useCharacters.ts
│   │   │   └── useAI.ts
│   │   ├── types/            # Tipos TypeScript
│   │   │   └── index.ts
│   │   ├── services/         # Llamadas a API
│   │   │   ├── api.ts
│   │   │   └── db.ts
│   │   ├── utils/            # Funciones utilitarias
│   │   │   └── validation.ts
│   │   ├── App.tsx           # Router y layout
│   │   └── main.tsx          # Entry point
│   └── vite.config.ts        # Configuración Vite
│
├── docs/                     # Documentación
│   ├── PLAN_PROYECTO.md      # Este documento
│   └── API_REFERENCE.md      # Referencia de endpoints (futuro)
│
├── scripts/                  # Scripts de utilidad
│   └── setup_db.py           # Inicializar BD
│
├── .gitignore
├── README.md                 # Documentación principal
├── requirements.txt          # Dependencias Python
└── package.json             # Dependencias Node (frontend)
```

---

## 🗃️ **Modelo de Datos**

### **Base de Datos (SQLite)**
Se usan **5 tablas principales** con claves foráneas para integridad referencial. Los campos que son arrays u objetos se guardan como **JSON en TEXT** (SQLite no tiene tipo JSON nativo).

#### **Tablas**

1. **`proyectos`**
   - `id` (TEXT, PRIMARY KEY): UUID v4 generado en backend.
   - `titulo` (TEXT, NOT NULL): Nombre del proyecto.
   - `tipo_narracion` (TEXT, NOT NULL): Enum (Lineal, No lineal, In media res, etc.).
   - `estilo` (TEXT, NOT NULL): Enum (Realista, Surrealista, etc.).
   - `contexto_historico` (TEXT): Descripción opcional.
   - `contexto_social` (TEXT): Descripción opcional.
   - `contexto_geografico` (TEXT): Descripción opcional.
   - `contexto_cultural` (TEXT): Descripción opcional.
   - `entorno_sensorial` (TEXT): Descripción opcional.
   - `tono_general` (TEXT, NOT NULL): Enum (Oscuro, Ligero, etc.).
   - `temas_principales` (TEXT): JSON array (ej: `["Amor", "Traición"]`).
   - `sinopsis` (TEXT, NOT NULL): Resumen del proyecto.
   - `fecha_creacion` (TEXT): Formato `YYYY-MM-DD`.
   - `fecha_ultima_modificacion` (TEXT): Formato `YYYY-MM-DD`.

2. **`personajes`**
   - `id` (TEXT, PRIMARY KEY): UUID v4.
   - `proyecto_id` (TEXT, NOT NULL): Clave foránea a `proyectos.id`.
   - `nombre` (TEXT, NOT NULL): Nombre del personaje.
   - `apodo` (TEXT): Nombre en la historia.
   - `edad` (INTEGER): Edad al inicio.
   - `genero` (TEXT): Enum (Hombre, Mujer, No binario, Otro).
   - `trasfondo` (TEXT, NOT NULL): Historia personal.
   - `objetivos` (TEXT): JSON array (ej: `["Encontrar a su hermano"]`).
   - `motivaciones` (TEXT, NOT NULL): Razones profundas.
   - `conflictos_internos` (TEXT): Luchas psicológicas.
   - `conflictos_externos` (TEXT): Obstáculos físicos/sociales.
   - `relaciones` (TEXT): JSON array de objetos (ej: `[{"nombre": "María", "relacion": "Esposa", "id": "pers-002"}]`).
   - `arquetipo` (TEXT): Enum (Héroe, Mentor, Antagonista, etc.).
   - `personalidad` (TEXT): Rasgos de carácter.
   - `evolucion` (TEXT): Cambios a lo largo de la historia.
   - `habilidades` (TEXT): JSON array (ej: `["Lucha", "Persuasión"]`).
   - `debilidades` (TEXT): JSON array (ej: `["Miedo a la altura"]`).
   - `apariencia_fisica` (TEXT): Descripción física.
   - `notas_adicionales` (TEXT): Información extra.

3. **`narrativas`**
   - `id` (TEXT, PRIMARY KEY): UUID v4.
   - `proyecto_id` (TEXT, NOT NULL): Clave foránea a `proyectos.id`.
   - `titulo` (TEXT, NOT NULL): Nombre de la narrativa.
   - `tipo_estructura` (TEXT, NOT NULL): Enum (Lineal, Episódica, etc.).
   - `temas_asociados` (TEXT): JSON array.
   - `tono` (TEXT): Enum (Drama, Comedia, etc.).
   - `sinopsis` (TEXT, NOT NULL): Resumen de la narrativa.
   - `personajes_involucrados` (TEXT): JSON array de IDs (ej: `["pers-001", "pers-002"]`).
   - `conexiones_con_otras_narrativas` (TEXT): Descripción de relaciones.
   - `estado` (TEXT): Enum (Borrador, En Desarrollo, Completada).

4. **`tramas`**
   - `id` (TEXT, PRIMARY KEY): UUID v4.
   - `proyecto_id` (TEXT, NOT NULL): Clave foránea a `proyectos.id`.
   - `titulo` (TEXT, NOT NULL): Nombre de la trama.
   - `arquetipo_narrativo` (TEXT, NOT NULL): Enum (Viaje del Héroe, Tragedia, etc.).
   - `elementos_narrativos` (TEXT): JSON array de objetos (ej: `[{"tipo": "Conflicto", "descripcion": "Enfrentamiento con el antagonista"}]`).
   - `subtramas` (TEXT): JSON array de IDs (ej: `["trama-002"]`).
   - `personajes_involucrados` (TEXT): JSON array de IDs.
   - `obstaculos` (TEXT): JSON array (ej: `["Falta de pruebas"]`).
   - `estado` (TEXT): Enum (Idea, En Desarrollo, Completada).
   - `notas` (TEXT): Información adicional.

5. **`estructura_narrativa`**
   - `id` (TEXT, PRIMARY KEY): UUID v4.
   - `proyecto_id` (TEXT, NOT NULL): Clave foránea a `proyectos.id`.
   - `tipo` (TEXT, NOT NULL): Enum (Acto, Escena).
   - `titulo` (TEXT, NOT NULL): Nombre del acto/escena.
   - `numero_acto` (INTEGER): Número del acto (NULL si es Escena).
   - `numero_escena` (INTEGER): Número de escena (NULL si es Acto).
   - `elementos_narrativos` (TEXT): JSON array de IDs de tramas (ej: `["trama-001"]`).
   - `personajes_involucrados` (TEXT): JSON array de IDs de personajes.
   - `ubicacion` (TEXT): Lugar de la escena.
   - `texto_escena` (TEXT): Diálogos y descripciones (solo para Escenas).
   - `duracion_estimada` (TEXT): Ej: "5 minutos".
   - `notas_direccion` (TEXT): Anotaciones para dirección.
   - `estado` (TEXT): Enum (Borrador, Revisión, Finalizada).

---

### **Borrado en Cascada con Marcadores**
Cuando se borra un elemento (ej: un personaje), se:
1. **Elimina el registro** de la tabla correspondiente.
2. **Actualiza las referencias** en otras tablas, reemplazando el ID borrado por un marcador:
   - Ejemplo: `[PERSONAJE BORRADO: pers-001]` en el campo `personajes_involucrados` de una trama.
3. **Notifica al usuario** que debe revisar las secciones afectadas.

---

## 🤖 **Agentes IA**

### **Diseño**
- **Arquitectura:** 1 agente especializado por sección (personajes, tramas, escenas, etc.).
- **Ubicación:** `backend/agents/` (cada agente es una clase Python).
- **Prompts:** Definidos en archivos YAML en `backend/prompts/` (fáciles de mantener).
- **Ejecución:** Llamadas a **Mistral API** (modelo `mistral-tiny` o `mistral-small`).

### **Agentes Propuestos**

| **Agente**               | **Sección**       | **Campos que Genera**                          | **Prompt Base**                          |
|--------------------------|-------------------|-----------------------------------------------|------------------------------------------|
| `CharacterAgent`         | Personajes       | `trasfondo`, `personalidad`, `objetivos`      | Basado en nombre, edad, arquetipo, contexto |
| `PlotAgent`              | Tramas           | `elementos_narrativos`, `obstaculos`, `sinopsis` | Basado en arquetipo narrativo y personajes |
| `SceneAgent`             | Estructura       | `texto_escena`, `notas_direccion`              | Basado en personajes, ubicación, tono      |
| `NarrativeAgent`         | Narrativas       | `sinopsis`, `temas_asociados`                 | Basado en proyecto y personajes            |

### **Flujo de Generación**
1. El usuario hace clic en el botón **🤖** junto a un campo.
2. El frontend envía el **contexto actual** (ej: datos del personaje) al backend.
3. El backend:
   - Construye el **prompt** usando el contexto + el prompt base del YAML.
   - Llama a **Mistral API** con el prompt.
   - Valida la respuesta (no vacía, no inapropiada, formato correcto).
   - Devuelve el contenido generado.
4. El frontend muestra el contenido en un **área editable** (el usuario puede modificarlo).
5. El usuario hace clic en **✅ Aceptar** para insertar el contenido en el campo.

### **Ejemplo de Prompt (CharacterAgent - trasfondo)**
```yaml
# backend/prompts/character_prompts.yaml
trasfondo: |
  Eres un experto en desarrollo de personajes para guiones de {estilo} con tono {tono_general}.
  Genera un trasfondo detallado y coherente para el siguiente personaje:
  - Nombre: {nombre}
  - Edad: {edad}
  - Arquetipo: {arquetipo}
  - Contexto histórico: {contexto_historico}
  - Objetivos: {objetivos}
  - Motivaciones: {motivaciones}

  El trasfondo debe:
  1. Explicar su origen y experiencias clave.
  2. Justificar sus motivaciones y objetivos.
  3. Ser coherente con el contexto histórico y el arquetipo.
  4. Tener entre 100 y 200 palabras.
  5. Estar escrito en tercera persona.

  Ejemplo de formato:
  "Juan Pérez creció en un pueblo pesquero de Andalucía durante la Guerra Civil Española..."
```

---

## 🖥️ **Interfaz de Usuario (UI)**

### **Layout Principal**
- **Barra lateral izquierda:**
  - Lista de proyectos (para cambiar entre ellos).
  - Botón **Nuevo Proyecto**.
- **Área principal (centro):**
  - **Pestañas** para cada sección:
    - Proyecto
    - Personajes
    - Narrativas
    - Tramas
    - Estructura Narrativa
    - Grafo (visualización)
  - Contenido dinámico según la pestaña activa.
- **Barra superior:**
  - Botón **Guardar** (para guardar el proyecto actual).
  - Botón **Exportar** (descargar JSON).
  - Botón **Importar** (cargar JSON).
  - Botón **Ver Grafo** (abre pestaña de grafo).

### **Componentes Clave**

#### **1. Formularios**
- Cada sección tiene un **formulario** con sus campos específicos.
- Campos obligatorios marcados con `*` (validación en frontend y backend).
- **Botón 🤖** junto a campos generables con IA (ej: `trasfondo`, `texto_escena`).

#### **2. Botón de IA (`AIButton.tsx`)**
- **Icono:** 🤖 (emoji o SVG).
- **Comportamiento:**
  1. Al hacer clic, envía el contexto actual al backend.
  2. Muestra un **loading spinner** mientras se genera.
  3. Muestra el contenido generado en un **área editable** (textarea).
  4. Botones **✅ Aceptar** (inserta en el campo) y **❌ Rechazar** (cierra el área).

#### **3. Visualización de Grafo (`GraphView.tsx`)**
- **Librería:** `react-force-graph` (2D).
- **Nodos:**
  - **Proyecto:** Color rojo (#FF6B6B).
  - **Personajes:** Color turquesa (#4ECDC4).
  - **Narrativas:** Color azul (#45B7D1).
  - **Tramas:** Color verde (#96CEB4).
  - **Escenas:** Color amarillo (#FFEAA7).
- **Enlaces:**
  - `pertenece_a`: Línea gris (ej: personaje → proyecto).
  - `involucra_a`: Línea turquesa (ej: trama → personaje).
  - `referencia_a`: Línea roja (ej: escena → trama).
- **Interactividad:**
  - Arrastrable (drag & drop).
  - Zoom con scroll.
  - Tooltips al pasar el ratón por nodos/enlaces.

#### **4. Lista de Elementos**
- En cada pestaña (excepto Proyecto), se muestra una **lista de tarjetas** con los elementos existentes.
- Cada tarjeta tiene:
  - **Título** (ej: nombre del personaje).
  - **Acciones:** Editar (✏️), Borrar (🗑️).
  - **Resumen:** Campos clave (ej: para personajes: edad, arquetipo).

---

## 🔄 **Flujo de Trabajo**

### **1. Crear un Proyecto**
1. Usuario hace clic en **Nuevo Proyecto** en la barra lateral.
2. Se abre el formulario de **Proyecto** con campos obligatorios:
   - Título
   - Tipo de narración
   - Estilo
   - Tono general
   - Sinopsis
3. Usuario completa los campos (puede usar 🤖 para generar `sinopsis` o `contexto_historico`).
4. Hace clic en **Guardar**.

### **2. Añadir un Personaje**
1. Usuario va a la pestaña **Personajes**.
2. Hace clic en **Nuevo Personaje**.
3. Completa los campos obligatorios:
   - Nombre
   - Trasfondo
   - Objetivos (array)
   - Motivaciones
4. Para campos como `trasfondo` o `personalidad`, puede usar 🤖 para generar contenido.
5. Hace clic en **Guardar**.

### **3. Generar Contenido con IA**
1. Usuario está editando un personaje y ve el campo `trasfondo` vacío.
2. Hace clic en el botón **🤖** junto al campo.
3. El sistema envía el contexto (nombre, edad, arquetipo, etc.) al backend.
4. El backend genera un trasfondo usando `CharacterAgent` y Mistral API.
5. El frontend muestra el trasfondo generado en un área editable.
6. Usuario edita el texto si es necesario y hace clic en **✅ Aceptar**.
7. El contenido se inserta en el campo `trasfondo`.

### **4. Visualizar Relaciones**
1. Usuario va a la pestaña **Grafo**.
2. El sistema renderiza un grafo interactivo con:
   - Nodo del proyecto.
   - Nodos de personajes, narrativas, tramas y escenas.
   - Enlaces que muestran las relaciones entre ellos.
3. Usuario puede arrastrar nodos y hacer zoom para explorar.

### **5. Borrar un Personaje**
1. Usuario hace clic en **🗑️** en la tarjeta de un personaje.
2. El sistema muestra un diálogo de confirmación:
   - "¿Estás seguro de borrar a Juan Pérez? Esto afectará a 3 tramas y 2 escenas."
3. Usuario confirma.
4. El sistema:
   - Borra el personaje de la base de datos.
   - Actualiza las tramas y escenas afectadas, reemplazando `pers-001` por `[PERSONAJE BORRADO: pers-001]`.
   - Muestra una notificación: "Personaje borrado. Revisa las tramas y escenas afectadas."

---

## 📦 **Exportación/Importación**

### **Formato JSON**
- **Estructura:**
  ```json
  {
      "version": "1.0",
      "proyecto": { ... },
      "personajes": [ ... ],
      "narrativas": [ ... ],
      "tramas": [ ... ],
      "estructura_narrativa": [ ... ]
  }
  ```
- **Campos:** Todos los datos de las tablas, con IDs consistentes.

### **Funcionalidades**
- **Exportar:**
  - Botón en la barra superior.
  - Descarga un archivo `.json` con el proyecto actual.
- **Importar:**
  - Botón en la barra superior.
  - Abre un diálogo para seleccionar un archivo `.json`.
  - Crea un nuevo proyecto con los datos importados.

---

## 🛠️ **Tecnologías y Dependencias**

### **Backend (Python)**
| **Paquete**         | **Versión** | **Uso**                          |
|---------------------|-------------|----------------------------------|
| fastapi             | ^0.109.0    | Framework web                    |
| uvicorn             | ^0.27.0     | Servidor ASGI                   |
| sqlalchemy         | ^2.0.23     | ORM                              |
| pydantic            | ^2.5.3      | Validación de datos              |
| mistralai           | ^0.3.0      | Cliente de Mistral API          |
| pyyaml              | ^6.0.1      | Carga de prompts YAML            |
| python-dotenv       | ^1.0.0      | Variables de entorno             |

### **Frontend (Node.js)**
| **Paquete**         | **Versión** | **Uso**                          |
|---------------------|-------------|----------------------------------|
| react               | ^18.2.0     | Framework UI                     |
| react-dom           | ^18.2.0     | DOM de React                     |
| typescript          | ^5.3.3      | Tipado estático                  |
| vite                | ^5.0.10     | Build tool                       |
| @types/react        | ^18.2.45    | Tipos para React                 |
| @types/react-dom    | ^18.2.18    | Tipos para React DOM             |
| axios               | ^1.6.2      | Llamadas HTTP                    |
| react-force-graph   | ^1.44.0     | Visualización de grafo           |
| react-hook-form     | ^7.49.2     | Manejo de formularios           |
| zod                 | ^3.22.4     | Validación de formularios        |
| tailwindcss         | ^3.4.0      | Estilos                         |
| postcss             | ^8.4.32     | Procesador CSS                   |
| autoprefixer        | ^10.4.16    | Prefijos CSS                     |

---

## 📅 **Roadmap de Desarrollo**

### **Fase 1: MVP Básico (2-3 semanas)**
**Objetivo:** Prototipo funcional con Proyecto + Personajes + IA para trasfondo.

| **Tarea**                          | **Prioridad** | **Estado** | **Notas**                          |
|------------------------------------|---------------|------------|------------------------------------|
| Crear estructura de carpetas       | Alta          | ✅         | Hecho                              |
| Configurar backend (FastAPI)        | Alta          | ⬜         | Endpoints básicos para proyectos   |
| Configurar SQLite + modelos         | Alta          | ⬜         | Tablas: proyectos, personajes       |
| Implementar CRUD para proyectos     | Alta          | ⬜         | CREATE, READ, UPDATE, DELETE        |
| Implementar CRUD para personajes    | Alta          | ⬜         | Incluir borrado con marcadores     |
| Crear esquemas Pydantic             | Alta          | ⬜         | Validación de datos                |
| Configurar Mistral API              | Alta          | ⬜         | Agente CharacterAgent              |
| Crear prompts YAML para personajes  | Alta          | ⬜         | trasfondo, personalidad             |
| Configurar frontend (Vite + React)  | Alta          | ⬜         | Estructura base                    |
| Implementar tipos TypeScript        | Alta          | ⬜         | Interfaces para datos              |
| Crear servicio API (Axios)          | Alta          | ⬜         | Llamadas a FastAPI                  |
| Implementar formulario de proyecto  | Alta          | ⬜         | Campos obligatorios                |
| Implementar formulario de personaje | Alta          | ⬜         | Con botón 🤖 para trasfondo        |
| Implementar AIButton                | Alta          | ⬜         | Generación + validación            |
| Probar flujo completo               | Alta          | ⬜         | Proyecto → Personaje → IA            |

### **Fase 2: Secciones Restantes (2 semanas)**
**Objetivo:** Añadir Narrativas, Tramas y Estructura Narrativa.

| **Tarea**                          | **Prioridad** | **Estado** | **Notas**                          |
|------------------------------------|---------------|------------|------------------------------------|
| Añadir tabla `narrativas`          | Alta          | ⬜         | CRUD + referencias a personajes     |
| Añadir tabla `tramas`              | Alta          | ⬜         | CRUD + referencias a personajes     |
| Añadir tabla `estructura_narrativa`| Alta          | ⬜         | CRUD + referencias a tramas/personajes |
| Implementar PlotAgent              | Alta          | ⬜         | Generación de elementos narrativos |
| Implementar SceneAgent             | Alta          | ⬜         | Generación de texto de escena      |
| Implementar NarrativeAgent         | Media         | ⬜         | Generación de sinopsis             |
| Crear formularios para nuevas secciones | Alta    | ⬜         | Narrativas, Tramas, Estructura      |
| Probar integridad referencial       | Alta          | ⬜         | Borrado en cascada                 |

### **Fase 3: Visualización y Exportación (1 semana)**
**Objetivo:** Grafo interactivo y exportación/importación.

| **Tarea**                          | **Prioridad** | **Estado** | **Notas**                          |
|------------------------------------|---------------|------------|------------------------------------|
| Implementar GraphView              | Alta          | ⬜         | Usar react-force-graph             |
| Añadir pestaña de grafo             | Alta          | ⬜         | En el layout principal              |
| Implementar exportación a JSON     | Alta          | ⬜         | Botón en barra superior             |
| Implementar importación desde JSON  | Alta          | ⬜         | Botón en barra superior             |
| Probar grafo con datos reales      | Media         | ⬜         | Visualización de relaciones         |

### **Fase 4: Pulido y Documentación (1 semana)**
**Objetivo:** Mejorar UX, validación y documentación.

| **Tarea**                          | **Prioridad** | **Estado** | **Notas**                          |
|------------------------------------|---------------|------------|------------------------------------|
| Añadir validación en frontend       | Media         | ⬜         | Zod + React Hook Form              |
| Mejorar manejo de errores de IA     | Media         | ⬜         | Fallbacks y mensajes claros        |
| Añadir loading states               | Baja          | ⬜         | Spinners en botones 🤖              |
| Añadir notificaciones (toasts)      | Baja          | ⬜         | Para acciones exitosas/fallidas     |
| Documentar API (OpenAPI/Swagger)    | Media         | ⬜         | Autogenerado por FastAPI           |
| Actualizar README.md                | Media         | ⬜         | Instrucciones de uso               |
| Probar en diferentes navegadores    | Baja          | ⬜         | Chrome, Firefox, Edge               |

---

## 🎯 **Prioridades Actuales**
1. **Backend:** Implementar FastAPI + SQLite + CRUD para proyectos y personajes.
2. **Agentes IA:** Crear `CharacterAgent` y prompts para `trasfondo` y `personalidad`.
3. **Frontend:** Implementar formularios básicos con botón 🤖.
4. **Integración:** Conectar frontend y backend, probar flujo de IA.

---

## 📝 **Notas Adicionales**

### **Decisiones Clave**
- **Base de datos:** SQLite (local, relacional) con UUIDs generados en backend.
- **IA:** Mistral API (agentes especializados) + prompts en YAML.
- **UI:** Pestañas + grafo interactivo + botón 🤖 para IA.
- **Borrado:** Cascada con marcadores `[ELEMENTO BORRADO: {id}]`.
- **Validación:** Frontend (Zod) + Backend (Pydantic).

### **Supuestos**
- La aplicación se usará **solo en local** (no multiusuario).
- Mistral API estará disponible (requiere API key).
- El volumen de datos por proyecto será **moderado** (cientos de registros).

### **Riesgos y Mitigaciones**
| **Riesgo**                          | **Impacto** | **Mitigación**                          |
|-------------------------------------|-------------|-----------------------------------------|
| Mistral API falla                   | Alto        | Fallbacks (contenido predefinido)        |
| SQLite no escala para proyectos grandes | Bajo    | Optimizar consultas, usar índices         |
| Prompts de IA generan contenido pobre | Medio     | Revisar prompts, ajustar temperatura      |
| Errores de integridad referencial    | Alto        | Pruebas exhaustivas de borrado           |

---

## 🔗 **Recursos Útiles**
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [SQLAlchemy Documentation](https://www.sqlalchemy.org/)
- [Mistral API Documentation](https://docs.mistral.ai/)
- [React Documentation](https://react.dev/)
- [React Force Graph](https://github.com/vasturiano/react-force-graph)
- [Tailwind CSS](https://tailwindcss.com/)
- [Zod Validation](https://zod.dev/)

---

## 📞 **Contacto y Colaboración**
- **Repositorio:** [alvrui/Guiones](https://github.com/alvrui/Guiones)
- **Branch de desarrollo:** `vibe/estructura-proyecto-14830a`
- **Documentación principal:** [README.md](../README.md)

---

> **¡Importante!** Este documento debe actualizarse cada vez que se tomen decisiones significativas o se desvíe el plan. **El pragmatismo es la prioridad**: si algo no funciona, se ajusta.
