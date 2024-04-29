
import { ProductServices } from "../repository/index.js";
import { generateProduct } from "../utils/generate-product.js";    



export default class ProductCtrl {
    constructor() {
        this.productServices = ProductServices; 
        
    }

    getProducts = async (req, res) => {
        try {
            console.log("hola")
            let { limit = 4, page = 1, query = {}, sort = {} } = req.query;

            if (Object.keys(query).length !== 0) {
                const parts = query.split(':').map(part => part.replace(/"/g, '').trim());
                query = { [parts[0]]: parts[1] };
            }

            if (sort == 1) {
                sort = { price: 1 };
            } else if (sort == -1) {
                sort = { price: -1 };
            }

            const {
                docs,
                totalDocs,
                limit: limitPag,
                totalPages,
                hasNextPage,
                hasPrevPage,
                nextPage,
                prevPage
            } = await this.productServices.getProducts(query, { page, limit, sort });

            let prevLink;
            let nextLink;

            if (hasPrevPage) {
                prevLink = `/api/products?page=${prevPage}`;
            } else {
                prevLink = null;
            }

            if (hasNextPage) {
                nextLink = `/api/products?page=${nextPage}`;
            } else {
                nextLink = null;
            }

            return res.json({
                status: "success",
                payload: docs,
                totalPages,
                prevPage,
                nextPage,
                page,
                hasPrevPage,
                hasNextPage,
                prevLink,
                nextLink
            });
        } catch (error) {
            console.log(error);
        }
    }

    getProductById = async (req, res) =>{
        try {
            const id = req.params.pid;
            if (id) {
                const product = await this.productServices.getProductById(id);
                if (product !== undefined) {
                    return res.send(product);
                }
            } else {
                return res.status(400).json({ error: 'formato id invalido' });
            }
        } catch (error) {
            return console.log(error);
        }
    }

    updateProduct = async (req, res)=> {
        try {
            const id = req.params.pid;
            if (id) {
                const product = req.body;
                return res.send(await this.productServices.updateProduct(id, product));
            } else {
                return res.status(400).json({ error: 'formato id invalido' });
            }
        } catch (error) {
            console.log(error);
        }
    }

    addProduct = async (req, res)=> {
        try {
            let { title, description, price, code, stock, category, status, thumbnail } = req.body;

            if (thumbnail === undefined) {
                thumbnail = "SIN FOTO";
            }

            if (title !== undefined && description !== undefined && price !== undefined && code !== undefined && stock !== undefined && category !== undefined) {
                return res.send(await this.productServices.addProduct(title, description, price, code, stock, category, status, thumbnail));
            } else {
                return res.status(400).json({ error: 'todos los campos son obligatorios' });
            }
        } catch (error) {
            console.log(error);
        }
    }

    deleteProduct = async (req, res) => {
        try {
            const id = req.params.pid;
            if (id) {
                const product = await this.productServices.getProductById(id);
                if (product !== undefined) {
                    return res.send(await this.productServices.deleteProduct(id));
                } else {
                    return res.status(404).json({ error: 'El producto no existe' });
                }
            } else {
                return res.send("error");
            }
        } catch (error) {
            console.log(error);
        }
    }
    mockingProducts = async (req, res) => {
        try {
            const products = [1];

            // for (let i = 0; i < 100; i++) {
            //     const product = generateProduct();

            //     products.push(product);
            // }

            return res.json(products);
        } catch (error) {
            console.log(error);
        }
    }
}

