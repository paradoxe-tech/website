function find() {
  console.log(search)

  let res = []

  for(let fourmi of fourmis) {
    if(matchObj(fourmi, search)) res.push(fourmi)
  }

  display(res)
}

function matchObj(object, template) {
  function matchProps(val, Tval) {
    if(!Tval || Tval === "") return true
    if(!val || val === "inconnu") return false

    if(typeof Tval === 'function') {
      return Tval(val)
    } else if(Array.isArray(val)) {
      if(Array.isArray(Tval)) return a_in_b(Tval, val)
      else return val.includes(Tval)

    } else if(typeof val === 'object') {
      if(typeof Tval === 'object') return matchObj(val, Tval)
    } else {
      if(typeof val === "string" && typeof Tval === "string") return val.toLowerCase() === Tval.toLowerCase()
      return val === Tval
    }
  }

  for(let [prop, val] of Object.entries(object)) {
    if( !matchProps(object[prop], template[prop]) ) return false
  }

  return true
}

function display(fourmis) {

  let results = document.querySelector('#results')
  results.innerHTML = ""
  if(fourmis.length == 0) results.innerHTML += "aucun résultat." 
  document.querySelector('#n-results').innerHTML = `(${fourmis.length})`

  for(let fourmi of fourmis) {

    if(fourmis.filter(f => f.genre == fourmi.genre).length > 1) {
      let genre = fourmi.genre.toLowerCase()

      if(!document.querySelector(`#${genre}`)) {
        results.innerHTML += `<div class="genre" id="${genre}"><h2>${fourmi.genre} spp.</h2></div>`
      }

      document.querySelector(`#${genre}`).innerHTML += `<div class="espece" onclick='render("${fourmi.genre}", "${fourmi.espece}")'>${fourmi.genre} ${fourmi.espece}</div>`
    } else {
      results.innerHTML += `<div class="espece" onclick='render("${fourmi.genre}", "${fourmi.espece}")'>${fourmi.genre} ${fourmi.espece}</div>`
    }

  }

}

function a_in_b(a, b) {

  for(let el_a of a) {
    if(!b.includes(el_a)) return false
  }

  return true
}

function render(genre, espece) {
  let fourmi = fourmis.find(e => e.genre == genre && e.espece == espece)

  let img = fourmi.specimen !== "inconnu" ? `<img src="https://www.antweb.org/images/${fourmi.specimen}/${fourmi.specimen}_p_1_high.jpg">` : "<div id='centered'>aucun specimen enregistré</div>"

  let html = `
  ${img}
  <div class="render">
    <h3>${genre} ${espece}</h3>
    <span>Sous-Famille des ${fourmi.subf[0].toUpperCase() + fourmi.subf.slice(1)}</span><br/>
    <span>Fondation ${fourmi.colonie.fondation.replaceAll('_', " ")}</span><br/>
    <span>Colonies ${fourmi.colonie.gynie}s</span><br/>
    <span>${fourmi.colonie.diapause == "homodynamique" ? "Espèce homodynamique" : "Espèce hétérodynamique"}</span><br/>
    <br/>
    ${fourmi.colonie.essaimage !== "inconnu" ? `<span>Essaimages réprésentés sur 1 an :</span>${planning(fourmi.colonie.essaimage.split('-'))}<br/>` : ""}
    <span>Gyne d'environ ${fourmi.taille.gyne}mm</span><br/>
    <span>Ouvrières d'environ ${fourmi.taille.minor}mm</span><br/>

    ${fourmi.particularites.morphologie.length > 0 ? `<br/>Morphologie :<ul><li>${fourmi.particularites.morphologie.join('</li><li>').replaceAll('_', " ")}</li></ul>` : ""}
    ${fourmi.particularites.relations.length > 0 ? `<br/>Relations :<ul><li>${fourmi.particularites.relations.join('</li><li>').replaceAll('_', " ")}</li></ul>` : ""}
    ${fourmi.particularites.capacites.length > 0 ? `<br/>Capacités :<ul><li>${fourmi.particularites.capacites.join('</li><li>').replaceAll('_', " ")}</li></ul>` : ""}

    <br/>
    <div class="links">
       <a href="https://www.antweb.org/description.do?genus=${genre}${fourmi.espece !== "sp." ? `&species=${fourmi.espece}&rank=species` : ""}">📚</a>
       <a href="https://antmaps.org/${fourmi.espece !== "sp." ? `?mode=species&species=${fourmi.genre}.${fourmi.espece}` : `?genus=${fourmi.genre}`}">🌍</a>
       <a href="https://antcheck.info/?search=${fourmi.espece !== "sp." ? `${fourmi.genre}%20${fourmi.espece}` : fourmi.genre}">🛒</a>
    </div>
  </div>`

  document.querySelector('#render').classList.remove('hidden')
  document.querySelector('#render').innerHTML = html
}

function planning(months) {
  let res = '<table><tr>'
  let ymonths = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D']

  for(let i=0; i < 12; i++) {
    let month = months[i]
    let color = month == 1 ? "yellow" : ""
    color = month == 2 ? "orange" : color
    color = month == 3 ? "red" : color

    res += `<td class="month ${color}">${ymonths[i]}</td>`
  }

  return res + "</tr></table>"
}

find()

function popMenu() {
  document.querySelector('#vertical').classList.toggle('hidden')
  document.querySelector('#main').classList.toggle('marged')
}