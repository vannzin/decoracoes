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

    item.innerHTML = `
      <div class="story-ring">
        <div class="story-inner">${cat.icon || '✨'}</div>
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

  const getServiceIcon = (iconName) => {
    switch (iconName) {
      case 'sparkles': return '✨';
      case 'box': return '🎁';
      case 'palette': return '🎨';
      case 'cake': return '🎂';
      default: return '🌸';
    }
  };

  data.services.forEach(srv => {
    const card = document.createElement('div');
    card.className = 'service-card';

    const iconEmoji = getServiceIcon(srv.icon);
    const badgeHtml = srv.badge ? `<span class="service-badge">${window.SecurityUtils.escapeHtml(srv.badge)}</span>` : '';

    card.innerHTML = `
      <div>
        <div class="service-header">
          <div class="service-icon-box">${iconEmoji}</div>
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
      btn.innerHTML = `<span>${cat.icon || '🏷️'} ${window.SecurityUtils.escapeHtml(cat.name)}</span>`;
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
      ? `<span class="portfolio-photos-pill">📸 ${imagesList.length} fotos</span>` 
      : '';

    card.innerHTML = `
      <div class="portfolio-img-wrap">
        ${photosPillHtml}
        <img src="${window.SecurityUtils.escapeHtml(item.imageUrl)}" alt="${window.SecurityUtils.escapeHtml(item.title)}" class="portfolio-img" loading="lazy">
        <div class="portfolio-overlay">
          <span class="portfolio-tag">${window.SecurityUtils.escapeHtml(item.categoryName || item.category)}</span>
          <h3 class="portfolio-title">${window.SecurityUtils.escapeHtml(item.title)}</h3>
          <span class="portfolio-meta">🔍 Clique para ver ${imagesList.length > 1 ? `as ${imagesList.length} fotos` : 'a foto'}</span>
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

  // Toggle do menu
  toggleBtn.onclick = () => {
    const isActive = toggleBtn.classList.toggle('active');
    navLinks.classList.toggle('active');
    toggleBtn.setAttribute('aria-expanded', String(isActive));
  };

  // Fecha o menu ao clicar em qualquer link
  navLinks.querySelectorAll('a').forEach(link => {
    link.onclick = () => {
      toggleBtn.classList.remove('active');
      navLinks.classList.remove('active');
      toggleBtn.setAttribute('aria-expanded', 'false');
    };
  });
}

/**
 * 8. Lightbox / Visualização Ampliada (Com suporte a múltiplas fotos)
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
 * 8. Animações de Rolagem Suave (Scroll Reveal)
 */
function setupScrollAnimations() {
  // Efeito dinâmico no cabeçalho ao rolar
  const header = document.querySelector('.site-header');
  const updateHeader = () => {
    if (window.scrollY > 20) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();

  // Seleciona todos os elementos visuais para animar
  const elements = document.querySelectorAll(`
    .section-header,
    .service-card,
    .portfolio-card,
    .about-visual,
    .about-content,
    .cta-box,
    .story-item,
    .footer-col,
    .footer-brand
  `);

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
      const delay = (index % 3) * 0.12;
      el.style.transitionDelay = `${delay}s`;
    }
  });

  // Função para verificar elementos visíveis na janela
  const checkVisibility = () => {
    const triggerBottom = window.innerHeight * 0.92;
    elements.forEach(el => {
      const boxTop = el.getBoundingClientRect().top;
      if (boxTop < triggerBottom) {
        el.classList.add('reveal-visible');
      }
    });
  };

  window.addEventListener('scroll', checkVisibility, { passive: true });
  window.addEventListener('resize', checkVisibility, { passive: true });

  // Executa imediatamente e após renderizações
  setTimeout(checkVisibility, 50);
  setTimeout(checkVisibility, 250);
}
window.setupScrollAnimations = setupScrollAnimations;
