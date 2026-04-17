const time = document.getElementById("test-user-time");
window.addEventListener("DOMContentLoaded", ()=> {
        time.innerText = "Current time: " + (new Date()).getTime();
})
setInterval(()=>{
    time.innerText = "Current time: " + (new Date()).getTime();
}, 6000)