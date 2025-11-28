# 📸 Plan de Implementación: Cámara Polaroid

## 🎯 Objetivo

Crear un sistema de captura de pantalla artístico que permita a los usuarios inmortalizar momentos musicales en formato Polaroid con filtros anime/manga, personalización completa, y compartir en redes sociales.

---

## 🏗️ Arquitectura Técnica

### **Stack Tecnológico Recomendado**

#### **Frontend (Captura y Procesamiento)**
```typescript
// Captura de pantalla
- html2canvas@1.4.1          // Captura DOM como imagen
- dom-to-image@2.6.0         // Alternativa más precisa (backup)

// Procesamiento de imagen
- fabric.js@5.3.0            // Manipulación de canvas avanzada
- canvas-filters@1.0.2       // Filtros de imagen predefinidos
- CamanJS@4.1.2             // Filtros artísticos (sketch, watercolor)

// Efectos anime/manga
- opencv.js@4.8.0           // Computer vision para edge detection
- anime.js@3.2.1            // Animaciones suaves

// Exportación
- file-saver@2.0.5          // Descargar imágenes
- html-to-image@1.11.11     // Exportación de alta calidad

// UI/UX
- react-draggable@4.4.6     // Stickers arrastrables
- react-color@2.19.3        // Selector de colores
- framer-motion@10.16.4     // Animaciones de revelado
```

#### **Backend (Almacenamiento)**
```typescript
// Storage
- AWS S3 / Cloudinary        // Almacenamiento de imágenes
- Sharp@0.32.6              // Optimización server-side

// Database
- PostgreSQL (ya existente)  // Metadata de polaroids
```

#### **Schema de Base de Datos**
```typescript
// drizzle/schema.ts
export const polaroids = pgTable('polaroids', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  userId: text('user_id').notNull().references(() => users.id),
  
  // Imagen
  imageUrl: text('image_url').notNull(),
  thumbnailUrl: text('thumbnail_url'),
  
  // Metadata de captura
  filter: text('filter').notNull(), // 'sketch', 'watercolor', 'cel-shading', etc.
  frameColor: text('frame_color').default('#FFFFFF'),
  
  // Contenido
  caption: text('caption'),
  stickers: json('stickers').$type<Sticker[]>().default([]),
  
  // Contexto musical
  trackInfo: json('track_info').$type<{
    trackTitle: string;
    artist: string;
    tapeTitle: string;
    timestamp: string;
  }>(),
  
  // Engagement
  likes: integer('likes').default(0),
  shares: integer('shares').default(0),
  isPublic: boolean('is_public').default(true),
  
  // Timestamps
  createdAt: timestamp('created_at').defaultNow(),
});

interface Sticker {
  id: string;
  type: 'emoji' | 'icon' | 'text';
  content: string;
  x: number;
  y: number;
  rotation: number;
  scale: number;
}
```

---

## 📋 Hitos de Implementación

### **Milestone 1: Captura Básica** ⏱️ 2-3h
**Objetivo:** Capturar el estado actual del reproductor como imagen

**Tareas:**
1. **Crear componente `PolaroidCamera.tsx`**
   ```tsx
   interface PolaroidCameraProps {
     onCapture: (imageData: string) => void;
   }
   ```

2. **Implementar botón de cámara**
   - Icono de cámara Polaroid en header
   - Animación de flash al hacer clic
   - Sonido de clic de cámara

3. **Captura de pantalla con html2canvas**
   ```typescript
   const captureScreen = async () => {
     const element = document.getElementById('boombox-container');
     const canvas = await html2canvas(element, {
       backgroundColor: null,
       scale: 2, // Alta resolución
       logging: false,
     });
     return canvas.toDataURL('image/png');
   };
   ```

4. **Extraer metadata del track actual**
   ```typescript
   const getTrackMetadata = () => ({
     trackTitle: currentTrack.title,
     artist: currentTrack.artist,
     tapeTitle: currentTape.title,
     timestamp: new Date().toISOString(),
   });
   ```

**Entregable:** Botón funcional que captura pantalla y muestra preview básico

---

