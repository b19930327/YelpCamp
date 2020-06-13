var express = require("express");
var app=express();
var bodyParser=require("body-parser");
var mongoose=require("mongoose");
var flash=require("connect-flash");
var methodOverride=require("method-override");
var Campground=require("./models/campground"); //引入campground module
var Comment=require("./models/comment");
var passport=require("passport");
var LocalStrategy=require("passport-local");
var User=require("./models/user")
var seeds2DB=require("./seeds2");

var commentRoutes=require("./routes/comments");
var campgroundRoutes=require("./routes/campgrounds");
var indexRoutes=require("./routes/index");

// var url = process.env.DATABASEURL || "mongodb://localhost/yelp_camp_v12";
// mongoose.connect(url, {useNewUrlParser: true});
// env variable比較精簡的寫法，||表示「或」（前面的失效就會用後面的）

// seedDB();
seeds2DB();
mongoose.set("useUnifiedTopology", true);

mongoose.connect('mongodb+srv://noonhow:Tp6jo6cl6!@yelpcamp-lxiwx.mongodb.net/test?retryWrites=true&w=majority', {
	useNewUrlParser: true,
 	useCreateIndex: true
}).then(() =>{
	console.log("Connected!");
}).catch(err => {
	console.log("error!", err.message);
});

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public")) //__dirname是directory name，在這裡是/workspace/wdb/YelpCamp/v5。在這裡給他一個路徑可以連到css file，但在headers.ejs也要加link
app.use(methodOverride("_method"));

// passport config
app.use(require("express-session")({
	secret:"Ami is the best cat in the world",
	resave:false,
	saveUninitialized:false
}));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser=req.user;
	res.locals.error=req.flash("error");
	res.locals.success=req.flash("success");
	next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

// var campgroundSchema=new mongoose.Schema({
// 	name:String,
// 	image:String,
// 	description:String
// });

// var Campground=mongoose.model("Campground", campgroundSchema);

// Campground.create(
// 	{name:"Big Bear", 
// 	 image:"https://upload.wikimedia.org/wikipedia/commons/f/f3/Meow_cat_-_Mdebona.jpg"	,
// 	 description:"VERY SCARY CAT!"
// 	}, function(err, campground){
// 	if(err){
// 		console.log(err);
// 	}else{
// 		console.log("NEW CAMPGROUND ADDED!");
// 		console.log(campground);
// 	}
// })

// var campgrounds=[
// 		{name:"Big Bear", image:"https://upload.wikimedia.org/wikipedia/commons/f/f3/Meow_cat_-_Mdebona.jpg"},
// 		{name:"Tahoe", image:"https://www.campsitephotos.com/photo/camp/54300/feature_Little_Pee_Dee-f3.jpg"},
// 		{name:"Smokey Mountain", image:"https://www.campsitephotos.com/photo/camp/41049/feature_Tahkenitch-f2.jpg"},
// 		{name:"Big Bear", image:"https://upload.wikimedia.org/wikipedia/commons/f/f3/Meow_cat_-_Mdebona.jpg"},
// 		{name:"Tahoe", image:"https://www.campsitephotos.com/photo/camp/54300/feature_Little_Pee_Dee-f3.jpg"},
// 		{name:"Smokey Mountain", image:"https://www.campsitephotos.com/photo/camp/41049/feature_Tahkenitch-f2.jpg"},
// 		{name:"Big Bear", image:"https://upload.wikimedia.org/wikipedia/commons/f/f3/Meow_cat_-_Mdebona.jpg"},
// 		{name:"Tahoe", image:"https://www.campsitephotos.com/photo/camp/54300/feature_Little_Pee_Dee-f3.jpg"},
// 		{name:"Smokey Mountain", image:"https://www.campsitephotos.com/photo/camp/41049/feature_Tahkenitch-f2.jpg"}
// ];





// app.listen(3000,function(){
// 	console.log("Yelp Camp server starts!")
// })

const port = process.env.PORT || 3000;
const ip = process.env.IP || "127.0.0.1";
app.listen(port,function(){
    console.log("Server has started .... at port "+ port+" ip: "+ip);
});