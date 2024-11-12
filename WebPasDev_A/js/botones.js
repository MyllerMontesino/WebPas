// Función que maneja el clic en el botón principal
document.getElementById('botonProgramar').addEventListener('click', function() {
    var menu = document.getElementById('menuOpciones');
    // Alterna la visibilidad del menú (mostrar/ocultar)
    if (menu.style.display === "none" || menu.style.display === "") {
        menu.style.display = "block";
    } else {
        menu.style.display = "none";
    }
  });
  
  // Función para manejar las opciones seleccionadas
  function programar(opcion) {
    document.getElementById('menuOpciones').style.display = "none"; // Ocultar el menú después de seleccionar una opción
  }
  

  // Función que maneja el clic en el botón principal
  document.getElementById('mostrarhisto').addEventListener('click', function() {
    var menu = document.getElementById('registros-container');
    // Alterna la visibilidad del menú (mostrar/ocultar)
    if (menu.style.display === "none" || menu.style.display === "") {
        menu.style.display = "block";
    } else {
        menu.style.display = "none";
    }
  });