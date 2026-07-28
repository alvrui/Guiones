# Plan de Ejecución - Aplicación Guiones
**Documento Rector para Agente IA Orquestador**
*Versión: 1.0*
*Fecha: 28-07-2026*

---

## **1. Objetivo General**
Desarrollar la aplicación **Guiones** según el diseño definido en `Design_notes.md`, utilizando un modelo de **dos agentes IA especializados**:
- **Agente Orquestador**: Encargado de **analizar el diseño**, **descomponer tareas**, **generar requerimientos estructurados** y **validar respuestas** del Agente Implementador.
- **Agente Implementador**: Encargado **exclusivamente de producir código** basado en los requerimientos recibidos del Orquestador.

**Principios del Manifiesto Sistémico aplicables**:
- El **Agente Orquestador** actúa como **Nivel 4 (Motor)**: Interpreta el diseño y genera tareas sin conocer casos de uso concretos.
- El **Agente Implementador** actúa como **Nivel 6 (Aplicación)**: Produce código como instancia de las especificaciones del Orquestador.
- **Invariantes**: Todo código generado debe respetar la arquitectura, tipos de datos y relaciones definidas en `Design_notes.md`.
- **Modificación mínima**: Cada tarea debe ser atómica y validable de forma independiente.

---

## **2. Arquitectura de Agentes**

### **2.1. Agente Orquestador**
**Responsabilidades**:
1. **Análisis del Diseño**:
   - Leer y parsear `Design_notes.md` para extraer:
     - Secciones (Proyecto, Personajes, Narrativas, Tramas, Estructura Narrativa, Agentes IA).
     - Campos, tipologías, relaciones cruzadas y reglas de validación.
     - Requisitos técnicos (Mistral Client API, almacenamiento de adjuntos, etc.).

2. **Descomposición en Tareas**:
   - Dividir el desarrollo en **tareas atómicas** (ej: "Implementar el esquema JSON de Personajes").
   - Cada tarea debe incluir:
     - **ID único** (UUID).
     - **Descripción clara** (qué se debe implementar).
     - **Sección asociada** (de `Design_notes.md`).
     - **Campos de contexto** (datos de entrada necesarios).
     - **Requisitos de validación** (cómo verificar que la implementación es correcta).
     - **Dependencias** (tareas previas que deben completarse antes).

3. **Generación de Requerimientos para el Implementador**:
   - Para cada tarea, generar un **requerimiento estructurado** en formato JSON (ver Sección 4).
   - Incluir:
     - **Contexto técnico** (ej: "Usar Rust para el backend").
     - **Ejemplos de entrada/salida** (basados en `Design_notes.md`).
     - **Restricciones** (ej: "No modificar el esquema de Proyecto").

4. **Validación de Respuestas**:
   - Recibir el código generado por el Implementador.
   - Verificar que:
     - Cumple con el esquema definido en `Design_notes.md`.
     - No viola invariantes (ej: referencias cruzadas válidas).
     - Es mínimamente modificable (sin código redundante o acoplado).
   - Devolver **feedback** al Implementador si hay errores (ej: "El campo `objetivos` en Personajes debe ser un Array de Strings").

5. **Gestión de Estado**:
   - Llevar un registro de:
     - Tareas **pendientes**, **en progreso**, **completadas**, **fallidas**.
     - **Historial de conversaciones** con el Implementador (para auditoría).
     - **Versiones de código** generadas (commit SHA si se integra con Git).

---

### **2.2. Agente Implementador**
**Responsabilidades**:
1. **Recibir Requerimientos**:
   - Interpretar los requerimientos estructurados del Orquestador.
   - No generar código fuera del ámbito del requerimiento.

2. **Producción de Código**:
   - Generar código en el lenguaje especificado (ej: Rust, TypeScript).
   - Seguir las **convenciones de estilo** definidas en el proyecto (ej: naming, indentación).
   - Incluir **comentarios** solo si el Orquestador lo solicita explícitamente.

