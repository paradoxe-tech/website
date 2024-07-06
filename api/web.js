const fs = require("fs")

module.exports.run = (app, apiPath) => {
  app.use(apiPath + "/users/register/:userId", (req, res) => {
    // `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}?size=128`
    let rawData = JSON.parse(fs.readFileSync('cdn/data/users.json'))
    let user = rawData.find(u => u.id == req.params.userId)
    if(user) return res.end("Already Registered")
    
    rawData.push({
      id: req.params.userId,
      account: 0,
      apis: {}
    })

    fs.writeFileSync('cdn/data/users.json', JSON.stringify(rawData, null, "\t"))

    res.end("Done")
  })

  app.use(apiPath + "/users", (req, res) => {
    res.json(JSON.parse(fs.readFileSync('cdn/data/users.json')))
  })
}