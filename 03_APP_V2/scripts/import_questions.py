#!/usr/bin/env python3
"""
Importa los bancos de preguntas de Erika (Excel) y regenera src/data/editions.ts.

Uso (desde 03_APP_V2/):
    python3 scripts/import_questions.py            # regenera editions.ts
    python3 scripts/import_questions.py --dry-run  # solo muestra conteos

Requiere: pip install openpyxl

Reglas de importación (decisiones tomadas el 2026-09-08, pendientes de confirmar con Erika):
- Friends   → hoja "Friends Edition", columna E (texto corregido), fallback columna C. Todas las 79.
- Love      → hoja "Love Edition 2.0" (52) con categoría en columna E.
- Forever   → hoja "Forever Edition 2.0" (52) con categoría (E) y subcategoría (F).
- Family    → hoja "Hoja 1"; entra si al menos 3 de los 5 votos (J/F) contienen "F".
- Storytime → hoja "Cuenta Cuentos" (37). Se elimina el sufijo '" Insight: …'.

Los IDs son estables: <edicion>_<numero de fila en el Excel, 3 dígitos>. Los usa el
sistema anti-repetición; NO renumerar aunque se borren preguntas.
"""
import re, sys, json
from pathlib import Path
import openpyxl

ROOT = Path(__file__).resolve().parents[1]
BANCOS = ROOT.parent / "01_RECURSOS_ERIKA" / "bancos_preguntas"
OUT = ROOT / "src" / "data" / "editions.ts"

XLSX_MAIN = BANCOS / "Uy Que Heavy (PREGUNTAS) copy.xlsx"
XLSX_FAM = BANCOS / "Preguntas Family Edition  Y STORYTIME EDITION.xlsx"

# Metadatos de cada edición (copies PLACEHOLDER hasta que Erika envíe los definitivos).
META = [
    dict(id="friends", name="Friends Edition", audience="Amigos",
         tagline="Risas, recuerdos y verdades sin filtro.",
         description="Preguntas que convierten una tarde cualquiera en una historia que van a recordar.",
         jaculatoria="Que los amigos de hoy sigan siendo los cómplices de siempre."),
    dict(id="love", name="Love Edition", audience="Parejas",
         tagline="Reconectar desde la vulnerabilidad.",
         description="Conversaciones íntimas para abrirnos, agradecer y descubrir cosas nuevas del otro.",
         jaculatoria="Que sigamos eligiéndonos, incluso en los días difíciles."),
    dict(id="forever", name="Forever Edition", audience="Matrimonios",
         tagline="La historia compartida, en voz alta.",
         description="Preguntas maduras y profundas para fortalecer el vínculo y recordar por qué empezó todo.",
         jaculatoria="Que lo construido con los años tenga siempre a quién contarle una historia más."),
    dict(id="family", name="Family Edition", audience="Familias",
         tagline="Padres, hijos y hermanos juntos otra vez",
         description="Conversaciones cálidas para acercar a la familia y descubrir historias entre generaciones.",
         jaculatoria="Que la casa siga siendo el lugar donde todos quieren volver."),
    dict(id="storytime", name="Storytime Edition", audience="Cualquier grupo",
         tagline="Historias y anécdotas que hay que contar.",
         description="Preguntas narrativas para provocar historias, anécdotas y momentos que nadie esperaba.",
         jaculatoria="Que nunca falte una buena historia para compartir."),
]


def clean(text):
    if text is None:
        return ""
    t = str(text)
    t = re.sub(r'"?\s*Insight:.*$', "", t)       # Storytime: notas pegadas al texto
    t = t.replace("\n", " ").replace('"', "")
    t = re.sub(r"\s+", " ", t).strip()
    t = re.sub(r"\s+([?!.,])", r"\1", t)          # "algo ?" → "algo?"
    t = re.sub(r"\?{2,}", "?", t)
    return t


def cat_clean(text):
    t = clean(text).rstrip(":").strip()
    return t or None


def rows(ws):
    return [list(r) for r in ws.iter_rows(values_only=True)]


def numbered(rs, num_col):
    for r in rs:
        n = r[num_col] if num_col < len(r) else None
        if isinstance(n, (int, float)):
            yield int(n), r


def cell(r, i):
    return r[i] if i < len(r) else None


