const setupPanel = document.querySelector("#setupPanel");
const gamePanel = document.querySelector("#gamePanel");
const creatorForm = document.querySelector("#creatorForm");
const actionGrid = document.querySelector("#actionGrid");
const feedList = document.querySelector("#feedList");

const ui = {
  day: document.querySelector("#day"),
  artistHeader: document.querySelector("#artistHeader"),
  roleLine: document.querySelector("#roleLine"),
  energy: document.querySelector("#energy"),
  time: document.querySelector("#time"),
  money: document.querySelector("#money"),
  followers: document.querySelector("#followers"),
  energyMeter: document.querySelector("#energyMeter"),
  timeMeter: document.querySelector("#timeMeter"),
  singleStatus: document.querySelector("#singleStatus"),
  singleProgress: document.querySelector("#singleProgress"),
  prodLevel: document.querySelector("#prodLevel"),
  flowLevel: document.querySelector("#flowLevel"),
  charisma: document.querySelector("#charisma"),
  reputation: document.querySelector("#reputation"),
};

const roleStats = {
  Productor: { nivel_prod: 2, nivel_flow: 1, carisma: 1 },
  Cantante: { nivel_prod: 1, nivel_flow: 2, carisma: 2 },
  Hibrido: { nivel_prod: 1, nivel_flow: 1, carisma: 1 },
};

const jobs = {
  "Pintor de pisos": { money: 65, energy: 24, time: 4 },
  "Cajero de supermercado": { money: 48, energy: 18, time: 4 },
  "Repartidor en bici": { money: 74, energy: 32, time: 4 },
  "Peon de obra": { money: 90, energy: 38, time: 5 },
};

let player = null;

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function createPlayer(formData) {
  const role = formData.get("role");
  return {
    nombre: formData.get("artistName").trim() || "Artista del Barrio",
    rol: role,
    genero: formData.get("genre"),
    trabajo: formData.get("job"),
    energia: 100,
    tiempo: 8,
    dinero: 0,
    seguidores: 0,
    reputacion: 0,
    dia: 1,
    single_progreso: 0,
    single_listo: false,
    xp_prod: 0,
    xp_flow: 0,
    marketing_bonus: { fans_extra: 0, streams_extra: 0 },
    twitter_feed: [
      "<strong>@escenaLocal</strong> Nueva cara rondando el estudio. A ver si hay musica o solo pose.",
      "<strong>@vecinoDelQuinto</strong> Otra noche con bajos en la pared. Minimo que el tema salga bueno.",
    ],
    ...roleStats[role],
  };
}

function spendResources({ energy = 0, time = 0 }) {
  if (player.energia < energy || player.tiempo < time) return false;
  player.energia -= energy;
  player.tiempo -= time;
  return true;
}

function addFeed(message) {
  player.twitter_feed.unshift(message);
  player.twitter_feed = player.twitter_feed.slice(0, 8);
}

function gainXp(type, amount) {
  const xpKey = type === "prod" ? "xp_prod" : "xp_flow";
  const levelKey = type === "prod" ? "nivel_prod" : "nivel_flow";
  player[xpKey] += amount;

  while (player[xpKey] >= 10 && player[levelKey] < 10) {
    player[xpKey] -= 10;
    player[levelKey] += 1;
    addFeed(`<strong>@progreso</strong> ${type === "prod" ? "Produccion" : "Flow"} sube a nivel ${player[levelKey]}. Se nota la madrugada.`);
  }
}

function work() {
  const job = jobs[player.trabajo];
  if (!spendResources({ energy: job.energy, time: job.time })) return;
  player.dinero += job.money;
  addFeed(`<strong>Trabajo</strong> ${player.trabajo}: +${job.money} EUR. La carrera no se paga sola.`);
  render();
}

function produceBeat() {
  if (!spendResources({ energy: 22, time: 2 })) return;
  gainXp("prod", player.rol === "Productor" ? 4 : 3);
  player.single_progreso = clamp(player.single_progreso + 18, 0, 100);
  addFeed("<strong>Estudio</strong> Beat nuevo con cara de demo y corazon de hit.");
  render();
}

