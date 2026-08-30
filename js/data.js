/**
 * Decorações by Mary - Data Layer (js/data.js)
 * Gerenciador de dados centralizado utilizando LocalStorage como fonte única da verdade.
 * Projetado para fácil transição futura para Supabase / PostgreSQL.
 */

const STORAGE_KEY = 'decoracoes_by_mary_data_v1';

// Dados Padrão Iniciais (Design refinado e fotos de alta resolução)
const DEFAULT_DATA = {
  company: {
    name: 'Decorações by Mary',
    slogan: 'Transformando momentos especiais em memórias inesquecíveis.',
    description: 'Especialistas em decorações elegantes para aniversários, casamentos, batizados, chás revelação e eventos corporativos.',
    whatsapp: '5531999998888',
    whatsappFormatted: '(31) 99999-8888',
    whatsappMessage: 'Olá! Encontrei o site da Decorações by Mary e gostaria de solicitar um orçamento para meu evento em Contagem e região.',
    instagram: 'https://www.instagram.com/decoracoesbymary/',
    instagramHandle: '@decoracoesbymary',
    location: 'MG - CONTAGEM',
    email: 'contato@decoracoesbymary.com.br'
  },
  hero: {
    badge: '✨ Decorações Exclusivas & Festas Inesquecíveis',
    title: 'A magia dos seus sonhos em cada detalhe',
    subtitle: 'Criamos cenários deslumbrantes com sofisticação, delicadeza e amor para tornar a sua comemoração única e marcante.',
    primaryButtonText: 'Solicitar Orçamento',
    secondaryButtonText: 'Ver Nosso Portfólio'
  },
  categories: [
    { id: 'aniversario-infantil', name: 'Aniversário Infantil', icon: '🧸' },
    { id: 'aniversario-adulto', name: 'Aniversário Adulto', icon: '🥂' },
    { id: 'casamentos', name: 'Casamentos', icon: '💍' },
    { id: 'cha-revelacao', name: 'Chá Revelação', icon: '🍼' },
    { id: 'batizados', name: 'Batizados', icon: '🕊️' },
    { id: 'formatura', name: 'Formatura', icon: '🎓' }
  ],
  services: [
    {
      id: 'srv_1',
      title: 'Decoração Completa',
      description: 'Planejamento e montagem completa da decoração do evento. Cuidamos de todo o mobiliário, painéis, flores, iluminação cênica e mesa de doces.',
      icon: 'sparkles',
      badge: 'Mais Escolhido'
    },
    {
      id: 'srv_2',
      title: 'Cenografia & Painéis Temáticos',
      description: 'Estruturas completas com painéis sublimados, arcos orgânicos de balões, iluminação de destaque e ambientação temática para fotos perfeitas.',
      icon: 'box',
      badge: 'Destaque'
    },
    {
      id: 'srv_3',
      title: 'Decoração Personalizada',
      description: 'Projeto exclusivo desenvolvido sob medida de acordo com o tema, paleta de cores e estilo escolhido pelo cliente para momentos inesquecíveis.',
      icon: 'palette',
      badge: 'Exclusividade'
    },
    {
      id: 'srv_4',
      title: 'Mesa de Doces & Bolo',
      description: 'Composição harmoniosa de bandejas, arranjos florais nobres e suportes especiais para destacar o bolo e os doces da sua festa.',
      icon: 'cake',
      badge: 'Sofisticação'
    }
  ],
  portfolio: [
    {
      id: 'port_1',
      title: 'Casamento Clássico Rosé & Gold',
      category: 'casamentos',
      categoryName: 'Casamentos',
      imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=80',
      images: [
        'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1000&q=80'
      ],
      description: 'Cenografia romântica com arranjos florais em tons de rosa seco, dourado e iluminação aconchegante para cerimônia intimista.'
    },
    {
      id: 'port_2',
      title: 'Aniversário Jardim Encantado',
      category: 'aniversario-infantil',
      categoryName: 'Aniversário Infantil',
      imageUrl: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1000&q=80',
      images: [
        'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=1000&q=80'
      ],
      description: 'Decoração lúdica e suave com arcos orgânicos de balões, elementos em madeira nobre e delicadeza em cada cantinho.'
    },
    {
      id: 'port_3',
      title: 'Chá Revelação Sonho de Algodão',
      category: 'cha-revelacao',
      categoryName: 'Chá Revelação',
      imageUrl: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1000&q=80',
      images: [
        'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1000&q=80'
      ],
      description: 'Paleta pastel equilibrada com painéis ripados, ursinhos artesanais e arranjos aéreos espetaculares.'
    },
    {
      id: 'port_4',
      title: 'Batizado Angelical Puro Branco & Rosé',
      category: 'batizados',
      categoryName: 'Batizados',
      imageUrl: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1000&q=80',
      images: [
        'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1000&q=80'
      ],
      description: 'Ambiente de paz e ternura com louças finas, folhagens nobres e toques delicados em tons rosé e dourado.'
    },
    {
      id: 'port_5',
      title: 'Aniversário Adulto Boteco party',
      category: 'aniversario-adulto',
      categoryName: 'Aniversário Adulto',
      imageUrl: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=1000&q=80',
      images: [
        'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=80'
      ],
      description: 'Festa temática com decoração de boteco realizada com carinho e bastante álcool.'
    },
    {
      id: 'port_6',
      title: 'Celebração de Formatura Glamour',
      category: 'formatura',
      categoryName: 'Formatura',
      imageUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1000&q=80',
      images: [
        'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1000&q=80'
      ],
      description: 'Cenografia sofisticada para festa de formatura com painel moderno, iluminação especial e mesa de brindes.'
    }
  ],
  about: {
    title: 'Sobre a Decorações by Mary',
    subtitle: 'Amor, cuidado e excelência em cada projeto',
    text: 'A Decorações by Mary nasceu com o propósito de transformar momentos especiais em experiências verdadeiramente inesquecíveis. Cada detalhe é pensado com carinho, técnica e sensibilidade para tornar sua celebração única. Combinamos bom gosto, pontualidade e dedicação absoluta para que você aproveite seu grande dia sem preocupações.',
    highlightText: '“A festa começa antes do parabéns: começa quando cada detalhe faz a pessoa sorrir.”',
    quote: '“A festa começa antes do parabéns: começa quando cada detalhe faz a pessoa sorrir.”',
    imageUrl: 'assets/logo-mary.jpg',
    logoUrl: 'assets/logo-mary.jpg',
    stats: [
      { number: '500+', label: 'Festas Realizadas' },
      { number: '100%', label: 'Clientes Satisfeitos' },
      { number: '5+', label: 'Anos de História' }
    ]
  },
  auth: {
    user: 'admin',
    pass: 'mary123',
    isDefault: true,
    updatedAt: new Date().toISOString()
  },
  lastUpdated: new Date().toISOString()
};

