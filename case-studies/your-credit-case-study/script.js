// Final Design gallery + lightbox
  (function(){
    var slides = [
      { url: 'yourcredit.com/dashboard', tag: '01 — Dashboard', title: 'Everything that matters, at a glance', desc: "Score, active disputes, and flagged accounts sit together on first load — so a returning user never has to hunt for status.", img: document.querySelectorAll('.gallery-item .gallery-thumb img')[0].src },
      { url: 'yourcredit.com/credit-report', tag: '02 — Credit Report', title: 'The full report, made legible', desc: 'Accounts, hard inquiries, collections, public records and personal info collapse into scannable sections — nothing hidden, nothing overwhelming.', img: document.querySelectorAll('.gallery-item .gallery-thumb img')[1].src },
      { url: 'yourcredit.com/accounts/4646', tag: '03 — Account Details', title: 'Drill into a single account', desc: 'Credit usage, payment history, and a clear "Pull the Latest Report" action — plus a note that filing a dispute never hurts the score.', img: document.querySelectorAll('.gallery-item .gallery-thumb img')[2].src },
      { url: 'yourcredit.com/disputes/123456', tag: '04 — Dispute Resolution', title: 'Showing the outcome, not just the status', desc: 'Once a dispute resolves, the result is shown in plain terms — what was investigated, what changed, and how it now appears on the report.', img: document.querySelectorAll('.gallery-item .gallery-thumb img')[3].src }
    ];

    var lightbox = document.getElementById('lightbox');
    var imgEl = document.getElementById('lightbox-img');
    var urlEl = document.getElementById('lightbox-url');
    var tagEl = document.getElementById('lightbox-tag');
    var titleEl = document.getElementById('lightbox-title');
    var descEl = document.getElementById('lightbox-desc');
    var scrollEl = document.querySelector('.lightbox-scroll');
    var current = 0;

    function render(){
      var s = slides[current];
      imgEl.src = s.img;
      imgEl.alt = s.title;
      urlEl.textContent = s.url;
      tagEl.textContent = s.tag;
      titleEl.textContent = s.title;
      descEl.textContent = s.desc;
      scrollEl.scrollTop = 0;
    }
    function open(i){
      current = i;
      render();
      lightbox.classList.add('open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
    function close(){
      lightbox.classList.remove('open');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
    function goTo(i){ current = (i + slides.length) % slides.length; render(); }

    document.querySelectorAll('.gallery-item').forEach(function(btn, i){
      btn.addEventListener('click', function(){ open(i); });
    });
    document.getElementById('lightbox-close').addEventListener('click', close);
    document.getElementById('lightbox-prev').addEventListener('click', function(){ goTo(current - 1); });
    document.getElementById('lightbox-next').addEventListener('click', function(){ goTo(current + 1); });
    lightbox.addEventListener('click', function(e){ if(e.target === lightbox){ close(); } });
    document.addEventListener('keydown', function(e){
      if(!lightbox.classList.contains('open')) return;
      if(e.key === 'Escape') close();
      if(e.key === 'ArrowLeft') goTo(current - 1);
      if(e.key === 'ArrowRight') goTo(current + 1);
    });
  })();

  // Reveal on scroll
  (function(){
    var els = document.querySelectorAll('.reveal');
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    els.forEach(function(el){ io.observe(el); });
  })();
