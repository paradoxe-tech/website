const { mathscript } = require("../pages/h/wiki/cdn/res/mathscript.js")
const fs = require("fs")
const showdown  = require('showdown')
let mdToHTML = new showdown.Converter()
mdToHTML.setOption("tables", true)

module.exports.run = (app, apiPath, localHostPath) => {

  let hostPath = localHostPath.replaceAll('pages', '')
  
  
  const htmlBASE = fs.readFileSync(localHostPath + '/cdn/res/template.html', "utf8")

  
  app.use(apiPath + "/allPages", (req, res) => {
    let pages = []
    for(let pageName of fs.readdirSync(localHostPath + '/pages/fr')) {
      pages.push(preview(pageName.split('.')[0], localHostPath))
    }

    res.json(pages)
  })

  app.use(hostPath + '/:language/:page', (req, res) => {
    var fileContents;
    try {

      fileContents = fs.readFileSync(localHostPath + `/pages/${req.params.language}/${req.params.page}.md`, "utf8")
      fileContents = fileContents.replaceAll(' "', " « ")
      fileContents = fileContents.replaceAll('" ', " » ")
      fileContents = fileContents.replaceAll("__ASSETS__", `../cdn/assets`)
      let htmlBody = mdToHTML.makeHtml(handleMaths(fileContents));

      res.setHeader('content-type', 'text/html');
      let htmlFinal = htmlBASE.replace('__ARTICLE_BODY__', htmlBody)
      htmlFinal = htmlFinal.replace('__PAGE_NAME__', req.params.page.replaceAll('_', ' '))
      htmlFinal = htmlFinal.replace('__SUMMARY__', findSummary(fileContents))
      htmlFinal = handleLocalLinks(htmlFinal)
      res.send(htmlFinal)

    } catch (err) {
      if(err.code == "ENOENT") {
        res.setHeader('content-type', 'text/plain');
        res.send("404 not Found")
      } else {
        console.log(err)
        res.end('Unknown Error')
      }
    }
  })
}

const dfltPreview = {
  title: "No Title Found",
  desc: "No desc Found",
  cover: "cdn/assets/404.png"
}

function preview(pageName, basePath) {
  let rawFile = fs.readFileSync(basePath + `/pages/fr/${pageName}.md`, "utf8")
  let hostPath = basePath.replaceAll('pages', "")
  rawFile = rawFile.replaceAll("__ASSETS__", hostPath + `/cdn/assets`)
  let obj = Object.assign({}, dfltPreview)
  
  for(let line of rawFile.split('\n')) {
    if(dfltPreview.title == obj.title && line.startsWith("#")) {
      obj.title = line.replaceAll('#', "").trim()
    }
    else if(dfltPreview.cover == obj.cover && line.startsWith("!")) {
      obj.cover = Array.from(line.matchAll(/\!\[.*\]\((.+)\)/gm), m => m[1])
    } else if(dfltPreview.desc == obj.desc && line.length > 10) {
      let rawDesc = line.replaceAll('{$', '')
      rawDesc = rawDesc.replaceAll('}', '')
      rawDesc = rawDesc.replaceAll('{', '')
      let desc = mdToHTML.makeHtml(rawDesc.trim())
      obj.desc = desc
    }
  }

  return obj
}

function handleLocalLinks(html) {
  let string = html
  let inCBrackets = false
  let wordCache = ""

  for(let char of html) {
    if(char == "{") inCBrackets = true
    else if(char == "}") {
      let base = wordCache.startsWith('$') ? "https://wikiwand.com/fr/" : ""
      let word = wordCache.replaceAll('$;', "")
      word = word.replaceAll('$', "")

      let linkpath = word.replaceAll(' ', '_')
      linkpath = linkpath[0].toUpperCase() + linkpath.slice(1)
      let link = `<a href="${base}${linkpath}">${word}</a>`

      string = string.replaceAll(`{${word}}`, link)
      string = string.replaceAll(`{$${word}}`, link)
      inCBrackets = false
      wordCache = ""
    }
    else {
      if(inCBrackets) wordCache += char
    }
  }

  return string
}

function findSummary(raw) {
  let string = ""

  for(let line of raw.split('\n')) {
    if(line.startsWith('#')) {
      let level = (line.match(new RegExp("#", "g")) || []).length
      let text = line.replaceAll('#', '').replace(' ', '')
      let tag = formatString(text)
      string += `<a onclick="scrollToAnchor('${tag}')" class="level-${level}">${text}</a>`
    }
  }

  return string
}

function formatString(text) {
  let string = text.replaceAll(' ', '').toLowerCase()
  string = string.replaceAll("'", '')
  string = string.replaceAll("à", '')
  string = string.replaceAll("é", '')

  return string
}

function handleMaths(raw) {

  for(let mathBlock of (raw.match(/<maths>.*?<\/maths>/gs) || [])) {
    if(!mathBlock) continue
    let expression = mathBlock.replaceAll('<maths>', '')
    expression = expression.replaceAll('</maths>', '')

    let baseExpr = expression.split('\n').filter(exp => exp.length)
    expression = "(" + baseExpr.join(')  (') + ")"
    expression = expression.replaceAll('()', '')

    let maths = mathscript(expression)
    raw = raw.replaceAll(mathBlock, `<maths>${maths}</maths>`)
  }

  return raw
}