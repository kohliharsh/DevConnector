const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const passportjwt = require("passport-jwt");

const users = require("./routes/api/users");
const posts = require("./routes/api/posts");
const profile = require("./routes/api/profile");

const app = express();

//middleware bodyPArser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//db URI
const db = require("./config/keys").mongoURI;

//connecting to mongoatlas
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log("connected"))
  .catch((err) => console.log(err));

//passport middleware
app.use(passport.initialize());

//passport config
require("./config/passport")(passport);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

//Using Routes
app.use("/api/users", users);
app.use("/api/posts", posts);
app.use("/api/profile", profile);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("server running at " + port));
