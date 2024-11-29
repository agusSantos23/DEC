
import { Vuelo, Hotel, Paquete, Cliente, Reserva } from './clases.js'

const getDB = (type, filters = {}) =>{
  const storedData = localStorage.getItem('db_AgenciaViajes')
  if (!storedData) {
    return {
      trips: [],
      clients: [],
      bookings: []
    }
  }
  const dbTemporal = JSON.parse(storedData)
  
  const db = {
    trips: [], 
    clients: [],  
    bookings: []
  }
  
  dbTemporal.clients.forEach(client => db.clients.push(new Cliente(client.nombre, client.apellido, client.email, client.telefono)))

  dbTemporal.trips.forEach(
    dato => { 
      
      if (dato.aerolinea !== undefined) { 

        db.trips.push(new Vuelo(dato.codigo, dato.destino, dato.precio, dato.aerolinea, dato.duracion))

      } else if (dato.estrellas !== undefined) { 
        
        db.trips.push(new Hotel(dato.codigo, dato.destino, dato.precio, dato.estrellas, dato.tipoHabitacion))

      } else if (dato.vuelo && dato.hotel) { 

        const vuelo = new Vuelo(dato.vuelo.codigo, dato.vuelo.destino, dato.vuelo.precio, dato.vuelo.aerolinea, dato.vuelo.duracion)
        const hotel = new Hotel(dato.hotel.codigo, dato.hotel.destino, dato.hotel.precio, dato.hotel.estrellas, dato.hotel.tipoHabitacion)

        db.trips.push(new Paquete(dato.codigo, dato.destino, dato.precio, vuelo, hotel))
      }
    }
  )

  dbTemporal.bookings.forEach(dato => {
    let viaje

    const cliente = new Cliente(dato.cliente.nombre, dato.cliente.apellido, dato.cliente.email, dato.cliente.telefono)


    if (dato.viaje) { 

      viaje = new Vuelo(dato.viaje.codigo, dato.viaje.destino, dato.viaje.precio, dato.viaje.aerolinea, dato.viaje.duracion)

    } else if (dato.hotel) { 

      viaje = new Hotel(dato.hotel.codigo, dato.hotel.destino, dato.hotel.precio, dato.hotel.estrellas, dato.hotel.tipoHabitacion)

    } else if (dato.paquete) { 

      const vuelo = new Vuelo(dato.vuelo.codigo, dato.vuelo.destino, dato.vuelo.precio, dato.vuelo.aerolinea, dato.vuelo.duracion)
      const hotel = new Hotel(dato.hotel.codigo, dato.hotel.destino, dato.hotel.precio, dato.hotel.aerolinea, dato.hotel.duracion)

      viaje = new Paquete(dato.codigo, dato.destino, dato.precio, vuelo, hotel)
    }

    db.bookings.push(new Reserva(cliente,viaje,dato.fecha))
  })

  if (filters.selectClient && filters.selectTypeTrip) {
    const filteredClient = db.clients.find(client => client.email === filters.selectClient)
    const filteredTrip = db.trips.find(trip => trip.codigo === filters.selectTypeTrip)

    if (filteredClient && filteredTrip) {
      return { client: filteredClient, trip: filteredTrip }
    } else {
      return { message: "No se encontró el cliente o el viaje" }
    }
  }


  if (type) {
    return db[type] || []
  }else{
    return db
  }
}

const setDB = obj => {
  const db = getDB()
  
  switch (obj.constructor.name) { 

    case 'Vuelo': 
    case 'Hotel': 
    case 'Paquete': 
      db.trips.push(obj) 
      break

    case 'Cliente': 
      db.clients.push(obj) 
      break 

    case 'Reserva': 
      db.bookings.push(obj) 
      break 

    default: 
      console.error("Tipo de objeto no reconocido") 
  }
  
  localStorage.setItem('db_AgenciaViajes', JSON.stringify(db))
}

