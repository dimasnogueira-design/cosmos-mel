(() => {
  const $ = (s, ctx = document) => ctx.querySelector(s);
  const $$ = (s, ctx = document) => [...ctx.querySelectorAll(s)];
  const products = window.COSMOS_PRODUCTS || {};

  const year = $('#year');
  if (year) year.textContent = new Date().getFullYear();

  const header = $('.site-header');
  const onScroll = () => header?.classList.toggle('scrolled', window.scrollY > 20);
  onScroll();
  addEventListener('scroll', onScroll, { passive: true });

  const menuBtn = $('.menu-toggle');
  const nav = $('.main-nav');
  menuBtn?.addEventListener('click', () => {
    const open = nav?.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', String(open));
  });
  $$('.main-nav a').forEach(a => a.addEventListener('click', () => {
    nav?.classList.remove('open');
    menuBtn?.setAttribute('aria-expanded', 'false');
  }));

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const reveals = $$('.reveal');
  if (reduced || !('IntersectionObserver' in window)) {
    reveals.forEach(el => el.classList.add('visible'));
  } else {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: .12, rootMargin: '0px 0px -45px' });
    reveals.forEach(el => observer.observe(el));
  }

  function kitMarkup(product, compact = false) {
    const imgs = product.items.map(key => products[key]).filter(Boolean);
    return `
      <div class="kit-visual ${compact ? 'kit-visual--compact' : ''}">
        ${imgs.map((p, i) => `<img src="${p.image}" alt="${p.name} ${p.subtitle}" loading="lazy" style="--i:${i}">`).join('')}
      </div>`;
  }

  const catalog = $('#home-catalog');
  if (catalog) {
    catalog.innerHTML = Object.entries(products).map(([key, p], idx) => `
      <article class="catalog-card reveal ${idx > 0 ? `reveal-delay-${Math.min(idx, 3)}` : ''}">
        <a href="${p.slug}" class="catalog-card__link" aria-label="Conhecer ${p.name} ${p.subtitle}">
          <div class="catalog-card__media">
            ${p.image ? `<img src="${p.image}" alt="${p.name} ${p.subtitle}" loading="lazy">` : kitMarkup(p, true)}
            <span class="catalog-card__badge">${p.weight}</span>
            <span class="catalog-card__view">Ver produto ↗</span>
          </div>
          <div class="catalog-card__body">
            <span class="catalog-card__kicker">${p.category}</span>
            <h3>${p.name}</h3>
            <strong>${p.subtitle}</strong>
            <p>${p.short}</p>
            <div class="catalog-card__footer"><span>Conhecer produto</span><b>→</b></div>
          </div>
        </a>
      </article>
    `).join('');

    const fresh = $$('.catalog-card.reveal', catalog);
    if (reduced || !('IntersectionObserver' in window)) fresh.forEach(el => el.classList.add('visible'));
    else {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: .08 });
      fresh.forEach(el => observer.observe(el));
    }
  }

  const fmt = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 });
  const fmt1 = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 });

  function honeyStats(grams) {
    // Educational estimates. Baselines: 1 worker ≈ 1/12 tsp in lifetime;
    // 1 tsp honey ≈ 7 g; 1 lb honey ≈ 2,000,000 flower visits and 55,000 miles flown.
    const bees = grams * (12 / 7);
    const flowers = grams * (2_000_000 / 453.59237);
    const km = grams * (55_000 / 453.59237) * 1.609344;
    const earth = km / 40_075;
    return { bees, flowers, km, earth };
  }

  function updateCalculator(root) {
    const input = $('[data-honey-input]', root);
    if (!input) return;
    const grams = Math.max(10, Math.min(5000, Number(input.value) || 500));
    const stats = honeyStats(grams);
    $('[data-honey-grams]', root).textContent = `${fmt.format(grams)} g`;
    $('[data-honey-bees]', root).textContent = `≈ ${fmt.format(stats.bees)}`;
    $('[data-honey-flowers]', root).textContent = `≈ ${fmt1.format(stats.flowers / 1_000_000)} mi`;
    $('[data-honey-km]', root).textContent = `≈ ${fmt.format(stats.km)} km`;
    $('[data-honey-earth]', root).textContent = `≈ ${fmt1.format(stats.earth)}×`;
  }

  $$('.honey-calculator').forEach(root => {
    const input = $('[data-honey-input]', root);
    $$('[data-set-grams]', root).forEach(btn => btn.addEventListener('click', () => {
      input.value = btn.dataset.setGrams;
      updateCalculator(root);
      $$('[data-set-grams]', root).forEach(b => b.classList.toggle('active', b === btn));
    }));
    input?.addEventListener('input', () => updateCalculator(root));
    updateCalculator(root);
  });

  const form = $('#whatsapp-form');
  form?.addEventListener('submit', e => {
    e.preventDefault();
    const fd = new FormData(form);
    const lines = [
      `Olá! Meu nome é ${String(fd.get('name') || '').trim()}. Vim pelo site da Cosmos Mel do Brasil.`,
      `Tenho interesse em: ${String(fd.get('interest') || '').trim()}.`,
      fd.get('city') ? `Cidade: ${String(fd.get('city')).trim()}.` : '',
      fd.get('message') ? `Mensagem: ${String(fd.get('message')).trim()}` : ''
    ].filter(Boolean);
    open(`https://wa.me/5512988343519?text=${encodeURIComponent(lines.join('\n'))}`, '_blank', 'noopener,noreferrer');
  });
})();
