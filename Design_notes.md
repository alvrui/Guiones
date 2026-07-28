# Guiones
Aquí tienes la estructura detallada de la aplicación para desarrollar ideas de guiones, con los campos específicos para cada sección, su tipología de datos, descripciones y la integración de **Agentes IA** para validación y generación de contenido.
Esta estructura está diseñada para garantizar que la información recogida sea coherente, completa y útil para el desarrollo de un guion profesional, con soporte de inteligencia artificial para asistir en la creación y validación de campos.

---

---

## **1. Proyecto**
**Descripción:** Define la historia, el entorno y el contexto general del guion. Incluye una **biblioteca de adjuntos** (documentos, imágenes, notas) que sirven como contexto para los **Agentes IA** asignados a otras secciones.

**Campos de la sección 'Proyecto'**

| **Campo**               | **Tipología de Datos**       | **Descripción**                                                                                     | **Ejemplo**                          | **Obligatorio** | **Agente IA** |
|-------------------------|-----------------------------|-----------------------------------------------------------------------------------------------------|--------------------------------------|------------------|---------------|
| Título                  | Texto (String)              | Nombre del proyecto o guion.                                                                       | "El Último Viaje"                    | Sí               | ✏️ (Validar/Generar) |
| Tipo de Narración       | Lista desplegable (Enum)    | Estructura narrativa: Lineal, No lineal, *In media res*, Paralela, Episódica, Circular, Asociativa. | "No lineal"                          | Sí               | ✏️ |
| Estilo                  | Lista desplegable (Enum)    | Estilo narrativo: Realista, Surrealista, Épico, Sátira, Fábula, Drama, Comedia, Terror, etc.       | "Realista"                           | Sí               | ✏️ |
| Contexto Histórico      | Texto largo (Text)          | Descripción del período histórico en el que transcurre la historia.                              | "Guerra Civil Española, 1936-1939"   | No               | ✏️ |
| Contexto Social         | Texto largo (Text)          | Descripción del entorno social (clase, cultura, normas, conflictos sociales).                  | "Sociedad rural con fuertes jerarquías" | No               | ✏️ |
| Contexto Geográfico     | Texto largo (Text)          | Ubicación física y características del entorno (ciudad, país, paisajes, clima).                | "Andalucía, España. Clima mediterráneo" | No               | ✏️ |
| Contexto Cultural       | Texto largo (Text)          | Tradiciones, creencias, costumbres y valores predominantes en la historia.                     | "Influencia gitana y flamenca"       | No               | ✏️ |
| Entorno Sensorial       | Texto largo (Text)          | Descripción de los elementos sensoriales (olores, sonidos, texturas, temperatura).              | "Olor a salitre, sonidos de olas"    | No               | ✏️ |
| Tono General            | Lista desplegable (Enum)    | Atmósfera emocional: Oscuro, Ligero, Melancólico, Esperanzador, Irónico, etc.                   | "Melancólico"                        | Sí               | ✏️ |
| Temas Principales       | Lista de etiquetas (Array)  | Temas centrales explorados en la historia (ej: amor, traición, redención).                       | ["Amor", "Traición", "Redención"]    | No               | ✏️ |
| Sinopsis                | Texto largo (Text)          | Resumen breve de la historia (1-2 párrafos).                                                       | "Un hombre busca venganza..."         | Sí               | ✏️ |
| Fecha de Creación       | Fecha (Date)                | Fecha en la que se creó el proyecto.                                                               | "2026-07-19"                         | No               | ❌ |
| Fecha de Última Modificación | Fecha (Date)           | Fecha de la última actualización del proyecto.                                                    | "2026-07-19"                         | No               | ❌ |
| **Adjuntos**            | Lista de objetos (Array)    | Archivos adjuntos (PDF, TXT, imágenes, etc.) que sirven como biblioteca para los **Agentes IA**.  | [{"nombre": "doc1.pdf", "tipo": "PDF", "descripción": "Notas históricas"}] | No | ❌ |

