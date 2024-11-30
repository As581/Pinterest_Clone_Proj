const Comment = require('../models/comment.model');
const Post = require("../models/post.model");
const mongoose = require("mongoose");

const createComment = async (req, res) => {
  const { postId, userId, content } = req.body;

  try {
    // Step 1: Create a new comment
    const newComment = new Comment({ postId, userId, content });
    await newComment.save();

    // Step 2: Find the post by postId and update the comments array
    await Post.findByIdAndUpdate(postId, { $push: { comments: newComment._id } });

    // Redirect or send a response
    res.redirect('back');
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ message: 'Error creating comment', error });
  }
};



module.exports= {createComment}
