import * as messaging from "messaging";
import { HeartRateSensor } from "heart-rate";
import clock from "clock";

let document = require("document");
let hrm = new HeartRateSensor();
let hrText = document.getElementById("hrm");
let phoneErrorIcon = document.getElementById("phoneError");
let serverErrorIcon = document.getElementById("serverError");
let myClock = document.getElementById("myClock");
let myTimer = document.getElementById("myTimer");
let timerData = {
  hours: 0,
  minutes: 0,
  seconds: 0
}

clock.granularity = "seconds";

clock.ontick = function(evt) {
  updateClock(evt);
  incrementTimer();
};

function updateClock(evt) {
  let hours = evt.date.getHours();
  hours = hours > 12 ? hours - 12 : hours;
  myClock.text = ("0" + hours).slice(-2) + ":" +
                      ("0" + evt.date.getMinutes()).slice(-2) + ":" +
                      ("0" + evt.date.getSeconds()).slice(-2);
}

function incrementTimer() {
  timerData.seconds++;
  if (timerData.seconds >= 60) {
    timerData.seconds -= 60;
    timerData.minutes++;
  }
  if (timerData.minutes >= 60) {
    timerData.minutes -= 60;
    timerData.hours++;
  }
  myTimer.text = ("0" + timerData.hours).slice(-2) + ":" +
                      ("0" + timerData.minutes).slice(-2) + ":" +
                      ("0" + timerData.seconds).slice(-2);
}

function setPhoneError() {
  phoneErrorIcon.style.display = "inline";
}

function clearPhoneError() {
  phoneErrorIcon.style.display = "none";
}

function setServerError() {
  serverErrorIcon.style.display = "inline";
}

function clearServerError() {
  serverErrorIcon.style.display = "none";
}

function sendHRToPhone(rate) {
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    messaging.peerSocket.send({
      hr: rate,
      timestamp: Date.now()
    });
    clearPhoneError();
  } else if (messaging.peerSocket.readyState === messaging.peerSocket.CLOSED) {
    setPhoneError();
  }
}

hrm.onreading = function() {
  console.log("Current heart rate: " + hrm.heartRate);
  hrText.text = hrm.heartRate;
  sendHRToPhone(hrm.heartRate)
}

messaging.peerSocket.onopen = function() {
  console.log("Connection opened");
}

messaging.peerSocket.onerror = function(err) {
  console.log("Connection error: " + err.code + " - " + err.message);
  setPhoneError();
}

messaging.peerSocket.onmessage = function(evt) {
  if (evt.data.success) {
    clearServerError();
  } else {
    setServerError();
  }
}

hrm.start();
