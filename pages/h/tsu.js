Array.prototype.random = function() {
  return this[Math.floor(Math.random() * this.length)];
};

Array.prototype.remove = function(...indexes) {
  i = 0;

  for (var e of indexes) {
    this.splice(e - i, 1);
    i += 1;
  }

  return this;
};

const sleep = async function(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

Array.prototype.shuffle = function() {
  let i = this.length,
    r;

  while (i != 0) {
    r = Math.floor(Math.random() * i);
    i--;

    [this[i], this[r]] = [this[r], this[i]];
  }

  return this;
};

Array.prototype.filterNot = function(compFunc) {
  let res = [];

  for (var element of this) {
    if (!compFunc(element)) res.push(element);
  }

  return res;
};

String.prototype.without = function(chars) {
  res = this;

  for (var char of chars) {
    res = res.replaceAll(char, "");
  }

  return res;
};

Date.prototype.plus = function(duration) {
  return new Date(this.getTime() + duration.getTime())
}

Date.diff = function(momentA, momentB) {
  return momentA.getTime() - momentB.getTime()
}

Date.prototype.isToday = function(today = new Date()) {
  let day = this.getDate() === today.getDate()
  let month = this.getMonth() === today.getMonth()
  let year = this.getFullYear() === today.getFullYear()

  return day && month && year
}

Date.prototype.getWeek = function(weekStarts = 1) {
  
  let newYear = new Date(this.getFullYear(), 0, 1)
  let day = newYear.getDay() - weekStarts
  day = (day >= 0 ? day : day + 7)

  let daynum = Math.floor((this.getTime() - newYear.getTime() -
    (this.getTimezoneOffset() - newYear.getTimezoneOffset()) * 60000) / 86400000) + 1
  
  let weeknum = -1;

  if (day < 4) {
    weeknum = Math.floor((daynum + day - 1) / 7) + 1
    
    if (weeknum > 52) {
      nYear = new Date(this.getFullYear() + 1, 0, 1)
      nday = nYear.getDay() - weekStarts
      nday = nday >= 0 ? nday : nday + 7
      weeknum = nday < 4 ? 1 : 53;
    }
  } else {
    weeknum = Math.floor((daynum + day - 1) / 7)
  }
  
  return weeknum
}

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

function get(yourUrl) {

  var Httpreq = new XMLHttpRequest();
  Httpreq.open("GET", yourUrl, false);
  Httpreq.send(null);

  return Httpreq.responseText;

}

class Url {
  constructor(href) {
    this.protocol = href.split('://')[0]
    this.origin = href.split('/').slice(0, 3).join('/')
    this.path = href.split('://')[1].split('/').splice(1).join('/').split('#')[0].split('?')[0]
    this.hash = href.includes('#') ? href.split('#')[1].split('?')[0] : ""
    this.query = new Query(href)
    this.search = this.query.toString()
  }

  toString() {
    let path = this.path ? `/${this.path}` : ""
    let hash = this.hash ? `#${this.hash}` : ""
    let query = this.query.size ? this.query.toString() : ""

    return `${this.origin}${path}${hash}${query}`
  }

  request(TYPE) {
    let req = new XMLHttpRequest()
    req.open(TYPE, yourUrl, false)
    req.send(null)

    return req.responseText
  }
}

class Query extends Map {
  constructor(href) {
    super()

    if(!href.includes('?')) return 
    
    for (let q of href.split('?')[1].split('&')) {
      let param = q.includes("=") ? q.split('=')[0] : q
      let value = q.includes("=") ? q.split('=')[1] : true
      if (parseInt(value)) value = parseInt(value)

      this.set(param, value)
    }
  }

  toString() {
    let string = ""
    let sep = "?"
    for (let [param, value] of Array.from(this)) {
      if (value === true) string += `${sep}${param}`
      else string += `${sep}${param}=${value}`
      sep = "&"
    }

    return string
  }
}

class Color {

  #hue;
  #saturation;
  #luma;
  #alpha;

  constructor(hex) {
    this.hue = 0
    this.#saturation = 0
    this.#luma = 0
    this.#alpha = 0
    
    if (hex) this.fromHEX(hex)
  }

  fromRGB(red, green, blue, alpha = 1) {

    red /= 255
    green /= 255
    blue /= 255

    let cmin = Math.min(red, green, blue)
    let cmax = Math.max(red, green, blue)
    let delta = cmax - cmin
    let hue = 0

    if (delta == 0) hue = 0
    else if (cmax == red) hue = ((green - blue) / delta) % 6
    else if (cmax == green) hue = (blue - red) / delta + 2
    else hue = (red - green) / delta + 4
    hue = Math.round(hue * 60)
    if (hue < 0) hue += 360

    let luma = (cmax + cmin) / 2
    let sat = delta == 0 ? 0 : delta / (1 - Math.abs(2 * luma - 1))

    this.#luma = +(luma * 100).toFixed(2)
    this.#saturation = +(sat * 100).toFixed(2)
    this.#hue = hue
    this.#alpha = alpha

    return this

  }

  fromHEX(hex) {

    let r, g, b = 0
    let a = 1

    if (hex.length == 4) {
      r = parseInt(hex[1] + hex[1], 16)
      g = parseInt(hex[2] + hex[2], 16)
      b = parseInt(hex[3] + hex[3], 16)
    } else if (hex.length == 5) {
      r = parseInt(hex[1] + hex[1], 16)
      g = parseInt(hex[2] + hex[2], 16)
      b = parseInt(hex[3] + hex[3], 16)
      a = parseInt(hex[4] + hex[4], 16)
    } else if (hex.length == 7) {
      r = parseInt(hex[1] + hex[2], 16)
      g = parseInt(hex[3] + hex[4], 16)
      b = parseInt(hex[5] + hex[6], 16)
    } else if (hex.length == 9) {
      r = parseInt(hex[1] + hex[2], 16)
      g = parseInt(hex[3] + hex[4], 16)
      b = parseInt(hex[5] + hex[6], 16)
      a = parseInt(hex[7] + hex[8], 16)
    }

    a = a == 1 ? a : +(a / 255).toFixed(3)

    return this.fromRGB(r, g, b, a)
  }

  fromHSL(hue, saturation, luma, alpha = 1) {
    this.#hue = hue
    this.#saturation = saturation
    this.#luma = luma
    this.#alpha = alpha

    return this
  }

  random(options = {}) {
    return this.#randomHSL(options)
  }

  #randomRGB(options) {
    let alpha = options.alpha ? options.alpha : +(Math.random()).toFixed(2)

    let red = options.red ? options.red : Math.floor(Math.random() * 255)
    let green = options.green ? options.green : Math.floor(Math.random() * 255)
    let blue = options.blue ? options.blue : Math.floor(Math.random() * 255)

    return this.fromRGB(red, green, blue, alpha)
  }

  #randomHSL(options) {

    let alphaRange = options.alpha && typeof options.alpha == "object"
    let alphaMin = alphaRange ? options.alpha[0] : 0
    let alphaMax = alphaRange ? options.alpha[1] : 1
    let alpha = !alphaRange && options.alpha ? options.alpha : this.#rand(alphaMin, alphaMax, 2)

    let hueRange = options.hue && typeof options.hue == "object"
    let hueMin = hueRange ? options.hue[0] : 0
    let hueMax = hueRange ? options.hue[1] : 360
    let hue = !hueRange && options.hue ? options.hue : this.#rand(hueMin, hueMax, 0)

    let satRange = options.saturation && typeof options.saturation == "object"
    let satMin = satRange ? options.saturation[0] : 0
    let satMax = satRange ? options.saturation[1] : 100
    let saturation = !satRange && options.saturation ? options.saturation : this.#rand(satMin, satMax, 2)

    let lumRange = options.luma && typeof options.luma == "object"
    let lumMin = lumRange ? options.luma[0] : 0
    let lumMax = lumRange ? options.luma[1] : 100
    let luma = !lumRange && options.luma ? options.luma : this.#rand(lumMin, lumMax, 2)

    return this.fromHSL(hue, saturation, luma, alpha)
  }

  #rand(min, max, decimals) {
    if (decimals == 0) return Math.floor(Math.random() * (max - min)) - min
    return +((Math.random() * (max - min)) + min).toFixed(decimals)
  }

  toCSS() {
    return `hsla(${this.#hue}, ${this.#saturation}%, ${this.#luma}%, ${this.#alpha})`
  }

  copy() {
    return new Color().fromHSL(this.#hue, this.#saturation, this.#luma, this.#alpha)
  }

  add(prop, value) {
    this[`#${prop}`] += value

    return this
  }

  set(prop, value) {
    this[`#${prop}`] = value

    return this
  }
}

function post(yourUrl) {
  var Httpreq = new XMLHttpRequest();
  Httpreq.open("POST", yourUrl, false);
  Httpreq.send(null);
  return Httpreq.responseText;
}

console.info("Tsu.js correctement chargé !")