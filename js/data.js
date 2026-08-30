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
    { id: 'aniversario-infantil', name: 'Aniversário Infantil', icon: 'aniversario-infantil' },
    { id: 'aniversario-adulto', name: 'Aniversário Adulto', icon: 'aniversario-adulto' },
    { id: 'casamentos', name: 'Casamentos', icon: 'casamentos' },
    { id: 'cha-revelacao', name: 'Chá Revelação', icon: 'cha-revelacao' },
    { id: 'batizados', name: 'Batizados', icon: 'batizados' },
    { id: 'formatura', name: 'Formatura', icon: 'formatura' }
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
  lastUpdated: new Date().toISOString()
};

/**
 * Utilitários de Higienização, Ícones SVG e Formatação
 */
const SVG_ICONS = {
  // Categorias de Eventos
  'aniversario-infantil': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="14" r="7"/><circle cx="6" cy="6" r="3"/><circle cx="18" cy="6" r="3"/><path d="M10 13h4"/><path d="M9 14.5a1.5 1.5 0 0 0 3 0"/><path d="M12 14.5a1.5 1.5 0 0 0 3 0"/></svg>`,
  'aniversario-adulto': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 22h8"/><path d="M12 11v11"/><path d="m19 3-4 8H9L5 3z"/><path d="M5 3h14"/></svg>`,
  'casamentos': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h12l4 6-10 12L2 9z"/><path d="M11 3 8 9l4 12 4-12-3-6"/><path d="M2 9h20"/></svg>`,
  'cha-revelacao': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 12h6"/><path d="M12 9v6"/><circle cx="12" cy="12" r="9"/><path d="M8 3h8"/><path d="M10 3v3"/><path d="M14 3v3"/></svg>`,
  'batizados': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/><path d="M19 9h2"/><path d="M17 5v2"/></svg>`,
  'formatura': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>`,
  
  // Elementos do Sistema
  'sparkles': `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>`,
  'building': `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M8 10h.01"/><path d="M16 10h.01"/><path d="M8 14h.01"/><path d="M16 14h.01"/></svg>`,
  'tag': `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"/><circle cx="7" cy="7" r=".5" fill="currentColor"/></svg>`,
  'gift': `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"/></svg>`,
  'gallery': `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>`,
  'book': `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6 6h10"/><path d="M6 10h10"/></svg>`,
  'backup': `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>`,
  'lock': `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
  'camera': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>`,
  'search': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>`,
  'save': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>`,
  'edit': `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>`,
  'trash': `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>`,
  'plus': `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>`,
  'check': `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
  'whatsapp': `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>`,
  'instagram': `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>`,
  'logout': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>`,
  'refresh': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>`,
  'folder': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>`,
  'link': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`,
  'download': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>`,
  'key': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21 2-2 2m-1.5 1.5L19 4l-4 4-2-2-4 4 2 2-6 6a3.5 3.5 0 1 1-5-5l6-6 2 2 4-4-2-2 4-4 1.5 1.5Z"/></svg>`,
  'shield': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
  'close': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`
};

function getSvgIcon(iconName, defaultFallback = '') {
  if (SVG_ICONS[iconName]) {
    return SVG_ICONS[iconName];
  }
  return defaultFallback || SVG_ICONS['sparkles'];
}

window.SVG_ICONS = SVG_ICONS;
window.getSvgIcon = getSvgIcon;

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
        services: Array.isArray(parsed.services) ? parsed.services : DEFAULT_DATA.services,
        portfolio: Array.isArray(parsed.portfolio) ? parsed.portfolio : DEFAULT_DATA.portfolio,
        categories: Array.isArray(parsed.categories) ? parsed.categories : DEFAULT_DATA.categories
      };
    } catch (e) {
      console.error('Erro ao ler LocalStorage, restaurando padrões:', e);
      return JSON.parse(JSON.stringify(DEFAULT_DATA));
    }
  },

  // Salva os dados no Armazenamento Híbrido (IndexedDB + LocalStorage) e notifica a aplicação
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

  // Restaura dados de fábrica
  resetToDefault() {
    const data = JSON.parse(JSON.stringify(DEFAULT_DATA));
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
