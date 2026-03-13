// ═══════════════════════════════════════════════════════
// DONNÉES DES RÔLES
// ═══════════════════════════════════════════════════════
const ROLES_DATA = [
  {
    id: "LOUP",
    name: "Loup-Garou",
    icon: "🐺",
    camp: "Loups-Garous",
    color: "#c0392b",
    desc: "Chaque nuit, les loups votent en secret — la victime est dévorée uniquement si le vote est unanime.",
    tags: ["Élimination", "Nuit"],
    min: 1,
    max: 8,
    base: true,
    origin: "Base",
    nightAction: "vote_kill",
  },
  {
    id: "LOUP_BLANC",
    name: "Le Banni",
    icon: "🌫️",
    camp: "Solitaires",
    color: "#bdc3c7",
    desc: "Gagne seul s'il est le dernier survivant. Une nuit sur deux peut éliminer un loup en secret.",
    tags: ["Solitaire"],
    min: 0,
    max: 1,
    base: false,
    origin: "Crépuscule",
    nightAction: "none",
  },
  {
    id: "LOUP_VOYANT",
    name: "Chasseur de Sang",
    icon: "🕵️",
    camp: "Loups-Garous",
    color: "#e74c3c",
    desc: "Une fois par partie, marque secrètement une cible : les loups la prioriseront à la prochaine chasse.",
    tags: ["Marquage", "Nuit"],
    min: 0,
    max: 2,
    base: false,
    origin: "Crépuscule",
    nightAction: "vote_kill",
  },
  {
    id: "GRAND_LOUP",
    name: "L'Alpha",
    icon: "🐾",
    camp: "Loups-Garous",
    color: "#922b21",
    desc: "Si aucun loup n'est mort depuis 2 nuits consécutives, entre en frénésie : la majorité simple suffit pour la chasse.",
    tags: ["Frénésie"],
    min: 0,
    max: 1,
    base: false,
    origin: "Crépuscule",
    nightAction: "vote_kill",
  },
  {
    id: "INFECT",
    name: "Le Maudit",
    icon: "🩸",
    camp: "Loups-Garous",
    color: "#7b241c",
    desc: "Peut mordre une victime au lieu de la tuer — elle devient loup. À la 2e morsure, le Maudit meurt à l'aube.",
    tags: ["Transition"],
    min: 0,
    max: 1,
    base: false,
    origin: "Crépuscule",
    nightAction: "infect",
  },
  {
    id: "VILLAGEOIS",
    name: "Villageois",
    icon: "🧑",
    camp: "Villageois",
    color: "#27ae60",
    desc: "Aucun pouvoir. La force du nombre.",
    tags: ["Passif"],
    min: 0,
    max: 12,
    base: true,
    origin: "Base",
    nightAction: "none",
  },
  {
    id: "VOYANTE",
    name: "Voyante",
    icon: "🔮",
    camp: "Villageois",
    color: "#9b59b6",
    desc: "Chaque nuit, voit le camp d'un joueur. Une fois par partie, peut voir son rôle exact — mais ce joueur est prévenu.",
    tags: ["Voyance", "Nuit"],
    min: 0,
    max: 1,
    base: true,
    origin: "Base",
    nightAction: "scry",
  },
  {
    id: "SORCIERE",
    name: "Sorcière",
    icon: "🧪",
    camp: "Villageois",
    color: "#16a085",
    desc: "Potion de Vie : protège un joueur pour la nuit suivante. Potion de Trépas : maudit un joueur, il mourra avant le prochain vote.",
    tags: ["Protection", "Malédiction"],
    min: 0,
    max: 1,
    base: true,
    origin: "Base",
    nightAction: "potion",
  },
  {
    id: "CHASSEUR",
    name: "Chasseur",
    icon: "🏹",
    camp: "Villageois",
    color: "#d35400",
    desc: "À sa mort, désigne deux suspects. Le village vote entre eux pour décider lequel l'accompagne dans la mort.",
    tags: ["Réaction"],
    min: 0,
    max: 1,
    base: true,
    origin: "Base",
    nightAction: "none",
  },
  {
    id: "CUPIDON",
    name: "Cupidon",
    icon: "💘",
    camp: "Villageois",
    color: "#e91e8c",
    desc: "La 1ère nuit, lie deux joueurs qui peuvent se parler la nuit. Si l'un meurt, l'autre a une nuit de vengeance avant de périr.",
    tags: ["Lien", "1ère nuit"],
    min: 0,
    max: 1,
    base: true,
    origin: "Base",
    nightAction: "cupidon",
  },
  {
    id: "PETITE_FILLE",
    name: "La Gamine",
    icon: "👧",
    camp: "Villageois",
    color: "#f39c12",
    desc: "Peut espionner la nuit : elle apprend le nombre de loups vivants. Si les loups votent unanimement contre elle cette nuit, elle est éliminée.",
    tags: ["Voyance", "Risqué"],
    min: 0,
    max: 1,
    base: false,
    origin: "Base",
    nightAction: "none",
  },
  {
    id: "ANCIEN",
    name: "Le Patriarche",
    icon: "🏛️",
    camp: "Villageois",
    color: "#95a5a6",
    desc: "Survit à la 1ère attaque de loup. Si le village l'élimine, il retire définitivement le pouvoir d'un joueur de son choix.",
    tags: ["Protection", "Réaction"],
    min: 0,
    max: 1,
    base: false,
    origin: "Crépuscule",
    nightAction: "none",
  },
  {
    id: "SALVATEUR",
    name: "L'Égide",
    icon: "🛡",
    camp: "Villageois",
    color: "#2980b9",
    desc: "Chaque nuit pose un sceau sur un joueur. Le sceau absorbe une attaque puis se brise définitivement pour ce joueur.",
    tags: ["Protection", "Nuit"],
    min: 0,
    max: 1,
    base: false,
    origin: "Base",
    nightAction: "protect",
  },
  {
    id: "CORBEAU",
    name: "Corbeau",
    icon: "🐦‍⬛",
    camp: "Villageois",
    color: "#626567",
    desc: "Chaque nuit désigne un suspect annoncé publiquement au village. Aucun malus de vote — l'effet est purement social. Reste anonyme.",
    tags: ["Social", "Nuit"],
    min: 0,
    max: 1,
    base: false,
    origin: "Base",
    nightAction: "corbeau",
  },
  {
    id: "BOUC",
    name: "Le Paria",
    icon: "⛓️",
    camp: "Villageois",
    color: "#a04000",
    desc: "En cas d'égalité au vote, c'est lui qui choisit secrètement lequel des candidats à égalité est éliminé.",
    tags: ["Vote"],
    min: 0,
    max: 1,
    base: false,
    origin: "Crépuscule",
    nightAction: "none",
  },
  {
    id: "IDIOT",
    name: "Fou du Roi",
    icon: "🃏",
    camp: "Villageois",
    color: "#f1c40f",
    desc: "S'il est voté, il survit — mais son rôle est révélé à tous et les loups le cibleront en priorité la nuit suivante.",
    tags: ["Protection", "Révélation"],
    min: 0,
    max: 1,
    base: false,
    origin: "Crépuscule",
    nightAction: "none",
  },
  {
    id: "FLUTE",
    name: "Le Ménestrel",
    icon: "🎶",
    camp: "Solitaires",
    color: "#8e44ad",
    desc: "Chaque nuit charme 2 joueurs qui se reconnaissent entre eux. Gagne si tous les survivants sont charmés.",
    tags: ["Solitaire", "Nuit"],
    min: 0,
    max: 1,
    base: false,
    origin: "Crépuscule",
    nightAction: "charm",
  },
  {
    id: "MONTREUR",
    name: "Le Meunier",
    icon: "🌾",
    camp: "Villageois",
    color: "#6e2f00",
    desc: "Chaque matin un bruit sourd retentit si l'un de ses voisins est loup. Peut bloquer ce signal une fois pour ne pas se trahir.",
    tags: ["Passif"],
    min: 0,
    max: 1,
    base: false,
    origin: "Crépuscule",
    nightAction: "none",
  },
  {
    id: "RENARD",
    name: "L'Éclaireur",
    icon: "🔍",
    camp: "Villageois",
    color: "#e67e22",
    desc: "Examine 3 joueurs adjacents et apprend si parmi eux se cache un loup. Perd son pouvoir si le groupe inspecté est sans loup.",
    tags: ["Voyance", "Nuit"],
    min: 0,
    max: 1,
    base: false,
    origin: "Crépuscule",
    nightAction: "scry_camp",
  },
  {
    id: "CHEVALIER",
    name: "Le Pestiféré",
    icon: "☠️",
    camp: "Villageois",
    color: "#717d7e",
    desc: "À sa mort, tous les loups qui ont voté contre lui ne peuvent pas voter lors du prochain jour.",
    tags: ["Réaction"],
    min: 0,
    max: 1,
    base: false,
    origin: "Crépuscule",
    nightAction: "none",
  },
  {
    id: "NECRO",
    name: "Le Médium",
    icon: "💀",
    camp: "Villageois",
    color: "#2c3e50",
    desc: "Chaque nuit pose une question oui/non à un mort. Le mort répond honnêtement. Seul le Médium connaît la réponse.",
    tags: ["Voyance", "Nuit"],
    min: 0,
    max: 1,
    base: false,
    origin: "Crépuscule",
    nightAction: "necro",
  },
  {
    id: "ANGE",
    name: "Le Martyr",
    icon: "✝️",
    camp: "Solitaires",
    color: "#bdc3c7",
    desc: "Gagne s'il est éliminé par vote lors des 2 premières journées. Après, il devient Villageois ordinaire.",
    tags: ["Solitaire"],
    min: 0,
    max: 1,
    base: false,
    origin: "Crépuscule",
    nightAction: "none",
  },
  {
    id: "LAPIN",
    name: "Le Fantôme",
    icon: "👻",
    camp: "Solitaires",
    color: "#d5dbdb",
    desc: "S'il est le premier à mourir, il revient en spectre : chaque nuit peut bloquer l'action d'un joueur vivant.",
    tags: ["Solitaire", "Spectre"],
    min: 0,
    max: 1,
    base: false,
    origin: "Crépuscule",
    nightAction: "none",
  },
  {
    id: "SECTAIRE",
    name: "Le Héraut Noir",
    icon: "🕯️",
    camp: "Solitaires",
    color: "#6c3483",
    desc: "Chaque nuit change secrètement d'allégeance. Gagne si le camp qu'il a rejoint en dernier remporte la partie.",
    tags: ["Solitaire"],
    min: 0,
    max: 1,
    base: false,
    origin: "Crépuscule",
    nightAction: "none",
  },
  {
    id: "VOLEUR",
    name: "Voleur",
    icon: "🎭",
    camp: "Ambigus",
    color: "#717d7e",
    desc: "La 1ère nuit, voit deux cartes mises de côté et peut en prendre une. S'il prend un rôle Loup, il rejoint les loups dès la 2e nuit.",
    tags: ["1ère nuit", "Choix"],
    min: 0,
    max: 1,
    base: false,
    origin: "Base",
    nightAction: "none",
  },
  {
    id: "CHIEN_LOUP",
    name: "Le Renégat",
    icon: "🔱",
    camp: "Ambigus",
    color: "#7b7d7d",
    desc: "Chaque nuit aide les loups ou le village. Après 3 nuits consécutives du même côté, il bascule définitivement dans ce camp.",
    tags: ["Accumulation", "Choix"],
    min: 0,
    max: 1,
    base: false,
    origin: "Crépuscule",
    nightAction: "none",
  },
  {
    id: "ENFANT",
    name: "L'Orphelin",
    icon: "🌿",
    camp: "Ambigus",
    color: "#1e8449",
    desc: "Choisit un mentor. Si le mentor est éliminé par vote, l'Orphelin devient loup. Si mort de nuit, il reste villageois mais gagne une vision unique.",
    tags: ["Transition"],
    min: 0,
    max: 1,
    base: false,
    origin: "Crépuscule",
    nightAction: "none",
  },
  {
    id: "CAPITAINE",
    name: "Le Seigneur",
    icon: "👑",
    camp: "Spéciales",
    color: "#d4ac0d",
    desc: "Vote ×2 et vote en dernier. Son identité est publique. S'il est révélé loup à sa mort, les loups perdent immédiatement.",
    tags: ["Vote", "Public"],
    min: 0,
    max: 1,
    base: false,
    origin: "Crépuscule",
    nightAction: "none",
  },
  {
    id: "PYROMANE",
    name: "L'Apothicaire",
    icon: "🧫",
    camp: "Villageois",
    color: "#e74c3c",
    desc: "Chaque nuit : marque un joueur (3 marques = mort) OU soigne une marque existante. Ne peut pas faire les deux la même nuit.",
    tags: ["Accumulation", "Soin", "Nuit"],
    min: 0,
    max: 1,
    base: false,
    origin: "Crépuscule",
    nightAction: "mark",
  },
];

