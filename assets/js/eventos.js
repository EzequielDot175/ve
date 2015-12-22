(function($){

	$.fn.galeria = function(){


	}

})(jQuery);

$(document).ready(function(){

	
    
});


 function nombre(current){

	

}

//footer
	$(window).resize(function() {
		var windowHeight = $(window).height();
		if(windowHeight > 500){
			$('.footer').css('position', 'fixed');
			$('.data').css('margin-bottom', '100px');
		}else{
			$('.footer').css('position', 'relative');
		}
	});

	var windowHeight = $(window).height();
	console.log(windowHeight);
	if(windowHeight > 500){
		$('.footer').css('position', 'fixed');
		$('.data').css('margin-bottom', '100px');
	}else{
		$('.footer').css('position', 'relative');
	}