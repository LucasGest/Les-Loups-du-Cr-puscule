const express = require("express");
const path = require("path");
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const salons = {};
const DURATIONS = {
  REVEAL: 15000,
  NIGHT: 60000,
  NIGHT_RESULT: 12000,
  DAY: 180000,
  DAY_RESULT: 12000,
};
const LOUP_IDS = ["LOUP", "GRAND_LOUP", "LOUP_VOYANT", "INFECT"];

function code4() {
  return Math.random().toString(36).slice(2, 6).toUpperCase();
}
function shuffle(a) {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
}
function topVote(counts) {
  if (!Object.keys(counts).length) return null;
  const max = Math.max(...Object.values(counts));
  const cands = Object.entries(counts)
    .filter(([, c]) => c === max)
    .map(([id]) => id);
  return cands[Math.floor(Math.random() * cands.length)];
}
function isLoup(p) {
  return LOUP_IDS.includes(p.role);
}

setInterval(
  () => {
    const now = Date.now();
    for (const code in salons) {
      if (now - salons[code].createdAt > 1000 * 60 * 60 * 3) {
        if (salons[code].phaseTimer) clearTimeout(salons[code].phaseTimer);
        delete salons[code];
      }
    }
  },
  1000 * 60 * 30,
);

function schedulePhase(salon, phase, delay) {
  if (salon.phaseTimer) clearTimeout(salon.phaseTimer);
  salon.game.phase = phase;
  salon.game.phaseEnd = Date.now() + delay;
  salon.phaseTimer = setTimeout(() => advancePhase(salon), delay);
}
function advancePhase(salon) {
  if (!salon.game) return;
  switch (salon.game.phase) {
    case "REVEAL":
      startNight(salon);
      break;
    case "NIGHT":
      resolveNight(salon);
      break;
    case "NIGHT_RESULT":
      startDay(salon);
      break;
    case "DAY":
      resolveDay(salon);
      break;
    case "DAY_RESULT":
      startNight(salon);
      break;
  }
}

function startNight(salon) {
  const g = salon.game;
  g.round = (g.round || 0) + 1;
  g.nightActions = {};
  g.nightResults = [];
  g.corbeauSuspect = null;
  g.voyantResult = null;
  g.eclaireurResult = null;
  g.mediumResult = null;
  g.renegatInfo = null;
  salon.players.forEach((p) => {
    p.protectedBy = null;
    p.gamineSpy = false;
  });
  salon.log.push({
    type: "system",
    text: `🌙 Nuit ${g.round} — Le village s'endort…`,
  });
  schedulePhase(salon, "NIGHT", DURATIONS.NIGHT);
}

