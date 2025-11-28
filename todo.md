# BeatBunny - Lista de Tareas

## 📚 DOCUMENTACIÓN COMPLETA
- [x] GENESIS_ROADMAP.md - Plan completo de lanzamiento con 24 tareas priorizadas
- [x] POLAROID_IMPLEMENTATION_PLAN.md - Arquitectura técnica completa de Cámara Polaroid
- [x] EPIC_ANIME_FLOWS.md - Flujos de usuario con estética anime/manga única

## Configuración Base
- [x] Configurar dependencias del proyecto (React, Lucide, Gemini AI)
- [x] Configurar Tailwind con tema cyberpunk personalizado
- [x] Agregar fuentes personalizadas (Inter, Permanent Marker, Share Tech Mono)
- [x] Configurar estilos globales y efectos CRT

## Sistema de Tipos y Constantes
- [x] Crear tipos TypeScript (VHSTape, CassetteTape, Track, UserRank, SystemMode)
- [x] Crear archivo de constantes con biblioteca de VHS y cassettes
- [x] Crear archivo de efectos de sonido (sfx.ts)

## Componentes de Medios
- [x] Componente VHS (cintas de video arrastrables)
- [x] Componente Cassette (cintas de cassette arrastrables)
- [x] Componente Screen (pantalla principal con visualizador)
- [x] Componente TrackList (lista de canciones)
- [x] Componente Visualizer (visualizador de audio)

## Componentes de Control
- [x] Componente Controls (play, pause, skip, etc.)
- [x] Componente VolumeKnob (control de volumen rotatorio)
- [x] Componente Boombox (interfaz principal del reproductor)
- [x] Sistema de drag and drop para cintas

## Efectos Visuales
- [x] Componente BackgroundFx (efectos de fondo cyberpunk)
- [x] Componente BeatBunny (mascota animada)
- [x] Efectos CRT y scanline
- [x] Animaciones de inserción/expulsión de cintas

## Sistema Nakama OS
- [x] Componente HakiMeter (medidor de puntuación)
- [x] Sistema de rangos (Chore Boy → Pirate King)
- [x] Componente RadioTicker (mensajes en ticker)
- [x] Componente RadioPanel (panel de radio)

## Sistema de IA y Chat
- [x] Componente AgentChat (chat con Gemini AI)
- [x] Integración con API de Gemini
- [x] Sistema de recomendaciones de música
- [x] Manejo de secretos (GEMINI_API_KEY)

## Sistema de Votación
- [x] Componente VotePanel (votación de canciones)
- [x] Sistema de votos globales por canción
- [x] Sistema de votos de usuario (upvote/downvote)
- [x] Persistencia de votos

## Creador de Cintas
- [x] Componente TapeCreator (crear cintas personalizadas)
- [x] Formulario para agregar canciones
- [x] Validación de URLs de YouTube
- [x] Guardar cintas en biblioteca

## Reproductor de Audio
- [x] Integración con Web Audio API
- [x] Filtro Lo-Fi (BiquadFilter)
- [x] Análisis de frecuencias (AnalyserNode)
- [x] Control de volumen
- [x] Sistema de reproducción automática

## Funcionalidades Adicionales
- [x] Sistema de shuffle con historial
- [x] Modo móvil responsive
- [x] Persistencia de estado (localStorage)
- [x] Efectos de sonido UI
- [x] Modo HAKI visual

## Optimización y Pulido
- [ ] Optimizar rendimiento de animaciones
- [ ] Mejorar accesibilidad
- [ ] Pruebas de compatibilidad cross-browser
- [ ] Documentación de uso


## Progreso
- Dependencias instaladas: @google/generative-ai, lucide-react, wagmi, viem, ethers, @tanstack/react-query
- Fuentes configuradas: Inter, Permanent Marker, Share Tech Mono
- Tema cyberpunk oscuro aplicado
- Efectos CRT y scrollbar personalizados agregados
- Backend completo implementado: Web3, Haki, Waitlist, Tapes, Analytics, Telegram
- Base de datos con 5 tablas: users, tapes, hakiEvents, contactRequests, analyticsEvents
- Sistema de notificaciones Telegram funcionando
- Endpoints tRPC completos para todas las funcionalidades


## Bugs Reportados
- [x] Arreglar funcionalidad de swap entre VHS y CASSETTE (radio)

