function main() {
  
  for (var k =0; k < 6; k++) {
  
    let element = projects[k]
      
    let project = document.createElement('div')
      project.className = 'project'
  
    let cover_c = document.createElement('div')
      cover_c.className = 'project__cover-container'
      if(element.site_path) cover_c.onclick = () => { 
        if(element.site_path === "404") return
        document.location.href = element.site_path.replaceAll('__SITE__', site_URL + "p/")
      }
  
    let cover = document.createElement('img')
      cover.src = element.cover_path.replace('__SITE__', "../")
      cover.className = 'project__cover'
      if(element.site_path === "404") cover_c.style.cursor = 'auto'
    
    let title = document.createElement('h2')
      title.innerHTML = element.name
      title.className = 'project__title'
    
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
  
  // ================================================================= { HIGHLIGHT } 
  
  styleDesc()
  
  doActus(actus, '', '../')
  
  // ================================================================= { SERVICES } 
  
  for (var k =0; k < services.length; k++) {
  
    let element = services[k]
      
    let service = document.createElement('div')
      service.className = 'service'
  
    let service_icon = document.createElement('ion-icon')
      service_icon.name = element.icon + "-outline"
      service_icon.className = 'service__icon'
  
    let service_title = document.createElement('h3')
      service_title.innerHTML = element.name
      service_title.className = 'service__title'
    
    let service_desc = document.createElement('p')
      service_desc.innerHTML = element.desc
      service_desc.className = 'service__text'
  
    service.appendChild(service_icon)
    service.appendChild(service_title)
    service.appendChild(service_desc)
    document.querySelector('#services-wrapper').appendChild(service)
    
  }

  Array.prototype.withIndexes = function(indexes) {
    res = []

    for(const index of indexes) {
      res.push(this[index])
    }

    res.sort()

    return res
  }

  /*/ ================================================================= { COMPETENCES } 
  
    function addComp(list) {
      let main_comp = document.createElement('div')
        main_comp.className = 'competence'
    
      for (const _comp of list) {
        let comp = document.createElement('p')
          comp.id = `comp__${_comp.name.split(' ')[0].toLowerCase()}`
        main_comp.appendChild(comp)
      }
      document.querySelector('#competences-wrapper').appendChild(main_comp)
    }

  addComp(competences.withIndexes([0,1,2]))
  addComp(competences.withIndexes([3,4,5,6]))
  addComp(competences.withIndexes([0,1,2]))
  
  for (const _comp of competences) {
    doStat(`#comp__${_comp.name.split(' ')[0].toLowerCase()}`, _comp.value, _comp.type, `${_comp.name} `, ` 99%`)
  }
*/  
}