const {Router} = require("express")
const ProductManager = require('../dao/ProductManager')
const ProductManagerMongo = require('../dao/ProducManagerMongo')
const paths = require("path")
const multer = require('multer');
const { Query } = require("mongoose");


const upload = multer()

const pathBase = paths.join(__dirname, 'db.json')
const manager = new ProductManager(pathBase)
const managerMongo = new ProductManagerMongo()
const router = Router()

router.get("/" ,async(req,res) => {
    try {

        let  {limit =4, page = 1, query = {},sort ={},} = req.query
        
        if(Object.keys(query).length !== 0){
            const parts = query.split(':').map(part => part.replace(/"/g, '').trim());

            // Crear un objeto usando las partes
            query = { [parts[0]]: parts[1] };
            
        }
        if(sort == 1){
            sort = {price:1}
            
        }else if(sort == -1){
            sort = {price:-1}
            
        }


        
        const {
            docs,
            totalDocs,
            limit:limitPag,
            totalPages,
            hasNextPage,
            hasPrevPage,
            nextPage,
            prevPage
        

        } = await managerMongo.getProducts(query,{page,limit,sort})
        
        
        let prevLink
        let nextLink
    
        if(hasPrevPage){
            prevLink = `/api/products?page=${prevPage}`
        }
        else{
            prevLink = null
        }
        if(hasNextPage){
            nextLink = `/api/products?page=${nextPage}`}
        else{
            nextLink = null
        }

        return res.json({
            status:"success",
            payload: docs,
            totalPages,
            prevPage,
            nextPage,
            page,
            hasPrevPage,
            hasNextPage,
            prevLink,
            nextLink
           
        })

        
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