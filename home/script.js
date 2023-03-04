function get(yourUrl) {
  var Httpreq = new XMLHttpRequest()
  Httpreq.open("GET", yourUrl, false)
  Httpreq.send(null)
  return Httpreq.responseText
}

const site_URL = `${window.location.origin}`
let productions = JSON.parse(get(site_URL + "/cdn/data/productions.json")).shuffle()
productions = productions.filter(pj => sortByDate(pj, {date:Date.now()}) === -1)

document.addEventListener('mousemove', (e) => {
    
  document.querySelector('#mouse').style.top = `${e.clientY - 10}px`
  document.querySelector('#mouse').style.left = `${e.clientX - 10}px`
    
})

function parallax_design() {
  document.querySelector('#designs-view').addEventListener('mousemove', (e) => {
    
    let mouseX = (max) => (e.clientX / document.body.clientWidth) * max
    let mouseY = (max) => (e.clientY / document.body.clientHeight) * max
    
    document.querySelector('#design-card').style.transform = `rotateZ(-${mouseX(14)}deg) rotateY(-${mouseY(40)}deg)`
    document.querySelector('#design-pendentif').style.transform = `rotateZ(${mouseX(14)}deg) rotateY(${mouseY(40)}deg)`
    document.querySelector('#design-mask').style.transform = `rotateZ(-${mouseX(14)}deg) rotateY(-${mouseY(40)}deg)`
    
  })
}

