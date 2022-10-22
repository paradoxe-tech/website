function get(yourUrl) {
  var Httpreq = new XMLHttpRequest()
  Httpreq.open("GET", yourUrl, false)
  Httpreq.send(null)
  return Httpreq.responseText
}

const site_URL = "https://callmekitsu.com/cdn/"
const projects = JSON.parse(get(site_URL + "data/projets.json"))

document.onmousemove = (event) => {

  event = event || window.event;
  if (event.pageX == null && event.clientX != null) {
    eventDoc = (event.target && event.target.ownerDocument) || document;
    doc = eventDoc.documentElement;
    body = eventDoc.body;

    event.pageX = event.clientX +
      (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
      (doc && doc.clientLeft || body && body.clientLeft || 0);
    event.pageY = event.clientY +
      (doc && doc.scrollTop || body && body.scrollTop || 0) -
      (doc && doc.clientTop || body && body.clientTop || 0);
  }

  let x = event.pageX
  let y = event.pageY

  document.querySelector('#w1').style.left = `-${15 + (x / 100)}%`
  document.querySelector('#w2').style.right = `${-25 + (x / 100)}%`
  document.querySelector('#w1').style.top = `-${10 + (y / 100)}vh`
  document.querySelector('#w2').style.top = `-${10 + (y / 100)}vh`
}

document.onscroll = (event) => {

  let el = document.querySelector('#main-logo')
  let height = window.getComputedStyle(el).height
  let top = el.offsetTop
  let max = parseInt(height.split('px')[0]) + top
  
  if(window.scrollY >= 100) {
    document.querySelector('#resume').style.top = `${max}px`
    
  } if(window.scrollY == 0) {
    document.querySelector('#resume').style.top = `120vh`
  }
}

function main() {
  
  new TypingMachine(document.querySelector('#changing-title'))
  
  for (var k =0; k < 6; k++) {
  
    let element = projects[k]
      
    let project = document.createElement('div')
      project.className = 'project'
  
    let cover_c = document.createElement('div')
      if(element.site_path) cover_c.onclick = () => { 
        if(element.site_path === "404") return
        document.location.href = element.site_path.replaceAll('__SITE__', site_URL + "p/")
      }
  
    let cover = document.createElement('img')
      cover.src = element.cover_path.replace('__SITE__', "../")
      if(element.site_path === "404") cover_c.style.cursor = 'auto'
    
    let title = document.createElement('h2')
      title.innerHTML = element.name
    
    let desc = document.createElement('p')
      desc.innerHTML = md(element.desc)
  
    cover_c.appendChild(cover)
    project.appendChild(cover_c)
    project.appendChild(title)
    project.appendChild(desc)
    document.querySelector('#projects').appendChild(project)
    
  }
}