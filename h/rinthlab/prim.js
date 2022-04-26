class Prim {

  constructor(size, type) {

    this.size = size
    this.map = []

    for (var line = 0; line < this.size; line++) {
      
      let row = []
      
      for (var cell = 0; cell < this.size; cell++) {
        row.push(new Cell(cell, line, type))
      }
      
      this.map.push(row)
    }
    
  }

  findCell(x, y) {
    return this.map[y][x]
  }

  adjacents(cell) {
    
    let valid_cells = []

    let directions = [
      [2, 0],
      [-2, 0],
      [0, 2],
      [0, -2]
    ]

    for (var direction of directions) {

      let dx = cell.x + direction[0]
      let dy = cell.y + direction[1]

      var potential = false
      
      if (dx < this.size -1 && dx >= 0 && dy < this.size -1 && dy >= 0) {
        potential = this.findCell(dx, dy)
      }

      if(potential && potential.visited == false) {
        valid_cells.push(potential)
      }
      
    }

    return valid_cells
    
  }

  load(startX, startY) {
    
    this.total_cells = this.size * this.size
    this.visited = 1
    this.added = [ this.findCell(startX, startY) ]
    this.findCell(startX, startY).add()

    const loop = async () => {
      const sleep = (milliseconds) => {
        return new Promise(resolve => setTimeout(resolve, milliseconds))
      }

      let random = this.choseCell()
      
      let new_cell = random[0]
      let choice = random[1]

      new_cell.add()
      this.added.push(new_cell)

      let between_coords = [(choice.x + new_cell.x) / 2, (choice.y + new_cell.y) / 2]
      
      this.findCell(between_coords[0], between_coords[1]).add()
      this.findCell(new_cell.x, new_cell.y).color("red")

      await sleep(urlParams.get("speed") || 20)

      for (var style_cell of this.added) {
        document.querySelector(`#prim_cell_${style_cell.x}_${style_cell.y}`).style.backgroundColor = "white"
      }

      this.visited += 1
      if( this.visited < (this.size - 1)**2 / 4 ) loop()
      
    }

    loop()
    
  }

  choseCell() {

    if(this.visited > (this.size - 1)**2 / 4) return console.log("STOP")

    let choice = this.added[Math.floor(Math.random() * this.added.length)]

    if(this.adjacents(choice).length > 0) return [this.adjacents(choice)[Math.floor(Math.random() * this.adjacents(choice).length)], choice]

    else return this.choseCell()
  }

  test(x, y) {
    let cell = this.findCell(x, y)
    cell.add()

    for (var adj of this.adjacents(cell)) {
      adj.color('blue')
    }
  }
  
}