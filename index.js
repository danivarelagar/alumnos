import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Configuración de Firebase

const firebaseConfig = {
    apiKey: "AIzaSyB4SXpaX6EQ3awcB5-zoVl8ZfFKnksFLCc",
    authDomain: "viajes1-169b1.firebaseapp.com",
    projectId: "viajes1-169b1",
    storageBucket: "viajes1-169b1.appspot.com",
    messagingSenderId: "273546634402",
    appId: "1:273546634402:web:a74ebf744ad4f1768da3fb",
    measurementId: "G-5VQJZ0YSJY"
  };


// Inicializa Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("studentForm");
    const studentsList = document.getElementById("studentsList");

    db.collection("alumnos").onSnapshot((snapshot) => {
        studentsList.innerHTML = "";
        snapshot.forEach((doc) => {
            addStudentToList(doc.id, doc.data().nombre, doc.data().apellido, doc.data().dni, doc.data().asistencia, doc.data().avatarUrl);
        });
    });

    form.addEventListener("submit", function(event) {
        event.preventDefault();
        addStudent();
    });

    function addStudent() {
        const nombre = document.getElementById("nombre").value.trim();
        const apellido = document.getElementById("apellido").value.trim();
        const dni = document.getElementById("dni").value.trim();
        const asistencia = document.getElementById("asistencia").value;
        const avatarUrl = `https://api.multiavatar.com/${nombre}${apellido}.png`;

        db.collection("alumnos").add({
            nombre: nombre,
            apellido: apellido,
            dni: dni,
            asistencia: asistencia,
            avatarUrl: avatarUrl
        }).then(() => {
            form.reset();
        }).catch((error) => {
            console.error("Error adding student: ", error);
        });
    }

    function addStudentToList(id, nombre, apellido, dni, asistencia, avatarUrl) {
        const li = document.createElement("li");
        li.className = "list-group-item d-flex justify-content-between align-items-center";
        li.innerHTML = `
            <div>
                <img src="${avatarUrl}" alt="${nombre}" class="mr-3">
                <strong>${nombre} ${apellido}</strong> - DNI: ${dni} - Asistencia: ${asistencia}
            </div>
            <div>
                <button class="btn btn-warning btn-sm mr-2 visited">Visitado</button>
                <button class="btn btn-danger btn-sm delete">Eliminar</button>
            </div>
        `;

        li.querySelector(".visited").addEventListener("click", function() {
            li.classList.toggle("visited");
        });

        li.querySelector(".delete").addEventListener("click", function() {
            db.collection("alumnos").doc(id).delete().then(() => {
                console.log("Alumno eliminado exitosamente!");
            }).catch((error) => {
                console.error("Error al eliminar el alumno: ", error);
            });
        });

        studentsList.appendChild(li);
    }
});

