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

app.get("/h/paleossena", (req, res) => res.redirect(`https://paleossena.kitsuforyou.repl.co`))
app.get("/h/gate", (req, res) => res.redirect(`https://gate-serv.kitsuforyou.repl.co`))
app.get("/h/graphsandbox", (req, res) => res.redirect(`https://graphsandbox.kitsuforyou.repl.co`))
app.get("/h/kawan", (req, res) => res.redirect(`https://github.com/callmekitsu/kawan`))
app.get("/h/tsu-js", (req, res) => res.redirect(`https://callmekitsu.github.io/tsu.js`))
app.get("/h/weapons", (req, res) => res.redirect(`https://weapons.kitsuforyou.repl.co`))
app.get("/h/alterheart", (req, res) => res.redirect(`https://alterheart.kitsuforyou.repl.co`))
app.get("/h/DRPC", (req, res) => res.redirect(`https://github.com/CallMeKitsu/DiscordRPC/releases`))
app.get("/h/uni", (req, res) => res.redirect(`https://uni.kitsuforyou.repl.co/create`))

app.get("/discord", (req, res) => res.redirect(`https://discord.gg/wxnsMRVqwa`))

app.listen(8080)