// This file handles file input and upload.
const fileInput = document.querySelector(".file_input");
const fileUpload = document.querySelector(".uploadBtn");
const Progressbar = document.querySelector(".progressbar");
const bgProgress = document.querySelector(".bg-progress");
const fgProgress = document.querySelector(".fg-progress");
const progressValue = document.querySelector(".progress-status");
const outputContainer = document.querySelector(".output");
const fileURL = document.querySelector("#fileURL");
const copyBtn = document.querySelector("#copyBtn");
const closeBtn = document.querySelector("#closeBtn");
const alertMsg = document.querySelector(".alert");
const maxAllowedSize = 100 * 1024 * 1024; //100mb
const host = "https://innshare.herokuapp.com";
const uploadURL = `${host}/api/files`;

fileUpload.addEventListener("click", () => {
  fileInput.click();
});

dropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  const files = e.dataTransfer.files;
  //console.log(files);
  if (files.length) {
    fileInput.files = files;
    uploadFile();
  }
});

fileInput.addEventListener("change", () => {
  uploadFile();
});

copyBtn.addEventListener("click", () => {
  fileURL.select();
  document.execCommand("copy");
  displayAlert("Link Copied!");
});

closeBtn.addEventListener('click', () => {
  outputContainer.style.display = "none";
});

const uploadFile = () => {

  if (containerStatus == "opened") {
    outputContainer.style.display = "none";
    containerStatus = "closed";
  }

  Progressbar.style.display = "block";
  const file = fileInput.files[0];
  const formData = new FormData();
  formData.append("myfile", file);

  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = () => {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      displayLink(JSON.parse(xhr.response));
    }
  };

  xhr.upload.onprogress = updateProgressbar;

  xhr.upload.onerror = function () {
    displayAlert("Error in upload");
    fileInput.value = ""; // reset the input
    Progressbar.style.display = "none";
    outputContainer.style.display = "none";
  };

  xhr.upload.onload = function () {
    resetProgressbar();
  };

  xhr.open("POST", uploadURL);
  xhr.send(formData);
};

const updateProgressbar = (e) => {
  const progress = Math.round((e.loaded / e.total) * 100);
  bgProgress.style.width = `${progress}%`;
  fgProgress.style.transform = `scaleX(${progress / 100})`;
  progressValue.innerText = progress;
};

const resetProgressbar = () => {
  progress = 0;
  bgProgress.style.width = `${progress}%`;
  fgProgress.style.transform = `scaleX(${progress / 100})`;
  Progressbar.style.display = "none";
};

let containerStatus;
const displayLink = ({file: url}) => {
  console.log(url);
  Progressbar.style.display = "none";
  outputContainer.style.display = "block";
  fileURL.value = url;
  containerStatus = "opened";
};

let alertTimer;
// the toast function
const displayAlert = (msg) => {
  alertMsg.innerText = msg;
  alertMsg.style.transform = "translate(-50%,0)";
  clearTimeout(alertTimer);
  alertTimer = setTimeout(() => {
    alertMsg.style.transform = "translate(-50%,60px)";
  }, 1500);
};
