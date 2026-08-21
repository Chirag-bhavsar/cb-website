
// Lightbox
document.querySelectorAll('.c-media img').forEach(function(img) {
  img.addEventListener('click', function() {
    var lb = document.getElementById('lightbox');
    document.getElementById('lightbox-img').src = img.src;
    lb.classList.add('open');
  });
});
document.getElementById('lightbox').addEventListener('click', function() {
  this.classList.remove('open');
});

// Scroll-driven carousel
(function() {
  var section = document.getElementById('carousel');
  var sticky = section.querySelector('.carousel-sticky');
  var track = section.querySelector('.carousel-track');
  var dotsEls = Array.prototype.slice.call(section.querySelectorAll('.dot'));
  var cards = Array.prototype.slice.call(track.querySelectorAll('.carousel-card'));
  var n = cards.length;
  var NAV_OFFSET = 56;
  var maxTranslate = 0;
  var io = null;

  function isNativeMode() { return window.innerWidth < 800; }

  function setActive(idx) {
    dotsEls.forEach(function(d, i) { d.classList.toggle('active', i === idx); });
  }

  function layout() {
    if (isNativeMode()) {
      section.classList.add('mode-native');
      section.style.height = 'auto';
      track.style.transform = 'none';
      if (!io) {
        io = new IntersectionObserver(function(entries) {
          entries.forEach(function(entry) {
            if (entry.isIntersecting && entry.intersectionRatio > 0.6) {
              setActive(cards.indexOf(entry.target));
            }
          });
        }, { root: sticky, threshold: [0.6] });
        cards.forEach(function(c) { io.observe(c); });
      }
    } else {
      section.classList.remove('mode-native');
      if (io) { io.disconnect(); io = null; }
      var trackWidth = track.scrollWidth;
      var viewportWidth = sticky.clientWidth;
      maxTranslate = Math.max(trackWidth - viewportWidth, 0);
      var scrollDistance = Math.max(maxTranslate + window.innerHeight * 0.5, window.innerHeight);
      section.style.height = (sticky.clientHeight + scrollDistance) + 'px';
    }
  }

  function onScroll() {
    if (isNativeMode()) return;
    var rect = section.getBoundingClientRect();
    var stickyHeight = sticky.clientHeight;
    var scrollable = rect.height - stickyHeight;
    var progress = 0;
    if (rect.top <= NAV_OFFSET && scrollable > 0) {
      progress = Math.min(1, Math.max(0, (NAV_OFFSET - rect.top) / scrollable));
    }
    track.style.transform = 'translateX(' + (-progress * maxTranslate) + 'px)';
    setActive(Math.round(progress * (n - 1)));
  }

  dotsEls.forEach(function(dot, i) {
    dot.addEventListener('click', function() {
      if (isNativeMode()) {
        cards[i].scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
      } else {
        var sectionTop = section.getBoundingClientRect().top + window.scrollY;
        var scrollable = section.offsetHeight - sticky.clientHeight;
        var targetProgress = n > 1 ? i / (n - 1) : 0;
        window.scrollTo({ top: sectionTop + targetProgress * scrollable + NAV_OFFSET + 1, behavior: 'smooth' });
      }
    });
  });

  track.querySelectorAll('img').forEach(function(img) {
    if (!img.complete) {
      img.addEventListener('load', function() { layout(); onScroll(); });
    }
  });

  window.addEventListener('resize', function() { layout(); onScroll(); });
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('load', function() { layout(); onScroll(); });
  layout();
  onScroll();
})();
