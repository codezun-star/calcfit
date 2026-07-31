/**
 * Serializa un objeto a JSON-LD listo para incrustar en `<script type="application/ld+json">`.
 *
 * Escapa `<`, `>` y `&` como secuencias unicode. El JSON resultante es
 * equivalente al original al parsearlo, pero:
 *
 *  1. Impide que un `</script>` dentro de un texto cierre el bloque antes de
 *     tiempo (vector clásico de inyección de HTML).
 *  2. Evita que los parsers de HTML se atraganten con textos que contienen
 *     comparadores sueltos («<86%», «< 25 mmHg»). Con `<` sin escapar,
 *     astro-compress fallaba al minificar 15 páginas y las dejaba sin comprimir.
 *
 * Usar SIEMPRE esta función en lugar de `JSON.stringify` para JSON-LD.
 */
export function jsonLd(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026');
}