### **Milestone 2: Filtros Artísticos** ⏱️ 3-4h
**Objetivo:** Aplicar filtros anime/manga a la imagen capturada

**Tareas:**
1. **Crear helper `imageFilters.ts`**
   ```typescript
   export type FilterType = 
     | 'none'
     | 'sketch'
     | 'watercolor'
     | 'cel-shading'
     | 'pixel-art'
     | 'vaporwave'
     | 'lofi';

   export const applyFilter = async (
     imageData: string,
     filter: FilterType
   ): Promise<string> => {
     // Implementación de cada filtro
   };
   ```

2. **Implementar filtros individuales**

   **a) Sketch (Manga Lines)**
   ```typescript
   const applySketchFilter = (canvas: HTMLCanvasElement) => {
     const ctx = canvas.getContext('2d');
     const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
     
     // Convertir a escala de grises
     for (let i = 0; i < imageData.data.length; i += 4) {
       const avg = (imageData.data[i] + imageData.data[i+1] + imageData.data[i+2]) / 3;
       imageData.data[i] = imageData.data[i+1] = imageData.data[i+2] = avg;
     }
     
     // Aplicar edge detection (Sobel operator)
     const edges = detectEdges(imageData);
     
     // Invertir para líneas negras sobre blanco
     invertColors(edges);
     
     ctx.putImageData(edges, 0, 0);
   };
   ```

   **b) Watercolor (Anime Aesthetic)**
   ```typescript
   const applyWatercolorFilter = (canvas: HTMLCanvasElement) => {
     // Usar CamanJS para efecto acuarela
     Caman(canvas, function() {
       this.brightness(10);
       this.contrast(15);
       this.saturation(20);
       this.vibrance(30);
       this.stackBlur(3); // Suavizado
       this.render();
     });
   };
   ```

   **c) Cel-Shading (Anime Classic)**
   ```typescript
   const applyCelShadingFilter = (canvas: HTMLCanvasElement) => {
     const ctx = canvas.getContext('2d');
     const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
     
     // Posterización (reducir colores)
     const levels = 4; // Niveles de color
     for (let i = 0; i < imageData.data.length; i += 4) {
       imageData.data[i] = Math.floor(imageData.data[i] / 255 * levels) * (255 / levels);
       imageData.data[i+1] = Math.floor(imageData.data[i+1] / 255 * levels) * (255 / levels);
       imageData.data[i+2] = Math.floor(imageData.data[i+2] / 255 * levels) * (255 / levels);
     }
     
     // Aplicar edge detection para contornos
     const edges = detectEdges(imageData);
     
     // Combinar posterización + contornos
     ctx.putImageData(imageData, 0, 0);
     ctx.globalCompositeOperation = 'multiply';
     ctx.putImageData(edges, 0, 0);
   };
   ```

   **d) Pixel Art (8-bit/16-bit)**
   ```typescript
   const applyPixelArtFilter = (canvas: HTMLCanvasElement) => {
     const ctx = canvas.getContext('2d');
     const pixelSize = 8; // Tamaño de pixel
     
     // Reducir resolución
     const tempCanvas = document.createElement('canvas');
     tempCanvas.width = canvas.width / pixelSize;
     tempCanvas.height = canvas.height / pixelSize;
     const tempCtx = tempCanvas.getContext('2d');
     
     tempCtx.drawImage(canvas, 0, 0, tempCanvas.width, tempCanvas.height);
     
     // Escalar de vuelta (sin suavizado)
     ctx.imageSmoothingEnabled = false;
     ctx.drawImage(tempCanvas, 0, 0, canvas.width, canvas.height);
     
     // Reducir paleta de colores
     reduceColorPalette(ctx, 16); // 16 colores
   };
   ```

   **e) Vaporwave Aesthetic**
   ```typescript
   const applyVaporwaveFilter = (canvas: HTMLCanvasElement) => {
     Caman(canvas, function() {
       this.brightness(5);
       this.contrast(-10);
       this.saturation(50);
       this.vibrance(50);
       this.hue(180); // Shift hacia cyan/magenta
       this.sepia(20);
       this.stackBlur(2);
       this.render();
     });
   };
   ```

   **f) Lo-Fi Aesthetic**
   ```typescript
   const applyLoFiFilter = (canvas: HTMLCanvasElement) => {
     Caman(canvas, function() {
       this.brightness(-5);
       this.contrast(10);
       this.saturation(-20);
       this.sepia(30);
       this.noise(10); // Grain
       this.vignette(30); // Viñeta
       this.render();
     });
   };
   ```