const CAMP_COLORS = {
  "Loups-Garous": "#c0392b",
  Villageois: "#27ae60",
  Solitaires: "#8e44ad",
  Ambigus: "#7f8c8d",
  Spéciales: "#d4ac0d",
};
const CAMP_ICONS = {
  "Loups-Garous": "🐺",
  Villageois: "🛡",
  Solitaires: "👤",
  Ambigus: "🎭",
  Spéciales: "⭐",
};

const PRESETS = {
  debutant: {
    8: [
      { id: "LOUP", n: 2 },
      { id: "VOYANTE", n: 1 },
      { id: "SORCIERE", n: 1 },
      { id: "CHASSEUR", n: 1 },
      { id: "VILLAGEOIS", n: 3 },
    ],
    12: [
      { id: "LOUP", n: 3 },
      { id: "VOYANTE", n: 1 },
      { id: "SORCIERE", n: 1 },
      { id: "CHASSEUR", n: 1 },
      { id: "CUPIDON", n: 1 },
      { id: "VILLAGEOIS", n: 5 },
    ],
  },
  classique: {
    8: [
      { id: "LOUP", n: 2 },
      { id: "VOYANTE", n: 1 },
      { id: "SORCIERE", n: 1 },
      { id: "CHASSEUR", n: 1 },
      { id: "CUPIDON", n: 1 },
      { id: "SALVATEUR", n: 1 },
      { id: "VILLAGEOIS", n: 1 },
    ],
    12: [
      { id: "LOUP", n: 3 },
      { id: "VOYANTE", n: 1 },
      { id: "SORCIERE", n: 1 },
      { id: "CHASSEUR", n: 1 },
      { id: "CUPIDON", n: 1 },
      { id: "SALVATEUR", n: 1 },
      { id: "CORBEAU", n: 1 },
      { id: "ANCIEN", n: 1 },
      { id: "VILLAGEOIS", n: 2 },
    ],
  },
  avance: {
    8: [
      { id: "LOUP", n: 2 },
      { id: "LOUP_VOYANT", n: 1 },
      { id: "VOYANTE", n: 1 },
      { id: "SORCIERE", n: 1 },
      { id: "CHASSEUR", n: 1 },
      { id: "RENARD", n: 1 },
      { id: "VILLAGEOIS", n: 1 },
    ],
    12: [
      { id: "LOUP", n: 2 },
      { id: "LOUP_BLANC", n: 1 },
      { id: "GRAND_LOUP", n: 1 },
      { id: "VOYANTE", n: 1 },
      { id: "SORCIERE", n: 1 },
      { id: "CHASSEUR", n: 1 },
      { id: "SALVATEUR", n: 1 },
      { id: "CORBEAU", n: 1 },
      { id: "MONTREUR", n: 1 },
      { id: "IDIOT", n: 1 },
      { id: "VILLAGEOIS", n: 1 },
    ],
  },
  chaos: {
    8: [
      { id: "LOUP", n: 2 },
      { id: "INFECT", n: 1 },
      { id: "VOYANTE", n: 1 },
      { id: "SORCIERE", n: 1 },
      { id: "FLUTE", n: 1 },
      { id: "ANGE", n: 1 },
      { id: "VILLAGEOIS", n: 1 },
    ],
    12: [
      { id: "LOUP", n: 2 },
      { id: "LOUP_BLANC", n: 1 },
      { id: "INFECT", n: 1 },
      { id: "VOYANTE", n: 1 },
      { id: "SORCIERE", n: 1 },
      { id: "CHASSEUR", n: 1 },
      { id: "FLUTE", n: 1 },
      { id: "ANGE", n: 1 },
      { id: "LAPIN", n: 1 },
      { id: "CHIEN_LOUP", n: 1 },
      { id: "VILLAGEOIS", n: 1 },
    ],
  },
};

// ═══════════════════════════════════════════════════════
// ÉTAT GLOBAL
// ═══════════════════════════════════════════════════════
let G = {
  currentScreen: "s-home",
  salonConfig: { name: "", playerCount: 8, creatorName: "" },
  selectedRoles: {},
  salons: [],
  game: null,
  myPlayerId: null,
  isSpectator: false,
  selectedTarget: null,
  actionDone: false, // action de nuit envoyée
  voteDone: false, // vote du jour envoyé
  lastLogLen: 0,
  lastChatLen: 0,
  countdownInterval: null,
};

const uid = () => Math.random().toString(36).slice(2, 9);
const code4 = () => Math.random().toString(36).slice(2, 6).toUpperCase();
const shuffle = (a) => {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
};
const $ = (id) => document.getElementById(id);
const hexRgb = (h) => {
  const r = parseInt(h.slice(1, 3), 16),
    g = parseInt(h.slice(3, 5), 16),
    b = parseInt(h.slice(5, 7), 16);
  return `${r},${g},${b}`;
};
const getRoleData = (id) => ROLES_DATA.find((r) => r.id === id);

// ── Persistance session ──
function getOrCreatePlayerId() {
  let id = localStorage.getItem("lg_player_id");
  if (!id) {
    id = "p_" + Math.random().toString(36).slice(2, 10);
    localStorage.setItem("lg_player_id", id);
  }
  return id;
}
function saveSession(code, name, isHost) {
  localStorage.setItem(
    "lg_session",
    JSON.stringify({ code, name, isHost, ts: Date.now() }),
  );
}
function loadSession() {
  try {
    return JSON.parse(localStorage.getItem("lg_session") || "null");
  } catch (e) {
    return null;
  }
}
function clearSession() {
  localStorage.removeItem("lg_session");
}

let MY_NAME = "",
  MY_CODE = "",
  MY_PLAYER_ID = getOrCreatePlayerId(),
  IS_HOST = false,
  POLL_INTERVAL = null;

