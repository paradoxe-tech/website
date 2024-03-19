let _USER_ = false
let _CACHEURL_ = ""

function login() {
  _CACHEURL_ = window.location.hash.slice(1)
  const params = new URLSearchParams(window.location.hash.slice(1));
  const token = params.get('access_token')
  const type = params.get('token_type')

  if(!token) return

  let XHTTP = new XMLHttpRequest();
  XHTTP.open( "GET", 'https://discord.com/api/users/@me', false);
  XHTTP.setRequestHeader("authorization", `${type} ${token}`);
  XHTTP.send( null )

 // window.location.hash = "logged"
  
  return JSON.parse(XHTTP.responseText)

}

function profile() {
  _USER_ = login()
  
  if(!_USER_) { 
    document.querySelector('#horizontal').innerHTML = `<span id="account">-</span><a id="login" href="https://discord.com/api/oauth2/authorize?client_id=1100740124574240778&redirect_uri=https%3A%2F%2Fscithee.kitsuforyou.repl.co&response_type=token&scope=identify">login</a>`  
    return
  }
  
  document.querySelector("#username").innerHTML = _USER_.username
  document.querySelector("#userpp").src = getPP(_USER_)
  document.querySelector("#account").innerHTML = getUser(_USER_) ? getUser(_USER_).account : "0"
}

function getPP(user) {
  return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}?size=128`
}

function getUser(discordUser) {
  let data = JSON.parse(get('https://scithee.kitsuforyou.repl.co/data/users.json'))
  let user = data.find(user => user.id == discordUser.id)
  
  if(user !== undefined) return user
  get(`https://scithee.kitsuforyou.repl.co/register/${discordUser.id}`)
  
  return {
    id: discordUser.id,
    account: 0,
    done: []
  }
}

profile()