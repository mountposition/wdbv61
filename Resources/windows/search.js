/**
 * Copyright 2011 MountPosition Inc. All right reserved.
 */

Titanium.include("../lib/database.js");
Titanium.include("../lib/date_util.js");
var win = Titanium.UI.currentWindow;

var selectClause = 'select id, title, file_name, strftime("%Y/%m/%d %H:%M:%S", created_at) as created_at from photos ';
var newlyPhotosQuery = selectClause + 'order by created_at limit 10';
var keywordSearchQuery = selectClause + 'where title like ? or comment like ? order by created_at limit 100';

var header = Titanium.UI.createTableViewRow({
  backgroundColor: '#000',
  height: 25
});
var headerLabel = Titanium.UI.createLabel({
  text: '',
  color: '#fff',
  textAlign: 'center',
  font: {
    fontSize: 12
  },
  width: 'auto',
  height: 25,
  className: 'header'
});
header.add(headerLabel);

function searchPhotos(searchKey) {
  var rows = [];
  if (searchKey) {
    headerLabel.text = "「" + searchKey + "」の検索結果";
    searchParam = "%" + searchKey + "%";
    var dataRows = PhotoDB.select(function(db) {
      return db.execute(keywordSearchQuery, searchParam, searchParam);
    });
  }
  else {
    headerLabel.text = "最新10件の検索結果";
    var dataRows = PhotoDB.select(function(db) {
      return db.execute(newlyPhotosQuery);
    });
  }
  
  rows.push(header);
  
  for (var i = 0, len = dataRows.length; i < len; i++) {
    var data = dataRows[i];
    
    var row = Titanium.UI.createTableViewRow({
      hasChild: true,
      backgroundColor: '#efefef',
      borderColor: '#555555',
      borderWidth: 1,
      separatorColor: 'transparent',
      selectedBackgroundColor: '#fff',
      height: 50,
      className: 'datarow'
    });
    
    var photo = Titanium.UI.createImageView({
      image: Titanium.Filesystem.applicationDataDirectory + data["file_name"],
      top: 10,
      left: 10,
      width: 28,
      height: 35
    });
    row.add(photo);
    
    var titleLabel = Titanium.UI.createLabel({
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
    row.add(titleLabel);
    
    var dateLabel = Titanium.UI.createLabel({
      color: '#777777',
      font: {
        fontSize: 10,
        fontWeight: 'bold',
        fontFamily: 'Arial'
      },
      left: 45,
      top: 30,
      height: 12,
      width: 240,
      text: DateUtil.formatDateStr(data["created_at"])
    });
    row.add(dateLabel);
    
    // row.hasChild = true;
    row.id = data["id"];
    row.title_str = data["title"];
    rows.push(row);
  }
//  db.close();
  
  return rows;
}

var search = Titanium.UI.createSearchBar({
  barColor: '#000',
  showCancel: true,
  height: 45,
  top: 0
});

var tableView = Titanium.UI.createTableView({
  top: 45,
  data: searchPhotos()
});

// fired when the value of the search bar changes
search.addEventListener('change', function(e) {
});

// fired when the cancel button is pressed
search.addEventListener('cancel', function(e) {
  search.blur();
});

// 	fired when keyboard search button is pressed
search.addEventListener('return', function(e) {
  tableView.data = searchPhotos(e.value);
  search.blur();
});

// フォーカスの取得・喪失時イベント
search.addEventListener('focus', function(e) {
  Titanium.API.info('search bar: focus received');
});

// tableView.data = searchPhotos();

tableView.addEventListener('click', function(e) {
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


var reloadHeader = Titanium.UI.createView({
  backgroundColor: "#000",
  height: 55
});
var actInd = Titanium.UI.createActivityIndicator({
  left: 20,
  bottom: 20,
  width: 30,
  height: 40
});
reloadHeader.add(actInd);

var reloadLabel = Titanium.UI.createLabel({
  text: "ひっぱると更新",
  bottom: 30,
  height: "auto",
  color: "#576c89",
  textAlign: "center",
  font: {
    fontSize: 13,
    fontWeight: "bold"
  }
});
reloadHeader.add(reloadLabel);
tableView.headerPullView = reloadHeader;

var pulling = false;
var reloading = false;

tableView.addEventListener('scroll', function(e) {
  var offset = e.contentOffset.y;
  if (offset <= -60.0 && !pulling) {
    pulling = true;
    reloadLabel.text = "はなすと更新";
  }
  else if (pulling && offset > -60.0 && offset < 0) {
    pulling = false;
    reloadLabel.text = "ひっぱると更新";
  }
});

tableView.addEventListener('scrollEnd', function(e) {
  if (pulling && !reloading && e.contentOffset.y <= -60.0) {
    reloading = true;
    pulling = false;
    actInd.show();
    reloadLabel.text = "更新中";
    tableView.setContentInsets({
      top: 60
    }, {
      animated: true
    });
    beginReloading();
  }
});

function beginReloading() {
  tableView.data = searchPhotos();
  setTimeout(endReloading, 2000);
}

function endReloading() {
  tableView.setContentInsets({
    top: 0
  }, {
    animated: true
  });
  reloading = false;
  reloadLabel.text = "ひっぱると更新";
  actInd.hide();
}

var noResultMsgLabel = Titanium.UI.createLabel({
  text: '検索結果がありません',
  width: 250,
  height: 50,
  borderRadius: 10,
  opacity: 0.0,
  textAlign: 'center',
  center: win.center
});

win.add(search);
win.add(tableView);
win.add(noResultMsgLabel);
