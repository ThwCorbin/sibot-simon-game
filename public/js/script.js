"use strict";

// Initial settings variables
let gameActive = false;
let rounds = 20;
let random0123 = null;
let fullPattern = []; // 20 (or 5) color pattern array generated at start
let currentPattern = []; // bit of fullPattern that is playing now
let nextIndexFromFullPattern = 0; // to add the next color to currentPattern
let completedRounds = ""; // to save round for replayCurrentRoundColors()
let enteredPattern = []; // player's attempt to repeat pattern
let patternCheck = null;
let strictPlay = false;

// Center game board and changeRounds variables
const counter = document.querySelector(".counter");
const start = document.querySelector(".start");
start.addEventListener("click", startGame);
const strict = document.querySelector(".strict");
strict.addEventListener("click", strictGame);
const resetSoulPatch = document.querySelector(".resetSoulPatch");
resetSoulPatch.addEventListener("click", reset);
const textOnJersey = document.querySelector(".botJerseyText");
const roundsOnJersey = document.querySelector(".botJerseyNumber");
document
  .querySelector(".botBeltBuckle")
  .addEventListener("click", changeRounds);

// Color buttons variables
const greenButton = document.querySelector(".green");
const pinkButton = document.querySelector(".pink");
const violetButton = document.querySelector(".violet");
const blueButton = document.querySelector(".blue");
greenButton.addEventListener("click", () => enterPlayersPattern(0));
pinkButton.addEventListener("click", () => enterPlayersPattern(1));
violetButton.addEventListener("click", () => enterPlayersPattern(2));
blueButton.addEventListener("click", () => enterPlayersPattern(3));
const soundGreen = document.querySelector(".soundGreen");
const soundPink = document.querySelector(".soundPink");
const soundViolet = document.querySelector(".soundViolet");
const soundBlue = document.querySelector(".soundBlue");

// Change rounds from 20 to 5 and back to 20
function changeRounds() {
  if (gameActive === false) {
    roundsOnJersey.textContent === "20"
      ? (roundsOnJersey.textContent = "5")
      : (roundsOnJersey.textContent = "20");
    rounds === 20 ? (rounds = 5) : (rounds = 20);
  } else {
    gameIsActiveMessage();
  }
}

function gameIsActiveMessage() {
  textOnJersey.classList.add("botJerseyTextOn");
  setTimeout(() => {
    textOnJersey.classList.remove("botJerseyTextOn");
  }, 1000);
}

// Makes first mistake trigger reset()
function strictGame() {
  strict.classList.toggle("strictOn");
  strictPlay === false ? (strictPlay = true) : (strictPlay = false);
}

// Game start functions
function startGame() {
  if (gameActive === false) {
    gameActive = true;
    start.classList.add("startOn");
    generateColors();
    currentPattern.push(fullPattern[0]);
    counter.textContent = 0;
    setTimeout(playPattern(), 1000);
  } else {
    gameIsActiveMessage();
  }
}

function generateColors() {
  for (let i = 0; i < rounds; i++) {
    getRandom();
    fullPattern.push(random0123);
  }
}

function getRandom() {
  random0123 = Math.floor(Math.random() * 4);
}

// Game lights functions
function playPattern() {
  currentPattern.forEach((val, idx) => {
    setTimeout(brightButtons, 1000 * idx, val);
  });
}

function brightButtons(val) {
  // Only plays if game is active: reset() sets gameActive to false to stop lights
  if (gameActive === true) {
    if (val === 0) {
      greenButton.classList.add("greenBright");
      soundGreen.play();
    } else if (val === 1) {
      pinkButton.classList.add("pinkBright");
      soundPink.play();
    } else if (val === 2) {
      violetButton.classList.add("violetBright");
      soundViolet.play();
    } else if (val === 3) {
      blueButton.classList.add("blueBright");
      soundBlue.play();
    }
    setTimeout(noBrightButtons, 500);
  }
}

function noBrightButtons() {
  greenButton.classList.remove("greenBright");
  pinkButton.classList.remove("pinkBright");
  violetButton.classList.remove("violetBright");
  blueButton.classList.remove("blueBright");
}

function allBrightButtons() {
  greenButton.classList.add("greenBright");
  pinkButton.classList.add("pinkBright");
  violetButton.classList.add("violetBright");
  blueButton.classList.add("blueBright");
}

// Game play functions
function enterPlayersPattern(num0123) {
  // num0123: green = 0, pink = 1, violet = 2, blue = 3
  brightButtons(num0123);
  if (gameActive === false) {
    gameIsActiveMessage();
    textOnJersey.textContent = "Game is not active";
    setTimeout(() => {
      textOnJersey.textContent = "Game is active";
    }, 1000);
  } else if (enteredPattern.length < currentPattern.length) {
    enteredPattern.push(num0123);
    for (let i = 0; i < enteredPattern.length; i++) {
      if (enteredPattern[i] === currentPattern[i]) {
        patternCheck = true;
      } else {
        patternCheck = false;
      }
    }
    if (patternCheck === false) {
      strictPlay === true ? reset() : replayCurrentRoundColors();
    } else if (enteredPattern.length === currentPattern.length) {
      updateCurrentPattern();
      if (counter.textContent !== "W") {
        counter.textContent = parseInt(counter.textContent, 10) + 1;
      }
    }
  }
}

function replayCurrentRoundColors() {
  completedRounds = counter.textContent;
  counter.textContent = "!!";
  enteredPattern = [];
  allBrightButtons();
  setTimeout(() => {
    counter.textContent = completedRounds;
  }, 1000);
  setTimeout(noBrightButtons, 500);
  setTimeout(playPattern, 1500);
}

function updateCurrentPattern() {
  if (enteredPattern.length === fullPattern.length) {
    winner();
  } else {
    nextIndexFromFullPattern += 1;
    currentPattern.push(fullPattern[nextIndexFromFullPattern]);
    enteredPattern = [];
    setTimeout(playPattern, 1500);
  }
}

function winner() {
  counter.textContent = "W";
  allBrightButtons();
  setTimeout(noBrightButtons, 250);
  setTimeout(allBrightButtons, 500);
  setTimeout(noBrightButtons, 750);
  setTimeout(allBrightButtons, 1000);
  setTimeout(reset, 1250);
}

// Game reset after win, after "Reset" button, or in strict mode after first mistake
function reset() {
  counter.textContent = "!!";
  allBrightButtons();
  setTimeout(() => {
    counter.textContent = "--";
  }, 1000);
  setTimeout(noBrightButtons, 1000);
  gameActive = false;
  start.classList.remove("startOn");
  strictPlay = false;
  strict.classList.remove("strictOn");
  rounds = 20;
  roundsOnJersey.textContent = "20";
  random0123 = null;
  fullPattern = [];
  currentPattern = [];
  completedRounds = "";
  enteredPattern = [];
  patternCheck = null;
  nextIndexFromFullPattern = 0;
}
