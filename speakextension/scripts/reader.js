//when going from parent node to child node, parent highlight is removed
//to use, spacebar must be pressed before hover in order to speak

//global variable to store speaking state
var speak = false;

$(document).ready(
	function () {
		//attach hover event
		$("*:not(body)").hover(
			function (ev) {
				//on entry: remove highlights/stop speech
				ev.stopPropagation();
				speechSynthesis.cancel();
				$(".highlight").removeClass('highlight');
				
				//then add highlight
				$(this).addClass("highlight");
				if (speak == true) {
					//check if is image: from
					//https://api.jquery.com/is/
					var target = $(ev.target);
					if (target.is("img")) {
						//speak alt text or filename
						var alttext = $(this).attr("alt");
						var srcofimg = $(this).attr("src");
						
						if ($(this).attr('alt')) {
							speechSynthesis.speak(new SpeechSynthesisUtterance($(this).attr('alt'))); 
						}
						else {
							speechSynthesis.speak(new SpeechSynthesisUtterance($(this).attr('src'))); 
						}	
					}
					
					else {
						//run speech on current element
						speechSynthesis.speak(new SpeechSynthesisUtterance($(this).text()));
					}
				}
			},
			
			function (ev) {
				//on exit: remove current highlight, stop speech
				$(this).removeClass('highlight');
				speechSynthesis.cancel();
			}
		);
		
		//only speak on spacebar
		$(document).keydown(
			function (e) {
				//checking target from
	//https://stackoverflow.com/questions/22559830/html-prevent-space-bar-from-scrolling-page
				if ((e.keyCode == 0 || e.keyCode == 32) 
					&& e.target == document.body) {
					
					e.preventDefault();
					speak = !speak;
					
					//if currentlly speaking, immediately stop
					if (speak == false) {
						speechSynthesis.cancel();
					}
				}
			}
		);
	}
);