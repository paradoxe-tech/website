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

let embeds = new Map(Object.entries(JSON.parse(fs.readFileSync('./cdn/data/redirect.json'))))

for (let host of embeds.keys()) {
  app.use(`/h/${host}`, (req, res) => {
    let rawHTML = `<!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width">
            <title>h/${host} | CMK.</title>
            <link href="../cdn/styles/rules.css" rel="stylesheet" type="text/css" />
            <link rel="icon" href="../../cdn/assets/branding/logo.png">
          </head>
          <body style='margin: 0px;overflow: hidden;'>
            <div id="filigrane">
              <img src="../../cdn/assets/branding/logo.png">
              <p>
                You are viewing <cyan>callmekitsu.com/</cyan><pink>h/${host}</pink><br/>
                All Rights Reserved, (C) CallMeKitsu. 2020-2023<br/>
                matheo.tripnauxmoreau@gmail.com for any ask.<br/>
              </p>
            </div>
            <div> 
              <object type="text/html" data="${embeds.get(host)}" 
              style="height: 100vh;width: 100%;overflow:auto;">
              </object>
            </div>

            <script src="../cdn/filigrane.js"></script>
          </body>
        </html>`

    res.set('Content-Type', 'text/html');
    res.send(Buffer.from(rawHTML));
  })
}

app.get("/discord", (req, res) => res.redirect(`https://discord.gg/wxnsMRVqwa`))

app.listen(8080)