3. **Crear selector de filtros en UI**
   ```tsx
   const FilterSelector = ({ onSelect }: { onSelect: (filter: FilterType) => void }) => (
     <div className="filter-grid">
       {FILTERS.map(filter => (
         <button key={filter.id} onClick={() => onSelect(filter.id)}>
           <img src={filter.preview} alt={filter.name} />
           <span>{filter.name}</span>
         </button>
       ))}
     </div>
   );
   ```

**Entregable:** Sistema de filtros funcional con preview en tiempo real

---

### **Milestone 3: Marco Polaroid y Personalización** ⏱️ 2-3h
**Objetivo:** Agregar marco estilo Polaroid con texto y stickers

**Tareas:**
1. **Crear componente `PolaroidFrame.tsx`**
   ```tsx
   interface PolaroidFrameProps {
     image: string;
     caption: string;
     onCaptionChange: (text: string) => void;
     stickers: Sticker[];
     onAddSticker: (sticker: Sticker) => void;
   }
   ```

2. **Implementar marco Polaroid con Fabric.js**
   ```typescript
   const createPolaroidFrame = (imageData: string, caption: string) => {
     const canvas = new fabric.Canvas('polaroid-canvas');
     
     // Dimensiones Polaroid (proporción 1:1.2)
     const frameWidth = 600;
     const frameHeight = 720;
     const imageHeight = 600;
     const captionHeight = 120;
     
     // Fondo blanco
     canvas.setBackgroundColor('#FFFFFF', canvas.renderAll.bind(canvas));
     
     // Imagen principal
     fabric.Image.fromURL(imageData, (img) => {
       img.scaleToWidth(frameWidth - 40); // Margen de 20px
       img.set({
         left: 20,
         top: 20,
         selectable: false,
       });
       canvas.add(img);
     });
     
     // Área de caption
     const captionText = new fabric.Textbox(caption, {
       left: 20,
       top: imageHeight + 40,
       width: frameWidth - 40,
       fontSize: 24,
       fontFamily: 'Permanent Marker',
       fill: '#000000',
       textAlign: 'center',
     });
     canvas.add(captionText);
     
     return canvas;
   };
   ```

3. **Sistema de stickers arrastrables**
   ```typescript
   const STICKER_LIBRARY = {
     emojis: ['🐰', '⚡', '🏴‍☠️', '🎵', '🎮', '✨', '💫', '🔥', '💙', '🌊'],
     onePiece: ['☠️', '🏴‍☠️', '👒', '⚔️', '🌊', '💎'],
     music: ['🎵', '🎶', '🎸', '🎹', '🎧', '🎤', '📻'],
     vibes: ['✨', '💫', '🌟', '⭐', '💥', '🔥', '💙', '💜'],
   };

   const addStickerToCanvas = (canvas: fabric.Canvas, sticker: string) => {
     const text = new fabric.Text(sticker, {
       fontSize: 48,
       left: canvas.width / 2,
       top: canvas.height / 2,
       originX: 'center',
       originY: 'center',
     });
     
     canvas.add(text);
     canvas.setActiveObject(text);
   };
   ```

4. **Editor de texto personalizable**
   ```tsx
   const CaptionEditor = ({ value, onChange }: CaptionEditorProps) => (
     <div className="caption-editor">
       <input
         type="text"
         value={value}
         onChange={(e) => onChange(e.target.value)}
         placeholder="Add a caption..."
         maxLength={50}
       />
       <div className="caption-options">
         <select onChange={(e) => setFont(e.target.value)}>
           <option value="Permanent Marker">Handwritten</option>
           <option value="Share Tech Mono">Monospace</option>
           <option value="Inter">Clean</option>
         </select>
         <input type="color" onChange={(e) => setColor(e.target.value)} />
       </div>
     </div>
   );
   ```

