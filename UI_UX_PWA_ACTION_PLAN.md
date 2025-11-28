# 🎯 Plan de Acción: UI/UX y PWA - TUNOVA.IO

**Fecha:** 27 Nov 2025  
**Objetivo:** Arreglar lógica de botones, organizar sitio, mejorar textos, y convertir a PWA instalable  
**Tiempo estimado:** 16-20 horas

---

## 🔍 AUDITORÍA ACTUAL

### Problemas Detectados

#### 1. **Lógica de Botones** ❌
- Botón VCR/DECK funciona pero puede mejorar feedback
- Controles del reproductor (play/pause/next/prev) no conectados a audio real
- Botón de volumen visual pero sin funcionalidad completa
- BeatBunny abre chat pero sin animaciones suaves
- Drag & drop de cintas funciona pero sin feedback visual claro
- Falta estados disabled en botones cuando no aplican

#### 2. **Organización del Sitio** ❌
- Todo en una sola página (Home.tsx) - difícil de mantener
- No hay navegación clara entre secciones
- Elementos superpuestos (HakiMeter, VCR button, BeatBunny)
- No hay onboarding para nuevos usuarios
- Falta estructura de rutas

#### 3. **Textos sin Contexto** ❌
- No hay explicación de qué es TUNOVA.IO
- No se explica el sistema de Haki
- No se explica el MIX Comunitario
- Mensajes de error genéricos
- Falta tooltips en botones

#### 4. **No es PWA** ❌
- No se puede instalar como app
- No funciona offline
- No hay iconos de app
- No hay splash screen

---

## 📋 PLAN DE ACCIÓN DETALLADO

### **FASE 1: Arreglar Lógica de Botones** (4-5h)

#### Tecnologías a usar:
- **React 19** - Hooks modernos (useState, useCallback, useMemo)
- **Framer Motion** - Animaciones fluidas y feedback visual
- **React Hot Toast / Sonner** - Notificaciones de acciones
- **Lucide React** - Iconos consistentes

#### Acciones específicas:

**1.1 Auditar todos los botones** (1h)
```typescript
// Crear documento de auditoría
const BUTTONS_AUDIT = {
  player: {
    power: { working: true, needsImprovement: 'Add animation' },
    play: { working: false, issue: 'Not connected to audio' },
    pause: { working: false, issue: 'Not connected to audio' },
    next: { working: false, issue: 'Not connected to audio' },
    prev: { working: false, issue: 'Not connected to audio' },
    eject: { working: true, needsImprovement: 'Add sound effect' },
  },
  system: {
    vcrDeck: { working: true, needsImprovement: 'Better transition' },
    swap: { working: true, needsImprovement: 'Add loading state' },
  },
  social: {
    beatbunny: { working: true, needsImprovement: 'Smooth animations' },
    radio: { working: true, needsImprovement: 'Panel transition' },
  },
};
```

**1.2 Implementar estados de botones** (1h)
```typescript
// hooks/useButtonState.ts
export function useButtonState(initialState = false) {
  const [isActive, setIsActive] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  const handleClick = useCallback(async (action: () => Promise<void>) => {
    if (isDisabled || isLoading) return;
    
    setIsLoading(true);
    try {
      await action();
      setIsActive(!isActive);
    } catch (error) {
      toast.error('Error al ejecutar acción');
    } finally {
      setIsLoading(false);
    }
  }, [isActive, isDisabled, isLoading]);

  return { isActive, isLoading, isDisabled, setIsDisabled, handleClick };
}
```

**1.3 Crear componente Button reutilizable** (1h)
```typescript
// components/ui/Button.tsx
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface ButtonProps {
  variant: 'primary' | 'secondary' | 'ghost' | 'danger';
  size: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
  tooltip?: string;
}

export function Button({
  variant,
  size,
  loading,
  disabled,
  icon,
  children,
  onClick,
  tooltip,
}: ButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      className={cn(
        'button',
        `button-${variant}`,
        `button-${size}`,
        disabled && 'button-disabled'
      )}
      onClick={onClick}
      disabled={disabled || loading}
      title={tooltip}
    >
      {loading ? (
        <Loader2 className="animate-spin" />
      ) : icon ? (
        icon
      ) : null}
      {children}
    </motion.button>
  );
}
```

