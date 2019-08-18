const express = require("express");
const router = express.Router();

// @route           route get api/profiles
// @description     test route
// @access          public access
router.get("/", (req,res) => res.send("Profiles route"));

module.exports = router;