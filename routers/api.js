var express=require("express");
var router=express.Router();
var User=require("../models/User.js");
var Content=require("../models/Contents.js")

var responseData;
router.use(function(req,res,next){
         responseData={
         	code:0,
         	message:""
         }
         next();
});
/*用户注册*/
router.post("/user/register",function(req,res,next){  
        var username=req.body.username;
        var password=req.body.password;
        var repassword=req.body.repassword;
        if(username==""||password==""){
        	 responseData.code=1;
        	 responseData.message="用户名或密码不能为空！";
        	 res.json(responseData);
        	 return;
        }
        if(password!=repassword){
        	responseData.code=2;
        	responseData.message="前后密码不一致！！！";
        	res.json(responseData);
        	return;
        }
        //验证用户是否已经被注册
        User.findOne({
        	username:username
        }).then(function(userInfo){ 
        	if(userInfo){ 
                     responseData.code=4;
                     responseData.message="该用户名已被注册！！"
                     res.json(responseData); 
        	        return;
        	}
        	var user=new User({username:username,password:password});
        	return user.save();
        })
        .then(function(newuser){ 
        	responseData.message="用户注册成功！！";
        	res.json(responseData); 
        	return;
        }) 
})

/*登录验证*/
router.post("/user/login",function(req,res,next){
	var username=req.body.username;
	var password=req.body.password;
	if(username==""||password==""){
		responseData.code=1;
		responseData.message="用户名或者密码不能为空！！！";
		res.json(responseData);
		return;
	}
	User.findOne({
		username:username,
		password:password
	}).then(function(userInfo){
		if(!userInfo){
                                  responseData.code=2;
                                  responseData.message="用户名或者密码错误！！！";
                                  res.json(responseData);
                                  return;
		} 
		responseData.userInfo={
			_id:userInfo._id,
			username:userInfo.username
		}
           req.cookies.set("userInfo",JSON.stringify({
                    _id:userInfo._id,
                    username:userInfo.username
                }))
		responseData.message="用户登陆成功！！!";
		res.json(responseData);
		return
	})
})

/*退出登录*/
router.get("/user/logout",function(req,res){
     req.cookies.set("userInfo",null);
     responseData.message="用户退出成功！！！";
     res.json(responseData);
     return;
})

/*
  刷新加载评论
*/
router.get("/comments",function(req,res){
      Content.findOne({_id:req.query.contentId})
         .then(function(content){  
               responseData.content=content;
               res.json(responseData);
           })
})
/*
  评论提交
*/
router.post("/comments/post",function(req,res){
     var comments={
                username:req.userInfo.username,
                postTime:new Date(),
                content:req.body.content
           };
     Content.findOne({_id:req.body.contentId})
     .then(function(content){
           content.comments.push(comments);
           return content.save();
     }) 
     .then(function(newContent){ 
           var responseData={};
           responseData.message="评论成功！";
           responseData.content=newContent
           res.json(responseData);
       })
})
module.exports=router;