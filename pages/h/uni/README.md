# Uni - Your pocket universe
### Simulateur universel intuitif d'automates cellulaires

## Le projet

Uni, c'est avant tout la vulgarisation du monde des automates cellulaires à toute une partie de la population : ceux qui ne savent pas coder ! L'objectif était clair : un bac à sable programmable par bloc (from scratch) capable de simuler une grande majorité des règles intéressantes. Et voilà chose faite ! Il y a encore beaucoup de défauts, mais on peut déjà s'amuser avec le projet et repousser ses limites.

> 🌍 [Version Stable](https://callmekitsu.com/h/uni) / [Version Stable (actualisation rapide)](https://callmekitsu.replit.app/h/uni)

> 🌍 [Version Canary](https://b8a210d6-fd04-4d4e-8d99-c38dcbba5b0b-00-1eslt0xo4n2r5.kirk.replit.dev/h/uni) (par conséquent souvent indisponible)
> 
## Automate cellulaire ?

Une grille, théoriquement infinie, dans laquelle les cellules (cases de la grille) ont un état, généralement un nombre. On représente ici les états par des couleurs (avec noir = 0). Cet univers évolue au cours des générations en fonction de règles, souvent simples, définies à l'avance. Par exemple, on peut penser à des règles de voisinage, qui comptent les voisins "vivants" (état > 0) d'une cellule ; ou encore, une règle d'état, qui vérifie qu'une cellule est dans un état donné.

## Templates

La plate-forme propose une liste de templates, qui sont en fait des jeux de règles préenregistrées qui correspondent à des automates célèbres pour leurs propriétés. Vous pouvez aussi choisir à tout moment "custom automata" dans la liste déroulante pour créer votre propre univers ! À ce jour, certaines configurations de règles ne sont pas prévues par le panel de configuration en blocs ; elles seront certainement ajoutées avec le temps !

## Interface

Quelques boutons s'offrent à vous dans l'interface ! Les premiers sont les flèches directionnelles, "avant" et "arrière" qui vous permettent tout simplement de passer d'une génération à une autre. Ensuite, le bouton "play / pause" avance dans les générations en continu tant qu'il n'est pas pressé à nouveau. Les sélécteurs de curseur sont au nombre de trois : "switch", représenté par un drapeau, vous donnera la possibilité de cliquer sur une cellule pour faire passer son état de 0 à 1 et inversement ; "plus" d'ajouter 1 à l'état actuel de la cellule et "moins" à y enlever 1. Enfin, le bouton "étincelles" redéfinit l'état d'un certain nombre de cellule dans l'univers à "vivante".

En haut à gauche de l'univers, quelques valeurs sont affichées et s'actualisent en continu ! Il s'agit respectivement de la population (nombre de cellules dont l'état n'est pas nul) ; du score de l'univers (somme des valeurs des états) et de la génération en cours.

## Objectifs

La propagation du projet dans les écoles et collèges du monde serait un grand pas pour la sensibilisation à l'informatique théorique ! En effet, les enjeux sont plutôt faciles à comprendre : un grand nombre de comportements complexes émerge de règles élémentaires. En attendant, il serait souhaitable de partager le projet à un maximum de personnes intéressées ou non par la thématique !

## Dépendances

L'affichage utilise [WebGL2](https://get.webgl.org/webgl2/). Le calcul des états ne fait appel à aucune librairie externe, si ce n'est [Tsu.js](https://callmekitsu.com/h/tsu-js). Enfin, les icônes vectorielles des boutons de l'interface proviennent d'[ionicons](https://ionic.io/icons) et la police utilisée est [Itim, cursive](https://fonts.google.com/specimen/Itim) ; détenue par Google Fonts.

## Algorithme

L'ensenble des états est stocké dans une matrice d'états, fonction de la génération actuelle. Un jeu de règles lui est appliqué et renvoie une matrice de transformation, utilisée sur l'univers au temps `t` pour obtenir le temps `t+1`. Pragmatiquement, la matrice de transformation est une pile de procédures visant chacune une cellule de la grille, parmi l'ensemble des cellules modifiées depuis le temps précédent.

## Limitations

La puissance de calcul est limitée par le navigateur et sa portabilité, mais l'utilisation de shaders rend son affichage beaucoup plus optimisé. Cependant, à partir d'une taille de fenêtre environ égale à 100, le temps de génération pour certains jeux de règles peut drastiquement augmenter, allant jusqu'à l'ordre de la seconde. Tout ceci ne s'applique que pour la version actuelle du projet, et des optimisations algorithmiques sont évidemment prévues.  

## Ce que peut simuler Uni

* Tous les [automates totalistiques](https://fr.wikipedia.org/wiki/Automate_cellulaire#Automates_totalistiques) (chaque état dépend du voisinage et de l'état précédent)
  * Toutes les règles de Conway
  * Toutes les règles de Wolfram
* [Piles de sable] et ses variantes
  

## Ce que ne peut pas simuler Uni __pour l'instant__

* Les automates faisant intervenir une Entité
  * [Simulation de gaz](https://en.wikipedia.org/wiki/HPP_model) ou autres, modélisant des flèches directionnelles
  * [Fourmi de Langton](https://fr.wikipedia.org/wiki/Fourmi_de_Langton) et ses variantes
* Les automates dont le voisinage évolue au cours du temps
  * [Billiard Ball Machine](https://www.cell-auto.com/bbm/2d/index.html) et autres dérivées du [voisinage de Margolus](https://www.cell-auto.com/neighbourhood/margolus/index.html)
* Les automates qui font intervenir des modes de transition
  * [Automates fongiques] et ses variantes
* Les [automates probabilistes](https://fr.wikipedia.org/wiki/Automate_cellulaire#Automates_cellulaires_probabilistes) et / ou faisant intervenir des choix
  
## Ce que ne pourra jamais simuler Uni
* Les automates à dimension supérieure à 2
* Les automates à cellules non carées