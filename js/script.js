
import { Vuelo, Hotel, Paquete, Cliente, Reserva } from './clases.js';



// Crear instancias
const cliente1 = new Cliente("Ana", "Pérez", "ana.perez@gmail.com", "123456789");
const vuelo1 = new Vuelo("V001", "París", 200, "Air France", 2.5);
const hotel1 = new Hotel("H001", "París", 100, 4, "Doble");
const paquete1 = new Paquete("P001", "París", 280, vuelo1, hotel1);
 
// Crear una reserva
const reserva1 = new Reserva(cliente1, paquete1);
 
console.log(cliente1.getResumen());
console.log(vuelo1.getInfo());
console.log(paquete1.getInfo());
console.log(reserva1.getResumen());


