for (const element of data) {
    
  let project = document.createElement('div')
    project.className = 'project'

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
  
  project.appendChild(cover)
  project.appendChild(title)
  project.appendChild(desc)
  // project.appendChild(btn)
  document.querySelector('#projects-wrapper').appendChild(project)
  
}

