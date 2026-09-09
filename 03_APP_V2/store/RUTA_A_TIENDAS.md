# Ruta a tiendas — Uy Qué Heavy v2.0.0

Este archivo es la ÚNICA lista de pasos para publicar. Claude la lleva y la actualiza.
Leyenda: ✅ hecho · 🔄 en curso · ⬜ pendiente · 👤 lo hace Felipe · 🤖 lo hace Claude

Última actualización: 2026-09-09 (cuenta de organización Viko Holdings · D-U-N-S obtenido)

---

## Bloque A — Cuentas y accesos

| # | Paso | Quién | Estado |
|---|------|-------|--------|
| A1 | Cuenta Expo + `eas login` (usuario filippobarajas) | 👤 | ✅ |
| A2 | Apple Developer Program activo | 👤 | ✅ (según Felipe) |
| A3 | Google Play Console: crear cuenta y pagar USD 25 | 👤 | 🔄 en curso — cuenta de ORGANIZACIÓN a nombre de VIKO HOLDINGS, LLC |
| A6 | D-U-N-S de Viko Holdings: **134806247** — confirmado por Google | 👤 | ✅ |
| A4 | Web desplegada en https://uyqueheavy.vercel.app (privacidad y soporte) | 🤖 | ✅ |
| A5 | Teléfono real de contacto en `store.config.json` (+57 318 973 1434) | 🤖 | ✅ |

---

## Bloque B — Google Play Console, paso a paso

**Decisión tomada (09-sep-2026): cuenta de ORGANIZACIÓN a nombre de VIKO HOLDINGS, LLC.**

Motivo: las cuentas personales creadas después del 13-nov-2023 deben pasar una prueba cerrada con
12 testers durante 14 días seguidos antes de publicar en producción. Las cuentas de organización con
D-U-N-S están exentas. Viko ya tenía D-U-N-S (**134806247**), así que no hubo que esperar los 30 días
de emisión y nos ahorramos ~3 semanas de calendario.

Datos de la empresa, documentos de respaldo y la guía detallada de cada pantalla están en:
`2. VIKO HOLDINGS LLC/2. Desarrollos Propios/UY QUE HEAVY/`

| # | Paso | Quién | Estado |
|---|------|-------|--------|
| B1 | Entrar a https://play.google.com/console/signup con la cuenta Google que será dueña de la app | 👤 | ✅ |
| B2 | Tipo de cuenta: **Organización** · nombre de desarrollador público: `Uy Qué Heavy` · perfil de pagos con D-U-N-S `134806247` | 👤 | ✅ |
| B3 | Pagar USD 25 (una sola vez) con tarjeta | 👤 | ✅ |
| B4 | Verificación de **empresa**: documentos que coincidan con D&B → `Articles of Organization` + carta IRS `147C` (ambos en `3. Legal/`). Más OTP a correo y celular | 👤 | ⬜ |
| B5 | Cuando la cuenta esté verificada: botón **Crear app**. Nombre: `Uy Qué Heavy` · Idioma predeterminado: `Español (Latinoamérica)` · Tipo: `App` · Gratis · aceptar declaraciones | 👤 | ⬜ |
| B6 | En el panel "Configura tu app" completar cada declaración con estas respuestas: | 👤 | ⬜ |
|    | · Política de privacidad: `https://uyqueheavy.vercel.app/privacidad.html` | | |
|    | · Acceso a la app: "Todas las funciones están disponibles sin restricciones" | | |
|    | · Anuncios: No contiene anuncios | | |
|    | · Clasificación de contenido: cuestionario IARC, categoría "Entretenimiento"; en preguntas de contenido sexual responder que hay referencias/temas de intimidad (texto), sin desnudos. Da 16+ o 18+ | | |
|    | · Público objetivo: 18 años o más. No dirigida a niños | | |
|    | · App de noticias: No · App de salud: No · App financiera: No · App gubernamental: No | | |
|    | · Seguridad de datos: "No recopila ni comparte datos del usuario" (la app no tiene cuentas ni analítica) | | |
| B7 | Ficha de Play Store (Store listing). Pegar desde `store/APP_STORE_FICHA.md`: nombre, descripción corta (80), descripción completa. Categoría: Entretenimiento. Correo: contacto@diegobarajas.com | 👤 | ⬜ |
| B8 | Recursos gráficos: **listos** en `2. Desarrollos Propios/UY QUE HEAVY/assets_play/` (ícono 512, gráfico 1024×500 y las 5 capturas) | 🤖 ✅ prepara · 👤 ⬜ sube | 🔄 |
| B9 | Generar el AAB de producción: `eas build -p android --profile production` | 👤 | ✅ versionCode 2, 2026-09-09: https://expo.dev/artifacts/eas/32F_D8_f_QVo31z91SfYsa0y4L-9hYZlTqLR9YleAvs.aab |
| B10 | Primera subida SIEMPRE manual: Play Console → Pruebas → Prueba interna → Crear versión → subir el `.aab` descargado de EAS. Google lo exige para activar la firma de Play | 👤 | ⬜ |
| B11 | ~~Prueba cerrada de 12 testers × 14 días~~ — **NO APLICA** por ser cuenta de organización | — | ✅ evitado |
| B12 | Pasar directo a Producción | 👤 | ⬜ |
| B13 | Revisión de Google: normalmente de 1 a 7 días | — | ⬜ |
| B14 | (Opcional, para después) Cuenta de servicio de Google Cloud para que `eas submit -p android` suba solo | 🤖 | ⬜ |

