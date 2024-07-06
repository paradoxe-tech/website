function Get(yourUrl) {
  var Httpreq = new XMLHttpRequest(); // a new request
  Httpreq.open("GET", yourUrl, false);
  Httpreq.send(null);
  return Httpreq.responseText;
}

let WEAPONS = JSON.parse(Get(window.location.origin + "/api/weapons/data"))

function dataSet(queryString) {

  let data = []

  for (var i = 0; i < Object.keys(WEAPONS).length; i++) {
    let obj = Object.values(WEAPONS)[i]
    obj.nom = Object.keys(WEAPONS)[i]
    data.push(obj)
  }

  let urlParams = new URLSearchParams(queryString)

  if (urlParams.has('genre')) {
    document.querySelector('#genre').value = urlParams.get('genre')
    let genre = urlParams.get('genre').charAt(0).toUpperCase() + urlParams.get('genre').slice(1)
    data = data.filter(x => x.genre.includes(genre))
  }

  if (urlParams.has('type')) {
    document.querySelector('#type').value = urlParams.get('type')
    data = data.filter(x => x.type.includes(urlParams.get('type')))
  }

  if (urlParams.has('tenue')) {
    document.querySelector('#tenue').value = urlParams.get('tenue')
    data = data.filter(x => x.tenue.includes(urlParams.get('tenue')))
  }

  if (urlParams.has('region')) {
    document.querySelector('#region').value = urlParams.get('region')
    data = data.filter(x => x.region.includes(urlParams.get('region')))
  }

  if (urlParams.has('epoque')) {
    document.querySelector('#epoque').value = urlParams.get('epoque')
    if(urlParams.get('epoque') === "renaissance") {
      data = data.filter(x => x.origine.includes(' XVIe') ||  x.origine.includes(' XVe') ||  x.origine.includes(' XIVe'))
    } else if(urlParams.get('epoque') === "antiquite") {
      data = data.filter(x => x.origine.includes('av.'))
    }  else if(urlParams.get('epoque') === "moyen-age") {
      data = data.filter(x => 
        x.origine.includes(" VIe") ||
        x.origine.includes(" VIIe") ||
        x.origine.includes(" VIIIe") ||
        x.origine.includes(" IXe") ||
        x.origine.includes(" Xe") ||
        x.origine.includes(" XIe") ||
        x.origine.includes(" XIIe") ||
        x.origine.includes(" XIIIe")
      )
    } else if(urlParams.get('epoque') === "") {
      data = data
    } else {
      data = []
    }
  }

  data = data.shuffle()

  if (urlParams.has('sort')) {
    document.querySelector('#sort').value = urlParams.get('sort')
    if(urlParams.get('sort') !== "potentiel") {
      data = data.sort(function(a, b) {
        let a_val = a[urlParams.get('sort')]
        let b_val = b[urlParams.get('sort')]

        if (a_val < b_val)
          return -1;
        if (a_val > b_val)
          return 1;
        return 0;
      }).reverse()
    } else {
      data = data.sort(function(a, b) {
        let a_sum = a.allonge + a.estoc + a.taille + a.maniabilite
        let b_sum = b.allonge + b.estoc + b.taille + b.maniabilite

        if (a_sum < b_sum)
          return -1;
        if (a_sum > b_sum)
          return 1;
        return 0;
      }).reverse()
    }
  }

  if (urlParams.has('revert')) {
    document.querySelector('#revert').value = urlParams.get('revert')
    if(urlParams.get('revert') === "croissant") data = data.reverse()
  }

  if(!urlParams.has('unfinished') || urlParams.get('unfinished') == "orange") {
    data = data.filter(x => !x.unfinished || x.unfinished !== "red")
  } else if(urlParams.get('unfinished') == "green") {
    data = data.filter(x => !x.unfinished)
  }

  return data
}

function display(data, queryString) {

  document.querySelector('#wrapper').innerHTML = ""

  let urlParams = new URLSearchParams(queryString)

  for (var weapon of data) {
    let div_weapon = document.createElement('div')
    let link = ''
    if (weapon.link && urlParams.has('shop')) {
      link = `<a href="${weapon.link.replace('__replik__', "https://www.repliksword.com/epee-polypropylene/")}">🔗</a>`
    }
    if(weapon.genre === "") weapon.genre = "Arme"
    div_weapon.innerHTML = `
        <div data-weapon="${weapon.url}" class="cover-c"><img data-weapon="${weapon.url}" class="weaponimg" src="cdn/assets/glyphs/${weapon.url}.png"></div>
        <h3 data-weapon="${weapon.url}" class="title">${weapon.nom}${link}</h3>
        <h6 data-weapon="${weapon.url}" class="subtt">${weapon.genre} à ${weapon.tenue} main${weapon.tenue.includes('2') ? "s" : ""}</h6>
        <br data-weapon="${weapon.url}" >
        <p data-weapon="${weapon.url}" class="stat" title="allonge">${stat(weapon.allonge)}</p>
        <p data-weapon="${weapon.url}" class="stat" title="dégâts de taille">${stat(weapon.taille)}</p>
        <p data-weapon="${weapon.url}" class="stat" title="dégâts d'estoc">${stat(weapon.estoc)}</p>
        <p data-weapon="${weapon.url}" class="stat" title="maniabilité">${stat(weapon.maniabilite)}</p>` /* + `
        <p data-weapon="${weapon.url}" class="stat" title="dimensions">${weapon.longueur} cm pour ${weapon.poids} kg</p>
        <p data-weapon="${weapon.url}" class="stat" title="origine">${weapon.origine}</p>`*/

    div_weapon.className = "weapon"
    div_weapon.id = weapon.url
    div_weapon.setAttribute('data-weapon', weapon.url)
    if (urlParams.has('wishlist')) {
      if (weapon.acquired) div_weapon.className = "weapon green"
    }
    if (weapon.unfinished && urlParams.has('unfinished')) div_weapon.className = `weapon ${weapon.unfinished}`

    document.querySelector('#wrapper').appendChild(div_weapon)
  }

  document.querySelector('#counter').innerHTML = `(${data.length} armes) `

  setEventHandler(data)
}

