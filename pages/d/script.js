function add(object) {
  
  let totalPrice = object.rawPrice
  let details = `<table><tr><td>${object.desc}</td></tr>`
  let prices = `<table><tr><td>${object.rawPrice}€</td></tr>`
  
  for(let option of object.options) {
    if(option[1]) totalPrice += option[1]
    let add = option[1] && option[1] !== 0 ? `+ ${option[1]}€` : "-"
    details += `<tr><td>      ${option[0]}</td></tr>` 
    prices += `<tr><td>${add}</td></tr>` 
  }

  details += "</table>"
  prices += "</table>"
  
  document.querySelector('#devis-content').innerHTML += `
  <tr>
    <td style="text-align: center">${object.n}</td>
    <td>${details}</td>
    <td>${prices}</td>
    <td style="text-align: center">${totalPrice}€</td>
  </tr>
  `
}

add({
  desc: "Animation de présentation",
  options: [
    ["Format GIF"],
    ["durée de 5 secondes", 5]
  ],
  n: 1,
  rawPrice: 150
})

add({
  desc: "Design de Logo",
  options: [
    ["Logo Typographique"],
    ["couleurs OLED", 5],
    ["style minimaliste"],
    ["animation professionnelle", 10]
  ],
  n: 1,
  rawPrice: 50
})

document.querySelector('#devis-date').innerHTML = new Date().toLocaleDateString("fr")