//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash')
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/BlogDB");

const blogsSchema = {
  heading : String,
  para : String
};

const Blog = mongoose.Model("Blog" , blogsSchema);

let posts = [];

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";

const aboutContent = "dui.";

const contactContent = "libero.";

//rendering home page
app.get("/", function (req, res) {
  res.render("home", { posts: posts });
});

//rendering about page
app.get("/about", function (req, res) {
  res.render("about", { aboutContent: aboutContent });
});

//rendering contact page
app.get("/contact", function (req, res) {
  res.render("contact", { contactContent: contactContent });
});

//rendering compose page
app.get("/compose", function (req, res) {
  res.render("compose");
});

//accepting post request for new blog from compose page
app.post("/compose", function (req, res) {
  let postTopic = req.body.postTitle;
  let postBody = req.body.postBody;
  const post = {
    title: postTopic,
    content: postBody
  };

  posts.push(post);
  // console.log(posts);
  res.redirect("/");

});

//rendering blogs on separate page on url request
app.get("/posts/:topic", function (req, res) {
  let postID = _.lowerCase(req.params.topic);
  const userSearch = _.kebabCase(postID);

  posts.forEach(function (post) {
    let postTitle = _.lowerCase(post.title);
    let post_title = _.kebabCase(postTitle);
    if (post_title === userSearch) {
      console.log("Match Found.");
      res.render("post", {
        title: post.title,
        content: post.content
      });
    }
  });
});

app.listen(3000, function () {
  console.log("Server started on port: 3000");
});
