import cartModel from "../models/cart.model.js"
class CartManagerMongo{

    async getProductsCart(id){
        try {
            const cart = await cartModel.find({})
            .populate('products.product')
            
        
            return (cart)
        } catch (error) {
            console.log(error)
        }
      
    }
    async emptyCart(idCart){ 
        const cart = await cartModel.findOne({_id: idCart})
        cart.products = []
        await cartModel.updateOne({_id:idCart},cart)
    }

    async updateProductQuantity(idCart,idProduct,quantity){
        const cart = await cartModel.findOne({_id: idCart})
        if (cart){
            const product = cart.products.find(product => (product.product).toString() === idProduct)
            console.log("primer if")
            if (product){
                product.quantity = quantity + product.quantity
                console.log(product)

                await cartModel.updateOne({_id:idCart},cart)
            }

        }
    }

    async delteProducts(idCart,idProduct){
        const cart = await cartModel.findOne({_id: idCart})
        
        
        if (cart){
            const product = cart.products.find(product => (product.product).toString() === idProduct)
            
            if (product){
                if((product.quantity) > 1){
                    product.quantity -= 1
                    
                    await cartModel.updateOne({_id:idCart},cart)
                }
                    
                else{
                    const index = cart.products.indexOf(product)
                    cart.products.splice(index, 1)
                    await cartModel.updateOne({_id:idCart},cart)
                    
                }
            }
            else{
            return(error(404))}
            
           
        
        }
    }
    async createCart(){
       try {
            const cart = await cartModel.create({
                products: []
            
            })
            return cart._id
       } catch (error) {
            console.log(error)
       }
    }
    async addProductToCart(idCart,idProduct){
        const cart = await cartModel.findOne({_id: idCart})
        
        if (cart){
            const product = cart.products.find(product => (product.product).toString() === idProduct)
            
            if (product){
                product.quantity += 1

                await cartModel.updateOne({_id:idCart},cart)
                
            }else{
                const productoNuevo = {
                    product: idProduct,
                    quantity: 1
                }


                cart.products.push(productoNuevo)
                await cartModel.updateOne({_id:idCart},cart)
            }
        }else{
            return(error(404))
        }

    }

}
export default CartManagerMongo
