const mongoose = require("mongoose");

const userInRoleSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  role_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Role",
    required: true,
  },
});

const UserInRole = mongoose.model("UserInRole", userInRoleSchema);

module.exports = { UserInRole };