function code_writing() {

  let texts = [
    {
      raw: "<blue>def</blue> <lightyellow>partition</lightyellow>(<lightblue>arr</lightblue>, <lightblue>premier</lightblue>, <lightblue>dernier</lightblue>):<br>  pivot = <blue>lambda</blue> arr : arr[dernier]<br>    pointer = premier - <lightgreen>1</lightgreen><br><br>  <pink>for</pink> pos <lightblue>in</lightblue> <lightyellow>range</lightyellow>(premier, dernier):<br>    <pink>if</pink> arr[pos] &lt;= <lightyellow>pivot</lightyellow>(arr):<br>      pointer += <lightgreen>1</lightgreen><br>        <lightyellow></lightyellow><lightyellow></lightyellow>(arr[pointer], arr[pos]) = <lightyellow></lightyellow><lightyellow></lightyellow>(arr[pos], arr[pointer])<br> <br>  arr[pointer + 1</lightgreen></lightgreen>], arr[dernier] = arr[dernier], arr[pointer + 1</lightgreen></lightgreen>]<br> <br>  <pink>return</pink> pointer + <lightgreen>1</lightgreen><br><br><blue>def</blue> <lightyellow>quick</lightyellow>(<lightblue>arr</lightblue>, <lightblue>premier</lightblue>=<lightgreen>0</lightgreen>, <lightblue>dernier</lightblue>=<lightgreen>9999</lightgreen>):<br>  <pink>if</pink> premier &lt; \dernier:<br>    pivot = <lightyellow>partition</lightyellow>(arr, premier, dernier)<br><br>    <lightyellow>quick</lightyellow>(arr, premier, pivot - <lightgreen>1</lightgreen>)<br>    <lightyellow>quick</lightyellow>(arr, pivot + <lightgreen>1</lightgreen>, dernier)<br><br><blue>def</blue> <lightyellow>fusion</lightyellow>(<lightblue>sub1</lightblue>, <lightblue>sub2</lightblue>):<br>    <pink>if</pink> <lightyellow>len</lightyellow>(sub1) == <lightgreen>0</lightgreen>: <pink>return</pink> sub2<br>    <pink>elif</pink> <lightyellow>len</lightyellow>(sub2) == <lightgreen>0</lightgreen>: <pink>return</pink> sub1<br>    <pink>elif</pink> sub1[<lightgreen>0</lightgreen>] &lt; sub2[<lightgreen>0</lightgreen>]:<br>      <pink>return</pink> [sub1</lightgreen></lightgreen>[<lightgreen>0</lightgreen>]] + <lightyellow>fusion</lightyellow>(sub1</lightgreen></lightgreen>[1</lightgreen></lightgreen>:], sub2)<br>    <pink>else</pink>: <pink>return</pink> [sub2[<lightgreen>0</lightgreen>]] + <lightyellow>fusion</lightyellow>(sub2[1</lightgreen></lightgreen>:], sub1</lightgreen></lightgreen>)<br></code><br>",
      sep: "<br>",
      end: "<br>",
      sel: "#writing-code"
    },
    {
      raw: "<red>SELECT</red> _U_.uID_, _M_.location _<red>FROM</red> _Users _U _<red>JOIN</red> _Map _M _<red>ON</red> _M_.uId _= _U_.uId _<red>WHERE</red> _M_.location _<red>LIKE</red> _'Nice'_;_",
      sep: "_",
      end: "",
      sel: "#writing-sql-1"
    },
    {
      raw: "<red>SELECT</red> _NomAuteur_, _PrenomAuteur _<red>FROM</red> _Auteurs _<red>WHERE</red> _PrenomAuteur _<red>LIKE</red> _'P%'_;_",
      sep: "_",
      end: "",
      sel: "#writing-sql-2"
    },
    {
      raw: "<red>SELECT</red> _Titre_, _Intitule _<red>FROM</red> _Livres _L _<red>JOIN</red> _LivresTheme _LT _<red>ON</red> _L_.IdLivre _= _LT_.IdLivre_;_",
      sep: "_",
      end: "",
      sel: "#writing-sql-3"
    },
    {
      raw: "       Une page blanche est un défi, un défi _saisissant, qui vous méprisera de tout son haut _(d’ailleurs généralement fixé à 29.7 centimètres, ce qui _est très pratique pour appréhender psychologiquement la profondeur _dudit mépris) sans pour autant vous dégoûter d’elle, _car la page blanche restera toujours la tentation _irrépressible de gribouiller violemment d’immondes bonhommes bâtons dans _votre tendre enfance, de concevoir de fantastiques mondes _fantastiques remplis d’orcs et d’elfes douteux quelques années _plus tard ou encore de croquer de grands _yeux féminins, écarquillés et amoureux à l’apogée de _cette adolescence qu’on déteste mais qu’on regrettera bientôt, _car en grandissant viendront des temps dans lesquels _cette feuille immaculée ne sera plus synonyme que _de révisions, ou PIRE, de comptabilité en retard _depuis des années et que plus personne n’attend _excepté votre huissier et votre femme, si tant _est que vous ayiez réussi à vous en _dégoter une , puisque, pardonnez mon impolitesse, vous _n’êtes pas exactement le compagnon / la compagne _exemplaire, à vrai dire, et vous savoir lire _ceci me fait me rappeller que vous avez _autrefois, vous aussi, tenté d’écrire sur cette tablette _sainte, un roman dans lequel il était question _d’un singe analphabète et d’un espadon sourd-muet.",
      sep: "_",
      end: "",
      sel: "#writing-essay"
    },
    {
      raw: "cd ../root/admin/sockets/__main__$ping https://callmekitsu.com/h/$git init$git clone https://github.com/CallMeKitsu/rinthLab$git remote origin main$git add .$git commit -m 'added recursive random walk algorithm'$git push origin main$git show$git pull -f$exit",
      sep: "$",
      end: "<br>",
      sel: "#writing-bash"
    }
  ]

  let n = 0
  
  document.addEventListener('keydown', () => {
    for(let text of texts) {
      let lines = text.raw.split(text.sep)
      if(n < lines.length) document.querySelector(text.sel).innerHTML += lines[n] + text.end
    }
    n ++
  })
  
}

function main() {
  code_writing()
  parallax_design()
}

let mouse = document.querySelector('#mouse')

for(let tag of ['h1', 'span', 'ion-icon', 'button', 'a', '#logo']) {
  document.querySelectorAll(tag).forEach(el => {
    el.addEventListener('mouseover', () => {
      mouse.style.transform = "translate(-50%, -50%) scale(8)"
    })
    el.addEventListener('mouseout', () => {
      mouse.style.transform = ""
    })
  })  
}