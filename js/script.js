// Importamos las clases necesarias desde el archivo 'clases.js'
import { Vuelo, Hotel, Paquete, Cliente, Reserva } from './clases.js'

// Función para obtener la base de datos desde el localStorage
const getDB = (type, filters = {}) => {
  // Recuperamos los datos almacenados en 'db_AgenciaViajes'
  const storedData = localStorage.getItem('db_AgenciaViajes')
  
  // Si no hay datos almacenados, retornamos una base de datos vacía
  if (!storedData) {
    return {
      trips: [],
      clients: [],
      bookings: []
    }
  }
  
  // Parseamos los datos almacenados en formato JSON
  const dbTemporal = JSON.parse(storedData)
  
  // Creamos un objeto de base de datos vacío
  const db = {
    trips: [], 
    clients: [],  
    bookings: []
  }
  
  // Llenamos la lista de clientes en la base de datos
  dbTemporal.clients.forEach(client => 
    db.clients.push(new Cliente(client.nombre, client.apellido, client.email, client.telefono))
  )

  // Llenamos la lista de viajes en la base de datos
  dbTemporal.trips.forEach(dato => { 
    // Verificamos el tipo de viaje y lo agregamos a la base de datos
    if (dato.aerolinea !== undefined) { 
      db.trips.push(new Vuelo(dato.codigo, dato.destino, dato.precio, dato.aerolinea, dato.duracion))
    } else if (dato.estrellas !== undefined) { 
      db.trips.push(new Hotel(dato.codigo, dato.destino, dato.precio, dato.estrellas, dato.tipoHabitacion))
    } else if (dato.vuelo && dato.hotel) { 
      const vuelo = new Vuelo(dato.vuelo.codigo, dato.vuelo.destino, dato.vuelo.precio, dato.vuelo.aerolinea, dato.vuelo.duracion)
      const hotel = new Hotel(dato.hotel.codigo, dato.hotel.destino, dato.hotel.precio, dato.hotel.estrellas, dato.hotel.tipoHabitacion)
      db.trips.push(new Paquete(dato.codigo, dato.destino, dato.precio, vuelo, hotel))
    }
  })

  // Llenamos la lista de reservas en la base de datos
  dbTemporal.bookings.forEach(dato => {
    let viaje
    const cliente = new Cliente(dato.cliente.nombre, dato.cliente.apellido, dato.cliente.email, dato.cliente.telefono)

    // Verificamos el tipo de viaje en la reserva
    if (dato.viaje) { 
      viaje = new Vuelo(dato.viaje.codigo, dato.viaje.destino, dato.viaje.precio, dato.viaje.aerolinea, dato.viaje.duracion)
    } else if (dato.hotel) { 
      viaje = new Hotel(dato.hotel.codigo, dato.hotel.destino, dato.hotel.precio, dato.hotel.estrellas, dato.hotel.tipoHabitacion)
    } else if (dato.paquete) { 
      const vuelo = new Vuelo(dato.vuelo.codigo, dato.vuelo.destino, dato.vuelo.precio, dato.vuelo.aerolinea, dato.vuelo.duracion)
      const hotel = new Hotel(dato.hotel.codigo, dato.hotel.destino, dato.hotel.precio, dato.hotel.aerolinea, dato.hotel.duracion)
      viaje = new Paquete(dato.codigo, dato.destino, dato.precio, vuelo, hotel)
    }

    // Agregamos la reserva a la base de datos
    db.bookings.push(new Reserva(cliente, viaje, dato.fecha))
  })

  // Filtramos los datos si se proporcionan filtros
  if (filters.selectClient && filters.selectTypeTrip) {
    const filteredClient = db.clients.find(client => client.email === filters.selectClient)
    const filteredTrip = db.trips.find(trip => trip.codigo === filters.selectTypeTrip)

    // Retornamos el cliente y el viaje filtrados si ambos existen
    if (filteredClient && filteredTrip) {
      return { client: filteredClient, trip: filteredTrip }
    } else {
      return { message: "No se encontró el cliente o el viaje" }
    }
  }

  // Retornamos el tipo de datos solicitado o la base de datos completa
  if (type) {
    return db[type] || []
  } else {
    return db
  }
}



