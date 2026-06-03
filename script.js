/**
 * Artista Urbano - Motor lógico Fase 1: El Subsuelo
 * --------------------------------------------------
 * Este archivo mantiene el estado interno del jugador y expone una lógica
 * sencilla para conectar la maqueta HTML/CSS con futuras pantallas de juego.
 */

const FRANJAS = ["manana", "tarde", "noche"];
const OBJETIVO_SEGUIDORES = 10000;
const COSTE_ALQUILER = 300;
const COSTE_COMIDA = 100;
const INGRESO_DIARIO_POR_SINGLE = 2;
const VALOR_STREAM_EUROS = 0.005;
const STREAMS_PICO_MIN = 500;
const STREAMS_PICO_MAX = 1500;
const STREAMS_SUELO_CATALOGO = 20;
const DIAS_CALENDARIO_INDUSTRIA = 100;
const PROBABILIDAD_LANZAMIENTO_INDUSTRIA = 0.2;
const BONUS_SEMANA_LIMPIA = 1.15;

const ARTISTAS_INDUSTRIA = [
  ...[
    "God Bunny",
    "Feid-o",
    "Rao Alejandro",
    "Mike Towers",
    "Amén AA",
    "Carol J",
    "J Calvin",
    "O-Zuna",
    "Mami Yankee",
    "Mal-humor",
    "San Arcángel",
    "Helado Carrión",
    "Bizco-Rap",
    "Zarzamora",
    "Duki-Chulo",
  ].map((nombre) => ({
    nombre,
    nivel: "Mundial",
    penalizacion: 0.85,
    diasFiltracion: 5,
  })),
  ...[
    "Quepedo",
    "Psyko",
    "Omar Valles",
    "Rels C",
    "Morao",
    "JC Virreyes",
    "Lola Violeta",
    "De-la-Plaza",
    "P-Teta",
    "Rafa-V",
    "Good Gyal",
    "Cruz Café",
    "Brian Mayores",
    "Day V",
    "Relámpago",
  ].map((nombre) => ({
    nombre,
    nivel: "Top España",
    penalizacion: 0.6,
    diasFiltracion: 5,
  })),
  ...[
    "Mvri",
    "Ralphie Chus",
    "Jim Legado",
    "Rusito",
    "Pegajoso M.A.",
    "Young Ternera",
    "Soto Guisa",
    "Benito Jr",
    "Nicky-Z",
    "Jaled",
    "Kaydy Caín",
    "Isidro B",
    "Humo",
    "Fuerte GZ",
    "FernandoPlaya",
    "Pro-K",
    "Ajax",
    "Follón",
    "Reciclado J",
    "Selección",
  ].map((nombre) => ({
    nombre,
    nivel: "Underground",
    penalizacion: 0.35,
    diasFiltracion: 2,
  })),
];

let calendarioIndustria = [];

const ITEMS_TIENDA = [
  {
    id: "mac-carton",
    nombre: "Mac de Cartón",
    categoria: "Portátiles",
    nivel: 1,
    bonusCalidad: 5,
    coste: 180,
    visual: "laptop",
    descripcion: "Arranca lento, pero ya no mezclas en el movil.",
  },
  {
    id: "portatil-avanzado",
    nombre: "Portátil Avanzado",
    categoria: "Portátiles",
    nivel: 2,
    bonusCalidad: 12,
    coste: 720,
    visual: "laptop",
    descripcion: "Renderiza sin rezar antes de exportar.",
  },
  {
    id: "mac-m4-pro-studio",
    nombre: "Mac M4 Pro Studio",
    categoria: "Portátiles",
    nivel: 3,
    bonusCalidad: 22,
    coste: 1900,
    visual: "laptop",
    descripcion: "El estudio deja de sonar a cyber de barrio.",
  },
  {
    id: "micro-auricular",
    nombre: "Micro de Auricular",
    categoria: "Micrófonos",
    nivel: 1,
    bonusCalidad: 3,
    coste: 45,
    visual: "mic",
    descripcion: "Cutre, pero mejor que gritarle al movil.",
  },
  {
    id: "micro-condensador",
    nombre: "Micro de Condensador",
    categoria: "Micrófonos",
    nivel: 2,
    bonusCalidad: 10,
    coste: 260,
    visual: "mic",
    descripcion: "La voz empieza a tener cuerpo y presencia.",
  },
  {
    id: "micro-valvular",
    nombre: "Micro de Estudio Valvular",
    categoria: "Micrófonos",
    nivel: 3,
    bonusCalidad: 20,
    coste: 1200,
    visual: "mic",
    descripcion: "Calor de estudio serio. Ya no hay excusas.",
  },
  {
    id: "altavoz-bluetooth",
    nombre: "Altavoz Bluetooth",
    categoria: "Altavoces",
    nivel: 1,
    bonusCalidad: 2,
    coste: 60,
    visual: "speaker",
    descripcion: "Para revisar bajos sin despertar a todo el bloque.",
  },
  {
    id: "monitores-5",
    nombre: "Monitores de Estudio 5",
    categoria: "Altavoces",
    nivel: 2,
    bonusCalidad: 8,
    coste: 340,
    visual: "speaker",
    descripcion: "Por fin oyes lo que realmente está pasando.",
  },
  {
    id: "monitores-premium",
    nombre: "Monitores Activos Premium",
    categoria: "Altavoces",
    nivel: 3,
    bonusCalidad: 16,
    coste: 980,
    visual: "speaker",
    descripcion: "La mezcla ya no se esconde detrás del humo.",
  },
  {
    id: "teclado-midi",
    nombre: "Teclado MIDI",
    categoria: "Instrumentos",
    nivel: 1,
    bonusCalidad: 5,
    coste: 130,
    visual: "keyboard",
    descripcion: "Melodias propias sin depender de loops quemados.",
  },
  {
    id: "akai-ritmos",
    nombre: "Caja de Ritmos AKAI",
    categoria: "Instrumentos",
    nivel: 2,
    bonusCalidad: 10,
    coste: 390,
    visual: "pads",
    descripcion: "Los drums empiezan a pegar en el pecho.",
  },
  {
    id: "paneles-acusticos",
    nombre: "Paneles Acústicos",
    categoria: "Instrumentos",
    nivel: 1,
    bonusCalidad: 4,
    coste: 95,
    visual: "panels",
    descripcion: "Menos eco de cuarto, más intención.",
  },
];

const TWEETS_HATERS = [
  "vaya puta mierda de mezcla bro, se nota que has grabado con el micro del singstar @microhondas69",
  "Mucho autotune y poca calle, vaya dolor de oidos. Borra el canal fiera @ElPrenda_99",
  "Este pibe se cree MDLR y no ha salido de su cuarto en tres años, que pereza de barras @DrillInstinct",
  "Vaya vendido de mierda, prefiere sonar en la radio que en el bloque. Te has vuelto comercial @LaMariii_mdlr",
  "El beat va por un lado y la voz por otro, parece que te esta dando un sincope @RaxetaPobre",
  "Le he puesto esto a mi abuela y me ha desheredado. Menudo truño @KinkiVibes",
];

const TWEETS_FANS = [
  "Buaaaa como rompe el bombo en la segunda estrofa, lo tengo en bucle en el coche 🔥 @TrapVikingo",
  "Este chaval esta infravalorado de cojones, vaya barras se acaba de soltar en el cuarto @ChicoDelParque",
  "Vaya duende tiene el estribillo hermano, se me han puesto los pelos de punta @GhettoVibes_",
  "Dejad de escuchar a los de siempre y metedle oido a esto, es el futuro de la escena @Zasko_MDLR",
  "Vaya barras mas crudas, por fin alguien que no canta lo mismo de siempre en el pop @PurezaUrbana",
];

const TWEETS_MEME = [
  "El tema es objetivamente una basura pero no puedo parar de cantarlo en la ducha ayuda @TrollDeBarrio",
  "Suena fatal pero tiene una vibra que te atrapa, nuevo himno del joseo jajaja @Lxs_99",
  "Es tan malo que se da la vuelta y se convierte en una obra maestra incomprendida @FreakDrill",
  "Mis ultimos tres registros neuronales se han destruido con este preview, pero me renta @Killo_MDLR",
];

const TWEETS_ESCENA = [
  "🔥 ALERTA: Se filtra un fragmento del nuevo beat de Mvri y suena a plugg futurista del espacio.",
  "¿Habeis visto las historias de Quepedo? Esta metido en el estudio con Bizco-Rap, se viene un terremoto mundial.",
  "El nuevo album de God Bunny ha colapsado los servidores de Spotify, la industria musical se ha parado por completo.",
  "Hype maximo: Ralphie Chus acaba de anunciar un concierto sorpresa en una azotea del centro esta tarde.",
  "Dilema en los foros de rap: ¿Se ha vendido Psyko al pop comercial o sigue manteniendo la esencia del bloque?",
];

const TRABAJOS = {
  burger: {
    nombre: "Camarero en un Burger",
    sueldo: [35, 35],
    fatiga: [25, 25],
    icono: "🍔",
    descripcion: "Turno de freidoras, bandejas y clientes con prisa.",
    boton: "Fichar burger",
  },
  pintor: {
    nombre: "Pintor de Pisos",
    sueldo: [58, 78],
    fatiga: [18, 30],
    icono: "🎨",
    descripcion: "Trabajo estable, pintura en la ropa y cero glamour.",
    boton: "Aceptar turno",
  },
  cajero: {
    nombre: "Cajero de Súper",
    sueldo: [42, 58],
    fatiga: [12, 22],
    icono: "🧾",
    descripcion: "Menos desgaste físico, más frases de “abre otra caja”.",
    boton: "Fichar",
  },
  repartidor: {
    nombre: "Repartidor en Bici",
    sueldo: [62, 88],
    fatiga: [24, 38],
    icono: "🚲",
    descripcion: "Rápido, rentable y con rodillas negociando su renuncia.",
    boton: "Salir a repartir",
  },
};

TRABAJOS.super = TRABAJOS.cajero;
TRABAJOS.rider = TRABAJOS.repartidor;

