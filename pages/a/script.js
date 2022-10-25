alert('cette page est en développement. Merci de ne pas tenir compte des erreurs potentielles.')

function get(yourUrl) {
  var Httpreq = new XMLHttpRequest()
  Httpreq.open("GET", yourUrl, false)
  Httpreq.send(null)
  return Httpreq.responseText
}

const site_URL = `${window.location.origin}/`
let actualites = JSON.parse(get(site_URL + "cdn/data/actus.json"))

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

for(var actu of actualites) {

  let date = actu.sub.split(' - ')[1]
  let board = md(` pour ${actu.sub.split(' - ')[0].toLowerCase()}`)
 // let board = actu.board ? `pour <a href="../p/${actu.board.toLowerCase()}"><pink>p/${actu.board}</pink>` : ""
  
  document.querySelector('#timeline').innerHTML = `<div class="actu">
        <h2>${actu.name}</h2>
        <grey>Posté le <white>${date}</white>${board}</grey>
        <br/><br/>
        <p>${md(actu.desc)}</p>
      </div>
      ${document.querySelector('#timeline').innerHTML}`
}