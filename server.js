const express = require('express');
const path = require('path');
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const salons = {};

// ── Durées des phases (ms) ──
const DURATIONS = {
  REVEAL:       15000,  // 15s pour voir son rôle
  NIGHT:        60000,  // 60s pour les actions de nuit
  NIGHT_RESULT: 10000,  // 10s annonce des morts
  DAY:         180000,  // 3min de jour + vote
  DAY_RESULT:   10000,  // 10s annonce des éliminations
};

// Ordre de réveil la nuit (rôles actifs)
const NIGHT_ORDER = ['CUPIDON','VOYANTE','LOUP_VOYANT','LOUP','GRAND_LOUP','INFECT','SORCIERE','SALVATEUR','CORBEAU','RENARD','FLUTE','NECRO','MARIONNETTISTE'];

function code4() { return Math.random().toString(36).slice(2,6).toUpperCase(); }
function shuffle(a) { const b=[...a]; for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]];} return b; }
function topVote(counts) {
  if(!Object.keys(counts).length) return null;
  const max=Math.max(...Object.values(counts));
  const cands=Object.entries(counts).filter(([,c])=>c===max).map(([id])=>id);
  return cands[Math.floor(Math.random()*cands.length)];
}

// Nettoyage auto des salons > 3h
setInterval(()=>{
  const now=Date.now();
  for(const code in salons){
    if(salons[code].phaseTimer) clearTimeout(salons[code].phaseTimer);
    if(now-salons[code].createdAt > 1000*60*60*3) delete salons[code];
  }
}, 1000*60*30);

// ── TRANSITION DE PHASE ──
function schedulePhase(salon, phase, delay) {
  if(salon.phaseTimer) clearTimeout(salon.phaseTimer);
  salon.game.phase = phase;
  salon.game.phaseEnd = Date.now() + delay;
  salon.phaseTimer = setTimeout(() => advancePhase(salon), delay);
  console.log(`[${salon.code}] → ${phase} (${delay/1000}s)`);
}

function advancePhase(salon) {
  const game = salon.game;
  if(!game) return;

  switch(game.phase) {
    case 'REVEAL':
      startNight(salon);
      break;
    case 'NIGHT':
      resolveNight(salon);
      break;
    case 'NIGHT_RESULT':
      startDay(salon);
      break;
    case 'DAY':
      resolveDay(salon);
      break;
    case 'DAY_RESULT':
      startNight(salon);
      break;
  }
}

function startNight(salon) {
  const game = salon.game;
  game.round = (game.round || 0) + 1;
  game.nightActions = {};
  game.nightResults = [];
  // Réinitialiser protections
  salon.players.forEach(p => p.protected = false);
  salon.log.push({ type:'system', text:`🌙 Nuit ${game.round} — Le village s'endort…` });
  schedulePhase(salon, 'NIGHT', DURATIONS.NIGHT);
}

