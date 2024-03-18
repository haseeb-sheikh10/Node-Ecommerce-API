const { Category, validate } = require("../models/category");

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

    let category = new Category({
      name: req.body.name,
    });
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

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
      },
      { new: true }
    );
    if (!category)
      return res.status(404).json({
        status: false,
        message: "No category found",
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
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category)
      return res.status(404).json({
        status: false,
        message: "No category found",
      });
    return res.json({
      status: true,
      message: "Category deleted successfully",
      data: category,
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
