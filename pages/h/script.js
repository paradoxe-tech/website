function get(yourUrl) {
  var Httpreq = new XMLHttpRequest()
  Httpreq.open("GET", yourUrl, false)
  Httpreq.send(null)
  return Httpreq.responseText
}

const site_URL = `${window.location.origin}`
let productions = JSON.parse(get(site_URL + "/cdn/data/productions.json"))

function sortByDate(a, b) {
  
  let date_a = new Date(a.date).getTime()
  let date_b = new Date(b.date).getTime()
  
  if (date_a < date_b) {
    return -1
  }
  if (date_a > date_b) {
    return 1
  }
  
  return 0
}

productions = productions.sort(sortByDate).reverse()

console.log(productions)

for (var product of productions) {

  let year = product.date.split('-')[0]
  let month = product.date.split('-')[1] ? `${product.date.split('-')[1]}/` : ""
  let day = product.date.split('-')[2] ? `${product.date.split('-')[2]}/` : ""
  
  document.querySelector('#container').innerHTML += `<div class="item">
      <img class="item-cover" src="../../cdn/assets/projects/${product.delta}.png">
      <ion-icon class="item-type" name="${product.type}"></ion-icon>
      
      <img class="item-run" src="../../cdn/assets/branding/arrow.png" onclick="location.href = site_URL + '/h/${product.delta}'">
      <span class="item-date">${day}${month}${year}</span>
      <h2 class="item-name">${product.name}</h2>
      <span class="item-desc">${md(product.desc)}</span>
    </div>`
}