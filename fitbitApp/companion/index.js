import * as messaging from "messaging";
import { settingsStorage } from "settings";

let serverUrl = JSON.parse(settingsStorage.getItem("serverUrl"))['name'];

function sendHR(hr, timestamp) {
  console.log("Got HR: " + hr + " On " + timestamp);
  fetch(
    serverUrl, 
    {
      method: 'post',
      body: JSON.stringify({
        'hr': hr,
        'timestamp': timestamp
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
    sendHR(evt.data.hr, evt.data.timestamp);
  }
}

messaging.peerSocket.onerror = function(err) {
  console.log("Connection error: " + err.code + " - " + err.message);
}

settingsStorage.onchange = function(evt) {
  serverUrl = JSON.parse(evt.newValue)['name'];
  console.log("NEW URL: " + serverUrl);
}