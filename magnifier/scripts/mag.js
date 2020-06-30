//refactor window does not account for window height

//global vars: dynamic
var mag = 1.0;
var crtlDown = false;
var scrolling = false;
var scrollTimer;
var wUnscaled;
var hUnscaled;
var ref = false;

//constants
var LEFT = 0;
var RIGHT = 1;
var scrollMargin = 100;
var scrollDelay = 50;
var scrollAmount = 20;

function changeZoom() {
	if (crtlDown) {		
		//scale and update width
		//https://www.w3schools.com/cssref/css3_pr_transform-origin.asp
		$("body").css("transform", "scale(" + mag + ")");
		$("body").width(wUnscaled * mag);
		wOffset = (wUnscaled * (mag - 1) / 2) + "px";
		hOffset = (hUnscaled * (mag - 1) / 2) + "px";
		
	}
	else {					
		document.body.style.zoom = mag;
	}
};

//0 = left, 1 = right
function scrollWin(dir) {
	//get current position
	
	
	var cur = $(document).scrollLeft();
	
	if (dir == LEFT) {
		$(document).scrollLeft(cur - scrollAmount);
	}
	else {
		$(document).scrollLeft(cur + scrollAmount);
	}
};


$(document).ready(
	function () {
		//set original body width and set relative positioning
		wUnscaled = $("body").width();
		hUnscaled = $("body").height();
		$("body").css("position", "relative");		
		
		//create a refactor window, set to hidden
		$("body").append($("<div id = 'refWindow'></div>"));
		$("#refWindow").css("visibility", "hidden");
		
		//hover event: refactor
		$(":not(body)").hover(
			function (ev) {
				//on entry: stop propagation
				ev.stopPropagation();
				
				//refactor window
				if (ref) {
					//only non-images
					var target = $(ev.target);
					if (!target.is("img")) {
						//populate the box and set to visible
						$("#refWindow").html($(this).html());
						$("#refWindow").css("visibility", "visible");
						
						//place the element based on windown size
						refOffset = ($(window).width() * 0.1) + "px";
						$("#refWindow").css("left", refOffset);
						$("#refWindow").css("width", $(window).width() * 0.8);
					}
					
					else {
						//hide the window
						$("#refWindow").css("visibility", "hidden");
						console.log("is image");
					}
				}
			},
			
			function (ev) {
				//on exit: set to hidden
				$("#refWindow").css("visibility", "hidden");
			}
		);
		
		
		//global magnification
		$(document).keydown(
			function (ev) {	
				//+, - keys
				if (ev.keyCode == 187) {	//+
					ev.preventDefault();
					mag += 0.1;
					changeZoom();
				}
				else if (ev.keyCode == 189) {	//-
					ev.preventDefault();
					mag -= 0.1;
					changeZoom();
				}
				
				//crtl pressed
				else if (ev.keyCode == 17) {
					crtlDown = true;
				}
				
				//space pressed
				else if (ev.keyCode == 32) {
					ev.preventDefault();
					ref = !ref;
				}
				
				//weird key
				else {
					console.log("weird key press");
				}
			}
		);
		
		//crtl released
		$(document).keyup(
			function (ev) {
				if (ev.keyCode == 17) {
					crtlDown = false;
				}
			}
		);
		
		//mouse move: check if scroll
		$(document).mousemove(
			function (ev) {
				//if doc is wider than windwo
				if ($(document).width() > $(window).width()) {
					//scroll left		
					if (ev.clientX <= scrollMargin) {
						if (!scrolling) {
							//https://stackoverflow.com/questions/457826/pass-parameters-in-setinterval-function
							scrollTimer = setInterval(function(){scrollWin(LEFT);}, scrollDelay);
							scrolling = true;
						}
					}
					
					//right
					else if ($(window).width() - ev.clientX <= scrollMargin) {
						if (!scrolling) {
							scrollTimer = setInterval(function(){scrollWin(RIGHT);}, scrollDelay);
							scrolling = true;
						}
						
					}
					
					//clear scroll timer
					else if (scrolling) {
						clearInterval(scrollTimer);
						scrolling = false;
					}					
				}
			}
		);
	}
);






















