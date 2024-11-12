class Task {
  constructor(id, descripcion) {
    // Crea una nueva tarea con un id y una descripcion
    this.id = id;
    this.descripcion = descripcion;
  }

  getDescripcion() {
    // Devuelve la descripcion de la tarea
    return this.descripcion;
  }

  setDescripcion(newDescripcion) {
    // Establece una nueva descripcion para la tarea
    this.descripcion = newDescripcion;
  }
}

class TaskManager {
  constructor() {
    // Inicializa el administrador de tareas con las tareas obtenidas de la cookie o un arreglo vacio si no encuentra ninguna cookie
    this.tasks = this.getTaskCookie() || []
  }

  getTask() {
    // Devuelve la lista de tareas
    return this.tasks
  }

  postTask(descripcion) {
    // Crea una nueva tarea con un id segun la hora y una descripcion
    const id = new Date().getTime()    
    const task = new Task(id, descripcion)

    // Agrega la tarea a la lista de tareas del Manager y guarda en la cookie
    this.tasks.push(task)
    this.saveTaskCookie()
    return task
  }

  putTask(id, newDescripcion) {
    // Busca la tarea por id y actualiza su descripcion
    const task = this.tasks.find(task => task.id === id)    
    task.setDescripcion(newDescripcion)

    this.saveTaskCookie()    
  }

  deleteTask(id) {
    // Elimina la tarea con el id especificado de la lista de tareas
    this.tasks = this.tasks.filter(task => task.id !== id)  

    this.saveTaskCookie()
  }

  getTaskCookie() {
    // Obtiene las tareas guardadas en las cookies si existen
    const foundCookie = document.cookie.split("; ").find((row) => row.startsWith("CRUDTAREAS_Agus="))?.split('=')[1]
    
    if (foundCookie) {
      // Convierte la cadena de texto en tareas
      return foundCookie.split('%*^').map(item => {
        
        const [id, descripcion] = item.split('$!^')

        return new Task(Number(id), decodeURIComponent(descripcion))
      })

    }else{
      // Si no hay cookie, no devuelve nada
      return 
    }
  }

  saveTaskCookie() {
    // Guarda las tareas actuales en la cookie
    const tasksData = this.tasks.map(task => `${task.id}$!^${encodeURIComponent(task.descripcion)}`).join('%*^')
    document.cookie = `CRUDTAREAS_Agus=${tasksData}`
  }
}

class Modal {
  constructor() {
    // Obtiene los elementos del modal y agrega un listener para cerrarlo
    this.modal = document.getElementById("modal")
    this.modalContent = document.getElementById("modalContent")

    document.getElementById("closeModal").addEventListener("click", () => {
      this.close()
    })
  }

  open(content) {    
    // Muestra el modal con el contenido proporcionado
    this.modalContent.innerHTML = content
    this.modal.style.display = "block"
  }

  close() {
    // Cierra el modal y limpia su contenido
    this.modal.style.display = "none"
    this.modalContent.innerHTML = "" 
  }
}

const taskManager = new TaskManager()
const modal = new Modal()

function showTasks() {
  // Muestra todas las tareas en el contenedor principal
  const labelMain = document.querySelector("main")
  labelMain.innerHTML = ""

  const tasks = taskManager.getTask()
  

  if (tasks.length !== 0) {
    
    // Crea un div por cada tarea para cada tarea con su id, descripcion y botones de editar y eliminar
    tasks.forEach((task) => {
      const div = document.createElement('div')
      div.className = "task"

      div.innerHTML = `
        <h3>${task.id}</h3>

        <p>${task.descripcion}</p>

        <div>
          <img src="./svg/edit.svg" alt="edit" class="edit">
          <img src="./svg/trash.svg" alt="trash" class="trash">
        </div>
      `

      labelMain.appendChild(div)

      // Asocia eventos de clic a los iconos de editar y eliminar
      const editIcon = div.querySelector('.edit')
      const trashIcon = div.querySelector('.trash')

      editIcon.addEventListener("click", () => showEditTask(task)) 
      trashIcon.addEventListener("click", () => showDeleteTask(task))
    })

  }else{
    // Crea un div con id "message", le asigna un mensaje y lo agrega a labelMain
    const div = document.createElement('div')
    div.id = "message"

    div.innerHTML = `<h3>No se ha encontrado ninguna tarea</h3>`
    labelMain.appendChild(div)
  }
}

const showCreateTask = () => {
  // Muestra el formulario para crear una nueva tarea
  modal.open(`
    <h2>Crear Tarea</h2>
    <textarea id="descripcion" placeholder="Descripcion de la tarea" rows="4"></textarea>
    <button onclick="addTask()">CREAR</button>
  `)
}

const showEditTask = (task) => {
  // Muestra el formulario para editar una tarea existente
  modal.open(`
    <h2>Editar Tarea</h2>
    <textarea id="descripcion" placeholder="Descripcion de la tarea" rows="4">${task.descripcion}</textarea>
    <button onclick="updateTask(${task.id})">ACTUALIZAR</button>
  `)
}

const showDeleteTask = (task) => {
  // Muestra una confirmacion para eliminar una tarea
  modal.open(`
    <h2>Eliminar Tarea</h2>
    <h3>Estas seguro de que deseas eliminar la tarea: "${task.id}"</h3>
    <div> 
      <button onclick="deleteTask(${task.id})">ELIMINAR</button>
      <button onclick="modal.close()">CANCELAR</button>
    </div>
  `)
}

function addTask() {
  // Crea una tarea nueva con la descripcion proporcionada
  const descripcion = document.getElementById("descripcion").value

  if (descripcion) {
    taskManager.postTask(descripcion)
    modal.close()
    showTasks()
  }else{
    alert("Debes escribir algo en la tarea")
  }
}

function updateTask(id) {
  // Actualiza la descripcion de una tarea existente
  const descripcion = document.getElementById('descripcion').value

  if (descripcion) {
    taskManager.putTask(id, descripcion)
    modal.close()
    showTasks()
  }
}

function deleteTask(id) {
  // Elimina una tarea de la lista
  taskManager.deleteTask(id)
  modal.close()
  showTasks()
}

showTasks()
