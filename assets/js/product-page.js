(() => {
  const products = window.COSMOS_PRODUCTS || {};
  const key = document.body.dataset.product;
  const p = products[key];
  if (!p) return;

  const $ = (s, ctx = document) => ctx.querySelector(s);

  $('[data-product-eyebrow]').textContent = p.eyebrow;
  $('[data-product-name]').textContent = p.name;
  $('[data-product-subtitle]').textContent = p.subtitle;
  $('[data-product-short]').textContent = p.short;
  $('[data-product-origin]').textContent = p.origin;
  $('[data-product-description]').textContent = p.description;
  $('[data-product-usage]').textContent = p.usage;

  document.querySelectorAll('[data-product-buy]').forEach(a => a.href = p.marketUrl);
  document.querySelectorAll('[data-product-whatsapp]').forEach(a => {
    a.href = `https://wa.me/5512988343519?text=${encodeURIComponent(`Olá! Vim pelo site da Cosmos e quero saber mais sobre ${p.name} ${p.subtitle}.`)}`;
  });

  const media = $('[data-product-media]');
  if (p.image) {
    media.innerHTML = `<img src="${p.image}" alt="${p.name} ${p.subtitle}">`;
  } else {
    media.innerHTML = `<div class="kit-visual kit-visual--hero">${p.items.map((item, i) => {
      const child = products[item];
      return `<img src="${child.image}" alt="${child.name} ${child.subtitle}" style="--i:${i}">`;
    }).join('')}</div>`;
  }

  const facts = $('[data-product-facts]');
  facts.innerHTML = p.facts.map((fact, i) => `
    <article class="fact-card"><span>${String(i + 1).padStart(2, '0')}</span><p>${fact}</p></article>
  `).join('');

  const science = $('[data-product-science]');
  if (p.honeyGrams > 0) {
    science.hidden = false;
    const input = $('[data-honey-input]', science);
    input.value = p.honeyGrams;
    const preset = science.querySelector(`[data-set-grams="${p.honeyGrams}"]`);
    if (preset) preset.classList.add('active');
    input.dispatchEvent(new Event('input', { bubbles: true }));
  } else {
    science.hidden = true;
  }

  const related = $('[data-related-products]');
  related.innerHTML = Object.entries(products)
    .filter(([k]) => k !== key)
    .slice(0, 3)
    .map(([k, item]) => `
      <a class="related-card" href="${item.slug}">
        <div>${item.image ? `<img src="${item.image}" alt="${item.name} ${item.subtitle}" loading="lazy">` : `<span class="related-kit">${item.items.length} produtos</span>`}</div>
        <span>${item.category}</span>
        <strong>${item.name}</strong>
        <small>${item.subtitle}</small>
      </a>`).join('');
})();
