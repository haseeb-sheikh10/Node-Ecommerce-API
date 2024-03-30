const mongoose = require("mongoose");

const productCategorySchema = new mongoose.Schema({
  category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
});

const ProductCategoryRelation = mongoose.model(
  "ProductCategoryRelation",
  productCategorySchema
);
module.exports = ProductCategoryRelation;