3. **Validación Interna**:
   - Verificar que el código generado:
     - Compila (si aplica).
     - No contiene errores sintácticos.
     - Cumple con los tipos de datos y estructuras definidas.

4. **Respuesta al Orquestador**:
   - Devolver el código generado en formato:
     ```json
     {
       "tarea_id": "UUID",
       "codigo": "...",
       "lenguaje": "rust/typescript/etc",
       "archivo": "ruta/relativa/archivo.ext",
       "validacion_interna": {
         "compila": true/false,
         "errores": ["lista de errores"]
       }
     }
     ```

---

## **3. Fases del Proyecto**
El Orquestador debe descomponer el proyecto en las siguientes **fases**, cada una con tareas específicas:

### **Fase 1: Infraestructura Base**
**Objetivo**: Preparar el entorno para el desarrollo.

| **Tarea** | **Descripción** | **Dependencias** | **Salida Esperada** |
|-----------|----------------|------------------|---------------------|
| `inf-001` | Crear estructura de directorios (`/src`, `/recursos`, `/tests`). | Ninguna | Directorios creados. |
| `inf-002` | Configurar entorno de desarrollo (ej: `Cargo.toml` para Rust, `package.json` para Node). | `inf-001` | Archivos de configuración. |
| `inf-003` | Implementar sistema de logging para depuración. | `inf-002` | Módulo de logging funcional. |
| `inf-004` | Configurar variables de entorno para Mistral Client API. | `inf-002` | Archivo `.env` con claves seguras. |

---

### **Fase 2: Modelos de Datos (Nivel 0 - Ontología)**
**Objetivo**: Implementar las entidades fundamentales según el **Nivel 0** del Manifiesto Sistémico.

| **Tarea** | **Descripción** | **Dependencias** | **Salida Esperada** |
|-----------|----------------|------------------|---------------------|
| `mod-001` | Definir estructura `Proyecto` en JSON Schema. | `inf-002` | Esquema validable en `/src/schemas/proyecto.json`. |
| `mod-002` | Definir estructura `Personaje` en JSON Schema. | `mod-001` | Esquema en `/src/schemas/personaje.json`. |
| `mod-003` | Definir estructura `Narrativa` en JSON Schema. | `mod-002` | Esquema en `/src/schemas/narrativa.json`. |
| `mod-004` | Definir estructura `Trama` en JSON Schema. | `mod-003` | Esquema en `/src/schemas/trama.json`. |
| `mod-005` | Definir estructura `EstructuraNarrativa` en JSON Schema. | `mod-004` | Esquema en `/src/schemas/estructura_narrativa.json`. |
| `mod-006` | Definir estructura `AgenteIA` en JSON Schema. | `mod-005` | Esquema en `/src/schemas/agente_ia.json`. |
| `mod-007` | Validar que todos los esquemas cumplan con las relaciones cruzadas de `Design_notes.md`. | `mod-006` | Informe de validación. |

---

### **Fase 3: Lógica de Negocio (Nivel 3 - Mecánicas)**
**Objetivo**: Implementar las transformaciones válidas entre estados (ej: validaciones, generación de UUIDs).

| **Tarea** | **Descripción** | **Dependencias** | **Salida Esperada** |
|-----------|----------------|------------------|---------------------|
| `log-001` | Implementar función para generar UUIDs automáticos. | `mod-007` | Módulo `uuid_generator.rs`. |
| `log-002` | Implementar validación de campos obligatorios en todas las secciones. | `log-001` | Módulo `validators.rs`. |
| `log-003` | Implementar validación de referencias cruzadas (ej: IDs de Personajes en Narrativas). | `log-002` | Funciones en `validators.rs`. |
| `log-004` | Implementar lógica para manejar adjuntos en `Proyecto`. | `log-003` | Módulo `adjuntos.rs` (guardar/leer archivos). |
| `log-005` | Implementar estado de entidades (Borrador, En Desarrollo, Completada). | `log-004` | Enum `Estado` y funciones de transición. |

---

### **Fase 4: Motor de la Aplicación (Nivel 4 - Motor)**
**Objetivo**: Implementar el núcleo que interpreta configuraciones y aplica mecánicas.

