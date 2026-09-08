# UY QUÉ HEAVY — Proyecto App v2.0

Estructura de la carpeta:

| Carpeta / archivo | Qué es |
|---|---|
| **03_APP_V2/** | 🟢 La app nueva (Expo · web + iOS + Android). Ábrela en VS Code. Ver `03_APP_V2/ARRANQUE.md`. |
| **01_RECURSOS_ERIKA/** | Todo lo que envió Erika: `BRIEF_UQH_Erika.pdf`, `mockups/`, `fuentes/`, `bancos_preguntas/`. |
| **ANTIGUO ARCHIVO/** | MVP viejo (Next.js). Solo referencia de contenido; NO es la base de la v2. |
| **UQH-APP-V2.zip** | Respaldo del código fuente de la app (puedes borrarlo). |

## Cómo arrancar la app
```bash
cd 03_APP_V2
npm install
npm run web
```
Recomendado sacarla de iCloud para que sea rápida — ver `03_APP_V2/ARRANQUE.md`.

## Roadmap por fases
- **Fase 0 (✅):** Loop central §19 — splash, home, edición, barajado, pregunta, anti-repetición, instrucciones.
- **Fase 1 (en curso, 2026-09-08):** ✅ preguntas reales desde Excel (`03_APP_V2/scripts/import_questions.py`) · ✅ config deploy web (Vercel) y tiendas (EAS) · ⏳ copies/jaculatorias/colores definitivos (pedidos a Erika por correo).
- **Fase 2:** Compartir en Instagram (Story 9:16).
- **Fase 3:** Freemium + Premium (RevenueCat).
- **Fase 4:** Notificaciones "Una pregunta para ti".
- **Fase 5:** Modo Fiesta + multijugador remoto + publicación en tiendas.

Contexto completo para Claude Code en `03_APP_V2/CLAUDE.md`. Documento de dirección (stack y fases): artifact compartible generado por el director del proyecto.

## Sacarla a las tiendas (App Store / Google Play)
Lo que hay que tener antes (lo hace Felipe una sola vez):
1. Cuenta en https://expo.dev (gratis) y `npm i -g eas-cli && eas login`.
2. Apple Developer Program (USD 99/año) — https://developer.apple.com/programs/
3. Google Play Console (USD 25 una vez) — https://play.google.com/console
4. Política de privacidad publicada en una URL (obligatoria en ambas tiendas).

Luego, desde `03_APP_V2/`:
```bash
eas build -p all --profile preview      # APK + build iOS interno para probar en celulares
eas build -p all --profile production   # builds para tiendas
eas submit -p ios && eas submit -p android
```