// Función para establecer o actualizar la base de datos en el localStorage
const setDB = obj => {
  // Obtenemos la base de datos actual desde el localStorage
  const db = getDB()
  
  // Verificamos el tipo de objeto recibido y lo agregamos a la base de datos correspondiente
  switch (obj.constructor.name) { 
    // Si el objeto es un Vuelo, Hotel o Paquete, lo añadimos a la lista de viajes
    case 'Vuelo': 
    case 'Hotel': 
    case 'Paquete': 
      db.trips.push(obj) // Agregamos el objeto a la lista de viajes
      break

    // Si el objeto es un Cliente, lo añadimos a la lista de clientes
    case 'Cliente': 
      db.clients.push(obj) // Agregamos el objeto a la lista de clientes
      break 

    // Si el objeto es una Reserva, lo añadimos a la lista de reservas
    case 'Reserva': 
      db.bookings.push(obj) // Agregamos el objeto a la lista de reservas
      break 

    // Si el tipo de objeto no es reconocido, mostramos un mensaje de error en la consola
    default: 
      console.error("Tipo de objeto no reconocido") 
  }
  
  // Guardamos la base de datos actualizada en el localStorage, convirtiéndola a formato JSON
  localStorage.setItem('db_AgenciaViajes', JSON.stringify(db))
}



// Función para manejar el envío del formulario
const post = event => {
  // Prevenimos el comportamiento por defecto del formulario (recarga de página)
  event.preventDefault()

  // Obtenemos el formulario que desencadenó el evento
  const form = event.currentTarget
  // Creamos un objeto FormData a partir del formulario para manejar los datos
  const formData = new FormData(form) 
   
  // Convertimos los datos del formulario a un objeto
  const data = Object.fromEntries(formData.entries())
  
  // Verificamos si se ha ingresado un nombre (indicando que se está creando un nuevo cliente)
  if (data.nombre) {
    // Creamos un nuevo objeto Cliente y lo guardamos en la base de datos
    setDB(new Cliente(data.nombre, data.apellidos, data.correo, data.telefono))
    
  // Si se ha ingresado un código, se está creando un nuevo viaje
  } else if(data.codigo){

    // Determinamos el tipo de viaje seleccionado
    switch (data.selectTypeTrip) {
      case "vuelo":
        // Creamos un nuevo objeto Vuelo y lo guardamos en la base de datos
        setDB(new Vuelo(data.codigo, data.destino, data.precio, "vuela rapido", Math.floor(Math.random() * 7) + 1))
        break

      case "hotel":
        // Creamos un nuevo objeto Hotel y lo guardamos en la base de datos
        setDB(new Hotel(data.codigo, data.destino, data.precio, Math.floor(Math.random() * 5) + 0, "Individual" ))
        break

      case "paquete":
        // Creamos un nuevo objeto Paquete que incluye un vuelo y un hotel, y lo guardamos en la base de datos
        const vuelo = new Vuelo(data.codigo, data.destino, data.precio, "vuela rapido", Math.floor(Math.random() * 7) + 1)
        const hotel = new Hotel(data.codigo, data.destino, data.precio, Math.floor(Math.random() * 5) + 0, "Individual")
        setDB(new Paquete(data.codigo, data.destino, data.precio, vuelo, hotel ))
        break
    
      // Si el tipo de viaje no es reconocido, mostramos un mensaje de error en la consola
      default:
        console.error("No se ha encontrado ese tipo de viaje")
        break
    }

  // Si se ha seleccionado un cliente y un tipo de viaje, se está creando una nueva reserva
  } else if(data.selectClient && data.selectTypeTrip){
    
    // Filtramos la base de datos para encontrar el cliente y el viaje seleccionados
    const resultFilter = getDB(null, { selectClient: data.selectClient, selectTypeTrip: data.selectTypeTrip  })

    // Verificamos si se encontraron el cliente y el viaje
    if (resultFilter.client && resultFilter.trip) {
      // Obtenemos la fecha actual en formato 'es-ES'
      const dateToday = new Intl.DateTimeFormat('es-ES').format(new Date())
      
      // Creamos una nueva reserva y la guardamos en la base de datos
      setDB(new Reserva(resultFilter.client, resultFilter.trip, dateToday))

    } else {
      // Si no se encontró el cliente o el viaje, mostramos un mensaje de error en la consola
      console.error("No se encontró el cliente o el viaje.")
    }
    
  }

  // Actualizamos la vista para reflejar los cambios en la base de datos
  viewData()
}


