document.addEventListener("DOMContentLoaded", function () {
  // --- 1. CONFIGURACIÓN INICIAL ---
  window.scrollTo(0, 0); // Forzar el scroll hacia arriba al recargar la página
  if (history.scrollRestoration) {
    history.scrollRestoration = "manual"; // Evitar que el navegador restaure la posición del scroll por defecto
  }

  // --- 2. SELECCIÓN DE ELEMENTOS DEL DOM ---
  const hamburger = document.querySelector(".hamburger");
  const navMenu = document.querySelector(".nav-menu");
  const navLinks = document.querySelectorAll(".nav-menu a");
  const contactForm = document.getElementById("contactForm");
  const themeToggle = document.getElementById("theme-toggle");

  // --- 3. LÓGICA DEL MODO CLARO/OSCURO ---
  // Evento al hacer click en el botón del tema (sol/luna)
  themeToggle.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";

    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme); // Guardar la preferencia en el ordenador del usuario
  });

  // Escuchar a los cambios del tema del sistema operativo en tiempo real
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (e) => {
      if (!localStorage.getItem("theme")) {
        // Sólo cambiamos el tema automáticamente si el usuario no ha forzado uno manualmente
        document.documentElement.setAttribute(
          "data-theme",
          e.matches ? "dark" : "light"
        );
      }
    });

  // --- 4. LÓGICA DEL MENÚ HAMBURGUESA (MÓVIL) ---
  // Abrir y cerrar el menú al hacer click en el icono de las barras
  hamburger.addEventListener("click", function () {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
  });

  // Cerrar el menú automáticamente cuando se hace click en un enlace
  navLinks.forEach((link) => {
    link.addEventListener("click", function () {
      hamburger.classList.remove("active");
      navMenu.classList.remove("active");
    });
  });

  // --- 5. ANIMACIONES DE DESPLAZAMIENTO (INTERSECTION OBSERVER) ---
  const observerOptions = {
    threshold: 0.1, // La animación salta cuando el elemento es un 10% visible
    rootMargin: "0px 0px -100px 0px",
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, observerOptions);

  // Animar las secciones principales
  const sections = document.querySelectorAll("section");
  sections.forEach((section) => {
    section.style.opacity = "0";
    section.style.transform = "translateY(20px)";
    section.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(section);
  });

  // Animar las tarjetas de habilidades con un efecto en cascada (stagger)
  const skillCards = document.querySelectorAll(".skill-card");
  skillCards.forEach((card, index) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(20px)";
    card.style.transition = `opacity 0.4s ease ${index * 0.05}s, transform 0.4s ease ${index * 0.05}s`;

    const cardObserver = new IntersectionObserver(function (entries) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
        }
      });
    }, observerOptions);

    cardObserver.observe(card);
  });

  // --- 6. LÓGICA DEL FORMULARIO DE CONTACTO ---
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault(); // Evita que la página se recargue

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const message = document.getElementById("message").value;

    const subject = `Contacto Portfolio - ${name}`;
    const body = `Nombre: ${name}%0D%0AEmail: ${email}%0D%0A%0D%0AMensaje:%0D%0A${message}`;

    // Abrir el cliente de correo del usuario (Outlook, Mail, etc) con los datos rellenados
    window.location.href = `mailto:castanosblanco@gmail.com?subject=${subject}&body=${body}`;

    contactForm.reset();
  });

  // --- 7. DESPLAZAMIENTO SUAVE PARA ENLACES (SMOOTH SCROLL) ---
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        const offset = 80; // Compensar la altura de la cabecera (header fija)
        const targetPosition = target.offsetTop - offset;
        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    });
  });

  // --- 8. SEGUIMIENTO DEL RATÓN PARA EL BRILLO DINÁMICO (GLOW EFFECT) ---
  const handleOnMouseMove = e => {
      const { currentTarget: target } = e;
      // Calcula exactamente las coordenadas X e Y del ratón dentro de la tarjeta
      const rect = target.getBoundingClientRect(),
            x = e.clientX - rect.left,
            y = e.clientY - rect.top;
            
      // Transfiere esas coordenadas a variables CSS para el radial-gradient
      target.style.setProperty("--mouse-x", `${x}px`);
      target.style.setProperty("--mouse-y", `${y}px`);
  };

  for(const card of document.querySelectorAll(".project-card, .skill-card, .stat-card")) {
      card.addEventListener('mousemove', handleOnMouseMove);
  }

});
