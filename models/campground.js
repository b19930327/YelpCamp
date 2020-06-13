var mongoose=require("mongoose");

mongoose.set("useUnifiedTopology", true);
mongoose.connect('mongodb://localhost:27017/yelp_camp_v12', { useNewUrlParser: true });

var campgroundSchema=new mongoose.Schema({
	name:"String",
	price:"String",
	image:"String",
	description:"String",
	author:{
		id:{
			type:mongoose.Schema.Types.ObjectId,
			ref:"User"
		},
		username:"String"
	},
	comments:[
		{
			type:mongoose.Schema.Types.ObjectId,
			ref:"Comment"
		}
	]
});

module.exports=mongoose.model("Campground", campgroundSchema);