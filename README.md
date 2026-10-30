# Sitio institucional — Fundación HOCES

Plataforma web institucional para Fundación HOCES (Padre Hurtado, Chile): sitio público +
panel administrativo, construida con Next.js, Prisma y una base de datos SQL.

> **Alcance de esta entrega (Fase 1 / MVP).** Este proyecto implementa el sitio público completo
> con contenido institucional real, un panel administrativo funcional para gestionar todo ese
> contenido, biblioteca de imágenes, memorias/documentos en PDF, formulario de contacto real y
> autenticación segura. **Las pasarelas de pago (Transbank y Mercado Pago) y el sistema de
> reserva de horas con abono están modelados en la base de datos pero no activos**: la fundación
> no cuenta todavía con credenciales comerciales para ninguna de las dos. Ver la sección
> "Pendientes" más abajo.

## 1. Arquitectura

- **Framework**: Next.js 16 (App Router), TypeScript, React 19.
- **Estilos**: Tailwind CSS v4, con la paleta cromática oficial de la fundación como variables
  CSS (`src/app/globals.css`) y tipografías Nunito Sans (títulos) y Manrope (texto).
- **Base de datos**: Prisma ORM. En desarrollo usa **SQLite** (archivo local, cero
  configuración). En producción se recomienda **PostgreSQL** (ver sección 4).
- **Autenticación**: implementación propia (no se usó un proveedor externo) con sesiones
  server-side almacenadas en base de datos, contraseñas con `bcrypt`, cookies `httpOnly` +
  `SameSite=lax`, límite de intentos de inicio de sesión y registro de actividad administrativa.
- **Backend**: Server Actions de Next.js (no hay una API REST separada) con validación de
  entradas mediante `zod` en cada acción.
- **Archivos**: imágenes y PDFs se guardan en el sistema de archivos local
  (`public/uploads/...`), con validación de tipo real (no solo por extensión), límites de
  tamaño y nombres de archivo aleatorios. El módulo `src/lib/storage.ts` concentra esta lógica
  para facilitar un cambio futuro a almacenamiento S3-compatible.

### Estructura de carpetas relevante

```
prisma/schema.prisma        Modelo de datos completo
prisma/seed.ts               Contenido institucional real (ver sección 3)
scripts/create-admin.ts      Aprovisionamiento seguro del primer usuario administrador
src/app/(site)/...           Sitio público
src/app/admin/login          Login del panel (fuera del grupo protegido)
src/app/admin/(protected)/.. Panel administrativo (requiere sesión)
src/lib/actions/...           Server Actions (una por entidad)
src/lib/auth.ts               Sesiones, hashing, rate limiting de login
src/lib/storage.ts             Subida y validación de archivos
src/components/site/...       Componentes del sitio público
src/components/admin/...      Componentes del panel
```

## 2. Decisiones técnicas relevantes

- **Sin enums nativos de SQL**: SQLite (usado en desarrollo) no soporta `enum` en Prisma, por lo
  que campos como el estado de publicación se modelan como `String` y se validan con `zod` en la
  capa de aplicación (ver comentario al inicio de `prisma/schema.prisma`).
- **Contenido enriquecido sin HTML arbitrario**: los campos de texto largo (historia, misión,
  descripciones, cuerpo de noticias) se escriben como texto plano en el panel (línea en blanco =
  nuevo párrafo, líneas que empiezan con `- ` = lista) y se convierten a HTML de forma segura en
  `src/lib/utils.ts#richTextToHtml`. Esto evita cualquier riesgo de XSS por HTML arbitrario sin
  necesidad de un editor WYSIWYG pesado. Si más adelante se requiere un editor visual completo,
  se puede incorporar Tiptap u otro editor sin cambiar el modelo de datos.
- **Imágenes identificables de personas reales**: no se generaron fotografías falsas de
  profesionales. Donde la fundación entregó un nombre real sin fotografía (ej. Tiare Pino,
  Giovana Cordero), el campo de foto queda vacío hasta que la fundación suba la imagen real.
- **Sin cifras de impacto inventadas**: el bloque "Impacto" de la portada existe en el modelo de
  datos pero se seedeó **oculto** (`visible: false`) porque la fundación no entregó cifras
  verificadas. Se activa desde el panel (`/admin/inicio`) cuando se cuente con números reales.
- **Sin testimonios ni noticias de relleno**: ambas secciones se entregan vacías con un estado
  vacío explicativo, en vez de contenido inventado.

## 3. Contenido institucional real

