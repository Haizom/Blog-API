const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

// REGISTER
router.post("/register", async (req, res) => {
    try {
        // hash password with bcrypt 
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt)

        // add new user
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
        });

        // save and response the added user
        const user = await newUser.save();
        res.status(200).json(user);
    } catch (err) {
    res.status(500).json(err);
    }
});

// LOGIN
router.post("/login", async (req, res) => {
    try {

        const user = await User.findOne({username: req.body.username})
        if (user){
            const validatePassword = await bcrypt.compare(req.body.password, user.password)
            if (validatePassword){
                const {password, ...others} = await user._doc;
                res.status(200).json(others);
            } else {
                res.status(400).json("wrong password!")
            }
        } else {
            res.status(400).json("wrong username!")
        }

        // // validate user
        // const user = await User.findOne({username: req.body.username})
        // !user && res.status(400).json("wrong username!")


        // const validatePassword = await bcrypt.compare(req.body.password, user.password)
        // !validatePassword && res.status(400).json("wrong password!")

        // // show everything but password
        // // const {password, ...others} = await user._doc;
        // res.status(200).json(others);

    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
