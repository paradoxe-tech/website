const axios = require('axios');
const fs = require("fs");

module.exports.run = (app, apiPath, localHostPath) => {

  app.get(apiPath + '/videos', async (req, res) => {
    const subscriptions = JSON.parse(fs.readFileSync(localHostPath + '/data/plists.json'))
    let allVids = []
    let api = "AIzaSyBU7tSt5LU1J6mylay_RYLfr2pdNwpsI-w"

    for(let subscription of subscriptions) {
      let pId = subscription.id
      let url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${pId}&key=${api}`

      let playlist = await axios.get(url)
      playlist = playlist.data
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

  app.post(apiPath + '/answer/:formId', (req, res) => {
    let filePath = localHostPath + `/data/forms/${req.params.formId}.json`
    let formData = JSON.parse(fs.readFileSync(filePath))

    formData.results[req.body.user] = req.body.answer
    fs.writeFileSync(filePath, JSON.stringify(formData, null, "\t"))

    res.end()
  })

  app.get(apiPath + '/forms', (req, res) => {
    let allForms = []
    
    for(let formFileName of fs.readdirSync(localHostPath + "/data/forms")) {
      let formId = formFileName.replaceAll('.json', '')
      let form = JSON.parse(fs.readFileSync(localHostPath + "/data/forms/" + formFileName))
      let formTitle = form.content.find(block => block.type == "title")
      if(!formTitle.text) formTitle = "No title found"
      formTitle = formTitle.text

      allForms.push({
        id: formId,
        title: formTitle,
        blocks: form.content.length,
        results: Object.keys(form.results).length
      })
    }

    res.json(allForms)
  })
}