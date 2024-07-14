let VANTA = new Vanta()

function closeAllWindows() {}

function switch_render() {
  document.querySelector('#rendered-content').innerHTML = VANTA.output()
  document.querySelector('#raw-content').classList.toggle("hidden")
  document.querySelector('#rendered-content').classList.toggle("hidden")
  document.querySelector('#content-container').scrollTo(0, 0)
  hljs.highlightAll()
  udpate(VANTA.rawtext)
  VANTA.footnotes()
}

function udpate(text) {
  VANTA.input(text)
  let summary = VANTA.summary()
  if(summary) {
    document.querySelector('#summary').classList.remove('hidden')
    document.querySelector('#summary').innerHTML = "<h1>Sommaire</h1>" + summary
  } else document.querySelector('#summary').classList.add('hidden')

  let definitions = VANTA.definitions()
  if(definitions) {
    document.querySelector('#definitions').classList.remove('hidden')
    document.querySelector('#definitions').innerHTML = "<h1>Définitions</h1>" + VANTA.definitions()
  } else document.querySelector('#definitions').classList.add('hidden')

  let footnotes = VANTA.footnotes()
  if(footnotes) {
    document.querySelector('#footnotes').classList.remove('hidden')
    document.querySelector('#footnotes').innerHTML = "<h1>Références</h1>" + VANTA.footnotes()
  } else document.querySelector('#footnotes').classList.add('hidden')
}

function switch_theme() {
  document.body.classList.toggle('light')
}

function load_utf8() {
  let fileuploader = document.querySelector('#fileuploader')
  let textarea = document.querySelector('#raw-content')

  var file = fileuploader.files[0]
  if (!file) return alert('Aucun fichier importé.')
  let extension = file.name.split('.').pop()
  let accepted_ext = ['vanta', 'md', 'txt']
  if (!accepted_ext.includes(extension)) return alert(`l\'extension de fichier n\'est pas reconnue.`)

  var fileReader = new FileReader()

  fileReader.onload = function(fileLoadedEvent) {
    textarea.innerHTML = fileLoadedEvent.target.result
    VANTA.input(fileLoadedEvent.target.result)
    switch_render()
    
    if(document.querySelector('#rendered-content').classList.contains('hidden')) {
      switch_render()
    } 

    closeAllWindows()
  }

  

  fileReader.readAsText(file, "UTF-8")
}

function save_utf8() {
  let ext = document.querySelector('#filetype-save').value
  let name = document.querySelector('#filename-export').value
  let blob = new Blob([VANTA.rawtext], { type: "text/plain;charset=utf-8" })
  _global.saveAs(blob, `${name}${ext}`)
}

function switch_save() {
  if (document.querySelector('#filetype-save').value == ".pdf") save_pdf()
  if (document.querySelector('#filetype-save').value == ".html") save_html()
  else save_utf8()
}

function switch_file() {
  document.querySelector('#filemenu').classList.toggle('hidden')

  if (document.querySelector('#files-button').name !== "folder-outline") {
    document.querySelector('#files-button').name = "folder-outline"
  } else {
    document.querySelector('#files-button').name = "folder-open-outline"
  }
}

document.querySelector('#filed-drop').addEventListener('click', () => {
  document.querySelector('#fileuploader').click()

  document.querySelector('#fileuploader').addEventListener('change', () => {
    closeAllWindows()
    load_utf8()
  })
})

function closeAllWindows(not) {
  if (not !== "files" && !document.querySelector('#filemenu').classList.contains('hidden')) {
    switch_file()
  }
  if (not !== "widget" && !document.querySelector('#widgetmenu').classList.contains('hidden')) {
    switch_widget()
  }
  if (not !== "wopt" && !document.querySelector('#widgetoptions').classList.contains('hidden')) {
    document.querySelector('#widgetoptions').classList.toggle('hidden')
  }
  if (not !== "pres" && !document.querySelector('#presmenu').classList.contains('hidden')) {
    switch_pres()
  }
  if (not !== "dico" && !document.querySelector('#dicomenu').classList.contains('hidden')) {
    switch_dico()
  }
}