El seed (`prisma/seed.ts`) carga el contenido institucional **real**, extraído directamente de
la encuesta "Levantamiento de Información Web — Fundación HOCES" entregada por la fundación:
historia, misión, visión, valores, los 9 servicios/programas, FAQ basadas en respuestas reales,
datos de contacto, RUT, representante legal, etc. Todo es editable desde el panel sin tocar
código.

## 4. Requisitos del entorno

- Node.js 20+ y npm.
- Para producción: una base de datos PostgreSQL accesible (puede ser gestionada: Supabase,
  Neon, Railway, RDS, etc.) y un servidor Node.js (VPS con Docker, o Vercel).

## 5. Instalación y desarrollo local

```bash
npm install
cp .env.example .env
# Edita .env: define AUTH_SECRET (openssl rand -hex 32) y ADMIN_EMAIL/ADMIN_PASSWORD

npx prisma migrate dev --name init
npx prisma db seed

npx tsx scripts/create-admin.ts   # crea el primer usuario administrador

npm run dev
```

El sitio público queda en `http://localhost:3000` y el panel en `http://localhost:3000/admin`.

## 6. Compilación para producción

```bash
npm run build
npm run start
```

### Cambiar a PostgreSQL en producción

1. En `prisma/schema.prisma`, cambia `provider = "sqlite"` por `provider = "postgresql"`.
2. Define `DATABASE_URL` apuntando a tu base PostgreSQL en el `.env` de producción.
3. Ejecuta `npx prisma migrate deploy`.
4. Ejecuta `npx prisma db seed` solo si la base está vacía (no lo ejecutes sobre datos reales ya
   cargados, podría duplicar contenido si no existen las mismas claves únicas).

### Almacenamiento de archivos en producción

Por defecto los archivos se guardan en `public/uploads/` del propio servidor. Si el despliegue es
serverless (ej. Vercel) o con múltiples instancias, **este directorio no es persistente ni
compartido entre instancias**: debes migrar `src/lib/storage.ts` para subir a un almacenamiento
S3-compatible (AWS S3, Cloudflare R2, Backblaze B2) antes de ese tipo de despliegue. Para un VPS
con un solo proceso persistente, el almacenamiento local funciona sin cambios.

## 7. Variables de entorno

Ver `.env.example` para la lista completa y comentada. Nunca subas `.env` con valores reales al
repositorio.

## 8. Correo electrónico (formulario de contacto)

El formulario de contacto **guarda cada mensaje en la base de datos** y es visible de inmediato
en `/admin/mensajes`. El envío de una notificación por correo electrónico al recibir un mensaje
**no está activado**: requiere configurar un proveedor SMTP (variables `SMTP_*` comentadas en
`.env.example`) y conectar un cliente de correo (ej. `nodemailer`) en
`src/lib/actions/contact-actions.ts`. Mientras tanto, el equipo de la fundación debe revisar la
bandeja de `/admin/mensajes` periódicamente.

## 9. Pasarelas de pago (Transbank y Mercado Pago) — Fase 2

**Estado actual: no activas.** Según la información entregada por la fundación, hoy no existen
credenciales comerciales para Transbank ni para Mercado Pago; las donaciones se coordinan
manualmente (WhatsApp + transferencia bancaria), que es exactamente lo que implementa la página
pública `/donaciones`.

El modelo de datos ya contempla esta fase futura (tablas `Donation` y `BookingRequest` en
`prisma/schema.prisma`, panel de estado en `/admin/donaciones`). Para activarlas:

1. **Transbank (Webpay Plus)**: crear cuenta de comercio, obtener código de comercio y API key,
   implementar la integración siguiendo el SDK oficial de Transbank para Node.js, usando las
   variables `TRANSBANK_*` de `.env.example`.
2. **Mercado Pago**: crear cuenta y obtener `Access Token` / `Public Key`, implementar la
   creación de preferencias y la verificación de notificaciones (webhooks) con el SDK oficial,
   usando las variables `MERCADOPAGO_*`.
3. En ambos casos: nunca confiar en el estado reportado por el navegador; verificar el estado
   real contra la API del proveedor antes de marcar una donación como `APPROVED`.
4. Activar `donationOnlineEnabled` en `/admin/configuracion` solo cuando la integración esté
   probada en el entorno de pruebas (sandbox) de cada proveedor.
5. El sistema de **reserva de horas con abono de $10.000** mencionado por la fundación puede
   construirse sobre el modelo `BookingRequest` ya existente, reutilizando la pasarela que se
   active primero.

## 10. Seguridad implementada

