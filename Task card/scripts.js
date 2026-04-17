const toggle = document.querySelector(".test-todo-complete-toggle");
const title = document.querySelector(".test-todo-title");
const description = document.querySelector(".test-todo-description");
const statusBadge = document.querySelector(".test-todo-status");
const editBtn = document.querySelector(".test-todo-edit-button");
const deleteBtn = document.querySelector(".test-todo-delete-button");
const editContainer = document.querySelector(".test-todo-edit");
const editTitle = document.getElementById("test-todo-edit-title-input");
const editDescription = document.getElementById("test-todo-edit-description-input");
const priority = document.getElementById("test-todo-priority-value");
const selectPriority = document.getElementById("test-todo-priority-options");
const dueDate = document.querySelector(".test-todo-due-date");
const timeRemaining = document.querySelector(".test-todo-time-remaining");

window.addEventListener("DOMContentLoaded", calcTime);

setInterval(calcTime, 60000)

function calcTime() {
    const timeDiff = new Date(dueDate.getAttribute("datetime")) - (new Date()).getTime();
    const dayRemaining = Math.floor(Math.abs(timeDiff) / (1000 * 60 * 60 * 24));
    const hoursElapse = Math.floor(Math.abs(timeDiff) / (1000 * 60 * 60));
    if (timeDiff > 0) {
        if (dayRemaining == 1) {
            timeRemaining.innerText = "Time remaining: Due tomorrow";
        } else {
            timeRemaining.innerText = `Time remaining: Due in ${dayRemaining} days`;
        }
    } else {
        if (hoursElapse == 0) {
            timeRemaining.innerText = "Time remaining: Due now!";
            statusBadge.innerText = "Status: In Progress";
        } else {
            timeRemaining.innerText = `Time remaining: Over due by ${hoursElapse} hours`;
        }

    }
}
selectPriority.addEventListener("change", () => {
    priority.innerText = "Priority: " + selectPriority.value;
    selectPriority.value = "";
})

toggle.addEventListener("change", () => {
    if (toggle.checked) {
        title.style.textDecoration = "line-through";
        statusBadge.innerText = "Status: Done";
    } else {
        title.style.textDecoration = "none";
        statusBadge.innerText = "Status: Pending";
    }
})

editBtn.addEventListener("click", () => {
    editContainer.hidden = false;
    editContainer.style.display = "flex"
    editTitle.value = title.innerText;
    editDescription.value = description.innerText;
})
deleteBtn.addEventListener("click", () => {
    alert("delete clicked");
})

editContainer.addEventListener("click", (e) => {
    if (e.target !== editContainer) return;
    editContainer.hidden = true;
    editContainer.style.display = "none";
});

editTitle.addEventListener("change", () => {
    if (editTitle.value) {
        title.innerText = editTitle.value;
    } else {
        title.innerText = "Title";
    }
})

editDescription.addEventListener("change", () => {
    if (editDescription.value) {
        description.innerText = editDescription.value;
    } else {
        description.innerText = "Description";
    }
});