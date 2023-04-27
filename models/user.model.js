const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: String,
    image: String,
    bio: String,
    phone: Number,
    email: String,
    password: String,
  },
  {
    versionKey: false,
  }
);

const Usermodel = mongoose.model("user", userSchema);

module.exports = {
  Usermodel,
};
