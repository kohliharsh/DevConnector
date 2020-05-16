const express = require("express");
const router = express.Router();

//@route  Get api/profile/test
//@desc   test profile routes
//@access Public

router.get("/test", (req, res) => res.json("Profile Worked"));

module.exports = router;
