function getForm() {
  let url = new URLSearchParams(window.location.search)
  if(!url.has('id')) return false
  
  return url.get('id')
}

function loadForm(id) {
  let form = JSON.parse(get(`${window.location.origin}/h/scithee/data/forms/${id}.json`))
  
  let stringHTML = ""
  let currentId = 0
  
  for(let card of form) {

    if(card.type !== "title" && card.type !== "text") currentId++
    card.id = currentId
    
    if(card.type == "title") {
      stringHTML += `<h1>${card.text}</h1>`
    }

    if(card.type == "YN") {
      stringHTML += `<div class="item">
      ${card.title ? `<h2>${card.title}</h2>` : ""}
      ${card.desc ? `<p>${card.desc}</p>` : ""}
      <div class="options">
         <button class="green option" onclick="set('${card.id}', true)">OUI</button>
         <button class="red option" onclick="set('${card.id}', false)">NON</button>
      </div></div>`
    }

    if(card.type == "RATE") {
      stringHTML += `<div class="item">
      ${card.title ? `<h2>${card.title}</h2>` : ""}
      ${card.desc ? `<p>${card.desc}</p>` : ""}
      <div class="options stars">`
     
      for(let n=1; n <= card.note; n++) {
          stringHTML += `<a id="item-n${card.id}-rate${n}" class="option" onclick="set('${card.id}', ${n})">☆</a>`
      }

      stringHTML += `</div></div>`
    }

    /*

    if(card.type == "QCM") {
      item += `<div class="options">`
      for(let option of card.options) {
        item += `<div class="option"><input type="checkbox"><span>${option}</span></div>`
      }
      item += `</div>`
    }

    */

    if(card.type == "QCU") {
      stringHTML += `<div class="item">
      ${card.title ? `<h2>${card.title}</h2>` : ""}
      ${card.desc ? `<p>${card.desc}</p>` : ""}
      <div class="options">`

      for(let option of card.options) {
        stringHTML += `<div class="option" onclick="set('${card.id}', ${card.options.indexOf(option)})">`
        stringHTML += `<span>${option}</span>`
        stringHTML += `</div>`
      }

      stringHTML += `</div></div>`
    }

    if(card.type == "DROP") {
      stringHTML += `<div class="item">
      ${card.title ? `<h2>${card.title}</h2>` : ""}
      ${card.desc ? `<p>${card.desc}</p>` : ""}
      <div class="options">
        <select class="option" onchange="set('${card.id}', this.options[this.selectedIndex].value)">`
      
      for(let option of card.options) {
        stringHTML += `<option value="${option}">${option}</option>`
      }

      stringHTML += `</select></div></div>`
    }

    if(card.type == "RANGE") {
      stringHTML += `<div class="item">
      ${card.title ? `<h2>${card.title}</h2>` : ""}
      ${card.desc ? `<p>${card.desc}</p>` : ""}
      <div class="options">`

      stringHTML += `<input type="range" min="${card.min}" max="${card.max}"
      class="option" value="${card.min}" onclick="set('${card.id}', +(this.value))">`

      stringHTML += `</div></div>`
    }

    if(card.type == "LIKERT") {
      stringHTML += `<div class="item">
      ${card.title ? `<h2>${card.title}</h2>` : ""}
      ${card.desc ? `<p>${card.desc}</p>` : ""}
      <div class="options row">`

      let choices = Array.from(Array(card.choices).keys()).map(i => -(i+1)).reverse()
      choices.push(0)
      choices = choices.concat(Array.from(Array(card.choices).keys()).map(i => i+1))
      
      for(let choice=0; choice < card.choices * 2 + 1; choice++) {
        let radius = Math.abs(choices[choice]) + 1
        let valence = choices[choice] > 0 ? "pos" : "neutral";
        valence = choices[choice] < 0 ? "neg" : valence;
        
        stringHTML += `<div class="likert type${radius} ${valence}" onclick="set('${card.id}', ${choices[choice]})">`
        stringHTML += `</div>`
      }

      stringHTML += `</div></div>`
    }

    if(card.type == "text") {
      stringHTML += `<p>${card.text}</p>`
    }
  }

  stringHTML += `<button onclick="end()">Soumettre</button>`

  document.querySelector('#form').innerHTML = stringHTML
}

let _ANSWER_ = {}

function set(cardId, answer) {
  _ANSWER_[`Q${cardId}`] = answer
  summarize()
}

function end() {
  summarize()
}

function summarize() {
  let popup = document.querySelector('#popup')
  popup.innerHTML = Object.keys(_ANSWER_).map(key => `${key} -> ${_ANSWER_[key]}<br>`).join('');
  popup.classList.remove('hidden')
}