function resolveNight(salon) {
  const game = salon.game;
  const players = salon.players;
  const deaths = [];
  const results = [];

  // ── Cupidon (round 1 seulement) ──
  if(game.round === 1) {
    const cupidon = players.find(p=>p.role==='CUPIDON'&&p.alive);
    if(cupidon) {
      const a = game.nightActions[cupidon.id];
      if(a && a.startsWith('cupidon:')) {
        const ids = a.split(':')[1].split(',');
        if(ids.length===2) {
          ids.forEach(id=>{ const p=players.find(x=>x.id===id); if(p) p.lover=true; });
          const names = ids.map(id=>players.find(p=>p.id===id)?.name).filter(Boolean);
          game.lovers = ids;
          results.push(`💘 Cupidon a uni ${names.join(' et ')} pour l'éternité.`);
        }
      }
    }
  }

  // ── Salvateur protège ──
  const salvateur = players.find(p=>p.role==='SALVATEUR'&&p.alive);
  if(salvateur) {
    const a = game.nightActions[salvateur.id];
    if(a && a.startsWith('protect:')) {
      const t = players.find(p=>p.id===a.split(':')[1]);
      if(t) { t.protected = true; results.push(`🛡 Le Salvateur veille cette nuit…`); }
    }
  }

  // ── Attaque des loups ──
  const loupIds = ['LOUP','GRAND_LOUP','LOUP_VOYANT','INFECT'];
  const loups = players.filter(p=>p.alive&&loupIds.includes(p.role));
  const loupVotes = {};
  loups.forEach(l => {
    const a = game.nightActions[l.id];
    if(a && !a.includes(':')) loupVotes[a] = (loupVotes[a]||0)+1;
  });
  const victimId = topVote(loupVotes);

  // ── INFECT — transformer en loup ──
  const infect = players.find(p=>p.role==='INFECT'&&p.alive&&!p.infectUsed);
  if(infect && game.nightActions[infect.id] && game.nightActions[infect.id].startsWith('infect:')) {
    const tid = game.nightActions[infect.id].split(':')[1];
    const t = players.find(p=>p.id===tid&&p.alive);
    if(t && !t.protected) {
      t.role = 'LOUP';
      infect.alive = false;
      deaths.push(infect.id);
      results.push(`🩸 Le Maudit a transmis sa malédiction… et périt à l'aube.`);
      results.push(`☠️ ${t.name} est maintenant un Loup-Garou !`);
    }
    infect.infectUsed = true;
  } else if(victimId) {
    const vp = players.find(p=>p.id===victimId);
    if(vp?.alive && !vp.protected) {
      // GRAND_LOUP — 2e victime si pas de mort de loup cette nuit
      const grandLoup = players.find(p=>p.role==='GRAND_LOUP'&&p.alive);
      if(grandLoup) {
        const a2 = game.nightActions[grandLoup.id+'_bonus'];
        if(a2) {
          const v2 = players.find(p=>p.id===a2&&p.alive&&!p.protected&&p.id!==victimId);
          if(v2) { v2.alive=false; deaths.push(v2.id); results.push(`🐾 L'Alpha frappe une seconde fois : ${v2.name} est mort.`); }
        }
      }
      vp.alive = false;
      deaths.push(vp.id);
      results.push(`🌙 ${vp.name} a été dévoré(e) par les loups cette nuit.`);
      // Amoureux
      if(vp.lover && game.lovers) {
        game.lovers.filter(id=>id!==vp.id).forEach(lid=>{
          const lover=players.find(p=>p.id===lid&&p.alive);
          if(lover){lover.alive=false;deaths.push(lover.id);results.push(`💔 ${lover.name}, fou de chagrin, meurt d'amour.`);}
        });
      }
    } else if(vp?.protected) {
      results.push(`🛡 Les loups ont attaqué mais quelqu'un a été protégé !`);
    }
  } else {
    results.push(`🌙 Les loups n'ont pas frappé cette nuit.`);
  }

  // ── Sorcière ──
  const sorciere = players.find(p=>p.role==='SORCIERE'&&p.alive);
  if(sorciere) {
    const a = game.nightActions[sorciere.id];
    if(a && a.startsWith('death:')) {
      const t=players.find(p=>p.id===a.split(':')[1]&&p.alive);
      if(t){t.alive=false;deaths.push(t.id);game.witchPotions={...game.witchPotions,death:false};results.push(`🧪 La Sorcière a empoisonné ${t.name}.`);}
    } else if(a && a.startsWith('life:')) {
      const tid=a.split(':')[1];
      const t=players.find(p=>p.id===tid);
      if(t&&!t.alive&&deaths.includes(tid)){t.alive=true;deaths.splice(deaths.indexOf(tid),1);game.witchPotions={...game.witchPotions,life:false};results.push(`💚 La Sorcière a sauvé ${t.name} in extremis !`);}
    }
  }

  // ── Corbeau ──
  const corbeau = players.find(p=>p.role==='CORBEAU'&&p.alive);
  if(corbeau) {
    const a = game.nightActions[corbeau.id];
    if(a && a.startsWith('corbeau:')) {
      const t=players.find(p=>p.id===a.split(':')[1]);
      if(t){game.corbeauTarget=t.id;results.push(`🐦‍⬛ Le Corbeau a désigné ${t.name} — +2 votes contre lui aujourd'hui.`);}
    }
  } else { game.corbeauTarget = null; }

  // Résultats nuit
  game.nightResults = results;
  results.forEach(r => salon.log.push({ type: deaths.some(d=>r.includes('dévoré')||r.includes('empoisonné')||r.includes('mort')) ? 'death' : 'night', text: r }));

  // Vérifier victoire
  const winner = checkWin(salon.players, game);
  if(winner) { endGame(salon, winner); return; }

  game.votes = {};
  schedulePhase(salon, 'NIGHT_RESULT', DURATIONS.NIGHT_RESULT);
}

