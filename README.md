# Billetes del Mundo 🌎

Un museo digital de billetes actuales para explorar en familia, creado por **Aldo Lizares**.

**Versión:** 1.9.0 · **Países:** 30 · **Denominaciones catalogadas:** 164 · **Pares de imágenes registrados:** 70 de 164 · **Pares pendientes:** 94 · **Enlaces oficiales individuales:** 83.

## Explora el catálogo

La aplicación es estática y funciona en **GitHub Pages** sin servidor, bases de datos, claves de API ni dependencias que necesiten instalación. Está preparada para iPhone, iPad y computadoras. Interfaz en español e inglés.

- Búsqueda de países y monedas, filtros por continente y opción de mostrar solo países que tienen referencias fotográficas.
- Selección de denominación y consulta de anverso/reverso.
- Visor ampliado, navegación aleatoria y curiosidades.
- Tarjetas con vistas previas discretas de los billetes cuando existe fotografía seleccionada.
- Datos interesantes por denominación y, para México, explicaciones de anverso y reverso.
- Fichas oficiales por denominación de Banco de México para ver las imágenes originales en su sitio.

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

**Importante:** los 164 registros del catálogo no equivalen a 164 pares de fotografías disponibles. Esta versión incluye referencias de imagen seleccionadas para 57 pares (Estados Unidos, euro, Japón, Brasil, Suiza, Indonesia, India, Corea del Sur, Egipto y Turquía); en las demás denominaciones se muestra un marcador elegante de foto pendiente. Para México y Reino Unido, la interfaz proporciona enlaces directos a los bancos centrales. Para México, la interfaz proporciona enlaces directos a los seis billetes de la familia G en la web de Banco de México, sin copiar ni alojar las imágenes: según el Artículo 17 de la Ley Monetaria, su reproducción requiere autorización expresa. Si una imagen de Wikimedia no está accesible, el visor muestra un estado de error, no una imagen inventada.

Las imágenes se obtienen de archivos externos y están sujetas a la disponibilidad, licencias, atribución y legislación de reproducción de billetes de cada país. La presencia de una referencia no implica autorización ilimitada para comercializar la imagen. Antes de ampliar cobertura, confirmar contra fuentes oficiales que el diseño es el más reciente de la denominación y revisar permisos aplicables.

El catálogo prioriza **las series de diseño más recientes**, no todas las series aún legalmente aceptadas. Las cifras y denominaciones pueden cambiar por decisiones de los bancos centrales; realizar revisiones periódicas.

## Archivos principales

- `index.html`: interfaz principal.
- `assets/style.css`: identidad visual y diseño responsive.
- `assets/app.js`: lógica de la navegación, filtros y galería.
- `assets/icon.svg`, `assets/note-ornament.svg`: elementos gráficos.
- `api/v1/*.json`: base del catálogo.

## Autoría

**Developed by Aldo Lizares** · Monograma **AL** integrado discretamente en el pie de página.

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

## Versión 1.2.0 — ampliación de billetes vigentes

**Cobertura del catálogo:** 30 países, 164 denominaciones, 57 pares de anverso/reverso seleccionados y 107 registros pendientes de fotografías.

Países cuyos pares de imágenes se ampliaron en esta versión:
- Brasil: 7 billetes de la segunda familia (2 a 200 reales).
- Suiza: 6 billetes de la novena serie (10 a 1,000 francos).
- Indonesia: 7 billetes de la emisión de 2022 (1,000 a 100,000 rupias).
- India: 6 billetes de la Mahatma Gandhi New Series (10 a 500 rupias).
- Corea del Sur: 4 billetes de won vigentes (1,000 a 50,000).
- Egipto: 5 billetes (polímero de 10/20 libras y papel de 50/100/200).
- Turquía: 6 billetes de diseño E9 vigente (5 a 200 liras), con normas de imagen y watermark espécimen.

**Aún pendiente:** 107 pares de imágenes. En todos esos casos el visor muestra un enlace al banco central y **no** usa imágenes antiguas para llenar huecos. Algunas jurisdicciones restringen la reproducción de su moneda (México, Reino Unido, Canadá, Argentina, Colombia, etc.), por lo que los enlaces oficiales no equivalen a una imagen incrustada.

**Vista visual de cobertura:** la página principal muestra los billetes con fotografías registradas separadamente de las denominaciones del catálogo.

**Autor:** Developed by Aldo Lizares.

### Nueva Zelanda: referencias visuales oficiales

Se añadieron cinco enlaces directos a las fichas oficiales de la Serie 7 del Banco de la Reserva de Nueva Zelanda, con descripciones del anverso y reverso. A diferencia de los 57 pares incrustados desde Wikimedia, **estas cinco fichas todavía no muestran fotografías en el visor propio**. Las imágenes deben consultarse en la página enlazada de la autoridad emisora.

**Respaldo adicional:** `backup/v1.1.1-before-photo-expansion`, que conserva la versión anterior.

## Versión 1.3.0 — fuentes oficiales y más imágenes

