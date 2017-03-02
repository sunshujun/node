var express = require("express");
var router = express.Router();
var Category = require("../models/Categories");
var Content = require("../models/Contents.js");

var data;
router.use(function(req,res,next){
      data={
      	UserInfo: req.userInfo,
      	categories: [],
      }
       Category.find().then(function(rs) {
        data.categories = rs; 
    })
       next();
})
router.get("/", function(req, res) { 
        data.page=Number(req.query.page || 1);
        data.category=req.query.category||"";
        data.limit= 3;
        data.pages= 0;
        data.count=0; 
    var where={};
    if(data.category){
          where.type=data.category;
    }
   Content.where(where).count()
   .then(function(count) {
        data.pages = Math.ceil(count / data.limit);
        data.page = Math.min(data.pages, data.page);
        data.page = Math.max(1, data.page);
        var skip = (data.page - 1) * data.limit;
        return Content.find().where(where).sort({ _id: -1 }).limit(data.limit).skip(skip).populate(["type", "user"])
    }).then(function(contents) {
        data.contents = contents;
        res.render("../views/main/index", data);
    })
})

router.get("/view",function(req,res){
       var contentid=req.query.contentid||'';
       Content.findOne({_id:contentid}).then(function(rs){
       	 data.content=rs; 
       	 rs.views++;
              rs.save();
              res.render("../views/view/index",data);
       })
}) 
module.exports = router;
