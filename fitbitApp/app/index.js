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
let appStart = new Date();
let MILLIS_TO_SECONDS = 1000;
let MILLIS_TO_MINUTES = MILLIS_TO_SECONDS * 60;
let MILLIS_TO_HOURS = MILLIS_TO_MINUTES * 60;

clock.granularity = "seconds";

clock.ontick = function(evt) {
  updateClock(evt);
  updateTimer();
};

function updateClock(evt) {
  let hours = evt.date.getHours();
  hours = hours > 12 ? hours - 12 : hours;
  myClock.text = ("0" + hours).slice(-2) + ":" +
                      ("0" + evt.date.getMinutes()).slice(-2) + ":" +
                      ("0" + evt.date.getSeconds()).slice(-2);
}

function updateTimer() {
  let elapsedTime = new Date() - appStart;
  let hours =  Math.floor(elapsedTime / MILLIS_TO_HOURS);
  let minutes = Math.floor((elapsedTime % MILLIS_TO_HOURS) / MILLIS_TO_MINUTES);
  let seconds = Math.floor((elapsedTime % MILLIS_TO_HOURS % MILLIS_TO_MINUTES) / MILLIS_TO_SECONDS);
  myTimer.text = ("0" + hours).slice(-2) + ":" +
                      ("0" + minutes).slice(-2) + ":" +
                      ("0" + seconds).slice(-2);
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
