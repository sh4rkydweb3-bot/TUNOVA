# 🏴‍☠️ TUNOVA.IO - Plan Maestro Completo del Ecosistema

**Visión:** Crear la plataforma de música y arte más innovadora donde NO HAY ARTISTAS, HAY NAKAMAS. El éxito de 1 es el éxito de todos.

**Fecha:** 26 de Noviembre, 2025  
**Status:** 🔥 IMPLEMENTACIÓN INMEDIATA

---

## 🎯 FILOSOFÍA NAKAMA

### **Principios Fundamentales**

1. **NO HAY ARTISTAS, HAY NAKAMAS**
   - Todos somos tripulación
   - Compartimos el éxito colectivo
   - Colaboración sobre competencia
   - La comunidad decide el valor

2. **EL ÉXITO DE 1 ES EL ÉXITO DE TODOS**
   - Sistema de recompensas compartidas
   - Cuando un NAKAMA gana Haki, todos ganan un %
   - Trending beneficia a toda la comunidad
   - Airdrops proporcionales a contribución colectiva

3. **ACCESO DIRECTO PARA WAITLIST**
   - 1 VHS sin revisión
   - 1 Cassette sin revisión
   - 1 Pizarra sin revisión
   - Drop instantáneo al unirse
   - Confianza en la tripulación

4. **SISTEMA ANTI-MARINA**
   - Protección contra bots
   - Detección de spam
   - Moderación comunitaria
   - Penalización de toxicidad
   - Recompensa por buen comportamiento

---

## 🌍 SISTEMA I18N COMPLETO

### **Idiomas Principales (Traducciones Manuales)**

1. **Español (ES)** - Idioma por defecto
2. **Inglés (EN)** - Internacional
3. **Japonés (JA)** - Anime/Manga culture

### **Idiomas Secundarios (Auto-detección)**

4. Portugués (PT)
5. Francés (FR)
6. Alemán (DE)
7. Italiano (IT)
8. Coreano (KO)
9. Chino Simplificado (ZH-CN)
10. Ruso (RU)

### **Implementación Técnica**

```typescript
// i18n/locales/es.json
{
  "common": {
    "welcome": "Bienvenido, NAKAMA",
    "loading": "Cargando...",
    "error": "Error",
    "success": "Éxito"
  },
  "nav": {
    "home": "Inicio",
    "gallery": "Galería",
    "community": "Comunidad",
    "haki": "Haki",
    "profile": "Perfil"
  },
  "waitlist": {
    "title": "Únete a la Tripulación",
    "subtitle": "Conviértete en NAKAMA y accede al Genesis",
    "benefits": {
      "1": "1 VHS gratis sin revisión",
      "2": "1 Cassette gratis sin revisión",
      "3": "1 Pizarra gratis sin revisión",
      "4": "Acceso anticipado al Airdrop",
      "5": "Badges exclusivos de Early NAKAMA"
    },
    "form": {
      "wallet": "Conecta tu Wallet",
      "email": "Email (opcional)",
      "discord": "Discord (opcional)",
      "twitter": "Twitter (opcional)",
      "roles": "Selecciona tus roles",
      "submit": "Unirme a la Tripulación"
    }
  },
  "mix": {
    "title": "MIX Comunitario",
    "vhs": "VHS de NAKAMAS",
    "cassette": "Cassettes de NAKAMAS",
    "board": "Pizarras de NAKAMAS",
    "drop": {
      "title": "Drop tu Contenido",
      "instant": "Publicación instantánea para NAKAMAS en waitlist",
      "vhs_placeholder": "URL de tu video (YouTube, Vimeo)",
      "cassette_placeholder": "URL de tu música (Spotify, SoundCloud)",
      "board_title": "Título de tu pizarra",
      "submit": "Publicar Ahora"
    }
  },
  "haki": {
    "title": "Sistema Haki",
    "level": "Nivel",
    "points": "Puntos",
    "rank": "Rango",
    "earn": "Gana Haki por:",
    "actions": {
      "join": "Unirte a waitlist (+50)",
      "drop_vhs": "Publicar VHS (+100)",
      "drop_cassette": "Publicar Cassette (+100)",
      "drop_board": "Crear Pizarra (+150)",
      "vote": "Votar contenido (+5)",
      "comment": "Comentar (+10)",
      "share": "Compartir (+20)",
      "daily": "Login diario (+25)"
    }
  },
  "antiMarina": {
    "title": "Sistema Anti-Marina",
    "protected": "Protegido por el Sistema Anti-Marina",
    "rules": {
      "1": "No spam",
      "2": "No bots",
      "3": "No toxicidad",
      "4": "Respeto entre NAKAMAS"
    },
    "violations": {
      "warning": "Advertencia",
      "temp_ban": "Suspensión temporal",
      "perm_ban": "Expulsión de la tripulación"
    }
  }
}
```

