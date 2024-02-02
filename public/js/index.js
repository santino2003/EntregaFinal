const socket = io();
const listaProductos = document.getElementById("products")
const formulario = document.getElementById('formulario')

socket.on("productos", (data) =>{
    
        let productos = []
        
        data.forEach(producto =>{
            productos.push(producto.title)

        })
        listaProductos.innerHTML = `<p>${productos}</p>`
        
   
});

formulario.addEventListener('submit',(e)=>{
    e.preventDefault()
    const title = document.getElementById('title').value
    const description =  document.getElementById('description').value
    const price =  document.getElementById('price').value
    const code =  document.getElementById('code').value
    const stock =  document.getElementById('stock').value
    const category =  document.getElementById('category').value
    const status =  document.getElementById('status').checked
    const objeto = {title: title,description : description,price :price,code : code,stock : stock,category :category,status: status}
    
    socket.emit('form', objeto)
    
})




