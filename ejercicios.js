
//Ejercicio 1
console.log("Ejercicio 1")
const array1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]


const array1Cuadrado = array1.map(numero => numero ** 2)
console.log(array1Cuadrado)

const array1Pares = array1.filter(numero => numero % 2 === 0)
console.log(array1Pares)

const array1Sumado = array1.reduce((acumulador, numero) => acumulador + numero, 0)
console.log(array1Sumado)







//Ejercicio 2
console.log("Ejercicio 2")
const array2 = ["Tokyo", "New York", "Paris", "London", "Sydney"]


const array2Mayusculas = array2.map( ciudad => ciudad.toUpperCase())
console.log(array2Mayusculas)

const array2Ordenado = array2.sort()
console.log(array2Ordenado)

const array2EmpiezaM = array2.some( ciudad => ciudad[0] === "M")
console.log(array2EmpiezaM)

const array2Caracteres4 = array2.every( ciudad => ciudad.length > 4)
console.log(array2Caracteres4)







//Ejercicio 3
console.log("Ejercicio 3")
const arrEstudiantes = [
  { nombre: "Ana", edad: 20, nota: 8 },
  { nombre: "Luis", edad: 22, nota: 5 },
  { nombre: "María", edad: 19, nota: 7 },
  { nombre: "Carlos", edad: 21, nota: 4 }
]


const arrEstudiantesAprobados5 = arrEstudiantes.filter( estudiante => estudiante.nota >= 5)
console.log(arrEstudiantesAprobados5)

const arrEstudiantesEdad = arrEstudiantes.sort((a, b) => a.edad - b.edad)
console.log(arrEstudiantesEdad)

const arrEstudiantesNombres = arrEstudiantes.map( estudiante => estudiante.nombre)
console.log(arrEstudiantesNombres)

const arrEstudiantesPromedio = arrEstudiantes.reduce((acc, estudiante) => acc + estudiante.nota, 0) / arrEstudiantes.length
console.log(arrEstudiantesPromedio)






//Ejercicio 4
console.log("Ejercicio 4")
const array4 = ["floripondio", "luminescencia", "cristalocéfalo", "zigza", "burbujín"]


const array4Caracteres5 = array4.filter( palabra => palabra.length > 5)
console.log(array4Caracteres5)

const array4PalabraInvertida = array4.map( palabra => palabra.split('').reverse().join('') )
console.log(array4PalabraInvertida)

const array4OrdenadasLongitud = array4.sort( (a, b) => a.length - b.length)
console.log(array4OrdenadasLongitud)






//Ejercicio 5
console.log("Ejercicio 5")
const array51 = [3, 7, 45, 62, 9]
const array52 = [78, 34, 56, 91, 12]


const array5Suma2Arrays = array51.map((numero, index) => numero + array52[index])
console.log(array5Suma2Arrays)

const array5MutiplicadoIndice = array51.map((numero, index) => numero * index)
console.log(array5MutiplicadoIndice)

const array5EncuentraMayor10 = array51.findIndex(numero => numero > 10)
console.log(array5EncuentraMayor10)






//Ejercicio 6
console.log("Ejercicio 6")
const arrFrase = ["La", "vida", "es", "bella", "y", "divertida"];
 
const arrFraseConstruida = arrFrase.reduce((frase, palabra) => frase + " " + palabra)
console.log(arrFraseConstruida)

const arrFraseInvertida = arrFrase.reverse()
console.log(arrFraseInvertida)

const arrFraseIncludeBella = arrFrase.includes("bella")
console.log(arrFraseIncludeBella)






//Ejercicio 7
console.log("Ejercicio 7")
const array7 = []; 
for (let i = 0; i < 6; i++) { 
  array7.push(Math.floor(Math.random() * 100) + 1);
}
console.log("Numeros Generados:", array7);


const array7NumeroMax = Math.max(...array7)
console.log(array7NumeroMax);

const array7NumeroMin = Math.min(...array7)
console.log(array7NumeroMin);

const cantidadInpares = array7.filter(numero => numero % 2 !== 0).length
console.log(cantidadInpares);





