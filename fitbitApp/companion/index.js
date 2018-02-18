import * as messaging from "messaging";
import { settingsStorage } from "settings";

let serverUrl = settingsStorage.getItem("serverUrl");
let userId = settingsStorage.getItem("userId");

if (userId != undefined) {
  userId = JSON.parse(userId)['name']
} else {
  userId = "";
}

if (serverUrl != undefined) {
  serverUrl = JSON.parse(serverUrl)['name']
} else {
  serverUrl = "";
}



function sendHR(hr, timestamp) {
  fetch(
    serverUrl, 
    {
      method: 'post',
      body: JSON.stringify({
        'hr': hr,
        'timestamp': timestamp,
        'userId': userId
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }
  ).then(
    function(result) {
      messaging.peerSocket.send({
        success: true
      });
    }
  ).catch(function (err) {
    console.log("Error sending hr: " + err + " to " + serverUrl);
    if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
      messaging.peerSocket.send({
        success: false
      });
    }
  });
}

messaging.peerSocket.onopen = function() {
  console.log("Connection opened");
}

messaging.peerSocket.onmessage = function(evt) {
  if (evt.data) {
    console.log("Got HR: " + evt.data.hr + " On " + evt.data.timestamp);
    sendHR(evt.data.hr, evt.data.timestamp);
  }
}

messaging.peerSocket.onerror = function(err) {
  console.log("Connection error: " + err.code + " - " + err.message);
}

settingsStorage.onchange = function(evt) {
  console.log("key: " + evt.key)
  if(evt.key === 'serverUrl') {
    serverUrl = JSON.parse(evt.newValue)['name'];
    console.log("New URL: " + serverUrl);
  } else if(evt.key === 'userId') {
    userId = JSON.parse(evt.newValue)['name'];
    console.log("New User Id: " + userId);
  }
}