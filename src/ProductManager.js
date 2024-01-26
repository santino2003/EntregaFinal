const { error } = require("console")
const fs = require("fs/promises")
const paths = require("path")
class ProductManager{
    constructor(pathBase){
       this.pathDB = pathBase
    }

    async getProducts () {
        try {
            const allProducts = await fs.readFile(this.pathDB)
            if(allProducts.length !== 0){
                return JSON.parse(allProducts)
            }else{
                return []
            }
           
        } catch (error) {
            console.log(error)
        }
    }

    async addProduct(
        title,
        description,
        price,
        code,
        stock,
        category,
        status = true,
        thumbnail,
    )
    
    {
        try {
            const product = {
                title,
                description,
                price,
                code,
                stock,
                category,
                status,
                thumbnail,
            }
            
    
            const allProducts = await this.getProducts()
            
            if(allProducts.products.length ===0){
                product.id = 1
                allProducts.products.push(product)
                await fs.writeFile(this.pathDB, JSON.stringify(allProducts))
            }else{
                product.id = allProducts.products[allProducts.products.length -1].id +1
                const codigoRep = allProducts.products.find(producto => producto.code === code);
                if(codigoRep){
                    console.log('Codigo repetido')
                }else{
                    allProducts.products.push(product)
                    await fs.writeFile(this.pathDB, JSON.stringify(allProducts))
                }
            }
        } catch (error) {
            console.log(error)
        }
       

    
            
        
        
    }

    async getProductById (id){
        try {
            const allProducts = await this.getProducts()
            const productoEncontrado = allProducts.products.find(producto => producto.id === id);
            if (productoEncontrado) {
                return productoEncontrado;
            }else {
               
                return error(404)
              }
        } catch (error) {
            console.log(error)
        }


    }

    async updateProduct(id,product){
        try {
            
            const allProducts = await this.getProducts()
            const productoEncontrado = allProducts.products.find(producto => producto.id === id);
            console.log(product)
            if(productoEncontrado){
                Object.keys(product).forEach(campo => {
                    
                    if (productoEncontrado.hasOwnProperty(campo)){
                        
                        productoEncontrado[campo] = product[campo]
                    }
                   
                })
                await fs.writeFile(this.pathDB, JSON.stringify(allProducts))

            }else{
                return error(400)
            }
        } catch (error) {
            console.log(error)
        }
    }

    async deleteProduct(id){
        try {
            const allProducts = await this.getProducts()
            
            const productosFiltrados = allProducts.products.filter(producto => producto.id !== id)
            const guararJson = {
                products: productosFiltrados
            }
            
            await fs.writeFile(this.pathDB, JSON.stringify(guararJson))
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = ProductManager