class Node {
  
  constructor({x, y, links, properties}, canvas, id, taille) {

    this.id = id
    this.x = x
    this.y = y
    this.properties = properties
    this.ctx = canvas

    this.TAILLE = taille

    let color = this.properties ? this.properties.color : "white"
    
    this.placeDot(color)

    if(links) {
      for (var node of links) {

        this.ctx.strokeStyle = 'white'
        this.ctx.moveTo(this.x, this.y)
        this.ctx.lineTo(node.x, node.y)
        
        this.ctx.stroke()
        
      }
    }

    if(this.properties && this.properties.name) {
      this.placeText(this.properties.fontStyle)
    }

  }

  rewrite() {
    let color = this.properties ? this.properties.color : "white"
    this.placeDot(color)
    this.placeText(this.properties.fontStyle)
  }

  placeText(font="10px Arial") {
    this.ctx.font = font;
    let mText =  this.ctx.measureText(this.properties.name).width
      
      let relx = this.x + 5
      let rely = this.y - 5

      if (this.x > this.TAILLE - mText - 5) {
        relx = this.x - 5 - mText
      }

      if(this.y < 50) {
        rely = this.y + 10
      }

      this.ctx.fillStyle = "black"
      this.ctx.fillRect(relx, rely - 8, mText, 10);
      this.ctx.fillStyle = "white"
      this.ctx.fillText(this.properties.name, relx, rely); 
  }

  placeDot(color) {
    this.ctx.beginPath()
    this.ctx.arc(this.x, this.y, 3, 0, 2 * Math.PI, true)
    this.ctx.fillStyle = color || "white"
    this.ctx.fill()
  }
}

class Graph {
  constructor(selector, taille) {
    
    this.canvas = document.getElementById(selector)
    if(!this.canvas) {
      this.canvas = document.createElement('canvas')
      this.canvas.id = selector
      document.querySelector('#main').appendChild(this.canvas)
    }

    this.TAILLE = taille


    this.canvas.width = this.TAILLE;
    this.canvas.height = this.TAILLE;
    
    this.ctx = this.canvas.getContext('2d')
    this.ctx.scale(1, 1);
    
    this.selector = selector
    this.nodes = []
    
  }

  node(node_config) {
    
    let node = new Node(node_config, this.ctx, this.nodes.length + 1, this.TAILLE)
    this.nodes.push(node)
    
    return node
    
  }

  link(compFunction1, compFunction2, color) {

    let g1 = this.nodes.filter(compFunction1)
    let g2 = this.nodes.filter(compFunction2)

    if(!g1 || !g2) return console.log('groups undefined')
    
    for (var selected_g1 of g1) {
      for (var selected_g2 of g2) {
        
        this.ctx.strokeStyle = color || 'white'
        this.ctx.moveTo(selected_g2.x, selected_g2.y)
        this.ctx.lineTo(selected_g1.x, selected_g1.y)
        
        this.ctx.stroke()
        
      }
    }
  }

  clear() {
    console.clear()
    this.nodes = []
    this.nodes.length = 0
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  setRandom(n, properties) {
    for (var i=0; i<n; i++) {
      let new_node = this.node({
        x: Math.floor(Math.random() * this.TAILLE),
        y: Math.floor(Math.random() * this.TAILLE),
        properties: properties || undefined
      })
    }
  }

  setClear(n, properties, radius) {

    let coords = polygon(n, radius)
    
    for (var i=0; i<n; i++) {
      let new_node = this.node({
        x: coords[i][0],
        y: coords[i][1],
        properties: properties || undefined
      })
    }
  }

  nodeClear(n, total, properties, radius, rotation, centre, startat) {
    
    let coords = polygon(total, radius, rotation, centre, startat)

      let new_node = this.node({
        x: coords[n][0],
        y: coords[n][1],
        properties: properties || undefined
      })

  }

  async complet(nodes_coords, latency) {

    let nodes = []
    
    for(var node_coords of nodes_coords) {
      let new_node = this.node({
        x: node_coords[0],
        y: node_coords[1],
        links: nodes
      })
      
      nodes.push(new_node)
      await sleep(latency)
    }
  }

  findNodes(compFunction) {
    return this.nodes.filter(compFunction)
  }

  polygon(n, radius) {
    let points = polygon(n, radius)

    for(var point of points) {
      this.node({
        x: point[0],
        y: point[1]
      })
    }

    let rel_zero = this.nodes.length - n
    
    for (var i = rel_zero + 1; i <= rel_zero + n; i++) {
      
    let next = i + 1
    if(i === rel_zero + n) next = rel_zero + 1
      
    this.link(
      x => x.id === i, 
      x => x.id === next
    )
  }

  return this.ctx
}
}

Array.prototype.deplace = function(x) {

  let res = this

  for (var i=0; i<x; i++) {
    let poped = res.pop()
    res.unshift(poped)
  }

  return res
}

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

let N = urlParams.get("size") || 10
let speed = urlParams.get("speed") || 200

async function complet(latency, nodesN) {
  let complet = new Graph('complet', 500)

  let liste = []
  
  for(var i=0; i < nodesN; i++) {
    liste.push([Math.floor(Math.random() * 490), Math.floor(Math.random() * 490)])
  }
  
  complet.complet(liste, latency)
}

function polygon(sides=4, radius=150, rotation=0, centre=[250, 250], startat=0) {
  let one_segment = Math.PI * 2 / sides

  let points = []
  
  for (var i=0; i<sides; i++) {
    let x = Math.sin(one_segment * i + rotation) * radius
    let y = Math.cos(one_segment * i + rotation) * radius
    points.push([ x + centre[0], y + centre[1] ])
  }

  return points.deplace(startat)
}