function resolveNight(salon) {
  const g = salon.game,
    players = salon.players,
    deaths = [],
    results = [],
    A = g.nightActions;

  // CUPIDON nuit 1
  if (g.round === 1) {
    const c = players.find((p) => p.role === "CUPIDON" && p.alive);
    if (c && A[c.id] && A[c.id].startsWith("cupidon:")) {
      const ids = A[c.id].split(":")[1].split(",");
      if (ids.length === 2) {
        ids.forEach((id) => {
          const p = players.find((x) => x.id === id);
          if (p) p.lover = true;
        });
        g.lovers = ids;
        const names = ids
          .map((id) => players.find((p) => p.id === id)?.name)
          .filter(Boolean);
        results.push(
          `💘 Les fils du destin ont uni ${names.join(" et ")} pour l'éternité.`,
        );
      }
    }
  }

  // FANTÔME — bloque une action
  const fantome = players.find(
    (p) => p.role === "LAPIN" && !p.alive && p.fantomeActive,
  );
  if (fantome && A["fantome"] && A["fantome"].startsWith("block:")) {
    const t = players.find((p) => p.id === A["fantome"].split(":")[1]);
    if (t) {
      t.blockedByFantome = true;
      results.push(`👻 Un spectre rôde cette nuit…`);
    }
  }

  // RENÉGAT — accumulation
  const renegat = players.find(
    (p) => p.role === "CHIEN_LOUP" && p.alive && !p.blockedByFantome,
  );
  if (renegat) {
    const a = A[renegat.id];
    if (a === "help_loups") {
      renegat.renegat_loups = (renegat.renegat_loups || 0) + 1;
      renegat.renegat_village = 0;
      const v = players.filter(
        (p) => p.alive && !isLoup(p) && p.id !== renegat.id,
      );
      if (v.length) {
        const ci = v[Math.floor(Math.random() * v.length)];
        g.renegatInfo = { to: "loups", role: ci.role, name: ci.name };
      }
    } else if (a === "help_village") {
      renegat.renegat_village = (renegat.renegat_village || 0) + 1;
      renegat.renegat_loups = 0;
      const loups = players.filter((p) => isLoup(p) && p.alive);
      if (loups.length)
        loups[Math.floor(Math.random() * loups.length)].blockedByRenegat = true;
    }
    if (renegat.renegat_loups >= 3) {
      renegat.role = "LOUP";
      renegat.renegat_loups = 0;
      results.push(
        `🔱 Le Renégat bascule dans les ténèbres — il est désormais Loup !`,
      );
    } else if (renegat.renegat_village >= 3) {
      renegat.role = "VILLAGEOIS";
      renegat.renegat_village = 0;
      results.push(
        `🔱 Le Renégat choisit la lumière — il devient Villageois !`,
      );
    }
  }

  // L'ÉGIDE — sceau à usage unique par joueur
  const egide = players.find(
    (p) => p.role === "SALVATEUR" && p.alive && !p.blockedByFantome,
  );
  if (egide && A[egide.id] && A[egide.id].startsWith("protect:")) {
    const tid = A[egide.id].split(":")[1];
    const t = players.find((p) => p.id === tid);
    if (t) {
      if (!egide.sceauxBrises) egide.sceauxBrises = [];
      if (!egide.sceauxBrises.includes(tid)) t.protectedBy = egide.id;
    }
  }

  // ATTAQUE LOUPS — unanimité requise (ou Alpha en frénésie)
  const loups = players.filter(
    (p) => p.alive && isLoup(p) && !p.blockedByRenegat,
  );
  const loupVotes = {};
  loups.forEach((l) => {
    const a = A[l.id];
    if (a && !a.includes(":")) loupVotes[a] = (loupVotes[a] || 0) + 1;
  });
  const grandLoup = players.find((p) => p.role === "GRAND_LOUP" && p.alive);
  const alphaFrenzy = grandLoup && (g.noLoupDeathStreak || 0) >= 2;
  const victimId = topVote(loupVotes);
  const unanime = victimId && (loupVotes[victimId] || 0) >= loups.length;
  const chasse_ok = unanime || alphaFrenzy;

  // INFECT — morsure
  const infect = players.find(
    (p) =>
      p.role === "INFECT" &&
      p.alive &&
      !p.blockedByFantome &&
      !p.blockedByRenegat,
  );
  if (infect && A[infect.id] && A[infect.id].startsWith("infect:")) {
    const tid = A[infect.id].split(":")[1];
    const t = players.find((p) => p.id === tid && p.alive);
    if (t && !t.protectedBy) {
      infect.morsuRes = (infect.morsuRes || 0) + 1;
      t.role = "LOUP";
      results.push(
        `🩸 Une malédiction secrète s'est répandue dans le village cette nuit…`,
      );
      if (infect.morsuRes >= 2) {
        infect.alive = false;
        deaths.push(infect.id);
        results.push(
          `💀 Le Maudit, consumé par ses propres ténèbres, s'effondre à l'aube.`,
        );
      }
    }
  } else if (chasse_ok && victimId) {
    const vp = players.find((p) => p.id === victimId && p.alive);
    if (vp) {
      if (vp.role === "PETITE_FILLE" && vp.gamineSpy && unanime) {
        vp.alive = false;
        deaths.push(vp.id);
        results.push(
          `👧 La Gamine a été surprise en train d'espionner — les loups l'ont dévorée !`,
        );
      } else if (vp.protectedBy) {
        if (egide) {
          if (!egide.sceauxBrises) egide.sceauxBrises = [];
          egide.sceauxBrises.push(vp.id);
        }
        results.push(
          `🛡 L'Égide a absorbé l'attaque — son sceau est brisé pour ce joueur.`,
        );
      } else {
        vp.alive = false;
        deaths.push(vp.id);
        results.push(`🌙 ${vp.name} a été dévoré(e) par les loups cette nuit.`);
        handleDeathNight(vp, deaths, results, g, players);
        if (vp.role === "CHEVALIER") {
          loups.forEach((l) => {
            l.pestifereDays = (l.pestifereDays || 0) + 1;
          });
          results.push(
            `☠️ Les loups ont mordu le Pestiféré — la pestilence les frappe !`,
          );
        }
      }
    }
    g.noLoupDeathStreak = 0;
  } else if (!chasse_ok && loups.length > 0) {
    results.push(
      `🌙 Les loups n'ont pas réussi à s'accorder… Le village entend des hurlements.`,
    );
    g.noLoupDeathStreak = 0;
  }

  const loupMortCeNuit = deaths.some((id) =>
    isLoup(players.find((p) => p.id === id) || {}),
  );
  if (!loupMortCeNuit && loups.length > 0)
    g.noLoupDeathStreak = (g.noLoupDeathStreak || 0) + 1;

  // SORCIÈRE — potion vie=protège, mort=malédiction différée
  const sorciere = players.find(
    (p) => p.role === "SORCIERE" && p.alive && !p.blockedByFantome,
  );
  if (sorciere) {
    const a = A[sorciere.id];
    if (a && a.startsWith("life:")) {
      const t = players.find((p) => p.id === a.split(":")[1]);
      if (t && g.witchPotions?.life) {
        t.protectedNextNight = true;
        g.witchPotions = { ...g.witchPotions, life: false };
        results.push(`💚 La Sorcière a préparé un philtre de protection…`);
      }
    } else if (a && a.startsWith("death:")) {
      const t = players.find((p) => p.id === a.split(":")[1] && p.alive);
      if (t && g.witchPotions?.death) {
        t.sorciereMaudit = true;
        g.witchPotions = { ...g.witchPotions, death: false };
        results.push(
          `🧪 La Sorcière a maudit un joueur dans l'ombre… il mourra au prochain vote.`,
        );
      }
    }
  }
  players.forEach((p) => {
    if (p.protectedNextNight) {
      p.protectedBy = "sorciere_prev";
      p.protectedNextNight = false;
    }
  });

  // CORBEAU — expose publiquement (sans malus de vote)
  const corbeau = players.find(
    (p) => p.role === "CORBEAU" && p.alive && !p.blockedByFantome,
  );
  if (corbeau && A[corbeau.id] && A[corbeau.id].startsWith("corbeau:")) {
    const t = players.find((p) => p.id === A[corbeau.id].split(":")[1]);
    if (t) {
      g.corbeauSuspect = t.id;
      results.push(`🐦 Une voix anonyme murmure : "${t.name}" est suspect…`);
    }
  }

  // VOYANTE — camp seulement, ou vision précise (1 fois)
  const voyante = players.find(
    (p) => p.role === "VOYANTE" && p.alive && !p.blockedByFantome,
  );
  if (voyante) {
    const a = A[voyante.id];
    if (a && a.startsWith("scry:")) {
      const t = players.find((p) => p.id === a.split(":")[1]);
      if (t) {
        const camp = isLoup(t)
          ? "Loups"
          : ["FLUTE", "ANGE", "LAPIN", "LOUP_BLANC", "SECTAIRE"].includes(
                t.role,
              )
            ? "Solitaire"
            : "Village";
        g.voyantResult = { playerId: voyante.id, targetName: t.name, camp };
      }
    } else if (a && a.startsWith("scry_precise:") && !voyante.scryed_precise) {
      const t = players.find((p) => p.id === a.split(":")[1]);
      if (t) {
        voyante.scryed_precise = true;
        g.voyantResult = {
          playerId: voyante.id,
          targetName: t.name,
          role: t.role,
          precise: true,
        };
        t.voyanteScruted = true;
        results.push(`🔮 Une vision intense s'est manifestée cette nuit…`);
      }
    }
  }

  // ÉCLAIREUR — examine groupe de 3
  const eclaireur = players.find(
    (p) =>
      p.role === "RENARD" && p.alive && !p.blockedByFantome && !p.eclaireurLost,
  );
  if (
    eclaireur &&
    A[eclaireur.id] &&
    A[eclaireur.id].startsWith("scry_group:")
  ) {
    const ids = A[eclaireur.id].split(":")[1].split(",");
    const targets = ids
      .map((id) => players.find((p) => p.id === id))
      .filter(Boolean);
    const hasLoup = targets.some((t) => isLoup(t));
    g.eclaireurResult = {
      playerId: eclaireur.id,
      hasLoup,
      count: targets.length,
    };
    if (!hasLoup) eclaireur.eclaireurLost = true;
  }

  // MÉDIUM — question oui/non
  const medium = players.find(
    (p) => p.role === "NECRO" && p.alive && !p.blockedByFantome,
  );
  if (medium && A[medium.id] && A[medium.id].startsWith("medium:")) {
    const parts = A[medium.id].split(":");
    const dead = players.find((p) => p.id === parts[1] && !p.alive);
    if (dead) {
      const q = parts.slice(2).join(":");
      const answerYes = q.toLowerCase().includes("village")
        ? !isLoup(dead)
        : isLoup(dead);
      g.mediumResult = {
        playerId: medium.id,
        deadName: dead.name,
        question: q,
        answer: answerYes ? "Oui" : "Non",
      };
    }
  }

  // APOTHICAIRE — marquer ou soigner
  const apoth = players.find(
    (p) => p.role === "PYROMANE" && p.alive && !p.blockedByFantome,
  );
  if (apoth) {
    const a = A[apoth.id];
    if (a && a.startsWith("mark:")) {
      const t = players.find((p) => p.id === a.split(":")[1] && p.alive);
      if (t) {
        t.apothMarks = (t.apothMarks || 0) + 1;
        if (t.apothMarks >= 3) {
          t.alive = false;
          deaths.push(t.id);
          results.push(
            `🧫 Les marques de l'Apothicaire ont consumé ${t.name}…`,
          );
          handleDeathNight(t, deaths, results, g, players);
        }
      }
    } else if (a && a.startsWith("heal:")) {
      const t = players.find((p) => p.id === a.split(":")[1] && p.alive);
      if (t && t.apothMarks > 0) {
        t.apothMarks--;
        results.push(`🧫 L'Apothicaire a soigné une marque cette nuit.`);
      }
    }
  }

  // MÉNESTREL — charme 2 joueurs
  const menestrel = players.find(
    (p) => p.role === "FLUTE" && p.alive && !p.blockedByFantome,
  );
  if (menestrel && A[menestrel.id] && A[menestrel.id].startsWith("charm:")) {
    const ids = A[menestrel.id].split(":")[1].split(",").slice(0, 2);
    if (!g.charmed) g.charmed = [];
    ids.forEach((id) => {
      if (!g.charmed.includes(id)) g.charmed.push(id);
    });
  }

  // Nettoyage flags
  players.forEach((p) => {
    p.blockedByFantome = false;
    p.blockedByRenegat = false;
  });

  g.nightResults = results;
  results.forEach((r) =>
    salon.log.push({
      type:
        r.includes("dévoré") ||
        r.includes("consumé") ||
        r.includes("s'effondre")
          ? "death"
          : "night",
      text: r,
    }),
  );

  const winner = checkWin(players, g);
  if (winner) {
    endGame(salon, winner);
    return;
  }
  schedulePhase(salon, "NIGHT_RESULT", DURATIONS.NIGHT_RESULT);
}

