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

    const exercise = req.body;

    const { description, duration } = exercise;
    let { date } = exercise;
    const formattedExercise = {
      description,
      duration: +duration,
    };
    if (date) {
      date = new Date(date).toDateString();
    }
    if (!date) {
      const newDate = new Date().toDateString();
      date = newDate;
      formattedExercise.date = newDate;
    } else formattedExercise.date = date;
    user.log.push(formattedExercise);
    user.count = user.log.length;
    user.save();

    res.status(200).json({
      username,
      description,
      duration: +duration,
      date,
      _id: _id.toString(),
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
      return entryDate >= startDate && entryDate <= endDate;
    });
    // console.log({
    //   username,
    //   count: queriedLog.length,
    //   _id,
    //   log: queriedLog,
    // });

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

exports.deleteFcc = async (req, res) => {
  const deleted = await User.deleteMany({ username: /^fcc/ });

  res.status(204).json({
    status: "success",
    data: null,
  });
};
