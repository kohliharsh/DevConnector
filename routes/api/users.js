const express = require("express");
const router = express.Router();
const gravatar = require("gravatar"); //requiring gravatar for making the avatar of our user
var bcrypt = require("bcryptjs"); //for the encrption of password

//Load UserModel
const User = require("../../models/user");

//@route  Get api/users/test
//@desc   test users routes
//@access Public

router.get("/test", (req, res) => res.json("Users Worked"));

//@route  Get api/users/register
//@desc   Register User
//@access Public

router.post("/register", (req, res) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (user) {
        return res.status(400).json({ email: "Email exists!" });
      } else {
        const avatar = gravatar.url(req.body.email, {
          s: "200",
          r: "pg",
          d: "404",
        });
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
          //read gravatar documentation for the usage
          avatar,
        });
        bcrypt.genSalt(10, function (err, salt) {
          bcrypt.hash(newUser.password, salt, function (err, hash) {
            if (err) {
              throw err;
            } else {
              newUser.password = hash;
              newUser
                .save()
                .then((user) => {
                  res.json({ user });
                })
                .catch((err) => console.log(err));
            }
          });
        });
      }
    })
    .catch((err) => {});
});

module.exports = router;
