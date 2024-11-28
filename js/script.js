
import { Vuelo, Hotel, Paquete, Cliente, Reserva, Viaje } from './clases.js'

const getDB = type =>{
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
      console.log(dato);
      
      if (dato.aerolinea) { 

        db.trips.push(new Vuelo(dato.codigo, dato.destino, dato.precio, dato.aerolinea, dato.duracion))

      } else if (dato.estrellas) { 
        
        db.trips.push(new Hotel(dato.codigo, dato.destino, dato.precio, dato.estrellas, dato.tipoHabitacion))

      } else if (Object.keys(dato).length === 6 ) { 

        const vuelo = new Vuelo(dato.vuelo.codigo, dato.vuelo.destino, dato.vuelo.precio, dato.vuelo.aerolinea, dato.vuelo.duracion)
        const hotel = new Hotel(dato.hotel.codigo, dato.hotel.destino, dato.hotel.precio, dato.hotel.estrellas, dato.hotel.tipoHabitacion)

        db.trips.push(new Paquete(dato.codigo, dato.destino, dato.precio, vuelo, hotel))
      }
    }
  )

  dbTemporal.bookings.forEach(dato => {
    const cliente = new Cliente(dato.cliente.nombre, dato.cliente.apellido, dato.cliente.email, dato.cliente.telefono)

    let viaje
    

    if (dato.viaje) { 

      viaje = new Vuelo(dato.viaje.codigo, dato.viaje.destino, dato.viaje.precio, dato.viaje.aerolinea, dato.viaje.duracion)

    } else if (dato.hotel) { 

      viaje = new Hotel(dato.hotel.codigo, dato.hotel.destino, dato.hotel.precio, dato.hotel.estrellas, dato.hotel.tipoHabitacion)

    } else if (dato.paquete) { 

      const vuelo = new Vuelo(dato.vuelo.codigo, dato.vuelo.destino, dato.vuelo.precio, dato.vuelo.aerolinea, dato.vuelo.duracion)
      const hotel = new Hotel(dato.hotel.codigo, dato.hotel.destino, dato.hotel.precio, dato.hotel.aerolinea, dato.hotel.duracion)

      viaje = new Paquete(dato.codigo, dato.destino, dato.precio, vuelo, hotel)
    }

    db.bookings.push(new Reserva(cliente,viaje,))
  })


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
    dateNow = new Date().toLocaleDateString()

  }

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

  selectClient.appendChild(new Option('Seleccionar', null, true, true));
  selectTrip.appendChild(new Option('Seleccionar', null, true, true));



  db.clients.forEach(client => {
    const newRow = document.createElement('tr')
    newRow.innerHTML = ` 
      <td>${client.nombre}</td> 
      <td>${client.apellido}</td> 
      <td>${client.email}</td> 
      <td>${client.telefono}</td> 
      <td> 
        <button onclick="eliminarFila(this)">Eliminar</button> 
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
        <button onclick="eliminarFila(this)">Eliminar</button> 
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
    console.log(booking)
    
    newRow.innerHTML = ` 
      <td>${booking.cliente.nombre}</td> 
      <td>${booking.viaje.destino}</td> 
      <td>20/05/2023</td> 
      <td> 
        <button onclick="eliminarFila(this)">Eliminar</button> 
      </td> 
    `
    tableBooking.appendChild(newRow)
  })



}


// Crear instancias
const cliente1 = new Cliente("Paco", "Ramos", "ramirez.perez@gmail.com", "123446789")
const vuelo1 = new Vuelo("V001", "París", 200, "Air France", 2.5)
const hotel1 = new Hotel("H001", "París", 100, 4, "Doble")
const paquete1 = new Paquete("P001", "París", 280, vuelo1, hotel1)

const reserva1 = new Reserva(cliente1, vuelo1,new Date().toLocaleDateString())



viewData()

document.querySelectorAll('form').forEach((form) => {
  form.addEventListener('submit', post)
})



