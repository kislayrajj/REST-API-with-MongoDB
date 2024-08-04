const mongoose = require('mongoose');


// database schema
const userSchema = new mongoose.Schema(
    {
      firstName: {
        type: String,
        required: true,
      },
      lastName: {
        type: String,
      },
      email: {
        type: String,
        required: true,
        unique: true,
        // match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
      },
      gender: {
        type: String,
        // required: true,
        // enum: ["Male", "Female", "Other"] // can only be Male, Female or Other
      },
      jobTitle: {
        type: String,
      },
    },
    { timestamps: true }
  );
  
  const User = mongoose.model("user", userSchema); 

  module.exports=  User;