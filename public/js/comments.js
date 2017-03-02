var prepage=4;
var page=1;
var pages=0;
var comments=[];
/*
 提交评论
*/
$("#messageBtn").click(function(event) { 
       $.ajax({
      	url: '/api/comments/post',
      	type: "POST", 
      	data: {
      		content:$("#messageContent").val(),
      		contentId:$("#contentId").val()
      	}, 
      })
      .done(function(responseData) {
      	$("#messageContent").val('');
      	 comments=responseData.content.comments.reverse();
      	showComments(responseData.content.comments.reverse());
      }) 
});

 //每次页面重载的时候获取一下该文章的所有评论
$.ajax({
	url: '/api/comments', 
	 data: {contentId:$("#contentId").val()},
})
.done(function(responseData) {
          comments=responseData.content.comments.reverse();
          showComments(responseData.content.comments.reverse());
})

/*
  分页跳转
*/
 
$(".pager").delegate("a","click",function(){ 
	 page=Number($(this).attr("page"));
	 showComments(comments);
});
function showComments(comments){  
	var html="";
	var $li=$(".pager li");
	$("#messageCount").html(comments.length);
	pages=Math.max(1,Math.ceil(comments.length/prepage));
	$li.eq(1).html(page+"/"+pages);
	if(page<=1){
	   $li.eq(0).html("<span>没有上一页</span>");
	}else{
	   $li.eq(0).html("<a href='javascript:void(0)' page='"+(page-1)+"'>上一页</a>"); 
	}
	if(page>=pages){
	   $li.eq(2).html("<span>没有下一页</span>");
	}else{
	   $li.eq(2).html("<a href='javascript:void(0)' page='"+(page+1)+"'>下一页</a>"); 
	}
	/*comments.forEach(function(item,index){
	    html += '<div class="messageBox">'+
                '<p class="name clear"><span class="fl">'+item.username+'</span><span class="fr">'+ formatDate(item.postTime)+'</span></p><p>'+item.content+'</p>'+
                '</div>';
	});*/
            var start=(page-1)*prepage; 
             var end=Math.min(page*prepage,comments.length);
            if(comments.length==0){
                       $(".messageList").html('<p>还没有留言</p>');
            }else{ 
	            for(var i=start;i<end;i++){
	            	    html += '<div class="messageBox">'+
	                '<p class="name clear"><span class="fl">'+comments[i].username+'</span><span class="fr">'+ formatDate(comments[i].postTime)+'</span></p><p>'+comments[i].content+'</p>'+
	                '</div>';
	            }
	            $(".messageList").html(html);
            } 
}

function formatDate (d) {  
     var date=new Date(d);
     return date.getFullYear()+"年"+(date.getMonth()+1)+"月"+date.getDate()+"日  "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds()
}; 