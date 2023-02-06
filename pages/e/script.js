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
        if (sortByDate(x.date, Date.now()) != 1) return false
        value = value.replaceAll('c/', "")
      }
      
      if (x.name.toLowerCase().includes(value)) return true
      if (x.desc.toLowerCase().includes(value)) return true
      
      return false
    }
  })
})

displayItems(productions, {})