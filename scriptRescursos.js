let uploadedFiles = {
    exams: {
        "Examen Resuelto - Curso de Estadistica": [
            { 
                name: "Primer examen resuelto de Estadística.pdf", 
                type: "application/pdf", 
                url: "https://dcb.ingenieria.unam.mx/wp-content/themes/tempera-child/CoordinacionesAcademicas/CA/PyE/Examenes/2016-1/PYE1E161.pdf",
            }
        ],
        "Examen Resuelto - Curso de Mat.Computacional": [
            { 
                name: "Primer examen resuelto de Mat. Computacional.pdf", 
                type: "application/pdf", 
                url: "https://repositoriotec.tec.ac.cr/bitstream/handle/2238/11527/Ejercicios_Resueltos_de_Álgebra_Lineal_para_Computación.pdf?sequence=1&isAllowed=y" 
            }
        ],
        "Examen Resuelto - Curso de A.Numerico": [
            { 
                name: "Primer examen resuelto de A. Numérico.pdf", 
                type: "application/pdf", 
                url: "https://www.dspace.espol.edu.ec/xmlui/bitstream/handle/123456789/33083/20142SICM001585_1.PDF?sequence=1&isAllowed=y" 
            }
        ],
        "Examen Resuelto - Curso de Programación": [
            { name: "Solucion_Programacion.pdf", type: "application/pdf", file: new Blob(["Solución de ejemplo"], { type: "application/pdf" }) }
        ]
    }
};

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
            fileLink.href = file.url || "#";
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
    if (file.url) {
        // Si el archivo tiene una URL externa, redirige a la URL
        const a = document.createElement("a");
        a.href = file.url;
        a.download = file.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    } else {
        // Si el archivo es un Blob, genera un enlace local
        const url = URL.createObjectURL(file.file);
        const a = document.createElement("a");
        a.href = url;
        a.download = file.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

function openInNewWindow(file) {
    if (file.url) {
        // Si el archivo tiene una URL externa, ábrela directamente
        window.open(file.url, "_blank");
    } else {
        // Si el archivo es un Blob, genera un enlace local
        const url = URL.createObjectURL(file.file);
        window.open(url, "_blank");
        // No revocamos la URL inmediatamente para permitir que la nueva ventana la use
    }
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