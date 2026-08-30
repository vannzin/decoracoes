/**
 * Decorações by Mary - Admin Controller (js/admin.js)
 * Gerenciamento de login demonstrativo, CRUDs dinâmicos, modais, toasts e backups.
 */

// Chaves de Sessão e Credenciais de Acesso
const AUTH_CONFIG = {
  sessionKey: 'decoracoes_mary_auth_session',
  credentialsKey: 'decoracoes_mary_auth_credentials',
  defaultUser: 'admin',
  defaultPass: 'mary123'
};

// Retorna as credenciais ativas salvas ou as padrões
function getAdminAuth() {
  if (window.DataManager && typeof window.DataManager.getAuth === 'function') {
    return window.DataManager.getAuth();
  }
  try {
    const saved = localStorage.getItem(AUTH_CONFIG.credentialsKey);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.user && parsed.pass) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Erro ao ler credenciais de auth:', e);
  }
  return {
    user: AUTH_CONFIG.defaultUser,
    pass: AUTH_CONFIG.defaultPass,
    isDefault: true
  };
}

// Salva novas credenciais em todas as camadas permanentes
function saveAdminAuth(user, pass) {
  if (window.DataManager && typeof window.DataManager.saveAuth === 'function') {
    window.DataManager.saveAuth(user, pass);
  } else {
    const isDefault = (user === AUTH_CONFIG.defaultUser && pass === AUTH_CONFIG.defaultPass);
    const data = {
      user: user.trim(),
      pass: pass.trim(),
      isDefault,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(AUTH_CONFIG.credentialsKey, JSON.stringify(data));
  }
  updateAuthStatusBadge();
  return true;
}

// Restaura credenciais padrão
function resetAdminAuthToDefault() {
  if (window.DataManager && typeof window.DataManager.resetAuth === 'function') {
    window.DataManager.resetAuth();
  } else {
    localStorage.removeItem(AUTH_CONFIG.credentialsKey);
  }
  updateAuthStatusBadge();
  return { user: AUTH_CONFIG.defaultUser, pass: AUTH_CONFIG.defaultPass, isDefault: true };
}

function updateAuthStatusBadge() {
  const badge = document.getElementById('badge-auth-status');
  if (!badge) return;
  const current = getAdminAuth();
  if (current.isDefault) {
    badge.textContent = '🔒 Credencial Padrão';
    badge.style.background = 'var(--rose-100)';
    badge.style.color = 'var(--admin-primary)';
  } else {
    badge.textContent = '🛡️ Credencial Personalizada';
    badge.style.background = '#DCFCE7';
    badge.style.color = '#15803D';
  }
}
window.getAdminAuth = getAdminAuth;
window.saveAdminAuth = saveAdminAuth;
window.resetAdminAuthToDefault = resetAdminAuthToDefault;

let currentPendingConfirmAction = null;

// Helper: Define a imagem em um slot específico (1, 2 ou 3)
function setPortfolioSlotImage(slotNum, url) {
  const hiddenInput = document.getElementById(`portfolio-img-url-${slotNum}`);
  const imgEl = document.getElementById(`slot-img-${slotNum}`);
  const placeholder = document.getElementById(`slot-placeholder-${slotNum}`);

  if (hiddenInput) hiddenInput.value = url || '';
  if (imgEl && placeholder) {
    if (url) {
      imgEl.src = url;
      imgEl.style.display = 'block';
      placeholder.style.display = 'none';
    } else {
      imgEl.src = '';
      imgEl.style.display = 'none';
      placeholder.style.display = 'block';
    }
  }
}
window.setPortfolioSlotImage = setPortfolioSlotImage;

// Helper: Atualiza o botão de categoria visual ativo
function updateActiveCategoryPill(catId) {
  const hiddenInput = document.getElementById('portfolio-category');
  if (hiddenInput) hiddenInput.value = catId;

  document.querySelectorAll('.cat-pill-btn').forEach(btn => {
    if (btn.dataset.cat === catId) {
      btn.style.background = 'var(--rose-gold-gradient)';
      btn.style.color = '#FFFFFF';
      btn.style.borderColor = 'transparent';
      btn.style.fontWeight = '700';
      btn.style.boxShadow = '0 4px 12px rgba(201, 122, 110, 0.35)';
    } else {
      btn.style.background = 'var(--rose-100)';
      btn.style.color = 'var(--admin-text)';
      btn.style.borderColor = 'var(--admin-border)';
      btn.style.fontWeight = '500';
      btn.style.boxShadow = 'none';
    }
  });
}
window.updateActiveCategoryPill = updateActiveCategoryPill;

document.addEventListener('DOMContentLoaded', () => {
  initAuth();
  setupTabNavigation();
  setupForms();
  setupImagePreviews();
  setupBackupHandlers();
  setupAuthChangeForm();
  setupMobileSidebar();
});

/**
 * 1. Sistema de Autenticação e Login
 */
function initAuth() {
  const loginScreen = document.getElementById('login-screen');
  const adminLayout = document.getElementById('admin-layout');
  const loginForm = document.getElementById('login-form');
  const btnLogout = document.getElementById('btn-logout');

  const isAuthenticated = sessionStorage.getItem(AUTH_CONFIG.sessionKey) === 'true';

  if (isAuthenticated) {
    loginScreen.style.display = 'none';
    adminLayout.classList.add('active');
    loadAdminData();
    updateAuthStatusBadge();
  } else {
    loginScreen.style.display = 'flex';
    adminLayout.classList.remove('active');
  }

  // Sincroniza dados da nuvem no boot
  if (window.DataManager && typeof window.DataManager.syncWithServer === 'function') {
    window.DataManager.syncWithServer().then(() => {
      updateAuthStatusBadge();
    }).catch(() => {});
  }

  // Submissão do login (Validação Online Global para Qualquer IP + Fallback Local)
  if (loginForm) {
    loginForm.onsubmit = async (e) => {
      e.preventDefault();
      const user = document.getElementById('login-username').value.trim();
      const pass = document.getElementById('login-password').value.trim();

      // 1. Tenta validação online via API Railway (Central para todos os IPs)
      let onlineValidated = false;
      if (typeof window !== 'undefined' && window.location && window.location.protocol.startsWith('http')) {
        try {
          const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user, pass })
          });
          const result = await res.json();
          if (res.ok && result.success) {
            onlineValidated = true;
            // Salva token e sincroniza
            if (result.token) sessionStorage.setItem('admin_token', result.token);
            if (window.DataManager) window.DataManager.syncWithServer().catch(() => {});
          }
        } catch (netErr) {
          console.warn('API de login online indisponível, utilizando validação local:', netErr);
        }
      }

      // 2. Validação Local de Fallback
      const currentAuth = getAdminAuth();
      const localValidated = (user === currentAuth.user && pass === currentAuth.pass);

      if (onlineValidated || localValidated) {
        sessionStorage.setItem(AUTH_CONFIG.sessionKey, 'true');
        showToast(`Login realizado com sucesso! Bem-vinda(o), ${user}.`, 'success');
        loginScreen.style.display = 'none';
        adminLayout.classList.add('active');
        loadAdminData();
        updateAuthStatusBadge();
      } else {
        showToast('Usuário ou senha incorretos. Verifique suas credenciais.', 'error');
      }
    };
  }

  // Logout
  if (btnLogout) {
    btnLogout.onclick = () => {
      sessionStorage.removeItem(AUTH_CONFIG.sessionKey);
      showToast('Sessão encerrada com segurança.', 'info');
      adminLayout.classList.remove('active');
      loginScreen.style.display = 'flex';
    };
  }
}

