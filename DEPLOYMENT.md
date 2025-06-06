# Guide de Déploiement - LinkedGPT

Ce guide vous explique comment déployer LinkedGPT de manière sécurisée en gérant correctement les clés API.

## 🔐 Gestion des Clés API

### Principe de base
- **JAMAIS** de clés API dans le code source
- Utiliser des variables d'environnement
- Séparer les clés de développement et de production
- Chiffrer les clés sensibles

### Types de clés

#### 1. Clés côté client (préfixe VITE_)
Ces clés sont exposées dans le navigateur :
```env
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

#### 2. Clés côté serveur (sans préfixe VITE_)
Ces clés restent sur le serveur (pour les fonctions edge) :
```env
SUPABASE_SERVICE_ROLE_KEY=eyJ...
OPENAI_API_KEY=sk-...
```

## 🚀 Déploiement sur Netlify

### 1. Préparation du repository

```bash
# Initialiser git si pas déjà fait
git init

# Ajouter tous les fichiers (sauf .env grâce à .gitignore)
git add .

# Premier commit
git commit -m "Initial commit - LinkedGPT"

# Ajouter remote GitHub
git remote add origin https://github.com/votre-username/linkedgpt.git

# Push vers GitHub
git push -u origin main
```

### 2. Configuration Netlify

1. **Connecter le repository**
   - Allez sur [Netlify](https://netlify.com)
   - "New site from Git"
   - Sélectionnez votre repository GitHub

2. **Configuration de build**
   ```
   Build command: npm run build
   Publish directory: dist
   ```

3. **Variables d'environnement**
   - Site settings > Environment variables
   - Ajoutez toutes vos variables :

   ```
   VITE_SUPABASE_URL=https://votre-projet.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJ...
   ```

### 3. Déploiement automatique

Chaque push sur `main` déclenchera un nouveau déploiement.

## 🔧 Déploiement sur Vercel

### 1. Installation et configuration

```bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter
vercel login

# Déployer
vercel

# Suivre les instructions :
# - Link to existing project? No
# - Project name: linkedgpt
# - Directory: ./
```

### 2. Configuration des variables

```bash
# Ajouter les variables d'environnement
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY

# Pour chaque environnement (development, preview, production)
```

### 3. Déploiement en production

```bash
vercel --prod
```

## 🐳 Déploiement avec Docker

### 1. Dockerfile

```dockerfile
# Build stage
FROM node:18-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 2. Configuration nginx

```nginx
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;

        location / {
            try_files $uri $uri/ /index.html;
        }

        # Gzip compression
        gzip on;
        gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    }
}
```

### 3. Build et déploiement

```bash
# Build l'image
docker build -t linkedgpt .

# Run localement
docker run -p 8080:80 linkedgpt

# Push vers un registry
docker tag linkedgpt your-registry/linkedgpt:latest
docker push your-registry/linkedgpt:latest
```

## ☁️ Déploiement sur AWS

### 1. S3 + CloudFront

```bash
# Build
npm run build

# Sync vers S3
aws s3 sync dist/ s3://votre-bucket-name --delete

# Invalider CloudFront
aws cloudfront create-invalidation --distribution-id VOTRE_DISTRIBUTION_ID --paths "/*"
```

### 2. Amplify

```bash
# Installer Amplify CLI
npm install -g @aws-amplify/cli

# Initialiser
amplify init

# Ajouter hosting
amplify add hosting

# Déployer
amplify publish
```

## 🔒 Sécurité en Production

### 1. Variables d'environnement sécurisées

```bash
# Utiliser des services de gestion de secrets
# AWS Secrets Manager
# Azure Key Vault
# Google Secret Manager
# HashiCorp Vault
```

### 2. Configuration HTTPS

Assurez-vous que votre site utilise HTTPS :
- Netlify : HTTPS automatique
- Vercel : HTTPS automatique
- Autres : Configurez SSL/TLS

### 3. Headers de sécurité

```javascript
// netlify.toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Content-Security-Policy = "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://api.supabase.co https://api.openai.com"
```

## 📊 Monitoring et Logs

### 1. Supabase Analytics
- Activez les analytics dans votre projet Supabase
- Surveillez les requêtes et performances

### 2. Application Monitoring
```javascript
// Sentry pour le monitoring d'erreurs
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "VOTRE_SENTRY_DSN",
  environment: process.env.NODE_ENV,
});
```

### 3. Logs d'API
- Surveillez l'utilisation des API (OpenAI, LinkedIn)
- Configurez des alertes pour les limites

## 🔄 CI/CD Pipeline

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy to Netlify

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build
      run: npm run build
      env:
        VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
        VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
        
    - name: Deploy to Netlify
      uses: nwtgck/actions-netlify@v1.2
      with:
        publish-dir: './dist'
        production-branch: main
      env:
        NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
        NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

## 🆘 Dépannage

### Erreurs communes

1. **Variables d'environnement non définies**
   ```bash
   # Vérifiez que toutes les variables sont définies
   echo $VITE_SUPABASE_URL
   ```

2. **Erreurs de build**
   ```bash
   # Nettoyez le cache
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Erreurs CORS**
   - Vérifiez la configuration Supabase
   - Ajoutez votre domaine dans les URLs autorisées

### Support

- Documentation Netlify : https://docs.netlify.com
- Documentation Vercel : https://vercel.com/docs
- Documentation Supabase : https://supabase.com/docs

---

**Bonne chance avec votre déploiement ! 🚀**