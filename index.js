const express = require('express')
const fs = require('fs')

let app = express()

app.use('/', express.static('home'))
app.use('/cdn', express.static('cdn'))
app.use('/', express.static('pages'))


for(let api of fs.readdirSync('./api')) {
  let apiName = api.replaceAll(".js", "")
  let apiPath = `/api/${apiName}`
  let hostPath = `/h/${apiName}`
  let localHostPath = `pages/h/${apiName}`
  let { run } = require(`./api/${api}`)
  
  app.use(hostPath, express.static(localHostPath + "/public"))
  
  run(app, apiPath, localHostPath)
}

app.get("/discord", (req, res) => res.redirect(`https://discord.gg/wxnsMRVqwa`))
app.get("/i", (req, res) => res.redirect(`/#avatar`))

app.listen(8080)