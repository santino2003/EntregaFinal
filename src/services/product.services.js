const ProductManager = require('../dao/ProductManager')
const ProductManagerMongo = require('../dao/ProducManagerMongo')
const paths = require("path")

const pathBase = paths.join(__dirname, 'db.json')
const manager = new ProductManager(pathBase)
const managerMongo = new ProductManagerMongo()

const getProducts = async (query,{page,limit,sort})=>{
   return await managerMongo.getProducts(query,{page,limit,sort})
        
}

const getProductById = async (id)=>{
    const product = await managerMongo.getProductById(id)
    return product
}


const updateProduct = async (id,product)=>{
    return await managerMongo.updateProduct(id,product)
}


const addProduct = async (title,description,price,code,stock,category,status,thumbnail)=>{
    return (await managerMongo.addProduct(title,description,price,code,stock,category,status,thumbnail))
}

const deleteProduct = async (id) =>{
    return await managerMongo.deleteProduct(id)
}
      

module.exports = {
    deleteProduct,
    getProducts,
    getProductById,
    updateProduct,
    addProduct
  };

  