/**
 * 1.1. Formulário de Troca de Credenciais de Acesso (Usuário e Senha)
 */
function setupAuthChangeForm() {
  const formChangeAuth = document.getElementById('form-change-auth');
  const btnResetAuth = document.getElementById('btn-reset-auth-defaults');

  // Alternadores de visibilidade de senha (👁️)
  document.querySelectorAll('.btn-toggle-pwd').forEach(btn => {
    btn.onclick = (e) => {
      e.preventDefault();
      const targetId = btn.dataset.target;
      const targetInput = document.getElementById(targetId);
      if (targetInput) {
        const isPassword = targetInput.type === 'password';
        targetInput.type = isPassword ? 'text' : 'password';
        btn.textContent = isPassword ? '🙈' : '👁️';
      }
    };
  });

  // Salvar novo usuário e senha
  if (formChangeAuth) {
    formChangeAuth.onsubmit = (e) => {
      e.preventDefault();
      const currentUser = document.getElementById('inp-current-user').value.trim();
      const currentPass = document.getElementById('inp-current-pass').value.trim();
      const newUser = document.getElementById('inp-new-user').value.trim();
      const newPass = document.getElementById('inp-new-pass').value.trim();
      const newPassConfirm = document.getElementById('inp-new-pass-confirm').value.trim();

      const activeAuth = getAdminAuth();

      // 1. Valida credenciais atuais
      if (currentUser !== activeAuth.user || currentPass !== activeAuth.pass) {
        showToast('Usuário atual ou senha atual incorretos.', 'error');
        return;
      }

      // 2. Valida novo usuário
      if (newUser.length < 3) {
        showToast('O novo usuário deve ter pelo menos 3 caracteres.', 'warning');
        return;
      }

      // 3. Valida nova senha
      if (newPass.length < 4) {
        showToast('A nova senha deve ter pelo menos 4 caracteres.', 'warning');
        return;
      }

      // 4. Valida confirmação de senha
      if (newPass !== newPassConfirm) {
        showToast('A confirmação de senha não coincide com a nova senha.', 'warning');
        return;
      }

      // 5. Salva novas credenciais
      saveAdminAuth(newUser, newPass);
      showToast(`Credenciais atualizadas com sucesso! Novo usuário: "${newUser}".`, 'success', 4500);

      // Limpa os campos
      document.getElementById('inp-current-user').value = '';
      document.getElementById('inp-current-pass').value = '';
      document.getElementById('inp-new-user').value = '';
      document.getElementById('inp-new-pass').value = '';
      document.getElementById('inp-new-pass-confirm').value = '';
    };
  }

  // Restaurar padrões
  if (btnResetAuth) {
    btnResetAuth.onclick = () => {
      confirmAction('Deseja realmente restaurar o usuário e a senha para o padrão original (admin / mary123)?', () => {
        resetAdminAuthToDefault();
        showToast('Credenciais restauradas para o padrão: admin / mary123.', 'info', 4000);
      });
    };
  }
}

/**
 * 2. Navegação em Abas (Tabs) do Painel
 */
function setupTabNavigation() {
  const links = document.querySelectorAll('.sidebar-link');
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const tabId = link.dataset.tab;
      if (tabId) switchAdminTab(tabId);
    });
  });
}

function switchAdminTab(tabId) {
  // Atualiza links da sidebar
  document.querySelectorAll('.sidebar-link').forEach(l => {
    l.classList.toggle('active', l.dataset.tab === tabId);
  });

  // Atualiza panes de conteúdo
  document.querySelectorAll('.admin-tab-pane').forEach(pane => {
    pane.classList.toggle('active', pane.id === tabId);
  });

  // Atualiza título da topbar
  const activeLink = document.querySelector(`.sidebar-link[data-tab="${tabId}"]`);
  const topbarTitle = document.getElementById('topbar-title');
  if (activeLink && topbarTitle) {
    topbarTitle.textContent = activeLink.querySelector('span:last-child').textContent;
  }

  // Fecha sidebar no mobile caso esteja aberta
  const sidebar = document.getElementById('admin-sidebar');
  if (sidebar) sidebar.classList.remove('mobile-open');
  document.querySelector('.admin-sidebar-backdrop')?.classList.remove('active');
  document.body.classList.remove('admin-menu-open');
  document.getElementById('mobile-sidebar-toggle')?.setAttribute('aria-expanded', 'false');
}
window.switchAdminTab = switchAdminTab;

/**
 * 3. Carregamento Geral dos Dados no Painel
 */
