/**
 * presupuesto.js - Lógica de la página Presupuesto
 */
(function () {
    'use strict';
    var form = document.querySelector("form");
    if (!form) return;

    
    var fields = [
        {
            el: document.getElementById("nombre"),
            validate: v => /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü]{1,15}$/.test(v),
            msg: "El nombre solo admite letras (sin espacios) y máximo 15 caracteres."
        },
        {
            el: document.getElementById("apellidos"),
            validate: v => /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü]{1,40}$/.test(v),
            msg: "Los apellidos solo admiten letras (sin espacios) y máximo 40 caracteres."
        },
        {
            el: document.getElementById("telefono"),
            validate: v => /^\d{1,9}$/.test(v),
            msg: "El teléfono debe contener solo números y hasta 9 dígitos."
        },
        {
            el: document.getElementById("email"),
            validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
            msg: "Introduce un correo electrónico válido."
        }
    ];

    function showError(input, msg) {
        var parent = input.parentElement, span = parent.querySelector('.error-msg');
        if (!span) {
            span = document.createElement('span');
            span.className = 'error-msg';
            span.style.color = 'red';
            span.style.fontSize = '0.9em';
            parent.appendChild(span);
        }
        span.textContent = msg;
    }

    function clearError(input) {
        var parent = input.parentElement, span = parent.querySelector('.error-msg');
        if (span) parent.removeChild(span);
    }

    // Validación en tiempo real del campo Nombre: error si hay números, máximo 15 letras
    var nombreField = document.getElementById("nombre");
    if (nombreField) {
        nombreField.addEventListener('input', function () {
            var val = this.value;
            if (val.length > 15) {
                this.value = val.slice(0, 15);
            }
            val = this.value.trim();
            if (/\d/.test(val)) {
                showError(this, "El nombre no puede contener números.");
            } else {
                clearError(this);
            }
        });
    }

    // Validación en tiempo real del campo Apellidos: solo letras, máximo 40
    var apellidosField = document.getElementById("apellidos");
    var apellidosLettersOnly = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü]*$/;
    if (apellidosField) {
        apellidosField.addEventListener('input', function () {
            var val = this.value;
            if (val.length > 40) {
                this.value = val.slice(0, 40);
            }
            val = this.value.trim();
            if (val && !apellidosLettersOnly.test(val)) {
                showError(this, "Los apellidos solo admiten letras (sin espacios) y máximo 40 caracteres.");
            } else {
                clearError(this);
            }
        });
    }

    // Validación en tiempo real del campo Teléfono: solo números, máximo 9
    var telefonoField = document.getElementById("telefono");
    if (telefonoField) {
        telefonoField.addEventListener('input', function () {
            this.value = this.value.replace(/\D/g, '').slice(0, 9);
            clearError(this);
        });
    }

    // Validación en tiempo real del campo Correo electrónico
    var emailField = document.getElementById("email");
    var emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailField) {
        emailField.addEventListener('input', function () {
            var val = this.value.trim();
            if (val && !emailValid.test(val)) {
                showError(this, "Introduce un correo electrónico válido (ej: nombre@dominio.com).");
            } else {
                clearError(this);
            }
        });
    }

    // Presupuesto final con descuento según plazo 
    var productoSelect = document.getElementById("producto");
    var plazoValor = document.getElementById("plazo_valor");
    var plazoUnidad = document.getElementById("plazo_unidad");
    var presupuestoFinalEl = document.getElementById("presupuesto_final");
    var plazoDescuentoInfo = document.getElementById("plazo_descuento_info");

    function updatePresupuestoFinal() {
        if (!presupuestoFinalEl) return;
        var base = 0;
        var opt = productoSelect && productoSelect.options[productoSelect.selectedIndex];
        if (opt && opt.value && opt.dataset.precio) {
            base = parseInt(opt.dataset.precio, 10) || 0;
        }
        var extras = form.querySelectorAll('input[name="extras"]:checked');
        for (var i = 0; i < extras.length; i++) {
            var p = extras[i].dataset.precio;
            if (p) base += parseInt(p, 10) || 0;
        }
        var mesesEquivalentes = 0;
        var valor = plazoValor ? parseInt(plazoValor.value, 10) : 0;
        if (plazoUnidad && plazoUnidad.value === 'meses' && valor >= 0) {
            mesesEquivalentes = valor;
        } else if (plazoUnidad && plazoUnidad.value === 'dias' && valor >= 0) {
            mesesEquivalentes = valor / 30;
        }
        var descuentoPorcentaje = Math.min(Math.floor(mesesEquivalentes * 5), 25);
        var finalPrice = base * (1 - descuentoPorcentaje / 100);
        presupuestoFinalEl.value = base === 0 ? '' : Math.round(finalPrice) + ' €';
        if (plazoDescuentoInfo) {
            plazoDescuentoInfo.textContent = descuentoPorcentaje > 0 ? ' (Descuento ' + descuentoPorcentaje + '% por plazo)' : '';
        }
    }

    if (productoSelect) productoSelect.addEventListener('change', updatePresupuestoFinal);
    if (plazoValor) plazoValor.addEventListener('input', updatePresupuestoFinal);
    if (plazoValor) plazoValor.addEventListener('change', updatePresupuestoFinal);
    if (plazoUnidad) plazoUnidad.addEventListener('change', updatePresupuestoFinal);
    form.querySelectorAll('input[name="extras"]').forEach(function (cb) {
        cb.addEventListener('change', updatePresupuestoFinal);
    });
    updatePresupuestoFinal();

    form.addEventListener('submit', function (e) {
        var valid = true;
        fields.forEach(f => {
            clearError(f.el);
            if (!f.validate(f.el.value.trim())) {
                showError(f.el, f.msg);
                valid = false;
            }
        });
        if (!valid) e.preventDefault();
    });

})();
    