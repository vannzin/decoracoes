/**
 * Decorações by Mary - Site Controller (js/site.js)
 * Renderização dinâmica, Lightbox, Menu Mobile e integração de dados.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Inicializa o site com os dados do DataManager
  initSite();

  // Escuta atualizações de dados vindas do Painel Administrativo ou de outras abas
  window.addEventListener('maryDataUpdated', () => {
    initSite();
  });

  window.addEventListener('storage', (e) => {
    if (e.key === 'decoracoes_mary_data_v2' || e.key === 'decoracoes_mary_data_v1') {
      initSite();
    }
  });
});

/**
 * Função Principal de Inicialização
 */
function initSite() {
  const data = window.DataManager ? window.DataManager.load() : null;
  if (!data) return;

  renderCompanyInfo(data);
  renderHero(data);
  renderCategories(data);
  renderServices(data);
  renderPortfolio(data);
  renderAbout(data);
  setupMobileMenu();
  setupLightbox(data);
  setupScrollAnimations();
}

/**
 * 1. Renderiza Informações da Empresa & Links Sociais
 */
function renderCompanyInfo(data) {
  const { company } = data;

  // Nome da Empresa
  const navBrand = document.getElementById('nav-brand-name');
  const footerBrand = document.getElementById('footer-brand-name');
  if (navBrand) navBrand.textContent = company.name || 'Decorações by Mary';
  if (footerBrand) footerBrand.textContent = company.name || 'Decorações by Mary';

  // Slogan no rodapé
  const footerSlogan = document.getElementById('footer-slogan');
  if (footerSlogan) footerSlogan.textContent = company.slogan || '';

  // Localização
  const footerLoc = document.getElementById('footer-location');
  if (footerLoc) footerLoc.textContent = company.location || 'MG - CONTAGEM';

  // Copyright com ano dinâmico
  const copyright = document.getElementById('copyright-text');
  const currentYear = new Date().getFullYear();
  if (copyright) {
    copyright.textContent = `© ${currentYear} ${company.name || 'Decorações by Mary'}. Todos os direitos reservados.`;
  }

  // Links do WhatsApp
  const waUrl = window.DataManager.getWhatsAppUrl();
  const waButtons = document.querySelectorAll('.dynamic-whatsapp-btn');
  waButtons.forEach(btn => {
    btn.setAttribute('href', waUrl);
  });

  const footerWaText = document.getElementById('footer-whatsapp-text');
  if (footerWaText) {
    footerWaText.textContent = company.whatsappFormatted || company.whatsapp || '(11) 99999-8888';
    footerWaText.setAttribute('href', waUrl);
  }

  // Links do Instagram
  const instaUrl = window.DataManager.getInstagramUrl();
  const instaLinks = document.querySelectorAll('.dynamic-instagram-link');
  instaLinks.forEach(link => {
    link.setAttribute('href', instaUrl);
  });

  const footerEmailText = document.getElementById('footer-email-text');
  if (footerEmailText) {
    const email = company.email || 'contato@decoracoesbymary.com.br';
    footerEmailText.textContent = email;
    footerEmailText.setAttribute('href', `mailto:${email}`);
  }
}

/**
 * 2. Renderiza Hero / Seção Principal
 */
function renderHero(data) {
  const { hero } = data;
  if (!hero) return;

  const heroBadge = document.getElementById('hero-badge');
  const heroTitle = document.getElementById('hero-title');
  const heroSubtitle = document.getElementById('hero-subtitle');

  if (heroBadge && hero.badge) {
    heroBadge.innerHTML = `<span>✨</span> ${window.SecurityUtils.escapeHtml(hero.badge)}`;
  }
  if (heroTitle && hero.title) {
    heroTitle.innerHTML = window.SecurityUtils.escapeHtml(hero.title);
  }
  if (heroSubtitle && hero.subtitle) {
    heroSubtitle.textContent = hero.subtitle;
  }
}

/**
 * 3. Renderiza Carrossel de Categorias / Stories
 */