```typescript
// i18n/locales/ja.json
{
  "common": {
    "welcome": "ようこそ、仲間",
    "loading": "読み込み中...",
    "error": "エラー",
    "success": "成功"
  },
  "nav": {
    "home": "ホーム",
    "gallery": "ギャラリー",
    "community": "コミュニティ",
    "haki": "覇気",
    "profile": "プロフィール"
  },
  "waitlist": {
    "title": "仲間になろう",
    "subtitle": "NAKAMAになってGenesisにアクセス",
    "benefits": {
      "1": "無料VHS 1本（審査なし）",
      "2": "無料カセット 1本（審査なし）",
      "3": "無料ボード 1枚（審査なし）",
      "4": "エアドロップ早期アクセス",
      "5": "限定Early NAKAMAバッジ"
    }
  }
}
```

```typescript
// i18n/locales/en.json
{
  "common": {
    "welcome": "Welcome, NAKAMA",
    "loading": "Loading...",
    "error": "Error",
    "success": "Success"
  },
  "nav": {
    "home": "Home",
    "gallery": "Gallery",
    "community": "Community",
    "haki": "Haki",
    "profile": "Profile"
  },
  "waitlist": {
    "title": "Join the Crew",
    "subtitle": "Become a NAKAMA and access Genesis",
    "benefits": {
      "1": "1 free VHS without review",
      "2": "1 free Cassette without review",
      "3": "1 free Board without review",
      "4": "Early access to Airdrop",
      "5": "Exclusive Early NAKAMA badges"
    }
  }
}
```

### **Auto-detección de Idioma**

```typescript
// lib/i18n.ts
import { useEffect, useState } from 'react';

const SUPPORTED_LOCALES = ['es', 'en', 'ja', 'pt', 'fr', 'de', 'it', 'ko', 'zh', 'ru'];
const DEFAULT_LOCALE = 'es';

export function detectUserLocale(): string {
  // 1. Check localStorage
  const saved = localStorage.getItem('locale');
  if (saved && SUPPORTED_LOCALES.includes(saved)) {
    return saved;
  }

  // 2. Check browser language
  const browserLang = navigator.language.split('-')[0];
  if (SUPPORTED_LOCALES.includes(browserLang)) {
    return browserLang;
  }

  // 3. Check browser languages array
  for (const lang of navigator.languages) {
    const code = lang.split('-')[0];
    if (SUPPORTED_LOCALES.includes(code)) {
      return code;
    }
  }

  // 4. Default to Spanish
  return DEFAULT_LOCALE;
}

export function useTranslation() {
  const [locale, setLocale] = useState(detectUserLocale());
  const [translations, setTranslations] = useState({});

  useEffect(() => {
    import(`./locales/${locale}.json`).then(setTranslations);
  }, [locale]);

  const t = (key: string) => {
    const keys = key.split('.');
    let value = translations;
    for (const k of keys) {
      value = value?.[k];
    }
    return value || key;
  };

  return { t, locale, setLocale };
}
```

---

## 🎨 MIX COMUNITARIO - Drop Instantáneo

### **Concepto**

Cada NAKAMA en waitlist tiene derecho a publicar **SIN REVISIÓN**:
- 1 VHS (video)
- 1 Cassette (audio)
- 1 Pizarra (arte)

**Filosofía:** Confiamos en nuestra tripulación. El sistema Anti-Marina se encarga de proteger.

### **Flujo de Usuario**

