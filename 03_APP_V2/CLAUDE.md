# Uy Qué Heavy — App v2.0 · Contexto para Claude Code

App móvil de juego de cartas para conversaciones profundas. Construida con **Expo (React Native + Web)**: un solo código corre en iOS, Android y Web. Director del proyecto: Felipe (Diego Felipe Barajas). Dirección de producto: Erika Nieto (brief en `../01_RECURSOS_ERIKA/BRIEF_UQH_Erika.pdf`).

## Estado actual: Fase 1 en curso (preguntas reales cargadas, 2026-09-08)
Fase 0 completa: Splash → Home (5 ediciones) → Pantalla de edición (copy + Jaculatoria + Jugar) → Animación de baraja (~3.8s) → Pregunta → "Otra pregunta" con anti-repetición diario → Instrucciones (3 modos). Verificado en web y en iPhone vía Expo Go.

Fase 1: `src/data/editions.ts` ahora se GENERA con `python3 scripts/import_questions.py` desde los Excel de Erika (Friends 79, Love 52, Forever 44, Family 45, Storytime 37). Reglas y decisiones pendientes de confirmar con Erika están documentadas en la cabecera del script. Correo con todos los pendientes enviado a Erika el 2026-09-08 (copies, jaculatorias, colores Family/Storytime, hojas definitivas, datos para tiendas).

## Cómo correr
```bash
npm install
npm run web       # navegador (PWA)
npm run ios       # simulador iOS (requiere Xcode)
npm run android   # emulador Android
npx expo start    # menú con QR para Expo Go en tu teléfono
```

## Arquitectura
- `app/` — rutas (expo-router, file-based):
  - `_layout.tsx` — Stack raíz, carga las 3 fuentes de marca, SafeArea.
  - `index.tsx` — Splash (§3).
  - `home.tsx` — Home con las 5 ediciones (§4).
  - `instrucciones.tsx` — ¿Cómo jugar? + 3 modos (§5).
  - `edition/[id].tsx` — Pantalla de edición (§6).
  - `play/[id].tsx` — Flujo Jugar: barajado → pregunta → otra pregunta (§7–12).
- `src/data/editions.ts` — **ÚNICA FUENTE DE VERDAD DEL CONTENIDO** (§16). **Archivo generado**: no editar a mano. Preguntas → editar el Excel en `../01_RECURSOS_ERIKA/bancos_preguntas/` y correr `python3 scripts/import_questions.py`. Copies/jaculatorias → editar `META` en ese script.
- `scripts/make_brand_assets.py` — genera ícono iOS/Android, splash nativo, favicon y gráficos de Google Play con la marca de texto (PROVISIONAL hasta el ícono de Erika). Spicy Wasabi no tiene É: la tilde se dibuja a mano.
- `scripts/import_questions.py` — importador Excel → TS (requiere `pip install openpyxl`). Regla de IDs: `<edicion>_<fila Excel>`; nunca renumerar.
- `src/theme/theme.ts` — sistema de marca: colores por edición, tipografías, layout.
- `src/lib/storage.ts` — sistema anti-repetición diario con AsyncStorage (§9–10). Aquí irá el contador Freemium (§30) en Fase 3.
- `src/components/` — BrandButton, PlayingCard (naipe con la pregunta), CardDeckDraw (animación de baraja física: desfile → desaceleración → elevación → giro 3D), SplashDecor (recursos gráficos del splash en SVG), JaculatoriaModal.
- `assets/fonts/` — SpicyWasabi (display/logo), Sieroty (script), Quicksand (body).

## Convenciones
- Mobile-first; contenido centrado con `maxWidth` para verse bien también en web ancha.
- Todo color sale de `theme.ts`; ningún hex suelto en las pantallas.
- **Sieroty (`fonts.script`) abarca 2.17em de alto.** iOS RECORTA el texto al `lineHeight` (web no). Todo texto en script debe usar `scriptLineHeight(fontSize)` de `theme.ts`, nunca un número a mano.
- La pregunta se elige ANTES de animar (`drawNextQuestion` → props de `CardDeckDraw`). La animación nunca elige carta y luego le asigna pregunta.
- IDs de pregunta estables (`friends_001`) — los usa el anti-repetición. No renumerar a la ligera.
- Los copies, jaculatorias y colores de Family/Storytime son PLACEHOLDERS marcados; reemplazar con lo definitivo de Erika.

## Deploy
- **Web (Vercel):** `vercel.json` en la raíz del repo hace `cd 03_APP_V2 && npx expo export -p web` y sirve `03_APP_V2/dist` como SPA. Cada push a `main` en GitHub redespliega.
- **Tiendas (EAS):** `eas.json` con perfiles `preview` (APK / TestFlight interno) y `production`. Pasos: `npm i -g eas-cli` → `eas login` → `eas build -p all --profile preview`. Requiere cuenta Expo + Apple Developer + Google Play Console. Ver README raíz.

## Roadmap (ver documento de dirección)
- **Fase 1** — ✅ preguntas reales desde Excel · ✅ config de deploy web y EAS · ⏳ copies/jaculatorias/colores definitivos (esperando a Erika) · ⏳ splash y barajado más pulidos.
- **Fase 2** — "Comparte tu respuesta en Instagram": imagen 9:16 (1080×1920) por edición (react-native-view-shot) + Share API (§20–21).
- **Fase 3** — Freemium: paywall a la 4ª pregunta, contador independiente por edición (§30), RevenueCat para IAP.
- **Fase 4** — Notificaciones "Una pregunta para ti" (categoría SELF/YO, expo-notifications, §32–35).
- **Fase 5** — Modo Fiesta (§40–45) y multijugador remoto con salas + código (backend realtime, §36–39). Publicación en tiendas vía EAS.

## Nota importante (rendimiento)
Este proyecto vive en iCloud Drive, que sincroniza `node_modules` (miles de archivos) y ralentiza mucho la instalación y Metro. Para desarrollo sostenido, mover o clonar la app a una ruta local fuera de iCloud (ej. `~/Developer/uqh-app`). Los recursos y el brief pueden quedarse en iCloud.
