const mongoose = require("mongoose");

const userDataScheme = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  //   count: Number,
  log: [
    {
      description: String,
      duration: Number,
      date: Date,
    },
  ],
});

const User = mongoose.model("user", userDataScheme);

module.exports = User;
