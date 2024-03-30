const { UserInRole } = require("../models/user-in-role");

const DetachRole = async (user) => {
  try {
    const userRoles = await UserInRole.findOneAndDelete({ user_id: user._id });
  } catch (error) {
    console.log(error);
  }
};

module.exports = DetachRole;