const eventosTrabajo = [
  {
    id: "cafe-taquillas",
    trabajos: ["general"],
    titulo: "El Café",
    texto: "Te estás durmiendo de pie al lado de las taquillas.",
    opcionA: {
      texto: "Gastar 2€ en café",
      resultado: "Te compras un café peleón de máquina. -2€, -20 fatiga.",
      aplicar: ({ contexto }) => {
        jugador.dinero -= 2;
        jugador.fatiga = limitar(jugador.fatiga - 20, 0, 100);
        return contexto;
      },
    },
    opcionB: {
      texto: "Ir zombi",
      resultado: "Has tirado el turno en modo zombi. +10 frustración y -15% sueldo hoy.",
      aplicar: ({ contexto }) => {
        jugador.frustracion = limitar(jugador.frustracion + 10, 0, 100);
        contexto.multiplicadorSueldo *= 0.85;
        return contexto;
      },
    },
  },
  {
    id: "cripto-colega",
    trabajos: ["general"],
    titulo: "El Cripto-Colega",
    texto: "Un compañero te está metiendo un tostón tremendo sobre criptomonedas y te ralla la cabeza.",
    opcionA: {
      texto: "Escucharle",
      resultado: "Le escuchas diez minutos eternos. +15 frustración.",
      aplicar: ({ contexto }) => {
        jugador.frustracion = limitar(jugador.frustracion + 15, 0, 100);
        return contexto;
      },
    },
    opcionB: {
      texto: "Mandarlo a pastar",
      resultado: "Le cortas el discurso, pero acabas cubriendo su zona. +2 respeto, +15 fatiga.",
      aplicar: ({ contexto }) => {
        jugador.respeto = limitar(jugador.respeto + 2, 1, 100);
        contexto.fatigaExtra += 15;
        return contexto;
      },
    },
  },
  {
    id: "burger-tiktoker",
    trabajos: ["burger"],
    titulo: "El TikToker",
    texto: "Un chaval subidito te graba con el móvil para un reto de redes mientras le sirves el pedido.",
    opcionA: {
      texto: "Sonreír",
      resultado: "Sonríes para no liarla. +5€ bonus, -3 respeto si te ve el barrio.",
      aplicar: ({ contexto }) => {
        contexto.sueldoExtra += 5;
        jugador.respeto = limitar(jugador.respeto - 3, 1, 100);
        return contexto;
      },
    },
    opcionB: {
      texto: "Tapar cámara",
      resultado: "Tapas la cámara y te plantas. +5 respeto, -15€ por queja.",
      aplicar: ({ contexto }) => {
        jugador.respeto = limitar(jugador.respeto + 5, 1, 100);
        contexto.sueldoExtra -= 15;
        return contexto;
      },
    },
  },
  {
    id: "burger-aceite",
    trabajos: ["burger"],
    titulo: "Aceite freidora",
    texto: "El mánager te pide estirar el aceite negro una semana más para recortar gastos.",
    opcionA: {
      texto: "Obedecer",
      resultado: "Obedeces y sales oliendo a fritanga industrial. +10€, +10 frustración.",
      aplicar: ({ contexto }) => {
        contexto.sueldoExtra += 10;
        jugador.frustracion = limitar(jugador.frustracion + 10, 0, 100);
        return contexto;
      },
    },
    opcionB: {
      texto: "Cambiarlo",
      resultado: "Cambias el aceite y te quedas con la conciencia limpia. +2 flow.",
      aplicar: ({ contexto }) => {
        jugador.flow = limitar(jugador.flow + 2, 1, 100);
        return contexto;
      },
    },
  },
  {
    id: "burger-borracho",
    trabajos: ["burger"],
    titulo: "El Cliente Borracho",
    texto: "Un grupo de mañaneo monta jaleo y te tira el refresco en la barra.",
    opcionA: {
      texto: "Limpiar y callar",
      resultado: "Limpias tragando rabia. +20 frustración, sueldo intacto.",
      aplicar: ({ contexto }) => {
        jugador.frustracion = limitar(jugador.frustracion + 20, 0, 100);
        return contexto;
      },
    },
    opcionB: {
      texto: "Cantarle las cuarenta con barras",
      resultado: "Le sueltas cuatro barras delante de todos. +4 respeto, -20€ por trifulca.",
      aplicar: ({ contexto }) => {
        jugador.respeto = limitar(jugador.respeto + 4, 1, 100);
        contexto.sueldoExtra -= 20;
        return contexto;
      },
    },
  },
  {
    id: "burger-nuggets",
    trabajos: ["burger"],
    titulo: "Chanchullo Nuggets",
    texto: "Van a tirar 4 cajas de nuggets buenos porque caducan mañana.",
    opcionA: {
      texto: "Robarlos en la mochila",
      resultado: "Metes nuggets en la mochila. Consigues Cena Gratis.",
      aplicar: ({ contexto }) => {
        jugador.inventario.push("Cena Gratis");
        if (Math.random() < 0.2) {
          contexto.sueldoExtra -= 10;
          jugador.frustracion = limitar(jugador.frustracion + 8, 0, 100);
          contexto.resultadoExtra = " El mánager casi te pilla: -10€ y +8 frustración.";
        }
        return contexto;
      },
    },
    opcionB: {
      texto: "Dejar que los tiren",
      resultado: "Ves comida buena acabar en la basura. +10 frustración.",
      aplicar: ({ contexto }) => {
        jugador.frustracion = limitar(jugador.frustracion + 10, 0, 100);
        return contexto;
      },
    },
  },
  {
    id: "rider-joseo",
    trabajos: ["repartidor"],
    titulo: "El Joseo",
    texto: "Un cliente te ofrece 20€ en mano si le llevas su pedido saltándote la ruta de la app.",
    opcionA: {
      texto: "Aceptar",
      resultado: "Aceptas el trato en mano. +20€ directos, pero la app recorta el resto del turno.",
      aplicar: ({ contexto }) => {
        contexto.sueldoExtra += 20;
        contexto.multiplicadorSueldo *= 0.6;
        return contexto;
      },
    },
    opcionB: {
      texto: "Rechazar",
      resultado: "Rechazas el lío. Sueldo base intacto.",
      aplicar: ({ contexto }) => contexto,
    },
  },
  {
    id: "rider-diluvio",
    trabajos: ["repartidor"],
    titulo: "El Diluvio",
    texto: "Graniza fuerte en Vallecas a mitad de entrega y vas empapado en la bici.",
    opcionA: {
      texto: "Aguantar",
      resultado: "Aguantas bajo el granizo. Sueldo íntegro, +35 fatiga.",
      aplicar: ({ contexto }) => {
        contexto.fatigaExtra += 35;
        return contexto;
      },
    },
    opcionB: {
      texto: "Cancelar pedido",
      resultado: "Cancelas y te comes la comida. -20 fatiga, -15€.",
      aplicar: ({ contexto }) => {
        jugador.fatiga = limitar(jugador.fatiga - 20, 0, 100);
        contexto.sueldoExtra -= 15;
        return contexto;
      },
    },
  },
  {
    id: "rider-pinchazo",
    trabajos: ["repartidor"],
    titulo: "El Pinchazo",
    texto: "La rueda trasera se queda en el chasis en un viaje con propina jugosa.",
    opcionA: {
      texto: "Parar a parchear",
      resultado: "Paras a parchear y pierdes el bonus de tiempo. -10€.",
      aplicar: ({ contexto }) => {
        contexto.sueldoExtra -= 10;
        return contexto;
      },
    },
    opcionB: {
      texto: "Seguir pedaleando a lo loco",
      resultado: "Sigues a lo loco. Sueldo completo, +30 fatiga extra, -5€ por la llanta.",
      aplicar: ({ contexto }) => {
        contexto.fatigaExtra += 30;
        contexto.sueldoExtra -= 5;
        return contexto;
      },
    },
  },
  {
    id: "rider-atico",
    trabajos: ["repartidor"],
    titulo: "El Ático de la Pija",
    texto: "Llevas un pedido enorme a un ático sin ascensor en zona rica y no hay cobertura.",
    opcionA: {
      texto: "Subir corriendo",
      resultado: "Subes como si hubiera cámaras. +25 fatiga, +5€ propina.",
      aplicar: ({ contexto }) => {
        contexto.fatigaExtra += 25;
        contexto.sueldoExtra += 5;
        return contexto;
      },
    },
    opcionB: {
      texto: "Dejarlo en el portal",
      resultado: "Lo dejas abajo y cae reseña de una estrella. -15€.",
      aplicar: ({ contexto }) => {
        contexto.sueldoExtra -= 15;
        return contexto;
      },
    },
  },
  {
    id: "super-hilo",
    trabajos: ["cajero"],
    titulo: "El Hilo Musical",
    texto: "Llevas 3 horas escuchando la misma canción pop comercial de los altavoces.",
    opcionA: {
      texto: "Auricular oculto con temas de Mvri",
      resultado: "Te pones un auricular escondido. +2 flow.",
      aplicar: ({ contexto }) => {
        jugador.flow = limitar(jugador.flow + 2, 1, 100);
        if (Math.random() < 0.3) {
          contexto.sueldoExtra -= 10;
          contexto.resultadoExtra = " Te pillan con el auricular: -10€ de multa.";
        }
        return contexto;
      },
    },
    opcionB: {
      texto: "Aguantar",
      resultado: "Aguantas el bucle pop. +20 frustración.",
      aplicar: ({ contexto }) => {
        jugador.frustracion = limitar(jugador.frustracion + 20, 0, 100);
        return contexto;
      },
    },
  },
  {
    id: "super-desastre",
    trabajos: ["cajero"],
    titulo: "El Desastre",
    texto: "Se rompe un palet de leche reponiendo el pasillo 3 y dejas todo encharcado.",
    opcionA: {
      texto: "Culpar al de prácticas",
      resultado: "Te escaqueas culpando al nuevo. -3 carisma por rata.",
      aplicar: ({ contexto }) => {
        jugador.carisma = limitar(jugador.carisma - 3, 1, 100);
        return contexto;
      },
    },
    opcionB: {
      texto: "Limpiar",
      resultado: "Limpias el desastre. +20 fatiga, almacén en paz.",
      aplicar: ({ contexto }) => {
        contexto.fatigaExtra += 20;
        return contexto;
      },
    },
  },
  {
    id: "super-hurto",
    trabajos: ["cajero"],
    titulo: "El Hurto",
    texto: "Pillas al chaval problemático del bloque metiéndose latas de Monster en los bolsillos.",
    opcionA: {
      texto: "Chivarte",
      resultado: "Avisas al encargado. +10€ bonus, -10 respeto por soplón.",
      aplicar: ({ contexto }) => {
        contexto.sueldoExtra += 10;
        jugador.respeto = limitar(jugador.respeto - 10, 1, 100);
        return contexto;
      },
    },
    opcionB: {
      texto: "Vista gorda y guiño",
      resultado: "Miras a otro lado. +5 respeto en las plazas.",
      aplicar: ({ contexto }) => {
        jugador.respeto = limitar(jugador.respeto + 5, 1, 100);
        if (Math.random() < 0.2) {
          contexto.sueldoExtra -= 10;
          contexto.resultadoExtra = " El encargado sospecha y te sanciona: -10€.";
        }
        return contexto;
      },
    },
  },
  {
    id: "super-sotano",
    trabajos: ["cajero"],
    titulo: "Inventario Sótano",
    texto: "Te mandan al sótano a contar latas tú solo, es una zona muerta sin cámaras.",
    opcionA: {
      texto: "Escribir barras en el bloc",
      resultado: "Aprovechas el sótano para escribir. +3 flow, -5€ por tardar.",
      aplicar: ({ contexto }) => {
        jugador.flow = limitar(jugador.flow + 3, 1, 100);
        contexto.sueldoExtra -= 5;
        return contexto;
      },
    },
    opcionB: {
      texto: "Contar rápido",
      resultado: "Terminas antes y sales menos reventado. -10 fatiga.",
      aplicar: ({ contexto }) => {
        jugador.fatiga = limitar(jugador.fatiga - 10, 0, 100);
        return contexto;
      },
    },
  },
];

const NPCS = {
  madre: {
    nombre: "Madre",
    avatar: "avatar-mother",
    handle: "@madreModoSerio",
  },
  rival: {
    nombre: "Rival del bloque",
    avatar: "avatar-rival",
    handle: "@rivalDelBloque",
  },
  manager: {
    nombre: "Mánager malo",
    avatar: "avatar-manager",
    handle: "@managerConCadena",
  },
  diseñador: {
    nombre: "Diseñador del barrio",
    avatar: "avatar-designer",
    handle: "@logoEnChandal",
  },
  crew: {
    nombre: "Tu crew",
    avatar: "avatar-crew",
    handle: "@losDeSiempre",
  },
  policia: {
    nombre: "Policía local",
    avatar: "avatar-police",
    handle: "@ruidoCero",
  },
};

const EVENTOS_ALEATORIOS = [
  {
    id: "beatRobado",
    contexto: "dia",
    probabilidad: 0.12,
    unico: true,
    activar: activarEventoBeatRobado,
  },
  {
    id: "truequeBarrio",
    contexto: "tarde",
    probabilidad: 0.14,
    unico: true,
    activar: activarEventoTruequeBarrio,
  },
  {
    id: "beefTwitter",
    contexto: "dia",
    probabilidad: 0.16,
    unico: false,
    activar: activarEventoBeefTwitter,
  },
  {
    id: "managerMalo",
    contexto: "dia",
    probabilidad: 0.1,
    unico: false,
    activar: activarEventoManagerMalo,
  },
  {
    id: "virusPlugins",
    contexto: "noche",
    probabilidad: 0.08,
    unico: false,
    activar: activarEventoVirusPlugins,
  },
];

const plantillasDMs = [
  {
    id: "dm-logo-barrio",
    inicial: true,
    remitente: "Diseñador del barrio",
    npc: "diseñador",
    avatarColor: "dm-green",
    mensaje: "Te hago un logo serio para redes si me pasas una base gratis. Trueque limpio, palabra.",
    minSeguidores: 0,
    respondido: false,
    opcionA: {
      texto: "Aceptar: producir su base esta tarde",
      consumeFranja: "tarde",
      fatiga: 25,
      aplicar: () => {
        agregarObjetoInventario("Logo Pro");
        jugador.modificadores.tiktok = Math.max(jugador.modificadores.tiktok, 1.15);
        jugador.estados.logoBarrio = true;
        registrarEvento({
          tipo: "positive",
          npc: "diseñador",
          titulo: "Logo Pro",
          texto: "Cediste la tarde de producción y recibiste Logo Pro. TikTok/Reels mejora +15% permanente.",
        });
      },
    },
    opcionB: {
      texto: "Pasar",
      aplicar: () => {
        jugador.respeto = limitar(jugador.respeto - 2, 1, 100);
        registrarEvento({
          tipo: "alert",
          npc: "diseñador",
          titulo: "Puerta cerrada",
          texto: "Pasaste del trueque. -2 respeto en el circuito del barrio.",
        });
      },
    },
  },
  {
    id: "dm-mama-comida",
    inicial: true,
    remitente: "Mamá",
    npc: "madre",
    avatarColor: "dm-gray",
    mensaje: "¿Has comido algo o solo has mezclado ese ruido?",
    minSeguidores: 0,
    respondido: false,
    opcionA: {
      texto: "Decirle que cenas",
      aplicar: () => {
        jugador.dinero -= 10;
        jugador.fatiga = limitar(jugador.fatiga - 20, 0, 100);
        registrarEvento({
          tipo: "positive",
          npc: "madre",
          titulo: "Cena decente",
          texto: "Gastaste 10€ en comer algo real. Fatiga -20.",
        });
      },
    },
    opcionB: {
      texto: "Ignorarla",
      aplicar: () => {
        jugador.frustracion = limitar(jugador.frustracion + 15, 0, 100);
        if (Math.random() < 0.5) jugador.estados.nocheBloqueadaFamiliar = true;
        registrarEvento({
          tipo: "alert",
          npc: "madre",
          titulo: "Mensaje ignorado",
          texto: "Frustración +15. Hay 50% de bronca familiar bloqueando la próxima noche de grabación.",
        });
      },
    },
  },
  {
    id: "dm-rival-demo",
    inicial: true,
    remitente: "Rival del bloque",
    npc: "rival",
    avatarColor: "dm-green",
    mensaje: "He oído tu demo. Casi me duermo, bro.",
    minSeguidores: 0,
    respondido: false,
    opcionA: {
      texto: "Beef en Twitter",
      consumeFranja: "tarde",
      fatiga: 0,
      aplicar: () => {
        sumarSeguidoresDirectos(200);
        jugador.frustracion = limitar(jugador.frustracion + 10, 0, 100);
        jugador.estados.beefActivo = true;
        agregarTweet("rival", "La demo esa necesita café. Mucho café.");
        registrarEvento({
          tipo: "positive",
          npc: "rival",
          titulo: "Beef de tarde",
          texto: "Entraste al beef, ganaste +200 seguidores por salseo y perdiste la tarde.",
        });
      },
    },
    opcionB: {
      texto: "Pasar y enfocarte",
      aplicar: () => {
        jugador.respeto = limitar(jugador.respeto - 5, 1, 100);
        jugador.estados.proximoSingleCalidadBonus += 2;
        registrarEvento({
          tipo: "positive",
          npc: "rival",
          titulo: "Enfoque frío",
          texto: "No entraste al trapo. -5 respeto, pero +2 calidad en el próximo single.",
        });
      },
    },
  },
  {
    id: "dm-policia-ruido",
    inicial: true,
    remitente: "Policía local",
    npc: "policia",
    avatarColor: "dm-blue",
    mensaje: "Vecinos reportan música alta. Último aviso.",
    minSeguidores: 0,
    respondido: false,
    opcionA: {
      texto: "Acatar y bajar volumen",
      aplicar: () => {
        jugador.estados.proximoSingleCalidadFactor = Math.min(jugador.estados.proximoSingleCalidadFactor, 0.9);
        jugador.estados.riesgoMultaRuido = false;
        registrarEvento({
          tipo: "alert",
          npc: "policia",
          titulo: "Volumen bajo",
          texto: "Evitas multas, pero el próximo single pierde 10% de calidad por no escuchar bien los graves.",
        });
      },
    },
    opcionB: {
      texto: "Ignorar aviso",
      aplicar: () => {
        jugador.estados.riesgoMultaRuido = true;
        registrarEvento({
          tipo: "alert",
          npc: "policia",
          titulo: "Riesgo de multa",
          texto: "Si grabas esta noche, hay 80% de probabilidad de multa inmediata de 150€.",
        });
      },
    },
  },
  {
    id: "dm-promotor-timador",
    remitente: "Promotor Timador",
    npc: "manager",
    avatarColor: "dm-gray",
    mensaje: "Tocas gratis en la nave de las afueras, no hay caché pero te ve mucha gente y vendes merchandising. ¿Te hace?",
    minSeguidores: 1500,
    respondido: false,
    opcionA: {
      texto: "Aceptar bolo gratis",
      aplicar: () => {
        sumarSeguidoresDirectos(300);
        jugador.fatiga = limitar(jugador.fatiga + 50, 0, 100);
        registrarEvento({ tipo: "positive", npc: "manager", titulo: "Bolo de nave", texto: "+300 seguidores, +50 fatiga, 0€ de caché." });
      },
    },
    opcionB: {
      texto: "Rechazar",
      aplicar: () => {
        jugador.respeto = limitar(jugador.respeto + 5, 1, 100);
        jugador.carisma = limitar(jugador.carisma - 1, 1, 100);
        registrarEvento({ tipo: "positive", npc: "manager", titulo: "Te haces valer", texto: "+5 respeto, -1 carisma temporal." });
      },
    },
  },
  {
    id: "dm-fan-bloque",
    remitente: "Fan del Bloque",
    npc: "crew",
    avatarColor: "dm-green",
    mensaje: "Hermano, tu último tema está sonando en los coches de toda mi crew. Sigue así de verdad.",
    minSeguidores: 100,
    respondido: false,
    opcionA: {
      texto: "Responder humilde",
      aplicar: () => {
        sumarSeguidoresDirectos(50);
        jugador.carisma = limitar(jugador.carisma + 2, 1, 100);
        registrarEvento({ tipo: "positive", npc: "crew", titulo: "Humildad rentable", texto: "+50 seguidores y +2 carisma." });
      },
    },
    opcionB: {
      texto: "Ir de divo / ignorar",
      aplicar: () => {
        jugador.frustracion = limitar(jugador.frustracion - 5, 0, 100);
        jugador.seguidores = Math.max(0, jugador.seguidores - 20);
        registrarEvento({ tipo: "alert", npc: "crew", titulo: "Divo detectado", texto: "-5 frustración, pero -20 seguidores por creído." });
      },
    },
  },
  {
    id: "dm-joseo-plaza",
    remitente: "Colega de la plaza",
    npc: "crew",
    avatarColor: "dm-gray",
    mensaje: "Oye, tengo que mover unos paquetes y me falta un repartidor esta tarde. Te doy 80€ limpios si me haces el favor rápido.",
    minSeguidores: 0,
    respondido: false,
    opcionA: {
      texto: "Hacer el joseo",
      consumeFranja: "tarde",
      fatiga: 30,
      aplicar: () => {
        jugador.dinero += 80;
        if (Math.random() < 0.3) {
          jugador.dinero -= 200;
          jugador.respeto = limitar(jugador.respeto - 20, 1, 100);
          registrarEvento({ tipo: "alert", npc: "policia", titulo: "Te pilló la policía", texto: "+80€, pero multa -200€ y -20 respeto." });
        } else {
          registrarEvento({ tipo: "positive", npc: "crew", titulo: "Joseo rápido", texto: "+80€ limpios. Esta vez salió bien." });
        }
      },
    },
    opcionB: {
      texto: "Quedarte writing",
      aplicar: () => {
        jugador.flow = limitar(jugador.flow + 2, 1, 100);
        registrarEvento({ tipo: "positive", npc: "crew", titulo: "Writing", texto: "Te quedaste escribiendo. Flow +2." });
      },
    },
  },
  {
    id: "dm-pirata-plugins",
    remitente: "Pirata de Plugins",
    npc: "manager",
    avatarColor: "dm-blue",
    mensaje: "Tengo el crack del último pack de plugins y el Autotune pro. Te lo paso por 15€ o a cambio de una mención en tu Twitter.",
    minSeguidores: 0,
    respondido: false,
    opcionA: {
      texto: "Mención gratis",
      aplicar: () => {
        jugador.estados.proximoSingleCalidadBonus += 5;
        jugador.seguidores = Math.max(0, jugador.seguidores - 50);
        agregarTweet("manager", "Plugin pack recomendado por Young Vecino. Link nada sospechoso.");
        registrarEvento({ tipo: "alert", npc: "manager", titulo: "Spam en el feed", texto: "+5 calidad próximo single, pero -50 seguidores por spam." });
      },
    },
    opcionB: {
      texto: "Pagar 15€",
      aplicar: () => {
        jugador.dinero -= 15;
        jugador.produccion = limitar(jugador.produccion + 5, 1, 100);
        registrarEvento({ tipo: "positive", npc: "manager", titulo: "Plugins limpios", texto: "-15€, Producción +5." });
      },
    },
  },
  {
    id: "dm-rapero-derechos",
    remitente: "Rapero Con Nombre",
    npc: "rival",
    avatarColor: "dm-gray",
    mensaje: "Oye bro, me flipa la base que subiste a redes. Te doy 100€ ya por ella si me la cedes en exclusiva y me quedo yo con el 100% de los derechos de autor.",
    minSeguidores: 500,
    respondido: false,
    opcionA: {
      texto: "Vender en exclusiva",
      aplicar: () => {
        jugador.dinero += 100;
        jugador.respeto = limitar(jugador.respeto - 10, 1, 100);
        jugador.ingresosPasivosStreams = 0;
        registrarEvento({ tipo: "alert", npc: "rival", titulo: "Derechos vendidos", texto: "+100€, -10 respeto y streams pasivos a 0€." });
      },
    },
    opcionB: {
      texto: "Exigir créditos",
      aplicar: () => {
        jugador.respeto = limitar(jugador.respeto + 5, 1, 100);
        jugador.flow = limitar(jugador.flow + 3, 1, 100);
        registrarEvento({ tipo: "positive", npc: "rival", titulo: "Créditos o nada", texto: "+5 respeto y +3 flow. Sin los 100€." });
      },
    },
  },
  {
    id: "dm-colabo-pesado",
    remitente: "Chaval Pesado de las Plazas",
    npc: "crew",
    avatarColor: "dm-green",
    mensaje: "Buenas fiera, estoy armando mi primera maqueta y necesito un colabo tuyo cantando en el estribillo. No tengo un duro pero nos apoyamos entre los del barrio, ¿sale?",
    minSeguidores: 0,
    respondido: false,
    opcionA: {
      texto: "Grabar colabo gratis esta tarde",
      consumeFranja: "tarde",
      fatiga: 25,
      aplicar: () => {
        sumarSeguidoresDirectos(30);
        jugador.carisma = limitar(jugador.carisma + 2, 1, 100);
        jugador.singleProgreso = 0;
        jugador.trabajandoEnSingle = false;
        registrarEvento({ tipo: "positive", npc: "crew", titulo: "Colabo de plaza", texto: "Consumes la tarde entera. +30 seguidores, +2 carisma y tu single propio vuelve a 0/3." });
      },
    },
    opcionB: {
      texto: "Darle largas",
      aplicar: () => {
        jugador.frustracion = limitar(jugador.frustracion - 5, 0, 100);
        jugador.respeto = limitar(jugador.respeto - 3, 1, 100);
        registrarEvento({ tipo: "alert", npc: "crew", titulo: "Largas", texto: "-5 frustración, -3 respeto en los bancos." });
      },
    },
  },
  {
    id: "dm-copyright",
    remitente: "Notificación Automática de la Red",
    npc: "policia",
    avatarColor: "dm-blue",
    mensaje: "⚠️ AVISO DE COPYRIGHT: El algoritmo ha detectado un sample no autorizado en tu última producción. Borra el tema o comparte las regalías con el autor original.",
    minSeguidores: 1000,
    respondido: false,
    opcionA: {
      texto: "Compartir regalías",
      aplicar: () => {
        jugador.ingresosPasivosStreams = Math.floor(jugador.ingresosPasivosStreams / 2);
        registrarEvento({ tipo: "alert", npc: "policia", titulo: "Regalías compartidas", texto: "Streams pasivos reducidos un 50%, pero mantienes seguidores." });
      },
    },
    opcionB: {
      texto: "Ignorar y jugártela",
      aplicar: () => {
        if (Math.random() < 0.4) {
          jugador.estados.copyrightStrikeDia = jugador.diaActual + numeroAleatorio(1, 5);
          registrarEvento({ tipo: "alert", npc: "policia", titulo: "Riesgo de strike", texto: "Puede caer un strike en los próximos 5 días." });
        } else {
          registrarEvento({ tipo: "positive", npc: "policia", titulo: "Te la jugaste", texto: "Mantienes el 100% de streams. De momento no ha saltado el strike." });
        }
      },
    },
  },
];