function loadAdminData() {
  const data = window.DataManager ? window.DataManager.load() : null;
  if (!data) return;

  // Atualiza Métricas do Dashboard
  const dashServices = document.getElementById('dash-count-services');
  const dashPortfolio = document.getElementById('dash-count-portfolio');
  const dashInstagram = document.getElementById('dash-status-instagram');
  const dashWhatsapp = document.getElementById('dash-status-whatsapp');

  if (dashServices) dashServices.textContent = data.services ? data.services.length : 0;
  if (dashPortfolio) dashPortfolio.textContent = data.portfolio ? data.portfolio.length : 0;
  if (dashInstagram) dashInstagram.textContent = data.company.instagramHandle || '@decoracoesbymary';
  if (dashWhatsapp) dashWhatsapp.textContent = data.company.whatsappFormatted || 'Configurado';

  // Popula Formulário da Empresa
  const { company } = data;
  setInputValue('inp-company-name', company.name);
  setInputValue('inp-company-slogan', company.slogan);
  setInputValue('inp-company-whatsapp', company.whatsapp);
  setInputValue('inp-company-whatsapp-formatted', company.whatsappFormatted);
  setInputValue('inp-company-instagram', company.instagram);
  setInputValue('inp-company-instagram-handle', company.instagramHandle);
  setInputValue('inp-company-location', company.location);
  setInputValue('inp-company-whatsapp-msg', company.whatsappMessage);

  // Popula Formulário do Hero
  const { hero } = data;
  if (hero) {
    setInputValue('inp-hero-badge', hero.badge);
    setInputValue('inp-hero-title', hero.title);
    setInputValue('inp-hero-subtitle', hero.subtitle);
  }

  // Popula Formulário Sobre
  const { about } = data;
  if (about) {
    setInputValue('inp-about-title', about.title);
    setInputValue('inp-about-subtitle', about.subtitle);
    setInputValue('inp-about-text', about.text);
    setInputValue('inp-about-quote', about.quote || about.highlightText || 'A festa começa antes do parabéns: começa quando cada detalhe faz a pessoa sorrir.');
    setInputValue('inp-about-img', about.imageUrl);
    const aboutImgPreview = document.getElementById('about-img-preview');
    if (aboutImgPreview && about.imageUrl) {
      aboutImgPreview.src = about.imageUrl;
    }
  }

  // Renderiza Grids de Gestão
  renderAdminCategories(data.categories || []);
  renderAdminServices(data.services || []);
  renderAdminPortfolio(data.portfolio || []);
  updateCategoryOptionsInPortfolioModal(data.categories || []);
  updateStorageUsageDisplay();
}

function setInputValue(id, val) {
  const el = document.getElementById(id);
  if (el) el.value = val || '';
}

/**
 * 4. Configuração dos Formulários e CRUDs
 */
