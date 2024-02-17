const {Router} = require("express")
const ProductManager = require('../dao/ProductManager')
const ProductManagerMongo = require('../dao/ProducManagerMongo')
const paths = require("path")
const multer = require('multer');


const upload = multer()

const pathBase = paths.join(__dirname, 'db.json')
const manager = new ProductManager(pathBase)
const managerMongo = new ProductManagerMongo()
const router = Router()

router.get("/" ,async(req,res) => {
    try {
        bool = req.query.hasOwnProperty("limit")
        console.log(bool)
        const numero = parseInt(req.query.limit,10)
        
    
        if(!isNaN(numero) && bool ){
            allProducts = await managerMongo.getProducts()
            
            if(allProducts.length >= numero ){
                
                return res.send(allProducts.slice(0, numero))
                
            }else{
                return res.send((await managerMongo.getProducts()))
            }
           
        }else{
            return res.send((await managerMongo.getProducts()))
        }
        
    } catch (error) {
        console.log(error)
        
    }
   
    
})



router.get("/:pid",async (req,res) =>{
          
    const id = (req.params.pid)
    if(id){
      const product = await managerMongo.getProductById(id)
      if (product !== undefined){
          res.send((product))
      }else{
          return res.send((await managerMongo.getProducts()))
      }
      
    }else{
        res.status(400).json({ error: 'formato id invalido' })
    }

  })
router.put("/:pid",upload.none(),async(req,res)=> {
    
    
    try {
        const id = req.params.pid
        if(id){ 
            const product = req.body
           res.send(await managerMongo.updateProduct(id,product)) 
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
    
    if(thumbnail === undefined){
        thumbnail = "SIN FOTO"
    }
    if(title !== undefined && description !== undefined && price !== undefined && code !== undefined && stock !== undefined && category !== undefined){
        res.send(await managerMongo.addProduct(title,description,price,code,stock,category,status,thumbnail))
    }else{
        res.status(400).json({ error: 'todos los campos son obligatorios' })
    }
  })


router.delete("/:pid",async (req,res) =>{
          
    const id = req.params.pid
    if(id){
      const product = await managerMongo.getProductById(id)
      if (product !== undefined){
          
          return res.send(await managerMongo.deleteProduct(id))
      }else{
        res.status(404).json({ error: 'El producto no existe' })
      }
      
    }else{
        return res.send("error")
    }

  })


module.exports = router