//*****Require Dependencies*****//
var express = require("express");
var exphbs = require("express-handlebars");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

//*****Use Promise*****//
mongoose.Promise = Promise;

//*****Initialize Express*****//
var app = express();
var PORT = process.env.PORT || 3000;

//*****Use Morgan Logger, Body Parser and Express Static*****
app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: false }));

//*****Scraping Tools*****//
var axios = require("axios");
var cheerio = require("cheerio");


app.use(express.static("public"));

//*****Use Handlebars*****
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//*****Connect to Mongo DB*****
mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/scrapingProject");

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function () {
  console.log('Connected');
});

//*****Require Routes*****
require("./controllers/article_controller.js")(app);


//*****Start Server*****
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});


