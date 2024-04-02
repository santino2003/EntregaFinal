
const { createHash, isValidPasswd } = require("../utils/encrypt");
const { generateJWT } = require("../utils/jwt");
const sessionServices = require("../services/session.services")


const loginController = async(req,res) => {
    try {
        const { email, password } = req.body;
        const findUser = await sessionServices.findUser(email)
    
    
        if (!findUser) {
          return res
            .status(401)
            .json({ message: `este usuario nooooo esta registrado` });
        }
        const isValidComparePsw = await isValidPasswd(password, findUser.password);
        if (!isValidComparePsw) {
          return res.status(401).json({ message: `credenciales invalidas` });
        }
        const {
          password: passwordFromDB,
          first_name,
          last_name,
          email: emailDb,
          age,
          cart,
          role,
        } = findUser;
    
        const token = await generateJWT({
          first_name,
          last_name,
          email: emailDb,
          age,
          role,
          cart,
          id: findUser._id,
        });
        return res.cookie('token', token, { httpOnly: true }).redirect("/products");
        
        
        
    } catch (error) {
        console.log(
          error
        );
      }
    };
    

const registerController = async(req,res) => {
  try {
    const {password} = req.body
    const pswHashed = await createHash(password);
    const newUser = await sessionServices.createUser(req.body,pswHashed)
    
    if (!newUser) {
      return res
        .status(500)
        .json({ message: `we have some issues register this user` });
    }

    
    return res.redirect("/login");
  } catch (error) {

    console.log(
      error
    );
  }
}

const currentController = async(req,res) => {
  return res.json({ message:  req.user });
}

module.exports = {
  loginController,
  registerController,
  currentController,
};
      