| **Tarea** | **Descripción** | **Dependencias** | **Salida Esperada** |
|-----------|----------------|------------------|---------------------|
| `mot-001` | Crear interfaz para cargar/guardar datos en JSON. | `log-005` | Módulo `storage.rs`. |
| `mot-002` | Implementar función para interpretar esquemas y validar datos. | `mot-001` | Módulo `interpreter.rs`. |
| `mot-003` | Implementar función para aplicar mecánicas (ej: cambiar estado de una Narrativa). | `mot-002` | Módulo `mecanicas.rs`. |
| `mot-004` | Integrar Mistral Client API para comunicación con Agentes IA. | `mot-003`, `inf-004` | Módulo `mistral_client.rs`. |
| `mot-005` | Implementar área de intercambio con Agentes IA (UI/CLI). | `mot-004` | Componente `intercambio_agente.rs`. |

---

### **Fase 5: Representaciones (Nivel 5 - Representaciones)**
**Objetivo**: Implementar interfaces para interactuar con la aplicación.

| **Tarea** | **Descripción** | **Dependencias** | **Salida Esperada** |
|-----------|----------------|------------------|---------------------|
| `rep-001` | Crear CLI para gestionar secciones (CRUD). | `mot-005` | Binario `guiones-cli`. |
| `rep-002` | Implementar API REST para acceso remoto. | `mot-005` | Servidor en `/src/api/mod.rs`. |
| `rep-003` | Generar UI básica en Tauri/React para edición visual. | `rep-001` | Carpeta `/ui` con componentes. |
| `rep-004` | Integrar área de intercambio con Agentes IA en la UI. | `rep-003` | Componente `AgenteIAView.tsx`. |

---

### **Fase 6: Aplicación (Nivel 6 - Instancia)**
**Objetivo**: Probar y empaquetar la aplicación completa.

| **Tarea** | **Descripción** | **Dependencias** | **Salida Esperada** |
|-----------|----------------|------------------|---------------------|
| `app-001` | Crear instancias de prueba para cada sección (JSONs de ejemplo). | `mot-005` | Archivos en `/tests/mocks/`. |
| `app-002` | Ejecutar pruebas unitarias para validaciones y mecánicas. | `app-001` | Informe de pruebas en `/tests/reports/`. |
| `app-003` | Validar integración con Mistral Client API (mock o real). | `app-002` | Script de prueba `test_mistral.rs`. |
| `app-004` | Generar documentación técnica (ej: con `rustdoc`). | `app-003` | Documentación en `/docs/`. |
| `app-005` | Empaquetar aplicación para distribución (ej: binario, Docker). | `app-004` | Artefactos en `/dist/`. |

---

## **4. Estructura de Requerimientos para el Implementador**
El Orquestador debe generar requerimientos en el siguiente formato JSON para el Implementador:

```json
{
  "tarea_id": "UUID_v4",
  "fase": "Fase_X",
  "seccion": "Proyecto|Personajes|Narrativas|Tramas|EstructuraNarrativa|AgentesIA",
  "descripcion": "Descripción clara y concisa de la tarea (ej: 'Implementar validación de campos obligatorios en Personajes').",
  "contexto": {
    "esquema": "Referencia al esquema JSON relevante (ej: '/src/schemas/personaje.json').",
    "campos": ["Lista de campos involucrados (ej: ['nombre', 'objetivos'])."],
    "relaciones": ["Lista de relaciones cruzadas (ej: {'seccion': 'Narrativas', 'campo': 'personajes_involucrados'})."],
    "adjuntos": ["Lista de recursos necesarios (ej: ['/recursos/adjuntos/contexto_historico.pdf'])."]
  },
  "requisitos": {
    "lenguaje": "rust/typescript/etc",
    "archivo": "Ruta relativa donde guardar el código (ej: '/src/validators.rs').",
    "funcion_principal": "Nombre de la función/clase principal (ej: 'validar_personaje').",
    "dependencias": ["Lista de módulos o librerías requeridas (ej: ['serde', 'uuid'])."]
  },
  "validacion": {
    "criterios": [
      "El código debe compilar sin errores.",
      "Debe validar que el campo 'objetivos' en Personajes sea un Array de Strings.",
      "Debe manejar errores de referencias cruzadas inválidas."
    ],
    "pruebas": [
      {
        "entrada": {"nombre": "Juan", "objetivos": ["Encontrar a su hermano"]},
        "salida_esperada": {"valido": true}
      },
      {
        "entrada": {"nombre": "", "objetivos": []},
        "salida_esperada": {"valido": false, "error": "El campo 'nombre' es obligatorio."}
      }
    ]
  },
  "prioridad": "alta/media/baja",
  "notas": "Observaciones adicionales (ej: 'Usar el crate uuid para generar IDs')."
}
```

