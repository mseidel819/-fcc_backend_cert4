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
    if (!req.body.description || !req.body.duration)
      throw new Error("duration and description are required fields");

    let user = await User.findById(req.params.id);
    const { username, _id } = user;

    const exercise = req.body;

    const { description, duration } = exercise;
    let { date } = exercise;

    const formattedExercise = {
      description,
      duration: +duration,
      date: new Date().toDateString(),
    };

    if (date) {
      date = new Date(date + "T06:00:00.000Z").toDateString();
      formattedExercise.date = date;
    }

    user.log.push(formattedExercise);
    user.count = user.log.length;
    // console.log(user.count);
    user.save();

    // console.log(req.body.date);
    // console.log(formattedExercise.date);

    res.status(200).json({
      username,
      description,
      duration: +duration,
      date: formattedExercise.date,
      _id: _id.toString(),
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.getLog = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select({
      log: { _id: 0 },
    });
    const { _id, username } = user;

    let endDate = req.query.to
      ? new Date(req.query.to + "T05:00:00.000Z").getTime()
      : new Date().getTime();

    let startDate = req.query.from ? new Date(req.query.from).getTime() : 0;
    let limiter = req.query.limit ?? user.log.length;

    let queriedLog = user.log.filter((entry, i) => {
      const entryDate = new Date(entry.date).getTime();

      return entryDate >= startDate && entryDate <= endDate;
    });

    const limitedLog = queriedLog.filter((item, i) => {
      return i < limiter;
    });

    res.status(200).json({
      username,
      count: limitedLog.length,
      _id,
      log: limitedLog,
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
  });
};
