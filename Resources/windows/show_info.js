/**
 * Copyright 2011 MountPosition Inc. All right reserved.
 */

var win = Titanium.UI.currentWindow;

var layoutTable = Titanium.UI.createTableView({
  allowsSelection: false,
  style: Titanium.UI.iPhone.TableViewStyle.GROUPED
});

//タイトル
var titleSection = Titanium.UI.createTableViewSection();
var titleRow = Titanium.UI.createTableViewRow({
  className: "title"
});

var titleText = Titanium.UI.createTextField({
  editable: false,
  autocapitalization: false,
  paddingLeft: 10,
  value: win.title_str
});
titleRow.add(titleText);
titleSection.add(titleRow);


//コメント
var commentSection = Titanium.UI.createTableViewSection();
var commentRow = Titanium.UI.createTableViewRow({
  height: 80,
  className: "comment"
});
var commentLabel = Titanium.UI.createLabel({
  text: "コメント",
  font: {
    fontWeight: "bold"
  },
  width: 80,
  left: 10
});
var commentArea = Titanium.UI.createTextArea({
  width: 230,
  height: 75,
  right: 0,
  backgroundColor: "transparent",
  editable: false,
  value: win.comment
});

commentRow.add(commentLabel);
commentRow.add(commentArea);
commentSection.add(commentRow);

//地図
var locationSection = Titanium.UI.createTableViewSection();
var locationRow = Titanium.UI.createTableViewRow({
  height: 200,
  className: "location"
});
var locationView = Titanium.Map.createView({
  region: {
    latitude: win.lat,
    longitude: win.lng,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01
  },
  userLocation: false
});
var locationPin = Titanium.Map.createAnnotation({
  latitude: win.lat,
  longitude: win.lng,
  title: "撮影位置"
});
locationView.addAnnotation(locationPin);
locationRow.add(locationView);
locationSection.add(locationRow);

layoutTable.data = [titleSection, commentSection, locationSection];
win.add(layoutTable);
