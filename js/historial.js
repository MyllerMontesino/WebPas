// Firebase Configuración y Inicialización
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";
import { getFirestore, doc, onSnapshot } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

// Configuración de Firebase para la base de datos principal
const firebaseConfig = {
  apiKey: "AIzaSyDspx4vYlUcd6wJpn4vB1wjqR3_MgDloH4",
  authDomain: "prueba2-pas.firebaseapp.com",
  databaseURL: "https://prueba2-pas-default-rtdb.firebaseio.com",
  projectId: "prueba2-pas",
  storageBucket: "prueba2-pas.firebasestorage.app",
  messagingSenderId: "810328879396",
  appId: "1:810328879396:web:636f55ff7f1f6cbf3cc3b1",
  measurementId: "G-NX3YR6GYV4"
};

// Configuración de Firebase para el historial
const firebaseConfigHistorial = {
  apiKey: "AIzaSyBPw64-jgBnVmwDouNL2Avk_lmRkAos-PQ",
  authDomain: "prueba-398f6.firebaseapp.com",
  projectId: "prueba-398f6",
  storageBucket: "prueba-398f6.appspot.com",
  messagingSenderId: "1039041952689",
  appId: "1:1039041952689:web:d49dde2c2f1e8b828d5b90"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const appHistorial = initializeApp(firebaseConfigHistorial, "historialApp");
const dbHistorial = getFirestore(appHistorial);

// Función para mostrar u ocultar el historial con filtros
function mostrarHistorial() {
  const registrosList = document.getElementById("registros");
  const tableContainer = document.getElementById("tableContainer");
  const filtersContainer = document.getElementById("filtersContainer");

  // Alternar la visibilidad de la tabla
  if (tableContainer.style.display === "none" || tableContainer.style.display === "") {
    tableContainer.style.display = "block"; // Mostrar tabla
  } else {
    tableContainer.style.display = "none"; // Ocultar tabla
  }

  // Alternar la visibilidad de los filtros
  if (filtersContainer.style.display === "none" || filtersContainer.style.display === "") {
    filtersContainer.style.display = "block"; // Mostrar filtros
  } else {
    filtersContainer.style.display = "none"; // Ocultar filtros
  }

  // Obtener los valores de los filtros
  const fechaInicio = document.getElementById("fechaInicio").value;
  const fechaFin = document.getElementById("fechaFin").value;
  const tipoDispositivo = document.getElementById("tipoDispositivo").value;

  // Escuchar cambios en tiempo real en el documento de historial
  const historialDocRef = doc(dbHistorial, "DataPas", "Historial");

  onSnapshot(historialDocRef, (docSnapshot) => {
    if (docSnapshot.exists()) {
      const data = docSnapshot.data();

      // Verificar si los campos existen en los datos y asignarlos
      const ventiladorEncendido = data?.ventiladoron || [];
      const ventiladorApagado = data?.ventiladoroff || [];
      const lucesEncendido = data?.ledon || [];
      const lucesApagado = data?.ledoff || [];

      const registros = [];

      // Crear los registros de ventilador
      ventiladorEncendido.forEach((fecha) => {
        registros.push({ tipo: 'El Ventilador Se Encendió', fecha: fecha, dispositivo: 'ventilador' });
      });
      ventiladorApagado.forEach((fecha) => {
        registros.push({ tipo: 'El Ventilador Se Apagó', fecha: fecha, dispositivo: 'ventilador' });
      });

      // Crear los registros de luces
      lucesEncendido.forEach((fecha) => {
        registros.push({ tipo: 'La Luz Se Encendió', fecha: fecha, dispositivo: 'luces' });
      });
      lucesApagado.forEach((fecha) => {
        registros.push({ tipo: 'La Luz Se Apagó', fecha: fecha, dispositivo: 'luces' });
      });

      // Filtrar los registros según los filtros aplicados
      const registrosFiltrados = registros.filter(registro => {
        let fechaValida = true;

        // Filtrar por fecha
        if (fechaInicio) {
          fechaValida = new Date(registro.fecha) >= new Date(fechaInicio);
        }
        if (fechaFin) {
          fechaValida = fechaValida && new Date(registro.fecha) <= new Date(fechaFin);
        }

        // Filtrar por tipo de dispositivo
        const dispositivoValido = tipoDispositivo ? registro.dispositivo === tipoDispositivo : true;

        return fechaValida && dispositivoValido;
      });

      // Ordenar los registros por fecha (más recientes primero)
      registrosFiltrados.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

      // Limpiar la tabla solo una vez al inicio
      registrosList.innerHTML = ''; // Limpiar la tabla

      // Agregar los registros filtrados a la tabla
      registrosFiltrados.forEach((registro) => {
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
  });
}


// Función para buscar datos filtrados
function buscarDatos() {
  const registrosList = document.getElementById("registros");

  // Obtener los valores de los filtros
  const fechaInicio = document.getElementById("fechaInicio").value;
  const fechaFin = document.getElementById("fechaFin").value;
  const tipoDispositivo = document.getElementById("tipoDispositivo").value;

  const historialDocRef = doc(dbHistorial, "DataPas", "Historial");

  onSnapshot(historialDocRef, (docSnapshot) => {
    if (docSnapshot.exists()) {
      const data = docSnapshot.data();
      const ventiladorEncendido = data?.ventiladoron || [];
      const ventiladorApagado = data?.ventiladoroff || [];
      const lucesEncendido = data?.ledon || [];
      const lucesApagado = data?.ledoff || [];

      const registros = [];

      ventiladorEncendido.forEach((fecha) => {
        registros.push({ tipo: 'El Ventilador Se Encendió', fecha: fecha, dispositivo: 'ventilador' });
      });
      ventiladorApagado.forEach((fecha) => {
        registros.push({ tipo: 'El Ventilador Se Apagó', fecha: fecha, dispositivo: 'ventilador' });
      });
      lucesEncendido.forEach((fecha) => {
        registros.push({ tipo: 'La Luz Se Encendió', fecha: fecha, dispositivo: 'luces' });
      });
      lucesApagado.forEach((fecha) => {
        registros.push({ tipo: 'La Luz Se Apagó', fecha: fecha, dispositivo: 'luces' });
      });

      const registrosFiltrados = registros.filter(registro => {
        let fechaValida = true;

        // Filtrar por fecha
        if (fechaInicio) {
          fechaValida = new Date(registro.fecha) >= new Date(fechaInicio);
        }
        if (fechaFin) {
          fechaValida = fechaValida && new Date(registro.fecha) <= new Date(fechaFin);
        }

        const dispositivoValido = tipoDispositivo ? registro.dispositivo === tipoDispositivo : true;

        return fechaValida && dispositivoValido;
      });

      registrosFiltrados.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

      // Limpiar la tabla antes de agregar los resultados
      registrosList.innerHTML = '';

      // Agregar los resultados filtrados a la tabla
      registrosFiltrados.forEach((registro) => {
        const tr = document.createElement("tr");
        const tdTipo = document.createElement("td");
        tdTipo.textContent = registro.tipo;
        const tdFecha = document.createElement("td");
        tdFecha.textContent = registro.fecha;
        tr.appendChild(tdTipo);
        tr.appendChild(tdFecha);
        registrosList.appendChild(tr);
      });
    }
  });
}

// Eventos
document.getElementById("verHistorialBtn").addEventListener("click", mostrarHistorial);
document.getElementById("buscarBtn").addEventListener("click", buscarDatos);
