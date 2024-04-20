
import ProductRepositoryDao from "./product.repository.js";
import CartRepositoryDao from "./cart.repository.js"
import SessionRepositoryDao from "./session.repository.js"

export const cartServices = new CartRepositoryDao()
export const ProductServices = new ProductRepositoryDao()
export const SessionServices = new SessionRepositoryDao()