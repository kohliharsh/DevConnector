const express = require("express");
const app = express();
const mongoose = require("mongoose");
const users = require("./routes/api/users");
const posts = require("./routes/api/posts");
const profile = require("./routes/api/profile");
//db URI
const db = require("./config/keys").mongoURI;

//connecting to mongoatlas
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("connected"));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

//Using Routes
app.use("/api/users", users);
app.use("/api/posts", posts);
app.use("/api/profile", profile);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("server running at " + port));
