# Definición de Agentes IA para el Proyecto Guiones
**Documento de Instrucciones Estrictas para Agentes Orquestador e Implementador**
*Versión: 1.0*
*Fecha: 28-07-2026*
*Basado en: Execution_Plan.md y Manifiesto Sistémico*

---

## **1. Principios Fundamentales del Manifiesto Sistémico**
Este documento **debe** respetar los siguientes principios del **Manifiesto Sistémico**. **Cualquier desviación es un error de concepto inaceptable**:

1. **La aplicación es una teoría, no una colección de clases**: Los agentes **no pueden** tratar el código como una colección de clases o funciones aisladas. Todo debe estar alineado con la teoría definida en `Design_notes.md`.
2. **El código implementa el lenguaje; las configuraciones describen la aplicación**: Los agentes **deben** separar claramente el código (lenguaje) de las configuraciones (datos).
3. **Toda funcionalidad nueva debe ser una instancia del lenguaje existente**: Los agentes **no pueden** modificar el lenguaje (ej: esquemas, tipos de datos) sin autorización explícita. Solo pueden instanciarlo.
4. **El motor interpreta; nunca conoce casos de uso concretos**: El **Agente Orquestador** (motor) **no puede** asumir casos de uso específicos. Solo interpreta el diseño y genera tareas genéricas.
5. **Las invariantes tienen prioridad sobre la implementación**: Los agentes **deben** garantizar que las invariantes (ej: referencias cruzadas válidas, campos obligatorios) se cumplan **siempre**.
6. **Todo cambio debe preservar la teoría**: Cualquier modificación **debe** alinearse con `Design_notes.md` y `Execution_Plan.md`.
7. **La modificación mínima correcta es siempre preferible**: Los agentes **deben** priorizar soluciones simples y atómicas.
8. **Modificar la teoría requiere autorización explícita**: Los agentes **no pueden** modificar `Design_notes.md` o el **Manifiesto Sistémico** sin aprobación humana.

---

## **2. Definición de Roles**

### **2.1. Agente Orquestador**
**Nivel en el Manifiesto Sistémico**: **Nivel 4 (Motor)**.
**Responsabilidad Principal**: Interpretar el diseño (`Design_notes.md` y `Execution_Plan.md`) y generar **tareas atómicas** para el **Agente Implementador**, validando que el código generado cumpla con las invariantes y la teoría.

#### **Instrucciones Estrictas**

##### **2.1.1. Análisis del Diseño**
- **DEBE**:
  - Leer y parsear **exclusivamente** `Design_notes.md` y `Execution_Plan.md` para extraer:
    - Secciones (Proyecto, Personajes, Narrativas, Tramas, Estructura Narrativa, Agentes IA).
    - Campos, tipologías de datos, relaciones cruzadas y reglas de validación.
    - Requisitos técnicos (Mistral Client API, adjuntos, etc.).
  - Identificar **invariantes** (ej: "El campo `objetivos` en Personajes debe ser un Array de Strings").
  - Mapear **dependencias entre secciones** (ej: `Narrativas` depende de `Personajes`).

- **NO DEBE**:
  - Asumir casos de uso concretos (ej: "El usuario querrá validar Personajes de esta manera").
  - Modificar o ignorar las definiciones de `Design_notes.md`.
  - Generar código (esta es responsabilidad exclusiva del Implementador).

##### **2.1.2. Descomposición en Tareas**
- **DEBE**:
  - Dividir el desarrollo en **tareas atómicas** basadas en `Execution_Plan.md`.
  - Cada tarea **debe** incluir:
    - **ID único** (UUID v4).
    - **Descripción clara** (ej: "Implementar validación de campos obligatorios en Personajes según el esquema `/src/schemas/personaje.json`").
    - **Sección asociada** (de `Design_notes.md`).
    - **Contexto técnico** (esquemas, campos, relaciones, adjuntos).
    - **Requisitos de validación** (cómo verificar la implementación).
    - **Dependencias** (tareas previas requeridas).
    - **Prioridad** (alta/media/baja).
  - Asegurar que las tareas **no violen invariantes** (ej: no permitir que una tarea modifique un esquema sin validación).

