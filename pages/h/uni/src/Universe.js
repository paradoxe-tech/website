class Universe {
  constructor(config) {
    this.document = config.webpage

    const canvas = document.getElementById("grid")
    canvas.width = config.width
    canvas.height = config.height
    
    this.gl = canvas.getContext("webgl2")
    this.width = config.width
    this.height = config.height
    this.rules = config.rules
    this.rules.universe = this
    this.defaultState = config.alive ? config.alive : 0

    if(!this.gl) {
      this.gl = canvas.getContext("experimental-webgl")
    }
    
    if(!this.gl) {
      return alert('Votre navigateur ne supporte pas WebGL')
    } else {
      this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
      this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
      this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.width);
      this.program = setupGL(this.gl)
    }

    this.bigbang()
    this.updateMetrics()
  }

  bigbang() {
    this.running = false
    this.generation = 0
    this.history = {}
    this.history[this.generation] = []
    this.edited = false
    this.modified = {0:[]}

    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    
    for (var y = 0; y < this.height; y++) {
      if(!this.history[0][y]) this.history[0].push(Array(this.height))
      
      for (var x = 0; x < this.width; x++) {
        this.history[0][y][x] = this.defaultState
      }
    }
  }

  refresh() {
    for(let [x, y] of this.modified[this.generation]) {
      this.drawCell(x, y)
    }
  }
  
  draw() {
    for (var y = 0; y < this.height; y++) {
      for (var x = 0; x < this.width; x++) {
        this.drawCell(x, y)
      }
    }
  }

  updateMetrics() {
    this.document.querySelector('#population').innerHTML = this.population()
    this.document.querySelector('#score').innerHTML = this.score()
    this.document.querySelector('#generation').innerHTML = this.generation
  }

  drawCell(x, y) {
    let states = this.rules.type == "QL" ? 1 : this.width / 2
    let state = this.findCell(x, y) / states

    x /= this.width / 2
    y /= this.height / 2
    let w = 1 / (this.width / 2)
    let h = 1 / (this.height / 2)

    x = -1 + x
    y = 1 - y

    
    this.gl.enable(this.gl.SCISSOR_TEST);
    this.gl.scissor(x, y, w, h);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    this.gl.disable(this.gl.SCISSOR_TEST);
    
    if(state == 1) {
      let vertices = [[x, y],[x+w, y],[x, y-h],[x+w, y-h]]

      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.gl.createBuffer());
      this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices.flat()), this.gl.STATIC_DRAW);

      let vertexPosition = this.gl.getAttribLocation(this.program, "vertexPosition");
      this.gl.enableVertexAttribArray(vertexPosition);
      this.gl.vertexAttribPointer(vertexPosition, vertices[0].length, this.gl.FLOAT, false, 0, 0);

      this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, vertices.length);
    }
  }

  findCell(x, y, gen=this.generation) {
    if(!this.history[gen]) return false
    if(!this.history[gen][y]) return false
    if(!this.history[gen][y][x]) return false
    return this.history[gen][y][x]
  }

  setCell(x, y, state) {
    this.history[this.generation][y][x] = state
  }

  switchCell(x, y) {
    let state = this.findCell(x, y)
    if(state == 0) this.setCell(x, y, 1)
    else if(state == 1) this.setCell(x, y, 0)
  }

  population() {
    return this.modified[this.generation].filter(c => this.findCell(c[0], c[1]) !== 0).length
  }

  score() {
    let res = 0
    for(let [x, y] of this.modified[this.generation]) {
      res += this.findCell(x, y)
    }
    return res
  }

  listCell(x, y) {
    if(!this.modified[this.generation].find(c => c[0] == x && c[1] == y)) {
      this.modified[this.generation].push([x, y])
    }
  }

  neighbours(x, y, matrix, callback) {
    let around = []

    for(let my=0; my < matrix.length; my++) {
      for(let mx=0; mx < matrix[0].length; mx++) {
        let vx = x + mx - 1
        let vy = y + my - 1
        let neigh = this.findCell(vx, vy)
        if(matrix[my][mx] !== 1) continue
          
        if(callback(vx, vy, neigh)) around.push([vx, vy])
      }
    }

    return around
  }

  matchCell(x, y, matrix) {
    let matched = true

    for(let my=0; my < matrix.length; my++) {
      for(let mx=0; mx < matrix[0].length; mx++) {
        let cell = this.findCell(x + mx - 1, y + my - 1)
        if(cell === false) continue
        if(matrix[my][mx] === null) continue
        if(cell !== matrix[my][mx]) matched = false
      }
    }

    return matched
  }

  click(x, y, type) {
    if(this.running) return
    let state = this.findCell(x, y)

    if(type == "add") this.setCell(x, y, state + 1)
    if(type == "rem") {
      if(state > 0) this.setCell(x, y, state - 1)
      else this.setCell(x, y, 0)
    }
    if(type == "cherry") this.switchCell(x, y)

    this.listCell(x, y)
    this.refresh()
    this.edited = true
    this.updateMetrics()
  }

  run(end=false, delta=1) {
    if (this.running) return
    this.running = true
    
    let life = setInterval(() => {
      if(end && this.generation >= end) this.running = false
      if(this.running == false) clearInterval(life)
      this.step()

    }, 1000 / delta)
  }

  step() {
    if(!this.edited && this.history[this.generation + 1]) {
      this.teleport(this.generation + 1)
    } else {
      if(!this.history[this.generation + 1]) this.history[this.generation + 1] = []
      if(!this.modified[this.generation + 1]) this.modified[this.generation + 1] = []
      
      let effects = []
      
      for(let y=0; y < this.height; y++) {
        if(!this.history[this.generation + 1][y]) this.history[this.generation + 1].push([])
        for(let x=0; x < this.width; x++) {
          let state = this.history[this.generation][y][x]
          this.history[this.generation + 1][y][x] = state
          effects = effects.concat(this.rules.apply(x,y, state))
        }
      }

      this.generation ++

      for(let effect of effects) {
        effect()
      }

      for(let y=0; y < this.height; y++) {
        for(let x=0; x < this.width; x++) {
          let oldState = this.history[this.generation - 1][y][x]
          let newState = this.history[this.generation][y][x]
          if(oldState !== newState) this.listCell(x, y)
        }
      }
    }
    
    this.draw()
    this.updateMetrics()
    this.edited = false
  }

  teleport(generation) {
    this.edited = false
    if(!this.history[generation]) return
    this.generation = generation
  }
}