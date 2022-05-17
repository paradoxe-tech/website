function makeMenu() {
  const menu = document.querySelector('.menu')
  const hamburger = document.querySelector('#hamburger')
  const loupe = document.querySelector('#loupe')
  const recherche = document.querySelector('#recherche')
  
  hamburger.addEventListener("click", () => {
    menu.classList.toggle("open");
    updateHamburger()
  });
  
  loupe.addEventListener("click", () => {
    menu.classList.toggle("open");
    recherche.focus()
  });

  window.addEventListener('keydown', (e) => {
    if(!e) e = event;

    if(e.ctrlKey && e.keyCode === 75) {
      menu.classList.toggle("open");
      recherche.focus()
    }
  })

  handleLoader()
}

function handleLoader() {

  console.log('The loader handler is now fixed.')
  
  document.querySelector('#loader').onerror = function () {
    console.log("A loader error has been detected. The loader is now reset ;")
    document.querySelector('#loader').outerHTML = `<div> <object id="loader" type="text/html" data="https://callmekitsu.kitsuforyou.repl.co/home.html" style="height: 100vh;width: 100%;overflow:auto;"><h1>Erreur de chargement de la page.</h1><pink><h4>Actualisez pour continuer votre navigation !</h4></pink><br>Cette page n'existe peut-être pas.<br>Elle peut aussi être en développement,<br>ou subir une maintenance temporaire.<br><br>CopyRight (c) CallMeKitsu. 2021-2022</object></div>`
    document.querySelector('title').innerHTML = `CMK. | Accueil`
    handleLoader()
  }
}

function trySearch(ele) {
  if(event.keyCode === 13) {
    getPage( site_URL + recherche.value, recherche.value )
    recherche.value = ''
    
  }
}

function updateHamburger() {
  if (menu.classList.contains("open")) {
    hamburger.classList.replace("bx-menu", "bx-menu-alt-right");
  } else {
    hamburger.classList.replace("bx-menu-alt-right", "bx-menu");
  }
}

function getPage(link, title) {
  console.log(`trying to reach url : ${link}`)
  document.querySelector('#loader').setAttribute("data", link)
  if(title) document.querySelector('title').innerHTML = `CMK. | ${title}`
  handleLoader()
}

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
      cover.src = element.cover_path.replace('__SITE__', "")
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
  
  doActus(actus, '', '')
  
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

// ================================================================= { MOBILE-HANDLER } 

if(isMobile()) location.href = "https://callmekitsu.kitsuforyou.repl.co/mobile.html"
function isMobile() {
  var isMobile = false;
  if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) { 
    isMobile = true;
  }

  return isMobile
}