// ═══════════════════════════════════════════════════════
// SCREENS
// ═══════════════════════════════════════════════════════
function showScreen(id) {
  document
    .querySelectorAll(".screen")
    .forEach((s) => s.classList.remove("active"));
  $(id)?.classList.add("active");
  G.currentScreen = id;
  window.scrollTo(0, 0);
  $("nav-home")?.classList.toggle("active", id === "s-home");
  $("nav-salon")?.classList.toggle(
    "active",
    id === "s-salon" || id === "s-config",
  );
}
function goHome() {
  showScreen("s-home");
}
function goSalon() {
  showScreen("s-salon");
  renderSalonsList();
}
function backToSalon() {
  showScreen("s-salon");
}

// ═══════════════════════════════════════════════════════
// AMBIENT
// ═══════════════════════════════════════════════════════
(function initBg() {
  const sc = $("stars");
  for (let i = 0; i < 80; i++) {
    const s = document.createElement("div");
    s.className = "star";
    const sz = Math.random() * 1.8 + 0.3;
    s.style.cssText = `left:${Math.random() * 100}%;top:${Math.random() * 65}%;width:${sz}px;height:${sz}px;--d:${2 + Math.random() * 4}s;--delay:${Math.random() * 7}s`;
    sc.appendChild(s);
  }
  const tr = $("trees");
  for (let i = 0; i < 14; i++) {
    const x = (i / 13) * 100,
      h = 80 + Math.random() * 100,
      w = 30 + Math.random() * 25;
    const dark = `rgba(${8 + Math.random() * 6},${5 + Math.random() * 4},${2 + Math.random() * 2},.98)`;
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", w);
    svg.setAttribute("height", h);
    svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
    svg.className = "tree-svg";
    svg.style.cssText = `left:${x}%;transform:translateX(-50%);opacity:${0.85 + Math.random() * 0.15}`;
    const trunk = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "rect",
    );
    trunk.setAttribute("x", w / 2 - 3);
    trunk.setAttribute("y", h - 15);
    trunk.setAttribute("width", 6);
    trunk.setAttribute("height", 15);
    trunk.setAttribute("fill", "#1a0f05");
    for (let lvl = 0; lvl < 3; lvl++) {
      const py = h - 18 - (lvl * (h - 20)) / 3.2,
        pw = w * (1 - lvl * 0.2);
      const tri = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "polygon",
      );
      tri.setAttribute(
        "points",
        `${w / 2},${py - (h - 20) / 3.5} ${w / 2 - pw / 2},${py} ${w / 2 + pw / 2},${py}`,
      );
      tri.setAttribute("fill", dark);
      svg.appendChild(tri);
    }
    svg.appendChild(trunk);
    tr.appendChild(svg);
  }
  const cl = $("candles-layer");
  [
    [5, 85],
    [12, 90],
    [88, 88],
    [94, 84],
    [22, 92],
    [76, 91],
  ].forEach(([x, y]) => {
    const p = document.createElement("div");
    p.className = "candle-particle";
    const sz = 3 + Math.random() * 4;
    p.style.cssText = `left:${x}%;top:${y}%;width:${sz}px;height:${sz * 1.5}px;--cd:${2 + Math.random() * 3}s;--cdelay:${Math.random() * 4}s`;
    cl.appendChild(p);
  });
})();

// ═══════════════════════════════════════════════════════
// PAGE ACCUEIL — RÔLES
// ═══════════════════════════════════════════════════════
function renderAllRoles(filter = "all") {
  const container = $("roles-display");
  const camps = filter === "all" ? Object.keys(CAMP_COLORS) : [filter];
  let html = "";
  for (const camp of camps) {
    const roles = ROLES_DATA.filter((r) => r.camp === camp);
    if (!roles.length) continue;
    const cc = CAMP_COLORS[camp] || "#888";
    html += `<div class="camp-block"><div class="camp-title" style="background:rgba(${hexRgb(cc)},.15);border:1px solid ${cc}33;color:${cc}">${CAMP_ICONS[camp] || ""} Camp : ${camp}</div><div class="roles-grid">`;
    for (const r of roles) {
      html += `<div class="role-card"><div class="role-card-inner">
        <div class="role-icon" style="background:rgba(${hexRgb(r.color)},.15)">${r.icon}</div>
        <div class="role-info"><div class="role-name" style="color:${r.color}">${r.name}</div>
        <div class="role-desc">${r.desc}</div>
        <div class="role-tags">${r.tags.map((t) => `<span class="tag">${t}</span>`).join("")}<span class="tag" style="color:var(--gold)">${r.origin}</span></div>
        </div></div></div>`;
    }
    html += "</div></div>";
  }
  container.innerHTML = html;
}
function filterRoles(camp, btn) {
  document
    .querySelectorAll("#role-filter-tabs .tab")
    .forEach((t) => t.classList.remove("active"));
  btn.classList.add("active");
  renderAllRoles(camp === "all" ? "all" : camp);
}

// ═══════════════════════════════════════════════════════
// SALON TABS
// ═══════════════════════════════════════════════════════
function switchSalonTab(name) {
  document
    .querySelectorAll(".salon-pane")
    .forEach((p) => p.classList.add("hidden"));
  document
    .querySelectorAll("#salon-tabs .tab")
    .forEach((t) => t.classList.remove("active"));
  $("salon-" + name)?.classList.remove("hidden");
  $("tab-" + name)?.classList.add("active");
  if (name === "join") loadSalonsList();
}

function selectCount(count, el) {
  document
    .querySelectorAll(".count-btn")
    .forEach((b) => b.classList.remove("active"));
  el.classList.add("active");
  G.salonConfig.playerCount = count;
  $("custom-count-wrap").style.display = count === "custom" ? "block" : "none";
}
function getPlayerCount() {
  if (G.salonConfig.playerCount === "custom")
    return Math.min(
      Math.max(parseInt($("custom-count-input").value) || 8, 4),
      20,
    );
  return G.salonConfig.playerCount;
}

// ═══════════════════════════════════════════════════════
// CONFIG RÔLES
// ═══════════════════════════════════════════════════════
function openConfig() {
  G.salonConfig.name = $("salon-name-input")?.value.trim() || "Village Maudit";
  G.salonConfig.creatorName = $("creator-name-input")?.value.trim() || "Hôte";
  G.salonConfig.playerCount = getPlayerCount();
  if (!Object.keys(G.selectedRoles).length) applyPreset("classique");
  renderConfigScreen();
  showScreen("s-config");
}
function renderConfigScreen() {
  $("stat-target").textContent = G.salonConfig.playerCount;
  renderConfigRoles();
  updateConfigStats();
}
function renderConfigRoles() {
  const container = $("config-roles-container");
  const camps = [
    "Loups-Garous",
    "Villageois",
    "Solitaires",
    "Ambigus",
    "Spéciales",
  ];
  let html = "";
  for (const camp of camps) {
    const roles = ROLES_DATA.filter((r) => r.camp === camp);
    if (!roles.length) continue;
    const cc = CAMP_COLORS[camp] || "#888";
    html += `<div style="margin-bottom:20px"><div class="camp-title" style="background:rgba(${hexRgb(cc)},.12);border:1px solid ${cc}33;color:${cc};margin-bottom:12px">${CAMP_ICONS[camp]} ${camp}</div><div class="config-roles-grid">`;
    for (const r of roles) {
      const qty = G.selectedRoles[r.id] || 0;
      html += `<div class="config-role-card ${qty > 0 ? "selected" : ""}" id="cfg-${r.id}" style="${qty > 0 ? `border-color:${r.color}44;` : ""}">
        <div class="config-role-top"><div class="config-role-icon" style="background:rgba(${hexRgb(r.color)},.18)">${r.icon}</div><div class="config-role-name" style="color:${r.color}">${r.name}</div></div>
        <div class="config-role-desc">${r.desc}</div>
        <div class="qty-control">
          <button class="qty-btn" onclick="changeQty('${r.id}',-1)">−</button>
          <span class="qty-num" id="qty-${r.id}">${qty}</span>
          <button class="qty-btn" onclick="changeQty('${r.id}',1)">+</button>
          <div class="role-tags" style="margin-top:0;margin-left:4px">${r.tags
            .slice(0, 1)
            .map((t) => `<span class="tag">${t}</span>`)
            .join("")}</div>
        </div></div>`;
    }
    html += "</div></div>";
  }
  container.innerHTML = html;
}
function changeQty(roleId, delta) {
  const r = getRoleData(roleId);
  const cur = G.selectedRoles[roleId] || 0;
  const next = Math.min(Math.max(cur + delta, 0), r.max || 1);
  if (next === 0) delete G.selectedRoles[roleId];
  else G.selectedRoles[roleId] = next;
  const qEl = $(`qty-${roleId}`);
  if (qEl) qEl.textContent = next;
  const card = $(`cfg-${roleId}`);
  if (card) {
    card.classList.toggle("selected", next > 0);
    card.style.borderColor = next > 0 ? `${r.color}44` : "";
  }
  updateConfigStats();
}
function updateConfigStats() {
  let total = 0,
    loups = 0,
    village = 0;
  for (const [id, n] of Object.entries(G.selectedRoles)) {
    const r = getRoleData(id);
    if (!r) continue;
    total += n;
    if (r.camp === "Loups-Garous") loups += n;
    else if (r.camp === "Villageois") village += n;
  }
  $("stat-total").textContent = total;
  $("stat-loups").textContent = loups;
  $("stat-village").textContent = village;
  const target = G.salonConfig.playerCount,
    diff = total - target;
  const bar = $("balance-bar"),
    warn = $("config-warning"),
    launch = $("launch-btn");
  if (total === 0) {
    bar.textContent = "Aucun rôle sélectionné";
    warn.style.display = "none";
    launch.disabled = true;
    return;
  }
  if (diff < 0) {
    bar.innerHTML = `<span style="color:var(--gold)">⚠ Il manque ${-diff} rôle(s) (${total}/${target})</span>`;
    warn.textContent = `Ajoutez ${-diff} rôle(s)`;
    warn.style.display = "block";
    launch.disabled = true;
  } else if (diff > 0) {
    bar.innerHTML = `<span style="color:var(--red)">⚠ ${diff} rôle(s) en trop (${total}/${target})</span>`;
    warn.textContent = `Retirez ${diff} rôle(s)`;
    warn.style.display = "block";
    launch.disabled = true;
  } else {
    const ratio = loups / total;
    let msg = "",
      color = "";
    if (ratio < 0.15) {
      msg = "🤔 Très peu de loups";
      color = "var(--blue)";
    } else if (ratio < 0.25) {
      msg = "✅ Équilibre recommandé";
      color = "var(--green)";
    } else if (ratio < 0.35) {
      msg = "⚔️ Beaucoup de loups — partie intense";
      color = "var(--gold)";
    } else {
      msg = "💀 Loups majoritaires — très difficile";
      color = "var(--red)";
    }
    bar.innerHTML = `<span style="color:${color}">${msg} · ${loups} loup(s) / ${total} joueurs</span>`;
    warn.style.display = "none";
    launch.disabled = false;
  }
}
function applyPreset(name) {
  const n = G.salonConfig.playerCount,
    key = n >= 10 ? 12 : 8;
  const preset = PRESETS[name]?.[key] || PRESETS[name]?.[8] || [];
  G.selectedRoles = {};
  for (const { id, n: qty } of preset) G.selectedRoles[id] = qty;
  if (G.currentScreen === "s-config") renderConfigScreen();
}
function resetConfig() {
  G.selectedRoles = {};
  renderConfigScreen();
}

