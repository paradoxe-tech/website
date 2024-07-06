const MOORE = [
  [1, 1, 1],
  [1, 0, 1],
  [1, 1, 1]
]

const NEWMAN = [
  [0, 1, 0],
  [1, 0, 1],
  [0, 1, 0]
]

let TEMPLATES = {
  "B3SALL": {
    rules: (RULES) => [
      {
        condition: RULES.default(),
        result: RULES.dead()
      },
      {
        condition: RULES.neighbours("=", 3),
        result: RULES.alive()
      },
      {
        condition: RULES.status("=", 1),
        result: RULES.alive()
      }
    ],
    voisinage: MOORE,
    type: "QL"
  },
  "sand": {
    rules: (RULES) => [
      {
        condition: RULES.status(">", 3),
        result: RULES.distrib(NEWMAN)
      }
    ],
    type: "QN"
  },
  "BB": {
    rules: (RULES) => [
      {
        condition: RULES.and(
          RULES.status("=", 0),
          RULES.neighbours("=", 2, RULES.status("=", 1))
        ),
        result: RULES.alive()
      },
      {
        condition: RULES.status("=", 1),
        result: RULES.set(0.5)
      },
      {
        condition: RULES.status("=", 0.5),
        result: RULES.dead()
      }
    ],
    type: "QL",
    voisinage: MOORE
  },
  "GHM": {
    rules: (RULES) => [
      {
        condition: RULES.and(
          RULES.status("=", 0),
          RULES.neighbours(">=", 1, RULES.status("=", 1))
        ),
        result: RULES.alive()
      },
      {
        condition: RULES.status("=", 1),
        result: RULES.set(0.5)
      },
      {
        condition: RULES.status("=", 0.5),
        result: RULES.dead()
      }
    ],
    type: "QL",
    voisinage: NEWMAN
  },
  "FF": {
    rules: (RULES) => [
      {
        condition: RULES.status("=", 2),
        result: RULES.set(0.5)
      },
      {
        condition: RULES.and(
          RULES.status("=", 1),
          RULES.neighbours(">=", 1, RULES.status("=", 2))
        ),
        result: RULES.set(2)
      }
    ],
    type: "QL",
    voisinage: NEWMAN
  },
  "move": {
    rules: (RULES) => [
      {
        condition: RULES.status("=", 1),
        result: RULES.clone([[0,1,0],[0,0,0],[0,0,0]])
      },
      {
        condition: RULES.status("=", 2),
        result: RULES.clone([[0,0,0],[0,0,1],[0,0,0]])
      },
      {
        condition: RULES.status("=", 3),
        result: RULES.clone([[0,0,0],[0,0,0],[0,1,0]])
      },
      {
        condition: RULES.status("=", 4),
        result: RULES.clone([[0,0,0],[1,0,0],[0,0,0]])
      }
    ],
    type: "QL"
  }
}

function wolfram(n, RULES) {
  let bin = (n >>> 0).toString(2).padStart(8, "0")
  let matrices = [
    [1, 1, 1],
    [1, 1, 0],
    [1, 0, 1],
    [1, 0, 0],
    [0, 1, 1],
    [0, 1, 0],
    [0, 0, 1],
    [0, 0, 0]
  ]

  let result = []
  for(let i=0; i < bin.length; i++) {
    result.push({
      condition: RULES.filter([matrices[i]]),
      result: bin[i] == "0" ? RULES.dead() : RULES.alive()
    })
  }

  result.push({ condition: RULES.status("=", 1), result: RULES.alive() })
  
  return result
}

function conway(bs, ss, RULES) {

  let result = [{ condition: RULES.default(), result: RULES.dead() }]

  for(let b of bs) {
    if(ss.includes(b)) result.push({
      condition: RULES.neighbours("=", b),
      result: RULES.alive()
    })
    else result.push({
      condition: RULES.and(
        RULES.neighbours("=", b),
        RULES.status("=", 0)
      ),
      result: RULES.alive()
    })
  }

  for(let s of ss) {
    if(!bs.includes(s)) result.push({
      condition: RULES.and(RULES.neighbours("=", s), RULES.status("=", 1)),
      result: RULES.alive()
    })
  }
  
  return result
}

function margolus(transitions, RULES) {
  let matrices = [
    [[0,0],[0,0]],
    [[1,0],[0,0]],
    [[0,1],[0,0]],
    [[1,1],[0,0]],
    [[0,0],[1,0]],
    [[1,0],[1,0]],
    [[0,1],[1,0]],
    [[1,1],[1,0]],
    [[0,0],[0,1]],
    [[1,0],[0,1]],
    [[0,1],[0,1]],
    [[1,1],[0,1]],
    [[0,0],[1,1]],
    [[1,0],[1,1]],
    [[0,1],[1,1]],
    [[1,1],[1,1]]
  ]

  let result = []
  for(let i=0; i < transitions.length - 1; i++) {
    result.push({
      condition: RULES.filter(matrices[transitions[i]]),
      result: RULES.clone(matrices[transitions[i+1]])
    })
  }

  return result
}