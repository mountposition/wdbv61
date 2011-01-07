/**
 * Copyright 2011 MountPosition Inc. All right reserved.
 */

var win = Titanium.UI.currentWindow;
win.translucent = true; //Only iPhone property
Titanium.include("../lib/database.js");


var dataRows = PhotoDB.select(function(db) {
  return db.execute("SELECT * FROM PHOTOS WHERE ID = ?", win.id);
});

//イメージビューの設定
var imageView = Titanium.UI.createImageView({
  center: win.center,
  width: Titanium.Platform.displayCaps.platformWidth,
  height: Titanium.Platform.displayCaps.platformHeight
});

if (dataRows.length == 0) {
  alert('画像を開けませんでした。');
  win.close();
  exit();
}

var data = dataRows[0];
imageView.image = Titanium.Filesystem.applicationDataDirectory + "/" + data["file_name"]
win.add(imageView);

var id = data["id"];
var comment = data["comment"];
var title_str = data["title"];
var lat = data["lat"];
var lng = data["lng"];
var created_at = data["created_at"];

//ナビゲーションバーのボタン設定
var info_button = Titanium.UI.createButton({
  systemButton: Titanium.UI.iPhone.SystemButton.INFO_LIGHT
});
win.rightNavButton = info_button;

info_button.addEventListener('click', function(e) {
  var info_window = Titanium.UI.createWindow({
    title: data["title"],
    url: 'show_info.js'
  });
  
  var closeButton = Titanium.UI.createButton({
    title: '閉じる',
    style: Titanium.UI.iPhone.SystemButtonStyle.PLAIN
  });
  
  info_window.setRightNavButton(closeButton);
  
  closeButton.addEventListener('click', function() {
    info_window.close();
  });
  
  //受け渡しパラメータの設定
  info_window.id = id;
  info_window.title_str = title_str;
  info_window.comment = comment;
  info_window.lat = lat;
  info_window.lng = lng;
  info_window.created_at = created_at;
  info_window.open({
    modal: true
  });
});




//ナビゲーションバーの動作制御
win.hideNavBar();
var barHidden = true;
Titanium.UI.iPhone.hideStatusBar();

imageView.addEventListener('click', function(e) {
  if (barHidden) {
    win.showNavBar();
    Titanium.UI.iPhone.showStatusBar();
    barHidden = false;
  }
  else {
    win.hideNavBar();
    Titanium.UI.iPhone.hideStatusBar();
    barHidden = true;
  }
});
