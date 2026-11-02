const mongoose = require("mongoose");
const validator=require('validator');

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      unique: true,

    },

    lastName: {
      type: String,
    },

    email: {
      type: String,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email format" +value);
        }
      }
    },

    password: {
      type: String,
    },
    gender:{

      type: String,
      validate(value){
       if (!["male", "female", "other"].includes(value)){
          throw new Error("Gender must be male, female, or other");
        }
      }
    },
  },

  { timestamps: true },
);

module.exports = mongoose.model("User", UserSchema);
