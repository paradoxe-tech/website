function dropChoiceCondition() {
  return `<select class="val" onchange="evaluateSelect('cond', this)">
    <option selected="selected" disabled>CONDITION</option>
    <option value="state">état</option>
    <option value="voisinage">voisinage</option>
    <option value="operator">opérateur logique</option>
    <option value="always">rien de spécial</option>
    <option value="matrix">matrice</option>
  </select>`
}

function dropChoiceResult() {
  return `<select class="val" onchange="evaluateSelect('res', this)">
    <option selected="selected" disabled>RESULTAT</option>
    <option value="set">définir l'état</option>
    <option value="distrib">distribue</option>
    <option value="clone">clone</option>
  </select>`
}

function dropChoiceOperators() {
  return `<select class="val">
    <option>=</option>
    <option>></option>
    <option><</option>
    <option>>=</option>
    <option><=</option>
    <option disabled>%</option>
  </select>`
}

function dropChoiceGates() {
  return `<select class="inbubble">
    <option value="OU">OU</option>
    <option value="ET">ET</option>
  </select>`
}

function newCustomRule() {
  let container = $('#rules')
  let buttons = $('.new-rule-btns')
  
  let wrapper = document.createElement('div')
  wrapper.className = "rule-wrapper"
  wrapper.innerHTML += htmlRule(`<div class="rule">SI <cond>${dropChoiceCondition()}</cond> ALORS <res>${dropChoiceResult()}</res>
    </div>`)
  
  container.insertBefore(wrapper, buttons)
}

function setCustomMatrix() {
  let container = $('#rules')
  let buttons = $('.new-rule-btns')

  let wrapper = document.createElement('div')
  wrapper.className = "rule-wrapper"
  wrapper.innerHTML += htmlRule(`<div class="rule">
      VOISINAGE <cond><select class="val" onchange="evaluateSelect('matrix', this)">
    <option selected="selected" disabled>VOISINAGE</option>
    <option value="moore">de Moore</option>
    <option value="neumann">de Von Neumann</option>
    <option value="matrix">personalisé</option>
  </select></cond> UTILISÉ</res>
    </div>`)

  container.insertBefore(wrapper, buttons)
}

function htmlRule(body) {
  return `${body}
    <ion-icon name="trash" onclick="deleteRule(this.parentNode)" 
      class="edit-btn"></ion-icon>
    <ion-icon name="save" onclick="saveNewRule(this.parentNode)" 
      class="edit-btn"></ion-icon>`
}

function evaluateSelect(table, element) {
  let value = element.options[element.selectedIndex].value
  tableSwitches[table][value](element.parentNode)
}

let tableSwitches = {
  cond: {
    state: (el) => {
      el.innerHTML = `<val>état ${dropChoiceOperators()} <input type="number"></val>`
    },
    voisinage: (el) => {
      el.innerHTML = `<val>voisines ${dropChoiceOperators()} <input type="number"></val>`
    },
    operator: (el) => {
      el.innerHTML = `<op><cond>${dropChoiceCondition()}</cond> ${dropChoiceGates()} <cond>${dropChoiceCondition()}</cond>`
    },
    always: (el) => {
      el.innerHTML = `<val>rien de spécial</val>`
    },
    matrix: (el) => {
      el.innerHTML = `<val class="squared">${customizableMatrix()}</val>`
    }
  },
  res: {
    set: (el) => {
      el.innerHTML = `<val>état = <input type="number"></val>`
    },
    distrib: (el) => {
      el.innerHTML = `<val>distribue</val> SUR <val class="squared">${customizableMatrix()}</val>`
    },
    clone: (el) => {
      el.innerHTML = `<val>clone</val> SUR <val class="squared">${customizableMatrix()}</val>`
    }
  },
  matrix: {
    neumann: (el) => {
      el.innerHTML = `<val class="squared">${drawMatrix(NEWMAN, true)}</val>`
    },
    moore: (el) => {
      el.innerHTML = `<val class="squared">${drawMatrix(MOORE, true)}</val>`
    },
    matrix: (el) => {
      el.innerHTML = `<val class="squared">${customizableMatrix()}</val>`
    }
  }
}

function customizableMatrix() {
  return drawMatrix([[0,0,0],[0,0,0],[0,0,0]], true)
}

function switchCustomMatrix(x, y, el) {
  let table = el.parentNode.parentNode.parentNode
  
  el.classList.toggle("black")
  el.classList.toggle("white")
  
  let matrix = parseMatrix(table.getAttribute("data"))
  if(matrix[y][x] == 0) matrix[y][x] = 1
  else if(matrix[y][x] == 1) matrix[y][x] = 0

  table.setAttribute("data", stringifyMatrix(matrix))
}

