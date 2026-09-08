/**
 * Sistema de marca — Uy Qué Heavy
 * Colores derivados de los mockups de Erika (01_RECURSOS_ERIKA/mockups).
 * Los colores de Family y Storytime son TENTATIVOS hasta que Erika los defina.
 */

export const brand = {
  wine: '#7A1E22',       // vino tinto — header, splash, marca
  wineDeep: '#5A1418',
  cream: '#FBF6EC',      // fondo base de la app
  creamSoft: '#F4EAD6',
  ink: '#2C1719',        // texto principal
  inkSoft: '#6E5140',
  inkFaint: '#9A8168',
  line: '#E4D6BE',
  white: '#FFFFFF',
};

export const fonts = {
  display: 'SpicyWasabi',   // logo / títulos gruesos
  script: 'Sieroty',        // nombres de ediciones, acentos emocionales
  body: 'Quicksand',        // cuerpo, botones, UI
};

/**
 * Sieroty tiene trazos que abarcan 2.17em (asc 2897 + desc 1551 sobre 2048 upem),
 * muchísimo más que una tipografía normal (~0.9em). En web los remates se desbordan
 * de la caja de línea y se ven igual, pero iOS RECORTA el texto al lineHeight:
 * los nombres de edición salían como garabatos.
 *
 * Usar SIEMPRE este helper para el lineHeight de cualquier texto en fonts.script.
 */
export const scriptLineHeight = (fontSize: number) => Math.ceil(fontSize * 2.18);

/**
 * Sieroty también se sale de la caja HORIZONTALMENTE: la "L" de "Love Edition"
 * arranca con un remate que va 0.193em a la IZQUIERDA del origen del texto
 * (medido: 5.0px a 26pt, 7.7px a 40pt, 10.0px a 52pt). Igual que con el alto,
 * iOS recorta lo que sobresale y la L aparece cortada; web no.
 *
 * Se aplica el mismo aire a los dos lados para no descentrar el texto, con un
 * 0.22 (algo por encima del 0.193 medido) para que el redondeo en dispositivo
 * no vuelva a rozar el remate.
 */
export const scriptSidePadding = (fontSize: number) => Math.ceil(fontSize * 0.22);

export type EditionTheme = {
  bg: string;         // fondo de pantalla (suave)
  band: string;       // fondo de la banda en el Home
  card: string;       // color fuerte de la edición (botón/acentos)
  onCard: string;     // texto sobre `card`
  cardSoft: string;   // relleno claro de la carta de pregunta
  accent: string;     // color fuerte para títulos script sobre fondo suave
  questionInk: string;// color del texto de la pregunta sobre `cardSoft`
};

export const editionThemes: Record<string, EditionTheme> = {
  friends: { bg:'#FCF7DE', band:'#FBF3C9', card:'#F2DE79', onCard:'#7A5A14', cardSoft:'#FBF0AE', accent:'#B8862A', questionInk:'#6E5320' },
  love:    { bg:'#e7dbeb', band:'#e7dbeb', card:'#bfaac4', onCard:'#FFFFFF', cardSoft:'#DEC9EA', accent:'#8E5BA6', questionInk:'#4A2F58' },
  forever: { bg:'#ECD9D9', band:'#E3BEBE', card:'#B5453F', onCard:'#FFFFFF', cardSoft:'#DE9F9B', accent:'#8C3B3B', questionInk:'#5A2320' },
  family:  { bg:'#DEEBF3', band:'#CFE3EF', card:'#6E9FC0', onCard:'#FFFFFF', cardSoft:'#B9D6E6', accent:'#3E6E8E', questionInk:'#24455A' },
  storytime:{bg:'#DBEDE6', band:'#C9E3D9', card:'#5FA891', onCard:'#FFFFFF', cardSoft:'#ADD5C6', accent:'#3E7D63', questionInk:'#234A3B' },
};

export const layout = {
  radius: 22,
  radiusSm: 14,
  pad: 20,
  maxCardWidth: 460, // mobile-first; centra en pantallas anchas
};
