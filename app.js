/*
  应用程序的入口
*/
var express=require("express");
var app=express(); 
var bodyParser=require("body-parser");
var Cookies=require("cookies");
var User=require("./models/User.js");

//初始化数据库
var mongoose=require("mongoose");
//设置文件静态托管
app.use("/public",express.static(__dirname+"/public")); 
  
//bodyparser设置 
app.use(bodyParser.urlencoded({extended:true})); 
//设置cookies
app.use(function(req,res,next){
        req.cookies=new Cookies(req,res); 
        req.userInfo={} 
        if(req.cookies.get("userInfo")){
              try{
                    req.userInfo=JSON.parse(req.cookies.get("userInfo")); 
                    User.findById(req.userInfo._id).then(function(userInfo){ 
                    req.userInfo.isAdmin=Boolean(userInfo.isAdmin);  
                      next();
                    }) 
                  
              }catch(e){
                     next()
              }
        }else{
        	   next();
        	} 
})
//设置模块处理
var swig=require("swig");
app.engine("html",swig.renderFile);
app.set("views","./views");
app.set("view engine","html");

//取消模板缓存
swig.setDefaults({cache:false});


/*app.get("/admin",function(req,res,next){
	// res.send("<h1>hello,欢迎访问我的博客</h1>")
	res.render("index");
}) 
app.get("/public/main.css",function(req,res,next){
	console.log(__dirname);
	res.setHeader("content-type","text/css");
	res.send("body{background:red}");
})
*/ 
app.use("/admin",require("./routers/admin"));
app.use("/api",require("./routers/api")); 
app.use("/",require("./routers/main.js"));

mongoose.connect("mongodb://localhost:27018/blog",function(err){
	if(err){
		console.log("数据库连接失败");
	}else{
		console.log("数据库连接成功");
		app.listen(8081);
	}
})