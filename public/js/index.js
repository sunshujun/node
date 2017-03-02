$(function(){ 
     var $login=$("#loginBox");
     var $register=$("#registerBox");
     var $userInfo=$("#userInfo");
     var $logout=$("#logout");
    //切换用户注册栏
     $login.find(".colMint").on("click",function(){
             $login.hide();
             $register.show();
     }) 
     //切换用户登录栏
     $register.find(".colMint").on("click",function(){
     	$register.hide();
     	$login.show(); 
     })
      /*
    // 退出登录
    $userInfo.find("#logout").on("click",function(){
    	$userInfo.hide();
    	$login.show();
    })*/
   //用户注册，发送请求
    $register.find("button").on("click",function(){
    	$.ajax({
    		type: 'post',
	     	url: '/api/user/register', 
	     	dataType: 'json',
	     	data: {
	                        username: $register.find('[name="username"]').val(),
	                        password:$register.find('[name="password"]').val(),
	                        repassword:$register.find('[name="repassword"]').val()
	     	},
	     	success:function(data){
	     		$register.find(".colWarning").html(data.message);
	                       if(!data.code){
	                       	 setTimeout(function(){
	                       	      window.location.reload();
	                       	 },1000)
	                       }
	     	}
	     }) 
    })
    //用户登录，发送请求
    $login.find("button").on("click",function(){
    	$.ajax({
    		url: '/api/user/login',
    		type: 'post',
    		dataType: 'json',
    		data: {
    			username:$login.find('[name="username"]').val(),
    			password:$login.find('[name="password"]').val()
    		},
    		success:function(data){
    		     $login.find(".colWarning").html(data.message);
    		     if(!data.code){ 
    		     	$userInfo.find(".colDark").html(data.userInfo.username);
    		     	setTimeout(function(){
                                             window.location.reload();
    		     	},1000)
    		     }
    		}
    	}) 
    })
    //用户退出登录
    $logout.on("click",function(){
        $.ajax({
            url:"api/user/logout",
            type:"GET",
            dataType:"json",
            success:function(data){ 
                window.location.reload();
            }
        })
    })
})