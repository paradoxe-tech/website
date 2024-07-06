class Rules {
  constructor(universe) {
    this.type = "QL"
    this.stack = []
    this.verbatim = []
    this.matrix = false
    this.universe = universe
  }

  and(rule1, rule2) {
    return [
      (x, y , state) => rule1[0](x, y , state) && rule2[0](x, y , state),
      `<op>${rule1[1]} ET ${rule2[1]}</op>`
    ]
  }

  or(rule1, rule2) {
    return [
      (x, y , state) => rule1[0](x, y , state) || rule2[0](x, y , state),
      `<op>${rule1[1]} OU ${rule2[1]}</op>`
    ]
  }

  default() {
    return [() => true, "<val>rien de spécial</val>"]
  }

  time(n, result) {
    return [
      (x, y, state) => this.universe.generation & n == result,
      `<val>t & ${n} = ${result}</val>`
    ]
  }

  status(operator, value) {
    let func = "none"
    
    if(operator == ">") func = (x, y , state) => state > value
    else if(operator == ">=") func = (x, y , state) => state >= value
    else if(operator == "<") func = (x, y , state) => state < value
    else if(operator == "<=") func = (x, y , state) => state <= value
    else if(operator == "=") func = (x, y , state) => state === value
    else return console.log("err status operator")
    
    return [
      func,
      `<val>état ${operator} ${value}</val>`
    ]
  }

  neighbours(operator, value, callback=RULES.status(">", 0)) {
    let func = "none"
    callback = callback[0]
    
    if(operator == ">") func = (x, y , state) => {
      return this.universe.neighbours(x, y, this.matrix, callback).length > value
    }
    else if(operator == ">=") func = (x, y , state) => {
      return this.universe.neighbours(x, y, this.matrix, callback).length >= value
    } 
    else if(operator == "<") func = (x, y , state) => {
      return this.universe.neighbours(x, y, this.matrix, callback).length < value
    }
    else if(operator == "<=") func = (x, y , state) => {
      return this.universe.neighbours(x, y, this.matrix, callback).length <= value
    } 
    else if(operator == "=") func = (x, y , state) => {
      return this.universe.neighbours(x, y, this.matrix, callback).length == value
    } 
    else return console.log("err treshold operator")

    return [
      func,
      `<val>voisines ${operator} ${value}</val>`
    ]
  }

  alive() {
    return [
      (x, y , state) => this.universe.setCell(x, y, 1),
      `<val>vivante</val>`
    ]
  }

  dead() {
    return [
      (x, y , state) => this.universe.setCell(x, y, 0),
      "<val>meurt</val>"
    ]
  }

  set(newState) {
    return [
      (x, y , state) => this.universe.setCell(x, y, newState),
      `<val>état = ${newState}</val>`
    ]
  }

  new(condition, result) {
    this.stack.push({
      condition: condition[0],
      result: result[0]
    })

    this.verbatim.push({
      condition: condition[1],
      result: result[1]
    })
  }

  filter(matrix) {
    let className = ""
    if(matrix.length > 1) className = " class='squared'"
    return [
      (x, y , state) => this.universe.matchCell(x,y,matrix),
      `<val${className}>${drawMatrix(matrix)}</val>`
    ]
  }

  distrib(matrix) {
    return [
      (x, y , state) => {
        let around = this.universe.neighbours(x,y, matrix, this.default()[0])
        console.log(around)
        this.universe.setCell(x, y, state - around.length)
        this.universe.drawCell(x, y)
        
        around.forEach(coords => {
          let [vx, vy] = coords
          let neighbour = this.universe.findCell(vx, vy)
          this.universe.setCell(vx, vy, neighbour + 1)
          this.universe.drawCell(vx, vy)
        })
      },
      `<val>distribue</val> SUR <val class="squared"> ${drawMatrix(matrix)}</val>`
    ]
  }

  clone(matrix) {
    return [
      (x, y , state) => {
        let around = this.universe.neighbours(x,y,matrix,this.default()[0])
        this.universe.setCell(x, y, 0)
        this.universe.drawCell(x, y)

        around.forEach(coords => {
          let [vx, vy] = coords
          this.universe.setCell(vx, vy, state)
          this.universe.drawCell(vx, vy)
        })
      },
      `<val>clone</val> SUR <val class="squared"> ${drawMatrix(matrix)}</val>`
    ]
  }

  apply(x, y , state) {
    let effects = []
    
    for(let rule of this.stack) {
      if(rule.condition(x, y , state)) {
        effects.push(() => rule.result(x, y, state))
      }
    }

    return effects
  }
}