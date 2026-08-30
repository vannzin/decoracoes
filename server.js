/**
 * Decorações by Mary - Backend Server para Railway (server.js)
 * Servidor Node.js + Express para persistência online global de dados e credenciais.
 */

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuração de diretório de dados persistentes
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'site-data.json');

// Garante que o diretório data exista
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Dados padrão iniciais
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
      description: 'Planejamento e montagem completa do seu evento com mobiliário refinado, painéis, arranjos e iluminação de alto padrão.',
      badge: 'Mais Pedido',
      icon: 'sparkles'
    },
    {
      id: 'srv_2',
      title: 'Cenografia & Painéis Temáticos',
      description: 'Estruturas completas com painéis sublimados, arcos orgânicos de balões, iluminação de destaque e ambientação temática para fotos perfeitas.',
      badge: 'Destaque',
      icon: 'cenografia'
    },
    {
      id: 'srv_3',
      title: 'Decoração Personalizada',
      description: 'Desenvolvemos um projeto visual único de acordo com seu sonho, paleta de cores e o espaço disponível.',
      badge: 'Exclusivo',
      icon: 'palette'
    },
    {
      id: 'srv_4',
      title: 'Mesa de Doces & Bolo',
      description: 'Composições harmônicas e elegantes para valorizar o ponto alto da sua festa com suportes nobres e arranjos florais.',
      badge: 'Essencial',
      icon: 'cake'
    }
  ],
  portfolio: [
    {
      id: 'port_1',
      title: 'Bosque Encantado dos Ursos',
      category: 'aniversario-infantil',
      categoryName: 'Aniversário Infantil',
      imageUrl: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80',
      description: 'Decoração mágica e rica em detalhes com arcos orgânicos em tons pastéis e personagens delicados.',
      date: '2026-02-15',
      images: [
        'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=800&q=80'
      ]
    },
    {
      id: 'port_2',
      title: 'Mini Wedding Rosé Gold',
      category: 'casamentos',
      categoryName: 'Casamentos',
      imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
      description: 'Composição intimista com flores nobres, velas aromáticas e detalhes em rosé gold.',
      date: '2026-02-20',
      images: [
        'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=800&q=80'
      ]
    },
    {
      id: 'port_3',
      title: 'Chá Revelação Sonho de Algodão',
      category: 'cha-revelacao',
      categoryName: 'Chá Revelação',
      imageUrl: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=80',
      description: 'Paleta suave em azul bebê e rosa chá com iluminação de destaque e cenografia afetiva.',
      date: '2026-02-10',
      images: [
        'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80'
      ]
    },
    {
      id: 'port_4',
      title: 'Batizado Angelical Puro Branco',
      category: 'batizados',
      categoryName: 'Batizados',
      imageUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
      description: 'Elegância minimalista com flores brancas, tecidos nobres e símbolos delicados de fé.',
      date: '2026-01-28',
      images: [
        'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80'
      ]
    },
    {
      id: 'port_5',
      title: 'Festa 30 Anos Elegance Gold',
      category: 'aniversario-adulto',
      categoryName: 'Aniversário Adulto',
      imageUrl: 'assets/2.png',
      description: 'Cenografia sofisticada com painel ripado, balões orgânicos cromados e mesa espelhada.',
      date: '2026-02-02',
      images: [
        'assets/2.png',
        'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80'
      ]
    },
    {
      id: 'port_6',
      title: 'Baile de Gala & Formatura',
      category: 'formatura',
      categoryName: 'Formatura',
      imageUrl: 'assets/1.png',
      description: 'Lustres de cristal, mesa de doces imperial e pontos instagramáveis memoráveis.',
      date: '2026-01-15',
      images: [
        'assets/1.png',
        'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80'
      ]
    }
  ],
  about: {
    title: 'Sobre a Decorações by Mary',
    subtitle: 'Amor, cuidado e excelência em cada projeto',
    text: 'A Decorações by Mary nasceu com o propósito de transformar momentos especiais em experiências verdadeiramente inesquecíveis. Cada detalhe é pensado com carinho, técnica e sensibilidade para tornar sua celebração única.',
    highlightText: ' A festa começa antes do parabéns: começa quando cada detalhe faz a pessoa sorrir.',
    quote: 'A festa começa antes do parabéns: começa quando cada detalhe faz a pessoa sorrir.',
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

// Funções auxiliares de leitura e gravação
function loadServerData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf8');
      const parsed = JSON.parse(raw);
      return {
        ...DEFAULT_DATA,
        ...parsed,
        auth: parsed.auth ? { ...DEFAULT_DATA.auth, ...parsed.auth } : DEFAULT_DATA.auth
      };
    }
  } catch (err) {
    console.error('Erro ao ler site-data.json:', err);
  }
  saveServerData(DEFAULT_DATA);
  return DEFAULT_DATA;
}