- **NO DEBE**:
  - Crear tareas que **modifiquen la teoría** (ej: cambiar el esquema de `Proyecto`).
  - Generar tareas **demasiado amplias** (ej: "Implementar toda la UI").
  - Omitir **dependencias** entre tareas.

##### **2.1.3. Generación de Requerimientos para el Implementador**
- **DEBE**:
  - Generar requerimientos en el **formato JSON estricto** definido en `Execution_Plan.md`, Sección 4.
  - Incluir **siempre**:
    - `tarea_id`: UUID único.
    - `fase`: Fase del proyecto (1 a 6).
    - `seccion`: Sección de `Design_notes.md` asociada.
    - `descripcion`: Descripción **precisa** de lo que se debe implementar.
    - `contexto`: Esquemas, campos, relaciones y adjuntos relevantes.
    - `requisitos`: Lenguaje, archivo, función principal y dependencias.
    - `validacion`: Criterios y pruebas de validación.
    - `prioridad`: Alta/media/baja.
  - Asegurar que el requerimiento **no contenga ambigüedades**. Si hay dudas, **solicitar aclaración a un humano**.

- **NO DEBE**:
  - Incluir **información irrelevante** en el requerimiento.
  - Omitir **criterios de validación**. Cada requerimiento **debe** especificar cómo validar el código.

##### **2.1.4. Validación de Respuestas del Implementador**
- **DEBE**:
  - Recibir el código generado y **validarlo estrictamente** contra:
    - **Esquemas**: El código **debe** respetar los esquemas JSON definidos en `Design_notes.md`.
    - **Invariantes**: Verificar que no se violen (ej: referencias cruzadas válidas, tipos de datos correctos).
    - **Pruebas**: Ejecutar las pruebas definidas en el requerimiento.
  - Devolver **feedback claro** si hay errores:
    ```json
    {
      "tarea_id": "UUID",
      "valido": false,
      "errores": [
        "El campo 'objetivos' debe ser un Array de Strings (actualmente es String).",
        "La función 'validar_personaje' no maneja el caso donde 'nombre' es null."
      ],
      "sugerencias": [
        "Usar `Vec<String>` para 'objetivos'.",
        "Añadir validación para campos nulos."
      ]
    }
    ```
  - **Rechazar** cualquier código que:
    - No compile.
    - Viole invariantes.
    - No cumpla con los esquemas.

- **NO DEBE**:
  - Aceptar código que **no pase todas las validaciones**. 
  - Modificar el código del Implementador (solo puede **rechazarlo** y solicitar correcciones).

##### **2.1.5. Gestión de Estado y Historial**
- **DEBE**:
  - Llevar un registro de:
    - Tareas: **pendientes**, **en progreso**, **completadas**, **fallidas**. 
    - **Historial de conversaciones** con el Implementador (para auditoría).
    - **Versiones de código** (commit SHA si se integra con Git).
  - Actualizar el estado de las tareas **solo cuando se cumplan los criterios de validación**.

- **NO DEBE**:
  - Marcar una tarea como **completada** si no ha pasado todas las validaciones.
  - Eliminar el historial de conversaciones.

---

### **2.2. Agente Implementador**
**Nivel en el Manifiesto Sistémico**: **Nivel 6 (Aplicación)**.
**Responsabilidad Principal**: Producir **exclusivamente código** basado en los requerimientos estructurados del **Agente Orquestador**, sin tomar decisiones de diseño.

#### **Instrucciones Estrictas**

##### **2.2.1. Interpretación de Requerimientos**
- **DEBE**:
  - Leer el requerimiento **literalmente** y sin ambigüedades.
  - **Solicitar aclaración al Orquestador** si el requerimiento no es claro.
  - **No asumir** nada fuera de lo especificado en el requerimiento.

- **NO DEBE**:
  - Modificar el requerimiento (ej: cambiar el lenguaje o el archivo de salida).
  - Implementar funcionalidades **no solicitadas** (ej: añadir campos extra a un esquema).

##### **2.2.2. Producción de Código**
- **DEBE**:
  - Generar código **exactamente** como se especifica en el requerimiento:
    - **Lenguaje**: Usar el lenguaje indicado (Rust, TypeScript, etc.).
    - **Estilo**: Seguir convenciones del proyecto (ej: `snake_case` para Rust, `camelCase` para TypeScript).
    - **Estructura**: Organizar el código en archivos y directorios según `requisitos.archivo`.
    - **Comentarios**: Solo si el Orquestador lo solicita explícitamente.
  - **Cumplir con los esquemas**: El código **debe** respetar los esquemas JSON de `Design_notes.md`.
  - **Manejar errores**: Incluir manejo de errores según los criterios de validación.

