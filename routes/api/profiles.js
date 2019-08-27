const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const {check,validationResult}=require("express-validator");
const Profile = require("../../models/Profile");
const User = require("../../models/User");

// @route           route get api/profiles/me
// @description     get current users profile
// @access          private access

router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      "user",
      ["name", "avatar"]
    );
    if (!profile) {
      return res.status(500).json({ msg: "There is no profile for this user" });
    }
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).json("Server error");
  }
});


// @route           route post api/profiles
// @description     create or update user profile
// @access          private access

router.post("/", [auth,[check("status", "Status is required").not().isEmpty(),check('skills',"Skills are required").not().isEmpty()]], async (req,res) =>{
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json({errors: errors.array()})
  }
});



module.exports = router;
