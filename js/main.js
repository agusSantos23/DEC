// Inicializa la variable que indica si se está en la vista de inicio de sesión
let isLogin = true

// Función para mostrar notificaciones de error
const errorNotification = error => {
  // Crea un div de notificación con el mensaje de error
  const notification = $("<div class='notification'></div>").text(error);

  // Añade la notificación al cuerpo del documento
  $("body").append(notification)

  // Desvanece y elimina la notificación después de 5 segundos
  setTimeout(() => {
    notification.fadeOut(500, () => {
      $(this).remove();
    })
  }, 5000)
}

// Función para obtener los datos del formulario, dependiendo de si es login o registro
const getDataForm = isLogin => {
  // Selecciona el formulario apropiado
  const formId = isLogin ? "#login" : "#register"

  // Serializa los datos del formulario
  const params = new URLSearchParams($(formId).serialize())

  // Obtiene los valores de los campos de entrada
  const inputEmail = isLogin ? params.get("loginEmail") : params.get("registerEmail")
  const inputName = params.get("registerName") || undefined
  const inputPassword = params.get(isLogin ? "loginPassword" : "registerPassword")
  const inputPasswordConfirm = params.get("registerPasswordConfirm") || undefined

  // Devuelve un objeto con los datos del formulario
  return {
    email: inputEmail,
    name: inputName,
    password: inputPassword,
    passwordConfirm: inputPasswordConfirm
  }
}

// Función para validar los datos del formulario
const validateData = (data, isLogin) => {
  // Expresiones regulares para validar email, nombre y contraseña
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/
  const namePattern = /^.{3,}$/
  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z]).{8,}$/

  // Validación del email
  if (!emailPattern.test(data.email)) {
    throw new Error("Email no valido")
  }

  // Validación de la contraseña
  if (!passwordPattern.test(data.password)) {
    throw new Error("La contraseña debe tener al menos 8 caracteres, incluyendo una mayuscula y una minuscula");
  }

  // Validaciones adicionales para el registro
  if (!isLogin) {
    // Validación del nombre
    if (!namePattern.test(data.name)) {
      throw new Error("El nombre debe tener al menos 3 caracteres");
    }

    // Validación de la confirmación de contraseña
    if (data.password !== data?.passwordConfirm) {
      throw new Error("Las contraseñas no coinciden");
    }
  }
}

// Función para buscar un usuario en la base de datos
const findUserDB = (usersDB, data) => usersDB.find(user => user.email === data.email && user.password === data.password)

// Inicializa la base de datos de usuarios
let usersDB = JSON.parse(localStorage.getItem('usersDB')) || []

// Referencia al cuerpo de la tabla
const tbody = $("tbody")
tbody.empty()

// Añade filas a la tabla con los usuarios registrados
usersDB.forEach(user => { 
  let row = `<tr> 
      <td>${user.id}</td> 
      <td>${user.email}</td> 
      <td>${user.registerDate}</td> 
    </tr>`
    tbody.append(row)
})

// Maneja el envio del formulario
$("form").submit((event) => {
  event.preventDefault()

  try {
    // Obtiene los datos del formulario
    const data = getDataForm(isLogin)

    // Resetea el formulario
    $(isLogin ? "#login" : "#register").trigger("reset")

    // Valida los datos del formulario
    validateData(data, isLogin)

    let usersDB = JSON.parse(localStorage.getItem('usersDB')) || []

    if (isLogin) {
      // Verifica si el usuario existe en la base de datos
      if (!findUserDB(usersDB, data)) {
        throw new Error("Usuario no encontrado");
      }

    } else {
      // Verifica si ya existe un usuario con el mismo correo y contraseña
      if (findUserDB(usersDB, data)) {
        throw new Error("Ya se ha encontrado un usuario con ese correo y contraseña");
      }

      // Crea un nuevo usuario
      const newUser = {
        id: new Date().getTime(),
        name: data.name,
        email: data.email,
        password: data.password,
        registerDate: `${new Date().getDate()}/${new Date().getMonth()}/${new Date().getFullYear()}`
      }

      // Añade el nuevo usuario a la base de datos
      usersDB.push(newUser)
      localStorage.setItem('usersDB', JSON.stringify(usersDB));
    }

    // Redirige a la página de administración
    window.location.href = "../admin.html"
  } catch (error) {
    // Muestra la notificación de error
    console.error(error.message)
    errorNotification(error.message)
  }

  console.log("terminado");
})

// Maneja el cambio entre la vista de inicio de sesión y registro
$("h5").on("click", "#btnLink", () => {
  if (isLogin) {
    $("h1").html('Registro de Usuario')
    $("h5").html('¿Ya tienes una cuenta? <span id="btnLink">Inicia sesión aquí</span>')
  } else {
    $("h1").html('Inicio de Sesion')
    $("h5").html('¿No tienes cuenta? <span id="btnLink">Regístrate aquí</span>')
  }

  $("#login").toggleClass("hidden")
  $("#register").toggleClass("hidden")

  isLogin = !isLogin
})

// Maneja el cierre de sesión
$("#closeSesion").click(() => window.location.href = "../index.html")

// Inicializa la tabla DataTable con las configuraciones específicas
$("#myTable").DataTable({ 
  "columns": [
    { "data": "id" }, 
    { "data": "email" }, 
    { "data": "registerDate" }
  ],
  language: {
    processing: "Procesando...",
    search: "Buscar:",
    lengthMenu: "Mostrar _MENU_ registros",
    info: "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
    infoEmpty: "Mostrando registros del 0 al 0 de un total de 0 registros",
    infoFiltered: "(filtrado de un total de _MAX_ registros)",
    loadingRecords: "Cargando...",
    zeroRecords: "No se encontraron resultados",
    emptyTable: "Ningún dato disponible en esta tabla",
    paginate: {
      first: "Primero",
      previous: "Anterior",
      next: "Siguiente",
      last: "Último"
    },
    aria: {
      sortAscending: ": Activar para ordenar la columna de manera ascendente",
      sortDescending: ": Activar para ordenar la columna de manera descendente"
    }
  }
})
