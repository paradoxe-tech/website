function get(yourUrl) {
  var Httpreq = new XMLHttpRequest()
  Httpreq.open("GET", yourUrl, false)
  Httpreq.send(null)
  return Httpreq.responseText
}

const site_URL = `${window.location.origin}`
let productions = JSON.parse(get(site_URL + "/cdn/data/productions.json"))

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

displayItems(productions, {})