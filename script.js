
class Task {
  constructor(id, descripcion) {
    this.id = id
    this.descripcion = descripcion
  }

  getDescripcion() {
    return this.descripcion
  }

  setDescripcion(newDescripcion) {
    this.descripcion = newDescripcion
  }
}

class TaskManager {
  constructor() {
    this.tasks = this.getTaskCookie() || []
  }

  getTask() {
    return this.tasks
  }

  postTask(descripcion) {
    const id = new Date().getTime()
    const task = new Task(id, descripcion)

    this.tasks.push(task)
    this.saveTaskCookie()
    return task
  }

  putTask(id, newDescripcion) {
    const task = this.tasks.find(task => task.id === id)    
    task.setDescripcion(newDescripcion)
    this.saveTaskCookie()    
  }

  deleteTask(id) {
    this.tasks = this.tasks.filter(task => task.id !== id)    
    this.saveTaskCookie()
  }

  getTaskCookie() {
    const foundCookie = document.cookie.split(" ").find((row) => row.startsWith("CRUDTAREAS_Agus="))

    if (foundCookie) {

      const tareasData = foundCookie.split('=')[1]
      
      return tareasData.split('%*^').map(item => {
        
        const [id, descripcion] = item.split('$!^')

        return new Task(Number(id), descripcion)
      })

    }else{
      return []
    }
  }

  saveTaskCookie() {
    const tasksData = this.tasks.map(task => `${task.id}$!^${task.descripcion}`).join('%*^')
    document.cookie = `CRUDTAREAS_Agus=${tasksData}`
  }
}

class Modal {
  constructor() {
    this.modal = document.getElementById("modal")
    this.modalContent = document.getElementById("modalContent")

    document.getElementById("closeModal").addEventListener("click", () => {
      this.close()
    })
  }

  open(content) {    
    this.modalContent.innerHTML = content
    this.modal.style.display = "block"
  }

  close() {
    this.modal.style.display = "none"
    this.modalContent.innerHTML = "" 
  }
}

const TaskManager = new TaskManager()
const modal = new Modal()


function showTasks() {
  
  const labelMain = document.querySelector("main")
  labelMain.innerHTML = ""

  const tasks = TaskManager.getTask()
  
  tasks.forEach((task) => {
    const div = document.createElement('div')
    div.className = "task"

    div.innerHTML = `
      <h3>${task.id}</h3>

      <p>${task.descripcion}</p>

      <div>
        <img src="./svg/edit.svg" alt="edit" class="edit-icon">
        <img src="./svg/trash.svg" alt="trash" class="trash-icon">
      </div>
    `

    labelMain.appendChild(div)

    const editIcon = div.querySelector('.edit-icon')
    const trashIcon = div.querySelector('.trash-icon')

    editIcon.addEventListener("click", () => showEditTask(task)) 
    trashIcon.addEventListener("click", () => showDeleteTask(task))
  })
}


const showCreateTask = () => {
  modal.open(`
    <h2>Crear Tarea</h2>
    <textarea id="descripcion" placeholder="Descripcion de la tarea" rows="4"></textarea>
    <button onclick="addTask()">CREAR</button>
  `)
}

const showEditTask = (task) => {
  modal.open(`
    <h2>Editar Tarea</h2>
    <textarea id="descripcion" placeholder="Descripcion de la tarea" rows="4">${task.descripcion}</textarea>
    <button onclick="updateTask(${task.id})">ACTUALIZAR</button>
  `)
}

const showDeleteTask = (task) => {
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
  const descripcion = document.getElementById("descripcion").value

  if (descripcion) {
    TaskManager.postTask(descripcion)
    modal.close()
    showTasks()
  }else{
    alert("Debes escribir algo en la tarea")
  }
}

function updateTask(id) {
  const descripcion = document.getElementById('descripcion').value

  if (descripcion) {
    TaskManager.putTask(id, descripcion)
    modal.close()
    showTasks()
  }
}

function deleteTask(id) {
  TaskManager.deleteTask(id)
  modal.close()
  showTasks()
}

showTasks()
