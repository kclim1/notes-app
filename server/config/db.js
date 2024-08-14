const mongoose = require('mongoose')

const mongooseConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log(`connected to database `);
  } catch (error) {
    console.error(error);
    console.log("failed to connect");
  }
};

module.exports = mongooseConnect;