function handleDeathNight(p, deaths, results, g, players) {
  if (p.lover && g.lovers) {
    g.lovers
      .filter((id) => id !== p.id)
      .forEach((lid) => {
        const l = players.find((x) => x.id === lid && x.alive);
        if (l) {
          l.alive = false;
          deaths.push(l.id);
          results.push(`💔 ${l.name}, fou·folle de chagrin, meurt d'amour.`);
        }
      });
  }
  if (p.role === "LAPIN" && !g.fantomeUsed) {
    p.fantomeActive = true;
    g.fantomeUsed = true;
    results.push(`👻 Une présence spectrale rôde désormais dans le village…`);
  }
}

function startDay(salon) {
  const g = salon.game;
  g.votes = {};
  g.dayResults = [];
  salon.log.push({
    type: "system",
    text: `☀️ Jour ${g.round} — Le village se réunit !`,
  });
  if (g.corbeauSuspect) {
    const s = salon.players.find((p) => p.id === g.corbeauSuspect);
    if (s)
      salon.log.push({
        type: "info",
        text: `🐦 Les corbeaux désignent "${s.name}" comme suspect.`,
      });
  }
  salon.players.forEach((p) => {
    if (p.voyanteScruted) {
      salon.log.push({
        type: "info",
        text: `🔮 ${p.name} a senti une vision pénétrer son âme cette nuit…`,
      });
      p.voyanteScruted = false;
    }
  });
  schedulePhase(salon, "DAY", DURATIONS.DAY);
}

