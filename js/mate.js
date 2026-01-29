// ================= SESIÓN DEL ESTUDIANTE =================
const nombreEstudiante = localStorage.getItem("estudiante");

// Seguridad: si no hay nombre, volver al inicio
if (!nombreEstudiante) {
  alert("Debes ingresar tu nombre para acceder al curso");
  window.location.href = "index.html";
}

// Mostrar nombre
window.addEventListener("DOMContentLoaded", () => {
  const titulo = document.getElementById("bienvenida");
  if (titulo) {
    titulo.innerText = `Bienvenido/a, ${nombreEstudiante}`;
  }
});

// ================= FUNCIONES ÚTILES =================
function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function mezclar(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

// ================= QUIZZES POR CLASE =================
const sesiones = {
  quiz1: [
    { q: "¿Cuál es un número entero?", o: ["5", "0.5"], a: "5" },
    { q: "−3 es un número:", o: ["Entero", "Natural"], a: "Entero" }
  ],
  quiz2: [
    { q: "¿Cuál es un número natural?", o: ["7", "-4"], a: "7" },
    { q: "Los naturales incluyen:", o: ["1", "-1"], a: "1" }
  ],
  quiz3: [
    { q: "4 × (−2) =", o: ["−8", "8"], a: "−8" },
    { q: "(−3) × (−3) =", o: ["9", "−9"], a: "9" }
  ],
  quiz4: [
    { q: "6 × 4 =", o: ["24", "20"], a: "24" },
    { q: "12 ÷ 3 =", o: ["4", "6"], a: "4" }
  ]
};

// ================= CREAR QUIZZES =================
function crearQuiz(id) {
  let html = "";
  sesiones[id].forEach((p, i) => {
    html += `<div class="quiz"><p>${p.q}</p>`;
    p.o.forEach(op => {
      html += `
        <label>
          <input type="radio" name="${id}${i}" value="${op}">
          ${op}
        </label><br>`;
    });
    html += `</div>`;
  });
  document.getElementById(id).innerHTML = html;
}

["quiz1", "quiz2", "quiz3", "quiz4"].forEach(crearQuiz);

// ================= REVISAR CLASE =================
function revisarClase(quizId, resId) {
  let correctas = 0;
  sesiones[quizId].forEach((p, i) => {
    const sel = document.querySelector(
      `input[name="${quizId}${i}"]:checked`
    );
    if (sel && sel.value === p.a) correctas++;
  });

  document.getElementById(resId).innerText =
    `Correctas: ${correctas} / ${sesiones[quizId].length}`;
}

// ================= PREGUNTAS RANDOM =================
function generarPreguntaRandom() {
  let tipo = rand(1, 4);
  let a, b, correcta, pregunta;

  switch (tipo) {
    case 1:
      a = rand(1, 10);
      b = rand(1, 10);
      correcta = a + b;
      pregunta = `¿Cuánto es ${a} + ${b}?`;
      break;
    case 2:
      a = rand(5, 20);
      b = rand(1, 10);
      correcta = a - b;
      pregunta = `¿Cuánto es ${a} − ${b}?`;
      break;
    case 3:
      a = rand(1, 10);
      b = rand(1, 10);
      correcta = a * b;
      pregunta = `¿Cuánto es ${a} × ${b}?`;
      break;
    case 4:
      b = rand(1, 10);
      correcta = rand(1, 10);
      a = correcta * b;
      pregunta = `¿Cuánto es ${a} ÷ ${b}?`;
      break;
  }

  let opciones = mezclar([
    correcta,
    correcta + rand(1, 3),
    correcta - rand(1, 3)
  ]);

  return { q: pregunta, o: opciones, a: correcta };
}

// ================= BANCO FINAL =================
let bancoFinal = [];
for (let i = 0; i < 10; i++) {
  bancoFinal.push(generarPreguntaRandom());
}

// ================= MOSTRAR EVALUACIÓN FINAL =================
function crearEvaluacionFinal() {
  let html = "";
  bancoFinal.forEach((p, i) => {
    html += `<div class="quiz"><p>${p.q}</p>`;
    p.o.forEach(op => {
      html += `
        <label>
          <input type="radio" name="f${i}" value="${op}">
          ${op}
        </label><br>`;
    });
    html += `</div>`;
  });
  document.getElementById("finalQuiz").innerHTML = html;
}
crearEvaluacionFinal();

// ================= CALCULAR NOTA =================
function calcularFinal() {
  let nota = 0;
  bancoFinal.forEach((p, i) => {
    const sel = document.querySelector(`input[name="f${i}"]:checked`);
    if (sel && Number(sel.value) === p.a) nota += 2;
  });

  document.getElementById("notaFinal").innerText =
    `Nota final: ${nota} / 20`;
}

// ================= PDF =================
function descargarEvaluacion() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  let y = 10;
  let nota = 0;

  doc.setFontSize(14);
  doc.text("EVALUACIÓN FINAL - MATEMÁTICA", 10, y);
  y += 8;

  doc.setFontSize(12);
  doc.text(`Estudiante: ${nombreEstudiante}`, 10, y);
  y += 10;

  bancoFinal.forEach((p, i) => {
    const sel = document.querySelector(`input[name="f${i}"]:checked`);
    const resp = sel ? sel.value : "No respondió";
    if (Number(resp) === p.a) nota += 2;

    doc.text(`${i + 1}. ${p.q}`, 10, y);
    y += 6;

    p.o.forEach(op => {
      doc.text(`- ${op}`, 14, y);
      y += 5;
    });

    doc.text(`Respuesta del estudiante: ${resp}`, 14, y);
    y += 5;
    doc.text(`Respuesta correcta: ${p.a}`, 14, y);
    y += 8;

    if (y > 270) {
      doc.addPage();
      y = 10;
    }
  });

  doc.setFontSize(13);
  doc.text(`NOTA FINAL: ${nota} / 20`, 10, y + 5);

  doc.save(`evaluacion_matematica_${nombreEstudiante}.pdf`);
}

// ================= NAVEGACIÓN =================
document.querySelectorAll(".session-btn").forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll(".session").forEach(
      s => s.style.display = "none"
    );
    document.getElementById(btn.dataset.s).style.display = "block";
  };
});

// Mostrar primera sesión
document.getElementById("s1").style.display = "block";
