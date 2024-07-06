let sentences = [
  "Les fourmis ont formé un moulin. Elles tournoient en cercle, se suivant les unes après les autres dans une danse mortelle qui ne finira que lorsqu'aucune d'elles ne pourra plus bouger.",
  "La volonté, l'effort de persévérer dans l'être qu'on observe dans chacun d'entre nous ; elle est simplement le résultat d'une séléction naturelle parmi un aléa de moteurs primordiaux, sans raison d'exister.",
  "Personne ne peut simuler l'univers dans l'univers correctement avant que son temps de génération ne soit atteint. Le démon de Laplace ne sera jamais humain.",
  "ˣ̌́̒́ˌˀ̔ˇ̅̓ˀ̌ˇ́̍̏̒̕ˀ̄̅ˀ̍́ˀ̖̉̅"
]

document.querySelector('#err-phrase').innerHTML = sentences[Math.floor(Math.random() * sentences.length)]