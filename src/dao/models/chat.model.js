const mongoose = require('mongoose');


const chatEschema = new mongoose.Schema({
  
    user: String,
    message: String
  
});


const chatModel = mongoose.model('chat', chatEschema);

module.exports = chatModel;
