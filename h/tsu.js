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