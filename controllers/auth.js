const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User, validate } = require("../models/user");
const Joi = require("joi");
const UserToken = require("../models/user-token");
const sendEmail = require("../utils/sendEmail");
const { SyncCarts } = require("../utils/SyncCarts");
const AttachRole = require("../utils/AttachRole");

const Login = async (req, res) => {
  try {
    const validate = (user) => {
      const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
      });
      return schema.validate(user);
    };
    const { error } = validate(req.body);
    if (error)
      return res
        .status(400)
        .json({ status: false, message: error.details[0].message });

    // Check if user exists
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(404)
        .json({ status: false, message: "User does not exist" });
    }

    // Validate password
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET
    );

    const isLogin = await UserToken.findOne({ user_id: user._id });
    if (isLogin) {
      return res
        .status(400)
        .json({ status: false, message: "User is already logged in" });
    }

    const userToken = new UserToken({
      user_id: user._id,
      token,
    });
    await userToken.save();

    await SyncCarts(user, req.query.cart_id, true);

    res.json({
      status: true,
      message: "User logged in successfully",
      token: userToken.token,
      data: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const Register = async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error)
      return res
        .status(400)
        .json({ status: false, message: error.details[0].message });

    // Check if user exists
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      return res
        .status(400)
        .json({ status: false, message: "User already exists" });
    }

    const newUser = new User(req.body);

    // Create salt & hash
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(req.body.password, salt);
    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, email: newUser.email },
      process.env.JWT_SECRET
    );

    const userToken = new UserToken({
      user_id: newUser._id,
      token,
    });
    await userToken.save();

    await SyncCarts(newUser, req.query.cart_id, true);

    await AttachRole(newUser);

    res.json({
      status: true,
      message: "User registered successfully",
      token: userToken.token,
      data: newUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const Logout = async (req, res) => {
  try {
    const userToken = await UserToken.findOne({
      user_id: req.user._id,
    });
    if (!userToken) {
      return res
        .status(400)
        .json({ status: false, message: "User is not logged in" });
    }

    await userToken.deleteOne({ user_id: req.user._id });

    await SyncCarts(req.user, req.query.cart_id, false);

    res.json({ status: true, message: "User logged out successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const ForgotPassword = async (req, res) => {
  try {
    const schema = Joi.object({
      email: Joi.string().email().required(),
    });
    const { error } = schema.validate(req.body);
    if (error)
      return res
        .status(400)
        .json({ status: false, message: error.details[0].message });
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(404)
        .json({ status: false, message: "User does not exist" });
    }
    let userToken = await UserToken.findOne({ user_id: user._id });
    if (!userToken) {
      const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET
      );
      userToken = await new UserToken({
        user_id: user._id,
        token: token,
      }).save();
    }

    const link = `${process.env.BASE_URL}${process.env.PORT}/api/auth/reset-password/${user._id}/${userToken.token}`;
    await sendEmail(user.email, "Password Reset", link);
    return res.json({
      status: true,
      message: "Password reset link sent. Please Check.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const ResetPassword = async (req, res) => {
  try {
    const schema = Joi.object({
      new_password: Joi.string().required(),
      confirm_password: Joi.string().required().valid(Joi.ref("new_password")),
    });
    const { error } = schema.validate(req.body);
    if (error)
      return res
        .status(400)
        .json({ status: false, message: error.details[0].message });

    const user = await User.findById(req.params.user_id);
    if (!user)
      return res
        .status(400)
        .json({ status: false, message: "invalid link or expired" });

    const token = await UserToken.findOne({
      user_id: user._id,
      token: req.params.token,
    });
    if (!token)
      return res
        .status(400)
        .json({ status: false, message: "invalid link or expired" });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.new_password, salt);
    await user.save();
    await token.deleteOne({ user_id: user._id });

    return res.json({ status: true, message: "Password reset successful" });
  } catch (error) {
    res.send("An error occured");
    console.log(error);
  }
};

module.exports = {
  Login,
  Register,
  Logout,
  ForgotPassword,
  ResetPassword,
};