function renderCategories(data) {
  const container = document.getElementById('categories-container');
  if (!container) return;

  const defaultCats = [
    { id: 'aniversario-infantil', name: 'Aniversário Infantil', icon: '🧸' },
    { id: 'aniversario-adulto', name: 'Aniversário Adulto', icon: '🥂' },
    { id: 'casamentos', name: 'Casamentos', icon: '💍' },
    { id: 'cha-revelacao', name: 'Chá Revelação', icon: '🍼' },
    { id: 'batizados', name: 'Batizados', icon: '🕊️' },
    { id: 'formatura', name: 'Formatura', icon: '🎓' }
  ];

  const OFFICIAL_CATEGORY_ICONS = {
    'aniversario-infantil': '🧸',
    'aniversario-adulto': '🥂',
    'casamentos': '💍',
    'cha-revelacao': '🍼',
    'batizados': '🕊️',
    'formatura': '🎓'
  };

  const categories = (data && Array.isArray(data.categories) && data.categories.length > 0)
    ? data.categories
    : defaultCats;

  container.innerHTML = '';

  categories.forEach(cat => {
    const item = document.createElement('div');
    item.className = 'story-item';
    item.dataset.category = cat.id;
    item.setAttribute('role', 'button');
    item.setAttribute('tabindex', '0');
    item.setAttribute('aria-label', `Filtrar por categoria ${cat.name}`);

    const iconDisplay = cat.icon || OFFICIAL_CATEGORY_ICONS[cat.id] || '✨';

    item.innerHTML = `
      <div class="story-ring">
        <div class="story-inner">${iconDisplay}</div>
      </div>
      <span class="story-label">${window.SecurityUtils.escapeHtml(cat.name)}</span>
    `;

    // Ao clicar na categoria, filtra o portfólio, atualiza os botões e rola suavemente
    const triggerCategory = () => {
      document.querySelectorAll('.story-item').forEach(el => el.classList.remove('active'));
      item.classList.add('active');

      // Sincroniza o botão de filtro do portfólio
      const filterBtns = document.querySelectorAll('#portfolio-filter-buttons .filter-btn');
      filterBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === cat.id);
      });

      filterPortfolio(cat.id);
      
      const portfolioSec = document.getElementById('portfolio');
      if (portfolioSec) {
        portfolioSec.scrollIntoView({ behavior: 'smooth' });
      }
    };

    item.addEventListener('click', triggerCategory);
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        triggerCategory();
      }
    });

    container.appendChild(item);
  });

  // Sincroniza também os links de categorias no rodapé
  const footerLinksContainer = document.getElementById('footer-categories-links');
  if (footerLinksContainer && Array.isArray(data.categories)) {
    footerLinksContainer.innerHTML = '';
    data.categories.forEach(cat => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = '#portfolio';
      a.textContent = `${cat.name}`;
      a.onclick = (e) => {
        e.preventDefault();
        const btn = document.querySelector(`#portfolio-filter-buttons .filter-btn[data-filter="${cat.id}"]`);
        if (btn) btn.click();
        document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' });
      };
      li.appendChild(a);
      footerLinksContainer.appendChild(li);
    });
  }

  if (typeof setupScrollAnimations === 'function') {
    setupScrollAnimations();
  }
}

/**
 * 4. Renderiza Serviços
 */
