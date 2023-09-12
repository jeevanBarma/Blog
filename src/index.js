require("./Models/user");
require("./Models/blog");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const loginRoute = require("./Routes/loginRoute");
const blogRoute = require("./Routes/blogRoute");

const app = express();
app.use(
  cors({
    origin: "http://localhost:3004",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(bodyParser.json());
const authRequire = require("./Middleware/authRequire");
app.use(loginRoute);
app.use(blogRoute);
const mongoUri =
  "mongodb+srv://barmajeevan02:Jeevan02@cluster0.gri1jbq.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(mongoUri);

mongoose.connection.on("connected", () => {
  console.log("mongodb connected sucessfully");
});

mongoose.connection.on("error", (err) => {
  console.log("error connecting", err);
});

app.listen(3007, () => {
  console.log("server run http://localhost:3007");
});
