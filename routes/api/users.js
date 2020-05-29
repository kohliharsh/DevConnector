const express = require("express");
const router = express.Router();
const gravatar = require("gravatar"); //requiring gravatar for making the avatar of our user
var bcrypt = require("bcryptjs"); //for the encrption of password
var jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");

//Loading Validation Files
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

//Load UserModel
const User = require("../../models/user");

//@route  Get api/users/test
//@desc   test users routes
//@access Public

router.get("/test", (req, res) => res.json("Users Worked"));

//@route  Post api/users/register
//@desc   Register User
//@access Public

router.post("/register", (req, res) => {
  //validating registration details
  const { error, isValid } = validateRegisterInput(req.body);
  if (!isValid) {
    return res.status(404).json({ error });
  }

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

//@route  Post api/users/login
//@desc   Email Password Login / Returning JWT Token
//@access Public

router.post("/login", (req, res) => {
  //validating login details
  const { error, isValid } = validateLoginInput(req.body);
  if (!isValid) {
    return res.status(404).json({ error });
  }
  const email = req.body.email;
  const password = req.body.password;

  //finding user
  User.findOne({ email }).then((user) => {
    if (!user) {
      error.email = "user not found";
      res.status(404).json({ error });
    }
    //check password
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        //User Matched
        const payload = { id: user.id, name: user.name, avatar: user.avatar }; //Creating JWT Payload read docs for more information
        //getting jwt token
        jwt.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: 3600 },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token,
            });
          }
        );
      } else {
        error.password = "Password incorrect";
        return res.status(400).json(error);
      }
    });
  });
});

//@route  Get api/users/current
//@desc   Returning current user
//@access Private

router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
    });
  }
);

module.exports = router;
