// ================================================================= { PROJECTS } 

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

// ================================================================= { HIGHLIGHT } 

let i = 0

setInterval( () => {
    document.querySelector("body > div.banner > div > p").innerHTML = document.querySelector("body > div.banner > div > p").innerHTML.replace('<pink>', ``).replace('</pink>', ``)
  document.querySelector("body > div.banner > div > p").innerHTML = document.querySelector("body > div.banner > div > p").innerHTML.replace(subtitles[i], `<pink>${subtitles[i]}</pink>`)
  i += 1
  if(i === subtitles.length) i = 0
},1000)

// ================================================================= { ACTU-1 } 

let main_actu = document.createElement('div')
  main_actu.className = 'actu-main'

let main_actu_cover_c = document.createElement('div')
  main_actu_cover_c.className = 'actu-main__cover-container'

let main_actu_cover = document.createElement('img')
  main_actu_cover.src = actus[0].cover_path
  
let main_actu_title = document.createElement('h2')  
  main_actu_title.innerHTML = actus[0].name
  
let main_actu_text = document.createElement('p')
  main_actu_text.innerHTML = actus[0].desc
  
main_actu_cover_c.appendChild(main_actu_cover)
main_actu.appendChild(main_actu_cover_c)
main_actu.appendChild(main_actu_title)
main_actu.appendChild(main_actu_text)
document.querySelector('#actus-wrapper').appendChild(main_actu)

// ================================================================= { ACTU-2 } 

let sec_actu = document.createElement('div')
  sec_actu.className = 'actu-2nd'

let sec_actu_cover_c = document.createElement('div')
  sec_actu_cover_c.className = 'actu-2nd__cover-container'

let sec_actu_cover = document.createElement('img')
  sec_actu_cover.src = actus[1].cover_path
  
let sec_actu_title = document.createElement('h2')  
  sec_actu_title.innerHTML = actus[1].name
  
let sec_actu_text = document.createElement('p')
  sec_actu_text.innerHTML = actus[1].desc
  
sec_actu_cover_c.appendChild(sec_actu_cover)
sec_actu.appendChild(sec_actu_cover_c)
sec_actu.appendChild(sec_actu_title)
sec_actu.appendChild(sec_actu_text)
document.querySelector('#actus-wrapper').appendChild(sec_actu)

// ================================================================= { ACTU-3 } 

let third_actu = document.createElement('div')
  third_actu.className = 'actu-3rd'

let third_actu_cover_c = document.createElement('div')
  third_actu_cover_c.className = 'actu-3rd__cover-container'

let third_actu_cover = document.createElement('img')
  third_actu_cover.src = actus[2].cover_path
  
let third_actu_title = document.createElement('h2')  
  third_actu_title.innerHTML = actus[2].name
  
let third_actu_text = document.createElement('p')
  third_actu_text.innerHTML = actus[2].desc

third_actu_cover_c.appendChild(third_actu_cover)
third_actu.appendChild(third_actu_cover_c)
third_actu.appendChild(third_actu_title)
third_actu.appendChild(third_actu_text)
document.querySelector('#actus-wrapper').appendChild(third_actu)