const jugador = {
  rol: "Cantante/Productor",
  dinero: 150,
  seguidores: 0,
  fatiga: 0,
  frustracion: 0,
  produccion: 1,
  flow: 1,
  carisma: 1,
  respeto: 1,
  singlesLanzados: 0,
  ingresosPasivosStreams: 0,
  biblioteca: [],
  totalStreamsHistoricos: 0,
  ingresosDiariosActuales: 0,
  proximoIdCancion: 1,
  singleProgreso: 0,
  trabajandoEnSingle: false,
  modificadores: {
    tiktok: 1,
  },
  estados: {
    enemigos: [],
    lesionDias: 0,
    nocheTrabajoSingle: false,
    tardeOcupada: false,
    beefActivo: false,
    truequePendiente: false,
    logoBarrio: false,
    nocheBloqueadaFamiliar: false,
    riesgoMultaRuido: false,
    proximoSingleCalidadBonus: 0,
    proximoSingleCalidadFactor: 1,
    copyrightStrikeDia: null,
  },
  dmsActivos: [],
  eventosVistos: [],
  diaActual: 1,
  franjaActual: "manana",
  puntosTarde: 0,
  inventario: ["Móvil Viejo"],
  tiendaActiva: [],
  trabajoSeleccionado: "pintor",
  trabajoActual: "pintor",
  dilemaTrabajoActivo: null,
  accionesUsadas: {
    reelsDia: null,
    produccionDia: null,
    flowDia: null,
    singleDia: null,
    batallaDia: null,
    beefDia: null,
    siestaDia: null,
  },
  faseBloqueada: false,
  gameOver: false,
};

const dom = {
  navButtons: document.querySelectorAll(".nav-item"),
  tabScreens: document.querySelectorAll(".tab-screen"),
  timeChips: document.querySelectorAll(".time-chip"),
  statDia: document.querySelector("#stat-dia"),
  statDinero: document.querySelector("#stat-dinero"),
  statFatiga: document.querySelector("#stat-fatiga"),
  statFrustracion: document.querySelector("#stat-frustracion"),
  statSeguidores: document.querySelector("#stat-seguidores"),
  statPuntosTarde: document.querySelector("#stat-puntos-tarde"),
  musicStats: document.querySelector("#musicStats"),
  statProduccion: document.querySelector("#stat-produccion"),
  statFlow: document.querySelector("#stat-flow"),
  statCarisma: document.querySelector("#stat-carisma"),
  statRespeto: document.querySelector("#stat-respeto"),
  barFatiga: document.querySelector("#bar-fatiga"),
  barFrustracion: document.querySelector("#bar-frustracion"),
  barSeguidores: document.querySelector("#bar-seguidores"),
  barPuntosTarde: document.querySelector("#bar-puntos-tarde"),
  barProduccion: document.querySelector("#bar-produccion"),
  barFlow: document.querySelector("#bar-flow"),
  barCarisma: document.querySelector("#bar-carisma"),
  barRespeto: document.querySelector("#bar-respeto"),
  followersGoal: document.querySelector("#followersGoal"),
  storyTitle: document.querySelector("#story-title"),
  storyBody: document.querySelector("#story-body"),
  advanceTimeBtn: document.querySelector("#advanceTimeBtn"),
  reelsActionBtn: document.querySelector("#reelsActionBtn"),
  napActionBtn: document.querySelector("#napActionBtn"),
  trainProductionBtn: document.querySelector("#trainProductionBtn"),
  trainFlowBtn: document.querySelector("#trainFlowBtn"),
  releaseSingleBtn: document.querySelector("#releaseSingleBtn"),
  battleActionBtn: document.querySelector("#battleActionBtn"),
  beefResponseBtn: document.querySelector("#beefResponseBtn"),
  singleProjectStatus: document.querySelector("#singleProjectStatus"),
  barSingleProgreso: document.querySelector("#bar-single-progreso"),
  simulatedWeekday: document.querySelector("#simulatedWeekday"),
  industryCalendarList: document.querySelector("#industryCalendarList"),
  eventFeed: document.querySelector("#eventFeed"),
  dmList: document.querySelector("#mensajes-directos"),
  dmDecisionModal: document.querySelector("#dmDecisionModal"),
  twitterFeed: document.querySelector("#twitterFeed"),
  libraryList: document.querySelector("#libraryList"),
  shopGrid: document.querySelector("#shopGrid"),
  jobList: document.querySelector("#jobList"),
  workButtons: document.querySelectorAll("[data-work]"),
  shopCards: document.querySelectorAll("[data-item]"),
};

