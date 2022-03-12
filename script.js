for (const element of data) {
    
  let project = document.createElement('div')
    project.className = 'project'

  let cover_c = document.createElement('div')
    cover_c.className = 'project__cover-container'

  let cover = document.createElement('img')
    cover.src = element.cover_path
    cover.className = 'project__cover'
  
  let title = document.createElement('h2')
    title.innerHTML = element.name
    title.className = 'project__title'
  
  let desc = document.createElement('p')
    desc.innerHTML = element.desc
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

let i = 0

setInterval( () => {
    document.querySelector("body > div.banner > div > p").innerHTML = document.querySelector("body > div.banner > div > p").innerHTML.replace('<pink>', ``).replace('</pink>', ``)
  document.querySelector("body > div.banner > div > p").innerHTML = document.querySelector("body > div.banner > div > p").innerHTML.replace(subtitles[i], `<pink>${subtitles[i]}</pink>`)
  i += 1
  if(i === subtitles.length) i = 0
},1000)