```
┌────────────────────────────────────────┐
│ 1. Usuario se une a Waitlist          │
│    ├─ Conecta wallet                  │
│    ├─ Completa formulario             │
│    └─ Recibe +50 Haki                 │
└────────────────────────────────────────┘
              ↓
┌────────────────────────────────────────┐
│ 2. Acceso Inmediato a MIX Comunitario │
│    ├─ Badge "NAKAMA" visible          │
│    ├─ Botón "Drop Content" habilitado │
│    └─ Contador: 1/1 VHS, 1/1 Cassette │
│                 1/1 Board disponibles  │
└────────────────────────────────────────┘
              ↓
┌────────────────────────────────────────┐
│ 3. Drop VHS (Video)                   │
│    ├─ Pega URL de YouTube/Vimeo       │
│    ├─ Añade título y descripción      │
│    ├─ Selecciona cover/thumbnail      │
│    ├─ Añade tracks (con timestamps)   │
│    └─ Click "Publicar Ahora"          │
└────────────────────────────────────────┘
              ↓
┌────────────────────────────────────────┐
│ 4. Publicación Instantánea            │
│    ├─ VHS aparece en Galería Pública  │
│    ├─ +100 Haki otorgado              │
│    ├─ Notificación a comunidad        │
│    ├─ Contador: 0/1 VHS restantes     │
│    └─ Sistema Anti-Marina monitoreando│
└────────────────────────────────────────┘
              ↓
┌────────────────────────────────────────┐
│ 5. Comunidad Interactúa               │
│    ├─ Otros NAKAMAS votan (↑↓)        │
│    ├─ Comentan y comparten            │
│    ├─ Creador gana Haki por interacción│
│    └─ Trending si es popular          │
└────────────────────────────────────────┘
```

### **Schema de Base de Datos**

```typescript
// drizzle/schema.ts

export const communityMix = pgTable("communityMix", {
  id: serial("id").primaryKey(),
  creatorId: integer("creatorId").references(() => users.id).notNull(),
  type: varchar("type", { length: 20 }).notNull(), // 'vhs', 'cassette', 'board'
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  url: text("url"), // YouTube, Spotify, etc.
  coverImage: text("coverImage"),
  tracks: text("tracks"), // JSON array
  metadata: text("metadata"), // JSON object
  votes: integer("votes").default(0),
  views: integer("views").default(0),
  isInstantDrop: boolean("isInstantDrop").default(false), // true for waitlist NAKAMAS
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const userDropQuota = pgTable("userDropQuota", {
  id: serial("id").primaryKey(),
  userId: integer("userId").references(() => users.id).notNull(),
  vhsUsed: integer("vhsUsed").default(0),
  cassetteUsed: integer("cassetteUsed").default(0),
  boardUsed: integer("boardUsed").default(0),
  vhsLimit: integer("vhsLimit").default(1),
  cassetteLimit: integer("cassetteLimit").default(1),
  boardLimit: integer("boardLimit").default(1),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});
```

### **Endpoints tRPC**

```typescript
// server/routers.ts

export const mixRouter = router({
  // Check user quota
  getMyQuota: protectedProcedure.query(async ({ ctx }) => {
    return await db.getUserDropQuota(ctx.user.id);
  }),

  // Drop VHS (instant for waitlist)
  dropVHS: protectedProcedure
    .input(z.object({
      title: z.string(),
      description: z.string().optional(),
      url: z.string().url(),
      coverImage: z.string().url().optional(),
      tracks: z.array(z.object({
        title: z.string(),
        timestamp: z.string(),
      })),
    }))
    .mutation(async ({ ctx, input }) => {
      // Check quota
      const quota = await db.getUserDropQuota(ctx.user.id);
      if (quota.vhsUsed >= quota.vhsLimit) {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'VHS quota exceeded' });
      }

      // Create VHS
      const vhs = await db.createCommunityMix({
        creatorId: ctx.user.id,
        type: 'vhs',
        ...input,
        isInstantDrop: ctx.user.isInWaitlist,
      });

      // Update quota
      await db.incrementDropQuota(ctx.user.id, 'vhs');

      // Award Haki
      await awardHaki(ctx.user.id, 'drop_vhs', 100);

      // Notify community
      await sendTelegramNotification({
        type: 'new_community_drop',
        data: {
          creator: ctx.user.walletAddress,
          type: 'VHS',
          title: input.title,
        },
      });

      return vhs;
    }),

  // Similar for dropCassette and dropBoard...
});
```

