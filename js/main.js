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


$("form").submit((event) => {
  event.preventDefault()

 

  try {
    const data = getDataForm(isLogin)

    $(isLogin ? "#login" : "#register").trigger("reset")
  
    validateData(data, isLogin)


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