## Mejoras Visuales
- [x] Agregar animación de flip 3D al cambiar entre VHS y CASSETTE

## Mejoras del Chat IA
- [x] Migrar de Gemini a OpenRouter con modelos gratuitos
- [x] Crear personalidad única y musical para BeatBunny
- [x] Implementar conocimientos avanzados de música


## 🌐 Sistema Web3 y Tokens
- [x] Integrar conexión de wallet (MetaMask, WalletConnect)
- [x] Configurar Wagmi con WalletConnect Project ID
- [x] Configurar React Query
- [x] Endpoints tRPC: connectWallet, disconnectWallet
- [x] Validación de wallets duplicadas
- [ ] Mostrar dirección de wallet conectada en UI
- [ ] Sistema de autenticación con firma de wallet
- [ ] Persistir conexión de wallet
- [ ] Botón de desconexión de wallet

## 💰 Sistema de Tokens $BELLY y $NAKAMAS
- [ ] Integrar smart contracts de tokens (lectura)
- [ ] Mostrar balance de $BELLY del usuario
- [ ] Mostrar balance de $NAKAMAS del usuario
- [ ] Sistema de recompensas Haki → Tokens (tracking)
- [ ] Dashboard de elegibilidad para Airdrop
- [ ] Mostrar Haki acumulado para Airdrop

## 📋 Waitlist y Selección de Roles
- [x] Campos en schema: walletAddress, isInWaitlist, waitlistRoles, discordHandle, twitterHandle
- [x] Funciones DB: joinWaitlist
- [x] Endpoints tRPC: waitlist.join, waitlist.status
- [x] Notificación Telegram cuando alguien se une
- [x] Award Haki por unirse a waitlist
- [ ] Formulario de registro en waitlist (UI)
- [ ] Selector de roles deseados (UI)
- [ ] Confirmación visual de registro exitoso (UI)
- [ ] Sistema de referidos (opcional)

## 🎬 Separación VHS (Video) vs Cassette (Audio)
- [ ] Clarificar en UI: VHS = Video, Cassette = Audio únicamente
- [ ] Creador de VHS: Solo acepta URLs de video (YouTube, Vimeo)
- [ ] Creador de Cassette: Solo acepta URLs de audio (Spotify, SoundCloud, MP3)
- [ ] Validación estricta de tipo de contenido
- [ ] Mensajes claros de error si se confunde el tipo

## ✅ Sistema de Moderación de Contenido
- [x] Tabla tapes con estados: draft, pending, approved, rejected
- [x] Funciones DB: createTape, getTapesByStatus, getTapesByCreator, updateTapeStatus
- [x] Endpoints tRPC: tapes.create, tapes.submitForReview, tapes.getMyTapes, tapes.getApproved
- [x] Endpoints admin: admin.getPendingTapes, admin.reviewTape
- [x] Notificación Telegram cuando se envía cinta
- [x] Award Haki por crear cinta y bonus por aprobación
- [ ] Usuario puede crear y probar su cinta en modo draft (UI)
- [ ] Botón "Submit for Review" (UI)
- [ ] Cola de moderación (UI admin)
- [ ] Panel de admin para aprobar/rechazar cintas (UI)
- [ ] Notificación al usuario cuando su cinta es aprobada/rechazada (UI)
- [ ] Mensaje claro: "Tu cinta será revisada por BeatBunny y el Capitán" (UI)

## 📊 Sistema de Analíticas
- [x] Tabla analyticsEvents
- [x] Funciones DB: logAnalyticsEvent, getAnalyticsByType
- [x] Tracking de eventos importantes:
  - [x] Nuevos usuarios conectados
  - [x] Cintas creadas y enviadas a revisión
  - [x] Haki ganado por usuarios
  - [x] Registros en waitlist
  - [x] Solicitudes de contacto
- [ ] Dashboard de métricas en tiempo real (UI)
- [ ] Exportación de datos para análisis (UI)

## 🤖 Automatización vía Telegram
- [x] Configurar Bot de Telegram
- [x] Helper de Telegram con sendTelegramNotification
- [x] Templates de notificaciones:
  - [x] Nuevo usuario conectó wallet
  - [x] Nueva cinta enviada a revisión
  - [x] Usuario alcanzó milestone de Haki
  - [x] Nuevo registro en waitlist
  - [x] Usuario solicitó contacto con Capitán