**Entregable:** Marco Polaroid completo con caption editable y stickers

---

### **Milestone 4: Animación de Revelado** ⏱️ 1-2h
**Objetivo:** Efecto de revelado progresivo estilo Polaroid real

**Tareas:**
1. **Implementar animación con Framer Motion**
   ```tsx
   const PolaroidReveal = ({ imageUrl }: { imageUrl: string }) => {
     return (
       <motion.div
         className="polaroid-reveal"
         initial={{ opacity: 0, scale: 0.8, rotateZ: -5 }}
         animate={{ opacity: 1, scale: 1, rotateZ: 0 }}
         transition={{ duration: 0.5, ease: 'easeOut' }}
       >
         <motion.div
           className="polaroid-image"
           initial={{ filter: 'brightness(2) contrast(0.5)' }}
           animate={{ filter: 'brightness(1) contrast(1)' }}
           transition={{ duration: 2, ease: 'easeInOut' }}
         >
           <img src={imageUrl} alt="Polaroid" />
         </motion.div>
         
         <motion.div
           className="polaroid-overlay"
           initial={{ opacity: 1 }}
           animate={{ opacity: 0 }}
           transition={{ duration: 2, delay: 0.5 }}
         />
       </motion.div>
     );
   };
   ```

2. **Efectos de sonido**
   ```typescript
   const playCameraSound = () => {
     const audio = new Audio('/sounds/polaroid-click.mp3');
     audio.play();
   };

   const playRevealSound = () => {
     const audio = new Audio('/sounds/polaroid-reveal.mp3');
     audio.volume = 0.3;
     audio.play();
   };
   ```

3. **Efecto de flash**
   ```tsx
   const FlashEffect = () => (
     <motion.div
       className="flash-overlay"
       initial={{ opacity: 0 }}
       animate={{ opacity: [0, 1, 0] }}
       transition={{ duration: 0.3 }}
       style={{
         position: 'fixed',
         inset: 0,
         backgroundColor: 'white',
         pointerEvents: 'none',
         zIndex: 9999,
       }}
     />
   );
   ```

**Entregable:** Experiencia de captura inmersiva con animaciones

---

### **Milestone 5: Galería y Persistencia** ⏱️ 2-3h
**Objetivo:** Guardar polaroids y mostrar galería personal

**Tareas:**
1. **Crear endpoints tRPC**
   ```typescript
   // server/routers.ts
   export const polaroidRouter = router({
     create: protectedProcedure
       .input(z.object({
         imageData: z.string(),
         filter: z.string(),
         caption: z.string().optional(),
         stickers: z.array(z.any()),
         trackInfo: z.object({
           trackTitle: z.string(),
           artist: z.string(),
           tapeTitle: z.string(),
           timestamp: z.string(),
         }),
       }))
       .mutation(async ({ ctx, input }) => {
         // Upload image to S3/Cloudinary
         const imageUrl = await uploadImage(input.imageData);
         const thumbnailUrl = await createThumbnail(imageUrl);
         
         // Save to DB
         const polaroid = await db.insert(polaroids).values({
           userId: ctx.user.id,
           imageUrl,
           thumbnailUrl,
           filter: input.filter,
           caption: input.caption,
           stickers: input.stickers,
           trackInfo: input.trackInfo,
         }).returning();
         
         // Award Haki
         await awardHaki(ctx.user.id, 'polaroid_created', 5, {
           polaroidId: polaroid[0].id,
         });
         
         return polaroid[0];
       }),

     getMyPolaroids: protectedProcedure
       .query(async ({ ctx }) => {
         return await db
           .select()
           .from(polaroids)
           .where(eq(polaroids.userId, ctx.user.id))
           .orderBy(desc(polaroids.createdAt));
       }),

     delete: protectedProcedure
       .input(z.object({ id: z.string() }))
       .mutation(async ({ ctx, input }) => {
         // Verificar ownership
         const polaroid = await db
           .select()
           .from(polaroids)
           .where(eq(polaroids.id, input.id))
           .limit(1);
         
         if (polaroid[0].userId !== ctx.user.id) {
           throw new Error('Unauthorized');
         }
         
         // Delete from storage
         await deleteImage(polaroid[0].imageUrl);
         
         // Delete from DB
         await db.delete(polaroids).where(eq(polaroids.id, input.id));
       }),
   });
   ```

