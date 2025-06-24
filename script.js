document.addEventListener('DOMContentLoaded', function () {
    // Actualizar año en el footer
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // Scroll suave para enlaces del navbar (si CSS scroll-behavior no es suficiente o para control extra)
    // CSS `scroll-behavior: smooth;` ya lo maneja para la mayoría de los casos.
    // Si se necesita JS:
    /*
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    // Cierra el menú hamburguesa si está abierto (en móviles)
                    const navbarToggler = document.querySelector('.navbar-toggler');
                    const navbarCollapse = document.querySelector('.navbar-collapse');
                    if (navbarToggler && navbarCollapse.classList.contains('show')) {
                        bootstrap.Collapse.getInstance(navbarCollapse)?.hide() || new bootstrap.Collapse(navbarCollapse, {hide: true})
                    }
                    
                    // Scroll
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    */

    // Validación del formulario de contacto
    const contactForm = document.getElementById('contactForm');
    const emailInput = document.getElementById('email');
    const emailError = document.getElementById('emailError');
    const confirmacionModalElement = document.getElementById('confirmacionModal');
    const confirmacionModal = new bootstrap.Modal(confirmacionModalElement);
    const modalBodyContent = document.getElementById('modalBodyContent');
    const procederConEnvioBtn = document.getElementById('procederConEnvio');

    let formDataForMailto = {};

    if (contactForm) {
        contactForm.addEventListener('submit', function (event) {
            event.preventDefault(); // Siempre prevenir el envío por defecto primero
            
            // Resetear validación de email personalizado
            emailInput.classList.remove('is-invalid');
            emailError.textContent = 'Por favor, ingresa un correo válido.'; // Mensaje por defecto

            if (!contactForm.checkValidity()) {
                event.stopPropagation();
                // Validar email con regex más específico si es necesario
                if (emailInput.value && !isValidEmail(emailInput.value)) {
                    emailInput.classList.add('is-invalid');
                    emailError.textContent = 'El formato del correo electrónico no es válido.';
                }
            } else if (emailInput.value && !isValidEmail(emailInput.value)) {
                // Si checkValidity() pasa pero el email es inválido según nuestra regex
                event.stopPropagation();
                emailInput.classList.add('is-invalid');
                emailError.textContent = 'El formato del correo electrónico no es válido.';
            } else {
                // Formulario válido
                const nombre = document.getElementById('nombre').value;
                const email = emailInput.value;
                const mensaje = document.getElementById('mensaje').value;

                formDataForMailto = { nombre, email, mensaje };

                // Actualizar contenido del modal
                modalBodyContent.innerHTML = `
                    <p>¡Hola, <strong>${nombre}</strong>! 👋</p>
                    <p>Hemos preparado tu mensaje para ser enviado. Revisa los detalles y haz clic en "Enviar Ahora por Correo" para abrir tu aplicación de correo.</p>
                    <p><strong>Destinatario:</strong> info@amigospeludos.do (simulado)</p>
                    <p><strong>Asunto:</strong> Consulta desde la Página Web</p>
                    <p>¡Gracias por contactarnos! 📬</p>
                `;
                confirmacionModal.show();
            }
            contactForm.classList.add('was-validated');
        });
    }

    if (procederConEnvioBtn) {
        procederConEnvioBtn.addEventListener('click', function() {
            const { nombre, email, mensaje } = formDataForMailto;
            const mailtoSubject = encodeURIComponent("Consulta desde la Página Web - " + nombre);
            const mailtoBody = encodeURIComponent(
                `Nombre: ${nombre}\n` +
                `Email: ${email}\n\n` +
                `Mensaje:\n${mensaje}\n\n` +
                `---------------------------------\nEnviado desde el formulario de contacto de la web.`
            );
            const mailtoLink = `mailto:info@amigospeludos.do?subject=${mailtoSubject}&body=${mailtoBody}`;
            
            window.location.href = mailtoLink;
            
            confirmacionModal.hide();
            contactForm.reset();
            contactForm.classList.remove('was-validated');
        });
    }

    // Función para validar email
    function isValidEmail(email) {
        // Regex simple para validación de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Inicializar carrusel de testimonios (si no se usa data-bs-ride="carousel")
    // const testimonialCarouselElement = document.querySelector('#testimonialCarousel');
    // if (testimonialCarouselElement) {
    //     const testimonialCarousel = new bootstrap.Carousel(testimonialCarouselElement, {
    //         interval: 5000, // Cambia cada 5 segundos
    //         wrap: true // Vuelve al principio cuando llega al final
    //     });
    // }
    // Con data-bs-ride="carousel" no es necesario inicializarlo en JS, Bootstrap lo hace.

});