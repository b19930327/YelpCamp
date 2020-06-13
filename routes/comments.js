var express=require("express");
var router=express.Router({mergeParams:true});
var Campground=require("../models/campground");
var Comment=require("../models/comment");
var middleware=require("../middleware");

//Comments Routes
router.get("/new", middleware.isLoggedIn, function(req, res){
	Campground.findById(req.params.id, function(err,campground){
		if(err){
			console.log(err)
		}else{
			res.render("comments/new", {campground:campground})
		}
	})
})

router.post("/", middleware.isLoggedIn, function(req, res){
	Campground.findById(req.params.id, function(err,campground){
		if(err){
			req.flash("error", "Something went wrong");
			console.log(err);
			res.redirect("/campgrounds");
		}else{
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					console.log(err)
				}else{
					//add username and id to comment
					comment.author.id=req.user._id;
					comment.author.username=req.user.username;
					//save comment
					comment.save();
					campground.comments.push(comment); //campground物件裡有comments array（see campgrounds.js），在搜尋到的campground回傳的campground裡的comments array（裡面有不同comment物件）加入新創造的comment物件進入該array
					campground.save(); 
					req.flash("success", "Successfully added comment");
					res.redirect("/campgrounds/"+ campground._id);
				}
			})
		}
	})
});


//Edit comment routes
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
	Comment.findById(req.params.comment_id, function(err, foundComment){ //req.params.comment_id是因為comment_id前面有冒號（表示可變動的id），在app.js我們定義了app.use("/campgrounds/:id/comments", commentRoutes)，而這個頁面是要取得/campgrounds/:id/comments/:comment_id/edit"，所以可以用params抓到comment_id
		if(err){
			res.redirect("back")
		}else{
			res.render("comments/edit", {campground_id:req.params.id, comment:foundComment});
		}
	})	
});


//update edit route (update是put request（但實際上是post request，但我們用method-override把他轉過來)
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){ //req.body.comment是form送出的req，我們在edit.ejs幫他加了一個物件comment，裡面有text屬性（也只有這一個屬性，所以在這裡可以不用再往下選）
		if(err){
			res.redirect("back")
		}else{
			res.redirect("/campgrounds/"+req.params.id)
		}
	})
})

//Comment destroy route (delete是delete request，但實際上也是post request)
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndRemove(req.params.comment_id, function(err){
		if(err){
			res.redirect("back")
		}else{
			req.flash("success", "Comment deleted");
			res.redirect("/campgrounds/"+req.params.id);
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

// function checkCommentOwnership(req, res, next){
// 	if(req.isAuthenticated()){
// 		Comment.findById(req.params.comment_id, function(err, foundComment){
// 			if(err){
// 				res.redirect("back")
// 			}else{
// 				// does the user own this comment?
// 				//foundCampground.author.id是物件，req.body._id是字串，雖然二者回傳值看起來一模一樣，但本質不一樣，無法用一般的比較方式(== or ===)
// 				if(foundComment.author.id.equals(req.user._id)){
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