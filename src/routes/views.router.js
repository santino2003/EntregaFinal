import {Router} from "express"
import ProductManager from '../dao/ProductManager.js'
import paths from "path"
import ProductManagerMongo from '../dao/ProducManagerMongo.js'
import productModel from "../models/product.model.js"
import CartManagerMongo from '../dao/CartManagerMongo.js'

import passport from "passport";
import handlePolicies from "../middleware/handle-policies.middleware.js";



const router = Router();
// const pathBase = paths.join(__dirname, 'db.json')
// const manager = new ProductManager(pathBase)
const producManagerMongo = new ProductManagerMongo
const cartManagerMongo = new CartManagerMongo

router.get("/", async (req, res) => {
   const allProducts = await producManagerMongo.getProducts()
  
  
  res.render("home", {allProducts})
})

router.get("/realtimeproducts", async (req, res) => {
 
 
 res.render("realTimeProducts", {})
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






export default router