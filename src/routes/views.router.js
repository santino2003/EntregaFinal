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
const authMdw = require("../dao/middleware/auth.middleware");



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


router.get("/products",authMdw ,async(req,res)=>{
  const { page = 1 } = req.query;
  const { docs, hasPrevPage, hasNextPage, nextPage, prevPage } =
    await productModel.paginate({}, { limit: 5, page, lean: true });
  const name = req.session.user._doc.first_name
  console.log(name)
  res.render(`products`, {
    docs,
    page,
    hasPrevPage,
    hasNextPage,
    nextPage,
    prevPage,
    name
  });
});

router.get("/product/:pid", authMdw ,async(req,res)=>{
  const id = (req.params.pid)
  
  const producto = await producManagerMongo.getProductById(id)
  
  
  res.render(`detailProduct`,{producto})

});

router.get("/carts/:cid",authMdw,async(req,res)=>{
    id = req.params
    const products = await cartManagerMongo.getProductsCart(id)
    const arrayProductos = products[0].products
    // console.log(arrayProductos[0].product.title)
    
    res.render(`cart`,{arrayProductos})
});



router.get(`/login`, async (req, res) => {
  res.render("login");
});

router.get(`/register`, async (req, res) => {
  res.render("register");
});

router.get(`/profile`, authMdw, async (req, res) => {
  const user = req.session.user;

  res.render("profile", {
    user,
  });
});

module.exports = router;


module.exports = router