- [x] Formato de mensajes con emojis y datos clave
- [x] Test de validación de Bot funcionando

## 👨‍✈️ Sistema de Contacto con Capitán
- [x] Tabla contactRequests con estados: pending, approved, rejected
- [x] Funciones DB: createContactRequest, getPendingContactRequests, updateContactRequestStatus
- [x] Endpoint tRPC: contact.requestCaptain
- [x] Endpoints admin: admin.getPendingContactRequests, admin.reviewContactRequest
- [x] Notificación Telegram cuando alguien solicita contacto
- [ ] BeatBunny detecta usuarios "adecuados" en chat (UI)
- [ ] Opción en chat: "Request Captain Contact" (UI)
- [ ] Formulario de solicitud con razón del contacto (UI)
- [ ] Panel admin para aprobar/denegar solicitudes (UI)
- [ ] Si aprobado: Mostrar método de contacto (UI)

## 🔐 Backend y Base de Datos
- [x] Upgrade a template con servidor y base de datos
- [x] Esquema de base de datos:
  - [x] Users (wallet, haki, isInWaitlist, waitlistRoles, discord, twitter, role)
  - [x] Tapes (id, creator, type, status, tracks, created_at, reviewed_at, reviewNote)
  - [x] HakiEvents (userId, eventType, points, metadata)
  - [x] ContactRequests (user, reason, status, approved_by, contactMethod)
  - [x] AnalyticsEvents (event_type, user, data, timestamp)
- [x] Funciones DB completas para todas las operaciones
- [x] Endpoints tRPC: web3, waitlist, haki, tapes, contact, admin
- [x] Sistema de permisos (role: user/admin)
- [ ] Autenticación con JWT basado en firma de wallet
- [ ] Rate limiting para prevenir spam

## 🎨 Mejoras de UX
- [ ] Onboarding claro: "Connect Wallet → Earn Haki → Get Airdrop"
- [ ] Tutorial explicando VHS vs Cassette
- [ ] Badges visuales para usuarios en waitlist
- [ ] Indicador de estado de cintas (draft/pending/approved)
- [ ] Notificaciones in-app para eventos importantes
- [ ] Sección "My Contributions" para ver cintas propias


---

# 🚀 GENESIS LAUNCH - Nuevas Funcionalidades

## 🔴 CRÍTICO - MVP Launch
- [ ] Sistema Web3 UI completo (botón Connect Wallet, modal, persistencia)
- [ ] Modal de Waitlist con selección de roles
- [ ] Panel de Admin para moderación de tapes y contact requests
- [ ] Dashboard de analytics en Admin Panel
- [ ] Seguridad y rate limiting
- [ ] Preparación para deploy (env vars, monitoring, SSL)

## 🟠 ALTO - Experiencia Core
- [ ] Mejora de inteligencia de BeatBunny (personalidad, comandos, evaluación)
- [ ] Chat estilo MSN mejorado (burbujas, emojis, historial)
- [ ] Sistema de envío de artefactos a BeatBunny para evaluación
- [ ] Tabla tapeReviews en DB para guardar evaluaciones de BeatBunny

## 🟡 MEDIO - Experiencia Premium
- [ ] Modo Fullscreen épico con visualizador expandido
- [ ] Menús contextuales (click derecho) para cintas y tracks
- [ ] Soporte para doble tap en dispositivos táctiles
- [ ] Sistema de skins para cassettes (anime, manga, custom colors)
- [ ] Sistema de skins para VHS (anime covers, custom thumbnails)
- [ ] Sistema de skins para Boombox/VCR (color schemes, materials)
- [ ] UI themes (Dark, Light, Anime, Matrix, Vaporwave)
- [ ] Sistema de unlocks de skins basado en Haki
- [ ] Galería de skins con preview

## 🟢 NORMAL - Funcionalidades Épicas
- [ ] Portal NAKAMA OS con botón épico
- [ ] Modal NAKAMA OS con countdown y roadmap
- [ ] Sección de Airdrop Eligibility con progreso
- [ ] Galería de Exclusive Badges (NFTs)
- [ ] Sistema de referidos con bonus Haki
- [ ] Leaderboard de referidores
- [ ] Sistema de cola de reproducción avanzado
- [ ] Sistema de favoritos y playlists personales
- [ ] Achievements y gamificación avanzada
- [ ] Sistema de notificaciones in-app
- [ ] Perfil de usuario completo

