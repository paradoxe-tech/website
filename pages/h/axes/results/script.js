function displayAll(code) {
  let choices = parse(code)
  console.log(choices)
  document.querySelector('#code').innerHTML = code
  let string = ""

  for(let c=0; c < choices.length; c++) {
    let choice = choices[c]
    if(choice == 0) continue
    let axis = values[c]
    
    string += `<span class="tag">${axis[choice - 1].nom}</span>`
  }

  document.querySelector('#results').innerHTML = string
}

if(url.has('code')) {
  displayAll(url.get("code"))
}