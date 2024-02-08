const startTimerBtn = document.getElementById("start-timer-btn");
const addTaskBtn = document.getElementById("add-task-btn");
const resetTimerBtn = document.getElementById("reset-timer-btn");
const timeElement = document.getElementById("time");
const tasks = [];

updateTime();
setInterval(updateTime, 1000);

function updateTime() {
  chrome.storage.local.get(["timer", "timeOption"], (res) => {
    const timeOption = res.timeOption || 25;

    const minutes = `${timeOption - Math.ceil(res.timer / 60)}`.padStart(
      2,
      "0"
    );
    let seconds = "00";
    if (res.timer % 60 > 0) {
      seconds = `${60 - (res.timer % 60)}`.padStart(2, "0");
    }
    timeElement.innerText = minutes + ":" + seconds;
  });
}

chrome.storage.sync.get(["tasks"], (result) => {
  if (result.tasks) {
    result.tasks.forEach((task, i) => {
      tasks.push(task);
      renderTasks(i);
    });
  }
});

addTaskBtn.addEventListener("click", addTask);

function saveTasks() {
  chrome.storage.sync.set({ tasks });
}

function renderTasks(taskNum) {
  const taskRow = document.createElement("div");

  const text = document.createElement("input");
  text.type = "text";
  text.placeholder = "Enter a task...";
  text.value = tasks[taskNum];
  text.addEventListener("input", () => {
    tasks[taskNum] = text.value;
    saveTasks();
  });

  const deleteBtn = document.createElement("input");
  deleteBtn.type = "button";
  deleteBtn.value = "X";
  deleteBtn.addEventListener("click", () => {
    deleteTask(taskNum, taskRow);
  });

  taskRow.appendChild(text);
  taskRow.appendChild(deleteBtn);

  const taskContainer = document.getElementById("task-container");
  taskContainer.appendChild(taskRow);
}

function addTask() {
  const taskNum = tasks.length;
  tasks.push("");
  saveTasks();

  renderTasks(taskNum);
}

function deleteTask(taskNum, taskRow) {
  taskRow.remove();
  tasks.splice(taskNum, 1);
  saveTasks();
}

startTimerBtn.addEventListener("click", (event) => {
  chrome.storage.local.get(["isRunning"], (res) => {
    chrome.storage.local.set({ isRunning: !res.isRunning }, () => {
      startTimerBtn.innerText = res.isRunning ? "Start Timer" : "Stop Timer";
    });
  });
});

resetTimerBtn.addEventListener("click", () => {
  chrome.storage.local.set({ timer: 0, isRunning: false }, () => {
    startTimerBtn.innerText = "Start Timer";
  });
});
