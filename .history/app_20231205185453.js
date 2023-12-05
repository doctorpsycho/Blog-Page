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

//defining Blog's schema
const blogsSchema = {
  heading : String,
  para : String
};

const Blog = mongoose.model("Blog" , blogsSchema);

let posts = [];

const homeStartingContent = "Lacusamet.";

const aboutContent = "dui.";

const contactContent = "libero.";

//rendering home page
app.get("/", async function (req, res) {

  const Blogs = Blog.find();
  const allBlogs = await List.find({}, 'heading' , 'para');

  res.render("home", { Blogs: allBlogs });
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