- Contraseñas con `bcrypt` (costo 12), nunca en texto plano.
- Sesiones server-side con token aleatorio de 32 bytes, hash almacenado (nunca el token plano),
  expiración de 12 horas.
- Límite de intentos de inicio de sesión (5 intentos / 15 minutos de bloqueo por combinación
  correo + IP, con IP siempre almacenada como hash, nunca en texto plano).
- Middleware que protege todas las rutas `/admin/*` (excepto `/admin/login`), con verificación
  completa (incluida expiración y usuario activo) en el layout del panel.
- Validación de entradas con `zod` en cada Server Action.
- Subida de archivos: validación de tipo por contenido real del archivo (no solo por extensión),
  límites de tamaño, nombres de archivo aleatorios.
- Registro de actividad administrativa (`AdminActivityLog`) para acciones de creación,
  edición, eliminación e inicio/cierre de sesión.
- Cabeceras de seguridad HTTP (`next.config.ts`): `X-Frame-Options`, `X-Content-Type-Options`,
  `Referrer-Policy`, `Permissions-Policy` y una `Content-Security-Policy`. El panel administrativo
  se marca `noindex, nofollow`.
- Honeypot + límite de solicitudes por IP en el formulario de contacto público.
- Ningún secreto ni credencial está incluido en el repositorio; todo vive en variables de
  entorno (`.env`, nunca versionado).

### Pendiente de revisión por la fundación / un profesional

- Validación legal de los borradores de Política de Privacidad y Términos de Uso
  (`/privacidad`, `/terminos`), claramente marcados como borrador en el propio sitio.
- Confirmación de la autorización de uso de imagen/testimonios antes de publicar cualquier
  testimonio (el panel ya bloquea la publicación sin marcar la autorización, pero la validación
  de que esa autorización existe realmente es un proceso humano, no técnico).
- Content-Security-Policy usa `'unsafe-inline'` para scripts, una simplificación razonable para
  esta primera entrega; un endurecimiento futuro recomendado es migrar a CSP basada en nonces.

## 11. Accesibilidad y SEO

- HTML semántico, enlace "saltar al contenido", foco visible en todos los elementos
  interactivos, soporte de `prefers-reduced-motion`.
- Todas las imágenes gestionadas desde el panel exigen texto alternativo.
- Metadatos por página, `sitemap.xml` y `robots.txt` generados dinámicamente a partir del
  contenido publicado, Open Graph básico vía metadata de Next.js.
- Diseño mobile-first, probado en los anchos de iPhone/Android/tablet/escritorio durante el
  desarrollo (ver sección de pruebas).

## 12. Pruebas realizadas

- Verificación manual de los flujos principales en navegador: navegación pública, formulario de
  contacto (guardado real en base de datos), inicio/cierre de sesión del panel, creación y
  edición de cada tipo de contenido, subida de imágenes y documentos PDF, publicación/
  despublicación.
- `npm run build` ejecutado sin errores de compilación/tipos.
- **No se pudieron ejecutar pruebas de pago** (Transbank/Mercado Pago) porque, como se explica en
  la sección 9, esas integraciones no están implementadas a la espera de credenciales
  comerciales reales. Tampoco se ejecutaron pruebas automatizadas (unitarias/E2E): no se
  incluyó un framework de testing en esta primera entrega; `npm run lint` sí está disponible.

## 13. Pendientes a cargo de la fundación

- Credenciales comerciales de Transbank y Mercado Pago (si se decide activar el pago en línea).
- Número de cuenta corriente u otro medio de pago a publicar en `/admin/configuracion` (campo
  "Datos bancarios para donar"), hoy vacío a propósito.
- Fotografías reales del equipo, instalaciones y actividades (hoy no se usó ninguna imagen de
  stock para evitar transmitir una identidad visual falsa; las secciones muestran un estado
  vacío hasta que se suban).
- Nombres de las profesionales de Fonoaudiología, Terapia Ocupacional, Trabajadora Social y
  Educación Diferencial (hoy existen como "Profesional por confirmar" en borrador).
- Testimonios reales de familias, cada uno con autorización confirmada antes de publicarse.
- Revisión legal de los borradores de política de privacidad y términos de uso.
- Dominio propio y configuración de `NEXT_PUBLIC_SITE_URL` en producción.
- Proveedor de correo SMTP si se desea notificación automática de nuevos mensajes de contacto.

---

Generado como parte del desarrollo inicial del sitio. Para dudas técnicas futuras, este README y
los comentarios en `prisma/schema.prisma` y `src/lib/` documentan las decisiones principales.
