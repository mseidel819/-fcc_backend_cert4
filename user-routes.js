const express = require("express");
const router = express.Router();
const { getUsers, getUser, createUser } = require("./user-controller");

// app.get("/", (req, res) => {
//   res.sendFile(__dirname + "/views/index.html");
// });

router.route("/").get((req, res) => {
  res.sendFile(`${__dirname}/views/index.html`);
});

router.route("/api/users").get(getUsers).post(createUser);
router.route("/api/users/:id").get(getUser);

module.exports = router;
