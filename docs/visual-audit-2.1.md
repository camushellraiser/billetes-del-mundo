# Auditoría de calidad v2.1.0 — 24 noviembre 2026

- 30 países y 164 denominaciones sin cambios.
- 328 referencias de caras inspeccionadas estructuralmente; antes del cambio: 219 archivos únicos; después: 220.
- Ninguna coordenada de recorte fuera del intervalo, referencia vacía ni cara duplicada (URL + recorte).
- Canadá CAD 10: sustitución de hoja comercial por dos imágenes individuales oficiales, abiertas e inspeccionadas visualmente en la fuente. Diseño vertical 2018. Fuente: https://www.bankofcanada.ca/banknotes/vertical-10-note-security-features/
- 98 parejas individuales, 66 con encuadres. No se confunde una referencia con carga exitosa.
- Se corrigieron mensajes de carga, tiempos de espera y condiciones de carrera en el visor y zoom, y tamaño del recorte vertical.
- Bloqueo: el entorno de ejecución no resuelve hosts externos; no se ejecutó la prueba integral de red ni Safari. La visualización de las demás imágenes y su coincidencia con las series vigentes requieren inspección adicional.
- Herramienta manual: audit.html permite cargar cada imagen en el navegador, exportar el resultado y distinguir fallos de carga. No es una automatización recurrente ni valida por sí sola la identidad del billete.
- Respaldo: backup/pre-v2.1-visual-audit-20261124.
