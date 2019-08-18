const express = require("express");
const router = express.Router();
const {check, validationResult} = require("express-validator/check");

// @route           route post api/users
// @description     register user
// @access          public access
router.post("/", (req,res) => {
    console.log(req.body)
    res.send("User route")
});

module.exports = router;