# 🐺 Les Loups du Crépuscule — Guide de déploiement

## 🎯 En 10 minutes, ton jeu est en ligne gratuitement

---

## ÉTAPE 1 — Créer un compte GitHub (gratuit)

1. Va sur **https://github.com**
2. Clique **"Sign up"**, crée un compte (email + mot de passe)
3. Confirme ton email

---

## ÉTAPE 2 — Mettre le code sur GitHub

1. Sur GitHub, clique le **"+"** en haut à droite → **"New repository"**
2. Nom : `loups-crepuscule`
3. Laisse tout par défaut, clique **"Create repository"**
4. Sur la page qui s'affiche, clique **"uploading an existing file"**
5. **Glisse-dépose les 3 fichiers** de ce dossier :
   - `server.js`
   - `package.json`
   - le dossier `public/` (avec `index.html` dedans)
6. Clique **"Commit changes"**

---

## ÉTAPE 3 — Déployer sur Railway (gratuit)

1. Va sur **https://railway.app**
2. Clique **"Start a New Project"**
3. Choisis **"Deploy from GitHub repo"**
4. Connecte ton compte GitHub si demandé
5. Sélectionne le repo `loups-crepuscule`
6. Railway détecte automatiquement Node.js et lance le serveur ✅

**Après ~2 minutes**, Railway te donne une URL du style :
```
https://loups-crepuscule-production.up.railway.app
```

**C'est ton lien à partager sur Discord !** 🎉

---

## 🎮 Comment jouer

### L'hôte (celui qui crée la partie) :
1. Va sur le lien Railway
2. Clique **"Créer une partie"**
3. Entre ton pseudo et le nombre de joueurs
4. Un **code à 4 lettres** est généré (ex: `7F3K`)
5. **Partage ce code** à tes amis sur Discord
6. Configure les rôles → Lance la partie
7. Chaque joueur reçoit son rôle **en secret** sur son propre écran

### Les joueurs :
1. Vont sur le même lien Railway
2. Cliquent **"Rejoindre"**
3. Entrent leur pseudo + le code à 4 lettres
4. Attendent que l'hôte lance la partie

### Déroulement :
- **Nuit** : chaque joueur effectue son action en secret sur son écran
- **Jour** : vote collectif visible de tous
- L'hôte clique **"Résoudre la phase"** pour passer à la suite

---

## 🔧 Informations techniques

- **Pas de base de données** : tout est en mémoire (les parties sont perdues si le serveur redémarre)
- **Gratuit** : Railway offre 500h/mois gratuitement (largement suffisant)
- **Connexions simultanées** : Socket.io gère les mises à jour en temps réel
- **Nettoyage auto** : les salons vides sont supprimés après 3h

---

## ❓ Problèmes courants

**"Application Error" sur Railway**
→ Va dans l'onglet "Logs" de Railway pour voir l'erreur

**Les joueurs ne voient pas la mise à jour**
→ Vérifie que tout le monde est sur le même lien (pas en local)

**Le salon n'apparaît pas dans la liste**
→ Rafraîchis la page ou entre le code manuellement

---

*Projet personnel non affilié à Asmodée*
