let uploadedFiles = {
    resources: {
        "Curso de Estadistica": [
            { name: "Notas_Estadistica.pdf", type: "application/pdf", file: new Blob(["Contenido de ejemplo"], { type: "application/pdf" }) },
            { name: "Grafico_Estadistica.png", type: "image/png", file: new Blob(["Contenido de imagen"], { type: "image/png" }) }
        ],
        "Curso de Programación": [
            { name: "Ejemplo_Codigo.cpp", type: "text/plain", file: new Blob(["#include <iostream>"], { type: "text/plain" }) }
        ],
        "Curso de Filosofía": [
            { name: "Ensayo_Filosofia.pdf", type: "application/pdf", file: new Blob(["Ensayo de ejemplo"], { type: "application/pdf" }) }
        ]
    },
    exams: {
        "Examen Resuelto - Curso de Estadistica": [
            { name: "Examen_Estadistica_2023.pdf", type: "application/pdf", file: new Blob(["Examen de ejemplo"], { type: "application/pdf" }) }
        ],
        "Examen Resuelto - Curso de Programación": [
            { name: "Solucion_Programacion.pdf", type: "application/pdf", file: new Blob(["Solución de ejemplo"], { type: "application/pdf" }) }
        ]
    }
};

// Cargar username desde localStorage al iniciar
document.addEventListener("DOMContentLoaded", () => {
    const savedUsername = localStorage.getItem("username");
    if (savedUsername) {
        document.getElementById("usernameDisplay").textContent = savedUsername;
        document.getElementById("usernameInput").style.display = "none";
        document.getElementById("saveUsernameBtn").textContent = "Cambiar Nombre";
    }
});

function saveUsername() {
    const usernameInput = document.getElementById("usernameInput");
    const username = usernameInput.value.trim();
    if (username) {
        localStorage.setItem("username", username);
        document.getElementById("usernameDisplay").textContent = username;
        usernameInput.style.display = "none";
        document.getElementById("saveUsernameBtn").textContent = "Cambiar Nombre";
    } else {
        alert("Por favor, ingresa un nombre de usuario.");
    }
}

function toggleUsernameInput() {
    const usernameInput = document.getElementById("usernameInput");
    if (usernameInput.style.display === "none") {
        usernameInput.style.display = "block";
        usernameInput.focus();
    } else {
        usernameInput.style.display = "none";
    }
}

function openResourceModal(courseTitle) {
    const modal = document.getElementById("resourceModal");
    const modalTitle = document.getElementById("resourceModalTitle");
    modalTitle.textContent = courseTitle;
    modal.classList.add("show");
    displayUploadedFiles(courseTitle, "resources", "resourceFileList");
    adjustModalPosition(modal);
}

function closeResourceModal() {
    const modal = document.getElementById("resourceModal");
    modal.classList.remove("show");
}

function openExamModal(examTitle) {
    const modal = document.getElementById("examModal");
    const modalTitle = document.getElementById("examModalTitle");
    modalTitle.textContent = examTitle;
    modal.classList.add("show");
    displayUploadedFiles(examTitle, "exams", "examFileList");
    adjustModalPosition(modal);
}

function closeExamModal() {
    const modal = document.getElementById("examModal");
    modal.classList.remove("show");
}

function openAddResourceModal() {
    const modal = document.getElementById("addResourceModal");
    modal.classList.add("show");
}

function closeAddResourceModal() {
    const modal = document.getElementById("addResourceModal");
    modal.classList.remove("show");
}

