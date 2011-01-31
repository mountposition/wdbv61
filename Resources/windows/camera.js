/**
 * Copyright 2011 MountPosition Inc. All right reserved.
 */

Titanium.include("../lib/oauth.js");
Titanium.include("../lib/sha1.js");
Titanium.include("../lib/twitter.js");
Titanium.include("../lib/database.js");

var currentWindow = Titanium.UI.currentWindow;
var currentTab = Titanium.UI.currentTab;

// カメラ撮影位置
var currentLatitude = null;
var currentLongitude = null;

/**
 * 画像を指定されたファイル名で保存します。
 * @param {Blob}    image     画像データ
 * @param {String}  filename  保存ファイル名
 */
function saveFile(image, filename) {
// サブディレクトリが必要な場合は、以下のようにしてディレクトリの存在確認と必要であればディレクトリを作るというコードが必要になる。
//  var dir = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, "Resources/images);
//  if (!dir.exists()) {
//    var parentDir = Titanium.Filesystem.getFile(dir.getParent());
//    parentDir.createDirectory();
//    dir.createDirectory();
//  }
  
  var file = Ti.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, filename);
  file.write(image);
  Titanium.API.info("saved file path: " + file.nativePath);
  return file;
}


/**
 * 画像ファイルをアルバムに保存します。
 * @param {File}  imageFile 画像ファイル
 */
function savePhotoGallery(imageFile) {
  Titanium.Media.saveToPhotoGallery(imageFile);
}

//
// カメラ表示部分と登録フォームを同一のコンテキスト(同一 Window)で表示したいため
// カメラで写真取得時にフォームを表示するようにする。
//
// Titanium はコンテキストの考え方（iOS SDK を使うときは、UIViewController）
// 同一のコンテキスト内では変数やメソッド定義が共有される。
// Titanium.include は別ファイルで定義されている変数やメソッド定義を
// 現在のコンテキストに持ってくるもの
//
/**
 * 登録フォームを表示します。
 * @param {Blob}  image                 image の Blob データ
 * @param {bool}  saveWithPhotoGallery  アルバムに保存するかどうかのフラグ (true or false)
 */
var showRegisterForm = function(image, saveWithPhotoGallery) {
  // キャンセルボタンを表示する
  if (Titanium.Platform.name == "iPhone OS") {
    var cancelButton = Titanium.UI.createButton({
      systemButton: Titanium.UI.iPhone.SystemButton.CANCEL
    });
    cancelButton.addEventListener("click", function() {
      alert("キャンセル処理");
    });
    currentWindow.rightNavButton = cancelButton;
  }
  
  // 登録フォーム
  var registerForm = Titanium.UI.createView();
  
  var layoutTable = Titanium.UI.createTableView({
    allowsSelection: false,
    style: Titanium.UI.iPhone.TableViewStyle.GROUPED
  });
  registerForm.add(layoutTable);
  
  // タイトル
  var titleSection = Titanium.UI.createTableViewSection();
  var titleRow = Titanium.UI.createTableViewRow({
    className: "title"
  });
  var titleText = Titanium.UI.createTextField({
    hintText: "タイトル",
    paddingLeft: 10
  });
  titleRow.add(titleText);
  titleSection.add(titleRow);
  
  // コメント
  var commentSection = Titanium.UI.createTableViewSection();
  var commentRow = Titanium.UI.createTableViewRow({
    height: 70,
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
    height: 60,
    right: 0,
    backgroundColor: "transparent"
  });
  commentRow.add(commentLabel);
  commentRow.add(commentArea);
  commentSection.add(commentRow);
  
  // 撮影位置
  var locationSection = Titanium.UI.createTableViewSection();
  var locationRow = Titanium.UI.createTableViewRow({
    height: 100,
    className: "location"
  });
  
  currentLongitude = (currentLongitude == null ? 0 : currentLongitude);
  currentLatitude = (currentLatitude == null ? 0 : currentLatitude);
  
  var locationView = Titanium.Map.createView({
    region: {
      latitude: currentLatitude,
      longitude: currentLongitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01
    },
    userLocation: false
  });
  var locationPin = Titanium.Map.createAnnotation({
    latitude: currentLatitude,
    longitude: currentLongitude,
    title: "撮影位置"
  });
  locationView.annotations = [locationPin];
  locationRow.add(locationView);
  locationSection.add(locationRow);
  
  // Twitter 投稿
  var twitterSection = Titanium.UI.createTableViewSection();
  var twitterRow = Titanium.UI.createTableViewRow({
    title: "Twitter",
    className: "twitter"
  });
  var twitterFlg = Titanium.UI.createSwitch({
    value: true,
    right: 10
  });
  twitterRow.add(twitterFlg);
  twitterSection.add(twitterRow);
  
  // 保存ボタン
  var saveButtonSection = Titanium.UI.createTableViewSection();
  var saveButtonRow = Titanium.UI.createTableViewRow({
    className: "saveButton"
  });
  var saveButton = Titanium.UI.createButton({
    color: "#444444",
    backgroundImage: "../images/button_back.png",
    backgroundSelectedImage: "../images/button_back_push.png",
    font: {
      fontSize: 20,
      fontWeight: "bold"
    },
    title: "SAVE"
  });
  saveButton.addEventListener("click", function() {
    // 現在時刻をファイル名にしてファイル保存する
    var filename = new Date().getTime() + ".png";
    var imageFile = saveFile(image, filename);
    if (saveWithPhotoGallery) {
      savePhotoGallery(imageFile);
    }
    
    PhotoDB.insert({
      filename: filename,
      title: titleText.value,
      lng: currentLongitude,
      lat: currentLatitude,
      comment: commentArea.value
    });
    
    if (twitterFlg.value) {
      TwitterAPI.update(commentArea.value);
      TwitterAPI.release();
    }
    
    registerForm.hide();
  });
  saveButtonRow.add(saveButton);
  saveButtonSection.add(saveButtonRow);
  
  layoutTable.data = [titleSection, commentSection, locationSection, twitterSection, saveButtonSection];
  currentWindow.add(registerForm);
};


