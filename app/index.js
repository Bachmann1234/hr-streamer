import * as messaging from "messaging";
import { HeartRateSensor } from "heart-rate";

let document = require("document");
var hrm = new HeartRateSensor();
let hrLabel = document.getElementById("hrm");


hrm.onreading = function() {
  console.log("Current heart rate: " + hrm.heartRate);
  hrLabel.text = hrm.heartRate;
  sendHRToPhone(hrm.heartRate)
}

function sendHRToPhone(rate) {
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    messaging.peerSocket.send({
      hr: rate,
      timestamp: Date.now()
    });
  }
}

messaging.peerSocket.onopen = function() {
  console.log("Connection opened");
}

messaging.peerSocket.onerror = function(err) {
  console.log("Connection error: " + err.code + " - " + err.message);
}
hrm.start();
