var mongoose = require("mongoose");

var Schema = mongoose.Schema;

//*****Create Comment Model Schema*****///
var CommentSchema = new Schema({

  body: {
    type: String,
    required: true
  }
});


var Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;