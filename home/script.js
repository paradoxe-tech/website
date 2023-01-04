function get(yourUrl) {
  var Httpreq = new XMLHttpRequest()
  Httpreq.open("GET", yourUrl, false)
  Httpreq.send(null)
  return Httpreq.responseText
}

const site_URL = `${window.location.origin}/`
const projects = JSON.parse(get(site_URL + "cdn/data/projets.json"))
let productions = JSON.parse(get(site_URL + "cdn/data/productions.json"))

function sortByDate(a, b) {
  
  let date_a = new Date(a.date).getTime()
  let date_b = new Date(b.date).getTime()
  
  if (date_a < date_b) {
    return -1
  }
  
  if (date_a > date_b) {
    return 1
  }
  
  return 0
}

productions = productions.sort(sortByDate).reverse()

document.onmousemove = (event) => {

  event = event || window.event;
  if (event.pageX == null && event.clientX != null) {
    eventDoc = (event.target && event.target.ownerDocument) || document;
    doc = eventDoc.documentElement;
    body = eventDoc.body;

    event.pageX = event.clientX +
      (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
      (doc && doc.clientLeft || body && body.clientLeft || 0);
    event.pageY = event.clientY +
      (doc && doc.scrollTop || body && body.scrollTop || 0) -
      (doc && doc.clientTop || body && body.clientTop || 0);
  }

  let x = event.pageX
  let y = event.pageY

  document.querySelector('#w1').style.left = `-${15 + (x / 100)}%`
  document.querySelector('#w2').style.right = `${-25 + (x / 100)}%`
  document.querySelector('#w1').style.top = `-${10 + (y / 100)}vh`
  document.querySelector('#w2').style.top = `-${10 + (y / 100)}vh`
}

document.onscroll = (event) => {

  let el = document.querySelector('#main-logo')
  let height = window.getComputedStyle(el).height
  let top = el.offsetTop
  let max = parseInt(height.split('px')[0]) + top
  
  if(window.scrollY >= 100) {
    document.querySelector('#resume').style.top = `${max}px`
    
  } if(window.scrollY == 0) {
    document.querySelector('#resume').style.top = `120vh`
  }
}

function main() {
  
  new TypingMachine(document.querySelector('#changing-title'), 'pink')
  
}