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
    const { username, _id } = newUser;
    res.status(201).json({ username, _id });
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

exports.addExercise = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    let user1 = await User.findById(req.params.id).select({
      username: 1,
    });
    const exercise = await req.body;
    const formattedExercise = {
      description: exercise.description,
      duration: exercise.duration,
    };

    const { date } = exercise;
    if (!date) {
      const newDate = new Date().toDateString();
      exercise.date = newDate;
      formattedExercise.date = newDate;
    } else formattedExercise.date = exercise.date;

    user.log.push(formattedExercise);
    user.count = user.log.length;
    user.save();

    res.status(200).json({
      username: user1._doc.username,
      ...formattedExercise,
      _id: user1._doc._id,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: "could not add exercise",
    });
  }
};

exports.getLog = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { _id, username, log, count } = user;

    res.status(200).json({
      username,
      count,
      _id,
      log,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: "could not get logs",
    });
  }
};
