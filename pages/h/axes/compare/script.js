function compare(code1, code2) {
  let set1 = parse(code1)
  let set2 = parse(code2)

  let smallerSet = set1
  let largerSet = set2
  let sameness = 0

  if(set1.length > set2.length) {
    smallerSet = set2
    largerSet = set1
  }

  let string = ""

  for(let i=0; i < smallerSet.length; i++) {
    let axis = values[i]
    if(smallerSet[i] == largerSet[i]) sameness++
    
    string += `<div class="space-btwn">`
    if(smallerSet[i] == 0) {
      string += `<span class="tag">pas de position</span>`
    } else string += `<span class="tag">${axis[smallerSet[i] - 1].nom}</span>`

    if(largerSet[i] == 0) {
      string += `<span class="tag">pas de position</span>`
    } else string += `<span class="tag">${axis[largerSet[i] - 1].nom}</span>`

  string += "</div>"
    
  }

  if(document.querySelector('#compare')) {
    document.querySelector('#compare').innerHTML = string
    document.querySelector('#code1').innerHTML = code1
    document.querySelector('#code2').innerHTML = code2
    document.querySelector('#perc').innerHTML = ((sameness / smallerSet.length) * 100).toFixed(2)
    document.querySelector('#n').innerHTML = smallerSet.length
  }

  return sameness
}

if(url.has('A') && url.has('B')) {
  compare(url.get("A"), url.get("B"))
}

let codes = {}
function setCMP(pos) {
  let code = prompt("Saisissez un code")
  codes[pos] = code
  document.querySelector('#code' + (pos+1)).innerHTML = code

  if(codes[0] && codes[1]) compare(codes[0], codes[1])
}