"""Acabado realista horneado en la imagen: caída de luz diagonal, viñeta de bordes y grano de cartulina."""
from PIL import Image, ImageDraw, ImageFilter, ImageChops, ImageEnhance
def finish(im):
    W,H=im.size
    # luz diagonal: 1.0 arriba-izquierda → 0.86 abajo-derecha, luego +6% global
    grad=Image.linear_gradient('L').resize((W*2,H*2)).rotate(-35,expand=False).crop((W//2,H//2,W//2+W,H//2+H))
    light=grad.point(lambda v: int(255*(1.0-0.14*v/255)))
    im=ImageChops.multiply(im, Image.merge('RGB',[light]*3))
    im=ImageEnhance.Brightness(im).enhance(1.06)
    # viñeta de bordes
    vg=Image.new('L',(W,H),255); d=ImageDraw.Draw(vg); d.rectangle((int(W*0.06),int(H*0.045),int(W*0.94),int(H*0.955)),fill=0)
    vg=vg.filter(ImageFilter.GaussianBlur(W*0.05)).point(lambda v:int(v*0.30))
    im=Image.composite(Image.new('RGB',(W,H),(20,10,12)), im, vg)
    # grano
    n=Image.effect_noise((W,H),22).point(lambda v: 128+int((v-128)*0.14))
    im=ImageChops.add(im, Image.merge('RGB',[n]*3), 1.0, -128)
    return im