// Función para eliminar una fila de la tabla
const deleteRow = boton => {
  // Obtenemos la fila de la tabla donde se hizo clic en el botón
  const rowTable = boton.parentElement.parentElement
  // Obtenemos el ID de la tabla a la que pertenece la fila
  const tableId = rowTable.parentElement.id 

  // Recuperamos la base de datos actual desde el localStorage
  const db = getDB() 

  let elementoId

  // Determinamos qué tabla se está utilizando para eliminar el elemento
  switch (tableId) {
    case 'tableClients':
      // Obtenemos el email del cliente desde la celda correspondiente
      elementoId = rowTable.cells[2].textContent 
      // Filtramos la lista de clientes para eliminar el que coincide con el email
      db.clients = db.clients.filter(client => client.email !== elementoId)
      break

    case 'tableTrips':
      // Obtenemos el código del viaje desde la celda correspondiente
      elementoId = rowTable.cells[0].textContent 
      // Filtramos la lista de viajes para eliminar el que coincide con el código
      db.trips = db.trips.filter(trip => trip.codigo !== elementoId)
      break

    case 'tableBooking':
      // Obtenemos el nombre completo del cliente y el destino desde las celdas correspondientes
      const nombreCompleto = rowTable.cells[0].textContent 
      const destino = rowTable.cells[1].textContent 

      // Filtramos la lista de reservas para eliminar la que coincide con el cliente y el destino
      db.bookings = db.bookings.filter(booking => {
        const nombreCliente = `${booking.cliente.nombre} ${booking.cliente.apellido}`
        return nombreCliente !== nombreCompleto || booking.viaje.destino !== destino
      })
      break

    default:
      // Si la tabla no es reconocida, mostramos un mensaje de error en la consola
      console.error('Tabla desconocida')
      return
  }

  // Guardamos la base de datos actualizada en el localStorage
  localStorage.setItem('db_AgenciaViajes', JSON.stringify(db))

  // Actualizamos la vista para reflejar los cambios en la base de datos
  viewData()
}


// Función para mostrar los datos en las tablas y listas desplegables
const viewData = () => {
  // Obtenemos las tablas y listas desplegables del DOM
  const tableClients = document.getElementById('tableClients')
  const tableTrips = document.getElementById('tableTrips')
  const tableBooking = document.getElementById('tableBooking')

  const selectClient = document.getElementById('selectClient')
  const selectTrip = document.getElementById('selectTrip')

  // Recuperamos la base de datos actual
  const db = getDB()

  // Limpiamos el contenido de las tablas
  tableClients.replaceChildren()
  tableTrips.replaceChildren()
  tableBooking.replaceChildren()

  // Limpiamos las listas desplegables
  selectClient.replaceChildren()
  selectTrip.replaceChildren()

  // Añadimos la opción por defecto en las listas desplegables
  selectClient.appendChild(new Option('Seleccionar Cliente', null, true, true))
  selectTrip.appendChild(new Option('Seleccionar Viaje', null, true, true))

  // Llenamos la tabla de clientes con los datos de la base de datos
  db.clients.forEach(client => {
    const newRow = document.createElement('tr')
    newRow.innerHTML = ` 
      <td>${client.nombre}</td> 
      <td>${client.apellido}</td> 
      <td>${client.email}</td> 
      <td>${client.telefono}</td> 
      <td> 
        <button class="btnDelete">Eliminar</button> 
      </td> 
    `
    tableClients.appendChild(newRow)

    // Añadimos el cliente a la lista desplegable
    const newOption = document.createElement('option')
    newOption.value = client.email
    newOption.textContent = `${client.nombre} ${client.apellido}`
    selectClient.appendChild(newOption)
  })

  // Llenamos la tabla de viajes con los datos de la base de datos
  db.trips.forEach(trip => {
    const newRow = document.createElement('tr')
    newRow.innerHTML = ` 
      <td>${trip.codigo}</td> 
      <td>${trip.destino}</td> 
      <td>${trip.precio}</td> 
      <td>${trip.constructor.name}</td> 
      <td> 
        <button class="btnDelete">Eliminar</button> 
      </td> 
    `
    tableTrips.appendChild(newRow)

    // Añadimos el viaje a la lista desplegable
    const newOption = document.createElement('option')
    newOption.value = trip.codigo
    newOption.textContent = trip.codigo
    selectTrip.appendChild(newOption)
  })

  // Llenamos la tabla de reservas con los datos de la base de datos
  db.bookings.forEach(booking => {
    const newRow = document.createElement('tr')
    
    newRow.innerHTML = ` 
      <td>${booking.cliente.nombre} ${booking.cliente.apellido}</td> 
      <td>${booking.viaje.destino}</td> 
      <td>${booking.fecha}</td> 
      <td> 
        <button class="btnDelete">Eliminar</button> 
      </td> 
    `
    tableBooking.appendChild(newRow)
  })

  // Añadimos un evento de clic a cada botón de eliminar
  document.querySelectorAll('.btnDelete').forEach(button => {
    button.addEventListener('click', event => {deleteRow(event.target)} )
  })
}

// Llamamos a la función viewData para mostrar los datos al cargar la página
viewData()

// Añadimos un evento de envío a todos los formularios para manejar el envío
document.querySelectorAll('form').forEach((form) => {
  form.addEventListener('submit', post)
})
