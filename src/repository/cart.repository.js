
import CartManagerMongo from '../dao/CartManagerMongo.js'
import paths from "path"

import ProductManagerMongo from "../dao/ProducManagerMongo.js";


class CartRepositoryDao {
    constructor() {
        this.managerMongo = new ProductManagerMongo();
        this.cartManagerMongo = new CartManagerMongo();
    }

    async createCart() {
        return await this.cartManagerMongo.createCart();
    }

    async getProductsCart(id) {
        return await this.cartManagerMongo.getProductsCart(id);
    }

    async getProductById(id) {
        const product = await this.managerMongo.getProductById(id);
        return product;
    }

    async updateProduct(id, modificacion) {
        return await this.managerMongo.updateProduct(id, modificacion);
    }

    async addProductToCart(id, modificacion) {
        return await this.cartManagerMongo.addProductToCart(cid, pid);
    }

    async emptyCart(id) {
        return await this.cartManagerMongo.emptyCart(id);
    }

    async updateProductQuantity(cid, pid, quantity) {
        return await this.cartManagerMongo.updateProductQuantity(cid, pid, quantity);
    }

    async deleteProducts(cid, pid, quantity) {
        return await this.cartManagerMongo.deleteProducts(cid, pid);
    }
}

export default CartRepositoryDao;