function saveServerData(data) {
  try {
    const toSave = {
      ...data,
      lastUpdated: new Date().toISOString()
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(toSave, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Erro ao salvar site-data.json:', err);
    return false;
  }
}

// Inicializa dados no primeiro boot
loadServerData();

// Middlewares
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Servir arquivos estáticos (Frontend)
app.use(express.static(__dirname));

// ==================== ENDPOINTS DA API ONLINE ====================

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    platform: 'Railway',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// 1. Obter todos os dados do site (Sincronização global)
app.get('/api/data', (req, res) => {
  const data = loadServerData();
  // Sanitiza auth para não expor a senha no endpoint público do site
  const sanitized = {
    ...data,
    auth: {
      user: data.auth?.user || 'admin',
      isDefault: data.auth?.isDefault ?? true,
      updatedAt: data.auth?.updatedAt
    }
  };
  res.json(sanitized);
});

// 2. Salvar dados do site (Fotos, serviços, textos)
app.post('/api/data', (req, res) => {
  try {
    const currentData = loadServerData();
    const incomingData = req.body;

    if (!incomingData || typeof incomingData !== 'object') {
      return res.status(400).json({ success: false, error: 'Dados inválidos' });
    }

    const merged = {
      ...currentData,
      ...incomingData,
      // Preserva auth caso não tenha sido enviado
      auth: incomingData.auth || currentData.auth || DEFAULT_DATA.auth,
      lastUpdated: new Date().toISOString()
    };

    const saved = saveServerData(merged);
    if (saved) {
      return res.json({ success: true, message: 'Dados salvos com sucesso no servidor Railway!', lastUpdated: merged.lastUpdated });
    } else {
      return res.status(500).json({ success: false, error: 'Erro ao gravar dados no servidor' });
    }
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// 3. Status público de autenticação
app.get('/api/auth/status', (req, res) => {
  const data = loadServerData();
  res.json({
    user: data.auth?.user || 'admin',
    isDefault: data.auth?.isDefault ?? true,
    updatedAt: data.auth?.updatedAt
  });
});

// 4. Validação de Login Online (Centralizado para qualquer IP)
app.post('/api/auth/login', (req, res) => {
  try {
    const { user, pass } = req.body || {};
    if (!user || !pass) {
      return res.status(400).json({ success: false, error: 'Usuário e senha são obrigatórios' });
    }

    const data = loadServerData();
    const serverUser = (data.auth?.user || 'admin').trim();
    const serverPass = (data.auth?.pass || 'mary123').trim();

    if (user.trim() === serverUser && pass.trim() === serverPass) {
      return res.json({
        success: true,
        message: 'Login realizado com sucesso!',
        user: serverUser,
        token: session__
      });
    } else {
      return res.status(401).json({ success: false, error: 'Usuário ou senha incorretos' });
    }
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// 5. Atualização de Usuário e Senha Online (Fixa para todos os IPs e celulares)
app.post('/api/auth/update', (req, res) => {
  try {
    const { currentAuth, newAuth } = req.body || {};
    
    // Suporte tanto a formato encapsulado quanto direto
    const userToSave = (newAuth?.user || req.body.user || '').trim();
    const passToSave = (newAuth?.pass || req.body.pass || '').trim();

    if (!userToSave || !passToSave) {
      return res.status(400).json({ success: false, error: 'Novo usuário e nova senha são obrigatórios' });
    }

    const data = loadServerData();
    const serverUser = (data.auth?.user || 'admin').trim();
    const serverPass = (data.auth?.pass || 'mary123').trim();

    // Se forneceu credenciais atuais, valida antes de trocar
    if (currentAuth) {
      const currUser = (currentAuth.user || '').trim();
      const currPass = (currentAuth.pass || '').trim();
      if (currUser !== serverUser || currPass !== serverPass) {
        return res.status(401).json({ success: false, error: 'A senha atual informada está incorreta' });
      }
    }

    const isDefault = (userToSave === 'admin' && passToSave === 'mary123');
    data.auth = {
      user: userToSave,
      pass: passToSave,
      isDefault,
      updatedAt: new Date().toISOString()
    };

    saveServerData(data);

    return res.json({
      success: true,
      message: 'Usuário e senha atualizados online com sucesso no Railway!',
      auth: {
        user: userToSave,
        isDefault,
        updatedAt: data.auth.updatedAt
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// 6. Restauração de Login para Padrão de Fábrica
app.post('/api/auth/reset', (req, res) => {
  try {
    const data = loadServerData();
    data.auth = {
      user: 'admin',
      pass: 'mary123',
      isDefault: true,
      updatedAt: new Date().toISOString()
    };
    saveServerData(data);
    return res.json({ success: true, message: 'Credenciais restauradas para o padrão online!' });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Fallback para SPA (Redireciona rotas inexistentes para index.html)
app.get('*', (req, res) => {
  if (req.path === '/admin') {
    return res.sendFile(path.join(__dirname, 'admin.html'));
  }
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Inicia o Servidor
app.listen(PORT, () => {
  console.log(====================================================);
  console.log(  Decorações by Mary - Servidor Online Ativo);
  console.log(  Porta: );
  console.log(  Ambiente: );
  console.log(  Deploy Pronto para: Railway.app);
  console.log(====================================================);
});
