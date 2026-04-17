const toggle = document.querySelector(".test-todo-complete-toggle");
const title = document.querySelector(".test-todo-title");
const statusBadge = document.querySelector(".test-todo-status");
const editBtn = document.querySelector(".test-todo-edit-button");
const deleteBtn = document.querySelector(".test-todo-delete-button");
const editContainer = document.querySelector(".test-todo-edit");
const saveBtn = document.getElementById("test-todo-save-edit");
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
})
deleteBtn.addEventListener("click", () => {
    alert("delete clicked");
})

editContainer.addEventListener("click", (e) => {
    if(e.target !== editContainer) return;
        editContainer.hidden = true;
    editContainer.style.display = "none";
    
})