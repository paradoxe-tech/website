styleDesc()

const folders = ['Développement', 'Études', 'Musique', 'Graphisme']
const wrapper = document.querySelector('#explorer-wrapper')

for (var folder of folders) {
  wrapper.innerHTML += createExpLine('folder', folder, "")
  filtered_productions = productions.filter(x => x.type === folder)
  for (var product of filtered_productions) {
    let folder = document.querySelector(`#folder-${product.type}`)
    wrapper.innerHTML += createExpLine('product', product.name, product)
  }
}

function createExpLine(lineType, name, product) {
  
  let desc = product.desc || ""
  let type = product.fileType || ""
  let date = product.date || ""
  let linkto = product.site_path || ""
  let folder = "into-" + product.type || ""
  let ident = product.name ? "" : ` id='dir-${name}'` 
  let isProject = product.project || false
  let project = ''

  if(isProject) project = `<a href = ${site_URL}/p/${linkto}>📋</a>`
  
  return `<div ${product.name ? "" : "style='width: calc(100% - 20px)' "}class="explorer-line ${lineType} ${folder}">
              <table>
                <tbody><tr>
                  ${product.name ? `<td class="nom">${name} ${project}</td>` : `<p onclick="selectFolder('${name}')" style="margin: 0px;margin-top: 5px;margin-left: 10px;"${ident}>[-] ${name}</p>` }
                  <td class="desc">${md(desc)}</td>
                  <td class="type"><a href='${linkto}'>${type}</a></td>
                  <td class="date">${date}</td>
                </tr>
              </tbody></table>
            </div>`
}

function selectFolder(folder) {
  document.querySelector(`#dir-${folder}`).innerHTML = plusToMinus(document.querySelector(`#dir-${folder}`).innerHTML)
  for (var line of document.getElementsByClassName(`into-${folder}`)) {
    line.classList.toggle('inactive')
  }
}

function plusToMinus(string) {
  if(string.includes('[+]')) return string.replace('[+]', '[-]')
  else if(string.includes('[-]')) return string.replace('[-]', '[+]')
  else return string
}