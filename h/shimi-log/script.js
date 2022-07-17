let data = [
  {v: "1.0.0", adds: [`ajout d'une poutre`, 'ton père le chauve']}
]

for (var version of data) {

  let HTMLstring = `
<div>
  <p class='version'>${version.v}</p>
  <div class='inactive'>
    <ul>
      <li>${version.adds.join('</li><li>')}</li>
    </ul>
  </div>
</div>`
  
  document.querySelector('#container').innerHTML += HTMLstring
}

for (var version of document.getElementsByClassName('version')) {

  version.addEventListener("mouseenter", function( event ) {
  
    event.target.classList.toggle('inactive')

  }, false)

  version.addEventListener("mouseover", function( event ) {

    event.target.classList.toggle('inactive')

  }, false)

}