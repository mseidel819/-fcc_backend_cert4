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
    let user = await User.findById(req.params.id);
    const { username, _id } = user;

    const exercise = await req.body;
    const { description, duration } = exercise;
    let { date } = exercise;
    const formattedExercise = {
      description,
      duration,
    };

    if (!date) {
      // const newDate = new Date().toDateString();
      const newDate = new Date().toISOString().split("T")[0];
      date = newDate;
      formattedExercise.date = newDate;
    } else formattedExercise.date = exercise.date;
    user.log.push(formattedExercise);
    user.count = user.log.length;
    user.save();
    console.log(typeof date);
    res.status(200).json({
      username,
      description,
      duration,
      date,
      _id,
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

    let selected = await User.findById(req.params.id).select({
      log: { _id: 0 },
    });

    let endDate = new Date().getTime();
    let startDate = 0;
    if (req.query.to) {
      endDate = new Date(req.query.to).getTime();
    }
    if (req.query.from) {
      startDate = new Date(req.query.from).getTime();
    }

    const queriedLog = selected.log.filter((entry, i) => {
      if (req.query.limit && i + 1 > req.query.limit) return;
      const entryDate = new Date(entry.date).getTime();
      console.log(typeof entry.date);
      return entryDate >= startDate && entryDate <= endDate;
    });

    res.status(200).json({
      username,
      count: queriedLog.length,
      _id,
      log: queriedLog,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: "could not get logs",
    });
  }
};
