import ProductManagerMongo from '../dao/ProducManagerMongo.js'

// const pathBase = paths.join(__dirname, 'db.json')
// const manager = new ProductManager(pathBase)
export default class ProductRepositoryDao  {
    constructor() {
        this.managerMongo =  new ProductManagerMongo();
    }

    getProducts = async (query, { page, limit, sort }) =>{
        return await this.managerMongo.getProducts(query, { page, limit, sort });
    }

    getProductById = async (id) =>{
        return await this.managerMongo.getProductById(id);
    }

    updateProduct = async (id, product) =>{
        return await this.managerMongo.updateProduct(id, product);
    }

    addProduct = async (title, description, price, code, stock, category, status, thumbnail)=> {
        return await this.managerMongo.addProduct(title, description, price, code, stock, category, status, thumbnail);
    }

     deleteProduct = async (id)=> {
        return await this.managerMongo.deleteProduct(id);
    }
}

  ;
