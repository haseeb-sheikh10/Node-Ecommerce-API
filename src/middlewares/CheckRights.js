const { Role } = require("../models/role");
const { UserInRole } = require("../models/user-in-role");

const CheckAddRights = async (req, res, next) => {
  const userRoles = await UserInRole.find({ user_id: req.user._id });
  for (let i = 0; i < userRoles.length; i++) {
    const role = await Role.findById(userRoles[i].role_id);
    if (role.permissions.add) {
      return next();
    }
  }
  return res.status(403).json({
    status: false,
    message: "Permsssion Denied! You are not allowed to perform this operation",
  });
};

const CheckEditRights = async (req, res, next) => {
  const userRoles = await UserInRole.find({ user_id: req.user._id });
  for (let i = 0; i < userRoles.length; i++) {
    const role = await Role.findById(userRoles[i].role_id);
    if (role.permissions.edit) {
      return next();
    }
  }
  return res.status(403).json({
    status: false,
    message: "Permsssion Denied! You are not allowed to perform this operation",
  });
};

const CheckDeleteRights = async (req, res, next) => {
  const userRoles = await UserInRole.find({ user_id: req.user._id });
  for (let i = 0; i < userRoles.length; i++) {
    const role = await Role.findById(userRoles[i].role_id);
    if (role.permissions.delete) {
      return next();
    }
  }
  return res.status(403).json({
    status: false,
    message: "Permsssion Denied! You are not allowed to perform this operation",
  });
};

const CheckViewRights = async (req, res, next) => {
  const userRoles = await UserInRole.find({ user_id: req.user._id });
  for (let i = 0; i < userRoles.length; i++) {
    const role = await Role.findById(userRoles[i].role_id);
    if (role.permissions.view) {
      return next();
    }
  }
  return res.status(403).json({
    status: false,
    message: "Permsssion Denied! You are not allowed to perform this operation",
  });
};

module.exports = {
  CheckAddRights,
  CheckEditRights,
  CheckDeleteRights,
  CheckViewRights,
};
