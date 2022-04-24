require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require('mongoose-findorcreate');

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(session({
  secret: "Our little secret.",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true});
// mongoose.set("useCreateIndex", true);

const userSchema = new mongoose.Schema ({
  email: String,
  password: String,
  googleId: String,
  secret: String
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/secrets",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log(profile);

    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

app.get("/",(req,res)=>{
    //res.sendFile(__dirname + '/index.html')
    res.render('index')
})
app.get("/auth/google",
  passport.authenticate('google', { scope: ["profile"] })
);

app.get("/auth/google/secrets",
  passport.authenticate('google', { failureRedirect: "/login" }),
  function(req, res) {
    // Successful authentication, redirect to secrets.
    res.redirect("/book");
  });

app.get("/services",(req,res)=>{
    res.render("services");
})
app.get("/about",(req,res)=>{
    res.render("about");
})
app.get("/book",(req,res)=>{
    if (req.isAuthenticated()){
        res.render("book");
      } else {
        res.redirect("/login");
      }
    
})
app.get("/doctors",(req,res)=>{
    res.render("doctors");
})
app.get("/blogs",(req,res)=>{
    res.render("blogs");
})
app.get("/review",(req,res)=>{
    res.render("review");
})

app.get("/login",(req,res)=>{
    res.render("login");
})
app.get("/register",(req,res)=>{
    res.render("register");
})

app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
  });
  
  app.post("/register", function(req, res){
  
    User.register({username: req.body.username}, req.body.password, function(err, user){
      if (err) {
        console.log(err);
        res.redirect("/register");
      } else {
        passport.authenticate("local")(req, res, function(){
          res.redirect("/book");
        });
      }
    });
  
  });
  
  app.post("/login", function(req, res){
  
    const user = new User({
      username: req.body.username,
      password: req.body.password
    });
  
    req.login(user, function(err){
      if (err) {
        console.log(err);
      } else {
        passport.authenticate("local")(req, res, function(){
          res.redirect("/book");
        });
      }
    });
  
  });



// app.post("/", (req, res) => {
//     // console.log(req.body)
//     // res.send('successful')
//     const userName = req.body.email;
//     const passWord = req.body.pass
//     // console.log(userName, passWord)
//     // if(user.username && user.password === userName && passWord ){
//     //   res.render('calculator.html')
//     // }
//     // else{
//     //     res.send("error")
//     // }
//     console.log(users.username)
//     if (Sign.username=== userName) {
//         if (Sign.password === passWord) {
//             // res.render('calculator')
//             res.render("doctors")
//         }
//     } else {
//         res.send("error")
//     }
// })

// data fetching and storeing at database and retrieve data for authentection


app.listen("3000",()=>{
    console.log("server has started.")
})