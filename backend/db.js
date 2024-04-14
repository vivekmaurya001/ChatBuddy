const mongoose = require("mongoose");
require("dotenv").config();

const mongoURL = "mongodb://localhost:27017/mydb";

// const mongoURL = process.env.mongoURL;

mongoose.connect(mongoURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("connected", () => {
  console.log("connected to mongodb server");
});
db.on("disconnected", () => {
  console.log("disconnected to mongodb server");
});
db.on("error", (err) => {
  console.log("error while connnecting to mongodb", err);
});

module.exports = db;
