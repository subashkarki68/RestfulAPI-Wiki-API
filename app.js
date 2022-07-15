//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const PORT = process.env.PORT || 3000;
const app = express();

//Connecting to monfgoDB
const URI = "mongodb+srv://subashkarki68:lpGPJ9WHOzBsULZ2@cluster0.c3sr77b.mongodb.net/";
const dbName = "wikiDB";

mongoose.connect(URI + dbName, function (err) {
  if (!err) {
    console.log("Successfully connected to " + dbName + " database.");
  } else {
    console.log(err);
  }
});

//Mongoose Schemas
const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  }
});

const Article = mongoose.model("Article", articleSchema);

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
/////////////////////////////////////////// Requests Targetting all articles
app.route('/articles')
  .get(function (req, res) {
    Article.find({}, function (err, docs) {
      if (!err) {
        // res.render('form');
        res.send(docs);
      } else {
        res.send(err);
      }
    });
  })
  .post(function (req, res) {
    const title = req.body.title;
    const content = req.body.content;

    const newArticle = new Article({
      title: title,
      content: content
    });

    console.log("Posting");
    newArticle.save(function (err) {
      if (!err) {
        res.send("Successfully added article: " + newArticle);
      } else {
        res.send("Error adding article: " + err);
      }
    });
  })
  .delete(function (req, res) {
    Article.deleteMany(function (err) {
      if (!err) {
        res.send("Successfully deleted all articles.");
      } else {
        res.send(err);
      }
    });
  });

/////////////////////////////////////////// Request Targetting a specific articles

app.route('/articles/:articleTitle')
  .get(function (req, res) {
    Article.findOne({
      title: req.params.articleTitle
    }, function (err, result) {
      if (result) {
        res.send(result);
      } else {
        res.send(404);
      }
    });
  })
  .put(function (req, res) {
    Article.replaceOne({
        title: req.params.articleTitle
      }, {
        title: req.body.title,
        content: req.body.content
      },
      function (err, result) {
        if (err) {
          res.send(err);
        } else {
          res.send(result);
        }
      }
    );
  })
  .patch(function (req, res) {
    Article.updateOne({
        title: req.params.articleTitle
      }, {
        $set: req.body
      },
      function (err, result) {
        if (err) {
          res.send(err);
        } else {
          res.send(result);
        }
      });
  })
  .delete(function (req, res) {
    Article.deleteOne({
      title: req.params.articleTitle
    }, function(err, result){
      if(!err){
        res.send(result);
      }else{
        res.send(err);
      }
    });
  });

//TODO

app.listen(PORT, function () {
  console.log("Server started on port " + PORT);
});