## 🔵 OPCIONAL - Nice to Have
- [ ] Modo colaborativo (Watch Party)
- [ ] Integración con Spotify/Apple Music
- [ ] Modo Karaoke con letras sincronizadas

## 🛡️ CALIDAD Y DEPLOY
- [ ] Testing completo (unit, integration, E2E)
- [ ] Optimización de rendimiento (Lighthouse > 90)
- [ ] Documentación completa (README, guías)
- [ ] Estrategia de lanzamiento y marketing

## 💡 EASTER EGGS Y VIRALES
- [ ] Konami Code para modo secreto
- [ ] Hidden tracks desbloqueables
- [ ] Time-based events
- [ ] Share to social con imagen generada
- [ ] Weekly challenges con recompensas


## 📸 CÁMARA POLAROID + PIZARRAS INTERACTIVAS
- [ ] Sistema de Cámara Polaroid con captura artística
- [ ] Filtros anime/manga (sketch, watercolor, cel-shading, pixel art)
- [ ] Marco Polaroid personalizable con stickers
- [ ] Galería de Polaroids en perfil
- [ ] Compartir Polaroids en redes sociales
- [ ] Sistema de Pizarras Interactivas temáticas
- [ ] Canvas colaborativo en tiempo real
- [ ] Herramientas de dibujo (pincel, formas, texto, stickers)
- [ ] Sistema de capas y opacidad
- [ ] Galería de pizarras completadas con votación
- [ ] Event Boards y Challenge Boards
- [ ] Personal Canvas privado
- [ ] Moderación de pizarras en Admin Panel
- [ ] Achievements de artista
- [ ] Leaderboard de artistas
- [ ] Tablas DB: polaroids, boards, boardContributions


---

# 🔥 REVISIÓN COMPLETA - HAKI MODE ACTIVATED

## 🎯 PROBLEMAS CRÍTICOS DETECTADOS
- [ ] Boombox no parece radio portátil del Bronx (muy básico)
- [ ] Textos y botones superpuestos (mala composición)
- [ ] UI no realista ni inmersiva
- [ ] Chat MSN muy básico, sin personalidad retro
- [ ] BeatBunny poco interactivo y animado
- [ ] Sistema de skins no implementado
- [ ] Falta sistema de contribuciones de NAKAMAS
- [ ] Composición general desorganizada

## 🎨 REDISEÑO COMPLETO DE BOOMBOX
- [ ] Diseñar radio portátil estilo Bronx 80s/90s
- [ ] Añadir detalles realistas (antena, manijas, botones físicos)
- [ ] Sistema de skins intercambiables (Chrome, Gold, Graffiti, Anime)
- [ ] Selector de skins con preview en tiempo real
- [ ] Animaciones de cambio de skin fluidas
- [ ] Efectos de luz y sombra realistas
- [ ] Stickers y pegatinas personalizables

## 💬 CHAT MSN MEJORADO
- [ ] Ventana de chat estilo MSN Messenger clásico
- [ ] Burbujas de chat con colores personalizables
- [ ] Emojis animados estilo MSN
- [ ] Sonidos de notificación característicos
- [ ] Indicador "BeatBunny está escribiendo..."
- [ ] Historial de chat persistente
- [ ] Comandos especiales (/haki, /stats, /help)
- [ ] Avatares animados para BeatBunny

## 🐰 BEATBUNNY MEJORADO
- [ ] Animaciones idle más dinámicas
- [ ] Reacciones a eventos (música, Haki, logros)
- [ ] Estados de ánimo visuales (feliz, dormido, bailando)
- [ ] Interacción con click (despertar, bailar, hablar)
- [ ] Partículas y efectos al ganar Haki
- [ ] Expresiones faciales animadas

## 🎨 SISTEMA DE SKINS COMPLETO
- [ ] Tabla `skins` en base de datos
- [ ] Tabla `userSkins` para skins desbloqueados
- [ ] Categorías: Boombox, VHS, Cassette, Background, BeatBunny
- [ ] Sistema de unlock basado en Haki
- [ ] Galería de skins con preview 3D
- [ ] Skins premium para early NAKAMAS
- [ ] Editor de colores custom
- [ ] Importar skins de la comunidad

