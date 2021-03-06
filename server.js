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

//*****Use Morgan Logger, Body Parser and Express Static*****//
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));

//*****Use Handelbars*****//
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

//*****Make Public Folder Static Directory*****//
app.use(express.static("public"));

//*****Database Configuration*****//
var databaseUri = "mongodb://localhost/scrapingProject";

if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI);
} else {
  mongoose.connect(databaseUri);
}

var db = mongoose.connection;

db.on('error', function(err){
  console.log('Mongoose error:', err);
});

db.once('open', function () {
  console.log('Mongoose connection successful');
});

//*****Require Routes*****//
require("./controllers/articleController.js")(app);

//*****Start Server*****//
app.listen(PORT, function () {
  console.log("App running on port " + PORT + "!");
});