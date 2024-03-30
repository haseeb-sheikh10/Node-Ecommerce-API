const { Category, validate } = require("../models/category");
const ProductCategoryRelation = require("../models/product-category");
const RemoveFiles = require("../utils/RemoveFiles");

const GetCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    if (categories.length === 0)
      return res.status(404).json({
        status: false,
        message: "No categories found",
        total: categories.length,
        data: categories,
      });
    return res.status(404).json({
      status: false,
      message: "Categories found",
      total: categories.length,
      data: categories,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const GetCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category)
      return res.status(404).json({
        status: false,
        message: "No category found",
        data: category,
      });
    return res.json({
      status: true,
      message: "Category found",
      data: category,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const AddCategory = async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error)
      return res.status(400).json({
        status: false,
        message: error.details[0].message,
      });

    if (req.file)
      req.body.image = `${process.env.BASE_URL}${process.env.PORT}/${req.file.path}`;

    let category = new Category(req.body);
    category = await category.save();
    return res.json({
      status: true,
      message: "Category added successfully",
      data: category,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const UpdateCategory = async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error)
      return res.status(400).json({
        status: false,
        message: error.details[0].message,
      });

    let category = await Category.findById(req.params.id);
    if (!category)
      return res.status(404).json({
        status: false,
        message: "No category found",
      });

    if (req.file) {
      await RemoveFiles(category.image, true);
      req.body.image = `${process.env.BASE_URL}${process.env.PORT}/${req.file.path}`;
    }

    category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    return res.json({
      status: true,
      message: "Category updated successfully",
      data: category,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const DeleteCategory = async (req, res) => {
  try {
    const relation = await ProductCategoryRelation.findOne({
      category_id: req.params.id,
    });

    if (relation)
      return res.status(400).json({
        status: false,
        message: "Category is in use by a product",
      });

    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category)
      return res.status(404).json({
        status: false,
        message: "No category found",
      });
    await RemoveFiles(category.image, true);
    return res.json({
      status: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  GetCategories,
  GetCategoryById,
  AddCategory,
  UpdateCategory,
  DeleteCategory,
};