---

## **5. Ejemplo de Flujo de Trabajo entre Agentes**

### **Paso 1: Orquestador analiza el diseño**
- Lee `Design_notes.md` y extrae la sección **Personajes**.
- Identifica que se necesita:
  - Esquema JSON para `Personaje`.
  - Validación de campos obligatorios (`nombre`, `objetivos`, `motivaciones`).
  - Generación automática de UUIDs.

### **Paso 2: Orquestador genera tareas**
- Crea la tarea `mod-002`:
  ```json
  {
    "tarea_id": "mod-002",
    "fase": "Fase_2",
    "seccion": "Personajes",
    "descripcion": "Implementar esquema JSON Schema para Personajes según Design_notes.md.",
    "contexto": {
      "esquema": null,
      "campos": ["id", "nombre", "apodo", "edad", "genero", "trasfondo", "objetivos", "motivaciones", "conflictos_internos", "conflictos_externos", "relaciones", "arquetipo", "personalidad", "evolucion", "habilidades", "debilidades", "apariencia_fisica", "notas_adicionales"],
      "relaciones": [{"seccion": "Narrativas", "campo": "personajes_involucrados"}],
      "adjuntos": []
    },
    "requisitos": {
      "lenguaje": "json",
      "archivo": "/src/schemas/personaje.json",
      "funcion_principal": null,
      "dependencias": []
    },
    "validacion": {
      "criterios": [
        "El esquema debe incluir todos los campos de la tabla Personajes en Design_notes.md.",
        "Los campos obligatorios deben estar marcados como 'required'.",
        "Los tipos de datos deben coincidir (ej: 'objetivos' como Array de Strings)."
      ],
      "pruebas": []
    },
    "prioridad": "alta",
    "notas": "Usar formato JSON Schema Draft 7."
  }
  ```

### **Paso 3: Orquestador envía tarea al Implementador**
- El Implementador recibe `mod-002` y genera el esquema `/src/schemas/personaje.json`:
  ```json
  {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "type": "object",
    "properties": {
      "id": {"type": "string", "format": "uuid"},
      "nombre": {"type": "string"},
      "objetivos": {"type": "array", "items": {"type": "string"}},
      "motivaciones": {"type": "string"},
      "...": "..."
    },
    "required": ["id", "nombre", "objetivos", "motivaciones"],
    "additionalProperties": false
  }
  ```

### **Paso 4: Orquestador valida la respuesta**
- Verifica que:
  - El esquema incluye todos los campos de **Personajes**.
  - Los campos obligatorios están marcados como `required`.
  - Los tipos de datos son correctos (ej: `objetivos` es `array` de `string`).
- Si es válido, marca `mod-002` como **completada** y pasa a la siguiente tarea.
- Si hay errores, devuelve feedback al Implementador:
  ```json
  {
    "tarea_id": "mod-002",
    "valido": false,
    "errores": [
      "El campo 'apodo' debe ser opcional (no está en 'required').",
      "El campo 'relaciones' debe ser un array de objetos con propiedades 'nombre' y 'relacion'."
    ]
  }
  ```

### **Paso 5: Implementador corrige y reenvía**
- El Implementador ajusta el esquema según el feedback y lo reenvía.
- El Orquestador valida nuevamente.

---

