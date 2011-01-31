/**
 * Copyright 2011 MountPosition Inc. All right reserved.
 * @dependencies lib/oauth.js, lib/sha1.js
 */
var TwitterAPI = {};

(function() {
  var accessor = {
    consumerSecret: "WBVXVv9W8V7PZKa1MvvLxOHFnquQRQQOuasGNs62iA",
    tokenSecret: "lGHaWEEk6BJyhZbAXdSlaS38YvPAnYExNNjSHUOKEsI"
  };
  
  var message = {
    method: "POST",
    action: "http://twitter.com/statuses/update.json",
    parameters: {
      oauth_signature_method: "HMAC-SHA1",
      oauth_consumer_key: "KbWwtrLBiJInITNuOHwCA",
      oauth_token: "223726446-Hslfget53mwqZDZhwEY3V2ELVks8kXo7M9gHgEiQ",
      status: ""
    }
  };
  
  TwitterAPI.update = function(status) {
    message.parameters.status = status;
    OAuth.setTimestampAndNonce(message);
    OAuth.SignatureMethod.sign(message, accessor);
    
    this.xhr = Titanium.Network.createHTTPClient();
    this.xhr.open(message.method, message.action);
    this.xhr.setRequestHeader("Authorization", OAuth.getAuthorizationHeader("", message.parameters));
    this.xhr.onload = function() {
      try {
        var result = eval('(' + this.responseText + ')');
        Titanium.API.info("twitter success: " + result);
      } 
      catch (e) {
        Titanium.API.error("twitter error:" + e);
      }
    };
    this.xhr.onerror = function(e) {
      Titanium.API.error("twitter error: " + e);
    };
    
    this.xhr.send({
      status: message.parameters.status
    });
  };
  
  TwitterAPI.release = function() {
    this.xhr.onerror = null;
    this.xhr.onload = null;
  };
})();
