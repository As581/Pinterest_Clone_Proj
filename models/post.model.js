const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  img: {
    url: String, // Store the image URL
    contentType: String // Store the content type of the image
  },
  posttext: {
    type: String,
    required: true
  },
  postDesc: {
    type: String,
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  board: {
    type: Schema.Types.ObjectId,
    ref: 'Board',
  },
  tag: {
    type: String,
    required: true,
    index: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  // Other 
  likes: [
    {
    type: Schema.Types.ObjectId, 
    ref: 'User' 
  }
],
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Comment'
    }
  ]
});

module.exports = mongoose.model('Post', PostSchema);






