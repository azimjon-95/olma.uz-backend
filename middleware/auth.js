const jwt = require("jsonwebtoken");
const { config } = require("dotenv");
config();

const auth = (req, res, next) => {
  let token = req.headers.token;
  // token borligini tekshirish
  if (!token) {
    return res
      .status(400)
      .json({ state: false, msg: "Token is not defined", innerData: null });
  }

  // token haqiyqiligini tekshirish
  jwt.verify(token, process.env.PRIVATE_KEY, (err, decoded) => {
    if (err) {
      return res
        .status(400)
        .json({ state: false, msg: "Toekn is fake", innerData: null });
    }
    req.lorem = decoded;
    next();
  });
};

module.exports = auth;
