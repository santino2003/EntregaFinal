const { error } = require("console")
const fs = require("fs/promises")
const paths = require("path")
class CartManager{
    constructor(pathBase){
       this.pathDB = pathBase
    }

    async getCarts(){
        try {
            const allCarts = await fs.readFile(this.pathDB)
            if(allCarts.length !== 0){
                return JSON.parse(allCarts)
            }else{
                return []
            }
            
        } catch (error) {
            console.log(error)
        }
       
    }

    async getProductsCart(id){
        try {
            const allCarts = await this.getCarts()
            
            const cartFind = allCarts.carts.find(cart => cart.id === id);
            
            if(cartFind){
                
                return cartFind.products[0];

            }else{
                return error(404)
                
               
            }
        } catch (error) {
            console.log(error)
        }
    }
    async createCart(){
        try {
            const allCarts = await this.getCarts()
            
            const cart ={
                products: []
            }
             if(allCarts.carts.length === 0){
                cart.id = 1
                allCarts.carts.push(cart)
                await fs.writeFile(this.pathDB, JSON.stringify(allCarts))

             }else{
                cart.id = allCarts.carts[allCarts.carts.length -1].id +1
                allCarts.carts.push(cart)
                await fs.writeFile(this.pathDB, JSON.stringify(allCarts))
             }
            
        } catch (error) {

        }
    }

    async addProductToCart(idCart, idProduct){

        const allCarts = await this.getCarts()
        const cartFind = allCarts.carts.find(cart => cart.id === idCart);
            
        if(cartFind){
            const product = cartFind.products.find(product => product.id === idProduct);
            
            if(product){
                product.quantity += 1
                await fs.writeFile(this.pathDB, JSON.stringify(allCarts))
            }else{
                const product = {
                    id: idProduct,
                    quantity: 1
                }
                cartFind.products.push(product)
                await fs.writeFile(this.pathDB, JSON.stringify(allCarts))
            }
            
        }else{
            return error(404)
        }
    }
}

module.exports = CartManager