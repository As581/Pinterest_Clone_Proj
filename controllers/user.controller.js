const passport = require('passport');
const User = require('../models/user.model');
const fs = require('fs');
const path = require('path');

// for localStrategy
    // const localStrategy = require('passport-local');
    // passport.use(new localStrategy(User.authenticate()));

// Home page
const home = (req, res) => {
  const error = req.flash('error');
  res.render('index' , {error , nav : false});
};

// Register new user
const register = (req, res , next) => {
 
  try {
    const { username, email, fullname } = req.body;
    let userData = new User({ username, email, fullname });
  
    User.register(userData, req.body.password)
      .then(() => {
        passport.authenticate('local')(req, res, () => {
          res.redirect('/profile');
        });
      })
      .catch((error) => {
        req.flash('error', error.message);
        return res.redirect('/');
      });
  } catch (error) {
    return next(error);
  }
};

// Render login page
const login = (req, res) => {
  const error = req.flash('error');
  res.render('login', { error , nav : false});
};

const profile = async(req, res) => {
  const user = await User.findById(req.user._id).populate('posts').populate('boards');
  const success = req.flash('success');
  res.render('profile', { user , success , nav : true});
};

// Logout user
const logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect('/');
  });
};

// upload avatar
const avatarupload = async(req, res)=>{
  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }

 
    try {
      const userId = req.session.passport.user;
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).send('User not found');
      }
      
      const upload = await User.findByIdAndUpdate(userId,{
        avatar: {
          url: req.file.path,
          contentType: req.file.mimetype
        }
      } , {new: true});
  
      if(!upload){
        return res.status(404).send('User not found');
      }

      req.flash('success', 'profile picture updated successfully');
      res.redirect('/profile');
    } catch (error) {
      console.error(error);
      res.status(500).send(error.message);
    }
}

// Render feed page
const feed = (req, res) => {
  res.redirect('/posts');
};


// Edit profile page - render the profile edit form// Edit profile page - render the profile edit form

const renderEditProfile = async (req, res) => {
  const user = await User.findById(req.user._id);
  res.render('edit-profile', { user, nav: true });
};

// Update profile data
const editProfile = async (req, res) => {
  try {
    const { username, email, fullname } = req.body;

    // Find the user by ID
    const user = await User.findById(req.user._id);
    if (!user) {
      req.flash('error', 'User not found');
      return res.redirect('/profile');
    }

    // Update the user's details using Object.assign
    Object.assign(user, { username, email, fullname });

    // Save the updated user
    await user.save();

    req.flash('success', 'Profile updated successfully');
    res.redirect('/profile');
  } catch (error) {
    console.error(error);
    req.flash('error', 'Error updating profile');
    res.redirect('/profile');
  }
};



module.exports = {
  home,
  register,
  login,
  profile,
  logout,
  feed,
  avatarupload,
  renderEditProfile,
  editProfile,
};


