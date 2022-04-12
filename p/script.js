// ================================================================= { HIGHLIGHT } 

styleDesc()

let params = (new URL(document.location)).searchParams;
let find = params.get('find')

if(find) {
  find = find.split(' ')

  _pj = projects

  projects = pjFind(_pj, find)
}

projects.sort(dateSort)
for (const element of projects) {
    
  let project = document.createElement('div')
    project.className = 'project'

  let cover_c = document.createElement('div')
    cover_c.className = 'project__cover-container'
    if(element.site_path) cover_c.onclick = () => {
      if(element.site_path === "404") return
      document.location.href = element.site_path.replaceAll('__SITE__', site_URL + "p/")
    }

  let cover = document.createElement('img')
    cover.src = "../" + element.cover_path
    cover.className = 'project__cover'
    if(element.site_path === "404") cover_c.style.cursor = 'auto'
  
  let title = document.createElement('h2')
    title.innerHTML = element.name
    title.className = 'project__title'

    let statut = "#FAA81A"
  
    if(element.status === true) {
      statut = '#3BA55D'
    }
    if(element.status === false) {
      statut = 'red'
    }
  
    title.style = `--pj-status: ${statut}`
  
  let desc = document.createElement('p')
    desc.innerHTML = md(element.desc)
    desc.className = 'project__text'
  
  /*
  let btn = document.createElement('button')
    btn.onclick = function() {alert("buttonnnn")}
    btn.innerHTML = 'see on Replit'
    btn.className = 'project__btn'
  */

  cover_c.appendChild(cover)
  project.appendChild(cover_c)
  project.appendChild(title)
  project.appendChild(desc)
  // project.appendChild(btn)
  document.querySelector('#projects-wrapper').appendChild(project)
  
}

document.querySelector('#projets').outerHTML += `<input id="search-project" autofocus type='text 'style='margin-left: 698px;width: 270px;' class='see-more' placeholder='cherchez un projet..'>`

document.querySelector('#search-project').addEventListener("keyup", ({key}) => {
  if (key === "Enter") {
    document.location.replace(`${site_URL}/p/?find=${document.querySelector('#search-project').value}`)
  }
})

function dateSort(a, b) {
  return b.date - a.date
}