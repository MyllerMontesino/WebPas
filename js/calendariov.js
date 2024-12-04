let calendarInput; // Declarar el calendario globalmente
let tipoConfiguracion = ""; // Variable para guardar el tipo de configuración

// Función para inicializar el calendario
function inicializarCalendario() {
  calendarInput = flatpickr("#calendarVentiladores", {
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
  const modalTitle = document.getElementById("modalTitleVentiladores");
  modalTitle.textContent = tipo === "encendido" ? "Configurar Encendido" : "Configurar Apagado";

  // Restablecer los campos al abrir el modal
  document.getElementById("hora-ventiladores").value = "";

  // Destruir y volver a inicializar el calendario
  if (calendarInput) {
    calendarInput.destroy();
  }
  inicializarCalendario();

  // Mostrar el modal
  document.getElementById("modal-config-ventiladores").style.display = "block";
}

// Asociar botones para abrir el modal
document.getElementById("programarEncendidoVentiladorBtn").addEventListener("click", function() {
  abrirModal("encendido");
});
document.getElementById("programarApagadoVentiladorBtn").addEventListener("click", function() {
  abrirModal("apagado");
});

// Funcionalidad para cerrar el modal
document.getElementById("closeModalVentiladoresBtn").addEventListener("click", function() {
  document.getElementById("modal-config-ventiladores").style.display = "none";
});

// Guardar configuración
document.getElementById("guardarConfigVentiladoresBtn").addEventListener("click", function() {
  const hora = document.getElementById("hora-ventiladores").value;
  const rangoFechas = document.getElementById("calendarVentiladores").value;

  if (!hora) {
    alert("Por favor selecciona una hora.");
    return;
  }

  // Guardar en localStorage
  if (tipoConfiguracion === "encendido") {
    localStorage.setItem("configEncendidoVentilador", JSON.stringify({ hora, rangoFechas }));
    document.getElementById("encendidoVentiladorMessage").style.display = "block";
    document.getElementById("encendidoVentiladorDetails").innerHTML = `
      <p><strong>Hora:</strong> ${hora}</p>
      <p><strong>Rango de fechas:</strong> ${rangoFechas || "No seleccionado"}</p>
    `;
  } else if (tipoConfiguracion === "apagado") {
    localStorage.setItem("configApagadoVentilador", JSON.stringify({ hora, rangoFechas }));
    document.getElementById("apagadoVentiladorMessage").style.display = "block";
    document.getElementById("apagadoVentiladorDetails").innerHTML = `
      <p><strong>Hora:</strong> ${hora}</p>
      <p><strong>Rango de fechas:</strong> ${rangoFechas || "No seleccionado"}</p>
    `;
  }

  // Ocultar el modal
  document.getElementById("modal-config-ventiladores").style.display = "none";
  console.log(`Configuración ${tipoConfiguracion} guardada: Hora - ${hora}, Rango de fechas - ${rangoFechas || "No seleccionado"}`);
});

// Eliminar configuraciones
document.getElementById("eliminarEncendidoVentiladorBtn").addEventListener("click", function() {
  localStorage.removeItem("configEncendidoVentilador");
  document.getElementById("encendidoVentiladorMessage").style.display = "none";
  document.getElementById("encendidoVentiladorDetails").innerHTML = "";
  console.log("Configuración de encendido eliminada.");
});

document.getElementById("eliminarApagadoVentiladorBtn").addEventListener("click", function() {
  localStorage.removeItem("configApagadoVentilador");
  document.getElementById("apagadoVentiladorMessage").style.display = "none";
  document.getElementById("apagadoVentiladorDetails").innerHTML = "";
  console.log("Configuración de apagado eliminada.");
});

// Recuperar configuración al cargar la página
window.addEventListener('load', function() {
  // Recuperar configuración de encendido
  const configEncendidoVentilador = JSON.parse(localStorage.getItem("configEncendidoVentilador"));
  if (configEncendidoVentilador) {
    document.getElementById("encendidoVentiladorMessage").style.display = "block";
    document.getElementById("encendidoVentiladorDetails").innerHTML = `
      <p><strong>Hora:</strong> ${configEncendidoVentilador.hora}</p>
      <p><strong>Rango de fechas:</strong> ${configEncendidoVentilador.rangoFechas || "No seleccionado"}</p>
    `;
  }

  // Recuperar configuración de apagado
  const configApagadoVentilador = JSON.parse(localStorage.getItem("configApagadoVentilador"));
  if (configApagadoVentilador) {
    document.getElementById("apagadoVentiladorMessage").style.display = "block";
    document.getElementById("apagadoVentiladorDetails").innerHTML = `
      <p><strong>Hora:</strong> ${configApagadoVentilador.hora}</p>
      <p><strong>Rango de fechas:</strong> ${configApagadoVentilador.rangoFechas || "No seleccionado"}</p>
    `;
  }

  // Inicializar el calendario
  inicializarCalendario();
});