- **Sudáfrica:** 5 pares reales de anverso y reverso de la serie actual del South African Reserve Bank, alojados en el sitio oficial y enlazados externamente desde el visor. Las imágenes de este banco incluyen la marca de agua `IMAGE-NOT LEGAL TENDER`. El SARB permite utilizar sus imágenes de galería para fines **no comerciales** siempre que no se alteren, se cite al SARB y se respete su política de reproducción. Fuente: https://www.resbank.co.za/en/home/what-we-do/banknotes-and-coin/Use-of-banknotes
- **Canadá:** 5 páginas individualizadas de la emisión más reciente por denominación. El nuevo billete vertical de 20 dólares con Carlos III está anunciado para febrero de 2027, de modo que en noviembre de 2026 todavía corresponde el de Isabel II. Fuente: https://www.bankofcanada.ca/banknotes/
- **Singapur:** 5 denominaciones de la Portrait Series con sus motivos actuales. El sitio de MAS restringe la republicación de fotografías propias sin consentimiento, por lo que estas fichas conservan referencias oficiales, sin fotocopiar sus activos.
- **Australia:** 5 fichas individuales de la nueva serie de polímero; se respetan las restricciones de tamaño y reproducción indicadas por el Reserve Bank of Australia.
- **Tailandia:** 5 fichas vigentes enlazadas al catálogo del Banco de Tailandia. La reproducción de imágenes exige autorización previa; no se incorporan fotografías ajenas sin permiso.

**Cobertura de la versión:** 30 países, 164 denominaciones, 62 pares de fotografías con referencia seleccionada, 102 denominaciones sin fotografía propia y 40 fichas con enlace individual a una página oficial. La accesibilidad real de las imágenes externas depende del navegador, del proveedor y de sus cambios de sitio.

Respaldo previo: `backup/pre-v1.3-images-official-20261123`. Se mantiene la URL de GitHub Pages y el footer `Developed by Aldo Lizares`.

## Versión 1.4.0 — países nórdicos y Polonia (23 noviembre 2026)

Se añadieron **17 fichas individuales oficiales**, sin modificar el conjunto de 30 países ni introducir series históricas: **Suecia** (20, 50, 100, 200, 500, 1.000 SEK; Sveriges Riksbank, serie 2015–2016), **Noruega** (50, 100, 200, 500, 1.000 NOK; Norges Bank, serie VIII 2017–2019), **Polonia** (10, 20, 50, 100, 200, 500 PLN; NBP, seguridad modernizada 2014–2017). Cada ficha incluye el enlace de su denominación y el motivo por el que no se republica su imagen sin autorización.

