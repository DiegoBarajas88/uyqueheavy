"""
Genera los recursos nativos de marca (ícono iOS/Android, splash nativo, favicon)
a partir de la marca de texto "UY QUÉ HEAVY" en Spicy Wasabi sobre vino,
igual que los mockups de Erika (01_RECURSOS_ERIKA/mockups/1.png).

PROVISIONAL: cuando Erika entregue el ícono definitivo, reemplazar
assets/icon.png y demás a mano y dejar de usar este script.

Uso:  python3 scripts/make_brand_assets.py      (requiere Pillow)
"""
from PIL import Image, ImageDraw, ImageFont
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FONT = os.path.join(ROOT, 'assets/fonts/SpicyWasabi.ttf')
OUT = os.path.join(ROOT, 'assets')

WINE = (0x7A, 0x1E, 0x22)
WINE_SOFT = (0x8C, 0x33, 0x38)
CREAM = (0xFB, 0xF6, 0xEC)
LINES = ['UY', 'QUÉ', 'HEAVY']


def fit_font(draw, text, max_w, start=400):
    size = start
    while size > 10:
        f = ImageFont.truetype(FONT, size)
        l, t, r, b = draw.textbbox((0, 0), text, font=f)
        if r - l <= max_w:
            return f
        size -= 4
    return ImageFont.truetype(FONT, 10)


def draw_text_accent(d, xy, text, font, color):
    """Escribe `text`; Spicy Wasabi no tiene É, así que sobre la E de QUÉ se dibuja la tilde a mano."""
    d.text(xy, text, font=font, fill=color)
    idx = text.find('QUÉ')
    if idx < 0:
        return
    x, y = xy
    ex = x + d.textlength(text[:idx + 2], font=font)       # inicio de la E
    ew = d.textlength('E', font=font)
    l, t, r, b = d.textbbox((0, 0), 'E', font=font)
    top = y + t
    eh = b - t
    sw = max(6, int(font.size * 0.115))                       # grosor del trazo
    # tilde aguda: sube de izquierda a derecha
    x0, y0 = ex + ew * 0.42, top - eh * 0.10
    x1, y1 = x0 + ew * 0.20, y0 - eh * 0.12
    d.line((x0, y0, x1, y1), fill=color, width=sw)
    for cx, cy in ((x0, y0), (x1, y1)):
        d.ellipse((cx - sw / 2, cy - sw / 2, cx + sw / 2, cy + sw / 2), fill=color)


def draw_wordline(img, box, color=CREAM):
    """Una sola línea 'UY QUÉ HEAVY' centrada en box (para el splash nativo)."""
    d = ImageDraw.Draw(img)
    x0, y0, x1, y1 = box
    text = 'UY QUÉ HEAVY'
    font = fit_font(d, text, x1 - x0)
    l, t, r, b = d.textbbox((0, 0), text, font=font)
    x = x0 + ((x1 - x0) - (r - l)) // 2 - l
    y = y0 + ((y1 - y0) - (b - t)) // 2 - t
    draw_text_accent(d, (x, y), text, font, color)


def draw_wordmark(img, box, color=CREAM, gap_ratio=0.17):
    """Dibuja UY / QUÉ / HEAVY apiladas y centradas dentro de box=(x0,y0,x1,y1)."""
    d = ImageDraw.Draw(img)
    x0, y0, x1, y1 = box
    w, h = x1 - x0, y1 - y0
    # La palabra más ancha (HEAVY) define el tamaño; las otras usan el mismo.
    font = fit_font(d, 'HEAVY', w)
    # Ajustar también por alto total
    while True:
        boxes = [d.textbbox((0, 0), s, font=font) for s in LINES]
        heights = [b[3] - b[1] for b in boxes]
        gap = int(font.size * gap_ratio)
        total = sum(heights) + gap * (len(LINES) - 1)
        if total <= h or font.size <= 12:
            break
        font = ImageFont.truetype(FONT, font.size - 4)
    y = y0 + (h - total) // 2
    for s, b, hh in zip(LINES, boxes, heights):
        tw = b[2] - b[0]
        x = x0 + (w - tw) // 2 - b[0]
        draw_text_accent(d, (x, y - b[1]), s, font, color)
        y += hh + gap


def icon_1024():
    img = Image.new('RGB', (1024, 1024), WINE)
    d = ImageDraw.Draw(img)
    # Círculos suaves como en el splash de Erika
    d.ellipse((560, -380, 1300, 360), fill=WINE_SOFT)
    d.ellipse((-330, 720, 330, 1380), fill=WINE_SOFT)
    draw_wordmark(img, (150, 190, 874, 834))
    img.save(os.path.join(OUT, 'icon.png'), optimize=True)


def android_foreground():
    # Adaptive icon: 1024 canvas, zona segura = círculo central de 66% (≈676px)
    img = Image.new('RGBA', (1024, 1024), (0, 0, 0, 0))
    draw_wordmark(img, (230, 250, 794, 774))
    img.save(os.path.join(OUT, 'android-icon-foreground.png'), optimize=True)
    bg = Image.new('RGBA', (1024, 1024), WINE + (255,))
    bg.save(os.path.join(OUT, 'android-icon-background.png'), optimize=True)
    mono = Image.new('RGBA', (1024, 1024), (0, 0, 0, 0))
    draw_wordmark(mono, (230, 250, 794, 774), color=(255, 255, 255))
    mono.save(os.path.join(OUT, 'android-icon-monochrome.png'), optimize=True)


def splash_icon():
    # Se muestra con resizeMode contain sobre backgroundColor vino (app.json).
    img = Image.new('RGBA', (1024, 1024), (0, 0, 0, 0))
    draw_wordline(img, (120, 380, 904, 644))
    img.save(os.path.join(OUT, 'splash-icon.png'), optimize=True)


def favicon():
    img = Image.new('RGB', (256, 256), WINE)
    draw_wordmark(img, (30, 40, 226, 216))
    img.resize((64, 64), Image.LANCZOS).save(os.path.join(OUT, 'favicon.png'), optimize=True)


def play_store_graphics():
    """Google Play: ícono 512×512 y gráfico de funciones 1024×500."""
    out = os.path.join(ROOT, 'store', 'play')
    os.makedirs(out, exist_ok=True)
    Image.open(os.path.join(OUT, 'icon.png')).resize((512, 512), Image.LANCZOS).save(os.path.join(out, 'icon-512.png'), optimize=True)
    fg = Image.new('RGB', (1024, 500), WINE)
    d = ImageDraw.Draw(fg)
    d.ellipse((700, -260, 1200, 240), fill=WINE_SOFT)
    d.ellipse((-160, 330, 260, 750), fill=WINE_SOFT)
    draw_wordline(fg, (112, 120, 912, 300))
    sub = ImageFont.truetype(os.path.join(ROOT, 'assets/fonts/Sieroty.ttf'), 58)
    text = 'Conectando un mundo desconectado'
    l, t, r, b = d.textbbox((0, 0), text, font=sub)
    d.text(((1024 - (r - l)) // 2 - l, 330 - t), text, font=sub, fill=(0xE8, 0xC9, 0xC9))
    fg.save(os.path.join(out, 'feature-1024x500.png'), optimize=True)


if __name__ == '__main__':
    icon_1024(); android_foreground(); splash_icon(); favicon(); play_store_graphics()
    print('OK →', OUT)
