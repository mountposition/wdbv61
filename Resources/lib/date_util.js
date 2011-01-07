/**
 * Copyright 2011 MountPosition Inc. All right reserved.
 */

var DateUtil = {
	formatDateStr: function(dateStr) {
	  var date = new Date();
		date.setTime( Date.parse(dateStr) );
	  return '' + date.getFullYear() + '/' + 
								DateUtil.padZero(date.getMonth() + 1) + '/' + 
								DateUtil.padZero(date.getDate()) + " " + 
								DateUtil.padZero(date.getHours()) + ":" + 
								DateUtil.padZero(date.getMinutes()) + ":" + 
								DateUtil.padZero(date.getSeconds());
	},
	
	padZero: function(str) {
		return ("0" + str).slice(-2);
	},
	
	formatDateExceptTimeStr: function(dateStr) {
		var date = new Date();
		date.setTime( Date.parse(dateStr) );
		return '' + date.getFullYear() + '/' +
								DateUtil.padZero(date.getMonth() + 1) + '/' +
								DateUtil.padZero(date.getDate())
	},
	
	formatDateExceptTimeObj: function(dateStr) {
		var date = new Date();
		date.setTime( Date.parse(DateUtil.formatDateExceptTimeStr(dateStr)) );
		return date;
	},
	
	equal: function(dateObj1, dateObj2){
		return dateObj1.getTime() == dateObj2.getTime();
	},
	
	haveDateExceptTime: function(dateArray, dateStr){
		var date = DateUtil.formatDateExceptTimeObj(dateStr);
		for(var i = 0; i < dateArray.length; i++){
			if(DateUtil.equal(existDates[i], date)){
				return true;
			}
		}
		return false;
	}
};