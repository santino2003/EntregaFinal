const {Router} = require("express")
const CartManager = require('../CartManager')
const paths = require("path")
const multer = require('multer');

const ProductManager = require('../ProductManager')


const upload = multer()

const pathBase = paths.join(__dirname, 'db.json')
const manager = new ProductManager(pathBase)

const pathBase2 = paths.join(__dirname, 'dbc.json')
const cartManager = new CartManager(pathBase2)
const router = Router()

router.post("/", async (req,res) =>{
    try {
        res.send(await cartManager.createCart())
    } catch (error) {
        res.send(console.log(error))
    }
})

router.get("/:cid", async(req,res)=>{
    try {
        const id = parseInt(req.params.cid,10)
        if(!isNaN(id)){
            res.send(await cartManager.getProductsCart(id))
        }else{
            res.status(400).json({ error: 'formato id invalido' })
        }
    } catch (error) {
        console.log(error)
    }
})

router.post("/:cid/product/:pid",async(req,res)=>{
    try {
 
        const cid = parseInt(req.params.cid,10)
        const pid = parseInt(req.params.pid,10)
        console.log(cid)
        console.log(pid)
        if(cid !== undefined && pid !== undefined){
            const producto  = await manager.getProductById(pid)
            if(producto){
                if(producto.stock >= 1){
                    const modificacion = {
                        stock: producto.stock - 1
                    }
                    manager.updateProduct(pid,modificacion)
                    res.send(await cartManager.addProductToCart(cid,pid))
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