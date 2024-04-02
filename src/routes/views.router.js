const {Router} = require("express")
const ProductManager = require('../dao/ProductManager')
const paths = require("path")
const ProductManagerMongo = require('../dao/ProducManagerMongo')
const productModel = require("../dao/models/product.model")
const CartManagerMongo = require('../dao/CartManagerMongo')
const router = Router();
const pathBase = paths.join(__dirname, 'db.json')
const manager = new ProductManager(pathBase)
const producManagerMongo = new ProductManagerMongo
const cartManagerMongo = new CartManagerMongo
const passport = require("passport");
const handlePolicies = require("../dao/middleware/handle-policies.middleware");


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

router.get("/chat",async(req,res)=>{
  res.render("chat", {})
})


router.get("/products", handlePolicies(["USER","ADMIN"]),async(req,res)=>{
  const { page = 1 } = req.query;
  // console.log("imprimir sesion products",req.session)
  const { docs, hasPrevPage, hasNextPage, nextPage, prevPage } =
    await productModel.paginate({}, { limit: 5, page, lean: true });
  const name = req.user.user.first_name
  console.log(req.user.user.cart[0]._id)
  res.render(`products`, {
    docs,
    page,
    hasPrevPage,
    hasNextPage,
    nextPage,
    prevPage,
    name,
  });
});

router.get("/product/:pid",handlePolicies(["USER","ADMIN"]),async(req,res)=>{
  const id = (req.params.pid)
  
  const producto = await producManagerMongo.getProductById(id)
  
  
  res.render(`detailProduct`,{producto})

});

router.get("/carts/:cid",handlePolicies(["USER","ADMIN"]),async(req,res)=>{
    id = req.params
    const products = await cartManagerMongo.getProductsCart(id)
    const arrayProductos = products[0].products
    // console.log(arrayProductos[0].product.title)
    
    res.render(`cart`,{arrayProductos})
});



router.get("/login",handlePolicies(["PUBLIC"]), async (req, res) => {
  res.render("login");
});






router.get("/register",handlePolicies(["PUBLIC"]), async (req, res) => {
  res.render("register");
});






module.exports = router