const PAGES = JSON.parse(get(`${window.location.origin}/api/wiki/allPages`))

function load(search="", shuffle=true) {
  let container = document.querySelector('#explorer')
  container.innerHTML = ""
  let pages = PAGES.map((x) => x)
  let resCount = 0;
  
  if(shuffle) pages = pages.shuffle()
  pages = pages.slice(0, 5)
  
  for(let page of pages) {
    let content = page.title + page.desc
    if(!content.toLowerCase().includes(search.toLowerCase())) continue

    resCount++;
    
    container.innerHTML += `<div onclick="openPage('${page.title.replaceAll(' ', '_')}')" class="article-box">
      <img src="${page.cover}">
      <h2>${page.title}</h2>
      ${page.desc}
    </div>`
  }

  if(resCount == 0) container.innerHTML += `<div class="error">Aucun article trouvé !</div>`
}

function openPage(pageTitle) {
  window.open(`${window.location.origin + window.location.pathname}/fr/${pageTitle}`, "_self").focus()
}