function numeroAleatorio(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function limitar(valor, min, max) {
  return Math.max(min, Math.min(max, valor));
}

function formatearNumero(valor) {
  return new Intl.NumberFormat("es-ES").format(valor);
}

function formatearEuros(valor) {
  const numero = Number(valor);
  if (!Number.isFinite(numero)) return "0€";
  if (Number.isInteger(numero)) return `${formatearNumero(numero)}€`;
  return `${numero.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}€`;
}

function mezclarArray(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

function elegirAleatorios(array, cantidad) {
  return mezclarArray(array).slice(0, cantidad);
}

function obtenerMultiplicadorSeguidores() {
  if (jugador.seguidores >= 3000) return 3;
  if (jugador.seguidores >= 500) return 2;
  return 1;
}

function obtenerNombreEtapa() {
  if (jugador.seguidores >= 3000) return "Etapa C · Algoritmo x3";
  if (jugador.seguidores >= 500) return "Etapa B · Comunidad x2";
  return "Etapa A · Boca a boca x1";
}

function ganarSeguidores(cantidadBase, motivo = "Nueva gente llegó al perfil.") {
  if (jugador.faseBloqueada || jugador.gameOver) return 0;

  const multiplicador = obtenerMultiplicadorSeguidores();
  const seguidoresGanados = Math.round(cantidadBase * multiplicador);
  jugador.seguidores = limitar(jugador.seguidores + seguidoresGanados, 0, OBJETIVO_SEGUIDORES);

  registrarEvento({
    tipo: "positive",
    titulo: `+${formatearNumero(seguidoresGanados)} seguidores`,
    texto: `${motivo} ${obtenerNombreEtapa()}.`,
  });

  verificarProgreso();
  renderizarEstado();
  return seguidoresGanados;
}

function aplicarMultiplicadorCarisma(cantidadBase) {
  return Math.max(1, Math.round(cantidadBase * (1 + jugador.carisma / 100)));
}

function aplicarModificadorTikTok(cantidadBase) {
  return Math.max(1, Math.round(cantidadBase * jugador.modificadores.tiktok));
}

function esViernesSimulado(dia) {
  return dia % 7 === 5;
}

function obtenerDiaSemanaSimulado(dia) {
  const dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
  return dias[(dia - 1) % 7];
}

function generarCalendarioIndustria() {
  calendarioIndustria = [];

  for (let dia = 1; dia <= DIAS_CALENDARIO_INDUSTRIA; dia += 1) {
    if (!esViernesSimulado(dia)) continue;
    if (Math.random() > PROBABILIDAD_LANZAMIENTO_INDUSTRIA) continue;

    const artista = ARTISTAS_INDUSTRIA[numeroAleatorio(0, ARTISTAS_INDUSTRIA.length - 1)];
    calendarioIndustria.push({
      dia,
      artista: artista.nombre,
      nivel: artista.nivel,
      penalizacion: artista.penalizacion,
      diasFiltracion: artista.diasFiltracion,
      lanzamiento: generarTipoLanzamiento(artista.nivel),
    });
  }

  return calendarioIndustria;
}

function generarTipoLanzamiento(nivel) {
  const tipos = nivel === "Mundial" ? ["Single global", "Álbum sorpresa", "Colaboración bomba"] : ["Single", "EP", "Colaboración"];
  return tipos[numeroAleatorio(0, tipos.length - 1)];
}

function iniciarFranjaTarde() {
  jugador.puntosTarde = 3;
  jugador.estados.tardeOcupada = false;
}

function sincronizarEstadoTarde() {
  jugador.estados.tardeOcupada = jugador.franjaActual === "tarde" && jugador.puntosTarde < 3;
}

function puedeGastarPuntoTarde() {
  if (!puedeActuar("tarde")) return false;

  if (jugador.puntosTarde <= 0) {
    mostrarMensaje("Tarde agotada", "Ya no te quedan puntos de acción esta tarde.", "alert");
    return false;
  }

  return true;
}

function gastarPuntoTarde(motivo = "Actividad de tarde") {
  if (!puedeGastarPuntoTarde()) return false;

  jugador.puntosTarde = Math.max(0, jugador.puntosTarde - 1);
  sincronizarEstadoTarde();

  if (jugador.puntosTarde === 0) {
    finalizarTardePorAgotamiento(motivo);
  }

  return true;
}

function finalizarTardePorAgotamiento(motivo) {
  if (jugador.franjaActual !== "tarde") return;

  jugador.puntosTarde = 0;
  jugador.estados.tardeOcupada = true;
  jugador.franjaActual = "noche";
  registrarEvento({
    tipo: "alert",
    titulo: "Tarde agotada",
    texto: `${motivo}. Has gastado tus 3 puntos de acción y el día salta a la noche.`,
  });
}

function consumirTardeCompleta(motivo = "Petición del barrio") {
  if (!puedeGastarPuntoTarde()) return false;

  jugador.puntosTarde = 0;
  jugador.estados.tardeOcupada = true;
  jugador.accionesUsadas.reelsDia = jugador.diaActual;
  jugador.accionesUsadas.batallaDia = jugador.diaActual;
  jugador.accionesUsadas.produccionDia = jugador.diaActual;
  jugador.accionesUsadas.flowDia = jugador.diaActual;
  jugador.accionesUsadas.siestaDia = jugador.diaActual;
  jugador.franjaActual = "noche";
  registrarEvento({
    tipo: "alert",
    titulo: "Tarde consumida",
    texto: `${motivo}. La petición se come toda la tarde y ya estás en la noche.`,
  });
  return true;
}

function ejecutarRuletaAlgoritmo() {
  if (!puedeGastarPuntoTarde()) return;
  if (jugador.accionesUsadas.reelsDia === jugador.diaActual) {
    mostrarMensaje("Clip ya subido", "Hoy ya quemaste el algoritmo. Déjalo respirar.", "alert");
    return;
  }

  jugador.accionesUsadas.reelsDia = jugador.diaActual;
  gastarPuntoTarde("Subiste un TikTok/Reels");

  const tirada = Math.random();
  jugador.frustracion = limitar(jugador.frustracion + numeroAleatorio(3, 9), 0, 100);

  if (tirada < 0.4) {
    const base = numeroAleatorio(2, 5);
    const baseConCarisma = aplicarModificadorTikTok(aplicarMultiplicadorCarisma(base));
    ganarSeguidores(baseConCarisma, "Has entrado en shadowban. Solo te ven tus tres amigos del banco.");
    mostrarMensaje("Shadowban", "Solo te ven tus tres amigos del banco.", "alert");
    return;
  }

  if (tirada < 0.9) {
    const base = numeroAleatorio(80, 150);
    const baseConCarisma = aplicarModificadorTikTok(aplicarMultiplicadorCarisma(base));
    ganarSeguidores(baseConCarisma, "Buen alcance: los fans comparten tus barras.");
    mostrarMensaje(
      "Buen alcance",
      `El clip respira. Carisma convierte ${base} en ${baseConCarisma} antes de la bola de nieve.`,
      "positive",
    );
    return;
  }

  const base = numeroAleatorio(1000, 1800);
  const baseConCarisma = aplicarModificadorTikTok(aplicarMultiplicadorCarisma(base));
  ganarSeguidores(baseConCarisma, "¡VIRAL! El algoritmo acaba de mirar hacia tu bloque.");
  dispararAlertaViral(baseConCarisma);
}

function entrenarProduccion() {
  if (!puedeEntrenar("produccion")) return;

  jugador.produccion = limitar(jugador.produccion + 2, 1, 100);
  jugador.fatiga = limitar(jugador.fatiga + 15, 0, 100);
  jugador.accionesUsadas.produccionDia = jugador.diaActual;
  gastarPuntoTarde("Entrenaste producción");

  registrarEvento({
    tipo: "positive",
    titulo: "Producción +2",
    texto: "Horas peleando con el beat. Suena menos demo y más amenaza.",
  });
  renderizarEstado();
}

function entrenarFlow() {
  if (!puedeEntrenar("flow")) return;

  jugador.flow = limitar(jugador.flow + 2, 1, 100);
  jugador.fatiga = limitar(jugador.fatiga + 15, 0, 100);
  jugador.accionesUsadas.flowDia = jugador.diaActual;
  gastarPuntoTarde("Entrenaste flow");

  registrarEvento({
    tipo: "positive",
    titulo: "Flow +2",
    texto: "Repetiste barras hasta que dejaron de pedir permiso.",
  });
  renderizarEstado();
}

function puedeEntrenar(tipo) {
  if (!puedeGastarPuntoTarde()) return false;

  const claveUso = tipo === "produccion" ? "produccionDia" : "flowDia";
  if (jugador.accionesUsadas[claveUso] === jugador.diaActual) {
    mostrarMensaje("Entreno completado", "Hoy ya hiciste ese entrenamiento. Mañana más.", "alert");
    return false;
  }

  if (jugador.fatiga >= 95) {
    mostrarMensaje("Fatiga crítica", "No entra más aprendizaje: tu cuerpo está negociando la baja.", "alert");
    return false;
  }

  return true;
}

function trabajarEnSingle() {
  if (!puedeActuar("noche")) return;

  if (jugador.estados.nocheBloqueadaFamiliar) {
    jugador.estados.nocheBloqueadaFamiliar = false;
    jugador.accionesUsadas.singleDia = jugador.diaActual;
    registrarEvento({
      tipo: "alert",
      npc: "madre",
      titulo: "Noche bloqueada",
      texto: "La bronca familiar te cortó la sesión. Hoy no se graba.",
    });
    renderizarEstado();
    return;
  }

  if (jugador.accionesUsadas.singleDia === jugador.diaActual) {
    mostrarMensaje("Sesión ya hecha", "Hoy ya trabajaste este single. La siguiente vuelta toca otra noche.", "alert");
    return;
  }

  if (jugador.fatiga >= 90) {
    mostrarMensaje("Demasiada fatiga", "Con esa fatiga no sale ni la intro. Baja revoluciones.", "alert");
    registrarEvento({
      tipo: "alert",
      titulo: "Sesión cancelada",
      texto: "Fatiga superior a 90. Mejor dormir que grabar una desgracia.",
    });
    return;
  }

  if (!jugador.trabajandoEnSingle) {
    jugador.trabajandoEnSingle = true;
    jugador.singleProgreso = 0;
  }

  jugador.singleProgreso = limitar(jugador.singleProgreso + 1, 0, 3);
  jugador.fatiga = limitar(jugador.fatiga + 25, 0, 100);
  jugador.accionesUsadas.singleDia = jugador.diaActual;
  jugador.estados.nocheTrabajoSingle = true;
  comprobarDramaFamiliarPorRuido();
  comprobarMultaPoliciaPorRuido();
  manejarEventosAleatorios("noche");

  if (jugador.singleProgreso < 3) {
    const textoProgreso =
      jugador.singleProgreso === 1
        ? "Has empezado a componer y grabar un nuevo single. Progreso: 1/3 noches."
        : `Has vuelto al cuarto a seguir puliendo el single. Progreso: ${jugador.singleProgreso}/3 noches.`;

    registrarEvento({
      tipo: "positive",
      titulo: "Sesión de single",
      texto: textoProgreso,
    });
    mostrarMensaje("Single en marcha", `Progreso: ${jugador.singleProgreso}/3 noches.`, "positive");
    renderizarEstado();
    return;
  }

  guardarTemaInedito();
}

function comprobarDramaFamiliarPorRuido() {
  const tieneAuriculares =
    jugador.inventario.includes("Auriculares de Estudio") || jugador.inventario.includes("Auriculares");

  if (tieneAuriculares || Math.random() > 0.4) return;

  if (Math.random() < 0.5) {
    jugador.dinero -= 30;
    registrarEvento({
      tipo: "alert",
      npc: "madre",
      titulo: "Bronca por los bajos",
      texto: "La familia no aguanta más vibración en la pared. Multa vecinal improvisada: -30€.",
    });
    agregarDM("madre", "Como vuelva a temblar el vaso de la cocina, te grabo yo a ti una denuncia.");
  } else {
    jugador.frustracion = limitar(jugador.frustracion + 18, 0, 100);
    registrarEvento({
      tipo: "alert",
      npc: "madre",
      titulo: "Drama familiar",
      texto: "Te cortaron la sesión a mitad de toma. La motivación se fue al sofá. +18 frustración.",
    });
    agregarDM("madre", "No es que no crea en ti, es que son las dos de la mañana.");
  }
}

function comprobarMultaPoliciaPorRuido() {
  if (!jugador.estados.riesgoMultaRuido) return;
  jugador.estados.riesgoMultaRuido = false;

  if (Math.random() > 0.8) return;

  jugador.dinero -= 150;
  registrarEvento({
    tipo: "alert",
    npc: "policia",
    titulo: "Multa por ruido",
    texto: "Ignoraste el aviso y grabaste de noche. Multa inmediata: -150€.",
  });
  agregarDM("policia", "Te lo dije: último aviso no significaba barra libre.");
}

function manejarEventosAleatorios(contexto) {
  if (jugador.gameOver || jugador.faseBloqueada) return;

  const eventosDisponibles = EVENTOS_ALEATORIOS.filter((evento) => {
    if (evento.contexto !== contexto) return false;
    if (evento.unico && jugador.eventosVistos.includes(evento.id)) return false;
    return true;
  });

  for (const evento of eventosDisponibles.sort(() => Math.random() - 0.5)) {
    if (Math.random() > evento.probabilidad) continue;
    jugador.eventosVistos.push(evento.id);
    evento.activar();
    return;
  }
}

function activarEventoBeatRobado() {
  agregarDM("rival", "Bro, ¿me vendes una base cantada por ti? Te doy 20€ ahora y te pongo créditos.");
  registrarEvento({
    tipo: "alert",
    npc: "rival",
    titulo: "Beat Robado",
    texto:
      "Vendiste una base cantada por ti por 20€. Semanas después el tema se pegó localmente y te borraron de los créditos.",
    acciones: [
      {
        id: "beat-twitter",
        texto: "Escracharlo en Twitter",
        resolver: resolverBeatRobadoTwitter,
      },
      {
        id: "beat-crew",
        texto: "Encararlo con tu crew",
        resolver: resolverBeatRobadoCrew,
      },
      {
        id: "beat-aguantar",
        texto: "Aguantar y tragar rabia",
        resolver: resolverBeatRobadoAguantar,
      },
    ],
  });
}

function resolverBeatRobadoTwitter() {
  jugador.carisma = limitar(jugador.carisma + 4, 1, 100);
  agregarEnemigo("Rival del bloque");
  ganarSeguidores(numeroAleatorio(160, 320), "El drama del beat robado se movió por Twitter.");
  agregarTweet("rival", "A algunos les duele que uno brille. Los créditos son para quien rompe, no para quien llora.");
  registrarEvento({
    tipo: "positive",
    npc: "rival",
    titulo: "Drama rentable",
    texto: "Lo escrachaste. Suben seguidores y carisma, pero ahora tienes un enemigo pendiente.",
  });
}

function resolverBeatRobadoCrew() {
  if (jugador.respeto > 30) {
    jugador.dinero += 100;
    jugador.respeto = limitar(jugador.respeto + 3, 1, 100);
    registrarEvento({
      tipo: "positive",
      npc: "crew",
      titulo: "Respeto cobrado",
      texto: "Tu crew apretó lo justo. Recuperaste 100€ en negro y el bloque tomó nota.",
    });
    return;
  }

  aplicarLesion("La conversación se torció. Lesión: fatiga al 100% durante 3 días.");
}

function resolverBeatRobadoAguantar() {
  jugador.frustracion = limitar(jugador.frustracion + 30, 0, 100);
  registrarEvento({
    tipo: "alert",
    npc: "rival",
    titulo: "Rabia guardada",
    texto: "No hiciste ruido. La frustración creativa sube +30 y el orgullo se queda masticando cristal.",
  });
  renderizarEstado();
}

function activarEventoTruequeBarrio() {
  agregarDM("diseñador", "Te hago un logo serio para redes si me pasas una base gratis. Trueque limpio, palabra.");
  registrarEvento({
    tipo: "positive",
    npc: "diseñador",
    titulo: "Trueque del Barrio",
    texto: "Un diseñador de ropa te pide una base gratis. Si aceptas, la próxima noche queda ocupada produciendo para él.",
    acciones: [
      {
        id: "trueque-aceptar",
        texto: "Aceptar trueque",
        resolver: aceptarTruequeBarrio,
      },
      {
        id: "trueque-pasar",
        texto: "Pasar del trato",
        resolver: () => {
          registrarEvento({
            tipo: "alert",
            npc: "diseñador",
            titulo: "Trueque rechazado",
            texto: "Dijiste que no. Sin logo gratis, pero tu noche sigue siendo tuya.",
          });
        },
      },
    ],
  });
}

function aceptarTruequeBarrio() {
  jugador.estados.truequePendiente = true;
  registrarEvento({
    tipo: "positive",
    npc: "diseñador",
    titulo: "Trueque aceptado",
    texto: "La próxima noche producirás para él. Si cumples, tus redes ganarán un logo que mejora TikTok +15%.",
  });
  renderizarEstado();
}

function completarTruequeBarrio() {
  if (!jugador.estados.truequePendiente) return false;

  jugador.estados.truequePendiente = false;
  jugador.estados.logoBarrio = true;
  jugador.modificadores.tiktok = Math.max(jugador.modificadores.tiktok, 1.15);
  jugador.fatiga = limitar(jugador.fatiga + 25, 0, 100);
  jugador.accionesUsadas.singleDia = jugador.diaActual;

  registrarEvento({
    tipo: "positive",
    npc: "diseñador",
    titulo: "Logo del barrio",
    texto: "Gastaste la noche produciendo para él. Te hizo un logo profesional: TikTok/Reels gana +15% permanente.",
  });
  agregarTweet("diseñador", "Nuevo logo para Young Vecino. Ahora sí parece que factura.");
  return true;
}

function activarEventoBeefTwitter() {
  if (jugador.estados.beefActivo) return;

  jugador.estados.beefActivo = true;
  agregarTweet("rival", "Hay gente que confunde grabar de noche con hacer música. No miro a nadie.");
  registrarEvento({
    tipo: "alert",
    npc: "rival",
    titulo: "Beef en Twitter",
    texto: "Un rival te tiró una pulla pública. Puedes usar una noche para grabar una tiradera.",
  });
  renderizarEstado();
}

function activarEventoManagerMalo() {
  agregarDM("manager", "Tengo playlist, estudio y contactos. Dame 80€ y te pongo fino esta semana.");
  registrarEvento({
    tipo: "alert",
    npc: "manager",
    titulo: "Mánager Malo",
    texto: "Un supuesto mánager ofrece empujarte por 80€. Huele a humo con perfume caro.",
    acciones: [
      {
        id: "manager-pagar",
        texto: "Pagar 80€",
        resolver: resolverManagerMaloPagar,
      },
      {
        id: "manager-ignorar",
        texto: "Ignorarlo",
        resolver: () => {
          jugador.respeto = limitar(jugador.respeto + 1, 1, 100);
          registrarEvento({
            tipo: "positive",
            npc: "manager",
            titulo: "Olfato de calle",
            texto: "No soltaste dinero. +1 respeto por detectar humo a distancia.",
          });
          renderizarEstado();
        },
      },
    ],
  });
}

function resolverManagerMaloPagar() {
  if (jugador.dinero < 80) {
    registrarEvento({
      tipo: "alert",
      npc: "manager",
      titulo: "Ni para el timo",
      texto: "No tenías 80€. El mánager te dejó en visto, que quizá era lo mejor.",
    });
    return;
  }

  jugador.dinero -= 80;
  if (Math.random() < 0.25) {
    ganarSeguidores(numeroAleatorio(90, 180), "La playlist dudosa funcionó por accidente.");
    registrarEvento({
      tipo: "positive",
      npc: "manager",
      titulo: "Humo con chispa",
      texto: "Pagaste 80€. Contra todo pronóstico, algo de gente llegó.",
    });
  } else {
    jugador.frustracion = limitar(jugador.frustracion + 15, 0, 100);
    registrarEvento({
      tipo: "alert",
      npc: "manager",
      titulo: "Timo confirmado",
      texto: "Pagaste 80€ y desapareció. +15 frustración, -80€ y una lección escrita en neón.",
    });
  }
  renderizarEstado();
}

function activarEventoVirusPlugins() {
  if (jugador.inventario.includes("Portátil Bueno")) return;

  jugador.frustracion = limitar(jugador.frustracion + 12, 0, 100);
  jugador.dinero = Math.max(0, jugador.dinero - 20);
  registrarEvento({
    tipo: "alert",
    npc: "manager",
    titulo: "Virus por plugins piratas",
    texto: "Bajaste un compresor mágico de una web sospechosa. Limpieza del portátil: -20€, +12 frustración.",
  });
  renderizarEstado();
}

function batallaGallos() {
  if (!puedeGastarPuntoTarde()) return;
  if (jugador.accionesUsadas.batallaDia === jugador.diaActual) {
    mostrarMensaje("Batalla ya hecha", "El parque ya tuvo suficiente show por hoy.", "alert");
    return;
  }

  jugador.accionesUsadas.batallaDia = jugador.diaActual;
  gastarPuntoTarde("Fuiste a la batalla de gallos");
  const tiradaJugador = jugador.flow + jugador.respeto + numeroAleatorio(1, 50);
  const tiradaRival = numeroAleatorio(35, 95);

  if (tiradaJugador >= tiradaRival) {
    sumarSeguidoresDirectos(50);
    jugador.respeto = limitar(jugador.respeto + 5, 1, 100);
    registrarEvento({
      tipo: "positive",
      npc: "rival",
      titulo: "Batalla ganada",
      texto: "Te mediste en la plaza y el corro reaccionó. +50 seguidores reales y +5 respeto callejero.",
    });
    agregarTweet("crew", "El nuestro acaba de apagar la plaza. Que alguien revise ese micro.");
  } else {
    jugador.frustracion = limitar(jugador.frustracion + 14, 0, 100);
    registrarEvento({
      tipo: "alert",
      npc: "rival",
      titulo: "Batalla perdida",
      texto: "Te trabaste en la segunda ronda. El parque olió sangre. +14 frustración.",
    });
  }
  renderizarEstado();
}

function responderBeefTwitter() {
  if (!jugador.estados.beefActivo) {
    mostrarMensaje("Sin beef activo", "Ahora mismo nadie está tirando pullas públicas.", "alert");
    return;
  }

  if (!puedeActuar("noche")) return;
  if (jugador.accionesUsadas.beefDia === jugador.diaActual) {
    mostrarMensaje("Tiradera ya grabada", "La rabia también necesita descansar.", "alert");
    return;
  }

  jugador.accionesUsadas.beefDia = jugador.diaActual;
  jugador.estados.beefActivo = false;
  jugador.fatiga = limitar(jugador.fatiga + 20, 0, 100);

  const base = numeroAleatorio(400, 800) + jugador.flow * 4;
  ganarSeguidores(base, "La tiradera convirtió el beef en morbo viral.");
  jugador.carisma = limitar(jugador.carisma + 3, 1, 100);
  jugador.respeto = limitar(jugador.respeto + 2, 1, 100);
  agregarTweet("rival", "Vale, esa respuesta dolió. Pero esto no se queda así.");
  registrarEvento({
    tipo: "positive",
    npc: "rival",
    titulo: "Tiradera viral",
    texto: "Grabaste respuesta nocturna. El morbo explotó: seguidores, carisma y respeto suben.",
  });
  renderizarEstado();
}

function sumarSeguidoresDirectos(cantidad) {
  jugador.seguidores = limitar(jugador.seguidores + cantidad, 0, OBJETIVO_SEGUIDORES);
  verificarProgreso();
}

function aplicarLesion(texto) {
  jugador.estados.lesionDias = 3;
  jugador.fatiga = 100;
  registrarEvento({
    tipo: "alert",
    npc: "crew",
    titulo: "Lesión en el bloque",
    texto,
  });
  renderizarEstado();
}

function agregarEnemigo(nombre) {
  if (jugador.estados.enemigos.includes(nombre)) return;
  jugador.estados.enemigos.push(nombre);
}

function agregarDM(npcId, texto) {
  if (!dom.dmList) return;
  const npc = NPCS[npcId] || NPCS.rival;
  const item = document.createElement("article");
  item.className = "dm-card unread";
  item.innerHTML = `
    ${crearAvatarNpc(npcId)}
    <div>
      <strong>${npc.nombre}</strong>
      <p>${texto}</p>
    </div>
    <time>Día ${jugador.diaActual}</time>
  `;
  dom.dmList.prepend(item);
}

function agregarTweet(npcId, texto) {
  if (!dom.twitterFeed) return;
  const npc = NPCS[npcId] || NPCS.rival;
  const item = document.createElement("article");
  item.className = "tweet-card hot";
  item.innerHTML = `
    <span>${npc.handle}</span>
    <p>${texto}</p>
  `;
  dom.twitterFeed.prepend(item);
}

function pintarTweetFeed(texto, clase = "") {
  if (!dom.twitterFeed) return;
  const handleMatch = texto.match(/@[\w_]+$/);
  const handle = handleMatch ? handleMatch[0] : "@radioPatio";
  const contenido = handleMatch ? texto.replace(handle, "").trim() : texto;
  const item = document.createElement("article");
  item.className = `tweet-card ${clase}`.trim();
  item.innerHTML = `
    <span>${handle}</span>
    <p>${contenido}</p>
  `;
  dom.twitterFeed.append(item);
}

function obtenerCancionReferenciaTwitter() {
  const conMovimiento = jugador.biblioteca.filter((cancion) => cancion.estado === "Lanzado" || cancion.previewSubido);
  if (conMovimiento.length > 0) return conMovimiento[conMovimiento.length - 1];
  return jugador.biblioteca[jugador.biblioteca.length - 1] || null;
}

function actualizarTwitter() {
  if (!dom.twitterFeed) return;

  const referencia = obtenerCancionReferenciaTwitter();
  const calidad = referencia?.calidad ?? 55;
  const frases = [];
  const total = numeroAleatorio(3, 4);
  const probHater = calidad < 40 ? 0.58 : calidad > 70 ? 0.12 : 0.3;
  const probFan = calidad > 70 ? 0.58 : calidad < 40 ? 0.12 : 0.3;

  if (referencia && calidad < 40 && Math.random() < 0.15) {
    frases.push({ texto: TWEETS_MEME[numeroAleatorio(0, TWEETS_MEME.length - 1)], clase: "hot" });
  }

  let intentos = 0;
  while (frases.length < total && intentos < 24) {
    intentos += 1;
    const tirada = Math.random();
    let pool = TWEETS_ESCENA;
    let clase = "trend";

    if (referencia && tirada < probHater) {
      pool = TWEETS_HATERS;
      clase = "hot";
    } else if (referencia && tirada < probHater + probFan) {
      pool = TWEETS_FANS;
      clase = "trend";
    }

    const texto = pool[numeroAleatorio(0, pool.length - 1)];
    if (frases.some((tweet) => tweet.texto === texto)) continue;
    frases.push({ texto, clase });
  }

  while (frases.length < total) {
    frases.push({
      texto: TWEETS_ESCENA[frases.length % TWEETS_ESCENA.length],
      clase: "trend",
    });
  }

  dom.twitterFeed.innerHTML = "";
  frases.forEach((tweet) => pintarTweetFeed(tweet.texto, tweet.clase));
}

function cargarDMsIniciales() {
  jugador.dmsActivos = plantillasDMs.filter((dm) => dm.inicial).map((dm) => dm.id);
  renderizarDMs();
}

function intentarAgregarDMDiario() {
  if (jugador.diaActual === 1) return;

  const candidatos = plantillasDMs.filter((dm) => {
    return !dm.respondido && !jugador.dmsActivos.includes(dm.id) && jugador.seguidores >= dm.minSeguidores;
  });

  if (candidatos.length === 0) return;

  const cantidadEntrante = Math.min(numeroAleatorio(0, 2), candidatos.length);
  if (cantidadEntrante === 0) return;

  const elegidos = elegirAleatorios(candidatos, cantidadEntrante);
  elegidos.forEach((dm) => {
    jugador.dmsActivos.unshift(dm.id);
  });
  renderizarDMs();
  registrarEvento({
    tipo: "positive",
    titulo: cantidadEntrante === 1 ? "Nuevo DM" : "Nuevos DMs",
    texto:
      cantidadEntrante === 1
        ? `${elegidos[0].remitente} te escribió en la Bandeja de Entrada de Redes.`
        : `${cantidadEntrante} mensajes nuevos esperan en la Bandeja de Entrada de Redes.`,
  });
}

function renderizarDMs() {
  if (!dom.dmList) return;

  dom.dmList.innerHTML = "";
  const dms = jugador.dmsActivos.map(obtenerPlantillaDM).filter(Boolean);

  if (dms.length === 0) {
    const empty = document.createElement("article");
    empty.className = "tweet-card";
    empty.innerHTML = `<span>Bandeja limpia</span><p>No hay DMs pendientes. Sospechosamente tranquilo.</p>`;
    dom.dmList.append(empty);
    return;
  }

  dms.forEach((dm) => {
    const item = document.createElement("article");
    item.className = `dm-card unread ${dm.avatarColor}`;
    item.dataset.dmId = dm.id;
    item.innerHTML = `
      ${crearAvatarNpc(dm.npc)}
      <div>
        <strong>${dm.remitente}</strong>
        <p>${dm.mensaje}</p>
      </div>
      <time>Día ${jugador.diaActual}</time>
    `;
    item.addEventListener("click", () => abrirModalDM(dm.id));
    dom.dmList.append(item);
  });
}

function abrirModalDM(dmId) {
  const dm = obtenerPlantillaDM(dmId);
  if (!dm || !dom.dmDecisionModal) return;

  if (!puedeRevisarDMs()) {
    avisarDMsSoloTarde();
    return;
  }

  const opcionAEstado = obtenerEstadoDisponibilidadOpcionDM(dm.opcionA);
  const opcionBEstado = obtenerEstadoDisponibilidadOpcionDM(dm.opcionB);

  dom.dmDecisionModal.classList.remove("is-hidden");
  dom.dmDecisionModal.innerHTML = `
    <h3>${dm.remitente}</h3>
    <p>${dm.mensaje}</p>
    <div class="dm-options">
      <button class="dm-option" type="button" data-dm-choice="A" ${opcionAEstado.disponible ? "" : "disabled"}>
        ${dm.opcionA.texto}
        ${opcionAEstado.motivo ? `<span>${opcionAEstado.motivo}</span>` : ""}
      </button>
      <button class="dm-option" type="button" data-dm-choice="B" ${opcionBEstado.disponible ? "" : "disabled"}>
        ${dm.opcionB.texto}
        ${opcionBEstado.motivo ? `<span>${opcionBEstado.motivo}</span>` : ""}
      </button>
    </div>
  `;

  dom.dmDecisionModal.querySelectorAll(".dm-option:not(:disabled)").forEach((button) => {
    button.addEventListener("click", () => responderDM(dm.id, button.dataset.dmChoice));
  });
}

function responderDM(dmId, opcion) {
  const dm = obtenerPlantillaDM(dmId);
  if (!dm || dm.respondido) return;

  if (!puedeRevisarDMs()) {
    avisarDMsSoloTarde();
    return;
  }

  const decision = opcion === "A" ? dm.opcionA : dm.opcionB;
  const estadoDisponibilidad = obtenerEstadoDisponibilidadOpcionDM(decision);

  if (!estadoDisponibilidad.disponible) {
    mostrarMensaje("Franja ocupada", estadoDisponibilidad.motivo, "alert");
    abrirModalDM(dmId);
    return;
  }

  decision.aplicar();
  if (decision.consumeFranja) consumirFranjaDM(decision.consumeFranja, decision);
  dm.respondido = true;
  jugador.dmsActivos = jugador.dmsActivos.filter((id) => id !== dm.id);

  if (dom.dmDecisionModal) {
    dom.dmDecisionModal.classList.add("is-hidden");
    dom.dmDecisionModal.innerHTML = "";
  }

  registrarEvento({
    tipo: "positive",
    titulo: "DM respondido",
    texto: `${dm.remitente}: ${decision.texto}.`,
  });
  renderizarDMs();
  renderizarEstado();
}

function obtenerPlantillaDM(dmId) {
  return plantillasDMs.find((dm) => dm.id === dmId);
}

function puedeRevisarDMs() {
  return jugador.franjaActual === "tarde" && !jugador.gameOver && !jugador.faseBloqueada;
}

function avisarDMsSoloTarde() {
  registrarEvento({
    tipo: "alert",
    titulo: "Bandeja cerrada",
    texto: "Ahora mismo estás ocupado. Solo tienes tiempo de revisar y responder DMs por la Tarde.",
  });
  mostrarMensaje("DMs cerrados", "Solo puedes responder DMs por la Tarde.", "alert");
}

function obtenerEstadoDisponibilidadOpcionDM(decision) {
  if (!decision.consumeFranja) return { disponible: true, motivo: "" };

  if (!franjaDisponibleParaDM(decision.consumeFranja)) {
    const motivo =
      decision.consumeFranja === "tarde"
        ? "No te queda tarde disponible para aceptar una petición del barrio."
        : `Ya has ocupado tu ${decision.consumeFranja} en otra actividad hoy.`;
    return {
      disponible: false,
      motivo,
    };
  }

  return { disponible: true, motivo: "" };
}

function franjaDisponibleParaDM(franja) {
  if (jugador.gameOver || jugador.faseBloqueada) return false;

  if (franja === "tarde") {
    return jugador.franjaActual === "tarde" && jugador.puntosTarde > 0;
  }

  if (franja === "noche") {
    return (
      jugador.accionesUsadas.singleDia !== jugador.diaActual &&
      jugador.accionesUsadas.beefDia !== jugador.diaActual
    );
  }

  return false;
}

function consumirFranjaDM(franja, decision = {}) {
  jugador.fatiga = limitar(jugador.fatiga + (decision.fatiga || 0), 0, 100);

  if (franja === "tarde") {
    consumirTardeCompleta("Aceptaste un DM con consecuencias físicas");
  }

  if (franja === "noche") {
    jugador.accionesUsadas.singleDia = jugador.diaActual;
    jugador.accionesUsadas.beefDia = jugador.diaActual;
    jugador.estados.nocheTrabajoSingle = decision.fatiga > 0;
    jugador.franjaActual = "noche";
    cerrarDia();
  }
}

function marcarTardeOcupada() {
  sincronizarEstadoTarde();
}

function agregarObjetoInventario(objeto) {
  if (jugador.inventario.includes(objeto)) return;
  jugador.inventario.push(objeto);
}

function resolverCopyrightPendiente() {
  if (!jugador.estados.copyrightStrikeDia || jugador.diaActual < jugador.estados.copyrightStrikeDia) return;

  jugador.estados.copyrightStrikeDia = null;
  jugador.seguidores = Math.max(0, jugador.seguidores - 300);
  registrarEvento({
    tipo: "alert",
    npc: "policia",
    titulo: "Strike de copyright",
    texto: "Te borraron el single de la plataforma. -300 seguidores de golpe.",
  });
}

function guardarTemaInedito() {
  const resultadoCalidad = calcularCalidadTemaFinalizado();
  const cancion = {
    id: jugador.proximoIdCancion,
    nombre: generarNombreCancion(jugador.proximoIdCancion),
    calidad: resultadoCalidad.calidad,
    hype: 0,
    previewSubido: false,
    estado: "Inedito",
    diaLanzamiento: null,
    streamsAcumulados: 0,
    ingresoDiario: 0,
  };

  jugador.proximoIdCancion += 1;
  jugador.biblioteca.push(cancion);
  jugador.frustracion = limitar(jugador.frustracion - 8, 0, 100);
  jugador.respeto = limitar(jugador.respeto + Math.max(1, Math.round(cancion.calidad / 25)), 1, 100);
  jugador.singleProgreso = 0;
  jugador.trabajandoEnSingle = false;
  jugador.estados.proximoSingleCalidadBonus = 0;
  jugador.estados.proximoSingleCalidadFactor = 1;

  registrarEvento({
    tipo: resultadoCalidad.suerte <= 3 ? "alert" : "positive",
    titulo: "Tema guardado en biblioteca",
    texto: `Proyecto terminado: ${cancion.nombre}. Calidad ${cancion.calidad}/100. ${resultadoCalidad.feedback}`,
  });
  mostrarMensaje("Inedito guardado", `${cancion.nombre}. Calidad ${cancion.calidad}.`, "viral");
  renderizarEstado();
}

function generarNombreCancion(id) {
  const nombres = ["Portal 3", "Sin Sello", "Metro Norte", "Modo Avion", "Luz del Bloque", "Turno Doble"];
  const base = nombres[(id - 1) % nombres.length];
  return `${base} #${id}`;
}

function calcularCalidadTemaFinalizado() {
  const promedioHabilidad = (jugador.flow + jugador.produccion) / 2;
  const componenteHabilidad = promedioHabilidad * 0.6;
  const componenteEquipo = calcularBonusEquipoCalidad();
  const suerte = generarSuerteEstudio();
  const componenteSuerte = suerte;
  const calidadBase = componenteHabilidad + componenteEquipo + componenteSuerte;
  const calidadConEventos = (calidadBase + jugador.estados.proximoSingleCalidadBonus) * jugador.estados.proximoSingleCalidadFactor;
  const calidad = Math.round(Math.min(Math.max(calidadConEventos, 1), 100));

  return {
    calidad,
    suerte,
    feedback: obtenerFeedbackSuerteEstudio(suerte),
  };
}

function generarSuerteEstudio() {
  const tirada = Math.random();
  if (tirada < 0.7) return numeroAleatorio(4, 6);
  if (tirada < 0.85) return numeroAleatorio(7, 10);
  return numeroAleatorio(1, 3);
}

function obtenerFeedbackSuerteEstudio(suerte) {
  if (suerte >= 7) {
    return "✨ ¡Magia en el estudio! Has tenido un dia de inspiracion increible. El tema tiene un duende especial a pesar de tu equipo.";
  }

  if (suerte <= 3) {
    return "❌ Bloqueo creativo. Hoy no fluian las barras en el estudio y los cables han dado problemas. La calidad se ha resentido.";
  }

  return "Studio session completada. El tema suena limpio y acorde a tus habilidades actuales.";
}

function calcularImpactoIndustria(diaLanzamiento) {
  const lanzamientosDelDia = calendarioIndustria.filter((evento) => evento.dia === diaLanzamiento);
  const lanzamientoEnHype = lanzamientosDelDia.reduce((masDuro, evento) => {
    if (!masDuro || evento.penalizacion > masDuro.penalizacion) return evento;
    return masDuro;
  }, null);

  if (lanzamientoEnHype) {
    return {
      tipo: "penalizador",
      factor: 1 - lanzamientoEnHype.penalizacion,
      evento: lanzamientoEnHype,
    };
  }

  return {
    tipo: "bonus",
    factor: BONUS_SEMANA_LIMPIA,
    evento: null,
  };
}

function registrarImpactoIndustria(impactoIndustria) {
  if (impactoIndustria.tipo === "penalizador") {
    registrarEvento({
      tipo: "alert",
      titulo: "⚠️ MAL TIMING",
      texto: `Has lanzado tu tema el mismo día que ${impactoIndustria.evento.artista}. Todo el Hype de las redes se lo han llevado ellos y tu single ha pasado desapercibido en el bloque. Repercusión recortada un ${Math.round(impactoIndustria.evento.penalizacion * 100)}%.`,
    });
    mostrarMensaje("Mal timing", "Una superestrella tapó tu lanzamiento. Repercusión recortada.", "alert");
    return;
  }

  if (impactoIndustria.tipo === "bonus") {
    registrarEvento({
      tipo: "positive",
      titulo: "Hueco limpio",
      texto: "Hoy no hay famosos soltando música. El algoritmo está limpio y hambriento de música nueva. Repercusión +15%.",
    });
    return;
  }
}

function obtenerCancion(cancionId) {
  return jugador.biblioteca.find((cancion) => cancion.id === Number(cancionId));
}

function subirPreview(cancionId) {
  const cancion = obtenerCancion(cancionId);
  if (!cancion || cancion.estado !== "Inedito") return;
  if (cancion.previewSubido) {
    mostrarMensaje("Preview ya subido", "Cada tema solo puede quemar un snippet antes del estreno.", "alert");
    return;
  }
  if (!puedeGastarPuntoTarde()) return;

  const hypeGanado = numeroAleatorio(6, 16) + Math.round(jugador.carisma / 6);
  cancion.hype = limitar(cancion.hype + hypeGanado, 0, 100);
  cancion.previewSubido = true;
  gastarPuntoTarde(`Subiste preview de ${cancion.nombre}`);

  registrarEvento({
    tipo: "positive",
    titulo: "Preview en redes",
    texto: `${cancion.nombre} gana +${hypeGanado} hype. La gente empieza a pedir fecha.`,
  });
  actualizarTwitter();
  agregarTweet("crew", `Ese snippet de ${cancion.nombre} tiene algo. No lo entierres en notas de voz.`);
  renderizarEstado();
}

function promocionarTema(cancionId) {
  const cancion = obtenerCancion(cancionId);
  if (!cancion || cancion.estado !== "Inedito") return;
  if (!puedeGastarPuntoTarde()) return;

  if (jugador.dinero < 50) {
    mostrarMensaje("Promo fallida", "Necesitas 50€ para empujar este tema.", "alert");
    registrarEvento({
      tipo: "alert",
      titulo: "Sin presupuesto de promo",
      texto: `${cancion.nombre} necesita 50€ para moverse en redes.`,
    });
    return;
  }

  jugador.dinero = Number((jugador.dinero - 50).toFixed(2));
  cancion.hype = limitar(cancion.hype + 30, 0, 100);
  gastarPuntoTarde(`Promocionaste ${cancion.nombre}`);

  registrarEvento({
    tipo: "positive",
    titulo: "Promo pagada",
    texto: `Invertiste 50€ en ${cancion.nombre}. Hype +30 de golpe.`,
  });
  agregarTweet("manager", `Anuncio visto tres veces en una hora: ${cancion.nombre} viene con presupuesto.`);
  renderizarEstado();
}

function borrarTema(cancionId) {
  const cancion = obtenerCancion(cancionId);
  if (!cancion) return;

  jugador.biblioteca = jugador.biblioteca.filter((tema) => tema.id !== cancion.id);
  registrarEvento({
    tipo: "alert",
    titulo: "Tema descartado",
    texto: `${cancion.nombre} sale de la biblioteca. A veces el mejor mix es borrar.`,
  });
  renderizarEstado();
}

function lanzarTema(cancionId) {
  const cancion = obtenerCancion(cancionId);
  if (!cancion || cancion.estado !== "Inedito") return;

  if (jugador.franjaActual !== "tarde") {
    mostrarMensaje("Fuera de horario", "Los lanzamientos se preparan por la Tarde.", "alert");
    registrarEvento({
      tipo: "alert",
      titulo: "Lanzamiento bloqueado",
      texto: "Solo puedes lanzar temas por la Tarde.",
    });
    return;
  }

  if (!esDiaLanzamientoMusical(jugador.diaActual)) {
    mostrarMensaje("Calendario cerrado", "La industria solo estrena a final de semana: jueves o viernes.", "alert");
    registrarEvento({
      tipo: "alert",
      titulo: "Dia malo para estrenar",
      texto: "La industria solo estrena a final de semana. Espera a jueves o viernes por la Tarde.",
    });
    return;
  }

  const impactoIndustria = calcularImpactoIndustria(jugador.diaActual);
  const streamsDebut = Math.round(cancion.calidad * 10 * (1 + cancion.hype / 100));
  const ingresoDebut = Number((streamsDebut * VALOR_STREAM_EUROS).toFixed(2));
  const baseSeguidoresBrutos = Math.max(1, Math.round(streamsDebut / 2));
  const baseSeguidores = Math.max(1, Math.round(baseSeguidoresBrutos * impactoIndustria.factor));

  cancion.estado = "Lanzado";
  cancion.diaLanzamiento = jugador.diaActual;
  cancion.streamsAcumulados += streamsDebut;
  cancion.ingresoDiario = ingresoDebut;
  jugador.totalStreamsHistoricos += streamsDebut;
  jugador.ingresosDiariosActuales = Number((jugador.ingresosDiariosActuales + ingresoDebut).toFixed(2));
  jugador.dinero = Number((jugador.dinero + ingresoDebut).toFixed(2));
  jugador.singlesLanzados += 1;
  jugador.respeto = limitar(jugador.respeto + Math.max(1, Math.round(cancion.calidad / 25)), 1, 100);

  ganarSeguidores(
    baseSeguidores,
    `${cancion.nombre} sale a la calle. Calidad ${cancion.calidad}/100, hype ${cancion.hype}/100.`,
  );
  registrarImpactoIndustria(impactoIndustria);
  registrarEvento({
    tipo: "positive",
    titulo: "Lanzamiento publicado",
    texto: `${cancion.nombre} ya esta en plataformas. Debut: ${formatearNumero(streamsDebut)} streams iniciales por calidad e hype.`,
  });
  actualizarTwitter();
  mostrarMensaje("Tema lanzado", `${cancion.nombre} esta fuera.`, "viral");
  renderizarEstado();
}

function esDiaLanzamientoMusical(dia) {
  return dia % 7 === 4 || dia % 7 === 5;
}

function calcularBonusEquipoCalidad() {
  const bonusDinamico = jugador.inventario.reduce((total, nombreItem) => {
    const item = obtenerItemTienda(nombreItem);
    return total + (item?.bonusCalidad || 0);
  }, 0);

  const bonusCompatibilidad =
    (jugador.inventario.includes("Auriculares de Estudio") || jugador.inventario.includes("Auriculares") ? 5 : 0) +
    (jugador.inventario.includes("Micro Caro") || jugador.inventario.includes("Micrófono") ? 15 : 0) +
    (jugador.inventario.includes("Portátil Bueno") || jugador.inventario.includes("Portátil Caro") ? 10 : 0);

  return limitar(bonusDinamico + bonusCompatibilidad, 0, 30);
}

function seleccionarTrabajo(trabajoId) {
  if (!TRABAJOS[trabajoId] || jugador.gameOver || jugador.faseBloqueada) return;

  jugador.trabajoSeleccionado = trabajoId;
  jugador.trabajoActual = trabajoId;
  registrarEvento({
    tipo: "positive",
    titulo: `Curro seleccionado: ${TRABAJOS[trabajoId].nombre}`,
    texto: "Mañana se cobra, pero también se paga con espalda.",
  });
  renderizarEstado();
}

function normalizarTrabajoId(trabajoId) {
  if (trabajoId === "rider") return "repartidor";
  if (trabajoId === "super") return "cajero";
  return trabajoId;
}

function obtenerTrabajoActualId() {
  return normalizarTrabajoId(jugador.trabajoActual || jugador.trabajoSeleccionado || "pintor");
}

function crearContextoTrabajo() {
  const trabajoId = obtenerTrabajoActualId();
  const trabajo = TRABAJOS[trabajoId];
  const fatigaInicial = jugador.fatiga;
  const contexto = {
    trabajoId,
    trabajo,
    sueldoBase: numeroAleatorio(...trabajo.sueldo),
    fatigaBase: numeroAleatorio(...trabajo.fatiga),
    sueldoExtra: 0,
    fatigaExtra: 0,
    multiplicadorSueldo: 1,
    resultadoExtra: "",
    fatigaInicial,
  };

  if (fatigaInicial >= 40) {
    contexto.multiplicadorSueldo *= 0.75;
    registrarEvento({
      tipo: "alert",
      titulo: "⚠️ RENDIMIENTO BAJO",
      texto: "Te has arrastrado por el curro por culpa del cansancio nocturno. Has ganado menos pasta hoy.",
    });
  }

  return contexto;
}

function calcularResultadoTrabajo(contexto) {
  const sueldo = Math.max(0, Math.round(contexto.sueldoBase * contexto.multiplicadorSueldo + contexto.sueldoExtra));
  const fatiga = Math.max(0, Math.round(contexto.fatigaBase + contexto.fatigaExtra));
  return { sueldo, fatiga };
}

function aplicarResultadoTrabajo(contexto, textoExtra = "") {
  const { sueldo, fatiga } = calcularResultadoTrabajo(contexto);

  jugador.dinero = Number((jugador.dinero + sueldo).toFixed(2));
  jugador.fatiga = limitar(jugador.fatiga + fatiga, 0, 100);

  const tipo = contexto.fatigaInicial >= 40 || fatiga > 30 || sueldo < contexto.sueldoBase ? "alert" : "positive";
  registrarEvento({
    tipo,
    titulo: contexto.trabajo.nombre,
    texto: `Turno terminado: +${sueldo}€ y +${fatiga}% fatiga.${textoExtra}${contexto.resultadoExtra}`,
  });
}

function obtenerDilemaTrabajo(trabajoId) {
  const candidatos = eventosTrabajo.filter((evento) => {
    return evento.trabajos.includes("general") || evento.trabajos.includes(trabajoId);
  });

  if (candidatos.length === 0) return null;
  return candidatos[numeroAleatorio(0, candidatos.length - 1)];
}

function trabajarCurro() {
  if (jugador.gameOver || jugador.faseBloqueada) return false;

  if (jugador.franjaActual !== "manana") {
    mostrarMensaje("Fuera de horario", "El curro solo se resuelve por la mañana.", "alert");
    return false;
  }

  if (jugador.dilemaTrabajoActivo) {
    mostrarMensaje("Dilema pendiente", "Resuelve el micro-dilema del curro antes de avanzar.", "alert");
    return true;
  }

  const contexto = crearContextoTrabajo();

  if (Math.random() < 0.5) {
    const dilema = obtenerDilemaTrabajo(contexto.trabajoId);
    if (dilema) {
      jugador.dilemaTrabajoActivo = { id: dilema.id, contexto };
      renderizarDilemaTrabajo(dilema, contexto);
      registrarEvento({
        tipo: "alert",
        titulo: `Dilema en el curro: ${dilema.titulo}`,
        texto: "La mañana queda pausada hasta que elijas cómo responder.",
      });
      return true;
    }
  }

  aplicarResultadoTrabajo(contexto);
  avanzarATardeDespuesCurro();
  return true;
}

function renderizarDilemaTrabajo(dilema, contexto) {
  if (!dom.jobList) return;

  dom.jobList.innerHTML = `
    <article class="job-dilemma-card">
      <p class="card-kicker">${contexto.trabajo.nombre}</p>
      <h3>${dilema.titulo}</h3>
      <p>${dilema.texto}</p>
      <div class="dilemma-actions">
        <button class="action-button" type="button" data-work-dilemma="${dilema.id}" data-option="A">
          ${dilema.opcionA.texto}
        </button>
        <button class="action-button" type="button" data-work-dilemma="${dilema.id}" data-option="B">
          ${dilema.opcionB.texto}
        </button>
      </div>
    </article>
  `;
  renderizarEstado();
}

function resolverDilemaTrabajo(dilemaId, opcionKey) {
  const activo = jugador.dilemaTrabajoActivo;
  const dilema = eventosTrabajo.find((evento) => evento.id === dilemaId);
  if (!activo || !dilema || activo.id !== dilema.id) return;

  const opcion = opcionKey === "A" ? dilema.opcionA : dilema.opcionB;
  const contexto = opcion.aplicar({ contexto: activo.contexto, dilema }) || activo.contexto;

  aplicarResultadoTrabajo(contexto, ` ${opcion.resultado}`);
  jugador.dilemaTrabajoActivo = null;
  renderizarTrabajos();
  avanzarATardeDespuesCurro();
}

function avanzarATardeDespuesCurro() {
  jugador.franjaActual = "tarde";
  iniciarFranjaTarde();
  manejarEventosAleatorios("tarde");
  actualizarMarcadores();
}

function aplicarTrabajoDeManana() {
  trabajarCurro();
}

function echarSiesta() {
  if (!puedeActuar("tarde")) return;

  if (jugador.puntosTarde !== 3) {
    mostrarMensaje("Siesta bloqueada", "Ya gastaste al menos 1 punto de acción: no puedes echarte la siesta ahora.", "alert");
    registrarEvento({
      tipo: "alert",
      titulo: "Siesta imposible",
      texto: "La siesta solo está disponible con los 3 puntos de acción de tarde intactos.",
    });
    return;
  }

  if (jugador.accionesUsadas.siestaDia === jugador.diaActual) {
    mostrarMensaje("Siesta ya hecha", "Ya has apagado el mundo un rato hoy.", "alert");
    return;
  }

  jugador.accionesUsadas.siestaDia = jugador.diaActual;
  jugador.fatiga = limitar(jugador.fatiga - 50, 0, 100);
  jugador.frustracion = limitar(jugador.frustracion - 5, 0, 100);
  jugador.puntosTarde = 0;
  jugador.estados.tardeOcupada = true;
  jugador.franjaActual = "noche";

  registrarEvento({
    tipo: "positive",
    titulo: "Siesta estratégica",
    texto: "No ganaste seguidores ni atributos esta tarde, pero bajaste -50 fatiga y llegas vivo a la noche.",
  });
  mostrarMensaje("Siesta", "Fatiga -50. La noche vuelve a ser jugable.", "positive");
  verificarProgreso();
  renderizarEstado();
}

function avanzarTiempo() {
  if (jugador.gameOver || jugador.faseBloqueada) return;

  const indiceActual = FRANJAS.indexOf(jugador.franjaActual);

  if (jugador.franjaActual === "manana") {
    trabajarCurro();
    return;
  } else if (jugador.franjaActual === "tarde") {
    jugador.frustracion = limitar(jugador.frustracion + numeroAleatorio(4, 10), 0, 100);
    jugador.puntosTarde = 0;
    jugador.estados.tardeOcupada = true;
    jugador.franjaActual = FRANJAS[indiceActual + 1];
    completarTruequeBarrio();
    registrarEvento({
      tipo: "alert",
      titulo: "Tarde quemada",
      texto: "El día sigue y la cabeza empieza a pedir una victoria.",
    });
  } else {
    cerrarDia();
  }

  verificarProgreso();
  renderizarEstado();
}

function cerrarDia() {
  const usoNocheParaSingle = jugador.estados.nocheTrabajoSingle;

  jugador.diaActual += 1;
  jugador.franjaActual = "manana";
  jugador.fatiga = usoNocheParaSingle ? 40 : 0;
  jugador.estados.nocheTrabajoSingle = false;
  jugador.estados.tardeOcupada = false;
  jugador.puntosTarde = 0;
  jugador.frustracion = limitar(jugador.frustracion - numeroAleatorio(6, 14), 0, 100);

  if (jugador.estados.lesionDias > 0) {
    jugador.estados.lesionDias -= 1;
    registrarEvento({
      tipo: "alert",
      npc: "crew",
      titulo: "Lesión arrastrada",
      texto: `El cuerpo sigue tocado. Quedan ${jugador.estados.lesionDias} día(s), pero dormir ya no te deja softlockeado.`,
    });
  }

  procesarStreamsDiarios();

  registrarEvento({
    tipo: "positive",
    titulo: `Día ${jugador.diaActual}`,
    texto: "Nuevo día. El barrio no espera, pero al menos dormiste algo.",
  });

  if ((jugador.diaActual - 1) % 30 === 0) {
    cobrarGastosMensuales();
  }

  resolverCopyrightPendiente();
  intentarAgregarDMDiario();
  generarTiendaDiaria();
  actualizarTwitter();
  manejarEventosAleatorios("dia");
}

function procesarStreamsDiarios() {
  let streamsDelDia = 0;
  let ingresosDelDia = 0;

  jugador.biblioteca.forEach((cancion) => {
    if (cancion.estado !== "Lanzado" || cancion.diaLanzamiento === null) {
      cancion.ingresoDiario = 0;
      return;
    }

    const diasFuera = Math.max(0, jugador.diaActual - cancion.diaLanzamiento);
    const fuerzaTema = 0.65 + (cancion.calidad + cancion.hype) / 200;
    const streamsPico = Math.round(numeroAleatorio(STREAMS_PICO_MIN, STREAMS_PICO_MAX) * fuerzaTema);
    const streamsHoy =
      diasFuera <= 14
        ? streamsPico
        : Math.max(STREAMS_SUELO_CATALOGO, Math.round(streamsPico * Math.pow(0.95, diasFuera - 14)));
    const ingresoHoy = Number((streamsHoy * VALOR_STREAM_EUROS).toFixed(2));

    cancion.streamsAcumulados += streamsHoy;
    cancion.ingresoDiario = ingresoHoy;
    streamsDelDia += streamsHoy;
    ingresosDelDia += ingresoHoy;
  });

  jugador.totalStreamsHistoricos += streamsDelDia;
  jugador.ingresosDiariosActuales = Number(ingresosDelDia.toFixed(2));

  if (ingresosDelDia > 0) {
    jugador.dinero = Number((jugador.dinero + jugador.ingresosDiariosActuales).toFixed(2));
    registrarEvento({
      tipo: "positive",
      titulo: "Regalias de streams",
      texto: `Tu catalogo generó ${formatearNumero(streamsDelDia)} streams y +${formatearEuros(jugador.ingresosDiariosActuales)} mientras dormias.`,
    });
  }
}

function cobrarGastosMensuales() {
  const gastoTotal = COSTE_ALQUILER + COSTE_COMIDA;
  jugador.dinero -= gastoTotal;

  registrarEvento({
    tipo: "alert",
    titulo: "Gastos mensuales",
    texto: `Alquiler -${COSTE_ALQUILER}€ y comida -${COSTE_COMIDA}€. El subsuelo no perdona.`,
  });

  if (jugador.dinero < 0) {
    activarGameOverDesahucio();
  }
}

function obtenerItemTienda(itemId) {
  return ITEMS_TIENDA.find((item) => item.id === itemId || item.nombre === itemId);
}

function generarTiendaDiaria() {
  const disponibles = ITEMS_TIENDA.filter((item) => !jugador.inventario.includes(item.nombre));
  const cantidad = numeroAleatorio(3, 4);
  jugador.tiendaActiva = elegirAleatorios(disponibles, Math.min(cantidad, disponibles.length)).map((item) => item.id);
  renderizarTienda();
}

function comprarItem(itemId) {
  if (jugador.gameOver || jugador.faseBloqueada) return;

  const item = obtenerItemTienda(itemId);
  if (!item) return;

  if (jugador.inventario.includes(item.nombre)) {
    mostrarMensaje("Inventario", `${item.nombre} ya está equipado.`, "positive");
    return;
  }

  if (jugador.dinero < item.coste) {
    mostrarMensaje("Sin dinero", `Necesitas ${item.coste}€ para comprar ${item.nombre}.`, "alert");
    registrarEvento({
      tipo: "alert",
      titulo: "Compra fallida",
      texto: `${item.nombre} cuesta ${item.coste}€. Tu cartera ha tosido.`,
    });
    return;
  }

  jugador.dinero = Number((jugador.dinero - item.coste).toFixed(2));
  jugador.inventario.push(item.nombre);
  jugador.tiendaActiva = jugador.tiendaActiva.filter((id) => id !== item.id);

  registrarEvento({
    tipo: "positive",
    titulo: `Comprado: ${item.nombre}`,
    texto: `Inventario actualizado. +${item.bonusCalidad} calidad potencial en el estudio.`,
  });
  renderizarEstado();
}

function verificarProgreso() {
  if (jugador.seguidores < OBJETIVO_SEGUIDORES || jugador.faseBloqueada) return false;

  jugador.seguidores = OBJETIVO_SEGUIDORES;
  jugador.faseBloqueada = true;

  registrarEvento({
    tipo: "positive",
    titulo: "Hit del Bloque desbloqueado",
    texto: "10.000 seguidores exactos. La Fase 2 está llamando desde un estudio con sofá.",
  });

  mostrarMensaje("HIT DEL BLOQUE", "Has llegado a 10.000 seguidores. Preparando salto profesional.", "viral");
  congelarAcciones("Fase 2 pendiente");
  return true;
}

function activarGameOverDesahucio() {
  jugador.gameOver = true;
  congelarAcciones("Game Over");

  registrarEvento({
    tipo: "alert",
    titulo: "Game Over por desahucio",
    texto: "El dinero bajó de 0€ al cobrar alquiler y comida. La supervivencia ganó la ronda.",
  });

  mostrarMensaje("Desahucio", "No pudiste pagar el mes. Fin de la Fase 1.", "alert");
}

function puedeActuar(franjaNecesaria) {
  if (jugador.gameOver || jugador.faseBloqueada) return false;

  if (jugador.franjaActual !== franjaNecesaria) {
    mostrarMensaje(
      "Fuera de horario",
      `Esta acción es de ${franjaNecesaria}. Ahora estás en ${jugador.franjaActual}.`,
      "alert",
    );
    return false;
  }

  return true;
}

function congelarAcciones(texto) {
  [
    ...dom.workButtons,
    dom.reelsActionBtn,
    dom.napActionBtn,
    dom.battleActionBtn,
    dom.beefResponseBtn,
    dom.trainProductionBtn,
    dom.trainFlowBtn,
    dom.releaseSingleBtn,
    dom.advanceTimeBtn,
  ].forEach((button) => {
    if (!button) return;
    button.disabled = true;
    button.textContent = texto;
  });
}

function registrarEvento({ tipo = "positive", npc = null, titulo, texto, acciones = [] }) {
  if (!dom.eventFeed) return;

  const item = document.createElement("li");
  item.className = `event-card ${tipo === "alert" ? "alert" : "positive"}${npc ? " has-npc" : ""}`;
  const avatarHtml = npc ? crearAvatarNpc(npc) : "";
  const accionesHtml = acciones.length
    ? `<div class="event-actions">${acciones
        .map((accion) => `<button class="event-choice" type="button" data-event-action="${accion.id}">${accion.texto}</button>`)
        .join("")}</div>`
    : "";

  item.innerHTML = `
    ${avatarHtml}
    <time>Día ${String(jugador.diaActual).padStart(2, "0")} · ${obtenerHoraFranja()}</time>
    <h3>${titulo}</h3>
    <p>${texto}</p>
    ${accionesHtml}
  `;

  acciones.forEach((accion) => {
    const button = item.querySelector(`[data-event-action="${accion.id}"]`);
    if (!button) return;
    button.addEventListener("click", () => {
      accion.resolver();
      item.querySelectorAll(".event-choice").forEach((choice) => {
        choice.disabled = true;
      });
    });
  });

  dom.eventFeed.prepend(item);
}

function crearAvatarNpc(npcId) {
  const npc = NPCS[npcId];
  if (!npc) return "";

  return `
    <div class="avatar ${npc.avatar}" aria-label="${npc.nombre}">
      <span class="avatar-head"></span>
      <span class="avatar-body"></span>
    </div>
  `;
}

function obtenerHoraFranja() {
  const horas = {
    manana: "10:00",
    tarde: "14:00",
    noche: "22:00",
  };

  return horas[jugador.franjaActual] || "00:00";
}

function dispararAlertaViral(base) {
  mostrarMensaje("¡VIRAL!", `El contador explotó: +${formatearNumero(base)} base antes del multiplicador.`, "viral");
  registrarEvento({
    tipo: "positive",
    titulo: "Ruleta viral",
    texto: "El barrio, el algoritmo y el caos se pusieron de acuerdo por una vez.",
  });
}

function mostrarMensaje(titulo, texto, tipo = "positive") {
  const toast = document.createElement("aside");
  toast.className = `game-toast ${tipo}`;
  toast.innerHTML = `<strong>${titulo}</strong><span>${texto}</span>`;
  document.body.append(toast);

  window.setTimeout(() => {
    toast.classList.add("is-leaving");
    toast.addEventListener("transitionend", () => toast.remove(), { once: true });
  }, 2600);
}

function renderizarEstado() {
  dom.statDia.textContent = String(jugador.diaActual).padStart(2, "0");
  dom.statDinero.textContent = formatearEuros(jugador.dinero);
  dom.statFatiga.textContent = `${jugador.fatiga}%`;
  dom.statFrustracion.textContent = `${jugador.frustracion}%`;
  dom.statSeguidores.textContent = formatearNumero(jugador.seguidores);
  if (dom.statPuntosTarde) {
    dom.statPuntosTarde.textContent = jugador.franjaActual === "tarde" ? jugador.puntosTarde : 0;
  }
  dom.statProduccion.textContent = jugador.produccion;
  dom.statFlow.textContent = jugador.flow;
  dom.statCarisma.textContent = jugador.carisma;
  dom.statRespeto.textContent = jugador.respeto;
  dom.followersGoal.textContent = `${formatearNumero(jugador.seguidores)} / 10.000 fans`;
  if (dom.musicStats) {
    dom.musicStats.textContent = `🎧 Total Streams: ${formatearNumero(jugador.totalStreamsHistoricos)} | 💰 Regalias Hoy: +${formatearEuros(jugador.ingresosDiariosActuales)}`;
  }

  dom.barFatiga.style.width = `${jugador.fatiga}%`;
  dom.barFrustracion.style.width = `${jugador.frustracion}%`;
  dom.barSeguidores.style.width = `${(jugador.seguidores / OBJETIVO_SEGUIDORES) * 100}%`;
  if (dom.barPuntosTarde) {
    dom.barPuntosTarde.style.width = `${jugador.franjaActual === "tarde" ? (jugador.puntosTarde / 3) * 100 : 0}%`;
  }
  dom.barProduccion.style.width = `${jugador.produccion}%`;
  dom.barFlow.style.width = `${jugador.flow}%`;
  dom.barCarisma.style.width = `${jugador.carisma}%`;
  dom.barRespeto.style.width = `${jugador.respeto}%`;
  dom.barSingleProgreso.style.width = `${(jugador.singleProgreso / 3) * 100}%`;
  dom.singleProjectStatus.textContent = jugador.trabajandoEnSingle
    ? `Proyecto actual: ${jugador.singleProgreso}/3 noches completadas`
    : "Estudio: Libre";

  dom.timeChips.forEach((chip) => {
    chip.classList.toggle("is-current", chip.dataset.franja === jugador.franjaActual);
  });

  renderizarTrabajos();
  dom.workButtons.forEach((button) => {
    button.classList.toggle("is-selected", button.dataset.work === jugador.trabajoSeleccionado);
  });

  dom.reelsActionBtn.disabled =
    jugador.franjaActual !== "tarde" ||
    jugador.puntosTarde <= 0 ||
    jugador.accionesUsadas.reelsDia === jugador.diaActual ||
    jugador.gameOver ||
    jugador.faseBloqueada;
  dom.napActionBtn.disabled =
    jugador.franjaActual !== "tarde" ||
    jugador.puntosTarde !== 3 ||
    jugador.accionesUsadas.siestaDia === jugador.diaActual ||
    jugador.gameOver ||
    jugador.faseBloqueada;
  dom.napActionBtn.textContent =
    jugador.franjaActual === "tarde" && jugador.puntosTarde < 3
      ? "Siesta bloqueada: ya gastaste puntos de tarde"
      : "Echarse una siesta";
  dom.battleActionBtn.disabled =
    jugador.franjaActual !== "tarde" ||
    jugador.puntosTarde <= 0 ||
    jugador.accionesUsadas.batallaDia === jugador.diaActual ||
    jugador.gameOver ||
    jugador.faseBloqueada;
  dom.beefResponseBtn.disabled =
    !jugador.estados.beefActivo ||
    jugador.franjaActual !== "noche" ||
    jugador.accionesUsadas.beefDia === jugador.diaActual ||
    jugador.gameOver ||
    jugador.faseBloqueada;
  dom.trainProductionBtn.disabled =
    jugador.franjaActual !== "tarde" ||
    jugador.puntosTarde <= 0 ||
    jugador.accionesUsadas.produccionDia === jugador.diaActual ||
    jugador.gameOver ||
    jugador.faseBloqueada;
  dom.trainFlowBtn.disabled =
    jugador.franjaActual !== "tarde" ||
    jugador.puntosTarde <= 0 ||
    jugador.accionesUsadas.flowDia === jugador.diaActual ||
    jugador.gameOver ||
    jugador.faseBloqueada;
  dom.releaseSingleBtn.disabled =
    jugador.franjaActual !== "noche" ||
    jugador.accionesUsadas.singleDia === jugador.diaActual ||
    jugador.fatiga >= 90 ||
    jugador.gameOver ||
    jugador.faseBloqueada;
  dom.advanceTimeBtn.disabled = jugador.gameOver || jugador.faseBloqueada || Boolean(jugador.dilemaTrabajoActivo);
  if (jugador.dilemaTrabajoActivo) {
    dom.advanceTimeBtn.textContent = "Resuelve el dilema del curro";
  } else if (jugador.franjaActual === "manana") {
    dom.advanceTimeBtn.textContent = "Trabajar";
  } else if (jugador.franjaActual === "tarde") {
    dom.advanceTimeBtn.textContent = "Avanzar a la noche";
  } else {
    dom.advanceTimeBtn.textContent = "Dormir";
  }

  dom.storyTitle.textContent = obtenerTituloNarrativo();
  dom.storyBody.textContent = obtenerTextoNarrativo();
  renderizarCalendarioIndustria();
  renderizarTienda();
  renderizarBiblioteca();
}

function actualizarMarcadores() {
  renderizarEstado();
}

function renderizarTrabajos() {
  if (!dom.jobList || jugador.dilemaTrabajoActivo) return;

  const trabajosVisibles = ["burger", "pintor", "cajero", "repartidor"];
  dom.jobList.innerHTML = "";

  trabajosVisibles.forEach((trabajoId) => {
    const trabajo = TRABAJOS[trabajoId];
    const sueldoTexto =
      trabajo.sueldo[0] === trabajo.sueldo[1]
        ? `+${trabajo.sueldo[0]}€`
        : `+${trabajo.sueldo[0]}-${trabajo.sueldo[1]}€`;
    const fatigaTexto =
      trabajo.fatiga[0] === trabajo.fatiga[1]
        ? `+${trabajo.fatiga[0]} fatiga`
        : `+${trabajo.fatiga[0]}-${trabajo.fatiga[1]} fatiga`;
    const card = document.createElement("article");
    card.className = "job-card";
    card.innerHTML = `
      <div class="job-icon">${trabajo.icono}</div>
      <div>
        <h3>${trabajo.nombre}</h3>
        <p>${trabajo.descripcion}</p>
        <div class="impact-row">
          <span>${sueldoTexto}</span>
          <span class="${trabajo.fatiga[1] >= 30 ? "impact-bad" : "impact-mid"}">${fatigaTexto}</span>
        </div>
      </div>
      <button class="action-button" type="button" data-work="${trabajoId}">${trabajo.boton}</button>
    `;
    dom.jobList.append(card);
  });

  dom.workButtons = document.querySelectorAll("[data-work]");
}

function renderizarBiblioteca() {
  if (!dom.libraryList) return;

  dom.libraryList.innerHTML = "";

  if (jugador.biblioteca.length === 0) {
    const empty = document.createElement("article");
    empty.className = "library-empty";
    empty.innerHTML = `
      <strong>Sin temas guardados</strong>
      <p>Trabaja 3 noches en un single para crear un inedito y decidir cuando lanzarlo.</p>
    `;
    dom.libraryList.append(empty);
    return;
  }

  jugador.biblioteca.forEach((cancion) => {
    const esInedito = cancion.estado === "Inedito";
    const puedeUsarAccionTarde = jugador.franjaActual === "tarde" && jugador.puntosTarde > 0 && !jugador.gameOver && !jugador.faseBloqueada;
    const puedeIntentarLanzar =
      esInedito &&
      jugador.franjaActual === "tarde" &&
      !jugador.gameOver &&
      !jugador.faseBloqueada;
    const card = document.createElement("article");
    card.className = `song-card ${esInedito ? "is-unreleased" : "is-released"}`;
    card.innerHTML = `
      <div class="song-topline">
        <div>
          <h3>${cancion.nombre}</h3>
          <p>${esInedito ? "Guardado en el disco duro" : `Lanzado el Dia ${cancion.diaLanzamiento}`}</p>
        </div>
        <span class="song-status ${esInedito ? "inedito" : "lanzado"}">${cancion.estado}</span>
      </div>
      <div class="song-meta">
        <span>Calidad: ${cancion.calidad}/100</span>
        <span>Hype: ${cancion.hype}/100</span>
        <span>Streams: ${formatearNumero(cancion.streamsAcumulados)}</span>
        <span>Hoy: +${formatearEuros(cancion.ingresoDiario)}</span>
      </div>
      <div class="song-actions">
        <button type="button" data-library-action="preview" data-song-id="${cancion.id}" ${esInedito && puedeUsarAccionTarde && !cancion.previewSubido ? "" : "disabled"}>${cancion.previewSubido ? "Preview subido" : "Subir preview"}</button>
        <button type="button" data-library-action="promote" data-song-id="${cancion.id}" ${esInedito && puedeUsarAccionTarde && jugador.dinero >= 50 ? "" : "disabled"}>Promocionar 50€</button>
        <button type="button" data-library-action="release" data-song-id="${cancion.id}" ${puedeIntentarLanzar ? "" : "disabled"}>Lanzar tema</button>
        <button type="button" data-library-action="delete" data-song-id="${cancion.id}">Borrar</button>
      </div>
    `;
    dom.libraryList.append(card);
  });
}

function renderizarTienda() {
  if (!dom.shopGrid) return;

  dom.shopGrid.innerHTML = "";
  const items = jugador.tiendaActiva.map(obtenerItemTienda).filter(Boolean);

  if (items.length === 0) {
    const empty = document.createElement("article");
    empty.className = "shop-card";
    empty.innerHTML = `
      <div>
        <h3>Tienda vacia</h3>
        <p>No queda stock interesante hoy. Vuelve mañana por la mañana.</p>
      </div>
      <strong>Sin stock</strong>
    `;
    dom.shopGrid.append(empty);
    return;
  }

  items.forEach((item) => {
    const card = document.createElement("article");
    card.className = "shop-card";
    card.dataset.itemId = item.id;
    card.innerHTML = `
      <div class="item-visual ${item.visual}"></div>
      <h3>${item.nombre}</h3>
      <p>${item.categoria} · Niv. ${item.nivel} · +${item.bonusCalidad} calidad</p>
      <p>${item.descripcion}</p>
      <strong>${item.coste}€</strong>
    `;
    dom.shopGrid.append(card);
  });
}

function renderizarCalendarioIndustria() {
  if (!dom.industryCalendarList) return;

  if (dom.simulatedWeekday) {
    dom.simulatedWeekday.textContent = `Hoy: ${obtenerDiaSemanaSimulado(jugador.diaActual)} · Día ${jugador.diaActual}`;
  }

  const lanzamientosVisibles = calendarioIndustria
    .filter((evento) => {
      const diasRestantes = evento.dia - jugador.diaActual;
      return diasRestantes >= 0 && diasRestantes <= evento.diasFiltracion;
    })
    .sort((a, b) => a.dia - b.dia || b.penalizacion - a.penalizacion);

  dom.industryCalendarList.innerHTML = "";

  if (lanzamientosVisibles.length === 0) {
    const item = document.createElement("li");
    const inicioSemana = jugador.diaActual - ((jugador.diaActual - 1) % 7);
    const finSemana = inicioSemana + 6;
    const proximoViernes = jugador.diaActual + ((5 - (jugador.diaActual % 7) + 7) % 7);
    item.innerHTML = `<strong>Semana limpia</strong>Del Día ${inicioSemana} al Día ${finSemana} no hay filtraciones activas. Los lanzamientos de la industria solo caen en viernes; próximo viernes: Día ${proximoViernes}.`;
    dom.industryCalendarList.append(item);
    return;
  }

  lanzamientosVisibles.forEach((evento) => {
    const item = document.createElement("li");
    const diasRestantes = evento.dia - jugador.diaActual;
    const estado = diasRestantes === 0 ? "Hoy" : `En ${diasRestantes} día${diasRestantes === 1 ? "" : "s"}`;
    item.innerHTML = `<strong>⚠️ FILTRACIÓN: ${evento.artista}</strong>${estado}: se rumorea que suelta música el ${obtenerDiaSemanaSimulado(evento.dia)} Día ${evento.dia}. Nivel ${evento.nivel}, penalización posible ${Math.round(evento.penalizacion * 100)}%.`;
    dom.industryCalendarList.append(item);
  });
}

function obtenerTituloNarrativo() {
  if (jugador.faseBloqueada) return "El Hit del Bloque ya no cabe en el portal.";
  if (jugador.gameOver) return "La persiana baja. El subsuelo cobró su deuda.";

  const titulos = {
    manana: "Mañana de curro: primero sobrevivir, luego sonar.",
    tarde: "Tarde de algoritmo: TikTok/Reels puede hundirte o sacarte del barrio.",
    noche: "Noche de estudio: el cansancio pelea contra la ambición.",
  };

  return titulos[jugador.franjaActual];
}

function obtenerTextoNarrativo() {
  if (jugador.faseBloqueada) {
    return "Llegaste exactamente al objetivo profesional: 10.000 seguidores. El evento definitivo de Fase 2 queda preparado.";
  }

  if (jugador.gameOver) {
    return "No hay colchón económico. La Fase 1 termina por desahucio.";
  }

  const textos = {
    manana: `Trabajo elegido: ${TRABAJOS[jugador.trabajoSeleccionado].nombre}. Al avanzar, cobras y sube la fatiga.`,
    tarde: `Te quedan ${jugador.puntosTarde}/3 puntos de acción. Entrena, sube un clip, acepta un DM físico o usa la siesta solo si no has hecho nada.`,
    noche: "Trabaja en tu single o descansa. Si grabas, mañana despiertas con 40 fatiga; si no, con 0.",
  };

  return textos[jugador.franjaActual];
}

function inicializarTabs() {
  dom.navButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetId = button.dataset.tab;

      dom.navButtons.forEach((item) => {
        item.classList.toggle("is-active", item === button);
      });

      dom.tabScreens.forEach((screen) => {
        screen.classList.toggle("is-active", screen.id === targetId);
      });
    });
  });
}