function startDay(salon) {
  const game = salon.game;
  game.votes = {};
  game.dayResults = [];
  salon.log.push({ type:'system', text:`☀️ Jour ${game.round} — Le village se réunit. Débattez et votez !` });
  schedulePhase(salon, 'DAY', DURATIONS.DAY);
}

function resolveDay(salon) {
  const game = salon.game;
  const players = salon.players;
  const results = [];
  const counts = {};

  Object.values(game.votes).forEach(v=>{ counts[v]=(counts[v]||0)+1; });

  // Corbeau +2
  if(game.corbeauTarget && counts[game.corbeauTarget] !== undefined) {
    counts[game.corbeauTarget] = (counts[game.corbeauTarget]||0)+2;
  }

  // Idiot du village — ne peut plus voter
  players.filter(p=>p.idiotNoVote&&p.alive).forEach(p=>{ delete counts[p.id]; });

  const elimId = topVote(counts);
  if(elimId) {
    const elim = players.find(p=>p.id===elimId);
    if(elim?.alive) {
      if(elim.role==='IDIOT') {
        results.push(`🃏 Le village a voté contre ${elim.name} — c'est le Fou du Roi ! Il survit mais perd son droit de vote.`);
        elim.idiotNoVote = true;
      } else {
        elim.alive = false;
        results.push(`⚖️ Le village a éliminé ${elim.name}. C'était : ${getRoleNameServer(elim.role)}.`);
        // Chasseur
        if(elim.role==='CHASSEUR') results.push(`🏹 Le Chasseur tire une dernière flèche ! (désigné par l'hôte)`);
        // Ange
        if(elim.role==='ANGE' && game.round<=2) { endGame(salon,'ANGE'); return; }
        // Amoureux
        if(elim.lover && game.lovers) {
          game.lovers.filter(id=>id!==elim.id).forEach(lid=>{
            const lover=players.find(p=>p.id===lid&&p.alive);
            if(lover){lover.alive=false;results.push(`💔 ${lover.name}, fou de chagrin, meurt d'amour.`);}
          });
        }
      }
    }
  } else {
    results.push(`☀️ Aucun consensus — personne n'est éliminé aujourd'hui.`);
  }

  game.dayResults = results;
  results.forEach(r => salon.log.push({
    type: r.includes('éliminé')||r.includes('meurt') ? 'death' : 'info', text: r
  }));

  const winner = checkWin(salon.players, game);
  if(winner) { endGame(salon, winner); return; }

  game.corbeauTarget = null;
  schedulePhase(salon, 'DAY_RESULT', DURATIONS.DAY_RESULT);
}

function endGame(salon, winner) {
  salon.status = 'finished';
  salon.game.phase = 'FINISHED';
  salon.game.winner = winner;
  if(salon.phaseTimer) clearTimeout(salon.phaseTimer);
  const msgs = { VILLAGE:'🎉 Le Village a triomphé !', LOUPS:'🐺 Les Loups-Garous ont gagné !', FLUTE:'🎶 Le Ménestrel a ensorcelé tout le monde !', LOUP_BLANC:'🌫️ Le Banni est le dernier survivant !', ANGE:'✝️ Le Martyr a été sacrifié — il gagne !' };
  salon.log.push({ type:'system', text:`🏆 FIN DE PARTIE — ${msgs[winner]||winner}` });
  console.log(`[${salon.code}] FIN : ${winner}`);
}

function checkWin(players, game) {
  const alive = players.filter(p=>p.alive);
  const loupIds = ['LOUP','GRAND_LOUP','LOUP_VOYANT','INFECT'];
  const loups = alive.filter(p=>loupIds.includes(p.role));
  const others = alive.filter(p=>!loupIds.includes(p.role));
  // Ménestrel
  if(game.charmed && alive.every(p=>game.charmed.includes(p.id))) return 'FLUTE';
  // Loup Blanc seul
  if(alive.length===1&&alive[0].role==='LOUP_BLANC') return 'LOUP_BLANC';
  if(loups.length===0) return 'VILLAGE';
  if(loups.length>=others.length) return 'LOUPS';
  return null;
}

