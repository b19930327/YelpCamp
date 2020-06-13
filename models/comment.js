var mongoose=require("mongoose");

mongoose.set("useUnifiedTopology", true);
mongoose.connect('mongodb://localhost:27017/yelp_camp_v12', { useNewUrlParser: true });

var commentSchema= mongoose.Schema({
	text:"String",
	author:{
		id:{
			type:mongoose.Schema.Types.ObjectId,
			ref:"User"
		},
		username:"String"
	}
});

module.exports=mongoose.model("Comment", commentSchema);