**Área de Intercambio con Agente IA**:
- **Campo de texto** para escribir peticiones al agente (ej: *"Genera una sinopsis coherente con el contexto histórico y cultural"*).
- **Botón "Enviar a Agente"** para enviar la petición a Mistral Client API.
- **Área de respuesta** donde se muestra la última respuesta del agente.
- **Botón "Validar y Aplicar"** para copiar la respuesta validada al campo correspondiente.

---

## **2. Personajes**
**Descripción:** Información detallada sobre cada personaje para desarrollar sus motivaciones, conflictos y evolución.

**Campos de la sección 'Personajes'**

| **Campo**               | **Tipología de Datos**       | **Descripción**                                                                                     | **Ejemplo**                          | **Obligatorio** | **Agente IA** |
|-------------------------|-----------------------------|-----------------------------------------------------------------------------------------------------|--------------------------------------|------------------|---------------|
| ID                      | Identificador único (UUID)  | Identificador único para cada personaje.                                                           | "a1b2c3d4-5678-90ef..."              | Sí (generado automáticamente) | ❌ |
| Nombre                  | Texto (String)              | Nombre completo del personaje.                                                                     | "Juan Pérez"                         | Sí               | ✏️ |
| Apodo/Nombre en la Historia | Texto (String)          | Nombre por el que se conoce al personaje en la historia.                                          | "El Lobo"                            | No               | ✏️ |
| Edad                    | Número entero (Integer)     | Edad del personaje al inicio de la historia.                                                      | 35                                   | No               | ✏️ |
| Género                  | Lista desplegable (Enum)    | Género: Hombre, Mujer, No binario, Otro.                                                            | "Hombre"                             | No               | ✏️ |
| Trasfondo               | Texto largo (Text)          | Historia personal, origen y experiencias pasadas que definen al personaje.                       | "Creció en un pueblo pesquero..."    | Sí               | ✏️ |
| Objetivos               | Lista de texto (Array)      | Metas que el personaje busca alcanzar.                                                            | ["Encontrar a su hermano", "Vengarse"] | Sí               | ✏️ |
| Motivaciones            | Texto largo (Text)          | Razones profundas que impulsan al personaje (ej: amor, miedo, ambición).                          | "Deseo de justicia por su familia"  | Sí               | ✏️ |
| Conflictos Internos     | Texto largo (Text)          | Luchas psicológicas o emocionales del personaje.                                                   | "Duda entre el perdón y la venganza" | No               | ✏️ |
| Conflictos Externos     | Texto largo (Text)          | Obstáculos físicos o sociales que enfrenta el personaje.                                          | "Enemistad con el villano principal" | No               | ✏️ |
| Relaciones              | Lista de objetos (Array)    | Conexiones con otros personajes (nombre + tipo de relación).                                      | [{"Nombre": "María", "Relación": "Esposa"}] | No               | ✏️ |
| Arquetipo               | Lista desplegable (Enum)    | Rol universal: Héroe, Mentor, Antagonista, Aliado, Víctima, etc.                                   | "Héroe"                              | No               | ✏️ |
| Personalidad            | Texto largo (Text)          | Rasgos de carácter (ej: valiente, tímido, astuto).                                                  | "Inteligente pero arrogante"         | No               | ✏️ |
| Evolución               | Texto largo (Text)          | Cambios que experimenta el personaje a lo largo de la historia.                                   | "Pasa de ser egoísta a solidario"    | No               | ✏️ |
| Habilidades             | Lista de etiquetas (Array)  | Capacidades o talentos del personaje.                                                              | ["Lucha", "Persuasión", "Música"]     | No               | ✏️ |
| Debilidades             | Lista de etiquetas (Array)  | Puntos débiles o vulnerabilidades.                                                               | ["Miedo a la altura", "Desconfiado"] | No               | ✏️ |
| Apariencia Física       | Texto largo (Text)          | Descripción física (altura, complexión, rasgos distintivos).                                      | "Alto, cabello oscuro, cicatriz en la mejilla" | No | ✏️ |
| Notas Adicionales       | Texto largo (Text)          | Cualquier información extra relevante.                                                             | "Inspirado en un personaje histórico" | No               | ✏️ |

