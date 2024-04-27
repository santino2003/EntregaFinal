import cartModel from "../models/cart.model.js"
import productModel from "../models/product.model.js"
import ticketModel from "../models/ticket.model.js"
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
    async purchaseCart(idCart){
        const cart = await cartModel.findOne({_id: idCart})
        function calculateTotalPrice(products){
            let total = 0
            for (const product of products){
                total += product.product.price * product.quantity
            }
            return total
        }
        
        if (cart) {
            for (const product of cart.products) {
                const stock = await productModel.findOne({_id: product.product})
                if (stock && stock.quantity >= product.quantity) {
                    stock.quantity -= product.quantity
                    await stock.save()
                    const ticket = await ticketModel.create({
                        cartId: idCart,
                        products: cart.products,
                        totalPrice: calculateTotalPrice(cart.products),
                        purchaser:  req.user.user.first_name + " " + req.user.user.last_name
                    });
                    return ticket
                } else {
                    const index = cart.products.indexOf(product)
                    cart.products.splice(index, 1)
                }
            }
            await cartModel.updateOne({_id: idCart}, cart)
        }
    }

}
export default CartManagerMongo
