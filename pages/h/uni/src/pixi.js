const container = document.querySelector('#universe canvas')

const getMousePos = (event) => {
  const pos = { x: 0, y: 0 };
  if (container) {
    // Get the position and size of the component on the page.
    const holderOffset = container.getBoundingClientRect();
    pos.x = event.pageX - holderOffset.x;
    pos.y = event.pageY - holderOffset.y;
  }
  return pos;
};

const onPixiMouseDown = (e) => {
  const mousePosRef = getMousePos(e);
  initPointer = mousePosRef;
  
  let cnvDims = container.getBoundingClientRect()
  let x = Math.round((mousePosRef.x / cnvDims.width) * UNI.width)
  let y = Math.round((mousePosRef.y / cnvDims.height) * UNI.height)
  
  UNI.click(x, y, CLICK_TYPE)
};

let lastPos = null

container.addEventListener("mousedown", onPixiMouseDown, 0);
// container.addEventListener("wheel", (e) => zoom(e.deltaY, e.offsetX, e.offsetY), 0);
container.addEventListener("mousemove", (e) => {
  if(lastPos) {
    stage.x += (e.offsetX-lastPos.x);
    stage.y += (e.offsetY-lastPos.y);  
    lastPos = {x:e.offsetX,y:e.offsetY};
  }
}, 0);

function zoom(s, x, y) {
  s = s > 0 ? 2 : 0.5;
  let stage = UNI.pixi.stage
  
  var worldPos = {x: (x - stage.x) / stage.scale.x, y: (y - stage.y)/stage.scale.y};
  var newScale = {x: stage.scale.x * s, y: stage.scale.y * s};

  var newScreenPos = {x: (worldPos.x ) * newScale.x + stage.x, y: (worldPos.y) * newScale.y + stage.y};

 // stage.x -= (newScreenPos.x-x) ;
 // stage.y -= (newScreenPos.y-y) ;
  stage.scale.x = newScale.x;
  stage.scale.y = newScale.y;

  UNI.pixi.render()
};