function resolveDay(salon) {
  const g = salon.game,
    players = salon.players,
    results = [],
    counts = {};
  Object.values(g.votes).forEach((v) => {
    counts[v] = (counts[v] || 0) + 1;
  });

  // Seigneur vote double et en dernier
  const seigneur = players.find(
    (p) => p.role === "CAPITAINE" && p.alive && !(p.pestifereDays > 0),
  );
  if (seigneur && g.votes[seigneur.id])
    counts[g.votes[seigneur.id]] = (counts[g.votes[seigneur.id]] || 0) + 1;

  // Pestiférés loups ne peuvent pas voter
  players
    .filter((p) => p.pestifereDays > 0 && isLoup(p))
    .forEach((p) => {
      delete counts[g.votes[p.id] || ""];
      p.pestifereDays--;
    });

  // Fou du Roi ne vote plus
  players
    .filter((p) => p.idiotNoVote && p.alive)
    .forEach((p) => {
      delete counts[g.votes[p.id] || ""];
    });

  // Malédiction sorcière — meurt avant le vote
  const maudit = players.find((p) => p.sorciereMaudit && p.alive);
  if (maudit) {
    maudit.alive = false;
    maudit.sorciereMaudit = false;
    results.push(
      `🧪 La malédiction de la Sorcière frappe ${maudit.name} avant le délibéré !`,
    );
    handleDeathDay(maudit, results, g, players);
    const w = checkWin(players, g);
    if (w) {
      endGame(salon, w);
      return;
    }
  }

  // Égalité — Le Paria choisit
  const maxV = Object.values(counts).length
    ? Math.max(...Object.values(counts))
    : 0;
  const candidats = Object.entries(counts)
    .filter(([, c]) => c === maxV)
    .map(([id]) => id);
  let elimId = null;
  if (candidats.length > 1) {
    const paria = players.find(
      (p) => p.role === "BOUC" && p.alive && candidats.includes(p.id),
    );
    if (paria) {
      const autres = candidats.filter((id) => id !== paria.id);
      elimId = autres[Math.floor(Math.random() * autres.length)];
      results.push(
        `⛓️ Le Paria est dans l'égalité — il désigne ${players.find((p) => p.id === elimId)?.name || "?"} !`,
      );
    } else elimId = candidats[Math.floor(Math.random() * candidats.length)];
  } else elimId = candidats[0] || null;

  if (elimId) {
    const elim = players.find((p) => p.id === elimId && p.alive);
    if (elim) {
      if (elim.role === "IDIOT") {
        results.push(
          `🃏 ${elim.name} est élu… c'est le Fou du Roi ! Il survit, son rôle est révélé — les loups le cibleront cette nuit.`,
        );
        elim.idiotNoVote = true;
        elim.idiotRevealed = true;
        g.idiotRevealedId = elim.id;
      } else {
        elim.alive = false;
        results.push(
          `⚖️ ${elim.name} est éliminé(e) par le village. (${getRoleNameServer(elim.role)})`,
        );
        handleDeathDay(elim, results, g, players);
        if (elim.role === "CHASSEUR") {
          g.chasseurDied = elim.id;
          results.push(
            `🏹 Le Chasseur désigne deux suspects — le village doit trancher !`,
          );
        }
        if (elim.role === "ANGE" && g.round <= 2) {
          endGame(salon, "ANGE");
          return;
        }
        if (elim.role === "ANCIEN") {
          results.push(
            `🏛️ Le Patriarche mourant retire le pouvoir d'un joueur…`,
          );
          g.patriarcheRetire = true;
        }
        if (elim.role === "CAPITAINE" && isLoup(elim)) {
          endGame(salon, "VILLAGE");
          return;
        }
      }
    }
  } else
    results.push(`☀️ Aucun consensus — personne n'est éliminé aujourd'hui.`);

  g.dayResults = results;
  results.forEach((r) =>
    salon.log.push({
      type:
        r.includes("éliminé") || r.includes("meurt") || r.includes("frappe")
          ? "death"
          : "info",
      text: r,
    }),
  );
  const winner = checkWin(players, g);
  if (winner) {
    endGame(salon, winner);
    return;
  }
  schedulePhase(salon, "DAY_RESULT", DURATIONS.DAY_RESULT);
}

