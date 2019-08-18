const express = require("express");
const router = express.Router();

// @route           route get api/auth
// @description     test route
// @access          public access
router.get("/", (req,res) => res.send("Auth route"));

module.exports = router;