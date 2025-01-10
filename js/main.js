let isLogin = true

const errorNotification = error => {
  const notification = $("<div class='notification'></div>").text(error);

  $("body").append(notification)

  setTimeout(() => {
    notification.fadeOut(500, () => {
      $(this).remove();
    })
  }, 5000)
}

const getDataForm = isLogin => {

  const formId = isLogin ? "#login" : "#register"

  const params = new URLSearchParams($(formId).serialize())

  const inputEmail = isLogin ? params.get("loginEmail") : params.get("registerEmail")
  const inputName = params.get("registerName") || undefined
  const inputPassword = params.get(isLogin ? "loginPassword" : "registerPassword")
  const inputPasswordConfirm = params.get("registerPasswordConfirm") || undefined

  return {
    email: inputEmail,
    name: inputName,
    password: inputPassword,
    passwordConfirm: inputPasswordConfirm
  }
}

const validateData = (data, isLogin) => {
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/
  const namePattern = /^.{3,}$/
  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z]).{8,}$/

  if (!emailPattern.test(data.email)) {
    throw new Error("Email no valido")
  }

  if (!passwordPattern.test(data.password)) {
    throw new Error("La contraseña debe tener al menos 8 caracteres, incluyendo una mayuscula y una minuscula");
  }

  if (!isLogin) {
    if (!namePattern.test(data.name)) {
      throw new Error("El nombre debe tener al menos 3 caracteres");
    }

    if (data.password !== data?.passwordConfirm) {
      throw new Error("Las contraseñas no coinciden");
    }
  }

}

const findUserDB = (usersDB, data) => usersDB.find(user => user.email === data.email && user.password === data.password)


let usersDB = JSON.parse(localStorage.getItem('usersDB')) || []

const tbody = $("tbody")
tbody.empty()

usersDB.forEach(user => { 
  let row = `<tr> 
      <td>${user.id}</td> 
      <td>${user.email}</td> 
      <td>${user.registerDate}</td> 
    </tr>`
    tbody.append(row)
})


$("form").submit((event) => {
  event.preventDefault()

  try {
    const data = getDataForm(isLogin)

    $(isLogin ? "#login" : "#register").trigger("reset")

    validateData(data, isLogin)

    let usersDB = JSON.parse(localStorage.getItem('usersDB')) || []

    if (isLogin) {

      if (!findUserDB(usersDB, data)) {
        throw new Error("Usuario no encontrado");
      }

    } else {

      if (findUserDB(usersDB, data)) {
        throw new Error("Ya se ha encontrado un usuario con ese correo y contraseña");
      }

      const newUser = {
        id: new Date().getTime(),
        name: data.name,
        email: data.email,
        password: data.password,
        registerDate: `${new Date().getDate()}/${new Date().getMonth()}/${new Date().getFullYear()}`
      }

      usersDB.push(newUser)
      localStorage.setItem('usersDB', JSON.stringify(usersDB));

    }

    window.location.href = "../admin.html"


  } catch (error) {
    console.error(error.message)

    errorNotification(error.message)
  }

  console.log("terminado");

})



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

$("#closeSesion").click(() => window.location.href = "../index.html")

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
