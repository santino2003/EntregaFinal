
import { createHash, isValidPasswd } from "../utils/encrypt.js";
import { generateJWT } from "../utils/jwt.js";
import CurrentDTO from "../dto/currrent.dto.js";
import { DictionaryErrors, HttpResponse } from "../middleware/error-handle.js";
import { SessionServices } from "../repository/index.js";
const httpResponse = new HttpResponse();


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
        return httpResponse(res, 401, DictionaryErrors.INVALID_CREDENTIALS);
      }
      
      const isValidComparePsw = await isValidPasswd(password, findUser.password);
      if (!isValidComparePsw) {
        return httpResponse(res, 401, DictionaryErrors.INVALID_CREDENTIALS);  
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
      return httpResponse.Error(res, error.message, null, DictionaryErrors.INTERNAL_SERVER_ERROR);
    }
  }

  registerController = async (req, res)=> {
    try {
      const { password } = req.body;
      if (!password) {
        return httpResponse.BadRequest(res, DictionaryErrors.INVALID_PARAMS_ERROR, null);
      }
      const pswHashed = await createHash(password);
      const newUser = await this.sessionServices.createUser(req.body, pswHashed);
      
      if (!newUser) {
       return httpResponse.Error(res, DictionaryErrors.DATABASE_ERROR, null, DictionaryErrors.DATABASE_ERROR);
      }
  
      return res.redirect("/login");
    } catch (error) {
      return httpResponse.Error(res, error.message, null, DictionaryErrors.INTERNAL_SERVER_ERROR);
    }
  }

  async currentController(req, res) {
    const currentDto = new CurrentDTO(req.user)
    console.log(currentDto)
    return res.json({ message: currentDto });
  }
}

export default SessionController;