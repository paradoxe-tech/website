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

app.listen(8080)