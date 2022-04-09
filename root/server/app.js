var express = require("express");
var path = require("path");
var logger = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

var indexRouter = require("./routes/index");
var topicsRouter = require("./routes/topics");

const mongoDb = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/notedb";
mongoose.connect(mongoDb);
mongoose.Promise = Promise;
const db = mongoose.connection;

db.on("error", console.error.bind(console, "mongoDb connection failed"));

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/topics", topicsRouter);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.resolve("..", "client", "build", "index.html")));
  app.get("*", (req, res) =>
    res.sendFile(path.resolve("..", "client", "build", "index.html"))
  );
} else if (process.env.NODE_ENV === "development") {
  var corsOptions = {
    origin: "http://localhost:3000",
    optionsSuccessStatus: 200,
  };
  console.log("running in dev");
  app.use(cors(corsOptions));
}

module.exports = app;
