const queryString = window.location.search
const url = new URLSearchParams(queryString)

let CONFIG = {
  ENTITIES: url.has('ent'),
  TEMPLATE: url.has('template'),
  WIDTH: url.has('size') ? parseInt(url.get('size')) : 40,
  HEIGHT: url.has('size') ? parseInt(url.get('size')) : 40,
  DELTA: url.has('delta') ? parseInt(url.get('delta')) : 10,
  BORDERS: url.has('no_grid') ? false : true,
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

if(CONFIG.BORDERS) {
  document.querySelectorAll('table td').forEach(el => el.style.border = "0.5px solid white")
}

/*
let c1 = undefined;

if (CONFIG.ENTITIES) {
  let coords = url.get('ent').replace('(', '').replace(')', '').split(',')
  c1 = new Entity(UNI, parseInt(coords[0]), parseInt(coords[1]))
} else if (CONFIG.TEMPLATE && automatons[url.get('template')] && automatons[url.get('template')].entities) {
  let coords = automatons[url.get('template')].entities.spawn.replace('(', '').replace(')', '').split(',')
  c1 = new Entity(UNI, parseInt(coords[0]), parseInt(coords[1]))
}
*/

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
  UNI.refresh()
}

function reset() {
  UNI.running = false
  UNI.bigbang()
  UNI.refresh()
  UNI.updateMetrics()
  document.querySelector('#player').name = "play"
}

function displayRules(rules=RULES) {
  let container = document.querySelector('#rules')
  container.innerHTML = ""

  if(rules.matrix !== false) {
    let neibm = ""
      let squared = false

      if(sameMatrix(NEWMAN, rules.matrix)) neibm = "de Von Neumann"
      else if(sameMatrix(MOORE, rules.matrix)) neibm = "de Moore"
      else {
        neibm = drawMatrix(rules.matrix)
        if(this.matrix.length > 1) squared = true
      }

      container.innerHTML += `<div class="rule">VOISINAGE   
     <val class="${squared ? "squared" : ""}">${neibm}</val> UTILISÉ</div>`
  }

  if(rules.type == "QN") {
    container.innerHTML += `<div class="rule">AUTOMATE <val>continu dans ℕ</val></div>`
  }
  
  for(let rule of rules.verbatim) {
    container.innerHTML += `<div class="rule">SI <cond>${rule.condition}</cond> ALORS <res>${rule.result}</res></div>`
  }
}

function template(name) {
  if(name == "custom") return startCustomBuild()
  
  let RULES = new Rules(UNI)
  
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
    
  } else {
    if(!TEMPLATES[name]) return alert("Template inconnu !")
    
    template = TEMPLATES[name].rules(RULES)
    RULES.type = TEMPLATES[name].type ? TEMPLATES[name].type : "QL"
    RULES.matrix = TEMPLATES[name].voisinage ? TEMPLATES[name].voisinage : false
  }

  if(RULES.type == "QN") addition()
  
  for(let rule of template) {
    RULES.new(
      rule.condition,
      rule.result
    )
  }

  document.querySelector('#rules-buttons').innerHTML = ""
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
cherrypick()

const canvas = document.querySelector('canvas')
canvas.addEventListener('mousedown', (event) => {
  const rect = canvas.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top

  let size = 480 / UNI.width
  let cx = Math.floor(x / size)
  let cy = Math.floor(y / size)
  
  UNI.click(cx, cy, CLICK_TYPE)
})

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