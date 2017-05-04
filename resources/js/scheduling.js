window.onbeforeunload = function () {
 	if((window.location.href).indexOf("schedule") > -1 ) {
    	return "";
	}
 };
function disableF5(e) {
	if((window.location.href).indexOf("schedule") > -1 ) {
	    	if ((e.which || e.keyCode) == 116) e.preventDefault();
	}
}

$(document).on("keydown", disableF5);

//blocking previous dates

var input = document.getElementById("startDate");
var today = new Date();
var day = today.getDate();
// Set month to string to add leading 0
var mon = new String(today.getMonth()+1); //January is 0!
var yr = today.getFullYear();

if(mon.length < 2) { mon = "0" + mon; }
if(day.toString().length < 2) { day = "0" + day; }
var date = new String( yr + '-' + mon + '-' + day );
input.disabled = false;
input.setAttribute('min', date);
