class Kruskal {

  constructor(size, type) {

    this.size = size
    this.map = []
    this.startTimeStamp = Date.now()

    let i = 0
    
    for (var line = 0; line < this.size; line++) {
      
      let row = []
      
      for (var cell = 0; cell < this.size; cell++) {
        i += 1

        let new_cell = new Cell(cell, line, type)

        new_cell.id = i
        
        row.push(new_cell)
        
      }
      
      this.map.push(row)
    }

    this.walls = this.giveWallsList(this.size, this.map)
    
  }

  giveWallsList(size, matrix) {
    let res = []
    
    for (var line = 1; line < size - 1; line += 2) {
      for (var i = 1; i <= size -3; i += 2 ) {
        res.push({
          choice: this.findCell(i, line, '[WALLCHOICE]'),
          pair: this.findCell(i+2, line, '[WALLPAIR]'),
          mid: this.findCell(i+1, line, '[WALLMID]'),
        })
      }
    }

    for (var col = 1; col < size - 1; col += 2) {
      for (var i = 1; i <= size -3; i += 2 ) {
        res.push({
          choice: this.findCell(col, i, '[WALLCHOICE]'),
          pair: this.findCell(col, i+2, '[WALLPAIR]'),
          mid: this.findCell(col, i+1, '[WALLMID]'),
        })
      }
    }

    return res
  }

  findCell(x, y) {
    return this.map[y][x]
  }

  load() {

    this.added = []
    
    const loop = async () => {

      if(this.walls.length == 0) return console.log(`Kruskal's: ${Date.now() - this.startTimeStamp}ms`)

      const sleep = (milliseconds) => {
        return new Promise(resolve => setTimeout(resolve, milliseconds))
      }

      let r = Math.floor(Math.random() * this.walls.length)

      let randomWall = this.walls[r]
      
      let choice = randomWall.choice
      let pair = randomWall.pair
      let mid = randomWall.mid

      this.walls = this.walls.filter(wall => wall.pair != pair)
      
      let chosen_cells = [mid, pair, choice]

      for (let chosen_cell of chosen_cells) {
        chosen_cell.add()
        chosen_cell.color('red')
        this.added.push(chosen_cell)
      }
      
      await sleep(urlParams.get("speed") || 20)

      for (var this_cell of this.added) {
        this_cell.color('white')
      }

      loop()
    }

    loop()
  }
  
}