**Área de Intercambio con Agente IA**:
- **Campo de texto** para peticiones (ej: *"Sugiere 3 objetivos coherentes con su trasfondo y motivaciones"*).
- **Botón "Enviar a Agente"** para enviar la petición al **Agente IA de Personajes**. 
- **Área de respuesta** con la última interacción.
- **Botón "Validar y Aplicar"** para aplicar la respuesta al campo seleccionado.

---

## **3. Narrativas**
**Descripción:** Grandes trazos de las historias que ocurren en el proyecto, incluyendo su estructura y conexiones.

**Campos de la sección 'Narrativas'**

| **Campo**               | **Tipología de Datos**       | **Descripción**                                                                                     | **Ejemplo**                          | **Obligatorio** | **Agente IA** |
|-------------------------|-----------------------------|-----------------------------------------------------------------------------------------------------|--------------------------------------|------------------|---------------|
| ID                      | Identificador único (UUID)  | Identificador único para cada narrativa.                                                           | "a1b2c3d4-5678-90ef..."              | Sí (generado automáticamente) | ❌ |
| Título                  | Texto (String)              | Nombre de la narrativa.                                                                             | "La Búsqueda del Tesoro"             | Sí               | ✏️ |
| Tipo de Estructura      | Lista desplegable (Enum)    | Estructura: Lineal, Episódica, Temática, Circular, Asociativa.                                    | "Circular"                           | Sí               | ✏️ |
| Temas Asociados         | Lista de etiquetas (Array)  | Temas principales que explora esta narrativa.                                                       | ["Amor", "Pérdida"]                  | No               | ✏️ |
| Tono                    | Lista desplegable (Enum)    | Atmósfera emocional: Drama, Comedia, Terror, Aventura, etc.                                        | "Aventura"                           | No               | ✏️ |
| Sinopsis                | Texto largo (Text)          | Resumen de la narrativa.                                                                           | "Un grupo de amigos busca un tesoro..." | Sí               | ✏️ |
| Personajes Involucrados | Lista de objetos (Array)    | Personajes principales en esta narrativa (referencia a IDs de la sección Personajes).              | ["a1b2c3d4-5678-90ef...", "e5f6g7h8..."] | Sí               | ✏️ |
| Conexiones con Otras Narrativas | Texto largo (Text)   | Cómo esta narrativa se relaciona o contrasta con otras.                                            | "Paralela a la narrativa de la traición" | No | ✏️ |
| Estado                  | Lista desplegable (Enum)    | Estado: Borrador, En Desarrollo, Completada.                                                       | "En Desarrollo"                       | No               | ❌ |

**Área de Intercambio con Agente IA**:
- **Campo de texto** para peticiones (ej: *"Genera una sinopsis para una narrativa de tipo 'Viaje del Héroe' con los personajes X e Y"*).
- **Botón "Enviar a Agente"** para enviar la petición al **Agente IA de Narrativas**. 
- **Área de respuesta** y **botón "Validar y Aplicar"**. 

---

## **4. Tramas**
**Descripción:** Basada en arquetipos y elementos narrativos, inspirada en el sistema de *story elements* de *Hollywood Animal*.

**Campos de la sección 'Tramas'**