---

## Bloque C — App Store Connect (Apple)

| # | Paso | Quién | Estado |
|---|------|-------|--------|
| C1 | Entrar a https://appstoreconnect.apple.com (Apple ID appsdb123@gmail.com, equipo Viko Holdings LLC) | 👤 | ✅ |
| C2 | App creada en App Store Connect: `Uy Qué Heavy`, vendedor Viko Holdings, SKU uqh-app-v2, ASC App ID 6810321248 | 👤 | ✅ |
| C3 | Build iOS de producción: `eas build -p ios --profile production` | 👤 | ✅ build 4 (2026-09-09) con ícono UQH. El build 3 tiene ícono de plantilla, no usarlo |
| C4 | Subir el build: `eas submit -p ios --latest`. API key de App Store Connect creada (rol APP_MANAGER, guardada en EAS) | 👤 | ✅ build 3 subido · ⬜ **falta subir build 4** |
| C5 | Ficha en App Store Connect, campo por campo → ver "Guía C5" abajo | 👤 | ⬜ |
| C6 | Privacidad de la app: "No se recopilan datos" → incluido en Guía C5, pantalla 4 | 👤 | ⬜ |
| C7 | TestFlight: probar en tu iPhone antes de enviar a revisión. Invitación recibida 2026-09-09 13:52 (build 3, ícono de plantilla; el build 4 llegará solo a TestFlight) | 👤 | 🔄 |
| C8 | Enviar a revisión. Apple tarda de 1 a 3 días | 👤 | ⬜ |

---

## Bloque D — Probar en celulares antes de todo (recomendado hacerlo primero)

| # | Paso | Quién | Estado |
|---|------|-------|--------|
| D1 | `eas build -p android --profile preview` → APK instalable directo en cualquier Android | 👤 | ✅ APK actual (2026-09-09): https://expo.dev/artifacts/eas/3pIkr__5oNo-bMnZdRXj-Zr4AN4tHfcKWNEnipdW9YY.apk |
| D2 | `eas build -p ios --profile preview` → requiere registrar el UDID de tu iPhone (EAS te guía con un link) | 👤 ejecuta | ⬜ |
| D3 | Instalar en 2-3 celulares y jugar una ronda completa de cada edición | 👤 + Erika | ⬜ |

