class PixiApp {
  constructor(config) {
    this.renderer = new PIXI.Renderer(config);

    this.stage = new PIXI.Container()
  }

  render() {
    this.renderer.render(this.stage);
  }
}