const ROLE_NAMES = { LOUP:'Loup-Garou',LOUP_BLANC:'Le Banni',LOUP_VOYANT:'Chasseur de Sang',GRAND_LOUP:"L'Alpha",INFECT:'Le Maudit',VILLAGEOIS:'Villageois',VOYANTE:'Voyante',SORCIERE:'Sorcière',CHASSEUR:'Chasseur',CUPIDON:'Cupidon',PETITE_FILLE:'Petite Fille',ANCIEN:'Le Patriarche',SALVATEUR:'Salvateur',CORBEAU:'Corbeau',BOUC:'Le Paria',IDIOT:'Fou du Roi',FLUTE:'Le Ménestrel',RENARD:"L'Éclaireur",CHEVALIER:'Le Pestiféré',ANGE:'Le Martyr',LAPIN:'Le Fantôme',CAPITAINE:'Le Seigneur' };
function getRoleNameServer(id) { return ROLE_NAMES[id]||id; }

// ════════════════════════════════════════
// API ROUTES
// ════════════════════════════════════════

// Créer salon
app.post('/api/salon/create', (req, res) => {
  const { name, playerCount, creatorName, playerId } = req.body;
  const code = code4();
  salons[code] = {
    code, name: name||'Village Maudit', playerCount: playerCount||8,
    hostId: playerId, status: 'waiting',
    players: [{ id:playerId, name:creatorName||'Hôte', isHost:true, alive:true, role:null }],
    game: null, log: [], chat: [], phaseTimer: null,
    createdAt: Date.now(),
  };
  res.json({ ok:true, code, salon: publicSalon(salons[code]) });
});

// Rejoindre
app.post('/api/salon/join', (req, res) => {
  const { code, name, playerId, asSpectator } = req.body;
  const salon = salons[code?.toUpperCase()];
  if(!salon) return res.json({ ok:false, error:'Salon introuvable' });
  if(salon.status==='playing'&&!asSpectator) return res.json({ ok:false, error:'Partie en cours' });
  if(salon.players.length>=salon.playerCount&&!asSpectator) return res.json({ ok:false, error:'Salon complet' });
  if(!asSpectator&&!salon.players.find(p=>p.id===playerId)) {
    salon.players.push({ id:playerId, name, isHost:false, alive:true, role:null });
    salon.log.push({ type:'info', text:`⚔️ ${name} a rejoint le village` });
  }
  res.json({ ok:true, code:code.toUpperCase(), salon: publicSalon(salon) });
});

// Lire salon (polling) — filtré selon le joueur
app.get('/api/salon/:code', (req, res) => {
  const salon = salons[req.params.code?.toUpperCase()];
  if(!salon) return res.json({ ok:false, error:'Introuvable' });
  const playerId = req.query.playerId;
  res.json({ ok:true, salon: publicSalon(salon, playerId) });
});

// Lancer partie
app.post('/api/salon/start', (req, res) => {
  const { code, rolesConfig, playerId } = req.body;
  const salon = salons[code];
  if(!salon) return res.json({ ok:false, error:'Introuvable' });
  if(salon.hostId!==playerId) return res.json({ ok:false, error:'Hôte seulement' });
  const deck=[];
  for(const [id,n] of Object.entries(rolesConfig)) for(let i=0;i<n;i++) deck.push(id);
  if(deck.length!==salon.players.length) return res.json({ ok:false, error:`${deck.length} rôles / ${salon.players.length} joueurs` });
  const shuffled=shuffle(deck);
  salon.players.forEach((p,i)=>{ p.role=shuffled[i]; p.alive=true; });
  salon.status='playing';
  salon.game={ phase:'REVEAL', round:0, votes:{}, nightActions:{}, witchPotions:{life:true,death:true}, charmed:[], phaseEnd: Date.now()+DURATIONS.REVEAL };
  salon.log.push({ type:'system', text:'🎭 La partie commence ! Regardez votre rôle…' });
  // Timer reveal
  salon.phaseTimer = setTimeout(()=>advancePhase(salon), DURATIONS.REVEAL);
  res.json({ ok:true, salon: publicSalon(salon, playerId) });
});