function handleDeathDay(p, results, g, players) {
  if (p.lover && g.lovers) {
    g.lovers
      .filter((id) => id !== p.id)
      .forEach((lid) => {
        const l = players.find((x) => x.id === lid && x.alive);
        if (l) {
          l.alive = false;
          results.push(`💔 ${l.name}, fou·folle de chagrin, meurt d'amour.`);
        }
      });
  }
}

function checkWin(players, g) {
  const alive = players.filter((p) => p.alive);
  const loups = alive.filter((p) => isLoup(p));
  const others = alive.filter((p) => !isLoup(p));
  if (g.charmed?.length && alive.every((p) => g.charmed.includes(p.id)))
    return "FLUTE";
  if (alive.length === 1 && alive[0].role === "LOUP_BLANC") return "LOUP_BLANC";
  if (loups.length >= others.length && loups.length > 0) return "LOUPS";
  if (loups.length === 0) return "VILLAGE";
  return null;
}

function endGame(salon, winner) {
  salon.status = "finished";
  salon.game.phase = "FINISHED";
  salon.game.winner = winner;
  if (salon.phaseTimer) clearTimeout(salon.phaseTimer);
  const msgs = {
    VILLAGE: "🎉 Le Village a triomphé !",
    LOUPS: "🐺 Les Loups ont dévoré le village…",
    FLUTE: "🎶 Le Ménestrel a ensorcelé tout le monde !",
    LOUP_BLANC: "🌫️ Le Banni est le dernier survivant.",
    ANGE: "✝️ Le Martyr a été sacrifié — il gagne !",
  };
  salon.log.push({
    type: "system",
    text: `🏆 FIN — ${msgs[winner] || winner}`,
  });
}

