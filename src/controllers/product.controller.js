
import { ProductServices } from "../repository/index.js";
import { DictionaryErrors, HttpResponse } from "../middleware/error-handle.js";
 
const httpResponse = new HttpResponse();


export default class ProductCtrl {
    constructor() {
        this.productServices = ProductServices; 
        
    }

    getProducts = async (req, res) => {
        try {
            
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
            return httpResponse.Error(res, DictionaryErrors.DATABASE_ERROR, error, DictionaryErrors.DATABASE_ERROR)
        }
    }

    getProductById = async (req, res) =>{
        try {
            const id = req.params.pid;

            if (id) {
                const product = await this.productServices.getProductById(id);
                if (product !== undefined) {
                    return res.send(product);
                }else{
                    return httpResponse.NotFound(res, DictionaryErrors.INVALID_PARAMS_ERROR, null);
                }
            } else {
                return httpResponse.BadRequest(res, DictionaryErrors.INVALID_PARAMS_ERROR, null);
            }
        } catch (error) {
           return httpResponse.Error(res, DictionaryErrors.DATABASE_ERROR, error, DictionaryErrors.DATABASE_ERROR)
        }
    }

    updateProduct = async (req, res)=> {
        try {
            const id = req.params.pid;
            if (id) {
                const product = req.body;
                return res.send(await this.productServices.updateProduct(id, product));
            } else {
               return httpResponse.BadRequest(res, DictionaryErrors.INVALID_PARAMS_ERROR, null);
            }
        } catch (error) {
            return httpResponse.Error(res, DictionaryErrors.DATABASE_ERROR, error, DictionaryErrors.DATABASE_ERROR)
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
               return httpResponse.BadRequest(res, DictionaryErrors.INVALID_PARAMS_ERROR, null);
            }
        } catch (error) {
            return httpResponse.Error(res, DictionaryErrors.DATABASE_ERROR, error, DictionaryErrors.DATABASE_ERROR)
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
                    return httpResponse.NotFound(res, DictionaryErrors.INVALID_PARAMS_ERROR, null);
                }
            } else {
               return httpResponse.BadRequest(res, DictionaryErrors.INVALID_PARAMS_ERROR, null);
            }
        } catch (error) {
           return httpResponse.Error(res, DictionaryErrors.DATABASE_ERROR, error, DictionaryErrors.DATABASE_ERROR)
        }
    }
    mockingProducts = async (req, res) => {
        try {
            // const products = [];

            // for (let i = 0; i < 100; i++) {
            //      const product = generateProduct();

            //     products.push(product);
            //  }
            // console.log(products)
            // return;
            console.log("mocking products")
        } catch (error) {
            console.log(error);
        }
    }
}