| **Campo**               | **Tipología de Datos**       | **Descripción**                                                                                     | **Ejemplo**                          | **Obligatorio** | **Agente IA** |
|-------------------------|-----------------------------|-----------------------------------------------------------------------------------------------------|--------------------------------------|------------------|---------------|
| ID                      | Identificador único (UUID)  | Identificador único para cada trama.                                                                | "a1b2c3d4-5678-90ef..."              | Sí (generado automáticamente) | ❌ |
| Título                  | Texto (String)              | Nombre de la trama.                                                                                 | "La Conspiración"                    | Sí               | ✏️ |
| Arquetipo Narrativo     | Lista desplegable (Enum)    | Arquetipo: Viaje del Héroe, Tragedia, Comedia, Búsqueda, etc.                                       | "Viaje del Héroe"                    | Sí               | ✏️ |
| Elementos Narrativos    | Lista de objetos (Array)    | Elementos clave: Conflicto, Revelación, Clímax, Giro Argumental, etc. (cada uno con descripción).   | [{"Tipo": "Conflicto", "Descripción": "Enfrentamiento con el antagonista"}] | Sí | ✏️ |
| Subtramas               | Lista de objetos (Array)    | Tramas secundarias relacionadas (referencia a IDs de otras tramas).                                | ["e5f6g7h8-9012-3456..."]            | No               | ✏️ |
| Personajes Involucrados | Lista de objetos (Array)    | Personajes principales en esta trama (referencia a IDs de Personajes).                             | ["a1b2c3d4-5678-90ef...", "i9j0k1l2..."] | Sí | ✏️ |
| Obstáculos              | Lista de texto (Array)      | Barreras que los personajes deben superar.                                                         | ["Falta de recursos", "Traición"]     | No               | ✏️ |
| Estado                  | Lista desplegable (Enum)    | Estado: Idea, En Desarrollo, Completada.                                                             | "En Desarrollo"                       | No               | ❌ |
| Notas                   | Texto largo (Text)          | Información adicional sobre la trama.                                                              | "Inspirada en un hecho real"         | No               | ✏️ |

**Área de Intercambio con Agente IA**:
- **Campo de texto** para peticiones (ej: *"Sugiere 3 obstáculos coherentes con el arquetipo 'Viaje del Héroe'"*).
- **Botón "Enviar a Agente"**, **área de respuesta** y **botón "Validar y Aplicar"**. 

---

## **5. Estructura Narrativa**
**Descripción:** Organizada en actos y escenas, con espacio para desarrollar el texto de la historia.

**Campos de la sección 'Estructura Narrativa'**

| **Campo**               | **Tipología de Datos**       | **Descripción**                                                                                     | **Ejemplo**                          | **Obligatorio** | **Agente IA** |
|-------------------------|-----------------------------|-----------------------------------------------------------------------------------------------------|--------------------------------------|------------------|---------------|
| ID                      | Identificador único (UUID)  | Identificador único para cada acto o escena.                                                        | "a1b2c3d4-5678-90ef..."              | Sí (generado automáticamente) | ❌ |
| Tipo                    | Lista desplegable (Enum)    | Tipo: Acto o Escena.                                                                                 | "Escena"                             | Sí               | ❌ |
| Título                  | Texto (String)              | Nombre del acto o escena.                                                                           | "Acto 1: El Llamado"                 | Sí               | ✏️ |
| Número de Acto          | Número entero (Integer)     | Número del acto (1, 2, 3, etc.).                                                                     | 1                                    | Sí (si es Acto)  | ❌ |
| Número de Escena        | Número entero (Integer)     | Número de la escena dentro del acto.                                                                | 3                                    | Sí (si es Escena)| ❌ |
| Elementos Narrativos    | Lista de objetos (Array)    | 1-2 elementos narrativos asociados (referencia a IDs de Tramas).                                    | ["a1b2c3d4-5678-90ef..."]            | Sí               | ✏️ |
| Personajes Involucrados | Lista de objetos (Array)    | Personajes en la escena (referencia a IDs de Personajes).                                           | ["a1b2c3d4-5678-90ef...", "i9j0k1l2..."] | Sí | ✏️ |
| Ubicación               | Texto (String)              | Lugar donde transcurre la escena.                                                                   | "Playa al atardecer"                 | No               | ✏️ |
| Texto de la Escena      | Texto largo (Text)          | Diálogos, acciones y descripciones narrativas.                                                     | "Juan mira al horizonte mientras..." | Sí (si es Escena)| ✏️ |
| Duración Estimada       | Texto (String)              | Duración aproximada de la escena (ej: "5 minutos").                                                 | "5 minutos"                          | No               | ✏️ |
| Notas de Dirección       | Texto largo (Text)          | Anotaciones para dirección (movimientos de cámara, efectos, etc.).                                  | "Plano secuencia desde el mar"       | No               | ✏️ |
| Estado                  | Lista desplegable (Enum)    | Estado: Borrador, Revisión, Finalizada.                                                             | "Borrador"                           | No               | ❌ |