function renderServices(data) {
  const container = document.getElementById('services-container');
  if (!container || !data.services) return;

  container.innerHTML = '';

  // Retorna o ícone vetorial SVG padronizado e elegante para cada serviço
  const getServiceSvgIcon = (iconName, title = '') => {
    const norm = (iconName || '').toLowerCase().trim();
    const titleNorm = (title || '').toLowerCase().trim();

    // 1. Cenografia & Painéis Temáticos
    if (norm === 'box' || norm === 'scenery' || norm === 'panels' || titleNorm.includes('cenografia') || titleNorm.includes('pain') || titleNorm.includes('arco')) {
      return `
        <svg class="service-svg-icon" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 21h18"/>
          <path d="M5 21V9a7 7 0 0 1 14 0v12"/>
          <path d="M9 21V12a3 3 0 0 1 6 0v9"/>
          <path d="M12 3v3"/>
        </svg>
      `;
    }

    // 2. Decoração Personalizada
    if (norm === 'palette' || norm === 'custom' || titleNorm.includes('personalizad') || titleNorm.includes('medida') || titleNorm.includes('exclusiv')) {
      return `
        <svg class="service-svg-icon" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="13.5" cy="6.5" r="1" fill="currentColor"/>
          <circle cx="17.5" cy="10.5" r="1" fill="currentColor"/>
          <circle cx="8.5" cy="7.5" r="1" fill="currentColor"/>
          <circle cx="6.5" cy="12.5" r="1" fill="currentColor"/>
          <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.563-2.512 5.563-5.563C22 6.5 17.5 2 12 2Z"/>
        </svg>
      `;
    }

    // 3. Mesa de Doces & Bolo
    if (norm === 'cake' || norm === 'dessert' || titleNorm.includes('bolo') || titleNorm.includes('doce') || titleNorm.includes('mesa')) {
      return `
        <svg class="service-svg-icon" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8"/>
          <path d="M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2.5 2 4 2 2-1 2-1"/>
          <path d="M2 21h20"/>
          <path d="M7 8v2"/>
          <path d="M12 8v2"/>
          <path d="M17 8v2"/>
          <path d="M7 4h.01"/>
          <path d="M12 4h.01"/>
          <path d="M17 4h.01"/>
        </svg>
      `;
    }

    // 4. Decoração Completa / Padrão (Sparkles)
    return `
      <svg class="service-svg-icon" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"/>
        <path d="M5 3v4"/>
        <path d="M3 5h4"/>
        <path d="M19 17v4"/>
        <path d="M17 19h4"/>
      </svg>
    `;
  };

  data.services.forEach(srv => {
    const card = document.createElement('div');
    card.className = 'service-card';

    const iconSvg = getServiceSvgIcon(srv.icon, srv.title);
    const badgeHtml = srv.badge ? `<span class="service-badge">${window.SecurityUtils.escapeHtml(srv.badge)}</span>` : '';

    card.innerHTML = `
      <div>
        <div class="service-header">
          <div class="service-icon-box">${iconSvg}</div>
          ${badgeHtml}
        </div>
        <h3 class="service-title">${window.SecurityUtils.escapeHtml(srv.title)}</h3>
        <p class="service-desc">${window.SecurityUtils.escapeHtml(srv.description)}</p>
      </div>
      <a href="#" class="service-link dynamic-whatsapp-btn" target="_blank" rel="noopener noreferrer">
        Solicitar Orçamento <span>→</span>
      </a>
    `;

    // Atualiza o link do botão de orçamento com mensagem personalizada
    const btn = card.querySelector('.service-link');
    if (btn && window.DataManager) {
      const customMsg = `Olá! Gostaria de um orçamento para o serviço de *${srv.title}*.`;
      btn.href = window.DataManager.getWhatsAppUrl(customMsg);
    }

    container.appendChild(card);
  });

  if (typeof setupScrollAnimations === 'function') {
    setupScrollAnimations();
  }
}

/**
 * 5. Renderiza Portfólio com Filtros Interativos
 */
let currentPortfolioData = [];

