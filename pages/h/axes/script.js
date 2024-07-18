let values = JSON.parse(get(`${window.location.origin}/h/axes/questions.json`))
let I = -1
let REPONSE = []

function next() {
  if(I + 1 > values.length - 1) {
    document.querySelector('#question').innerHTML = "Fini pour aujourd'hui ! Partagez votre code."
    return
  }
  
  I++
  
  let string = ""
  let options = values[I]
  for(let value=1; value <= options.length; value ++) {
    
    string += `<div>
      <button 
      onclick="answer(I, ${value});next()"
      >${options[value-1].nom}</button>
      <span>${options[value-1].desc}</span>
    </div>`

  }

  string += `<div>
    <button 
    onclick="answer(I, 0);next()"
    >je ne me positionne pas</button>
    <span>ou mon avis n'est pas suffisament réfléchi</span>
  </div>`
  
  document.querySelector('#question').innerHTML = string
}

function answer(i, n) {
  REPONSE[i] = n
  let resultats = code(Object.values(REPONSE))
  document.querySelector('#code').innerHTML = resultats
  window.location.hash = `code=${resultats}`
}

function parse(code, base=36) {
  let hex = code.split("-")[0]
  let n = parseInt(code.split('-')[1], base)
  let num = parseInt(hex, base)
  let bin = num.toString(2).padStart(bits(n), '0')
  
  let i = 0;
  let res = []
  
  for(let choice of values) {
    let length = (choice.length).toString(2).length
    let sub = bin.substring(bin.length - i - length, bin.length - i)
    
    if(!isNaN(parseInt(sub, 2))) {
      res.push(parseInt(sub, 2))
    } else break


    
    i += length
  }

  return res
}

function code(choices, base=36) {
  let binString = ""

  for(let c=0; c < choices.length; c++) {
    let choice = choices[c]
    let axis = values[c]
    
    let length = (axis.length).toString(2).length
    let bin = (choice).toString(2).padStart(length, "0")
    binString = bin + binString
  }

  let hex = parseInt(binString, 2).toString(base).toUpperCase()
  let n = choices.length.toString(base).toUpperCase()
  
  return hex + "-" + n
}

function bits(n) {
  let cpt = 0
  let i = 0
  for(let choice of values) {
    i++
    cpt += (choice.length).toString(2).length
    if(i == n) break
  }
  return cpt
}

function startFrom(code, base=36) {
  REPONSE = parse(code, base)
  I = REPONSE.length - 1
  document.querySelector('#code').innerHTML = code
  next()
}

let url = new URLSearchParams(window.location.hash.split('#')[1])
if(url.has('code')) {
  startFrom(url.get("code"))
}

function selectCode(callback) {
  let code = prompt('Saisissez un code')
  callback(code)
}