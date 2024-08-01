document.addEventListener("mousewheel", (e) => {
  let slider = scrollBetween(0, 500) 
  document.querySelector('#welcome').style.marginTop = `${slider * 80}%`
});



function loadActus(n) {
  let actualites = JSON.parse(get(window.location.origin + "/cdn/data/actus.json"))
  actualites = actualites.sort(sortByDate)
  let string = ""
  let i = 0;
  
  for(var actu of actualites) {
    if(i == n) break
    let date = actu.date
    let board = actu.sub.length > 0 ? ` pour ${actu.sub.toLowerCase()}` : ""
    let img = actu.cover_path.length > 0 ? `<img src="${actu.cover_path.replaceAll('__SITE__', window.location.origin)}">` : ""
  
    string = `<div class="actu">
      <div class="title">
        <h2>${actu.name}</h2>
        <span>Posté le <white>${date}</white>${board}</span>
      </div>
      <br/>
      <div class="text">
        <p>${actu.desc}</p>
      </div>
      <div class="pics">
        ${img}
      </div>
    </div>` + string

    i++
  }
  
  document.querySelector('#timeline').innerHTML = string
}

loadActus(3)

let productions = JSON.parse(get(window.location.origin + "/cdn/data/productions.json"))
productions = productions.sort(sortByDate).reverse()

displayItems(productions, {
  filter: x => {
    if (sortByDate(x, {date:Date.now()}) !== -1) return false
    return true
  },
  container: "#productions",
  max: 6
});

(async () => {
  let tags = document.querySelectorAll('.tag')
  for(let tag=0; true; tag++) {
    let thisTag = tags[tag % tags.length]
    tags.forEach(t => t.classList.remove('active'))
    thisTag.classList.add('active')
    await sleep(700)
  }
})();