// ═══════════════════════════════════════════════════════
// SALLE D'ATTENTE
// ═══════════════════════════════════════════════════════
function renderSalonsList() {
  const list = $("salons-list");
  if (!list) return;
  list.innerHTML =
    '<div style="color:var(--muted);font-style:italic;font-size:13px;text-align:center">Chargement…</div>';
  loadSalonsList();
}
function renderSpectateLists() {}

function showWaitingRoom(salon) {
  showScreen("s-salon");
  switchSalonTab("waiting");
  renderWaitingRoom(salon);
}
function renderWaitingRoom(salon) {
  const pane = $("salon-waiting");
  if (!pane) return;
  pane.innerHTML = `
    <div class="panel" style="margin-bottom:14px">
      <h3 class="heading" style="font-size:15px;margin-bottom:12px">🏰 ${salon.name}</h3>
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px">
        <span class="label" style="margin:0">Code :</span>
        <span style="font-family:var(--font-heading);font-size:22px;color:var(--gold-light);letter-spacing:4px">${salon.code}</span>
        <button class="btn btn-gold btn-sm" onclick="navigator.clipboard.writeText('${salon.code}');toast('Code copié !','success')">📋 Copier</button>
      </div>
      <p style="font-size:12px;color:var(--muted);font-style:italic;margin-bottom:12px">Partage ce code à tes amis !</p>
      <span class="label">Joueurs (${salon.players.length}/${salon.playerCount})</span>
      <div style="display:flex;flex-direction:column;gap:6px;margin-bottom:14px">
        ${salon.players
          .map(
            (
              p,
            ) => `<div style="display:flex;align-items:center;gap:8px;padding:8px 12px;background:rgba(201,150,12,.06);border:1px solid var(--border);border-radius:3px">
          <span>${p.isHost ? "👑" : "⚔️"}</span>
          <span style="font-family:var(--font-sub);font-size:12px;color:${p.isHost ? "var(--gold-light)" : "var(--text)"}">${p.name}${p.isHost ? " (Hôte)" : ""}</span>
        </div>`,
          )
          .join("")}
      </div>
      ${
        salon.isHost
          ? `<button class="btn btn-red" onclick="openConfig()">⚔️ Configurer les rôles →</button>`
          : `<p style="color:var(--muted);font-style:italic;font-size:13px;text-align:center">⏳ En attente que l'hôte lance la partie…</p>`
      }
    </div>`;
}

// ═══════════════════════════════════════════════════════
// JEU — ÉCRAN PRINCIPAL
// ═══════════════════════════════════════════════════════
function setGameTheme(phase) {
  const isNight =
    phase === "NIGHT" || phase === "REVEAL" || phase === "NIGHT_RESULT";
  document.body.classList.toggle("game-night", isNight);
  document.body.classList.toggle("game-day", !isNight);
  document.body.classList.remove("light"); // override thème manuel pendant la partie
}

// Timer visuel
let timerInterval = null;
let timerTotal = 0;
function startTimer(phaseEnd, totalMs) {
  if (timerInterval) clearInterval(timerInterval);
  timerTotal = totalMs || 60000;
  const disp = $("timer-display"),
    bar = $("timer-bar"),
    label = $("timer-phase-label");
  const phaseNames = {
    REVEAL: "Révélation",
    NIGHT: "Nuit",
    NIGHT_RESULT: "Aube",
    DAY: "Journée",
    DAY_RESULT: "Résultats",
    FINISHED: "Fin",
  };
  if (label && G.game) label.textContent = phaseNames[G.game.phase] || "Phase";
  const tick = () => {
    const rem = Math.max(0, Math.ceil((phaseEnd - Date.now()) / 1000));
    const m = Math.floor(rem / 60),
      s = rem % 60;
    if (disp) {
      disp.textContent =
        m > 0 ? `${m}:${s.toString().padStart(2, "0")}` : `${s}s`;
      disp.classList.toggle("urgent", rem <= 10);
    }
    const pct = Math.max(0, ((phaseEnd - Date.now()) / timerTotal) * 100);
    if (bar) {
      bar.style.width = pct + "%";
      bar.classList.toggle("urgent", pct < 15);
    }
    if (rem <= 0) clearInterval(timerInterval);
  };
  tick();
  timerInterval = setInterval(tick, 500);
}

function showGameScreen() {
  showScreen("s-game");
  if (G.game) setGameTheme(G.game.phase);
  renderGame();
}

function renderGame() {
  if (!G.game) return;
  const game = G.game;
  const phase = game.phase;
  const me = game.players?.find((p) => p.id === G.myPlayerId);
  const isNight =
    phase === "NIGHT" || phase === "NIGHT_RESULT" || phase === "REVEAL";
  const isDead = me && !me.alive;
  const myRole = me ? getRoleData(me.role) : null;

  setGameTheme(phase);

  // Topbar
  const badge = $("phase-badge");
  const phaseLabels = {
    REVEAL: "🎭 RÉVÉLATION",
    NIGHT: "🌙 NUIT",
    NIGHT_RESULT: "💀 ANNONCES",
    DAY: "☀️ JOUR",
    DAY_RESULT: "⚖️ RÉSULTATS",
    FINISHED: "🏆 FIN",
  };
  if (badge) {
    badge.className = isNight ? "night" : "day";
    badge.textContent = phaseLabels[phase] || phase;
  }
  const rn = $("round-num");
  if (rn) rn.textContent = game.round || 1;
  const sc = $("salon-code-display");
  if (sc) sc.textContent = MY_CODE || "—";

  // Timer
  if (game.phaseEnd) startTimer(game.phaseEnd, timerTotal || 60000);

  // Mon rôle
  if (me && myRole) {
    const bar = $("my-role-bar");
    if (bar) {
      bar.style.background = `rgba(${hexRgb(myRole.color)},.1)`;
      bar.style.border = `1px solid ${myRole.color}44`;
    }
    const ri = $("my-role-icon");
    if (ri) ri.textContent = myRole.icon;
    const rn2 = $("my-role-name");
    if (rn2) {
      rn2.textContent = myRole.name;
      rn2.style.color = myRole.color;
    }
    const rd = $("my-role-desc");
    if (rd) rd.textContent = myRole.desc;
    const db = $("dead-badge");
    if (db) db.classList.toggle("hidden", !isDead);
  }

  // Instruction
  const instr = $("instruction");
  if (instr) instr.textContent = getInstruction(phase, me, myRole, isDead);

  // Zone centrale (actions nuit) dans sidebar gauche
  renderPhaseZone(phase, me, myRole, isDead);

  // Bouton vote
  const vBtn = $("vote-open-btn");
  if (vBtn)
    vBtn.style.display =
      phase === "DAY" && me?.alive && !G.voteDone && !G.isSpectator
        ? "block"
        : "none";

  // Joueurs (sidebar droite)
  renderPlayersGrid(me, phase);

  // Log & Chat
  renderLog();
  renderChat();

  // Chat actif/inactif
  const chatOk =
    phase === "DAY" || phase === "DAY_RESULT" || isDead || G.isSpectator;
  const ci = $("chat-in"),
    cs = $("chat-send"),
    cni = $("chat-night-indicator");
  if (ci) {
    ci.disabled = !chatOk;
    ci.placeholder = chatOk ? "Parlez au village…" : "";
  }
  if (cs) cs.disabled = !chatOk;
  if (cni) cni.style.display = chatOk ? "none" : "inline";
}

function getInstruction(phase, me, myRole, isDead) {
  if (G.isSpectator) return "👁 Mode spectateur — vous voyez tout.";
  if (isDead) return "💀 Vous êtes mort(e). Observez en silence.";
  const role = me?.role;
  const loupIds = ["LOUP", "GRAND_LOUP", "LOUP_VOYANT", "INFECT"];
  if (phase === "REVEAL")
    return `🎭 Mémorisez votre rôle avant que la nuit ne tombe…`;
  if (phase === "NIGHT") {
    if (G.actionDone) return "✓ Action envoyée. Attendez la fin de la nuit.";
    if (loupIds.includes(role)) return "🐺 Choisissez une victime à dévorer.";
    if (role === "VOYANTE") return "🔮 Choisissez un joueur à scruter.";
    if (role === "SORCIERE") return "🧪 Utilisez vos potions.";
    if (role === "SALVATEUR") return "🛡 Choisissez un joueur à protéger.";
    if (role === "CUPIDON") return "💘 Liez deux joueurs pour l'éternité.";
    if (role === "CORBEAU") return "🐦 Désignez un joueur (+2 votes demain).";
    return "😴 Vous dormez cette nuit…";
  }
  if (phase === "NIGHT_RESULT")
    return "🌅 L'aube se lève — découvrez les événements de la nuit.";
  if (phase === "DAY") {
    if (G.voteDone) return "✓ Vote enregistré. Attendez la fin du débat.";
    return "☀️ Débattez et votez pour éliminer un suspect.";
  }
  if (phase === "DAY_RESULT") return "⚖️ Le village a tranché…";
  return "";
}

function updateCountdown(phaseEnd) {
  /* géré par startTimer */
}

function renderPhaseZone(phase, me, myRole, isDead) {
  const zone = $("phase-zone");
  if (!zone) return;

  if (phase === "REVEAL") {
    zone.innerHTML = `
      <div style="text-align:center;padding:20px">
        <div style="font-size:48px;margin-bottom:12px">${myRole?.icon || "🎭"}</div>
        <div style="font-family:var(--font-heading);font-size:20px;color:${myRole?.color || "var(--gold)"};margin-bottom:8px">${myRole?.name || "?"}</div>
        <div style="font-size:13px;color:var(--muted);max-width:280px;margin:0 auto;line-height:1.6">${myRole?.desc || ""}</div>
        <div style="margin-top:14px;padding:8px 16px;border-radius:20px;display:inline-block;background:rgba(${hexRgb(myRole?.color || "#888")},.15);border:1px solid ${myRole?.color || "#888"}44;color:${myRole?.color || "#888"};font-size:12px;font-family:'Cinzel',serif">${CAMP_ICONS[myRole?.camp] || ""} ${myRole?.camp || ""}</div>
        <div style="margin-top:18px;font-size:12px;color:var(--muted);font-style:italic">Mémorisez votre rôle — la nuit commence dans <span id="phase-countdown" style="color:var(--gold)"></span></div>
      </div>`;
    updateCountdown(G.game.phaseEnd);
    return;
  }

  if (phase === "NIGHT") {
    const myLoupRole = ["LOUP", "GRAND_LOUP", "LOUP_VOYANT", "INFECT"].includes(
      me?.role,
    );
    // Loups se voient entre eux
    const fellowLoups = myLoupRole
      ? G.game.players.filter(
          (p) =>
            p.alive &&
            p.id !== me.id &&
            ["LOUP", "GRAND_LOUP", "LOUP_VOYANT", "INFECT"].includes(p.role),
        )
      : [];

    let actionHtml = "";
    if (!me?.alive) {
      actionHtml = `<div style="color:var(--muted);font-style:italic;text-align:center;padding:20px">💀 Vous êtes mort(e). Observez en silence.</div>`;
    } else if (G.actionDone) {
      actionHtml = `<div style="text-align:center;padding:16px;color:var(--green)">✓ Action envoyée — attendez la fin de la nuit.<br><span style="font-size:12px;color:var(--muted)">Fin dans <span id="phase-countdown"></span></span></div>`;
      updateCountdown(G.game.phaseEnd);
    } else {
      actionHtml = renderNightAction(me, myRole, fellowLoups);
    }
    zone.innerHTML = actionHtml;
    return;
  }

  if (phase === "NIGHT_RESULT" || phase === "DAY_RESULT") {
    const results =
      phase === "NIGHT_RESULT"
        ? G.game.nightResults || []
        : G.game.dayResults || [];
    zone.innerHTML = `
      <div style="padding:10px">
        <div style="font-family:var(--font-heading);font-size:14px;color:var(--gold);margin-bottom:12px;text-align:center">${phase === "NIGHT_RESULT" ? "🌅 Aube — Résultats de la nuit" : "⚖️ Résultats du vote"}</div>
        ${results.length ? results.map((r) => `<div style="padding:8px 12px;margin-bottom:6px;border-radius:4px;border-left:3px solid var(--gold);background:rgba(201,150,12,.08);font-size:13px;color:var(--text)">${r}</div>`).join("") : '<div style="color:var(--muted);text-align:center;font-style:italic">Aucun événement particulier.</div>'}
        <div style="text-align:center;margin-top:12px;font-size:12px;color:var(--muted)">Prochaine phase dans <span id="phase-countdown"></span></div>
      </div>`;
    updateCountdown(G.game.phaseEnd);
    return;
  }

  if (phase === "DAY") {
    const alive = G.game.players.filter((p) => p.alive);
    const voteCount = Object.keys(G.game.votes || {}).length;
    if (!me?.alive || G.isSpectator) {
      zone.innerHTML = `<div style="color:var(--muted);font-style:italic;text-align:center;padding:16px">${G.isSpectator ? "👁 Mode spectateur" : "💀 Vous êtes mort(e)"} — Observez le village débattre.<br><span style="font-size:12px">Fin du vote dans <span id="phase-countdown"></span></span></div>`;
      updateCountdown(G.game.phaseEnd);
      return;
    }
    if (G.voteDone) {
      const myTarget = G.game.players.find(
        (p) => p.id === G.game.votes?.[me.id],
      );
      zone.innerHTML = `<div style="text-align:center;padding:16px;color:var(--green)">✓ Vous avez voté contre <strong>${myTarget?.name || "?"}</strong><br><span style="font-size:12px;color:var(--muted)">${voteCount} vote(s) enregistré(s) — fin dans <span id="phase-countdown"></span></span></div>`;
      updateCountdown(G.game.phaseEnd);
      return;
    }
    // Grille de vote
    zone.innerHTML = `
      <div style="padding:8px">
        <div style="font-family:var(--font-heading);font-size:13px;color:var(--gold);margin-bottom:10px;text-align:center">⚖️ Votez pour éliminer un suspect — <span id="phase-countdown"></span></div>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:8px">
          ${alive
            .filter((p) => p.id !== me.id)
            .map(
              (p) => `
            <button onclick="submitVote('${p.id}')" style="padding:10px 8px;background:rgba(180,40,20,.1);border:1px solid rgba(180,40,20,.3);border-radius:6px;cursor:pointer;font-family:'Cinzel',serif;font-size:11px;color:var(--text);transition:all .2s;display:flex;flex-direction:column;align-items:center;gap:4px"
              onmouseover="this.style.background='rgba(180,40,20,.25)';this.style.borderColor='rgba(180,40,20,.6)'"
              onmouseout="this.style.background='rgba(180,40,20,.1)';this.style.borderColor='rgba(180,40,20,.3)'">
              <span style="font-size:20px">${getRoleData(p.role)?.icon || "🧑"}</span>
              <span>${p.name}</span>
            </button>`,
            )
            .join("")}
        </div>
        <div style="text-align:center;margin-top:10px;font-size:11px;color:var(--muted)">${voteCount} vote(s) enregistré(s)</div>
      </div>`;
    updateCountdown(G.game.phaseEnd);
    return;
  }

  if (phase === "FINISHED") {
    zone.innerHTML = "";
    showEnd();
  }
}

function renderNightAction(me, myRole, fellowLoups) {
  const role = me.role;
  const alive = G.game.players.filter((p) => p.alive && p.id !== me.id);
  const dead = G.game.players.filter((p) => !p.alive);
  const round = G.game.round || 1;

  const playerBtns = (
    players,
    action,
    label,
    color = "var(--red)",
    extraFilter = null,
  ) => {
    const filtered = extraFilter ? players.filter(extraFilter) : players;
    if (!filtered.length)
      return `<div style="color:var(--muted);font-style:italic;font-size:12px">Aucune cible disponible.</div>`;
    return `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(110px,1fr));gap:8px;margin-top:8px">
      ${filtered
        .map(
          (
            p,
          ) => `<button onclick="sendNightAction('${action}:${p.id}')" style="padding:8px;background:rgba(180,40,20,.1);border:1px solid rgba(180,40,20,.3);border-radius:6px;cursor:pointer;font-family:'Cinzel',serif;font-size:11px;color:var(--text);transition:all .2s;display:flex;flex-direction:column;align-items:center;gap:3px"
        onmouseover="this.style.borderColor='${color}';this.style.background='rgba(180,40,20,.2)'"
        onmouseout="this.style.borderColor='rgba(180,40,20,.3)';this.style.background='rgba(180,40,20,.1)'">
        <span style="font-size:18px">${getRoleData(p.role)?.icon || "🧑"}</span><span>${p.name}</span>
      </button>`,
        )
        .join("")}
    </div>`;
  };

  const loupIds = ["LOUP", "GRAND_LOUP", "LOUP_VOYANT", "INFECT"];

  // ── Loups ──
  if (loupIds.includes(role)) {
    let html = `<div style="padding:8px"><div style="font-family:var(--font-heading);font-size:13px;color:var(--red);margin-bottom:8px">🐺 Choisissez une victime à dévorer</div>`;
    if (fellowLoups.length)
      html += `<div style="font-size:11px;color:var(--muted);margin-bottom:8px">Vos complices : ${fellowLoups.map((p) => `<strong>${p.name}</strong>`).join(", ")}</div>`;
    html += playerBtns(
      alive,
      "kill",
      "Dévorer",
      "var(--red)",
      (p) => !loupIds.includes(p.role),
    );
    html += `</div>`;
    return html;
  }

  // ── Voyante ──
  if (role === "VOYANTE") {
    return `<div style="padding:8px"><div style="font-family:var(--font-heading);font-size:13px;color:#9b59b6;margin-bottom:8px">🔮 Choisissez un joueur à scruter</div>
      ${playerBtns(alive, "scry", "Voir le rôle", "#9b59b6")}</div>`;
  }

  // ── Sorcière ──
  if (role === "SORCIERE") {
    const wp = G.game.witchPotions || { life: true, death: true };
    const lastVictim = G.game.lastNightVictim;
    const victimPlayer = lastVictim
      ? G.game.players.find((p) => p.id === lastVictim)
      : null;
    return `<div style="padding:8px"><div style="font-family:var(--font-heading);font-size:13px;color:#16a085;margin-bottom:10px">🧪 Vos potions</div>
      ${
        victimPlayer && wp.life
          ? `<div style="margin-bottom:10px"><div style="font-size:12px;color:var(--muted);margin-bottom:6px">Les loups ont attaqué <strong>${victimPlayer.name}</strong> cette nuit.</div>
        <button onclick="sendNightAction('life:${victimPlayer.id}')" style="padding:8px 16px;background:rgba(22,160,133,.15);border:1px solid rgba(22,160,133,.4);border-radius:6px;color:#16a085;font-family:'Cinzel',serif;font-size:12px;cursor:pointer">💚 Potion de vie → Sauver ${victimPlayer.name}</button></div>`
          : ""
      }
      ${wp.death ? `<div><div style="font-size:12px;color:var(--muted);margin-bottom:6px">Potion de mort (tuer un joueur)</div>${playerBtns(alive, "death", "Empoisonner", "#c0392b")}</div>` : ""}
      ${!wp.life && !wp.death ? '<div style="color:var(--muted);font-style:italic">Vos deux potions ont été utilisées.</div>' : ""}
      <button onclick="sendNightAction('PASS')" style="margin-top:10px;padding:6px 14px;background:transparent;border:1px solid var(--border);border-radius:4px;color:var(--muted);font-family:'Cinzel',serif;font-size:11px;cursor:pointer">😴 Ne rien faire</button>
    </div>`;
  }

  // ── Salvateur ──
  if (role === "SALVATEUR") {
    return `<div style="padding:8px"><div style="font-family:var(--font-heading);font-size:13px;color:#2980b9;margin-bottom:8px">🛡 Choisissez un joueur à protéger</div>
      ${playerBtns(alive, "protect", "Protéger", "#2980b9")}</div>`;
  }

  // ── Cupidon (seulement nuit 1) ──
  if (role === "CUPIDON" && round === 1) {
    return `<div style="padding:8px"><div style="font-family:var(--font-heading);font-size:13px;color:#e91e8c;margin-bottom:8px">💘 Liez deux joueurs pour l'éternité</div>
      <div id="cupidon-sel" style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:8px"></div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(110px,1fr));gap:8px">
      ${G.game.players
        .filter((p) => p.alive)
        .map(
          (
            p,
          ) => `<button id="cpd-${p.id}" onclick="toggleCupidon('${p.id}','${p.name}')" style="padding:8px;background:rgba(233,30,140,.08);border:1px solid rgba(233,30,140,.3);border-radius:6px;cursor:pointer;font-family:'Cinzel',serif;font-size:11px;color:var(--text);display:flex;flex-direction:column;align-items:center;gap:3px">
        <span style="font-size:18px">🧑</span><span>${p.name}</span></button>`,
        )
        .join("")}
      </div></div>`;
  }

  // ── Corbeau ──
  if (role === "CORBEAU") {
    return `<div style="padding:8px"><div style="font-family:var(--font-heading);font-size:13px;color:#626567;margin-bottom:8px">🐦‍⬛ Désignez un joueur (+2 votes demain)</div>
      ${playerBtns(alive, "corbeau", "Désigner", "#626567")}</div>`;
  }

  // ── Renard ──
  if (role === "RENARD") {
    return `<div style="padding:8px"><div style="font-family:var(--font-heading);font-size:13px;color:#e67e22;margin-bottom:8px">🔍 Inspectez un groupe de 3 joueurs adjacents</div>
      ${playerBtns(alive, "scry_camp", "Inspecter", "#e67e22")}</div>`;
  }

  // ── Médium ──
  if (role === "NECRO" && dead.length) {
    return `<div style="padding:8px"><div style="font-family:var(--font-heading);font-size:13px;color:#2c3e50;margin-bottom:8px">💀 Interrogez l'esprit d'un mort</div>
      ${playerBtns(dead, "necro", "Interroger", "#2c3e50")}</div>`;
  }

  // ── Ménestrel ──
  if (role === "FLUTE") {
    return `<div style="padding:8px"><div style="font-family:var(--font-heading);font-size:13px;color:#8e44ad;margin-bottom:8px">🎶 Ensorcelez un joueur</div>
      ${playerBtns(alive, "charm", "Ensorceleur", "#8e44ad")}</div>`;
  }

  // ── Rôle passif ──
  return `<div style="text-align:center;padding:20px">
    <div style="font-size:32px;margin-bottom:8px">😴</div>
    <div style="color:var(--muted);font-style:italic">Vous dormez cette nuit…<br><span style="font-size:12px">La nuit se termine dans <span id="phase-countdown"></span></span></div>
    <button onclick="sendNightAction('PASS')" style="margin-top:12px;padding:8px 16px;background:transparent;border:1px solid var(--border);border-radius:4px;color:var(--muted);font-family:'Cinzel',serif;font-size:11px;cursor:pointer">Passer mon tour</button>
  </div>`;
}

// Cupidon — sélection de 2 joueurs
let cupidonSelected = [];
function toggleCupidon(id, name) {
  const btn = $(`cpd-${id}`);
  if (cupidonSelected.includes(id)) {
    cupidonSelected = cupidonSelected.filter((x) => x !== id);
    btn.style.background = "rgba(233,30,140,.08)";
    btn.style.borderColor = "rgba(233,30,140,.3)";
  } else {
    if (cupidonSelected.length >= 2) {
      toast("Vous ne pouvez lier que 2 joueurs !", "error");
      return;
    }
    cupidonSelected.push(id);
    btn.style.background = "rgba(233,30,140,.3)";
    btn.style.borderColor = "rgba(233,30,140,.7)";
  }
  const selDiv = $("cupidon-sel");
  if (selDiv)
    selDiv.innerHTML = cupidonSelected.length
      ? `<span style="color:#e91e8c;font-size:12px">Liés : ${cupidonSelected.map((x) => G.game.players.find((p) => p.id === x)?.name).join(" ❤️ ")}</span>`
      : "";
  if (cupidonSelected.length === 2) {
    setTimeout(
      () => sendNightAction("cupidon:" + cupidonSelected.join(",")),
      500,
    );
  }
}

function renderPlayersGrid(me, phase) {
  const grid = $("players-grid");
  if (!grid || !G.game) return;
  const showAllRoles = phase === "FINISHED" || G.isSpectator;
  const myLoupRole =
    me && ["LOUP", "GRAND_LOUP", "LOUP_VOYANT", "INFECT"].includes(me.role);

  grid.innerHTML = "";
  G.game.players.forEach((p) => {
    const isMe = p.id === G.myPlayerId;
    const isDead = !p.alive;
    const showRole =
      showAllRoles ||
      isMe ||
      isDead ||
      (myLoupRole &&
        ["LOUP", "GRAND_LOUP", "LOUP_VOYANT", "INFECT"].includes(p.role));
    const r = showRole ? getRoleData(p.role) : null;

    const card = document.createElement("div");
    card.className = "pcard" + (isDead ? " dead" : "");
    if (isMe) card.style.border = "2px solid rgba(240,192,64,.45)";

    card.innerHTML = `
      ${isDead ? '<div class="skull-ov">💀</div>' : ""}
      <div class="pcard-inner">
        <div class="pav" style="background:${r ? `rgba(${hexRgb(r.color)},.2)` : "rgba(255,255,255,.06)"};border:${isMe ? "2px solid var(--gold)" : "1px solid rgba(255,255,255,.1)"}">
          ${isDead ? "💀" : r ? r.icon : "?"}
        </div>
        <div>
          <div class="pname" style="color:${isMe ? "var(--gold)" : "var(--text)"}">${p.name}${isMe ? " (Vous)" : ""}</div>
          ${r && (showRole || isDead) ? `<div class="prole" style="color:${r.color}">${r.name}</div>` : ""}
          ${p.lover ? '<div style="font-size:10px;color:#e91e8c">💘 Amoureux</div>' : ""}
        </div>
      </div>`;
    grid.appendChild(card);
  });
}

function renderLog() {
  const box = $("log-box");
  if (!box || !G.game) return;
  const msgs = G.game.log.slice(-20);
  if (!msgs.length) {
    box.innerHTML =
      '<div style="color:var(--muted);font-style:italic;font-size:12px">Silence dans le village…</div>';
    return;
  }
  box.innerHTML = msgs
    .map(
      (m) => `<div class="log-entry log-${m.type || "info"}">${m.text}</div>`,
    )
    .join("");
  box.scrollTop = box.scrollHeight;
}

function renderChat() {
  const box = $("chat-msgs");
  if (!box || !G.game) return;
  const me = G.game.players?.find((p) => p.id === G.myPlayerId);
  const msgs = G.game.chat?.slice(-30) || [];
  if (!msgs.length) {
    box.innerHTML =
      '<div style="color:var(--muted);font-style:italic;font-size:12px">Silence dans le village…</div>';
    return;
  }
  box.innerHTML = msgs
    .map(
      (m) =>
        `<div class="cmsg"><span class="ca ${m.author === me?.name ? "me" : ""}">${m.author}:</span> <span style="color:#ccc">${m.text}</span></div>`,
    )
    .join("");
  box.scrollTop = box.scrollHeight;
}

function showEnd() {
  showScreen("s-end");
  const game = G.game;
  const w = game?.winner;
  const winMsgs = {
    VILLAGE: {
      icon: "🎉",
      title: "Le Village Triomphe !",
      color: "#27ae60",
      sub: "Les villageois ont chassé toutes les créatures de la nuit !",
    },
    LOUPS: {
      icon: "🐺",
      title: "Les Loups Gagnent !",
      color: "#c0392b",
      sub: "Les loups ont décimé le village…",
    },
    FLUTE: {
      icon: "🎶",
      title: "Le Ménestrel Gagne !",
      color: "#8e44ad",
      sub: "Tous les survivants sont ensorcelés !",
    },
    LOUP_BLANC: {
      icon: "🌫️",
      title: "Le Banni Gagne !",
      color: "#bdc3c7",
      sub: "Le Banni est le dernier survivant !",
    },
    ANGE: {
      icon: "✝️",
      title: "Le Martyr Gagne !",
      color: "#d5dbdb",
      sub: "Le Martyr a été sacrifié — sa mort était sa victoire !",
    },
  };
  const wm = winMsgs[w] || {
    icon: "❓",
    title: "Fin de partie",
    color: "var(--gold)",
    sub: "",
  };
  $("end-icon").textContent = wm.icon;
  $("end-title").textContent = wm.title;
  $("end-title").style.color = wm.color;
  $("end-sub").textContent = wm.sub;
  const endRoles = $("end-roles");
  endRoles.innerHTML = "";
  game?.players.forEach((p) => {
    const r = getRoleData(p.role);
    const row = document.createElement("div");
    row.className = "er";
    row.style.cssText = `background:rgba(${hexRgb(r?.color || "#888")},.08);border:1px solid ${r?.color || "#888"}22`;
    row.innerHTML = `<span style="font-size:19px">${r?.icon || "?"}</span><span class="er-name ${!p.alive ? "dead" : ""}">${p.name}${!p.alive ? " †" : ""}</span><span style="font-size:11px;color:${r?.color || "#888"}">${r?.name || p.role}</span>`;
    endRoles.appendChild(row);
  });
}

