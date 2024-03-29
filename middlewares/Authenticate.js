const jwt = require("jsonwebtoken");
const { User } = require("../models/user");
const UserToken = require("../models/user-token");

const Authenticate = async (req, res, next) => {
  try {
    let token = req.header("Authorization");
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    token = token.split(" ")[1];
    const user = jwt.verify(token, process.env.JWT_SECRET);
    const userExists = await User.findById(user.id);
    if (!userExists) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    const isLogin = await UserToken.findOne({ user_id: user.id });
    if (!isLogin) {
      return res
        .status(401)
        .json({ message: "Unauthorized: User is not logged in" });
    }

    if (isLogin.token !== token) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

    req.user = userExists;
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = Authenticate;
