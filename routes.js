const express = require("express");
const app = express();

const router = express.Router();
const {
  getUsers,
  getUser,
  createUser,
  addExercise,
  getLog,
  deleteFcc,
} = require("./user/user-controller");

// app.get("/", (req, res) => {
//   res.sendFile(__dirname + "/views/index.html");
// });

router.route("/").get((req, res) => {
  res.sendFile(`${__dirname}/views/index.html`);
});

router.route("/api/users").get(getUsers).post(createUser).delete(deleteFcc);
router.route("/api/users/:id").get(getUser);
router.route("/api/users/:id/exercises").post(addExercise);

router.route("/api/users/:id/logs").get(getLog);

module.exports = router;
