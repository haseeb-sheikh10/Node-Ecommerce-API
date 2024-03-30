const { Category } = require("../models/category");
const { Product, validate } = require("../models/product");
const ProductCategoryRelation = require("../models/product-category");
const RemoveFiles = require("../utils/RemoveFiles");

const GetProducts = async (req, res) => {
  try {
    let products = await Product.find().lean();
    const productWithCategory = await ProductCategoryRelation.find();
    for (let i = 0; i < products.length; i++) {
      const categoryIds = productWithCategory
        .filter(
          (product) =>
            product.product_id.toString() == products[i]._id.toString()
        )
        .map((product) => product.category_id);

      const categories = await Category.find({ _id: { $in: categoryIds } });
      products[i].categories = categories;
    }
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
    let product = await Product.findById(req.params.id).lean();
    const productWithCategory = await ProductCategoryRelation.find();
    const categoryIds = productWithCategory
      .filter((p) => p.product_id.toString() == product._id.toString())
      .map((p) => p.category_id);

    console.log(categoryIds);
    const categories = await Category.find({ _id: { $in: categoryIds } });
    product.categories = categories;

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
    let products = await Product.find({ _id: { $in: productIds } }).lean();
    for (let i = 0; i < products.length; i++) {
      const categoryIds = productWithCategory
        .filter(
          (product) =>
            product.product_id.toString() == products[i]._id.toString()
        )
        .map((product) => product.category_id);

      const categories = await Category.find({ _id: { $in: categoryIds } });
      products[i].categories = categories;
    }
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
    product.images = [];
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
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({
        status: false,
        message: "No product found",
      });
    }
    await RemoveFiles(product.images);
    await ProductCategoryRelation.deleteMany({ product_id: product._id });
    return res.json({
      status: true,
      message: "record deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const GetFeaturedProducts = async (req, res) => {
  try {
    let products = await Product.find({ is_featured: true }).lean();
    const productWithCategory = await ProductCategoryRelation.find();
    for (let i = 0; i < products.length; i++) {
      const categoryIds = productWithCategory
        .filter(
          (product) =>
            product.product_id.toString() == products[i]._id.toString()
        )
        .map((product) => product.category_id);

      const categories = await Category.find({ _id: { $in: categoryIds } });
      products[i].categories = categories;
    }
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

const GetNewArrivalProducts = async (req, res) => {
  try {
    let products = await Product.find({ is_new_arrival: true }).lean();
    const productWithCategory = await ProductCategoryRelation.find();
    for (let i = 0; i < products.length; i++) {
      const categoryIds = productWithCategory
        .filter(
          (product) =>
            product.product_id.toString() == products[i]._id.toString()
        )
        .map((product) => product.category_id);

      const categories = await Category.find({ _id: { $in: categoryIds } });
      products[i].categories = categories;
    }
    if (products.length === 0) {
      return res.status(404).json({
        status: false,
        message: "No records found",
        total: products.length,
        data: products,
      });
    }
    GetFeaturedProducts;
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

const GetBestSellerProducts = async (req, res) => {
  try {
    let products = await Product.find({ is_best_seller: true }).lean();
    const productWithCategory = await ProductCategoryRelation.find();
    for (let i = 0; i < products.length; i++) {
      const categoryIds = productWithCategory
        .filter(
          (product) =>
            product.product_id.toString() == products[i]._id.toString()
        )
        .map((product) => product.category_id);

      const categories = await Category.find({ _id: { $in: categoryIds } });
      products[i].categories = categories;
    }
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

const UploadProductGallery = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        status: false,
        message: "No product found",
      });
    }
    if (!req.files) {
      return res.status(400).json({
        status: false,
        message: "No images found",
      });
    }

    await RemoveFiles(product.images);

    const images = req.files?.map(
      (file) => process.env.BASE_URL + process.env.PORT + "/" + file.path
    );

    product.images = images;
    const result = await product.save();
    if (result) {
      return res.json({
        status: true,
        message: "Images Uploaded successfully",
        data: result,
      });
    }
    return res.status(400).json({
      status: false,
      message: "Images Upload failed",
      data: result,
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
  GetFeaturedProducts,
  GetNewArrivalProducts,
  GetBestSellerProducts,
  UploadProductGallery,
};
