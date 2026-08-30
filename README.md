# 🌸 Decorações by Mary - Website & Painel Administrativo

Site institucional, vitrine de serviços e portfólio completo para a empresa **Decorações by Mary**, especializada em cenografia e decoração de festas e eventos de alto padrão (aniversários, casamentos, chá revelação, batizados e eventos corporativos).

---

## 🎨 Identidade Visual & Design System

O projeto foi concebido com uma estética refinada, transmitindo delicadeza, sofisticação e profissionalismo:
* **Paleta de Cores**: Rosé (`#C97A6E`, `#FDF2F0`), Rosa Claro, Creme (`#FFFDFB`), Branco e Dourado Nobre (`#C5A059`, `#DFBE7B`).
* **Tipografia Nobre**: *Playfair Display* (Títulos e elementos de impacto) e *Plus Jakarta Sans* (Textos e interfaces limpas).
* **Componentes**: Categorias em formato stories/destaques circulares, grid de portfólio estilo Instagram com visualizador em alta definição (**Lightbox Modal**), cards modernos de serviços e botões com animações suaves de hover.

---

## 📁 Estrutura de Arquivos do Projeto

```text
decoracoes-by-mary/
│
├── index.html              # Site público institucional e portfólio
├── admin.html              # Painel de controle administrativo completo
│
├── css/
│   ├── style.css           # Design system, layout responsivo e animações do site público
│   └── admin.css           # Estilos do painel de administração, dashboard, modais e toasts
│
├── js/
│   ├── data.js             # Camada central de dados (LocalStorage, validação, XSS sanitization)
│   ├── site.js             # Controlador da página pública, filtros dinâmicos e Lightbox
│   └── admin.js            # Controlador do painel admin, CRUDs de serviços/portfólio e backups
│
├── assets/
│   └── favicon.svg         # Favicon em formato SVG rosé gold
│
└── README.md               # Documentação técnica e guia de execução
```

---

## 🚀 Como Executar o Projeto Localmente

### Opção 1: Utilizando o VS Code com a extensão Live Server (Recomendado)
1. Abra a pasta `DECORACOES` no **VS Code**.
2. Caso ainda não tenha, instale a extensão **Live Server** (de Ritwick Dey).
3. Clique com o botão direito no arquivo `index.html` e selecione **"Open with Live Server"**.
4. O site abrirá automaticamente no seu navegador padrão (geralmente em `http://127.0.0.1:5500/index.html`).

### Opção 2: Abertura Direta
Você também pode clicar duas vezes no arquivo `index.html` para abrir diretamente no navegador. Para testar o painel administrativo, basta abrir `admin.html`.

---

## 🔐 Como Acessar o Painel Administrativo

1. Abra o arquivo `admin.html` no navegador (ou clique no link **⚙️ Painel de Controle** no rodapé do site).
2. Utilize as credenciais de demonstração:
   * **Usuário:** `admin`
   * **Senha:** `mary123`
3. Após entrar, você terá acesso ao Dashboard com métricas em tempo real e às abas de gerenciamento.

---

## ⚙️ Funcionalidades do Painel Administrativo

1. **Dashboard:** Visão geral da quantidade de serviços e fotos cadastradas, status de WhatsApp/Instagram e atalhos rápidos.
2. **Dados da Empresa & Redes:**
   * Altere Nome, Slogan, Localização e Região de atendimento.
   * Configure o WhatsApp com mensagem padrão pré-preenchida (gerando link `wa.me/NUMERO`).
   * Configure o Instagram oficial (`https://www.instagram.com/decoracoesbymary/`).
3. **Página Inicial (Hero):** Modifique títulos, badges e textos da seção principal.
4. **CRUD de Serviços:** Adicione novos pacotes (Decoração Completa, Pegue e Monte, Personalizada, etc.), edite textos, badges e ícones ou exclua serviços existentes.
5. **CRUD do Portfólio:** Adicione trabalhos com URL da foto (com preview dinâmico), selecione a categoria, insira títulos e descrições. Edite ou remova qualquer trabalho.
6. **Seção Sobre:** Atualize a história da empresa e a foto da decoradora em tempo real.
7. **Backup e Restauração:**
   * **Exportar Backup:** Gera o arquivo `decoracoes-by-mary-backup.json` com todos os dados atuais.
   * **Importar Backup:** Permite carregar um arquivo JSON previamente exportado (com validação completa de schema).
   * **Restaurar Padrão:** Botão de emergência para restaurar os dados de fábrica do projeto.
8. **Notificações Toast:** Feedbacks visuais modernos para todas as ações de salvar, editar ou excluir.

---

## 🔄 Sincronização em Tempo Real

Graças ao evento `window.addEventListener('storage', ...)` e ao disparador customizado no `data.js`, qualquer alteração salva no painel de administração é refletida **instantaneamente** no site público aberto em outra aba ou janela do navegador, sem necessidade de recarregar a página manualmente.

---

## 🛡️ Nota Importante sobre Segurança & Produção

> [!WARNING]
> O login (`admin` / `mary123`) e o armazenamento em `LocalStorage` implementados nesta versão inicial são destinados para **demonstração, testes locais e prototipagem**.
> Para colocar o site em produção com múltiplos usuários ou gestão remota, é indispensável integrar com um backend real.

---

## 🔮 Guia de Evolução Futura: Migração para Supabase

A arquitetura do projeto foi intencionalmente isolada na camada `js/data.js` para tornar a futura migração para o **Supabase** extremamente simples e direta:

1. **Supabase Auth:** Substituir a validação simples de senha pelo `supabase.auth.signInWithPassword({ email, password })`.
2. **Supabase PostgreSQL:**
   * Tabela `company_settings` para as configurações e contatos.
   * Tabela `services` para o CRUD de serviços (`id`, `title`, `description`, `badge`, `icon`).
   * Tabela `portfolio` para o CRUD de trabalhos (`id`, `title`, `category`, `image_url`, `description`).
3. **Supabase Storage:** Permitir o upload direto de fotos de decorações do computador/celular para um bucket `portfolio-images`, substituindo a necessidade de colar links externos.
4. **Row Level Security (RLS):** Permitir leitura pública (`SELECT`) para todos os visitantes e escrita (`INSERT`, `UPDATE`, `DELETE`) apenas para usuários autenticados como administrador.

---

## 📄 Licença e Direitos

Projeto desenvolvido para **Decorações by Mary**. Todos os direitos reservados.
