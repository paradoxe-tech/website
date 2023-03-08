function getTextWidth(text, font) {
  const canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
  const context = canvas.getContext("2d");
  context.font = font;
  const metrics = context.measureText(text);
  return metrics.width;
}

function getCssStyle(element, prop) {
    return window.getComputedStyle(element, null).getPropertyValue(prop);
}

function getCanvasFont(el = document.body) {
  const fontWeight = getCssStyle(el, 'font-weight') || 'normal';
  const fontSize = getCssStyle(el, 'font-size') || '16px';
  const fontFamily = getCssStyle(el, 'font-family') || 'Times New Roman';
  
  return `${fontWeight} ${fontSize} ${fontFamily}`;
}

function resize(elem) {
  let text = elem.options[elem.selectedIndex].text
  let width = getTextWidth(text, getCanvasFont(document.getElementsByTagName('p')[0]))
  elem.style.width = `${Math.floor(width)}px`
}

function main() {
  for(let select of document.querySelectorAll('select')) {
    resize(select)
  }
}

function start() {
  let type = document.querySelector('#service-type')
  let owner = document.querySelector('#service-owner')

  document.querySelector('#service-line').innerHTML = `${type.selected('innerHTML')} qu'on remarque pour ${owner.selected('innerHTML')} !`
  
  let services = JSON.parse(get(`${window.location.origin}/cdn/data/services.json`))
  
  let service = {}
  
  if(type.selected("value").includes('_')) {
    let subtype = type.selected("value").split('_')[1]
    type = type.selected("value").split('_')[0]
    
    service = services[type][subtype]
  } else {
    service = services[type]
  }
  
  for(let nq=0; nq < service.questions.length; nq++) {
    let input = `<input class="question" id="question-n${nq}" type="text" placeholder='${service.questions[nq].default}'></input>`
    document.querySelector('#questions').innerHTML += `<span>${service.questions[nq].text.replaceAll('_input_', input)}</span>`
  }

  for(let no=0; no < service.questions.length; no++) {
    document.querySelector('#options').innerHTML += `<span><input class="option" id="opion-n${no}" type="checkbox"</input> ${service.options[no]}</span>`
  }
  
}

HTMLElement.prototype.selected = function(prop) {
  return this.options[this.selectedIndex][prop]
}