function inicializarEventos() {
  dom.advanceTimeBtn.addEventListener("click", avanzarTiempo);
  dom.reelsActionBtn.addEventListener("click", ejecutarRuletaAlgoritmo);
  dom.napActionBtn.addEventListener("click", echarSiesta);
  dom.battleActionBtn.addEventListener("click", batallaGallos);
  dom.beefResponseBtn.addEventListener("click", responderBeefTwitter);
  dom.trainProductionBtn.addEventListener("click", entrenarProduccion);
  dom.trainFlowBtn.addEventListener("click", entrenarFlow);
  dom.releaseSingleBtn.addEventListener("click", trabajarEnSingle);

  if (dom.jobList) {
    dom.jobList.addEventListener("click", (event) => {
      const dilemaButton = event.target.closest("[data-work-dilemma]");
      if (dilemaButton) {
        resolverDilemaTrabajo(dilemaButton.dataset.workDilemma, dilemaButton.dataset.option);
        return;
      }

      const workButton = event.target.closest("[data-work]");
      if (workButton) {
        seleccionarTrabajo(workButton.dataset.work);
      }
    });
  }

  if (dom.shopGrid) {
    dom.shopGrid.addEventListener("click", (event) => {
      const card = event.target.closest("[data-item-id]");
      if (!card) return;
      comprarItem(card.dataset.itemId);
    });
  }

  if (dom.libraryList) {
    dom.libraryList.addEventListener("click", (event) => {
      const button = event.target.closest("[data-library-action]");
      if (!button || button.disabled) return;

      const cancionId = Number(button.dataset.songId);
      const acciones = {
        preview: subirPreview,
        promote: promocionarTema,
        release: lanzarTema,
        delete: borrarTema,
      };

      acciones[button.dataset.libraryAction]?.(cancionId);
    });
  }
}

