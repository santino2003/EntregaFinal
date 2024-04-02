
const CartManagerMongo = require('../dao/CartManagerMongo')
const paths = require("path")

const ProductManagerMongo = require("../dao/ProducManagerMongo");
const managerMongo = new ProductManagerMongo
const pathBase2 = paths.join(__dirname, 'dbc.json')
const cartManagerMongo = new CartManagerMongo()



const createCart = async(req,res) => {
    try {
        res.send(await cartManagerMongo.createCart())
    } catch (error) {
        res.send(console.log(error))
    }
}

const getCartsCidController = async(req,res) => {
    try {
        const id = req.params.cid || req.user.user.cart[0]._id
        if(id){
            res.send(await cartManagerMongo.getProductsCart(id))
        }else{
            res.status(400).json({ error: 'formato id invalido' })
        }
    } catch (error) {
        console.log(error)
    }
}

const addProductCartController = async(req,res) => {
    try {
        
        const cid = req.params.cid || req.user.user.cart[0]._id
        const pid = req.params.pid 
        if(cid !== undefined && pid !== undefined){
            const producto  = await managerMongo.getProductById(pid)
            if(producto){
                
                if(producto.stock >= 1){
                    const modificacion = {
                        stock: producto.stock - 1
                    }
                    managerMongo.updateProduct(pid,modificacion)
                    res.send(await cartManagerMongo.addProductToCart(cid,pid))
                }else{
                    res.send("stock insuficiente")
                }
                
            }else{
                res.status(404).json({ error: 'El producto no existe' });
            }
        
        }else{
            res.status(400).json({ error: 'id invalido' });
        }
        
       
    } catch (error) {
        console.log(error)
    }
   
   
}

const deleteCartController = async(req,res) => {
    try {
        const id = req.params.cid || req.user.user.cart[0]._id
        
        res.send(await cartManagerMongo.emptyCart(id))
        
    } catch (error) {
        console.log(error)
    }
}


const modifiProductCartController = async(req,res) => {
    try {
        const cid = req.params.cid || req.user.user.cart[0]._id
        const pid = req.params.pid
        const quantity = req.body.quantity
        console.log(quantity)

        res.send(await cartManagerMongo.updateProductQuantity(cid,pid,quantity))

    } catch (error) {
        console.log(error)
    }
}

const deleteProductCartController = async(req,res) => {
    try {
        const cid = req.params.cid || req.user.user.cart[0]._id
        const pid = req.params.pid
        const producto  = await managerMongo.getProductById(pid)
        res.send(await cartManagerMongo.delteProducts(cid,pid))
        const modificacion = {
            stock: producto.stock + 1
        }
        managerMongo.updateProduct(pid,modificacion)
        res.send(await cartManagerMongo.addProductToCart(cid,pid))
    } catch (error) {
        console.log(error)
    }

}

module.exports ={
    deleteProductCartController,
    modifiProductCartController,
    deleteCartController,
    addProductCartController,
    getCartsCidController,
    createCart,
}