function quitGame() {
  if (!confirm("Quitter la partie et retourner à l'accueil ?")) return;
  stopPolling();
  if (timerInterval) clearInterval(timerInterval);
  document.body.classList.remove("game-night", "game-day");
  clearSession();
  G.game = null;
  G.myPlayerId = null;
  MY_CODE = "";
  IS_HOST = false;
  G.selectedRoles = {};
  showScreen("s-home");
  toast("Vous avez quitté la partie.", "info");
}

// Auto-rejoin si session sauvegardée
async function tryRejoin() {
  const session = loadSession();
  if (!session) return;
  // Session expirée après 4h
  if (Date.now() - session.ts > 1000 * 60 * 60 * 4) {
    clearSession();
    return;
  }
  const res = await api(
    "GET",
    `/api/salon/${session.code}?playerId=${MY_PLAYER_ID}`,
  );
  if (!res.ok || res.salon.status === "finished") {
    clearSession();
    return;
  }
  const salon = res.salon;
  MY_CODE = session.code;
  MY_NAME = session.name;
  IS_HOST = session.isHost;
  G.myPlayerId = MY_PLAYER_ID;
  G.game = {
    id: salon.code,
    code: salon.code,
    name: salon.name,
    round: salon.game?.round || 1,
    phase: salon.game?.phase || null,
    phaseEnd: salon.game?.phaseEnd,
    players: salon.players.map((p) => ({ ...p })),
    votes: salon.game?.votes || {},
    nightActions: {},
    log: salon.log || [],
    chat: salon.chat || [],
    winner: salon.game?.winner,
    witchPotions: salon.game?.witchPotions || { life: true, death: true },
    nightResults: salon.game?.nightResults || [],
    dayResults: salon.game?.dayResults || [],
  };
  G.lastLogLen = salon.log.length;
  G.lastChatLen = salon.chat.length;
  toast(`🔄 Reconnexion à la partie ${session.code}…`, "success");
  startPolling(session.code);
  if (salon.status === "waiting") {
    showWaitingRoom({ ...salon, isHost: IS_HOST });
  } else if (salon.status === "playing" && salon.game?.phase) {
    showGameScreen();
  }
}

