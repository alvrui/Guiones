# Guiones
Aquí tienes la estructura detallada de la aplicación para desarrollar ideas de guiones, con los campos específicos para cada sección, su tipología de datos y descripciones. Esta estructura está diseñada para garantizar que la información recogida sea coherente, completa y útil para el desarrollo de un guion profesional.

---

---

## **1. Proyecto**
**Descripción:** Define la historia, el entorno y el contexto general del guion.


Campos de la sección 'Proyecto'


| **Campo**               | **Tipología de Datos**       | **Descripción**                                                                                     | **Ejemplo**                          | **Obligatorio** |
|-------------------------|-----------------------------|-----------------------------------------------------------------------------------------------------|--------------------------------------|------------------|
| Título                  | Texto (String)              | Nombre del proyecto o guion.                                                                       | "El Último Viaje"                    | Sí               |
| Tipo de Narración       | Lista desplegable (Enum)    | Estructura narrativa: Lineal, No lineal, *In media res*, Paralela, Episódica, Circular, Asociativa. | "No lineal"                          | Sí               |
| Estilo                  | Lista desplegable (Enum)    | Estilo narrativo: Realista, Surrealista, Épico, Sátira, Fábula, Drama, Comedia, Terror, etc.       | "Realista"                           | Sí               |
| Contexto Histórico      | Texto largo (Text)          | Descripción del período histórico en el que transcurre la historia.                              | "Guerra Civil Española, 1936-1939"   | No               |
| Contexto Social         | Texto largo (Text)          | Descripción del entorno social (clase, cultura, normas, conflictos sociales).                  | "Sociedad rural con fuertes jerarquías" | No               |
| Contexto Geográfico     | Texto largo (Text)          | Ubicación física y características del entorno (ciudad, país, paisajes, clima).                | "Andalucía, España. Clima mediterráneo" | No               |
| Contexto Cultural       | Texto largo (Text)          | Tradiciones, creencias, costumbres y valores predominantes en la historia.                     | "Influencia gitana y flamenca"       | No               |
| Entorno Sensorial       | Texto largo (Text)          | Descripción de los elementos sensoriales (olores, sonidos, texturas, temperatura).              | "Olor a salitre, sonidos de olas"    | No               |
| Tono General            | Lista desplegable (Enum)    | Atmósfera emocional: Oscuro, Ligero, Melancólico, Esperanzador, Irónico, etc.                   | "Melancólico"                        | Sí               |
| Temas Principales       | Lista de etiquetas (Array)  | Temas centrales explorados en la historia (ej: amor, traición, redención).                       | ["Amor", "Traición", "Redención"]    | No               |
| Sinopsis                | Texto largo (Text)          | Resumen breve de la historia (1-2 párrafos).                                                       | "Un hombre busca venganza..."         | Sí               |
| Fecha de Creación       | Fecha (Date)                | Fecha en la que se creó el proyecto.                                                               | "2026-07-19"                         | No               |
| Fecha de Última Modificación | Fecha (Date)           | Fecha de la última actualización del proyecto.                                                    | "2026-07-19"                         | No               |

---

---

## **2. Personajes**
**Descripción:** Información detallada sobre cada personaje para desarrollar sus motivaciones, conflictos y evolución.


Campos de la sección 'Personajes'


