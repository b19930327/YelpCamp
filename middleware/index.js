var Campground=require("../models/campground");
var Comment=require("../models/comment");

var middlewareObj={};

middlewareObj.checkOwnership=function(req, res, next){
	if(req.isAuthenticated()){
		Campground.findById(req.params.id, function(err, foundCampground){
			if(err){
				req.flash("error", "Campground not found");
				res.redirect("back")
			}else{
				// does the user own this campground?
				//foundCampground.author.id是物件，req.body._id是字串，雖然二者回傳值看起來一模一樣，但本質不一樣，無法用一般的比較方式(== or ===)
				if(foundCampground.author.id.equals(req.user._id)){
					next();
				}else{
					req.flash("error", "Permission denied");
					res.redirect("back")
				}
			}
		})
	}else{
		req.flash("error", "You need to LOG IN");
		res.redirect("back");
	}
};

middlewareObj.checkCommentOwnership=function(req, res, next){
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, function(err, foundComment){
			if(err){
				res.redirect("back")
			}else{
				// does the user own this comment?
				//foundCampground.author.id是物件，req.body._id是字串，雖然二者回傳值看起來一模一樣，但本質不一樣，無法用一般的比較方式(== or ===)
				if(foundComment.author.id.equals(req.user._id)){
					next();
				}else{
					req.flash("error", "You dont have permission to do that");
					res.redirect("back")
				}
			}
		})
	}else{
		req.flash("error", "You need to be logged in to do that");
		res.redirect("back");
	}
};

middlewareObj.isLoggedIn=function(req, res, next){
	if(req.isAuthenticated()){
		return next()
	}else{
		req.flash("error", "You need to be logged in to do that"); //沒登入，先有flash這個事件，然後導到login route（router.get("/login)），然後進入login.ejs，這個頁面的header有參數message，我們定義在app.js，他會帶出要flash的東西（"Please log in first"）
		res.redirect("/login")
	}
};




module.exports=middlewareObj;