2. **Crear componente `PolaroidGallery.tsx`**
   ```tsx
   const PolaroidGallery = () => {
     const { data: polaroids } = trpc.polaroid.getMyPolaroids.useQuery();
     const deleteMutation = trpc.polaroid.delete.useMutation();

     return (
       <div className="polaroid-gallery">
         <h2>My Polaroids 📸</h2>
         <div className="gallery-grid">
           {polaroids?.map(polaroid => (
             <motion.div
               key={polaroid.id}
               className="polaroid-card"
               whileHover={{ scale: 1.05, rotateZ: 2 }}
             >
               <img src={polaroid.thumbnailUrl} alt={polaroid.caption} />
               <p className="caption">{polaroid.caption}</p>
               <div className="polaroid-actions">
                 <button onClick={() => downloadPolaroid(polaroid.imageUrl)}>
                   <Download size={16} /> Download
                 </button>
                 <button onClick={() => sharePolaroid(polaroid)}>
                   <Share2 size={16} /> Share
                 </button>
                 <button onClick={() => deleteMutation.mutate({ id: polaroid.id })}>
                   <Trash2 size={16} /> Delete
                 </button>
               </div>
             </motion.div>
           ))}
         </div>
       </div>
     );
   };
   ```

3. **Integrar en perfil de usuario**
   ```tsx
   // En client/src/pages/Profile.tsx
   <Tabs>
     <TabsList>
       <TabsTrigger value="overview">Overview</TabsTrigger>
       <TabsTrigger value="tapes">My Tapes</TabsTrigger>
       <TabsTrigger value="polaroids">My Polaroids</TabsTrigger>
     </TabsList>
     <TabsContent value="polaroids">
       <PolaroidGallery />
     </TabsContent>
   </Tabs>
   ```

**Entregable:** Sistema completo de guardado y galería

---

### **Milestone 6: Compartir en Redes Sociales** ⏱️ 1h
**Objetivo:** Permitir compartir polaroids fácilmente

**Tareas:**
1. **Implementar share helper**
   ```typescript
   const sharePolaroid = async (polaroid: Polaroid) => {
     if (navigator.share) {
       // Web Share API (móvil)
       try {
         await navigator.share({
           title: `Check out my Polaroid from TUNOVA.IO`,
           text: polaroid.caption || 'Just captured this moment!',
           url: `https://tunova.io/polaroid/${polaroid.id}`,
         });
       } catch (err) {
         console.log('Share cancelled');
       }
     } else {
       // Fallback: Copy link
       await navigator.clipboard.writeText(
         `https://tunova.io/polaroid/${polaroid.id}`
       );
       toast.success('Link copied to clipboard!');
     }
   };
   ```

2. **Crear página pública de polaroid**
   ```tsx
   // client/src/pages/PolaroidView.tsx
   const PolaroidView = () => {
     const { id } = useParams();
     const { data: polaroid } = trpc.polaroid.getById.useQuery({ id });

     if (!polaroid) return <NotFound />;

     return (
       <div className="polaroid-view">
         <img src={polaroid.imageUrl} alt={polaroid.caption} />
         <div className="polaroid-info">
           <h2>{polaroid.caption}</h2>
           <p>🎵 {polaroid.trackInfo.trackTitle}</p>
           <p>by {polaroid.trackInfo.artist}</p>
           <p>from {polaroid.trackInfo.tapeTitle}</p>
           <Link to="/">
             <Button>Create your own on TUNOVA.IO</Button>
           </Link>
         </div>
       </div>
     );
   };
   ```

3. **Meta tags para redes sociales**
   ```tsx
   <Helmet>
     <meta property="og:title" content={polaroid.caption} />
     <meta property="og:image" content={polaroid.imageUrl} />
     <meta property="og:description" content={`Polaroid from TUNOVA.IO - ${polaroid.trackInfo.trackTitle}`} />
     <meta name="twitter:card" content="summary_large_image" />
   </Helmet>
   ```

**Entregable:** Sistema de compartir completo con preview social

---

## 🎨 Diseño de UI/UX

### **Flujo de Usuario**

```
1. Usuario escucha música en TUNOVA
   ↓