function md(text, truncate) {
  
  res = text

  if(text.match(/\[(.*?)\]\((.*?)\)/g)) {
    for (const e of text.match(/\[(.*?)\]\((.*?)\)/g)) {
      let desc = e.match(/\[(.*?)\]/g)[0].replace(']', '').replace('[', '')
      let link = e.match(/\((.*?)\)/g)[0].replace('(', '').replace(')', '')
      res = res.replace(e, `<a style='color: #0ff;' href="${link}">${desc}</a>`)
    }
  }

  if( text.match(/\{(.*?)\}\((.*?)\)/g) ) {
    for (const e of text.match(/\{(.*?)\}\((.*?)\)/g)) {
      let txt = e.match(/\{(.*?)\}/g)[0].replace('}', '').replace('{', '')
      let tip = e.match(/\((.*?)\)/g)[0].replace('(', '').replace(')', '')
      res = res.replace(e, `<cyan><a title="${tip.replace("'", "\'").replace('"', '\"')}" style='color: white;cursor: help;'>${txt}</a></cyan>`)
    }
  }
  
  if(text.match(/(p\/)[^\s]+/g)) {
    for (const e of text.match(/(p\/)[^\s]+/g)) {
      let name = e.replace('p/', '')
      res = res.replace(e, `<pink><a style='color: #f0f;' href="${site_URL}/${e}/">${e}</a></pink>`)
    }
  }

  if(text.match(/(h\/)[^\s]+/g)) {
    for (const e of text.match(/(h\/)[^\s]+/g)) {
      let name = e.replace('h/', '')
      res = res.replace(e, `<pink><a style='color: #f0f;' href="${site_URL}/${e}/">${e}</a></pink>`)
    }
  }

  if(text.match(/\s#[^\s]+/g)) {
    for (const e of text.match(/\s#[^\s]+/g)) {
      res = res.replace(e, ``)
    }
  }

  if(truncate) {
    if (res.length >= (truncate -3)) {
      res = res.slice(0, truncate - 3) + '...'
    }
    
  }

  return res
  
}

function doStat(selector, stat, color, start, end) {
  document.querySelector(selector).innerHTML = start + "<grey>▱</grey><grey>▱</grey><grey>▱</grey><grey>▱</grey><grey>▱</grey><grey>▱</grey><grey>▱</grey><grey>▱</grey><grey>▱</grey><grey>▱</grey>" + end;
    
  (function myLoop(i) {
    setTimeout(function() {
      document.querySelector(selector).innerHTML = document.querySelector(selector).innerHTML.replace('<grey>▱</grey>', `<${color}>▰</${color}>`)
      if (--i) myLoop(i)
    }, 200)
  })(stat);
  
}

function pjFind(list, words) {
  res = []
  for (var w of words) {
    w = w.toLowerCase()
    for (var p of list) {
      if(p.name.toLowerCase().includes(w) || p.desc.toLowerCase().includes(w)) res.push(p)
    }
  }

  return res
}

function doActus(list, theme, modifier) {
    // ================================================================= { ACTU-1 } 
  let actus = pjFind(list, [theme])
  
  if(!actus[0]) return 
  
  let main_actu = document.createElement('div')
    main_actu.className = 'actu-main'
  
  let main_actu_cover_c = document.createElement('div')
    main_actu_cover_c.className = 'actu-main__cover-container'
  
  let main_actu_cover = document.createElement('img')
    main_actu_cover.src = actus[0].cover_path.replace('__SITE__', modifier)
  
  let main_actu_sub = document.createElement('h4')  
    main_actu_sub.innerHTML = actus[0].sub
    
  let main_actu_title = document.createElement('h2')  
    main_actu_title.innerHTML = actus[0].name
    
  let main_actu_text = document.createElement('p')
    main_actu_text.innerHTML = md(actus[0].desc)
    
  main_actu_cover_c.appendChild(main_actu_cover)
  main_actu.appendChild(main_actu_cover_c)
  main_actu.appendChild(main_actu_title)
  main_actu.appendChild(main_actu_text)
  //main_actu.appendChild(main_actu_sub)
  document.querySelector('#actus-wrapper').appendChild(main_actu)

  
  // ================================================================= { ACTU-2 } 
  if(!actus[1]) return 
  let sec_actu = document.createElement('div')
    sec_actu.className = 'actu-2nd'
  
  let sec_actu_cover_c = document.createElement('div')
    sec_actu_cover_c.className = 'actu-2nd__cover-container'
  
  let sec_actu_cover = document.createElement('img')
    sec_actu_cover.src = modifier + actus[1].cover_path
    
  let sec_actu_title = document.createElement('h2')  
    sec_actu_title.innerHTML = md(actus[1].name, 14)
    
  let sec_actu_text = document.createElement('p')
    sec_actu_text.innerHTML = md(actus[1].desc)
    
  sec_actu_cover_c.appendChild(sec_actu_cover)
  sec_actu.appendChild(sec_actu_cover_c)
  sec_actu.appendChild(sec_actu_title)
  sec_actu.appendChild(sec_actu_text)
  document.querySelector('#actus-wrapper').appendChild(sec_actu)

  
  // ================================================================= { ACTU-3 } 
  
  if(!actus[2]) return 
  
  let third_actu = document.createElement('div')
    third_actu.className = 'actu-3rd'
  
  let third_actu_cover_c = document.createElement('div')
    third_actu_cover_c.className = 'actu-3rd__cover-container'
  
  let third_actu_cover = document.createElement('img')
    third_actu_cover.src = modifier + actus[2].cover_path
    
  let third_actu_title = document.createElement('h2')  
    third_actu_title.innerHTML = md(actus[2].name, 14)
    
  let third_actu_text = document.createElement('p')
    third_actu_text.innerHTML = md(actus[2].desc, 120)
  
  third_actu_cover_c.appendChild(third_actu_cover)
  third_actu.appendChild(third_actu_cover_c)
  third_actu.appendChild(third_actu_title)
  third_actu.appendChild(third_actu_text)
  document.querySelector('#actus-wrapper').appendChild(third_actu)

}

function styleDesc() {

  let actual_banner = banners[Math.floor(Math.random() * banners.length)]
  document.body.style.setProperty("--var-url-banner", `url(${actual_banner})`)
  
  let i = 0

  setInterval( () => {
    document.querySelector("body > div.banner > div > p").innerHTML = document.querySelector("body > div.banner > div > p").innerHTML.replace('<pink>', ``).replace('</pink>', ``)
    document.querySelector("body > div.banner > div > p").innerHTML = document.querySelector("body > div.banner > div > p").innerHTML.replace(subtitles[i], `<pink>${subtitles[i]}</pink>`)
    i += 1
    if(i === subtitles.length) i = 0
  },1000)
  
}