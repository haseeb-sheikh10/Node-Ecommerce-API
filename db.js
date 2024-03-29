const mongoose = require("mongoose");
const SetDefaultUser = require("./utils/SetDefaultUser");

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to database");
    await SetDefaultUser();
  } catch (error) {
    console.error("Error connecting to database");
    console.error(error);
  }
};

module.exports = connect;
