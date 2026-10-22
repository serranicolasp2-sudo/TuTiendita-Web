/*
 * movil.js: en celular (hasta 640 px), barra de compra fija y condiciones plegables. Lo escribió Claude.
 * No toca nada en pantallas grandes.
 */
(function () {
  "use strict";
  if (!window.matchMedia("(max-width: 640px)").matches) return;
  var esCancion = location.pathname.indexOf("/tucancion") !== -1 || location.hostname.indexOf("tucancion") !== -1;
  var esFotos = location.pathname.indexOf("/restauraciondefotos") !== -1 || location.hostname.indexOf("restauraciondefotos") !== -1;
  if (!esCancion && !esFotos) return;

  function puntitos(cont) {
    var items = Array.prototype.filter.call(cont.children, function (c) { return c.offsetWidth > 0; });
    if (items.length < 2) return;
    var barra = document.createElement("div");
    barra.className = "m-puntos";
    var botones = items.map(function (item, i) {
      var b = document.createElement("button");
      b.type = "button";
      b.setAttribute("aria-label", "Ver " + (i + 1) + " de " + items.length);
      b.addEventListener("click", function () {
        cont.scrollTo({ left: item.offsetLeft - items[0].offsetLeft, behavior: "smooth" });
      });
      barra.appendChild(b);
      return b;
    });
    function marcar() {
      var paso = items[1].offsetLeft - items[0].offsetLeft || 1;
      var i = Math.min(items.length - 1, Math.round(cont.scrollLeft / paso));
      if (cont.scrollLeft + cont.clientWidth >= cont.scrollWidth - 4) i = items.length - 1;
      botones.forEach(function (b, j) { b.setAttribute("aria-current", String(j === i)); });
    }
    cont.addEventListener("scroll", marcar, { passive: true });
    cont.parentNode.insertBefore(barra, cont.nextSibling);
    marcar();
  }

  function pasos(form) {
    var hijos = Array.prototype.slice.call(form.children);
    var iTercero = hijos.findIndex(function (c) { return c.querySelector('[name="nombre"]'); });
    var iHistoria = hijos.findIndex(function (c) { return c.querySelector('[name="historia"]'); });
    if (iTercero < 0) return;
    var titulos = esCancion ? ["La canción", "La historia", "Tus datos y pago"] : ["Tu foto", "Envío o canción", "Tus datos y pago"];
    var cajas = titulos.map(function (t, n) {
      var d = document.createElement("div");
      d.className = "m-paso";
      d.dataset.titulo = t;
      return d;
    });
    hijos.forEach(function (c, i) {
      var n = i >= iTercero ? 2
        : esCancion ? (iHistoria >= 0 && i >= iHistoria ? 1 : 0)
        : (c.id === "rf-seccion-envio" || c.id === "rf-seccion-combo" ? 1 : 0);
      cajas[n].appendChild(c);
    });
    var cabecera = document.createElement("div");
    cabecera.className = "m-pasos-cabecera";
    cabecera.innerHTML = '<div class="m-pasos-barra"></div><p class="m-pasos-titulo" tabindex="-1"></p>' +
                         '<p class="m-pasos-error" role="alert" hidden></p>';
    form.appendChild(cabecera);
    cajas.forEach(function (c) { form.appendChild(c); });
    form.classList.add("m-pasos", esCancion ? "m-pasos--tc" : "m-pasos--rf");

    // El paso 2 de fotos solo existe si hay envío (cuadros) o datos de la canción (combo)
    function activos() {
      return cajas.filter(function (c) {
        return Array.prototype.some.call(c.children, function (h) { return !h.hidden && h.className.indexOf("m-pasos-nav") < 0; });
      });
    }
    var actual = 0;
    function mostrar(n, enfocar) {
      var lista = activos();
      actual = Math.max(0, Math.min(n, lista.length - 1));
      cajas.forEach(function (c) { c.hidden = c !== lista[actual]; });
      var barra = cabecera.querySelector(".m-pasos-barra");
      barra.innerHTML = lista.map(function (c, i) { return '<span class="' + (i <= actual ? "m-hecho" : "") + '"></span>'; }).join("");
      var titulo = cabecera.querySelector(".m-pasos-titulo");
      titulo.textContent = "Paso " + (actual + 1) + " de " + lista.length + " · " + lista[actual].dataset.titulo;
      lista.forEach(function (c, i) {
        var nav = c.querySelector(".m-pasos-nav");
        if (!nav) {
          nav = document.createElement("div");
          nav.className = "m-pasos-nav";
          nav.innerHTML = '<button type="button" class="m-atras">← Atrás</button><button type="button" class="m-siguiente">Siguiente →</button>';
          nav.querySelector(".m-atras").addEventListener("click", function () { mostrar(actual - 1, true); });
          nav.querySelector(".m-siguiente").addEventListener("click", function () { if (valido(lista[actual])) mostrar(actual + 1, true); });
          c.appendChild(nav);
        }
        nav.querySelector(".m-atras").hidden = i === 0;
        nav.querySelector(".m-siguiente").hidden = i === lista.length - 1;
      });
      if (enfocar) {
        form.scrollIntoView({ behavior: "smooth", block: "start" });
        titulo.focus({ preventScroll: true });
      }
    }
    function valido(caja) {
      var campos = caja.querySelectorAll("input, select, textarea");
      for (var i = 0; i < campos.length; i++) {
        if (!campos[i].disabled && campos[i].type !== "hidden" && !campos[i].checkValidity()) { campos[i].reportValidity(); return false; }
      }
      var estilos = caja.querySelectorAll('[name="estilos"]');
      if (estilos.length && !Array.prototype.some.call(estilos, function (e) { return e.checked; })) {
        aviso("Elegí al menos un estilo musical.");
        estilos[0].focus();
        return false;
      }
      aviso("");
      return true;
    }
    function aviso(texto) {
      var p = cabecera.querySelector(".m-pasos-error");
      p.textContent = texto;
      p.hidden = !texto;
    }
    function irAlCampo(el) {
      var caja = cajas.find(function (c) { return c.contains(el); });
      var i = activos().indexOf(caja);
      if (i >= 0 && i !== actual) mostrar(i, true);
      setTimeout(function () { el.focus(); }, 300);
    }
    // Errores: los del navegador (campo obligatorio) y los del servidor (tienda.js marca aria-invalid)
    form.addEventListener("invalid", function (e) { irAlCampo(e.target); }, true);
    new MutationObserver(function (cambios) {
      cambios.forEach(function (m) {
        if (m.target.getAttribute("aria-invalid") === "true") {
          var caja = form.querySelector("[data-tienda-error]");
          if (caja && caja.textContent) aviso(caja.textContent);
          irAlCampo(m.target);
        }
      });
    }).observe(form, { subtree: true, attributes: true, attributeFilter: ["aria-invalid"] });
    // Al cambiar de producto, vuelve al paso 1 (cambian los campos de cada paso)
    document.querySelectorAll(".rf-card, .tc-card").forEach(function (c) {
      c.addEventListener("click", function () { setTimeout(function () { mostrar(0); }, 0); });
    });
    mostrar(0);
  }

  document.addEventListener("DOMContentLoaded", function () {
    // 1) Condiciones y preguntas frecuentes plegables: se ve el título y la bajada; el resto se abre con un botón.
    function plegar(seccion, etiqueta) {
      var cont = seccion && seccion.querySelector("div");
      var bloques = cont ? Array.prototype.slice.call(cont.children, 1) : [];
      if (!bloques.length) return;
      bloques.forEach(function (b) { b.classList.add("m-plegado"); });
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "m-desplegar";
      btn.textContent = "Ver " + etiqueta;
      btn.setAttribute("aria-expanded", "false");
      btn.addEventListener("click", function () {
        var abrir = btn.getAttribute("aria-expanded") === "false";
        bloques.forEach(function (b) { b.classList.toggle("m-plegado", !abrir); });
        btn.setAttribute("aria-expanded", String(abrir));
        btn.textContent = (abrir ? "Ocultar " : "Ver ") + etiqueta;
      });
      cont.children[0].appendChild(btn);
    }
    plegar(document.getElementById("condiciones"), "condiciones");
    Array.prototype.forEach.call(document.querySelectorAll("section"), function (s) {
      var h = s.querySelector("h2");
      if (h && /preguntas frecuentes/i.test(h.textContent)) plegar(s, "preguntas frecuentes");
    });

    // 1b) Listas largas en slides: pasos ("Así se pide") y "Qué incluye" / "Qué recibís"
    document.querySelectorAll('section ol[style*="grid-template-columns"]').forEach(function (ol) { ol.classList.add("m-slides"); });
    Array.prototype.forEach.call(document.querySelectorAll("section h2"), function (h) {
      if (!/qué incluye|qué recibís/i.test(h.textContent)) return;
      var lista = h.closest("section").querySelector('div[style*="flex: 2"]');
      if (lista && lista.children.length > 2) lista.classList.add("m-slides", "m-slides--tarjetas");
    });
    // Puntitos debajo de todo lo que se desliza (slides nuevos y carruseles que ya existían)
    document.querySelectorAll('.m-slides, .rf-card-grid, .tc-card-grid, .rf-galeria, section div[style*="minmax(230px"], #muestras div[style*="grid-template-columns"]')
      .forEach(puntitos);
    if (esCancion) {                                   // el resumen de precios repite lo que dicen las tarjetas de compra
      var precios = document.getElementById("precios");
      if (precios) precios.classList.add("m-oculto");
    }

    // 1c) Formulario en pasos (slides): menos pantalla de golpe y un botón "Siguiente" por paso
    var form = document.querySelector("form[data-tienda-form]");
    if (form) pasos(form);

    // 2) Pista de que los productos se deslizan
    document.querySelectorAll(".rf-card-grid, .tc-card-grid").forEach(function (g) {
      if (g.children.length > 1) {
        var p = document.createElement("p");
        p.className = "m-pista";
        p.textContent = "Deslizá para ver más opciones →";
        g.parentNode.insertBefore(p, g);
      }
    });

    // 3) Barra de compra fija: aparece al pasar el encabezado y se esconde cuando el formulario está a la vista
    var destino = esCancion ? "#comprar" : "#precios";
    var barra = document.createElement("div");
    barra.className = "m-barra " + (esCancion ? "m-barra--tc" : "m-barra--rf");
    barra.innerHTML = esCancion
      ? '<span>Canción con su historia<br><b data-precio="tc-cancion">$26.999</b> · en menos de 48 h</span><a href="' + destino + '">Pedí la tuya</a>'
      : '<span>Restauración de fotos<br>desde <b data-precio="rf-foto-1">$4.999</b> · en menos de 2 h</span><a href="' + destino + '">Pedir ahora</a>';
    document.body.appendChild(barra);
    // El precio lo pinta tienda.js con el del servidor (si ya lo tiene; si no, lo pinta cuando llega)
    if (window.Tienda && window.Tienda.pintarPrecios) window.Tienda.pintarPrecios(barra);
    barra.querySelector("a").addEventListener("click", function (ev) {
      var f = document.querySelector("form[data-tienda-form]") || document.querySelector(destino);
      if (f) { ev.preventDefault(); f.scrollIntoView({ behavior: "smooth", block: "start" }); }
    });
    document.body.classList.add("m-con-barra");

    var heroVisible = true, formVisible = false;
    function actualizar() { barra.classList.toggle("m-visible", !heroVisible && !formVisible); }
    if ("IntersectionObserver" in window) {
      var hero = document.querySelector("section");
      var form = document.querySelector("form[data-tienda-form]");
      if (hero) new IntersectionObserver(function (e) { heroVisible = e[0].isIntersecting; actualizar(); }).observe(hero);
      if (form) new IntersectionObserver(function (e) { formVisible = e[0].isIntersecting; actualizar(); }, { threshold: 0.05 }).observe(form);
    } else {
      barra.classList.add("m-visible");
    }
  });
})();
