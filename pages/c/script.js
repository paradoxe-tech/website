function displaySurveys() {
  let container = document.querySelector('#surveys')
  let sondages = JSON.parse(get(`${window.location.origin}/api/scithee/forms`))

  sondages.sort((a, b) => {
    if(a.results < b.results) return 1
    if(a.results > b.results) return -1
    return 0
  })
  
  for(let sondage of sondages.slice(0, 5)) {
    let prize = ((sondage.blocks * 20) / 300).toFixed(2)
      
    container.innerHTML += `<button class="c-action" 
    onclick="openSurvey('${sondage.id}')"
    data-gain="${prize}">${sondage.title}</button>`
  }
}

function openSurvey(id) {
  window.open(`${window.location.origin}/h/scithee/?form=${id}`, "_self")
}

displaySurveys()
setMouseEvents()