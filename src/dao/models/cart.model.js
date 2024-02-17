const mongoose = require('mongoose');


const pedidoEsquema = new mongoose.Schema({
  products: [{
    Prodid: String,
    quantity: Number
  }], 
});


const cartModel = mongoose.model('carts', pedidoEsquema);

module.exports = cartModel;
