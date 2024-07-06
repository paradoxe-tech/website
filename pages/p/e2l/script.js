class Carroussel {
  constructor(selector) {
    this.element = document.querySelector(selector)
    this.index = 0
    this.config = {
      around: 2,
      elWidth: 225,
      gap: 10,
      n: 5
    }
  }

  goto(i) {
    if(i < 1 || i > this.config.n) return
    this.index = i
    
    let scroll = -(this.config.elWidth + this.config.gap) * (i - 1) 
    scroll += this.config.around * (this.config.elWidth + this.config.gap)
    
    if(i == 1) scroll += this.config.gap
    
    this.element.style.left = `${scroll}px`
  }

  next() {
    this.goto(this.index + 1)
  }

  prev() {
    this.goto(this.index - 1)
  }
}

let carr = new Carroussel(".carroussel")
carr.goto(3)