## 🎭 SISTEMA DE CONTRIBUCIONES NAKAMAS
- [ ] Galería pública de VHS creados por comunidad
- [ ] Galería pública de Cassettes creados por comunidad
- [ ] Sistema de votación y trending
- [ ] Featured NAKAMAS section
- [ ] Perfil público de creadores
- [ ] Badges de contribuidor
- [ ] Sistema de follows entre NAKAMAS

## 🖼️ PIZARRAS PERSONALIZABLES
- [ ] Canvas de dibujo colaborativo
- [ ] Herramientas de dibujo profesionales
- [ ] Capas y opacidad
- [ ] Plantillas temáticas (anime, manga, cyberpunk)
- [ ] Galería de pizarras completadas
- [ ] Sistema de votación
- [ ] Export como NFT (futuro)

## 🎯 COMPOSICIÓN Y LAYOUT
- [ ] Auditar todos los componentes por superposiciones
- [ ] Sistema de grid responsive mejorado
- [ ] Z-index hierarchy bien definido
- [ ] Espaciado consistente (8px grid system)
- [ ] Breakpoints móvil optimizados
- [ ] Eliminar overlaps de texto
- [ ] Mejorar legibilidad en todos los tamaños

## 🚀 OPTIMIZACIÓN UI/UX
- [ ] Inspiración de uiverse.io para componentes
- [ ] Micro-interacciones pulidas
- [ ] Transiciones suaves (ease-out)
- [ ] Loading states elegantes
- [ ] Error states informativos
- [ ] Success feedback visual
- [ ] Tooltips útiles
- [ ] Keyboard shortcuts


## 🎮 MENÚS CONTEXTUALES Y GESTOS TÁCTILES
- [ ] Sistema de menú contextual (click derecho) para todos los elementos
- [ ] Detección de doble tap en dispositivos táctiles
- [ ] Menú contextual para VHS tapes
- [ ] Menú contextual para Cassettes
- [ ] Menú contextual para Tracks en lista
- [ ] Menú contextual para BeatBunny
- [ ] Menú contextual para Boombox
- [ ] Menú contextual para Background
- [ ] Gestos de swipe en móvil
- [ ] Gestos de pinch-to-zoom
- [ ] Haptic feedback en móvil
- [ ] Animaciones de menú contextual épicas
- [ ] Diseño de menú estilo glassmorphism
- [ ] Shortcuts de teclado integrados


---

# 🎯 PRIORIDAD INMEDIATA - Arreglar UI/UX y PWA

## 🔘 Lógica de Botones
- [ ] Auditar todos los botones del sitio
- [ ] Arreglar botón VCR/DECK (swap entre sistemas)
- [ ] Arreglar controles del reproductor (play, pause, next, prev)
- [ ] Arreglar botón de volumen
- [ ] Arreglar botón de BeatBunny (abrir/cerrar chat)
- [ ] Arreglar botón de Radio (panel lateral)
- [ ] Arreglar drag & drop de cintas
- [ ] Implementar feedback visual en todos los botones
- [ ] Agregar estados disabled cuando corresponda

## 🗂️ Organización del Sitio
- [ ] Crear estructura de navegación clara
- [ ] Implementar router con rutas lógicas
- [ ] Crear página de inicio (landing)
- [ ] Crear página de reproductor
- [ ] Crear página de galería/MIX
- [ ] Crear página de perfil
- [ ] Crear página de configuración
- [ ] Arreglar superposiciones de elementos
- [ ] Mejorar espaciado y composición
- [ ] Implementar layout responsive

## 📝 Textos con Sentido
- [ ] Escribir textos explicativos del proyecto
- [ ] Crear onboarding para nuevos usuarios
- [ ] Agregar tooltips en botones
- [ ] Mejorar mensajes de error
- [ ] Crear sección "Sobre TUNOVA.IO"
- [ ] Explicar sistema de Haki
- [ ] Explicar MIX Comunitario
- [ ] Explicar waitlist y beneficios

## 📱 Convertir a PWA
- [ ] Crear manifest.json
- [ ] Implementar service worker
- [ ] Configurar offline support
- [ ] Agregar iconos para instalación
- [ ] Implementar splash screen
- [ ] Configurar meta tags para PWA
- [ ] Testing en móviles
- [ ] Testing en escritorio


## 📦 GitHub Repository
- [ ] Crear README.md completo con créditos de TIDElabs
- [ ] Configurar Git y remote
- [ ] Subir código al repositorio
- [ ] Verificar que todo se subió correctamente
