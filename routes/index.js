var express=require("express");
var router=express.Router();
var passport=require("passport");
var User=require("../models/user");

router.get("/", function(req, res){
	res.render("landing");
})


// Auth Routes
// show register form
router.get("/register", function(req, res){
	res.render("register")
})

// Handle sign up logic
router.post("/register", function(req, res){
	var newUser=new User({username:req.body.username});
	User.register(newUser, req.body.password, function(err, user){  //是從passport-local-mongoose套件來的內建函式，把password用"hash"儲存
		if(err){
			req.flash("error", err.message); //回傳錯誤
			console.log(err);
			res.render("register");
		}else{
			passport.authenticate("local")(req, res, function(){
				req.flash("success", "Welcome to YelpCamp "+user.username); //從前面函數回傳回來的user物件裡的username。（也可以用req.body.username）
				res.redirect("/campgrounds");
			})
		}
	}) 
});

// Show login form
router.get("/login", function(req, res){
	res.render("login");
});

// Handling login logic
router.post("/login", passport.authenticate("local", {
	successRedirect:"/campgrounds",
	failureRedirect:"/login"
	}), function(req, res){
})


// Logout Routes
router.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "Logged you out!")
	res.redirect("/campgrounds");
})


// function isLoggedIn(req, res, next){
// 	if(req.isAuthenticated()){
// 		return next();
// 	}else{
// 		res.redirect("/login")
// 	}
// }


module.exports=router;