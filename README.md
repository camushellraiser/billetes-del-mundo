# Billetes del Mundo 🌎

Un museo digital de billetes actuales para explorar en familia, creado por **Aldo Lizárrez**.

**Versión:** 1.1.1 · **Países:** 30 · **Denominaciones catalogadas:** 164 · **Pares de imágenes de referencia:** 16 (7 de Estados Unidos, 6 del euro y 3 de Japón). **Enlaces oficiales:** 6 denominaciones de México (familia G) y 4 del Reino Unido (Carlos III).

## Explora el catálogo

La aplicación es estática y funciona en **GitHub Pages** sin servidor, bases de datos, claves de API ni dependencias que necesiten instalación. Está preparada para iPhone, iPad y computadoras. Interfaz en español e inglés.

- Búsqueda de países y monedas, filtros por continente y opción de mostrar solo países que tienen referencias fotográficas.
- Selección de denominación y consulta de anverso/reverso.
- Visor ampliado, navegación aleatoria y curiosidades.
- Tarjetas con vistas previas discretas de los billetes cuando existe fotografía seleccionada.\n- Datos interesantes por denominación y, para México, explicaciones de anverso y reverso.\n- Fichas oficiales por denominación de Banco de México para ver las imágenes originales en su sitio.

## Publicación en GitHub Pages

Repositorio: `camushellraiser/billetes-del-mundo`. Para habilitar el sitio, abre **Settings → Pages → Build and deployment**, elige **Deploy from a branch**, rama **main**, carpeta **/ (root)** y pulsa **Save**.

Dirección prevista, una vez que GitHub Pages confirme el despliegue:

https://camushellraiser.github.io/billetes-del-mundo/

No es necesario crear otra URL por cada actualización: el repositorio y el enlace deben mantenerse iguales.

## API / datos JSON

El sitio publica archivos JSON que pueden consultarse directamente:

- `api/v1/countries.json`: países, monedas, denominaciones, enlaces oficiales y curiosidades.
- `api/v1/banknotes.json`: registros por denominación, serie y, cuando procede, referencias de imágenes.
- `api/v1/manifest.json`: versión y resumen de la colección.

Son *endpoints estáticos de solo lectura*, no una API de escritura ni una API en tiempo real. Para actualizar datos, hay que modificar los JSON del repositorio y publicar un nuevo commit. El catálogo está diseñado para permitir ampliaciones sin cambiar la URL.

## Fotografías, vigencia y licencias

**Importante:** los 164 registros del catálogo no equivalen a 164 pares de fotografías disponibles. Esta versión incluye referencias de imagen seleccionadas para 16 pares (Estados Unidos, euro y Japón); en las demás denominaciones se muestra un marcador elegante de foto pendiente. Para México y Reino Unido, la interfaz proporciona enlaces directos a los bancos centrales. Para México, la interfaz proporciona enlaces directos a los seis billetes de la familia G en la web de Banco de México, sin copiar ni alojar las imágenes: según el Artículo 17 de la Ley Monetaria, su reproducción requiere autorización expresa. Si una imagen de Wikimedia no está accesible, el visor muestra un estado de error, no una imagen inventada.

Las imágenes se obtienen de archivos externos y están sujetas a la disponibilidad, licencias, atribución y legislación de reproducción de billetes de cada país. La presencia de una referencia no implica autorización ilimitada para comercializar la imagen. Antes de ampliar cobertura, confirmar contra fuentes oficiales que el diseño es el más reciente de la denominación y revisar permisos aplicables.

El catálogo prioriza **las series de diseño más recientes**, no todas las series aún legalmente aceptadas. Las cifras y denominaciones pueden cambiar por decisiones de los bancos centrales; realizar revisiones periódicas.

## Archivos principales

- `index.html`: interfaz principal.
- `assets/style.css`: identidad visual y diseño responsive.
- `assets/app.js`: lógica de la navegación, filtros y galería.
- `assets/icon.svg`, `assets/note-ornament.svg`: elementos gráficos.
- `api/v1/*.json`: base del catálogo.

## Autoría

**Developed by Aldo Lizárrez** · Monograma **AL** integrado discretamente en el pie de página.

## Actualización 1.1.0 — 23 de noviembre de 2026

- Estados Unidos: anverso y reverso curados para las siete denominaciones del diseño vigente (1, 2, 5, 10, 20, 50 y 100 USD).
- Japón: tres denominaciones de la serie F emitida en 2024, con curiosidades por billete.
- México: seis referencias directas y verificadas al Banco de México, con motivos de ambas caras por denominación. No se alojan reproducciones de MXN.
- Vistas previas en las tarjetas de países con fotografía, datos por billete y créditos de imágenes junto al visor.
- Respaldos disponibles: `backup/v1.0.0` y `backup/pre-v1.1-current-billetes`.

**Importante:** el resto de países todavía necesita una auditoría de las series recientes y de los permisos de reproducción. Evitar sustituir los pendientes por billetes antiguos.

## Actualización 1.1.1 — Reino Unido

- Fichas oficiales enlazadas individualmente del Banco de Inglaterra para los cuatro billetes actuales con Carlos III: £5, £10, £20 y £50.
- Motivos explicados en ambas caras: Winston Churchill, Jane Austen, J. M. W. Turner y Alan Turing.
- Etiquetas de enlace adaptadas al banco central de cada país.
