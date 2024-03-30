const { Role } = require("../models/role");
const { User } = require("../models/user");
const bcrypt = require("bcryptjs");
const { UserInRole } = require("../models/user-in-role");

const SetDefaultUser = async () => {
  try {
    let user = await User.findOne({ email: "john@doe.com" });
    if (user) {
      console.log("default user in database");
      return;
    }
    user = new User({
      first_name: "John",
      last_name: "Doe",
      email: "john@doe.com",
      phone_number: null,
      address: null,
    });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash("password", salt);
    await user.save();

    let role = await Role.findOne({ role_name: "Administrator" });
    if (!role) {
      role = new Role({
        role_name: "Administrator",
        permissions: {
          add: true,
          edit: true,
          delete: true,
          view: true,
        },
      });
      await role.save();
    }

    const userRole = new UserInRole({
      user_id: user._id,
      role_id: role._id,
    });
    await userRole.save();
    console.log("Default user created");
  } catch (error) {
    console.error(error);
  }
};

module.exports = SetDefaultUser;
