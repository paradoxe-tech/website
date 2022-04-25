class Cell {

  wallNames = { 'top': 'bottom', 'bottom': 'top', 'right': 'left', 'left': 'right' }

  constructor(x, y) {

    this.x = x
    this.y = y
    this.walls = { 'top': true, 'bottom': true, 'right': true, 'left': true }

  }

  isSquare() {

    if (this.walls.top && this.walls.bottom && this.walls.right && this.walls.left) return true
    else return false

  }

  killWall(adj, wall) {

    this.walls[wall] = false
    adj.walls[adj.wallNames[wall]] = false

  }

}