const ROLE_NAMES = {
  LOUP: "Loup-Garou",
  LOUP_BLANC: "Le Banni",
  LOUP_VOYANT: "Chasseur de Sang",
  GRAND_LOUP: "L'Alpha",
  INFECT: "Le Maudit",
  VILLAGEOIS: "Villageois",
  VOYANTE: "Voyante",
  SORCIERE: "Sorcière",
  CHASSEUR: "Chasseur",
  CUPIDON: "Cupidon",
  PETITE_FILLE: "La Gamine",
  ANCIEN: "Le Patriarche",
  SALVATEUR: "L'Égide",
  CORBEAU: "Corbeau",
  BOUC: "Le Paria",
  IDIOT: "Fou du Roi",
  FLUTE: "Le Ménestrel",
  RENARD: "L'Éclaireur",
  CHEVALIER: "Le Pestiféré",
  NECRO: "Le Médium",
  ANGE: "Le Martyr",
  LAPIN: "Le Fantôme",
  SECTAIRE: "Le Héraut Noir",
  VOLEUR: "Voleur",
  CHIEN_LOUP: "Le Renégat",
  ENFANT: "L'Orphelin",
  CAPITAINE: "Le Seigneur",
  PYROMANE: "L'Apothicaire",
  MONTREUR: "Le Meunier",
};
function getRoleNameServer(id) {
  return ROLE_NAMES[id] || id;
}

// ── ROUTES ──
app.post("/api/salon/create", (req, res) => {
  const { name, playerCount, creatorName, playerId } = req.body;
  const code = code4();
  salons[code] = {
    code,
    name: name || "Village Maudit",
    playerCount: playerCount || 8,
    hostId: playerId,
    status: "waiting",
    players: [
      {
        id: playerId,
        name: creatorName || "Hôte",
        isHost: true,
        alive: true,
        role: null,
      },
    ],
    game: null,
    log: [],
    chat: [],
    phaseTimer: null,
    createdAt: Date.now(),
  };
  res.json({ ok: true, code, salon: publicSalon(salons[code]) });
});

