styleDesc()
const cleanArray = ['0','1','2','3','4','5','6','7','8','9',' ','.']

for(var comp of competences) {
  doStat(`#${comp.name.toLowerCase().without(cleanArray)}`, comp.value, comp.color, `${comp.name} `, ` ${comp.value / 10 * 100}%`, 200)
}