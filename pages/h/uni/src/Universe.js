class Universe {
  constructor(config) {
    this.document = config.webpage

    const canvas = document.getElementById("grid")
    canvas.width = config.width
    canvas.height = config.height

    this.pixi = new PixiApp({
      view: canvas,
      width: config.width,
      height: config.height,
      backgroundColor: "black"
    });
    
    this.width = config.width
    this.height = config.height
    this.n = this.width * this.height
    
    this.rules = config.rules
    this.rules.universe = this
    this.defaultState = config.alive ? config.alive : 0

    this.bigbang()
    this.updateMetrics()
  }

  bigbang() {
    this.running = false
    this.generation = 0
    this.history = {}
    this.history[this.generation] = []
    this.edited = false
    this.pixicells = []

    // CLEAR CANVAS WITH PIXI
    
    for (var y = 0; y < this.height; y++) {
      if(!this.history[0][y]) this.history[0].push(Array(this.height))
      let pixiLine = []
      for (var x = 0; x < this.width; x++) {
        this.history[0][y*this.width + x] = this.defaultState

        const cell = new PIXI.Graphics();

        cell.beginFill("white");
        cell.drawRect(0, 0, 1, 1)
        cell.endFill();

        cell.x = x;
        cell.y = y;
        cell.tint = 0x0000

        this.pixi.stage.addChild(cell);
        pixiLine.push(cell)
      }
      this.pixicells.push(pixiLine)
    }
  }

  render() {
    this.pixi.render()
  }

  #coords(ci) {
    let y = Math.floor(ci / this.width)
    let x = ci - y*this.width
    
    return [x, y]
  }

  #ci(x, y) {
    return this.width*y + x
  }
  
  draw() {
    for (var ci = 0; ci < this.n; ci++) {
      let [x, y] = this.#coords(ci)
      this.drawCell(x, y)
    }
    
    this.pixi.render()
  }

  updateMetrics() {
    this.document.querySelector('#population').innerHTML = this.population()
    this.document.querySelector('#score').innerHTML = this.score()
    this.document.querySelector('#generation').innerHTML = this.generation
  }

  findPixiCell(x, y) {
    return this.pixicells[y][x]
  }

  drawCell(x, y) {
    let states = this.rules.type == "QL" ? 1 : this.width / 2
    let state = this.findCell(x, y) / states

    let color = 0

    if(state == 0) color = "black";
    if(state == 0.5) color = "#BBB";
    if(state == 1) color = "#12EB90";
    if(state == 2) color = "#ff5959";
    if(state == 3) color = "#fff87d";
    if(state == 4) color = "#43dcfa";
    if(state == 5) color = "#ff6bfa";

    let cell = this.findPixiCell(x, y)
    cell.tint = color;
  }

  findCell(x, y, gen=this.generation) {
    if(!this.history[gen]) return false
    return this.history[gen][this.#ci(x, y)]
  }

  setCell(x, y, state) {
    this.history[this.generation][this.#ci(x,y)] = state
  }

  switchCell(x, y) {
    let state = this.findCell(x, y)
    if(state == 0) this.setCell(x, y, 1)
    else if(state == 1) this.setCell(x, y, 0)
  }

  population() {
    return this.history[this.generation].filter(c => c !== 0).length
  }

  score() {
    return this.history[this.generation].reduce((partialSum, a) => partialSum + a, 0);
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
    
    this.drawCell(x, y)
    this.render()
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
      
      let effects = []

      for(let ci=0; ci < this.n; ci++) {
        let [x, y] = this.#coords(ci)
        let state = this.findCell(x, y)
        
        this.history[this.generation + 1][ci] = state
        effects = effects.concat(this.rules.apply(x,y, state))
      }

      this.generation ++

      for(let effect of effects) effect()

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