function saveNewResource() {
    const category = document.getElementById("categorySelect").value;
    const resourceName = document.getElementById("resourceName").value.trim();
    const files = document.getElementById("newResourceFiles").files;

    if (!resourceName) {
        alert("Por favor, ingrese un nombre para el curso.");
        return;
    }

    const courseTitle = `Curso de ${resourceName}`;
    const categorySection = document.getElementById(category);
    let resourceRow = categorySection.querySelector(".resource-row:last-child");
    
    if (!resourceRow || resourceRow.children.length >= 3) {
        resourceRow = document.createElement("div");
        resourceRow.className = "resource-row";
        categorySection.appendChild(resourceRow);
    }

    const resourceTree = document.createElement("div");
    resourceTree.className = "resource-tree";
    resourceTree.innerHTML = `
        <div class="resource-node">
            <div class="resource-circle" onclick="openResourceModal('Curso de ${resourceName}')"></div>
            <div class="resource-label">${resourceName}</div>
        </div>
        <div class="exam" onclick="openExamModal('Examen Resuelto - Curso de ${resourceName}')">Examen Resuelto</div>
    `;
    resourceRow.appendChild(resourceTree);

    if (files.length > 0) {
        uploadedFiles.resources[courseTitle] = Array.from(files).map(file => ({
            name: file.name,
            type: file.type,
            file: file
        }));
    }

    closeAddResourceModal();
    document.getElementById("resourceName").value = "";
    document.getElementById("newResourceFiles").value = "";
}

function uploadResourceFiles() {
    const courseTitle = document.getElementById("resourceModalTitle").textContent;
    const files = document.getElementById("resourceFiles").files;
    const modal = document.getElementById("resourceModal");

    if (files.length > 0) {
        uploadedFiles.resources[courseTitle] = uploadedFiles.resources[courseTitle] || [];
        Array.from(files).forEach(file => {
            uploadedFiles.resources[courseTitle].push({
                name: file.name,
                type: file.type,
                file: file
            });
        });
        displayUploadedFiles(courseTitle, "resources", "resourceFileList");
        document.getElementById("resourceFiles").value = "";
        adjustModalPosition(modal);
    }
}

function uploadExamFiles() {
    const examTitle = document.getElementById("examModalTitle").textContent;
    const files = document.getElementById("examFiles").files;
    const modal = document.getElementById("examModal");

    if (files.length > 0) {
        uploadedFiles.exams[examTitle] = uploadedFiles.exams[examTitle] || [];
        Array.from(files).forEach(file => {
            uploadedFiles.exams[examTitle].push({
                name: file.name,
                type: file.type,
                file: file
            });
        });
        displayUploadedFiles(examTitle, "exams", "examFileList");
        document.getElementById("examFiles").value = "";
        adjustModalPosition(modal);
    }
}

function displayUploadedFiles(title, type, listId) {
    const fileList = document.getElementById(listId);
    fileList.innerHTML = "";
    
    if (uploadedFiles[type][title] && uploadedFiles[type][title].length > 0) {
        uploadedFiles[type][title].forEach(file => {
            const li = document.createElement("li");
            const fileLink = document.createElement("a");
            fileLink.textContent = file.name;
            fileLink.href = "#";
            fileLink.onclick = (e) => {
                e.preventDefault();
                openInNewWindow(file);
            };
            const downloadBtn = document.createElement("button");
            downloadBtn.textContent = "Descargar";
            downloadBtn.onclick = () => downloadFile(file);
            const newWindowBtn = document.createElement("button");
            newWindowBtn.textContent = "Abrir en nueva ventana";
            newWindowBtn.onclick = () => openInNewWindow(file);
            li.appendChild(fileLink);
            li.appendChild(document.createTextNode(" "));
            li.appendChild(downloadBtn);
            li.appendChild(newWindowBtn);
            fileList.appendChild(li);
        });
    }
}

function downloadFile(file) {
    const url = URL.createObjectURL(file.file);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function openInNewWindow(file) {
    const url = URL.createObjectURL(file.file);
    window.open(url, "_blank");
    // No revocamos la URL inmediatamente para permitir que la nueva ventana la use
}

function adjustModalPosition(modal) {
    const modalContent = modal.querySelector(".modal-content");
    const fileList = modal.querySelector(".file-upload ul");
    const fileCount = fileList.children.length;
    // Ajustar margin-top: reducir 1% por cada archivo subido, con un mínimo de 5%
    const newMarginTop = Math.max(5, 15 - fileCount);
    modalContent.style.marginTop = `${newMarginTop}%`;
}

window.onclick = function(event) {
    const resourceModal = document.getElementById("resourceModal");
    const examModal = document.getElementById("examModal");
    const addResourceModal = document.getElementById("addResourceModal");
    if (event.target == resourceModal) {
        closeResourceModal();
    }
    if (event.target == examModal) {
        closeExamModal();
    }
    if (event.target == addResourceModal) {
        closeAddResourceModal();
    }
}