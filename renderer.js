let mds = document.getElementById('markdown-source');
let mdr = document.getElementById('markdown-render');

let activeFiles = document.getElementById('active-files');
let activeFolder = document.getElementById('active-folder');
let activeFilesList = document.getElementById('active-files-list');
let activeFilesInFolder = document.getElementById('files-in-active-foler');
let activeFileIcon = document.getElementById("active-file-icon");
let activeFolderIcon = document.getElementById("active-folder-icon");
let showFilesList = false;
let showFilesInFolder = false;

let showOptionContent = false;
let options = document.getElementsByClassName("option");
let firstOptions = document.getElementsByClassName("first-option");
let secondOptions = document.getElementsByClassName("second-option");

let fileOpener = document.getElementById("open-file");
let fileChooser = document.getElementById("choose-file");
let untitledFileNum = 0;
// key: path
let filePathList = [];
let fileContent = {};
let fileNames = {};
let activeFilePath = "";

newUntitledFile();

mds.addEventListener("input", () => {
  mdr.innerHTML = window.electron.markdown(mds.innerText);
  fileContent[activeFilePath] = mds.innerText;
});

mds.addEventListener("click", () => {
  showOptionContent = false;
  for(var j = 0; j < firstOptions.length; j++) {
    firstOptions[j].getElementsByClassName("option-content")[0].style.display = "none";
  }
});
mdr.addEventListener("click", () => {
  showOptionContent = false;
  for(var j = 0; j < firstOptions.length; j++) {
    firstOptions[j].getElementsByClassName("option-content")[0].style.display = "none";
  }
});
explorer.addEventListener("click", () => {
  showOptionContent = false;
  for(var j = 0; j < firstOptions.length; j++) {
    firstOptions[j].getElementsByClassName("option-content")[0].style.display = "none";
  }
});


for(var i = 0; i < options.length; i++) {
  clickable(options[i]);
}

for(var i = 0; i < firstOptions.length; i++){
  firstOptions[i].addEventListener("mouseover", (event) => {
    if(showOptionContent) {
      for(var j = 0; j < firstOptions.length; j++) {
        if(firstOptions[j] != event.currentTarget) {
          firstOptions[j].getElementsByClassName("option-content")[0].style.display = "none";
        } else {
          firstOptions[j].getElementsByClassName("option-content")[0].style.display = "block";
        }
      }
    }
  });
  firstOptions[i].addEventListener("click", (event) => {
    showOptionContent = !showOptionContent;
    for(var j = 0; j < firstOptions.length; j++) {
      firstOptions[j].getElementsByClassName("option-content")[0].style.display = "none";
    }
    if(showOptionContent) {
      event.currentTarget.getElementsByClassName("option-content")[0].style.display = "block";
    }
  });
}

for(var i = 0; i < secondOptions.length; i++) {
  secondOptions[i].addEventListener("click", () => {
    showOptionContent = false;
    for(var j = 0; j < firstOptions.length; j++) {
      firstOptions[j].getElementsByClassName("option-content")[0].style.display = "none";
    }
  });
}

fileOpener.addEventListener("click", () => {
  fileChooser.click();
});
fileChooser.addEventListener("change", (event) => {
  let file = event.currentTarget.files[0];
  let reader = new FileReader();
  reader.readAsText(file);
  reader.onload = function(){
    activateNew(file.path, file.name, this.result);
  };
});

activeFiles.addEventListener("click", () => {
  showFilesList = !showFilesList;
  if(showFilesList) {
    activeFilesList.style.display = "block";
    activeFileIcon.src = "./images/down-arrow.svg";
  } else {
    activeFilesList.style.display = "none";
    activeFileIcon.src = "./images/right-arrow.svg";
  }
});

function clickable(element) {
  element.addEventListener("mouseover", (event) => {
    event.currentTarget.style.backgroundColor = "lightgray";
  });
  element.addEventListener("mouseout", (event) => {
    event.currentTarget.style.backgroundColor = "transparent";
  });
  element.addEventListener("mousedown", (event) => {
    event.currentTarget.style.backgroundColor = "darkgray";
  });
  element.addEventListener("mouseup", (event) => {
    event.currentTarget.style.backgroundColor = "lightgray";
  });
}

function reloadExplorer() {
  activeFilesList.innerHTML = "";
  let ulFiles = document.createElement("ul");
  filePathList.forEach(filePath => {
    let liFile = document.createElement("li");
    liFile.classList.add("option", "explorer-option")
    liFile.innerText = fileNames[filePath];
    liFile.setAttribute("filePath", filePath);
    clickable(liFile);
    liFile.addEventListener("click", (event) => {
      activateAnotherFile(event.currentTarget.getAttribute("filePath"));
    })
    ulFiles.appendChild(liFile);
  });
  activeFilesList.appendChild(ulFiles);
}

function newUntitledFile() {
  untitledFileNum++;
  let untitledFileName = "untitled" + untitledFileNum.toString();
  activateNew(untitledFileName, untitledFileName, "");
}

function activateAnotherFile(filePath) {
  document.title = "Markex - " + fileNames[filePath];
  activeFilePath = filePath;
  mds.innerText = fileContent[activeFilePath];
  mdr.innerHTML = window.electron.markdown(mds.innerText);
}

function activateNew(filePath, fileName, content) {
  filePathList.push(filePath);
  fileNames[filePath] = fileName;
  fileContent[filePath] = content;
  activateAnotherFile(filePath);
  reloadExplorer();
}

async function saveActiveFile() {
  let rawFilePath = activeFilePath;
  let filePath = rawFilePath;
  if(filePath.startsWith("untitled")) {
    filePath = "";
  }
  let newFilePath = await window.electron.fileSave(fileContent[activeFilePath], filePath);
  if(newFilePath) {
    let newFileName = newFilePath.split("\\").reverse()[0];
    let newFileContent = fileContent[rawFilePath];
    filePathList[filePathList.indexOf(rawFilePath)] = newFilePath;
    delete fileNames[rawFilePath];
    delete fileContent[rawFilePath];
    fileNames[newFilePath] = newFileName;
    fileContent[newFilePath] = newFileContent;
    activateAnotherFile(newFilePath);
    reloadExplorer();
  }
}