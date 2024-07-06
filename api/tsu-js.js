const fs = require("fs");

module.exports.run = (app, apiPath, localHostPath) => {
  app.get(apiPath + '/data', async (req, res) => {
    let data = JSON.parse(fs.readFileSync(localHostPath + "/cdn/data/classes.json"))
    res.json(data)
  })
}