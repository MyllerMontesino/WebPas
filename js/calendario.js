let calendarInput; // Declarar el calendario globalmente
let tipoConfiguracion = ""; // Variable para guardar el tipo de configuración

// Función para inicializar el calendario
function inicializarCalendario() {
  calendarInput = flatpickr("#calendar", {
    mode: "range", // Permite seleccionar un rango de fechas
    dateFormat: "Y-m-d", // Formato de fecha
    onChange: function(selectedDates) {
      console.log("Rango de fechas seleccionado: ", selectedDates);
    }
  });
}

// Función para abrir el modal y definir el tipo de configuración
function abrirModal(tipo) {
  tipoConfiguracion = tipo;

  // Cambiar el título del modal según el tipo de configuración
  const modalTitle = document.getElementById("modalTitle");
  modalTitle.textContent = tipo === "encendido" ? "Configurar Encendido" : "Configurar Apagado";

  // Restablecer los campos al abrir el modal
  document.getElementById("hora").value = "";

  // Destruir y volver a inicializar el calendario
  if (calendarInput) {
    calendarInput.destroy();
  }
  inicializarCalendario();

  // Mostrar el modal
  document.getElementById("modal-config").style.display = "block";
}

// Asociar botones para abrir el modal
document.getElementById("programarEncendidoBtn").addEventListener("click", function() {
  abrirModal("encendido");
});
document.getElementById("programarApagadoBtn").addEventListener("click", function() {
  abrirModal("apagado");
});

// Funcionalidad para cerrar el modal
document.getElementById("closeModalBtn").addEventListener("click", function() {
  document.getElementById("modal-config").style.display = "none";
});

// Guardar configuración
document.getElementById("guardarConfigBtn").addEventListener("click", function() {
  const hora = document.getElementById("hora").value;
  const rangoFechas = document.getElementById("calendar").value;

  if (!hora) {
    alert("Por favor selecciona una hora.");
    return;
  }

  // Guardar en localStorage
  if (tipoConfiguracion === "encendido") {
    localStorage.setItem("configEncendido", JSON.stringify({ hora, rangoFechas }));
    document.getElementById("encendidoMessage").style.display = "block";
    document.getElementById("encendidoDetails").innerHTML = `
      <p><strong>Hora:</strong> ${hora}</p>
      <p><strong>Rango de fechas:</strong> ${rangoFechas || "No seleccionado"}</p>
    `;
  } else if (tipoConfiguracion === "apagado") {
    localStorage.setItem("configApagado", JSON.stringify({ hora, rangoFechas }));
    document.getElementById("apagadoMessage").style.display = "block";
    document.getElementById("apagadoDetails").innerHTML = `
      <p><strong>Hora:</strong> ${hora}</p>
      <p><strong>Rango de fechas:</strong> ${rangoFechas || "No seleccionado"}</p>
    `;
  }

  // Ocultar el modal
  document.getElementById("modal-config").style.display = "none";
  console.log(`Configuración ${tipoConfiguracion} guardada: Hora - ${hora}, Rango de fechas - ${rangoFechas || "No seleccionado"}`);
});

// Eliminar configuraciones
document.getElementById("eliminarEncendidoBtn").addEventListener("click", function() {
  localStorage.removeItem("configEncendido");
  document.getElementById("encendidoMessage").style.display = "none";
  document.getElementById("encendidoDetails").innerHTML = "";
  console.log("Configuración de encendido eliminada.");
});

document.getElementById("eliminarApagadoBtn").addEventListener("click", function() {
  localStorage.removeItem("configApagado");
  document.getElementById("apagadoMessage").style.display = "none";
  document.getElementById("apagadoDetails").innerHTML = "";
  console.log("Configuración de apagado eliminada.");
});

// Recuperar configuración al cargar la página
window.addEventListener('load', function() {
  // Recuperar configuración de encendido
  const configEncendido = JSON.parse(localStorage.getItem("configEncendido"));
  if (configEncendido) {
    document.getElementById("encendidoMessage").style.display = "block";
    document.getElementById("encendidoDetails").innerHTML = `
      <p><strong>Hora:</strong> ${configEncendido.hora}</p>
      <p><strong>Rango de fechas:</strong> ${configEncendido.rangoFechas || "No seleccionado"}</p>
    `;
  }

  // Recuperar configuración de apagado
  const configApagado = JSON.parse(localStorage.getItem("configApagado"));
  if (configApagado) {
    document.getElementById("apagadoMessage").style.display = "block";
    document.getElementById("apagadoDetails").innerHTML = `
      <p><strong>Hora:</strong> ${configApagado.hora}</p>
      <p><strong>Rango de fechas:</strong> ${configApagado.rangoFechas || "No seleccionado"}</p>
    `;
  }

  // Inicializar el calendario
  inicializarCalendario();
});



