/**
 * Copyright 2011 MountPosition Inc. All right reserved.
 */

var win = Titanium.UI.currentWindow;

Titanium.include("../lib/database.js");
Titanium.include("../lib/date_util.js");

var dataRows = PhotoDB.select(function(db) {
  return db.execute("SELECT strftime('%Y/%m/%d', CREATED_AT) as created_at FROM PHOTOS GROUP BY strftime('%Y/%m/%d', CREATED_AT)");
});

//カレンダーにドットを打つための日付配列を作成
var existDates = [];
for (var i = 0, len = dataRows.length; i < len; i++) {
  var data = dataRows[i];
  
  var date = new Date();
  date.setTime(Date.parse(dataRows["created_at"]));
  existDates.push(date);
}


//カレンダー生成
var calendarView = Titanium.Calendar.createView({
  top: 0
  /*headerColor: "red",
   calendarColor: "#aaa8a8"*/
});

if (existDates.length > 0) {
  calendarView.setDates(existDates);
}

calendarView.addEventListener('dateSelected', function(e) {
  try {
    //点がうたれていない場合は処理しない
    if (!DateUtil.haveDateExceptTime(existDates, e.date)) {
      return;
    }
    
    
    var list_of_day_window = Titanium.UI.createWindow({
      backgroundColor: '#336699',
      title: DateUtil.formatDateExceptTimeStr(e.date),
      barColor: 'black',
      url: 'list_of_day.js'
    });
    
    list_of_day_window.date = DateUtil.formatDateExceptTimeObj(e.date);
    
    Titanium.UI.currentTab.open(list_of_day_window, {
      animated: true
    });
    
  } 
  catch (ex) {
    Titanium.API.info(ex);
  }
});

calendarView.show();
win.add(calendarView);
