// const socket = io();


// let user

// const chatBox = document.getElementById('chat-box')
// Swal.fire({
//     title: "Ingrese su nombre",
//     input: "text",
//     text: "Ingrese el usuaruio para identificarse en el chat",
//     inputValidator: (value) => {
//         return !value && "Necesita ingresar nombre de usuario"
//     },
//     allowOutsideClick: false
// }).then((result) => {
//     user = result.value
// })

// chatBox.addEventListener("keyup",(e)=>{
//     if(e.key== "Enter"){
//         if(chatBox.value.trim().length){
//             socket.emit("message",{user, message: chatBox.value});
//             chatBox.value = ""
//         }
//     }
// })

// socket.on('messageLogs', (data)=>{
//     const logs = document.getElementById("message-logs");
//     let messages = ""

//     data.forEach(obj => {
//         messages += `<p>${obj.user} dice: ${obj.message}</p>`
//         messages
//     });

//     logs.innerHTML = messages
// })