const post = event => {
  event.preventDefault()

  const form = event.currentTarget
  const formData = new FormData(form) 
   
  const data = Object.fromEntries(formData.entries())
  
  if (data.nombre) {
    
    setDB(new Cliente(data.nombre, data.apellidos, data.correo, data.telefono))
    
  } else if(data.codigo){

    switch (data.selectTypeTrip) {
      case "vuelo":
        setDB(new Vuelo(data.codigo, data.destino, data.precio, "vuela rapido", Math.floor(Math.random() * 7) + 1))
        break

      case "hotel":
        setDB(new Hotel(data.codigo, data.destino, data.precio, Math.floor(Math.random() * 5) + 0, "Individual" ))
        break

      case "paquete":
        const vuelo = new Vuelo(data.codigo, data.destino, data.precio, "vuela rapido", Math.floor(Math.random() * 7) + 1)
        const hotel = new Hotel(data.codigo, data.destino, data.precio, Math.floor(Math.random() * 5) + 0, "Individual")
        setDB(new Paquete(data.codigo, data.destino, data.precio, vuelo, hotel ))
        break
    
      default:
        console.error("No se ha encontrado ese tipo de viaje")
        break
    }

  } else if(data.selectClient && data.selectTypeTrip){
    
    const resultFilter = getDB(null, { selectClient: data.selectClient, selectTypeTrip: data.selectTypeTrip  })

    if (resultFilter.client && resultFilter.trip) {

      const dateToday = new Intl.DateTimeFormat('es-ES').format(new Date())
      
      setDB(new Reserva( resultFilter.client, resultFilter.trip, dateToday))

    } else {
      console.error("No se encontro el cliente o el viaje.")
    }
    
  }

  viewData()
}


const deleteRow = boton => {

  const rowTable = boton.parentElement.parentElement
  const tableId = rowTable.parentElement.id 

  const db = getDB() 

  let elementoId

  switch (tableId) {
    case 'tableClients':
      elementoId = rowTable.cells[2].textContent 
      db.clients = db.clients.filter(client => client.email !== elementoId)
      break

    case 'tableTrips':
      elementoId = rowTable.cells[0].textContent 
      db.trips = db.trips.filter(trip => trip.codigo !== elementoId)
      break

    case 'tableBooking':
      const nombreCompleto = rowTable.cells[0].textContent 
      const destino = rowTable.cells[1].textContent 

      db.bookings = db.bookings.filter(booking => {
        const nombreCliente = `${booking.cliente.nombre} ${booking.cliente.apellido}`
        return nombreCliente !== nombreCompleto || booking.viaje.destino !== destino
      })
      break

    default:
      console.error('Tabla desconocida')
      return
  }

  localStorage.setItem('db_AgenciaViajes', JSON.stringify(db))

  viewData()
}

const viewData = () => {
  const tableClients = document.getElementById('tableClients')
  const tableTrips = document.getElementById('tableTrips')
  const tableBooking = document.getElementById('tableBooking')

  const selectClient = document.getElementById('selectClient')
  const selectTrip = document.getElementById('selectTrip')

  const db = getDB()

  tableClients.replaceChildren()
  tableTrips.replaceChildren()
  tableBooking.replaceChildren()


  selectClient.replaceChildren()
  selectTrip.replaceChildren()

  selectClient.appendChild(new Option('Seleccionar Cliente', null, true, true))
  selectTrip.appendChild(new Option('Seleccionar Viaje', null, true, true))


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


    const newOption = document.createElement('option')
    newOption.value = client.email
    newOption.textContent = `${client.nombre} ${client.apellido}`
    selectClient.appendChild(newOption)

  })

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

    const newOption = document.createElement('option')
    newOption.value = trip.codigo
    newOption.textContent = trip.codigo
    selectTrip.appendChild(newOption)

  })

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

  document.querySelectorAll('.btnDelete').forEach(button => {
    button.addEventListener('click', event => {deleteRow(event.target)} )
  })

}

viewData()

document.querySelectorAll('form').forEach((form) => {
  form.addEventListener('submit', post)
})



