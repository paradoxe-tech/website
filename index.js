const express = require('express')
const fs = require('fs')

let app = express()
app.use(express.json())

app.use('/', express.static('home'))
app.use('/cdn', express.static('cdn'))
app.use('/', express.static('pages'))
app.use('/', express.static('law'))

for(let api of fs.readdirSync('./api')) {
  let apiName = api.replaceAll(".js", "")
  let apiPath = `/api/${apiName}`
  let localHostPath = `pages/h/${apiName}`
  let { run } = require(`./api/${api}`)
  
  run(app, apiPath, localHostPath)
}

for(let host of fs.readdirSync('./pages/h')) {
  app.use(`/h/${host}`, express.static(`./pages/h/${host}/public`))
}

app.get("/discord", (req, res) => res.redirect(`https://discord.gg/KkW88YnheT`))
app.get("/i", (req, res) => res.redirect(`/#avatar`))

app.use('*', (req, res) => {
  res.set('Content-Type', 'text/html');
  let html = fs.readFileSync('law/404/index.html', "utf-8")
  html = html.replaceAll('callmekitsu.com', req.hostname)
  res.status(404).send(Buffer.from(html));
});

app.listen(8080)