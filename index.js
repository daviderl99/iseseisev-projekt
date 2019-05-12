/*jshint esversion: 6*/
let myMaze;
let startDate, endDate;
let minutes, seconds, millis;
let started = false;
let finished = false;
let controls = false;
let lightOrDark;

window.onload = function(){
  document.querySelector("#startBtn").addEventListener('click', start);
  document.querySelector("#restart").addEventListener('click', start);
  saveLocalStorage("lineColor", 0);

  if(!getLocalStorage("colorScheme")){ //If color not set, set default value
    saveLocalStorage("colorScheme", document.querySelector("#color").value);
    if(!getLocalStorage("difficulty")){ //If difficulty not set, set easy as default
      saveLocalStorage("difficulty", 50);
    }
  }

  setValues();
  myMaze = new p5(sketch);

};

function start(){
  location.reload();
  saveLocalStorage("colorScheme", document.querySelector("#color").value); //Save chosen color input to localstorage
  saveLocalStorage("difficulty", document.querySelector("#difficulty").value);
 }

function setValues(){
 brightness(getLocalStorage("colorScheme")); //If chosen color is too dark, change lines to white
 document.querySelector("#color").value = getLocalStorage("colorScheme"); //Change color input Color
 document.querySelector("#startBtn").style.backgroundColor = getLocalStorage("colorScheme"); //Change start button color to color input color
 document.querySelector("#difficulty").value = getLocalStorage("difficulty"); //Display correct difficulty
 document.querySelector("#restart").style.backgroundColor = getLocalStorage("colorScheme");

 //Popup button hover properties
 document.querySelector("#restart").onmouseover = function(){
   this.style.color = getLocalStorage("colorScheme");
   this.style.backgroundColor = "#FFF";
 };
 document.querySelector("#restart").onmouseleave = function(){
   this.style.backgroundColor = getLocalStorage("colorScheme");
   this.style.color = "#000";
 };
 //Popup hover properties if chosen color too dark or light
 if (lightOrDark == "dark"){
   document.querySelector("#restart").onmouseover = function(){
     this.style.backgroundColor = "#FFF";
     this.style.color = getLocalStorage("colorScheme");
   };
   document.querySelector("#restart").onmouseleave = function(){
     this.style.backgroundColor = getLocalStorage("colorScheme");
     this.style.color = "#FFF";
   };
 }
 else if (lightOrDark == "light"){
   document.querySelector("#restart").onmouseover = function(){
     this.style.backgroundColor = "#000";
     this.style.color = getLocalStorage("colorScheme");
   };
   document.querySelector("#restart").onmouseleave = function(){
     this.style.backgroundColor = getLocalStorage("colorScheme");
     this.style.color = "#000";
   };
 }
}

function saveLocalStorage(key, value){
  localStorage.setItem(key, value);
}

function getLocalStorage(key){
  return localStorage.getItem(key);
}

function getCurrentTime(){
  startDate = new Date();
}

function getTime(){
  endDate = new Date();

  millis = Math.abs(endDate - startDate);
  seconds = Math.floor(millis / 1000);
  minutes = Math.floor(seconds / 60);
  seconds %= 60;
  minutes %= 60;
  millis -= (((minutes*60) + seconds) * 1000);

  if (minutes < 10) { minutes = "0" + minutes; }
  if (seconds < 10) { seconds = "0" + seconds; }
  if (millis < 100) { millis = "0" + millis; }

  return minutes+":"+seconds+"."+millis;
}

function brightness(hex){
  hex = hex.substring(1);      // Strip #
  let rgb = parseInt(hex, 16);   // Convert RRGGBB to decimal
  let r = (rgb >> 16) & 0xff;  // Extract red
  let g = (rgb >>  8) & 0xff;  // Extract green
  let b = (rgb >>  0) & 0xff;  // Extract blue

  let lum = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709

  if (lum < 40) {
    saveLocalStorage("lineColor", 255);
    document.querySelector("#startBtn").style.color = "#FFF";
    document.querySelector("#restart").style.color = "#FFF";
    document.querySelector("#restart").style.backgroundColor = getLocalStorage("colorScheme");
    lightOrDark = "dark";
  }
  else if (lum > 240) {
    document.querySelector("#startBtn").style.color = "#000";
    document.querySelector("#restart").style.color = "#000";
    document.querySelector("#restart").style.backgroundColor = getLocalStorage("colorScheme");
    document.querySelector("#restart").style.border = "solid";
    lightOrDark = "light";
  }
}
