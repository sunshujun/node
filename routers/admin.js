var express=require("express");
var router=express.Router();

var User=require('../models/User');
var Category=require('../models/Categories');
var Content=require("../models/Contents.js")

 router.get("",function(req,res,next){ 
 	res.render("../views/admin/index.html",{
 		userInfo:req.userInfo
 	})
 })

/*
  查找全部的用户信息
*/ 
  router.get("/user",function(req,res,next){
  	var page=Number(req.query.page||1);
  	var limit=2;
  	var pages=0;
  	User.count().then(function(count){
  	     pages=Math.ceil(count/limit);
  	     page=Math.min(pages,page);
  	     page=Math.max(1,page);
  	     var skip=(page-1)*limit;
  	     User.find().sort({_id:-1}).limit(limit).skip(skip).then(function(users){
  	     	res.render("../views/admin/user_index.html",{
		 		userInfo:req.userInfo,
		 		users:users,
		 		page:page,
		 		count:count,
		 		pages:pages,
		 		limit:limit,
                        type:"user"
		 	})
  	     })
  	})
  })
  /*
    用户分类
  */
  router.get("/category/add",function(req,res,next){
    res.render("../views/admin/category_add",{
      userInfo:req.userInfo
    })
  })
  router.get("/category",function(req,res,next){
  	var page=Number(req.query.page||1);
    var limit=2;
    var pages=0;
    Category.count().then(function(count){
         pages=Math.ceil(count/limit);
         page=Math.min(pages,page);
         page=Math.max(1,page);
         var skip=(page-1)*limit;
        Category.find().limit(limit).skip(skip).then(function(categories){
              res.render("../views/admin/category_index.html",{
              userInfo:req.userInfo,
              categories:categories,
              page:page,
              count:count,
              pages:pages,
              limit:limit,
              type:"category"
            })
         })
    })
  }) 

  /*
    添加分类名称
  */
 router.post("/category/add",function(req,res,next){
 	var name=req.body.name;
 	if(name==""){
 	      res.render("../views/admin/error",{
  		userInfo:req.userInfo,
  		message:"分类类名不能为空"
      	});
        return;
 	}  
      Category.findOne({name:name})
      .then(function(category){
          if(category){
                   res.render("../views/admin/error",{
                    userInfo:req.userInfo,
                    message:"该类名已存在！"
                    });
                return Promise.reject();
          }else{
             return new Category({name:name}).save();
          }
      })
      .then(function(rs){
         res.render("../views/admin/success",{
            userInfo:req.userInfo,
            message:"分类保存成功",
            url:"/admin/category/index"
         })
      })
     
 })

 /*
* 分类修改
* */
router.get('/category/edit', function(req, res) {

    //获取要修改的分类的信息，并且用表单的形式展现出来
    var id = req.query.id || '';

    //获取要修改的分类信息
    Category.findOne({
        _id: id
    }).then(function(category) {
        if (!category) {
            res.render('admin/error', {
                userInfo: req.userInfo,
                message: '分类信息不存在'
            });
        } else {
            res.render('admin/category_edit', {
                userInfo: req.userInfo,
                category: category
            });
        }
    })

});

/*
* 分类的修改保存
* */
router.post('/category/edit', function(req, res) {

    //获取要修改的分类的信息，并且用表单的形式展现出来
    var id = req.query.id || '';
    //获取post提交过来的名称
    var name = req.body.name || '';

    //获取要修改的分类信息
    Category.findOne({
        _id: id
    }).then(function(category) {
        if (!category) {
            res.render('admin/error', {
                userInfo: req.userInfo,
                message: '分类信息不存在'
            });
            return Promise.reject();
        } else {
            //当用户没有做任何的修改提交的时候
            if (name == category.name) {
                res.render('admin/success', {
                    userInfo: req.userInfo,
                    message: '修改成功',
                    url: '/admin/category'
                });
                return Promise.reject();
            } else {
                //要修改的分类名称是否已经在数据库中存在
                return Category.findOne({
                    _id: {$ne: id},
                    name: name
                });
            }
        }
    }).then(function(sameCategory) {
        if (sameCategory) {
            res.render('admin/error', {
                userInfo: req.userInfo,
                message: '数据库中已经存在同名分类'
            });
            return Promise.reject();
        } else {
            return Category.update({
                _id: id
            }, {
                name: name
            });
        }
    }).then(function() {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '修改成功',
            url: '/admin/category'
        });
    })

});

/*
* 分类删除
* */
router.get('/category/delete', function(req, res) {

    //获取要删除的分类的id
    var id = req.query.id || '';

    Category.remove({
        _id: id
    }).then(function() {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '删除成功',
            url: '/admin/category'
        });
    });

});

/*
  内容content
*/

/*
内容添加
*/
router.get("/content/add",function(req,res){
    Category.find().then(function(categories){ 
        res.render("../views/admin/content_add.html",{
          userInfo:req.userInfo,
          categories:categories
        })
    }) 
})
/*内容首页*/
router.get("/content",function(req,res){
   var page=Number(req.query.page||1);
    var limit=2;
    var pages=0;
    Content.count().then(function(count){
         pages=Math.ceil(count/limit);
         page=Math.min(pages,page);
         page=Math.max(1,page);
         var skip=(page-1)*limit;
        Content.find().sort({_id:-1}).limit(limit).skip(skip).populate(["type","user"]).then(function(contents){
              res.render("../views/admin/content_index.html",{
              userInfo:req.userInfo,
              contents:contents,
              page:page,
              count:count,
              pages:pages,
              limit:limit,
              type:"content"
            })
         })
    })
})  
/*
 内容提交保存
*/
router.post("/content/add",function(req,res){ 
   if(!req.body.type){
       res.render("../views/admin/error.html",{
        userInfo:req.userInfo,
        message:"内容分类不能为空"
       })
       return;
   }
    if(!req.body.title){
       res.render("../views/admin/error.html",{
        userInfo:req.userInfo,
        message:"内容标题不能为空"
       })
       return;
   }
   new Content({
       type:req.body.type,
       title:req.body.title,
       user:req.userInfo._id,
       description:req.body.description,
       content:req.body.content
   }).save().then(function(rs){
         res.render("../views/admin/success.html",{
        userInfo:req.userInfo,
        message:"内容保存成功",
        url:"/admin/content"
       })
   })
})

/*
 内容删除
*/
router.get("/content/delete",function(req,res){
  var id=req.query.id||"";
    Content.remove({_id:id}).then(function(){
        res.render("../views/admin/success",{
          message:"内容删除成功",
          url:"/admin/content"
        })
    })
})
/*
 内容修改
*/
router.get("/content/edit",function(req,res){
  var id=req.query.id||""; 
  Category.find().then(function(categories){
      Content.findOne({_id:id}).populate("type").then(function(content){  
         res.render("../views/admin/content_edit",{
             content:content,
             categories:categories
         })
      })
  }) 
})
router.post("/content/edit",function(req,res){
        if(!req.body.type){
             res.render("../views/admin/error.html",{
              userInfo:req.userInfo,
              message:"内容分类不能为空"
             })
             return;
         }
          if(!req.body.title){
             res.render("../views/admin/error.html",{
              userInfo:req.userInfo,
              message:"内容标题不能为空"
             })
             return;
         }
         Content.update({_id:req.body.id},{
             type:req.body.type,
             title:req.body.title,
             description:req.body.description,
             content:req.body.content
         }).then(function(){
           res.render("../views/admin/success.html",{
              message:"数据修改成功！",
              url:"/admin/content"
           });
         })
})
module.exports=router;