const mongoose = require("mongoose");

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

const productModel = mongoose.model(productCollection,productSchema)

module.exports = productModel
