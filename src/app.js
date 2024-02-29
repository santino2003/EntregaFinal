const path = require("path")
const express = require( "express");
const handlebars = require ("express-handlebars");
const { Server } = require( "socket.io");
const viewsRouter = require( "./routes/views.router.js")
const productsRoutes = require("./routes/product.routes")
const cartRoutes = require("./routes/cart.routes")
const ProductManager = require('./dao/ProductManager.js')
const mongoose = require('mongoose');
const chatModel = require("./dao/models/chat.model")

const sessionRoutes = require("./routes/session.routes");
const mongoStore = require("connect-mongo");
const cookieParser = require("cookie-parser");
const session = require("express-session");

const pathBase = path.join(__dirname, '/routes/db.json')
const manager = new ProductManager(pathBase)

const app = express()

const PORT = 8080

const API_PREFIX = "/api"
const SECRET_SESSION = "secretSession";

app.use(
  session({
    store: mongoStore.create({
      mongoUrl: 'mongodb+srv://santinopeiretti2003:Dexter2003_@cluster0.hrrs9yt.mongodb.net/Moonshop?retryWrites=true&w=majority',
      mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
      ttl: 60 * 3600,
    }),
    secret: SECRET_SESSION,
    resave: false,
    saveUninitialized: false,
  })
);


const httpServer = app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
const io = new Server(httpServer);
app.engine("handlebars", handlebars.engine({ 
  runtimeOptions: {
    allowProtoPropertiesByDefault: true
  }
}));

app.set("view engine", "handlebars");

app.set("views", path.join(__dirname, "../views"));
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(express.static(path.join(__dirname, "../public")));
app.use(API_PREFIX + "/products",productsRoutes)
app.use(API_PREFIX + "/carts",cartRoutes)
app.use(API_PREFIX + "/session/", sessionRoutes)
app.use("/", viewsRouter);


app.use(cookieParser());


// Conectar a la base de datos
mongoose.connect('mongodb+srv://santinopeiretti2003:Dexter2003_@cluster0.hrrs9yt.mongodb.net/Moonshop?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log("Conexión exitosa a la base de datos");
})
.catch(err => {
  console.error("Error al conectar a la base de datos:", err);
  process.exit();
});





// let productos; // Declarar la variable en un ámbito superior
  
//   async function obetenerProductos() {
//     try {

//       const arrayObtenido = await manager.getProducts();
  

//       productos = arrayObtenido.products
  
//     } catch (error) {
//       console.error('Error al manipular el array:', error);

//     }
//   }
  
  
//   (async () => {
    
//     try {
//       await obetenerProductos();

//     } catch (error) {
      
//       console.error('Error en la operación:', error);
//     }
//   })();



io.on("connection",  (socket) => {
     chatModel.find().then((messages)=>{
        socket.emit('messageLogs',messages)
        socket.on('message',(data)=>{
          chatModel.create(data)
          chatModel.find().then((messages)=>{
            io.emit("messageLogs", messages)
          })
          
        })
        
    })
    

    
})  