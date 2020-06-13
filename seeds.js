var mongoose=require("mongoose");
var Campground=require("./models/campground");
var Comment=require("./models/comment");

var data=[
	{
		name:"Benz Meow",
		image:"https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQtXD8yWFccwsEcBv86QJOyLjDv1IYBAXvMWKrPRmnKDLovY2o8&usqp=CAU",
		description:"There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc."
	},
	{
		name:"Ginger Cat",
		image:"https://i1.wp.com/thecatsmeownw.com/wp-content/uploads/2014/04/Orange.jpg?fit=688%2C456&ssl=1",
		description:"There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc."
	},
	{
		name:"Black Cat",
		image:"https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTiPQR4MnUCbdIfzNGcFFULunUByFwMZ4imzkg2PFZWitPgCvqg&usqp=CAU",
		description:"There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc."
	}
];

mongoose.set("useUnifiedTopology", true);
mongoose.connect('mongodb://localhost:27017/yelp_camp_v5', { useNewUrlParser: true });


function seedDB(){
	//Remove all campgrounds
	Campground.remove({}, function(err){
		if(err){
			console.log(err)
		}else{
			console.log("removed campgrounds!");
			// Add a few new campgrounds
			data.forEach(function(seed){
				Campground.create(seed, function(err, addedData){
					if(err){
						console.log(err)
					}else{
						console.log("added a campground!");
						//Add a few new comments
						Comment.create(
							{
								text:"meow meow meow meowwwww",
								author:"Christy"
							}, function(err, comment){
								if(err){
									console.log(err)
								}else{
									addedData.comments.push(comment);
									addedData.save();
									console.log("created a new comment!")
								}
							})
					}
				})
			})
		}
	})
}

module.exports=seedDB;
