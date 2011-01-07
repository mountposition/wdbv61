/**
 * Copyright 2011 MountPosition Inc. All right reserved.
 */

var PlatformUtil = {
  
  /**
   * 実行環境が iPhone かどうかを判定します。
   */
  isIPhone: function() {
    return Titanium.Platform.name == "iPhone OS";
  }
  
};
 