function setupForms() {
  // Formulário Empresa
  const formCompany = document.getElementById('form-company');
  if (formCompany) {
    formCompany.onsubmit = (e) => {
      e.preventDefault();
      const data = window.DataManager.load();
      
      data.company.name = document.getElementById('inp-company-name').value.trim();
      data.company.slogan = document.getElementById('inp-company-slogan').value.trim();
      data.company.whatsapp = document.getElementById('inp-company-whatsapp').value.trim();
      data.company.whatsappFormatted = document.getElementById('inp-company-whatsapp-formatted').value.trim() || data.company.whatsapp;
      data.company.instagram = document.getElementById('inp-company-instagram').value.trim();
      data.company.instagramHandle = document.getElementById('inp-company-instagram-handle').value.trim() || '@decoracoesbymary';
      data.company.location = document.getElementById('inp-company-location').value.trim();
      data.company.whatsappMessage = document.getElementById('inp-company-whatsapp-msg').value.trim();

      window.DataManager.save(data);
      loadAdminData();
      showToast('Informações da empresa salvas com sucesso!', 'success');
    };
  }

  // Formulário Hero
  const formHero = document.getElementById('form-hero');
  if (formHero) {
    formHero.onsubmit = (e) => {
      e.preventDefault();
      const data = window.DataManager.load();
      const badgeInput = document.getElementById('inp-hero-badge');
      data.hero = {
        badge: badgeInput ? badgeInput.value.trim() : (data.hero?.badge || ''),
        title: document.getElementById('inp-hero-title').value.trim(),
        subtitle: document.getElementById('inp-hero-subtitle').value.trim()
      };
      window.DataManager.save(data);
      showToast('Textos da página inicial salvos com sucesso!', 'success');
    };
  }

  // Formulário Sobre
  const formAbout = document.getElementById('form-about');
  if (formAbout) {
    formAbout.onsubmit = (e) => {
      e.preventDefault();
      const data = window.DataManager.load();
      const quoteInput = document.getElementById('inp-about-quote');
      const quoteVal = quoteInput ? quoteInput.value.trim() : '';
      data.about = {
        ...data.about,
        title: document.getElementById('inp-about-title').value.trim(),
        subtitle: document.getElementById('inp-about-subtitle').value.trim(),
        text: document.getElementById('inp-about-text').value.trim(),
        quote: quoteVal,
        highlightText: quoteVal,
        imageUrl: imgInput ? imgInput.value.trim() : (data.about?.imageUrl || 'assets/logo-mary.jpg')
      };
      window.DataManager.save(data);
      loadAdminData();
      showToast('Seção Sobre atualizada com sucesso!', 'success');
    };
  }

  // Modal de Categoria (Novo/Editar)
  const btnAddCategory = document.getElementById('btn-add-category');
  const formModalCategory = document.getElementById('form-modal-category');
  const catNameInput = document.getElementById('category-name');
  const catSlugInput = document.getElementById('category-slug');
  const catIconInput = document.getElementById('category-icon');

  const openCategoryModalForCreate = () => {
    document.getElementById('modal-category-title').textContent = 'Cadastrar Nova Categoria';
    document.getElementById('category-edit-id').value = '';
    if (catNameInput) catNameInput.value = '';
    if (catIconInput) catIconInput.value = '🎈';
    if (catSlugInput) catSlugInput.value = '';
    openAdminModal('modal-category');
  };

  if (btnAddCategory) btnAddCategory.onclick = openCategoryModalForCreate;

  // Sugestões de Emojis Rápidos
  document.querySelectorAll('.btn-quick-emoji').forEach(btn => {
    btn.onclick = () => {
      if (catIconInput) catIconInput.value = btn.dataset.emoji;
    };
  });

  // Gerar slug automaticamente ao digitar nome
  if (catNameInput && catSlugInput) {
    catNameInput.addEventListener('input', () => {
      const editId = document.getElementById('category-edit-id').value;
      if (!editId) {
        catSlugInput.value = catNameInput.value
          .toLowerCase()
          .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');
      }
    });
  }

  if (formModalCategory) {
    formModalCategory.onsubmit = (e) => {
      e.preventDefault();
      const data = window.DataManager.load();
      const editId = document.getElementById('category-edit-id').value;
      const name = catNameInput.value.trim();
      const icon = catIconInput.value.trim() || '✨';
      const slug = catSlugInput.value.trim().toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') || `cat_${Date.now()}`;

      if (!editId) {
        // Criação
        const exists = data.categories.some(c => c.id === slug);
        if (exists) {
          showToast('Já existe uma categoria com este código (slug). Escolha outro.', 'error');
          return;
        }
        data.categories.push({ id: slug, name, icon });
        showToast('Nova categoria cadastrada com sucesso!', 'success');
      } else {
        // Edição
        const index = data.categories.findIndex(c => c.id === editId);
        if (index !== -1) {
          data.categories[index] = { ...data.categories[index], name, icon, id: slug };
          showToast('Categoria atualizada com sucesso!', 'success');
        }
      }

      window.DataManager.save(data);
      closeAdminModal('modal-category');
      loadAdminData();
    };
  }

  // Modal de Serviço (Novo/Editar)
  const btnAddService = document.getElementById('btn-add-service');
  const btnQuickAddService = document.getElementById('btn-quick-add-service');
  const formModalService = document.getElementById('form-modal-service');

  const openServiceModalForCreate = () => {
    document.getElementById('modal-service-title').textContent = 'Cadastrar Novo Serviço';
    document.getElementById('service-edit-id').value = '';
    document.getElementById('service-title').value = '';
    document.getElementById('service-badge').value = '';
    document.getElementById('service-icon').value = 'sparkles';
    document.getElementById('service-description').value = '';
    openAdminModal('modal-service');
  };

  if (btnAddService) btnAddService.onclick = openServiceModalForCreate;
  if (btnQuickAddService) {
    btnQuickAddService.onclick = () => {
      switchAdminTab('tab-servicos');
      openServiceModalForCreate();
    };
  }

  if (formModalService) {
    formModalService.onsubmit = (e) => {
      e.preventDefault();
      const data = window.DataManager.load();
      const editId = document.getElementById('service-edit-id').value;
      const title = document.getElementById('service-title').value.trim();
      const badge = document.getElementById('service-badge').value.trim();
      const icon = document.getElementById('service-icon').value;
      const description = document.getElementById('service-description').value.trim();

      if (!editId) {
        // Criar novo serviço
        const newService = {
          id: `srv_${Date.now()}`,
          title,
          badge,
          icon,
          description
        };
        data.services.push(newService);
        showToast('Novo serviço adicionado com sucesso!', 'success');
      } else {
        // Atualizar serviço existente
        const index = data.services.findIndex(s => s.id === editId);
        if (index !== -1) {
          data.services[index] = { ...data.services[index], title, badge, icon, description };
          showToast('Serviço atualizado com sucesso!', 'success');
        }
      }

      window.DataManager.save(data);
      closeAdminModal('modal-service');
      loadAdminData();
    };
  }

  // Modal de Portfólio (Novo/Editar)
  const btnAddPortfolio = document.getElementById('btn-add-portfolio');
  const btnQuickAddPortfolio = document.getElementById('btn-quick-add-portfolio');
  const formModalPortfolio = document.getElementById('form-modal-portfolio');

  // Conecta os botões de seleção rápida das categorias
  document.querySelectorAll('.cat-pill-btn').forEach(btn => {
    btn.onclick = () => {
      updateActiveCategoryPill(btn.dataset.cat);
    };
  });

  const catSelect = document.getElementById('portfolio-category');
  if (catSelect) {
    catSelect.addEventListener('change', () => {
      updateActiveCategoryPill(catSelect.value);
    });
  }

  const openPortfolioModalForCreate = () => {
    document.getElementById('modal-portfolio-title').textContent = 'Adicionar Trabalho ao Portfólio';
    document.getElementById('portfolio-edit-id').value = '';
    document.getElementById('portfolio-title').value = '';
    updateActiveCategoryPill('aniversario-infantil');
    document.getElementById('portfolio-desc').value = '';
    
    // Limpa os 3 slots de fotos
    setPortfolioSlotImage(1, '');
    setPortfolioSlotImage(2, '');
    setPortfolioSlotImage(3, '');

    for (let i = 1; i <= 3; i++) {
      const fileInput = document.getElementById(`portfolio-file-${i}`);
      if (fileInput) fileInput.value = '';
    }

    const gallery = document.getElementById('gallery-presets');
    if (gallery) gallery.style.display = 'none';

    openAdminModal('modal-portfolio');
  };

  if (btnAddPortfolio) btnAddPortfolio.onclick = openPortfolioModalForCreate;
  if (btnQuickAddPortfolio) {
    btnQuickAddPortfolio.onclick = () => {
      switchAdminTab('tab-portfolio');
      openPortfolioModalForCreate();
    };
  }

  if (formModalPortfolio) {
    formModalPortfolio.onsubmit = (e) => {
      e.preventDefault();
      const data = window.DataManager.load();
      const editId = document.getElementById('portfolio-edit-id').value;
      const title = document.getElementById('portfolio-title').value.trim();
      const category = document.getElementById('portfolio-category').value;
      const description = document.getElementById('portfolio-desc').value.trim();

      // Coleta as 3 imagens
      const img1 = (document.getElementById('portfolio-img-url-1')?.value || '').trim();
      const img2 = (document.getElementById('portfolio-img-url-2')?.value || '').trim();
      const img3 = (document.getElementById('portfolio-img-url-3')?.value || '').trim();

      const images = [img1, img2, img3].filter(Boolean);

      if (images.length === 0) {
        if (typeof showImageAlertModal === 'function') {
          showImageAlertModal({
            title: 'Foto de Capa Obrigatória',
            reason: 'Não foi possível adicionar o trabalho ao portfólio porque a <strong>Foto 1 (Capa)</strong> não foi informada.',
            tips: [
              'Clique no botão <strong>📁 Arquivo</strong> do Slot 1 para selecionar uma foto do seu dispositivo.',
              'Ou clique em <strong>🔗 URL</strong> para informar o caminho ou link direto (ex: <code>assets/2.png</code>).',
              'Você também pode clicar em <strong>🎨 Galeria de Ideias</strong> para preencher com uma imagem de modelo.'
            ]
          });
        } else {
          showToast('Por favor, adicione pelo menos a Foto 1 (Capa) do projeto.', 'warning');
        }
        return;
      }

      const catObj = (data.categories || []).find(c => c.id === category);
      const categoryName = catObj ? catObj.name : category;

      if (!editId) {
        // Adicionar novo trabalho
        const newItem = {
          id: `port_${Date.now()}`,
          title,
          category,
          categoryName,
          imageUrl: images[0],
          images: images,
          description
        };
        data.portfolio.unshift(newItem);
        showToast(`Novo projeto adicionado com ${images.length} foto(s)!`, 'success');
      } else {
        // Atualizar trabalho existente
        const index = data.portfolio.findIndex(p => p.id === editId);
        if (index !== -1) {
          data.portfolio[index] = {
            ...data.portfolio[index],
            title,
            category,
            categoryName,
            imageUrl: images[0],
            images: images,
            description
          };
          showToast(`Projeto atualizado com ${images.length} foto(s)!`, 'success');
        }
      }

      const saved = window.DataManager.save(data);
      if (saved === false) {
        if (typeof showImageAlertModal === 'function') {
          showImageAlertModal({
            title: 'Limite de Memória do Navegador',
            reason: 'Não foi possível salvar o projeto porque o tamanho total das fotos excedeu o espaço disponível no navegador.',
            tips: [
              'Tente salvar usando fotos otimizadas (PNG/JPG até 2000px).',
              'Você também pode salvar imagens na pasta <code>assets/</code> do projeto e utilizar o link <code>assets/nome_da_foto.png</code>.'
            ]
          });
        } else {
          showToast('Atenção: Não foi possível salvar (limite do armazenamento atingido).', 'error');
        }
        return;
      }
      closeAdminModal('modal-portfolio');
      loadAdminData();
    };
  }

  // Modal de Confirmação
  const btnConfirmAction = document.getElementById('btn-confirm-action');
  if (btnConfirmAction) {
    btnConfirmAction.onclick = () => {
      if (typeof currentPendingConfirmAction === 'function') {
        currentPendingConfirmAction();
        currentPendingConfirmAction = null;
      }
      closeAdminModal('modal-confirm');
    };
  }
}

