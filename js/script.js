document.addEventListener("DOMContentLoaded", () => {

    // =================================
    // MENÚ PARA MÓVILES
    // =================================

    const menuToggle = document.getElementById("menu-toggle");
    const mainNav = document.getElementById("main-nav");

    if (menuToggle && mainNav) {

        menuToggle.addEventListener("click", () => {
            const isOpen = mainNav.classList.toggle("is-open");

            menuToggle.setAttribute("aria-expanded", String(isOpen));
            menuToggle.setAttribute(
                "aria-label",
                isOpen ? "Cerrar menú" : "Abrir menú"
            );
        });

        mainNav.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => {
                mainNav.classList.remove("is-open");
                menuToggle.setAttribute("aria-expanded", "false");
                menuToggle.setAttribute("aria-label", "Abrir menú");
            });
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                mainNav.classList.remove("is-open");
                menuToggle.setAttribute("aria-expanded", "false");
                menuToggle.setAttribute("aria-label", "Abrir menú");
            }
        });
    }


    // =================================
    // CARRUSEL DE FOTOGRAFÍAS
    // =================================

    const viewport = document.getElementById("gallery-viewport");
    const track = document.getElementById("gallery-track");
    const previousButton = document.getElementById("gallery-prev");
    const nextButton = document.getElementById("gallery-next");
    const dotsContainer = document.getElementById("gallery-dots");

    if (
        viewport &&
        track &&
        previousButton &&
        nextButton &&
        dotsContainer
    ) {
        const items = Array.from(track.querySelectorAll(".gallery-item"));

        let currentIndex = 0;
        let visibleItems = 1;
        let maxIndex = 0;
        let itemStep = 0;

        // Número de fotografías visibles según el tamaño de pantalla
        function getVisibleItems() {
            if (window.innerWidth <= 700) {
                return 1;
            }

            if (window.innerWidth <= 950) {
                return 2;
            }

            return 3;
        }

        // Calcular las medidas y el límite del carrusel
        function calculateGallery() {
            visibleItems = getVisibleItems();

            maxIndex = Math.max(0, items.length - visibleItems);

            // Asegurarnos de que el índice nunca salga de los límites
            currentIndex = Math.max(
                0,
                Math.min(currentIndex, maxIndex)
            );

            if (items.length > 0) {
                const itemWidth = items[0].getBoundingClientRect().width;
                const styles = window.getComputedStyle(track);
                const gap = parseFloat(styles.columnGap) || 0;

                itemStep = itemWidth + gap;
            } else {
                itemStep = 0;
            }

            createDots();
            updateGallery();
        }

        // Crear un punto por cada posición disponible
        function createDots() {
            dotsContainer.innerHTML = "";

            const numberOfDots = maxIndex + 1;

            for (let index = 0; index < numberOfDots; index++) {
                const dot = document.createElement("button");

                dot.type = "button";
                dot.className = "gallery-dot";
                dot.setAttribute(
                    "aria-label",
                    `Mostrar fotografías desde la posición ${index + 1}`
                );

                dot.addEventListener("click", () => {
                    goToIndex(index);
                });

                dotsContainer.appendChild(dot);
            }
        }

        // Actualizar la posición, los puntos y las flechas
        function updateGallery() {

            // Volver a limitar el índice antes de mover la galería
            currentIndex = Math.max(
                0,
                Math.min(currentIndex, maxIndex)
            );

            track.style.transform =
                `translateX(-${currentIndex * itemStep}px)`;

            // Desactivar las flechas cuando no se puede avanzar
            previousButton.disabled = currentIndex === 0;
            nextButton.disabled = currentIndex >= maxIndex;

            previousButton.setAttribute(
                "aria-disabled",
                String(previousButton.disabled)
            );

            nextButton.setAttribute(
                "aria-disabled",
                String(nextButton.disabled)
            );

            // Actualizar los puntos indicadores
            const dots = dotsContainer.querySelectorAll(".gallery-dot");

            dots.forEach((dot, index) => {
                const active = index === currentIndex;

                dot.classList.toggle("active", active);

                if (active) {
                    dot.setAttribute("aria-current", "true");
                } else {
                    dot.removeAttribute("aria-current");
                }
            });
        }

        // Ir a una posición válida sin superar los extremos
        function goToIndex(index) {
            currentIndex = Math.max(
                0,
                Math.min(index, maxIndex)
            );

            updateGallery();
        }

        // Flecha anterior
        previousButton.addEventListener("click", () => {
            if (currentIndex <= 0) {
                updateGallery();
                return;
            }

            goToIndex(currentIndex - 1);
        });

        // Flecha siguiente
        nextButton.addEventListener("click", () => {
            if (currentIndex >= maxIndex) {
                updateGallery();
                return;
            }

            goToIndex(currentIndex + 1);
        });

        // Navegación mediante las flechas del teclado
        viewport.setAttribute("tabindex", "0");
        viewport.setAttribute(
            "aria-label",
            "Galería de fotografías. Usa las flechas del teclado para navegar."
        );

        viewport.addEventListener("keydown", (event) => {
            if (event.key === "ArrowLeft") {
                event.preventDefault();
                goToIndex(currentIndex - 1);
            }

            if (event.key === "ArrowRight") {
                event.preventDefault();
                goToIndex(currentIndex + 1);
            }
        });

        // Recalcular al cambiar el tamaño de la ventana
        let resizeTimer;

        window.addEventListener("resize", () => {
            clearTimeout(resizeTimer);

            resizeTimer = setTimeout(() => {
                calculateGallery();
            }, 100);
        });

        // Inicializar el carrusel
        calculateGallery();

        // Recalcular cuando las imágenes hayan terminado de cargar
        window.addEventListener("load", calculateGallery);
    }


    // =================================
    // AÑO AUTOMÁTICO DEL PIE DE PÁGINA
    // =================================

    const yearElement = document.getElementById("current-year");

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

});