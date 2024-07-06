let today = new Date() 
let month = `${today.getMonth() + 1}`.padStart(2, "0")
let day = `${today.getDate()}`.padStart(2, "0")
let date = `${today.getFullYear()}-${month}-${day}`
document.querySelector("#date").value = date

function getDate(dayString) {
  
  let today = new Date()
  if(dayString) today = new Date(dayString)
  return new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate(), 3, 0, 0))
  
}

let url = new URLSearchParams(window.location.search)
let version = url.get('version') ? url.get('version').split('.') : ['2', '1', '9']
url.get('version') ? document.querySelector('#version').innerHTML = url.get('version') : null

let jsonURL = window.location.origin + `/api/amnesis/chars/${version[0]}/${version[1]}/${version[2]}`
let assigned = JSON.parse(get(jsonURL))

function LtoA(date, text) {
  let key = genKey(date, assigned.length)
  
  res = ""
  for(let char of text) {

    let delta = Math.floor(text.length**2 / 8)
    let index = char.charCodeAt(0) + key + delta
    res += assigned[index]
  }

  return res
}

function AtoL(date, text) {
  let key = genKey(date, assigned.length)
  
  res = ""
  for(let char of text) {

    let delta = Math.floor(text.length**2 / 8)
    let codePoint = assigned.indexOf(char) - key - delta
    res += String.fromCharCode(codePoint)
  }

  return res
}

function display(element) {
  let date = getDate(document.querySelector('#date').value)
  if(element.id == "input") document.querySelector('#output').value = LtoA(date, element.value)
  if(element.id == "output") document.querySelector('#input').value = AtoL(date, element.value)
}

document.querySelector('#input').addEventListener('input', (e) => {
  display(e.target)
})

document.querySelector('#output').addEventListener('input', (e) => {
  display(e.target)
})

document.querySelector('#date').addEventListener('input', (e) => {
  display(document.querySelector('#input'))
})