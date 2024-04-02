const { Router } = require("express");
const sesionController =  require("../controllers/session.controller")
const handlePolicies = require("../dao/middleware/handle-policies.middleware");

const router = Router();



router.post("/login", sesionController.loginController)

router.post("/register",  sesionController.registerController)
router.get("/current", handlePolicies(["USER","ADMIN"]), sesionController.currentController)


// router.post("/recover-psw", async (req, res) => {
//   try {
//     const { new_password, email } = req.body;
  

//     const newPswHash = await createHash(new_password);
//     const user = await userModel.findOne({ email });

//     if (!user) {
//       return res
//         .status(401)
//         .json({ message: `credenciales invalidas o erroneas` });
//     }

//     const updateUser = await userModel.findByIdAndUpdate(user._id, {
//       password: newPswHash,
//     });

//     if (!updateUser) {
//       return res.json({ message: "problemas actualizando la contrasena" });
//     }

//     return res.render("login");
//   } catch (error) {
//     console.log(
//       error
//     );
//   }
// });

// router.get(
//   "/github",
//   passport.authenticate("github", { scope: ["user:email"] }),
//   async (req, res) => {}
// );

// router.get(
//   "/github/callback",
//   passport.authenticate("github", { failureRedirect: "/login" }),
//   async (req, res) => {
//     try {
//       req.session.user = req.user;
//       res.redirect("/products");
//     } catch (error) {
//       console.log("🚀 ~ file: session.routes.js:115 ~ error:", error);
//     }
//   }
// );



module.exports = router;
