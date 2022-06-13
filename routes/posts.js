const router = require("express").Router();
const User = require("../models/User");
const Post = require("../models/Post");
const bcrypt = require("bcrypt");

// CREATE POST
router.post("/", async (req, res) => {
        try {
            const newPost = await new Post(req.body)
            const savedPost = await newPost.save()
            res.status(200).json(savedPost)
        } catch (err) {
            res.status(500).json(err);
        }
});

// DELETE POST
router.delete("/:id", async (req, res) => {
    // we better use JWT here
    // if (req.body.postId == req.params.id){
        try{
            const post = await Post.findById(req.params.id)
            if (req.body.username == post.username){
                try {
                    await Post.findByIdAndDelete(req.params.id);
                    res.status(200).json("Post has been deleted...")
                } catch (err) {
                    res.status(500).json(err);
                }
            } else {
                    res.status(401).json("You can only delete your posts!");
                }
        } catch {
            res.status(500).json(err);
        }
});


// Update POST
router.put("/:id", async (req, res) => {
        try{
            const post = await Post.findById(req.params.id)
            if (req.body.username == post.username){
                try {
                    await Post.findByIdAndUpdate(req.params.id, {
                        $set: req.body
                    }
                    );
                    res.status(200).json("Post has been updated...")
                } catch (err) {
                    res.status(500).json(err);
                }
            } else {
                    res.status(401).json("You can only update your posts!");
                }
        } catch(err) {
            res.status(500).json(err);
        }
});

// GET POST
router.get("/:id", async (req, res) => {
    try{
        const post = await Post.findById(req.params.id)
        res.status(200).json(post)
    } catch(err) {
        res.status(500).json(err);
    }
});

// GET ALL POSTS AND QUERY
router.get("/", async (req, res) => {
    const userQuery = req.query.user
    const catQuery = req.query.cat
    try{
        let posts;
        if (userQuery) {
            posts = await Post.find({username:userQuery})
        } else if (catQuery){
            posts = await Post.find({
                categories:{ $in: [catQuery] } 
            //The $in is a comparison query operator that allows you to select documents where the value of a field is equal to any value in an array.
            })
        } else {
            posts = await Post.find()
        }
        res.status(200).json(post)
    } catch(err) {
        res.status(500).json(err);
    }
});

module.exports = router;

