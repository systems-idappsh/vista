# 1.3.0 — 2026-07-14

- Portada recompuesta a escala completa según la referencia visual.
- Banner 3:1 dominante y sin márgenes laterales desperdiciados.
- Ocho tarjetas 5:9 reconstruidas desde la referencia aprobada.
- Barra inferior compacta de contacto, redes y confianza.
- Enlaces de tarjetas conservados hacia los IDs correspondientes de `servicios.html`.
- Tarjetas del catálogo mantienen sus tres servicios principales.

# Changelog

## [1.2.0] — Catálogo de servicios conectado por secciones

### Added
- Nueva franja de 8 tarjetas en `servicios.html`, conservando el orden visual aprobado y formato vertical compacto.
- Tres servicios principales visibles en cada tarjeta y acceso “Ver todos los servicios”.
- Catálogo completo por categoría basado en el documento de revisión v1.0: Visas, Pasaportes, Perú, México, Venezuela, Canadá, Otros países y Otros trámites.
- Estados y advertencias visibles para categorías condicionadas o pendientes, incluyendo México, USA-07, SODOC, PERU-05 y PERU-09.
- Hoja modular `assets/css/services-catalog.css`.

### Changed
- Todas las tarjetas de portada enlazan al `id` correspondiente dentro de `servicios.html`.
- La franja visual de portada muestra las 8 tarjetas en una sola fila desde contenedores medianos; en móvil conserva desplazamiento horizontal.
- `servicios.html` dejó de usar descripciones genéricas y ahora organiza servicios principales, catálogo completo, público aplicable y alertas por categoría.

### Fixed
- Navegación de tarjeta a categoría verificada para los ocho identificadores.
- México queda marcado como “Próximamente” y no se presenta como catálogo aprobado.

## [1.1.0] — Banner dinámico y tarjetas visuales

### Added
- Carrusel principal con las 4 imágenes reales entregadas: visas, pasaportes y salvoconducto, trámites en Perú y trámites en Venezuela.
- Cambio automático cada `1000 ms`, ciclo infinito, transición cruzada, controles manuales, dots, teclado, gesto táctil y pausa cuando la pestaña queda oculta.
- 8 tarjetas visuales reales en el orden aprobado: Visas, Pasaportes, Trámites en Perú, Trámites en México, Trámites en Venezuela, Canadá, Otros países y Otros trámites.
- Variantes WebP optimizadas para banner y tarjetas, con `srcset`, dimensiones reservadas y rutas relativas.
- `home-showcase.css` como módulo aislado para la composición visual de portada.

### Changed
- La portada reemplaza el hero de texto e imagen separada por un banner panorámico estable de relación `3:1`.
- El antiguo coverflow de una tarjeta activa se reemplazó por una franja horizontal con varias tarjetas visibles, scroll táctil y `scroll-snap`.
- En móvil se conservan tres tarjetas visibles y parte de la siguiente, sin convertirlas en bloques gigantes apilados.
- Se compactaron confianza, CTA y footer en móvil para conservar densidad visual tipo aplicación.

### Removed
- Imágenes antiguas del hero que dejaron de utilizarse.

## [1.0.0] — Construcción completa

### Added
- 6 páginas HTML completas: `index`, `servicios` (8 secciones ancladas), `contacto`, `redes`, `aviso-privacidad`, `terminos-condiciones`.
- Sistema de componentes reutilizables vía `fetch()`: `header` (incluye `nav` anidado), `footer`, `whatsapp-float`, `cta-contact`.
- `Service Cards Coverflow Carousel` (`service-carousel.js` + `components.css`): tarjeta activa centrada/destacada, navegación por flechas, teclado, arrastre táctil/mouse y dots.
- CSS fluido: `clamp()` para tipografía y espaciado, `grid auto-fit/minmax` para tarjetas y footer, container queries reales en `contact-grid` y `service-index`.
- JS modular: `main`, `layout-loader`, `navigation`, `contact`, `analytics-events`, `service-carousel`, `slider` (disponible, no conectado), `console-flow`.
- SEO/PWA completos: `robots.txt`, `sitemap.xml`, `manifest.webmanifest`, `browserconfig.xml`, favicon multi-formato, íconos PWA generados desde el logo real del cliente, Open Graph + Twitter Card, JSON-LD (`Organization`, `WebSite`, `FAQPage`, `BreadcrumbList`, `WebPage`) inline por página.
- Assets reales: logo, imagen de hero (WebP + variante mobile), imagen Open Graph — generados desde los archivos subidos por el cliente (`originalAGMT.png`, `img1_cliente_quiere.jpg`).
- Documentación en `docs/`: `SEO.md`, `PWA.md`, `LEGAL.md`, `CONTENT_FLOW.md`.

### Fixed (respecto a huecos detectados en auditoría previa)
- `apple-touch-icon.png`, `android-chrome-192x192.png` y `android-chrome-512x512.png` ahora existen y están enlazados (antes rotos).
- `components/nav.html` ahora existe como archivo separado, incluido anidado dentro de `header.html`.
- El JSON-LD de `assets/data/schema/*.json` ahora tiene una copia funcional inyectada inline en cada página (los buscadores no ejecutan `fetch()` para datos estructurados).

### Known limitations (documentadas, no ocultas)
- `GTM-XXXXXXX` es un placeholder — pendiente ID real.
- `local-business.json` no está inyectado en ninguna página: falta dirección física confirmada.
- El mapa de `contacto.html` usa "México" como ubicación temporal.
- El dominio usado en canonical/OG/sitemap es `https://dominio.com/` — reemplazar antes de publicar.