/**
 * 5. Renderização das Categorias no Admin
 */
function renderAdminCategories(categories) {
  const container = document.getElementById('admin-categories-grid');
  if (!container) return;

  container.innerHTML = '';

  if (categories.length === 0) {
    container.innerHTML = `<p style="color: var(--admin-muted); grid-column: 1/-1;">Nenhuma categoria cadastrada.</p>`;
    return;
  }

  categories.forEach(cat => {
    const card = document.createElement('div');
    card.className = 'item-admin-card';

    card.innerHTML = `
      <div class="item-admin-body" style="text-align: center; padding: 20px;">
        <div style="width: 76px; height: 76px; border-radius: 50%; padding: 3.5px; background: var(--rose-gold-gradient); margin: 0 auto 12px; display: flex; align-items: center; justify-content: center; box-shadow: var(--shadow-sm);">
          <div style="width: 100%; height: 100%; border-radius: 50%; background: #FFFFFF; display: flex; align-items: center; justify-content: center; font-size: 2rem;">
            ${cat.icon || '🏷️'}
          </div>
        </div>
        <h4 class="item-admin-title" style="margin-bottom: 4px;">${window.SecurityUtils.escapeHtml(cat.name)}</h4>
        <span style="display: inline-block; font-size: 0.75rem; background: var(--rose-100); color: var(--admin-primary); padding: 2px 8px; border-radius: 12px; font-weight: 600; margin-bottom: 14px;">
          Código: ${window.SecurityUtils.escapeHtml(cat.id)}
        </span>
        <div class="item-admin-actions" style="justify-content: center; margin-top: 10px;">
          <button class="admin-btn admin-btn-sm admin-btn-secondary btn-edit-cat">✏️ Editar</button>
          <button class="admin-btn admin-btn-sm admin-btn-danger btn-del-cat">🗑️ Excluir</button>
        </div>
      </div>
    `;

    // Botão Editar
    card.querySelector('.btn-edit-cat').onclick = () => {
      document.getElementById('modal-category-title').textContent = 'Editar Categoria';
      document.getElementById('category-edit-id').value = cat.id;
      document.getElementById('category-name').value = cat.name;
      document.getElementById('category-icon').value = cat.icon || '🎈';
      document.getElementById('category-slug').value = cat.id;
      openAdminModal('modal-category');
    };

    // Botão Excluir
    card.querySelector('.btn-del-cat').onclick = () => {
      confirmAction(`Deseja realmente remover a categoria "${cat.name}"?`, () => {
        const data = window.DataManager.load();
        data.categories = data.categories.filter(c => c.id !== cat.id);
        window.DataManager.save(data);
        loadAdminData();
        showToast('Categoria removida.', 'warning');
      });
    };

    container.appendChild(card);
  });
}

/**
 * Atualiza os botões rápidos de seleção de categoria no modal de Portfólio
 */
function updateCategoryOptionsInPortfolioModal(categories) {
  const pillsContainer = document.getElementById('category-quick-pills');
  const hiddenInput = document.getElementById('portfolio-category');
  const currentVal = hiddenInput ? hiddenInput.value : '';

  if (pillsContainer && Array.isArray(categories)) {
    pillsContainer.innerHTML = '';
    categories.forEach(cat => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'admin-btn admin-btn-sm cat-pill-btn';
      btn.dataset.cat = cat.id;
      btn.innerHTML = `<span>${cat.icon || '🏷️'} ${window.SecurityUtils.escapeHtml(cat.name)}</span>`;
      btn.onclick = () => {
        updateActiveCategoryPill(cat.id);
      };
      pillsContainer.appendChild(btn);
    });

    const activeCat = (currentVal && categories.some(c => c.id === currentVal)) 
      ? currentVal 
      : (categories[0]?.id || 'aniversario-infantil');
    updateActiveCategoryPill(activeCat);
  }
}

/**
 * 6. Renderização dos Serviços no Admin
 */
function renderAdminServices(services) {
  const container = document.getElementById('admin-services-grid');
  if (!container) return;

  container.innerHTML = '';

  if (services.length === 0) {
    container.innerHTML = `<p style="color: var(--admin-muted); grid-column: 1/-1;">Nenhum serviço cadastrado.</p>`;
    return;
  }

  services.forEach(srv => {
    const card = document.createElement('div');
    card.className = 'item-admin-card';

    const badgeHtml = srv.badge ? `<span class="item-admin-tag">${window.SecurityUtils.escapeHtml(srv.badge)}</span>` : '';

    card.innerHTML = `
      <div class="item-admin-body">
        ${badgeHtml}
        <h4 class="item-admin-title">${window.SecurityUtils.escapeHtml(srv.title)}</h4>
        <p class="item-admin-desc">${window.SecurityUtils.escapeHtml(srv.description)}</p>
        <div class="item-admin-actions">
          <button class="admin-btn admin-btn-sm admin-btn-secondary btn-edit-srv">✏️ Editar</button>
          <button class="admin-btn admin-btn-sm admin-btn-danger btn-del-srv">🗑️ Excluir</button>
        </div>
      </div>
    `;

    // Botão Editar
    card.querySelector('.btn-edit-srv').onclick = () => {
      document.getElementById('modal-service-title').textContent = 'Editar Serviço';
      document.getElementById('service-edit-id').value = srv.id;
      document.getElementById('service-title').value = srv.title;
      document.getElementById('service-badge').value = srv.badge || '';
      document.getElementById('service-icon').value = srv.icon || 'sparkles';
      document.getElementById('service-description').value = srv.description;
      openAdminModal('modal-service');
    };

    // Botão Excluir
    card.querySelector('.btn-del-srv').onclick = () => {
      confirmAction(`Deseja realmente remover o serviço "${srv.title}"?`, () => {
        const data = window.DataManager.load();
        data.services = data.services.filter(s => s.id !== srv.id);
        window.DataManager.save(data);
        loadAdminData();
        showToast('Serviço excluído.', 'warning');
      });
    };

    container.appendChild(card);
  });
}