function practiceFlow() {
  if (!spendResources({ energy: 20, time: 2 })) return;
  gainXp("flow", player.rol === "Cantante" ? 4 : 3);
  player.single_progreso = clamp(player.single_progreso + 14, 0, 100);
  addFeed("<strong>Ensayo</strong> Repetiste el verso hasta que dejo de sonar prestado.");
  render();
}

function recordSingle() {
  if (!spendResources({ energy: 25, time: 2 })) return;
  player.single_progreso = clamp(player.single_progreso + 34, 0, 100);
  player.single_listo = player.single_progreso >= 100;
  addFeed(player.single_listo ? "<strong>Single</strong> Master cerrado. Ya no hay vuelta atras." : "<strong>Single</strong> Otra sesion grabada. Va cogiendo forma.");
  render();
}

function doMarketing(type) {
  const campaigns = {
    instagram: { cost: 0, fans: randomInt(8, 44), streams: 0, text: "Post de Instagram: la portada cutre funciono mejor de lo esperado." },
    tiktok: { cost: 0, fans: randomInt(20, 80), streams: randomInt(50, 200), text: "TikTok challenge: tres chavales lo bailaron y ya cuenta como estrategia." },
    posters: { cost: 80, fans: randomInt(45, 130), streams: 0, text: "Carteles por el barrio: pegamento, frio y algo de respeto." },
    playlist: { cost: 150, fans: randomInt(10, 35), streams: randomInt(500, 1200), text: "Playlist pitching: un curador contesto con un 'lo miro' sospechosamente prometedor." },
  };
  const campaign = campaigns[type];
  if (player.dinero < campaign.cost) return;
  player.dinero -= campaign.cost;
  player.marketing_bonus.fans_extra += campaign.fans;
  player.marketing_bonus.streams_extra += campaign.streams;
  addFeed(`<strong>Marketing</strong> ${campaign.text}`);
  render();
}

function releaseSingle() {
  if (!player.single_listo) return;
  const base = (player.nivel_prod * 0.4 + player.nivel_flow * 0.4 + player.carisma * 0.2) * 2;
  const quality = clamp(Math.round(base + randomFloat(-0.5, 0.5)), 1, 10);
  const followers = Math.round(quality * randomInt(18, 52) + player.marketing_bonus.fans_extra);
  const streams = Math.round(quality * randomInt(140, 540) + player.marketing_bonus.streams_extra);
  const result = getReleaseResult(quality);

  player.seguidores += followers;
  player.reputacion += Math.max(0, quality - 4);
  player.single_progreso = 0;
  player.single_listo = false;
  player.marketing_bonus = { fans_extra: 0, streams_extra: 0 };

  addFeed(`<strong>Lanzamiento</strong> ${result} Nota ${quality}/10. +${followers} fans, ${streams.toLocaleString("es-ES")} streams.`);
  addFeed(getCriticTweet(quality));
  render();
}

function sleep() {
  player.dia += 1;
  player.energia = 100;
  player.tiempo = 8;
  if (player.dia % 5 === 0) {
    addFeed("<strong>New Music Friday</strong> Hoy salen temas de media escena. Toca hacer ruido o apartarse.");
  } else {
    addFeed("<strong>Nuevo dia</strong> Cafe barato, sueño caro y la misma ambicion.");
  }
  render();
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min, max) {
  return Math.random() * (max - min) + min;
}

function getReleaseResult(quality) {
  if (quality >= 9) return "VIRAL";
  if (quality >= 7) return "Hit local";
  if (quality >= 5) return "Buzz barrio";
  if (quality >= 3) return "Sin pena ni gloria";
  return "Flop";
}

function getCriticTweet(quality) {
  if (quality >= 8) return "<strong>@criticoVerificado</strong> Ojo, aqui hay identidad. No solo ganas: criterio.";
  if (quality >= 5) return "<strong>@criticoVerificado</strong> Tiene momentos. Falta rematar, pero no es humo.";
  return "<strong>@criticoVerificado</strong> La intencion estaba. El tema, menos.";
}