---

## 🛡️ SISTEMA ANTI-MARINA

### **Concepto**

Protección automática contra:
- Bots y scripts maliciosos
- Spam de contenido
- Toxicidad y acoso
- Manipulación de votos
- Contenido ilegal

**Filosofía:** La Marina representa el control autoritario. Nosotros somos piratas libres pero responsables.

### **Niveles de Protección**

#### **Nivel 1: Prevención (Automático)**

```typescript
// Anti-Bot Protection
- Cloudflare Turnstile (captcha invisible)
- Rate limiting por IP y wallet
- Detección de patrones de bot
- Verificación de wallet real (balance > 0)
```

#### **Nivel 2: Detección (IA + Reglas)**

```typescript
// Content Moderation
- Detección de spam (URLs repetidas, texto idéntico)
- Detección de contenido NSFW (imagen/video analysis)
- Detección de lenguaje tóxico (sentiment analysis)
- Detección de copyright infringement
```

#### **Nivel 3: Moderación Comunitaria**

```typescript
// Community Reporting
- Botón "Report" en todo contenido
- Sistema de votos de confianza
- NAKAMAS con alto Haki pueden moderar
- Revisión por Capitán para casos graves
```

#### **Nivel 4: Penalización**

```typescript
// Punishment System
- Warning (1ra ofensa): Notificación + -50 Haki
- Temp Ban (2da ofensa): 7 días sin drop + -200 Haki
- Perm Ban (3ra ofensa): Expulsión + wallet blacklist
```

### **Implementación Técnica**

```typescript
// server/antiMarina.ts

export async function checkAntiMarina(params: {
  userId: number;
  action: string;
  content?: string;
  url?: string;
}): Promise<{ allowed: boolean; reason?: string }> {
  
  // 1. Check if user is banned
  const user = await db.getUserById(params.userId);
  if (user.isBanned) {
    return { allowed: false, reason: 'User is banned' };
  }

  // 2. Rate limiting
  const recentActions = await db.getUserRecentActions(params.userId, params.action);
  if (recentActions.length > 10) { // 10 actions per hour
    return { allowed: false, reason: 'Rate limit exceeded' };
  }

  // 3. Spam detection
  if (params.content) {
    const isSpam = await detectSpam(params.content);
    if (isSpam) {
      await logViolation(params.userId, 'spam');
      return { allowed: false, reason: 'Spam detected' };
    }
  }

  // 4. URL validation
  if (params.url) {
    const isValidUrl = await validateUrl(params.url);
    if (!isValidUrl) {
      return { allowed: false, reason: 'Invalid or malicious URL' };
    }
  }

  // 5. Toxicity check
  if (params.content) {
    const toxicityScore = await analyzeToxicity(params.content);
    if (toxicityScore > 0.8) {
      await logViolation(params.userId, 'toxicity');
      return { allowed: false, reason: 'Toxic content detected' };
    }
  }

  return { allowed: true };
}

async function detectSpam(content: string): Promise<boolean> {
  // Check for repetitive patterns
  const words = content.toLowerCase().split(/\s+/);
  const uniqueWords = new Set(words);
  const repetitionRatio = uniqueWords.size / words.length;
  
  if (repetitionRatio < 0.3) return true; // Too repetitive
  
  // Check for excessive URLs
  const urlCount = (content.match(/https?:\/\//g) || []).length;
  if (urlCount > 3) return true;
  
  // Check against known spam patterns
  const spamPatterns = [
    /free\s+money/i,
    /click\s+here/i,
    /limited\s+time/i,
    /act\s+now/i,
  ];
  
  return spamPatterns.some(pattern => pattern.test(content));
}

async function analyzeToxicity(content: string): Promise<number> {
  // Use Perspective API or similar
  // Return score 0-1 (0 = safe, 1 = toxic)
  // Placeholder implementation
  const toxicWords = ['hate', 'kill', 'stupid', 'idiot'];
  const lowerContent = content.toLowerCase();
  const toxicCount = toxicWords.filter(word => lowerContent.includes(word)).length;
  return Math.min(toxicCount / 10, 1);
}

async function logViolation(userId: number, type: string) {
  await db.createViolation({
    userId,
    type,
    timestamp: new Date(),
  });
  
  // Check violation count
  const violations = await db.getUserViolations(userId);
  
  if (violations.length === 1) {
    // Warning
    await db.updateUser(userId, { hakiPoints: user.hakiPoints - 50 });
    await sendNotification(userId, 'warning', 'First violation warning');
  } else if (violations.length === 2) {
    // Temp ban
    await db.updateUser(userId, { 
      isBanned: true,
      banUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      hakiPoints: user.hakiPoints - 200,
    });
    await sendNotification(userId, 'temp_ban', '7-day suspension');
  } else if (violations.length >= 3) {
    // Perm ban
    await db.updateUser(userId, { 
      isBanned: true,
      banUntil: null, // Permanent
    });
    await sendNotification(userId, 'perm_ban', 'Permanent ban');
    await sendTelegramNotification({
      type: 'user_banned',
      data: { userId, wallet: user.walletAddress },
    });
  }
}
```