**Área de Intercambio con Agente IA**:
- **Campo de texto** para peticiones (ej: *"Genera un diálogo para esta escena entre los personajes X e Y en la ubicación Z"*).
- **Botón "Enviar a Agente"**, **área de respuesta** y **botón "Validar y Aplicar"**. 

---

## **6. Agentes IA**
**Descripción:** Configuración de agentes de inteligencia artificial para asistir en la validación y generación de contenido en las distintas secciones de la aplicación. Cada agente está asociado a una **sección específica** y se alimenta de los campos de contexto relevantes (ej: el contexto del **Proyecto** puede usarse para agentes de **Narrativas** o **Personajes**).

**Campos de la sección 'Agentes IA'**

| **Campo**               | **Tipología de Datos**       | **Descripción**                                                                                     | **Ejemplo**                          | **Obligatorio** |
|-------------------------|-----------------------------|-----------------------------------------------------------------------------------------------------|--------------------------------------|------------------|
| ID                      | Identificador único (UUID)  | Identificador único para cada agente.                                                              | "agente-001"                         | Sí (generado automáticamente) |
| Nombre                  | Texto (String)              | Nombre descriptivo del agente.                                                                     | "Agente de Personajes"               | Sí               |
| Agente ID (Mistral)     | Texto (String)              | ID del agente en Mistral Client API.                                                               | "mistral-agent-123"                  | Sí               |
| Última Conversation ID  | Texto (String)              | ID de la última conversación con Mistral Client API.                                             | "conv-456"                           | No               |
| Sección Asignada        | Lista desplegable (Enum)    | Sección a la que está asignado el agente: Proyecto, Personajes, Narrativas, Tramas, Estructura Narrativa. | "Personajes" | Sí |
| Instrucciones           | Texto largo (Text)          | Instrucciones específicas para el agente (ej: *"Valida que los objetivos del personaje sean coherentes con su trasfondo"*). | "Genera sinopsis coherentes con el tono y temas del proyecto." | Sí |
| Campos de Contexto      | Lista de objetos (Array)    | Campos de otras secciones que el agente usa como contexto (ej: `contexto_historico`, `temas_principales` de **Proyecto**). | [{"seccion": "Proyecto", "campos": ["contexto_historico", "temas_principales"]}] | Sí |

**Relaciones**:
- Un **Agente IA** puede usar campos de **Proyecto** (ej: `contexto_historico`) para generar contenido en **Narrativas** o **Personajes**. 
- Los campos de contexto deben ser **campos existentes** en las secciones referenciadas.

**Área de Intercambio en la Sección**:
- Para cada **Agente IA**, se muestra:
  - **Nombre** y **Sección Asignada**. 
  - **Botón "Probar Agente"**: Abre el área de intercambio en la sección asignada.
  - **Historial de Conversaciones**: Lista de las últimas interacciones (opcional).

---

## **Relaciones entre Secciones**
Para garantizar la coherencia de la estructura, la aplicación debe permitir:

1. **Referencias Cruzadas**:
   - En **Narrativas**, **Tramas** y **Estructura Narrativa**, los campos de *Personajes Involucrados* deben referenciar los IDs de la sección **Personajes**. 
   - En **Estructura Narrativa**, el campo *Elementos Narrativos* debe referenciar los IDs de la sección **Tramas**. 
   - En **Tramas**, el campo *Subtramas* debe referenciar otros IDs de **Tramas**. 
   - En **Agentes IA**, los *Campos de Contexto* deben referenciar campos existentes en otras secciones.

2. **Validaciones**:
   - Los campos obligatorios deben validarse antes de guardar.
   - Los campos de tipo *Enum* (listas desplegables) deben tener opciones predefinidas.
   - Los campos de tipo *Array* (listas) deben permitir múltiples entradas.
   - Las referencias a IDs en **Agentes IA** (ej: `Campos de Contexto`) deben apuntar a secciones y campos válidos.

