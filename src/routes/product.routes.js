const {Router} = require("express")
const multer = require('multer');
const productController = require("../controllers/product.controller")



const upload = multer()

const router = Router()

router.get("/", productController.getAllProductsCrontroller)

router.get("/:pid",productController.getProductPidCrontroller)

router.put("/:pid",upload.none(),productController.updateProductController)

router.post("/",upload.none(),productController.addProductController)

router.delete("/:pid",productController.delteProductController)

module.exports = router