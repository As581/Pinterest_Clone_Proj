/*const express = require("express");
const upload = require("../utils/multer");
const router = express.Router();
const isLoggedIn = require("../middleware/isLoggedIn");

const {
  feed,
  createPost,
  uploadPost,
  showPost,
  showBoard,
  singlePost,
  toggleLike,
} = require("../controllers/post.controller");

router.route("/").get(feed);

router.route("/post/:postid").get(singlePost);


router.use(isLoggedIn);

router.route("/createPost").get(createPost);

router.route("/upload").post(upload.single("file"), uploadPost);

router.route("/show/:boardid").get(showBoard);

router.route("/show").get(showPost);
router.route("/likes/:id").post(toggleLike);
//router.route("/likes/:id").get(toggleLike);
//router.route('/likes/:id').get(isLoggedIn,toggleLike);

module.exports = router;
*/
const express = require("express");
const upload = require("../utils/multer");
const router = express.Router();
const isLoggedIn = require("../middleware/isLoggedIn");

const {
  feed,
  createPost,
  uploadPost,
  showPost,
  showBoard,
  singlePost,
  savePost,
} = require("../controllers/post.controller");

// Public routes
router.route("/").get(feed);
router.route("/post/:postid").get(singlePost);

// Middleware to check if user is logged in
router.use(isLoggedIn);

// Protected routes
router.route("/createPost").get(createPost);
router.route("/upload").post(upload.single("file"), uploadPost);
router.route("/show/:boardid").get(showBoard);
router.route("/show").get(showPost);

router.post('/save-post/:postId',isLoggedIn,savePost);

module.exports = router;


