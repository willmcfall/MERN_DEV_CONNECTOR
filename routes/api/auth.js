const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const User = require("../../models/User");
const config = require("config");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const {check, validationResult} = require("express-validator");

// @route           route get api/auth
// @description     test route
// @access          public access
router.get("/", auth, async (req,res) => {
try{
    const user = await User.findById(req.user.id).select("-password")
    res.json(user);
}
catch(err){
 console.error(err.message);
 res.status(500).send("Server error");
}
});



// @route           route post api/auth
// @description     authenticate user and get token
// @access          public access
router.post("/", [
    check("email","Please include valid email address").isEmail(),
    check("password","Please required").exists(),
], async (req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    const {email, password} = req.body;

    try{

    let user = await User.findOne({email});
    // See if user already exists

    if (!user){
        return res.status(400).json({errors:[{msg:"Invalid credentials"}]})
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        return res.status(400).json({errors:[{msg:"Invalid credentials"}]})
    }

    const payload = {
        user: {
            id: user.id
        }
    };

    jwt.sign(payload, config.get('jwtSecret'),{expiresIn:3600}, (err,token) => {
        if(err) throw err;
        res.json({token});
    });

    }
    catch (err){
        console.error(err.message);
        res.status(500).send("Server error");
    }

});

module.exports = router;