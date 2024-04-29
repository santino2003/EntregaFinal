import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import express from"express";
import handlebars from "express-handlebars";
import { Server }from "socket.io";
import viewsRouter from "./routes/views.router.js"
import productsRoutes from"./routes/product.routes.js"
import cartRoutes from "./routes/cart.routes.js"

import mongoose from 'mongoose';
import chatModel from "./models/chat.model.js"

import sessionRoutes from "./routes/session.routes.js";
import mongoStore from "connect-mongo";
import cookieParser from "cookie-parser" ;
import session from "express-session";
import displayRoutes from "express-routemap";


import passport from "passport";
import initializePassport from "./config/passport.config.js" ;
import { PORT ,MONGO_URL} from "./config/config.js";




const app = express()



const API_PREFIX = "/api"
const SECRET_SESSION = "secretSession";

app.use(cookieParser());
app.use(
  session({
    store: mongoStore.create({
      mongoUrl: MONGO_URL,
      mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
      ttl: 60 * 3600,
    }),
    secret: "secretSession",
    resave: false,
    saveUninitialized: false,
  })
);

initializePassport();
app.use(passport.initialize());
app.use(passport.session())


const httpServer = app.listen(PORT, () => displayRoutes(app))
const io = new Server(httpServer);
app.engine("handlebars", handlebars.engine({ 
  runtimeOptions: {
    allowProtoPropertiesByDefault: true
  }
}));

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.set("view engine", "handlebars");

app.set("views", join(dirname(__dirname), "views"));
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(express.static(join(dirname(__dirname), 'public')));

app.use(API_PREFIX + "/products",productsRoutes)
app.use(API_PREFIX + "/carts",cartRoutes)
app.use(API_PREFIX + "/session/", sessionRoutes)
app.use("/", viewsRouter);





// Conectar a la base de datos
mongoose.connect(MONGO_URL, {
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