---

## 🔊 BRANDING DE SONIDOS

### **Concepto**

Cada acción en TUNOVA.IO tiene un sonido característico que refuerza la identidad de marca.

### **Librería de Sonidos**

```
public/sounds/
├── ui/
│   ├── click.mp3           # Click general
│   ├── hover.mp3           # Hover sobre botón
│   ├── success.mp3         # Acción exitosa
│   ├── error.mp3           # Error
│   ├── notification.mp3    # Notificación nueva
│   └── transition.mp3      # Transición de página
├── tape/
│   ├── insert.mp3          # Insertar cinta
│   ├── eject.mp3           # Expulsar cinta
│   ├── flip.mp3            # Voltear cassette
│   ├── rewind.mp3          # Rebobinar
│   └── play.mp3            # Play button
├── haki/
│   ├── earn.mp3            # Ganar Haki
│   ├── levelup.mp3         # Subir de nivel
│   ├── milestone.mp3       # Alcanzar milestone
│   └── aura.mp3            # Efecto de aura
├── beatbunny/
│   ├── wake.mp3            # Despertar
│   ├── sleep.mp3           # Dormir
│   ├── nudge.mp3           # Nudge (como MSN)
│   ├── dance.mp3           # Bailar
│   └── celebrate.mp3       # Celebrar
├── social/
│   ├── upvote.mp3          # Upvote
│   ├── downvote.mp3        # Downvote
│   ├── comment.mp3         # Nuevo comentario
│   ├── share.mp3           # Compartir
│   └── follow.mp3          # Nuevo seguidor
└── special/
    ├── konami.mp3          # Konami code activado
    ├── achievement.mp3     # Logro desbloqueado
    ├── badge.mp3           # Badge ganado
    └── airdrop.mp3         # Airdrop recibido
```

### **Implementación**

