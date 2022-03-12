function add() {
  
  let project = document.createElement('div')
    project.className = 'project'

  let cover = document.createElement('img')
    cover.src = "assets/cover.jpg"
    cover.className = 'project__cover'
  
  let title = document.createElement('h2')
    title.innerHTML = "Aeronautica"
    title.className = 'project__title'
  
  let desc = document.createElement('p')
    desc.innerHTML = 'Lorem ipsum dolor sit amet, noloran sin morentum a lares ter site.'
    desc.className = 'project__text'
  
  let btn = document.createElement('button')
    btn.onclick = function() {alert("buttonnnn")}
    btn.innerHTML = 'see on Replit'
    btn.className = 'project__btn'
  
  project.appendChild(cover)
  project.appendChild(title)
  project.appendChild(desc)
  project.appendChild(btn)
  document.querySelector('#projects-wrapper').appendChild(project)
  
}