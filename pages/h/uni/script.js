const queryString = window.location.search
const url = new URLSearchParams(queryString)

const $ = (selector) => document.querySelector(selector)

let cnvDims = document.querySelector('#universe canvas').getBoundingClientRect()

let CONFIG = {
  ENTITIES: url.has('ent'),
  TEMPLATE: url.has('template'),
  WIDTH: url.has('size') ? parseInt(url.get('size')) : Math.floor(cnvDims.width / 10),
  HEIGHT: url.has('size') ? parseInt(url.get('size')) : Math.floor(cnvDims.width / 10),
  DELTA: url.has('delta') ? parseInt(url.get('delta')) : 10,
  GENERATIONS: url.has('G') ? parseInt(url.get('G')) : 1000,
  STATE: 0,
  ALIVE: false,
}

let RULES = new Rules()

let UNI = new Universe({
  webpage: document,
  grid_selector: "#grid",
  width: CONFIG.WIDTH,
  height: CONFIG.HEIGHT,
  alive: CONFIG.ALIVE,
  maxGen: CONFIG.GENERATIONS,
  rules: RULES
})

let CLICK_TYPE = ""

function cherrypick() {
  CLICK_TYPE = "cherry"
  document.querySelector('#grid').style.cursor = "crosshair"
}

function addition() {
  CLICK_TYPE = "add"
  document.querySelector('#grid').style.cursor = "cell"
}

function removal() {
  CLICK_TYPE = "rem"
  document.querySelector('#grid').style.cursor = "not-allowed"
}

function play() {
  
  if(CONFIG.STATE % 2 == 0) {
    UNI.run(CONFIG.GENERATIONS, 10)
    
    document.querySelector('#player').name = "pause"
  } else {
    UNI.running = false
    document.querySelector('#player').name = "play"
  }

  CONFIG.STATE ++
}

function stop() {
  UNI.running = false
  UNI.bigbang()
  document.querySelector('#player').name = "play"
}

function next() {
  UNI.step()
}

function prev() {
  UNI.teleport(UNI.generation - 1)
  UNI.updateMetrics()
  UNI.draw()
}

function reset() {
  UNI.running = false
  UNI.bigbang()
  UNI.draw()
  UNI.updateMetrics()
  document.querySelector('#player').name = "play"
}

function displayRules(rules=RULES) {
  let container = document.querySelector('#rules')
  container.innerHTML = ""

  if(rules.matrix !== false) {
    let neibm = drawMatrix(rules.matrix)
    let squared = rules.matrix.length > 1

    container.innerHTML += `<div class="rule-wrapper">
        <div class="rule">VOISINAGE <val class="${squared ? "squared" : ""}">${neibm}</val> UTILISÉ</div>
        <ion-icon name="trash" onclick="deleteRule(this.parentNode)" class="edit-btn"></ion-icon>
      </div>`
  }

  if(rules.type == "QN") {
    container.innerHTML += `
    <div class="rule-wrapper">
      <div class="rule">AUTOMATE <val>continu dans ℕ</val></div>
      <ion-icon name="trash" onclick="deleteRule(this.parentNode)" class="edit-btn"></ion-icon>
    </div>`
  }
  
  for(let rule of rules.verbatim) {
    container.innerHTML += `<div class="rule-wrapper">
      <div class="rule">SI <cond>${rule.condition}</cond> ALORS <res>${rule.result}</res></div>
      <ion-icon name="trash" onclick="deleteRule(this.parentNode)" 
      class="edit-btn"></ion-icon>
    </div>`
  }

  container.innerHTML += `<div class="new-rule-btns">
    <ion-icon name="add-circle" class="new-rule-btn" onclick="newCustomRule()"></ion-icon>
    <ion-icon name="grid" onclick="setCustomMatrix()" class="new-rule-btn"></ion-icon>
    <ion-icon name="flag" onclick="playCustom()" class="new-rule-btn"></ion-icon>
  </div>`
}

