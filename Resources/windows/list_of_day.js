/**
 * Copyright 2011 MountPosition Inc. All right reserved.
 */

var win = Ti.UI.currentWindow;

Titanium.include("../lib/database.js");
Titanium.include("../lib/date_util.js");

var dataRows = PhotoDB.select(function(db) {
  db.execute("SELECT * FROM PHOTOS WHERE strftime('%Y/%m/%d', CREATED_AT) = ?", DateUtil.formatDateExceptTimeStr(win.date));
});


var viewRows = [];
for (var i = 0, len = dataRows.length; i < len; i++) {
  var data = dataRows[i];
  
  var row = Titanium.UI.createTableViewRow({
    //backgroundColor:'#efefef',
    borderColor: '#555555',
    borderWidth: 1,
    separatorColor: '#555555',
    selectedBackgroundColor: '#fff',
    height: 55,
    className: 'viewRow',
    hasChild: true
  });
  
  //画像追加
  var photo = Titanium.UI.createImageView({
    image: Titanium.Filesystem.applicationDataDirectory + "/" + data["file_name"],
    top: 10,
    left: 10,
    width: 28,
    height: 35
  });
  row.add(photo);
  
  //タイトルラベル追加
  var title = Titanium.UI.createLabel({
    font: {
      fontSize: 14,
      fontWeight: 'bold',
      fontFamily: 'Arial'
    },
    left: 45,
    top: 13,
    height: 16,
    width: 240,
    text: data["title"]
  });
  row.add(title);
  
  //受け渡し用パラメータ定義
  row.id = data["id"];
  row.title_str = data["title"];
  
  viewRows.push(row);
}

var tableview = Titanium.UI.createTableView({
  data: viewRows
});


tableview.addEventListener('click', function(e) {
  if (e.rowData) {
    var show_image_window = Titanium.UI.createWindow({
      url: 'show_image.js',
      title: e.rowData.title_str,
      backgroundColor: '#fff',
      barColor: '#111'
    });
    show_image_window.id = e.rowData.id;
    show_image_window.hideTabBar();
    Titanium.UI.currentTab.open(show_image_window, {
      animated: true
    });
  }
});

win.add(tableview);
