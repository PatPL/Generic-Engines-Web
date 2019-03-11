"use strict";
var Engine = (function () {
    function Engine() {
        this.Name = "";
        this.TT = 0;
    }
    Engine.prototype.GetStuff = function () {
        return this.Name + "-" + this.TT;
    };
    return Engine;
}());
var FileIO = (function () {
    function FileIO() {
    }
    FileIO.ZipBlobs = function (rootDirName, blobs, callback) {
        var zip = new JSZip();
        var zipRoot = zip.folder(rootDirName);
        for (var blobname in blobs) {
            var blob = blobs[blobname];
            if (blob instanceof Uint8Array) {
                zipRoot.file(blobname, blob, {
                    binary: true
                });
            }
            else {
                zipRoot.file(blobname, blob, {
                    binary: false
                });
            }
        }
        zip.generateAsync({
            type: "uint8array"
        }).then(callback);
    };
    FileIO.OpenText = function (extensions, callback) {
        this.Open(FileType.Text, extensions, function (result) {
            if (callback) {
                if (result) {
                    if (typeof result === "string") {
                        callback(result);
                    }
                    else {
                        callback(null);
                    }
                }
                else {
                    callback(null);
                }
            }
        });
    };
    FileIO.OpenBinary = function (extensions, callback) {
        this.Open(FileType.Binary, extensions, function (result) {
            if (callback) {
                if (result) {
                    if (result instanceof Uint8Array) {
                        callback(result);
                    }
                    else {
                        callback(null);
                    }
                }
                else {
                    callback(null);
                }
            }
        });
    };
    FileIO.Open = function (type, extensions, callback) {
        var fileDialog = document.createElement("input");
        fileDialog.type = "file";
        if (extensions && extensions != "") {
            fileDialog.accept = extensions;
        }
        fileDialog.click();
        fileDialog.addEventListener("change", function () {
            if (!fileDialog.files || !fileDialog.files[0]) {
                console.log("No file selected?");
                if (callback) {
                    callback(null);
                }
                return;
            }
            var file = fileDialog.files[0];
            var reader = new FileReader();
            reader.onload = function () {
                if (callback) {
                    if (reader.result instanceof ArrayBuffer) {
                        callback(new Uint8Array(reader.result));
                    }
                    else {
                        callback(reader.result);
                    }
                }
            };
            if (type == FileType.Text) {
                reader.readAsText(file);
            }
            else if (type == FileType.Binary) {
                reader.readAsArrayBuffer(file);
            }
        });
    };
    FileIO.SaveText = function (filename, contents) {
        var saveDialog = document.createElement("a");
        saveDialog.href = "data:application/x-none;charset=UTF-8;base64," + btoa(contents);
        saveDialog.download = filename;
        var evt = document.createEvent("MouseEvents");
        evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        saveDialog.dispatchEvent(evt);
    };
    FileIO.SaveBinary = function (filename, contents) {
        var saveDialog = document.createElement("a");
        var blob = new Blob([contents], {
            type: "application/octet-stream"
        });
        saveDialog.href = URL.createObjectURL(blob);
        saveDialog.download = filename;
        var evt = document.createEvent("MouseEvents");
        evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        saveDialog.dispatchEvent(evt);
    };
    return FileIO;
}());
var FileType;
(function (FileType) {
    FileType[FileType["Text"] = 0] = "Text";
    FileType[FileType["Binary"] = 1] = "Binary";
})(FileType || (FileType = {}));
addEventListener("DOMContentLoaded", function () {
    var images = document.querySelectorAll(".option-button");
    images.forEach(function (image) {
        image.ondragstart = function () { return false; };
    });
    document.getElementById("option-button-new").addEventListener("click", NewButton_Click);
    document.getElementById("option-button-open").addEventListener("click", OpenButton_Click);
    document.getElementById("option-button-append").addEventListener("click", AppendButton_Click);
    document.getElementById("option-button-save").addEventListener("click", SaveButton_Click);
    document.getElementById("option-button-validate").addEventListener("click", ValidateButton_Click);
    document.getElementById("option-button-export").addEventListener("click", ExportButton_Click);
    document.getElementById("option-button-duplicate").addEventListener("click", DuplicateButton_Click);
    document.getElementById("option-button-add").addEventListener("click", AddButton_Click);
    document.getElementById("option-button-remove").addEventListener("click", RemoveButton_Click);
    document.getElementById("option-button-settings").addEventListener("click", SettingsButton_Click);
    document.getElementById("option-button-help").addEventListener("click", HelpButton_Click);
});
function NewButton_Click() {
}
function OpenButton_Click() {
}
function AppendButton_Click() {
}
function SaveButton_Click() {
}
function ValidateButton_Click() {
}
function ExportButton_Click() {
}
function DuplicateButton_Click() {
}
function AddButton_Click() {
}
function RemoveButton_Click() {
}
function SettingsButton_Click() {
}
function HelpButton_Click() {
}
