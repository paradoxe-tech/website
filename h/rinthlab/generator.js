class Lab {

  constructor(size) {

    this.size = size

    this.map = []

    for (var line = 0; line < this.size; line++) {
      let row = []
      for (var cell = 0; cell < this.size; cell++) {
        row.push(new Cell(cell, line))
      }
      this.map.push(row)
    }

  }

  findCell(x, y) {
    return this.map[y][x]
  }

  validCells(cell) {

    let valid_cells = []

    let directions = [
      ['right', 1, 0],
      ['left', -1, 0],
      ['bottom', 0, 1],
      ['top', 0, -1]
    ]

    for (var direction of directions) {

      let dx = cell.x + direction[1]
      let dy = cell.y + direction[2]

      let found = false

      if (dx < this.size && dx >= 0 && dy < this.size && dy >= 0) {
        found = this.findCell(dx, dy)
      }

      if (found && found.isSquare()) {
        valid_cells.push([direction[0], found])
      }

    }

    return valid_cells

  }

  load() {

    console.log(this.map.length)

    this.total_cells = this.size * this.size

    this.stack = []
    this.current = this.findCell(0, 0)
    this.visited = 1

    this.gen()

    for (const style_cell of document.getElementsByClassName(`cells`)) {
      style_cell.style.backgroundColor = "black"
    }

  }

  async gen() {

    const sleep = (milliseconds) => {
      return new Promise(resolve => setTimeout(resolve, milliseconds))
    }

    await sleep(urlParams.get("speed") || 20)
    
      let valid = this.validCells(this.current)

      let choice = valid[Math.floor(Math.random() * valid.length)]

      if (!choice) {

        console.warn(`Backtrap : failed at ${this.visited} / ${this.size ** 2}`)
        this.current = this.stack.pop()
        return this.gen()

      }

      let wall = choice[0]
      let next = choice[1]
    
      this.current.killWall(next, wall)

      document.getElementById(`cell_${this.current.x}_${this.current.y}`).style["border-" + wall] = "none";
//      document.getElementById(`cell_${this.current.x}_${this.current.y}`).style.backgroundColor = 'red'
      document.getElementById(`cell_${next.x}_${next.y}`).style["border-" + next.wallNames[wall]] = "none";
//      document.getElementById(`cell_${next.x}_${next.y}`).style.backgroundColor = 'orange'

      this.stack.push(this.current)

      this.current = next
      this.visited += 1

    if( this.visited < this.total_cells ) this.gen()
  }

}