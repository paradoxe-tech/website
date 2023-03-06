const site_URL = `${window.location.origin}/`
let actualites = JSON.parse(get(site_URL + "cdn/data/actus.json"))
actualites = actualites.sort(sortByDate).reverse()

for(var actu of actualites) {

  let date = actu.sub.split(' - ')[1] || actu.sub
  let board = md(` pour ${actu.sub.split(' - ')[0].toLowerCase()}`)
 // let board = actu.board ? `pour <a href="../p/${actu.board.toLowerCase()}"><pink>p/${actu.board}</pink>` : ""
  
  document.querySelector('#timeline').innerHTML = `<div class="actu">
        <div class="title">
          <h2>${actu.name}</h2>
          <span>Posté le <white>${date}</white>${board}</span>
        </div>
        <br/>
        <div class="text">
          <p>${md(actu.desc)}</p>
        </div>
        <div class="pics">
          <img src="../cdn/assets/projects/alterheart.png">
        </div>
      </div>
      ${document.querySelector('#timeline').innerHTML}`
}

setMouseEvents()