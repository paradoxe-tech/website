// ================================================================= { HIGHLIGHT } 

let i = 0

setInterval( () => {
    document.querySelector("body > div.banner > div > p").innerHTML = document.querySelector("body > div.banner > div > p").innerHTML.replace('<pink>', ``).replace('</pink>', ``)
  document.querySelector("body > div.banner > div > p").innerHTML = document.querySelector("body > div.banner > div > p").innerHTML.replace(subtitles[i], `<pink>${subtitles[i]}</pink>`)
  i += 1
  if(i === subtitles.length) i = 0
},1000)

projects.sort(dateSort)
for (const element of projects) {
    
  let project = document.createElement('div')
    project.className = 'project'

  let cover_c = document.createElement('div')
    cover_c.className = 'project__cover-container'
    if(element.site_path) cover_c.onclick = () => location.href = `${site_URL}p/${element.site_path}`

  let cover = document.createElement('img')
    cover.src = "../" + element.cover_path
    cover.className = 'project__cover'
  
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

function dateSort(a, b) {
  return b.date - a.date
}
