function guardarNombre(){
  const nombre = document.getElementById("studentName").value.trim();

  if(nombre === ""){
    alert("Por favor ingresa tu nombre 🙂");
    return;
  }

  localStorage.setItem("estudiante", nombre);

  window.location.href = "cursos.html";
}

