let mds = document.getElementById("markdown-source");
let mdr = document.getElementById("markdown-render");

let activeFiles = document.getElementById("active-files");
let activeFolder = document.getElementById("active-folder");
let activeFilesList = document.getElementById("active-files-list");
let sourceLineNumber = document.getElementById("source-line-number");
let activeFilesInFolder = document.getElementById("files-in-active-foler");
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
let filePathList = ["_blank"];
let fileContent = {"_blank": ""};
let fileHTML = {"_blank": ""};
let fileNames = {"_blank": ""};
let activeFilePath = "_blank";

mds.contentEditable = false;

mds.addEventListener("input", () => {
  mdr.innerHTML = window.electron.markdown(mds.innerText);
  fileContent[activeFilePath] = mds.innerText;
  fileHTML[activeFilePath] = mds.innerHTML;
  reloadLineNumber();
});

mds.addEventListener("click", () => {
  showOptionContent = false;
  for (let j = 0; j < firstOptions.length; j++) {
    firstOptions[j].getElementsByClassName("option-content")[0].style.display =
      "none";
  }
});
mdr.addEventListener("click", () => {
  showOptionContent = false;
  for (let j = 0; j < firstOptions.length; j++) {
    firstOptions[j].getElementsByClassName("option-content")[0].style.display =
      "none";
  }
});
explorer.addEventListener("click", () => {
  showOptionContent = false;
  for (let j = 0; j < firstOptions.length; j++) {
    firstOptions[j].getElementsByClassName("option-content")[0].style.display =
      "none";
  }
});

for (let i = 0; i < options.length; i++) {
  clickable(options[i]);
}

for (let i = 0; i < firstOptions.length; i++) {
  firstOptions[i].addEventListener("mouseover", (event) => {
    if (showOptionContent) {
      for (let j = 0; j < firstOptions.length; j++) {
        if (firstOptions[j] != event.currentTarget) {
          firstOptions[j].getElementsByClassName(
            "option-content"
          )[0].style.display = "none";
        } else {
          firstOptions[j].getElementsByClassName(
            "option-content"
          )[0].style.display = "block";
        }
      }
    }
  });
  firstOptions[i].addEventListener("click", (event) => {
    showOptionContent = !showOptionContent;
    for (let j = 0; j < firstOptions.length; j++) {
      firstOptions[j].getElementsByClassName(
        "option-content"
      )[0].style.display = "none";
    }
    if (showOptionContent) {
      event.currentTarget.getElementsByClassName(
        "option-content"
      )[0].style.display = "block";
    }
  });
}

for (let i = 0; i < secondOptions.length; i++) {
  secondOptions[i].addEventListener("click", () => {
    showOptionContent = false;
    for (let j = 0; j < firstOptions.length; j++) {
      firstOptions[j].getElementsByClassName(
        "option-content"
      )[0].style.display = "none";
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
  reader.onload = function() {
    activateNew(
      file.path,
      file.name,
      this.result,
      "<div>" + htmlEscape(this.result) + "</div>"
    );
  };
});

activeFiles.addEventListener("click", () => {
  showFilesList = !showFilesList;
  if (showFilesList) {
    activeFilesList.style.display = "block";
    activeFileIcon.src = "./images/down-arrow.svg";
  } else {
    activeFilesList.style.display = "none";
    activeFileIcon.src = "./images/right-arrow.svg";
  }
});

function reloadLineNumber() {
  sourceLineNumber.innerHTML = "";
  for(let i = 1; i <= mds.children.length; i++) {
    let newEle = document.createElement("div");
    newEle.innerText = i;
    sourceLineNumber.appendChild(newEle);
  }
}

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
  filePathList.forEach((filePath) => {
    if(filePath == "_blank") {
      return ;
    }
    let liFile = document.createElement("li");
    let liFileName = document.createElement("span");
    liFile.innerHTML = "<span><img id=\"active-file-icon\" src=\"./images/red-cross.svg\" style=\"width: 1em\" /></span>";
    liFileName.innerText = fileNames[filePath];
    let liFileIcon = liFile.children[0].children[0];
    liFile.appendChild(liFileName);
    
    liFile.classList.add("option", "explorer-option");
    liFile.setAttribute("filePath", filePath);
    clickable(liFile);
    liFileName.addEventListener("click", (event) => {
      activateAnotherFile(event.currentTarget.parentNode.getAttribute("filePath"));
    });
    liFileIcon.addEventListener("click", (event) => {
      event.currentTarget.src = "./images/white-cross.svg";
      let closeFilePath = event.currentTarget.parentNode.parentNode.getAttribute("filePath");
      if(activeFilePath == closeFilePath) {
        let newFileIndex = filePathList.indexOf(closeFilePath) == 1 ? 2 : 1;
        if(filePathList.length == 2) {
          activeFilePath = "_blank";
          mds.contentEditable = false;
        } else {
          activeFilePath = filePathList[newFileIndex];
        }
      }
      let closeFileIndex = filePathList.indexOf(closeFilePath);
      filePathList.splice(closeFileIndex, 1);
      delete fileContent[closeFilePath];
      delete fileHTML[closeFilePath];
      delete fileNames[closeFilePath];
      mds.innerHTML = fileHTML[activeFilePath];
      mdr.innerHTML = window.electron.markdown(mds.innerText);
      fileContent[activeFilePath] = mds.innerText;
      fileHTML[activeFilePath] = mds.innerHTML;
      reloadLineNumber();
      reloadExplorer();
    })
    ulFiles.appendChild(liFile);
  });
  activeFilesList.appendChild(ulFiles);
}

function newUntitledFile() {
  untitledFileNum++;
  let untitledFileName = "untitled" + untitledFileNum.toString();
  activateNew(
    untitledFileName,
    untitledFileName,
    "",
    "<div># " + untitledFileName + "</div>"
  );
}

function activateAnotherFile(filePath) {
  document.title = "Markex - " + fileNames[filePath];
  activeFilePath = filePath;
  mds.innerHTML = fileHTML[activeFilePath];
  mdr.innerHTML = window.electron.markdown(mds.innerText);
  mds.contentEditable = true;
  reloadLineNumber();
}

function activateNew(filePath, fileName, content, html) {
  filePathList.push(filePath);
  fileNames[filePath] = fileName;
  fileContent[filePath] = content;
  fileHTML[filePath] = html;
  activateAnotherFile(filePath);
  reloadExplorer();
}

async function saveActiveFile() {
  if(activeFilePath == "_blank") {
    return ;
  }
  let rawFilePath = activeFilePath;
  let filePath = rawFilePath;
  if (filePath.startsWith("untitled")) {
    filePath = "";
  }
  let newFilePath = await window.electron.fileSave(
    fileContent[activeFilePath],
    filePath
  );
  if (newFilePath) {
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

function htmlEscape(text) {
  return text
    .replace(/[<>"&]/g, (match, _pos, _originalText) => {
      switch (match) {
        case "<":
          return "&lt;";
        case ">":
          return "&gt;";
        case "&":
          return "&amp;";
        case '"':
          return "&quot;";
      }
    })
    .replace(/\r\n(\r\n)+/g, (match, _pos, _originalText) => {
      let matchTime = match.split('\n').length - 1;
      let result = "</div><div>";
      for(let i = 1; i < matchTime; i++) {
        result += "<br/></div><div>";
      }
      return result;
    })
    .replace(/\r\n/g, "</div><div>")
}
