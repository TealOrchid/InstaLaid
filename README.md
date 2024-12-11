# **InstaLaid - Notice d'Installation**

## **Description** 
InstaLaid est une application web humoristique où les utilisateurs peuvent publier, commenter, et interagir avec des images volontairement "moches". Cette plateforme repose sur une interface décalée et des fonctionnalités inspirées des réseaux sociaux classiques.

---

## **Fonctionnalités principales**

- **Publication d'images** : Publiez des images humoristiques ou décalées.
- **Interactions** : Likez, dislikez, ou utilisez la réaction spéciale "VTFF" (🖕).
- **Modération** : Les modérateurs valident ou rejettent les publications.
- **Rôles utilisateurs** : Utilisateurs, Modérateurs et Administrateurs avec des permissions spécifiques.
- **Authentification** : Inscription et connexion via Google OAuth.

---

## **Ressources et technologies utilisées**

- **Framework** : Next.js
- **Base de données** : MongoDB Atlas
- **Stockage des images** : Pinata Cloud
- **ORM** : Prisma
- **Authentification** : Google OAuth via NextAuth.js
- **Hébergement** : Vercel

---

## **Prérequis**
- Avant de commencer, assurez-vous d'avoir installé les outils suivants sur votre machine :
  1. **Node.js** (version 16 ou supérieure) : [Télécharger Node.js](https://nodejs.org/)
  2. **Git** : [Télécharger Git](https://git-scm.com/)
  3. Un éditeur de code (comme [Visual Studio Code](https://code.visualstudio.com/)).
- Compte MongoDB Atlas pour la base de données
- Compte Pinata Cloud pour le stockage des images
- Compte Vercel pour déployer le site

---

## **étapes d'installation**

### **1. Cloner le repository GitHub**
1. Ouvrez un terminal ou une invite de commande.
2. Exécutez la commande suivante pour cloner le projet :
   ```bash
   git clone https://github.com/TealOrchid/InstaLaid.git
   ```

3. Accédez au répertoire du projet :
   ```bash
   cd instaLaid
   ```

---

### **2. Installer les dépendances**
1. Une fois dans le répertoire du projet, installez les dépendances nécessaires en exécutant :
   ```bash
   npm install
   ```

---

### **3. Configurer les variables d'environnement**
1. Créez un fichier `.env` à la racine du projet.
2. Ajoutez les variables nécessaires en suivant ce modèle :
   ```env
   AUTH_SECRET=<votre_secret>
   AUTH_GOOGLE_ID=<id_client_google>
   AUTH_GOOGLE_SECRET=<secret_client_google>
   DATABASE_URL=mongodb+srv://<utilisateur>:<mot_de_passe>@<cluster>.mongodb.net/<nom_base>
   NEXT_PUBLIC_PINATA_GATEWAY_URL=<votre_api_secret_pinata>
   PINATA_JWT=<votre_jwt_pinata>
   ```

3. Remplacez les placeholders (`<...>`) par vos informations.

---

### **4. Lancer le projet en local**
1. Commencez par générer les fichiers nécessaires pour intéragir avec la base de données :
   ```bash
   npx prisma generate
   ```

2. Pour démarrer le serveur de développement, exécutez :
   ```bash
   npm run dev
   ```

3. Ouvrez votre navigateur et accédez à :
   ```
   http://localhost:3000
   ```

---

### **5. Déploiement sur Vercel (optionnel)**
Si vous souhaitez déployer le projet sur **Vercel** :
1. Connectez-vous ou inscrivez-vous sur [Vercel](https://vercel.com/).
2. Importez le repository depuis GitHub dans Vercel.
3. Ajoutez les variables d’environnement nécessaires via l’interface Vercel.
4. Lancez le déploiement. Une URL sera générée automatiquement.

---

## **Commandes utiles**
- **Démarrer le projet localement** :
  ```bash
  npm run dev
  ```
- **Construire l’application pour la production** :
  ```bash
  npm run build
  ```
- **Démarrer l’application en production** :
  ```bash
  npm start
  ```

---

## **Dépannage**
- **Erreur de connexion à la base de données :** Vérifiez que l'URL de votre base de données MongoDB est correctement configurée dans le fichier `.env`.
- **Problème avec l'authentification Google :** Assurez-vous que les identifiants Google sont corrects et configurés dans votre console Google Cloud.
- **Dépendances manquantes :** Exécutez à nouveau `npm install`.

---

## **Accès au site originel**
Vous pouvez accéder à la version en ligne du site ici :  
👉 [https://www.instalaid.vercel.app](https://www.instalaid.vercel.app)

Vous êtes prêt à utiliser **InstaLaid** ! 🎉