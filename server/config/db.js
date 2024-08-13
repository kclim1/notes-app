const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: false,
    required: function () {
      return !this.googleId && !this.githubId;
    },
    trim: true,
  },
  password: {
    type: String,
    required: function () {
      return !this.googleId && !this.githubId;
    },
  },
  email: {
    type: String,
    required: false,
    unique: true,
  },
  loginTime: {
    type: Date,
    default: Date.now,
    required: false,
  },
  givenName: { type: String, required: false },
  familyName: { type: String, required: false },
  googleId: { type: String, required: false, unique: true },
  githubId: { type: String, required: false, unique: true },
  profileUrl: { type: String, required: false, unique: true },
});

const User = mongoose.model('User',UserSchema)
module.exports = User ;
const mongooseConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log(`connected to database: `);
  } catch (error) {
    console.error(error);
    console.log("failed to connect");
  }
};

module.exports = mongooseConnect;
