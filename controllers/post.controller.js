const Post = require("../models/post.model");
const User = require("../models/user.model");
const Board = require("../models/board.model");
const Comment = require('../models/comment.model'); 
const fs = require("fs");
const path = require("path");

// Show Feed
const feed = async (req, res) => {
  const posts = await Post.find().populate("user");
  const user  = req?.user;

//   ===============================search query ================================
const  search  =  req?.query?.search;

if( req.query.search){
    //console.log("Search query in feed:", search);
    try {
      const posts = await Post.find({
        $or: [
          { posttext: { $regex: search, $options: "i" } },
          { postDesc: { $regex: search, $options: "i" } },
          { tag: { $regex: search, $options: "i" } },
        ],
      }).populate("user");
  
    //   const length = posts.length;
    //   console.log("Number of posts found:", length);
  
      // Send the posts and their length in the response

     return res.render("feed", { posts, nav: user ? true : false , length : true , search});
    } catch (error) {
      console.error("Error fetching posts:", error.message);
     return res.status(500).send("An error occurred while searching for posts.");
    }
}


 return res.render("feed", { posts, nav: user ? true :false , length : false , search});
};

// create Post
const createPost = async (req, res) => {
    const userId = req.session.passport.user;
    const user = await User.findById(userId).populate("posts").populate("boards");
    // console.log("createpost " , user)
  res.render("createPost", {user, nav: true });
};

// upload Post
const uploadPost = async (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded");
  }

  // console.log(" upload post ",req.body)
  try {
    const userId = req.session.passport.user;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send("User not found");
    }

    const post = await Post.create({
      img: {
        url: req.file.path,
        contentType: req.file.mimetype,
      },
      posttext: req.body.posttext,
      postDesc: req.body.postDesc,
      tag: req.body.tag,
      user: user._id,
    });
if(post){
    user.posts.push(post._id);
    await user.save();
}
    

    const boardCreated = await Board.findOne({ boardTitle: req.body.boardTitle });
    if(boardCreated){
        boardCreated.posts.push(post._id);
        await boardCreated.save();
    }

    req.flash("success", "Post uploaded successfully");
    res.redirect("/profile");
  } catch (error) {
    console.error(error);

    fs.unlink(filePath, (err) => {
        if (err) console.error(err);
      });
    res.status(500).send("Server error");
  }
};

// show post
const showPost = async (req, res) => {
  const user = await req.user.populate("posts");
  res.render("myposts", { user, nav: true });
};

// show board
const showBoard = async (req, res) => {
    
    const board = await Board.findById(req.params.boardid).populate("posts").populate("user");

   res.render("boardposts" , {board , nav: true});
  };

// find single post
/*const singlePost = async (req, res) =>{
    const postid = req.params.postid;
    const user  = req?.user;


    try {
        const post = await Post.findById(postid).populate("user").populate("board");
        if(!post){
            return res.status(404).send("Post not found");
        }
        // res.send(post);
        res.render('singlepost' , {post , nav: user ? true : false,currentUser:req?.user});
    } catch (error) {
        console.error(error);
        return res.status(500).send("Server error");
    }
}
*/
/*const singlePost = async (req, res) => {
    const postid = req.params.postid;
    const user = req?.user; // Yeh optional chaining hai, jo user ko retrieve karega agar available hai
     const comments = await Comment.find({ postid }).populate('userId', 'name'); 
    try {
        const post = await Post.findById(postid).populate("user").populate("board");
        if (!post) {
            return res.status(404).send("Post not found");
        }
        // currentUser ko sahi tarike se pass kar rahe hain
        res.render('singlepost', { post, nav: user ? true : false  ,comments,currentUser:user}); // currentUser ko yahan se pass kiya
    } catch (error) {
        console.error(error);
        return res.status(500).send("Server error");
    }
};
*/

/*const singlePost = async (req, res) => {
    const postid = req.params.postid;
    const user = req?.user;
    
    try {
       const posts = await Post.find();
       const  search  =  req?.query?.search;

if( req.query.search){
const  search  =  req?.query?.search;

if( req.query.search){

    
    try {
      const posts = await Post.find.().populate("user");
    } catch (error) {
      console.error("Error fetching posts:", error.message);
     return res.status(500).send("An error occurred while searching for posts.");
    }
}
        const post = await Post.findById(postid).populate("user").populate("board");
          const comments = await Comment.find().populate("userId");

        if (!post) {
            return res.status(404).send("Post not found");
        }

        // Rendering the view with the post and comments
        res.render('singlepost', { search,posts,post, nav: user ? true : false,comments,currentUser:user}); // currentUser ko yahan se pass kiya
        
        //res.status(201).json(post);
        //res.status(201).json(comments);
    } catch (error) {
        console.error(error);
        return res.status(500).send("Server error");
    }
};
*/
const singlePost = async (req, res) => {
  const postid = req.params.postid;
  const user = req?.user;

  try {
    // Search functionality
    const search = req?.query?.search;
    let posts = [];
    if (search) {
      try {
        posts = await Post.find({
          $or: [
            { posttext: { $regex: search, $options: "i" } },
            { postDesc: { $regex: search, $options: "i" } },
            { tag: { $regex: search, $options: "i" } },
          ],
        }).populate("user");
      } catch (error) {
        console.error("Error fetching posts:", error.message);
        return res.status(500).send("An error occurred while searching for posts.");
      }
    }

    // Find the specific post by ID and populate the user and comments (with user data)
    const post = await Post.findById(postid)
      .populate("user")
      .populate({
        path: "comments",
        populate: { path: "userId" } // Populate user details for comments
      })
      .populate("board");

    if (!post) {
      return res.status(404).send("Post not found");
    }

    // Render the view with the post and comments
    res.render('singlepost', {
      search,
      posts,
      post, 
      nav: user ? true : false,
      currentUser: user,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).send("Server error");
  }
};



const savePost = async (req, res) => {
    try {
        const postId = req.params.postId;
        const userId = req.user._id;
        console.log(userId);
        
        let user = await User.findById(userId);
        console.log(user);
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        let post = await Post.findById(postId);
        
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        
        if (user.savedPosts.includes(postId)) {
            return res.status(400).json({ message: "Post already saved" });
        }
        
        user.savedPosts.push(postId);
        
        await user.save();
        
        res.status(200).json({ message: "Post saved successfully", postId });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { feed, createPost, uploadPost, showPost, showBoard, singlePost,savePost};




