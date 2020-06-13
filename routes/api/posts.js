const express = require("express");
const router = express.Router();
const passport = require("passport");
const mongoose = require("mongoose");

//connecting to post model
const Post = require("../../models/posts");

//connecting to profile model
const Profile = require("../../models/profiles");

//loading posts validation files

const validatePostInput = require("../../validation/posts");

//@route  Get api/posts/test
//@desc   test posts routes
//@access Public

router.get("/test", (req, res) => res.json("Posts Worked"));

//@route  Get api/posts/
//@desc   get all posts
//@access public

router.get("/", (req, res) => {
  Post.find()
    .sort({ date: -1 })
    .then((post) => res.json(post))
    .catch((err) => res.status(404).json(err));
});

//@route  Get api/posts/:id
//@desc   get posts by id
//@access public

router.get("/:id", (req, res) => {
  Post.findById(req.params.id)
    .then((post) => res.json(post))
    .catch((err) =>
      res.status(404).json({ nopost: "No posts are found on this id" })
    );
});

//@route  Post api/posts/
//@desc   Create posts routes
//@access Private

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { error, isValid } = validatePostInput(req.body);

    if (!isValid) {
      return res.status(404).json(error);
    }
    const newPost = new Post({
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar,
      user: req.user.id,
    });

    newPost.save().then((post) => res.json(post));
  }
);

//@route  delete api/posts/:id
//@desc   Delete posts
//@access Private

router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then((profile) => {
      if (profile) {
        Post.findById(req.params.id)
          .then((post) => {
            //Check for post owner
            if (post.user !== req.user.id) {
              res.status(401).json({ error: "user not authorized" });
            }

            //Deleting post
            post.remove().then(() => res.json({ success: "true" }));
          })
          .catch((err) =>
            res.status(404).json({ postnotfounf: "post not found" })
          );
      }
    });
  }
);

//@route  Post api/posts/like/:id
//@desc   Like posts
//@access Private

router.post(
  "/like/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then((profile) => {
      if (profile) {
        Post.findById(req.params.id)
          .then((post) => {
            if (
              post.likes.filter((like) => like.user.toString() === req.user.id)
                .length > 0
            ) {
              return res
                .status(400)
                .json({ alreadyliked: "post already liked by this user" });
            }
            post.likes.unshift({ user: req.user.id });
            post.save().then((post) => res.json(post));
          })
          .catch((err) =>
            res.status(404).json({ postnotfounf: "post not found" })
          );
      }
    });
  }
);

//@route  Post api/posts/unlike/:id
//@desc   unlike posts
//@access Private

router.post(
  "/unlike/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then((profile) => {
      if (profile) {
        Post.findById(req.params.id)
          .then((post) => {
            if (
              post.likes.filter((like) => like.user.toString() === req.user.id)
                .length === 0
            ) {
              return res
                .status(400)
                .json({ notliked: "the post is not yet liked by this user" });
            }
            //get remove index
            const removeIndex = post.likes
              .map((item) => item.user.toString())
              .indexOf(req.user.id);

            post.likes.splice(removeIndex, 1);
            post.save().then((post) => res.json(post));
          })
          .catch((err) =>
            res.status(404).json({ postnotfounf: "post not found" })
          );
      }
    });
  }
);

//@route  Post api/posts/comment/:id
//@desc   comment to a  posts
//@access Private

router.post(
  "/comment/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { error, isValid } = validatePostInput(req.body);

    if (!isValid) {
      return res.status(404).json(error);
    }
    Post.findById(req.params.id)
      .then((post) => {
        const newComment = {
          text: req.body.text,
          name: req.body.name,
          avatar: req.body.avatar,
          user: req.user.id,
        };
        //add to comment array
        post.comments.unshift(newComment);
        //saving comment
        post.save().then((post) => res.json(post));
      })
      .catch((err) => res.status(404).json(err));
  }
);

//@route  delete api/posts/comment/:id/:comment_id
//@desc   delete comment to a post
//@access Private

router.delete(
  "/comment/:id/:comment_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.findById(req.params.id)
      .then((post) => {
        // Check to see if comment exists
        if (
          post.comments.filter(
            (comment) => comment._id.toString() === req.params.comment_id
          ).length === 0
        ) {
          return res
            .status(404)
            .json({ commentnotexists: "Comment does not exist" });
        }

        // Get remove index
        const removeIndex = post.comments
          .map((item) => item._id.toString())
          .indexOf(req.params.comment_id);

        // Splice comment out of array
        post.comments.splice(removeIndex, 1);

        post.save().then((post) => res.json(post));
      })
      .catch((err) => res.status(404).json({ postnotfound: "No post found" }));
  }
);

module.exports = router;
