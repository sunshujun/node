var mongoose=require("mongoose");

//用户的表结构
module.exports= new mongoose.Schema({
       type:{
       	type:mongoose.Schema.Types.ObjectId,
       	ref:"Category"
       },
       title:String,
       user:{
              type:mongoose.Schema.Types.ObjectId,
              ref:"User"
       },
       time:{
              type:Date,
              default:new Date()
       },
       count:{
              type:Number,
              default:0
       },
       description:{
       	type:String,
       	default:""
       },
       views:{
       	type:String,
       	default:0
       },
       comments:{
              type:Array,
              default:[]
       }
})
