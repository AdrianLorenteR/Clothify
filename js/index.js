
(function () {
    'use strict';

    var container = document.getElementById('noticias-container');
    var yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    /* snap entre secciones */
    function scrollToSection(id, smooth) {
        var target = document.getElementById(id);
        if (!target) return;
        target.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' });
    }

    document.addEventListener('click', function (e) {
        var a = e.target.closest('a[href^="#"]');
        if (!a) return;
        var href = a.getAttribute('href');
        if (href === '#') return;
        var id = href.slice(1);
        if (!document.getElementById(id)) return;
        e.preventDefault();
        scrollToSection(id, true);
    });

    if (location.hash) {
        var id = location.hash.slice(1);
        if (document.getElementById(id)) scrollToSection(id, false);
    }

    if (!container) return;

    var xhr = new XMLHttpRequest();
    xhr.open('GET', '../data/noticias.json', true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState !== 4) return;
        if (xhr.status === 200) {
            try {
                var data = JSON.parse(xhr.responseText);
                renderNoticias(data);
            } catch (e) {
                container.innerHTML = '<p>Error al cargar las noticias.</p>';
            }
        } else {
            container.innerHTML = '<p>No se pudieron cargar las noticias.</p>';
        }
    };
    xhr.send();

    function renderNoticias(data) {
        var raw = data.noticias || data;
        if (!Array.isArray(raw) || raw.length === 0) {
            container.innerHTML = '<p>No hay noticias disponibles.</p>';
            return;
        }
        var noticias = raw.slice(0, 3);
        var html = '';
        noticias.forEach(function (n) {
            html += '<article class="noticia-card">';
            if (n.fecha) html += '<time class="noticia-fecha" datetime="' + escapeHtml(n.fecha) + '">' + escapeHtml(n.fecha) + '</time>';
            html += '<h3>' + escapeHtml(n.titulo || '') + '</h3>';
            if (n.contenido) html += '<p>' + escapeHtml(n.contenido) + '</p>';
            html += '</article>';
        });
        container.innerHTML = html;
    }

    function escapeHtml(text) {
        var div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
})();
