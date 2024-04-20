import mongoose from'mongoose';
import mongoosePaginateV2 from"mongoose-paginate-v2"

const pedidoSchema = new mongoose.Schema({
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

pedidoSchema.plugin(mongoosePaginateV2)
const cartModel = mongoose.model('carts',pedidoSchema);

export default cartModel;
