const express = require("express");
const router = express.Router();

//@route  Get api/users/test
//@desc   test users routes
//@access Public

router.get("/test", (req, res) => res.json("Users Worked"));

module.exports = router;
