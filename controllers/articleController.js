//*****Scraping Tools*****//
var request = require("request");
var cheerio = require("cheerio");

//*****Requiring Models*****//
var Comment = require("../models/comments.js");
var Article = require("../models/articles.js");

module.exports = function (app) {
  //*****home page*****//
  app.get('/', function (req, res) {
    res.redirect('/articles');
  });

  //*****Scrape Data*****//
  app.get("/scrape", function (req, res) {
    request("https://www.nytimes.com/", function (error, response, html) {
      var $ = cheerio.load(html);
      var all = [];
      $("article").each(function (i, element) {

        var result = {};

        result.title = $(this).children("h2").text().trim();
        result.articleSnippet = $(this).children(".summary").text().trim();
        result.link = $(this).children("h2").children("a").attr("href");

        //***If it meets all requirements push it to result***//
        if (result.title && result.articleSnippet && result.link) {
          all.push(result);
        }
      });
      //*****Return the rendered HTML via the callback function***//
      res.render("scrape", {
        result: all
      });

    });
  });
  //*****Save Articles to the Database***//
  app.post("/save", function (req, res) {
    console.log(req.body);
    var entry = new Article(req.body);
    entry.save(function (err, doc) {

      if (err) {
        console.log(err);
      } else {
        console.log(doc);
      }
    });
  });

  //*****Get the articles scraped from the mongoDB*****//
  app.get("/articles", function (req, res) {
    // Grab every doc in the Articles array //
    Article
      .find({}, function (error, doc) {
        if (error) {
          console.log(error);
        } else {
          res.render("index", {
            result: doc
          });
        }
      })
      // Sort articles in descending order //
      .sort({
        '_id': -1
      });
  });

  //*****Grab an article using ObjectId*****//
  app.get("/articles/:id", function (req, res) {
    Article.findOne({
        "_id": req.params.id
      })
      // populate it with the comment associated with the article //
      .populate("comment")
      .exec(function (error, doc) {
        if (error) {
          console.log(error);
        } else {
          res.render("comments", {
            result: doc
          });
        }
      });
  });

  //*****Create New Comment*****//
  app.post("/articles/:id", function (req, res) {
    // Create a new Comment and pass the req.body to the entry //
    Comment
      .create(req.body, function (error, doc) {
        if (error) {
          console.log(error);
        } else {
          // Find Article by Id and update with new comment //
          Article.findOneAndUpdate({
              "_id": req.params.id
            }, {
              $push: {
                "comment": doc._id
              }
            }, {
              safe: true,
              upsert: true,
              new: true
            })
            // Execute the query //
            .exec(function (err, doc) {
              if (err) {
                console.log(err);
              } else {
                res.redirect('back');
              }
            });
        }
      });
  });

  //*****Delete Comment*****//
  app.delete("/articles/:id/:commentid", function (req, res) {
    Comment
      .findByIdAndRemove(req.params.commentid, function (error, doc) {
        if (error) {
          console.log(error);
        } else {
          console.log(doc);
          Article.findOneAndUpdate({
              "_id": req.params.id
            }, {
              $pull: {
                "comment": doc._id
              }
            })
            // Execute the above query
            .exec(function (err, doc) {
              // Log any errors
              if (err) {
                console.log(err);
              }
            });
        }
      });
  });

  //*****Delete an Article*****//
  app.delete("/article/:id", function (req, res) {
    Article.findByIdAndRemove(req.params.id, (err, article) => {
      if (err) {
        console.log(err);
      } else {
        res.send('deleted');
      }
    });
  });
};