class Cell {

  constructor(x, y, type) {

    this.x = x
    this.y = y
    this.visited = false
    this.type = type
    this.id = 0

  }

  add() {
    this.visited = true
    document.querySelector(`#${this.type}_cell_${this.x}_${this.y}`).style.backgroundColor = "white"
  }

  color(string) {
    document.querySelector(`#${this.type}_cell_${this.x}_${this.y}`).style.backgroundColor = string
  }

}

class DFS {

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
    this.stack = []
    this.current = this.findCell(startX, startY)
    this.visited = 1

    const loop = async () => {
      const sleep = (milliseconds) => {
        return new Promise(resolve => setTimeout(resolve, milliseconds))
      }

      await sleep(urlParams.get("speed") || 20)

      if(!this.current) return 
      
      this.current.add()

      let adjacents = this.adjacents(this.current)
      let next = adjacents[Math.floor(Math.random() * adjacents.length)]
      if (!next) {
        
        this.current = this.stack.pop()
        return loop()
        
      }

      let between_coords = [(this.current.x + next.x) / 2, (this.current.y + next.y) / 2]
      
      this.findCell(between_coords[0], between_coords[1]).add()
      this.findCell(next.x, next.y).color("red")

      this.stack.push(this.current)

      this.current = next
      this.visited += 1

      loop()
      
    }

    loop()
    
  }

  test(x, y) {
    let cell = this.findCell(x, y)
    cell.add()

    for (var adj of this.adjacents(cell)) {
      adj.color('blue')
    }
  }
  
}