def load():
    main = openpyxl.load_workbook(XLSX_MAIN, read_only=True, data_only=True)
    fam = openpyxl.load_workbook(XLSX_FAM, read_only=True, data_only=True)
    out = {}

    # Friends: E corregida, C original
    qs = []
    for n, r in numbered(rows(main["Friends Edition"]), 1):
        txt = clean(cell(r, 4)) or clean(cell(r, 2))
        if txt:
            qs.append(dict(id=f"friends_{n:03d}", text=txt))
    out["friends"] = qs

    # Love 2.0
    qs = []
    for n, r in numbered(rows(main["Love Edition 2.0"]), 1):
        txt = clean(cell(r, 2))
        if txt:
            qs.append(dict(id=f"love_{n:03d}", text=txt, category=cat_clean(cell(r, 4))))
    out["love"] = qs

    # Forever 2.0
    qs = []
    for n, r in numbered(rows(main["Forever Edition 2.0"]), 1):
        txt = clean(cell(r, 2))
        if txt:
            qs.append(dict(id=f"forever_{n:03d}", text=txt,
                           category=cat_clean(cell(r, 4)), subcategory=cat_clean(cell(r, 5))))
    out["forever"] = qs

    # Family: votos en columnas J..N (índices 9..13). Entra con >=3 votos que contengan F.
    qs, skipped = [], []
    for n, r in numbered(rows(fam["Hoja 1"]), 0):
        txt = clean(cell(r, 1))
        votes = [str(cell(r, i) or "").upper() for i in range(9, 14)]
        f_votes = sum(1 for v in votes if "F" in v)
        if txt and f_votes >= 3:
            qs.append(dict(id=f"family_{n:03d}", text=txt))
        elif txt:
            skipped.append((n, f_votes, txt[:50]))
    out["family"] = qs
    out["_family_skipped"] = skipped

    # Storytime
    qs = []
    for n, r in numbered(rows(fam["Cuenta Cuentos"]), 0):
        txt = clean(cell(r, 1))
        if txt:
            qs.append(dict(id=f"storytime_{n:03d}", text=txt))
    out["storytime"] = qs
    return out


def ts_str(s):
    return "'" + s.replace("\\", "\\\\").replace("'", "\\'") + "'"


def render(data):
    L = []
    L.append("/**")
    L.append(" * ÚNICA FUENTE DE VERDAD DEL CONTENIDO — Uy Qué Heavy")
    L.append(" * (Brief §16–17: agregar/editar/eliminar preguntas SIN tocar la lógica de la app.)")
    L.append(" *")
    L.append(" * ⚠️ ARCHIVO GENERADO por scripts/import_questions.py a partir de los Excel de")
    L.append(" *    01_RECURSOS_ERIKA/bancos_preguntas. Para cambiar preguntas: editar el Excel y")
    L.append(" *    volver a correr el script. Los copies/jaculatorias se editan en META dentro del script.")
    L.append(" *")
    L.append(" * Copies y jaculatorias siguen siendo PLACEHOLDER hasta recibir los definitivos de Erika.")
    L.append(" */")
    L.append("")
    L.append("export type EditionId = 'friends' | 'love' | 'forever' | 'family' | 'storytime';")
    L.append("")
    L.append("export type Question = {")
    L.append("  id: string;          // estable — lo usa el sistema anti-repetición. Ej: \"friends_001\"")
    L.append("  text: string;")
    L.append("  category?: string;   // Love/Forever traen categoría en el Excel (uso interno por ahora)")
    L.append("  subcategory?: string;")
    L.append("};")
    L.append("")
    L.append("export type Edition = {")
    L.append("  id: EditionId;")
    L.append("  name: string;         // \"Friends Edition\"")
    L.append("  audience: string;     // público (para el subtítulo del Home)")
    L.append("  tagline: string;      // frase corta en la tarjeta del Home")
    L.append("  description: string;  // copy emocional de la pantalla de edición (PLACEHOLDER)")
    L.append("  jaculatoria: string;  // oración de la edición (PLACEHOLDER)")
    L.append("  questions: Question[];")
    L.append("};")
    L.append("")
    L.append("export const editions: Edition[] = [")
    for m in META:
        L.append("  {")
        L.append(f"    id: {ts_str(m['id'])},")
        L.append(f"    name: {ts_str(m['name'])},")
        L.append(f"    audience: {ts_str(m['audience'])},")
        L.append(f"    tagline: {ts_str(m['tagline'])},")
        L.append(f"    description: {ts_str(m['description'])}, // PLACEHOLDER (§6-B)")
        L.append(f"    jaculatoria: {ts_str(m['jaculatoria'])}, // PLACEHOLDER (§6-C)")
        L.append("    questions: [")
        for q in data[m["id"]]:
            parts = [f"id: {ts_str(q['id'])}", f"text: {ts_str(q['text'])}"]
            if q.get("category"):
                parts.append(f"category: {ts_str(q['category'])}")
            if q.get("subcategory"):
                parts.append(f"subcategory: {ts_str(q['subcategory'])}")
            L.append("      { " + ", ".join(parts) + " },")
        L.append("    ],")
        L.append("  },")
    L.append("];")
    L.append("")
    L.append("export const getEdition = (id: string): Edition | undefined =>")
    L.append("  editions.find((e) => e.id === id);")
    L.append("")
    return "\n".join(L)


if __name__ == "__main__":
    data = load()
    for m in META:
        print(f"{m['id']:10s} {len(data[m['id']]):3d} preguntas")
    if data["_family_skipped"]:
        print(f"family: {len(data['_family_skipped'])} descartadas por votos (mayoría Jenga):")
        for n, f, t in data["_family_skipped"]:
            print(f"   #{n:02d} ({f}/5 F) {t}")
    if "--dry-run" in sys.argv:
        sys.exit(0)
    OUT.write_text(render(data), encoding="utf-8")
    print(f"→ escrito {OUT.relative_to(ROOT)}")
