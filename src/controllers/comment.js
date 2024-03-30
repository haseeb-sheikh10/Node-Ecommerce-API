const { validate, Comment } = require("../models/comment");
const { Product } = require("../models/product");
const { User } = require("../models/user");

const GetCommentsByProduct = async (req, res) => {
  try {
    if (!req.query.product_id)
      return res.status(400).json({
        status: false,
        message: "product_id in query is required",
      });

    let comments = await Comment.find({
      product_id: req.query.product_id,
    }).lean();
    const users = await User.find();
    comments = comments.map((comment) => {
      const user = users.find((user) => user._id == comment.user_id);
      comment.user = user;
      return comment;
    });

    if (comments.length === 0) {
      return res.status(404).json({
        status: false,
        message: "No records found",
        total: comments.length,
        data: comments,
      });
    }
    return res.status(200).json({
      status: true,
      message: "Records found",
      total: comments.length,
      data: comments,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

const AddComment = async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error)
      return res
        .status(400)
        .json({ status: false, message: error.details[0].message });

    if (req.user._id != req.body.user_id) {
      return res.status(403).json({
        status: false,
        message: "You are not allowed to comment on behalf of other user",
      });
    }

    const product = await Product.findById(req.body.product_id);
    if (!product)
      return res.status(404).json({
        status: false,
        message: "Product does not exist",
      });

    let comment = new Comment(req.body);
    comment = await comment.save();
    return res.status(201).json({
      status: true,
      message: "Comment added successfully",
      data: comment,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

const UpdateComment = async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error)
      return res
        .status(400)
        .json({ status: false, message: error.details[0].message });

    if (req.user._id != req.body.user_id) {
      return res.status(403).json({
        status: false,
        message: "You are not allowed to update this comment",
      });
    }

    const product = await Product.findById(req.body.product_id);
    if (!product)
      return res.status(404).json({
        status: false,
        message: "Product does not exist",
      });

    const comment = await Comment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!comment)
      return res.status(404).json({
        status: false,
        message: "Comment does not exist",
      });
    return res.status(200).json({
      status: true,
      message: "Comment updated successfully",
      data: comment,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

const DeleteComment = async (req, res) => {
  try {
    if (!req.query.user_id)
      return res.status(400).json({
        status: false,
        message: "user_id in query is required",
      });

    if (req.user._id.toString() !== req.query.user_id.toString()) {
      return res.status(403).json({
        status: false,
        message: "You are not allowed to delete this comment",
      });
    }

    const comment = await Comment.findByIdAndDelete(req.params.id);
    if (!comment)
      return res.status(404).json({
        status: false,
        message: "Comment does not exist",
      });
    return res.status(200).json({
      status: true,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

module.exports = {
  GetCommentsByProduct,
  AddComment,
  UpdateComment,
  DeleteComment,
};