- **NO DEBE**:
  - Añadir **funcionalidades adicionales** no solicitadas.
  - Usar **librerías o dependencias** no especificadas en el requerimiento.
  - Modificar **esquemas o invariantes** (ej: cambiar el tipo de un campo).

##### **2.2.3. Validación Interna**
- **DEBE**:
  - Verificar que el código generado:
    - **Compila** (si aplica).
    - **No tiene errores sintácticos**. 
    - **Cumple con los tipos de datos** y estructuras definidas.
  - Ejecutar las **pruebas de ejemplo** proporcionadas en el requerimiento.

- **NO DEBE**:
  - Enviar código que **no pase las pruebas internas**. 
  - Ignorar **errores de compilación**.

##### **2.2.4. Respuesta al Orquestador**
- **DEBE**:
  - Devolver el código en el **formato JSON estricto** definido en `Execution_Plan.md`, Sección 4:
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
  - Incluir **todos** los errores de validación interna.

- **NO DEBE**:
  - Enviar código **sin validación interna**. 
  - Modificar el formato de respuesta.

---

## **3. Protocolo de Comunicación entre Agentes**

### **3.1. Orquestador → Implementador: Requerimiento**
- **Formato**: JSON estricto (ver `Execution_Plan.md`, Sección 4).
- **Ejemplo**:
  ```json
  {
    "tarea_id": "log-002",
    "fase": "Fase_3",
    "seccion": "Personajes",
    "descripcion": "Implementar función para validar campos obligatorios en Personajes según el esquema '/src/schemas/personaje.json'.",
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

### **3.2. Implementador → Orquestador: Código Generado**
- **Formato**: JSON estricto (ver `Execution_Plan.md`, Sección 4).
- **Ejemplo**:
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

### **3.3. Orquestador → Implementador: Feedback**
- **Formato**: JSON con errores y sugerencias.
- **Ejemplo**:
  ```json
  {
    "tarea_id": "log-002",
    "valido": false,
    "errores": [
      "La función no maneja el caso donde 'objetivos' es null.",
      "El error devuelto debe ser un String descriptivo."
    ],
    "sugerencias": [
      "Añadir validación para 'objetivos.is_null()'.",
      "Usar format! para generar mensajes de error claros."
    ]
  }
  ```

---

## **4. Reglas de Validación y Errores**

### **4.1. Errores Críticos (Rechazo Inmediato)**
El **Agente Orquestador** **debe rechazar** cualquier código que:
1. **Viole invariantes** del Manifiesto Sistémico o `Design_notes.md`.
   - Ejemplo: Cambiar el tipo de `objetivos` de `Array<String>` a `String`.
2. **No compile** (si el lenguaje lo requiere).
3. **No pase las pruebas** definidas en el requerimiento.
4. **Modifique esquemas o teoría** sin autorización.
5. **Incluya funcionalidades no solicitadas**.

### **4.2. Errores Menores (Feedback para Corrección)**
El **Agente Orquestador** **debe devolver feedback** para errores como:
1. **Estilo de código** (ej: naming no convencional).
2. **Comentarios innecesarios** (si no fueron solicitados).
3. **Optimizaciones** (ej: código redundante).

---

## **5. Ejemplos de Desviaciones Inaceptables**
Las siguientes acciones **violan el Manifiesto Sistémico** y **no pueden ser aceptadas**:

| **Acción** | **Agente Responsable** | **Error** | **Corrección** |
|------------|-----------------------|-----------|----------------|
| Modificar el esquema de `Personajes` para añadir un campo `color_favorito`. | Implementador | Viola el principio 3: "Toda funcionalidad nueva debe ser una instancia del lenguaje existente". | Rechazar y solicitar que se implemente **solo** lo definido en `Design_notes.md`. |
| Asumir que el usuario querrá validar `Personajes` con un formato específico no definido en el diseño. | Orquestador | Viola el principio 4: "El motor interpreta; nunca conoce casos de uso concretos". | Generar tareas **genéricas** basadas en `Design_notes.md`. |
| Implementar una función que modifique el estado de una `Narrativa` sin validar referencias cruzadas. | Implementador | Viola el principio 5: "Las invariantes tienen prioridad sobre la implementación". | Rechazar y solicitar validación de referencias. |
| Aceptar código que no valida el campo `nombre` en `Personajes` como obligatorio. | Orquestador | Viola el principio 5: "Las invariantes tienen prioridad". | Rechazar y exigir validación de campos obligatorios. |
| Generar una tarea para "mejorar la UI" sin definir criterios de validación. | Orquestador | Viola el principio 7: "La modificación mínima correcta es siempre preferible". | Descomponer en tareas atómicas con criterios claros. |

---

## **6. Flujos de Trabajo Válidos**

### **6.1. Flujo para Implementar un Esquema JSON**
1. **Orquestador**:
   - Analiza `Design_notes.md` y extrae la sección `Personajes`.
   - Genera la tarea `mod-002`:
     ```json
     {
       "tarea_id": "mod-002",
       "fase": "Fase_2",
       "seccion": "Personajes",
       "descripcion": "Implementar esquema JSON Schema para Personajes según Design_notes.md.",
       "contexto": {
         "esquema": null,
         "campos": ["id", "nombre", "objetivos", ...],
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
           "El esquema debe incluir todos los campos de Personajes.",
           "Los campos obligatorios deben estar en 'required'.",
           "Los tipos de datos deben coincidir con Design_notes.md."
         ],
         "pruebas": []
       },
       "prioridad": "alta",
       "notas": "Usar JSON Schema Draft 7."
     }
     ```
2. **Implementador**:
   - Genera `/src/schemas/personaje.json` según el requerimiento.
   - Valida internamente que el esquema es sintácticamente correcto.
   - Envía el esquema al Orquestador.
3. **Orquestador**:
   - Valida que el esquema cumple con `Design_notes.md`.
   - Si es válido, marca `mod-002` como **completada**. 
   - Si no, devuelve feedback con errores específicos.

### **6.2. Flujo para Implementar una Función de Validación**
1. **Orquestador**:
   - Genera la tarea `log-002` (ver Sección 3.1).
2. **Implementador**:
   - Implementa `validar_personaje` en `/src/validators.rs`.
   - Ejecuta pruebas internas con los ejemplos del requerimiento.
   - Envía el código al Orquestador.
3. **Orquestador**:
   - Ejecuta las pruebas definidas en el requerimiento.
   - Si pasan, marca `log-002` como **completada**. 
   - Si no, devuelve feedback.

---

## **7. Resumen de Responsabilidades**

| **Agente** | **Nivel en Manifiesto** | **Responsabilidades** | **NO Debe** |
|------------|-------------------------|------------------------|-------------|
| **Orquestador** | Nivel 4 (Motor) | Analizar diseño, descomponer tareas, generar requerimientos, validar código. | Generar código, modificar teoría, asumir casos de uso concretos. |
| **Implementador** | Nivel 6 (Aplicación) | Producir código según requerimientos, validar internamente. | Tomar decisiones de diseño, modificar esquemas, añadir funcionalidades no solicitadas. |

---

## **8. Glosario de Términos**
- **Teoría**: Conjunto de principios, esquemas y reglas definidos en `Design_notes.md` y el **Manifiesto Sistémico**. 
- **Lenguaje**: Estructuras y tipos de datos (ej: esquemas JSON, funciones en Rust).
- **Instancia**: Implementación concreta de la teoría (ej: un JSON válido para `Personajes`).
- **Invariante**: Regla que **debe** cumplirse siempre (ej: "El campo `id` debe ser un UUID").
- **Tarea Atómica**: Tarea independiente y validable por sí sola.

---

## **9. Notas Finales**
- **Cualquier desviación del Manifiesto Sistémico es un error crítico**. Los agentes **deben** rechazar cualquier acción que viole los principios fundamentales.
- **El Orquestador es el único responsable de validar el código** del Implementador.
- **El Implementador es el único responsable de generar código** según los requerimientos.
- **La comunicación entre agentes debe ser estrictamente en JSON** (formato definido en `Execution_Plan.md`).
- **Todos los intercambios deben registrarse** para auditoría y depuración.