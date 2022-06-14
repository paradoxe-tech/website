String.prototype.format = function(...vars) {
  
  res = this

  for (const e of vars) {
    res = res.replace('{}', e)
  }

  return res
  
}

Array.prototype.random = function() {
  
  return this[Math.floor(Math.random() * this.length)]
  
}

Array.prototype.remove = function(...indexes) {

  i = 0
  
  for (var e of indexes) {
    this.splice(e-i, 1)
    i += 1
  }
  
  return this
  
}

const sleep = async function(ms) {
  
  return new Promise(resolve => setTimeout(resolve, ms));
  
}

const randomColor = function() {
  
  return `#${('00000'+(Math.random()*(1<<24)|0).toString(16)).slice(-6)}`
  
}

Array.prototype.shuffle = function() {
  
  let i = this.length, r

  while (i != 0) {

    r = Math.floor(Math.random() * i)
    i--

    [this[i], this[r]] = [ this[r], this[i] ]
    
  }

  return this
  
}

Array.prototype.filterNot = function(compFunc) {
  
  let res = []
  
  for (var element of this) {
    if(!compFunc(element)) res.push(element)
  }

  return res
  
}

String.prototype.without = function(chars) {

  res = this
  
  for (var char of chars) {
    res = res.replaceAll(char, "")
  }

  return res
  
}

function polygon_dots(sides, centre, radius, rotation) {
  let one_segment = Math.PI * 2 / sides

  let points = []

  if(!radius) radius = 150
  if(!rotation) rotation = 0
  if(!centre) centre = [0, 0]
  
  for (var i=0; i<sides; i++) {
    let x = Math.sin(one_segment * i + rotation) * radius
    let y = Math.cos(one_segment * i + rotation) * radius
    points.push([ x + centre[0], y + centre[1] ])
  }

  return points
}