# Cómo arrancar la app — Uy Qué Heavy v2.0

## Opción recomendada (rápida): sacar la app de iCloud
iCloud sincroniza `node_modules` y vuelve todo lento. Una sola vez, en Terminal:

```bash
mkdir -p ~/Developer
cp -R "~/Library/Mobile Documents/com~apple~CloudDocs/Documents/TEMPORALES/UY QUE HEAVY/03_APP_V2" ~/Developer/uqh-app
cd ~/Developer/uqh-app
npm install
npm run web
```

Abre VS Code en `~/Developer/uqh-app` y sigue con Claude Code desde ahí.

## Opción directa (en iCloud, más lenta)
```bash
cd "~/Library/Mobile Documents/com~apple~CloudDocs/Documents/TEMPORALES/UY QUE HEAVY/03_APP_V2"
npm install     # puede tardar varios minutos por iCloud
npm run web
```

## Ver la app
- **Web:** `npm run web` → abre en el navegador.
- **En tu teléfono (sin compilar):** `npx expo start` → escanea el QR con la app **Expo Go**.
- **iOS/Android nativo:** `npm run ios` / `npm run android` (requiere Xcode / Android Studio).

## Qué ya funciona (MVP Fase 0)
Splash → Home con las 5 ediciones → pantalla de edición → barajado → pregunta → "Otra pregunta" (sin repetir en el día) → Instrucciones.

## Dónde editar contenido
**Preguntas:** editar el Excel en `../01_RECURSOS_ERIKA/bancos_preguntas/` y correr `python3 scripts/import_questions.py` (regenera `src/data/editions.ts`).
**Copies y jaculatorias:** bloque `META` en `scripts/import_questions.py`, luego correr el script.

Ver `CLAUDE.md` para la arquitectura completa y el roadmap por fases.
