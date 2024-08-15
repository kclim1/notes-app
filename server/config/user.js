const mongoose = require("mongoose");
// mongoose.set("strictQuery", false);

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: false,
    required: false,
    trim: true,
  },
  password: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: false,
    unique: false,
  },
  loginTime: {
    type: Date,
    default: Date.now,
    required: false,
  },
  dateCreated: {
    type: Date,
    default: Date.now,
    required: false,
  },
  givenName: { type: String, required: false },
  familyName: { type: String, required: false },
});

const User = mongoose.model("User", UserSchema);
module.exports = User;