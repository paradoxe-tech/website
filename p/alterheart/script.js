// ================================================================= { HIGHLIGHT } 

let i = 0

setInterval( () => {
    document.querySelector("body > div.banner > div > p").innerHTML = document.querySelector("body > div.banner > div > p").innerHTML.replace('<pink>', ``).replace('</pink>', ``)
  document.querySelector("body > div.banner > div > p").innerHTML = document.querySelector("body > div.banner > div > p").innerHTML.replace(subtitles[i], `<pink>${subtitles[i]}</pink>`)
  i += 1
  if(i === subtitles.length) i = 0
},1000)