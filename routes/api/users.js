const express = require("express");
const router = express.Router();

// @route           route get api/users
// @description     test route
// @access          public access
router.get("/", (req,res) => res.send("User route"));

module.exports = router;