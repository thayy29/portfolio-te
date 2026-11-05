# 🎛️ Portfolio TE — Teenage Engineering Inspired

Portfolio pessoal inspirado na estética hardware do **Teenage Engineering KO II**. Construído com React, TypeScript e Node.js.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)

---

## ✨ Features

- **Design Hardware Aesthetic** — Panels com parafusos, LEDs pulsantes, bezels e sombras inset inspirados no KO II
- **3-Color Palette** — Cream (`#F2F0EB`), Near-black (`#1A1A1A`), Orange (`#FF6B2C`)
- **Dark/Light Theme** — Toggle com persistência em localStorage
- **GitHub Integration** — Avatar, bio, repositórios e contadores reais via GitHub API
- **SoundCloud Widget** — Player discreto com músicas via oEmbed API (desktop)
- **Animated Counters** — Contadores animados com easing para dados reais do GitHub
- **Interactive Globe** — Globo rotativo em Canvas com destaque para São Paulo
- **Particle Network** — Background com partículas interconectadas (40 mobile, 90 desktop)
- **Grid Organism T Logo** — Logo SVG com filtro metaball/goo
- **Scroll Reveal** — Animações de entrada com IntersectionObserver
- **Responsive** — Layout adaptativo desktop + mobile
- **Status Bar** — Clima em tempo real via Open-Meteo API

---

## 🏗️ Arquitetura

```
portfolio-te/
├── client/                    # Frontend React + Vite
│   ├── src/
│   │   ├── components/        # Componentes React
│   │   │   ├── About.tsx      # Bio + contadores animados
│   │   │   ├── Contact.tsx    # Formulário + redes sociais
│   │   │   ├── Footer.tsx     # Logo + copyright
│   │   │   ├── Globe.tsx      # Globo Canvas interativo
│   │   │   ├── Hero.tsx       # Avatar GitHub + headline + CTAs
│   │   │   ├── Logo.tsx       # Grid Organism T (SVG metaball)
│   │   │   ├── MobileMenu.tsx # Menu overlay mobile
│   │   │   ├── Nav.tsx        # Nav pill sticky + theme toggle
│   │   │   ├── ParticleBackground.tsx # Particle network Canvas
│   │   │   ├── Projects.tsx   # Cards de repos GitHub
│   │   │   ├── SoundCloudWidget.tsx   # Player SoundCloud (desktop)
│   │   │   ├── StatusBar.tsx  # Barra superior com clima
│   │   │   ├── TechStack.tsx  # Tags de tecnologias
│   │   │   └── Ticker.tsx     # Ticker animado de keywords
│   │   ├── hooks/             # Custom React hooks
│   │   │   ├── useAnimatedCounter.ts  # Contador com easing
│   │   │   ├── useGitHub.ts           # Profile + repos GitHub
│   │   │   ├── useScrollReveal.ts     # IntersectionObserver
│   │   │   ├── useSoundCloud.ts       # oEmbed SoundCloud
│   │   │   ├── useTheme.ts            # Dark/light toggle
│   │   │   └── useWeather.ts          # Open-Meteo API
│   │   ├── styles/
│   │   │   └── globals.css    # Design system completo
│   │   ├── types/
│   │   │   └── index.ts       # TypeScript interfaces
│   │   ├── App.tsx            # Componente principal
│   │   └── main.tsx           # Entry point
│   ├── index.html
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── package.json
├── server/                    # Backend Node.js + Express
│   ├── src/
│   │   ├── routes/
│   │   │   ├── github.ts      # Proxy GitHub API (cache 5min)
│   │   │   └── soundcloud.ts  # Proxy SoundCloud oEmbed (cache 15min)
│   │   └── index.ts           # Express server
│   ├── tsconfig.json
│   └── package.json
├── .env.example               # Variáveis de ambiente
├── .gitignore
├── package.json               # Workspace root
└── README.md
```

---

## 🚀 Como rodar

### Pré-requisitos

- **Node.js** 18+
- **npm** 9+

### 1. Clone o repositório

```bash
git clone https://github.com/thayy29/portfolio-te.git
cd portfolio-te
```

### 2. Instale as dependências

```bash
# Instala todas as dependências (root + client + server)
npm run install:all
```

### 3. Configure as variáveis de ambiente

```bash
cp .env.example .env
```

Edite o `.env` se necessário:

```env
# GitHub
GITHUB_USERNAME=thayy29
GITHUB_TOKEN=              # Opcional — aumenta rate limit de 60 para 5000 req/h

# SoundCloud
SOUNDCLOUD_USERNAME=classocls

# Server
PORT=3001
```

### 4. Rode em desenvolvimento

```bash
npm run dev
```

Isso inicia simultaneamente:
- **Client** (Vite): `http://localhost:5173`
- **Server** (Express): `http://localhost:3001`

O Vite faz proxy automático de `/api/*` para o servidor.

### 5. Build para produção

```bash
npm run build
npm start
```

O servidor Express serve os arquivos estáticos do client em produção.

---

## 🎨 Design System

### Cores

| Token     | Light       | Dark        |
|-----------|-------------|-------------|
| `--bg`    | `#F2F0EB`   | `#0A0A0A`   |
| `--text`  | `#1A1A1A`   | `#E8E6E1`   |
| `--accent`| `#FF6B2C`   | `#FF6B2C`   |
| `--card`  | `#FFFFFF`   | `#111111`   |

### Tipografia

- **Headings/Body**: Space Grotesk (300–700)
- **Monospace/Technical**: Space Mono (400, 700)

### Componentes Hardware

- `.hw-panel` — Card com borda, inset shadow e border-radius 14px
- `.hw-screw` — Parafuso decorativo (8×8px)
- `.hw-led` — LED pulsante (6×6px) com animação
- `.hw-label` — Label monospace uppercase com LED + divider

---

## 🔌 APIs Utilizadas

| API | Endpoint | Autenticação | Cache |
|-----|----------|-------------|-------|
| **GitHub REST** | `api.github.com/users/{user}` | Token opcional | 5 min |
| **GitHub Repos** | `api.github.com/users/{user}/repos` | Token opcional | 5 min |
| **SoundCloud oEmbed** | `soundcloud.com/oembed` | Nenhuma | 15 min |
| **Open-Meteo** | `api.open-meteo.com/v1/forecast` | Nenhuma | Client-side |

---

## 📱 Responsivo

- **Desktop** (769px+): Layout completo com globe 320px, 90 partículas, SoundCloud widget
- **Mobile** (<769px): Layout empilhado, globe 220px, 40 partículas, menu hamburger, sem SoundCloud

---

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Backend**: Node.js, Express, TypeScript
- **Estilo**: CSS custom properties (sem framework)
- **Canvas**: Particle network + globe interativo
- **SVG**: Logo com filtro metaball (feGaussianBlur + feColorMatrix)

---

## 📄 Licença

MIT © Thayana