function iniciarJuego() {
  generarCalendarioIndustria();
  inicializarTabs();
  inicializarEventos();
  generarTiendaDiaria();
  cargarDMsIniciales();
  actualizarTwitter();
  renderizarEstado();
  registrarEvento({
    tipo: "positive",
    titulo: "Arranca El Subsuelo",
    texto: "Eres cantante y productor desde el primer día. No hay sello, no hay excusas.",
  });
}

iniciarJuego();

window.ArtistaUrbanoFase1 = {
  jugador,
  avanzarTiempo,
  trabajarCurro,
  resolverDilemaTrabajo,
  ejecutarRuletaAlgoritmo,
  echarSiesta,
  batallaGallos,
  responderBeefTwitter,
  entrenarProduccion,
  entrenarFlow,
  trabajarEnSingle,
  subirPreview,
  promocionarTema,
  borrarTema,
  lanzarTema,
  guardarTemaInedito,
  generarSuerteEstudio,
  procesarStreamsDiarios,
  actualizarTwitter,
  generarTiendaDiaria,
  renderizarTienda,
  comprarItem,
  manejarEventosAleatorios,
  plantillasDMs,
  renderizarDMs,
  intentarAgregarDMDiario,
  responderDM,
  ganarSeguidores,
  calcularImpactoIndustria,
  generarCalendarioIndustria,
  obtenerCalendarioIndustria: () => calendarioIndustria,
  esViernesSimulado,
  obtenerDiaSemanaSimulado,
  actualizarMarcadores,
  verificarProgreso,
};
