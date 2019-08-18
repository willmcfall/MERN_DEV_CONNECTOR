const express = require("express");
const router = express.Router();
const {check, validationResult} = require("express-validator");

// @route           route post api/users
// @description     register user
// @access          public access
router.post("/", [
    check("name", "Please include valid name").not().isEmpty(),
    check("email","Please include valid email address").isEmail(),
    check("password","Please include password of at least 6 characters").isLength({min:6}),
], (req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    console.log(req.body)
    res.send("User route")
});

module.exports = router;