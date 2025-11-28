# 🏴‍☠️ TUNOVA.IO - NAKAMA OS Genesis

<div align="center">

![TUNOVA.IO Banner](https://via.placeholder.com/1200x400/0a0e27/00ffff?text=TUNOVA.IO)

**La plataforma de música y arte donde NO HAY ARTISTAS, HAY NAKAMAS**

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61dafb)](https://react.dev/)
[![Tailwind](https://img.shields.io/badge/Tailwind-4.0-38bdf8)](https://tailwindcss.com/)

[🌐 Website](https://tunova.io) • [📖 Docs](./docs) • [💬 Discord](https://discord.gg/nakama) • [🐦 Twitter](https://twitter.com/tunova_io)

</div>

---

## 🌊 ¿Qué es TUNOVA.IO?

**TUNOVA.IO** es el hogar digital de la comunidad **NAKAMA OS**, un ecosistema revolucionario donde la música, el arte y la colaboración se fusionan con tecnología Web3. Aquí no hay artistas individuales, somos una **tripulación** donde el éxito de uno es el éxito de todos.

### 🎯 Filosofía NAKAMA

> "En el mar de la creatividad, no navegamos solos. Somos NAKAMAS, una tripulación unida por la pasión, el arte y la música. El éxito de 1 es el éxito de todos."

---

## ✨ Características Principales

### 🎵 Reproductor Retro Cyberpunk
- **VHS Player** - Reproduce videos con estética retro
- **Cassette Deck** - Escucha música con filtros lo-fi
- **Drag & Drop** - Arrastra cintas para reproducir
- **Visualizador de Audio** - Efectos visuales sincronizados
- **Efectos CRT** - Pantalla vintage auténtica

### 🎨 MIX Comunitario
- **Drop Instantáneo** - NAKAMAS en waitlist publican sin revisión
- **1 VHS + 1 Cassette + 1 Pizarra** - Cuota inicial por NAKAMA
- **Galería Pública** - Explora contenido de la comunidad
- **Votación** - Upvote/Downvote contenido
- **Comentarios** - Interactúa con otros NAKAMAS

### ⚡ Sistema Haki
- **Gana Puntos** - Por contribuir a la comunidad
- **Rangos Progresivos** - De Chore Boy a Pirate King
- **Desbloquea Recompensas** - Skins, badges, y más
- **Elegibilidad Airdrop** - Mayor Haki = Mayor $BELLY y $NAKAMAS

### 🛡️ Sistema Anti-Marina
- **Protección contra Spam** - Rate limiting inteligente
- **Detección de Bots** - Fingerprinting avanzado
- **Moderación Comunitaria** - Reportes y revisión
- **Bans Temporales/Permanentes** - Sistema de violaciones

### 🌍 Multiidioma
- **3 Idiomas Completos** - Español, Inglés, Japonés
- **Auto-detección** - Detecta idioma del navegador
- **10 Idiomas Soportados** - ES, EN, JA, PT, FR, DE, IT, KO, ZH, RU

### 🤖 BeatBunny AI
- **Chat Inteligente** - Recomendaciones musicales
- **Personalidad Única** - Conejo cyberpunk experto en música
- **Powered by OpenRouter** - Modelos gratuitos
- **MSN Messenger Style** - Estética retro nostálgica

### 📸 Funcionalidades Futuras
- **Cámara Polaroid** - Captura momentos con filtros anime
- **Pizarras Interactivas** - Dibuja en tiempo real con la comunidad
- **Menús Contextuales** - Click derecho con opciones avanzadas
- **Portal NAKAMA OS** - Acceso al ecosistema completo
- **PWA** - Instalable como app en móviles y escritorio

---

## 🛠️ Stack Tecnológico

### Frontend
- **React 19** - UI library
- **TypeScript 5.3** - Type safety
- **Vite** - Build tool ultra-rápido
- **Tailwind CSS 4** - Utility-first CSS
- **Framer Motion** - Animaciones fluidas
- **Wouter** - Router ligero
- **i18next** - Internacionalización

### Backend
- **Node.js 22** - Runtime
- **tRPC** - Type-safe API
- **Drizzle ORM** - Type-safe database queries
- **PostgreSQL** - Base de datos relacional
- **Zod** - Schema validation

### Web3
- **Wagmi** - React hooks para Ethereum
- **Viem** - TypeScript Ethereum library
- **WalletConnect** - Multi-wallet support

### AI
- **OpenRouter** - API gateway para LLMs
- **Llama 3.2** - Modelo gratuito para BeatBunny

### DevOps
- **GitHub Actions** - CI/CD
- **Vercel** - Hosting y deploy
- **Supabase** - Database hosting
- **Cloudflare** - CDN y DNS

---

## 🚀 Instalación y Desarrollo

### Prerrequisitos
- Node.js 22+
- pnpm 9+
- PostgreSQL 15+

### Clonar el repositorio
```bash
git clone https://github.com/sh4rkydweb3-bot/TUNOVA.git
cd TUNOVA
```

### Instalar dependencias
```bash
pnpm install
```

### Configurar variables de entorno
```bash
cp .env.example .env
```

Edita `.env` con tus credenciales:
```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/tunova

# OpenRouter AI
VITE_OPENROUTER_API_KEY=your_openrouter_key

# WalletConnect
VITE_WALLETCONNECT_PROJECT_ID=your_project_id

# Telegram Bot
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_CHAT_ID=your_chat_id

# OAuth (Manus)
OAUTH_SERVER_URL=https://api.manus.im
OWNER_OPEN_ID=your_owner_id
```

### Inicializar base de datos
```bash
pnpm db:push
```

### Ejecutar en desarrollo
```bash
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## 📦 Scripts Disponibles

```bash
# Desarrollo
pnpm dev              # Inicia servidor de desarrollo
pnpm build            # Build para producción
pnpm preview          # Preview del build

# Base de datos
pnpm db:push          # Sincroniza schema con DB
pnpm db:studio        # Abre Drizzle Studio

# Testing
pnpm test             # Ejecuta tests con Vitest
pnpm test:ui          # Abre UI de Vitest

# Linting
pnpm lint             # Ejecuta ESLint
pnpm type-check       # Verifica tipos TypeScript
```

---

## 🏗️ Estructura del Proyecto

```
tunova/
├── client/                 # Frontend React
│   ├── public/            # Assets estáticos
│   ├── src/
│   │   ├── components/    # Componentes React
│   │   ├── pages/         # Páginas de la app
│   │   ├── hooks/         # Custom hooks
│   │   ├── lib/           # Utilidades
│   │   ├── i18n/          # Traducciones
│   │   ├── types.ts       # Tipos TypeScript
│   │   ├── constants.ts   # Constantes
│   │   └── App.tsx        # Componente principal
│   └── index.html         # HTML entry point
├── server/                # Backend Node.js
│   ├── routers.ts         # Endpoints tRPC
│   ├── db.ts              # Funciones de DB
│   ├── haki.ts            # Sistema Haki
│   └── telegram.ts        # Notificaciones
├── drizzle/               # Database
│   └── schema.ts          # Schema de DB
├── shared/                # Código compartido
│   └── const.ts           # Constantes compartidas
├── docs/                  # Documentación
│   ├── MASTER_PLAN.md
│   ├── GENESIS_ROADMAP.md
│   ├── EPIC_ANIME_FLOWS.md
│   └── ...
└── README.md              # Este archivo
```

---

## 🎨 Diseño y Estética

TUNOVA.IO combina **cyberpunk**, **anime/manga**, y **nostalgia retro** en una experiencia visual única:

- **Color Palette:** Neones cian/magenta sobre fondo oscuro
- **Typography:** Fuentes monoespaciadas y pixeladas
- **Animations:** Glitch effects, scanlines, CRT distortion
- **UI Elements:** Inspirados en reproductores de los 80s/90s
- **Art Style:** Anime/manga con toques cyberpunk

---

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Sigue estos pasos:

1. **Fork** el repositorio
2. Crea una **branch** (`git checkout -b feature/amazing-feature`)
3. **Commit** tus cambios (`git commit -m 'Add amazing feature'`)
4. **Push** a la branch (`git push origin feature/amazing-feature`)
5. Abre un **Pull Request**

### Guías de Contribución
- Sigue el estilo de código existente
- Escribe tests para nuevas funcionalidades
- Actualiza la documentación si es necesario
- Usa commits semánticos (feat, fix, docs, style, refactor, test, chore)

---

## 📄 Licencia

Este proyecto está licenciado bajo la **MIT License** - ver el archivo [LICENSE](LICENSE) para más detalles.

---

## 🏢 Creado por TIDElabs

<div align="center">

![TIDElabs Logo](https://via.placeholder.com/200x80/0a0e27/00ffff?text=TIDElabs)

**TUNOVA.IO** es un proyecto de **[TIDElabs](https://tidelabs.io)**, un laboratorio de innovación enfocado en Web3, IA y experiencias digitales inmersivas.

### 🌐 Ecosistema TIDElabs

- **NAKAMA OS** - Sistema operativo descentralizado
- **TUNOVA.IO** - Plataforma de música y arte (este proyecto)
- **$BELLY** - Token de gobernanza
- **$NAKAMAS** - Token de utilidad

[Website](https://tidelabs.io) • [Twitter](https://twitter.com/tidelabs) • [Discord](https://discord.gg/tidelabs)

</div>

---

## 👥 Equipo

### Core Team
- **Capitán** - Founder & Visionary
- **BeatBunny** - AI Mascot & Music Expert
- **Community** - NAKAMAS around the world

### Agradecimientos Especiales
- A todos los **NAKAMAS** que creyeron en el proyecto desde el inicio
- A la comunidad de **One Piece** por la inspiración
- A los pioneros del **cyberpunk** y la música **synthwave**

---

## 📞 Contacto

- **Website:** [tunova.io](https://tunova.io)
- **Email:** contact@tunova.io
- **Twitter:** [@tunova_io](https://twitter.com/tunova_io)
- **Discord:** [Join our crew](https://discord.gg/nakama)
- **Telegram:** [@tunova_official](https://t.me/tunova_official)

---

## 🗺️ Roadmap

### ✅ Genesis (Q4 2025)
- [x] Reproductor VHS/Cassette funcional
- [x] Sistema Haki implementado
- [x] Chat con BeatBunny (OpenRouter)
- [x] Backend completo (tRPC + PostgreSQL)
- [x] Sistema i18n (ES/EN/JA)
- [ ] Waitlist y conexión Web3
- [ ] MIX Comunitario con drop instantáneo
- [ ] Sistema Anti-Marina
- [ ] PWA instalable

### 🚧 Nakama OS Launch (Q1 2026)
- [ ] Airdrop de $BELLY y $NAKAMAS
- [ ] Portal NAKAMA OS completo
- [ ] Badges exclusivos para Early NAKAMAS
- [ ] Cámara Polaroid con filtros anime
- [ ] Pizarras interactivas colaborativas
- [ ] Marketplace de skins y NFTs
- [ ] Sistema de referidos

### 🔮 Futuro (Q2 2026+)
- [ ] Integración con Spotify/YouTube
- [ ] Live streaming de eventos
- [ ] DAO de gobernanza
- [ ] Mobile apps nativas (iOS/Android)
- [ ] VR/AR experiences
- [ ] Metaverse integration

---

## 📊 Estadísticas del Proyecto

- **Líneas de código:** ~15,000+
- **Componentes React:** 50+
- **Endpoints tRPC:** 30+
- **Tablas de DB:** 13
- **Idiomas soportados:** 10
- **Tests:** 20+
- **Documentación:** 8 documentos maestros

---

## 🎉 ¡Únete a la Tripulación!

¿Listo para convertirte en un NAKAMA? Visita [tunova.io](https://tunova.io) y únete a la waitlist para recibir:

- ✅ **1 VHS gratis** (sin revisión)
- ✅ **1 Cassette gratis** (sin revisión)
- ✅ **1 Pizarra gratis** (sin revisión)
- ✅ **+50 Haki** al unirte
- ✅ **Early NAKAMA Badge** exclusivo
- ✅ **Acceso prioritario** al Airdrop

---

<div align="center">

**¡El viaje apenas comienza, NAKAMA! 🏴‍☠️⚡**

Made with 💙 by [TIDElabs](https://tidelabs.io)

</div>
