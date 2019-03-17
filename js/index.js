"use strict";
class EditableField {
    constructor(valueOwner, valueName, container) {
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
    ShowEditMode(editMode) {
        if (editMode) {
            this.DisplayElement.style.display = "none";
            this.EditElement.style.display = "block";
        }
        else {
            this.DisplayElement.style.display = "block";
            this.EditElement.style.display = "none";
        }
    }
    StartEdit() {
        if (EditableField.EditedField) {
            EditableField.EditedField.EndEdit();
        }
        EditableField.EditedField = this;
        this.ApplyValueToEditElement();
        this.ShowEditMode(true);
        if (this.EditElement.parentElement.getAttribute("data-tablerow")) {
            document.getElementById("edit-cell-height-override").innerHTML = `
                .selected {
                    height: ${this.EditElement.offsetHeight + 1}px;
                }
            `;
        }
    }
    EndEdit(saveChanges = true) {
        if (EditableField.EditedField && EditableField.EditedField.FieldID != this.FieldID) {
            console.warn("Tried to end edit of not edited field. Maybe throw?");
        }
        document.getElementById("edit-cell-height-override").innerHTML = "";
        if (saveChanges) {
            this.ApplyChangesToValue();
            this.ApplyValueToDisplayElement();
        }
        EditableField.EditedField = null;
        this.ShowEditMode(false);
    }
    GetDisplayElement() {
        if (!this.ValueOwner || !this.ValueOwner.hasOwnProperty(this.ValueName)) {
            throw `${this.ValueOwner} or ${this.ValueOwner}.${this.ValueName} is null/undefined`;
        }
        let output;
        if (typeof this.ValueOwner[this.ValueName] == "object" && "GetDisplayElement" in this.ValueOwner[this.ValueName]) {
            output = this.ValueOwner[this.ValueName].GetDisplayElement();
        }
        else if (this.ValueOwner.EditableFieldMetadata &&
            this.ValueOwner.EditableFieldMetadata[this.ValueName] &&
            "GetDisplayElement" in this.ValueOwner.EditableFieldMetadata[this.ValueName]) {
            output = this.ValueOwner.EditableFieldMetadata[this.ValueName].GetDisplayElement();
        }
        else if (typeof this.ValueOwner[this.ValueName] == "string") {
            let tmp = document.createElement("div");
            tmp.classList.add("content-cell-content");
            output = tmp;
        }
        else if (typeof this.ValueOwner[this.ValueName] == "number") {
            let tmp = document.createElement("div");
            tmp.classList.add("content-cell-content");
            output = tmp;
        }
        else if (typeof this.ValueOwner[this.ValueName] == "boolean") {
            let tmp = document.createElement("input");
            tmp.classList.add("content-cell-content");
            tmp.type = "checkbox";
            tmp.addEventListener("change", (e) => {
                this.ValueOwner[this.ValueName] = tmp.checked;
            });
            output = tmp;
        }
        else {
            console.warn(this.ValueOwner[this.ValueName]);
            console.warn(`${this.ValueOwner[this.ValueName]} doesn't implement IEditable`);
            let tmp = document.createElement("div");
            tmp.classList.add("content-cell-content");
            output = tmp;
        }
        if (typeof this.ValueOwner[this.ValueName] != "boolean") {
            output.addEventListener("dblclick", () => {
                this.StartEdit();
            });
        }
        return output;
    }
    GetEditElement() {
        if (!this.ValueOwner || !this.ValueOwner.hasOwnProperty(this.ValueName)) {
            throw `${this.ValueOwner} or ${this.ValueOwner}.${this.ValueName} is null/undefined`;
        }
        let output;
        if (typeof this.ValueOwner[this.ValueName] == "object" && "GetEditElement" in this.ValueOwner[this.ValueName]) {
            output = this.ValueOwner[this.ValueName].GetEditElement();
        }
        else if (this.ValueOwner.EditableFieldMetadata &&
            this.ValueOwner.EditableFieldMetadata[this.ValueName] &&
            "GetEditElement" in this.ValueOwner.EditableFieldMetadata[this.ValueName]) {
            output = this.ValueOwner.EditableFieldMetadata[this.ValueName].GetEditElement();
        }
        else if (typeof this.ValueOwner[this.ValueName] == "string") {
            let tmp = document.createElement("input");
            tmp.classList.add("content-cell-content");
            output = tmp;
        }
        else if (typeof this.ValueOwner[this.ValueName] == "number") {
            let tmp = document.createElement("input");
            tmp.classList.add("content-cell-content");
            output = tmp;
        }
        else if (typeof this.ValueOwner[this.ValueName] == "boolean") {
            let tmp = document.createElement("div");
            tmp.classList.add("content-cell-content");
            output = tmp;
        }
        else {
            console.warn(this.ValueOwner[this.ValueName]);
            console.warn(`${this.ValueOwner[this.ValueName]} doesn't implement IEditable`);
            let tmp = document.createElement("div");
            tmp.classList.add("content-cell-content");
            output = tmp;
        }
        return output;
    }
    ApplyValueToDisplayElement() {
        if (!this.ValueOwner || !this.ValueOwner.hasOwnProperty(this.ValueName)) {
            throw `${this.ValueOwner} or ${this.ValueOwner}.${this.ValueName} is null/undefined`;
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
            console.warn(`${this.ValueOwner[this.ValueName]} doesn't implement IEditable`);
        }
    }
    ApplyValueToEditElement() {
        if (!this.ValueOwner || !this.ValueOwner.hasOwnProperty(this.ValueName)) {
            throw `${this.ValueOwner} or ${this.ValueOwner}.${this.ValueName} is null/undefined`;
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
            console.warn(`${this.ValueOwner[this.ValueName]} doesn't implement IEditable`);
        }
    }
    ApplyChangesToValue() {
        if (!this.ValueOwner || !this.ValueOwner.hasOwnProperty(this.ValueName)) {
            throw `${this.ValueOwner} or ${this.ValueOwner}.${this.ValueName} is null/undefined`;
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
            console.warn(`${this.ValueOwner[this.ValueName]} doesn't implement IEditable`);
        }
    }
}
EditableField.EditedField = null;
EditableField.IDCounter = 0;
window.addEventListener("pointerup", (e) => {
    if (EditableField.EditedField) {
        if (e.srcElement) {
            let currentElement = e.srcElement;
            let foundEdited = false;
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
window.addEventListener("keyup", (e) => {
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
class Engine {
    constructor() {
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
        this.ModelID = Model.LR91;
        this.PlumeID = Plume.Kerolox_Upper;
        this.TechUnlockNode = TechNode.start;
        this.EngineName = "";
        this.EngineManufacturer = "Generic Engines";
        this.EngineDescription = "This engine was generated by Generic Engines";
        this.EngineVariant = EngineType.Liquid;
        this.UseTanks = false;
        this.LimitTanks = true;
        this.TanksVolume = 0;
        this.TanksContents = {};
        this.ThrustCurve = [];
        this.PolyType = Polymorphism.Single;
        this.MasterEngineName = "";
        this.MasterEngineCost = 0;
        this.MasterEngineMass = 0;
    }
}
class FileIO {
    static ZipBlobs(rootDirName, blobs, callback) {
        let zip = new JSZip();
        let zipRoot = zip.folder(rootDirName);
        for (let blobname in blobs) {
            let blob = blobs[blobname];
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
    }
    static OpenText(extensions, callback) {
        this.Open(FileType.Text, extensions, (result) => {
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
    }
    static OpenBinary(extensions, callback) {
        this.Open(FileType.Binary, extensions, (result) => {
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
    }
    static Open(type, extensions, callback) {
        let fileDialog = document.createElement("input");
        fileDialog.type = "file";
        if (extensions && extensions != "") {
            fileDialog.accept = extensions;
        }
        fileDialog.click();
        fileDialog.addEventListener("change", () => {
            if (!fileDialog.files || !fileDialog.files[0]) {
                console.log("No file selected?");
                if (callback) {
                    callback(null);
                }
                return;
            }
            let file = fileDialog.files[0];
            let reader = new FileReader();
            reader.onload = () => {
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
    }
    static SaveText(filename, contents) {
        let saveDialog = document.createElement("a");
        saveDialog.href = `data:application/x-none;charset=UTF-8;base64,${btoa(contents)}`;
        saveDialog.download = filename;
        let evt = document.createEvent("MouseEvents");
        evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        saveDialog.dispatchEvent(evt);
    }
    static SaveBinary(filename, contents) {
        let saveDialog = document.createElement("a");
        let blob = new Blob([contents], {
            type: "application/octet-stream"
        });
        saveDialog.href = URL.createObjectURL(blob);
        saveDialog.download = filename;
        let evt = document.createEvent("MouseEvents");
        evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        saveDialog.dispatchEvent(evt);
    }
}
class HtmlTable {
    constructor(container) {
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
        window.addEventListener("pointerup", () => {
            if (this.DragInterval) {
                clearInterval(this.DragInterval);
            }
            this.DragInterval = null;
        });
        window.addEventListener("pointerdown", (e) => {
            if (e.button == 1) {
                return;
            }
            if (e.srcElement) {
                let currentElement = e.srcElement;
                let pressedOnRow = null;
                let i;
                while (currentElement != null) {
                    if (i = currentElement.getAttribute("data-tableRow")) {
                        pressedOnRow = parseInt(i);
                        break;
                    }
                    currentElement = currentElement.parentElement;
                }
                if (pressedOnRow) {
                    this.SelectRow(e.ctrlKey, pressedOnRow);
                }
                else {
                }
            }
        });
    }
    static AutoGenerateColumns(exampleObject) {
        let output = {};
        for (let i in exampleObject) {
            if (typeof exampleObject[i] == "function" ||
                i == "EditableFieldMetadata") {
                continue;
            }
            output[i] = {
                Name: i.toUpperCase(),
                Width: 200
            };
        }
        return output;
    }
    AddItem(newItem) {
        this.Items.push(newItem);
        this.Rows[HtmlTable.RowCounter] = [Array(Object.getOwnPropertyNames(this.ColumnsDefinitions).length), newItem];
        let x = 0;
        for (let columnID in this.ColumnsDefinitions) {
            let columnCell = document.createElement("div");
            columnCell.classList.add("content-cell");
            columnCell.setAttribute("data-tableRow", (HtmlTable.RowCounter).toString());
            let cellField = new EditableField(newItem, columnID, columnCell);
            this.Rows[HtmlTable.RowCounter][0][x] = columnCell;
            this.Columns[columnID].appendChild(columnCell);
            ++x;
        }
        ++HtmlTable.RowCounter;
    }
    RemoveSelectedItems() {
        this.SelectedRows.forEach(row => {
            this.Rows[row][0].forEach(element => {
                element.remove();
            });
            this.Items.splice(this.Items.indexOf(this.Rows[row][1]), 1);
            delete this.Rows[row];
        });
        this.SelectedRows = [];
    }
    SelectRow(appendToggle, row) {
        if (appendToggle) {
            if (this.SelectedRows.some(x => x == row)) {
                this.SelectedRows = this.SelectedRows.filter(x => x != row);
                this.Rows[row][0].forEach(cell => {
                    cell.classList.remove("selected");
                });
            }
            else {
                this.SelectedRows.push(row);
                this.Rows[row][0].forEach(cell => {
                    cell.classList.add("selected");
                });
            }
        }
        else {
            this.SelectedRows.forEach(rowNumber => {
                this.Rows[rowNumber][0].forEach(cell => {
                    cell.classList.remove("selected");
                });
            });
            this.SelectedRows = [row];
            this.Rows[row][0].forEach(cell => {
                cell.classList.add("selected");
            });
        }
    }
    RebuildTable() {
        if (Object.getOwnPropertyNames(this.ColumnsDefinitions).length == 0) {
            console.log(this);
            console.log("No columns were set.");
            return;
        }
        let ItemsBackup = new Array().concat(this.Items);
        this.Items = [];
        this.SelectedRows = [];
        for (let i in this.Rows) {
            this.SelectedRows.push(parseInt(i));
        }
        this.RemoveSelectedItems();
        this.TableElement.remove();
        this.TableElement = document.createElement("div");
        this.TableElement.classList.add("content-table");
        this.TableContainer.appendChild(this.TableElement);
        this.Columns = {};
        let headerContainer = document.createElement("div");
        headerContainer.classList.add("content-header-container");
        this.TableElement.appendChild(headerContainer);
        this.TableElement.addEventListener("scroll", (e) => {
            headerContainer.style.left = `-${this.TableElement.scrollLeft}px`;
        });
        for (let columnID in this.ColumnsDefinitions) {
            let column = document.createElement("div");
            column.classList.add("content-column");
            column.style.width = `${this.ColumnsDefinitions[columnID].Width}px`;
            this.Columns[columnID] = column;
            let columnHeader = document.createElement("div");
            columnHeader.classList.add("content-header");
            columnHeader.style.width = `${this.ColumnsDefinitions[columnID].Width}px`;
            columnHeader.innerHTML = this.ColumnsDefinitions[columnID].Name;
            columnHeader.title = this.ColumnsDefinitions[columnID].Name;
            headerContainer.appendChild(columnHeader);
            let columnResizer = document.createElement("div");
            columnResizer.classList.add("content-column-resizer");
            columnResizer.setAttribute("data-FieldID", "-1");
            columnResizer.onpointerdown = () => {
                let originalX = Input.MouseX;
                let originalWidth = column.style.width ? parseInt(column.style.width) : 400;
                this.DragInterval = setInterval(() => {
                    let newWidth = originalWidth + Input.MouseX - originalX;
                    newWidth = Math.max(24, newWidth);
                    column.style.width = `${newWidth}px`;
                    columnHeader.style.width = `${newWidth}px`;
                }, 10);
            };
            columnHeader.appendChild(columnResizer);
            this.TableElement.appendChild(column);
        }
        for (let i of ItemsBackup) {
            this.AddItem(i);
        }
    }
}
HtmlTable.RowCounter = 1;
class Input {
}
Input.MouseX = 0;
Input.MouseY = 0;
window.onpointermove = (event) => {
    Input.MouseX = event.clientX;
    Input.MouseY = event.clientY;
};
var ListName = "Unnamed";
let MainEngineTable;
addEventListener("DOMContentLoaded", () => {
    document.addEventListener('contextmenu', event => event.preventDefault());
    let images = document.querySelectorAll(".option-button");
    images.forEach(image => {
        image.ondragstart = () => { return false; };
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
    let ListNameDisplay = new EditableField(window, "ListName", document.getElementById("list-name"));
    MainEngineTable = new HtmlTable(document.getElementById("list-container"));
    for (let i = 0; i < 64; ++i) {
        MainEngineTable.Items.push(new Engine());
    }
    MainEngineTable.ColumnsDefinitions = HtmlTable.AutoGenerateColumns(new Engine());
    MainEngineTable.RebuildTable();
});
function NewButton_Click() {
    MainEngineTable.Items = [];
    MainEngineTable.RebuildTable();
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
    MainEngineTable.AddItem(new Engine());
}
function RemoveButton_Click() {
    MainEngineTable.RemoveSelectedItems();
}
function SettingsButton_Click() {
}
function HelpButton_Click() {
}
var EngineType;
(function (EngineType) {
    EngineType[EngineType["Liquid"] = 0] = "Liquid";
    EngineType[EngineType["Solid"] = 1] = "Solid";
})(EngineType || (EngineType = {}));
var FileType;
(function (FileType) {
    FileType[FileType["Text"] = 0] = "Text";
    FileType[FileType["Binary"] = 1] = "Binary";
})(FileType || (FileType = {}));
var Model;
(function (Model) {
    Model[Model["LR91"] = 0] = "LR91";
    Model[Model["AJ10"] = 1] = "AJ10";
    Model[Model["RS25"] = 2] = "RS25";
    Model[Model["Thruster"] = 3] = "Thruster";
    Model[Model["Aestus"] = 4] = "Aestus";
    Model[Model["IonThruster"] = 5] = "IonThruster";
    Model[Model["F1"] = 6] = "F1";
    Model[Model["RD0105T"] = 7] = "RD0105T";
    Model[Model["SRBLong"] = 8] = "SRBLong";
    Model[Model["RT5"] = 9] = "RT5";
    Model[Model["RT2"] = 10] = "RT2";
    Model[Model["S1"] = 11] = "S1";
    Model[Model["RD0105"] = 12] = "RD0105";
    Model[Model["NERVA"] = 13] = "NERVA";
    Model[Model["LVT30"] = 14] = "LVT30";
    Model[Model["LVT45"] = 15] = "LVT45";
    Model[Model["P1057"] = 16] = "P1057";
    Model[Model["OMSL"] = 17] = "OMSL";
    Model[Model["Poodle"] = 18] = "Poodle";
    Model[Model["BallNuke"] = 19] = "BallNuke";
    Model[Model["BallNukeS"] = 20] = "BallNukeS";
    Model[Model["Skipper"] = 21] = "Skipper";
    Model[Model["SkipperR"] = 22] = "SkipperR";
})(Model || (Model = {}));
var Plume;
(function (Plume) {
    Plume[Plume["Kerolox_Upper"] = 0] = "Kerolox_Upper";
    Plume[Plume["Kerolox_Lower"] = 1] = "Kerolox_Lower";
    Plume[Plume["Kerolox_Vernier"] = 2] = "Kerolox_Vernier";
    Plume[Plume["Cryogenic_UpperLower_125"] = 3] = "Cryogenic_UpperLower_125";
    Plume[Plume["Cryogenic_UpperLower_25"] = 4] = "Cryogenic_UpperLower_25";
    Plume[Plume["Cryogenic_UpperLower_375"] = 5] = "Cryogenic_UpperLower_375";
    Plume[Plume["Alcolox_Lower"] = 6] = "Alcolox_Lower";
    Plume[Plume["Amonnialox"] = 7] = "Amonnialox";
    Plume[Plume["Hydrogen_NTR"] = 8] = "Hydrogen_NTR";
    Plume[Plume["Hydrolox_Lower"] = 9] = "Hydrolox_Lower";
    Plume[Plume["Hydrolox_Upper"] = 10] = "Hydrolox_Upper";
    Plume[Plume["Hydynelox_A7"] = 11] = "Hydynelox_A7";
    Plume[Plume["Hypergolic_Lower"] = 12] = "Hypergolic_Lower";
    Plume[Plume["Hypergolic_Upper"] = 13] = "Hypergolic_Upper";
    Plume[Plume["Hypergolic_OMS_Red"] = 14] = "Hypergolic_OMS_Red";
    Plume[Plume["Hypergolic_OMS_White"] = 15] = "Hypergolic_OMS_White";
    Plume[Plume["Hypergolic_Vernier"] = 16] = "Hypergolic_Vernier";
    Plume[Plume["Ion_Argon_Gridded"] = 17] = "Ion_Argon_Gridded";
    Plume[Plume["Ion_Krypton_Gridded"] = 18] = "Ion_Krypton_Gridded";
    Plume[Plume["Ion_Krypton_Hall"] = 19] = "Ion_Krypton_Hall";
    Plume[Plume["Ion_Xenon_Gridded"] = 20] = "Ion_Xenon_Gridded";
    Plume[Plume["Ion_Xenon_Hall"] = 21] = "Ion_Xenon_Hall";
    Plume[Plume["Solid_Lower"] = 22] = "Solid_Lower";
    Plume[Plume["Solid_Upper"] = 23] = "Solid_Upper";
    Plume[Plume["Solid_Sepmotor"] = 24] = "Solid_Sepmotor";
    Plume[Plume["Solid_Vacuum"] = 25] = "Solid_Vacuum";
    Plume[Plume["Turbofan"] = 26] = "Turbofan";
    Plume[Plume["Turbojet"] = 27] = "Turbojet";
})(Plume || (Plume = {}));
var Polymorphism;
(function (Polymorphism) {
    Polymorphism[Polymorphism["Single"] = 0] = "Single";
    Polymorphism[Polymorphism["MultiModeMaster"] = 1] = "MultiModeMaster";
    Polymorphism[Polymorphism["MultiModeSlave"] = 2] = "MultiModeSlave";
    Polymorphism[Polymorphism["MultiConfigMaster"] = 3] = "MultiConfigMaster";
    Polymorphism[Polymorphism["MultiConfigSlave"] = 4] = "MultiConfigSlave";
})(Polymorphism || (Polymorphism = {}));
var TechNode;
(function (TechNode) {
    TechNode[TechNode["start"] = 0] = "start";
    TechNode[TechNode["supersonicDev"] = 1] = "supersonicDev";
    TechNode[TechNode["supersonicFlightRP0"] = 2] = "supersonicFlightRP0";
    TechNode[TechNode["matureSupersonic"] = 3] = "matureSupersonic";
    TechNode[TechNode["highSpeedFlight"] = 4] = "highSpeedFlight";
    TechNode[TechNode["advancedJetEngines"] = 5] = "advancedJetEngines";
    TechNode[TechNode["matureTurbofans"] = 6] = "matureTurbofans";
    TechNode[TechNode["refinedTurbofans"] = 7] = "refinedTurbofans";
    TechNode[TechNode["scramjetEngines"] = 8] = "scramjetEngines";
    TechNode[TechNode["experimentalAircraft"] = 9] = "experimentalAircraft";
    TechNode[TechNode["colonization2051Flight"] = 10] = "colonization2051Flight";
    TechNode[TechNode["colonization2100Flight"] = 11] = "colonization2100Flight";
    TechNode[TechNode["colonization2150Flight"] = 12] = "colonization2150Flight";
    TechNode[TechNode["hypersonicFlightRP0"] = 13] = "hypersonicFlightRP0";
    TechNode[TechNode["prototypeSpaceplanes"] = 14] = "prototypeSpaceplanes";
    TechNode[TechNode["effectiveSpaceplanes"] = 15] = "effectiveSpaceplanes";
    TechNode[TechNode["spaceShuttles"] = 16] = "spaceShuttles";
    TechNode[TechNode["improvedSpaceplanes"] = 17] = "improvedSpaceplanes";
    TechNode[TechNode["advancedSpaceplanes"] = 18] = "advancedSpaceplanes";
    TechNode[TechNode["highTechSpaceplanes"] = 19] = "highTechSpaceplanes";
    TechNode[TechNode["experimentalSpaceplanes"] = 20] = "experimentalSpaceplanes";
    TechNode[TechNode["sstoSpaceplanes"] = 21] = "sstoSpaceplanes";
    TechNode[TechNode["colonization2100Spaceplanes"] = 22] = "colonization2100Spaceplanes";
    TechNode[TechNode["colonization2150Spaceplanes"] = 23] = "colonization2150Spaceplanes";
    TechNode[TechNode["basicCapsules"] = 24] = "basicCapsules";
    TechNode[TechNode["secondGenCapsules"] = 25] = "secondGenCapsules";
    TechNode[TechNode["matureCapsules"] = 26] = "matureCapsules";
    TechNode[TechNode["improvedCapsules"] = 27] = "improvedCapsules";
    TechNode[TechNode["advancedCapsules"] = 28] = "advancedCapsules";
    TechNode[TechNode["modernCapsules"] = 29] = "modernCapsules";
    TechNode[TechNode["capsulesNF"] = 30] = "capsulesNF";
    TechNode[TechNode["highTechCapsules"] = 31] = "highTechCapsules";
    TechNode[TechNode["colonization2100Command"] = 32] = "colonization2100Command";
    TechNode[TechNode["colonization2150Command"] = 33] = "colonization2150Command";
    TechNode[TechNode["spaceStationPrototypes"] = 34] = "spaceStationPrototypes";
    TechNode[TechNode["spaceStationDev"] = 35] = "spaceStationDev";
    TechNode[TechNode["earlySpaceStations"] = 36] = "earlySpaceStations";
    TechNode[TechNode["modularSpaceStations"] = 37] = "modularSpaceStations";
    TechNode[TechNode["largeScaleOrbitalCon"] = 38] = "largeScaleOrbitalCon";
    TechNode[TechNode["improvedOrbitalConstruction"] = 39] = "improvedOrbitalConstruction";
    TechNode[TechNode["inflatableHabitats"] = 40] = "inflatableHabitats";
    TechNode[TechNode["improvedHabitats"] = 41] = "improvedHabitats";
    TechNode[TechNode["advancedHabitats"] = 42] = "advancedHabitats";
    TechNode[TechNode["largeScaleHabitats"] = 43] = "largeScaleHabitats";
    TechNode[TechNode["colonization2100SpaceStations"] = 44] = "colonization2100SpaceStations";
    TechNode[TechNode["colonization2150SpaceStations"] = 45] = "colonization2150SpaceStations";
    TechNode[TechNode["earlyFlightControl"] = 46] = "earlyFlightControl";
    TechNode[TechNode["stabilityRP0"] = 47] = "stabilityRP0";
    TechNode[TechNode["earlyDocking"] = 48] = "earlyDocking";
    TechNode[TechNode["improvedFlightControl"] = 49] = "improvedFlightControl";
    TechNode[TechNode["advancedFlightControl"] = 50] = "advancedFlightControl";
    TechNode[TechNode["dockingCrewTransfer"] = 51] = "dockingCrewTransfer";
    TechNode[TechNode["spaceStationControl"] = 52] = "spaceStationControl";
    TechNode[TechNode["largeSpaceplaneControl"] = 53] = "largeSpaceplaneControl";
    TechNode[TechNode["standardDockingPorts"] = 54] = "standardDockingPorts";
    TechNode[TechNode["largeStationControl"] = 55] = "largeStationControl";
    TechNode[TechNode["largeDockingPorts"] = 56] = "largeDockingPorts";
    TechNode[TechNode["gridFins"] = 57] = "gridFins";
    TechNode[TechNode["flightControlNF"] = 58] = "flightControlNF";
    TechNode[TechNode["colonization2051Control"] = 59] = "colonization2051Control";
    TechNode[TechNode["colonization2100Control"] = 60] = "colonization2100Control";
    TechNode[TechNode["colonization2150Control"] = 61] = "colonization2150Control";
    TechNode[TechNode["entryDescentLanding"] = 62] = "entryDescentLanding";
    TechNode[TechNode["humanRatedEDL"] = 63] = "humanRatedEDL";
    TechNode[TechNode["earlyLanding"] = 64] = "earlyLanding";
    TechNode[TechNode["lunarRatedHeatshields"] = 65] = "lunarRatedHeatshields";
    TechNode[TechNode["lunarLanding"] = 66] = "lunarLanding";
    TechNode[TechNode["improvedLandingEngines"] = 67] = "improvedLandingEngines";
    TechNode[TechNode["advancedUncrewedLanding"] = 68] = "advancedUncrewedLanding";
    TechNode[TechNode["interplanetaryRovers"] = 69] = "interplanetaryRovers";
    TechNode[TechNode["largeRoverDesigns"] = 70] = "largeRoverDesigns";
    TechNode[TechNode["reusability"] = 71] = "reusability";
    TechNode[TechNode["advancedLanding"] = 72] = "advancedLanding";
    TechNode[TechNode["SIAD"] = 73] = "SIAD";
    TechNode[TechNode["HIAD"] = 74] = "HIAD";
    TechNode[TechNode["colonization2051EDL"] = 75] = "colonization2051EDL";
    TechNode[TechNode["colonization2100EDL"] = 76] = "colonization2100EDL";
    TechNode[TechNode["colonization2150EDL"] = 77] = "colonization2150EDL";
    TechNode[TechNode["prototypeHydrolox"] = 78] = "prototypeHydrolox";
    TechNode[TechNode["earlyHydrolox"] = 79] = "earlyHydrolox";
    TechNode[TechNode["improvedHydrolox"] = 80] = "improvedHydrolox";
    TechNode[TechNode["largeHydrolox"] = 81] = "largeHydrolox";
    TechNode[TechNode["hydrolox1968"] = 82] = "hydrolox1968";
    TechNode[TechNode["hydrolox1972"] = 83] = "hydrolox1972";
    TechNode[TechNode["hydrolox1976"] = 84] = "hydrolox1976";
    TechNode[TechNode["hydrolox1981"] = 85] = "hydrolox1981";
    TechNode[TechNode["hydrolox1986"] = 86] = "hydrolox1986";
    TechNode[TechNode["hydrolox1992"] = 87] = "hydrolox1992";
    TechNode[TechNode["hydrolox1998"] = 88] = "hydrolox1998";
    TechNode[TechNode["hydrolox2009"] = 89] = "hydrolox2009";
    TechNode[TechNode["hydroloxNF"] = 90] = "hydroloxNF";
    TechNode[TechNode["colonization2051Hydrolox"] = 91] = "colonization2051Hydrolox";
    TechNode[TechNode["colonization2100Hydrolox"] = 92] = "colonization2100Hydrolox";
    TechNode[TechNode["colonization2150Hydrolox"] = 93] = "colonization2150Hydrolox";
    TechNode[TechNode["rocketryTesting"] = 94] = "rocketryTesting";
    TechNode[TechNode["earlyRocketry"] = 95] = "earlyRocketry";
    TechNode[TechNode["basicRocketryRP0"] = 96] = "basicRocketryRP0";
    TechNode[TechNode["orbitalRocketry1956"] = 97] = "orbitalRocketry1956";
    TechNode[TechNode["orbitalRocketry1958"] = 98] = "orbitalRocketry1958";
    TechNode[TechNode["orbitalRocketry1959"] = 99] = "orbitalRocketry1959";
    TechNode[TechNode["orbitalRocketry1960"] = 100] = "orbitalRocketry1960";
    TechNode[TechNode["orbitalRocketry1961"] = 101] = "orbitalRocketry1961";
    TechNode[TechNode["orbitalRocketry1962"] = 102] = "orbitalRocketry1962";
    TechNode[TechNode["orbitalRocketry1963"] = 103] = "orbitalRocketry1963";
    TechNode[TechNode["orbitalRocketry1964"] = 104] = "orbitalRocketry1964";
    TechNode[TechNode["orbitalRocketry1965"] = 105] = "orbitalRocketry1965";
    TechNode[TechNode["orbitalRocketry1966"] = 106] = "orbitalRocketry1966";
    TechNode[TechNode["orbitalRocketry1967"] = 107] = "orbitalRocketry1967";
    TechNode[TechNode["orbitalRocketry1970"] = 108] = "orbitalRocketry1970";
    TechNode[TechNode["orbitalRocketry1972"] = 109] = "orbitalRocketry1972";
    TechNode[TechNode["orbitalRocketry1976"] = 110] = "orbitalRocketry1976";
    TechNode[TechNode["orbitalRocketry1981"] = 111] = "orbitalRocketry1981";
    TechNode[TechNode["orbitalRocketry1986"] = 112] = "orbitalRocketry1986";
    TechNode[TechNode["orbitalRocketry1992"] = 113] = "orbitalRocketry1992";
    TechNode[TechNode["orbitalRocketry1998"] = 114] = "orbitalRocketry1998";
    TechNode[TechNode["orbitalRocketry2004"] = 115] = "orbitalRocketry2004";
    TechNode[TechNode["orbitalRocketry2009"] = 116] = "orbitalRocketry2009";
    TechNode[TechNode["orbitalRocketry2014"] = 117] = "orbitalRocketry2014";
    TechNode[TechNode["orbitalRocketryNF"] = 118] = "orbitalRocketryNF";
    TechNode[TechNode["colonization2051Orbital"] = 119] = "colonization2051Orbital";
    TechNode[TechNode["colonization2100Orbital"] = 120] = "colonization2100Orbital";
    TechNode[TechNode["colonization2150Orbital"] = 121] = "colonization2150Orbital";
    TechNode[TechNode["firstStagedCombustion"] = 122] = "firstStagedCombustion";
    TechNode[TechNode["stagedCombustion1964"] = 123] = "stagedCombustion1964";
    TechNode[TechNode["stagedCombustion1966"] = 124] = "stagedCombustion1966";
    TechNode[TechNode["stagedCombustion1967"] = 125] = "stagedCombustion1967";
    TechNode[TechNode["stagedCombustion1969"] = 126] = "stagedCombustion1969";
    TechNode[TechNode["stagedCombustion1970"] = 127] = "stagedCombustion1970";
    TechNode[TechNode["stagedCombustion1972"] = 128] = "stagedCombustion1972";
    TechNode[TechNode["stagedCombustion1981"] = 129] = "stagedCombustion1981";
    TechNode[TechNode["stagedCombustion1986"] = 130] = "stagedCombustion1986";
    TechNode[TechNode["stagedCombustion1992"] = 131] = "stagedCombustion1992";
    TechNode[TechNode["stagedCombustion1998"] = 132] = "stagedCombustion1998";
    TechNode[TechNode["stagedCombustion2004"] = 133] = "stagedCombustion2004";
    TechNode[TechNode["stagedCombustion2009"] = 134] = "stagedCombustion2009";
    TechNode[TechNode["stagedCombustion2014"] = 135] = "stagedCombustion2014";
    TechNode[TechNode["stagedCombustionNF"] = 136] = "stagedCombustionNF";
    TechNode[TechNode["colonization2051Staged"] = 137] = "colonization2051Staged";
    TechNode[TechNode["colonization2100Staged"] = 138] = "colonization2100Staged";
    TechNode[TechNode["colonization2150Staged"] = 139] = "colonization2150Staged";
    TechNode[TechNode["earlySolids"] = 140] = "earlySolids";
    TechNode[TechNode["solids1956"] = 141] = "solids1956";
    TechNode[TechNode["solids1958"] = 142] = "solids1958";
    TechNode[TechNode["solids1959"] = 143] = "solids1959";
    TechNode[TechNode["solids1962"] = 144] = "solids1962";
    TechNode[TechNode["solids1964"] = 145] = "solids1964";
    TechNode[TechNode["solids1966"] = 146] = "solids1966";
    TechNode[TechNode["solids1967"] = 147] = "solids1967";
    TechNode[TechNode["solids1969"] = 148] = "solids1969";
    TechNode[TechNode["solids1972"] = 149] = "solids1972";
    TechNode[TechNode["solids1976"] = 150] = "solids1976";
    TechNode[TechNode["solids1981"] = 151] = "solids1981";
    TechNode[TechNode["solids1986"] = 152] = "solids1986";
    TechNode[TechNode["solids1992"] = 153] = "solids1992";
    TechNode[TechNode["solids1998"] = 154] = "solids1998";
    TechNode[TechNode["solids2009"] = 155] = "solids2009";
    TechNode[TechNode["solidsNF"] = 156] = "solidsNF";
    TechNode[TechNode["colonization2051Solid"] = 157] = "colonization2051Solid";
    TechNode[TechNode["colonization2100Solid"] = 158] = "colonization2100Solid";
    TechNode[TechNode["colonization2150Solid"] = 159] = "colonization2150Solid";
    TechNode[TechNode["earlyElecPropulsion"] = 160] = "earlyElecPropulsion";
    TechNode[TechNode["basicElecPropulsion"] = 161] = "basicElecPropulsion";
    TechNode[TechNode["improvedElecPropulsion"] = 162] = "improvedElecPropulsion";
    TechNode[TechNode["advancedElecPropulsion"] = 163] = "advancedElecPropulsion";
    TechNode[TechNode["colonization2051ElecProp"] = 164] = "colonization2051ElecProp";
    TechNode[TechNode["colonization2100ElecProp"] = 165] = "colonization2100ElecProp";
    TechNode[TechNode["colonization2150ElecProp"] = 166] = "colonization2150ElecProp";
    TechNode[TechNode["prototypeNuclearPropulsion"] = 167] = "prototypeNuclearPropulsion";
    TechNode[TechNode["earlyNuclearPropulsion"] = 168] = "earlyNuclearPropulsion";
    TechNode[TechNode["basicNuclearPropulsion"] = 169] = "basicNuclearPropulsion";
    TechNode[TechNode["improvedNuclearPropulsion"] = 170] = "improvedNuclearPropulsion";
    TechNode[TechNode["advancedNuclearPropulsion"] = 171] = "advancedNuclearPropulsion";
    TechNode[TechNode["efficientNuclearPropulsion"] = 172] = "efficientNuclearPropulsion";
    TechNode[TechNode["nuclearPropulsionNF"] = 173] = "nuclearPropulsionNF";
    TechNode[TechNode["nuclearPropulsionNF2"] = 174] = "nuclearPropulsionNF2";
    TechNode[TechNode["colonization2051NuclearProp"] = 175] = "colonization2051NuclearProp";
    TechNode[TechNode["colonization2100NuclearProp"] = 176] = "colonization2100NuclearProp";
    TechNode[TechNode["colonization2150NuclearProp"] = 177] = "colonization2150NuclearProp";
    TechNode[TechNode["crewSurvivability"] = 178] = "crewSurvivability";
    TechNode[TechNode["earlyLifeSupport"] = 179] = "earlyLifeSupport";
    TechNode[TechNode["lifeSupportISRU"] = 180] = "lifeSupportISRU";
    TechNode[TechNode["basicLifeSupport"] = 181] = "basicLifeSupport";
    TechNode[TechNode["improvedLifeSupport"] = 182] = "improvedLifeSupport";
    TechNode[TechNode["longTermLifeSupport"] = 183] = "longTermLifeSupport";
    TechNode[TechNode["advancedLifeSupport"] = 184] = "advancedLifeSupport";
    TechNode[TechNode["efficientLifeSupport"] = 185] = "efficientLifeSupport";
    TechNode[TechNode["lifeSupportNF"] = 186] = "lifeSupportNF";
    TechNode[TechNode["colonization2051LifeSupport"] = 187] = "colonization2051LifeSupport";
    TechNode[TechNode["colonization2100LifeSupport"] = 188] = "colonization2100LifeSupport";
    TechNode[TechNode["colonization2150LifeSupport"] = 189] = "colonization2150LifeSupport";
    TechNode[TechNode["postWarMaterialsScience"] = 190] = "postWarMaterialsScience";
    TechNode[TechNode["earlyMaterialsScience"] = 191] = "earlyMaterialsScience";
    TechNode[TechNode["materialsScienceSatellite"] = 192] = "materialsScienceSatellite";
    TechNode[TechNode["materialsScienceHuman"] = 193] = "materialsScienceHuman";
    TechNode[TechNode["materialsScienceAdvCapsules"] = 194] = "materialsScienceAdvCapsules";
    TechNode[TechNode["materialsScienceLunar"] = 195] = "materialsScienceLunar";
    TechNode[TechNode["materialsScienceSpaceStation"] = 196] = "materialsScienceSpaceStation";
    TechNode[TechNode["materialsScienceSpaceplanes"] = 197] = "materialsScienceSpaceplanes";
    TechNode[TechNode["materialsScienceLongTerm"] = 198] = "materialsScienceLongTerm";
    TechNode[TechNode["materialsScienceInternational"] = 199] = "materialsScienceInternational";
    TechNode[TechNode["materialsScienceCommercial"] = 200] = "materialsScienceCommercial";
    TechNode[TechNode["materialsScienceNF"] = 201] = "materialsScienceNF";
    TechNode[TechNode["materialsScienceColonization"] = 202] = "materialsScienceColonization";
    TechNode[TechNode["electronicsSatellite"] = 203] = "electronicsSatellite";
    TechNode[TechNode["electronicsHuman"] = 204] = "electronicsHuman";
    TechNode[TechNode["electronicsAdvCapsules"] = 205] = "electronicsAdvCapsules";
    TechNode[TechNode["electronicsLunar"] = 206] = "electronicsLunar";
    TechNode[TechNode["electronicsSpaceStation"] = 207] = "electronicsSpaceStation";
    TechNode[TechNode["electronicsSpaceplanes"] = 208] = "electronicsSpaceplanes";
    TechNode[TechNode["electronicsLongTerm"] = 209] = "electronicsLongTerm";
    TechNode[TechNode["electronicsInternational"] = 210] = "electronicsInternational";
    TechNode[TechNode["electronicsCommercial"] = 211] = "electronicsCommercial";
    TechNode[TechNode["electronicsNF"] = 212] = "electronicsNF";
    TechNode[TechNode["electronicsColonization"] = 213] = "electronicsColonization";
    TechNode[TechNode["firstRTG"] = 214] = "firstRTG";
    TechNode[TechNode["earlyRTG"] = 215] = "earlyRTG";
    TechNode[TechNode["nuclearFissionReactors"] = 216] = "nuclearFissionReactors";
    TechNode[TechNode["improvedRTG"] = 217] = "improvedRTG";
    TechNode[TechNode["multihundredWattRTG"] = 218] = "multihundredWattRTG";
    TechNode[TechNode["gphsRTG"] = 219] = "gphsRTG";
    TechNode[TechNode["improvedNuclearPower"] = 220] = "improvedNuclearPower";
    TechNode[TechNode["advancedNuclearPower"] = 221] = "advancedNuclearPower";
    TechNode[TechNode["modernNuclearPower"] = 222] = "modernNuclearPower";
    TechNode[TechNode["nuclearPowerNF"] = 223] = "nuclearPowerNF";
    TechNode[TechNode["colonization2051NuclearPower"] = 224] = "colonization2051NuclearPower";
    TechNode[TechNode["colonization2100NuclearPower"] = 225] = "colonization2100NuclearPower";
    TechNode[TechNode["colonization2150NuclearPower"] = 226] = "colonization2150NuclearPower";
    TechNode[TechNode["primitiveSolarPanels"] = 227] = "primitiveSolarPanels";
    TechNode[TechNode["earlyPower"] = 228] = "earlyPower";
    TechNode[TechNode["basicPower"] = 229] = "basicPower";
    TechNode[TechNode["improvedPower"] = 230] = "improvedPower";
    TechNode[TechNode["lunarRatedPower"] = 231] = "lunarRatedPower";
    TechNode[TechNode["spaceStationSolarPanels"] = 232] = "spaceStationSolarPanels";
    TechNode[TechNode["maturePower"] = 233] = "maturePower";
    TechNode[TechNode["largeScaleSolarArrays"] = 234] = "largeScaleSolarArrays";
    TechNode[TechNode["advancedPower"] = 235] = "advancedPower";
    TechNode[TechNode["modernPower"] = 236] = "modernPower";
    TechNode[TechNode["powerNF"] = 237] = "powerNF";
    TechNode[TechNode["colonization2051Power"] = 238] = "colonization2051Power";
    TechNode[TechNode["colonization2100Power"] = 239] = "colonization2100Power";
    TechNode[TechNode["colonization2150Power"] = 240] = "colonization2150Power";
    TechNode[TechNode["lunarRangeComms"] = 241] = "lunarRangeComms";
    TechNode[TechNode["interplanetaryComms"] = 242] = "interplanetaryComms";
    TechNode[TechNode["improvedComms"] = 243] = "improvedComms";
    TechNode[TechNode["advancedComms"] = 244] = "advancedComms";
    TechNode[TechNode["deepSpaceComms"] = 245] = "deepSpaceComms";
    TechNode[TechNode["largeScaleComms"] = 246] = "largeScaleComms";
    TechNode[TechNode["massiveScaleComms"] = 247] = "massiveScaleComms";
    TechNode[TechNode["efficientComms"] = 248] = "efficientComms";
    TechNode[TechNode["modernComms"] = 249] = "modernComms";
    TechNode[TechNode["commsNF"] = 250] = "commsNF";
    TechNode[TechNode["colonization2051Comms"] = 251] = "colonization2051Comms";
    TechNode[TechNode["colonization2100Comms"] = 252] = "colonization2100Comms";
    TechNode[TechNode["colonization2150Comms"] = 253] = "colonization2150Comms";
    TechNode[TechNode["postWarAvionics"] = 254] = "postWarAvionics";
    TechNode[TechNode["avionicsPrototypes"] = 255] = "avionicsPrototypes";
    TechNode[TechNode["earlyAvionics"] = 256] = "earlyAvionics";
    TechNode[TechNode["basicAvionics"] = 257] = "basicAvionics";
    TechNode[TechNode["interplanetaryProbes"] = 258] = "interplanetaryProbes";
    TechNode[TechNode["improvedAvionics"] = 259] = "improvedAvionics";
    TechNode[TechNode["matureAvionics"] = 260] = "matureAvionics";
    TechNode[TechNode["largeScaleAvionics"] = 261] = "largeScaleAvionics";
    TechNode[TechNode["advancedAvionics"] = 262] = "advancedAvionics";
    TechNode[TechNode["nextGenAvionics"] = 263] = "nextGenAvionics";
    TechNode[TechNode["longTermAvionics"] = 264] = "longTermAvionics";
    TechNode[TechNode["internationalAvionics"] = 265] = "internationalAvionics";
    TechNode[TechNode["modernAvionics"] = 266] = "modernAvionics";
    TechNode[TechNode["avionicsNF"] = 267] = "avionicsNF";
    TechNode[TechNode["colonization2051Avionics"] = 268] = "colonization2051Avionics";
    TechNode[TechNode["colonization2100Avionics"] = 269] = "colonization2100Avionics";
    TechNode[TechNode["colonization2150Avionics"] = 270] = "colonization2150Avionics";
    TechNode[TechNode["earlyScience"] = 271] = "earlyScience";
    TechNode[TechNode["scienceSatellite"] = 272] = "scienceSatellite";
    TechNode[TechNode["scienceHuman"] = 273] = "scienceHuman";
    TechNode[TechNode["scienceAdvCapsules"] = 274] = "scienceAdvCapsules";
    TechNode[TechNode["scienceLunar"] = 275] = "scienceLunar";
    TechNode[TechNode["surfaceScience"] = 276] = "surfaceScience";
    TechNode[TechNode["deepSpaceScience"] = 277] = "deepSpaceScience";
    TechNode[TechNode["scienceExploration"] = 278] = "scienceExploration";
    TechNode[TechNode["sampleReturnScience"] = 279] = "sampleReturnScience";
    TechNode[TechNode["advancedScience"] = 280] = "advancedScience";
    TechNode[TechNode["advancedSurfaceScience"] = 281] = "advancedSurfaceScience";
    TechNode[TechNode["scienceNF"] = 282] = "scienceNF";
    TechNode[TechNode["colonization2051Science"] = 283] = "colonization2051Science";
    TechNode[TechNode["colonization2100Science"] = 284] = "colonization2100Science";
    TechNode[TechNode["colonization2150Science"] = 285] = "colonization2150Science";
})(TechNode || (TechNode = {}));
//# sourceMappingURL=index.js.map