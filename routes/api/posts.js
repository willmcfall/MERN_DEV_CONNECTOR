const express = require("express");
const router = express.Router();

// @route           route get api/posts
// @description     test route
// @access          public access
router.get("/", (req,res) => res.send("Posts route"));

module.exports = router;