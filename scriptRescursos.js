function openResourceModal(courseTitle) {
    const modal = document.getElementById("resourceModal");
    const modalTitle = document.getElementById("resourceModalTitle");
    modalTitle.textContent = courseTitle;
    modal.classList.add("show");
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
}

function closeExamModal() {
    const modal = document.getElementById("examModal");
    modal.classList.remove("show");
}

window.onclick = function(event) {
    const resourceModal = document.getElementById("resourceModal");
    const examModal = document.getElementById("examModal");
    if (event.target == resourceModal) {
        resourceModal.classList.remove("show");
    }
    if (event.target == examModal) {
        examModal.classList.remove("show");
    }
}