var showActionSheet = function(image) {
  var actionSheet = Titanium.UI.createOptionDialog({
    title: "撮った写真をどうしますか？",
    cancel: 2,
    options: ["Save File", "Save File with Photo Gallery", "撮り直す"]
  });
  actionSheet.addEventListener("click", function(e) {
    switch (e.index) {
      case 0: // Filesystem のみに保存
        showRegisterForm(image, false);
        break;
      case 1: // Filesystem と Photo Gallery に保存する
        showRegisterForm(image, true);
        break;
      case 2:
        break;
    }
  });
  actionSheet.show();
}


/**
 * 写真撮影位置を取得する
 * Titanium は内部で UIImagePickerController を使っていてカメラのジオタグが保存されないため
 * GeoLocation から取得する。
 * Titanium.Geolocation.getCurrentPosition だと一度だけ現在位置を取得するため
 * 精度が低い場合があるので、Titanium.Geolocation.addEventListener("location") を使っている。
 */
// 現在位置を取得する
var getCurrentLocation = function(e) {
  currentLongitude = e.coords.longitude;
  currentLatitude = e.coords.latitude;
  Titanium.API.debug("current location: [lng: " + currentLongitude + ", lat: " + currentLatitude + "]");
};


/**
 * カメラ表示
 */
//TODO: シミュレータでしか試せない人用に、サンプル写真を用意しておく。
//FIXME: Android だと Titanium.Media.isCameraSupported が undefined を返すので
//       仕方がないので undefined でもカメラを表示する用にしている
var showCamera = function() {
  if (Titanium.Media.isCameraSupported || typeof(Titanium.Media.isCameraSupported) == "undefined") {
    Titanium.Media.showCamera({
    
      success: function(event) {
        var image = event.media;
        var imageView = Titanium.UI.createImageView({
          image: image,
          width: currentWindow.width,
          height: currentWindow.height
        });
        currentWindow.add(imageView);
        showActionSheet(image);
      },
      cancel: function() {
      },
      error: function(error) {
        // create alert
        var a = Titanium.UI.createAlertDialog({
          title: 'Camera'
        });
        
        // set message
        if (error.code == Titanium.Media.NO_CAMERA) {
          a.setMessage('Device does not have camera.');
        }
        else {
          a.setMessage('Unexpected error: ' + error.code);
        }
        
        // show alert
        a.show();
      },
      allowEditing: false
    });
  }
  else {
    //========================
    // カメラが使えない場合
    //========================
    
    var file = Titanium.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory, "images/image_sample.jpeg");
    var image = file.read();
    var imageView = Titanium.UI.createImageView({
      image: image
    });
    currentWindow.add(imageView);
    showActionSheet(image);
  }
};


var hideCamera = function() {
  if (Titanium.Media.isCameraSupported || typeof(Titanium.Media.isCameraSupported) == "undefined") {
    Titanium.Media.hideCamera();
  }
}


// 裏で LocationListener が起動しっぱなしにならないように、
// 画面表示時に LocationListener を設定して画面が非表示になったら Listener を削除する
currentWindow.addEventListener("focus", function() {
  Titanium.Geolocation.purpose = "写真撮影位置を地図上に表示するために使用します。";
  Titanium.Geolocation.accuracy = Titanium.Geolocation.ACCURACY_BEST;
  if (Titanium.Geolocation.locationServicesEnabled) {
    Titanium.Geolocation.addEventListener("location", getCurrentLocation);
  }
  showCamera();
});
currentWindow.addEventListener("blur", function() {
  Titanium.Geolocation.removeEventListener("location", getCurrentLocation);
  hideCamera();
});
