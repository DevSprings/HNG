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

selectPriority.addEventListener("change", ()=>{
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