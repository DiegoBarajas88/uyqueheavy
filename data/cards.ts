export type EditionKey = 'love' | 'friends' | 'forever' | 'family'

export type EditionCategory = {
  key: string
  label: string
  description: string
}

export type CardItem = {
  id: string
  text: string
  category: string
}

export type Edition = {
  key: EditionKey
  title: string
  theme: string
  description: string
  categories: EditionCategory[]
  cards: CardItem[]
}

export const editions: Edition[] = [
  {
    key: 'love',
    title: 'Love Edition',
    theme: 'Pareja',
    description: 'Conversaciones íntimas para abrir la vulnerabilidad, agradecer, y reconectar desde el amor.',
    categories: [
      { key: 'vulnerabilidad', label: 'Vulnerabilidad', description: 'Abrir sin culpa y aprender a escucharnos.' },
      { key: 'amor', label: 'Amor', description: 'Recordar lo que nos une y lo que nos hace crecer.' },
      { key: 'reconexion', label: 'Reconexión', description: 'Reencontrarnos en la cotidianidad y en los deseos compartidos.' },
      { key: 'gratitud', label: 'Gratitud', description: 'Apreciar lo que se da y reconocer el valor del otro.' },
      { key: 'conflictos', label: 'Conflictos sanos', description: 'Conversar con honestidad para crecer en equipo.' }
    ],
    cards: [
      { id: 'love-01', text: '¿Qué es lo que más te gusta de ti físicamente y qué te gustaría mejorar?', category: 'vulnerabilidad' },
      { id: 'love-02', text: '¿Qué es lo que más te gusta de mí físicamente?', category: 'amor' },
      { id: 'love-03', text: '¿Hay algo que te gustaría que apreciara más de ti?', category: 'amor' },
      { id: 'love-04', text: '¿Qué es lo que más disfrutas de nuestra relación?', category: 'amor' },
      { id: 'love-05', text: '¿Qué actitud crees que podríamos mejorar en nuestra relación?', category: 'conflictos' },
      { id: 'love-06', text: 'Quiero empezar a decirte más seguido que…', category: 'gratitud' },
      { id: 'love-07', text: '¿Hay algo en mi comportamiento que no te hace sentir amado?', category: 'vulnerabilidad' },
      { id: 'love-08', text: '¿Sobre qué tema preferirías que discutiéramos menos?', category: 'conflictos' },
      { id: 'love-09', text: '¿Te sientes apreciado por mí en las cosas que haces?', category: 'gratitud' },
      { id: 'love-10', text: '¿Qué es lo que hace que nuestra relación sea especial para ti?', category: 'reconexion' },
      { id: 'love-11', text: '¿En qué momentos te sientes más amado y valorado?', category: 'amor' },
      { id: 'love-12', text: '¿Cuándo y cómo te sientes más conectado conmigo?', category: 'amor' },
      { id: 'love-13', text: '¿Hay algo que quisieras que hiciéramos juntos que aún no hemos hecho?', category: 'reconexion' },
      { id: 'love-14', text: '¿Hay algo de tus relaciones pasadas que no te gustaría repetir conmigo?', category: 'conflictos' },
      { id: 'love-15', text: '¿Qué patrones familiares no quisieras repetir en nuestra relación?', category: 'conflictos' },
      { id: 'love-16', text: '¿Qué lección importante sobre el amor has aprendido en el pasado?', category: 'reconexion' },
      { id: 'love-17', text: '¿Por qué cosas te sientes agradecido en nuestra relación?', category: 'gratitud' },
      { id: 'love-18', text: 'Agradécele a tu pareja por algo increíble que haya traído a tu vida.', category: 'gratitud' },
      { id: 'love-19', text: 'Mencióname un momento difícil en el que sentiste mucho mi apoyo.', category: 'gratitud' },
      { id: 'love-20', text: 'Una de las cosas que más admiro de ti es…', category: 'amor' },
      { id: 'love-21', text: '¿Qué aspecto te gustaría que mejorara de mí?', category: 'vulnerabilidad' },
      { id: 'love-22', text: '¿Qué podríamos empezar a hacer para mejorar nuestra relación?', category: 'conflictos' },
      { id: 'love-23', text: '¿En qué aspecto crees que podríamos lograr un equilibrio para ambos sentirnos cómodos?', category: 'conflictos' },
      { id: 'love-24', text: '¿Qué hábitos cambiarías para el beneficio de nuestra relación?', category: 'conflictos' },
      { id: 'love-25', text: '¿Qué podríamos hacer para sentirnos más conectados y en sintonía?', category: 'amor' },
      { id: 'love-26', text: '¿Qué crees que podemos mejorar para manejar mejor los desacuerdos?', category: 'conflictos' },
      { id: 'love-27', text: '¿Cómo visualizas nuestra relación en el futuro?', category: 'reconexion' },
      { id: 'love-28', text: '¿Qué es lo que más te preocupa sobre el futuro?', category: 'vulnerabilidad' },
      { id: 'love-29', text: '¿Hay algo sobre el futuro que no has sabido cómo expresar conmigo?', category: 'vulnerabilidad' }
    ]
  },
  {
    key: 'friends',
    title: 'Friends Edition',
    theme: 'Amigos',
    description: 'Conversaciones con humor y profundidad para descubrir historias, opiniones y momentos que importan.',
    categories: [
      { key: 'romper', label: 'Romper el hielo', description: 'Preguntas que relajan el ambiente con apertura.' },
      { key: 'diversion', label: 'Diversión', description: 'Temas que invitan a reírse con sentido.' },
      { key: 'historias', label: 'Historias', description: 'Memorias y relatos que revelan quiénes somos.' },
      { key: 'opiniones', label: 'Opiniones', description: 'Miradas sinceras sobre lo que pensamos y sentimos.' },
      { key: 'profundidad', label: 'Profundidad', description: 'Preguntas que llevan la conversación más allá.' }
    ],
    cards: [
      { id: 'friends-01', text: 'Le debo un agradecimiento a...', category: 'romper' },
      { id: 'friends-02', text: 'Si pudieras cambiar una característica de ti ¿qué cambiarías?', category: 'profundidad' },
      { id: 'friends-03', text: 'Si pudieras cambiar algo de la forma en la que te criaron tus padres ¿qué cambiarías?', category: 'historias' },
      { id: 'friends-04', text: '¿Has tenido que sacar a alguien de tu vida? ¿Quién y por qué?', category: 'profundidad' },
      { id: 'friends-05', text: '¿Qué negocio sueñas y te gustaría poner?', category: 'opiniones' },
      { id: 'friends-06', text: '¿Cuál ha sido tu peor decisión financiera?', category: 'profundidad' },
      { id: 'friends-07', text: '¿Qué te gusta hacer cuando estás solo?', category: 'romper' },
      { id: 'friends-08', text: '¿A quién te gustaría pedirle perdón pero no lo has hecho?', category: 'profundidad' },
      { id: 'friends-09', text: '¿Qúe defectos de ti no te gustaría que vieran otras personas?', category: 'profundidad' },
      { id: 'friends-10', text: '¿Alguna vez has cometido algún delito?', category: 'diversion' },
      { id: 'friends-11', text: '¿En qué otra carrera tienes el presentimiento de que serías muy feliz o harías un muy buen trabajo?', category: 'opiniones' },
      { id: 'friends-12', text: '¿Has odiado a alguien? ¿A quién?', category: 'profundidad' },
      { id: 'friends-13', text: 'Si pudieras tener la vida de otra persona ¿De quién sería?', category: 'historias' },
      { id: 'friends-14', text: '¿Qué te frustra de tu vida social?', category: 'profundidad' },
      { id: 'friends-15', text: '¿A quién le tienes envidia?', category: 'opiniones' },
      { id: 'friends-16', text: '¿En qué te gustaría poder gastar mucho dinero?', category: 'diversion' },
      { id: 'friends-17', text: 'Si fueras más valiente ¿qué habrías hecho diferente?', category: 'historias' },
      { id: 'friends-18', text: '¿Qué aspectos de tu carácter o de tu forma de pensar no te enorgullecen?', category: 'profundidad' },
      { id: 'friends-19', text: '¿Qué sientes que hace falta en tu vida en este momento?', category: 'opiniones' },
      { id: 'friends-20', text: '¿Qué te gustaría lograr cambiar de aquí a dos años?', category: 'opiniones' },
      { id: 'friends-21', text: 'Reconozco que puedo ser una persona difícil por..', category: 'profundidad' },
      { id: 'friends-22', text: 'Lo que más me saca el mal genio es..', category: 'opiniones' },
      { id: 'friends-23', text: '¿En qué aspecto crees que te estás autosaboteando?', category: 'profundidad' },
      { id: 'friends-24', text: 'Si supieras que no vas a fallar ¿qué intentarías?', category: 'opiniones' }
    ]
  },
  {
    key: 'forever',
    title: 'Forever Edition',
    theme: 'Pareja profunda',
    description: 'Conversaciones de pareja sobre intimidad, deseo, límites, dinero y futuro compartido.',
    categories: [
      { key: 'intimidad', label: 'Intimidad', description: 'Hablar de cercanía, lenguaje afectivo y conexión en pareja.' },
      { key: 'deseo', label: 'Deseo', description: 'Abrir conversaciones sobre atracción, fantasías y lo que enciende el vínculo.' },
      { key: 'limites', label: 'Límites', description: 'Nombrar con honestidad lo que cuida, incomoda o necesita acuerdo.' },
      { key: 'dinero', label: 'Dinero', description: 'Conversaciones de pareja sobre tranquilidad financiera y decisiones compartidas.' },
      { key: 'futuro', label: 'Futuro compartido', description: 'Mirar hacia adelante y conversar sobre el camino que quieren construir.' }
    ],
    cards: [
      { id: 'forever-01', text: '¿Hay alguna fantasía que te gustaría compartir conmigo y explorar juntos?', category: 'deseo' },
      { id: 'forever-02', text: '¿Cómo prefieres que te exprese mis deseos en la intimidad para que te sientas cómodo y conectado?', category: 'intimidad' },
      { id: 'forever-03', text: '¿Qué parte de nuestro tiempo juntos disfrutas más y te gustaría repetir con frecuencia?', category: 'intimidad' },
      { id: 'forever-04', text: '¿Qué es algo de tu cuerpo que te gustaría que notara más durante nuestros momentos íntimos?', category: 'deseo' },
      { id: 'forever-05', text: 'En el sexo me desmotiva mucho que…', category: 'limites' },
      { id: 'forever-06', text: 'Para mí, la familia y la intimidad son…', category: 'futuro' },
      { id: 'forever-07', text: 'Tienes algún límite claro o que no te sientas cómodo explorando', category: 'limites' },
      { id: 'forever-08', text: '¿Qué te ayuda a relajarte y disfrutar más plenamente de nuestra intimidad?', category: 'intimidad' },
      { id: 'forever-09', text: '¿Qué ambiente o detalles te hacen sentir más a gusto y libre en nuestra intimidad?', category: 'intimidad' },
      { id: 'forever-10', text: '¿Qué palabras o gestos te hacen sentir más amado y seguro en nuestros momentos íntimos?', category: 'intimidad' },
      { id: 'forever-11', text: '¿Hay algo que hayas visto o escuchado que te gustaría que probáramos juntos?', category: 'deseo' },
      { id: 'forever-12', text: '¿Qué cosas sutiles en el día a día te hacen sentir más atraído?', category: 'deseo' },
      { id: 'forever-13', text: '¿Qué es lo que más disfrutas que haga por ti en nuestra vida íntima?', category: 'deseo' },
      { id: 'forever-14', text: '¿Qué tipo de palabras o frases te hacen sentir deseado y conectado conmigo?', category: 'intimidad' },
      { id: 'forever-15', text: '¿Te gustaría que probáramos un nuevo lugar o ambiente para disfrutar juntos?', category: 'futuro' },
      { id: 'forever-16', text: '¿Hay algo sobre mi sexualidad o preferencias que te gustaría comprender mejor?', category: 'limites' },
      { id: 'forever-17', text: '¿Qué aspecto de nuestras finanzas te genera más tranquilidad, y cuál te gustaría que mejoráramos?', category: 'dinero' },
      { id: 'forever-18', text: '¿En qué te gustaría que nos apoyáramos más para tomar decisiones financieras juntos?', category: 'dinero' },
      { id: 'forever-19', text: '¿Cómo crees que deberíamos gestionar los gastos personales y los gastos compartidos?', category: 'dinero' },
      { id: 'forever-20', text: '¿Qué es lo más importante para ti al momento de ahorrar o invertir?', category: 'dinero' },
      { id: 'forever-21', text: '¿Qué consejo financiero te gustaría compartir conmigo que crees que aún no hemos considerado?', category: 'dinero' },
      { id: 'forever-22', text: '¿Qué decisión financiera crees que ha sido clave para nuestro bienestar actual?', category: 'dinero' },
      { id: 'forever-23', text: '¿Cómo describirías tu relación con el dinero, y cómo sientes que se complementa con la mía?', category: 'dinero' },
      { id: 'forever-24', text: '¿Hay algo que no te he preguntado sobre tu vida íntima y que te gustaría que supiera?', category: 'futuro' }
    ]
  },
  {
    key: 'family',
    title: 'Family Edition',
    theme: 'Familia',
    description: 'Cartas familiares basadas en preguntas reales para crear momentos de vínculo, recuerdos y gratitud juntos.',
    categories: [
      { key: 'diversion', label: 'Diversión', description: 'Preguntas ligeras y creativas que generan risas y complicidad.' },
      { key: 'emociones', label: 'Emociones', description: 'Conversaciones que acercan a cada miembro con sensibilidad.' },
      { key: 'gratitud', label: 'Gratitud', description: 'Momentos para reconocer lo que esta familia regala.' },
      { key: 'imaginacion', label: 'Imaginación', description: 'Preguntas para jugar con el futuro y reinventar la historia familiar.' },
      { key: 'historias', label: 'Historias familiares', description: 'Relatos y recuerdos que honran el pasado y las tradiciones.' }
    ],
    cards: [
      { id: 'family-01', text: 'Qué olor, canción y comida te transporta a casa', category: 'emociones' },
      { id: 'family-02', text: 'Qué tradición familiar te gustaría que retomáramos', category: 'historias' },
      { id: 'family-03', text: 'Si pudieras elegir una escena para guardarla en una cápsula del tiempo familiar, ¿cuál sería?', category: 'imaginacion' },
      { id: 'family-04', text: 'Describe nuestra familia usando solo 3 palabras', category: 'emociones' },
      { id: 'family-05', text: 'Creo que lo más fácil y lo más difícil de crecer conmigo fue...', category: 'emociones' },
      { id: 'family-06', text: 'Cuéntanos la última buena noticia que recibiste o éxito que lograste', category: 'gratitud' },
      { id: 'family-07', text: 'Si hiciéramos una competencia de talentos familiares, ¿quién ganaría en qué?', category: 'diversion' },
      { id: 'family-08', text: 'Qué tipo de familia te gustaría que seamos en 10 años', category: 'imaginacion' },
      { id: 'family-09', text: '¿Qué regla o hábito familiar deberíamos revisar?', category: 'historias' },
      { id: 'family-10', text: '¿Qué quieres que tus nietos, hijos o sobrinos aprendan de esta familia?', category: 'imaginacion' },
      { id: 'family-11', text: 'Si tuvieras una varita mágica para cambiar algo de nuestra historia, ¿qué cambiarías?', category: 'imaginacion' },
      { id: 'family-12', text: 'Qué apodo te han puesto que recuerdas más fácilmente y ¿por qué?', category: 'diversion' },
      { id: 'family-13', text: 'Cuál fue tu juguete favorito en tu infancia?', category: 'historias' },
      { id: 'family-14', text: 'Cuál fue la vez que más te has reído en familia?', category: 'diversion' },
      { id: 'family-15', text: 'Qué viaje o experiencia te gustaría repetir y por qué?', category: 'historias' },
      { id: 'family-16', text: 'Propón una pregunta; puede ser chistosa o introspectiva', category: 'diversion' },
      { id: 'family-17', text: 'Qué regalo recibido nunca olvidarás?', category: 'gratitud' },
      { id: 'family-18', text: 'Cuál ha sido tu momento más vergonzoso?', category: 'historias' },
      { id: 'family-19', text: 'Si pudieras crear una nueva tradición familiar, ¿cuál sería?', category: 'imaginacion' },
      { id: 'family-20', text: 'Si pudiéramos viajar todos juntos en navidad, sin pensar en el dinero, ¿a dónde te gustaría que fuéramos? Y por qué?', category: 'imaginacion' },
      { id: 'family-21', text: '¿Qué habrías hecho diferente en una situación familiar del pasado y por qué?', category: 'historias' },
      { id: 'family-22', text: '¿Qué historia familiar merece ser una serie o película?', category: 'historias' },
      { id: 'family-23', text: 'Menciona mínimo 2 hábitos que consideras que debemos mantener como familia.', category: 'gratitud' },
      { id: 'family-24', text: 'Qué es lo que más agradeces de esta familia?', category: 'gratitud' },
      { id: 'family-25', text: 'Qué tradición de la familia te gustaría que continuara por generaciones?', category: 'gratitud' },
      { id: 'family-26', text: 'A quién quieres agradecerle algo hoy y por qué? Agradécele a cada uno de los jugadores.', category: 'gratitud' },
      { id: 'family-27', text: 'Qué es lo más bonito que aprendiste de alguien de aquí?', category: 'emociones' },
      { id: 'family-28', text: 'Qué es lo que más te enorgullece de nosotros como familia?', category: 'emociones' },
      { id: 'family-29', text: '¿Qué momento difícil superamos juntos que te hizo sentir más unido(a)?', category: 'emociones' },
      { id: 'family-30', text: 'Menciona mínimo 2 hábitos que te gustaría que implementáramos como familia.', category: 'gratitud' }
    ]
  }
]

export const editionMap: Record<EditionKey, Edition> = Object.fromEntries(editions.map((edition) => [edition.key, edition])) as Record<EditionKey, Edition>
