const $TABLERO = document.querySelector(".tablero") // Selección del elemento con la clase "tablero".
const $PUNTAJE = document.querySelector(".puntaje") // Selección del elemento con la clase "puntaje".
const $PUNTAJE_MAX = document.querySelector(".maximo-puntaje") // Selección del elemento con la clase "maximo-puntaje".

let juegoTerminado = false // Variable para rastrear si el juego ha terminado.
let comidaX, comidaY // Coordenadas de la comida.
let serpienteX = 10, serpienteY = 10 // Coordenadas iniciales de la serpiente.
let cuerpoSerpiente = [] // Almacena las coordenadas del cuerpo de la serpiente.
let velocidadX = 0, velocidadY = 0 // Velocidad de movimiento en las direcciones X e Y.
let setIntervalId // Almacena el ID del intervalo para controlar la actualización del juego.
let puntaje = 0 // Puntaje actual del juego.

let puntajeMax = localStorage.getItem("maximo-puntaje") || 0 // Obtiene el puntaje máximo almacenado en el almacenamiento local del navegador.
$PUNTAJE_MAX.innerHTML = `Máximo puntaje: ${puntajeMax}` // Muestra el puntaje máximo en el elemento HTML correspondiente.

const cambiarPosicionCommida = () => {
    comidaX = Math.floor(Math.random() * 30) + 1
    comidaY = Math.floor(Math.random() * 30) + 1
}
// Genera nuevas coordenadas para la comida de manera aleatoria.

const manejoJuegoTerminado = () => {
    clearInterval(setIntervalId) // Detiene el intervalo de actualización del juego.
    alert("Juego terminado") // Muestra un mensaje de juego terminado.
    location.reload() // Recarga la página para reiniciar el juego.
}
// Maneja el final del juego al detener el intervalo y mostrar un mensaje.

const cambiarDireccion = (e) => {
    if (e.key === "ArrowUp" && velocidadY != 1) {
        velocidadX = 0
        velocidadY = -1
    } else if (e.key === "ArrowDown" && velocidadY != -1) {
        velocidadX = 0
        velocidadY = 1
    } else if (e.key === "ArrowLeft" && velocidadX != 1) {
        velocidadX = -1
        velocidadY = 0
    } else if (e.key === "ArrowRight" && velocidadX != -1) {
        velocidadX = 1
        velocidadY = 0
    }
}
// Cambia la dirección de la serpiente en respuesta a las teclas presionadas.

const initGame = () => {
    if (juegoTerminado) return manejoJuegoTerminado()
    let $DIV_SERPIENTE = `<div class="comida" style="grid-area:${comidaY} / ${comidaX}"></div>`

    if (serpienteX === comidaX && serpienteY === comidaY) {
        cambiarPosicionCommida()
        cuerpoSerpiente.push([comidaX, comidaY])
        puntaje++
        puntajeMax = (puntaje >= puntajeMax) ? puntaje : puntajeMax
        localStorage.setItem("maximo-puntaje", puntajeMax)
        $PUNTAJE.innerHTML = `Puntaje: ${puntaje}`
        $PUNTAJE_MAX.innerHTML = `Máximo puntaje: ${puntajeMax}`
    }
    // Lógica de juego para verificar si la serpiente come y actualiza el puntaje.

    for (let i = cuerpoSerpiente.length - 1; i > 0; i--) {
        cuerpoSerpiente[i] = cuerpoSerpiente[i - 1]
    }
    // Actualiza la posición del cuerpo de la serpiente.

    cuerpoSerpiente[0] = [serpienteX, serpienteY]

    serpienteX += velocidadX
    serpienteY += velocidadY

    if (serpienteX <= 0 || serpienteX > 30 || serpienteY <= 0 || serpienteY > 30) {
        juegoTerminado = true
    }
    // Verifica si la serpiente choca con los bordes del tablero.

    for (let i = 0; i < cuerpoSerpiente.length; i++) {
        $DIV_SERPIENTE += `<div class="cabeza" style="grid-area:${cuerpoSerpiente[i][1]} / ${cuerpoSerpiente[i][0]}"></div>`
        if (i !== 0 && cuerpoSerpiente[0][1] === cuerpoSerpiente[i][1] && cuerpoSerpiente[0][0] === cuerpoSerpiente[i][0]) {
            juegoTerminado = true
        }
    }
    // Dibuja la serpiente en el tablero y verifica si choca consigo misma.

    $TABLERO.innerHTML = $DIV_SERPIENTE // Actualiza el tablero con la representación de la serpiente y la comida.
}

cambiarPosicionCommida() // Inicializa la posición de la comida.
setIntervalId = setInterval(initGame, 125) // Inicia el intervalo de actualización del juego.
document.addEventListener("keydown", cambiarDireccion) // Escucha eventos de teclado para cambiar la dirección de la serpiente.
