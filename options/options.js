const timeOption = document.getElementById("time-option");
const saveBtn = document.getElementById("save-btn");

chrome.storage.local.get(["timeOption"], (res) => {
  timeOption.value = res.timeOption || 25;
});

timeOption.addEventListener("change", (event) => {
  const val = event.target.value;
  if (val < 1 ?? val > 60) {
    timeOption.value = 25;
  }
});

saveBtn.addEventListener("click", () => {
  chrome.storage.local.set({
    isRunning: false,
    timer: 0,
    timeOption: timeOption.value,
  });
});
