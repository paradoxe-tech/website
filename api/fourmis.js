const fs = require("fs")

module.exports.run = (app, apiPath, loacalHostPath) => {
  
  const fourmis = JSON.parse(fs.readFileSync(loacalHostPath + "/" + 'database.json'))

  app.get(apiPath + '/all', (req, res) => {
    res.set('Content-Type', 'application/json')
    res.end(Buffer.from(JSON.stringify(fourmis)))
  })

  app.get(apiPath + '/:genre/:species', (req, res) => {
    let fourmi = fourmis.find(f => {
      if (f.genre.toLowerCase() !== req.params.genre.toLowerCase()) return false
      if (f.espece.toLowerCase() !== req.params.species.toLowerCase()) return false
      return true
    })

    res.set('Content-Type', 'application/json')
    res.end(Buffer.from(JSON.stringify(fourmi)))
  })
}