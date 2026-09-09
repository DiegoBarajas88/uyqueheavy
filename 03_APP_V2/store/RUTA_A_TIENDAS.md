# Ruta a tiendas — Uy Qué Heavy v2.0.0

Este archivo es la ÚNICA lista de pasos para publicar. Claude la lleva y la actualiza.
Leyenda: ✅ hecho · 🔄 en curso · ⬜ pendiente · 👤 lo hace Felipe · 🤖 lo hace Claude

Última actualización: 2026-09-09 (teléfono puesto)

---

## Bloque A — Cuentas y accesos

| # | Paso | Quién | Estado |
|---|------|-------|--------|
| A1 | Cuenta Expo + `eas login` (usuario filippobarajas) | 👤 | ✅ |
| A2 | Apple Developer Program activo | 👤 | ✅ (según Felipe) |
| A3 | Google Play Console: crear cuenta y pagar USD 25 | 👤 | ⬜ → ver Bloque B |
| A4 | Web desplegada en https://uyqueheavy.vercel.app (privacidad y soporte) | 🤖 | ✅ |
| A5 | Teléfono real de contacto en `store.config.json` (+57 318 973 1434) | 🤖 | ✅ |

---

## Bloque B — Google Play Console, paso a paso

**Antes de empezar, decide el tipo de cuenta.** Es la decisión más importante:

- **Personal**: rápida de crear, pero Google obliga a las cuentas personales nuevas a hacer una
  *prueba cerrada con mínimo 12 testers durante 14 días seguidos* antes de dejarte publicar en producción.
  Eso suma unas 2-3 semanas al calendario.
- **Organización**: necesita un número D-U-N-S de la empresa (gratis, tarda hasta 30 días en emitirse
  si no lo tienes) y verificación de la empresa. NO tiene el requisito de los 12 testers.

Recomendación: si ya tienes empresa registrada con D-U-N-S, organización. Si no, personal y arrancamos la
prueba cerrada de inmediato con amigos y familia (Erika, tú y 10 más).

| # | Paso | Quién | Estado |
|---|------|-------|--------|
| B1 | Entrar a https://play.google.com/console/signup con la cuenta Google que será dueña de la app (mejor una del proyecto, no personal si es posible) | 👤 | ⬜ |
| B2 | Elegir tipo de cuenta (personal u organización) y llenar nombre de desarrollador: "Uy Qué Heavy" | 👤 | ⬜ |
| B3 | Pagar USD 25 (una sola vez) con tarjeta | 👤 | ⬜ |
| B4 | Verificación de identidad: subir documento de identidad, confirmar teléfono y correo. Google tarda de horas a varios días | 👤 | ⬜ |
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
| B8 | Recursos gráficos de la ficha: ícono 512×512 PNG · gráfico de funciones 1024×500 · mínimo 2 capturas de teléfono (usar las 5 de `store/screenshots/ios-6.7/`) | 🤖 prepara archivos · 👤 sube | ⬜ |
| B9 | Generar el AAB de producción: `eas build -p android --profile production`. EAS crea y guarda la llave de firma | 🤖 dirige · 👤 ejecuta | ⬜ |
| B10 | Primera subida SIEMPRE manual: Play Console → Pruebas → Prueba interna → Crear versión → subir el `.aab` descargado de EAS. Google lo exige para activar la firma de Play | 👤 | ⬜ |
| B11 | Si la cuenta es personal: crear Prueba cerrada, agregar lista de 12+ correos de testers, publicar y esperar 14 días con los 12 instalados | 👤 | ⬜ |
| B12 | Solicitar acceso a producción (cuenta personal) o pasar directo a Producción (organización) | 👤 | ⬜ |
| B13 | Revisión de Google: normalmente de 1 a 7 días | — | ⬜ |
| B14 | (Opcional, para después) Cuenta de servicio de Google Cloud para que `eas submit -p android` suba solo | 🤖 | ⬜ |

---

## Bloque C — App Store Connect (Apple)

| # | Paso | Quién | Estado |
|---|------|-------|--------|
| C1 | Entrar a https://appstoreconnect.apple.com con el Apple ID del Developer Program | 👤 | ⬜ |
| C2 | Apps → **+** → Nueva app. Plataforma iOS · Nombre `Uy Qué Heavy` · Idioma principal Español (México) · Bundle ID `com.uyqueheavy.app` (si no aparece, EAS lo registra en el paso C3) · SKU `uqh-app-v2` | 👤 | ⬜ |
| C3 | Build iOS de producción: `eas build -p ios --profile production`. EAS pide entrar con el Apple ID y crea certificados solo | 🤖 dirige · 👤 ejecuta | ⬜ |
| C4 | Subir el build: `eas submit -p ios --latest` (pide Apple ID y contraseña específica de app de https://appleid.apple.com) | 🤖 dirige · 👤 ejecuta | ⬜ |
| C5 | En App Store Connect: pegar ficha desde `store/APP_STORE_FICHA.md`, subir capturas 6.7", clasificación 17+, URLs de privacidad y soporte, info de contacto para revisión (aquí va el teléfono de A5) | 👤 | ⬜ |
| C6 | Privacidad de la app: "No se recopilan datos" | 👤 | ⬜ |
| C7 | TestFlight: probar en tu iPhone antes de enviar a revisión | 👤 | ⬜ |
| C8 | Enviar a revisión. Apple tarda de 1 a 3 días | 👤 | ⬜ |

---

## Bloque D — Probar en celulares antes de todo (recomendado hacerlo primero)

| # | Paso | Quién | Estado |
|---|------|-------|--------|
| D1 | `eas build -p android --profile preview` → APK instalable directo en cualquier Android | 👤 ejecuta | ⬜ |
| D2 | `eas build -p ios --profile preview` → requiere registrar el UDID de tu iPhone (EAS te guía con un link) | 👤 ejecuta | ⬜ |
| D3 | Instalar en 2-3 celulares y jugar una ronda completa de cada edición | 👤 + Erika | ⬜ |

---

## Bloque E — Lo que sigue esperando a Erika (no bloquea)

- Hojas definitivas del Excel, columna F de Friends, filtro J/F de Family
- Copies / jaculatorias definitivas
- Colores Family y Storytime
- Ícono definitivo 1024×1024

Cuando lleguen, se actualizan datos y se publica una versión 2.0.1.
