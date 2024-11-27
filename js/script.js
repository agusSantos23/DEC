
import { Vuelo, Hotel, Paquete, Cliente, Reserva } from './clases.js'

const db = {
  trips: [], 
  clients: [],  
  booking: []
}

const getDB = (type) =>{

  const storedData = localStorage.getItem('db_AgenciaViajes')

  if (!storedData) {
    return {
      trips: [],
      clients: [],
      booking: []
    }
  }
  const db = JSON.parse(storedData)
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
      db.booking.push(obj) 
      break 

    default: 
      console.error("Tipo de objeto no reconocido") 
  }

  localStorage.setItem('db_AgenciaViajes', JSON.stringify(db))
}

const viewData = () => {
  const tableClients = document.getElementById('tableClients')
  const tableTrips = document.getElementById('tableTrips')
  const tableBooking = document.getElementById('tableBooking')

  const db = getDB()
  console.log(db);


  db.clients.forEach(client => {
    const newRow = document.createElement('tr');
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
  })

  db.trips.forEach(trip => {
    const newRow = document.createElement('tr');
    
    //que tipo es 
    newRow.innerHTML = ` 
      <td>${trip.codigo}</td> 
      <td>${trip.destino}</td> 
      <td>${trip.precio}</td> 
      <td></td> 
      <td> 
        <button onclick="eliminarFila(this)">Eliminar</button> 
      </td> 
    `
    tableTrips.appendChild(newRow)
  })



}


// Crear instancias
const cliente1 = new Cliente("Paco", "Ramos", "ramirez.perez@gmail.com", "123446789")
const vuelo1 = new Vuelo("V001", "París", 200, "Air France", 2.5)
const hotel1 = new Hotel("H001", "París", 100, 4, "Doble")
const paquete1 = new Paquete("P001", "París", 280, vuelo1, hotel1)
 



viewData()




