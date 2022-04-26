function createBlankMaze(type) {

  var rowIndex, colIndex;

  var table = document.createElement("table");
  var tbody = document.createElement("tbody");

  for (rowIndex = 1; rowIndex <= mazeHeight; rowIndex++) {

    var row = document.createElement("tr");

    for (colIndex = 1; colIndex <= mazeWidth; colIndex++) {

      var col = document.createElement("td");

      col.style.backgroundColor = "black";

      col.setAttribute("id", type + "_cell_" + (colIndex -1) + "_" + (rowIndex -1));
      col.setAttribute("class", "cells");


      row.appendChild(col);

    }

    tbody.appendChild(row);

  }

  table.appendChild(tbody);

  document.getElementById(type).appendChild(table);

}

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
var mazeWidth = urlParams.get("size") || 51

if (mazeWidth % 2 === 0) {
  mazeWidth = `${parseInt(mazeWidth) + 1}`
}

var mazeHeight = mazeWidth;

window.addEventListener('load', () => {
  createBlankMaze("dfs")
  dfs = new DFS(mazeWidth, "dfs")
  dfs.load(1,1)
  createBlankMaze("prim")
  prim = new Prim(mazeWidth, "prim")
  prim.load(Math.floor(mazeHeight/2),Math.floor(mazeHeight/2))
})