app.post("/api/salon/join", (req, res) => {
  const { code, name, playerId, asSpectator } = req.body;
  const salon = salons[code?.toUpperCase()];
  if (!salon) return res.json({ ok: false, error: "Salon introuvable" });
  const existing = salon.players.find((p) => p.id === playerId);
  if (existing)
    return res.json({
      ok: true,
      code: code.toUpperCase(),
      salon: publicSalon(salon, playerId),
    });
  if (salon.status === "playing" && !asSpectator)
    return res.json({ ok: false, error: "Partie en cours" });
  if (salon.players.length >= salon.playerCount && !asSpectator)
    return res.json({ ok: false, error: "Salon complet" });
  if (!asSpectator) {
    salon.players.push({
      id: playerId,
      name,
      isHost: false,
      alive: true,
      role: null,
    });
    salon.log.push({ type: "info", text: `⚔️ ${name} a rejoint le village` });
  }
  res.json({
    ok: true,
    code: code.toUpperCase(),
    salon: publicSalon(salon, playerId),
  });
});

app.get("/api/salon/:code", (req, res) => {
  const salon = salons[req.params.code?.toUpperCase()];
  if (!salon) return res.json({ ok: false, error: "Introuvable" });
  res.json({ ok: true, salon: publicSalon(salon, req.query.playerId) });
});

app.post("/api/salon/start", (req, res) => {
  const { code, rolesConfig, playerId } = req.body;
  const salon = salons[code];
  if (!salon) return res.json({ ok: false, error: "Introuvable" });
  if (salon.hostId !== playerId)
    return res.json({ ok: false, error: "Hôte seulement" });
  const deck = [];
  for (const [id, n] of Object.entries(rolesConfig))
    for (let i = 0; i < n; i++) deck.push(id);
  if (deck.length !== salon.players.length)
    return res.json({
      ok: false,
      error: `${deck.length} rôles / ${salon.players.length} joueurs`,
    });
  const shuffled = shuffle(deck);
  salon.players.forEach((p, i) => {
    p.role = shuffled[i];
    p.alive = true;
  });
  salon.status = "playing";
  salon.game = {
    phase: "REVEAL",
    round: 0,
    votes: {},
    nightActions: {},
    witchPotions: { life: true, death: true },
    charmed: [],
    phaseEnd: Date.now() + DURATIONS.REVEAL,
    nightResults: [],
    dayResults: [],
    noLoupDeathStreak: 0,
  };
  salon.log.push({
    type: "system",
    text: "🎭 La partie commence ! Découvrez votre rôle…",
  });
  salon.phaseTimer = setTimeout(() => advancePhase(salon), DURATIONS.REVEAL);
  res.json({ ok: true, salon: publicSalon(salon, playerId) });
});

app.post("/api/salon/action", (req, res) => {
  const { code, playerId, action } = req.body;
  const salon = salons[code];
  if (!salon?.game) return res.json({ ok: false });
  if (salon.game.phase !== "NIGHT")
    return res.json({ ok: false, error: "Pas la nuit" });
  const player = salon.players.find((p) => p.id === playerId);
  if (!player) return res.json({ ok: false });
  if (player.role === "PETITE_FILLE" && action === "spy")
    player.gamineSpy = true;
  salon.game.nightActions[playerId] = action;
  res.json({ ok: true });
});

app.post("/api/salon/vote", (req, res) => {
  const { code, playerId, targetId } = req.body;
  const salon = salons[code];
  if (!salon?.game) return res.json({ ok: false });
  if (salon.game.phase !== "DAY")
    return res.json({ ok: false, error: "Pas le jour" });
  const voter = salon.players.find((p) => p.id === playerId);
  if (!voter?.alive) return res.json({ ok: false, error: "Vous êtes mort(e)" });
  if (voter.idiotNoVote)
    return res.json({
      ok: false,
      error: "Vous avez perdu votre droit de vote",
    });
  if (voter.pestifereDays > 0 && isLoup(voter))
    return res.json({
      ok: false,
      error: "Vous êtes pestiféré(e) — vote impossible",
    });
  salon.game.votes[playerId] = targetId;
  const target = salon.players.find((p) => p.id === targetId);
  salon.log.push({
    type: "info",
    text: `⚖️ ${voter.name} vote contre ${target?.name || "?"}.`,
  });
  res.json({ ok: true, voteCount: Object.keys(salon.game.votes).length });
});

