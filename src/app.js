const express = require("express")
const productsRoutes = require("./routes/product.routes")
const cartRoutes = require("./routes/cart.routes")

const app = express()

const PORT = 8080

const API_PREFIX = "/api"

app.use(express.json())
app.use(express.urlencoded({extended: true}))


app.use(API_PREFIX + "/products",productsRoutes)
app.use(API_PREFIX + "/carts",cartRoutes)



app.listen(PORT, () =>{
    console.log("runing")
})