**1.4 Conectar controles a audio real** (1-2h)
```typescript
// hooks/useAudioPlayer.ts
export function useAudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const audioRef = useRef<HTMLAudioElement>(null);

  const play = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
      soundManager.play('tape.play');
    }
  }, []);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  const next = useCallback(() => {
    // Logic to skip to next track
    soundManager.play('ui.click');
  }, []);

  const prev = useCallback(() => {
    // Logic to go to previous track
    soundManager.play('ui.click');
  }, []);

  const changeVolume = useCallback((newVolume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
      setVolume(newVolume);
    }
  }, []);

  return {
    isPlaying,
    currentTime,
    duration,
    volume,
    play,
    pause,
    next,
    prev,
    changeVolume,
    audioRef,
  };
}
```

**1.5 Agregar feedback visual y sonoro** (1h)
```typescript
// Usar Framer Motion para animaciones
<motion.button
  whileHover={{ scale: 1.1 }}
  whileTap={{ scale: 0.9 }}
  onClick={() => {
    soundManager.play('ui.click');
    handleAction();
  }}
>
  <motion.div
    animate={{ rotate: isActive ? 180 : 0 }}
    transition={{ duration: 0.3 }}
  >
    <Icon />
  </motion.div>
</motion.button>

// Usar toast para notificaciones
toast.success('¡Cinta insertada!', {
  icon: '📼',
  duration: 2000,
});
```

---

### **FASE 2: Reorganizar Estructura del Sitio** (5-6h)

#### Tecnologías a usar:
- **Wouter** - Router ligero (ya instalado)
- **React Suspense** - Lazy loading de páginas
- **Framer Motion** - Transiciones entre páginas
- **CSS Grid + Flexbox** - Layout responsive

#### Nueva estructura de archivos:
```
client/src/
├── pages/
│   ├── Landing.tsx          # Página de inicio con explicación
│   ├── Player.tsx            # Reproductor principal (actual Home)
│   ├── Gallery.tsx           # MIX Comunitario
│   ├── Profile.tsx           # Perfil de usuario
│   ├── Settings.tsx          # Configuración
│   ├── About.tsx             # Sobre TUNOVA.IO
│   └── NotFound.tsx          # 404
├── layouts/
│   ├── MainLayout.tsx        # Layout principal con nav
│   ├── PlayerLayout.tsx      # Layout para reproductor
│   └── AuthLayout.tsx        # Layout para auth
├── components/
│   ├── navigation/
│   │   ├── Navbar.tsx        # Barra de navegación
│   │   ├── Sidebar.tsx       # Sidebar colapsable
│   │   └── MobileNav.tsx     # Nav móvil
│   ├── player/               # Componentes del reproductor
│   ├── gallery/              # Componentes de galería
│   └── ui/                   # Componentes UI reutilizables
└── App.tsx                   # Router principal
```

#### Acciones específicas:

**2.1 Crear sistema de rutas** (1h)
```typescript
// App.tsx
import { Route, Switch, Redirect } from 'wouter';
import { Suspense, lazy } from 'react';

const Landing = lazy(() => import('@/pages/Landing'));
const Player = lazy(() => import('@/pages/Player'));
const Gallery = lazy(() => import('@/pages/Gallery'));
const Profile = lazy(() => import('@/pages/Profile'));
const Settings = lazy(() => import('@/pages/Settings'));
const About = lazy(() => import('@/pages/About'));

function Router() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Switch>
        <Route path="/" component={Landing} />
        <Route path="/player" component={Player} />
        <Route path="/gallery" component={Gallery} />
        <Route path="/profile" component={Profile} />
        <Route path="/settings" component={Settings} />
        <Route path="/about" component={About} />
        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}
```