| **Campo**               | **Tipología de Datos**       | **Descripción**                                                                                     | **Ejemplo**                          | **Obligatorio** |
|-------------------------|-----------------------------|-----------------------------------------------------------------------------------------------------|--------------------------------------|------------------|
| ID                      | Identificador único (UUID)  | Identificador único para cada personaje.                                                           | "a1b2c3d4-5678-90ef..."              | Sí (generado automáticamente) |
| Nombre                  | Texto (String)              | Nombre completo del personaje.                                                                     | "Juan Pérez"                         | Sí               |
| Apodo/Nombre en la Historia | Texto (String)          | Nombre por el que se conoce al personaje en la historia.                                          | "El Lobo"                            | No               |
| Edad                    | Número entero (Integer)     | Edad del personaje al inicio de la historia.                                                      | 35                                   | No               |
| Género                  | Lista desplegable (Enum)    | Género: Hombre, Mujer, No binario, Otro.                                                            | "Hombre"                             | No               |
| Trasfondo               | Texto largo (Text)          | Historia personal, origen y experiencias pasadas que definen al personaje.                       | "Creció en un pueblo pesquero..."    | Sí               |
| Objetivos               | Lista de texto (Array)      | Metas que el personaje busca alcanzar.                                                            | ["Encontrar a su hermano", "Vengarse"] | Sí               |
| Motivaciones            | Texto largo (Text)          | Razones profundas que impulsan al personaje (ej: amor, miedo, ambición).                          | "Deseo de justicia por su familia"  | Sí               |
| Conflictos Internos     | Texto largo (Text)          | Luchas psicológicas o emocionales del personaje.                                                   | "Duda entre el perdón y la venganza" | No               |
| Conflictos Externos     | Texto largo (Text)          | Obstáculos físicos o sociales que enfrenta el personaje.                                          | "Enemistad con el villano principal" | No               |
| Relaciones              | Lista de objetos (Array)    | Conexiones con otros personajes (nombre + tipo de relación).                                      | [{"Nombre": "María", "Relación": "Esposa"}] | No               |
| Arquetipo               | Lista desplegable (Enum)    | Rol universal: Héroe, Mentor, Antagonista, Aliado, Víctima, etc.                                   | "Héroe"                              | No               |
| Personalidad            | Texto largo (Text)          | Rasgos de carácter (ej: valiente, tímido, astuto).                                                  | "Inteligente pero arrogante"         | No               |
| Evolución               | Texto largo (Text)          | Cambios que experimenta el personaje a lo largo de la historia.                                   | "Pasa de ser egoísta a solidario"    | No               |
| Habilidades             | Lista de etiquetas (Array)  | Capacidades o talentos del personaje.                                                              | ["Lucha", "Persuasión", "Música"]     | No               |
| Debilidades             | Lista de etiquetas (Array)  | Puntos débiles o vulnerabilidades.                                                               | ["Miedo a la altura", "Desconfiado"] | No               |
| Apariencia Física       | Texto largo (Text)          | Descripción física (altura, complexión, rasgos distintivos).                                      | "Alto, cabello oscuro, cicatriz en la mejilla" | No |
| Notas Adicionales       | Texto largo (Text)          | Cualquier información extra relevante.                                                             | "Inspirado en un personaje histórico" | No               |

---

---

## **3. Narrativas**
**Descripción:** Grandes trazos de las historias que ocurren en el proyecto, incluyendo su estructura y conexiones.


Campos de la sección 'Narrativas'


| **Campo**               | **Tipología de Datos**       | **Descripción**                                                                                     | **Ejemplo**                          | **Obligatorio** |
|-------------------------|-----------------------------|-----------------------------------------------------------------------------------------------------|--------------------------------------|------------------|
| ID                      | Identificador único (UUID)  | Identificador único para cada narrativa.                                                           | "a1b2c3d4-5678-90ef..."              | Sí (generado automáticamente) |
| Título                  | Texto (String)              | Nombre de la narrativa.                                                                             | "La Búsqueda del Tesoro"             | Sí               |
| Tipo de Estructura      | Lista desplegable (Enum)    | Estructura: Lineal, Episódica, Temática, Circular, Asociativa.                                    | "Circular"                           | Sí               |
| Temas Asociados         | Lista de etiquetas (Array)  | Temas principales que explora esta narrativa.                                                       | ["Amor", "Pérdida"]                  | No               |
| Tono                    | Lista desplegable (Enum)    | Atmósfera emocional: Drama, Comedia, Terror, Aventura, etc.                                        | "Aventura"                           | No               |
| Sinopsis                | Texto largo (Text)          | Resumen de la narrativa.                                                                           | "Un grupo de amigos busca un tesoro..." | Sí               |
| Personajes Involucrados | Lista de objetos (Array)    | Personajes principales en esta narrativa (referencia a IDs de la sección Personajes).              | ["a1b2c3d4-5678-90ef...", "e5f6g7h8..."] | Sí               |
| Conexiones con Otras Narrativas | Texto largo (Text)   | Cómo esta narrativa se relaciona o contrasta con otras.                                            | "Paralela a la narrativa de la traición" | No               |
| Estado                  | Lista desplegable (Enum)    | Estado: Borrador, En Desarrollo, Completada.                                                       | "En Desarrollo"                       | No               |

