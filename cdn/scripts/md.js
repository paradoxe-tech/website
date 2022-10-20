function md(text, truncate) {
  
  res = text

  if(text.match(/\[(.*?)\]\((.*?)\)/g)) {
    for (const e of text.match(/\[(.*?)\]\((.*?)\)/g)) {
      let desc = e.match(/\[(.*?)\]/g)[0].replace(']', '').replace('[', '')
      let link = e.match(/\((.*?)\)/g)[0].replace('(', '').replace(')', '')
      res = res.replace(e, `<a style='color: #0ff;' href="${link}">${desc}</a>`)
    }
  }

  if( text.match(/\{(.*?)\}\((.*?)\)/g) ) {
    for (const e of text.match(/\{(.*?)\}\((.*?)\)/g)) {
      let txt = e.match(/\{(.*?)\}/g)[0].replace('}', '').replace('{', '')
      let tip = e.match(/\((.*?)\)/g)[0].replace('(', '').replace(')', '')
      res = res.replace(e, `<cyan><a title="${tip.replace("'", "\'").replace('"', '\"')}" style='color: white;cursor: help;'>${txt}</a></cyan>`)
    }
  }
  
  if(text.match(/(p\/)[^\s]+/g)) {
    for (const e of text.match(/(p\/)[^\s]+/g)) {
      let name = e.replace('p/', '')
      res = res.replace(e, `<pink><a style='color: #f0f;' href="${site_URL}/${e}/?embed">${e}</a></pink>`)
    }
  }

  if(text.match(/(h\/)[^\s]+/g)) {
    for (const e of text.match(/(h\/)[^\s]+/g)) {
      let name = e.replace('h/', '')
      res = res.replace(e, `<pink><a style='color: #f0f;' href="${site_URL}/${e}/">${e}</a></pink>`)
    }
  }

  if(text.match(/\s#[^\s]+/g)) {
    for (const e of text.match(/\s#[^\s]+/g)) {
      res = res.replace(e, ``)
    }
  }

  if(truncate) {
    if (res.length >= (truncate -3)) {
      res = res.slice(0, truncate - 3) + '...'
    }
    
  }

  return res
  
}