
class Viaje {
  constructor(codigo, destino, precio, disponibilidad = true) {
    this.codigo = codigo;
    this.destino = destino;
    this.precio = precio;
    this.disponibilidad = disponibilidad;
  } 

  getInfo() {
    return `Viaje [${this.codigo}] a ${this.destino}, precio: ${this.precio} euros`
  }
}


class Vuelo extends Viaje {
  constructor(codigo, destino, precio, aerolinea, duracion) {
    super(codigo, destino, precio);
    this.aerolinea = aerolinea;
    this.duracion = duracion;
  }

  getInfo() {
    return `${super.getInfo()}, Aerolínea: ${this.aerolinea}, Duración: ${this.duracion} horas`;
  }
}


class Hotel extends Viaje {
  constructor(codigo, destino, precio, estrellas, tipoHabitacion) {
    super(codigo, destino, precio);
    this.estrellas = estrellas;
    this.tipoHabitacion = tipoHabitacion;
  }

  getInfo() {
    return `${super.getInfo()}, Hotel ${this.estrellas} estrellas, Habitación: ${this.tipoHabitacion}`;
  }
}


class Paquete extends Viaje {
  constructor(codigo, destino, precio, vuelo, hotel) {
    super(codigo, destino, precio);
    this.vuelo = vuelo;
    this.hotel = hotel;
  }

  getInfo() {
    return `${super.getInfo()}\n - Vuelo: ${this.vuelo.getInfo()}\n - Hotel: ${this.hotel.getInfo()}`;
  }
}


class Cliente {
  constructor(nombre, apellido, email, telefono) {
    this.nombre = nombre;
    this.apellido = apellido;
    this.email = email;
    this.telefono = telefono;
  }

  getResumen() {
    return `Cliente: ${this.nombre} ${this.apellido}, Email: ${this.email}, Teléfono: ${this.telefono}`;
  }
}


class Reserva{
  constructor(cliente, viaje) {
    this.cliente = cliente;
    this.viaje = viaje;
  }

  getResumen() {
    return `${this.cliente.getResumen()}\nReservó: ${this.viaje.getInfo()}`;
  }
}


export { Viaje, Vuelo, Hotel, Paquete, Cliente, Reserva };

