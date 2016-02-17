/*
 DIV Calendaring - v0.1 
 Author: Rocky D. Bevins 2011 (moreoutput@gmail.com) 
*/
var DCalendar = function(nodeId, dateOptions) {
	// names of the months, currently unused
	var monthName = ['January','February','March','April','May','June','July', 'August','September','October','November','December'];
		
	this.dayName = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];		
	this.month = null; // month object
	this.monthNumber = null; // integer of current month
	this.firstDay = null; // interger of top-left most day number
	this.lastDay = null; // integer of bottom-right most day number
	this.today = null; // todays date
	this.totalDays = 42; 
	this.totalWeeks = this.totalDays / 7;  // total week divs
	this.dates = new Array(); // array of dates
	this.year = null; // year		
	
	var d = new Date();		
	this.monthNumber = d.getMonth();
	this.year = d.getFullYear(); 
	this.today = this.year + '-' + d.getDate() + '-' + (this.monthNumber + 1); 

	var node = document.getElementById(nodeId);	
	
	this.month = new CalendarMonth(d);
	this.dayName.reverse();
	// Working out a wrapper for day labels
	var dayLabels = document.createElement('div');
	dayLabels.id = 'daylabels';
	htmlStr = '';
	
	for (var i = 0; i < this.dayName.length; i+=1) { // Day Labeling
		htmlStr +=  '<div class="dayname">' + this.dayName[i] + '</div>';
	}

	dayLabels.innerHTML = htmlStr;	
	node.appendChild(dayLabels);
	
	for (var i = 0; i < this.month.weeks.length; i+=1) {
		var wkNode = document.createElement('div');
		wkNode.id = 'week-' + i;
		wkNode.className = 'week';	
		node.appendChild(wkNode);	
	}
	
	var cnt = 0;

	for (var i = 0; i < this.month.weeks.length; i+=1) {
		var wkNode = document.getElementById('week-' + i);
		for (var j=0; j < 7; j+=1) {
			// application of day class name
			var dayNode = document.createElement('div');
			dayNode.id = cnt++;
			dayNode.className = this.month.weeks[i].days[j].className;	
			dayNode.innerHTML = '<div class="daylabel">' + this.month.weeks[i].days[j].day + '</div>';
						
			wkNode.appendChild(dayNode);	
		}
	}		
	
	// adding IDs to the dates				
	this.firstDay = this.month.weeks[0].days[0].day;
	this.lastDay = this.month.weeks[4].days[6].day;
	
	d.setMonth(this.monthNumber);
	d.setDate(0);
			
	// dates prefixed to this month
	if (this.dates.length == 0) { 
		if (this.month.startDate.getMonth() != this.monthNumber) {
			for (var i = 0; i < this.month.startDay; i+=1) {
				var monthNum = (this.month.startDate.getMonth() + 1), dayNum = this.firstDay + i;
		
				if (monthNum.toString().length === 1) {
					monthNum = '0' + monthNum.toString();
				}
				
				if (dayNum.toString().length === 1) {
					dayNum = '0' + dayNum.toString();
				}
	
		 		this.dates.push(this.month.startDate.getFullYear() + '-' +
		 		monthNum +	'-' + dayNum);
		 	}
		 }
	}

	// dates for this month
	for (var i = 0; i < this.month.numOfDays; i+=1) {
		var monthNum = (this.month.startDate.getMonth() + 2), dayNum = i+1;			
		
		if (monthNum.toString().length === 1) {
			monthNum = '0' + monthNum.toString();
		}
		
		if (dayNum.toString().length === 1) {
			dayNum = '0' + dayNum.toString();
		}
		
		this.dates.push(this.month.startDate.getFullYear() + '-' +
		monthNum + '-' + dayNum);
	}

	// dates for next month
	for (var i = 0; i < this.month.endDay; i+=1) {
		var monthNum = (this.month.startDate.getMonth() + 3), dayNum = i+1;			
		
		if (monthNum.toString().length === 1) {
			monthNum = '0' + monthNum.toString();
		}
		
		if (dayNum.toString().length === 1) {
			dayNum = '0' + dayNum.toString();
		}
		
		this.dates.push(this.month.startDate.getFullYear() + '-' +
		monthNum + '-' + dayNum);
	}

	cnt = 0;
	var monthNum = 0;
	for (var i = 0; i < this.totalDays; i+=1) { // Day Labeling
		var dayNode = document.getElementById(cnt++), monthNum = this.monthNumber + 1;
			dayNode.id = this.dates[i]; 	
			// TODO we need to put the actual CSS id in the object
			//this.month.week[].day.dateId = //
	}				
		
};