## **6. Reglas para el Agente Orquestador**

### **6.1. Descomposición de Tareas**
- **Atomicidad**: Cada tarea debe ser **independiente** y **validable por sí sola**.
- **Dependencias**: Explicitar claramente qué tareas deben completarse antes (ej: `mod-002` depende de `inf-002`).
- **Granularidad**: Evitar tareas demasiado grandes (ej: "Implementar toda la UI"). Mejor: "Implementar componente de lista de Personajes".

### **6.2. Generación de Contexto**
- Incluir **siempre** en el contexto:
  - Esquemas relevantes.
  - Campos involucrados.
  - Relaciones cruzadas.
  - Ejemplos de `Design_notes.md`.
- Si la tarea involucra **Agentes IA**, incluir:
  - `agente_id_mistral` del agente relevante.
  - `campos_contexto` definidos en `Agentes_IA`.

### **6.3. Validación de Respuestas**
- **Criterios obligatorios**:
  - El código **debe compilar** (si aplica).
  - El código **debe seguir el esquema** definido en `Design_notes.md`.
  - El código **no debe romper invariantes** (ej: referencias cruzadas válidas).
- **Pruebas**: Incluir al menos **2 casos de prueba** por tarea (entrada/salida esperada).

### **6.4. Gestión de Errores**
- Si el Implementador devuelve código inválido:
  1. **Identificar el error específico** (ej: "El campo `estado` en Narrativas debe ser un Enum").
  2. **Proporcionar ejemplo de corrección** (ej: `"estado": {"type": "string", "enum": ["Borrador", "En Desarrollo", "Completada"]}`).
  3. **No aceptar código** hasta que cumpla con los criterios.

### **6.5. Priorización**
- **Alta**: Tareas críticas para la funcionalidad base (ej: esquemas, validaciones).
- **Media**: Tareas de lógica de negocio (ej: mecánicas de estado).
- **Baja**: Tareas de UI o mejoras estéticas.

---

## **7. Reglas para el Agente Implementador**

### **7.1. Interpretación de Requerimientos**
- **No asumir**: Si el requerimiento no está claro, **solicitar aclaración** al Orquestador.
- **Seguir al pie de la letra**: Implementar **exactamente** lo especificado en el requerimiento.

### **7.2. Producción de Código**
- **Lenguaje**: Usar el lenguaje especificado en el requerimiento.
- **Estilo**: Seguir convenciones del proyecto (ej: `snake_case` para Rust, `camelCase` para TypeScript).
- **Comentarios**: Solo si el Orquestador lo solicita.
- **Módulos**: Organizar el código en archivos y directorios según `requisitos.archivo`.

### **7.3. Validación Interna**
- **Compilación**: Asegurar que el código compila (si aplica).
- **Tipos de datos**: Verificar que los tipos coincidan con el esquema.
- **Pruebas básicas**: Ejecutar las pruebas de ejemplo del requerimiento.

### **7.4. Respuesta al Orquestador**
- **Formato estricto**: Devolver el código en el formato JSON especificado en la Sección 4.
- **Errores**: Reportar **todos** los errores de validación interna.

---

## **8. Comunicación entre Agentes**

### **8.1. Protocolo de Mensajes**
- **Orquestador → Implementador**: Requerimiento estructurado (JSON).
- **Implementador → Orquestador**: Código + validación (JSON).
- **Orquestador → Implementador (feedback)**: Errores + sugerencias (JSON).

### **8.2. Ejemplo de Conversación**

