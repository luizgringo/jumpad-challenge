# JumpAD Blog Challenge

![JumpAD Logo](https://jumpad.ai/images/jumpad_white.png)

## 📝 Descrição

Este projeto é uma aplicação web moderna desenvolvida como parte do desafio técnico da JumpAD. Trata-se de um blog interativo que consome dados de uma API externa, apresentando posts, comentários e informações de usuários em uma interface elegante e responsiva.

**Demo:** [https://jumpad-challenge.vercel.app/](https://jumpad-challenge.vercel.app/)

## 🚀 Tecnologias Utilizadas

- **React 18**: Biblioteca JavaScript para construção de interfaces de usuário
- **TypeScript**: Superset tipado de JavaScript que compila para JavaScript puro
- **Vite**: Build tool e dev server extremamente rápido para desenvolvimento moderno
- **Material UI v5**: Framework de componentes React para um design consistente e responsivo
- **React Router v6**: Biblioteca de roteamento para navegação entre páginas
- **ESLint**: Ferramenta de linting para identificar e corrigir problemas no código

## 🏗️ Arquitetura

O projeto segue uma arquitetura de componentes modular e reutilizável, organizada da seguinte forma:

```
src/
├── components/         # Componentes reutilizáveis em toda a aplicação
│   ├── PostCard.tsx    # Card para exibição de posts na listagem
│   ├── PageBanner.tsx  # Banner para cabeçalho de páginas
│   └── ...
├── Layout/             # Componentes de layout da aplicação
│   └── Layout.tsx      # Layout principal com header, footer e navegação
├── pages/              # Páginas da aplicação
│   ├── Home/           # Página inicial com listagem de posts
│   ├── Post/           # Componentes relacionados a posts
│   │   ├── PostDetail.tsx     # Página de detalhes do post
│   │   ├── CoverImage.tsx     # Componente de imagem de capa
│   │   ├── PostAuthorInfo.tsx # Informações do autor do post
│   │   ├── PostContent.tsx    # Conteúdo formatado do post
│   │   └── PostComments.tsx   # Seção de comentários do post
│   └── User/           # Componentes relacionados a usuários
│       ├── UserList/          # Listagem de usuários
│       └── UserDetail/        # Detalhes do usuário
├── services/           # Serviços para comunicação com APIs
├── types/              # Definições de tipos TypeScript
└── utils/              # Funções utilitárias
    ├── avatar.ts       # Geração de avatares para usuários
    └── imagePreloader.ts # Pré-carregamento de imagens
```

## 🌟 Funcionalidades

- **Listagem de Posts**: Exibição de posts com paginação e layout responsivo
- **Detalhes do Post**: Visualização completa do post com comentários
- **Listagem de Usuários**: Exibição de todos os usuários do blog
- **Perfil do Usuário**: Visualização detalhada do perfil do usuário com seus posts
- **Pré-carregamento de Imagens**: Sistema de pré-carregamento para melhor experiência do usuário
- **Avatares Realistas**: Geração de avatares realistas para usuários usando serviços externos
- **Design Responsivo**: Interface adaptável a diferentes tamanhos de tela

## 🔧 Configuração e Instalação

### Pré-requisitos

- Node.js (v16+)
- pnpm (v8+)

### Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/jumpad-challenge.git
cd jumpad-challenge

# Instale as dependências
pnpm install

# Inicie o servidor de desenvolvimento
pnpm dev
```

A aplicação estará disponível em `http://localhost:5173/` (ou outra porta, caso a 5173 esteja em uso).

### Scripts Disponíveis

- `pnpm dev`: Inicia o servidor de desenvolvimento
- `pnpm build`: Compila o projeto para produção
- `pnpm lint`: Executa o linter para verificar problemas no código
- `pnpm preview`: Inicia um servidor local para visualizar a build de produção

## 📱 Responsividade

A aplicação foi desenvolvida seguindo o princípio de Mobile First, garantindo uma experiência de usuário consistente em diferentes dispositivos:

- **Mobile**: Layout otimizado para telas pequenas
- **Tablet**: Adaptações para melhor aproveitamento do espaço
- **Desktop**: Experiência completa com layout expandido

## 🧩 Componentes Principais

### PostCard

Componente reutilizável para exibição de cards de posts, com suporte a:
- Imagem de capa
- Título e resumo do conteúdo
- Informações do autor (opcional)
- Efeitos de hover para melhor interatividade

### PageBanner

Banner utilizado no topo das páginas principais, com:
- Imagem de fundo customizável
- Título e descrição configuráveis
- Overlay para melhor legibilidade do texto

### CoverImage

Componente para exibição de imagens de capa com:
- Indicador de carregamento
- Transição suave quando a imagem é carregada
- Overlay para melhor contraste

## 🌐 API

A aplicação consome dados da JSONPlaceholder API, incluindo:
- Posts: `/posts`
- Comentários: `/comments`
- Usuários: `/users`

## 🚀 Deploy

A aplicação está deployada na Vercel e pode ser acessada em:
[https://jumpad-challenge.vercel.app/](https://jumpad-challenge.vercel.app/)

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## Expandindo a configuração do ESLint

Se você estiver desenvolvendo uma aplicação para produção, recomendamos atualizar a configuração para habilitar regras de lint com verificação de tipos:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

Você também pode instalar [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) e [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) para regras de lint específicas do React:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
