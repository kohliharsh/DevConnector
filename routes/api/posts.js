const express = require("express");
const router = express.Router();

//@route  Get api/posts/test
//@desc   test posts routes
//@access Public

router.get("/test", (req, res) => res.json("Posts Worked"));

module.exports = router;
