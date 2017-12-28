//*****Scraping Tools*****
var request = require("request");
var cheerio = require("cheerio");

var Comment = require("../models/comments.js");
var Article = require("../models/articles.js");

module.exports = function (app) {

  app.get('/', function (req, res) {
    res.redirect('/articles');
  });

  app.get("/scrape", function (req, res) {
    request("https://www.nytimes.com/", function (error, response, html) {
      var $ = cheerio.load(html);
      $("article").each(function (i, element) {

        var result = {};

        result.title = $(this).children("h2").text();
        result.articleSnippet = $(this).children(".summary").text();
        result.link = $(this).children("h2").children("a").attr("href");

        var entry = new Article(result);

        entry.save(function (err, doc) {

          if (err) {
            console.log(err);
          } else {
            console.log(doc);
          }
        });

      });
      res.send("Scrape Complete");

    });
  });

  // This will get the articles we scraped from the mongoDB
  app.get("/articles", function (req, res) {
    // Grab every doc in the Articles array
    Article
      .find({}, function (error, doc) {
        // Log any errors
        if (error) {
          console.log(error // Or send the doc to the browser as a json object
          );
        } else {
          res.render("index", {
            result: doc
          });
        }
        //Will sort the articles by most recent (-1 = descending order)
      })
      .sort({
        '_id': -1
      });
  });

  // Grab an article by it's ObjectId
  app.get("/articles/:id", function (req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the
    // matching one in our db...
    Article.findOne({
        "_id": req.params.id
      })
      // ..and populate all of the comments associated with it
      .populate("comment")
      // now, execute our query
      .exec(function (error, doc) {
        // Log any errors
        if (error) {
          console.log(error // Otherwise, send the doc to the browser as a json object
          );
        } else {
          res.render("comments", {
            result: doc
          });
          // res.json (doc);
        }
      });
  });

  // Create a new comment
  app.post("/articles/:id", function (req, res) {
    // Create a new Comment and pass the req.body to the entry
    Comment
      .create(req.body, function (error, doc) {
        // Log any errors
        if (error) {
          console.log(error // Otherwise
          );
        } else {
          // Use the article id to find and update it's comment
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
            // Execute the above query
            .exec(function (err, doc) {
              // Log any errors
              if (err) {
                console.log(err);
              } else {
                // Or send the document to the browser
                res.redirect('back');
              }
            });
        }
      });
  });

  app.delete("/articles/:id/:commentid", function (req, res) {
    Comment
      .findByIdAndRemove(req.params.commentid, function (error, doc) {
        // Log any errors
        if (error) {
          console.log(error // Otherwise
          );
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

};