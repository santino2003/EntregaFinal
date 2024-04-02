const userModel = require("../dao/models/user.model");
const CartManagerMongo = require('../dao/CartManagerMongo')

const cartManagerMongo = new CartManagerMongo()



const findUser = async (email) => {
    return await userModel.findOne({ email });
  };

const createUser = async (userBody, pswHashed) =>{
    const { first_name, last_name, email, age, password, role } = userBody

    const newUser = await userModel.create({
        first_name,
        last_name,
        email,
        age,
        role,
        cart : await cartManagerMongo.createCart(),
        password: pswHashed,
      });

    return newUser
}

  module.exports = {
    findUser,
    createUser,
  };
        