function renderPortfolio(data) {
  const container = document.getElementById('portfolio-container');
  const filterButtonsContainer = document.getElementById('portfolio-filter-buttons');
  if (!container || !data.portfolio) return;

  currentPortfolioData = data.portfolio;

  // Renderiza botões de filtro com ícones dinamicamente
  if (filterButtonsContainer && data.categories) {
    filterButtonsContainer.innerHTML = '';
    
    // Botão "Todos os Trabalhos"
    const allBtn = document.createElement('button');
    allBtn.className = 'filter-btn active';
    allBtn.dataset.filter = 'all';
    allBtn.innerHTML = `<span>✨ Todos os Trabalhos</span>`;
    filterButtonsContainer.appendChild(allBtn);

    // Botões para cada categoria oficial
    data.categories.forEach(cat => {
      const btn = document.createElement('button');
      btn.className = 'filter-btn';
      btn.dataset.filter = cat.id;
      const iconDisplay = cat.icon || OFFICIAL_CATEGORY_ICONS[cat.id] || '🏷️';
      btn.innerHTML = `<span>${iconDisplay} ${window.SecurityUtils.escapeHtml(cat.name)}</span>`;
      filterButtonsContainer.appendChild(btn);
    });

    // Eventos de clique interativo nos botões de filtro
    const filterBtns = filterButtonsContainer.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Sincroniza destaque com os Stories do topo
        const selectedCat = btn.dataset.filter;
        document.querySelectorAll('.story-item').forEach(story => {
          story.classList.toggle('active', story.dataset.category === selectedCat);
        });

        filterPortfolio(selectedCat);
      });
    });
  }

  // Renderiza todos os itens inicialmente
  filterPortfolio('all');
}

function filterPortfolio(category) {
  const container = document.getElementById('portfolio-container');
  if (!container) return;

  container.innerHTML = '';

  const filtered = (category === 'all' || !category) 
    ? currentPortfolioData 
    : currentPortfolioData.filter(item => item.category === category);

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-muted);">
        <p style="font-size: 1.1rem;">Nenhum trabalho cadastrado nesta categoria no momento.</p>
      </div>
    `;
    return;
  }

  filtered.forEach(item => {
    const card = document.createElement('div');
    card.className = 'portfolio-card';
    card.dataset.id = item.id;
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', `Ver detalhes de ${item.title}`);

    const imagesList = Array.isArray(item.images) && item.images.length > 0 ? item.images : [item.imageUrl];
    const photosPillHtml = imagesList.length > 1 
      ? `<span class="portfolio-photos-pill"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 4px; vertical-align: -1.5px;"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>${imagesList.length} fotos</span>` 
      : '';

    card.innerHTML = `
      <div class="portfolio-img-wrap">
        ${photosPillHtml}
        <img src="${window.SecurityUtils.escapeHtml(item.imageUrl)}" alt="${window.SecurityUtils.escapeHtml(item.title)}" class="portfolio-img" loading="lazy">
        <div class="portfolio-overlay">
          <span class="portfolio-tag">${window.SecurityUtils.escapeHtml(item.categoryName || item.category)}</span>
          <h3 class="portfolio-title">${window.SecurityUtils.escapeHtml(item.title)}</h3>
          <span class="portfolio-meta">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 5px; vertical-align: -2px;">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            Clique para ver ${imagesList.length > 1 ? `as ${imagesList.length} fotos` : 'a foto'}
          </span>
        </div>
      </div>
    `;

    // Abre o Lightbox ao clicar no card
    card.addEventListener('click', () => {
      openLightbox(item);
    });

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(item);
      }
    });

    container.appendChild(card);
  });

  if (typeof setupScrollAnimations === 'function') {
    setupScrollAnimations();
  }
}

/**
 * 6. Renderiza Seção Sobre a Empresa
 */
function renderAbout(data) {
  const { about } = data;
  if (!about) return;

  const aboutTitle = document.getElementById('about-title');
  const aboutSubtitle = document.getElementById('about-subtitle');
  const aboutText = document.getElementById('about-text');
  const aboutQuote = document.getElementById('about-quote-text');
  const aboutImg = document.getElementById('about-image');
  const statsContainer = document.getElementById('about-stats-container');

  if (aboutTitle && about.title) aboutTitle.innerHTML = window.SecurityUtils.escapeHtml(about.title);
  if (aboutSubtitle && about.subtitle) aboutSubtitle.textContent = about.subtitle;
  if (aboutText && about.text) aboutText.textContent = about.text;
  if (aboutQuote) {
    let quoteText = about.quote || about.highlightText || 'A festa começa antes do parabéns: começa quando cada detalhe faz a pessoa sorrir.';
    quoteText = quoteText.trim();
    if (!quoteText.startsWith('“') && !quoteText.startsWith('"')) {
      quoteText = `“${quoteText}`;
    }
    if (!quoteText.endsWith('”') && !quoteText.endsWith('"')) {
      quoteText = `${quoteText}”`;
    }
    aboutQuote.textContent = quoteText;
  }
  if (aboutImg && about.imageUrl) aboutImg.src = about.imageUrl;

  if (statsContainer && Array.isArray(about.stats)) {
    statsContainer.innerHTML = '';
    about.stats.forEach(stat => {
      const statEl = document.createElement('div');
      statEl.className = 'stat-item';
      statEl.innerHTML = `
        <h4>${window.SecurityUtils.escapeHtml(stat.number)}</h4>
        <p>${window.SecurityUtils.escapeHtml(stat.label)}</p>
      `;
      statsContainer.appendChild(statEl);
    });
  }
}

