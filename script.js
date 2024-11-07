
document.cookie = "CRUDTAREAS_Agus=23749$!^Hacer tarea de física%*^23750$!^Estudiar matemáticas%*^23751$!^Leer capítulo de historia%*^23752$!^Practicar programación"



function getTask(nombreCookie) {
  const labelMain = document.querySelector("main")

  const foundCookie = document.cookie.split("; ").find((row) => row.startsWith(nombreCookie + "="))

  if (!foundCookie) return null
  let data = foundCookie.replace("CRUDTAREAS_Agus=", "").split('%*^')


  data.forEach((tarea) => {
    let partes = tarea.split('$!^')

    const div = document.createElement('div')
    div.className = "task"

    const h3 = document.createElement('h3')
    h3.innerHTML = partes[0]

    const p = document.createElement('p')
    p.innerHTML = partes[1]

    const div = document.createElement('span')

    div.appendChild(h3)
    div.appendChild(p)

    labelMain.appendChild(div)
  })

}

getTask("CRUDTAREAS_Agus");
