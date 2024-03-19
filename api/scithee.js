const fetch = require("node-fetch")
const fs = require("fs");

module.exports.run = (app, apiPath, localHostPath) => {

  app.get(apiPath + '/videos', async (req, res) => {
    const subscriptions = JSON.parse(fs.readFileSync(localHostPath + '/data/plists.json'))
    let allVids = []
    let api = "AIzaSyBU7tSt5LU1J6mylay_RYLfr2pdNwpsI-w"

    for(let subscription of subscriptions) {
      let pId = subscription.id
      let url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${pId}&key=${api}`

      let playlist = await fetch(url)
      playlist = await playlist.json()
      if(!playlist) return res.json({})

      for (let video of playlist.items) {

        let title = subscription.unwrap ? video.snippet.title : subscription.title
        let id = subscription.unwrap ? video.snippet.resourceId.videoId : pId

        allVids.push({
          unwrap: subscription.unwrap,
          title: title,
          id: id,
          author: video.snippet.videoOwnerChannelTitle,
          author_id: video.snippet.videoOwnerChannelId,
          cover: video.snippet.thumbnails.high.url,
          tags: subscription.tags,
          n: subscription.unwrap ? null : playlist.items.length
        })

        if(!subscription.unwrap) break
      }
    }

    res.json(allVids)
  })

  app.get(apiPath + '/register/:discordId', (req, res) => {
    let filePath = localHostPath + '/data/users.json'
    let data = JSON.parse(fs.readFileSync(filePath))
    data.push({ id: req.params.discordId, account: 0, done: [] })

    fs.writeFileSync(filePath, JSON.stringify(data, null, "\t"))

    res.end()
  })

  app.post(apiPath + '/set/:discordId/:qId/:choice', (req, res) => {
    let filePath = localHostPath + '/data/cards.json'
    let data = JSON.parse(fs.readFileSync(filePath))
    let index = data.indexOf(data.find(x => x.id == req.params.qId))

    if (data[index]["answers"][req.params.choice]) {
      data[index]["answers"][req.params.choice] += 1
    } else {
      data[index]["answers"][req.params.choice] = 1
    }

    fs.writeFileSync(filePath, JSON.stringify(data, null, "\t"))

    filePath = localHostPath + '/data/users.json'
    let users = JSON.parse(fs.readFileSync(filePath))
    index = users.indexOf(users.find(x => x.id == req.params.discordId))
    users[index].account += 1
    users[index].done.push(req.params.qId)

    fs.writeFileSync(filePath, JSON.stringify(users, null, "\t"))

    res.end()
  })
}