3. **Integración con Agentes IA**:
   - Cada campo con el icono ✏️ permite abrir el **Área de Intercambio con Agente IA** de su sección. 
   - Al hacer clic en **"Enviar a Agente"**, se envía una petición a **Mistral Client API** con:
     - El **Agente ID** del agente asignado a la sección.
     - El **Contexto**: Campos de la sección actual + campos de contexto definidos en **Agentes IA** (ej: si el agente de **Personajes** usa `contexto_historico` de **Proyecto**, este se incluye en la petición).
     - La **Petición del usuario** (ej: *"Genera 3 objetivos para este personaje"*).
   - La respuesta de Mistral Client API se muestra en el **Área de Respuesta**. 
   - El usuario puede editar la respuesta y, al hacer clic en **"Validar y Aplicar"**, se copia al campo seleccionado.

4. **Tipos de Datos Específicos**:
   - **UUID**: Identificadores únicos generados automáticamente para cada entrada en todas las secciones.
   - **Fecha**: Formato `YYYY-MM-DD`.
   - **Texto largo (Text)**: Campos que permiten párrafos extensos (ej: sinopsis, descripciones).
   - **Lista de etiquetas (Array)**: Campos que permiten múltiples etiquetas o elementos (ej: temas, habilidades).
   - **Adjuntos**: Archivos (PDF, TXT, imágenes) con metadatos: `nombre`, `tipo`, `descripción`.

---

## **Ejemplo de JSON para el Mockup**
A continuación, se muestra un ejemplo de cómo podrían estructurarse los datos en formato JSON, incluyendo la nueva sección de **Agentes IA** y los **adjuntos en Proyecto**:

