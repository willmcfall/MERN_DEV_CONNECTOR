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

  const {
    company,
    website,
    location,
    bio,
    status,
    githubusername,
    skills,
    youtube,
    facebook,
    twitter,
    instagram,
    linkedin
  } = req.body

  // build profile object
  const profileFields = {};
  profileFields.user = req.user.id;
  if(company) profileFields.company = company;
  if(website) profileFields.website = website;
  if(location) profileFields.location = location;
  if(bio) profileFields.bio = bio;
  if(status) profileFields.status = status;
  if(githubusername) profileFields.githubusername = githubusername;
  if(skills){
    profileFields.skills = skills.split(',').map(skills => skills.trim())
  }

  // build social object
  profileFields.social ={}
    if(youtube) profileFields.social.youtube = youtube;
    if(facebook) profileFields.social.facebook = facebook;
    if(twitter) profileFields.social.twitter = twitter;
    if(instagram) profileFields.social.instagram = instagram;
    if(linkedin) profileFields.social.linkedin = linkedin;
  ;

 try{
  let profile = await Profile.findOne({user:req.user.id})
  if(profile){
    // update
    profile = await Profile.findOneAndUpdate({user:req.user.id},{$set: profileFields},{new:true})

    return res.json(profile);

  }

  profile = new Profile(profileFields);

  await profile.save();

  return res.json(profile);

 } catch(err){
  console.error(err.message);
  res.status(500).send('Server error')
 }
}
);



module.exports = router;
