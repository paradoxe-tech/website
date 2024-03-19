function displayRecommands(videos) {
  let container = document.querySelector('#main')
  container.innerHTML = ""

  for (let video of videos.shuffle()) {
    let playlist_tag = ""
    let wrap = ""

    if(!video.unwrap) {
      playlist_tag = `<div class="playlist-tag">▶ ${video.n}</div>`
      wrap = " playlist"
    }
    
    container.innerHTML += `<div class="video${wrap}">
    ${playlist_tag}
    <img src="${video.cover}">
    <h2>${video.title}</h2>
    <ion-icon name="checkmark-circle-outline"></ion-icon>
    </div>`
  }
}

const vids = JSON.parse(get(`${window.location.origin}/api/scithee/videos`))

function searchVids(tags, videos) {
  if (tags.length == 0) findRecommands(videos)
  else {
    let corresp = videos.filter(v => {
      for (let tag of v.tags) {
        if (tags.includes(tag)) return true
      }

      return false
    })

    displayRecommands(corresp)
  }
}

function findRecommands(videos) {
  displayRecommands(videos)
}

searchVids([], vids)

function loadMenu(tags) {
  let container = document.querySelector('#side')
  for (let tag of tags) {
    container.innerHTML += `<div onclick="searchVids(['${tag}'], vids)" class="tag">${tag}</div>`
  }
}

loadMenu([
  "physique",
  "biologie",
//  "zététique",
  "sociologie",
  "philosophie",
  "épistémologie",
  "logique",
  "informatique",
  "mathématiques",
  "statistiques",
  "économie",
  "géopolitique",
  "histoire",
])