// ═══════════════════════════════════════════════════════
// RÉSEAU HTTP
// ═══════════════════════════════════════════════════════
async function api(method, path, body) {
  try {
    const opts = { method, headers: { "Content-Type": "application/json" } };
    if (body) opts.body = JSON.stringify(body);
    const r = await fetch(path, opts);
    return await r.json();
  } catch (e) {
    console.error("API:", e);
    return { ok: false, error: e.message };
  }
}

function toast(msg, type = "info") {
  let t = $("toast-container");
  if (!t) {
    t = document.createElement("div");
    t.id = "toast-container";
    t.style.cssText =
      "position:fixed;top:70px;right:14px;z-index:9999;display:flex;flex-direction:column;gap:7px;pointer-events:none";
    document.body.appendChild(t);
  }
  const d = document.createElement("div");
  d.style.cssText = `padding:10px 16px;border-radius:4px;font-family:var(--font-sub);font-size:11px;letter-spacing:1px;color:var(--text);border:1px solid var(--border2);backdrop-filter:blur(8px);max-width:280px;animation:toastIn .3s ease;pointer-events:none;background:rgba(20,14,6,.97);box-shadow:0 4px 20px rgba(0,0,0,.6)`;
  if (type === "error") d.style.borderColor = "rgba(180,40,20,.6)";
  if (type === "success") d.style.borderColor = "rgba(80,160,60,.5)";
  d.textContent = msg;
  t.appendChild(d);
  setTimeout(() => d.remove(), 3500);
}
const styleToast = document.createElement("style");
styleToast.textContent =
  "@keyframes toastIn{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}";
