# Implementación de portada visual

## Resultado

- Banner principal integrado con cuatro imágenes reales.
- Rotación automática cada 1000 ms y ciclo continuo.
- Transición cruzada estable, controles manuales, indicadores, teclado y gesto táctil.
- Pausa automática cuando la pestaña deja de estar visible.
- Ocho tarjetas reconstruidas con la composición visual aprobada: oscuras en los extremos y claras para Perú, México y Venezuela.
- Escritorio: banner dominante a todo el ancho, ocho tarjetas verticales 5:9 en una sola fila y barra inferior compacta de contacto/redes/confianza.
- Móvil: tres tarjetas completas y parte de la siguiente permanecen visibles en una franja horizontal táctil.
- Sin apilamiento vertical de tarjetas a ancho completo.
- Imágenes convertidas a WebP con variantes responsivas y rutas relativas.

## Archivos principales

- `index.html`
- `assets/css/home-showcase.css`
- `assets/css/responsive.css`
- `assets/js/slider.js`
- `assets/js/service-carousel.js`
- `assets/img/banners/`
- `assets/img/services/cards/`

## Validaciones realizadas

- Sintaxis de todos los archivos JavaScript: PASS.
- Existencia de recursos y rutas relativas: PASS.
- Anchors de las ocho tarjetas hacia `servicios.html`: PASS.
- Carga HTTP de páginas y componentes: PASS.
- Cuatro banners y ocho tarjetas en DOM: PASS.
- Cambio automático después de 1000 ms: PASS.
- Controles manuales del banner: PASS.
- Desplazamiento horizontal de tarjetas: PASS.
- Imágenes cargadas sin recursos internos rotos: PASS.
- Escritorio: ocho tarjetas visibles sin desbordamiento: PASS.
- Móvil: tres tarjetas visibles y parte de la siguiente: PASS.
- Móvil: ancho del documento igual al viewport, sin desbordamiento global: PASS.
- CTA móvil en tres columnas compactas: PASS.
- Footer móvil en cuadrícula compacta: PASS.
