String.prototype.format = function (...vars) {
  res = this;

  for (const e of vars) {
    res = res.replace("{}", e);
  }

  return res;
};

Array.prototype.random = function () {
  return this[Math.floor(Math.random() * this.length)];
};

Array.prototype.remove = function (...indexes) {
  i = 0;

  for (var e of indexes) {
    this.splice(e - i, 1);
    i += 1;
  }

  return this;
};

const sleep = async function (ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const randomColor = function () {
  return `#${("00000" + ((Math.random() * (1 << 24)) | 0).toString(16)).slice(
    -6
  )}`;
};

Array.prototype.shuffle = function () {
  let i = this.length,
    r;

  while (i != 0) {
    r = Math.floor(Math.random() * i);
    i--;

    [this[i], this[r]] = [this[r], this[i]];
  }

  return this;
};

Array.prototype.filterNot = function (compFunc) {
  let res = [];

  for (var element of this) {
    if (!compFunc(element)) res.push(element);
  }

  return res;
};

String.prototype.without = function (chars) {
  res = this;

  for (var char of chars) {
    res = res.replaceAll(char, "");
  }

  return res;
};

function polygon_dots(sides, centre, radius, rotation) {
  let one_segment = (Math.PI * 2) / sides;

  let points = [];

  if (!radius) radius = 150;
  if (!rotation) rotation = 0;
  if (!centre) centre = [0, 0];

  for (var i = 0; i < sides; i++) {
    let x = Math.sin(one_segment * i + rotation) * radius;
    let y = Math.cos(one_segment * i + rotation) * radius;
    points.push([x + centre[0], y + centre[1]]);
  }

  return points;
}

function range(stop, start = 0, step = 1) {
  let res = [];

  for (var i = start; i < stop; i += step) {
    res.push(i);
  }

  return res;
}

class Tree {
  constructor(config) {
    this.rootchilds = config.rootchilds || true;
    this.rootname = config.rootname || "root";
    this.double_indent = config.double_indent || false;
    this.child_property = config.child_property || "childs";
    this.data = this.#formatArray(config.sequence);
    this.line_width = config.line_width || 50;
    this.string = this.#clean(this.#build());
  }

  #formatArray(sequence, child_prop = this.child_property) {
    if (!sequence || sequence.length === 0) return {};

    let array = [];

    if (Array.isArray(sequence) && !this.rootobj) {
      for (var child of sequence) {
        let obj = {};
        obj.name = typeof child !== "object" ? child : child.name;
        obj.childs =
          typeof child === "object"
            ? this.#formatArray(child[child_prop], "childs")
            : {};
        array.push(obj);
      }
    } else if (!this.rootchilds) {
      for (var key of Object.keys(sequence)) {
        let obj = {};
        obj.name = sequence[key].name ? sequence[key].name : key;
        obj.childs = this.#formatArray(sequence[key][child_prop], "childs");
        array.push(obj);
      }
    } else {
      for (var key of Object.keys(sequence)) {
        let obj = {};
        obj.name = key;
        obj.childs = this.#formatArray(sequence[key]);
        array.push(obj);
      }
    }

    return array;
  }

  #build(array = this.data, init_text = "", level_indent = 0) {
    let COLS = array.length;

    let indent = "";

    for (var level = 0; level < level_indent; level++) {
      indent += "│    ";
    }

    for (var i = 0; i < COLS; i++) {
      let angle = i === COLS - 1 ? "└" : "├";
      let end = "\n";

      let double_indent = this.double_indent ? `${indent}│\n` : "";
      init_text += `${double_indent}${indent}${angle}────${array[i].name}${end}`;

      let childs = array[i]["childs"];

      if (childs) {
        if (childs.length !== 0) {
          init_text = this.#build(
            array[i]["childs"],
            init_text,
            level_indent + 1
          );
        }
      }
    }

    return init_text;
  }

  #calcCorners(lines, col) {
    let end = 0;

    for (var line of lines) {
      let char = line[col];

      if (char === "└") {
        end += 1;
      }
    }

    return end;
  }

  #clean(string) {
    const len_cols = this.line_width;

    let lines = string.split(`\n`);
    lines.pop();

    for (var i = 0; i < lines.length; i++) {
      lines[i] = lines[i].padEnd(len_cols, " ");
    }

    let is_ended = {};
    let corners = {};
    let dead = {};

    for (var i = 0; i < len_cols; i++) {
      is_ended[i] = false;
      corners[i] = 0;
      dead[i] = this.#calcCorners(lines, i);
    }

    let last_char = "├";

    for (var colonne = 0; colonne < len_cols; colonne++) {
      for (var l = 0; l < lines.length; l++) {
        let line = lines[l];
        let char = line[colonne];
        let next_char = l === lines.length - 1 ? "" : lines[l + 1][colonne];

        if (is_ended[colonne]) {
          let _line = Array.from(line);
          if (char === "│") _line[colonne] = " ";
          lines[l] = _line.join("");
          continue;
        }

        if (char === "└") {
          corners[colonne] += 1;
          if (corners[colonne] === dead[colonne] && corners[colonne] !== 0)
            is_ended[colonne] = true;
        }

        if (last_char === " " || last_char === "└") {
          if (char === "│") {
            let _line = Array.from(line);
            _line[colonne] = " ";
            lines[l] = _line.join("");
            last_char = " ";
            continue;
          }
        } else if (next_char.match(/[A-Za-z]/g)) {
          if (char === "│") {
            let _line = Array.from(line);
            _line[colonne] = " ";
            lines[l] = _line.join("");
            last_char = " ";
            continue;
          }
        }

        last_char = char;
      }
    }

    return `${this.rootname}\n` + lines.join("\n");
  }
}

class Fraction {
  constructor(param) {
    if (typeof param == "number") {
      this.decimal = param;
      this.numerator = this.decimal;
      this.denominator = 1;
      this.string = `${this.numerator}/${this.denominator}`;
      this.simplify();
    } else if (typeof param == "string") {
      this.numerator = param.split("/")[0];
      this.denominator = param.split("/")[1];
      this.decimal = this.numerator / this.denominator;
      this.string = `${this.numerator}/${this.denominator}`;
    } else if (param instanceof Fraction) {
      this.numerator = param.numerator;
      this.denominator = param.denominator;
      this.decimal = param.decimal;
      this.string = `${this.numerator}/${this.denominator}`;
    }
  }

  simplify() {
    this.numerator *= 10 ** 5;
    this.denominator *= 10 ** 5;

    let hcf = 0;

    for (let i = 1; i <= this.denominator && i <= this.numerator; i++) {
      if (this.denominator % i == 0 && this.numerator % i == 0) {
        hcf = i;
      }
    }

    if (hcf) {
      this.numerator = this.numerator / hcf;
      this.denominator = this.denominator / hcf;
      this.string = `${this.numerator}/${this.denominator}`;
    }
  }
}

function get(yourUrl){
  var Httpreq = new XMLHttpRequest();
  Httpreq.open("GET",yourUrl,false);
  Httpreq.send(null);
  return Httpreq.responseText;
}