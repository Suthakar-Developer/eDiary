//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");

const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

// Connect MongoDB at default port 27017.
mongoose.connect(
  "mongodb://localhost:27017/blogDB",
  {
    useNewUrlParser: true,
    useCreateIndex: true,
  },
  (err) => {
    if (!err) {
      console.log("MongoDB Connection Succeeded.");
    } else {
      console.log("Error in DB connection: " + err);
    }
  }
);

const postSchema = new mongoose.Schema({
  title: String,
  content: String,
});

const Post = mongoose.model("Post", postSchema);

const homeStartingContent =
  "Welcome to your Personal Diary. This is the 21st century, as technologies evolve we should. This is the modern eDiary";
const aboutContent =
  "In this century as everything is moving towards user friendliness to reduce the work for humans. Proving that fact we discovered this eDiary, now you don't need to write in your old diary and don't need to search for it in the future to relive your old memories. With this eDiary, you are now just one click away from exploring your past.";
const contactContent =
  "Any queries or found dicrepancy feel free to contact the developer @ suthakar.developer@gmail.com";

const app = express();

app.set("view engine", "ejs");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(express.static("public"));

app.get("/", function (req, res) {
  Post.find({}, function (err, foundItems) {
    if (!err) {
      res.render("home", {
        startingContent: homeStartingContent,
        posts: foundItems,
      });
    }
  });
});

app.get("/about", function (req, res) {
  res.render("about", {
    aboutContent: aboutContent,
  });
});

app.get("/contact", function (req, res) {
  res.render("contact", {
    contactContent: contactContent,
  });
});

app.get("/compose", function (req, res) {
  res.render("compose");
});

app.post("/compose", function (req, res) {
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody,
  });

  post.save(function (err) {
    if (!err) {
      res.redirect("/");
    }
  });
});

app.get("/posts/:postId", function (req, res) {
  const requestedPostId = req.params.postId;

  Post.findOne({ _id: requestedPostId }, function (err, post) {
    if (!err) {
      res.render("post", {
        title: post.title,
        content: post.content,
      });
    }
  });
  // posts.forEach(function (post) {
  //   const storedTitle = _.lowerCase(post.title);

  //   if (storedTitle === requestedTitle) {
  // res.render("post", {
  //   title: post.title,
  //   content: post.content,
  // });
  //   }
  // });
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
