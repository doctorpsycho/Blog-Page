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

//defining Post schema
const postSchema = {
  title : String,
  content : String
};

//defining Post model
const Post = mongoose.model("Post" , postSchema);

const homeStartingContent = "Lacusamet.";

const aboutContent = "dui.";

const contactContent = "libero.";

//rendering home page
app.get("/", async function (req, res) {
  const posts = await Post.find({}); 
  res.render("home" , { posts : posts });
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
app.post("/compose", async function (req, res) {
  let postTopic = req.body.postTitle;
  let postBody = req.body.postBody;

  const post = new Post({
    title : postTopic,
    content : postBody
  })

  //console.log(post);
  await post.save();
  res.redirect("/");

});

//rendering blogs on separate page on url request
app.get("/posts/:topic", async function (req, res) {
  // let search = _.lowerCase(req.params.topic);
  // const userSearch = _.kebabCase(search);


  const result = await Post.find({title : req.params.topic}); 

  console.log(result);

  res.render("post", { title : result.title , content: content.title })
});

app.listen(3000, function () {
  console.log("Server started on port: 3000");
});
