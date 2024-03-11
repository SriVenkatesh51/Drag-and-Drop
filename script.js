document.addEventListener("DOMContentLoaded", () => {
    initializeBoard();
});

function initializeBoard() {
    const columns = document.querySelectorAll(".task-column");

    columns.forEach((column) => {
        const tasks = column.querySelector(".task-list");
        const addTaskButton = column.querySelector(".add-task-btn");

        addTaskButton.addEventListener("click", () => {
            const taskTitle = prompt("Enter task title:");
            if (taskTitle) {
                addNewTaskToColumn(column.id, taskTitle);
            }
        });

        tasks.addEventListener("dragstart", (e) => {
            e.dataTransfer.setData("text/plain", e.target.id);
            e.dataTransfer.setData("source-column", column.id);
        });

        tasks.addEventListener("dragover", (e) => {
            e.preventDefault();
        });

        tasks.addEventListener("drop", (e) => {
            e.preventDefault();
            const taskId = e.dataTransfer.getData("text/plain");
            const sourceColumnId = e.dataTransfer.getData("source-column");
            const targetColumnId = column.id;

            if (sourceColumnId !== targetColumnId) {
                moveTask(taskId, targetColumnId);
            }
        });

        tasks.addEventListener("click", (e) => {
            const taskId = e.target.id;
            openTaskDetailsModal(taskId);
        });
    });
}

function addNewTaskToColumn(columnId, taskTitle) {
    const column = document.getElementById(columnId);
    const tasksContainer = column.querySelector(".task-list");

    const taskCard = document.createElement("div");
    taskCard.classList.add("task-card");
    taskCard.textContent = taskTitle;
    taskCard.draggable = true;
    taskCard.id = "task-" + Date.now();

    tasksContainer.appendChild(taskCard);
    updateTaskCount(columnId);
}

function moveTask(taskId, targetColumnId) {
    const targetColumn = document.getElementById(targetColumnId);
    const tasksContainer = targetColumn.querySelector(".task-list");
    const taskCard = document.getElementById(taskId);

    tasksContainer.appendChild(taskCard);
    updateTaskCount(taskCard.parentElement.id);
    updateTaskCount(targetColumnId);
    updateTaskCount(columnId);
}

function updateTaskCount(columnId) {
    const column = document.getElementById(columnId);
    const taskCountElement = column.querySelector('.task-count');
    const taskCards = column.querySelectorAll('.task-card');
    taskCountElement.innerHTML = taskCards.length;
}

function handleDragOverEvent(e) {
    e.preventDefault();
}

function handleDropEvent(e) {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("text/plain");
    const targetColumnId = e.target.closest('.task-column').id;
    moveTask(taskId, targetColumnId);
    updateTaskCount(taskId);
    updateTaskCount(columnId);
}

function handleAddTask(columnId) {
    const taskTitle = prompt("Enter task title:");
    if (taskTitle) {
        addNewTaskToColumn(columnId, taskTitle);
    }
}

function openTaskDetailsModal(taskId) {
    const modal = document.getElementById("taskModal");
    const span = document.getElementsByClassName("task-close")[0];
    const editedTaskTitleInput = document.getElementById("editedTaskTitle");

    modal.style.display = "block";
    editedTaskTitleInput.value = document.getElementById(taskId).textContent;

    span.setAttribute("data-task-id", taskId);

    span.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}

function handleSaveEditedTaskTitle() {
    const modal = document.getElementById("taskModal");
    const editedTaskTitleInput = document.getElementById("editedTaskTitle");
    const taskId = document.getElementsByClassName("task-close")[0].getAttribute("data-task-id");

    if (taskId) {
        const taskCard = document.getElementById(taskId);
        taskCard.textContent = editedTaskTitleInput.value;
        modal.style.display = "none";
    }
}

function handleDeleteAllTasks(columnId) {
    const column = document.getElementById(columnId);
    const tasksContainer = column.querySelector(".task-list");
    tasksContainer.innerHTML = ''; 
    updateTaskCount(columnId);
}

function handleResetAllTasks() {
    const columns = document.querySelectorAll(".task-column");

    columns.forEach((column) => {
        const tasksContainer = column.querySelector(".task-list");
        tasksContainer.innerHTML = ''; 
        updateTaskCount(column.id);
    });
}

function handleCloseTaskModal() {
    const modal = document.getElementById("taskModal");
    modal.style.display = "none";
}