/**
 * Copyright 2011 MountPosition Inc. All right reserved.
 */

Titanium.include("lib/platform_util.js");

Titanium.UI.setBackgroundColor('#000');

var tabGroup = Titanium.UI.createTabGroup();
var win1 = Titanium.UI.createWindow({  
    title:'検索',
    backgroundColor:'#fff',
    barColor:'black',
    url: "windows/search.js"
});
var tab1 = Titanium.UI.createTab({  
    icon:'KS_nav_views.png',
    title:'検索',
    window:win1
});

var win2 = Titanium.UI.createWindow({  
    title:'撮影',
    backgroundColor:'#fff',
    barColor:'black',
    url: "windows/camera.js"
});
var tab2 = Titanium.UI.createTab({  
    icon:'KS_nav_ui.png',
    backgroundColor:'#fff',
    title:'撮影',
    window:win2
});


tabGroup.addTab(tab1);  
tabGroup.addTab(tab2); 

if (PlatformUtil.isIPhone()) {
  // 拡張モジュールは iPhone 用と Android 用で別々に作る必要がある
  var win3 = Titanium.UI.createWindow({
    title: 'カレンダー',
    backgroundColor: '#fff',
    barColor: 'black',
    url: "windows/calendar.js"
  });
  var tab3 = Titanium.UI.createTab({
    icon: 'KS_nav_ui.png',
    backgroundColor: '#fff',
    title: 'カレンダー',
    window: win3
  });
  tabGroup.addTab(tab3);
} 

tabGroup.open();
