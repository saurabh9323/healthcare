const express = require("express");
const bodyParser= require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
const app = express();


app.set("view engine","ejs");
app.use(express.static("public"))

app.use(bodyParser.urlencoded({
    extended: true
}));


mongoose.connect('mongodb://localhost:27017/signup',{useNewUrlParser:true})
// mongoose.connect("mongodb://localhost:27017/signup", {useNewUrlParser: true});
 const signUpSchema = {
     username:String,
     passWord:String
 }
 const Sign = mongoose.model('Sign',signUpSchema)
 const user1 = new Sign({
    username: "saurabh.pathak52@gmail.com",
    password: "saurabh"
 });
 const user2 = new Sign({
    username: "shubham.pathak9323@gmail.com",
    password: "shubham"
 });
 const users = [user1,user2]


app.get("/",(req,res)=>{
    //res.sendFile(__dirname + '/index.html')
    res.render('index')
})
app.get("/login",(req,res)=>{
    res.render("login");
})
app.get("/services",(req,res)=>{
    res.render("services");
})
app.get("/about",(req,res)=>{
    res.render("about");
})
app.get("/book",(req,res)=>{
    res.render("book");
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



app.post("/", (req, res) => {
    // console.log(req.body)
    // res.send('successful')
    const userName = req.body.email;
    const passWord = req.body.pass
    // console.log(userName, passWord)
    // if(user.username && user.password === userName && passWord ){
    //   res.render('calculator.html')
    // }
    // else{
    //     res.send("error")
    // }
    console.log(users.username)
    if (Sign.username=== userName) {
        if (Sign.password === passWord) {
            // res.render('calculator')
            res.render("doctors")
        }
    } else {
        res.send("error")
    }
})

// data fetching and storeing at database and retrieve data for authentection


app.listen("3000",()=>{
    console.log("server has started.")
})