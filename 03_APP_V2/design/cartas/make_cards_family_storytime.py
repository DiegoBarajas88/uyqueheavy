"""
Genera cartas de Family y Storytime con la plantilla del mazo impreso (961×1402 px = 65.5×95.5 mm).
Reverso: recolor del reverso real de Friends (conserva logo, pincel y marco) + ícono y nombre nuevos.
Pregunta: fondo liso como Love, marco, ícono, pregunta en Quicksand y nombre en Sieroty.
"""
import sys, os, json, base64, io, textwrap
from PIL import Image, ImageDraw, ImageFont, ImageChops

S = sys.argv[1]
FONTS = '/Users/barajas/Library/Mobile Documents/com~apple~CloudDocs/Documents/TEMPORALES/UY QUE HEAVY/03_APP_V2/assets/fonts/'
W, H = 961, 1402
FRAME = (148, 149, 809, 1250)
ICON_CY = 549          # centro de la banda del ícono (494–604)
TEXT_CY = 729          # centro del bloque de pregunta
SCRIPT_CY = 1156       # centro del nombre en script
WHITE = (255, 255, 255)

EDS = {
  'family':    {'bg': (95, 126, 151), 'name': 'Family Edition',    'icon': 'house'},
  'storytime': {'bg': (98, 140, 120), 'name': 'Storytime Edition', 'icon': 'book'},
}
QS = json.load(open(f'{S}/gen/questions.json'))

def mix(a, b, k): return tuple(round(a[i] + (b[i] - a[i]) * k) for i in range(3))

def recolor(src, src_bg, new_bg):
    """Mapea por luminancia: fondo→new_bg, blanco→blanco, tintes intermedios→intermedios."""
    L = src.convert('L')
    Lbg = round(0.299*src_bg[0] + 0.587*src_bg[1] + 0.114*src_bg[2])
    lut = [min(255, max(0, round((v - Lbg) * 255 / (255 - Lbg)))) for v in range(256)]
    k = L.point(lut)
    return Image.composite(Image.new('RGB', src.size, WHITE), Image.new('RGB', src.size, new_bg), k)

def icon(d, kind, cx, cy, s, color=WHITE, w=6):
    """Ícono de línea, s = alto aproximado."""
    if kind == 'house':
        rw, rh = s * 0.95, s * 0.42
        roof = [(cx - rw/2, cy - s/2 + rh), (cx, cy - s/2), (cx + rw/2, cy - s/2 + rh)]
        d.line(roof, fill=color, width=w, joint='curve')
        bx0, bx1 = cx - rw*0.40, cx + rw*0.40
        by0, by1 = cy - s/2 + rh*0.85, cy + s/2
        d.line([(bx0, by0), (bx0, by1), (bx1, by1), (bx1, by0)], fill=color, width=w, joint='curve')
        # corazón pequeño dentro
        hs = s * 0.22; hx, hy = cx, cy + s*0.12
        d.polygon([(hx, hy + hs*0.55), (hx - hs*0.55, hy - hs*0.05), (hx - hs*0.28, hy - hs*0.35), (hx, hy - hs*0.12), (hx + hs*0.28, hy - hs*0.35), (hx + hs*0.55, hy - hs*0.05)], outline=color, width=max(3, w-2))
    elif kind == 'book':
        pw, ph = s * 0.62, s * 0.78
        top = cy - ph/2 + s*0.08
        for sgn in (-1, 1):
            x0, x1 = cx, cx + sgn * pw
            pts = [(x0, top + s*0.06), (x0 + sgn*pw*0.5, top), (x1, top + s*0.04), (x1, top + ph*0.9), (x0 + sgn*pw*0.5, top + ph*0.86), (x0, top + ph*0.92)]
            d.line(pts + [pts[0]], fill=color, width=w, joint='curve')
            for i in range(3):
                yy = top + ph*(0.3 + i*0.18)
                d.line([(x0 + sgn*pw*0.18, yy + sgn*0), (x0 + sgn*pw*0.82, yy - s*0.02)], fill=color, width=max(3, w-2))
        d.line([(cx, top + s*0.06), (cx, top + ph*0.92)], fill=color, width=w)

