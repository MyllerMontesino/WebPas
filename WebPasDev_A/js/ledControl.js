import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";
import { getFirestore, doc, getDoc, updateDoc, arrayUnion, arrayRemove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";
import { firebaseConfigEstado, firebaseConfigHistorial } from './firebaseConfig.js';

// Inicializar las dos instancias de Firebase
const appEstado = initializeApp(firebaseConfigEstado, 'estado');
const appHistorial = initializeApp(firebaseConfigHistorial, 'historial');

// Obtener referencia a las bases de datos
const databaseEstado = getDatabase(appEstado);
const dbHistorial = getFirestore(appHistorial);

// Función para cambiar el estado de un LED en Firebase (prueba2)
function cambiarEstadoLED(led, nombreCampo) {
  const ledRef = ref(databaseEstado, led);
  get(ledRef).then((snapshot) => {
    const estadoActual = snapshot.val();
    const nuevoEstado = estadoActual === 1 ? 0 : 1;  // Cambia de 1 a 0 o de 0 a 1
    set(ledRef, nuevoEstado);  // Actualiza el estado en Firebase

    // Obtener la fecha y hora actual
    const fechaActual = new Date();
    const fechaFormateada = obtenerFechaFormateada(fechaActual);

    // Guardar la fecha de encendido o apagado en la base de datos de historial
    guardarFechaHistorial(nombreCampo, fechaFormateada, nuevoEstado);
  }).catch((error) => {
    console.error("Error al leer el estado del LED:", error);
  });
}

// Función para guardar la fecha y estado en Firebase (prueba)
function guardarFechaHistorial(nombreCampo, fechaFormateada, estadoLED) {
  const historialDocRef = doc(dbHistorial, "DataPas", "Historial");

  // Crear el objeto de actualización
  const actualizarDatos = {};
  actualizarDatos[nombreCampo] = arrayUnion(fechaFormateada);

  // Actualizar los datos en la base de datos de historial
  updateDoc(historialDocRef, actualizarDatos).then(() => {
    mostrarHistorial();  // Actualizar la lista de fechas después de guardar
  }).catch((error) => {
    console.error("Error al guardar fecha y estado del LED:", error);
  });
}

// Función para obtener la fecha formateada
function obtenerFechaFormateada(fecha) {
  const dia = fecha.getDate();
  const mes = fecha.getMonth() + 1;
  const año = fecha.getFullYear();
  const hora = fecha.getHours();
  const minuto = fecha.getMinutes();
  const segundo = fecha.getSeconds();
  return `${año}-${mes}-${dia} ${hora}:${minuto}:${segundo}`;
}

// Función para programar el cambio de estado
function programarCambioEstado(led, nombreCampo, fechaProgramada) {
  const fechaProgramadaObj = new Date(fechaProgramada);

  const tiempoRestante = fechaProgramadaObj.getTime() - new Date().getTime();

  if (tiempoRestante > 0) {
    setTimeout(() => {
      cambiarEstadoLED(led, nombreCampo);  // Cambiar el estado del LED
    }, tiempoRestante);
  } else {
    alert("La hora programada ya pasó. Por favor, elige una hora futura.");
  }
}

// Función para mostrar el historial en la página
function mostrarHistorial() {
  const registrosList = document.getElementById("registros");
  registrosList.innerHTML = '';  // Limpiar la lista antes de agregar los nuevos registros

  // Obtener el historial de Firebase (base de datos prueba)
  getDoc(doc(dbHistorial, "DataPas", "Historial")).then((docSnapshot) => {
    if (docSnapshot.exists()) {
      const data = docSnapshot.data();
      const led1 = data.CambioEstadoLed || [];
      const led2 = data.CambioEstadoAir || [];

      // Unir las fechas de encendido y apagado en un solo array
      const registros = [];

      led1.forEach((fecha) => {
        registros.push({ tipo: 'Cambio Estado Luces', fecha: fecha });
      });

      led2.forEach((fecha) => {
        registros.push({ tipo: 'Cambio Estado Ventidaor', fecha: fecha });
      });

      // Ordenar los registros por fecha en orden descendente
      registros.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

      // Mostrar los registros ordenados en la tabla
      registros.forEach((registro) => {
        const tr = document.createElement("tr");

        const tdTipo = document.createElement("td");
        tdTipo.textContent = registro.tipo;

        const tdFecha = document.createElement("td");
        tdFecha.textContent = registro.fecha;

        tr.appendChild(tdTipo);
        tr.appendChild(tdFecha);
        registrosList.appendChild(tr);
      });
    } else {
      console.log("No se encontró el documento de historial.");
    }
  }).catch((error) => {
    console.error("Error al obtener el historial:", error);
  });
}

// Mostrar el historial al cargar la página
window.onload = mostrarHistorial;

// Event Listener para el botón de cambiar estado del LED 1 con SweetAlert2
document.getElementById("programarBtn1").addEventListener("click", () => {
  Swal.fire({
    title: 'Seleccione una fecha y hora',
    html: '<input type="datetime-local" id="datetime-select" />',
    confirmButtonText: 'Aceptar',
    preConfirm: () => {
      const dateTimeValue = document.getElementById('datetime-select').value;
      if (dateTimeValue) {
        // Programar el cambio de estado
        programarCambioEstado('luces', 'CambioEstadoLed', dateTimeValue);

        // Mostrar mensaje de confirmación
        Swal.fire({
          title: 'Programación Exitosa',
          text: `El cambio de estado para las Luces se ha programado para: ${dateTimeValue}`,
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });

        // Mostrar la fecha programada en el campo correspondiente
        document.getElementById("fechaProgramada1").textContent = `Fecha programada para las Luces: ${dateTimeValue}`;

        // Hacer visible el botón de eliminar
        document.getElementById("eliminarBtn1").style.display = 'inline-block';
      } else {
        Swal.fire('Por favor, selecciona una fecha y hora.');
      }
    }
  });
});

// Event Listener para el botón de cambiar estado del LED 2 con SweetAlert2
document.getElementById("programarBtn2").addEventListener("click", () => {
  Swal.fire({
    title: 'Seleccione una fecha y hora',
    html: '<input type="datetime-local" id="datetime-select" />',
    confirmButtonText: 'Aceptar',
    preConfirm: () => {
      const dateTimeValue = document.getElementById('datetime-select').value;
      if (dateTimeValue) {
        // Programar el cambio de estado
        programarCambioEstado('ventilador', 'CambioEstadoAir', dateTimeValue);

        // Mostrar mensaje de confirmación
        Swal.fire({
          title: 'Programación Exitosa',
          text: `El cambio de estado para los ventiladores se ha programado para: ${dateTimeValue}`,
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });

        // Mostrar la fecha programada en el campo correspondiente
        document.getElementById("fechaProgramada2").textContent = `Fecha programada para los ventiladores: ${dateTimeValue}`;

        // Hacer visible el botón de eliminar
        document.getElementById("eliminarBtn2").style.display = 'inline-block';
      } else {
        Swal.fire('Por favor, selecciona una fecha y hora.');
      }
    }
  });
});

// Event Listener para el botón de cambiar estado del LED 1
document.getElementById("cambiarEstadoBtn1").addEventListener("click", () => {
  cambiarEstadoLED('luces', 'CambioEstadoLed'); // Cambia el estado de LED 1
});

// Event Listener para el botón de cambiar estado del LED 2
document.getElementById("cambiarEstadoBtn2").addEventListener("click", () => {
  cambiarEstadoLED('ventilador', 'CambioEstadoAir'); // Cambia el estado de LED 2
});

// Event Listener para el botón de eliminar programación de LED 1
document.getElementById("eliminarBtn1").addEventListener("click", () => {
  // Eliminar la programación
  document.getElementById("fechaProgramada1").textContent = '';
  document.getElementById("eliminarBtn1").style.display = 'none'; // Ocultar el botón de eliminar

  // Mostrar confirmación de eliminación
  Swal.fire({
    title: 'Programación Eliminada',
    text: 'La programación para LED 1 ha sido eliminada.',
    icon: 'info',
    confirmButtonText: 'Aceptar'
  });
});

// Event Listener para el botón de eliminar programación de LED 2
document.getElementById("eliminarBtn2").addEventListener("click", () => {
  // Eliminar la programación
  document.getElementById("fechaProgramada2").textContent = '';
  document.getElementById("eliminarBtn2").style.display = 'none'; // Ocultar el botón de eliminar

  // Mostrar confirmación de eliminación
  Swal.fire({
    title: 'Programación Eliminada',
    text: 'La programación para LED 2 ha sido eliminada.',
    icon: 'info',
    confirmButtonText: 'Aceptar'
  });
});




















 