/**
 * Utilitários de Higienização e Formatação
 */
const SecurityUtils = {
  // Prevenção contra injeção de HTML malicioso (XSS)
  escapeHtml(str) {
    if (typeof str !== 'string') return str;
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  },

  // Higieniza apenas para dígitos (WhatsApp)
  cleanPhone(phone) {
    if (!phone) return '';
    return String(phone).replace(/\D/g, '');
  },

  // Validação simplificada de URLs
  isValidUrl(string) {
    try {
      const url = new URL(string);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (_) {
      return false;
    }
  }
};

// ==========================================
// IndexedDB Storage Engine (Alta Capacidade: 20MB+)
// ==========================================
const IDB_CONFIG = {
  dbName: 'decoracoes_mary_db',
  version: 1,
  storeName: 'site_store'
};

const IndexedDBStorage = {
  open() {
    return new Promise((resolve, reject) => {
      if (!window.indexedDB) {
        return resolve(null);
      }
      const req = indexedDB.open(IDB_CONFIG.dbName, IDB_CONFIG.version);
      req.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(IDB_CONFIG.storeName)) {
          db.createObjectStore(IDB_CONFIG.storeName);
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(null);
    });
  },

  async set(key, value) {
    try {
      const db = await this.open();
      if (!db) return false;
      return new Promise((resolve) => {
        const tx = db.transaction(IDB_CONFIG.storeName, 'readwrite');
        const store = tx.objectStore(IDB_CONFIG.storeName);
        store.put(value, key);
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => resolve(false);
      });
    } catch (err) {
      console.warn('IndexedDB set erro:', err);
      return false;
    }
  },

  async get(key) {
    try {
      const db = await this.open();
      if (!db) return null;
      return new Promise((resolve) => {
        const tx = db.transaction(IDB_CONFIG.storeName, 'readonly');
        const store = tx.objectStore(IDB_CONFIG.storeName);
        const req = store.get(key);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => resolve(null);
      });
    } catch (err) {
      console.warn('IndexedDB get erro:', err);
      return null;
    }
  }
};

window.IndexedDBStorage = IndexedDBStorage;

// ==========================================
// DataManager API
// ==========================================
const DataManager = {
  STORAGE_KEY,

  // Retorna estatísticas de uso em relação à meta expandida de 20 MB
  getStorageStats() {
    const dataStr = localStorage.getItem(STORAGE_KEY) || '';
    const bytes = new Blob([dataStr]).size;
    const kb = Number((bytes / 1024).toFixed(2));
    const mb = Number((bytes / (1024 * 1024)).toFixed(3));
    const limitMb = 20.0; // 20 MB
    const limitKb = 20480.0;
    const percent = Math.min(100, Math.max(0.1, (kb / limitKb) * 100)).toFixed(1);
    const freeMb = Number((limitMb - mb).toFixed(2));
    const freeKb = Number((limitKb - kb).toFixed(1));

    return {
      bytes,
      kb,
      mb,
      limitMb,
      limitKb,
      percent,
      freeMb,
      freeKb,
      engine: 'IndexedDB + LocalStorage (20 MB+)'
    };
  },

  // Carrega os dados persistidos com validação completa
  load() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        this.save(DEFAULT_DATA, false);
        return JSON.parse(JSON.stringify(DEFAULT_DATA));
      }
      const parsed = JSON.parse(stored);
      
      // Atualiza automaticamente caso esteja com o valor padrão antigo
      if (parsed.company && (parsed.company.location === 'São Paulo - SP e Região' || parsed.company.location === 'Contagem - MG e Região')) {
        parsed.company.location = 'MG - CONTAGEM';
      }

      // Migração e limpeza estrita de categorias legadas
      if (Array.isArray(parsed.categories)) {
        // Remove qualquer categoria com nome ou id 'Infantil', 'aniversarios', 'eventos', 'mesas'
        parsed.categories = parsed.categories.filter(c => 
          c.id !== 'infantil' && 
          c.name !== 'Infantil' && 
          c.id !== 'aniversarios' && 
          c.id !== 'eventos' && 
          c.id !== 'mesas'
        );
        
        // Se a lista resultante não tiver todas as 6 categorias oficiais, sincroniza com o padrão oficial
        const officialIds = DEFAULT_DATA.categories.map(c => c.id);
        const hasAllOfficial = officialIds.every(id => parsed.categories.some(c => c.id === id));
        if (!hasAllOfficial || parsed.categories.length !== DEFAULT_DATA.categories.length) {
          parsed.categories = DEFAULT_DATA.categories;
        }
      } else {
        parsed.categories = DEFAULT_DATA.categories;
      }

      // Atualiza referências de categorias no portfólio salvo
      if (Array.isArray(parsed.portfolio)) {
        parsed.portfolio.forEach(item => {
          if (item.category === 'infantil' || item.category === 'aniversarios') {
            if (item.id === 'port_5' || (item.title && (item.title.includes('30 Anos') || item.title.includes('Adulto')))) {
              item.category = 'aniversario-adulto';
              item.categoryName = 'Aniversário Adulto';
            } else {
              item.category = 'aniversario-infantil';
              item.categoryName = 'Aniversário Infantil';
            }
          } else if (item.category === 'eventos') {
            item.category = 'aniversario-adulto';
            item.categoryName = 'Aniversário Adulto';
          } else if (item.category === 'mesas') {
            item.category = 'formatura';
            item.categoryName = 'Formatura';
          }
        });
      }

      // Migração de serviços antigos com 'Pegue e Monte'
      if (Array.isArray(parsed.services)) {
        parsed.services.forEach(srv => {
          if (srv.title && srv.title.toLowerCase().includes('pegue e monte')) {
            srv.title = 'Cenografia & Painéis Temáticos';
            srv.description = 'Estruturas completas com painéis sublimados, arcos orgânicos de balões, iluminação de destaque e ambientação temática para fotos perfeitas.';
            srv.badge = 'Destaque';
          }
        });
      }

      // Atualiza imagem legada da seção Sobre para o logotipo padrão se ainda for a URL antiga do unsplash ou logo.svg
      if (parsed.about && (parsed.about.imageUrl?.includes('unsplash.com') || parsed.about.imageUrl?.includes('logo.svg'))) {
        parsed.about.imageUrl = 'assets/logo-mary.jpg';
        parsed.about.logoUrl = 'assets/logo-mary.jpg';
      }

      // Garante que a lista de categorias contenha as 6 categorias padrão oficiais caso esteja desatualizada
      if (!Array.isArray(parsed.categories) || parsed.categories.length < 4 || parsed.categories.some(c => c.id === 'infantil' || c.id === 'eventos')) {
        parsed.categories = JSON.parse(JSON.stringify(DEFAULT_DATA.categories));
      }

      // Garante integridade de propriedades essenciais
      return {
        ...DEFAULT_DATA,
        ...parsed,
        company: { ...DEFAULT_DATA.company, ...(parsed.company || {}) },
        hero: { ...DEFAULT_DATA.hero, ...(parsed.hero || {}) },
        about: { ...DEFAULT_DATA.about, ...(parsed.about || {}) },
        auth: parsed.auth ? { ...DEFAULT_DATA.auth, ...parsed.auth } : DEFAULT_DATA.auth,
        services: Array.isArray(parsed.services) ? parsed.services : DEFAULT_DATA.services,
        portfolio: Array.isArray(parsed.portfolio) ? parsed.portfolio : DEFAULT_DATA.portfolio,
        categories: Array.isArray(parsed.categories) ? parsed.categories : DEFAULT_DATA.categories
      };
    } catch (e) {
      console.error('Erro ao ler LocalStorage, restaurando padrões:', e);
      return JSON.parse(JSON.stringify(DEFAULT_DATA));
    }
  },

  // Obtém as credenciais de autenticação ativas (com fallback em múltiplas camadas)
  getAuth() {
    try {
      const data = this.load();
      if (data && data.auth && data.auth.user && data.auth.pass) {
        return data.auth;
      }
    } catch (e) {}

    try {
      const stored = localStorage.getItem('decoracoes_mary_auth_credentials');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.user && parsed.pass) {
          return parsed;
        }
      }
    } catch (e) {}

    return {
      user: 'admin',
      pass: 'mary123',
      isDefault: true
    };
  },

  // Salva permanentemente as novas credenciais de acesso em todas as camadas
  saveAuth(user, pass) {
    const cleanUser = String(user || 'admin').trim();
    const cleanPass = String(pass || 'mary123').trim();
    const isDefault = (cleanUser === 'admin' && cleanPass === 'mary123');

    const authObj = {
      user: cleanUser,
      pass: cleanPass,
      isDefault,
      updatedAt: new Date().toISOString()
    };

    // 1. Salva no banco de dados principal do site
    try {
      const currentData = this.load();
      currentData.auth = authObj;
      this.save(currentData, false);
    } catch (e) {
      console.warn('Erro ao salvar auth no data principal:', e);
    }

    // 2. Salva em chave direta de LocalStorage
    try {
      localStorage.setItem('decoracoes_mary_auth_credentials', JSON.stringify(authObj));
    } catch (e) {}

    // 3. Salva no IndexedDB de forma dedicada
    try {
      IndexedDBStorage.set('auth_data', authObj);
    } catch (e) {}

    // 4. Se estiver em ambiente HTTP/HTTPS (Railway / Nuvem), persiste online na API para todos os IPs
    if (typeof window !== 'undefined' && window.location && window.location.protocol.startsWith('http')) {
      fetch('/api/auth/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: cleanUser, pass: cleanPass })
      }).catch(err => console.warn('Aviso: API Railway offline ou executando localmente:', err));
    }

    return authObj;
  },

  // Sincroniza dados e credenciais da nuvem (Railway) no boot
  async syncWithServer() {
    try {
      if (typeof window !== 'undefined' && window.location && window.location.protocol.startsWith('http')) {
        const res = await fetch('/api/data');
        if (res.ok) {
          const serverData = await res.json();
          if (serverData && typeof serverData === 'object') {
            try {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(serverData));
              IndexedDBStorage.set('app_data', serverData);
              if (serverData.auth) {
                localStorage.setItem('decoracoes_mary_auth_credentials', JSON.stringify(serverData.auth));
                IndexedDBStorage.set('auth_data', serverData.auth);
              }
            } catch (_) {}
            return serverData;
          }
        }
      }
    } catch (e) {
      // Offline ou estático - continua com dados locais
    }
    return null;
  },

  // Restaura as credenciais para o padrão de fábrica
  resetAuth() {
    if (typeof window !== 'undefined' && window.location && window.location.protocol.startsWith('http')) {
      fetch('/api/auth/reset', { method: 'POST' }).catch(() => {});
    }
    return this.saveAuth('admin', 'mary123');
  },

  // Salva os dados no Armazenamento Híbrido (IndexedDB + LocalStorage + Nuvem Railway) e notifica a aplicação
  save(data, dispatch = true) {
    try {
      const dataToSave = {
        ...data,
        lastUpdated: new Date().toISOString()
      };
      
      // Salva no IndexedDB (Suporta 20MB, 50MB, 100MB+)
      IndexedDBStorage.set('app_data', dataToSave);

      // Salva no LocalStorage síncrono para velocidade instantânea
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
      } catch (lsErr) {
        console.warn('LocalStorage cota excedida, preservado com sucesso no IndexedDB:', lsErr);
      }

      // Salva na nuvem no Railway para todos os IPs e dispositivos
      if (typeof window !== 'undefined' && window.location && window.location.protocol.startsWith('http')) {
        fetch('/api/data', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dataToSave)
        }).catch(err => console.warn('Aviso: API Railway offline ou estático:', err));
      }
      
      if (dispatch) {
        // Dispara evento para atualização da aba atual
        window.dispatchEvent(new CustomEvent('maryDataUpdated', { detail: dataToSave }));
      }
      return true;
    } catch (e) {
      console.error('Erro ao salvar no LocalStorage:', e);
      return false;
    }
  },

  // Restaura dados de fábrica mantendo as credenciais de acesso
  resetToDefault(preserveAuth = true) {
    const activeAuth = preserveAuth ? this.getAuth() : DEFAULT_DATA.auth;
    const data = JSON.parse(JSON.stringify(DEFAULT_DATA));
    if (preserveAuth && activeAuth) {
      data.auth = activeAuth;
    }
    this.save(data, true);
    return data;
  },

  // Exporta backup em JSON
  exportBackup() {
    const data = this.load();
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const timestamp = new Date().toISOString().slice(0, 10);
    const link = document.createElement('a');
    link.href = url;
    link.download = `decoracoes-by-mary-backup-${timestamp}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  // Importa e valida o JSON de backup
  importBackup(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      
      // Validação de estrutura mínima
      if (!parsed || typeof parsed !== 'object') {
        throw new Error('O arquivo de backup não possui uma estrutura de dados válida.');
      }
      if (!parsed.company || !parsed.company.name) {
        throw new Error('Arquivo de backup inválido: dados da empresa ausentes.');
      }
      if (!Array.isArray(parsed.services) || !Array.isArray(parsed.portfolio)) {
        throw new Error('Arquivo de backup inválido: listas de serviços ou portfólio corrompidas.');
      }

      this.save(parsed, true);
      return { success: true, data: parsed };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // Gera link seguro para o WhatsApp com mensagem codificada
  getWhatsAppUrl(customMessage = null) {
    const data = this.load();
    const rawNumber = SecurityUtils.cleanPhone(data.company.whatsapp || '5511999998888');
    const msg = customMessage || data.company.whatsappMessage || 'Olá! Gostaria de um orçamento.';
    const encodedMsg = encodeURIComponent(msg);
    return `https://wa.me/${rawNumber}?text=${encodedMsg}`;
  },

  // Gera link direto seguro para o Instagram
  getInstagramUrl() {
    const data = this.load();
    let url = data.company.instagram || 'https://www.instagram.com/decoracoesbymary/';
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = `https://${url}`;
    }
    return url;
  }
};

// Listener global para sincronização entre abas abertas
window.addEventListener('storage', (event) => {
  if (event.key === STORAGE_KEY && event.newValue) {
    try {
      const updatedData = JSON.parse(event.newValue);
      window.dispatchEvent(new CustomEvent('maryDataUpdated', { detail: updatedData }));
    } catch (e) {
      console.error('Erro ao sincronizar evento storage:', e);
    }
  }
});

// Exporta para escopo global nos navegadores
window.DataManager = DataManager;
window.SecurityUtils = SecurityUtils;