2. Hace clic en botón de cámara 📸
   ↓
3. Flash + Sonido de clic
   ↓
4. Modal se abre con preview de captura
   ↓
5. Usuario selecciona filtro (preview en tiempo real)
   ↓
6. Usuario agrega caption y stickers
   ↓
7. Usuario hace clic en "Save Polaroid"
   ↓
8. Animación de revelado (2s)
   ↓
9. Polaroid guardada + Notificación (+5 Haki)
   ↓
10. Opciones: Download, Share, View Gallery
```

### **Mockup de Modal**

```
┌────────────────────────────────────────┐
│  📸 Create Polaroid        [X]         │
├────────────────────────────────────────┤
│                                        │
│  ┌──────────────────────────────────┐  │
│  │                                  │  │
│  │      [Preview de imagen]         │  │
│  │      con filtro aplicado         │  │
│  │                                  │  │
│  └──────────────────────────────────┘  │
│  ┌──────────────────────────────────┐  │
│  │  Add a caption...                │  │
│  └──────────────────────────────────┘  │
│                                        │
│  Filters:                              │
│  [None] [Sketch] [Watercolor] [Cel]   │
│  [Pixel] [Vaporwave] [Lo-Fi]           │
│                                        │
│  Stickers:                             │
│  🐰 ⚡ 🏴‍☠️ 🎵 ✨ 💫 🔥 💙             │
│                                        │
│  [Cancel]              [Save Polaroid] │
└────────────────────────────────────────┘
```

---

## 📊 Métricas de Éxito

- **Engagement:** % de usuarios que crean al menos 1 polaroid
- **Retención:** Usuarios que regresan para ver su galería
- **Viralidad:** Polaroids compartidos en redes sociales
- **Haki generado:** Total de Haki otorgado por polaroids

---

## 🚀 Plan de Rollout

### **Fase 1: Alpha (Interna)** - Semana 1
- Implementar Milestones 1-3
- Testing interno
- Ajustar filtros y UX

### **Fase 2: Beta (Waitlist)** - Semana 2
- Implementar Milestones 4-5
- Lanzar a usuarios en waitlist
- Recolectar feedback

### **Fase 3: Public Launch** - Semana 3
- Implementar Milestone 6
- Lanzar a todos los usuarios
- Marketing push

---

## 🔧 Consideraciones Técnicas

### **Optimización de Rendimiento**
- Lazy load de filtros pesados
- Worker threads para procesamiento de imagen
- Caching de previews
- Compresión de imágenes antes de upload

### **Compatibilidad**
- Fallback para navegadores sin html2canvas
- Polyfill para Web Share API
- Responsive design para móvil

### **Seguridad**
- Validar tamaño de imagen (max 5MB)
- Sanitizar captions (XSS prevention)
- Rate limiting (max 10 polaroids/día)
- Moderación de contenido inapropiado

---

## ✅ Checklist de Implementación

- [ ] Milestone 1: Captura básica
- [ ] Milestone 2: Filtros artísticos
- [ ] Milestone 3: Marco Polaroid
- [ ] Milestone 4: Animación de revelado
- [ ] Milestone 5: Galería y persistencia
- [ ] Milestone 6: Compartir en redes
- [ ] Testing completo
- [ ] Documentación de usuario
- [ ] Deploy a producción

---

**Tiempo Total Estimado:** 8-10 horas
**Complejidad:** Media-Alta
**Impacto:** Alto (Feature viral y diferenciador)

¿Listo para empezar la implementación? 📸⚡
