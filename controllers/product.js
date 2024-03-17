const Category = require("../models/category");
const { Product, validate } = require("../models/product");
const ProductCategoryRelation = require("../models/product-category");

const GetProducts = async (req, res) => {
  try {
    const products = await Product.find();
    if (products.length === 0) {
      return res.status(404).json({
        status: false,
        message: "No records found",
        total: products.length,
        data: products,
      });
    }
    return res.json({
      status: true,
      message: "records found",
      total: products.length,
      data: products,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const GetProductsById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      return res.json({
        status: true,
        message: "record found",
        data: product,
      });
    }
    return res.status(404).json({
      status: false,
      message: "No records found",
      data: product,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const GetProductsByCategory = async (req, res) => {
  try {
    const productWithCategory = await ProductCategoryRelation.find({
      category_id: req.params.category_id,
    });
    const productIds = productWithCategory.map((product) => product.product_id);
    const products = await Product.find({ _id: { $in: productIds } });
    if (products.length === 0) {
      return res.status(404).json({
        status: false,
        message: "No records found",
        total: products.length,
        data: products,
      });
    }
    return res.json({
      status: true,
      message: "records found",
      total: products.length,
      data: products,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const AddProducts = async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error)
      return res.status(400).json({
        status: false,
        message: error.details[0].message,
      });

    const product = new Product(req.body);

    if (req.body.category_ids) {
      const categoryPromises = req.body.category_ids.map(
        async (category_id) => {
          const categoryExist = await Category.findById(category_id);
          if (!categoryExist) {
            throw new Error("Category not found");
          }
        }
      );

      try {
        await Promise.all(categoryPromises);
      } catch (error) {
        return res.status(400).json({
          status: false,
          message: error.message,
        });
      }
      const productCategoryRelation = req.body.category_ids.map(
        (category_id) => ({
          category_id,
          product_id: product._id,
        })
      );
      await ProductCategoryRelation.insertMany(productCategoryRelation);
    }
    const result = await product.save();
    if (result) {
      return res.json({
        status: true,
        message: "record added successfully",
        data: result,
      });
    }
    return res.status(400).json({
      status: false,
      message: "record not added",
      data: result,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const UpdateProducts = async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error)
      return res.status(400).json({
        status: false,
        message: error.details[0].message,
      });

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        status: false,
        message: "No product found",
      });
    }

    if (req.body.category_ids) {
      const categoryPromises = req.body.category_ids.map(
        async (category_id) => {
          const categoryExist = await Category.findById(category_id);
          if (!categoryExist) {
            throw new Error("Category not found");
          }
        }
      );

      try {
        await Promise.all(categoryPromises);
      } catch (error) {
        return res.status(400).json({
          status: false,
          message: error.message,
        });
      }
      await ProductCategoryRelation.deleteMany({ product_id: product._id });
      const productCategoryRelation = req.body.category_ids.map(
        (category_id) => ({
          category_id,
          product_id: product._id,
        })
      );
      await ProductCategoryRelation.insertMany(productCategoryRelation);
    }

    const result = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (result) {
      return res.json({
        status: true,
        message: "record updated successfully",
        data: result,
      });
    }
    return res.status(400).json({
      status: false,
      message: "record not updated",
      data: result,
    });
  } catch (error) {}
};

const DeleteProducts = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        status: false,
        message: "No product found",
      });
    }
    await Product.findByIdAndDelete(req.params.id);
    return res.json({
      status: true,
      message: "record deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  GetProducts,
  GetProductsById,
  GetProductsByCategory,
  AddProducts,
  UpdateProducts,
  DeleteProducts,
};
