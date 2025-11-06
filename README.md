# 💰 Fingestio - Sistema de Gestão Financeira

Um sistema moderno e intuitivo para gerenciamento de finanças pessoais, desenvolvido com Next.js 13, TypeScript e Tailwind CSS.

## 🧪 Usuário de Teste

Para testar a aplicação, utilize as seguintes credenciais:

```
Email: teste@teste.com
Senha: teste123
```

**Funcionalidades disponíveis com usuário teste:**
- ✅ Login completo no sistema
- ✅ Visualização do dashboard financeiro
- ✅ Criação e gestão de transações
- ✅ Gerenciamento de categorias personalizadas
- ✅ Controle de cartões de crédito/débito
- ✅ Todas as funcionalidades da aplicação

## 🚀 Funcionalidades

- 📊 **Dashboard Financeiro**: Visualização completa do seu saldo e transações
- 💳 **Gestão de Cartões**: Controle de cartões de crédito e débito
- 📂 **Categorização**: Organize suas transações por categorias personalizadas
- 💸 **Transações**: Registro completo de receitas, despesas e investimentos
- 📱 **Design Responsivo**: Interface otimizada para mobile e desktop
- 🌙 **Tema Escuro**: Design moderno com paleta de cores cinza
- 🔐 **Autenticação Segura**: Sistema de login e proteção de rotas

## 🛠️ Tecnologias Utilizadas

- **Frontend**: Next.js 13, React 18, TypeScript
- **Styling**: Tailwind CSS, CSS Modules
- **UI Components**: Radix UI, Lucide Icons
- **HTTP Client**: Axios

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)
- [Git](https://git-scm.com/)

## ⚡ Instalação e Configuração

### 1. Clone o repositório

```bash
git clone https://github.com/FIAP-FINGESTIO/fingestio-web.git
cd fingestio-web
```

### 2. Instale as dependências

```bash
npm install
# ou
yarn install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

### 4. Execute a aplicação

```bash
npm run dev
# ou
yarn dev
```

A aplicação estará disponível em [http://localhost:3000](http://localhost:3000)

## 🏗️ Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia o servidor de desenvolvimento

# Produção
npm run build        # Gera build de produção
npm run start        # Inicia servidor de produção

# Qualidade de código
npm run lint         # Executa ESLint
npm run typecheck    # Verifica tipos TypeScript
```

## 📁 Estrutura do Projeto

```
fingestio-web/
├── public/                 # Arquivos estáticos
│   └── logo.svg           # Logo da aplicação
├── src/
│   ├── app/               # App Router do Next.js 13
│   │   ├── login/         # Página de login
│   │   ├── transactions/  # Página de transações
│   │   ├── categories/    # Página de categorias
│   │   └── cards/         # Página de cartões
│   ├── components/        # Componentes reutilizáveis
│   │   ├── ui/           # Componentes de UI base
│   │   ├── transactions/ # Componentes de transações
│   │   ├── categories/   # Componentes de categorias
│   │   └── cards/        # Componentes de cartões
│   ├── hooks/            # Custom hooks
│   ├── lib/              # Utilitários e serviços
│   └── providers/        # Context providers
├── package.json
└── README.md
```


## 🎨 Personalização

### Componentes UI

Os componentes estão na pasta `src/components/ui/` e são baseados no Radix UI com Tailwind CSS.

## 📱 Funcionalidades Mobile

- Layout responsivo otimizado para mobile
- Bottom navigation para fácil acesso
- Modals com scroll para telas pequenas
- Touch-friendly interface

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
