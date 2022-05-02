// Accessing Elements
const currentTime = document.querySelector(".current-time");
const hours = document.querySelector("#hours");
const minutes = document.querySelector("#minutes");
const seconds = document.querySelector("#seconds");
const amPm = document.querySelector("#am-pm");
const setAlarmBtn = document.querySelector("#submit-btn");
const alarmContainer = document.querySelector(".alarms-container");
const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3');

// looping the audio clip
audio.loop = true;


// Populating select option on document load
window.addEventListener("DOMContentLoaded", (event) => {
  // Populating hours
  populate(1, 12, hours);

  // Populating minutes
  populate(0, 59, minutes);

  // Populating seconds
  populate(0, 59, seconds);

  // Showing current time
  setInterval(getCurrentTime, 1000);
  fetchAlarm();
});

// Add event listener to set alarm button
setAlarmBtn.addEventListener("click", getInput);

// Populate options
function populate(start, end, element) {
  for (let i = start; i <= end; i++) {
    const option = document.createElement("option");
    option.value = i < 10 ? "0" + i : i;
    option.innerHTML = i < 10 ? "0" + i : i;
    element.appendChild(option);
  }
}

// Get current time
function getCurrentTime() {
  let time = new Date();
  time = time.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
  });
  currentTime.innerHTML = time;

  return time;
}

// Get input from user
function getInput(e) {
  e.preventDefault();
  const hourValue = hours.value;
  const minuteValue = minutes.value;
  const secondValue = seconds.value;
  const amPmValue = amPm.value;

  const alarmTime = convertToTime(
    hourValue,
    minuteValue,
    secondValue,
    amPmValue
  );
  setAlarm(alarmTime);
}

// Convert time to 24 hour format
function convertToTime(hour, minute, second, amPm) {
  return `${parseInt(hour)}:${minute}:${second} ${amPm}`;
}

// Set Alarm
function setAlarm(time, fetching = false) {
  const alarm = setInterval(() => {
    if (time === getCurrentTime()) {
    //  alert(`Hey! The time is ${time}.`)
      audio.play();
    }

    console.log("running");
  }, 500);

  addAlaramToDom(time, alarm);
  if (!fetching) {
    saveAlarm(time);
  }
}                                      

// Displaying created alarms in HTML
function addAlaramToDom(time, intervalId) {
  const alarm = document.createElement("div");
  alarm.classList.add("alarm", "mb", "d-flex");
  alarm.innerHTML = `
              <div class="time">${time}</div>
              <button class="btn delete-alarm" data-id=${intervalId}>Clear Alarm</button>
              `;
  const deleteBtn = alarm.querySelector(".delete-alarm");
  deleteBtn.addEventListener("click", (e) => deleteAlarm(e, time, intervalId));

  alarmContainer.prepend(alarm);
}

// Check save alarams in localstorage
function checkAlarams() {
  let alarms = [];
  const isPresent = localStorage.getItem("alarms");
  if (isPresent) alarms = JSON.parse(isPresent);

  return alarms;
}

// save alarm to local storage
function saveAlarm(time) {
  const alarms = checkAlarams();

  alarms.push(time);
  localStorage.setItem("alarms", JSON.stringify(alarms));
}

// Fetch alarms from local storage
function fetchAlarm() {
  const alarms = checkAlarams();

  alarms.forEach((time) => {
    setAlarm(time, true);
  });
}


// Delete a Alarm
function deleteAlarm(event, time, intervalId) {
  const self = event.target;

  clearInterval(intervalId);

  const alarm = self.parentElement;
  console.log(time);

  deleteAlarmFromLocal(time);
  alarm.remove();
  
}

function deleteAlarmFromLocal(time) {
  const alarms = checkAlarams();

  const index = alarms.indexOf(time);
  alarms.splice(index, 1);
  localStorage.setItem("alarms", JSON.stringify(alarms));
  audio.pause();
  alert('Alarm was cleared!');
}