DCalendar.prototype.topWeek = function() {
 /*
 	Calulates past week based on this.month.startDate
 	// updates:
 		this.month.startDate
 		this.firstDay
 		this.totalWeeks
 		this.totalDays
 */

	this.totalWeeks = this.totalWeeks +1;
	this.totalDays = this.totalDays + 7;

	var d = new Date(); 
	d.setDate(0);
	
	var lastDay = d.getDate() - 7;
	d.setDate(this.firstDay - 7);	

	for (var i = 0; i < this.month.weeks.length; i+=1) {
		this.month.weeks[i].weekNum = this.month.weeks[i].weekNum + 1;
	}

	var dayArr = new Array();
	var lDay = d.getDate();

	for (var i = 0; i < 7; i++) {
		dayArr[i] = lDay++;
	}

	var newWk = new CalendarWeek(0,dayArr);
	this.month.weeks.unshift(newWk);
	
	this.firstDay = this.month.weeks[0].days[0].day;
	
	
	this.month.startDate.setDate(this.month.startDate.getDate() - 7);
	for (var i = 0; i < 7; i++) {
		var monthNum = this.month.startDate.getMonth() + 1, 
		dayNum = this.month.startDate.getDate();
		
		if (monthNum.toString().length === 1) {
			monthNum = '0' + monthNum.toString();
		}
		
		if (dayNum.toString().length === 1) {
			dayNum = '0' + dayNum.toString();
		}
		
		this.dates.unshift(this.month.startDate.getFullYear() + '-' + 
		monthNum + '-' + dayNum);
	}
	
};

DCalendar.prototype.bottomWeek = function() {
 /*
 	Calulates past week based on this.month.startDate
 	// updates:
 		this.month.endDate
 		this.lastDay
 		this.totalWeeks
 		this.totalDays
 */

	this.totalWeeks = this.totalWeeks+1;
	this.totalDays = this.totalDays + 7;
			
	var lDay = this.month.endDate.getDate() + 1;
	var dayArr = new Array();
	
	for (var i = 0; i < 7; i++) {
		dayArr[i] = lDay++;

	}
		console.log(dayArr);
	var newWk = new CalendarWeek(0,dayArr);
	this.month.weeks.unshift(newWk);

	this.lastDay = this.month.weeks[0].days[0].day;		

	for (var i = 0; i < 7; i++) {
		var monthNum = this.month.endDate.getMonth() + 1, 
		dayNum = this.month.endDate.getDate() + i + 1;

		if (monthNum.toString().length === 1) {
			monthNum = '0' + monthNum.toString();
		}
		
		if (dayNum.toString().length === 1) {
			dayNum = '0' + dayNum.toString();
		}

		this.dates.push(this.month.startDate.getFullYear() + '-' + 
		monthNum + '-' + dayNum);
		
	}
	
	this.month.endDate.setDate(this.month.endDate.getDate() + 7);
	
	console.log(this.month.endDate);
};

//Rendering,  DOJO integration begins with the display
DCalendar.prototype.render = function(pos) { 
	for (var i = 0; i < 1; i+=1) {
		var wkNode = document.createElement('div');

		wkNode.className = 'week';

		if (pos === 'start') {
			wkNode.id = 'week-0';
			dojo.query('.week:first-child').place(wkNode,'before');
					
			for (var i=0; i < 7; i+=1) {
				var dayNode = document.createElement('div');
				dayNode.id = this.dates[i];
				dayNode.className = this.month.weeks[0].days[i].className;	
				dayNode.innerHTML = '<div class="daylabel">' + this.month.weeks[0].days[i].day + '</div>';
				wkNode.appendChild(dayNode);	
			}	
			// TODO FIX week ID numbers
			dojo.query('#week-0').addContent(wkNode,'first');
		} else {
			wkNode.id = 'week-' + this.totalWeeks;
			
			for (var i=0; i < 7; i+=1) {
				var dayNode = document.createElement('div');
				dayNode.id = this.dates[(this.dates.length - 7) + i];
				dayNode.className = this.month.weeks[0].days[i].className;	
				dayNode.innerHTML = '<div class="daylabel">' + this.month.weeks[0].days[i].day + '</div>';
				wkNode.appendChild(dayNode);	
			}	

			dojo.query('.week:last-of-type').addContent(wkNode,'after');
		}
	}
};

