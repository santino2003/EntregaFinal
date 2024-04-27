
import {cartServices} from "../repository/index.js"


class CartController {
    constructor() {
        this.cartServices = cartServices;
       
    }

    createCart = async (req, res) => {
        try {
            res.send(await this.cartServices.createCart());
        } catch (error) {
            res.send(console.log(error));
        }
    }

    getCartsCidController = async (req, res) =>{
        try {
            const id = req.params.cid || req.user.user.cart[0]._id;
            if (id) {
                res.send(await this.cartServices.getProductsCart(id));
            } else {
                res.status(400).json({ error: 'formato id invalido' });
            }
        } catch (error) {
            console.log(error);
        }
    }

    addProductCartController = async(req, res) => {
        try {
            const cid = req.params.cid || req.user.user.cart[0]._id;
            const pid = req.params.pid;
            if (cid !== undefined && pid !== undefined) {
                const producto = await this.cartServices.getProductById(pid);
                if (producto) {
                    if (producto.stock >= 1) {
                        const modificacion = {
                            stock: producto.stock - 1
                        };
                        this.cartServices.updateProduct(pid, modificacion);
                        res.send(await this.cartServices.addProductToCart(cid, pid));
                    } else {
                        res.send("stock insuficiente");
                    }
                } else {
                    res.status(404).json({ error: 'El producto no existe' });
                }
            } else {
                res.status(400).json({ error: 'id invalido' });
            }
        } catch (error) {
            console.log(error);
        }
    }

    deleteCartController = async (req, res) => {
        try {
            const id = req.params.cid || req.user.user.cart[0]._id;
            res.send(await this.cartServices.emptyCart(id));
        } catch (error) {
            console.log(error);
        }
    }

    modifiProductCartController = async(req, res) =>{
        try {
            const cid = req.params.cid || req.user.user.cart[0]._id;
            const pid = req.params.pid;
            const quantity = req.body.quantity;
            console.log(quantity);
            res.send(await this.cartServices.updateProductQuantity(cid, pid, quantity));
        } catch (error) {
            console.log(error);
        }
    }

    deleteProductCartController = async (req, res)=> {
        try {
            const cid = req.params.cid || req.user.user.cart[0]._id;
            const pid = req.params.pid;
            const producto = await this.cartServices.getProductById(pid);
            res.send(await this.cartServices.deleteProducts(cid, pid));
            const modificacion = {
                stock: producto.stock + 1
            };
            this.managerMongo.updateProduct(pid, modificacion);
            res.send(await this.cartServices.addProductToCart(cid, pid));
        } catch (error) {
            console.log(error);
        }
    }
    purchaseCartController = async (req, res) => {
        try {
            const id = req.params.cid || req.user.user.cart[0]._id;
            res.send(await this.cartServices.purchaseCart(id));
        } catch (error) {
            console.log(error);
        }
    }

}

export default CartController;