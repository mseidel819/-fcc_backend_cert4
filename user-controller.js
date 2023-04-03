const User = require("./user-model");

exports.getUsers = async (req, res) => {
  try {
    users = await User.find().select({
      username: 1,
    });

    res.status(200).json(users);
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: "couldnt get all users",
    });
  }
};

exports.getUser = async (req, res) => {
  try {
    let user = await User.findById(req.params.id).select({
      username: 1,
    });

    // if (!user) throw new Error("could not find this id");

    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: "couldnt find this user",
    });
  }
};

exports.createUser = async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    res.status(201).json({ username: newUser.username, _id: newUser._id });
  } catch (err) {
    let errMsg = "couldnt create user";
    if (err.code === 11000) {
      errMsg = `username ${err.keyValue.username} already exists. please try another.`;
    }
    res.status(400).json({
      status: "fail",
      message: errMsg,
    });
  }
};
