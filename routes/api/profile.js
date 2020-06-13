const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

//Load Profile Model
const Profile = require("../../models/profiles");

//Load User Model
const User = require("../../models/user");

//Load Profile validator
const validateProfileInput = require("../../validation/profile");
const validateExperienceInput = require("../../validation/experience");
const validateEducationInput = require("../../validation/education");

//@route  Get api/profile/handle/:handle
//@desc   Get Profile by handle
//@access Public

router.get("/handle/:handle", (req, res) => {
  const error = {};

  Profile.findOne({ handle: req.params.handle })
    .populate("user", ["name", "gravatar"])
    .then((profile) => {
      if (!profile) {
        error.handle = "no handle found!";
        res.status(404).json(error);
      }
      res.json(profile);
    })
    .catch((err) => res.json(err));
});

//@route  Get api/profile/user/user_id
//@desc   Get Profile by handle
//@access Public

router.get("/user/:user_id", (req, res) => {
  const error = {};

  Profile.findOne({ user: req.params.user_id })
    .populate("user", ["name", "gravatar"])
    .then((profile) => {
      if (!profile) {
        error.handle = "no handle found!";
        res.status(404).json(error);
      }
      res.json(profile);
    })
    .catch((err) => res.json({ profile: "no profile found!" }));
});

//@route  Get api/profile/all
//@desc   Get profile aof all the users
//@access Public

router.get("/all", (req, res) => {
  const error = {};

  Profile.find()
    .populate("user", ["name", "gravatar"])
    .then((profiles) => {
      if (!profiles) {
        error.profiles = "no profiles found!";
        res.status(404).json(error);
      }
      res.json(profiles);
    })
    .catch((err) => res.status(404).json(err));
});

//@route  Get api/profile/me
//@desc   Get Current user profile
//@access Private

router.get(
  "/me",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};

    Profile.findOne({ user: req.user.id })
      .populate("user", ["name", "avatar"])
      .then((profile) => {
        if (!profile) {
          errors.noprofile = "Profile Not Find";
          return res.status(404).json(errors);
        }
        res.json({ profile });
      })
      .catch((err) => {
        console.error(err.message);
        errors.servererror = err.message;
        res.status(404).send("server error");
      });
  }
);

//@route  Post api/profile/
//@desc   Create and Update user profile
//@access Private

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    //validating profile inputs
    const { error, isValid } = validateProfileInput(req.body);
    if (!isValid) {
      res.status(404).json({ error });
    }

    //Get Profile fiels
    const profileFields = {};
    profileFields.user = req.user.id;
    if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.company) profileFields.company = req.body.company;
    if (req.body.website) profileFields.website = req.body.website;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.status) profileFields.status = req.body.status;
    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.githubusername)
      profileFields.githubusername = req.body.githubusername;
    //Skills- Split into an array

    if (typeof req.body.skills !== "undefined") {
      profileFields.skills = req.body.skills.split(",");
    }
    //Social
    profileFields.social = {};
    if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if (req.body.instagram) profileFields.social.instagram = req.body.instagram;
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter;

    Profile.findOne({ user: req.user.id }).then((profile) => {
      if (profile) {
        //Update
        Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        ).then((profile) => res.json(Profile));
      } else {
        //Create
        //Check if handle exists
        Profile.findOne({ handle: profileFields.handle }).then((profile) => {
          if (profile) {
            error.handle = "handle exists";
            res.status(404).json(error);
          } else {
            new Profile(profileFields)
              .save()
              .then((profile) => res.json(profile));
          }
        });
      }
    });
  }
);

//@route  Post api/profile/experience
//@desc   Add Experience of the user
//@access Private

router.post(
  "/experience",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { error, isValid } = validateExperienceInput(req.body);

    if (!isValid) {
      return res.status(404).json(error);
    }

    Profile.findOne({ user: req.user.id }).then((profile) => {
      if (profile) {
        const newexp = {
          title: req.body.title,
          company: req.body.company,
          from: req.body.from,
          to: req.body.to,
          description: req.body.description,
          current: req.body.current,
          location: req.body.location,
        };
        //Adding experience to profile
        profile.experience.unshift(newexp);
        profile.save();
        return res.json(profile);
      }
    });
  }
);

//@route  Post api/profile/education
//@desc   Add Education of the user
//@access Private

router.post(
  "/education",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { error, isValid } = validateEducationInput(req.body);

    if (!isValid) {
      return res.status(404).json(error);
    }

    Profile.findOne({ user: req.user.id }).then((profile) => {
      if (profile) {
        const newedu = {
          school: req.body.school,
          degree: req.body.degree,
          fieldofstudy: req.body.fieldofstudy,
          from: req.body.from,
          to: req.body.to,
          current: req.body.current,
          description: req.body.description,
        };

        //Adding experience to profile
        profile.education.unshift(newedu);
        profile.save();
        return res.json(profile);
      }
    });
  }
);

//@route  delete api/profile/education/:exp_id
//@desc   delete Education of the user
//@access Private

router.delete(
  "/experience/:exp_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then((profile) => {
        // Get remove index
        const removeIndex = profile.experience
          .map((item) => item.id)
          .indexOf(req.params.exp_id);

        // Splice out of array
        profile.experience.splice(removeIndex, 1);

        // Save
        profile.save().then((profile) => res.json(profile));
      })
      .catch((err) => res.status(404).json(err));
  }
);

// @route   DELETE api/profile/education/:edu_id
// @desc    Delete education from profile
// @access  Private
router.delete(
  "/education/:edu_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then((profile) => {
        // Get remove index
        const removeIndex = profile.education
          .map((item) => item.id)
          .indexOf(req.params.edu_id);

        // Splice out of array
        profile.education.splice(removeIndex, 1);

        // Save
        profile.save().then((profile) => res.json(profile));
      })
      .catch((err) => res.status(404).json(err));
  }
);

// @route   DELETE api/profile
// @desc    Delete user and profile
// @access  Private
router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOneAndRemove({ user: req.user.id }).then(() => {
      User.findOneAndRemove({ _id: req.user.id }).then(() =>
        res.json({ success: true })
      );
    });
  }
);

module.exports = router;
