const mongoose = require('mongoose');


const pedidoEsquema = new mongoose.Schema({
  products:{
      type:[
        {
          product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "products"
          },
          quantity:{
            type:Number
          }
        }
    ]
    }

});


const cartModel = mongoose.model('carts', pedidoEsquema);

module.exports = cartModel;