```json
{
  "Proyecto": {
    "id": "proj-001",
    "titulo": "El Último Viaje",
    "tipo_narracion": "No lineal",
    "estilo": "Realista",
    "contexto_historico": "Guerra Civil Española, 1936-1939",
    "contexto_social": "Sociedad rural con fuertes jerarquías",
    "contexto_geografico": "Andalucía, España. Clima mediterráneo",
    "contexto_cultural": "Influencia gitana y flamenca",
    "entorno_sensorial": "Olor a salitre, sonidos de olas",
    "tono_general": "Melancólico",
    "temas_principales": ["Amor", "Traición", "Redención"],
    "sinopsis": "Un hombre busca venganza por la muerte de su familia durante la guerra.",
    "fecha_creacion": "2026-07-19",
    "fecha_ultima_modificacion": "2026-07-19",
    "adjuntos": [
      {
        "id": "adj-001",
        "nombre": "contexto_historico.pdf",
        "tipo": "PDF",
        "descripcion": "Documento con detalles históricos de la Guerra Civil Española",
        "ruta": "/recursos/adjuntos/contexto_historico.pdf"
      },
      {
        "id": "adj-002",
        "nombre": "inspiracion_cultural.txt",
        "tipo": "TXT",
        "descripcion": "Notas sobre la cultura gitana y flamenca",
        "ruta": "/recursos/adjuntos/inspiracion_cultural.txt"
      }
    ]
  },
  "Personajes": [
    {
      "id": "pers-001",
      "nombre": "Juan Pérez",
      "apodo": "El Lobo",
      "edad": 35,
      "genero": "Hombre",
      "trasfondo": "Creció en un pueblo pesquero de Andalucía. Su familia fue asesinada durante la guerra.",
      "objetivos": ["Encontrar a su hermano", "Vengarse del responsable"],
      "motivaciones": "Deseo de justicia por su familia",
      "conflictos_internos": "Duda entre el perdón y la venganza",
      "conflictos_externos": "Enemistad con el villano principal, el Coronel Mendoza",
      "relaciones": [
        {"nombre": "María López", "relacion": "Esposa", "id": "pers-002"},
        {"nombre": "Carlos Pérez", "relacion": "Hermano", "id": "pers-003"}
      ],
      "arquetipo": "Héroe",
      "personalidad": "Inteligente pero arrogante, con un fuerte sentido de la justicia",
      "evolucion": "Pasa de ser un hombre violento a entender el valor del perdón",
      "habilidades": ["Lucha", "Persuasión"],
      "debilidades": ["Miedo a la altura", "Desconfiado"],
      "apariencia_fisica": "Alto, cabello oscuro, cicatriz en la mejilla izquierda",
      "notas_adicionales": "Inspirado en un personaje histórico de la Guerra Civil"
    }
  ],
  "Narrativas": [
    {
      "id": "narr-001",
      "titulo": "La Búsqueda de la Verdad",
      "tipo_estructura": "Circular",
      "temas_asociados": ["Justicia", "Pérdida"],
      "tono": "Drama",
      "sinopsis": "Juan y María buscan pruebas para incriminar al Coronel Mendoza, mientras descubren secretos del pasado.",
      "personajes_involucrados": ["pers-001", "pers-002"],
      "conexiones_con_otras_narrativas": "Paralela a la narrativa de la traición del Coronel Mendoza",
      "estado": "En Desarrollo"
    }
  ],
  "Tramas": [
    {
      "id": "trama-001",
      "titulo": "La Conspiración del Coronel",
      "arquetipo_narrativo": "Viaje del Héroe",
      "elementos_narrativos": [
        {
          "tipo": "Conflicto",
          "descripcion": "Juan se enfrenta al Coronel Mendoza en un duelo final."
        },
        {
          "tipo": "Revelación",
          "descripcion": "María descubre que el Coronel es su tío."
        }
      ],
      "subtramas": ["trama-002"],
      "personajes_involucrados": ["pers-001", "pers-002", "pers-004"],
      "obstaculos": ["Falta de pruebas", "Traición de un aliado"],
      "estado": "En Desarrollo",
      "notas": "Inspirada en hechos reales de la Guerra Civil"
    }
  ],
  "Estructura_Narrativa": [
    {
      "id": "acto-001",
      "tipo": "Acto",
      "titulo": "Acto 1: El Llamado",
      "numero_acto": 1,
      "estado": "Finalizada"
    },
    {
      "id": "escena-001",
      "tipo": "Escena",
      "titulo": "Juan recibe una carta anónima",
      "numero_acto": 1,
      "numero_escena": 1,
      "elementos_narrativos": ["trama-001"],
      "personajes_involucrados": ["pers-001"],
      "ubicacion": "Casa de Juan, al amanecer",
      "texto_escena": "Juan lee una carta que le revela el paradero del Coronel Mendoza. Su expresión cambia de la calma a la furia.",
      "duracion_estimada": "3 minutos",
      "notas_direccion": "Plano detalle de la carta. Música tensa de fondo.",
      "estado": "Revisión"
    }
  ],
  "Agentes_IA": [
    {
      "id": "agente-001",
      "nombre": "Agente de Personajes",
      "agente_id_mistral": "mistral-agent-personajes",
      "ultima_conversation_id": "conv-789",
      "seccion_asignada": "Personajes",
      "instrucciones": "Valida que los objetivos, motivaciones y conflictos del personaje sean coherentes con su trasfondo y arquetipo. Genera sugerencias si es necesario.",
      "campos_contexto": [
        {"seccion": "Proyecto", "campos": ["contexto_historico", "contexto_social", "temas_principales"]}
      ]
    },
    {
      "id": "agente-002",
      "nombre": "Agente de Narrativas",
      "agente_id_mistral": "mistral-agent-narrativas",
      "ultima_conversation_id": "conv-101",
      "seccion_asignada": "Narrativas",
      "instrucciones": "Genera sinopsis y conexiones con otras narrativas coherentes con el tono, temas y personajes involucrados.",
      "campos_contexto": [
        {"seccion": "Proyecto", "campos": ["tono_general", "temas_principales", "sinopsis"]},
        {"seccion": "Personajes", "campos": ["nombre", "arquetipo"]}
      ]
    },
    {
      "id": "agente-003",
      "nombre": "Agente de Tramas",
      "agente_id_mistral": "mistral-agent-tramas",
      "ultima_conversation_id": null,
      "seccion_asignada": "Tramas",
      "instrucciones": "Sugiere elementos narrativos (conflictos, revelaciones, etc.) y obstáculos coherentes con el arquetipo y los personajes involucrados.",
      "campos_contexto": [
        {"seccion": "Proyecto", "campos": ["tono_general", "estilo"]},
        {"seccion": "Personajes", "campos": ["objetivos", "motivaciones"]}
      ]
    }
  ]
}
```

---

