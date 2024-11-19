const express = require('express')
const req = require('express/lib/request')
const fs = require('fs')
let app = express()
const path = require('path')

app.use(express.json())

app.get('/.well-known/discord', (req, res) => res.send(process.env.DISCORD_RECORD))
app.get("/discord", (req, res) => res.redirect(`https://discord.gg/KkW88YnheT`))
app.get("/i", (req, res) => res.redirect(`/#about`))

app.get("/u/:username", (req, res) => {
  let users = JSON.parse(fs.readFileSync('cdn/data/users.json'))
  let user = users.find(x => x.username == req.params.username)
  if(!user) res.end(`No user called @${req.params.username} here.`)
  res.render('user.ejs', user)
})

for(let api of fs.readdirSync('./api')) {
  let apiName = api.replaceAll(".js", "")
  let apirelPath = `/api/${apiName}`
  let localHostrelPath = `pages/h/${apiName}`
  let { run } = require(`./api/${api}`)

  run(app, apirelPath, localHostrelPath)
}

const LAW_PAGES = fs.readdirSync('law')

function isLawPage(path) {
  for(let lawpage of LAW_PAGES) {
    if(path.includes(lawpage)) return true
  }

  return false
}

function getRelPath(req, res) {
  let relPath = req.url
  let root = !req.url.replace('/', '').includes('/')

  if(req.url == "/" || (root && req.url.includes('.'))) relPath = "home" + relPath
  if(req.url.match(/\/[a-z](\/|$)/gm)) relPath = "pages" + relPath
  if(isLawPage(relPath)) relPath = "law" + relPath

  if(!relPath.includes('.')) {
    if(relPath.endsWith('/')) relPath += "index.html"
    else res.redirect(req.url.replace('public', '') + "/")
  } else relPath = relPath.replace(/\/$/, '')

  if(relPath.startsWith('/')) relPath = relPath.replace('/', '')

  return relPath
}

app.use('/', (req, res) => {
  let relPath = getRelPath(req, res)
  console.log(`Trying to fetch [${relPath}]`)

  let file = readFile(relPath)
  if(file.length == 0) {
    if(relPath.match(/pages\/h\/[^\/]+\/[^\/]+\.(.+?)/gm)) {
      let file = relPath.replace(/\/$/, '').split('/')
      file = file[file.length - 1]
      let before = relPath.split(file)[0]
      let attempt = `${before}/public/${file}`
      if(readFile(attempt).length > 0) {
        relPath = attempt
        console.info(`\tNew path found at [${relPath}] working.`)
      }
      else res.redirect("https://" + req.get('host') + "/404")
    } else res.redirect("https://" + req.get('host') + "/404")
  }

  if(relPath.endsWith('html') && !relPath.startsWith('pages/h/')) {
    res.set('Content-Type', 'text/html');
    res.render('layout.ejs', {
      page: file
    })
  } else {
    try {
      res.sendFile(path.join(__dirname, relPath));
    } catch (err) {
      if(err.code === 'ENOENT') console.error(`\tNo file at [${relPath}] found.`);
      else if(err.code === 'EISDIR') console.error(`\tFile [${relPath}] isn't a directory.`);
      else throw err;
    }
  }
})

app.listen(8080)

function readFile(relPath) {
  let result = "";
  
  try {
    result = fs.readFileSync(relPath, 'utf8');
  } catch (err) {
    
    if(err.code === 'ENOENT') console.error(`\tNo file at [${relPath}] found.`);
    else if(err.code === 'EISDIR') console.error(`\tFile [${relPath}] isn't a directory.`);
    else throw err;
  }
  
  return result
}