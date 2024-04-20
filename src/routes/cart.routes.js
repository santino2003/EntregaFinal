import {Router} from "express"

import multer from 'multer';

import CartController from "../controllers/cart.controller.js"

import handlePolicies from "../middleware/handle-policies.middleware.js";
const cartController = new CartController();

const upload = multer().none()

const router = Router()

router.post("/",cartController.createCart)

router.get("/:cid", cartController.getCartsCidController)

router.post("/:cid/product/:pid",handlePolicies(["USER"]),cartController.addProductCartController)
   
router.delete("/:cid", cartController.deleteCartController)
  
  
router.put("/:cid/product/:pid",upload,cartController.modifiProductCartController)


router.delete("/:cid/product/:pid",cartController.deleteProductCartController)

export default router