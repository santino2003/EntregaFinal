import mongoose from "mongoose";
import mongoosePaginateV2 from "mongoose-paginate-v2"
const productCollection = "products"

const productSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true
    },
    code:{
        type: Number,
        required: true,
        unique: true
    },
    stock:{
        type: Number,
        required: true
    },
    category:{
        type: String,
        required: true
    },
    status:{
        type: Boolean,
        default: true
    },
    thumbnail:{
        type: String
    }
})

productSchema.plugin(mongoosePaginateV2)

const productModel = mongoose.model(productCollection,productSchema)

export default productModel