/**
 * 6. Renderização do Portfólio no Admin
 */
function renderAdminPortfolio(portfolio) {
  const container = document.getElementById('admin-portfolio-grid');
  if (!container) return;

  container.innerHTML = '';

  if (portfolio.length === 0) {
    container.innerHTML = `<p style="color: var(--admin-muted); grid-column: 1/-1;">Nenhum trabalho cadastrado no portfólio.</p>`;
    return;
  }

  portfolio.forEach(item => {
    const card = document.createElement('div');
    card.className = 'item-admin-card';

    const imagesList = Array.isArray(item.images) && item.images.length > 0 ? item.images : [item.imageUrl];
    const photosCountBadge = `<span style="font-size: 0.72rem; font-weight: 600; color: var(--admin-primary); margin-left: 6px;">📸 ${imagesList.length} foto(s)</span>`;

    card.innerHTML = `
      <div style="position: relative;">
        <img src="${window.SecurityUtils.escapeHtml(item.imageUrl)}" alt="${window.SecurityUtils.escapeHtml(item.title)}" class="item-admin-img" loading="lazy">
        <span style="position: absolute; bottom: 8px; right: 8px; background: rgba(0,0,0,0.65); color: #FFF; font-size: 0.72rem; padding: 2px 8px; border-radius: 12px;">📸 ${imagesList.length} fotos</span>
      </div>
      <div class="item-admin-body">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <span class="item-admin-tag">${window.SecurityUtils.escapeHtml(item.categoryName || item.category)}</span>
        </div>
        <h4 class="item-admin-title">${window.SecurityUtils.escapeHtml(item.title)}</h4>
        <p class="item-admin-desc">${window.SecurityUtils.escapeHtml(item.description || 'Sem descrição')}</p>
        <div class="item-admin-actions">
          <button class="admin-btn admin-btn-sm admin-btn-secondary btn-edit-port">✏️ Editar</button>
          <button class="admin-btn admin-btn-sm admin-btn-danger btn-del-port">🗑️ Excluir</button>
        </div>
      </div>
    `;

    // Botão Editar
    card.querySelector('.btn-edit-port').onclick = () => {
      document.getElementById('modal-portfolio-title').textContent = 'Editar Trabalho';
      document.getElementById('portfolio-edit-id').value = item.id;
      document.getElementById('portfolio-title').value = item.title;
      updateActiveCategoryPill(item.category);
      document.getElementById('portfolio-desc').value = item.description || '';

      const images = Array.isArray(item.images) && item.images.length > 0 ? item.images : [item.imageUrl];
      setPortfolioSlotImage(1, images[0] || '');
      setPortfolioSlotImage(2, images[1] || '');
      setPortfolioSlotImage(3, images[2] || '');

      const gallery = document.getElementById('gallery-presets');
      if (gallery) gallery.style.display = 'none';

      openAdminModal('modal-portfolio');
    };

    // Botão Excluir
    card.querySelector('.btn-del-port').onclick = () => {
      confirmAction(`Deseja realmente remover o trabalho "${item.title}" do portfólio?`, () => {
        const data = window.DataManager.load();
        data.portfolio = data.portfolio.filter(p => p.id !== item.id);
        window.DataManager.save(data);
        loadAdminData();
        showToast('Trabalho removido do portfólio.', 'warning');
      });
    };

    container.appendChild(card);
  });
}

/**
 * Utilitário: Processa e otimiza imagens locais com Canvas (redimensionamento inteligente e validação estrita)
 */
function processImageFile(file, maxWidth = 1000, quality = 0.85) {
  return new Promise((resolve, reject) => {
    if (!file) {
      return reject(new Error('Nenhum arquivo de imagem foi selecionado.'));
    }

    // 1. Validação de Tamanho do Arquivo (Máximo de 8 MB antes da compressão)
    const maxSizeBytes = 8 * 1024 * 1024; // 8 MB
    if (file.size > maxSizeBytes) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
      if (typeof showImageAlertModal === 'function') {
        showImageAlertModal({
          title: 'Tamanho de Arquivo Muito Alto',
          reason: `A foto selecionada possui <strong>${sizeMb} MB</strong>, o que ultrapassa o tamanho máximo recomendado de <strong>8 MB</strong> por arquivo. Fotos excessivamente pesadas tornam o site lento para os visitantes no celular.`,
          tips: [
            'Escolha uma foto com tamanho menor que <strong>8 MB</strong>.',
            'Formatos recomendados: <strong>JPG, PNG ou WEBP</strong>.',
            'Se a foto veio de câmera profissional de altíssima resolução, redimensione-a antes de enviar ou coloque-a na pasta <code>assets/</code>.'
          ]
        });
      }
      return reject(new Error(`Tamanho de arquivo excessivo (${sizeMb} MB).`));
    }

    // 2. Validação de Formato
    const validExtensions = ['.png', '.jpg', '.jpeg', '.webp', '.svg', '.gif'];
    const fileName = (file.name || '').toLowerCase();
    const hasValidExt = validExtensions.some(ext => fileName.endsWith(ext));
    const isImageMime = file.type && file.type.startsWith('image/');

    if (!isImageMime && !hasValidExt) {
      if (typeof showImageAlertModal === 'function') {
        showImageAlertModal({
          title: 'Formato de Imagem Inadequado',
          reason: `O arquivo selecionado (<code>${file.name || 'arquivo'}</code>) não é um formato de imagem reconhecido ou compatível com navegadores web.`,
          tips: [
            'Envie fotos com extensão <strong>.PNG, .JPG, .JPEG ou .WEBP</strong>.',
            'Evite documentos PDF, planilhas ou vídeos.'
          ]
        });
      }
      return reject(new Error('Formato de arquivo não suportado.'));
    }

    const isPng = (file.type === 'image/png') || fileName.endsWith('.png') || (file.type === 'image/svg+xml');

    const reader = new FileReader();
    reader.onload = (e) => {
      const rawDataUrl = e.target.result;
      const img = new Image();

      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          let width = img.width || 800;
          let height = img.height || 600;

          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          
          if (isPng) {
            ctx.clearRect(0, 0, width, height);
          } else {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, width, height);
          }

          ctx.drawImage(img, 0, 0, width, height);

          const outputType = isPng ? 'image/png' : 'image/jpeg';
          const optimizedDataUrl = isPng ? canvas.toDataURL('image/png') : canvas.toDataURL('image/jpeg', quality);
          resolve(optimizedDataUrl);
        } catch (canvasErr) {
          resolve(rawDataUrl);
        }
      };

      img.onerror = () => {
        if (typeof showImageAlertModal === 'function') {
          showImageAlertModal({
            title: 'Erro ao Processar a Foto',
            reason: 'O arquivo de imagem selecionado parece estar corrompido ou em um formato não decodificável.',
            tips: [
              'Verifique se o arquivo de foto abre normalmente na galeria do seu celular/computador.',
              'Tente salvar novamente a foto em formato <strong>JPG ou PNG</strong>.'
            ]
          });
        }
        resolve(rawDataUrl);
      };

      img.src = rawDataUrl;
    };

    reader.onerror = () => {
      if (typeof showImageAlertModal === 'function') {
        showImageAlertModal({
          title: 'Falha na Leitura do Arquivo',
          reason: 'O navegador não conseguiu acessar os dados do arquivo selecionado.',
          tips: [
            'Verifique se você possui permissão para ler o arquivo.',
            'Tente selecionar o arquivo novamente.'
          ]
        });
      }
      reject(new Error('Não foi possível ler o arquivo selecionado no seu dispositivo.'));
    };

    reader.readAsDataURL(file);
  });
}