function template(name) {
  
  let RULES = new Rules(UNI)

  if(name == "blank") {
    displayRules(RULES)

    stop()

    UNI = new Universe({
      webpage: document,
      grid_selector: "#grid",
      width: CONFIG.WIDTH,
      height: CONFIG.HEIGHT,
      alive: CONFIG.ALIVE,
      maxGen: CONFIG.GENERATIONS,
      rules: RULES
    })
    
    return
  }


  if(name == "upload") {
    loadFile(() => {
      RULES = parseRules()
      displayRules(RULES)
      
      stop()

      UNI = new Universe({
        webpage: document,
        grid_selector: "#grid",
        width: CONFIG.WIDTH,
        height: CONFIG.HEIGHT,
        alive: CONFIG.ALIVE,
        maxGen: CONFIG.GENERATIONS,
        rules: RULES
      })
    })
    

    return
  }
  
  let template = "_"
  
  if(name.startsWith("W")) {
    
    template = wolfram(+(name.replaceAll('W', '')), RULES)
    RULES.type = "QL"
    
  } else if(name.includes("/")) {

    let b = name.split('B')[1].split('/')[0].split('').map(x => +(x))
    let s = name.split('/S')[1].split('').map(x => +(x))

    template = conway(b, s, RULES)
    RULES.type = "QL"
    RULES.matrix = MOORE
    
  } else if(name.startsWith('marg')) {

    let tab = name.split("marg{")[1].split('}')[0].split(';')
    template = margolus(tab, RULES)
    RULES.type = "QL"
    
  } else if(TEMPLATES[name]) {
    
    template = TEMPLATES[name].rules(RULES)
    RULES.type = TEMPLATES[name].type ? TEMPLATES[name].type : "QL"
    RULES.matrix = TEMPLATES[name].voisinage ? TEMPLATES[name].voisinage : false
    
  } else return alert("Template inconnu !")

  if(RULES.type == "QN") addition()
  
  for(let rule of template) {
    RULES.new(
      rule.condition,
      rule.result
    )
  }
  
  displayRules(RULES)

  stop()
  
  UNI = new Universe({
    webpage: document,
    grid_selector: "#grid",
    width: CONFIG.WIDTH,
    height: CONFIG.HEIGHT,
    alive: CONFIG.ALIVE,
    maxGen: CONFIG.GENERATIONS,
    rules: RULES
  })
}

template('B3/S23')

function drawMatrix(matrix, clickable=false) {
  let res = `<table data="${stringifyMatrix(matrix)}">`
  if(matrix.length == 0) return 
  if(!matrix[0] || matrix[0].length == 0) return
  let onclick = ""
  

  for(let y=0; y < matrix.length; y++) {
    res += "<tr>"
    for(let x=0; x < matrix[0].length; x++) {
      if(clickable == true) onclick = `onclick="switchCustomMatrix(${x},${y}, this)"`
      res += `<td class="${matrix[y][x] > 0 ? "black" : "white"}"${onclick}></td>`
    }
    res += "</tr>"
  }

  return res + "</table>"
}

function sameMatrix(mA, mB) {
  if(mA.length !== mB.length) return false
  if(mA[0].length !== mB[0].length) return false
  
  for(let y=0; y < mA.length; y++) {
    for(let x=0; x < mA[0].length; x++) {
      if(mA[y][x] !== mB[y][x]) return false
    }
  }

  return true
}

function random() {
  for(let n=0; n < 20; n++) {
    let r1 = Math.floor(Math.random() * (UNI.width / 2))
    let r2 = Math.floor(Math.random() * (UNI.width / 2))
    let r3 = Math.floor(Math.random() * (UNI.width / 2))
    let r4 = Math.floor(Math.random() * (UNI.width / 2))

    if(UNI.rules.type == "QL") UNI.switchCell(r1+r3, r2+r4)
    else UNI.setCell(r1+r3, r2+r4, UNI.findCell(r1+r3, r2+r4) + 1)
    
  }

  UNI.draw()
  UNI.updateMetrics()
}

function togglePopup() {
  $("#popup-screen").classList.toggle('hidden')
  $("#popup").classList.toggle('hidden')
}

function downloadRuleSet() {
  let ruleset = Array.from(document.querySelectorAll('.rule')).map(e => e.outerHTML).join('')
  let blob = new Blob([ruleset], { type: "text/html;charset=utf-8" })
  _global.saveAs(blob, `Paradoxe_Uni_Ruleset-${Date.now()}.html`)
}

function loadFile(callback) {
  let fileuploader = document.querySelector('#fileuploader')
  fileuploader.click()

  fileuploader.addEventListener('change', () => {
    var file = fileuploader.files[0]
    if (!file) return alert('Aucun fichier importé.')
    let extension = file.name.split('.').pop()
    let accepted_ext = ['html']
    if (!accepted_ext.includes(extension)) return alert(`l\'extension de fichier n\'est pas reconnue.`)

    var fileReader = new FileReader()

    fileReader.onload = function(fileLoadedEvent) {
      $('#rules').innerHTML = fileLoadedEvent.target.result
      callback()
    }

    fileReader.readAsText(file, "UTF-8")

    
  })
}