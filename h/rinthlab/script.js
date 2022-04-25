function createBlankMaze() {

  var rowIndex, colIndex;

  var table = document.createElement("table");
  var tbody = document.createElement("tbody");

  for (rowIndex = 1; rowIndex <= mazeHeight; rowIndex++) {

    var row = document.createElement("tr");

    for (colIndex = 1; colIndex <= mazeWidth; colIndex++) {

      var col = document.createElement("td");
      if (rowIndex == 1 && colIndex == 1) {

        col.style.backgroundColor = "rgb(244,0,0)";
        col.setAttribute("type", "start");

      } else if (rowIndex == mazeHeight && colIndex == mazeWidth) {

        col.style.backgroundColor = "rgb(0,244,0)";
        col.setAttribute("type", "finish");

      } else {

        col.style.backgroundColor = "black";

      }
      col.setAttribute("id", "cell_" + (colIndex -1) + "_" + (rowIndex -1));
      col.setAttribute("class", "cells");


      row.appendChild(col);

    }

    tbody.appendChild(row);

  }

  table.appendChild(tbody);

  document.getElementById("maze_container").appendChild(table);

}

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);


var mazeWidth = urlParams.get("size") || 50
var mazeHeight = mazeWidth;

window.addEventListener("load", () => {
  let lab = new Lab(mazeWidth)
  lab.load()
});

createBlankMaze()