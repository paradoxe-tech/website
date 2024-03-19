let mouseMoved = false

document.body.addEventListener('mousemove', () => {
  if(mouseMoved) return
  mouseMoved = true
  
  document.querySelectorAll(".item .options.stars .option").forEach(star => {
    console.log("done")
    star.addEventListener('mousemove', e => {
      let qId = star.id.split('-')[1]
      let note = parseInt(star.id.split('-')[2].replaceAll('rate', ''))

      for(let n=1; n <= 5; n++) {
        if(n <= note) document.querySelector(`#item-${qId}-rate${n}`).innerHTML = "★"
        else document.querySelector(`#item-${qId}-rate${n}`).innerHTML = "☆"
      }
    })
  })
  
})