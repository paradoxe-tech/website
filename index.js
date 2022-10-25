const http = require('http')
const express = require('express')
const path = require('path')
const showdown = require('showdown')
const converter = new showdown.Converter()
const fs = require('fs')
const bodyParser = require("body-parser")

let app = express()

app.use('/', express.static('home'))
app.use('/cdn', express.static('cdn'))
app.use('/', express.static('pages'))

let redirects = [
  ["/h/paleossena", "paleossena"],
  ["h/gate", "gate-serv"],
  ["h/graphsandbox", "graphsandbox"]
]

app.get("/h/paleossena", (req, res) => res.redirect(`https://paleossena.kitsuforyou.repl.co`))
app.get("/h/gate", (req, res) => res.redirect(`https://gate-serv.kitsuforyou.repl.co`))
app.get("/h/graphsandbox", (req, res) => res.redirect(`https://graphsandbox.kitsuforyou.repl.co`))
app.get("/h/kawan", (req, res) => res.redirect(`https://github.com/callmekitsu/kawan`))
app.get("/h/tsu-js", (req, res) => res.redirect(`https://callmekitsu.github.io/tsu.js`))

app.listen(8080)