Fuentes oficiales: [Riksbank, billetes válidos](https://www.riksbank.se/en-gb/payments--cash/notes--coins/notes/valid-banknotes/), [Riksbank, condiciones de reproducción](https://www.riksbank.se/en-gb/payments--cash/notes--coins/copying-and-advertising/), [Norges Bank, serie VIII](https://www.norges-bank.no/en/topics/notes-and-coins/legal-tender-notes-coins/), [Norges Bank, 1000 NOK aún de curso legal en abril de 2026](https://www.norges-bank.no/en/news-events/news/Press-releases/2026/2026-04-29-bank-notes/), [NBP, seis denominaciones](https://static.nbp.pl/strony/bezpiecznepieniadze/index.html).

**Estado después de este bloque:** 164 denominaciones en 30 países; **62 pares de imágenes registrados**, **102 pares pendientes**; **57 fichas de denominación enlazadas al banco central** (antes 40). Esta versión mejora la precisión de las referencias, pero **no añade nuevas fotografías**; no se cuentan fichas externas como imágenes cargadas. La marca `photos.verified` no garantiza disponibilidad real de la URL ni permiso legal permanente; la auditoría de imágenes y la compatibilidad de Safari/iPhone siguen siendo necesarias.

Respaldo: `backup/pre-v1.4-nordic-polish-sources-20261123`.

## Versión 1.5.0 — Chile y Colombia (23 de noviembre de 2026)

Se incorporaron **11 enlaces oficiales específicos** para las denominaciones vigentes de Chile (1.000, 2.000, 5.000, 10.000 y 20.000 pesos) y Colombia (2.000, 5.000, 10.000, 20.000, 50.000 y 100.000 pesos), con motivos del anverso y reverso en español e inglés. Las fichas chilenas son del Banco Central de Chile y las colombianas de la Nueva Familia del Banco de la República (2016), que sigue en circulación.

**Reproducción de imágenes chilenas:** el Banco Central de Chile permite reproducciones parciales con fines educativos, numismáticos y culturales sujetas a un reglamento; la reproducción del anverso **y** reverso requiere autorización previa. Por tanto, no se publicaron imágenes de ambas caras sin dicha autorización. https://www.billetesymonedas.cl/InformacionNormativa/UsoImagenes

**Reproducción de imágenes colombianas:** se conservan enlaces a las fichas originales; no se publicaron copias sin licencia de reutilización comprobada. https://www.banrep.gov.co/es/billetes-monedas/billetes-en-circulacion

**Cobertura:** 30 países, 164 denominaciones, 62 pares de imágenes registrados, 102 sin imágenes y 68 fichas con enlaces oficiales. **Pares de imágenes añadidos en esta versión: 0.** Los enlaces de imagen registrados no equivalen a una prueba visual de carga en móviles.

Respaldo anterior a estos cambios: `backup/pre-v1.5-chile-colombia-20261123`. Se mantiene la URL de Pages y la firma `Developed by Aldo Lizares`.

## Versión 1.6.0 — Malasia (23 de noviembre de 2026)

- Se completaron **6 fichas individuales oficiales** de la cuarta serie «Distinctively Malaysia»: RM1, RM5, RM10, RM20, RM50 y RM100, con vínculos directos a Bank Negara Malaysia y descripción bilingüe del anverso y reverso.
- Los motivos del reverso se contrastaron con el emisor: cometa wau bulan (RM1), cálao rinoceronte (RM5), Rafflesia azlanii (RM10), tortugas carey y laúd (RM20), palma aceitera y biotecnología (RM50), y monte Kinabalu y formaciones rocosas de Gunung Api (RM100).
- No se incorporaron fotografías de BNM sin licencia de republicación comprobada; cada ficha enlaza a imágenes oficiales de ambas caras en su propio sitio.
- Fuentes: https://www.bnm.gov.my/currency/banknotes y https://www.bnm.gov.my/web/bnm-bank-notes/distinctively-malaysia
- Respaldo previo: `backup/pre-v1.6-malaysia-official-20261123`.
- Totales: **30 países, 164 denominaciones, 62 pares de imágenes registrados, 102 pendientes, 74 fichas oficiales individuales**. La disponibilidad efectiva de cada imagen externa no está garantizada.

## 1.7.0 — Perú

Cinco fichas de la nueva familia 2021–2023, con motivos bilingües y enlaces a los comunicados oficiales de emisión de 2021 y 2022 y a la memoria 2023 del BCRP (p. 160, S/ 200). No se incorporan imágenes sin permiso confirmado. Cobertura: 30 países, 164 denominaciones, 62 pares registrados, 102 pendientes, 79 fichas con referencia oficial.

## 1.8.0 — Marruecos

Cuatro fichas de la serie 2023–2024, con fecha de emisión y motivos bilingües, enlazadas a los comunicados individuales de Bank Al-Maghrib:
- 20 DH (2024-08-21): https://www.bkam.ma/en/content/download/810715/8910395/CdP_nouvelle%20serie%2020dhs%20EN.pdf
- 50 DH (2024-07-30): https://www.bkam.ma/en/content/download/809676/8903453/CdP_nouvelle%20serie%2050dhs%20EN.pdf
- 100 DH (2023-11-24): https://www.bkam.ma/en/content/download/795904/8808984/CdP_nouvelle%20serie_En.pdf
- 200 DH (2024-01-12): https://www.bkam.ma/en/content/download/798470/8826499/CdP_nouvelle%20serie_EN.pdf

No se incorporan fotografías: no se ha confirmado permiso de republicación. Cobertura: 30 países, 164 denominaciones, 62 pares registrados, 102 pendientes, 83 referencias oficiales. Respaldo: `backup/pre-v1.8-morocco-20261123`. Se mantiene la firma Developed by Aldo Lizares.

## Versión 1.9.0 — Actualización manual de imágenes (24 de noviembre de 2026)

- La automatización horaria **fue desactivada** por solicitud del propietario. La actualización se realizó directamente en la rama `main`.
- **Reino Unido:** 4 pares de imágenes oficiales (Carlos III al frente, reversos de la serie polímero). Se corrigieron direcciones Flickr erróneas y un reverso que apuntaba al anverso.
- **Canadá:** 4 pares de imágenes Frontiers (5, 20, 50 y 100 CAD) de la galería del Bank of Canada. El actual billete de 10 CAD es el vertical Viola Desmond de 2018: no se ha elegido una pareja de imágenes hasta verificar las dos caras.
- **Visualización:** indicador `x/y` de fotos por país, enlace a la foto exacta en su origen y señalización SPECIMEN para Canadá.
- **Cobertura:** 30 países, 164 denominaciones, **70** pares de fotos registrados, **94** pendientes de imágenes.
- **Auditoría por los 30 países:** [docs/coverage-audit-2026-11-24.md](docs/coverage-audit-2026-11-24.md), con lista completa de denominaciones pendientes.
- **Respaldo para rollback:** `backup/pre-manual-photos-2026-11-24`.
- **Fuentes reutilizables sin solicitud individual:** biblioteca de imágenes del Bank of England y galería del Bank of Canada (uso educativo no comercial sujeto a condiciones; se respetan marcas y fuentes).
- **Importante:** los 70 pares son **referencias seleccionadas**; no se ha confirmado que cada CDN permita incrustar la imagen directamente en iPhone. Si falla, la interfaz ofrece ir a la fuente.

**Autor:** Developed by Aldo Lizares.