document.head.appendChild(styleToast);

// ── Popup Vote ──
function openVotePopup() {
  const overlay = $("vote-popup-overlay"),
    popup = $("vote-popup"),
    body = $("vote-popup-body");
  if (!overlay || !popup || !body || !G.game) return;
  const me = G.game.players.find((p) => p.id === G.myPlayerId);
  const alive = G.game.players.filter((p) => p.alive && p.id !== me?.id);
  body.innerHTML = alive
    .map((p) => {
      const r = getRoleData(p.role);
      return `<button class="vote-player-btn" onclick="submitVoteFromPopup('${p.id}')">
      <span class="vpicon">${r?.icon || "🧑"}</span>
      <span>${p.name}</span>
    </button>`;
    })
    .join("");
  overlay.style.display = "block";
  popup.style.display = "block";
}
function closeVotePopup() {
  const overlay = $("vote-popup-overlay"),
    popup = $("vote-popup");
  if (overlay) overlay.style.display = "none";
  if (popup) popup.style.display = "none";
}
async function submitVoteFromPopup(targetId) {
  closeVotePopup();
  await submitVote(targetId);
}

function startPolling(code) {
  stopPolling();
  POLL_INTERVAL = setInterval(async () => {
    const res = await api("GET", `/api/salon/${code}?playerId=${MY_PLAYER_ID}`);
    if (!res.ok) return;
    const salon = res.salon;

    // Sync log
    if (salon.log.length > G.lastLogLen) {
      const newEntries = salon.log.slice(G.lastLogLen);
      newEntries.forEach((l) => {
        if (G.game && !G.game.log.find((e) => e.text === l.text))
          G.game.log.push(l);
      });
      G.lastLogLen = salon.log.length;
    }
    // Sync chat
    if (salon.chat.length > G.lastChatLen) {
      const newMsgs = salon.chat.slice(G.lastChatLen);
      if (G.game)
        newMsgs.forEach((m) => {
          if (!G.game.chat.find((e) => e.ts === m.ts && e.author === m.author))
            G.game.chat.push(m);
        });
      G.lastChatLen = salon.chat.length;
    }

    if (salon.status === "waiting") {
      renderWaitingRoom({ ...salon, isHost: IS_HOST });
      return;
    }

    if (salon.game && G.game) {
      const prevPhase = G.game.phase;
      const newPhase = salon.game.phase;

      // Sync joueurs
      salon.players.forEach((sp) => {
        const lp = G.game.players?.find((p) => p.id === sp.id);
        if (lp) {
          Object.assign(lp, sp);
        }
      });

      // Sync game state
      G.game.phase = newPhase;
      G.game.round = salon.game.round;
      G.game.phaseEnd = salon.game.phaseEnd;
      G.game.votes = salon.game.votes || {};
      G.game.nightResults = salon.game.nightResults || [];
      G.game.dayResults = salon.game.dayResults || [];
      G.game.witchPotions = salon.game.witchPotions;
      G.game.winner = salon.game.winner;

      // Reset flags si nouvelle phase
      if (newPhase !== prevPhase) {
        G.actionDone = false;
        G.voteDone = false;
        cupidonSelected = [];
        // Durées connues côté client pour le timer
        const durations = {
          REVEAL: 15000,
          NIGHT: 60000,
          NIGHT_RESULT: 10000,
          DAY: 180000,
          DAY_RESULT: 10000,
        };
        timerTotal = durations[newPhase] || 60000;
        if (newPhase === "FINISHED") {
          showEnd();
          stopPolling();
          return;
        }
        if (G.currentScreen === "s-game") renderGame();
        else if (newPhase !== "REVEAL") showGameScreen();
      } else if (G.currentScreen === "s-game") {
        // Refresh partiel (votes, log, chat)
        renderLog();
        renderChat();
        // Refresh zone phase si DAY pour mettre à jour le compteur de votes
        if (newPhase === "DAY" || newPhase === "NIGHT")
          renderPhaseZone(
            newPhase,
            G.game.players?.find((p) => p.id === G.myPlayerId),
            getRoleData(
              G.game.players?.find((p) => p.id === G.myPlayerId)?.role,
            ),
            !G.game.players?.find((p) => p.id === G.myPlayerId)?.alive,
          );
      }
    }

    // Partie qui démarre (joueurs non-hôte)
    if (salon.status === "playing" && (!G.game || !G.game.phase)) {
      G.game = {
        id: salon.code,
        code: salon.code,
        name: salon.name,
        round: salon.game.round,
        phase: salon.game.phase,
        phaseEnd: salon.game.phaseEnd,
        players: salon.players.map((p) => ({ ...p })),
        votes: salon.game.votes || {},
        nightActions: {},
        log: salon.log || [],
        chat: salon.chat || [],
        winner: salon.game.winner,
        witchPotions: salon.game.witchPotions,
        nightResults: salon.game.nightResults || [],
        dayResults: salon.game.dayResults || [],
      };
      G.myPlayerId = MY_PLAYER_ID;
      G.lastLogLen = salon.log.length;
      G.lastChatLen = salon.chat.length;
      showGameScreen();
    }
  }, 2000);
}