// Action nuit
app.post('/api/salon/action', (req, res) => {
  const { code, playerId, action } = req.body;
  const salon = salons[code];
  if(!salon?.game) return res.json({ ok:false });
  if(salon.game.phase!=='NIGHT') return res.json({ ok:false, error:'Pas la nuit' });
  salon.game.nightActions[playerId]=action;
  res.json({ ok:true });
});

// Vote
app.post('/api/salon/vote', (req, res) => {
  const { code, playerId, targetId } = req.body;
  const salon = salons[code];
  if(!salon?.game) return res.json({ ok:false });
  if(salon.game.phase!=='DAY') return res.json({ ok:false, error:'Pas le jour' });
  const voter = salon.players.find(p=>p.id===playerId);
  if(!voter?.alive) return res.json({ ok:false, error:'Vous êtes mort(e)' });
  if(voter.idiotNoVote) return res.json({ ok:false, error:'Vous ne pouvez plus voter (Fou du Roi)' });
  salon.game.votes[playerId]=targetId;
  const target=salon.players.find(p=>p.id===targetId);
  salon.log.push({ type:'info', text:`⚖️ ${voter.name} vote contre ${target?.name||'?'}.` });
  res.json({ ok:true, voteCount:Object.keys(salon.game.votes).length });
});

// Chat
app.post('/api/salon/chat', (req, res) => {
  const { code, playerId, text } = req.body;
  const salon = salons[code];
  if(!salon) return res.json({ ok:false });
  const player=salon.players.find(p=>p.id===playerId);
  if(!player) return res.json({ ok:false });
  // Chat bloqué la nuit (sauf spectateurs)
  if(salon.game?.phase==='NIGHT'&&player.alive) return res.json({ ok:false, error:'Silence pendant la nuit' });
  salon.chat.push({ author:player.name, text:text.slice(0,200), ts:Date.now() });
  res.json({ ok:true });
});

// Liste salons
app.get('/api/salons', (req, res) => {
  res.json(Object.values(salons).filter(s=>s.status==='waiting').map(s=>({
    code:s.code, name:s.name, players:s.players.length, maxPlayers:s.playerCount
  })));
});

// Filtrer ce qu'on envoie au client (cacher les rôles des autres)
function publicSalon(salon, playerId) {
  const game = salon.game ? {
    phase: salon.game.phase,
    round: salon.game.round,
    phaseEnd: salon.game.phaseEnd,
    votes: salon.game.votes,
    nightResults: salon.game.nightResults||[],
    dayResults: salon.game.dayResults||[],
    witchPotions: salon.game.witchPotions,
    charmed: salon.game.charmed,
    winner: salon.game.winner,
    corbeauTarget: salon.game.corbeauTarget,
  } : null;

  const players = salon.players.map(p => {
    const isMe = p.id === playerId;
    const isDead = !p.alive;
    const phase = salon.game?.phase;
    // Révéler son propre rôle, ou les morts après la partie, ou spectateur sans playerId
    const showRole = isMe || (phase==='FINISHED') || !playerId;
    return {
      id: p.id, name: p.name, isHost: p.isHost,
      alive: p.alive, lover: p.lover,
      idiotNoVote: p.idiotNoVote,
      role: showRole ? p.role : null,
      // Loups se voient entre eux la nuit
      ...(salon.game?.phase==='NIGHT' && p.role && ['LOUP','GRAND_LOUP','LOUP_VOYANT','INFECT'].includes(p.role) && playerId && ['LOUP','GRAND_LOUP','LOUP_VOYANT','INFECT'].includes(salon.players.find(x=>x.id===playerId)?.role) ? { role: p.role } : {})
    };
  });

  return {
    code: salon.code, name: salon.name, playerCount: salon.playerCount,
    hostId: salon.hostId, status: salon.status,
    players, game, log: salon.log, chat: salon.chat,
  };
}

app.get('/', (req,res) => res.sendFile(path.join(__dirname,'public','index.html')));

const PORT = process.env.PORT||3000;
app.listen(PORT, ()=>console.log(`🐺 Port ${PORT}`));
