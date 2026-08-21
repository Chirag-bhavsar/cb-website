(() => {
  "use strict";

  /* ---------------------------------------------------------
     Scroll reveal animations
  --------------------------------------------------------- */
  const revealTargets = document.querySelectorAll(".reveal");

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  revealTargets.forEach((el) => revealObserver.observe(el));

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
