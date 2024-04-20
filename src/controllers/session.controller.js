
import { createHash, isValidPasswd } from "../utils/encrypt.js";
import { generateJWT } from "../utils/jwt.js";
import CurrentDTO from "../dto/currrent.dto.js";

import { SessionServices } from "../repository/index.js";


class SessionController {
  sessionServices;
  constructor() {
    this.sessionServices = SessionServices;
  }

  loginController =  async (req, res) => {
    try {
      const { email, password } = req.body;
      const findUser = await this.sessionServices.findUser(email);
  
      if (!findUser) {
        return res.status(401).json({ message: `este usuario no está registrado` });
      }
      
      const isValidComparePsw = await isValidPasswd(password, findUser.password);
      if (!isValidComparePsw) {
        return res.status(401).json({ message: `credenciales inválidas` });
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
      console.log(error);
    }
  }

  registerController = async (req, res)=> {
    try {
      const { password } = req.body;
      const pswHashed = await createHash(password);
      const newUser = await this.sessionServices.createUser(req.body, pswHashed);
      
      if (!newUser) {
        return res.status(500).json({ message: `tenemos problemas registrando este usuario` });
      }
  
      return res.redirect("/login");
    } catch (error) {
      console.log(error);
    }
  }

  async currentController(req, res) {
    const currentDto = new CurrentDTO(req.user)
    console.log(currentDto)
    return res.json({ message: currentDto });
  }
}

export default SessionController;