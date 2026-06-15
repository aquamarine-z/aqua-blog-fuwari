# À propos de ce site

Bienvenue sur le blog personnel d'Aquamarine ! Ce site est construit sur le puissant framework [Astro Fuwari](https://github.com/saicaca/fuwari) et intègre une série de personnalisations approfondies et d'améliorations de fonctionnalités basées sur son excellent design original, dans le but de créer une base de connaissances personnelle et une plateforme de présentation plus complètes et adaptées aux besoins personnalisés.

## ✨ Améliorations principales

### 1. 🌐 Support international (I18n) renforcé
Dans le monde globalisé d'aujourd'hui, la communication multilingue et le partage technique sont particulièrement importants. J'ai entièrement refactorisé la logique de routage et de rendu I18n basée sur la version originale :
- **Basculement multilingue fluide** : Prend en charge les articles et les documents dans n'importe quel chemin linguistique. Lors du basculement entre différentes versions linguistiques, il navigue précisément vers la version traduite cible correspondante.
- **Mécanisme de Fallback intelligent** : Lorsqu'une traduction n'est pas encore disponible dans la langue cible, le système se dégrade gracieusement en affichant le contenu de la langue principale accompagné d'un message d'information en haut, évitant ainsi aux visiteurs de rencontrer une page 404.
- **Structure de répertoire flexible** : Supprime la restriction selon laquelle les articles doivent être stockés dans une hiérarchie spécifique. Vous pouvez désormais gérer librement votre contenu Markdown dans le répertoire racine ou dans tout dossier spécifique à une langue.

### 2. 📚 Nouveau système de documents (Docs)
En plus du blog habituel basé sur une chronologie, ce site introduit un tout nouveau **système Docs** indépendant :
- **Navigation multiniveau en arborescence** : Génère automatiquement un répertoire en arborescence dans la barre latérale en fonction de la structure des dossiers, idéal pour rédiger des tutoriels en série, des notes techniques systématiques ou du contenu sérialisé.
- **Accumulation de connaissances** : Sépare parfaitement les blogs quotidiens fragmentés des connaissances techniques structurées, offrant une expérience de lecture plus concentrée et immersive pour les documents longs.
- **Adaptation multilingue complète** : Le système Docs hérite également parfaitement du routage I18n global et du mécanisme de Fallback.

### 3. 🎵 Lecteur de musique de fond globale (BGM)
Afin de fournir une expérience de lecture immersive et atmosphérique, j'ai ajouté une fonction de lecture de musique de fond globale au site web :
- **Lecture ininterrompue** : Grâce au mécanisme de routage fluide des applications à page unique (SPA) basé sur Swup, la lecture de la musique de fond ne sera pas interrompue accidentellement, quelle que soit la façon dont vous naviguez entre les articles, les catégories ou les pages de balises.
- **Personnalisation** : À l'avenir, des listes de lecture personnalisées seront prises en charge, permettant à la musique d'accompagner le temps de lecture de chaque visiteur.

### 4. 📱 Adaptation de la table des matières (TOC) sur mobile
Pour les longs articles et documents, la table des matières latérale (TOC) est essentielle pour améliorer l'expérience de lecture. Afin de pallier les éventuels inconvénients de la version originale sur les appareils mobiles, ce site a fait l'objet d'optimisations réactives dédiées :
- **Table des matières flottante sur mobile** : Sur les appareils à petit écran comme les smartphones ou les tablettes, le plan de l'article se réduit automatiquement pour devenir un élégant bouton flottant.
- **Accès en un clic** : Lors de la lecture de textes longs, les visiteurs peuvent appeler le répertoire à tout moment pour accéder rapidement à la section qui les intéresse, éliminant ainsi le besoin de faire défiler de longues pages dans les deux sens, ce qui améliore considérablement l'efficacité de la recherche sur mobile.

### 5. 🗂️ Systèmes d'archives indépendants pour Blog et Docs
Pour rendre la découverte de contenu plus claire et intuitive, la page d'archives a été remaniée et étendue :
- **Chronologies séparées** : Création de pages d'archives indépendantes pour les articles de Blog et les tutoriels de Docs, afin qu'ils n'interfèrent pas entre eux.
- **Organisation claire du contenu** : Que vous passiez en revue d'anciens essais ou que vous recherchiez une série de tutoriels spécifiques, vous pouvez les trouver facilement dans leurs chronologies respectives.

### 6. 🤝 Système de liens d'amis
Les rencontres sur Internet sont un beau destin. Une nouvelle page élégante de Liens d'amis (Friends) a été ajoutée :
- **Cartes d'amis personnalisées** : Affiche les avatars, les pseudos, les biographies et les liens des amis à l'aide de cartes UI unifiées et esthétiques.
- **Expansion et interaction faciles** : Prend en charge la catégorisation des liens d'amis, rendant le site plus chaleureux et facilitant la communication entre blogueurs.

## 🚀 Open Source et URL du projet

Tout le code personnalisé et les nouvelles fonctionnalités de ce blog sont open source sur GitHub. Si vous aimez ces extensions ou si vous souhaitez créer votre propre site personnel multilingue puissant basé sur cela, n'hésitez pas à visiter et à mettre une étoile sur mon dépôt :

::github{repo="aquamarine-z/aqua-blog-fuwari"}

---

> ### 🙏 Remerciements et droits d'auteur
> 
> L'interface utilisateur de base et l'inspiration principale de ce site proviennent de :
> - [Astro Fuwari](https://github.com/saicaca/fuwari) par saicaca
>
> Images de fond/illustrations utilisées dans les démos du site et les configurations par défaut :
> - [Unsplash](https://unsplash.com/)
> - [星と少女](https://www.pixiv.net/artworks/108916539) par [Stella](https://www.pixiv.net/users/93273965)
> - [Rabbit - v1.4 Showcase](https://civitai.com/posts/586908) par [Rabbit_YourMajesty](https://civitai.com/user/Rabbit_YourMajesty)
