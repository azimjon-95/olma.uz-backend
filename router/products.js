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
    const products = await (await Products.find().select({ title: 1, urls: 1 }))
      .filter((i) => i.title.toLocaleLowerCase().includes(value))
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
router.post("/", upload.array("url"), async (req, res) => {
  try {
    const uploader = async (path) => await cloudinary.uploads(path, "Images");
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

    let { item, price, category } = req.body;
    let obj = {
      item,
      price,
      category,
      url: urls,
      productId: "56",
    };

    res.send(obj);
  } catch {
    res
      .status(500)
      .json({ state: false, msg: "internal server3fwrgetr", innerdata: null });
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

// router.post("/", upload.array("image"), async (req, res) => {
//   try {
//     const uploader = async (path) => await cloudinary.uploads(path, "Images");
//     if (req.method === "POST") {
//       const urls = [];
//       if (req.files) {
//         const files = req.files;
//         for (const file of files) {
//           const { path } = file;
//           const newPath = await uploader(path);
//           urls.push(newPath);
//           fs.unlinkSync(path);
//         }
//       }
//       const product = await AllProducts.create({
//         name: req.body.name,
//         image: urls,
//       });
//       try {
//         const saveProduct = await product.save();
//         res.json(saveProduct);
//       } catch (error) {
//         res.json(error);
//       }
//     } else {
//       res.status(405).json({
//         error: "unsuccess",
//       });
//     }
//   } catch {
//     res
//       .status(500)
//       .json({ state: false, msg: "Server error", innerData: null });
//   }
// });
