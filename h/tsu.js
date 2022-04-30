export String.prototype.format = function(...vars) {
  res = this

  for (const e of vars) {
    res = res.replace('{}', e)
  }

  return res
}

export Array.prototype.random = function() {
  
  return this[Math.floor(Math.random() * this.length)]
  
}

export Array.prototype.remove = function(...indexes) {

  i = 0
  
  for (var e of indexes) {
    this.splice(e-i, 1)
    i += 1
  }
  
  return this
  
}