const { Router } = require("express");
const userModel = require("../dao/models/user.model");
const { listenerCount } = require("../dao/models/cart.model");

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
    const session = req.session;
    console.log(
      session
    );

    const findUser = await userModel.findOne({ email });

    if (!findUser) return res.json({ message: `user not register` });

    if (findUser.password !== password) {
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
    console.log("BODY REGISTER***", req.body);
    const { first_name, last_name, email, age, password } = req.body;
    let isAdmin = false
    if(email == "adminCoder@coder.com"){
      isAdmin = true
    }
    const addUser = {
      first_name,
      last_name,
      email,
      age,
      password,
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



module.exports = router;
