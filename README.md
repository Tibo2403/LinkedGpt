# LinkedGPT - LinkedIn Automation Platform

Une plateforme web puissante qui combine l'automatisation LinkedIn avec les capacités de l'IA pour améliorer votre networking professionnel et la création de contenu.

## 🚀 Fonctionnalités

### 1. Génération de Contenu
- Générateur de posts LinkedIn alimenté par l'IA
- Templates de messages intelligents pour les connexions
- Suggestions de contenu personnalisables

### 2. Gestion de Calendrier
- Planification et gestion des réunions LinkedIn
- Intégration avec Google Calendar, Outlook et LinkedIn
- Organisation par glisser-déposer des réunions
- Support des réunions vidéo et en personne

### 3. Outils de Networking
- Demandes de connexion automatisées
- Templates de messages intelligents
- Système de gestion des contacts
- Suivi de l'engagement

### 4. Tableau de Bord Analytics
- Métriques de performance des posts
- Analytics d'engagement
- Suivi de la croissance des connexions
- Monitoring d'activité

### 5. Gestion de Profil
- Générateur de CV
- Optimisation de profil
- Gestion des connexions
- Historique d'activité

### 6. Support Multi-langues
- Français
- Anglais
- Espagnol

## 🛠️ Stack Technique

- **Frontend**: React + TypeScript
- **Styling**: Tailwind CSS
- **Base de données**: Supabase
- **Authentification**: Supabase Auth
- **Gestion d'état**: Zustand
- **Icônes**: Lucide React
- **Internationalisation**: i18next

## 📋 Prérequis

- Node.js 18+ 
- npm ou yarn
- Compte Supabase
- Clés API (optionnelles) :
  - OpenAI API (pour la génération de contenu)
  - LinkedIn API (pour l'automatisation)
  - Google Calendar API (pour l'intégration calendrier)
  - Microsoft Graph API (pour Outlook)

## 🚀 Installation

### 1. Cloner le repository

```bash
git clone https://github.com/votre-username/linkedgpt.git
cd linkedgpt
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configuration des variables d'environnement

```bash
# Copier le fichier d'exemple
cp .env.example .env

# Éditer le fichier .env avec vos clés
nano .env
```

**Variables requises :**
```env
VITE_SUPABASE_URL=votre_url_supabase
VITE_SUPABASE_ANON_KEY=votre_cle_anon_supabase
```

**Variables optionnelles :**
```env
VITE_OPENAI_API_KEY=votre_cle_openai
VITE_LINKEDIN_API_KEY=votre_cle_linkedin
VITE_GOOGLE_CLIENT_ID=votre_client_id_google
VITE_GOOGLE_CLIENT_SECRET=votre_client_secret_google
VITE_OUTLOOK_CLIENT_ID=votre_client_id_outlook
VITE_OUTLOOK_CLIENT_SECRET=votre_client_secret_outlook
```

### 4. Configuration Supabase

1. Créez un nouveau projet sur [Supabase](https://supabase.com)
2. Copiez l'URL du projet et la clé anonyme
3. Exécutez les migrations de base de données :

```bash
# Si vous avez Supabase CLI installé
supabase db push

# Sinon, copiez le contenu des fichiers de migration dans l'éditeur SQL de Supabase
```

### 5. Démarrer le serveur de développement

```bash
npm run dev
```


### 6. Lancer les tests

```bash
npm test
```

Les tests unitaires se trouvent dans `src/__tests__` et utilisent Vitest.

L'application sera disponible sur `http://localhost:5173`

## 🔧 Configuration des API

### OpenAI API
1. Créez un compte sur [OpenAI](https://platform.openai.com)
2. Générez une clé API
3. Ajoutez-la dans les paramètres de l'application ou dans `.env`

### LinkedIn API
1. Créez une application sur [LinkedIn Developers](https://developer.linkedin.com)
2. Configurez les permissions nécessaires
3. Ajoutez les clés dans les paramètres de l'application

### Google Calendar API
1. Créez un projet sur [Google Cloud Console](https://console.cloud.google.com)
2. Activez l'API Google Calendar
3. Créez des identifiants OAuth 2.0
4. Configurez les domaines autorisés

### Microsoft Graph API (Outlook)
1. Créez une application sur [Azure Portal](https://portal.azure.com)
2. Configurez les permissions Microsoft Graph
3. Générez un secret client

## 🚀 Déploiement

### Netlify (Recommandé)

```bash
# Build de production
npm run build

# Déployer sur Netlify
# Configurez les variables d'environnement dans Netlify Dashboard
```

### Vercel

```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
vercel

# Configurer les variables d'environnement
vercel env add
```

### Variables d'environnement pour la production

Assurez-vous de configurer toutes les variables d'environnement nécessaires dans votre plateforme de déploiement :

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- Autres clés API selon vos besoins

## 🔒 Sécurité

### Gestion des clés API

1. **Jamais de clés dans le code** : Utilisez toujours des variables d'environnement
2. **Fichier .env dans .gitignore** : Assurez-vous que `.env` n'est jamais commité
3. **Clés côté client** : Les clés avec préfixe `VITE_` sont exposées côté client
4. **Stockage sécurisé** : Les clés sensibles peuvent être stockées dans Supabase avec chiffrement

### Bonnes pratiques

- Utilisez des clés API avec des permissions minimales
- Implémentez une limitation de taux pour les API
- Surveillez l'utilisation des API
- Rotez régulièrement les clés API
- Activez Row Level Security (RLS) sur la base de données
- Toutes les fonctionnalités nécessitent une authentification

## 📚 Utilisation

### 1. Création de contenu
- Allez dans "Posts" pour générer du contenu LinkedIn
- Utilisez les templates ou créez du contenu personnalisé
- Planifiez vos publications

### 2. Gestion des messages
- Section "Messages" pour créer des messages de connexion
- Templates personnalisables selon le type de message
- Suivi des messages envoyés

### 3. Calendrier
- Connectez vos calendriers (Google, Outlook, LinkedIn)
- Planifiez des réunions directement depuis l'interface
- Glissez-déposez pour réorganiser

### 4. Analytics
- Consultez le tableau de bord pour les métriques
- Analysez les performances de vos posts
- Suivez la croissance de votre réseau

## 📏 Bonnes pratiques

### Création de contenu
- Restez professionnel dans vos publications
- Utilisez des hashtags pertinents
- Incluez des appels à l'action
- Maintenez une fréquence de publication régulière

### Networking
- Personnalisez vos demandes de connexion
- Faites un suivi sous 48 h
- Interagissez avec le contenu de vos contacts
- Soyez concis dans vos messages

### Gestion du calendrier
- Planifiez les réunions pendant les heures de bureau
- Incluez un ordre du jour clair
- Envoyez des rappels aux participants
- Faites un suivi après les réunions

## 🤝 Contribution

1. Fork le projet
2. Créez une branche pour votre fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🆘 Support

Pour obtenir de l'aide :

1. Consultez la documentation
2. Ouvrez une issue sur GitHub
3. Contactez l'équipe de support à [support@linkedgpt.com](mailto:support@linkedgpt.com)

## 🔄 Changelog

### Version 1.0.0
- Lancement initial
- Génération de contenu IA
- Gestion de calendrier
- Analytics de base
- Support multi-langues

---

**Développé avec ❤️ pour la communauté LinkedIn**
