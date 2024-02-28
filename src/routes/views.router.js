const {Router} = require("express")
const ProductManager = require('../dao/ProductManager')
const paths = require("path")
const cartModel = require("../dao/models/cart.model")
const productModel = require("../dao/models/product.model")

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

router.get("/chat",async(req,res)=>{
  res.render("chat", {})
})


router.get("/products",async(req,res)=>{
  const { page = 1 } = req.query;
  const { docs, hasPrevPage, hasNextPage, nextPage, prevPage } =
    await productModel.paginate({}, { limit: 5, page, lean: true });
  res.render(`products`, {
    docs,
    page,
    hasPrevPage,
    hasNextPage,
    nextPage,
    prevPage,
  });
});


module.exports = router