
let isLogin = true

$("form").submit((event) => {
  event.preventDefault()
  
  if(isLogin) {
    const params = new URLSearchParams($("#login").serialize())
    

    const inputEmail = params.get("loginEmail")
    const inputPassword = params.get("loginPassword")

    console.log(inputEmail, inputPassword);

  }else{
    const params = new URLSearchParams($("#register").serialize())


    const inputEmail = params.get("registerEmail")
    const name = params.get("registerName")
    const inputPassword = params.get("registerPassword")
    const inputPasswordConfirm = params.get("registerPasswordConfirm")

    console.log(inputEmail, name, inputPassword, inputPasswordConfirm);
    
  }
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