---

---

## **4. Tramas**
**Descripción:** Basada en arquetipos y elementos narrativos, inspirada en el sistema de *story elements* de *Hollywood Animal*.


Campos de la sección 'Tramas'


| **Campo**               | **Tipología de Datos**       | **Descripción**                                                                                     | **Ejemplo**                          | **Obligatorio** |
|-------------------------|-----------------------------|-----------------------------------------------------------------------------------------------------|--------------------------------------|------------------|
| ID                      | Identificador único (UUID)  | Identificador único para cada trama.                                                                | "a1b2c3d4-5678-90ef..."              | Sí (generado automáticamente) |
| Título                  | Texto (String)              | Nombre de la trama.                                                                                 | "La Conspiración"                    | Sí               |
| Arquetipo Narrativo     | Lista desplegable (Enum)    | Arquetipo: Viaje del Héroe, Tragedia, Comedia, Búsqueda, etc.                                       | "Viaje del Héroe"                    | Sí               |
| Elementos Narrativos    | Lista de objetos (Array)    | Elementos clave: Conflicto, Revelación, Clímax, Giro Argumental, etc. (cada uno con descripción).   | [{"Tipo": "Conflicto", "Descripción": "Enfrentamiento con el antagonista"}] | Sí               |
| Subtramas               | Lista de objetos (Array)    | Tramas secundarias relacionadas (referencia a IDs de otras tramas).                                | ["e5f6g7h8-9012-3456..."]            | No               |
| Personajes Involucrados | Lista de objetos (Array)    | Personajes principales en esta trama (referencia a IDs de Personajes).                             | ["a1b2c3d4-5678-90ef...", "i9j0k1l2..."] | Sí               |
| Obstáculos              | Lista de texto (Array)      | Barreras que los personajes deben superar.                                                         | ["Falta de recursos", "Traición"]     | No               |
| Estado                  | Lista desplegable (Enum)    | Estado: Idea, En Desarrollo, Completada.                                                             | "En Desarrollo"                       | No               |
| Notas                   | Texto largo (Text)          | Información adicional sobre la trama.                                                              | "Inspirada en un hecho real"         | No               |

---

---
---
## **5. Estructura Narrativa**
**Descripción:** Organizada en actos y escenas, con espacio para desarrollar el texto de la historia.


Campos de la sección 'Estructura Narrativa'


| **Campo**               | **Tipología de Datos**       | **Descripción**                                                                                     | **Ejemplo**                          | **Obligatorio** |
|-------------------------|-----------------------------|-----------------------------------------------------------------------------------------------------|--------------------------------------|------------------|
| ID                      | Identificador único (UUID)  | Identificador único para cada acto o escena.                                                        | "a1b2c3d4-5678-90ef..."              | Sí (generado automáticamente) |
| Tipo                    | Lista desplegable (Enum)    | Tipo: Acto o Escena.                                                                                 | "Escena"                             | Sí               |
| Título                  | Texto (String)              | Nombre del acto o escena.                                                                           | "Acto 1: El Llamado"                 | Sí               |
| Número de Acto          | Número entero (Integer)     | Número del acto (1, 2, 3, etc.).                                                                     | 1                                    | Sí (si es Acto)  |
| Número de Escena        | Número entero (Integer)     | Número de la escena dentro del acto.                                                                | 3                                    | Sí (si es Escena)|
| Elementos Narrativos    | Lista de objetos (Array)    | 1-2 elementos narrativos asociados (referencia a IDs de Tramas).                                    | ["a1b2c3d4-5678-90ef..."]            | Sí               |
| Personajes Involucrados | Lista de objetos (Array)    | Personajes en la escena (referencia a IDs de Personajes).                                           | ["a1b2c3d4-5678-90ef...", "i9j0k1l2..."] | Sí               |
| Ubicación               | Texto (String)              | Lugar donde transcurre la escena.                                                                   | "Playa al atardecer"                 | No               |
| Texto de la Escena      | Texto largo (Text)          | Diálogos, acciones y descripciones narrativas.                                                     | "Juan mira al horizonte mientras..." | Sí (si es Escena)|
| Duración Estimada       | Texto (String)              | Duración aproximada de la escena (ej: "5 minutos").                                                 | "5 minutos"                          | No               |
| Notas de Dirección       | Texto largo (Text)          | Anotaciones para dirección (movimientos de cámara, efectos, etc.).                                  | "Plano secuencia desde el mar"       | No               |
| Estado                  | Lista desplegable (Enum)    | Estado: Borrador, Revisión, Finalizada.                                                             | "Borrador"                           | No               |

