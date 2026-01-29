// ================= SESIÓN DEL ESTUDIANTE =================
const nombreEstudiante = localStorage.getItem("estudiante");

// Si no hay nombre, vuelve al inicio
if (!nombreEstudiante) {
  alert("Debes ingresar tu nombre para acceder al curso");
  location.href = "index.html";
}

// Mostrar bienvenida
window.onload = () => {
  document.getElementById("bienvenida").innerText =
    `Bienvenido/a, ${nombreEstudiante}`;
};

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

// ================= CREAR QUIZ =================
function crearQuiz(id) {
  let html = "";

  for (let i = 0; i < sesiones[id].length; i++) {
    html += `<p>${sesiones[id][i].q}</p>`;

    for (let j = 0; j < sesiones[id][i].o.length; j++) {
      html += `
        <label>
          <input type="radio" name="${id}${i}" value="${sesiones[id][i].o[j]}">
          ${sesiones[id][i].o[j]}
        </label><br>`;
    }
  }

  document.getElementById(id).innerHTML = html;
}

// Crear quizzes
crearQuiz("quiz1");
crearQuiz("quiz2");
crearQuiz("quiz3");
crearQuiz("quiz4");

// ================= REVISAR CLASE =================
function revisarClase(quizId, resId) {
  let correctas = 0;

  sesiones[quizId].forEach((p, i) => {
    let r = document.querySelector(
      `input[name="${quizId}${i}"]:checked`
    );
    if (r && r.value === p.a) correctas++;
  });

  document.getElementById(resId).innerText =
    `Correctas: ${correctas} / ${sesiones[quizId].length}`;
}

// ================= PREGUNTAS RANDOM =================
function generarPreguntaRandom() {
  let tipo = rand(1, 4);
  let a, b, correcta, pregunta;

  // 👉 SUMA
  if (tipo === 1) {
    a = rand(1, 10);
    b = rand(1, 10);
    correcta = a + b;
    pregunta = `¿Cuánto es ${a} + ${b}?`;
  }

  // 👉 RESTA
  if (tipo === 2) {
    a = rand(5, 20);
    b = rand(1, 10);
    correcta = a - b;
    pregunta = `¿Cuánto es ${a} − ${b}?`;
  }

  // 👉 MULTIPLICACIÓN
  if (tipo === 3) {
    a = rand(1, 10);
    b = rand(1, 10);
    correcta = a * b;
    pregunta = `¿Cuánto es ${a} × ${b}?`;
  }

  // 👉 DIVISIÓN EXACTA
  if (tipo === 4) {
    b = rand(1, 10);
    correcta = rand(1, 10);
    a = correcta * b;
    pregunta = `¿Cuánto es ${a} ÷ ${b}?`;
  }

  return {
    q: pregunta,
    o: mezclar([correcta, correcta + 1, correcta - 1]),
    a: correcta
  };
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
    html += `<p>${p.q}</p>`;
    p.o.forEach(op => {
      html += `
        <label>
          <input type="radio" name="f${i}" value="${op}">
          ${op}
        </label><br>`;
    });
  });

  document.getElementById("finalQuiz").innerHTML = html;
}
crearEvaluacionFinal();

// ================= CALCULAR NOTA =================
function calcularFinal() {
  let nota = 0;

  bancoFinal.forEach((p, i) => {
    let r = document.querySelector(`input[name="f${i}"]:checked`);
    if (r && Number(r.value) === p.a) nota += 2;
  });

  document.getElementById("notaFinal").innerText =
    `Nota final: ${nota} / 20`;
}

// ================= PDF =================
// 
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