/**
 * 7. Preview e Troca de Imagens Dinâmica nos Formulários
 */
function setupImagePreviews() {
  const btnToggleGallery = document.getElementById('btn-toggle-gallery');
  const galleryPresets = document.getElementById('gallery-presets');

  // Alternar Galeria de Ideias
  if (btnToggleGallery && galleryPresets) {
    btnToggleGallery.onclick = () => {
      const isHidden = galleryPresets.style.display === 'none' || !galleryPresets.style.display;
      galleryPresets.style.display = isHidden ? 'block' : 'none';
    };
  }

  // Clique em uma miniatura da Galeria de Ideias -> preenche o primeiro slot vazio ou slot 1
  document.querySelectorAll('.preset-thumb').forEach(thumb => {
    thumb.onclick = () => {
      const url = thumb.getAttribute('src');
      let targetSlot = 1;
      
      const val1 = document.getElementById('portfolio-img-url-1')?.value;
      const val2 = document.getElementById('portfolio-img-url-2')?.value;
      const val3 = document.getElementById('portfolio-img-url-3')?.value;

      if (!val1) targetSlot = 1;
      else if (!val2) targetSlot = 2;
      else if (!val3) targetSlot = 3;
      else targetSlot = 1;

      setPortfolioSlotImage(targetSlot, url);
      showToast(`Foto aplicada no Slot ${targetSlot}!`, 'success', 1800);
    };
  });

  // Configura os 3 Slots de Fotos do Portfólio
  for (let slot = 1; slot <= 3; slot++) {
    const fileInput = document.getElementById(`portfolio-file-${slot}`);
    const slotBox = document.getElementById(`slot-box-${slot}`);
    
    // Upload de arquivo
    if (fileInput) {
      fileInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        showToast(`Otimizando foto do Slot ${slot}...`, 'info', 1500);

        try {
          const optimizedDataUrl = await processImageFile(file);
          setPortfolioSlotImage(slot, optimizedDataUrl);
          showToast(`Foto ${slot} carregada com sucesso!`, 'success');
        } catch (err) {
          showToast(err.message || 'Erro ao processar imagem.', 'error');
        }
      });
    }

    // Clique na caixa de prévia abre o seletor de arquivo
    if (slotBox && fileInput) {
      slotBox.onclick = () => fileInput.click();
    }
  }

  // Botões de informar URL para os slots
  document.querySelectorAll('.btn-prompt-url').forEach(btn => {
    btn.onclick = () => {
      const slot = btn.dataset.slot;
      const currentVal = document.getElementById(`portfolio-img-url-${slot}`)?.value || '';
      const newUrl = prompt(`Informe a URL da Foto ${slot}:`, currentVal);
      if (newUrl !== null) {
        setPortfolioSlotImage(slot, newUrl.trim());
        if (newUrl.trim()) showToast(`URL da Foto ${slot} atualizada!`, 'success');
      }
    };
  });

  // Botões de limpar slot
  document.querySelectorAll('.btn-clear-slot').forEach(btn => {
    btn.onclick = () => {
      const slot = btn.dataset.slot;
      setPortfolioSlotImage(slot, '');
      const fileInput = document.getElementById(`portfolio-file-${slot}`);
      if (fileInput) fileInput.value = '';
      showToast(`Foto ${slot} removida.`, 'info', 1500);
    };
  });

  // --- SOBRE: Preview de URL e Troca por Arquivo ---
  const aboutImgInput = document.getElementById('inp-about-img');
  const aboutPreview = document.getElementById('about-img-preview');
  const aboutFileInput = document.getElementById('inp-about-img-file');
  const aboutDropzone = document.getElementById('about-dropzone');

  // Clique na Dropzone abre o seletor de arquivos
  if (aboutDropzone && aboutFileInput) {
    aboutDropzone.onclick = () => aboutFileInput.click();

    // Suporte a Arrastar e Soltar (Drag & Drop)
    aboutDropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      aboutDropzone.style.background = '#F7DDD8';
      aboutDropzone.style.borderColor = 'var(--admin-primary-hover)';
    });

    aboutDropzone.addEventListener('dragleave', (e) => {
      e.preventDefault();
      aboutDropzone.style.background = 'var(--rose-50)';
      aboutDropzone.style.borderColor = 'var(--admin-primary)';
    });

    aboutDropzone.addEventListener('drop', async (e) => {
      e.preventDefault();
      aboutDropzone.style.background = 'var(--rose-50)';
      aboutDropzone.style.borderColor = 'var(--admin-primary)';
      
      const file = e.dataTransfer?.files?.[0];
      if (!file) return;

      showToast('Processando foto arrastada...', 'info', 1800);
      try {
        const optimizedDataUrl = await processImageFile(file, 900, 0.80);
        if (aboutImgInput) aboutImgInput.value = optimizedDataUrl;
        if (aboutPreview) aboutPreview.src = optimizedDataUrl;

        const data = window.DataManager.load();
        data.about.imageUrl = optimizedDataUrl;
        window.DataManager.save(data);

        showToast('Foto da empresa aplicada e salva no site com sucesso!', 'success', 3500);
      } catch (err) {
        showToast(err.message || 'Erro ao carregar a foto.', 'error');
      }
    });
  }

  // Digitação direta de caminho / URL no campo de texto
  if (aboutImgInput && aboutPreview) {
    aboutImgInput.addEventListener('input', () => {
      const val = aboutImgInput.value.trim();
      if (val) {
        aboutPreview.src = val;
      }
    });
  }

  if (aboutFileInput) {
    aboutFileInput.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      showToast('Otimizando e aplicando nova foto...', 'info', 1800);

      try {
        const optimizedDataUrl = await processImageFile(file, 900, 0.80);
        if (aboutImgInput) {
          aboutImgInput.value = optimizedDataUrl;
        }
        if (aboutPreview) {
          aboutPreview.src = optimizedDataUrl;
        }

        // Salva diretamente no DataManager para refletir instantaneamente no site principal
        const data = window.DataManager.load();
        data.about.imageUrl = optimizedDataUrl;
        window.DataManager.save(data);

        showToast('Foto da empresa atualizada e salva com sucesso no site!', 'success', 3500);
      } catch (err) {
        showToast(err.message || 'Erro ao carregar a foto.', 'error');
      }
    });
  }
}

