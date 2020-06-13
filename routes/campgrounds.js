var express=require("express");
var router=express.Router();
var Campground=require("../models/campground");
var Comment=require("../models/comment");
var middleware=require("../middleware");

// INDEX: show all campgrounds
router.get("/", function(req, res){
	Campground.find({}, function(err, allCampgrounds){
		if(err){
			console.log(err);
		}else{
			res.render("campgrounds/index", {campgrounds:allCampgrounds, currentUser:req.user}); //req.user是回應的資料庫裡面的User物件，一般來說會是累積儲存的signed up already users，就是累積註冊的使用者資料，req.user物件裡面包含我們在userSchema設定的屬性們(username. password)
		}
	});
});

// CREATE: post new campground
router.post("/", middleware.isLoggedIn, function(req, res){
	// get data from form and add to campgrounds array
	var name=req.body.name;
	var price=req.body.price;
	var image=req.body.image;
	var desc=req.body.description;
	var author={
		id:req.user._id,
		username:req.user.username
	};
	var newCampgrounds={name:name, price:price, image:image, description:desc, author:author};
	// campgrounds.push(newCapmgrounds); 原本的campgrounds陣列已經被DB取代，不再用hard-coded的陣列不可變動，改用DB新增如下
	Campground.create(newCampgrounds, function(err, newlyAdded){
		if(err){
			console.log(err);
		}else{
			// redirect back to /campgrounds
			res.redirect("/campgrounds");
		}
	})	
})

// NEW: show form to create new campground
router.get("/new", middleware.isLoggedIn, function(req, res){
	res.render("campgrounds/new");
})

// SHOW: show more info about one campground
router.get("/:id", function(req, res){
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err){
			console.log(err)
		}else{
			console.log(foundCampground); //可以到show去看這裡的foundCampground就是compground.comments。後面會看到很多campground.name or image or description，這些都是campground物件的屬性
			res.render("campgrounds/show", {campground:foundCampground});
		}
	})
})

//Edit campground route
// router.get("/:id/edit", function(req, res){
// 	// is user logged in?
// 	if(req.isAuthenticated()){
// 		Campground.findById(req.params.id, function(err, foundCampground){
// 			if(err){
// 				res.redirect("/campgrounds")
// 			}else{
// 				// does the user own this campground?
// 				//foundCampground.author.id是物件，req.body._id是字串，雖然二者回傳值看起來一模一樣，但本質不一樣，無法用一般的比較方式(== or ===)
// 				if(foundCampground.author.id.equals(req.user._id)){
// 					res.render("campgrounds/edit", {campground: foundCampground});
// 				}else{
// 					res.send("you dont have the permission to do that")
// 				}
// 			}
// 		})
// 	}else{
// 		res.send("you need to log in!")
// 	}
// })
//裝上middleware的function之後，edit route變成下面這樣
router.get("/:id/edit", middleware.checkOwnership, function(req, res){
	Campground.findById(req.params.id, function(err, foundCampground){
		if(err){
			res.redirect("/campgrounds")
		}else{
			res.render("campgrounds/edit", {campground: foundCampground});
		}
	})
})


//Update campground route
router.put("/:id", middleware.checkOwnership, function(req, res){
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
		if(err){
			res.redirect("/campgrounds")
		}else{
			res.redirect("/campgrounds/"+req.params.id); //也可以是updatedCampground._id
		}
	})
})


//Destroy campground routes
router.delete("/:id", middleware.checkOwnership, function(req, res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/campgrounds")
		}else{
			res.redirect("/campgrounds")
		}
	})
})



// function isLoggedIn(req, res, next){
// 	if(req.isAuthenticated()){
// 		return next();
// 	}else{
// 		res.redirect("/login")
// 	}
// }

// function checkOwnership(req, res, next){
// 	if(req.isAuthenticated()){
// 		Campground.findById(req.params.id, function(err, foundCampground){
// 			if(err){
// 				res.redirect("back")
// 			}else{
// 				// does the user own this campground?
// 				//foundCampground.author.id是物件，req.body._id是字串，雖然二者回傳值看起來一模一樣，但本質不一樣，無法用一般的比較方式(== or ===)
// 				if(foundCampground.author.id.equals(req.user._id)){
// 					next();
// 				}else{
// 					res.redirect("back")
// 				}
// 			}
// 		})
// 	}else{
// 		res.redirect("back");
// 	}
// }

module.exports=router;
