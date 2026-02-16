// Fuegos Artificiales

//
// 1. Configuración Inicial
//
window.oncontextmenu = function () {
  return false;
};

const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");

let ancho = (canvas.width = window.innerWidth);
let alto = (canvas.height = window.innerHeight);

const minParticulas = 700;
const maxParticulas = 1000;

let temporizador = 0;
let fuegos = [];
let particulas = [];
let siguienteDisparo = 0;
let intervaloFuego = 600; 

// Paleta De Colores (adaptada para tema de cumpleaños)
const paletaColores = [
  ["rgba(255, 182, 193,", "rgba(255, 255, 255,"], // rosa pastel - blanco
  ["rgba(255, 155, 170,", "rgba(255, 192, 203,"], // rosa claro - rosa
  ["rgba(255, 105, 180,", "rgba(255, 182, 193,"], // rosa fucsia - rosa pastel
  ["rgba(255, 20, 147,", "rgba(255, 192, 203,"], // rosa profundo - rosa
  ["rgba(255, 215, 0,", "rgba(255, 255, 255,"], // dorado - blanco
  ["rgba(255, 69, 0,", "rgba(255, 182, 193,"], // rojo anaranjado - rosa pastel
  ["rgba(255, 0, 127,", "rgba(255, 192, 203,"], // fucsia - rosa
  ["rgba(251, 144, 204,", "rgba(255, 255, 255,"], // rosa - blanco
  ["rgba(255, 128, 192,", "rgba(255, 182, 193,"], // rosa medio - rosa pastel
  ["rgba(255, 105, 180,", "rgba(255, 215, 0,"], // rosa fucsia - dorado
];

//
// 2. Funciones Auxiliares
//
function obtenerDistancia(x1, y1, x2, y2) {
  const dx = x1 - x2;
  const dy = y1 - y2;
  return Math.sqrt(dx * dx + dy * dy);
}

function aleatorio(min, max, redondear) {
  const valor = Math.random() * (max - min) + min;
  return redondear ? Math.round(valor) : valor;
}

//
// 3. Lanzar Fuego Automático
//
function lanzarFuegoAuto() {
  const fuego = new FuegoAuto();
  fuegos.push(fuego);
}

function FuegoAuto() {
  // Posición Inicial Del Fuego Artificial
  this.x = this.sx = aleatorio(100, ancho - 100);
  this.y = this.sy = alto;

  // Objetivo Del Fuego Artificial
  this.tx = aleatorio(100, ancho - 100);
  this.ty = aleatorio(alto * 0.1, alto * 0.7);

  // Disparar En Cualquier Dirección
  const angulo = Math.atan2(this.ty - this.sy, this.tx - this.sx);

  // Proyectil Sube Exactamente En La Dirección Del Objetivo
  this.velocidad = aleatorio(8, 12);
  this.vx = Math.cos(angulo) * this.velocidad;
  this.vy = Math.sin(angulo) * this.velocidad;

  // Color Del Fuego Artificial
  this.paleta = paletaColores[Math.floor(Math.random() * paletaColores.length)];
  this.colorProyectil = this.paleta[0] + "0.8)";

  // Dibujar Estela -|- Eliminar Fuego Artificial
  this.posicionesPrevias = [];
  this.eliminar = false;

  this.actualizar = function () {
    // Dibujar Estela
    this.posicionesPrevias.push({ x: this.x, y: this.y });
    if (this.posicionesPrevias.length > 1) this.posicionesPrevias.shift();

    this.x += this.vx;
    this.y += this.vy;

    // Eliminar Fuego Artificial
    if (obtenerDistancia(this.x, this.y, this.tx, this.ty) < this.velocidad) {
      const cantidad = aleatorio(minParticulas, maxParticulas, true);
      crearParticulas(cantidad, this.x, this.y, this.paleta);
      this.eliminar = true;
    }
  };

  this.dibujar = function () {
    let ultimaPos = this.posicionesPrevias[0] ?? { x: this.x, y: this.y };

    ctx.beginPath();
    ctx.moveTo(ultimaPos.x, ultimaPos.y);
    ctx.lineTo(this.x, this.y);
    ctx.arc(this.x, this.y, 1.5, 0, 2 * Math.PI);
    ctx.strokeStyle = this.colorProyectil;
    ctx.stroke();
  };
}

//
// 3.1 Lanzar Fuego con Click
//
function lanzarFuegoClick(x, y) {
  const fuego = new FuegoClick(x, y);
  fuegos.push(fuego);
}