/**
 * 8. Backup e Restauração de Dados
 */
function setupBackupHandlers() {
  // Exportar Backup
  const btnExport = document.getElementById('btn-export-backup');
  if (btnExport) {
    btnExport.onclick = () => {
      window.DataManager.exportBackup();
      showToast('Arquivo de backup exportado com sucesso!', 'success');
    };
  }

  // Importar Backup
  const fileInput = document.getElementById('inp-import-file');
  const fileNameDisplay = document.getElementById('import-file-name');

  if (fileInput) {
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      if (fileNameDisplay) fileNameDisplay.textContent = file.name;

      const reader = new FileReader();
      reader.onload = (event) => {
        const jsonStr = event.target.result;
        const result = window.DataManager.importBackup(jsonStr);

        if (result.success) {
          loadAdminData();
          showToast('Backup importado e validado com sucesso!', 'success');
        } else {
          showToast(`Erro na importação: ${result.message}`, 'error');
        }
        fileInput.value = '';
      };

      reader.onerror = () => {
        showToast('Erro ao ler o arquivo selecionado.', 'error');
      };

      reader.readAsText(file);
    });
  }

  // Restaurar Padrões
  const btnReset = document.getElementById('btn-reset-defaults');
  if (btnReset) {
    btnReset.onclick = () => {
      confirmAction('ATENÇÃO: Deseja realmente restaurar todos os dados padrão de fábrica? Todas as alterações não exportadas serão perdidas.', () => {
        window.DataManager.resetToDefault();
        loadAdminData();
        showToast('Dados de fábrica restaurados com sucesso!', 'success');
      });
    };
  }
}

/**
 * 8.1. Monitoramento do Armazenamento de Alta Capacidade (IndexedDB 20 MB+)
 */
function updateStorageUsageDisplay() {
  if (!window.DataManager || typeof window.DataManager.getStorageStats !== 'function') return;

  const stats = window.DataManager.getStorageStats();
  const pill = document.getElementById('storage-usage-pill');
  const bar = document.getElementById('storage-progress-bar');
  const usedText = document.getElementById('storage-used-text');
  const freeText = document.getElementById('storage-free-text');

  if (pill) pill.textContent = `${stats.percent}% Usado (${stats.kb} KB)`;
  if (bar) bar.style.width = `${Math.max(1, stats.percent)}%`;
  if (usedText) usedText.textContent = `Usado: ~${stats.kb} KB`;
  if (freeText) freeText.textContent = `Livre: ~${stats.freeMb} MB (${stats.freeKb.toLocaleString()} KB)`;
}
window.updateStorageUsageDisplay = updateStorageUsageDisplay;

/**
 * 9. Sistema de Modais e Confirmação
 */
function openAdminModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.add('active');
}

function closeAdminModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('active');
}
window.openAdminModal = openAdminModal;
window.closeAdminModal = closeAdminModal;

function confirmAction(message, onConfirm) {
  const msgEl = document.getElementById('modal-confirm-message');
  if (msgEl) msgEl.textContent = message;
  currentPendingConfirmAction = onConfirm;
  openAdminModal('modal-confirm');
}

/**
 * 9.1. Popup Informativo para Imagens Inadequadas ou Tamanho Alto
 */
function showImageAlertModal({ title, reason, tips }) {
  const titleEl = document.getElementById('modal-image-alert-title');
  const reasonEl = document.getElementById('modal-image-alert-reason');
  const tipsListEl = document.getElementById('modal-image-alert-tips');

  if (titleEl) titleEl.textContent = title || 'Imagem Inadequada';
  if (reasonEl) reasonEl.innerHTML = reason || 'A foto selecionada não pôde ser processada.';

  if (tipsListEl && Array.isArray(tips)) {
    tipsListEl.innerHTML = '';
    tips.forEach(tip => {
      const li = document.createElement('li');
      li.innerHTML = tip;
      tipsListEl.appendChild(li);
    });
  }

  openAdminModal('modal-image-alert');
}
window.showImageAlertModal = showImageAlertModal;

/**
 * 10. Sistema de Toast Notifications Modernas
 */
function showToast(message, type = 'success', duration = 3500) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast-message toast-${type}`;

  const getIcon = () => {
    switch(type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      default: return 'ℹ️';
    }
  };

  toast.innerHTML = `
    <div class="toast-content">
      <span>${getIcon()}</span>
      <span>${window.SecurityUtils.escapeHtml(message)}</span>
    </div>
    <span class="toast-close">✕</span>
  `;

  toast.querySelector('.toast-close').onclick = () => {
    toast.remove();
  };

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}
window.showToast = showToast;

/**
 * 11. Sidebar Mobile Toggle
 */
function setupMobileSidebar() {
  const toggleBtn = document.getElementById('mobile-sidebar-toggle');
  const sidebar = document.getElementById('admin-sidebar');
  if (!toggleBtn || !sidebar) return;

  let backdrop = document.querySelector('.admin-sidebar-backdrop');
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.className = 'admin-sidebar-backdrop';
    backdrop.setAttribute('aria-hidden', 'true');
    document.body.appendChild(backdrop);
  }

  const setOpen = (open) => {
    sidebar.classList.toggle('mobile-open', open);
    backdrop.classList.toggle('active', open);
    document.body.classList.toggle('admin-menu-open', open);
    toggleBtn.setAttribute('aria-expanded', String(open));
  };

  toggleBtn.onclick = (event) => {
    event.stopPropagation();
    setOpen(!sidebar.classList.contains('mobile-open'));
  };

  backdrop.onclick = () => setOpen(false);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setOpen(false);
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) setOpen(false);
  });
}
