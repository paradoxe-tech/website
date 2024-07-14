

let actualites = JSON.parse(get(window.location.origin + "/cdn/data/actus.json"))
actualites = actualites.sort(sortByDate)



for(var actu of actualites) {

  let date = actu.date
  let board = actu.sub.length > 0 ? md(` pour ${actu.sub.toLowerCase()}`) : ""
  let img = actu.cover_path.length > 0 ? `<img src="${actu.cover_path.replaceAll('__SITE__', window.location.origin)}">` : ""
  
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
          ${img}
        </div>
      </div>
      ${document.querySelector('#timeline').innerHTML}`
}