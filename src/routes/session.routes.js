const { Router } = require("express");
const userModel = require("../dao/models/user.model");
const { listenerCount } = require("../dao/models/cart.model");
const { createHash, isValidPasswd } = require("../utils/encrypt");
const passport = require("passport");
const router = Router();

router.get("/logout", async (req, res) => {
  req.session.destroy((err) => {
    if (!err) return res.redirect("/login");
    return res.send({ message: `logout Error`, body: err });
  });
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;


    const findUser = await userModel.findOne({ email });

    if (!findUser) return res.json({ message: `user not register` });

    const isValidComparePsw = await isValidPasswd(password, findUser.password);

    if (!isValidComparePsw) {
      return res.json({ message: `wrong password` });
    }

  
   
    req.session.user = {
  
      ...findUser,
    };

    return res.redirect("/products")
  } catch (error) {
    console.log(
      error
    );
  }
});

router.post("/register", async (req, res) => {
  try {
    const { first_name, last_name, email, age, password } = req.body;
    let isAdmin = false
    if(email == "adminCoder@coder.com"){
      isAdmin = true
    }

    const pswHashed = await createHash(password);
    const addUser = {
      first_name,
      last_name,
      email,
      age,
      password: pswHashed,
      isAdmin
    };

    const newUser = await userModel.create(addUser); 

    if (!newUser) {
      return res
        .status(500)
        .json({ message: `we have some issues register this user` });
    }

    req.session.user = { email, firstName: first_name, lastName: last_name, isAdmin };
    return res.redirect("/login");
  } catch (error) {

    console.log(
      error
    );
  }
});

router.post("/recover-psw", async (req, res) => {
  try {
    const { new_password, email } = req.body;
  

    const newPswHash = await createHash(new_password);
    const user = await userModel.findOne({ email });

    if (!user) {
      return res
        .status(401)
        .json({ message: `credenciales invalidas o erroneas` });
    }

    const updateUser = await userModel.findByIdAndUpdate(user._id, {
      password: newPswHash,
    });

    if (!updateUser) {
      return res.json({ message: "problemas actualizando la contrasena" });
    }

    return res.render("login");
  } catch (error) {
    console.log(
      error
    );
  }
});

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  async (req, res) => {}
);

router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  async (req, res) => {
    try {
      req.session.user = req.user;
      res.redirect("/products");
    } catch (error) {
      console.log("🚀 ~ file: session.routes.js:115 ~ error:", error);
    }
  }
);



module.exports = router;