/**
 * 7. Menu Mobile Hambúrguer
 */
function setupMobileMenu() {
  const toggleBtn = document.getElementById('mobile-toggle');
  const navLinks = document.getElementById('nav-links');

  if (!toggleBtn || !navLinks) return;

  const closeMenu = () => {
    toggleBtn.classList.remove('active');
    navLinks.classList.remove('active');
    toggleBtn.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('mobile-nav-open');
  };

  // onclick é sobrescrito a cada initSite, evitando listeners duplicados.
  toggleBtn.onclick = (event) => {
    event.stopPropagation();
    const willOpen = !navLinks.classList.contains('active');
    toggleBtn.classList.toggle('active', willOpen);
    navLinks.classList.toggle('active', willOpen);
    toggleBtn.setAttribute('aria-expanded', String(willOpen));
    document.body.classList.toggle('mobile-nav-open', willOpen);
  };

  navLinks.querySelectorAll('a').forEach(link => {
    link.onclick = closeMenu;
  });

  // Registra listeners globais uma única vez.
  if (!document.body.dataset.mobileMenuGlobalBound) {
    document.body.dataset.mobileMenuGlobalBound = 'true';

    document.addEventListener('click', (e) => {
      const currentToggle = document.getElementById('mobile-toggle');
      const currentNav = document.getElementById('nav-links');
      if (!currentToggle || !currentNav || !currentNav.classList.contains('active')) return;
      if (!currentNav.contains(e.target) && !currentToggle.contains(e.target)) {
        currentToggle.classList.remove('active');
        currentNav.classList.remove('active');
        currentToggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('mobile-nav-open');
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;
      const currentToggle = document.getElementById('mobile-toggle');
      const currentNav = document.getElementById('nav-links');
      if (!currentToggle || !currentNav) return;
      currentToggle.classList.remove('active');
      currentNav.classList.remove('active');
      currentToggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('mobile-nav-open');
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
        const currentToggle = document.getElementById('mobile-toggle');
        const currentNav = document.getElementById('nav-links');
        currentToggle?.classList.remove('active');
        currentNav?.classList.remove('active');
        currentToggle?.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('mobile-nav-open');
      }
    });
  }
}

/**
 * 8. Lightbox / Visualização Ampliada (Com suporte a múltiplas fotos e Touch Swipe)
 */
let currentLightboxImages = [];
let currentLightboxIndex = 0;

function setupLightbox() {
  const modal = document.getElementById('lightbox-modal');
  const closeBtn = document.getElementById('lightbox-close');
  const prevBtn = document.getElementById('lightbox-prev-btn');
  const nextBtn = document.getElementById('lightbox-next-btn');

  if (!modal || !closeBtn) return;

  closeBtn.onclick = closeLightbox;

  modal.onclick = (e) => {
    if (e.target === modal) closeLightbox();
  };

  if (prevBtn) {
    prevBtn.onclick = (e) => {
      e.stopPropagation();
      navigateLightbox(-1);
    };
  }

  if (nextBtn) {
    nextBtn.onclick = (e) => {
      e.stopPropagation();
      navigateLightbox(1);
    };
  }

  // Suporte a Touch Swipe no Celular
  let touchStartX = 0;
  let touchEndX = 0;

  modal.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  modal.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const swipeDistance = touchEndX - touchStartX;
    if (Math.abs(swipeDistance) > 40) {
      if (swipeDistance < 0) {
        // Arrastou para a esquerda -> Próxima foto
        navigateLightbox(1);
      } else {
        // Arrastou para a direita -> Foto anterior
        navigateLightbox(-1);
      }
    }
  }, { passive: true });

  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigateLightbox(-1);
    if (e.key === 'ArrowRight') navigateLightbox(1);
  });
}