**Orquestador**:
```json
{
  "tarea_id": "log-002",
  "fase": "Fase_3",
  "seccion": "Personajes",
  "descripcion": "Implementar función para validar campos obligatorios en Personajes.",
  "contexto": {
    "esquema": "/src/schemas/personaje.json",
    "campos": ["nombre", "objetivos", "motivaciones"],
    "relaciones": [],
    "adjuntos": []
  },
  "requisitos": {
    "lenguaje": "rust",
    "archivo": "/src/validators.rs",
    "funcion_principal": "validar_personaje",
    "dependencias": ["serde", "serde_json"]
  },
  "validacion": {
    "criterios": [
      "La función debe devolver un Result<bool, String>.",
      "Debe validar que 'nombre', 'objetivos' y 'motivaciones' no estén vacíos."
    ],
    "pruebas": [
      {
        "entrada": {"nombre": "Juan", "objetivos": ["Encontrar a su hermano"], "motivaciones": "Justicia"},
        "salida_esperada": {"valido": true}
      },
      {
        "entrada": {"nombre": "", "objetivos": [], "motivaciones": ""},
        "salida_esperada": {"valido": false, "error": "Los campos 'nombre', 'objetivos' y 'motivaciones' son obligatorios."}
      }
    ]
  },
  "prioridad": "alta",
  "notas": "Usar serde para deserializar el JSON."
}
```

**Implementador**:
```rust
// Archivo: /src/validators.rs
use serde_json::Value;
use std::collections::HashSet;

pub fn validar_personaje(personaje: &Value) -> Result<bool, String> {
    let campos_obligatorios = HashSet::from(["nombre", "objetivos", "motivaciones"]);
    for campo in campos_obligatorios {
        if personaje.get(campo).is_none() || personaje[campo].is_null() {
            return Err(format!("El campo '{}' es obligatorio.", campo));
        }
    }
    Ok(true)
}
```

**Respuesta del Implementador**:
```json
{
  "tarea_id": "log-002",
  "codigo": "pub fn validar_personaje(personaje: &Value) -> Result<bool, String> { ... }",
  "lenguaje": "rust",
  "archivo": "/src/validators.rs",
  "validacion_interna": {
    "compila": true,
    "errores": []
  }
}
```

**Orquestador (validación)**:
- Ejecuta las pruebas:
  - Entrada 1: `{"nombre": "Juan", ...}` → `Ok(true)` ✅
  - Entrada 2: `{"nombre": "", ...}` → `Err("El campo 'nombre' es obligatorio.")` ✅
- **Aprobado**: Marca `log-002` como completada.

---

## **9. Criterios de Aceptación Global**
La aplicación **Guiones** se considerará completa cuando:
1. **Todas las fases** (1 a 6) estén marcadas como completadas.
2. **Todas las validaciones** de esquemas, relaciones cruzadas y mecánicas pasen.
3. **La integración con Mistral Client API** funcione para al menos un Agente IA (ej: validación de Personajes).
4. **Los adjuntos** en Proyecto puedan ser usados como contexto por los Agentes IA.
5. **La UI/CLI** permita:
   - Crear/editar todas las secciones.
   - Interactuar con los Agentes IA (enviar peticiones y validar respuestas).

---

## **10. Entregables**
El Orquestador debe asegurar que los siguientes entregables estén completos:

| **Entregable** | **Descripción** | **Ubicación** |
|----------------|----------------|---------------|
| Esquemas JSON | Esquemas para todas las secciones. | `/src/schemas/` |
| Módulos de Rust/TypeScript | Código fuente de la aplicación. | `/src/` |
| Pruebas unitarias | Pruebas para validaciones y mecánicas. | `/tests/` |
| Documentación | Documentación técnica (generada con `rustdoc` o similar). | `/docs/` |
| Configuración | Archivos de configuración (ej: `Cargo.toml`, `.env`). | `/` |
| Mockups de UI | Diseño de la interfaz (opcional, si aplica). | `/ui/` |
| Artefactos de distribución | Binarios, Docker, etc. | `/dist/` |

---

## **11. Notas Finales**
- **El Orquestador nunca debe generar código**: Su rol es **analizar, descomponer y validar**. La generación de código es exclusiva del Implementador.
- **El Implementador nunca debe tomar decisiones de diseño**: Su rol es **implementar** lo especificado por el Orquestador.
- **Ambos agentes deben seguir el Manifiesto Sistémico**: Cualquier violación (ej: modificar la teoría sin autorización) debe ser reportada y corregida.
- **Historial**: Todos los intercambios entre agentes deben guardarse para auditoría y depuración.