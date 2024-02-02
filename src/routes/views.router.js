const {Router} = require("express")
const ProductManager = require('../ProductManager')
const paths = require("path")

const router = Router();
const pathBase = paths.join(__dirname, 'db.json')
const manager = new ProductManager(pathBase)

router.get("/", async (req, res) => {
   allProducts = await manager.getProducts()
  
  
  res.render("home", {allProducts})
})

router.get("/realtimeproducts", async (req, res) => {
 
 
 
 res.render("realTimeProducts", {})
})





module.exports = router