**2.2 Crear navegación principal** (2h)
```typescript
// components/navigation/Navbar.tsx
export function Navbar() {
  const { t } = useTranslation();
  const [location] = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <img src={APP_LOGO} alt="TUNOVA.IO" />
        <span className="navbar-title">TUNOVA.IO</span>
      </div>

      <div className="navbar-links">
        <NavLink href="/" active={location === '/'}>
          {t('nav.home')}
        </NavLink>
        <NavLink href="/player" active={location === '/player'}>
          {t('nav.player')}
        </NavLink>
        <NavLink href="/gallery" active={location === '/gallery'}>
          {t('nav.gallery')}
        </NavLink>
        <NavLink href="/profile" active={location === '/profile'}>
          {t('nav.profile')}
        </NavLink>
      </div>

      <div className="navbar-actions">
        <WalletButton />
        <HakiDisplay />
        <LanguageSelector />
      </div>
    </nav>
  );
}
```

**2.3 Crear página Landing** (2h)
```typescript
// pages/Landing.tsx
export default function Landing() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();

  return (
    <div className="landing">
      {/* Hero Section */}
      <section className="hero">
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
        >
          TUNOVA.IO
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {t('landing.tagline')}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Button
            variant="primary"
            size="lg"
            onClick={() => setLocation('/player')}
          >
            {t('landing.cta')}
          </Button>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="features">
        <FeatureCard
          icon={<Music />}
          title={t('landing.feature1.title')}
          description={t('landing.feature1.description')}
        />
        <FeatureCard
          icon={<Users />}
          title={t('landing.feature2.title')}
          description={t('landing.feature2.description')}
        />
        <FeatureCard
          icon={<Zap />}
          title={t('landing.feature3.title')}
          description={t('landing.feature3.description')}
        />
      </section>

      {/* About NAKAMA */}
      <section className="about-nakama">
        <h2>{t('landing.nakama.title')}</h2>
        <p>{t('landing.nakama.description')}</p>
      </section>

      {/* Waitlist CTA */}
      <section className="waitlist-cta">
        <h2>{t('landing.waitlist.title')}</h2>
        <Button
          variant="primary"
          size="lg"
          onClick={() => openWaitlistModal()}
        >
          {t('landing.waitlist.cta')}
        </Button>
      </section>
    </div>
  );
}
```

**2.4 Arreglar superposiciones** (1h)
```css
/* Usar z-index system consistente */
:root {
  --z-background: 0;
  --z-content: 10;
  --z-player: 20;
  --z-navigation: 30;
  --z-sidebar: 40;
  --z-modal: 50;
  --z-toast: 60;
  --z-tooltip: 70;
}

.haki-meter {
  position: fixed;
  top: 1rem;
  left: 1rem;
  z-index: var(--z-navigation);
}

.vcr-button {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: var(--z-navigation);
}

.beatbunny {
  position: fixed;
  top: 50%;
  right: 2rem;
  transform: translateY(-50%);
  z-index: var(--z-sidebar);
}
```

---

### **FASE 3: Mejorar Textos con Sentido** (3-4h)

#### Tecnologías a usar:
- **i18next** (ya configurado) - Traducciones
- **React Markdown** - Renderizar textos largos
- **Tippy.js / Radix Tooltip** - Tooltips

#### Acciones específicas:

**3.1 Crear textos explicativos** (2h)
```json
// i18n/locales/es.json (extender)
{
  "landing": {
    "tagline": "La plataforma de música y arte donde NO HAY ARTISTAS, HAY NAKAMAS",
    "description": "TUNOVA.IO es el hogar de la comunidad NAKAMA OS. Aquí compartimos música, arte y experiencias. El éxito de 1 es el éxito de todos.",
    "cta": "Entrar al Reproductor",
    "feature1": {
      "title": "Reproductor Retro",
      "description": "Experimenta la música con nuestro reproductor de VHS y Cassettes con estética cyberpunk única."
    },
    "feature2": {
      "title": "MIX Comunitario",
      "description": "Los NAKAMAS en waitlist pueden publicar 1 VHS, 1 Cassette y 1 Pizarra sin revisión previa."
    },
    "feature3": {
      "title": "Sistema Haki",
      "description": "Gana puntos Haki por contribuir a la comunidad. Desbloquea skins, badges y acceso al Airdrop de $BELLY y $NAKAMAS."
    },
    "nakama": {
      "title": "¿Qué es un NAKAMA?",
      "description": "En TUNOVA.IO no hay artistas, hay NAKAMAS. Somos una tripulación donde el éxito de uno es el éxito de todos. Compartimos, colaboramos y crecemos juntos."
    },
    "waitlist": {
      "title": "Únete a la Tripulación",
      "cta": "Entrar a la Waitlist"
    }
  },
  "player": {
    "welcome": "Bienvenido al Reproductor TUNOVA.IO",
    "instructions": {
      "1": "Arrastra una cinta VHS o Cassette a la pantalla para reproducir",
      "2": "Usa los controles para play, pause, siguiente, anterior",
      "3": "Cambia entre VHS y Cassette con el botón VCR/DECK",
      "4": "Habla con BeatBunny para recomendaciones de música"
    }
  },
  "haki": {
    "explanation": "El sistema Haki te recompensa por contribuir a la comunidad. Gana puntos por:",
    "actions": {
      "join": "Unirte a waitlist (+50 Haki)",
      "drop": "Publicar contenido (+100-150 Haki)",
      "vote": "Votar contenido (+5 Haki)",
      "comment": "Comentar (+10 Haki)",
      "daily": "Login diario (+25 Haki)"
    },
    "benefits": "Con más Haki desbloqueas skins, badges exclusivos y mayor elegibilidad para el Airdrop."
  }
}
```

**3.2 Crear componente Onboarding** (1h)
```typescript
// components/Onboarding.tsx
export function Onboarding() {
  const [step, setStep] = useState(0);
  const { t } = useTranslation();

  const steps = [
    {
      target: '.player',
      title: t('onboarding.step1.title'),
      content: t('onboarding.step1.content'),
    },
    {
      target: '.vhs-tape',
      title: t('onboarding.step2.title'),
      content: t('onboarding.step2.content'),
    },
    {
      target: '.haki-meter',
      title: t('onboarding.step3.title'),
      content: t('onboarding.step3.content'),
    },
    {
      target: '.beatbunny',
      title: t('onboarding.step4.title'),
      content: t('onboarding.step4.content'),
    },
  ];

  return (
    <Joyride
      steps={steps}
      continuous
      showProgress
      showSkipButton
      styles={{
        options: {
          primaryColor: '#00ffff',
          zIndex: 1000,
        },
      }}
    />
  );
}
```

**3.3 Agregar tooltips** (1h)
```typescript
// Usar Radix Tooltip
import * as Tooltip from '@radix-ui/react-tooltip';

<Tooltip.Provider>
  <Tooltip.Root>
    <Tooltip.Trigger asChild>
      <button className="control-button">
        <Play />
      </button>
    </Tooltip.Trigger>
    <Tooltip.Portal>
      <Tooltip.Content className="tooltip-content">
        {t('player.play')}
        <Tooltip.Arrow className="tooltip-arrow" />
      </Tooltip.Content>
    </Tooltip.Portal>
  </Tooltip.Root>
</Tooltip.Provider>
```

---

### **FASE 4: Convertir a PWA** (4-5h)

#### Tecnologías a usar:
- **Vite PWA Plugin** - Generación automática de manifest y SW
- **Workbox** - Service Worker con estrategias de caché
- **Web App Manifest** - Configuración de instalación

#### Acciones específicas:

**4.1 Instalar dependencias** (15min)
```bash
pnpm add -D vite-plugin-pwa workbox-window
```

**4.2 Configurar Vite PWA** (30min)
```typescript
// vite.config.ts
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'TUNOVA.IO - NAKAMA OS',
        short_name: 'TUNOVA',
        description: 'Plataforma de música y arte de la comunidad NAKAMA OS',
        theme_color: '#0a0e27',
        background_color: '#0a0e27',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: /^https:\/\/api\.tunova\.io\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 5, // 5 minutes
              },
            },
          },
        ],
      },
    }),
  ],
});
```

**4.3 Crear iconos PWA** (1h)
```bash
# Generar iconos en diferentes tamaños
# Usar herramienta como https://realfavicongenerator.net/
# O crear manualmente:
- pwa-192x192.png
- pwa-512x512.png
- apple-touch-icon.png
- favicon.ico
- masked-icon.svg
```

