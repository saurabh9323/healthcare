const express = require("express");
const bodyparser= require("body-parser");
const app = express();


app.set("view engine","ejs");
app.use(express.static("public"))
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


app.listen("3000",()=>{
    console.log("server has started.")
})