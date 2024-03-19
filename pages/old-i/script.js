let applications = [
  ["vegas", 85],
  ["photoshop", 65],
  ['git', 80],
  ['illustrator', 70],
  ['paintdotnet', 100],
  ['pycharm', 70],
  ['vs', 90],
]

for(let [app, perc] of applications) {
  document.querySelector('#apps').innerHTML += `<div class="progressbar">
    <svg class="progressbar__svg">
      <circle cx="124" cy="35" r="35" class="progress-circle" id="progress-${app}"></circle>
    </svg>
    <span class="progress-text">
      <img src="../../cdn/assets/icons/${app}.png">
    </span>
  </div>`

  animate(app, perc)
}

function dashOff(perc) {
  return 220 - ((perc * 220) / 100)
}

function animate(app, perc) {
  setTimeout( () => {
    document.querySelector(`#progress-${app}`).style.setProperty("stroke-dashoffset", dashOff(perc))
  }, 110)
}