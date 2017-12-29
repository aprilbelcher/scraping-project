var mongoose = require("mongoose");

var Schema = mongoose.Schema;

//*****Create Article Model Schema*****///
var ArticleSchema = new Schema({

  title: {
    type: String,
    required: true,
    unique: true
  },

  link: {
    type: String,
    required: true,
    unique: true
  },

  articleSnippet: {
    type: String,
    required: true,
    unique: true
  },

  saved: {
    boolean: false
  },

  comment: [{
    type: Schema.Types.ObjectId,
    ref: "Comment"
  }]
});

var Article = mongoose.model("Article", ArticleSchema);


module.exports = Article;