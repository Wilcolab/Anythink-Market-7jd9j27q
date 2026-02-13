const router = require("express").Router();
const mongoose = require("mongoose");
const Comment = mongoose.model("Comment");
const Item = mongoose.model("Item");
const auth = require("../auth");
const { sendEvent } = require("../../lib/event");

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
router.delete("/:id", auth.required, async (req, res) => {
    try {
        const commentId = req.params.id;
        const comment = await Comment.findById(commentId);

        if (!comment) {
            return res.sendStatus(404);
        }

        await Comment.findByIdAndDelete(commentId);

        // Remove the comment reference from the associated Item
        await Item.findOneAndUpdate(
            { comments: commentId },
            { $pull: { comments: commentId } }
        );

        await sendEvent('comment_deleted', { commentId });

        res.json({ comment });
    } catch (err) {
        res.status(500).json({ err });
    }
});

module.exports = router;