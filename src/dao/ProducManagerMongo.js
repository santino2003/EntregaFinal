import productModel from "../models/product.model.js"
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
            
            return("producto agregado")
            
        } catch (error) {
            console.log(error)
        }
    
    }
    async updateProduct(id,product){
        try {
            await productModel.updateOne(
                {_id: id},
                { $set: product })
            return("producto actualizado")
            
        } catch (error) {
            console.log(error)
        }
       
    }
    async deleteProduct(id){
        try {
            await productModel.deleteOne(
                {_id: id})
            return("producto eliminado")
        } catch (error) {
            console.log(error)
        }
    }
}

export default ProductManagerMongo