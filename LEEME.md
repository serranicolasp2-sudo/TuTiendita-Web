# Tu Tiendita IA · Sitios Web & Landings

> **Sitio web oficial:** [tutiendita-ia.store](https://tutiendita-ia.store)  
> Sitios web comerciales, páginas de aterrizaje interactivas y formularios de compra para Tu Tiendita IA.

---

## 🌟 Descripción del Proyecto

**Tu Tiendita IA - Web** reúne las experiencias web frontend diseñadas para la conversión comercial directa de regalos personalizados con inteligencia artificial. Cada producto cuenta con su propio sitio optimizado para dispositivos móviles, con reproductor de audio integrado, comparadores de imagen antes/después y cotizadores en tiempo real.

---

## 🚀 Sitios y Productos

### 1. **Tu Canción (`tucancion/`)**
- **Dominio:** `tucancion.com.ar`
- Canciones personalizadas creadas con IA y producción humana.
- Reproductor de audio HTML5 con muestras reales de baladas, cumbias, boleros y rock.
- Formulario de pedido guiado con preguntas sobre la historia personal, dedicatoria y estilo.
- Página de agradecimiento con seguimiento de estado (`gracias.html`).

### 2. **Restauración de Fotos (`restauraciondefotos/`)**
- **Dominio:** `restauraciondefotos.com.ar`
- Restauración y coloreado de fotos familiares antiguas.
- Selector interactivo de modos de color:
  - *A color* (colores vivos y actuales).
  - *Mantener colores de época* (tonalidad cálida/sepia nostálgica).
  - *En blanco y negro* (grises puros de alta fidelidad).
- Opciones de enmarcado físico: Cuadro Ecocuero, Madera y Marco Negro.
- Comparativa interactiva antes / después.

### 3. **Portal Principal (`index.html`)**
- Puerta de entrada y enrutador a las marcas oficiales del ecosistema.

---

## 🎨 Identidad Visual y Diseño

- **Tipografías:** Bricolage Grotesque, Figtree, Reenie Beanie.
- **Paleta Tu Canción:** Birome `#1E3C96`, Malvón `#E0435C`, Tinta `#16205A`, Papel `#F6F7FA`.
- **Paleta Restauración:** Yema `#FFD23F`, Cinta `#1A1712`, Etiqueta `#FFFAEB`, Rec `#D7301F`.
- **Diseño Mobile-First:** Barra de compra fija en celulares (`movil.css`, `movil.js`).
- **Sistema de Campañas:** Capacidad de alternar entre versión base (`index-base.html`) y campañas especiales (`index-dia-de-la-madre-2026.html`).

---

## ⚙️ Estructura del Proyecto

```text
web/
├── index.html                  # Portal unificado
├── movil.css                   # Optimizaciones de interfaz móvil
├── movil.js                    # Comportamiento de sticky bar y eventos
├── restauraciondefotos/        # Landing y checkout de fotos
│   ├── index.html              # Portada actual (campaña o base)
│   ├── index-base.html         # Versión atemporal para todo el año
│   ├── gracias.html            # Confirmación de compra
│   └── img/                    # Mockups de cuadros y muestras
└── tucancion/                  # Landing y checkout de canciones
    ├── index.html              # Portada actual
    ├── index-base.html         # Versión atemporal
    ├── gracias.html            # Confirmación de compra
    ├── audio/                  # Muestras sonoras MP3
    └── img/                    # Logotipos y recursos SVG
```

---

## 🌐 Identidad de Marca

Este proyecto forma parte del ecosistema oficial de **Tu Tiendita IA**  
Sitio Web: [tutiendita-ia.store](https://tutiendita-ia.store)
