const router = require("express").Router();
const Category = require("../models/Category");


// CREATE Category
router.post("/", async (req, res) => {
        try {
            const newCat = await new Category(req.body)
            const savedCat = await newCat.save()
            res.status(200).json(savedCat)
        } catch (err) {
            res.status(500).json(err);
        }
});


// GET Category
router.get("/:id", async (req, res) => {
    try{
        const cat = await Category.findById(req.params.id)
        res.status(200).json(cat)
    } catch(err) {
        res.status(500).json(err);
    }
});

module.exports = router;