function setEventHandler(data) {
  for (var weapon of data) {
    if (document.querySelector(`#${weapon.url}`)) {
      document.querySelector(`#${weapon.url}`).addEventListener('click', (e) => {
        let elem = e.target
        let weapon = elem.getAttribute('data-weapon')
        popup(data.filter(x => x.url === weapon)[0])
      })
    }
  }
}

function stat(perc) {
  let rPerc = Math.round(perc / 10)
  return ''.padEnd(rPerc, "▰").padEnd(10, "▱")
}

function search() {
  let type = document.querySelector('#type').options[document.querySelector('#type').selectedIndex].value;
  let genre = document.querySelector('#genre').options[document.querySelector('#genre').selectedIndex].value;
  let tenue = document.querySelector('#tenue').options[document.querySelector('#tenue').selectedIndex].value;
  let sort = document.querySelector('#sort').options[document.querySelector('#sort').selectedIndex].value;
  let region = document.querySelector('#region').options[document.querySelector('#region').selectedIndex].value;
  let epoque = document.querySelector('#epoque').options[document.querySelector('#epoque').selectedIndex].value;
  let unfinished = document.querySelector('#unfinished').options[document.querySelector('#unfinished').selectedIndex].value;
  let revert = document.querySelector('#revert').options[document.querySelector('#revert').selectedIndex].value;

  let req = `https://weapons.kitsuforyou.repl.co/?type=${type}&genre=${genre}&tenue=${tenue}&sort=${sort}&region=${region}&epoque=${epoque}&revert=${revert}&unfinished=${unfinished}`
  display(dataSet(req), req)
}

function resize(elem, searching = false) {
  if (searching) search()
  let text = elem.options[elem.selectedIndex].text
  let width = getTextWidth(text, getCanvasFont(document.getElementsByTagName('p')[0]))
  elem.style.width = `${Math.floor(width)}px`
}

function popup(weapon) {
  let canvas = document.getElementById('view')
  let context = canvas.getContext('2d')

  context.canvas.width = 500
  context.canvas.height = 400

  context.setTransform(1,0,0,1,0,0);

  let base_image = new Image()
  base_image.src = 'cdn/assets/others/human.png'
  base_image.onload = function() {
    context.drawImage(base_image, 0, 0)
  }

  let weapon_img = new Image()
    weapon_img.src = `cdn/assets/glyphs/${weapon.url}.png`

  weapon_img.onload = function() {
    const scale = 1
    context.setTransform(scale, 0, 0, scale, 170, 375)
    context.rotate(- Math.PI / 2)
    let resized = scaleWeapon(weapon_img, weapon.longueur)
    console.log(weapon.longueur, resized)
    context.drawImage(weapon_img, 0, 0, resized.width, resized.height)
  }

  document.querySelector('#popup-content').innerHTML = `
      <h3 data-weapon="${weapon.url}" class="title">${weapon.nom}</h3>
      <h6 data-weapon="${weapon.url}" class="subtt">${weapon.genre} à ${weapon.tenue} main${weapon.tenue.includes('2') ? "s" : ""}</h6>
      <p>${weapon.desc ? weapon.desc : "aucune description de l'arme pour le moment."}</p>`

  document.querySelector('#popup-stats').innerHTML = `
  <p data-weapon="${weapon.url}" class="stat" title="allonge">${stat(weapon.allonge)}</p>
      <p data-weapon="${weapon.url}" class="stat" title="dégâts de taille">${stat(weapon.taille)}</p>
      <p data-weapon="${weapon.url}" class="stat" title="dégâts d'estoc">${stat(weapon.estoc)}</p>
      <p data-weapon="${weapon.url}" class="stat" title="maniabilité">${stat(weapon.maniabilite)}</p>
      <p data-weapon="${weapon.url}" class="stat" title="dimensions">${weapon.longueur} cm pour ${weapon.poids} kg</p>
      <p data-weapon="${weapon.url}" class="stat" title="origine">${weapon.origine}</p>
      <p data-weapon="${weapon.url}" class="stat" title="autres noms">${weapon.noms && weapon.noms.length > 0 ? weapon.noms.join(', ') : "aucun autre nom."}</p>`

  document.querySelector('#main').classList.toggle('blurred')
  document.querySelector('#popup').classList.toggle('disabled')
}

function scaleWeapon(img, taille) {
  let baseWidth = img.width
  let baseHeight = img.height
  let oneMeter = 2// px
  let rapport = baseWidth / baseHeight

  return {
    width: taille * oneMeter, 
    height: (taille * oneMeter) / rapport 
  }
}

function close_popup() {
  document.querySelector('#main').classList.toggle('blurred')
  document.querySelector('#popup').classList.toggle('disabled')
}

display(dataSet(window.location.search))

resize(document.querySelector('#revert'))
resize(document.querySelector('#region'))
resize(document.querySelector('#epoque'))
resize(document.querySelector('#tenue'))
resize(document.querySelector('#type'))
resize(document.querySelector('#genre'))
resize(document.querySelector('#sort'))
resize(document.querySelector('#unfinished'))

let deltas = []
for(let [key, value] of Object.entries(WEAPONS)) {
  deltas.push(value.url)
}

document.querySelector('#weapon-logo').src = `cdn/assets/glyphs/${deltas.random()}.png`