// routes/comments.js
const express = require('express');
const router = express.Router();
const { createComment}  = require('../controllers/comment.controller');
const isLoggedIn = require("../middleware/isLoggedIn");

// Create Comment
router.post('/create',isLoggedIn,createComment);

// Get Comments by Post ID
//router.get('/:postId',getCommentsByPostId);
/*router.get('/posts/:postId',getCommentsByPostId);
*/
module.exports = router;