**4.4 Crear splash screen** (1h)
```html
<!-- index.html -->
<head>
  <!-- iOS Splash Screens -->
  <link rel="apple-touch-startup-image" href="/splash-2048x2732.png" media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2)">
  <link rel="apple-touch-startup-image" href="/splash-1668x2388.png" media="(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2)">
  <link rel="apple-touch-startup-image" href="/splash-1536x2048.png" media="(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2)">
  <link rel="apple-touch-startup-image" href="/splash-1242x2688.png" media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3)">
  <link rel="apple-touch-startup-image" href="/splash-1125x2436.png" media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)">
  <link rel="apple-touch-startup-image" href="/splash-828x1792.png" media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2)">
  <link rel="apple-touch-startup-image" href="/splash-750x1334.png" media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)">
  <link rel="apple-touch-startup-image" href="/splash-640x1136.png" media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)">
  
  <!-- Meta tags para PWA -->
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <meta name="apple-mobile-web-app-title" content="TUNOVA">
  <meta name="mobile-web-app-capable" content="yes">
</head>
```

**4.5 Implementar botón de instalación** (1h)
```typescript
// components/InstallButton.tsx
export function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      toast.success('¡App instalada! Ahora puedes usarla offline.');
    }

    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  if (!isInstallable) return null;

  return (
    <motion.button
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      className="install-button"
      onClick={handleInstall}
    >
      <Download className="icon" />
      Instalar App
    </motion.button>
  );
}
```

**4.6 Configurar offline support** (1h)
```typescript
// components/OfflineIndicator.tsx
export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="offline-indicator">
      <WifiOff className="icon" />
      <span>Modo Offline - Algunas funciones no están disponibles</span>
    </div>
  );
}
```

---

## 📊 RESUMEN DE TECNOLOGÍAS

### Frontend Core
- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS 4** - Styling

### UI/UX
- **Framer Motion** - Animations
- **Radix UI** - Accessible components
- **Lucide React** - Icons
- **React Hot Toast / Sonner** - Notifications
- **Joyride** - Onboarding tours

### Routing & State
- **Wouter** - Lightweight router
- **React Context** - Global state
- **React Query** - Server state (tRPC)

### PWA
- **Vite PWA Plugin** - PWA generation
- **Workbox** - Service Worker
- **Web App Manifest** - Installation config

### i18n
- **i18next** - Translations
- **react-i18next** - React integration
- **i18next-browser-languagedetector** - Auto-detection

---

## ✅ CHECKLIST DE ENTREGA

### Lógica de Botones
- [ ] Todos los botones tienen feedback visual
- [ ] Todos los botones tienen feedback sonoro
- [ ] Estados disabled funcionan correctamente
- [ ] Animaciones suaves en todas las interacciones
- [ ] Controles del reproductor conectados a audio real
- [ ] Tooltips en todos los botones

### Organización del Sitio
- [ ] Sistema de rutas implementado
- [ ] Navegación clara y accesible
- [ ] Página Landing con explicación
- [ ] Onboarding para nuevos usuarios
- [ ] Sin superposiciones de elementos
- [ ] Layout responsive en móvil y escritorio

### Textos con Sentido
- [ ] Explicación clara de TUNOVA.IO
- [ ] Explicación del sistema Haki
- [ ] Explicación del MIX Comunitario
- [ ] Mensajes de error descriptivos
- [ ] Tooltips informativos
- [ ] Sección "Sobre NAKAMA"

### PWA
- [ ] App instalable en móviles
- [ ] App instalable en escritorio
- [ ] Funciona offline (básico)
- [ ] Iconos correctos en todos los tamaños
- [ ] Splash screen en iOS
- [ ] Botón de instalación visible

---

## 🎯 MÉTRICAS DE ÉXITO

1. **Funcionalidad:** 100% de botones funcionando correctamente
2. **UX:** < 3 clics para cualquier acción principal
3. **Performance:** Lighthouse PWA score > 90
4. **Accesibilidad:** Lighthouse A11y score > 90
5. **SEO:** Lighthouse SEO score > 90

---

**Tiempo total estimado:** 16-20 horas  
**Prioridad:** 🔥 MÁXIMA  
**Status:** 📋 Documentado - Listo para implementación
