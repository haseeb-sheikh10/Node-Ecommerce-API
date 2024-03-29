const Joi = require("joi");
const { User } = require("../models/user");
const AttachRole = require("../utils/AttachRole");
const DetachRole = require("../utils/DetachRole");
const UpdateRoles = require("../utils/UpdateRoles");
const bcrypt = require("bcryptjs");
const { UserInRole } = require("../models/user-in-role");

const useValidation = (user) => {
  const schema = Joi.object({
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    phone_number: Joi.string().allow(null).optional(),
    address: Joi.string().allow(null).optional(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    role_ids: Joi.array().items(Joi.string()),
  });
  return schema.validate(user);
};

const GetAllUsers = async (req, res) => {
  try {
    const users = await User.find().lean();
    if (!users) {
      return res.status(404).json({
        status: false,
        total: users.length,
        message: "No users found",
        data: [],
      });
    }
    for (let user of users) {
      const userInRoles = await UserInRole.find({ user_id: user._id }).populate(
        "role_id"
      );
      user.roles = userInRoles.map((u) => u.role_id);
    }
    res.status(200).json({
      status: true,
      total: users.length,
      message: "Users Found",
      data: users,
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const GetUserById = async (req, res) => {
  try {
    let user = await User.findById(req.params.id).lean();
    if (!user) {
      return res.status(404).json({
        status: false,
        total: user?.length ?? 0,
        message: "User not found",
        data: null,
      });
    }
    const userInRoles = await UserInRole.find({
      user_id: user?._id,
    }).populate("role_id");

    user.roles = userInRoles.map((u) => u.role_id);
    res.status(200).json({
      status: true,
      total: 1,
      message: "User Found",
      data: user,
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const CreateUser = async (req, res) => {
  try {
    const { error } = useValidation(req.body);
    if (error) {
      return res
        .status(400)
        .json({ status: false, message: error.details[0].message });
    }

    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res
        .status(400)
        .json({ status: false, message: "User already exist with this email" });
    }
    user = new User(req.body);
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);
    await user.save();
    await AttachRole(user._id, req.body.role_ids);

    res.status(201).json({ status: true, message: "User created", data: user });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const UpdateUser = async (req, res) => {
  try {
    const { error } = useValidation(req.body);
    if (error) {
      return res
        .status(400)
        .json({ status: false, message: error.details[0].message });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);
    user.first_name = req.body.first_name;
    user.last_name = req.body.last_name;
    user.phone_number = req.body.phone_number ?? null;
    user.address = req.body.address ?? null;
    user.email = req.body.email;
    await user.save();

    await UpdateRoles(user, req.body.role_ids);
    res.status(200).json({ status: true, message: "User updated", data: user });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const DeleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }
    await DetachRole(user);
    res.status(200).json({ status: true, message: "User deleted", data: user });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const UpdateUserRoles = async (req, res) => {
  try {
    const schema = Joi.object({
      user_id: Joi.string().required(),
      role_ids: Joi.array().items(Joi.string().required()).required(),
    });
    const { error } = schema.validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({ status: false, message: error.details[0].message });
    }
    const user = await User.findById(req.body.user_id);
    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }
    await UpdateRoles(user, req.body.role_ids);
    res.status(200).json({ status: true, message: "User roles updated" });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

module.exports = {
  GetAllUsers,
  GetUserById,
  CreateUser,
  UpdateUser,
  DeleteUser,
  UpdateUserRoles,
};
