alert('cette page est en développement. Merci de ne pas tenir compte des erreurs potentielles.')

let POSITION = 0

setInterval(() => {
  document.getElementsByClassName('banner')[POSITION % 2].classList.toggle("hidden")
  document.getElementsByClassName('banner')[(POSITION + 1) % 2].classList.toggle("hidden")
  POSITION ++
}, 5000)