(() => {
  "use strict";

  document.documentElement.classList.add("js");
  const menuButton = document.querySelector(".menu-toggle");
  const navigation = document.querySelector("#navigation");
  const smallScreen = window.matchMedia("(max-width: 860px)");

  if (menuButton && navigation) {
    menuButton.hidden = false;

    const closeMenu = () => {
      menuButton.setAttribute("aria-expanded", "false");
      navigation.classList.remove("is-open");
    };

    menuButton.addEventListener("click", () => {
      const isOpen = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!isOpen));
      navigation.classList.toggle("is-open", !isOpen);
    });

    navigation.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        if (!smallScreen.matches) return;
        closeMenu();
        const target = document.querySelector(link.getAttribute("href"));
        if (target) {
          target.setAttribute("tabindex", "-1");
          target.focus({ preventScroll: true });
          target.addEventListener("blur", () => target.removeAttribute("tabindex"), { once: true });
        }
      });
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && menuButton.getAttribute("aria-expanded") === "true") {
        closeMenu();
        menuButton.focus();
      }
    });

    smallScreen.addEventListener("change", closeMenu);

    if ("IntersectionObserver" in window) {
      const links = [...navigation.querySelectorAll('a[href^="#"]')];
      const observer = new IntersectionObserver((entries) => {
        const active = entries.filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (!active) return;
        links.forEach((link) => {
          if (link.getAttribute("href") === `#${active.target.id}`) {
            link.setAttribute("aria-current", "location");
          } else {
            link.removeAttribute("aria-current");
          }
        });
      }, { rootMargin: "-15% 0px -45% 0px", threshold: 0 });
      links.forEach((link) => {
        const section = document.querySelector(link.getAttribute("href"));
        if (section) observer.observe(section);
      });
    }
  }

  const year = document.querySelector("#year");
  if (year) year.textContent = String(new Date().getFullYear());

  const university = document.querySelector(".wordmark-university");
  const city = document.querySelector(".wordmark-city");
  const matchWordmarkSpacing = () => {
    if (!university || !city || !university.ownerSVGElement) return;
    const naturalText = university.cloneNode(true);
    naturalText.removeAttribute("textLength");
    naturalText.removeAttribute("lengthAdjust");
    naturalText.style.letterSpacing = "0px";
    naturalText.style.visibility = "hidden";
    university.ownerSVGElement.appendChild(naturalText);
    try {
      const naturalWidth = naturalText.getComputedTextLength();
      const targetWidth = Number(university.getAttribute("textLength"));
      const gaps = university.textContent.trim().length - 1;
      const spacing = (targetWidth - naturalWidth) / gaps;
      if (naturalWidth > 0 && gaps > 0 && Number.isFinite(spacing)) {
        city.style.letterSpacing = `${spacing}px`;
      }
    } finally {
      naturalText.remove();
    }
  };
  matchWordmarkSpacing();
  if (document.fonts) document.fonts.ready.then(matchWordmarkSpacing);
})();
