
const CartManagerMongo = require('../dao/CartManagerMongo')
const paths = require("path")

const ProductManagerMongo = require("../dao/ProducManagerMongo");
const managerMongo = new ProductManagerMongo

const cartManagerMongo = new CartManagerMongo()


const createCart = async ()=>{
   return await cartManagerMongo.createCart()
}


const getProductsCart = async (id)=>{
    return await cartManagerMongo.getProductsCart(id)
}

const getProductById = async (id)=>{
    const product = await managerMongo.getProductById(id)
    return product
}

const updateProduct = async (id,modificacion)=>{
    return await managerMongo.updateProduct(id,modificacion)
}

const addProductToCart = async (id,modificacion)=>{
    return await cartManagerMongo.addProductToCart(cid,pid)}

const emptyCart = async (id)=>{
    return await cartManagerMongo.emptyCart(id)}


const updateProductQuantity = async (cid,pid,quantity)=>{
    return await cartManagerMongo.updateProductQuantity(cid,pid,quantity)
}

const delteProducts = async (cid,pid,quantity)=>{
    return await cartManagerMongo.delteProducts(cid,pid)}

module.exports ={
    createCart,
    getProductsCart,
    getProductById,
    updateProduct,
    addProductToCart,
    emptyCart,
    updateProductQuantity,
    delteProducts,
}