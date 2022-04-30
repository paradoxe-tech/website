class Kruskal {

  constructor(size, type) {

    this.size = size
    this.map = []
    this.sets = {}

    let i = 0
    
    for (var line = 0; line < this.size; line++) {
      
      let row = []
      
      for (var cell = 0; cell < this.size; cell++) {
        i += 1

        let new_cell = new Cell(cell, line, type)

        new_cell.id = i

        this.sets[i] = [new_cell]
        
        row.push(new_cell)
      }
      
      this.map.push(row)
    }
    
  }

  findCell(x, y) {
    console.log('Finding cell at position: ' + x +","+y)
    
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
      
      if (dx <= this.size -2 && dx >= 1 && dy <= this.size -2 && dy >= 1) {
        potential = this.findCell(dx, dy)
      }

      if(potential && potential.visited == false) {
        valid_cells.push(potential)
      }
      
    }

    return valid_cells
    
  }

  load() {

    this.visited = 0
    
    const loop = async () => {

      console.log('-------------{ Here is a loop }-------------')
      
      const sleep = (milliseconds) => {
        return new Promise(resolve => setTimeout(resolve, milliseconds))
      }
      
      await sleep(urlParams.get("speed") || 2000)
      
      let choice = this.choseCell()
      let pair = this.chosePair(choice)
      let mid = this.findCell((choice.x + pair.x)/2, (choice.y + pair.y)/2)

      choice.add()
      let chosen_cells = [pair, mid]

      for (let chosen_cell of chosen_cells) {
        chosen_cell.add()
        this.sets[choice.id] = this.sets[chosen_cell.id].concat(this.sets[choice.id])
        this.sets[chosen_cell.id] = []
      }

      this.visited += 1

      for (var i=0; i < this.sets.length; i++) {
        if(this.sets[i].length === this.sets.length) return
      }

       if( this.visited < (this.size - 1)**2 / 4 ) loop()
    }

    loop()
  }

  choseCell() {
    console.log('Recursively searching for a random cell')
    
    let randX = Math.floor(Math.random() * this.size)
    let randY = Math.floor(Math.random() * this.size)

    if(randX <= this.size -2) randX -= 2
    if(randX >= 1) randY += 2
    if(randY >= 1) randY += 2
    if(randY >= this.size -2) randY -= 2

    if(randX !== this.size -1 && randX % 2 === 0) randX += 1
    else if(randX % 2 === 0) randX -= 1
    if(randY !== this.size -1 && randY % 2 === 0) randY += 1
    else if(randY % 2 === 0) randY -= 1
    
    let res = this.findCell(randX, randY)

    if(!res) return choseCell()
    return res
  }

  chosePair(choice) {
    console.log('Recursively searching for pair to cell: ' + choice.x +","+choice.y)
    
    if(this.visited > (this.size - 1)**2 / 4) return
    
    let found = this.adjacents(choice)[Math.floor(Math.random() * this.adjacents(choice).length)]
    if(!found) return this.chosePair(choice)
    return found
  }
  
}