## **Requisitos Técnicos para la Integración con Mistral Client API**
1. **Conexión a Mistral Client API**:
   - La aplicación debe estar configurada con una **API Key** de Mistral. 
   - Cada petición a un **Agente IA** debe incluir:
     - `agente_id`: ID del agente en Mistral.
     - `conversation_id`: ID de la conversación (o `null` para iniciar una nueva).
     - `contexto`: Objeto con los campos de contexto relevantes (ej: `{"contexto_historico": "Guerra Civil Española", "temas_principales": ["Amor", "Traición"]}`).
     - `peticion`: Texto introducido por el usuario en el **Área de Intercambio**. 

2. **Manejo de Respuestas**:
   - La respuesta de Mistral Client API se almacena temporalmente en el **Área de Respuesta** del **Agente IA**. 
   - Al hacer clic en **"Validar y Aplicar"**, la respuesta se copia al campo seleccionado y se actualiza el `ultima_conversation_id` del agente.

3. **Almacenamiento de Adjuntos**:
   - Los adjuntos en **Proyecto** se guardan en una carpeta `/recursos/adjuntos/` y su metadata (nombre, tipo, descripción) en el JSON. 
   - Los **Agentes IA** pueden acceder al contenido de los adjuntos si se incluye en el `contexto` de la petición (ej: *"Usa el archivo 'contexto_historico.pdf' para generar una sinopsis"*).

4. **Seguridad**:
   - La **API Key** de Mistral debe almacenarse de forma segura (ej: variables de entorno). 
   - Las peticiones a Mistral Client API deben manejar errores (ej: tiempo de espera, límites de rate).

---

## **Ejemplo de Flujo de Trabajo con Agentes IA**
1. **Usuario en la sección *Personajes***:
   - Selecciona el campo *Objetivos* de un personaje y hace clic en el icono ✏️. 
   - Se abre el **Área de Intercambio con Agente IA** del **Agente de Personajes**. 
   - El usuario escribe: *"Sugiere 3 objetivos coherentes con su trasfondo de pesquero y su motivación de justicia"*. 
   - Hace clic en **"Enviar a Agente"**. 

2. **Aplicación**:
   - Construye la petición a Mistral Client API con:
     - `agente_id`: `mistral-agent-personajes`.
     - `conversation_id`: `conv-789` (o `null` si es nueva).
     - `contexto`:
       ```json
       {
         "trasfondo": "Creció en un pueblo pesquero de Andalucía. Su familia fue asesinada durante la guerra.",
         "motivaciones": "Deseo de justicia por su familia",
         "contexto_historico": "Guerra Civil Española, 1936-1939",
         "temas_principales": ["Amor", "Traición", "Redención"]
       }
       ```
     - `peticion`: *"Sugiere 3 objetivos coherentes con su trasfondo de pesquero y su motivación de justicia"*.

3. **Mistral Client API**:
   - Devuelve una respuesta como:
     ```json
     {
       "respuesta": "1. Encontrar al responsable de la muerte de su familia. 2. Reconstruir el pueblo pesquero. 3. Proteger a los inocentes de la guerra.",
       "conversation_id": "conv-789"
     }
     ```

4. **Usuario**:
   - Revisa la respuesta en el **Área de Respuesta**. 
   - Hace clic en **"Validar y Aplicar"** para copiar la respuesta al campo *Objetivos*.

5. **Actualización**:
   - El campo *Objetivos* del personaje se actualiza con:
     ```json
     ["Encontrar al responsable de la muerte de su familia", "Reconstruir el pueblo pesquero", "Proteger a los inocentes de la guerra"]
     ```
   - El `ultima_conversation_id` del **Agente de Personajes** se actualiza a `conv-789`.

---

## **Notas Adicionales**
- **Extensibilidad**: Se pueden añadir más **Agentes IA** para otras secciones o funcionalidades específicas (ej: validación de coherencia global entre todas las secciones).
- **Personalización**: Los **Campos de Contexto** de cada agente pueden ajustarse según las necesidades del proyecto.
- **Historial**: Opcionalmente, se puede guardar un historial de conversaciones por agente para auditoría o reutilización.