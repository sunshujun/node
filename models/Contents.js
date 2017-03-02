var mongoose=require("mongoose");
var cateSchema=require("../schemas/contents");
module.exports=mongoose.model("Contents",cateSchema);