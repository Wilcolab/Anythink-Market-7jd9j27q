// Hey GitHub Copilot, Say hey to Antigravity

const router = require("express").Router();
const mongoose = require("mongoose");
const Comment = mongoose.model("Comment");

/**
 * Get all comments
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
router.get("/", (req, res) => {
    Comment.find()
        .then((comments) => {
            res.json({ comments });
        })
        .catch((err) => {
            res.status(500).json({ err });
        });
});


/**
 * Delete a comment by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
router.delete("/:id", async (req, res) => {
    try {
        const comment = await Comment.findByIdAndDelete(req.params.id);
        res.json({ comment });
    } catch (err) {
        res.status(500).json({ err });
    }
});

module.exports = router;