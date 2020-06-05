//jshint esversion:6
require("dotenv").config();
const mongooseEncrypt = require("mongoose-encryption");
const express = require("express");
const app = express();
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser:true});
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine','ejs');

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});
userSchema.plugin(mongooseEncrypt,{secret: process.env.SECRET, encryptedFields: ['password']});
const User = mongoose.model("User", userSchema);


app.get("/",function(req,res){
res.render("home");
});

app.get("/login",function(req,res){
res.render("login");
});

app.get("/register",function(req,res){
res.render("register");
});

app.post("/register",function(req,res) {
const newUser = new User({
  email: req.body.username,
  password: req.body.password
});
newUser.save()
res.render("secrets");
});

app.post("/login",function(req,res) {
  const email = req.body.username;
  User.findOne({email: email},function(err,foundList) {
    if (foundList) {
        if (foundList.password === req.body.password) {
          console.log(foundList.password);
          res.render("secrets");
        } else {res.send("Wrong password!");}
    } else {res.send("Account not found")}
  });
});


app.listen(3000, (err) => {console.log("Server listening...");});
