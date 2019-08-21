const express = require("express");
const router = express.Router();
const {check, validationResult} = require("express-validator");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");

// @route           route post api/users
// @description     register user
// @access          public access
router.post("/", [
    check("name", "Please include valid name").not().isEmpty(),
    check("email","Please include valid email address").isEmail(),
    check("password","Please include password of at least 6 characters").isLength({min:6}),
], async (req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    const {name , email, password} = req.body;

    try{

    let user = await User.findOne({email});
    // See if user already exists

    if (user){
        return res.status(400).json({errors:[{msg:"User already exists"}]})
    }
    // Get user gravatar

    const avatar = gravatar.url(email,{
        s: "200",
        r: "pg",
        d: "mm"
    });


    user = new User({
        name,
        email,
        avatar,
        password
    });

    // Encrypt password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password,salt);

    await user.save()

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