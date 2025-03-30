# Spécifications de conception pour le site similaire à DeFiLlama

## Structure générale

### Mise en page
- **Barre de navigation latérale** : Positionnée à gauche, fixe, avec défilement indépendant
- **Zone de contenu principale** : Occupant la majeure partie de l'écran, avec défilement indépendant
- **En-tête** : Contenant le logo, la barre de recherche et les boutons d'action
- **Pied de page** : Minimaliste, avec liens vers les informations légales et les réseaux sociaux

### Thème de couleur
- **Fond principal** : Noir (#121212) pour le fond de page
- **Fond secondaire** : Gris foncé (#1e1e1e) pour les cartes et les panneaux
- **Accent primaire** : Bleu (#3772ff) pour les boutons principaux et les liens
- **Accent secondaire** : Vert (#00c853) pour les valeurs positives
- **Accent tertiaire** : Rouge (#ff3d71) pour les valeurs négatives
- **Texte principal** : Blanc (#ffffff) pour une lisibilité maximale
- **Texte secondaire** : Gris clair (#b3b3b3) pour les informations moins importantes

## Navigation

### Barre latérale
- **Logo** : En haut de la barre latérale
- **Catégories principales** :
  - Portfolio (Page d'accueil)
  - Cryptomonnaies
  - Chaînes
  - Protocoles
  - Rendements
  - Analyses
  - Stratégies
  - Échanges
  - Paramètres

- **Sous-menus** : Déroulants pour chaque catégorie principale
- **Indicateurs visuels** : Pour la section active
- **Mode réduit** : Possibilité de réduire la barre latérale à des icônes uniquement

## Pages principales

### Page d'accueil (Portfolio)
- **En-tête** : Valeur totale du portfolio et variation
- **Graphique principal** : Évolution de la valeur du portfolio dans le temps
- **Répartition** : Diagramme circulaire montrant la répartition par catégorie
- **Tableau des actifs** : Liste des cryptomonnaies avec leurs métriques clés
- **Performances** : Cartes montrant les meilleures/pires performances

### Page Cryptomonnaies
- **Filtres** : Par capitalisation, volume, variation
- **Tableau principal** : Liste des cryptomonnaies avec colonnes triables
- **Graphiques miniatures** : Évolution du prix sur 7 jours
- **Actions rapides** : Boutons pour ajouter au portfolio ou aux favoris

### Page Chaînes
- **Carte des chaînes** : Visualisation des chaînes par TVL
- **Tableau des chaînes** : Métriques par blockchain
- **Statistiques** : Nombre de protocoles, adresses actives, etc.

### Page Protocoles
- **Organisation** : Par chaîne et par catégorie
- **Métriques** : TVL, volume, rendement, etc.
- **Filtres avancés** : Multi-critères pour affiner la recherche

### Page Rendements
- **Tableau principal** : Pools classés par APY
- **Filtres** : Par token, chaîne, risque
- **Indicateurs de risque** : Évaluation visuelle du niveau de risque

### Page Analyses
- **Graphiques avancés** : Corrélations, tendances
- **Indicateurs techniques** : RSI, MACD, etc.
- **Analyses fondamentales** : Métriques on-chain

### Page Stratégies
- **Stratégies prédéfinies** : Modèles d'allocation d'actifs
- **Simulateur** : Outil de simulation de performance
- **Comparaison** : Benchmarking avec indices de référence

## Composants UI

### Tableaux de données
- **En-têtes** : Triables, avec indicateurs de direction
- **Pagination** : 10/25/50/100 éléments par page
- **Filtres rapides** : Intégrés dans les en-têtes
- **Recherche** : Filtre instantané sur toutes les colonnes
- **Mise en évidence** : Variations positives en vert, négatives en rouge
- **Actions contextuelles** : Menu d'actions sur chaque ligne

### Graphiques
- **Types** : Linéaire, chandelier, histogramme, circulaire
- **Interactivité** : Zoom, survol pour détails
- **Périodes** : 24h, 7j, 30j, 90j, 1a, Max
- **Légendes** : Dynamiques, avec valeurs au survol
- **Export** : PNG, CSV
- **Thème** : Adapté au thème sombre global

### Cartes et widgets
- **Design** : Coins arrondis, ombre légère
- **En-tête** : Titre et actions (rafraîchir, paramétrer)
- **Contenu** : Données principales et visualisation
- **Pied** : Liens vers plus de détails
- **États** : Normal, chargement, erreur

### Formulaires et contrôles
- **Champs de saisie** : Style minimaliste, validation visible
- **Boutons** : Primaire (bleu), secondaire (gris), danger (rouge)
- **Sélecteurs** : Dropdowns avec recherche
- **Toggles** : Pour les options binaires
- **Sliders** : Pour les plages de valeurs

## Responsive design
- **Points de rupture** :
  - Mobile : < 768px
  - Tablette : 768px - 1024px
  - Desktop : > 1024px
- **Adaptations** :
  - Mobile : Barre latérale masquée, menu hamburger
  - Tablette : Barre latérale réduite (icônes)
  - Desktop : Affichage complet

## Animations et transitions
- **Navigation** : Transitions douces entre les pages
- **Chargement** : Skeletons pour le chargement progressif
- **Données** : Animation subtile lors de la mise à jour
- **Interactions** : Feedback visuel sur les actions utilisateur

## Accessibilité
- **Contraste** : Conforme aux normes WCAG AA
- **Taille de texte** : Minimum 14px pour le texte principal
- **Focus** : Indicateurs visibles pour la navigation au clavier
- **Alternatives** : Texte alternatif pour les éléments visuels
