const mongoose = require("mongoose");
const connectMongoDB = async (url) => {
  // return mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
  return mongoose.connect(url);
};

module.exports = connectMongoDB;
