"use strict";
var EditableField = (function () {
    function EditableField(valueOwner, valueName, container) {
        this.FieldID = EditableField.IDCounter++;
        this.ValueOwner = valueOwner;
        this.ValueName = valueName;
        this.Container = container;
        this.Container.setAttribute("data-FieldID", this.FieldID.toString());
        this.DisplayElement = this.GetDisplayElement();
        this.EditElement = this.GetEditElement();
        this.ApplyValueToDisplayElement();
        this.ShowEditMode(false);
        this.Container.appendChild(this.DisplayElement);
        this.Container.appendChild(this.EditElement);
    }
    EditableField.prototype.ShowEditMode = function (editMode) {
        if (editMode) {
            this.DisplayElement.style.display = "none";
            this.EditElement.style.display = "block";
        }
        else {
            this.DisplayElement.style.display = "block";
            this.EditElement.style.display = "none";
        }
    };
    EditableField.prototype.StartEdit = function () {
        if (EditableField.EditedField) {
            EditableField.EditedField.EndEdit();
        }
        EditableField.EditedField = this;
        this.ApplyValueToEditElement();
        this.ShowEditMode(true);
    };
    EditableField.prototype.EndEdit = function (saveChanges) {
        if (saveChanges === void 0) { saveChanges = true; }
        if (EditableField.EditedField && EditableField.EditedField.FieldID != this.FieldID) {
            console.warn("Tried to end edit of not edited field. Maybe throw?");
        }
        if (saveChanges) {
            this.ApplyChangesToValue();
            this.ApplyValueToDisplayElement();
        }
        EditableField.EditedField = null;
        this.ShowEditMode(false);
    };
    EditableField.prototype.GetDisplayElement = function () {
        var _this = this;
        if (!this.ValueOwner || !this.ValueOwner.hasOwnProperty(this.ValueName)) {
            throw this.ValueOwner + " or " + this.ValueOwner + "." + this.ValueName + " is null/undefined";
        }
        var output;
        if (typeof this.ValueOwner[this.ValueName] == "object" && "GetDisplayElement" in this.ValueOwner[this.ValueName]) {
            output = this.ValueOwner[this.ValueName].GetDisplayElement();
        }
        else if (this.ValueOwner.EditableFieldMetadata &&
            this.ValueOwner.EditableFieldMetadata[this.ValueName] &&
            "GetDisplayElement" in this.ValueOwner.EditableFieldMetadata[this.ValueName]) {
            output = this.ValueOwner.EditableFieldMetadata[this.ValueName].GetDisplayElement();
        }
        else if (typeof this.ValueOwner[this.ValueName] == "string") {
            var tmp = document.createElement("div");
            tmp.classList.add("content-cell-content");
            output = tmp;
        }
        else if (typeof this.ValueOwner[this.ValueName] == "number") {
            var tmp = document.createElement("div");
            tmp.classList.add("content-cell-content");
            output = tmp;
        }
        else if (typeof this.ValueOwner[this.ValueName] == "boolean") {
            var tmp = document.createElement("input");
            tmp.classList.add("content-cell-content");
            tmp.type = "checkbox";
            output = tmp;
        }
        else {
            console.warn(this.ValueOwner[this.ValueName]);
            console.warn(this.ValueOwner[this.ValueName] + " doesn't implement IEditable");
            var tmp = document.createElement("div");
            tmp.classList.add("content-cell-content");
            output = tmp;
        }
        if (typeof this.ValueOwner[this.ValueName] != "boolean") {
            output.addEventListener("dblclick", function () {
                _this.StartEdit();
            });
        }
        return output;
    };
    EditableField.prototype.GetEditElement = function () {
        if (!this.ValueOwner || !this.ValueOwner.hasOwnProperty(this.ValueName)) {
            throw this.ValueOwner + " or " + this.ValueOwner + "." + this.ValueName + " is null/undefined";
        }
        var output;
        if (typeof this.ValueOwner[this.ValueName] == "object" && "GetEditElement" in this.ValueOwner[this.ValueName]) {
            output = this.ValueOwner[this.ValueName].GetEditElement();
        }
        else if (this.ValueOwner.EditableFieldMetadata &&
            this.ValueOwner.EditableFieldMetadata[this.ValueName] &&
            "GetEditElement" in this.ValueOwner.EditableFieldMetadata[this.ValueName]) {
            output = this.ValueOwner.EditableFieldMetadata[this.ValueName].GetEditElement();
        }
        else if (typeof this.ValueOwner[this.ValueName] == "string") {
            var tmp = document.createElement("input");
            tmp.classList.add("content-cell-content");
            output = tmp;
        }
        else if (typeof this.ValueOwner[this.ValueName] == "number") {
            var tmp = document.createElement("input");
            tmp.classList.add("content-cell-content");
            output = tmp;
        }
        else if (typeof this.ValueOwner[this.ValueName] == "boolean") {
            var tmp = document.createElement("div");
            tmp.classList.add("content-cell-content");
            output = tmp;
        }
        else {
            console.warn(this.ValueOwner[this.ValueName]);
            console.warn(this.ValueOwner[this.ValueName] + " doesn't implement IEditable");
            var tmp = document.createElement("div");
            tmp.classList.add("content-cell-content");
            output = tmp;
        }
        return output;
    };
    EditableField.prototype.ApplyValueToDisplayElement = function () {
        if (!this.ValueOwner || !this.ValueOwner.hasOwnProperty(this.ValueName)) {
            throw this.ValueOwner + " or " + this.ValueOwner + "." + this.ValueName + " is null/undefined";
        }
        if (typeof this.ValueOwner[this.ValueName] == "object" && "ApplyValueToDisplayElement" in this.ValueOwner[this.ValueName]) {
            this.ValueOwner[this.ValueName].ApplyValueToDisplayElement(this.DisplayElement);
        }
        else if (this.ValueOwner.EditableFieldMetadata &&
            this.ValueOwner.EditableFieldMetadata[this.ValueName] &&
            "ApplyValueToDisplayElement" in this.ValueOwner.EditableFieldMetadata[this.ValueName]) {
            this.ValueOwner.EditableFieldMetadata[this.ValueName].ApplyValueToDisplayElement(this.DisplayElement);
        }
        else if (typeof this.ValueOwner[this.ValueName] == "string") {
            this.DisplayElement.innerHTML = this.ValueOwner[this.ValueName];
        }
        else if (typeof this.ValueOwner[this.ValueName] == "number") {
            this.DisplayElement.innerHTML = this.ValueOwner[this.ValueName].toString();
        }
        else if (typeof this.ValueOwner[this.ValueName] == "boolean") {
            this.DisplayElement.checked = this.ValueOwner[this.ValueName];
        }
        else {
            console.warn(this.ValueOwner[this.ValueName]);
            console.warn(this.ValueOwner[this.ValueName] + " doesn't implement IEditable");
        }
    };
    EditableField.prototype.ApplyValueToEditElement = function () {
        if (!this.ValueOwner || !this.ValueOwner.hasOwnProperty(this.ValueName)) {
            throw this.ValueOwner + " or " + this.ValueOwner + "." + this.ValueName + " is null/undefined";
        }
        if (typeof this.ValueOwner[this.ValueName] == "object" && "ApplyValueToEditElement" in this.ValueOwner[this.ValueName]) {
            this.ValueOwner[this.ValueName].ApplyValueToEditElement();
        }
        else if (this.ValueOwner.EditableFieldMetadata &&
            this.ValueOwner.EditableFieldMetadata[this.ValueName] &&
            "ApplyValueToEditElement" in this.ValueOwner.EditableFieldMetadata[this.ValueName]) {
            this.ValueOwner.EditableFieldMetadata[this.ValueName].ApplyValueToEditElement(this.EditElement);
        }
        else if (typeof this.ValueOwner[this.ValueName] == "string") {
            this.EditElement.value = this.ValueOwner[this.ValueName];
        }
        else if (typeof this.ValueOwner[this.ValueName] == "number") {
            this.EditElement.value = this.ValueOwner[this.ValueName].toString();
        }
        else if (typeof this.ValueOwner[this.ValueName] == "boolean") {
            this.EditElement.innerHTML = "This shouldn't be visible";
        }
        else {
            console.warn(this.ValueOwner[this.ValueName]);
            console.warn(this.ValueOwner[this.ValueName] + " doesn't implement IEditable");
        }
    };
    EditableField.prototype.ApplyChangesToValue = function () {
        if (!this.ValueOwner || !this.ValueOwner.hasOwnProperty(this.ValueName)) {
            throw this.ValueOwner + " or " + this.ValueOwner + "." + this.ValueName + " is null/undefined";
        }
        if (typeof this.ValueOwner[this.ValueName] == "object" && "ApplyValueToDisplayElement" in this.ValueOwner[this.ValueName]) {
            this.ValueOwner[this.ValueName].ApplyValueToEditElement();
        }
        else if (this.ValueOwner.EditableFieldMetadata &&
            this.ValueOwner.EditableFieldMetadata[this.ValueName] &&
            "ApplyChangesToValue" in this.ValueOwner.EditableFieldMetadata[this.ValueName]) {
            this.ValueOwner.EditableFieldMetadata[this.ValueName].ApplyChangesToValue(this.EditElement);
        }
        else if (typeof this.ValueOwner[this.ValueName] == "string") {
            this.ValueOwner[this.ValueName] = this.EditElement.value;
        }
        else if (typeof this.ValueOwner[this.ValueName] == "number") {
            this.ValueOwner[this.ValueName] = parseFloat(this.EditElement.value.replace(",", "."));
        }
        else if (typeof this.ValueOwner[this.ValueName] == "boolean") {
            console.warn("Boolean doesn't use edit mode, this shouldn't be called");
        }
        else {
            console.warn(this.ValueOwner[this.ValueName]);
            console.warn(this.ValueOwner[this.ValueName] + " doesn't implement IEditable");
        }
    };
    EditableField.EditedField = null;
    EditableField.IDCounter = 0;
    return EditableField;
}());
window.addEventListener("pointerup", function (e) {
    if (EditableField.EditedField) {
        if (e.srcElement) {
            var currentElement = e.srcElement;
            var foundEdited = false;
            while (currentElement != null) {
                if (currentElement.getAttribute("data-FieldID") == EditableField.EditedField.FieldID.toString() ||
                    currentElement.getAttribute("data-FieldID") == "-1") {
                    foundEdited = true;
                    break;
                }
                currentElement = currentElement.parentElement;
            }
            if (foundEdited) {
            }
            else {
                EditableField.EditedField.EndEdit();
            }
        }
    }
    else {
    }
});
window.addEventListener("keyup", function (e) {
    if (EditableField.EditedField) {
        switch (e.key) {
            case "Escape":
                EditableField.EditedField.EndEdit(false);
                break;
            case "Enter":
                EditableField.EditedField.EndEdit();
                break;
        }
    }
});
var Engine = (function () {
    function Engine() {
        this.EditableFieldMetadata = {};
        this.Active = false;
        this.ID = "New-Engine";
        this.Mass = 1;
        this.Thrust = 1000;
        this.AtmIsp = 250;
        this.VacIsp = 300;
        this.PropellantRatio = {};
        this.FuelVolumeRatios = false;
        this.UseBaseWidth = true;
        this.Width = 1;
        this.Height = 2;
        this.Cost = 1000;
        this.MinThrust = 90;
        this.Ignitions = 1;
        this.PressureFed = false;
        this.NeedsUllage = true;
        this.EnableTestFlight = false;
        this.RatedBurnTime = 180;
        this.StartReliability0 = 92;
        this.StartReliability10k = 96;
        this.CycleReliability0 = 90;
        this.CycleReliability10k = 98;
        this.AlternatorPower = 0;
        this.Gimbal = 6;
        this.AdvancedGimbal = false;
        this.GimbalNX = 30;
        this.GimbalPX = 30;
        this.GimbalNY = 0;
        this.GimbalPY = 0;
        this.ModelID = 0;
        this.PlumeID = 0;
        this.TechUnlockNode = 0;
        this.EngineName = "";
        this.EngineManufacturer = "Generic Engines";
        this.EngineDescription = "This engine was generated by Generic Engines";
        this.EngineVariant = 0;
        this.UseTanks = false;
        this.LimitTanks = true;
        this.TanksVolume = 0;
        this.TanksContents = {};
        this.PolyType = 0;
        this.MasterEngineName = "";
        this.MasterEngineCost = 0;
        this.MasterEngineMass = 0;
    }
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
var HtmlTable = (function () {
    function HtmlTable(container) {
        var _this = this;
        this.Items = [];
        this.ColumnsDefinitions = {};
        this.Columns = {};
        this.Rows = {};
        this.SelectedRows = [];
        this.DragInterval = null;
        this.TableContainer = container;
        this.TableElement = document.createElement("div");
        this.TableElement.classList.add("content-table");
        this.TableContainer.innerHTML = "";
        this.TableContainer.appendChild(this.TableElement);
        window.addEventListener("pointerup", function () {
            if (_this.DragInterval) {
                clearInterval(_this.DragInterval);
            }
            _this.DragInterval = null;
        });
        window.addEventListener("pointerdown", function (e) {
            if (e.srcElement) {
                var currentElement = e.srcElement;
                var pressedOnRow = null;
                var i = void 0;
                while (currentElement != null) {
                    if (i = currentElement.getAttribute("data-tableRow")) {
                        pressedOnRow = parseInt(i);
                        break;
                    }
                    currentElement = currentElement.parentElement;
                }
                if (pressedOnRow) {
                    _this.SelectRow(e.ctrlKey, pressedOnRow);
                }
                else {
                }
            }
        });
    }
    HtmlTable.AutoGenerateColumns = function (exampleObject) {
        var output = {};
        for (var i in exampleObject) {
            if (typeof exampleObject[i] == "function" ||
                i == "EditableFieldMetadata") {
                continue;
            }
            output[i] = i.toUpperCase();
        }
        return output;
    };
    HtmlTable.prototype.AddItem = function (newItem) {
        this.Items.push(newItem);
        this.Rows[HtmlTable.RowCounter] = [Array(Object.getOwnPropertyNames(this.ColumnsDefinitions).length), newItem];
        var x = 0;
        for (var columnID in this.ColumnsDefinitions) {
            var columnCell = document.createElement("div");
            columnCell.classList.add("content-cell");
            columnCell.setAttribute("data-tableRow", (HtmlTable.RowCounter).toString());
            var cellField = new EditableField(newItem, columnID, columnCell);
            this.Rows[HtmlTable.RowCounter][0][x] = columnCell;
            this.Columns[columnID].appendChild(columnCell);
            ++x;
        }
        ++HtmlTable.RowCounter;
    };
    HtmlTable.prototype.RemoveSelectedItems = function () {
        var _this = this;
        this.SelectedRows.forEach(function (row) {
            _this.Rows[row][0].forEach(function (element) {
                element.remove();
            });
            _this.Items.splice(_this.Items.indexOf(_this.Rows[row][1]), 1);
            delete _this.Rows[row];
        });
        this.SelectedRows = [];
    };
    HtmlTable.prototype.SelectRow = function (appendToggle, row) {
        var _this = this;
        if (appendToggle) {
            if (this.SelectedRows.some(function (x) { return x == row; })) {
                this.SelectedRows = this.SelectedRows.filter(function (x) { return x != row; });
                this.Rows[row][0].forEach(function (cell) {
                    cell.classList.remove("selected");
                });
            }
            else {
                this.SelectedRows.push(row);
                this.Rows[row][0].forEach(function (cell) {
                    cell.classList.add("selected");
                });
            }
        }
        else {
            this.SelectedRows.forEach(function (rowNumber) {
                _this.Rows[rowNumber][0].forEach(function (cell) {
                    cell.classList.remove("selected");
                });
            });
            this.SelectedRows = [row];
            this.Rows[row][0].forEach(function (cell) {
                cell.classList.add("selected");
            });
        }
    };
    HtmlTable.prototype.RebuildTable = function () {
        var _this = this;
        if (Object.getOwnPropertyNames(this.ColumnsDefinitions).length == 0) {
            console.log(this);
            console.log("No columns were set.");
            return;
        }
        var ItemsBackup = new Array().concat(this.Items);
        this.Items = [];
        this.SelectedRows = [];
        for (var i in this.Rows) {
            this.SelectedRows.push(parseInt(i));
        }
        this.RemoveSelectedItems();
        this.TableElement.innerHTML = "";
        this.Columns = {};
        var _loop_1 = function (columnID) {
            var column = document.createElement("div");
            column.classList.add("content-column");
            this_1.Columns[columnID] = column;
            var columnResizer = document.createElement("div");
            columnResizer.classList.add("content-column-resizer");
            columnResizer.setAttribute("data-FieldID", "-1");
            columnResizer.onpointerdown = function () {
                var originalX = Input.MouseX;
                var originalWidth = column.style.width ? parseInt(column.style.width) : 400;
                _this.DragInterval = setInterval(function () {
                    var newWidth = originalWidth + Input.MouseX - originalX;
                    newWidth = Math.max(24, newWidth);
                    column.style.width = newWidth + "px";
                }, 10);
            };
            column.appendChild(columnResizer);
            var columnHeader = document.createElement("div");
            columnHeader.classList.add("content-header");
            columnHeader.innerHTML = this_1.ColumnsDefinitions[columnID];
            column.appendChild(columnHeader);
            this_1.TableElement.appendChild(column);
        };
        var this_1 = this;
        for (var columnID in this.ColumnsDefinitions) {
            _loop_1(columnID);
        }
        for (var _i = 0, ItemsBackup_1 = ItemsBackup; _i < ItemsBackup_1.length; _i++) {
            var i = ItemsBackup_1[_i];
            this.AddItem(i);
        }
    };
    HtmlTable.RowCounter = 1;
    return HtmlTable;
}());
var Input = (function () {
    function Input() {
    }
    Input.MouseX = 0;
    Input.MouseY = 0;
    return Input;
}());
window.onpointermove = function (event) {
    Input.MouseX = event.clientX;
    Input.MouseY = event.clientY;
};
var ListName = "Unnamed";
var test;
addEventListener("DOMContentLoaded", function () {
    document.addEventListener('contextmenu', function (event) { return event.preventDefault(); });
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
    var ListNameDisplay = new EditableField(window, "ListName", document.getElementById("list-name"));
    test = new HtmlTable(document.getElementById("list-container"));
    var test1 = [
        new Engine(),
        new Engine(),
        new Engine(),
        new Engine(),
        new Engine(),
        new Engine(),
        new Engine(),
    ];
    for (var i = 0; i < 64 - 7; ++i) {
        test1.push(new Engine());
    }
    test.ColumnsDefinitions = HtmlTable.AutoGenerateColumns(new Engine());
    test.Items = test1;
    test.RebuildTable();
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
    test.AddItem(new Engine());
}
function RemoveButton_Click() {
    test.RemoveSelectedItems();
}
function SettingsButton_Click() {
}
function HelpButton_Click() {
}
//# sourceMappingURL=index.js.map