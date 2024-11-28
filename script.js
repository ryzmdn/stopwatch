"use strict";

class LapQueue {
  constructor(maxLap = 50) {
    this.maxLap = maxLap;
    this.queue = [];
  }

  enqueue(lapCheckpoint) {
    if (this.queue.length >= this.maxLap) {
      this.dequeue();
    }
    this.queue.unshift(lapCheckpoint);
  }

  dequeue() {
    return this.queue.pop();
  }

  clear() {
    this.queue.length = 0;
  }

  getAll() {
    return this.queue;
  }
}

class Stopwatch {
  constructor() {
    this.timer = null;
    this.elapsedTime = 0;
    this.isStart = false;
    this.interval = null;
    this.lastLapTime = 0;
    this.lapCount = 0;

    this.lapQueue = new LapQueue(50);

    this.timeHour = document.querySelector(".hour");
    this.timeMinute = document.querySelector(".minute");
    this.timeSeconds = document.querySelector(".second");
    this.timeMillisecond = document.querySelector(".millisecond");
    this.lapsContainer = document.querySelector(".laps-container");
    this.startPauseButton = document.querySelector(".start-pause-button");
  }

  formatTime(ms) {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = Math.floor((ms % 1000) / 10);

    return {
      hours: String(hours).padStart(2, "0"),
      minutes: String(minutes).padStart(2, "0"),
      seconds: String(seconds).padStart(2, "0"),
      milliseconds: String(milliseconds).padStart(2, "0"),
    };
  }

  updateDisplay() {
    const time = this.formatTime(this.elapsedTime);
    this.timeHour.textContent = time.hours;
    this.timeMinute.textContent = time.minutes;
    this.timeSeconds.textContent = time.seconds;
    this.timeMillisecond.textContent = time.milliseconds;
  }

  startPause() {
    if (this.isStart) {
      clearInterval(this.interval);
      this.isStart = false;
      this.startPauseButton.innerHTML = '<i class="fas fa-play"></i>';
    } else {
      this.timer = Date.now() - this.elapsedTime;
      this.interval = setInterval(() => {
        this.elapsedTime = Date.now() - this.timer;
        this.updateDisplay();
      }, 10);
      this.isStart = true;
      this.startPauseButton.innerHTML = '<i class="fas fa-pause"></i>';
    }
  }

  flag() {
    if (!this.isStart) return;

    this.lapCount++;
    const currentLapTime = this.elapsedTime;
    const lapDifference = currentLapTime - this.lastLapTime;

    const lapCheckpoint = {
      lapNumber: this.lapCount,
      lapTime: currentLapTime,
      lapDifference: lapDifference,
    };

    this.lapQueue.enqueue(lapCheckpoint);
    this.lastLapTime = currentLapTime;

    this.renderLaps();
  }

  renderLaps() {
    this.lapsContainer.innerHTML = "";

    this.lapQueue.getAll().forEach((lap) => {
      const currentTime = this.formatTime(lap.lapTime);
      const differenceTime = this.formatTime(lap.lapDifference);

      const lapElement = document.createElement("li");
      lapElement.className = "lap-list";
      lapElement.innerHTML = `
        <div>${lap.lapNumber}</div>
        <div>+${differenceTime.minutes}:${differenceTime.seconds}.${differenceTime.milliseconds}</div>
        <div>${currentTime.hours}:${currentTime.minutes}:${currentTime.seconds}.${currentTime.milliseconds}</div>
      `;

      this.lapsContainer.appendChild(lapElement);
    });
  }

  reset() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }

    this.timer = null;
    this.elapsedTime = 0;
    this.lastLapTime = 0;
    this.lapCount = 0;
    this.isStart = false;

    this.lapQueue.clear();

    this.startPauseButton.innerHTML = '<i class="fas fa-play"></i>';
    this.updateDisplay();
    this.lapsContainer.innerHTML = "";

    if (typeof window.gc === "function") {
      window.gc();
    }
  }

  init() {
    this.startPauseButton.addEventListener("click", () => this.startPause());
    document
      .querySelector(".flag-button")
      .addEventListener("click", () => this.flag());
    document
      .querySelector(".reset-button")
      .addEventListener("click", () => this.reset());
  }
}

const stopwatch = new Stopwatch();
stopwatch.init();
