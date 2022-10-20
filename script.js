const inputContainer = document.getElementById("input-container");
const countdownForm = document.getElementById("countdownForm");
const dateEl = document.getElementById("date-picker");

const countdownEl = document.getElementById("countdown");
const countdownTitleEl = document.getElementById("countdown-title");
const countdownBtn = document.getElementById("countdown-button");
const timeElements = document.querySelectorAll("span");

const completeEl = document.getElementById("complete");
const completeInfoEl = document.getElementById("complete-info");
const completeBtn = document.getElementById("complete-button");

let data;
let countdownActive;

const second = 1000;
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;

function updateDom() {
  inputContainer.hidden = true;
  const now = new Date().getTime();
  const distance = data.date.getTime() - now;

  if (distance <= 0) {
    countdownEl.hidden = true;
    clearInterval(countdownActive);
    completeInfoEl.textContent = `${data.title} finished on ${
      data.date.toISOString().split("T")[0]
    }`;
    completeEl.hidden = false;
  } else {
    const days = Math.floor(distance / day);
    const hours = Math.floor((distance % day) / hour);
    const minutes = Math.floor((distance % hour) / minute);
    const seconds = Math.floor((distance % minute) / second);

    countdownTitleEl.textContent = data.title;
    timeElements[0].textContent = days;
    timeElements[1].textContent = hours;
    timeElements[2].textContent = minutes;
    timeElements[3].textContent = seconds;

    countdownEl.hidden = false;
  }
}

function updateCountdown(event) {
  event.preventDefault();
  const formDate = new FormData(event.target);
  data = Object.fromEntries(formDate);
  data.date = new Date(data.date);
  data.date.setHours(0);

  if (!data.date) alert("Please enter date");

  localStorage.setItem("countdown", JSON.stringify(data));
  updateDom();
  countdownActive = setInterval(updateDom, second);
}

function reset() {
  inputContainer.hidden = false;
  countdownEl.hidden = true;
  completeEl.hidden = true;
  countdownForm.reset;
  localStorage.removeItem("countdown");
  clearInterval(countdownActive);
}

function init() {
  countdownForm.addEventListener("submit", (e) => updateCountdown(e));
  countdownBtn.addEventListener("click", reset);
  completeBtn.addEventListener("click", reset);

  let savedCountdown = JSON.parse(localStorage.getItem("countdown"));

  if (savedCountdown) {
    data = savedCountdown;
    data.date = new Date(data.date);
    updateDom();
    countdownActive = setInterval(updateDom, second);
  }

  const now = new Date();
  now.setDate(now.getDate() + 1);
  dateEl.setAttribute("min", now.toISOString().slice(0, 10));
}

init();
