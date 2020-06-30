//assumes window is not resized after loading
//may not be able to click on the extreme left boundary or extreme top
//no left/right scrolling capability
//scroll guarding breaks if clicking the scroll buttons too quickly
//keyboard can't do numbers or symbols
//keyboard may be wonky with multiple text areas

//global variable to store selection state
//0: none 		1: moveX		2: moveY
var state = 0;
var speed = 100;
var step = 20;
var paintTimer;
var elemClick;
var keyShowing;
var textElem;
var typing = false;
var capsLocked = false;

//tracking position of scan lines
var xPos = 0;
var yPos = 0;

function paint() {
	if (state == 0) {
		
	}
	if (state == 1) {
		//x scroll
		xPos = (xPos + step > $(window).width()) ? (0) : xPos + step;
		$("#vBar").css("left", xPos + "px");
	}
	
	if (state == 2) {
		//y scroll
		yPos = (yPos + step > $(window).height()) ? (0) : yPos + step;
		$("#hBar").css("top", yPos + "px");
	}
	
}


function simulateClick(elem) {
	if (!elem) return;

	var cEvent = document.createEvent("MouseEvents");
	cEvent.initEvent("click", true, true);
	elem.dispatchEvent(cEvent);
}


$(document).ready(
	function () {
		//create scroll lines and keyboard div
		$("body").append($("<div id = 'hBar'></div>"));
		$("body").append($("<div id = 'vBar'></div>"));
		$("body").append($("<div id = 'keyboardDiv'></div>"));
		
		//set the width and height to windowsize
		$("#hBar").width($(window).width());
		$("#vBar").height($(window).height());

		//create scroll and keyboard buttons
		$("body").append($("<button type = 'button' id = 'up'>Λ</button>"));
		$("body").append($("<button type = 'button' id = 'dn'>V</button>"));
		$("body").append($("<button type = 'button' id = 'keyShow'>K</button>"));
		
		//reposition buttons
		$("#up").css("bottom", "100px");
		$("#keyShow").css("bottom", "200px");
		
		//load keyboard, reposition, hide
		$('#keyboardDiv').load('https://sarahmorrisonsmith.com/accessibility/keyboard.html');
		$('#keyboardDiv').css("position", "fixed");
		$('#keyboardDiv').css("bottom", 0);
		$('#keyboardDiv').css("visibility", "hidden");
		$('#keyboardDiv').css("backgroundColor", "yellow");
		
		
		
		
		//when space is pressed
		$(document).keydown(
			function (ev) {
				if (ev.keyCode == 32) {					
					ev.preventDefault();
					
					//switch state
					state = (state + 1) % 3;
					
					//click and reset state
					if (state == 0) {
						//reset bars
						$("#vBar").css("top", "0");
						$("#vBar").css("left", "0");
						$("#hBar").css("top", "0");
						$("#hBar").css("left", "0");
						$("#vBar").css("visibility", "hidden");
						$("#hBar").css("visibility", "hidden");
						
						//click event
						elemClick = document.elementFromPoint(xPos, yPos);
						simulateClick(elemClick);
						
						//remember if element accepts text
						if ($(elemClick).is("input[type='text'], textarea")) {
							textElem = elemClick;
							typing = true;
						}
						
						else if ($(elemClick).is(".key") || $(elemClick).is("#keyShow")) {
							typing = true;
						}
						
						else {
							//no longer typing
							typing = false;
						}
						//reset position variables
						xPos = 0;
						yPos = 0;
						
						//clear timer
						clearInterval(paintTimer);
					}
					
					//horizontal scroll state
					if (state == 1) {
						//unhide vertical bar, scroll
						$("#vBar").css("visibility", "visible");
						paintTimer = setInterval(paint, speed);
					}
					
					if (state == 2) {
						//stop previous scrolling
						clearInterval(paintTimer);
						
						//unhide horiz bar, scroll
						$("#hBar").css("visibility", "visible");
						paintTimer = setInterval(paint, speed);
					}
				}
			}
		);
		
		//scrolling
		$("#up").click(
			function (ev) {
				//calculate new scroll position
				sPos = $(document).scrollTop() - $(document).height() * 0.1;
				sPos = (sPos < 0) ? 0 : sPos;
				
				$("html, body").animate({
					scrollTop: sPos
				}, 500);
			}
		);
		
		$("#dn").click(
			function (ev) {
				//calculate new position
				var prev = $(document).scrollTop();
				sPos = $(document).scrollTop() + $(document).height() * 0.1;
				sPos = (sPos > $(document).height() - $(window).height) ? prev : sPos;
				
				$("html, body").animate({
					scrollTop: sPos
				}, 500);
			}
		);
		
		//show hide keyboard
		$("#keyShow").click(
			function(ev) {
				if (!keyShowing) {
					$('#keyboardDiv').css("visibility", "visible");
					keyShowing = true;
				}
				else {
					$('#keyboardDiv').css("visibility", "hidden");
					keyShowing = false;
				}
			}
		);
		
		//keyboard letter click: delegated event
		$("#keyboardDiv").on("click", ".key",
			function (ev) {
				ev.stopPropagation();
				
				if ($(this).is(".key.caps")) {
					capsLocked = !capsLocked;
				}
				
				//is a letter and typing
				else if ($(this).is(".key.letter") && typing) {
					newChar = $(this).text().trim();
					if (!capsLocked) {
						newChar = newChar.toLowerCase();
					}
					
					$(textElem).val($(textElem).val() + newChar);
				}
				
				else if ($(this).is(".key.space") && typing) {
					$(textElem).val($(textElem).val() + " ");
				}
				
				else if ($(this).is(".key.backspace") && typing) {
					curStr = $(textElem).val();
					if (curStr.length > 0) {
						$(textElem).val(curStr.substring(0, curStr.length - 1));
					}
				}
			}
		);
	}
);