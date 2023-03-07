const { Schema, model } = require("mongoose");
const Joi = require("joi");

const productsSchema = new Schema({
  item: {
    type: String,
    required: true,
  },
  price: Object,
  urls: {
    type: Array,
  },
  category: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },

  text: {
    type: String,
    required: true,
  },
  desc: {
    type: Array,
  },
  color: {
    type: Array,
  },
  admin: Object,
});

const Products = model("product", productsSchema);
const productValidate = (body) => {
  const schema = Joi.object({
    item: Joi.string().required().min(2),
    price: Joi.object(),
    urls: Joi.array(),
    category: Joi.string(),
    date: Joi.date().required(),
    text: Joi.string().required(),
    desc: Joi.array(),
    color: Joi.array(),
    admin: Joi.object(),
  });
  return schema.validate(body);
};
module.exports = { productValidate, Products };
