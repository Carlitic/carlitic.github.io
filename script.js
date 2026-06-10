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
        entry.target.style.transform = "translateX(0)";
      }
    });
  }, observerOptions);

  // Animar las secciones principales
  const sections = document.querySelectorAll("section");
  sections.forEach((section) => {
    section.style.opacity = "0";
    section.style.transform = "translateX(-80px)";
    section.style.transition = "opacity 1s cubic-bezier(0.16, 1, 0.3, 1), transform 1s cubic-bezier(0.16, 1, 0.3, 1)";
    observer.observe(section);
  });

  // Animar las tarjetas de habilidades con un efecto en cascada (stagger)
  const skillCards = document.querySelectorAll(".skill-card");
  skillCards.forEach((card, index) => {
    card.style.opacity = "0";
    card.style.transform = "translateX(-40px)";
    card.style.transition = `opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.05}s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.05}s`;

    const cardObserver = new IntersectionObserver(function (entries) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateX(0)";
        }
      });
    }, observerOptions);

    cardObserver.observe(card);
  });

  // Animar los ítems de la trayectoria (timeline) con efecto de cascada
  const timelineItems = document.querySelectorAll(".timeline-item");
  timelineItems.forEach((item, index) => {
    item.style.opacity = "0";
    item.style.transform = "translateX(-50px)";
    item.style.transition = `opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.12}s, transform 0.9s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.12}s`;

    const itemObserver = new IntersectionObserver(function (entries) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateX(0)";
        }
      });
    }, observerOptions);

    itemObserver.observe(item);
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

  for(const card of document.querySelectorAll(".project-card, .skill-card, .stat-card, .timeline-card, .contact-item, .contact-form")) {
      card.addEventListener('mousemove', handleOnMouseMove);
      card.addEventListener('mouseleave', () => {
        card.style.setProperty("--mouse-x", "0px");
        card.style.setProperty("--mouse-y", "0px");
      });
  }

  // --- 9. LÓGICA DEL CURSOR SEGUIDOR PERSONALIZADO (RASTRO DE PARTÍCULAS) ---
  const cursorDot = document.querySelector(".custom-cursor-dot");

  let mouseX = -100, mouseY = -100; // Iniciar fuera de la pantalla
  let dotX = -100, dotY = -100;
  let lastX = -100, lastY = -100;

  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Calcular distancia desde la última partícula generada
    const dx = mouseX - lastX;
    const dy = mouseY - lastY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Crear partícula si se movió más de 12px
    if (distance > 12) {
      createTrailParticle(mouseX, mouseY);
      lastX = mouseX;
      lastY = mouseY;
    }
  });

  // Función para crear partículas
  const createTrailParticle = (x, y) => {
    if (window.matchMedia("(hover: none) and (pointer: coarse)").matches) return;

    const particle = document.createElement("div");
    particle.className = "cursor-trail-particle";
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    
    if (cursorDot && cursorDot.classList.contains("hovering")) {
      particle.style.width = "8px";
      particle.style.height = "8px";
    }

    document.body.appendChild(particle);

    // Eliminar la partícula cuando termine la animación (500ms)
    setTimeout(() => {
      particle.remove();
    }, 500);
  };

  const animateCursor = () => {
    // Interpolación para suavizar el movimiento (efecto de arrastre)
    dotX += (mouseX - dotX) * 0.25;
    dotY += (mouseY - dotY) * 0.25;

    if (cursorDot) {
      cursorDot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0) translate(-50%, -50%)`;
    }

    requestAnimationFrame(animateCursor);
  };
  requestAnimationFrame(animateCursor);

  // Agrandar cursor al pasar por encima de elementos interactivos
  const hoverSelectors = "a, button, .project-card, .skill-card, .timeline-card, .stat-card, .contact-item, input, textarea, .theme-toggle, .hamburger";
  document.querySelectorAll(hoverSelectors).forEach(el => {
    el.addEventListener("mouseenter", () => {
      if (cursorDot) cursorDot.classList.add("hovering");
    });
    el.addEventListener("mouseleave", () => {
      if (cursorDot) cursorDot.classList.remove("hovering");
    });
  });

  // Ocultar cursor al salir de la pantalla
  document.addEventListener("mouseleave", () => {
    if (cursorDot) cursorDot.style.opacity = "0";
  });
  document.addEventListener("mouseenter", () => {
    if (cursorDot) cursorDot.style.opacity = "1";
  });

  // --- 10. LÓGICA DEL BOTÓN VOLVER ARRIBA CON PROGRESO CIRCULAR ---
  const backToTopBtn = document.getElementById("backToTop");
  const progressCircle = document.querySelector(".progress-ring__circle");
  
  if (backToTopBtn && progressCircle) {
    const radius = progressCircle.r.baseVal.value;
    const circumference = radius * 2 * Math.PI;

    progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
    progressCircle.style.strokeDashoffset = circumference;

    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      
      const offset = circumference - (scrollPercent / 100) * circumference;
      progressCircle.style.strokeDashoffset = offset;

      // Mostrar/ocultar botón
      if (scrollTop > 300) {
        backToTopBtn.classList.add("visible");
      } else {
        backToTopBtn.classList.remove("visible");
      }
    };

    window.addEventListener("scroll", updateProgress);
    
    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }

  // --- 11. EFECTO DE ESCRITURA DINÁMICA (TYPING EFFECT) EN EL HERO ---
  const typedTextSpan = document.getElementById("typedText");
  const phrases = [
    "Estudiante de Desarrollo de Aplicaciones Web",
    "Técnico en Sistemas Microinformáticos & Redes"
  ];
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 80;

  function type() {
    if (!typedTextSpan) return;

    const currentPhrase = phrases[phraseIndex];
    if (isDeleting) {
      typedTextSpan.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 40; // Borrado rápido
    } else {
      typedTextSpan.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 80; // Escritura normal
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
      typingSpeed = 2200; // Pausa larga al terminar la frase
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typingSpeed = 600; // Pausa antes de iniciar la nueva frase
    }

    setTimeout(type, typingSpeed);
  }

  if (typedTextSpan) {
    type();
  }

  // --- 12. CONFIGURACIÓN DEL AÑO EN EL FOOTER ---
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // --- 13. DATOS ESTRUCTURADOS (JSON-LD) PARA SEO ---
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Carlos Javier Castaños Blanco",
    "url": "https://carlitic.github.io/",
    "sameAs": [
      "https://github.com/Carlitic",
      "https://www.linkedin.com/in/carlos-casta%C3%B1os-blanco/"
    ],
    "jobTitle": "Desarrollador de Aplicaciones Web",
    "knowsAbout": [
      "Java",
      "Spring Boot",
      "Angular",
      "TypeScript",
      "Docker",
      "Linux",
      "SQL",
      "Bash Scripting",
      "Git",
      "HTML",
      "CSS",
      "JavaScript",
      "AWS"
    ],
    "alumniOf": {
      "@type": "EducationalOrganization",
      "name": "IES El Caminàs"
    }
  };

  const schemaScript = document.createElement("script");
  schemaScript.type = "application/ld+json";
  schemaScript.text = JSON.stringify(schemaData);
  document.head.appendChild(schemaScript);
});
