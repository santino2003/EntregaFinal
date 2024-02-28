const productModel = require("../dao/models/product.model")
class ProductManagerMongo{
    async getProducts (filtro,demasQueris) {
        try {
            
            const products = await productModel.paginate(filtro,demasQueris)
            return products
        } catch (error) {
            return(error)
        }
    }
    async getProductById(id){
        try {
            const products = await productModel.find({_id: id})
            return products[0]
        } catch (error) {
            
        }
    }
    async addProduct(title,description,price,code,stock,category,status,thumbnail){
        try {
            await productModel.create( {
                title: title ,
                description,
                price,
                code,
                stock,
                category,
                status,
                thumbnail,
            })
            
            return
            
        } catch (error) {
            console.log(error)
        }
    
    }
    async updateProduct(id,product){
        try {
            await productModel.updateOne(
                {_id: id},
                { $set: product })
                
            
        } catch (error) {
            console.log(error)
        }
       
    }
    async deleteProduct(id){
        try {
            await productModel.deleteOne(
                {_id: id})
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = ProductManagerMongo