function FuegoClick(tx, ty) {
  // Posición Inicial Del Fuego Artificial
  this.x = this.sx = aleatorio(100, ancho - 100);
  this.y = this.sy = alto;

  // Objetivo Del Fuego Artificial
  this.tx = tx;
  this.ty = ty;

  // Disparar En Cualquier Dirección (Ángulo En RAD)
  const angulo = Math.atan2(this.ty - this.sy, this.tx - this.sx);

  // Proyectil Sube Exactamente En La Dirección Del Objetivo
  this.velocidad = aleatorio(8, 12);
  this.vx = Math.cos(angulo) * this.velocidad;
  this.vy = Math.sin(angulo) * this.velocidad;

  // Color Del Fuego Artificial
  this.paleta = paletaColores[Math.floor(Math.random() * paletaColores.length)];
  this.colorProyectil = this.paleta[0] + "0.8)";

  // Dibujar Estela -|- Eliminar Fuego Artificial
  this.posicionesPrevias = [];
  this.eliminar = false;

  this.actualizar = function () {
    // Dibujar Estela
    this.posicionesPrevias.push({ x: this.x, y: this.y });
    if (this.posicionesPrevias.length > 1) this.posicionesPrevias.shift();

    this.x += this.vx;
    this.y += this.vy;

    // Eliminar Fuego Artificial
    if (obtenerDistancia(this.x, this.y, this.tx, this.ty) < this.velocidad) {
      const cantidad = aleatorio(minParticulas, maxParticulas, true);
      crearParticulas(cantidad, this.x, this.y, this.paleta);
      this.eliminar = true;
    }
  };

  this.dibujar = function () {
    let ultimaPos = this.posicionesPrevias[0] ?? { x: this.x, y: this.y };

    ctx.beginPath();
    ctx.moveTo(ultimaPos.x, ultimaPos.y);
    ctx.lineTo(this.x, this.y);
    ctx.arc(this.x, this.y, 1.5, 0, 2 * Math.PI);
    ctx.strokeStyle = this.colorProyectil;
    ctx.stroke();
  };
}

//
// 4. Crear Partículas
//
function crearParticulas(cantidad, x, y, colores) {
  for (let i = 0; i < cantidad; i++) {
    particulas.push(new Particula(x, y, colores));
  }
}

function Particula(x, y, colores) {
  this.x = x;
  this.y = y;
  this.velocidad = Math.random() * 6 + 2;
  this.angulo = Math.random() * (Math.PI * 2);
  this.facilidad = 0.2;
  this.gravedad = Math.random() * 3 + 0.1;
  this.alpha = 0.9;
  this.color = Math.random() < 0.7 ? colores[0] : colores[1];
  this.posicionesPrevias = [];

  this.actualizar = function () {
    if (this.alpha <= 0) return;

    // Guardar Posición Actual Para Dibujar Estela
    this.posicionesPrevias.push({ x: this.x, y: this.y });
    if (this.posicionesPrevias.length > 2) this.posicionesPrevias.shift();

    // Frenar La Partícula Poco A Poco
    if (this.velocidad > 1) this.velocidad -= this.facilidad;

    // Desvanecer Lentamente
    this.alpha -= 0.01;

    // Incrementar Gravedad Para Que Caiga Más Rápido Con El Tiempo
    this.gravedad += 0.01;

    // Actualizar Posición Usando Trigonometría
    this.x += Math.cos(this.angulo) * this.velocidad;
    this.y += Math.sin(this.angulo) * this.velocidad + this.gravedad;
  };

  this.dibujar = function () {
    if (this.alpha <= 0) return;

    let ultimaPos = this.posicionesPrevias[0] ?? { x: this.x, y: this.y };

    ctx.beginPath();
    ctx.moveTo(ultimaPos.x, ultimaPos.y);
    ctx.lineTo(this.x, this.y);
    ctx.strokeStyle = this.color + this.alpha + ")";
    ctx.stroke();
  };
}

//
// 5. Evento Mouse (solo en áreas vacías)
//
document.addEventListener("mousedown", function (evt) {
  // Solo lanzar fuego si no se hizo click en un elemento interactivo
  const elemento = evt.target;
  if (evt.button === 0 && 
      !elemento.closest('.llama') && 
      !elemento.closest('.regalo') && 
      !elemento.closest('.regalos') &&
      !elemento.closest('.modal-carta') &&
      !elemento.closest('.overlay')) {
    lanzarFuegoClick(evt.clientX, evt.clientY);
  }
});

//
// 6. Animar
//
function animar() {
  requestAnimationFrame(animar);

  // Limpiar canvas (transparente para que se vea el fondo rosa)
  ctx.clearRect(0, 0, ancho, alto);

  // Ver Si Toca Lanzar Un Fuego Automático
  if (temporizador > siguienteDisparo) {
    lanzarFuegoAuto();
    siguienteDisparo = temporizador + intervaloFuego / 60;
  }

  // Actualizar y Dibujar Todos Los Proyectiles
  for (let i = fuegos.length - 1; i >= 0; i--) {
    fuegos[i].actualizar();
    fuegos[i].dibujar();
    if (fuegos[i].eliminar) fuegos.splice(i, 1);
  }

  // Actualizar y Dibujar Todas Las Particulas
  for (let i = particulas.length - 1; i >= 0; i--) {
    particulas[i].actualizar();
    particulas[i].dibujar();
    if (particulas[i].alpha <= 0) particulas.splice(i, 1);
  }

  temporizador++;
}

// Esperar 1.5 segundos antes de iniciar los fuegos artificiales (igual que el confeti)
setTimeout(() => {
  animar();
}, 1500);
