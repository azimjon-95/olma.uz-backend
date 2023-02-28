const { Schema, model } = require("mongoose");
const Joi = require("joi");

const userSchema = new Schema({
  fname: {
    type: String,
    required: true,
  },
  lname: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  phoneNum: {
    type: Number,
    required: true,
  },
  img: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  admin: Boolean,
});

const User = model("user", userSchema);
const userValidate = (body) => {
  const schema = Joi.object({
    fname: Joi.string().required().min(2),
    lname: Joi.string().required().min(2),
    age: Joi.number().required().min(1),
    phoneNum: Joi.number().required().min(2),
    img: Joi.string().required(),
    country: Joi.string().required().min(2),
    username: Joi.string().required().min(2),
    password: Joi.string().required().min(2),
    admin: Joi.boolean(),
  });
  return schema.validate(body);
};

module.exports = { userValidate, User };
