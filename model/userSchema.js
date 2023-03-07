const { Schema, model } = require("mongoose");
const Joi = require("joi");

const adminSchema = new Schema({
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
  gender: {
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

const Admin = model("admin", adminSchema);
const adminValidate = (body) => {
  const schema = Joi.object({
    fname: Joi.string().required().min(2),
    lname: Joi.string().required().min(2),
    age: Joi.number(),
    phoneNum: Joi.number(),
    gender: Joi.string().required(),
    username: Joi.string().required().min(2),
    password: Joi.string().required().min(2),
    admin: Joi.boolean(),
  });
  return schema.validate(body);
};

module.exports = { adminValidate, Admin };