function getActions() {
  const base = [
    { label: "Trabajar", meta: `${player.trabajo} - dinero rapido`, action: work },
    { label: "Grabar single", meta: "-25 energia, -2h", action: recordSingle },
    { label: "Post Instagram", meta: "Gratis - fans extra", action: () => doMarketing("instagram") },
    { label: "TikTok challenge", meta: "Gratis - puede mover streams", action: () => doMarketing("tiktok") },
    { label: "Dormir", meta: "Recuperar energia y tiempo", action: sleep },
  ];

  if (player.rol !== "Cantante") {
    base.splice(1, 0, { label: "Producir beats", meta: "-22 energia, -2h", action: produceBeat });
  }
  if (player.rol !== "Productor") {
    base.splice(1, 0, { label: "Practicar flow", meta: "-20 energia, -2h", action: practiceFlow });
  }
  if (player.dinero >= 80) {
    base.splice(-1, 0, { label: "Carteles barrio", meta: "80 EUR - fans bonus", action: () => doMarketing("posters") });
  }
  if (player.dinero >= 150) {
    base.splice(-1, 0, { label: "Playlist pitching", meta: "150 EUR - streams bonus", action: () => doMarketing("playlist") });
  }
  if (player.single_listo) {
    base.unshift({ label: "Lanzar single", meta: "Publicar ahora", action: releaseSingle, primary: true });
  }

  return base;
}

function canUseAction(label) {
  const blockedByResources = {
    "Grabar single": player.energia < 25 || player.tiempo < 2,
    "Producir beats": player.energia < 22 || player.tiempo < 2,
    "Practicar flow": player.energia < 20 || player.tiempo < 2,
    Trabajar: player.energia < jobs[player.trabajo].energy || player.tiempo < jobs[player.trabajo].time,
  };
  return !blockedByResources[label];
}

function renderActions() {
  actionGrid.innerHTML = "";
  getActions().forEach((item) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `action-button${item.primary ? " is-primary" : ""}`;
    button.disabled = !canUseAction(item.label);
    button.innerHTML = `<strong>${item.label}</strong><span>${item.meta}</span>`;
    button.addEventListener("click", item.action);
    actionGrid.append(button);
  });
}

function renderFeed() {
  feedList.innerHTML = "";
  player.twitter_feed.forEach((tweet) => {
    const item = document.createElement("li");
    item.innerHTML = tweet;
    feedList.append(item);
  });
}

function render() {
  ui.day.textContent = player.dia;
  ui.artistHeader.textContent = player.nombre;
  ui.roleLine.textContent = `${player.rol} - ${player.genero}`;
  ui.energy.textContent = player.energia;
  ui.time.textContent = player.tiempo;
  ui.money.textContent = player.dinero;
  ui.followers.textContent = player.seguidores.toLocaleString("es-ES");
  ui.prodLevel.textContent = player.nivel_prod;
  ui.flowLevel.textContent = player.nivel_flow;
  ui.charisma.textContent = player.carisma;
  ui.reputation.textContent = player.reputacion;
  ui.singleStatus.textContent = player.single_listo ? "Single listo para lanzar" : `${player.single_progreso}% grabado`;
  ui.energyMeter.style.width = `${player.energia}%`;
  ui.timeMeter.style.width = `${(player.tiempo / 8) * 100}%`;
  ui.singleProgress.style.width = `${player.single_progreso}%`;
  renderActions();
  renderFeed();
}

creatorForm.addEventListener("submit", (event) => {
  event.preventDefault();
  player = createPlayer(new FormData(creatorForm));
  setupPanel.classList.add("is-hidden");
  gamePanel.classList.remove("is-hidden");
  render();
});

document.querySelector("#resetButton").addEventListener("click", () => {
  player = null;
  gamePanel.classList.add("is-hidden");
  setupPanel.classList.remove("is-hidden");
});