---

## Bloque E — Lo que sigue esperando a Erika (no bloquea)

- Hojas definitivas del Excel, columna F de Friends, filtro J/F de Family
- Copies / jaculatorias definitivas
- Colores Family y Storytime
- Ícono definitivo 1024×1024 (mientras tanto: monograma UQH generado por `scripts/make_brand_assets.py`) — ⚠️ **el `assets/icon.png` actual sigue siendo el placeholder de Expo (la 'A' azul)**. Hay un provisional de marca en `assets_play/icono_1024_para_la_app.png` listo para reemplazarlo.

Cuando lleguen, se actualizan datos y se publica una versión 2.0.1.

---

## Guía C5 — Ficha de App Store Connect, campo por campo

Entrar a https://appstoreconnect.apple.com/apps/6810321248 . Todo lo que hay que pegar está en `store/APP_STORE_FICHA.md`.

**Pantalla 1: pestaña "App Store" → versión "2.0.0 Preparar para enviar" (menú izquierdo)**

| Campo | Qué poner |
|---|---|
| Vista previa y capturas de pantalla, iPhone 6.7" | Arrastrar las 5 imágenes de `store/screenshots/ios-6.7/` en orden 01 a 05 |
| Texto promocional | (dejar vacío) |
| Descripción | Pegar la "Descripción" completa de la ficha |
| Palabras clave | `conversacion,preguntas,cartas,juego,pareja,amigos,familia,parejas,charla,reunion,fiesta,heavy` |
| URL de soporte | `https://uyqueheavy.vercel.app/soporte.html` |
| URL de marketing | `https://uyqueheavy.com` (o vacío si el dominio aún no carga) |
| Compilación | Botón "+" o "Añadir compilación" → elegir **2.0.0 (3)**. Solo aparece cuando Apple terminó de procesar |
| Cifrado | Si pregunta, "No" (ya viene declarado en el build) |
| Copyright | `2026 Viko Holdings LLC` |
| Información de contacto para la revisión | Nombre Diego Felipe · Apellido Barajas · Teléfono +57 318 973 1434 · Correo contacto@diegobarajas.com |
| Inicio de sesión requerido | Desmarcar (no hay cuenta) |
| Notas para la revisión | Pegar "Notas para el revisor" de la ficha |
| Lanzamiento de la versión | "Lanzar esta versión manualmente" (así decidimos el día) |

**Pantalla 2: menú izquierdo → "Información de la app"**

| Campo | Qué poner |
|---|---|
| Nombre | `Uy Qué Heavy` |
| Subtítulo | `Cartas para conversar de verdad` |
| Categoría principal | Entretenimiento |
| Categoría secundaria | Estilo de vida |
| Clasificación de contenido | Botón "Editar" → cuestionario: Contenido sexual o desnudez = **Frecuente/Intenso**; Temas para adultos o sugerentes = **Poco frecuente/Moderado**; Lenguaje soez o humor grosero = **Poco frecuente/Moderado**; todo lo demás = Ninguno. Debe dar **17+** |
| Derechos de contenido | "No contiene, muestra ni accede a contenido de terceros" |

**Pantalla 3: menú izquierdo → "Precios y disponibilidad"**

| Campo | Qué poner |
|---|---|
| Precio | Gratis (USD 0) |
| Disponibilidad | Todos los países |

**Pantalla 4: menú izquierdo → "Privacidad de la app"**

| Campo | Qué poner |
|---|---|
| URL de política de privacidad | `https://uyqueheavy.vercel.app/privacidad.html` |
| Prácticas de datos | Botón "Comenzar" → "No, no recopilamos datos de esta app" → Publicar |

**Pantalla 5: volver a la versión 2.0.0 → botón "Guardar" y luego "Añadir para revisión" / "Enviar para revisión"** (paso C8). Antes de eso, probar en TestFlight (C7).
