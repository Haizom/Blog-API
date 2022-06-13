const router = require("express").Router();
const User = require("../models/User");
const Post = require("../models/Post");
const bcrypt = require("bcrypt");

// UPDATE user info
router.put("/:id", async (req, res) => {
    // we better use JWT here
    if (req.body.userId == req.params.id){

        if (req.body.password){
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password, salt)
        }
        try {
            const updatedUser = await User.findByIdAndUpdate(req.params.id, {
                // In MongoDB, the $set operator is used to replace the value of a field to the specified value.
                $set: req.body,
            }, {new:true});

            res.status(200).json(updatedUser)
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        res.status(401).json("You can only update your account!");
    }
    
});

// DELETE the user and their posts
router.delete("/:id", async (req, res) => {
    // we better use JWT here
    if (req.body.userId == req.params.id){
        try{
            const user = User.findById(req.params.id)
            try {
                await Post.deleteMany({username: user.username});
                await User.findByIdAndDelete(req.params.id);
                res.status(200).json("User has been deleted...")
            } catch (err) {
                res.status(500).json(err);
            }
        } catch {
            res.status(404).json("User not found");
        }
    } else {
        res.status(401).json("You can only delete your account!");
    }
});


// get user 
router.get("/:id", async (req, res) => {
    
        try{
            const user = await User.findById(req.params.id)
            const {password, ...others} = await user._doc
            res.status(200).json(others)
        } catch(err) {
            res.status(500).json(err);
        }
});

module.exports = router;