def draw_frame(d):
    d.rectangle(FRAME, outline=mix((0,0,0), WHITE, 0.92), width=2)

def script_name(d, name, alpha=0.5, bg=None):
    f = ImageFont.truetype(FONTS + 'Sieroty.ttf', 64)
    l, t, r, b = d.textbbox((0, 0), name, font=f)
    color = mix(bg, WHITE, alpha)
    d.text(((W - (r - l))/2 - l, SCRIPT_CY - (b - t)/2 - t), name, font=f, fill=color)

def question_card(ed, text):
    e = EDS[ed]
    im = Image.new('RGB', (W, H), e['bg']); d = ImageDraw.Draw(im)
    draw_frame(d)
    icon(d, e['icon'], W/2, ICON_CY, 100)
    f = ImageFont.truetype(FONTS + 'Quicksand.otf', 40)
    # envolver a ~26 caracteres como en las impresas (3–4 líneas)
    lines = textwrap.wrap(text, 28)
    if len(lines) > 5: lines = textwrap.wrap(text, 34); f = ImageFont.truetype(FONTS + 'Quicksand.otf', 36)
    lh = 51
    y = TEXT_CY - lh * len(lines) / 2
    for ln in lines:
        l, t, r, b = d.textbbox((0, 0), ln, font=f)
        d.text(((W - (r - l))/2 - l, y), ln, font=f, fill=WHITE, stroke_width=1, stroke_fill=WHITE)
        y += lh
    script_name(d, e['name'], 0.55, e['bg'])
    return im

def back_card(ed):
    e = EDS[ed]
    src = Image.open(f'{S}/tpl_friends_back.png').convert('RGB')
    im = recolor(src, (156, 141, 75), e['bg'])
    d = ImageDraw.Draw(im)
    # borrar ícono de Friends (banda superior) y su nombre en script (banda inferior); mantener logo + pincel + marco
    d.rectangle((FRAME[0]+4, FRAME[1]+4, FRAME[2]-4, 655), fill=e['bg'])
    d.rectangle((FRAME[0]+4, 1000, FRAME[2]-4, FRAME[3]-4), fill=e['bg'])
    icon(d, e['icon'], W/2, 585, 120, w=7)
    script_name(d, e['name'], 0.6, e['bg'])
    return im

def jpg64(im):
    im = im.resize((480, round(480 * H / W)), Image.LANCZOS)
    b = io.BytesIO(); im.save(b, 'JPEG', quality=82, optimize=True); return base64.b64encode(b.getvalue()).decode()

if __name__ == '__main__':
    out = {}
    os.makedirs(f'{S}/gen/png', exist_ok=True)
    for ed in EDS:
        back = back_card(ed); back.save(f'{S}/gen/png/{ed}_back.png')
        qs = []
        for i, q in enumerate(QS[ed][:8]):
            im = question_card(ed, q); qs.append(jpg64(im))
            if i < 2: im.save(f'{S}/gen/png/{ed}_q{i+1}.png')
        out[ed] = {'back': jpg64(back), 'qs': qs}
    cards = json.load(open(f'{S}/cards.json')); cards.update(out)
    json.dump(cards, open(f'{S}/cards.json', 'w'))
    # preview
    ims = [Image.open(f'{S}/gen/png/{n}.png') for n in ['family_back','family_q1','family_q2','storytime_back','storytime_q1','storytime_q2']]
    sheet = Image.new('RGB', (6*(W//3+20)+20, H//3+40), (235,235,235))
    for k, im in enumerate(ims): sheet.paste(im.resize((W//3, H//3), Image.LANCZOS), (20 + k*(W//3+20), 20))
    sheet.save(f'{S}/gen/preview.png'); print('ok', {k: len(v['qs']) for k, v in cards.items()})