function stopPolling() {
  if (POLL_INTERVAL) {
    clearInterval(POLL_INTERVAL);
    POLL_INTERVAL = null;
  }
}

// ── Actions ──
async function sendNightAction(act) {
  const res = await api("POST", "/api/salon/action", {
    code: MY_CODE,
    playerId: MY_PLAYER_ID,
    action: act,
  });
  if (!res.ok) {
    toast(res.error || "Erreur", "error");
    return;
  }
  G.actionDone = true;
  cupidonSelected = [];
  // Feedback voyante
  if (act.startsWith("scry:")) {
    const tid = act.split(":")[1];
    const target = G.game.players.find((p) => p.id === tid);
    const r = getRoleData(target?.role);
    if (r) toast(`🔮 ${target.name} est : ${r.name} (${r.camp})`, "success");
  }
  if (act.startsWith("necro:")) {
    const tid = act.split(":")[1];
    const target = G.game.players.find((p) => p.id === tid);
    const r = getRoleData(target?.role);
    const isLoup = ["LOUP", "GRAND_LOUP", "LOUP_VOYANT", "INFECT"].includes(
      target?.role,
    );
    toast(
      `💀 ${target?.name} était du ${isLoup ? "camp des Loups 🐺" : "camp du Village 🛡"}`,
      "success",
    );
  }
  renderGame();
}

async function submitVote(targetId) {
  const target = G.game.players.find((p) => p.id === targetId);
  const res = await api("POST", "/api/salon/vote", {
    code: MY_CODE,
    playerId: MY_PLAYER_ID,
    targetId,
  });
  if (!res.ok) {
    toast(res.error || "Erreur", "error");
    return;
  }
  G.voteDone = true;
  toast(`⚖️ Vote contre ${target?.name} enregistré !`, "success");
  renderGame();
}

async function sendChat() {
  const input = $("chat-in");
  const text = input.value.trim();
  if (!text) return;
  input.value = "";
  const res = await api("POST", "/api/salon/chat", {
    code: MY_CODE,
    playerId: MY_PLAYER_ID,
    text,
  });
  if (!res.ok) toast(res.error || "Chat bloqué", "error");
}
$("chat-in")?.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendChat();
});

// ── Créer salon ──
async function createSalonOnline() {
  const name =
    ($("salon-name-input")?.value || "").trim() || "Taverne des Aventuriers";
  MY_NAME = ($("creator-name-input")?.value || "").trim() || "Hôte";
  const count =
    G.salonConfig.playerCount === "custom"
      ? parseInt($("custom-count-input")?.value) || 8
      : G.salonConfig.playerCount;
  if (!MY_NAME) {
    toast("Entre ton nom !", "error");
    return;
  }
  const res = await api("POST", "/api/salon/create", {
    name,
    playerCount: count,
    creatorName: MY_NAME,
    playerId: MY_PLAYER_ID,
  });
  if (!res.ok) {
    toast(res.error || "Erreur", "error");
    return;
  }
  MY_CODE = res.code;
  IS_HOST = true;
  G.salonConfig = { name, creatorName: MY_NAME, playerCount: count };
  G.game = {
    id: res.code,
    code: res.code,
    name,
    round: 1,
    phase: null,
    players: res.salon.players.map((p) => ({ ...p })),
    votes: {},
    nightActions: {},
    log: res.salon.log || [],
    chat: [],
    winner: null,
    witchPotions: { life: true, death: true },
  };
  G.myPlayerId = MY_PLAYER_ID;
  G.lastLogLen = 0;
  G.lastChatLen = 0;
  saveSession(res.code, MY_NAME, true);
  toast(`✦ Salon créé ! Code : ${res.code}`, "success");
  startPolling(res.code);
  openConfig();
}

// ── Rejoindre salon ──
async function joinSalonOnline(asSpectator = false) {
  const code = ($("join-code-input")?.value || "").trim().toUpperCase();
  MY_NAME = ($("join-name-input")?.value || "").trim() || "Voyageur";
  if (!code) {
    toast("Entre le code !", "error");
    return;
  }
  if (!MY_NAME) {
    toast("Entre ton nom !", "error");
    return;
  }
  const res = await api("POST", "/api/salon/join", {
    code,
    name: MY_NAME,
    playerId: MY_PLAYER_ID,
    asSpectator,
  });
  if (!res.ok) {
    toast(res.error || "Erreur", "error");
    return;
  }
  MY_CODE = res.code;
  IS_HOST = false;
  G.isSpectator = asSpectator;
  G.game = {
    id: res.code,
    code: res.code,
    round: 1,
    phase: null,
    players: res.salon.players.map((p) => ({ ...p })),
    votes: {},
    nightActions: {},
    log: [],
    chat: [],
    winner: null,
    witchPotions: { life: true, death: true },
  };
  G.myPlayerId = MY_PLAYER_ID;
  G.lastLogLen = 0;
  G.lastChatLen = 0;
  saveSession(res.code, MY_NAME, false);
  toast(`⚔️ Rejoint ${res.code} !`, "success");
  startPolling(res.code);
  showWaitingRoom({ ...res.salon, isHost: false });
}

// ── Lancer partie ──
window.launchGame = async function () {
  if (!MY_CODE) return;
  const rolesConfig = {};
  for (const [id, count] of Object.entries(G.selectedRoles))
    if (count > 0) rolesConfig[id] = count;
  const res = await api("POST", "/api/salon/start", {
    code: MY_CODE,
    rolesConfig,
    playerId: MY_PLAYER_ID,
  });
  if (!res.ok) {
    toast(res.error || "Erreur", "error");
    return;
  }
  // L'hôte aussi attend le polling pour démarrer — on sync l'état
  G.game.players = res.salon.players.map((p) => ({ ...p }));
  G.game.phase = res.salon.game.phase;
  G.game.phaseEnd = res.salon.game.phaseEnd;
  G.game.round = res.salon.game.round;
  G.myPlayerId = MY_PLAYER_ID;
  G.actionDone = false;
  G.voteDone = false;
  showGameScreen();
};

async function loadSalonsList() {
  const list = await api("GET", "/api/salons");
  const el = $("salons-list");
  if (!el) return;
  if (!Array.isArray(list) || !list.length) {
    el.innerHTML =
      '<div class="panel panel-sm" style="text-align:center;color:var(--muted);font-style:italic;font-size:13px">Aucune partie en attente…</div>';
    return;
  }
  el.innerHTML = list
    .map(
      (s) =>
        `<div class="salon-card" onclick="document.getElementById('join-code-input').value='${s.code}';toast('Code ${s.code} sélectionné')"><div class="salon-status waiting">⏳ En attente</div><div class="salon-name">${s.name}</div><div class="salon-info">Code : <strong>${s.code}</strong> · ${s.players}/${s.maxPlayers} joueurs</div></div>`,
    )
    .join("");
}

window.submitJoin = () => joinSalonOnline(false);
window.submitSpectate = () => joinSalonOnline(true);

function toggleTheme() {
  const isLight = document.body.classList.toggle("light");
  $("theme-toggle").textContent = isLight ? "🌑" : "🌙";
  localStorage.setItem("theme", isLight ? "light" : "dark");
}
(function initTheme() {
  if (localStorage.getItem("theme") === "light") {
    document.body.classList.add("light");
    const btn = $("theme-toggle");
    if (btn) btn.textContent = "🌑";
  }
})();

renderAllRoles();
// Tentative de rejoin si session existante
tryRejoin();
