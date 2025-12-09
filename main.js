// Regex para validaciones
const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const regexCelular = /^[67]\d{7}$/; // Bolivia
const regexPass = /^.{4,}$/; // mínimo 4 caracteres

let usuarioGuardado = {};
let intentosFallidos = 0;
let cuentaBloqueada = false;
let tiempoBloqueo = null;

// Función genérica para alternar visibilidad de contraseña
function togglePassword(fieldId, buttonId) {
  const field = document.getElementById(fieldId);
  const button = document.getElementById(buttonId);
  if (field.type === "password") {
    field.type = "text";
    button.textContent = "Ocultar";
  } else {
    field.type = "password";
    button.textContent = "Ver";
  }
}

// Asignar botones
document.getElementById("toggleRegistro").addEventListener("click", () => {
  togglePassword("contraseña", "toggleRegistro");
});
document.getElementById("toggleLogin").addEventListener("click", () => {
  togglePassword("loginPass", "toggleLogin");
});
document.getElementById("toggleNueva").addEventListener("click", () => {
  togglePassword("nuevaPass", "toggleNueva");
});

// Registro
document.getElementById("registerForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const nombre = document.getElementById("nombre").value;
  const correo = document.getElementById("correo").value;
  const celular = document.getElementById("celular").value;
  const pass = document.getElementById("contraseña").value;
  const mensaje = document.getElementById("mensajeRegistro");

  if (!regexCorreo.test(correo) || !regexCelular.test(celular) || !regexPass.test(pass)) {
    mensaje.textContent = "Datos inválidos. Verifica los campos.";
    return;
  }

  usuarioGuardado = { nombre, correo, pass };
  mensaje.textContent = "✅ Ya se registró correctamente.";
});

// Login
document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const correo = document.getElementById("loginCorreo").value;
  const pass = document.getElementById("loginPass").value;
  const mensaje = document.getElementById("mensajeLogin");

  if (cuentaBloqueada) {
    const ahora = new Date();
    if (ahora < tiempoBloqueo) {
      mensaje.textContent = "Cuenta bloqueada. Vuelva a intentarlo dentro de 3 minutos.";
      return;
    } else {
      cuentaBloqueada = false;
      intentosFallidos = 0;
    }
  }

  if (correo === usuarioGuardado.correo && pass === usuarioGuardado.pass) {
    mensaje.textContent = `Bienvenido al sistema, ${usuarioGuardado.nombre}`;
    intentosFallidos = 0;
  } else {
    intentosFallidos++;
    mensaje.textContent = "Usuario o contraseña incorrectos.";
    if (intentosFallidos >= 3) {
      cuentaBloqueada = true;
      tiempoBloqueo = new Date(new Date().getTime() + 3 * 60000); // 3 minutos
      document.getElementById("recuperarLink").style.display = "inline";
    }
  }
});

// Recuperar contraseña
document.getElementById("recuperarLink").addEventListener("click", function () {
  document.getElementById("recuperarSeccion").style.display = "block";
});

document.getElementById("actualizarPass").addEventListener("click", function () {
  const correoRec = document.getElementById("recuperarCorreo").value;
  const nuevaPass = document.getElementById("nuevaPass").value;
  const mensaje = document.getElementById("mensajeRecuperar");

  if (correoRec !== usuarioGuardado.correo) {
    mensaje.textContent = "Correo no registrado.";
    return;
  }

  if (!regexPass.test(nuevaPass)) {
    mensaje.textContent = "Contraseña inválida.";
    return;
  }

  usuarioGuardado.pass = nuevaPass;
  cuentaBloqueada = false;
  intentosFallidos = 0;
  mensaje.textContent = "Contraseña actualizada. Ahora puede iniciar sesión.";
});