/*
CalendarMonth 
*/
var CalendarMonth = function(dateObj) {	
	this.startDate = new Date(); // date object set to top-left most day
	this.endDate = new Date(); // date object set to bottom-right most day
	this.startDay = null; // date of the week the month (1st) begins on (0-6)
	this.endDay = null; // day of the week the month ends on (0-6)
	this.numOfDays = null; // Days in this month
	
		
	var weekArr = new Array();
	var dayArr = new Array(); // Array of dates
	var monthNum = dateObj.getMonth(); // current month number
	
	dateObj.setMonth(monthNum+1); // move to next month to easily get max days
	dateObj.setDate(0);
	
	this.numOfDays = dateObj.getDate(); 
	
	dateObj.setMonth(monthNum); // Back to the current month
	dateObj.setDate(1); // beginning of current month

	this.startDay = dateObj.getDay(); // what day of the week the first is on

	dateObj.setMonth(monthNum);
	dateObj.setDate(0);

	var tDate = parseInt(dateObj.getDate());
	var cnt = 0;
	
	for (var i = 0; i < this.startDay; i+=1) { // we make the prepended days
		dayArr[i] = (tDate-cnt);
		cnt++;
	}	
	
	// set startDate
	this.startDate.setYear(dateObj.getFullYear());
	this.startDate.setMonth(dateObj.getMonth());
	this.startDate.setDate(dateObj.getDate() - this.startDay + 1);

	
	dayArr.reverse();
	
	dateObj.setMonth(monthNum);
	dateObj.setDate(1);

	for (var i = 0; i < dateObj.getDate() - this.numOfDays - 1; i+=1) {		
		var dateNum = dateObj.getDate() - i;
		dayArr.push(dateNum); // 2 obj
		cnt++
	}
	
	for (var i = 0; i < this.numOfDays; i+=1) {
		dayArr.push(i+1);  
	}

	// find the rest of the days we need 
	this.endDay = 42 - dayArr.length;
	for (var i =0; i < this.endDay;i++) {
		dayArr.push(i+1); 
	}	
			
	// set endDate
	this.endDate.setYear(dateObj.getFullYear());
	this.endDate.setMonth(dateObj.getMonth());
	this.endDate.setDate(this.endDay);

	// Slice out the week sets
	function sliceDays(n) { // pass in the total amount of dates
		var sliceArr = new Array();
		var tweeks = n/7; // must be divisable by seven, TODO: add error checking
		
		for (var i = 0; i < tweeks; i+=1) {
			beginSlice = i * 7;
			endSlice = (i+1)*7;

			var tempArr = dayArr.slice(beginSlice,endSlice);
			weekArr[i] = new CalendarWeek(i,tempArr);
		}
	}
	
	sliceDays(dayArr.length);
	this.weeks = weekArr;
	
	for (var i =0; i < dayArr.length; i+=1) {
		if (dayArr[i].toString().length == 1) {
			dayArr[i] = '0' + dayArr[i]; 
		} 
	}		
	
	this.dates = dayArr;
};

/* CalendarWeek */
var CalendarWeek = function(weekNum,dayArr,dateObj) {
	this.weekNum = weekNum;
	this.days = new Array();
	
	for (var i = 0; i < dayArr.length; i+=1) {			
		var dateNum = dayArr[i];
		if (i == 0 || i == 6) {
			this.days.push(new CalendarDay(dateNum ,'day weekend'));
		} else {
			this.days.push(new CalendarDay(dateNum ,'day'));
		}
	}
};

/* CalendarDay */
var CalendarDay = function(dateNum, className) {
	var idStr = dateNum;
	this.day = dateNum;

	if (dateNum.toString().length == 1) {
		idStr = '0' + dateNum;
	}	
	
	this.dateId = idStr; // probably unwarranted
	this.className = className;
	this.date = '';
	this.prefix = '';
};