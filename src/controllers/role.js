const { Role, validate } = require("../models/role");

const GetAllRoles = async (req, res) => {
  try {
    const roles = await Role.find();
    if (!roles) {
      return res.status(404).json({ status: false, message: "No roles found" });
    }
    res.status(200).json({ status: true, message: "All roles", data: roles });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const GetRoleById = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);
    if (!role) {
      return res.status(404).json({ status: false, message: "Role not found" });
    }
    res.status(200).json({ status: true, message: "Role Found", data: role });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const CreateRole = async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({ status: false, message: error.details[0].message });
    }
    let role = Role.findOne({ role_name: req.body.role_name });
    if (role) {
      return res.status(400).json({
        status: false,
        message: "Role already exists",
      });
    }
    role = new Role({
      role_name: req.body.role_name,
      permissions: req.body.permissions,
    });
    await role.save();
    res.status(201).json({ status: true, message: "Role created", data: role });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const UpdateRole = async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({ status: false, message: error.details[0].message });
    }
    const role = await Role.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!role) {
      return res.status(404).json({ status: false, message: "Role not found" });
    }
    res.status(200).json({ status: true, message: "Role updated", data: role });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const DeleteRole = async (req, res) => {
  try {
    const role = await Role.findByIdAndDelete(req.params.id);
    if (!role) {
      return res.status(404).json({ status: false, message: "Role not found" });
    }
    res.status(200).json({ status: true, message: "Role deleted" });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

module.exports = {
  GetAllRoles,
  GetRoleById,
  CreateRole,
  UpdateRole,
  DeleteRole,
};
