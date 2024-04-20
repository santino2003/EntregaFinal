import {Router} from "express"
import multer from 'multer';
import ProductCtrl from "../controllers/product.controller.js"
import handlePolicies from "../middleware/handle-policies.middleware.js"

const productCtrl = new ProductCtrl();

const upload = multer()

const router = Router()

router.get("/", productCtrl.getProducts)

router.get("/:pid",productCtrl.getProductById)

router.put("/:pid",handlePolicies(["ADMIN"]),upload.none(),productCtrl.updateProduct)

router.post("/",handlePolicies(["ADMIN"]),upload.none(),productCtrl.addProduct)

router.delete("/:pid" ,handlePolicies(["ADMIN"]),productCtrl.deleteProduct)

export default router