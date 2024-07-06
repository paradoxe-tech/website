let MDN = `https://developer.mozilla.org/fr-FR/docs/Web/JavaScript/Reference`
let classesDocs = JSON.parse(get(`${window.location.origin}/api/tsu-js/data`))

function load(search) {
  let sideMenu = document.querySelector('#side-menu')
  let content = `<ul class="summary">`

  for(let classType of Object.keys(classesDocs)) {
    content += `<li>${classType}</li><ul>`
    for(let [classe, classProps] of Object.entries(classesDocs[classType])) {
      content += `<li style="--highlight: ${classType == "Custom_Classes" ? '#ff4df9' : '#00aaff'}">
      ${classe}</li><ul>`
      for(let prop of classProps) {

        let dependance = prop.static ? "" : `.prototype`
        let call = prop.type !== "propriété" ? "()" : ""
        let fullprop = `${classe}${dependance}.${prop.name}${call}`

        if(search && !fullprop.toLowerCase().includes(search.toLowerCase())) continue // recherche

        let status = ""
        status = prop.status == "deprecated" ? `<ion-icon name="trash-bin-outline"></ion-icon>` : status
        status = prop.status == "experimental" ? `<ion-icon name="flask-outline"></ion-icon>` : status

        let onclick = "`" + classType + "`, `" + classe + "`, `"
        onclick += JSON.stringify(prop).replaceAll("'", "&apos&") + "`"

        if(prop.type == "constructeur") fullprop = `new ${classe}()`
        content += `<li onclick='displayClassProp(${onclick})'>
          ${fullprop}${status}</li>`
      }
      content += "</ul>"
    }
    content += "</ul><br/>"
  }

  sideMenu.innerHTML = content + `</ul>`

  hljs.highlightAll()
}

function displayClassProp(classType, parentClass, stringProp) {
  let viewport = document.querySelector('#viewport')
  let content = ""
  let prop = {
    group: classType,
    parent: parentClass,
    ...JSON.parse(stringProp),
  }

  let genre = {
    "constructeur": "Le",
    "méthode": "La",
    "procédure": "La",
    "propriété": "La",
    "prédicat": "Le"
  }

  // let params = prop.args.map(arg => arg.name).join(', ')
  let dependance = prop.static ? "" : `.prototype`
  let call = prop.type !== "propriété" ? `()` : ""

  // Title
  let parent = `<a ${prop.group == "Custom_Classes" ? 'class="link"' : ''}>${prop.parent}</a>`
  if(prop.type === "constructeur") content += `<h1>new ${parent}()</h1>`
  else content += `<h1>${parent}${dependance}.${prop.name}${call}</h1>`

  // Description
  content += `<p>${genre[prop.type]} ${prop.type} <case>${prop.name}</case> ${prop.desc.replaceAll("&apos&", "'")}</p>`

  // Example
  if(prop.exemple) {
    let example = prop.exemple.replaceAll("&apos&", "'")
    content += `<pre><code class="language-javascript">${example}</code></pre>`
  }

  // Arguments (if any)
  if(prop.args && prop.args.length > 0) {
    content += `<h3>Arguments</h3><ul>`

    for(let arg of prop.args) {

      let type = `<a href="${MDN}/Global_Objects/${arg.type}">${arg.type}</a>`
      if(arg.custom) type = `<a class="link">${arg.type}</a>`
      let optional = arg.default == false ? '' : `<span class="tag">optionnel</span>`
      content += `<li><case>${arg.name}</case> ${optional} (${type}) : ${arg.desc.replaceAll("&apos&", "'")}${arg.spec ? `<ion-icon name="open-outline" onclick="window.open('${arg.spec}', '_blank').focus()"></ion-icon>`: ""}</li>`

    }
    content += `</ul>`
  }

  // Valeur de Retour
  if(prop.type == "constructeur" || prop.return) {
    content += `<h3>Valeur de retour</h3><ul>`
    let type = prop.return ? `<a href="${MDN}/Global_Objects/${prop.return.type}">${prop.return.type}</a>` : ""

    if(prop.return && prop.return.custom == true) {
      type = `<a class="link">${prop.return.type}</a>`
    }

    let desc = prop.return ? prop.return.desc.replaceAll("&apos&", "'") : ""

    if(prop.type == "constructeur" || prop.return.type == "this") {
      type = `<a class="link">${prop.parent}</a>`
      desc = `l'instance de <case>${prop.parent}</case>`
    }

    content += `<li>(${type}) : ${desc}${prop.return && prop.return.spec ? `<ion-icon name="open-outline" onclick="window.open('${prop.return.spec}', '_blank').focus()"></ion-icon>`: ""}</li>`

    content += `</ul>`
  }

  viewport.innerHTML = content
  hljs.highlightAll()
}