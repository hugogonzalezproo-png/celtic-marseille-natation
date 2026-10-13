# Site du Celtic Marseille Natation

Site vitrine statique : HTML, CSS et un peu de JavaScript, sans framework ni dépendance. Pensé d'abord pour le téléphone, avec une barre de navigation en bas de l'écran.

```
index.html          Accueil
club.html           Le club, la compétition, les actualités, les dons
ecole.html          École de natation (4 à 10 ans)
adultes.html        Adultes et Masters
adherer.html        Adhérer : choix du groupe, tarif, demande
infos.html          Bassins, questions fréquentes, contact
assets/js/data.js   INFOS DU CLUB : groupes, horaires, tarifs, téléphone, liens de paiement
assets/js/main.js   fonctionnement (menu, animations, formulaire…)
assets/css/style.css
assets/img/         logos et photos
```

## Voir le site en local

Ouvrir un terminal dans ce dossier, puis :

```bash
python3 -m http.server 8080
```

Aller ensuite sur http://localhost:8080.

## Mettre à jour le contenu

- **Horaires, tarifs, groupes, saison** : tout est dans `assets/js/data.js`. Les pages École, Adultes et Adhérer se mettent à jour toutes seules.
- **Lien de paiement HelloAsso** : `payLinks` dans `assets/js/data.js`. Tant qu'il est vide, le bouton « Demander l'adhésion » envoie une demande par SMS ou WhatsApp. Dès qu'il contient le lien du formulaire d'adhésion HelloAsso, le bouton devient « Payer l'adhésion ».
- **Numéro du club** : `phone` dans `assets/js/data.js`.
- **Actualités** : dans `club.html`, section `id="actus"`. Copier un bloc `<article class="newscard">`, changer l'image, la date et le texte.
- **Questions fréquentes** : dans `infos.html`, chaque question est un bloc `<details class="qa">`.
- **Menu et pied de page** : ils sont répétés en haut et en bas de chaque page. Une modification du menu se fait dans les 6 fichiers.
