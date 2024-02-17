const {Router} = require("express")
const CartManager = require('../dao/CartManager')
const CartManagerMongo = require('../dao/CartManagerMongo')
const paths = require("path")
const multer = require('multer');


const ProductManagerMongo = require("../dao/ProducManagerMongo");


const upload = multer()


const managerMongo = new ProductManagerMongo

const pathBase2 = paths.join(__dirname, 'dbc.json')
const cartManager = new CartManager(pathBase2)
const cartManagerMongo = new CartManagerMongo()
const router = Router()

router.post("/", async (req,res) =>{
    try {
        res.send(await cartManagerMongo.createCart())
    } catch (error) {
        res.send(console.log(error))
    }
})

router.get("/:cid", async(req,res)=>{
    try {
        const id = req.params.cid
        if(id){
            res.send(await cartManagerMongo.getProductsCart(id))
        }else{
            res.status(400).json({ error: 'formato id invalido' })
        }
    } catch (error) {
        console.log(error)
    }
})

router.post("/:cid/product/:pid",async(req,res)=>{
    try {
 
        const cid = req.params.cid
        const pid = req.params.pid
        console.log(cid)
        console.log(pid)
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
})

module.exports = router