```typescript
// lib/sounds.ts

export class SoundManager {
  private sounds: Map<string, HTMLAudioElement> = new Map();
  private enabled: boolean = true;
  private volume: number = 0.5;

  constructor() {
    this.loadSounds();
    this.enabled = localStorage.getItem('soundsEnabled') !== 'false';
    this.volume = parseFloat(localStorage.getItem('soundsVolume') || '0.5');
  }

  private loadSounds() {
    const soundFiles = {
      // UI
      'ui.click': '/sounds/ui/click.mp3',
      'ui.hover': '/sounds/ui/hover.mp3',
      'ui.success': '/sounds/ui/success.mp3',
      'ui.error': '/sounds/ui/error.mp3',
      'ui.notification': '/sounds/ui/notification.mp3',
      'ui.transition': '/sounds/ui/transition.mp3',
      
      // Tape
      'tape.insert': '/sounds/tape/insert.mp3',
      'tape.eject': '/sounds/tape/eject.mp3',
      'tape.flip': '/sounds/tape/flip.mp3',
      'tape.rewind': '/sounds/tape/rewind.mp3',
      'tape.play': '/sounds/tape/play.mp3',
      
      // Haki
      'haki.earn': '/sounds/haki/earn.mp3',
      'haki.levelup': '/sounds/haki/levelup.mp3',
      'haki.milestone': '/sounds/haki/milestone.mp3',
      'haki.aura': '/sounds/haki/aura.mp3',
      
      // BeatBunny
      'bunny.wake': '/sounds/beatbunny/wake.mp3',
      'bunny.sleep': '/sounds/beatbunny/sleep.mp3',
      'bunny.nudge': '/sounds/beatbunny/nudge.mp3',
      'bunny.dance': '/sounds/beatbunny/dance.mp3',
      'bunny.celebrate': '/sounds/beatbunny/celebrate.mp3',
      
      // Social
      'social.upvote': '/sounds/social/upvote.mp3',
      'social.downvote': '/sounds/social/downvote.mp3',
      'social.comment': '/sounds/social/comment.mp3',
      'social.share': '/sounds/social/share.mp3',
      'social.follow': '/sounds/social/follow.mp3',
      
      // Special
      'special.konami': '/sounds/special/konami.mp3',
      'special.achievement': '/sounds/special/achievement.mp3',
      'special.badge': '/sounds/special/badge.mp3',
      'special.airdrop': '/sounds/special/airdrop.mp3',
    };

    for (const [key, path] of Object.entries(soundFiles)) {
      const audio = new Audio(path);
      audio.volume = this.volume;
      this.sounds.set(key, audio);
    }
  }

  play(soundKey: string) {
    if (!this.enabled) return;
    
    const sound = this.sounds.get(soundKey);
    if (sound) {
      sound.currentTime = 0;
      sound.play().catch(console.error);
    }
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
    localStorage.setItem('soundsEnabled', enabled.toString());
  }

  setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume));
    localStorage.setItem('soundsVolume', this.volume.toString());
    
    for (const sound of this.sounds.values()) {
      sound.volume = this.volume;
    }
  }
}

export const soundManager = new SoundManager();
```

### **Uso en Componentes**

```typescript
// components/Button.tsx
import { soundManager } from '@/lib/sounds';

export function Button({ onClick, ...props }) {
  const handleClick = (e) => {
    soundManager.play('ui.click');
    onClick?.(e);
  };

  return (
    <button 
      onClick={handleClick}
      onMouseEnter={() => soundManager.play('ui.hover')}
      {...props}
    />
  );
}
```

---

## 📊 MÉTRICAS DE ÉXITO

### **KPIs Principales**

1. **Adopción**
   - Waitlist signups: > 1000 en primera semana
   - Wallet connections: > 500 en primera semana
   - Daily Active Users: > 200

2. **Engagement**
   - Community drops: > 100 VHS + Cassettes en primer mes
   - Average session time: > 10 minutos
   - Return rate: > 40% (D7)

3. **Comunidad**
   - Votes cast: > 5000 en primer mes
   - Comments: > 1000 en primer mes
   - Shares: > 500 en primer mes

4. **Calidad**
   - Anti-Marina violations: < 5%
   - User satisfaction: > 4.5/5
   - Bug reports: < 10 críticos

---

## 🚀 ROADMAP DE IMPLEMENTACIÓN

### **Semana 1: Fundamentos**
- ✅ Sistema i18n completo
- ✅ MIX Comunitario con drop instantáneo
- ✅ Sistema Anti-Marina básico
- ✅ Branding de sonidos

### **Semana 2: UI/UX**
- ✅ Boombox realista con skins
- ✅ Chat MSN mejorado
- ✅ BeatBunny interactivo
- ✅ Menús contextuales

### **Semana 3: Funcionalidades Avanzadas**
- ✅ Pizarras colaborativas
- ✅ Sistema de skins completo
- ✅ Galería comunitaria
- ✅ Perfiles de NAKAMAS

### **Semana 4: Testing y Launch**
- ✅ Testing completo
- ✅ Optimización
- ✅ Deploy
- ✅ Marketing y lanzamiento

---

**Status:** 📋 DOCUMENTADO - Listo para implementación inmediata  
**Prioridad:** 🔥 MÁXIMA  
**Estimación total:** 4 semanas full-time
