import userModel from "../models/user.model.js";
import CartManagerMongo from '../dao/CartManagerMongo.js'


class SessionRepositoryDao {
  constructor() {
      this.cartManagerMongo =  new CartManagerMongo();
  }

   findUser = async (email)=> {
      return await userModel.findOne({ email });
  }

   createUser = async (userBody, pswHashed)=> {
      const { first_name, last_name, email, age, password, role } = userBody;
        const idCart = await this.cartManagerMongo.createCart();
        console.log("idCart", idCart)
      const newUser = await userModel.create({
          first_name,
          last_name,
          email,
          age,
          role,
          cart: idCart,
          password: pswHashed,
      });

      return newUser;
  }
}

export default SessionRepositoryDao;
