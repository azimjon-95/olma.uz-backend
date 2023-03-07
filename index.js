const express = require("express");
const mongoose = require("mongoose");
const { config } = require("dotenv");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());
config();

mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB is connected"))
  .catch(() => console.log("MongoDB is not connected"));

// Router import
const Products = require("./router/products");
const Admin = require("./router/admin");
app.use("/products", Products);
app.use("/admin", Admin);

app.get("/", async (req, res) => {
  res.json("App is running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`${PORT} in listening`));