function parseMatrix(string) {
  let matrix = []
  string = string.substring(1, string.length - 1)
  let cache = []
  for(let char of string) {
    if(char == "[" || char == ",") continue
    if(char == "]") {
      matrix.push(cache)
      cache = []
    }
    else cache.push(+(char))
  }

  return matrix
}

function stringifyMatrix(matrix) {
  let res = "["
  for(let arr of matrix) {
    res += `[${arr.join(',')}]`
  }
  return res + ']'
}

function saveNewRule(container) {

  for(let input of container.querySelectorAll('input')) {
    if(!input.value) return false
    input.outerHTML = input.value
  }

  for(let select of container.querySelectorAll('select')) {
    let value = select.options[select.selectedIndex].value
    if(!value || value == "CONDITION") return false
    if(value == "MATRICE" || value == "RESULTAT") return false
    
    select.outerHTML = select.options[select.selectedIndex].value
  }
  
  container.querySelectorAll('table').forEach(t => t.classList.add('uneditable'))

  container.querySelector('ion-icon[name="save"]').remove()

  return true
}

function htmlToRule(htmlRule, RULES) {
  let cond = htmlRule.querySelector('cond')
  let res = htmlRule.querySelector('res')

  let condFunc = buildCondFunc(cond, RULES)
  let resFunc = buildResFunc(res, RULES)
  
  return {
    condition: condFunc,
    result: resFunc
  }
}

function parseRules() {
  let RULES = new Rules(UNI)
  
  for(let rule of document.querySelectorAll('.rule')) {
    if(rule.innerHTML.includes('VOISINAGE')) {
      RULES.matrix = parseMatrix(rule.querySelector('table').getAttribute('data'))
      continue
    } else if(rule.innerHTML.includes('TYPE')) {
      if(rule.innerHTML.includes('continu')) RULES.type = "QN"
      else RULES.type = "QL"
    }
    let builtRule = htmlToRule(rule, RULES)
    RULES.new(builtRule.condition, builtRule.result)
  }

  

  return RULES
}

function buildCondFunc(html, RULES) {
  let text = decodeEntities(html.innerHTML)
  if(text.includes('ET')) {
    return RULES.and(
      buildCondFunc(html.querySelectorAll("val")[0], RULES),
      buildCondFunc(html.querySelectorAll("val")[1], RULES)
    )
  }
  if(text.includes('OU')) {
    return RULES.or(
      buildCondFunc(html.querySelectorAll("val")[0], RULES),
      buildCondFunc(html.querySelectorAll("val")[1], RULES)
    )
  }

  if(text.includes('rien de spécial')) {
    return RULES.default()
  }
  
  if(text.includes('état')) {
    let operator = text.split(' ')[1].split(' ')[0]
    let value = +(text.split(operator + ' ')[1])
    return RULES.status(operator, value)
  } 
  
  if(text.includes('voisines')) {
    let operator = text.split(' ')[1].split(' ')[0]
    let value = +(text.split(operator + ' ')[1])
    return RULES.neighbours(operator, value)
  }

  if(text.includes('table')) {
    return RULES.filter(parseMatrix(html.querySelector('table').getAttribute('data')))
  }
}

function buildResFunc(html, RULES) {
  let text = decodeEntities(html.innerHTML)

  if(text.includes('état')) {
    let value = +(text.split('= ')[1])
    return RULES.set(value)
  } 

  if(text.includes('distribue')) {
    return RULES.distrib(parseMatrix(html.querySelector('table').getAttribute('data')))
  }

  if(text.includes('clone')) {
    return RULES.clone(parseMatrix(html.querySelector('table').getAttribute('data')))
  }
}

// https://stackoverflow.com/questions/5796718/html-entity-decode
var decodeEntities = (function() {
  var element = document.createElement('div');

  function decodeHTMLEntities (str) {
    if(str && typeof str === 'string') {
      str = str.replace(/<script[^>]*>([\S\s]*?)<\/script>/gmi, '');
      str = str.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gmi, '');
      element.innerHTML = str;
      str = element.textContent;
      element.textContent = '';
    }

    return str;
  }

  return decodeHTMLEntities;
})();

function playCustom() {
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

  alert("Jeu de règles chargé !")
}

function toggleEditingMode() {
  $('#universe').classList.toggle('hidden')
  $('#side-panel').classList.toggle('deployed')
}

function deleteRule(ruleElement) {
  if(confirm('Voulez vous vraiment supprimer cette règle ?')) {
    ruleElement.remove()
  }
}