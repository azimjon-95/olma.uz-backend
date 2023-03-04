const express = require("express");
const router = express.Router();
const cloudinary = require("../utils/cloudinary");
const upload = require("../utils/multer");
const { productValidate, Products } = require("../model/productSchema");

router.get("/", async (req, res) => {
  try {
    let products = await Products.find();
    res.json({ state: true, msg: "All products", data: products });
  } catch {
    res.json("something went wrong");
  }
});

// Search Products
router.get("/search", async (req, res) => {
  try {
    const value = req.query.searchingValue.toLocaleLowerCase();
    const products = await (await Products.find().select({ item: 1, url: 1 }))
      .filter((i) => i.item.toLocaleLowerCase().includes(value))
      .filter((_, inx) => inx <= 4);

    if (!products.length) {
      return res.json({
        msg: "This product is not defined",
        innerData: products,
        state: false,
      });
    }

    return res.json({
      msg: "This product is defined",
      innerData: products,
      state: true,
    });
  } catch {
    res
      .status(500)
      .json({ state: false, msg: "Server error", innerData: null });
  }
});

//--------Create products-----------

router.post("/", upload.array("urls"), async (req, res) => {
  try {
    const uploader = async (path) => await cloudinary.uploads(path, "olma.uz");

    const urls = [];
    if (req.files) {
      const files = req.files;
      for (const file of files) {
        const { path } = file;
        const newPath = await uploader(path);
        urls.push(newPath);
        fs.unlinkSync(path);
      }
    }

    const { error } = productValidate(req.body);
    if (error) {
      res.json({
        state: false,
        msg: error.details[0].message,
        innerData: null,
      });
    }

    const createProduct = await Products.create({ ...req.body, url: urls });

    // checking
    if (!createProduct) {
      return res.status(400).json({
        state: false,
        msg: "Can not create",
        innerData: createProduct,
      });
    }
    const saveProduct = await createProduct.save();

    res.status(201).json({
      state: true,
      msg: "Product was created",
      innerData: saveProduct,
    });
  } catch {
    res
      .status(500)
      .json({ state: false, msg: "Server error", innerData: null });
  }
});

// Update products
router.put("/:_id", async (req, res) => {
  try {
    let updatedProduct = await Products.findByIdAndUpdate(
      req.params._id,
      req.body
    );
    res.json({ state: true, msg: "updated", data: updatedProduct });
  } catch {
    res.json("something went wrong");
  }
});

// Delete products
router.delete("/:_id", async (req, res) => {
  try {
    let deleteProduct = await Products.findByIdAndDelete(req.params._id);
    res.json({ state: true, msg: "Deleted", data: deleteProduct });
  } catch {
    res.json("something went wrong");
  }
});

module.exports = router;
