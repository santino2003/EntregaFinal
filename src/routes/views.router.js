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
const passport = require("passport");



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
  // console.log("imprimir sesion products",req.session)
  const { docs, hasPrevPage, hasNextPage, nextPage, prevPage } =
    await productModel.paginate({}, { limit: 5, page, lean: true });
  const name = req.session.user._doc.first_name
  
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



// Login - GET
router.get("/login", async (req, res) => {
  res.render("login");
});

// Login - POST
router.post(
  "/login",
  passport.authenticate("login", {
    successRedirect: "/products",
    failureRedirect: "/faillogin",
    failureFlash: true, // Display flash messages if needed
  })
);

router.get("/faillogin", async (req, res) => {
  res.send({ error: "login strategy failed" });
});

// Register - GET
router.get("/register", async (req, res) => {
  res.render("register");
});

// Register - POST
router.post(
  "/register",
  passport.authenticate("register", {
    successRedirect: "/login",
    failureRedirect: "/failregister",
    failureFlash: true,
  })
);

router.get("/failregister", async (req, res) => {
  res.send({ error: "register strategy failed" });
});

router.get("/recover", async (req, res) => {
  res.render("recover");
});

router.get("/profile", authMdw, async (req, res) => {
  const user = req.user;
  console.log("🚀 ~ file: views.routes.js:20 ~ router.get ~ user:", user);

  res.render("profile", {
    user,
    carrito: {
      carritoId: "carrito-1",
      productos: [{ productoId: "1", nombre: "camisa" }],
    },
  });
});


module.exports = router