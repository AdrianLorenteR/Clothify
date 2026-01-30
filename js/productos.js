/**
 * productos.js - Dynamic gallery for the clothing store.
 * Add your image paths to the product objects when ready; image slots are prepared.
 */
(function () {
    'use strict';

    var yearEl = document.getElementById('year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    // Gallery containers: inicio, hombre, mujer, ninos
    var galleryIds = ['gallery', 'gallery-hombre', 'gallery-mujer', 'gallery-ninos'];

    // Product data per section. Set "image" to your path when ready (e.g. "img/camiseta-1.jpg")
    var productsBySection = {
        'gallery': [
            { name: 'Sudadera básica', price: '24,99', image: '../img/sudadera1.jpg' },
            { name: 'Pantalón relaxed', price: '49,99', image: '../img/pantalon1.jpg' },
            { name: 'Top mujer', price: '59,99', image: '../img/top1.jpg' },
            { name: 'Vestido casual', price: '39,99', image: '../img/vestido1.jpg' },
            { name: 'Chaqueta punto', price: '79,99', image: '../img/chaqueta1.jpg' },
            { name: 'Jeans mujer', price: '29,99', image: '../img/jeans.jpg' }
        ],
        'gallery-hombre': [
            { name: 'Camiseta hombre', price: '22,99', image: '../img/camiseta2.jpg' },
            { name: 'Pantalón chino', price: '54,99', image: '../img/pantalon2.jpg' },
            { name: 'Sudadera hombre', price: '49,99', image: '../img/sudadera2.jpg' },
            { name: 'Chaqueta hombre', price: '89,99', image: '../img/chaqueta2.jpg' }
        ],
        'gallery-mujer': [
            { name: 'Blusa mujer', price: '29,99', image: '../img/blusa1.jpg' },
            { name: 'Vestido mujer', price: '44,99', image: '../img/vestido2.jpg' },
            { name: 'Falda', price: '34,99', image: '../img/falda1.jpg' },
            { name: 'Chaqueta mujer', price: '79,99', image: '../img/chaqueta3.jpg' }
        ],
        'gallery-ninos': [
            { name: 'Camiseta niño', price: '14,99', image: '../img/camiseta3.jpg' },
            { name: 'Pantalón niño', price: '24,99', image: '../img/pantalon3.jpg' },
            { name: 'Vestido niña', price: '19,99', image: '../img/vestido3.jpg' },
            { name: 'Chaqueta niña', price: '39,99', image: '../img/chaqueta4.jpg' }
        ]
    };

    function escapeHtml(text) {
        var div = document.createElement('div');
        div.textContent = text == null ? '' : String(text);
        return div.innerHTML;
    }

    var lightboxEl = document.getElementById('lightbox');
    var lightboxImg = document.getElementById('lightbox-img');
    var lightboxCaption = document.getElementById('lightbox-caption');

    function openLightbox(imageSrc, productName) {
        if (!lightboxEl) return;
        if (imageSrc && lightboxImg) {
            lightboxImg.src = imageSrc;
            lightboxImg.alt = productName || '';
            lightboxImg.style.display = '';
        } else if (lightboxImg) {
            lightboxImg.src = '';
            lightboxImg.style.display = 'none';
        }
        if (lightboxCaption) {
            lightboxCaption.textContent = productName || 'Sin imagen';
        }
        lightboxEl.classList.add('is-open');
        lightboxEl.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        if (!lightboxEl) return;
        lightboxEl.classList.remove('is-open');
        lightboxEl.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        if (lightboxImg) {
            lightboxImg.src = '';
            lightboxImg.style.display = '';
        }
    }

    function setupLightbox() {
        if (!lightboxEl) return;
        var backdrop = lightboxEl.querySelector('.lightbox-backdrop');
        var closeBtn = lightboxEl.querySelector('.lightbox-close');
        if (backdrop) backdrop.addEventListener('click', closeLightbox);
        if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && lightboxEl.classList.contains('is-open')) {
                closeLightbox();
            }
        });
    }

    function buildGalleryItem(product) {
        var card = document.createElement('article');
        card.className = 'gallery-item';
        card.setAttribute('role', 'listitem');

        var imageWrap = document.createElement('div');
        imageWrap.className = 'gallery-item-image';

        if (product.image) {
            var img = document.createElement('img');
            img.src = product.image;
            img.alt = escapeHtml(product.name);
            imageWrap.appendChild(img);
        }

        imageWrap.addEventListener('click', function () {
            openLightbox(product.image || '', product.name);
        });

        var info = document.createElement('div');
        info.className = 'gallery-item-info';
        info.innerHTML =
            '<h3 class="gallery-item-title">' + escapeHtml(product.name) + '</h3>' +
            '<p class="gallery-item-price">' + escapeHtml(product.price) + ' €</p>';

        card.appendChild(imageWrap);
        card.appendChild(info);
        return card;
    }

    function renderGallery(containerEl, products) {
        if (!containerEl || !Array.isArray(products)) return;
        containerEl.innerHTML = '';
        products.forEach(function (product) {
            containerEl.appendChild(buildGalleryItem(product));
        });
    }

    setupLightbox();

    galleryIds.forEach(function (id) {
        var el = document.getElementById(id);
        var products = productsBySection[id];
        if (el && products) {
            renderGallery(el, products);
        }
    });

    
    var scrollDuration = 1200;
    var nav = document.querySelector('.main-nav');
    if (nav) {
        nav.addEventListener('click', function (e) {
            var link = e.target.closest('a[href^="#"]');
            if (!link || !link.hash) return;
            var id = link.hash.slice(1);
            var target = document.getElementById(id);
            if (!target) return;
            e.preventDefault();

            var startY = window.scrollY || window.pageYOffset;
            var targetRect = target.getBoundingClientRect();
            var targetY = startY + targetRect.top;
            var headerOffset = 64;
            targetY = Math.max(0, targetY - headerOffset);

            var startTime = null;

            function easeInOutCubic(t) {
                return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
            }

            function step(now) {
                if (startTime === null) startTime = now;
                var elapsed = now - startTime;
                var progress = Math.min(elapsed / scrollDuration, 1);
                var eased = easeInOutCubic(progress);
                var currentY = startY + (targetY - startY) * eased;
                window.scrollTo(0, currentY);
                if (progress < 1) {
                    requestAnimationFrame(step);
                }
            }

            requestAnimationFrame(step);
        });
    }
})();
