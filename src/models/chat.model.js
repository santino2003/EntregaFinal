import mongoose from'mongoose';


const chatEschema = new mongoose.Schema({
  
    user: String,
    message: String
  
});


const chatModel = mongoose.model('chat', chatEschema);

export default chatModel;
