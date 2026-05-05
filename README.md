# UY QUE HEAVY — Experiencia Digital

Proyecto MVP de la versión online de UY QUE HEAVY.

## Tecnologías

- Next.js App Router
- TypeScript
- Tailwind CSS

## Ejecutar

1. Usar Node.js 16 o superior.
2. Instalar dependencias:

```bash
npm install
```

3. Iniciar en modo desarrollo:

```bash
npm run dev
```

4. Abrir `http://localhost:3000`

> Nota: el entorno debe usar una versión moderna de Node para respetar los requisitos de `next` y `react`.

## Estructura

- `/app/page.tsx` — landing emocional.
- `/app/editions/page.tsx` — selector de ediciones.
- `/app/experience/[edition]/page.tsx` — experiencia interactiva.
- `/components` — componentes reutilizables.
- `/data/cards.ts` — preguntas y categorización de cartas.
- `/_project_state` — documentación de continuidad, estado y tareas.

## Notas

- Family Edition utiliza preguntas reales extraídas de `Producto/Preguntas Family Edition _ JENGA.xlsx`.
- El diseño busca un estilo premium, editorial y mobile-first.