function updateLightboxPhoto(index) {
  if (!currentLightboxImages.length) return;
  currentLightboxIndex = (index + currentLightboxImages.length) % currentLightboxImages.length;

  const img = document.getElementById('lightbox-img');
  const counter = document.getElementById('lightbox-photo-counter');
  const thumbs = document.querySelectorAll('.lightbox-thumb');

  if (img) img.src = currentLightboxImages[currentLightboxIndex];
  if (counter) {
    counter.textContent = `Foto ${currentLightboxIndex + 1} de ${currentLightboxImages.length}`;
  }

  thumbs.forEach((thumb, i) => {
    thumb.classList.toggle('active', i === currentLightboxIndex);
  });
}

function navigateLightbox(direction) {
  updateLightboxPhoto(currentLightboxIndex + direction);
}

function openLightbox(item) {
  const modal = document.getElementById('lightbox-modal');
  if (!modal) return;

  const tag = document.getElementById('lightbox-tag');
  const title = document.getElementById('lightbox-title');
  const desc = document.getElementById('lightbox-desc');
  const ctaBtn = document.getElementById('lightbox-cta-btn');
  const thumbsContainer = document.getElementById('lightbox-thumbs');
  const prevBtn = document.getElementById('lightbox-prev-btn');
  const nextBtn = document.getElementById('lightbox-next-btn');

  currentLightboxImages = Array.isArray(item.images) && item.images.length > 0 ? item.images : [item.imageUrl];
  currentLightboxIndex = 0;

  if (tag) tag.textContent = item.categoryName || item.category;
  if (title) title.textContent = item.title;
  if (desc) desc.textContent = item.description || 'Decoração sofisticada e exclusiva criada pela equipe Decorações by Mary.';

  if (ctaBtn && window.DataManager) {
    const customMsg = `Olá! Vi o projeto *${item.title}* no site da Decorações by Mary e gostaria de um orçamento parecido para o meu evento!`;
    ctaBtn.href = window.DataManager.getWhatsAppUrl(customMsg);
  }

  // Gera as miniaturas das 3 fotos
  if (thumbsContainer) {
    thumbsContainer.innerHTML = '';
    if (currentLightboxImages.length > 1) {
      currentLightboxImages.forEach((imgUrl, i) => {
        const thumb = document.createElement('img');
        thumb.src = imgUrl;
        thumb.className = `lightbox-thumb ${i === 0 ? 'active' : ''}`;
        thumb.alt = `Miniatura ${i + 1}`;
        thumb.onclick = () => updateLightboxPhoto(i);
        thumbsContainer.appendChild(thumb);
      });
      thumbsContainer.style.display = 'flex';
      if (prevBtn) prevBtn.style.display = 'flex';
      if (nextBtn) nextBtn.style.display = 'flex';
    } else {
      thumbsContainer.style.display = 'none';
      if (prevBtn) prevBtn.style.display = 'none';
      if (nextBtn) nextBtn.style.display = 'none';
    }
  }

  updateLightboxPhoto(0);

  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const modal = document.getElementById('lightbox-modal');
  if (!modal) return;

  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

/**
 * 8. Animações de Rolagem Suave e Efeitos Bidirecionais (Scroll Reveal ao Descer e Subir)
 */
function setupScrollAnimations() {
  const header = document.querySelector('.site-header');
  const backToTopBtn = document.getElementById('back-to-top-btn');
  const progressBar = document.getElementById('scroll-progress-bar');
  let lastScrollY = window.scrollY;

  // Atualiza a barra de progresso no topo da tela em tempo real
  const updateScrollProgress = () => {
    const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
    if (progressBar) {
      progressBar.style.width = `${scrolled}%`;
    }
  };

  // Efeito dinâmico no cabeçalho e botão voltar ao topo
  const updateHeaderAndScrollDirection = () => {
    const currentScrollY = window.scrollY;

    // Header com efeito de vidro fosco
    if (currentScrollY > 20) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }

    // Detecção de direção da rolagem (Descendo vs Subindo)
    if (currentScrollY > lastScrollY && currentScrollY > 80) {
      // Descendo
      header?.classList.add('header-scroll-down');
      header?.classList.remove('header-scroll-up');
    } else if (currentScrollY < lastScrollY) {
      // Subindo
      header?.classList.add('header-scroll-up');
      header?.classList.remove('header-scroll-down');
    }

    // Botão Voltar ao Topo
    if (backToTopBtn) {
      if (currentScrollY > 320) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }

    lastScrollY = currentScrollY;
  };

  // Clique no botão voltar ao topo com animação suave
  if (backToTopBtn) {
    backToTopBtn.onclick = () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    };
  }

  const queryAnimatedElements = () => {
    return document.querySelectorAll(`
      .section-header,
      .service-card,
      .portfolio-card,
      .about-visual,
      .about-content,
      .about-quote,
      .cta-box,
      .story-item,
      .hero-visual,
      .hero-features,
      .footer-col,
      .footer-brand
    `);
  };

  const applyInitialAnimationClasses = () => {
    const elements = queryAnimatedElements();
    elements.forEach((el, index) => {
      if (!el.classList.contains('reveal-on-scroll') && 
          !el.classList.contains('reveal-left') && 
          !el.classList.contains('reveal-right') && 
          !el.classList.contains('reveal-zoom')) {
        
        if (el.classList.contains('about-visual')) {
          el.classList.add('reveal-left');
        } else if (el.classList.contains('about-content')) {
          el.classList.add('reveal-right');
        } else if (el.classList.contains('cta-box')) {
          el.classList.add('reveal-zoom');
        } else {
          el.classList.add('reveal-on-scroll');
        }
      }

      // Delay escalonado para cartões adjacentes
      if (el.classList.contains('service-card') || el.classList.contains('portfolio-card') || el.classList.contains('story-item')) {
        const delay = (index % 3) * 0.1;
        el.style.transitionDelay = `${delay}s`;
      }
    });
  };

  applyInitialAnimationClasses();

  // Verificação Bidirecional de Visibilidade (Anima tanto ao descer quanto ao subir)
  const checkVisibilityBidirectional = () => {
    const elements = queryAnimatedElements();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const triggerEnter = windowHeight * 0.90; // Entra na tela
    const triggerExitTop = -120; // Saiu por cima
    const triggerExitBottom = windowHeight + 100; // Saiu por baixo

    elements.forEach(el => {
      const rect = el.getBoundingClientRect();
      
      // Se o elemento está dentro da área de visualização
      if (rect.top <= triggerEnter && rect.bottom >= 40) {
        el.classList.add('reveal-visible');
      } else if (rect.top > triggerExitBottom || rect.bottom < triggerExitTop) {
        // Quando sai completamente da área visível (para cima ou para baixo), reseta para animar de novo ao rolar!
        el.classList.remove('reveal-visible');
      }
    });
  };

  const onScrollHandler = () => {
    updateScrollProgress();
    updateHeaderAndScrollDirection();
    checkVisibilityBidirectional();
  };

  window.addEventListener('scroll', onScrollHandler, { passive: true });
  window.addEventListener('resize', onScrollHandler, { passive: true });

  // Executa imediatamente e após renderizações
  updateScrollProgress();
  updateHeaderAndScrollDirection();
  setTimeout(checkVisibilityBidirectional, 50);
  setTimeout(checkVisibilityBidirectional, 250);
  setTimeout(checkVisibilityBidirectional, 600);
}
window.setupScrollAnimations = setupScrollAnimations;
