function setupGL(gl) {
  const program = gl.createProgram();
  gl.attachShader(program, createShader(gl, gl.VERTEX_SHADER, vertexShader.textContent));
  gl.attachShader(program, createShader(gl, gl.FRAGMENT_SHADER, fragmentShader.textContent));
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw gl.getProgramInfoLog(program);
  }
  gl.useProgram(program);
  return program
}

function createShader(gl, type, sourceCode) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, sourceCode.trim());
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw gl.getShaderInfoLog(shader);
  }
  return shader;
}

function square(uni, x, y, w, h, color) {
  let program = uni.program
  let gl = uni.gl

  x /= uni.width / 2
  y /= uni.height / 2
  w /= uni.width / 2
  h /= uni.height / 2

  x = -1 + x
  y = 1 - y

  gl.enable(gl.SCISSOR_TEST);
  gl.scissor(x, y, w, h);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.disable(gl.SCISSOR_TEST);

  let vertices = [
    [x, y],
    [x+w, y],
    [x, y-h],
    [x+w, y-h],
  ]
  
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices.flat()), gl.STATIC_DRAW);

  const vertexPosition = gl.getAttribLocation(program, "vertexPosition");
  gl.enableVertexAttribArray(vertexPosition);
  gl.vertexAttribPointer(vertexPosition, vertices[0].length, gl.FLOAT, false, 0, 0);

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertices.length);
}