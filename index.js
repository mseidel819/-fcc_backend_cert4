const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
require("dotenv").config({ path: "./config.env" });
const mongoose = require("mongoose");
const userRouter = require("./user-routes");

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
  })
  .then(() => console.log("DB connection successful!"));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
// app.use(bodyParser.json());
app.use(cors());

app.use(express.static(`${__dirname}/public`));

app.use("/", userRouter);

// app.get("/", (req, res) => {
//   res.sendFile(__dirname + "/views/index.html");
// });

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
