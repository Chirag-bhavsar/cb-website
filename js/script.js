(() => {
  "use strict";

  /* ---------------------------------------------------------
     Footer year
  --------------------------------------------------------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------------------------------------------------
     Navbar: scrolled state + mobile toggle + scrollspy
  --------------------------------------------------------- */
  const navbar = document.getElementById("navbar");
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");
  const navAnchors = Array.from(document.querySelectorAll("#navLinks a[data-nav]"));

  const onScroll = () => {
    navbar.classList.toggle("scrolled", window.scrollY > 40);
  };
  document.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const closeMobileNav = () => {
    navLinks.classList.remove("open");
    navToggle.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  };

  navToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    navToggle.classList.toggle("open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navAnchors.forEach((a) => a.addEventListener("click", closeMobileNav));

  document.addEventListener("click", (e) => {
    if (
      navLinks.classList.contains("open") &&
      !navLinks.contains(e.target) &&
      !navToggle.contains(e.target)
    ) {
      closeMobileNav();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMobileNav();
  });

  // Highlight the nav link matching the section currently in view.
  const spySections = ["about", "work", "contact"]
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  const spyObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navAnchors.forEach((a) => {
          a.classList.toggle("active", a.getAttribute("href") === `#${entry.target.id}`);
        });
      });
    },
    { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
  );
  spySections.forEach((section) => spyObserver.observe(section));

  /* ---------------------------------------------------------
     Scroll reveal animations
  --------------------------------------------------------- */
  const revealTargets = document.querySelectorAll(".reveal, .reveal-stagger");

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  revealTargets.forEach((el) => revealObserver.observe(el));

  /* ---------------------------------------------------------
     Skills: animated progress ring + count-up
  --------------------------------------------------------- */
  const RING_CIRCUMFERENCE = 2 * Math.PI * 50; // r=50

  const animateCount = (el, target, duration = 1400) => {
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = `${Math.round(target * eased)}%`;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const skillsRow = document.getElementById("skillsRow");
  if (skillsRow) {
    const skillObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.querySelectorAll(".skill").forEach((skill) => {
            const percent = Number(skill.dataset.percent) || 0;
            const offset = RING_CIRCUMFERENCE * (1 - percent / 100);
            skill.style.setProperty("--offset", offset.toFixed(2));
            skill.classList.add("in-view");
            const countEl = skill.querySelector("[data-count]");
            if (countEl) animateCount(countEl, percent);
          });
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.3 }
    );
    skillObserver.observe(skillsRow);
  }

  /* ---------------------------------------------------------
     Cursor-follow ambient glow (desktop only, rAF-throttled)
  --------------------------------------------------------- */
  const cursorGlow = document.getElementById("cursorGlow");
  const supportsHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  if (cursorGlow && supportsHover) {
    let raf = null;
    let hideTimer = null;

    window.addEventListener(
      "pointermove",
      (e) => {
        cursorGlow.classList.add("active");
        clearTimeout(hideTimer);
        hideTimer = setTimeout(() => cursorGlow.classList.remove("active"), 2200);

        if (raf) return;
        raf = requestAnimationFrame(() => {
          cursorGlow.style.setProperty("--x", `${e.clientX}px`);
          cursorGlow.style.setProperty("--y", `${e.clientY}px`);
          raf = null;
        });
      },
      { passive: true }
    );
  }

  /* ---------------------------------------------------------
     Hero portrait subtle parallax tilt
  --------------------------------------------------------- */
  const hero = document.getElementById("home");
  const heroPortrait = document.getElementById("heroPortrait");

  if (hero && heroPortrait && supportsHover) {
    let raf = null;
    hero.addEventListener(
      "pointermove",
      (e) => {
        if (raf) return;
        raf = requestAnimationFrame(() => {
          const rect = hero.getBoundingClientRect();
          const relX = (e.clientX - rect.left) / rect.width - 0.5;
          const relY = (e.clientY - rect.top) / rect.height - 0.5;
          heroPortrait.style.transform = `translate3d(${relX * -14}px, ${relY * -10}px, 0)`;
          raf = null;
        });
      },
      { passive: true }
    );
    hero.addEventListener("pointerleave", () => {
      heroPortrait.style.transform = "";
    });
  }

  /* ---------------------------------------------------------
     Back to top
  --------------------------------------------------------- */
  const backToTop = document.getElementById("backToTop");
  if (backToTop) {
    const toggleBackToTop = () => {
      backToTop.classList.toggle("visible", window.scrollY > window.innerHeight * 0.8);
    };
    document.addEventListener("scroll", toggleBackToTop, { passive: true });
    toggleBackToTop();

    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
})();
