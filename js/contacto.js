/**
 * contacto.js - Mapa dinámico (OpenStreetMap) y ruta hasta el cliente
 */
(function () {
    'use strict';

    
    var NEGOCIO = {
        nombre: 'Proyecto',
        lat: 36.4667,
        lon: -6.1989,
        direccion: 'Calle Real 123, 11100 San Fernando (Cádiz)'
    };

    var map = null;
    var markerNegocio = null;
    var rutaLayer = null;

    var container = document.getElementById('map-container');
    var yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    function initMap() {
        if (!container) return;

        map = L.map('map-container').setView([NEGOCIO.lat, NEGOCIO.lon], 15);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

        markerNegocio = L.marker([NEGOCIO.lat, NEGOCIO.lon])
            .addTo(map)
            .bindPopup('<strong>' + NEGOCIO.nombre + '</strong><br>' + NEGOCIO.direccion);
    }

    function quitarRuta() {
        if (rutaLayer && map) {
            map.removeLayer(rutaLayer);
            rutaLayer = null;
        }
    }

    function dibujarRuta(coordOrigen, coordDestino) {
        quitarRuta();
        var url = 'https://router.project-osrm.org/route/v1/driving/'
            + coordOrigen.lon + ',' + coordOrigen.lat + ';'
            + coordDestino.lon + ',' + coordDestino.lat
            + '?overview=full&geometries=geojson';

        fetch(url)
            .then(function (res) { return res.json(); })
            .then(function (data) {
                if (data.code !== 'Ok' || !data.routes || !data.routes[0]) {
                    alert('No se pudo calcular la ruta. Intenta de nuevo.');
                    return;
                }
                var coords = data.routes[0].geometry.coordinates.map(function (c) { return [c[1], c[0]]; });
                rutaLayer = L.polyline(coords, { color: '#2563eb', weight: 5, opacity: 0.8 }).addTo(map);
                map.fitBounds(rutaLayer.getBounds(), { padding: [30, 30] });
            })
            .catch(function () {
                alert('Error al calcular la ruta. Comprueba tu conexión.');
            });
    }

    function pedirUbicacionYCalcularRuta() {
        var btn = document.getElementById('btn-ruta');
        if (btn) {
            btn.disabled = true;
            btn.textContent = 'Obteniendo tu ubicación…';
        }
        if (!navigator.geolocation) {
            alert('Tu navegador no soporta geolocalización.');
            if (btn) { btn.disabled = false; btn.textContent = 'Cómo llegar desde mi ubicación'; }
            return;
        }
        navigator.geolocation.getCurrentPosition(
            function (pos) {
                var lat = pos.coords.latitude;
                var lon = pos.coords.longitude;
                dibujarRuta({ lat: lat, lon: lon }, { lat: NEGOCIO.lat, lon: NEGOCIO.lon });
                if (btn) {
                    btn.disabled = false;
                    btn.textContent = 'Cómo llegar desde mi ubicación';
                }
            },
            function () {
                alert('No se pudo obtener tu ubicación. Revisa los permisos del navegador.');
                if (btn) {
                    btn.disabled = false;
                    btn.textContent = 'Cómo llegar desde mi ubicación';
                }
            }
        );
    }

    if (container) {
        initMap();
        var btnRuta = document.getElementById('btn-ruta');
        if (btnRuta) btnRuta.addEventListener('click', pedirUbicacionYCalcularRuta);
    }
})();
