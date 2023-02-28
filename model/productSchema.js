const {Schema, model} = require("mongoose");
const Joi = require("joi");

const productsSchema = new Schema({
    item: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    url: {
        type: Array,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    productId: {
        type: String,
    },
})

const Products = model("product", productsSchema);
const productValidate = (body)=>{
    const schema = Joi.object({
        item:  Joi.string().required().min(2),
        price: Joi.number().required().min(2),
        url:   Joi.array(),
        category: Joi.string(),
        productId: Joi.string()
    })
    return schema.validate(body)
}
module.exports = {productValidate, Products}