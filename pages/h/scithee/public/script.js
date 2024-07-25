function getForm() {
  let url = new URLSearchParams(window.location.search)
  if (!url.has('form')) return false

  return url.get('form').padStart(6, '0')
}

function loadForm(id) {
  let form = JSON.parse(get(`${window.location.origin}/h/scithee/data/forms/${id}.json`))

  let stringHTML = ""
  let currentId = 0

  for (let card of form.content) {

    if (card.type !== "title" && card.type !== "text") currentId++
    card.id = currentId

    if (card.type == "title") {
      stringHTML += `<h1>${card.text}</h1>`
    }

    if (card.type == "YN") {
      stringHTML += `<div class="item">
      ${card.title ? `<h2>${card.title}</h2>` : ""}
      ${card.desc ? `<p>${card.desc}</p>` : ""}
      <div class="options">
         <button class="green option" onclick="set(this, '${card.id}', true)">OUI</button>
         <button class="red option" onclick="set(this, '${card.id}', false)">NON</button>
      </div></div>`
    }

    if (card.type == "RATE") {
      stringHTML += `<div class="item">
      ${card.title ? `<h2>${card.title}</h2>` : ""}
      ${card.desc ? `<p>${card.desc}</p>` : ""}
      <div class="options stars">`

      for (let n = 1; n <= card.choices; n++) {
        stringHTML += `<a id="item-n${card.id}-rate${n}" class="option star" onclick="set(this, '${card.id}', ${n})">☆</a>`
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

    if (card.type == "QCU") {
      stringHTML += `<div class="item">
      ${card.title ? `<h2>${card.title}</h2>` : ""}
      ${card.desc ? `<p>${card.desc}</p>` : ""}
      <div class="options">`

      for (let option of card.options) {
        stringHTML += `<div class="option" onclick="set(this, '${card.id}', ${card.options.indexOf(option)})">`
        stringHTML += `<span>${option}</span>`
        stringHTML += `</div>`
      }

      stringHTML += `</div></div>`
    }

    if (card.type == "DROP") {
      stringHTML += `<div class="item">
      ${card.title ? `<h2>${card.title}</h2>` : ""}
      ${card.desc ? `<p>${card.desc}</p>` : ""}
      <div class="options">
        <select class="option" onchange="set(this, '${card.id}', this.options[this.selectedIndex].value)">
        <option value="" default selected disabled>choisir…</option>`

      for (let option of card.options) {
        stringHTML += `<option value="${option}">${option}</option>`
      }

      stringHTML += `</select></div></div>`
    }

    if (card.type == "RANGE") {
      stringHTML += `<div class="item">
      ${card.title ? `<h2>${card.title}</h2>` : ""}
      ${card.desc ? `<p>${card.desc}</p>` : ""}
      <div class="options">`

      stringHTML += `<input type="range" min="${card.min}" max="${card.max}"
      class="option" value="${card.min}" 
      onchange="set(this, '${card.id}', +(this.value))"
      onclick="set(this, '${card.id}', +(this.value))">`

      stringHTML += `</div></div>`
    }

    if (card.type == "LIKERT") {
      stringHTML += `<div class="item">
      ${card.title ? `<h2>${card.title}</h2>` : ""}
      ${card.desc ? `<p>${card.desc}</p>` : ""}
      <div class="options row">`

      let choices = Array.from(Array(card.choices).keys()).map(i => -(i + 1)).reverse()
      choices.push(0)
      choices = choices.concat(Array.from(Array(card.choices).keys()).map(i => i + 1))

      for (let choice = 0; choice < card.choices * 2 + 1; choice++) {
        let radius = Math.abs(choices[choice]) + 1
        let valence = choices[choice] > 0 ? "pos" : "neutral";
        valence = choices[choice] < 0 ? "neg" : valence;

        stringHTML += `<div class="likert type${radius} ${valence}" onclick="set(this, '${card.id}', ${choices[choice]})">`
        stringHTML += `</div>`
      }

      stringHTML += `</div></div>`
    }

    if (card.type == "text") {
      stringHTML += `<p>${card.text}</p>`
    }
  }

  _N_ = currentId

  stringHTML += `<div id="g_id_onload"
         data-client_id="543905183346-coqdiumtbgqh1f9ej38sljsflsc3o02u.apps.googleusercontent.com"
         data-context="use"
         data-ux_mode="popup"
         data-callback="handleCredentialResponse"
         data-auto_prompt="false">
    </div>

    <div class="g_id_signin"
         data-type="standard"
         data-shape="pill"
         data-theme="filled_black"
         data-text="continue_with"
         data-size="large"
         data-logo_alignment="left">
    </div>`

  document.querySelector('#popup').innerHTML = stringHTML
  document.querySelector('#popup').classList.remove('hidden')
  document.querySelector('#click-catcher').classList.remove('hidden')
}

let _ANSWER_ = {}
let _N_ = false

function set(element, cardId, answer) {
  element.parentNode.querySelectorAll('*').forEach(el => el.classList.remove('active'))
  element.classList.add('active')

  _ANSWER_[`Q${cardId}`] = answer
  summarize()
}

function summarize() {
  return
  let popup = document.querySelector('#popup')
  popup.innerHTML = Object.keys(_ANSWER_).map(key => `${key} -> ${_ANSWER_[key]}<br>`).join('');
  popup.classList.remove('hidden')
}

loadForm(getForm())

async function handleCredentialResponse(response) {
  console.log(_ANSWER_)
  if (Object.keys(_ANSWER_).length < _N_) return alert('Répondez à toutes les questions !')
  const responsePayload = decodeJwtResponse(response.credential)
  if (!responsePayload) return alert('Failed to log correctly.')

  let user = await parseGoogleUser(responsePayload)

  fetch(`${window.location.origin}/api/scithee/answer/${getForm()}`, {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user: user.id,
      answer: _ANSWER_
    })
  })

  document.querySelector('#form').innerHTML = `<h1>Merci !</h1>
  <p>Vos résultats sont susceptibles d'être publiés anonymement ; Pour changer votre réponse, il suffit de refaire le sondage en actualisant la page et en se connectant au même compte ! Pour toute demande de suppression de données, veuillez nous contacter.</p>`

}

function displayForms() {
  let forms = JSON.parse(get(`${window.location.origin}/api/scithee/forms`))
  let container = document.querySelector('#forms')

  for (let form of forms) {
    container.innerHTML += `<div class="form" onclick="loadForm('${form.id}')">
      <span>${form.title}</span>
      <span>par @${form.author ? form.author : "callmekitsu"}</span>
      <span class="answers">${form.results} <ion-icon name="people-outline"></ion-icon></span>
    </div>`
  }
}

function killPopup(precautious=true) {
  if (!precautious || confirm('Voulez-vous abandonner le sondage en cours ?')) {
    document.querySelector('#popup').classList.add('hidden')
    document.querySelector('#click-catcher').classList.add('hidden')
  }
}