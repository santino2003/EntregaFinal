const {Router} = require("express")
const cartController = require("../controllers/cart.controller")
const multer = require('multer');

const upload = multer().none()

const router = Router()

router.post("/",cartController.createCart)

router.get("/:cid", cartController.getCartsCidController)

router.post("/:cid/product/:pid",cartController.addProductCartController)
   
router.delete("/:cid", cartController.deleteCartController)
  
  
router.put("/:cid/product/:pid",upload,cartController.modifiProductCartController)


router.delete("/:cid/product/:pid",cartController.deleteProductCartController)

module.exports = router