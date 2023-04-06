const mongoose = require("mongoose");

const userDataScheme = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  count: Number,
  log: [
    {
      description: {
        type: String,
        required: true,
      },
      duration: {
        type: Number,
        required: true,
      },
      date: String,
    },
  ],
});

const User = mongoose.model("user", userDataScheme);

module.exports = User;