---

---
---
## **Relaciones entre Secciones**
Para garantizar la coherencia de la estructura, la aplicación debe permitir:
1. **Referencias Cruzadas:**
   - En **Narrativas**, **Tramas** y **Estructura Narrativa**, los campos de *Personajes Involucrados* deben referenciar los IDs de la sección **Personajes**.
   - En **Estructura Narrativa**, el campo *Elementos Narrativos* debe referenciar los IDs de la sección **Tramas**.
   - En **Tramas**, el campo *Subtramas* debe referenciar otros IDs de **Tramas**.

2. **Validaciones:**
   - Los campos obligatorios deben validarse antes de guardar.
   - Los campos de tipo *Enum* (listas desplegables) deben tener opciones predefinidas.
   - Los campos de tipo *Array* (listas) deben permitir múltiples entradas.

3. **Tipos de Datos Específicos:**
   - **UUID:** Identificadores únicos generados automáticamente para cada entrada en todas las secciones.
   - **Fecha:** Formato `YYYY-MM-DD`.
   - **Texto largo (Text):** Campos que permiten párrafos extensos (ej: sinopsis, descripciones).
   - **Lista de etiquetas (Array):** Campos que permiten múltiples etiquetas o elementos (ej: temas, habilidades).

---
---
---
## **Ejemplo de JSON para el Mockup**
A continuación, se muestra un ejemplo de cómo podrían estructurarse los datos en formato JSON para cada sección:

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
    "fecha_ultima_modificacion": "2026-07-19"
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
    },
    {
      "id": "pers-002",
      "nombre": "María López",
      "apodo": "La Sombra",
      "edad": 30,
      "genero": "Mujer",
      "trasfondo": "Hija de un comerciante adinerado. Conoció a Juan durante la guerra.",
      "objetivos": ["Proteger a su familia", "Ayudar a Juan a encontrar la paz"],
      "motivaciones": "Amor por su familia y deseo de reconstruir su vida",
      "conflictos_internos": "Teme perder a Juan por su obsesión con la venganza",
      "conflictos_externos": "Amenazas del Coronel Mendoza",
      "relaciones": [
        {"nombre": "Juan Pérez", "relacion": "Esposo", "id": "pers-001"}
      ],
      "arquetipo": "Aliado",
      "personalidad": "Cálida, inteligente y decidida",
      "evolucion": "Aprende a ser más fuerte y a defender lo que ama",
      "habilidades": ["Medicina", "Estrategia"],
      "debilidades": ["Miedo a la soledad"],
      "apariencia_fisica": "Baja, cabello castaño, ojos verdes",
      "notas_adicionales": "Su personaje simboliza la esperanza en medio del caos"
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
    },
    {
      "id": "trama-002",
      "titulo": "El Secreto de María",
      "arquetipo_narrativo": "Tragedia",
      "elementos_narrativos": [
        {
          "tipo": "Giro Argumental",
          "descripcion": "María descubre su conexión familiar con el Coronel."
        }
      ],
      "personajes_involucrados": ["pers-002", "pers-004"],
      "estado": "Idea"
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
    },
    {
      "id": "escena-002",
      "tipo": "Escena",
      "titulo": "María confronta a Juan",
      "numero_acto": 1,
      "numero_escena": 2,
      "elementos_narrativos": ["trama-001", "trama-002"],
      "personajes_involucrados": ["pers-001", "pers-002"],
      "ubicacion": "Playa al atardecer",
      "texto_escena": "María: 'No puedes dejar que el odio te consuma. Piensa en nosotros.' Juan: 'No puedo olvidar lo que hizo.'",
      "duracion_estimada": "5 minutos",
      "notas_direccion": "Plano medio de ambos personajes. Sonido de olas rompiendo.",
      "estado": "Borrador"
    }
  ]
}
```
