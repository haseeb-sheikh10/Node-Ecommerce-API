const { Role } = require("../models/role");
const { UserInRole } = require("../models/user-in-role");
const DetachRole = require("./DetachRole");

const UpdateRoles = async (user, role_ids) => {
  try {
    if (role_ids.length == 0) return;
    await DetachRole(user);
    for (let i = 0; i < role_ids.length; i++) {
      const role = await Role.findById(role_ids[i]);
      if (!role) {
        return { status: false, message: `Role not found at index ${i + 1}` };
      }
      const userInRole = new UserInRole({
        user_id: user._id,
        role_id: role._id,
      });
      await userInRole.save();
    }
  } catch (error) {
    console.error(error);
  }
};

module.exports = UpdateRoles;
