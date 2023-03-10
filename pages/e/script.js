function get(yourUrl) {
  var Httpreq = new XMLHttpRequest()
  Httpreq.open("GET", yourUrl, false)
  Httpreq.send(null)
  return Httpreq.responseText
}

const site_URL = window.location.origin
let productions = JSON.parse(get(site_URL + "/cdn/data/productions.json"))
productions = productions.sort(sortByDate).reverse()

document.querySelector('#searchbar').addEventListener('keyup', (event) => {
  document.querySelector('#container').innerHTML = ""
  displayItems(productions, {
    filter: x => {
      let value = document.querySelector('#searchbar').value.toLowerCase()
      if (value.startsWith('h/')) {
        if (x.host !== true) return false
        value = value.replaceAll('h/', "")
      }
      if (value.startsWith('p/')) {
        if (x.project !== true) return false
        value = value.replaceAll('p/', "")
      }
      if (value.startsWith('c/')) {
        if (sortByDate(x, {date:Date.now()}) !== 1) return false
        value = value.replaceAll('c/', "")
      } else {
        if (sortByDate(x, {date:Date.now()}) !== -1) return false
      }
      
      if (x.name.toLowerCase().includes(value)) return true
      if (x.desc.toLowerCase().includes(value)) return true
      if (x.fileType.toLowerCase().includes(value)) return true
      if (x.status.toLowerCase().includes(value)) return true
      
      return false
    }
  })
})

displayItems(productions, {
  filter: x => {
    if (sortByDate(x, {date:Date.now()}) !== -1) return false
    return true
  }
})

setMouseEvents()