app.post("/api/salon/chat", (req, res) => {
  const { code, playerId, text } = req.body;
  const salon = salons[code];
  if (!salon) return res.json({ ok: false });
  const player = salon.players.find((p) => p.id === playerId);
  if (!player) return res.json({ ok: false });
  if (salon.game?.phase === "NIGHT" && player.alive && !player.fantomeActive)
    return res.json({ ok: false, error: "Silence pendant la nuit" });
  salon.chat.push({
    author: player.name,
    text: text.slice(0, 200),
    ts: Date.now(),
    dead: !player.alive,
  });
  res.json({ ok: true });
});

app.get("/api/salons", (req, res) => {
  res.json(
    Object.values(salons)
      .filter((s) => s.status === "waiting")
      .map((s) => ({
        code: s.code,
        name: s.name,
        players: s.players.length,
        maxPlayers: s.playerCount,
      })),
  );
});

function publicSalon(salon, playerId) {
  const me = salon.players.find((p) => p.id === playerId);
  const meIsLoup = me && isLoup(me);
  const phase = salon.game?.phase;
  const g = salon.game;

  const game = g
    ? {
        phase,
        round: g.round,
        phaseEnd: g.phaseEnd,
        votes: g.votes,
        nightResults: g.nightResults || [],
        dayResults: g.dayResults || [],
        witchPotions: me?.role === "SORCIERE" ? g.witchPotions : undefined,
        charmed: g.charmed,
        winner: g.winner,
        corbeauSuspect: g.corbeauSuspect,
        idiotRevealedId: g.idiotRevealedId,
        chasseurDied: g.chasseurDied,
        noLoupDeathStreak: g.noLoupDeathStreak,
        voyantResult:
          g.voyantResult?.playerId === playerId ? g.voyantResult : undefined,
        eclaireurResult:
          g.eclaireurResult?.playerId === playerId
            ? g.eclaireurResult
            : undefined,
        mediumResult:
          g.mediumResult?.playerId === playerId ? g.mediumResult : undefined,
        renegatInfo: meIsLoup && g.renegatInfo ? g.renegatInfo : undefined,
        patriarcheRetire:
          me?.role === "ANCIEN" ? g.patriarcheRetire : undefined,
      }
    : null;

  const players = salon.players.map((p) => {
    const isMe = p.id === playerId;
    const showRole = isMe || phase === "FINISHED" || !playerId;
    const showAsLoup = meIsLoup && isLoup(p) && !isMe;
    const amoureux = me?.lover && p.lover && g?.lovers?.includes(p.id);
    return {
      id: p.id,
      name: p.name,
      isHost: p.isHost,
      alive: p.alive,
      lover: p.lover,
      idiotNoVote: p.idiotNoVote,
      idiotRevealed: p.idiotRevealed,
      apothMarks: isMe ? p.apothMarks : undefined,
      role: showRole || showAsLoup || amoureux ? p.role : null,
      sorciereMaudit: isMe ? p.sorciereMaudit : undefined,
      gamineSpy: isMe ? p.gamineSpy : undefined,
      eclaireurLost: isMe ? p.eclaireurLost : undefined,
      renegat_loups: isMe ? p.renegat_loups : undefined,
      renegat_village: isMe ? p.renegat_village : undefined,
      fantomeActive: isMe ? p.fantomeActive : undefined,
      scryed_precise: isMe ? p.scryed_precise : undefined,
    };
  });

  return {
    code: salon.code,
    name: salon.name,
    playerCount: salon.playerCount,
    hostId: salon.hostId,
    status: salon.status,
    players,
    game,
    log: salon.log,
    chat: salon.chat,
  };
}

app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "public", "index.html")),
);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`🐺 Les Loups du Crépuscule — Port ${PORT}`),
);
