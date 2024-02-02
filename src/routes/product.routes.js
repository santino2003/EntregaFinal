const {Router} = require("express")
const ProductManager = require('../ProductManager')
const paths = require("path")
const multer = require('multer');


const upload = multer()

const pathBase = paths.join(__dirname, 'db.json')
const manager = new ProductManager(pathBase)
const router = Router()

router.get("/" ,async(req,res) => {
    try {
        bool = req.query.hasOwnProperty("limit")
        const numero = parseInt(req.query.limit,10)
    
    
        if(!isNaN(numero) && bool ){
            allProducts = await manager.getProducts()
            if(allProducts.products.length >= numero ){
                
                return res.send(allProducts.products.slice(0, numero))
                
            }else{
                return res.send((await manager.getProducts()))
            }
           
        }else{
            return res.send((await manager.getProducts()))
        }
        
    } catch (error) {
        console.log(error)
        
    }
   
    
})



router.get("/:pid",async (req,res) =>{
          
    const id = parseInt(req.params.pid,10)
    if(!isNaN(id)){
      const product = await manager.getProductById(id)
      if (product !== undefined){
          res.send((product))
      }else{
          return res.send((await manager.getProducts()))
      }
      
    }else{
        res.status(400).json({ error: 'formato id invalido' })
    }

  })
router.put("/:pid",upload.none(),async(req,res)=> {
    
    
    try {
        const id = parseInt(req.params.pid,10)
        if(!isNaN(id)){ 
            const product = req.body
           res.send(await manager.updateProduct(id,product)) 
          }else{
            res.status(400).json({ error: 'formato id invalido' })
          }
        
    } catch (error) {
        console.log(error)
    }

})

router.post("/",upload.none(),async (req,res) =>{
    let { title,
        description,
        price,
        code,
        stock,
        category,
        status,
        thumbnail } = req.body
    console.log(req.body)
    if(thumbnail === undefined){
        thumbnail = "SIN FOTO"
    }
    if(title !== undefined && description !== undefined && price !== undefined && code !== undefined && stock !== undefined && category !== undefined){
        res.send(await manager.addProduct(title,description,price,code,stock,category,status,thumbnail))
    }else{
        res.status(400).json({ error: 'todos los campos son obligatorios' })
    }
  })


router.delete("/:pid",async (req,res) =>{
          
    const id = parseInt(req.params.pid,10)
    if(!isNaN(id)){
      const product = await manager.getProductById(id)
      if (product !== undefined){
          await manager.deleteProduct(id)
      }else{
        res.status(404).json({ error: 'El producto no existe' })
      }
      
    }else{
        return res.send("error")
    }

  })


module.exports = router