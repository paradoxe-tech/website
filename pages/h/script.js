function get(yourUrl) {
  var Httpreq = new XMLHttpRequest()
  Httpreq.open("GET", yourUrl, false)
  Httpreq.send(null)
  return Httpreq.responseText
}

const site_URL = 
const productions = JSON.parse(get(site_URL + "data/productions.json"))

const folders = ['Développement', 'Études', 'Musique', 'Graphisme']
const wrapper = document.querySelector('#container')

for (var folder of folders) {
  filtered_productions = productions.filter(x => x.type === folder)
  for (var product of filtered_productions) {
    wrapper.innerHTML += `<div class="item">
          <img class="item-cover" src="../../cdn/assets/projects/${product.name.toLowerCase()}.png">
          <ion-icon class="item-type" name="game-controller-outline"></ion-icon>
          <h2 class="item-name">${product.name}</h2>
          <span class="item-desc">${product.desc}</span>
        </div>`
  }
}