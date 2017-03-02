var mongoose=require("mongoose");
var cateSchema=require("../schemas/category");
module.exports=mongoose.model("Category",cateSchema);