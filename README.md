# TodoApp
# Installation
 1- Cloner ou télécharger le projet
 cd todo_app
 2- Installer les dépendances
 npm install
 3- Installer Angular Material (si pas déjà fait)

# Démarrage de l'application
  npm start
  L'application sera disponible sur : http://localhost:4200

# Option 2 : Démarrage complet (Frontend + API mock)
# Terminal 1 - Backend mock
 npm run server

# Terminal 2 - Application Angular  
 npm start

# Ou en une seule commande :
 npm run dev

Accès :

 Application : http://localhost:4200

 API Mock : http://localhost:3000

# Technologies Utilisées
# Frontend
 Angular 17 - Framework principal

 TypeScript - Langage de développement

 Angular Material - Composants UI

 Tailwind CSS - Framework CSS utilitaire

 RxJS - Programmation réactive

# Backend (Mock)
  JSON Server - API REST mockée

  db.json - Base de données 
  

#  Fonctionnalités Implémentées
 #  Gestion des Tâches (CRUD complet)
  1- Créer de nouvelles tâches

  2- Afficher la liste des tâches

  3- Modifier les tâches existantes

  4- Supprimer des tâches

# Validation des Formulaires
  1- Titre : minimum 3 caractères (requis)

  2- Personne : sélection obligatoire avec auto-complétion

  3- Date de début : obligatoire

  4- Labels : choix multiple (HTML, CSS, NODE JS, JQUERY)

  5- Priorité : sélection (Facile, Moyen, Difficile)

# Filtrage et Recherche
  1- Filtres par priorité : Facile, Moyen, Difficile

  2- Filtres par label : HTML, CSS, NODE JS, JQUERY

  3- Pagination automatique : 5 éléments par page

  4- Tri des colonnes : clic sur les en-têtes

# Interface Utilisateur
  1- Design Material : interface moderne et professionnelle

  2- Responsive : adapté mobile et desktop

  3- Performances : chargement optimisé

  4- Expérience utilisateur : feedback immédiat

# Développement
  # Ajouter un nouveau composant
   ng generate component components/nom-composant

  # Ajouter un nouveau service
   ng generate service services/nom-service