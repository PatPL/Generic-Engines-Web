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
        if (/^[0-9]/.test(this.EditElement.value)) {
            let length = /^[0-9,.]+/.exec(this.EditElement.value);
            this.EditElement.focus();
            this.EditElement.selectionStart = 0;
            this.EditElement.selectionEnd = length[0].length;
        }
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
    SetValue(newValue) {
        this.ValueOwner[this.ValueName] = newValue;
        this.ApplyValueToDisplayElement();
    }
    GetDisplayElement() {
        if (!(this.ValueOwner && (this.ValueOwner.hasOwnProperty(this.ValueName) || (this.ValueOwner.hasOwnProperty("EditableFieldMetadata") &&
            this.ValueOwner.EditableFieldMetadata.hasOwnProperty(this.ValueName))))) {
            throw `${this.ValueOwner} or ${this.ValueOwner}.${this.ValueName} is not set up as EditableField`;
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
            let tmp = document.createElement("div");
            tmp.classList.add("content-cell-content");
            output = tmp;
        }
        if (typeof this.ValueOwner[this.ValueName] != "boolean") {
            output.addEventListener("dblclick", (e) => {
                if (!e.srcElement.parentElement.classList.contains("hideCell")) {
                    this.StartEdit();
                }
            });
        }
        return output;
    }
    GetEditElement() {
        if (!(this.ValueOwner && (this.ValueOwner.hasOwnProperty(this.ValueName) || (this.ValueOwner.hasOwnProperty("EditableFieldMetadata") &&
            this.ValueOwner.EditableFieldMetadata.hasOwnProperty(this.ValueName))))) {
            throw `${this.ValueOwner} or ${this.ValueOwner}.${this.ValueName} is not set up as EditableField`;
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
            let tmp = document.createElement("div");
            tmp.classList.add("content-cell-content");
            output = tmp;
        }
        return output;
    }
    ApplyValueToDisplayElement() {
        if (!(this.ValueOwner && (this.ValueOwner.hasOwnProperty(this.ValueName) || (this.ValueOwner.hasOwnProperty("EditableFieldMetadata") &&
            this.ValueOwner.EditableFieldMetadata.hasOwnProperty(this.ValueName))))) {
            throw `${this.ValueOwner} or ${this.ValueOwner}.${this.ValueName} is not set up as EditableField`;
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
        if (!(this.ValueOwner && (this.ValueOwner.hasOwnProperty(this.ValueName) || (this.ValueOwner.hasOwnProperty("EditableFieldMetadata") &&
            this.ValueOwner.EditableFieldMetadata.hasOwnProperty(this.ValueName))))) {
            throw `${this.ValueOwner} or ${this.ValueOwner}.${this.ValueName} is not set up as EditableField`;
        }
        if (typeof this.ValueOwner[this.ValueName] == "object" && "ApplyValueToEditElement" in this.ValueOwner[this.ValueName]) {
            this.ValueOwner[this.ValueName].ApplyValueToEditElement(this.EditElement);
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
        if (!(this.ValueOwner && (this.ValueOwner.hasOwnProperty(this.ValueName) || (this.ValueOwner.hasOwnProperty("EditableFieldMetadata") &&
            this.ValueOwner.EditableFieldMetadata.hasOwnProperty(this.ValueName))))) {
            throw `${this.ValueOwner} or ${this.ValueOwner}.${this.ValueName} is not set up as EditableField`;
        }
        if (typeof this.ValueOwner[this.ValueName] == "object" && "ApplyValueToDisplayElement" in this.ValueOwner[this.ValueName]) {
            this.ValueOwner[this.ValueName].ApplyChangesToValue(this.EditElement);
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
window.addEventListener("pointerdown", (e) => {
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
                    this.SelectRow(e.ctrlKey, pressedOnRow, e.shiftKey);
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
                DefaultWidth: 200
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
        if (newItem.OnTableDraw && typeof newItem.OnTableDraw == "function") {
            newItem.OnTableDraw(this.Rows[HtmlTable.RowCounter][0]);
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
    SelectRow(appendToggle, row, rangeSelect = false) {
        if (this.SelectedRows.length > 0) {
            this.Rows[this.SelectedRows[this.SelectedRows.length - 1]][0].forEach(cell => {
                cell.classList.remove("last");
            });
        }
        if (rangeSelect) {
            if (this.SelectedRows.length == 0) {
                return;
            }
            let lastSelectedID = this.SelectedRows[this.SelectedRows.length - 1];
            for (let i = lastSelectedID;; i += (row > lastSelectedID ? 1 : -1)) {
                if (!this.Rows[i]) {
                    continue;
                }
                if (this.SelectedRows.some(x => x == i)) {
                }
                else {
                    this.SelectedRows.push(i);
                    this.Rows[i][0].forEach(cell => {
                        cell.classList.add("selected");
                    });
                }
                if (i == row) {
                    break;
                }
            }
        }
        else if (appendToggle) {
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
        if (this.SelectedRows.length > 0) {
            this.Rows[this.SelectedRows[this.SelectedRows.length - 1]][0].forEach(cell => {
                cell.classList.add("last");
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
            column.style.width = `${this.ColumnsDefinitions[columnID].DefaultWidth}px`;
            this.Columns[columnID] = column;
            let columnHeader = document.createElement("div");
            columnHeader.classList.add("content-header");
            columnHeader.style.width = `${this.ColumnsDefinitions[columnID].DefaultWidth}px`;
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
addEventListener("DOMContentLoaded", () => {
    Notifier.Container = document.querySelector(".notify-container");
});
class Notifier {
    static Info(text, lifetime = this.NotificationLifetime) {
        let box = document.createElement("div");
        box.classList.add("notify-box");
        box.classList.add("info");
        box.innerHTML = text;
        Notifier.Container.appendChild(box);
        box.addEventListener("click", () => {
            box.remove();
        });
        if (lifetime > 0) {
            setTimeout(() => {
                box.remove();
            }, lifetime);
        }
    }
    static Warn(text, lifetime = this.NotificationLifetime) {
        let box = document.createElement("div");
        box.classList.add("notify-box");
        box.classList.add("warn");
        box.innerHTML = text;
        Notifier.Container.appendChild(box);
        box.addEventListener("click", () => {
            box.remove();
        });
        if (lifetime > 0) {
            setTimeout(() => {
                box.remove();
            }, lifetime);
        }
    }
    static Error(text, lifetime = this.NotificationLifetime) {
        let box = document.createElement("div");
        box.classList.add("notify-box");
        box.classList.add("error");
        box.innerHTML = text;
        Notifier.Container.appendChild(box);
        box.addEventListener("click", () => {
            box.remove();
        });
        if (lifetime > 0) {
            setTimeout(() => {
                box.remove();
            }, lifetime);
        }
    }
}
Notifier.NotificationLifetime = 7500;
class Version {
}
Version.CurrentVersion = "Web.0.8.1 Prerelease";
addEventListener("DOMContentLoaded", () => {
    if (Store.Exists("lastVersion")) {
        if (Store.GetText("lastVersion") != Version.CurrentVersion) {
            Notifier.Info(`Generic Engines updated to version ${Version.CurrentVersion}; Click to dismiss`, 0);
        }
        else {
        }
    }
    else {
        Notifier.Info(`Thank you for using Generic Engines`, 10000);
    }
    Store.SetText("lastVersion", Version.CurrentVersion);
    document.head.querySelector("title").innerHTML += Version.CurrentVersion;
    document.body.querySelectorAll(".js-insert-version").forEach(e => {
        e.innerHTML = Version.CurrentVersion;
    });
});
var ListName = "Unnamed";
var EditableFieldMetadata = {
    ListName: {
        ApplyValueToDisplayElement: e => {
            e.innerHTML = `${ListName}.enl`;
        }
    }
};
let ListNameDisplay;
let MainEngineTable;
let FullscreenWindows = {};
window.onbeforeunload = (e) => {
    if (MainEngineTable.Items.length != 0) {
        e.returnValue = "Are you sure that you want to leave this page? You will lose all unsaved data";
        return "Are you sure that you want to leave this page? You will lose all unsaved data";
    }
    else {
        return;
    }
};
addEventListener("DOMContentLoaded", () => {
    ListNameDisplay = new EditableField(window, "ListName", document.getElementById("list-name"));
    window.addEventListener("dragover", e => {
        e.stopPropagation();
        e.preventDefault();
        if (e.dataTransfer) {
            e.dataTransfer.dropEffect = "copy";
        }
    });
    window.addEventListener("drop", e => {
        e.stopPropagation();
        e.preventDefault();
        if (!e.dataTransfer) {
            return;
        }
        let files = e.dataTransfer.files;
        if (files.length == 0) {
            return;
        }
        let reader = new FileReader();
        reader.onload = () => {
            let data = new Uint8Array(reader.result);
            let engineCount = Serializer.DeserializeMany(data, MainEngineTable.Items);
            MainEngineTable.RebuildTable();
            Notifier.Info(`Appended ${engineCount} engine${engineCount > 1 ? "s" : ""} using drag&drop`);
        };
        reader.readAsArrayBuffer(files[0]);
    });
    let imgs = document.querySelectorAll("img.browser-relevant");
    imgs.forEach(i => {
        let isFirefox = typeof InstallTrigger !== 'undefined';
        let isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
        if (isFirefox) {
            i.src = i.src.replace("()", "firefox");
        }
        else if (isOpera) {
            i.src = i.src.replace("()", "opera");
        }
        else {
            i.src = i.src.replace("()", "chrome");
        }
    });
    let windows = document.querySelectorAll(".fullscreen-box");
    windows.forEach(w => {
        let bg = w.querySelector(".fullscreen-grayout");
        let content = w.querySelector(".fullscreen-content");
        bg.addEventListener("click", () => {
            w.style.display = "none";
        });
        w.style.display = "none";
        FullscreenWindows[w.id] = w;
    });
    let images = document.querySelectorAll(".option-button");
    images.forEach(image => {
        image.ondragstart = () => { return false; };
    });
    let TechNodeAutocomplete = document.createElement("datalist");
    TechNodeAutocomplete.id = "techNodeItems";
    for (let i in TechNode) {
        let x = parseInt(i);
        if (isNaN(x)) {
            break;
        }
        TechNodeAutocomplete.innerHTML += `<option>${TechNode[x]}</option>`;
    }
    document.body.appendChild(TechNodeAutocomplete);
    document.getElementById("option-button-new").addEventListener("click", NewButton_Click);
    document.getElementById("option-button-open").addEventListener("click", OpenButton_Click);
    document.getElementById("option-button-save").addEventListener("click", SaveButton_Click);
    document.getElementById("option-button-cache").addEventListener("click", CacheButton_Click);
    document.getElementById("option-button-validate").addEventListener("click", ValidateButton_Click);
    document.getElementById("option-button-export").addEventListener("click", ExportButton_Click);
    document.getElementById("option-button-duplicate").addEventListener("click", DuplicateButton_Click);
    document.getElementById("option-button-add").addEventListener("click", AddButton_Click);
    document.getElementById("option-button-remove").addEventListener("click", RemoveButton_Click);
    document.getElementById("option-button-settings").addEventListener("click", SettingsButton_Click);
    document.getElementById("option-button-help").addEventListener("click", HelpButton_Click);
    document.getElementById("option-button-download-list").addEventListener("click", DownloadListButton_Click);
    document.getElementById("option-button-cache-list").addEventListener("click", CacheListButton_Click);
    document.getElementById("option-button-clipboard-list").addEventListener("click", ClipboardListButton_Click);
    document.getElementById("option-button-open-upload-list").addEventListener("click", OpenUploadButton_Click);
    document.getElementById("option-button-append-upload-list").addEventListener("click", AppendUploadButton_Click);
    document.getElementById("option-button-open-cache-list").addEventListener("click", OpenCacheButton_Click);
    document.getElementById("option-button-append-cache-list").addEventListener("click", AppendCacheButton_Click);
    document.getElementById("option-button-open-clipboard-list").addEventListener("click", OpenClipboardButton_Click);
    document.getElementById("option-button-append-clipboard-list").addEventListener("click", AppendClipboardButton_Click);
    MainEngineTable = new HtmlTable(document.getElementById("list-container"));
    MainEngineTable.ColumnsDefinitions = Engine.ColumnDefinitions;
    MainEngineTable.RebuildTable();
});
function NewButton_Click() {
    if (MainEngineTable.Items.length == 0 || confirm("All unsaved changes to this list will be lost.\n\nAre you sure you want to clear current list?")) {
        MainEngineTable.Items = [];
        MainEngineTable.RebuildTable();
        ListNameDisplay.SetValue("Unnamed");
    }
}
function OpenButton_Click() {
    FullscreenWindows["open-box"].style.display = "flex";
}
function OpenUploadButton_Click() {
    if (MainEngineTable.Items.length == 0 || confirm("All unsaved changes to this list will be lost.\n\nAre you sure you want to open a list from file?")) {
        FileIO.OpenBinary(".enl", (data, filename) => {
            if (data) {
                filename = filename.replace(/\.enl$/, "");
                ListNameDisplay.SetValue(filename);
                MainEngineTable.Items = [];
                let engineCount = Serializer.DeserializeMany(data, MainEngineTable.Items);
                MainEngineTable.RebuildTable();
                FullscreenWindows["open-box"].style.display = "none";
                Notifier.Info(`Opened ${engineCount} engine${engineCount > 1 ? "s" : ""}`);
            }
            else {
                Notifier.Warn("You didn't choose any file");
            }
        });
    }
}
function AppendUploadButton_Click() {
    FileIO.OpenBinary(".enl", (data) => {
        if (data) {
            let engineCount = Serializer.DeserializeMany(data, MainEngineTable.Items);
            MainEngineTable.RebuildTable();
            FullscreenWindows["open-box"].style.display = "none";
            Notifier.Info(`Appended ${engineCount} engine${engineCount > 1 ? "s" : ""}`);
        }
        else {
        }
    });
}
function OpenCacheButton_Click() {
    if (MainEngineTable.Items.length == 0 || confirm("All unsaved changes to this list will be lost.\n\nAre you sure you want to open a list from cache?")) {
        BrowserCacheDialog.GetEngineListData((data, newFilename) => {
            if (!data) {
                return;
            }
            if (newFilename) {
                ListNameDisplay.SetValue(newFilename);
            }
            MainEngineTable.Items = [];
            let engineCount = Serializer.DeserializeMany(data, MainEngineTable.Items);
            MainEngineTable.RebuildTable();
            FullscreenWindows["open-box"].style.display = "none";
            Notifier.Info(`Opened ${engineCount} engine${engineCount > 1 ? "s" : ""}`);
        }, "Choose a list to open");
    }
}
function AppendCacheButton_Click() {
    BrowserCacheDialog.GetEngineListData(data => {
        if (!data) {
            return;
        }
        let engineCount = Serializer.DeserializeMany(data, MainEngineTable.Items);
        MainEngineTable.RebuildTable();
        FullscreenWindows["open-box"].style.display = "none";
        Notifier.Info(`Appended ${engineCount} engine${engineCount > 1 ? "s" : ""}`);
    }, "Choose a list to append");
}
function OpenClipboardButton_Click() {
    if (MainEngineTable.Items.length == 0 || confirm("All unsaved changes to this list will be lost.\n\nAre you sure you want to open a list from base64 string?")) {
        let b64 = prompt("Enter the base64 string:");
        if (b64 == null || b64.length == 0) {
            Notifier.Warn("Base64 string was not entered");
            return;
        }
        try {
            let data = BitConverter.Base64ToByteArray(b64);
            MainEngineTable.Items = [];
            let engineCount = Serializer.DeserializeMany(data, MainEngineTable.Items);
            MainEngineTable.RebuildTable();
            FullscreenWindows["open-box"].style.display = "none";
            Notifier.Info(`Opened ${engineCount} engine${engineCount > 1 ? "s" : ""}`);
        }
        catch (e) {
            Notifier.Warn("There was an error while parsing the string");
            return;
        }
    }
}
function AppendClipboardButton_Click() {
    let b64 = prompt("Enter the base64 string:");
    if (b64 == null || b64.length == 0) {
        Notifier.Warn("Base64 string was not entered");
        return;
    }
    try {
        let data = BitConverter.Base64ToByteArray(b64);
        let engineCount = Serializer.DeserializeMany(data, MainEngineTable.Items);
        MainEngineTable.RebuildTable();
        FullscreenWindows["open-box"].style.display = "none";
        Notifier.Info(`Appended ${engineCount} engine${engineCount > 1 ? "s" : ""}`);
    }
    catch (e) {
        Notifier.Warn("There was an error while parsing the string");
        return;
    }
}
function SaveButton_Click() {
    FullscreenWindows["save-box"].style.display = "flex";
}
function DownloadListButton_Click() {
    let data = Serializer.SerializeMany(MainEngineTable.Items);
    FileIO.SaveBinary(`${ListName}.enl`, data);
    FullscreenWindows["save-box"].style.display = "none";
}
function CacheListButton_Click() {
    let data = Serializer.SerializeMany(MainEngineTable.Items);
    if (!Store.Exists(`${ListName}.enl`) || confirm(`${ListName}.enl already exists in cache.\n\nDo you want to overwrite? Old file will be lost.`)) {
        Notifier.Info(`${ListName}.enl saved in cache`);
        Store.SetBinary(`${ListName}.enl`, data);
        FullscreenWindows["save-box"].style.display = "none";
    }
    else {
        Notifier.Warn(`${ListName}.enl already exists in the cache. Current file was not saved`);
    }
}
function ClipboardListButton_Click() {
    let data = Serializer.SerializeMany(MainEngineTable.Items);
    let b64 = BitConverter.ByteArrayToBase64(data);
    let success = FileIO.ToClipboard(b64);
    if (success) {
        Notifier.Info("Engine list has been copied to clipboard");
        FullscreenWindows["save-box"].style.display = "none";
    }
    else {
        Notifier.Warn("There was an error. Engine list was NOT copied to clipboard");
    }
}
function CacheButton_Click() {
    BrowserCacheDialog.DisplayCache();
}
function ValidateButton_Click() {
    let errors = Validator.Validate(MainEngineTable.Items);
    if (errors.length == 0) {
        Notifier.Info("No errors found in this list");
    }
    else {
        Notifier.Warn("There are errors in this list");
        alert(`Following errors were found:\n\n-> ${errors.join("\n-> ")}`);
    }
}
function ExportButton_Click() {
    if (MainEngineTable.Items.length > 0) {
        let errors = Validator.Validate(MainEngineTable.Items);
        if (errors.length != 0) {
            Notifier.Error("Fix validation errors before exporting");
            alert(`Fix following errors before exporting the engine:\n\n-> ${errors.join("\n-> ")}`);
            return;
        }
        let blobs = {};
        blobs[`${ListName}.cfg`] = Exporter.ConvertEngineListToConfig(MainEngineTable.Items);
        blobs[`GEAllTankDefinition.cfg`] = AllTankDefinition.Get();
        let dll = new XMLHttpRequest();
        dll.open("GET", "./files/PlumeScaleFixer.dll", true);
        dll.responseType = "arraybuffer";
        dll.addEventListener("loadend", () => {
            blobs["PlumeScaleFixer.dll"] = new Uint8Array(dll.response);
            FileIO.ZipBlobs("GenericEngines", blobs, zipData => {
                FileIO.SaveBinary(`${ListName}.zip`, zipData);
            });
        });
        dll.send(null);
    }
}
function DuplicateButton_Click() {
    let indices = MainEngineTable.SelectedRows.sort((a, b) => { return a - b; });
    indices.forEach(index => {
        MainEngineTable.Items.push(Serializer.Copy(MainEngineTable.Rows[index][1]));
    });
    MainEngineTable.RebuildTable();
}
function AddButton_Click() {
    MainEngineTable.AddItem(new Engine(MainEngineTable.Items));
}
function RemoveButton_Click() {
    if (MainEngineTable.SelectedRows.length > 0 && confirm(`You are about to delete ${MainEngineTable.SelectedRows.length} items from the list.\n\nAre you sure?`)) {
        MainEngineTable.RemoveSelectedItems();
    }
}
function SettingsButton_Click() {
}
function HelpButton_Click() {
    FullscreenWindows["about-box"].style.display = "flex";
}
var FuelType;
(function (FuelType) {
    FuelType["Fuel"] = "Fuel";
    FuelType["Oxidiser"] = "Oxidiser";
    FuelType["MonoPropellant"] = "Monopropellant";
    FuelType["Gas"] = "Gas";
    FuelType["Solid"] = "Solid fuel";
    FuelType["Stock"] = "Stock";
    FuelType["Other"] = "Other";
})(FuelType || (FuelType = {}));
class FuelInfo {
    static GetFuelInfo(id) {
        return FuelInfo.fuels[id];
    }
    static BuildDropdown() {
        let output = document.createElement("select");
        let groups = {};
        for (let i in FuelType) {
            let group = document.createElement("optgroup");
            group.label = FuelType[i];
            output.appendChild(group);
            groups[FuelType[i]] = group;
        }
        FuelInfo.fuels.forEach((v, i) => {
            let option = document.createElement("option");
            option.value = i.toString();
            option.text = v.FuelName;
            groups[v.FuelType].appendChild(option);
        });
        return output;
    }
}
FuelInfo.fuels = [
    {
        FuelName: "Electric Charge",
        FuelID: "ElectricCharge",
        FuelType: FuelType.Other,
        TankUtilisation: 1000,
        Density: 0.0
    }, {
        FuelName: "Liquid Oxygen",
        FuelID: "LqdOxygen",
        FuelType: FuelType.Oxidiser,
        TankUtilisation: 1,
        Density: 0.001141
    }, {
        FuelName: "Kerosene",
        FuelID: "Kerosene",
        FuelType: FuelType.Fuel,
        TankUtilisation: 1,
        Density: 0.00082
    }, {
        FuelName: "Liquid Hydrogen",
        FuelID: "LqdHydrogen",
        FuelType: FuelType.Fuel,
        TankUtilisation: 1,
        Density: 0.00007085
    }, {
        FuelName: "NTO",
        FuelID: "NTO",
        FuelType: FuelType.Oxidiser,
        TankUtilisation: 1,
        Density: 0.00145
    }, {
        FuelName: "UDMH",
        FuelID: "UDMH",
        FuelType: FuelType.Fuel,
        TankUtilisation: 1,
        Density: 0.000791
    }, {
        FuelName: "Aerozine50",
        FuelID: "Aerozine50",
        FuelType: FuelType.Fuel,
        TankUtilisation: 1,
        Density: 0.0009
    }, {
        FuelName: "MMH",
        FuelID: "MMH",
        FuelType: FuelType.Fuel,
        TankUtilisation: 1,
        Density: 0.00088
    }, {
        FuelName: "HTP",
        FuelID: "HTP",
        FuelType: FuelType.MonoPropellant,
        TankUtilisation: 1,
        Density: 0.001431
    }, {
        FuelName: "Aviation Gasoline (Avgas)",
        FuelID: "AvGas",
        FuelType: FuelType.Fuel,
        TankUtilisation: 1,
        Density: 0.000719
    }, {
        FuelName: "IRFNA III",
        FuelID: "IRFNA-III",
        FuelType: FuelType.Oxidiser,
        TankUtilisation: 1,
        Density: 0.001658
    }, {
        FuelName: "Nitrous Oxide",
        FuelID: "NitrousOxide",
        FuelType: FuelType.Gas,
        TankUtilisation: 100,
        Density: 0.00000196
    }, {
        FuelName: "Aniline",
        FuelID: "Aniline",
        FuelType: FuelType.Fuel,
        TankUtilisation: 1,
        Density: 0.00102
    }, {
        FuelName: "Ethanol 75%",
        FuelID: "Ethanol75",
        FuelType: FuelType.Fuel,
        TankUtilisation: 1,
        Density: 0.00084175
    }, {
        FuelName: "Ethanol 90%",
        FuelID: "Ethanol90",
        FuelType: FuelType.Fuel,
        TankUtilisation: 1,
        Density: 0.0008101
    }, {
        FuelName: "Ethanol",
        FuelID: "Ethanol",
        FuelType: FuelType.Fuel,
        TankUtilisation: 1,
        Density: 0.000789
    }, {
        FuelName: "Liquid Ammonia",
        FuelID: "LqdAmmonia",
        FuelType: FuelType.Fuel,
        TankUtilisation: 1,
        Density: 0.0007021
    }, {
        FuelName: "Liquid Methane",
        FuelID: "LqdMethane",
        FuelType: FuelType.Fuel,
        TankUtilisation: 1,
        Density: 0.00042561
    }, {
        FuelName: "ClF3",
        FuelID: "ClF3",
        FuelType: FuelType.Oxidiser,
        TankUtilisation: 1,
        Density: 0.00177
    }, {
        FuelName: "ClF5",
        FuelID: "ClF5",
        FuelType: FuelType.Oxidiser,
        TankUtilisation: 1,
        Density: 0.0019
    }, {
        FuelName: "Diborane",
        FuelID: "Diborane",
        FuelType: FuelType.Fuel,
        TankUtilisation: 1,
        Density: 0.000421
    }, {
        FuelName: "Pentaborane",
        FuelID: "Pentaborane",
        FuelType: FuelType.Fuel,
        TankUtilisation: 1,
        Density: 0.000618
    }, {
        FuelName: "Ethane",
        FuelID: "Ethane",
        FuelType: FuelType.Fuel,
        TankUtilisation: 1,
        Density: 0.000544
    }, {
        FuelName: "Ethylene",
        FuelID: "Ethylene",
        FuelType: FuelType.Fuel,
        TankUtilisation: 1,
        Density: 0.000568
    }, {
        FuelName: "OF2",
        FuelID: "OF2",
        FuelType: FuelType.Oxidiser,
        TankUtilisation: 1,
        Density: 0.0019
    }, {
        FuelName: "Liquid Fluorine",
        FuelID: "LqdFluorine",
        FuelType: FuelType.Oxidiser,
        TankUtilisation: 1,
        Density: 0.001505
    }, {
        FuelName: "N2F4",
        FuelID: "N2F4",
        FuelType: FuelType.Oxidiser,
        TankUtilisation: 1,
        Density: 0.001604
    }, {
        FuelName: "Methanol",
        FuelID: "Methanol",
        FuelType: FuelType.Fuel,
        TankUtilisation: 1,
        Density: 0.0007918
    }, {
        FuelName: "Furfuryl",
        FuelID: "Furfuryl",
        FuelType: FuelType.Fuel,
        TankUtilisation: 1,
        Density: 0.00113
    }, {
        FuelName: "UH25",
        FuelID: "UH25",
        FuelType: FuelType.Fuel,
        TankUtilisation: 1,
        Density: 0.000829
    }, {
        FuelName: "Tonka250",
        FuelID: "Tonka250",
        FuelType: FuelType.Fuel,
        TankUtilisation: 1,
        Density: 0.000873
    }, {
        FuelName: "Tonka500",
        FuelID: "Tonka500",
        FuelType: FuelType.Fuel,
        TankUtilisation: 1,
        Density: 0.000811
    }, {
        FuelName: "IWFNA",
        FuelID: "IWFNA",
        FuelType: FuelType.Oxidiser,
        TankUtilisation: 1,
        Density: 0.001513
    }, {
        FuelName: "IRFNA IV",
        FuelID: "IRFNA-IV",
        FuelType: FuelType.Oxidiser,
        TankUtilisation: 1,
        Density: 0.001995
    }, {
        FuelName: "AK20",
        FuelID: "AK20",
        FuelType: FuelType.Oxidiser,
        TankUtilisation: 1,
        Density: 0.001499
    }, {
        FuelName: "AK27",
        FuelID: "AK27",
        FuelType: FuelType.Oxidiser,
        TankUtilisation: 1,
        Density: 0.001494
    }, {
        FuelName: "MON3",
        FuelID: "MON3",
        FuelType: FuelType.Oxidiser,
        TankUtilisation: 1,
        Density: 0.001423
    }, {
        FuelName: "MON10",
        FuelID: "MON10",
        FuelType: FuelType.Oxidiser,
        TankUtilisation: 1,
        Density: 0.001407
    }, {
        FuelName: "Hydyne",
        FuelID: "Hydyne",
        FuelType: FuelType.Fuel,
        TankUtilisation: 1,
        Density: 0.00086
    }, {
        FuelName: "Syntin",
        FuelID: "Syntin",
        FuelType: FuelType.Fuel,
        TankUtilisation: 1,
        Density: 0.000851
    }, {
        FuelName: "Hydrazine",
        FuelID: "Hydrazine",
        FuelType: FuelType.MonoPropellant,
        TankUtilisation: 1,
        Density: 0.001004
    }, {
        FuelName: "Nitrogen",
        FuelID: "Nitrogen",
        FuelType: FuelType.Gas,
        TankUtilisation: 200,
        Density: 0.000001251
    }, {
        FuelName: "Helium",
        FuelID: "Helium",
        FuelType: FuelType.Gas,
        TankUtilisation: 200,
        Density: 0.0000001786
    }, {
        FuelName: "CaveaB",
        FuelID: "CaveaB",
        FuelType: FuelType.MonoPropellant,
        TankUtilisation: 1,
        Density: 0.001501
    }, {
        FuelName: "Liquid Fuel",
        FuelID: "LiquidFuel",
        FuelType: FuelType.Stock,
        TankUtilisation: 1,
        Density: 0.001
    }, {
        FuelName: "Oxidizer",
        FuelID: "Oxidizer",
        FuelType: FuelType.Stock,
        TankUtilisation: 1,
        Density: 0.001
    }, {
        FuelName: "Monopropellant",
        FuelID: "MonoPropellant",
        FuelType: FuelType.Stock,
        TankUtilisation: 1,
        Density: 0.0008
    }, {
        FuelName: "Xenon Gas",
        FuelID: "XenonGas",
        FuelType: FuelType.Stock,
        TankUtilisation: 100,
        Density: 0.000005894
    }, {
        FuelName: "Intake Air",
        FuelID: "IntakeAir",
        FuelType: FuelType.Stock,
        TankUtilisation: 1,
        Density: 0.001225
    }, {
        FuelName: "Solid Fuel",
        FuelID: "SolidFuel",
        FuelType: FuelType.Stock,
        TankUtilisation: 1,
        Density: 0.0075
    }, {
        FuelName: "HNIW",
        FuelID: "HNIW",
        FuelType: FuelType.Solid,
        TankUtilisation: 1,
        Density: 0.002044
    }, {
        FuelName: "HTPB",
        FuelID: "HTPB",
        FuelType: FuelType.Solid,
        TankUtilisation: 1,
        Density: 0.00177
    }, {
        FuelName: "NGNC",
        FuelID: "NGNC",
        FuelType: FuelType.Solid,
        TankUtilisation: 1,
        Density: 0.0016
    }, {
        FuelName: "PBAN",
        FuelID: "PBAN",
        FuelType: FuelType.Solid,
        TankUtilisation: 1,
        Density: 0.001772
    }, {
        FuelName: "PSPC",
        FuelID: "PSPC",
        FuelType: FuelType.Solid,
        TankUtilisation: 1,
        Density: 0.00174
    }
];
FuelInfo.Dropdown = FuelInfo.BuildDropdown();
var EngineGroupType;
(function (EngineGroupType) {
    EngineGroupType["IRL"] = "Real Engine";
    EngineGroupType["Fake"] = "Fictional Engine";
    EngineGroupType["Ion"] = "Ion Thruster";
    EngineGroupType["SRB"] = "SRB";
})(EngineGroupType || (EngineGroupType = {}));
class ModelInfo {
    static GetModelInfo(id) {
        return ModelInfo.models[id];
    }
    static BuildDropdown() {
        let output = document.createElement("select");
        let groups = {};
        for (let i in EngineGroupType) {
            let group = document.createElement("optgroup");
            group.label = EngineGroupType[i];
            output.appendChild(group);
            groups[EngineGroupType[i]] = group;
        }
        ModelInfo.models.forEach((v, i) => {
            let option = document.createElement("option");
            option.value = i.toString();
            option.text = v.ModelName;
            groups[v.ModelType].appendChild(option);
        });
        return output;
    }
}
ModelInfo.models = [
    {
        OriginalHeight: 1.885,
        OriginalBellWidth: 0.9635,
        OriginalBaseWidth: 0.892,
        PlumeSizeMultiplier: 1.0,
        PlumePositionOffset: 0.8,
        NodeStackTop: 0.7215,
        NodeStackBottom: -1.1635,
        ModelPath: "RealismOverhaul/Models/LR-91eng",
        TextureDefinitions: "",
        ThrustTransformName: "thrustTransform",
        GimbalTransformName: "thrustTransform",
        ModelName: "LR-91-AJ-5",
        ModelType: EngineGroupType.IRL,
        HiddenMuObjects: [],
        CanAttachOnModel: false,
        OriginalTankVolume: 0,
        RadialAttachment: false,
        RadialAttachmentPoint: 0
    }, {
        OriginalHeight: 0.654,
        OriginalBellWidth: 0.285,
        OriginalBaseWidth: 0.395,
        PlumeSizeMultiplier: 0.295,
        PlumePositionOffset: -0.09,
        NodeStackTop: 0.33,
        NodeStackBottom: -0.324,
        ModelPath: "SXT/Parts/Rocketry/Engine/Vanguard/model",
        TextureDefinitions: `
                texture: fairing , Squad/Parts/Engine/liquidEngineLV-T45/model002
                texture: model000 , Squad/Parts/Engine/liquidEngineLV-T45/model000
                texture: model001 , Squad/Parts/Engine/liquidEngineLV-T45/model001
            `,
        ThrustTransformName: "thrustTransform",
        GimbalTransformName: "thrustTransform",
        ModelName: "AJ-10-142",
        ModelType: EngineGroupType.IRL,
        HiddenMuObjects: [
            "Cylinder_002"
        ],
        CanAttachOnModel: false,
        OriginalTankVolume: 0,
        RadialAttachment: false,
        RadialAttachmentPoint: 0
    }, {
        OriginalHeight: 1.5,
        OriginalBellWidth: 0.865,
        OriginalBaseWidth: 0.989,
        PlumeSizeMultiplier: 0.85,
        PlumePositionOffset: -0.8,
        NodeStackTop: -0.025,
        NodeStackBottom: -1.525,
        ModelPath: "VenStockRevamp/Squad/Parts/Propulsion/KS-25",
        TextureDefinitions: "",
        ThrustTransformName: "thrustTransform",
        GimbalTransformName: "Nozzle",
        ModelName: "RS-25",
        ModelType: EngineGroupType.IRL,
        HiddenMuObjects: [
            "Size2A"
        ],
        CanAttachOnModel: false,
        OriginalTankVolume: 0,
        RadialAttachment: false,
        RadialAttachmentPoint: 0
    }, {
        OriginalHeight: 0.3055,
        OriginalBellWidth: 0.12,
        OriginalBaseWidth: 0.222,
        PlumeSizeMultiplier: 0.11,
        PlumePositionOffset: -0.04,
        NodeStackTop: 0.0495,
        NodeStackBottom: -0.256,
        ModelPath: "VenStockRevamp/Squad/Parts/Propulsion/LV-1B",
        TextureDefinitions: "",
        ThrustTransformName: "thrustTransform",
        GimbalTransformName: "Gimbal",
        ModelName: "Generic thruster",
        ModelType: EngineGroupType.Fake,
        HiddenMuObjects: [],
        CanAttachOnModel: false,
        OriginalTankVolume: 0,
        RadialAttachment: false,
        RadialAttachmentPoint: 0
    }, {
        OriginalHeight: 0.393,
        OriginalBellWidth: 0.234,
        OriginalBaseWidth: 0.616,
        PlumeSizeMultiplier: 0.225,
        PlumePositionOffset: -0.06,
        NodeStackTop: 0.0,
        NodeStackBottom: -0.393,
        ModelPath: "VenStockRevamp/Squad/Parts/Propulsion/48-7S",
        TextureDefinitions: "",
        ThrustTransformName: "thrustTransform",
        GimbalTransformName: "Obj_Gimbal",
        ModelName: "Spark (VSR)",
        ModelType: EngineGroupType.Fake,
        HiddenMuObjects: [
            "Size2A",
            "node_fairing_collider"
        ],
        CanAttachOnModel: false,
        OriginalTankVolume: 0,
        RadialAttachment: false,
        RadialAttachmentPoint: 0
    }, {
        OriginalHeight: 0.3935,
        OriginalBellWidth: 0.459,
        OriginalBaseWidth: 0.627,
        PlumeSizeMultiplier: 0.42,
        PlumePositionOffset: 0,
        NodeStackTop: 0.1965,
        NodeStackBottom: -0.197,
        ModelPath: "VenStockRevamp/Squad/Parts/Propulsion/IonEngine",
        TextureDefinitions: "",
        ThrustTransformName: "thrustTransform",
        GimbalTransformName: "thrustTransform",
        ModelName: "Ion thruster",
        ModelType: EngineGroupType.Ion,
        HiddenMuObjects: [
            "Size1B",
            "fairing"
        ],
        CanAttachOnModel: false,
        OriginalTankVolume: 0,
        RadialAttachment: false,
        RadialAttachmentPoint: 0
    }, {
        OriginalHeight: 4.48,
        OriginalBellWidth: 1.802,
        OriginalBaseWidth: 3.78,
        PlumeSizeMultiplier: 1.6,
        PlumePositionOffset: -0.7,
        NodeStackTop: 1.49,
        NodeStackBottom: -2.99,
        ModelPath: "VenStockRevamp/Squad/Parts/Propulsion/KR-2L",
        TextureDefinitions: "",
        ThrustTransformName: "thrustTransform",
        GimbalTransformName: "Nozzle",
        ModelName: "Rhino (VSR)",
        ModelType: EngineGroupType.Fake,
        HiddenMuObjects: [
            "fairing"
        ],
        CanAttachOnModel: false,
        OriginalTankVolume: 0,
        RadialAttachment: false,
        RadialAttachmentPoint: 0
    }, {
        OriginalHeight: 0.727,
        OriginalBellWidth: 0.445,
        OriginalBaseWidth: 0.989,
        PlumeSizeMultiplier: 0.4,
        PlumePositionOffset: -0.12,
        NodeStackTop: 0.195,
        NodeStackBottom: -0.532,
        OriginalTankVolume: 110,
        ModelPath: "VenStockRevamp/Squad/Parts/Propulsion/LV900",
        TextureDefinitions: "",
        ThrustTransformName: "thrustTransform",
        GimbalTransformName: "Obj_Gimbal",
        ModelName: "Beagle (VSR)",
        ModelType: EngineGroupType.Fake,
        HiddenMuObjects: [
            "Size2B",
            "fairing",
            "Hoses"
        ],
        CanAttachOnModel: false,
        RadialAttachment: false,
        RadialAttachmentPoint: 0
    }, {
        OriginalHeight: 8.018,
        OriginalBellWidth: 1.05265,
        OriginalBaseWidth: 1.276,
        PlumeSizeMultiplier: 1.1,
        PlumePositionOffset: -0.4,
        NodeStackTop: 3.89,
        NodeStackBottom: -4.128,
        RadialAttachmentPoint: 0.639,
        OriginalTankVolume: 6780,
        RadialAttachment: true,
        CanAttachOnModel: true,
        ModelPath: "VenStockRevamp/Squad/Parts/Propulsion/BACC",
        TextureDefinitions: "",
        ThrustTransformName: "thrustTransform",
        GimbalTransformName: "thrustTransform",
        ModelName: "BACC (VSR)",
        ModelType: EngineGroupType.SRB,
        HiddenMuObjects: [
            "fairing"
        ]
    }, {
        OriginalHeight: 1.444,
        OriginalBellWidth: 0.773,
        OriginalBaseWidth: 1.003,
        PlumeSizeMultiplier: 0.7,
        PlumePositionOffset: -0.18,
        NodeStackTop: 0.552,
        NodeStackBottom: -0.892,
        RadialAttachmentPoint: 0.503,
        OriginalTankVolume: 528,
        RadialAttachment: true,
        CanAttachOnModel: true,
        ModelPath: "VenStockRevamp/Squad/Parts/Propulsion/RT5",
        TextureDefinitions: "",
        ThrustTransformName: "thrustTransform",
        GimbalTransformName: "thrustTransform",
        ModelName: "RT-5 (VSR)",
        ModelType: EngineGroupType.SRB,
        HiddenMuObjects: [
            "fairing"
        ]
    }, {
        OriginalHeight: 3.5,
        OriginalBellWidth: 0.5945,
        OriginalBaseWidth: 0.613,
        PlumeSizeMultiplier: 0.55,
        PlumePositionOffset: -0.16,
        NodeStackTop: 1.8,
        NodeStackBottom: -1.7,
        RadialAttachmentPoint: 0.307,
        OriginalTankVolume: 640,
        RadialAttachment: true,
        CanAttachOnModel: true,
        ModelPath: "VenStockRevamp/Squad/Parts/Propulsion/RT2",
        TextureDefinitions: "",
        ThrustTransformName: "thrustTransform",
        GimbalTransformName: "thrustTransform",
        ModelName: "RT-2 (VSR)",
        ModelType: EngineGroupType.SRB,
        HiddenMuObjects: []
    }, {
        OriginalHeight: 14.81,
        OriginalBellWidth: 1.043,
        OriginalBaseWidth: 1.183,
        PlumeSizeMultiplier: 1.1,
        PlumePositionOffset: 0.55,
        NodeStackTop: 7.445,
        NodeStackBottom: -7.365,
        RadialAttachmentPoint: 0.595,
        OriginalTankVolume: 11190,
        RadialAttachment: true,
        CanAttachOnModel: true,
        ModelPath: "VenStockRevamp/Squad/Parts/Propulsion/S1",
        TextureDefinitions: "",
        ThrustTransformName: "thrustTransform",
        GimbalTransformName: "thrustTransform",
        ModelName: "S-1 (VSR)",
        ModelType: EngineGroupType.SRB,
        HiddenMuObjects: []
    }, {
        OriginalHeight: 0.633,
        OriginalBellWidth: 0.445,
        OriginalBaseWidth: 0.991,
        PlumeSizeMultiplier: 0.4,
        PlumePositionOffset: -0.14,
        NodeStackTop: 0.193,
        NodeStackBottom: -0.44,
        ModelPath: "VenStockRevamp/Squad/Parts/Propulsion/LV909",
        TextureDefinitions: "",
        ThrustTransformName: "thrustTransform",
        GimbalTransformName: "Obj_Gimbal",
        ModelName: "LV-909 (VSR)",
        ModelType: EngineGroupType.Fake,
        HiddenMuObjects: [
            "fairing",
            "Size2B"
        ],
        CanAttachOnModel: false,
        OriginalTankVolume: 0,
        RadialAttachment: false,
        RadialAttachmentPoint: 0
    }, {
        OriginalHeight: 3.25,
        OriginalBellWidth: 0.996,
        OriginalBaseWidth: 1.245,
        PlumeSizeMultiplier: 0.9,
        PlumePositionOffset: 0.56,
        NodeStackTop: 1.414,
        NodeStackBottom: -1.836,
        ModelPath: "VenStockRevamp/Squad/Parts/Propulsion/LVN",
        TextureDefinitions: "",
        ThrustTransformName: "thrustTransform",
        GimbalTransformName: "thrustTransform",
        ModelName: "NERVA (VSR)",
        ModelType: EngineGroupType.IRL,
        HiddenMuObjects: [
            "fairingL",
            "fairingR",
            "Size2A"
        ],
        CanAttachOnModel: false,
        OriginalTankVolume: 0,
        RadialAttachment: false,
        RadialAttachmentPoint: 0
    }, {
        OriginalHeight: 1.574,
        OriginalBellWidth: 0.653,
        OriginalBaseWidth: 1.001,
        PlumeSizeMultiplier: 0.57,
        PlumePositionOffset: -0.1,
        NodeStackTop: 0.774,
        NodeStackBottom: -0.8,
        ModelPath: "VenStockRevamp/Squad/Parts/Propulsion/LVT30",
        TextureDefinitions: "",
        ThrustTransformName: "thrustTransform",
        GimbalTransformName: "thrustTransform",
        ModelName: "LV-T30 (VSR)",
        ModelType: EngineGroupType.Fake,
        HiddenMuObjects: [
            "fairing",
            "Size2A"
        ],
        CanAttachOnModel: false,
        OriginalTankVolume: 0,
        RadialAttachment: false,
        RadialAttachmentPoint: 0
    }, {
        OriginalHeight: 1.643,
        OriginalBellWidth: 0.602,
        OriginalBaseWidth: 0.998,
        PlumeSizeMultiplier: 0.53,
        PlumePositionOffset: -0.16,
        NodeStackTop: 0.75,
        NodeStackBottom: -0.893,
        ModelPath: "VenStockRevamp/Squad/Parts/Propulsion/LVT45",
        TextureDefinitions: "",
        ThrustTransformName: "thrustTransform",
        GimbalTransformName: "Obj_Gimbal",
        ModelName: "LV-T45 (VSR)",
        ModelType: EngineGroupType.Fake,
        HiddenMuObjects: [
            "fairing",
            "Size2A",
            "Cube_006_031_001"
        ],
        CanAttachOnModel: false,
        OriginalTankVolume: 0,
        RadialAttachment: false,
        RadialAttachmentPoint: 0
    }, {
        OriginalHeight: 0.615,
        OriginalBellWidth: 0.226,
        OriginalBaseWidth: 0.584,
        PlumeSizeMultiplier: 0.19,
        PlumePositionOffset: -0.075,
        NodeStackTop: 0.02,
        NodeStackBottom: -0.595,
        ModelPath: "VenStockRevamp/Squad/Parts/Propulsion/105-7P",
        TextureDefinitions: "",
        ThrustTransformName: "thrustTransform",
        GimbalTransformName: "nozzle",
        ModelName: "105-7P (VSR)",
        ModelType: EngineGroupType.Fake,
        HiddenMuObjects: [
            "Size2A",
            "node_fairing_collider"
        ],
        CanAttachOnModel: false,
        OriginalTankVolume: 0,
        RadialAttachment: false,
        RadialAttachmentPoint: 0
    }, {
        OriginalHeight: 1.228,
        OriginalBellWidth: 0.773,
        OriginalBaseWidth: 0.653,
        PlumeSizeMultiplier: 0.72,
        PlumePositionOffset: -0.3,
        NodeStackTop: -0.012,
        NodeStackBottom: -1.24,
        ModelPath: "VenStockRevamp/Squad/Parts/Propulsion/OMS-L",
        TextureDefinitions: "",
        ThrustTransformName: "thrustTransform",
        GimbalTransformName: "Nozzle",
        ModelName: "OMS-L (VSR)",
        ModelType: EngineGroupType.Fake,
        HiddenMuObjects: [],
        CanAttachOnModel: false,
        OriginalTankVolume: 0,
        RadialAttachment: false,
        RadialAttachmentPoint: 0
    }, {
        OriginalHeight: 1.584,
        OriginalBellWidth: 1.222,
        OriginalBaseWidth: 1.196,
        PlumeSizeMultiplier: 1.12,
        PlumePositionOffset: 0.0,
        NodeStackTop: 0.722,
        NodeStackBottom: -0.862,
        ModelPath: "VenStockRevamp/Squad/Parts/Propulsion/Poodle",
        TextureDefinitions: "",
        ThrustTransformName: "thrustTransform",
        GimbalTransformName: "Obj_Gimbal",
        ModelName: "Poodle (VSR)",
        ModelType: EngineGroupType.Fake,
        HiddenMuObjects: [
            "Size2B",
            "fairing"
        ],
        CanAttachOnModel: false,
        OriginalTankVolume: 0,
        RadialAttachment: false,
        RadialAttachmentPoint: 0
    }, {
        OriginalHeight: 1.868,
        OriginalBellWidth: 0.886,
        OriginalBaseWidth: 2.5,
        PlumeSizeMultiplier: 0.82,
        PlumePositionOffset: -0.4,
        NodeStackTop: 0.0,
        NodeStackBottom: -1.868,
        ModelPath: "VenStockRevamp/Squad/Parts/Propulsion/PoodleLargeNTR",
        TextureDefinitions: "",
        ThrustTransformName: "thrustTransform",
        GimbalTransformName: "thrustTransform",
        ModelName: "Sphere NTR (VSR)",
        ModelType: EngineGroupType.Fake,
        HiddenMuObjects: [
            "fairing"
        ],
        CanAttachOnModel: false,
        OriginalTankVolume: 0,
        RadialAttachment: false,
        RadialAttachmentPoint: 0
    }, {
        OriginalHeight: 0.767,
        OriginalBellWidth: 0.407,
        OriginalBaseWidth: 0.585,
        PlumeSizeMultiplier: 0.36,
        PlumePositionOffset: -0.03,
        NodeStackTop: 0.065,
        NodeStackBottom: -0.702,
        ModelPath: "VenStockRevamp/Squad/Parts/Propulsion/PoodleNTR",
        TextureDefinitions: "",
        ThrustTransformName: "thrustTransform",
        GimbalTransformName: "thrustTransform",
        ModelName: "Small Sphere NTR (VSR)",
        ModelType: EngineGroupType.Fake,
        HiddenMuObjects: [
            "Size1B",
            "fairing"
        ],
        CanAttachOnModel: false,
        OriginalTankVolume: 0,
        RadialAttachment: false,
        RadialAttachmentPoint: 0
    }, {
        OriginalHeight: 3.514,
        OriginalBellWidth: 1.6,
        OriginalBaseWidth: 2.504,
        PlumeSizeMultiplier: 1.45,
        PlumePositionOffset: -0.65,
        NodeStackTop: 1.19,
        NodeStackBottom: -2.324,
        ModelPath: "VenStockRevamp/Squad/Parts/Propulsion/Size2MedEngineB",
        TextureDefinitions: "",
        ThrustTransformName: "thrustTransform",
        GimbalTransformName: "Nozzle",
        ModelName: "Gas Generator (VSR)",
        ModelType: EngineGroupType.Fake,
        HiddenMuObjects: [
            "fairing"
        ],
        CanAttachOnModel: false,
        OriginalTankVolume: 0,
        RadialAttachment: false,
        RadialAttachmentPoint: 0
    }, {
        OriginalHeight: 2.655,
        OriginalBellWidth: 1.415,
        OriginalBaseWidth: 1.225,
        PlumeSizeMultiplier: 1.3,
        PlumePositionOffset: 0.0,
        NodeStackTop: 0.007,
        NodeStackBottom: -2.648,
        ModelPath: "VenStockRevamp/Squad/Parts/Propulsion/Skipper",
        TextureDefinitions: "",
        ThrustTransformName: "thrustTransform",
        GimbalTransformName: "Obj_Gimbal",
        ModelName: "Skipper (VSR)",
        ModelType: EngineGroupType.Fake,
        HiddenMuObjects: [
            "obj_fairing",
            "Size2A"
        ],
        CanAttachOnModel: false,
        OriginalTankVolume: 0,
        RadialAttachment: false,
        RadialAttachmentPoint: 0
    }
];
ModelInfo.Dropdown = ModelInfo.BuildDropdown();
class PlumeInfo {
    static GetPlumeInfo(id) {
        return PlumeInfo.plumes[id];
    }
    static BuildDropdown() {
        let output = document.createElement("select");
        PlumeInfo.plumes.forEach((v, i) => {
            let option = document.createElement("option");
            option.value = i.toString();
            option.text = v.PlumeName;
            output.options.add(option);
        });
        return output;
    }
}
PlumeInfo.plumes = [
    {
        PlumeID: "Kerolox-Upper",
        PlumeName: "Kerolox Upper",
        Scale: 0.4,
        PositionOffset: -0.002,
        FinalOffset: 0.0,
        EnergyMultiplier: 1.0
    }, {
        PlumeID: "Kerolox-Lower",
        PlumeName: "Kerolox Lower",
        Scale: 0.4,
        PositionOffset: -0.002,
        FinalOffset: 0.0,
        EnergyMultiplier: 1.0
    }, {
        PlumeID: "Kerolox-Vernier",
        PlumeName: "Kerolox Vernier",
        Scale: 8.5,
        PositionOffset: 0.0,
        FinalOffset: 0.0,
        EnergyMultiplier: 0.5
    }, {
        PlumeID: "Cryogenic-UpperLower-125",
        PlumeName: "Cryogenic 1.25",
        Scale: 0.35,
        PositionOffset: 0.0,
        FinalOffset: 0.0,
        EnergyMultiplier: 1.0
    }, {
        PlumeID: "Cryogenic-UpperLower-25",
        PlumeName: "Cryogenic 2.5",
        Scale: 0.6,
        PositionOffset: 0.0,
        FinalOffset: 0.0,
        EnergyMultiplier: 1.0
    }, {
        PlumeID: "Cryogenic-UpperLower-375",
        PlumeName: "Cryogenic 3.75",
        Scale: 0.3,
        PositionOffset: 0.0,
        FinalOffset: 0.0,
        EnergyMultiplier: 1.0
    }, {
        PlumeID: "Alcolox-Lower-A6",
        PlumeName: "Alcolox Lower (A6)",
        Scale: 0.6,
        PositionOffset: 0.032638,
        FinalOffset: 0.0,
        EnergyMultiplier: 1.0
    }, {
        PlumeID: "Ammonialox",
        PlumeName: "Ammonialox",
        Scale: 0.85,
        PositionOffset: 1.0319,
        FinalOffset: 0.0,
        EnergyMultiplier: 1.0
    }, {
        PlumeID: "Hydrogen-NTR",
        PlumeName: "Hydrogen NTR",
        Scale: 0.8,
        PositionOffset: -0.8,
        FinalOffset: 0.0,
        EnergyMultiplier: 1.0
    }, {
        PlumeID: "Hydrolox-Lower",
        PlumeName: "Hydrolox Lower",
        Scale: 0.7,
        PositionOffset: 1.0,
        FinalOffset: 0.0,
        EnergyMultiplier: 1.0
    }, {
        PlumeID: "Hydrolox-Upper",
        PlumeName: "Hydrolox Upper",
        Scale: 0.8,
        PositionOffset: 1.0,
        FinalOffset: 0.0,
        EnergyMultiplier: 1.0
    }, {
        PlumeID: "Hydynelox-A7",
        PlumeName: "Hydynelox (A7)",
        Scale: 0.7,
        PositionOffset: -0.854729,
        FinalOffset: 0.0,
        EnergyMultiplier: 1.0
    }, {
        PlumeID: "Hypergolic-Lower",
        PlumeName: "Hypergolic Lower",
        Scale: 0.95,
        PositionOffset: 0.0,
        FinalOffset: 0.0,
        EnergyMultiplier: 1.0
    }, {
        PlumeID: "Hypergolic-Upper",
        PlumeName: "Hypergolic Upper",
        Scale: 1.1,
        PositionOffset: 0.0,
        FinalOffset: 0.0,
        EnergyMultiplier: 1.0
    }, {
        PlumeID: "Hypergolic-OMS-Red",
        PlumeName: "Hypergolic OMS (Red)",
        Scale: 1.7,
        PositionOffset: 0.514995,
        FinalOffset: 0.0,
        EnergyMultiplier: 1.0
    }, {
        PlumeID: "Hypergolic-OMS-White",
        PlumeName: "Hypergolic OMS (White)",
        Scale: 1.8,
        PositionOffset: 0,
        FinalOffset: -0.04,
        EnergyMultiplier: 1.0
    }, {
        PlumeID: "Hypergolic-Vernier",
        PlumeName: "Hypergolic Vernier",
        Scale: 4.0,
        PositionOffset: 1.0,
        FinalOffset: 0.0,
        EnergyMultiplier: 1.0
    }, {
        PlumeID: "Ion-Argon-Gridded",
        PlumeName: "Ion Argon (Gridded)",
        Scale: 1.2,
        PositionOffset: 0.0,
        FinalOffset: 0.0,
        EnergyMultiplier: 1.0
    }, {
        PlumeID: "Ion-Krypton-Gridded",
        PlumeName: "Ion Krypton (Gridded)",
        Scale: 1.5,
        PositionOffset: -0.854729,
        FinalOffset: 0.0,
        EnergyMultiplier: 1.0
    }, {
        PlumeID: "Ion-Krypton-Hall",
        PlumeName: "Ion Krypton (Hall)",
        Scale: 1.5,
        PositionOffset: -0.015503,
        FinalOffset: 0.0,
        EnergyMultiplier: 1.0
    }, {
        PlumeID: "Ion-Xenon-Gridded",
        PlumeName: "Ion Xenon (Gridded)",
        Scale: 1.0,
        PositionOffset: 1.0,
        FinalOffset: 0.0,
        EnergyMultiplier: 1.0
    }, {
        PlumeID: "Ion-Xenon-Hall",
        PlumeName: "Ion Xenon (Hall)",
        Scale: 1.6,
        PositionOffset: -0.015503,
        FinalOffset: 0.0,
        EnergyMultiplier: 1.0
    }, {
        PlumeID: "Solid-Lower",
        PlumeName: "Solid Lower",
        Scale: 0.3,
        PositionOffset: -0.002,
        FinalOffset: 0.0,
        EnergyMultiplier: 1.0
    }, {
        PlumeID: "Solid-Upper",
        PlumeName: "Solid Upper",
        Scale: 0.3,
        PositionOffset: -0.002,
        FinalOffset: 0.0,
        EnergyMultiplier: 1.0
    }, {
        PlumeID: "Solid-Sepmotor",
        PlumeName: "Solid Sepmotor",
        Scale: 3.0,
        PositionOffset: 0.0,
        FinalOffset: 0.0,
        EnergyMultiplier: 1.0
    }, {
        PlumeID: "Solid-Vacuum",
        PlumeName: "Solid Vacuum",
        Scale: 1.44,
        PositionOffset: 0.35831,
        FinalOffset: 0.0,
        EnergyMultiplier: 1.0
    }, {
        PlumeID: "Turbofan",
        PlumeName: "Turbofan",
        Scale: 1.2,
        PositionOffset: -0.41932,
        FinalOffset: 0.0,
        EnergyMultiplier: 1.0
    }, {
        PlumeID: "Turbojet",
        PlumeName: "Turbojet",
        Scale: 1.2,
        PositionOffset: 1.0,
        FinalOffset: -0.6,
        EnergyMultiplier: 1.0
    }
];
PlumeInfo.Dropdown = PlumeInfo.BuildDropdown();
document.addEventListener("DOMContentLoaded", () => {
    BrowserCacheDialog.DialogBoxElement = document.getElementById("cache-box");
    document.querySelector("#cache-box > div.fullscreen-grayout").addEventListener("click", () => {
        BrowserCacheDialog.FinishTransaction(null);
    });
});
class BrowserCacheDialog {
    static SetTransaction(transaction) {
        if (this.CurrentTransaction) {
            this.CurrentTransaction(null);
        }
        this.DialogBoxElement.style.display = "flex";
        this.CurrentTransaction = transaction;
    }
    static FinishTransaction(message, name) {
        if (this.CurrentTransaction) {
            this.CurrentTransaction(message, name);
        }
        this.DialogBoxElement.style.display = "none";
        this.CurrentTransaction = null;
    }
    static GetEngineListData(callback, message = "Browser cache") {
        this.SetTransaction(callback);
        this.DialogBoxElement.querySelector("span").innerHTML = message;
        let container = document.getElementById("cache-box-content");
        container.innerHTML = "";
        let lists = [];
        for (let i in localStorage) {
            if (/^(.)+\.enl$/.test(i)) {
                lists.push(i);
            }
        }
        lists = lists.sort();
        lists.forEach(i => {
            let listItem = document.createElement("div");
            listItem.classList.add("option-button");
            listItem.addEventListener("click", () => {
                this.FinishTransaction(Store.GetBinary(i), i.replace(/\.enl$/, ""));
            });
            listItem.innerHTML = i;
            container.appendChild(listItem);
        });
    }
    static DisplayCache(message = "Browser cache") {
        this.DialogBoxElement.style.display = "flex";
        this.DialogBoxElement.querySelector("span").innerHTML = message;
        let container = document.getElementById("cache-box-content");
        container.innerHTML = "";
        let lists = [];
        for (let i in localStorage) {
            if (/^(.)+\.enl$/.test(i)) {
                lists.push(i);
            }
        }
        lists = lists.sort();
        lists.forEach(i => {
            let listItem = document.createElement("div");
            listItem.innerHTML = i;
            let removeButton = document.createElement("img");
            removeButton.src = "img/button/remove-cache.png";
            removeButton.title = "Remove this list from cache";
            removeButton.classList.add("option-button");
            removeButton.classList.add("cache-option-button");
            removeButton.addEventListener("click", () => {
                if (confirm(`You are going to delete ${i}\n\nAre you sure?`)) {
                    Store.Remove(i);
                    this.DisplayCache();
                    Notifier.Info(`${i} deleted from cache`);
                }
            });
            listItem.appendChild(removeButton);
            let renameButton = document.createElement("img");
            renameButton.src = "img/button/rename-cache.png";
            renameButton.title = "Rename this list";
            renameButton.classList.add("option-button");
            renameButton.classList.add("cache-option-button");
            renameButton.addEventListener("click", () => {
                let newName = prompt("Enter a new name:", i.replace(/\.enl$/, ""));
                if (newName) {
                    newName = newName.replace(/\.enl$/, "");
                    newName += ".enl";
                    if (Store.Exists(newName)) {
                        Notifier.Warn("List with this name already exists. Choose a different name");
                        return;
                    }
                    Store.Rename(i, newName);
                    this.DisplayCache();
                }
            });
            listItem.appendChild(renameButton);
            let appendButton = document.createElement("img");
            appendButton.src = "img/button/append-cache.png";
            appendButton.title = "Append this list";
            appendButton.classList.add("option-button");
            appendButton.classList.add("cache-option-button");
            appendButton.addEventListener("click", () => {
                Serializer.DeserializeMany(Store.GetBinary(i), MainEngineTable.Items);
                MainEngineTable.RebuildTable();
                this.DialogBoxElement.style.display = "none";
            });
            listItem.appendChild(appendButton);
            let openButton = document.createElement("img");
            openButton.src = "img/button/open-cache.png";
            openButton.title = "Open this list";
            openButton.classList.add("option-button");
            openButton.classList.add("cache-option-button");
            openButton.addEventListener("click", () => {
                if (MainEngineTable.Items.length == 0 || confirm("All unsaved changes to this list will be lost.\n\nAre you sure you want to open a list from cache?")) {
                    ListNameDisplay.SetValue(i.replace(/\.enl$/, ""));
                    MainEngineTable.Items = [];
                    Serializer.DeserializeMany(Store.GetBinary(i), MainEngineTable.Items);
                    MainEngineTable.RebuildTable();
                    this.DialogBoxElement.style.display = "none";
                }
            });
            listItem.appendChild(openButton);
            container.appendChild(listItem);
        });
    }
}
var PolymorphismType;
(function (PolymorphismType) {
    PolymorphismType[PolymorphismType["Single"] = 0] = "Single";
    PolymorphismType[PolymorphismType["MultiModeMaster"] = 1] = "MultiModeMaster";
    PolymorphismType[PolymorphismType["MultiModeSlave"] = 2] = "MultiModeSlave";
    PolymorphismType[PolymorphismType["MultiConfigMaster"] = 3] = "MultiConfigMaster";
    PolymorphismType[PolymorphismType["MultiConfigSlave"] = 4] = "MultiConfigSlave";
})(PolymorphismType || (PolymorphismType = {}));
class Engine {
    constructor(originList = []) {
        this.Spacer = false;
        this.EditableFieldMetadata = {
            Spacer: {
                GetDisplayElement: () => {
                    let tmp = document.createElement("div");
                    tmp.classList.add("content-cell-content");
                    return tmp;
                }
            }, ID: {
                ApplyChangesToValue: (e) => {
                    let output = "";
                    let rawInput = e.value;
                    rawInput.replace(" ", "-");
                    for (let i = 0; i < rawInput.length; ++i) {
                        if (/[a-zA-Z0-9-]{1}/.test(rawInput[i])) {
                            output += rawInput[i];
                        }
                    }
                    if (output == "") {
                        output = "EnterCorrectID";
                    }
                    this.ID = output;
                }
            }, Mass: {
                ApplyValueToDisplayElement: (e) => {
                    e.innerHTML = Unit.Display(this.Mass, "t", false);
                }, ApplyValueToEditElement: (e) => {
                    e.value = Unit.Display(this.Mass, "t", false);
                }, ApplyChangesToValue: (e) => {
                    this.Mass = Unit.Parse(e.value, "t");
                }
            }, Thrust: {
                ApplyValueToDisplayElement: (e) => {
                    e.innerHTML = Unit.Display(this.Thrust, "kN", false);
                }, ApplyValueToEditElement: (e) => {
                    e.value = Unit.Display(this.Thrust, "kN", false);
                }, ApplyChangesToValue: (e) => {
                    this.Thrust = Unit.Parse(e.value, "kN");
                }
            }, AtmIsp: {
                ApplyValueToDisplayElement: (e) => {
                    e.innerHTML = Unit.Display(this.AtmIsp, "s", true);
                }, ApplyValueToEditElement: (e) => {
                    e.value = Unit.Display(this.AtmIsp, "s", true);
                }, ApplyChangesToValue: (e) => {
                    this.AtmIsp = Unit.Parse(e.value, "s");
                }
            }, VacIsp: {
                ApplyValueToDisplayElement: (e) => {
                    e.innerHTML = Unit.Display(this.VacIsp, "s", true);
                }, ApplyValueToEditElement: (e) => {
                    e.value = Unit.Display(this.VacIsp, "s", true);
                }, ApplyChangesToValue: (e) => {
                    this.VacIsp = Unit.Parse(e.value, "s");
                }
            }, Cost: {
                ApplyValueToDisplayElement: (e) => {
                    e.innerHTML = Unit.Display(this.Cost, " VF", false);
                }, ApplyValueToEditElement: (e) => {
                    e.value = Unit.Display(this.Cost, " VF", false);
                }, ApplyChangesToValue: (e) => {
                    this.Cost = Unit.Parse(e.value, " VF");
                }
            }, EntryCost: {
                ApplyValueToDisplayElement: (e) => {
                    e.innerHTML = Unit.Display(this.EntryCost, " VF", false);
                }, ApplyValueToEditElement: (e) => {
                    e.value = Unit.Display(this.EntryCost, " VF", false);
                }, ApplyChangesToValue: (e) => {
                    this.EntryCost = Unit.Parse(e.value, " VF");
                }
            }, MinThrust: {
                ApplyValueToDisplayElement: (e) => {
                    e.innerHTML = `${this.MinThrust}%`;
                }
            }, AlternatorPower: {
                ApplyValueToDisplayElement: (e) => {
                    e.innerHTML = Unit.Display(this.AlternatorPower, "kW", false);
                }, ApplyValueToEditElement: (e) => {
                    e.value = Unit.Display(this.AlternatorPower, "kW", false);
                }, ApplyChangesToValue: (e) => {
                    this.AlternatorPower = Unit.Parse(e.value, "kW");
                }
            }, Ignitions: {
                ApplyValueToDisplayElement: (e) => {
                    e.innerHTML = this.Ignitions <= 0 ? "Infinite" : this.Ignitions.toString();
                }, ApplyChangesToValue: (e) => {
                    this.Ignitions = parseInt(e.value);
                }
            }, TechUnlockNode: {
                ApplyValueToDisplayElement: (e) => {
                    e.innerHTML = TechNode[this.TechUnlockNode];
                }, GetEditElement: () => {
                    let tmp = document.createElement("input");
                    tmp.classList.add("content-cell-content");
                    tmp.setAttribute("list", "techNodeItems");
                    return tmp;
                }, ApplyValueToEditElement: (e) => {
                    e.value = TechNode[this.TechUnlockNode];
                }, ApplyChangesToValue: (e) => {
                    let value = parseInt(TechNode[e.value]);
                    value = isNaN(value) ? 0 : value;
                    this.TechUnlockNode = value;
                }
            }, EngineVariant: {
                ApplyValueToDisplayElement: (e) => {
                    e.innerHTML = EngineType[this.EngineVariant];
                }, GetEditElement: () => {
                    let tmp = document.createElement("select");
                    tmp.classList.add("content-cell-content");
                    for (let i in EngineType) {
                        let x = parseInt(i);
                        if (isNaN(x)) {
                            break;
                        }
                        let option = document.createElement("option");
                        option.value = x.toString();
                        option.text = EngineType[x];
                        tmp.options.add(option);
                    }
                    return tmp;
                }
            }, ThrustCurve: {
                ApplyValueToDisplayElement: (e) => {
                    e.innerHTML = this.ThrustCurve.length > 0 ? "Custom" : "Default";
                }, GetEditElement: () => {
                    let tmp = document.createElement("div");
                    tmp.classList.add("content-cell-content");
                    tmp.style.height = "153px";
                    tmp.style.padding = "0";
                    let grid = document.createElement("div");
                    grid.style.display = "grid";
                    grid.style.gridTemplateColumns = "24px 24px 24px auto";
                    grid.style.gridTemplateRows = "24px 129px";
                    grid.style.gridTemplateAreas = `
                    "a b c d"
                    "e e e e"
                `;
                    grid.innerHTML = `
                    <div style="grid-area: a;"><img class="mini-button option-button" title="Add new entry" src="img/button/add-mini.png"></div>
                    <div style="grid-area: b;"><img class="mini-button option-button" title="Remove last entry" src="img/button/remove-mini.png"></div>
                    <div style="grid-area: c;"><img class="mini-button option-button" title="Sort entries by Fuel% (Descending)" src="img/button/sort-mini.png"></div>
                    <div class="content-cell-content" style="grid-area: d;"></div>
                    <div class="content-cell-content" style="grid-area: e; overflow: auto;"><table><tr><th style="width: 50%;">Fuel%</th><th style="width: 50%;">Thrust%</th></tr></table></div>
                `;
                    let table = grid.querySelector("tbody");
                    let imgs = grid.querySelectorAll("img");
                    imgs[0].addEventListener("click", () => {
                        let tr = document.createElement("tr");
                        tr.innerHTML = `
                        <td><input style="width: calc(100%);" value="0"></td>
                        <td><input style="width: calc(100%);" value="0"></td>
                    `;
                        table.appendChild(tr);
                    });
                    imgs[1].addEventListener("click", () => {
                        let tmp = grid.querySelectorAll("tr");
                        if (tmp.length > 1) {
                            tmp[tmp.length - 1].remove();
                        }
                    });
                    imgs[2].addEventListener("click", () => {
                        let tmpCurve = [];
                        let inputs = tmp.querySelectorAll(`input`);
                        for (let i = 0; i < inputs.length; i += 2) {
                            tmpCurve.push([parseFloat(inputs[i].value.replace(",", ".")), parseFloat(inputs[i + 1].value.replace(",", "."))]);
                        }
                        tmpCurve = tmpCurve.sort((a, b) => {
                            return b[0] - a[0];
                        });
                        let table = tmp.querySelector("tbody");
                        let rows = tmp.querySelectorAll("tr");
                        rows.forEach((v, i) => {
                            if (i != 0) {
                                v.remove();
                            }
                        });
                        tmpCurve.forEach(v => {
                            let tr = document.createElement("tr");
                            tr.innerHTML = `
                            <td><input style="width: calc(100%);" value="${v[0]}"></td>
                            <td><input style="width: calc(100%);" value="${v[1]}"></td>
                        `;
                            table.appendChild(tr);
                        });
                    });
                    tmp.appendChild(grid);
                    return tmp;
                }, ApplyValueToEditElement: (e) => {
                    let table = e.querySelector("tbody");
                    let rows = e.querySelectorAll("tr");
                    this.ThrustCurve = this.ThrustCurve.sort((a, b) => {
                        return b[0] - a[0];
                    });
                    rows.forEach((v, i) => {
                        if (i != 0) {
                            v.remove();
                        }
                    });
                    this.ThrustCurve.forEach(v => {
                        let tr = document.createElement("tr");
                        tr.innerHTML = `
                        <td><input style="width: calc(100%);" value="${v[0]}"></td>
                        <td><input style="width: calc(100%);" value="${v[1]}"></td>
                    `;
                        table.appendChild(tr);
                    });
                }, ApplyChangesToValue: (e) => {
                    let inputs = e.querySelectorAll(`input`);
                    this.ThrustCurve = [];
                    for (let i = 0; i < inputs.length; i += 2) {
                        this.ThrustCurve.push([parseFloat(inputs[i].value.replace(",", ".")), parseFloat(inputs[i + 1].value.replace(",", "."))]);
                    }
                    this.ThrustCurve = this.ThrustCurve.sort((a, b) => {
                        return b[0] - a[0];
                    });
                },
            }, Dimensions: {
                GetDisplayElement: () => {
                    let tmp = document.createElement("div");
                    tmp.classList.add("content-cell-content");
                    return tmp;
                }, ApplyValueToDisplayElement: (e) => {
                    e.innerHTML = `${this.Width}m x ${this.Height}m`;
                }, GetEditElement: () => {
                    let tmp = document.createElement("div");
                    tmp.classList.add("content-cell-content");
                    tmp.style.height = "75px";
                    tmp.style.padding = "0";
                    let grid = document.createElement("div");
                    grid.style.display = "grid";
                    grid.style.gridTemplateColumns = "62px auto 24px";
                    grid.style.gridTemplateRows = "24px 24px 24px";
                    grid.style.gridTemplateAreas = `
                    "a a a"
                    "b c d"
                    "e f g"
                `;
                    grid.innerHTML = `
                    <div class="content-cell-content" style="grid-area: a;"></div>
                    <div class="content-cell-content" style="grid-area: b;">Width</div>
                    <div style="grid-area: c;"><input style="width: calc(100%);"></div>
                    <div class="content-cell-content" style="grid-area: d;">m</div>
                    <div class="content-cell-content" style="grid-area: e;">Height</div>
                    <div style="grid-area: f;"><input style="width: calc(100%);"></div>
                    <div class="content-cell-content" style="grid-area: g;">m</div>
                `;
                    let checkboxLabel = document.createElement("span");
                    let checkbox = document.createElement("input");
                    checkboxLabel.style.position = "relative";
                    checkboxLabel.style.top = "-4px";
                    checkboxLabel.style.left = "4px";
                    checkbox.type = "checkbox";
                    checkbox.addEventListener("change", e => {
                        checkboxLabel.innerHTML = checkbox.checked ? "Base width" : "Bell width";
                    });
                    grid.children[0].appendChild(checkbox);
                    grid.children[0].appendChild(checkboxLabel);
                    tmp.appendChild(grid);
                    return tmp;
                }, ApplyValueToEditElement: (e) => {
                    let inputs = e.querySelectorAll("input");
                    inputs[0].checked = this.UseBaseWidth;
                    inputs[1].value = this.Width.toString();
                    inputs[2].value = this.Height.toString();
                    e.querySelector("span").innerHTML = inputs[0].checked ? "Base width" : "Bell width";
                }, ApplyChangesToValue: (e) => {
                    let inputs = e.querySelectorAll("input");
                    this.UseBaseWidth = inputs[0].checked;
                    this.Width = parseFloat(inputs[1].value.replace(",", "."));
                    this.Height = parseFloat(inputs[2].value.replace(",", "."));
                }
            }, FuelRatios: {
                GetDisplayElement: () => {
                    let tmp = document.createElement("div");
                    tmp.classList.add("content-cell-content");
                    return tmp;
                }, ApplyValueToDisplayElement: (e) => {
                    let fuels = [];
                    let electric = 0;
                    let output = "";
                    this.FuelRatioItems.forEach(v => {
                        if (v[0] == Fuel.ElectricCharge) {
                            electric = v[1];
                        }
                        else {
                            fuels.push(v);
                        }
                    });
                    if (fuels.length == 0) {
                        output += "Not set";
                    }
                    else if (fuels.length == 1) {
                        output += FuelInfo.GetFuelInfo(fuels[0][0]).FuelName;
                    }
                    else {
                        let ratios = "";
                        let names = "";
                        fuels.forEach(v => {
                            ratios += `${v[1]}:`;
                            names += `${FuelInfo.GetFuelInfo(v[0]).FuelName}:`;
                        });
                        ratios = ratios.substring(0, ratios.length - 1);
                        names = names.substring(0, names.length - 1);
                        output += `${ratios} ${names}`;
                    }
                    if (electric > 0) {
                        output += ` | Electric: ${electric}kW`;
                    }
                    e.innerHTML = output;
                }, GetEditElement: () => {
                    let tmp = document.createElement("div");
                    tmp.classList.add("content-cell-content");
                    tmp.style.height = "129px";
                    tmp.style.padding = "0";
                    let grid = document.createElement("div");
                    grid.style.display = "grid";
                    grid.style.gridTemplateColumns = "24px 24px auto";
                    grid.style.gridTemplateRows = "24px 105px";
                    grid.style.gridTemplateAreas = `
                    "a b c"
                    "d d d"
                `;
                    grid.innerHTML = `
                    <div style="grid-area: a;"><img class="mini-button option-button" title="Add new propellant to the list" src="img/button/add-mini.png"></div>
                    <div style="grid-area: b;"><img class="mini-button option-button" title="Remove last propellant from list" src="img/button/remove-mini.png"></div>
                    <div class="content-cell-content" style="grid-area: c;"></div>
                    <div class="content-cell-content" style="grid-area: d; overflow: auto;"><table><tr><th style="width: 65%;">Fuel</th><th style="width: 35%;">Ratio</th></tr></table></div>
                `;
                    let table = grid.querySelector("tbody");
                    let imgs = grid.querySelectorAll("img");
                    imgs[0].addEventListener("click", () => {
                        let tr = document.createElement("tr");
                        let select = FuelInfo.Dropdown.cloneNode(true);
                        select.querySelector(`option[value="${Fuel.Hydrazine}"]`).selected = true;
                        tr.innerHTML = `
                        <td></td>
                        <td><input style="width: calc(100%);" value="1"></td>
                    `;
                        tr.children[0].appendChild(select);
                        table.appendChild(tr);
                    });
                    imgs[1].addEventListener("click", () => {
                        let tmp = grid.querySelectorAll("tr");
                        if (tmp.length > 1) {
                            tmp[tmp.length - 1].remove();
                        }
                    });
                    let checkboxLabel = document.createElement("span");
                    let checkbox = document.createElement("input");
                    checkboxLabel.style.position = "relative";
                    checkboxLabel.style.top = "-4px";
                    checkboxLabel.style.left = "4px";
                    checkbox.type = "checkbox";
                    checkbox.addEventListener("change", e => {
                        checkboxLabel.innerHTML = checkbox.checked ? "Volume ratio" : "Mass ratio";
                    });
                    grid.children[2].appendChild(checkbox);
                    grid.children[2].appendChild(checkboxLabel);
                    tmp.appendChild(grid);
                    return tmp;
                }, ApplyValueToEditElement: (e) => {
                    e.querySelector(`input[type="checkbox"]`).checked = this.FuelVolumeRatios;
                    let table = e.querySelector("tbody");
                    let rows = e.querySelectorAll("tr");
                    rows.forEach((v, i) => {
                        if (i != 0) {
                            v.remove();
                        }
                    });
                    this.FuelRatioItems.forEach(v => {
                        let tr = document.createElement("tr");
                        let select = FuelInfo.Dropdown.cloneNode(true);
                        select.querySelector(`option[value="${v[0]}"]`).selected = true;
                        tr.innerHTML = `
                        <td></td>
                        <td><input style="width: calc(100%);" value="${v[1]}"></td>
                    `;
                        tr.children[0].appendChild(select);
                        table.appendChild(tr);
                    });
                    e.querySelector("span").innerHTML = this.FuelVolumeRatios ? "Volume ratio" : "Mass ratio";
                }, ApplyChangesToValue: (e) => {
                    let selects = e.querySelectorAll("select");
                    let inputs = e.querySelectorAll(`input`);
                    this.FuelVolumeRatios = inputs[0].checked;
                    if (selects.length + 1 != inputs.length) {
                        console.warn("table misaligned?");
                    }
                    this.FuelRatioItems = [];
                    for (let i = 0; i < selects.length; ++i) {
                        this.FuelRatioItems.push([parseInt(selects[i].value), parseFloat(inputs[i + 1].value.replace(",", "."))]);
                    }
                }
            }, Gimbal: {
                GetDisplayElement: () => {
                    let tmp = document.createElement("div");
                    tmp.classList.add("content-cell-content");
                    return tmp;
                }, ApplyValueToDisplayElement: (e) => {
                    if (this.AdvancedGimbal) {
                        e.innerHTML = `X:<-${this.GimbalNX}°:${this.GimbalPX}°>, Y:<-${this.GimbalNY}°:${this.GimbalPY}°>`;
                    }
                    else {
                        e.innerHTML = `${this.Gimbal}°`;
                    }
                }, GetEditElement: () => {
                    let tmp = document.createElement("div");
                    tmp.classList.add("content-cell-content");
                    tmp.style.height = "75px";
                    tmp.style.padding = "0";
                    tmp.innerHTML = `
                    <div class="content-cell-content" style="height: 24px"></div>
                `;
                    let baseDiv = document.createElement("div");
                    let advDiv = document.createElement("div");
                    let checkbox = document.createElement("input");
                    let checkboxLabel = document.createElement("span");
                    tmp.appendChild(baseDiv);
                    tmp.appendChild(advDiv);
                    checkbox.setAttribute("data-ref", "checkbox");
                    checkbox.type = "checkbox";
                    checkbox.addEventListener("change", (e) => {
                        if (checkbox.checked) {
                            baseDiv.style.display = "none";
                            advDiv.style.display = "grid";
                        }
                        else {
                            baseDiv.style.display = "grid";
                            advDiv.style.display = "none";
                        }
                    });
                    checkboxLabel.style.position = "relative";
                    checkboxLabel.style.top = "-4px";
                    checkboxLabel.style.left = "4px";
                    checkboxLabel.innerHTML = "Advanced gimbal";
                    tmp.children[0].appendChild(checkbox);
                    tmp.children[0].appendChild(checkboxLabel);
                    baseDiv.setAttribute("data-ref", "basediv");
                    baseDiv.style.display = "grid";
                    baseDiv.style.gridTemplateColumns = "94px auto 3px";
                    baseDiv.style.gridTemplateRows = "24px";
                    baseDiv.style.gridTemplateAreas = `
                    "a b c"
                `;
                    baseDiv.innerHTML = `
                    <div class="content-cell-content" style="grid-area: a;">Gimbal (°)</div>
                    <div style="grid-area: b;"><input data-ref="gimbal" style="width: calc(100%);"></div>
                `;
                    advDiv.setAttribute("data-ref", "advdiv");
                    advDiv.style.display = "grid";
                    advDiv.style.gridTemplateColumns = "114px auto auto 3px";
                    advDiv.style.gridTemplateRows = "24px 24px";
                    advDiv.style.gridTemplateAreas = `
                    "a b c d"
                    "e f g h"
                `;
                    advDiv.innerHTML = `
                    <div class="content-cell-content" style="grid-area: a;">X axis (-|+)°</div>
                    <div style="grid-area: b;"><input data-ref="gimbalnx" style="width: calc(100%);"></div>
                    <div style="grid-area: c;"><input data-ref="gimbalpx" style="width: calc(100%);"></div>
                    
                    <div class="content-cell-content" style="grid-area: e;">Y axis (-|+)°</div>
                    <div style="grid-area: f;"><input data-ref="gimbalny" style="width: calc(100%);"></div>
                    <div style="grid-area: g;"><input data-ref="gimbalpy" style="width: calc(100%);"></div>
                `;
                    return tmp;
                }, ApplyValueToEditElement: (e) => {
                    e.querySelector(`input[data-ref="checkbox"]`).checked = this.AdvancedGimbal;
                    e.querySelector(`input[data-ref="gimbal"]`).value = this.Gimbal.toString();
                    e.querySelector(`input[data-ref="gimbalnx"]`).value = this.GimbalNX.toString();
                    e.querySelector(`input[data-ref="gimbalpx"]`).value = this.GimbalPX.toString();
                    e.querySelector(`input[data-ref="gimbalny"]`).value = this.GimbalNY.toString();
                    e.querySelector(`input[data-ref="gimbalpy"]`).value = this.GimbalPY.toString();
                    if (this.AdvancedGimbal) {
                        e.querySelector(`div[data-ref="basediv"]`).style.display = "none";
                        e.querySelector(`div[data-ref="advdiv"]`).style.display = "grid";
                    }
                    else {
                        e.querySelector(`div[data-ref="basediv"]`).style.display = "grid";
                        e.querySelector(`div[data-ref="advdiv"]`).style.display = "none";
                    }
                }, ApplyChangesToValue: (e) => {
                    this.AdvancedGimbal = e.querySelector(`input[data-ref="checkbox"]`).checked;
                    this.Gimbal = parseFloat(e.querySelector(`input[data-ref="gimbal"]`).value.replace(",", "."));
                    this.GimbalPX = parseFloat(e.querySelector(`input[data-ref="gimbalpx"]`).value.replace(",", "."));
                    this.GimbalNY = parseFloat(e.querySelector(`input[data-ref="gimbalny"]`).value.replace(",", "."));
                    this.GimbalPY = parseFloat(e.querySelector(`input[data-ref="gimbalpy"]`).value.replace(",", "."));
                    this.GimbalNX = parseFloat(e.querySelector(`input[data-ref="gimbalnx"]`).value.replace(",", "."));
                }
            }, Labels: {
                GetDisplayElement: () => {
                    let tmp = document.createElement("div");
                    tmp.classList.add("content-cell-content");
                    return tmp;
                }, ApplyValueToDisplayElement: (e) => {
                    if (this.EngineName == "") {
                        e.innerHTML = `<<< Same as ID`;
                    }
                    else {
                        e.innerHTML = `${this.EngineName}`;
                    }
                }, GetEditElement: () => {
                    let tmp = document.createElement("div");
                    tmp.classList.add("content-cell-content");
                    tmp.style.height = "192px";
                    tmp.style.padding = "0";
                    let grid = document.createElement("div");
                    grid.style.display = "grid";
                    grid.style.gridTemplateColumns = "116px auto";
                    grid.style.gridTemplateRows = "24px 24px 24px 120px";
                    grid.style.gridTemplateAreas = `
                    "a b"
                    "c d"
                    "e e"
                    "f f"
                `;
                    grid.innerHTML = `
                    <div class="content-cell-content" style="grid-area: a;">Name</div>
                    <div style="grid-area: b;"><input style="width: calc(100%);"></div>
                    
                    <div class="content-cell-content" style="grid-area: c;">Manufacturer</div>
                    <div style="grid-area: d;"><input style="width: calc(100%);"></div>
                    
                    <div class="content-cell-content" style="grid-area: e;">Description</div>
                    <div style="grid-area: f;"><textarea style="resize: none; width: calc(100%); height: 100%;"></textarea></div>
                `;
                    tmp.appendChild(grid);
                    return tmp;
                }, ApplyValueToEditElement: (e) => {
                    let inputs = e.querySelectorAll("input");
                    inputs[0].value = this.EngineName;
                    inputs[1].value = this.EngineManufacturer;
                    inputs[0].disabled = this.PolyType == PolymorphismType.MultiConfigSlave;
                    inputs[1].disabled = this.PolyType == PolymorphismType.MultiConfigSlave;
                    e.querySelector("textarea").value = this.EngineDescription;
                }, ApplyChangesToValue: (e) => {
                    let inputs = e.querySelectorAll("input");
                    this.EngineName = inputs[0].value;
                    this.EngineManufacturer = inputs[1].value;
                    this.EngineDescription = e.querySelector("textarea").value;
                }
            }, Polymorphism: {
                GetDisplayElement: () => {
                    let tmp = document.createElement("div");
                    tmp.classList.add("content-cell-content");
                    return tmp;
                }, ApplyValueToDisplayElement: (e) => {
                    switch (this.PolyType) {
                        case PolymorphismType.Single:
                            e.innerHTML = `Single`;
                            break;
                        case PolymorphismType.MultiModeMaster:
                            e.innerHTML = `Multimode master`;
                            break;
                        case PolymorphismType.MultiModeSlave:
                            e.innerHTML = `Multimode slave to ${this.MasterEngineName}`;
                            break;
                        case PolymorphismType.MultiConfigMaster:
                            e.innerHTML = `Multiconfig master`;
                            break;
                        case PolymorphismType.MultiConfigSlave:
                            e.innerHTML = `Multiconfig slave to ${this.MasterEngineName}`;
                            break;
                    }
                }, GetEditElement: () => {
                    let tmp = document.createElement("div");
                    tmp.classList.add("content-cell-content");
                    tmp.style.height = "48px";
                    tmp.style.padding = "0";
                    let grid = document.createElement("div");
                    grid.style.display = "grid";
                    grid.style.gridTemplateColumns = "auto";
                    grid.style.gridTemplateRows = "24px 24px";
                    grid.style.gridTemplateAreas = `
                    "a"
                    "b"
                `;
                    grid.innerHTML = `
                    <div style="grid-area: a;">${Engine.PolymorphismTypeDropdown.outerHTML}</div>
                    <div style="grid-area: b;"><select></select></div>
                `;
                    let selects = grid.querySelectorAll("select");
                    selects[0].addEventListener("change", () => {
                        this.RebuildMasterSelect(tmp);
                    });
                    tmp.appendChild(grid);
                    return tmp;
                }, ApplyValueToEditElement: (e) => {
                    let selects = e.querySelectorAll("select");
                    selects[0].value = this.PolyType.toString();
                    this.RebuildMasterSelect(e);
                }, ApplyChangesToValue: (e) => {
                    let selects = e.querySelectorAll("select");
                    this.PolyType = parseInt(selects[0].value);
                    this.MasterEngineName = selects[1].value;
                    this.RehidePolyFields(this.ListCols);
                }
            }, Tank: {
                GetDisplayElement: () => {
                    let tmp = document.createElement("div");
                    tmp.classList.add("content-cell-content");
                    return tmp;
                }, ApplyValueToDisplayElement: (e) => {
                    let output = "";
                    if (this.UseTanks) {
                        if (this.LimitTanks) {
                            if (this.TanksVolume == 0) {
                                output = "Enabled, but empty";
                            }
                            else {
                                let usedVolume = 0;
                                this.TanksContents.forEach(v => {
                                    usedVolume += v[1] / FuelInfo.GetFuelInfo(v[0]).TankUtilisation;
                                });
                                usedVolume = Math.min(usedVolume, this.TanksVolume);
                                output = `Enabled, ${usedVolume}L/${this.TanksVolume}L`;
                            }
                        }
                        else {
                            if (this.TanksContents.length == 0) {
                                output = "Enabled, but empty";
                            }
                            else {
                                let usedVolume = 0;
                                this.TanksContents.forEach(v => {
                                    usedVolume += v[1] / FuelInfo.GetFuelInfo(v[0]).TankUtilisation;
                                });
                                output = `Enabled, ${usedVolume}L`;
                            }
                        }
                    }
                    else {
                        output = "Disabled";
                    }
                    e.innerHTML = output;
                }, GetEditElement: () => {
                    let tmp = document.createElement("div");
                    tmp.classList.add("content-cell-content");
                    tmp.style.height = "225px";
                    tmp.style.padding = "0";
                    tmp.innerHTML = `
                    <div class="content-cell-content" style="height: 24px;"><input type="checkbox"><span style="position: relative; left: 4px; top: -4px;">Add tank</span></div>
                `;
                    let grid = document.createElement("div");
                    grid.style.display = "grid";
                    grid.style.gridTemplateColumns = "24px 24px auto 3px";
                    grid.style.gridTemplateRows = "24px 24px 24px 24px 105px";
                    grid.style.gridTemplateAreas = `
                    "c c c z"
                    "d e e z"
                    "f f f z"
                    "g h i z"
                    "j j j j"
                `;
                    tmp.querySelector("input").addEventListener("change", () => {
                        grid.style.display = tmp.querySelector("input").checked ? "grid" : "none";
                    });
                    grid.innerHTML = `
                    <div class="content-cell-content" style="grid-area: c; padding-top: 4px;">Limit tank volume (L)</div>
                    
                    <div class="content-cell-content" style="grid-area: d"><input type="checkbox"></div>
                    <div style="grid-area: e; padding-top: 1px;"><input style="width: calc(100%);"></div>
                    
                    <div class="content-cell-content" style="grid-area:f; padding-top: 4px;">Estimated tank volume: <span></span></div>
                    
                    <div style="grid-area: g;"><img class="mini-button option-button" title="Add new propellant to the list" src="img/button/add-mini.png"></div>
                    <div style="grid-area: h;"><img class="mini-button option-button" title="Remove last propellant from list" src="img/button/remove-mini.png"></div>
                    <div class="content-cell-content" style="grid-area: j; overflow: auto;"><table><tr><th style="width: 35%;">Fuel</th><th style="width: 35%;">Volume (L)</th><th style="width: 30%;">Mass (t)</th></tr></table></div>
                `;
                    let inputs = grid.querySelectorAll("input");
                    inputs[0].addEventListener("change", () => {
                        inputs[1].disabled = !inputs[0].checked;
                    });
                    let table = grid.querySelector("tbody");
                    let imgs = grid.querySelectorAll("img");
                    imgs[0].addEventListener("click", () => {
                        let tr = document.createElement("tr");
                        let select = FuelInfo.Dropdown.cloneNode(true);
                        select.querySelector(`option[value="${Fuel.Hydrazine}"]`).selected = true;
                        tr.innerHTML = `
                        <td></td>
                        <td><input style="width: calc(100%);" value="1"></td>
                        <td><input style="width: calc(100%);" value="${1 * FuelInfo.GetFuelInfo(Fuel.Hydrazine).Density}"></td>
                    `;
                        let inputs = tr.querySelectorAll("input");
                        select.addEventListener("change", () => {
                            inputs[1].value = (parseFloat(inputs[0].value.replace(",", ".")) * FuelInfo.GetFuelInfo(parseInt(select.value)).Density).toString();
                        });
                        inputs[0].addEventListener("keydown", (e) => {
                            setTimeout(() => {
                                inputs[1].value = (parseFloat(inputs[0].value.replace(",", ".")) * FuelInfo.GetFuelInfo(parseInt(select.value)).Density).toString();
                            }, 10);
                        });
                        inputs[1].addEventListener("keydown", (e) => {
                            setTimeout(() => {
                                inputs[0].value = (parseFloat(inputs[1].value.replace(",", ".")) / FuelInfo.GetFuelInfo(parseInt(select.value)).Density).toString();
                            }, 10);
                        });
                        tr.children[0].appendChild(select);
                        table.appendChild(tr);
                    });
                    imgs[1].addEventListener("click", () => {
                        let tmp = grid.querySelectorAll("tr");
                        if (tmp.length > 1) {
                            tmp[tmp.length - 1].remove();
                        }
                    });
                    tmp.appendChild(grid);
                    return tmp;
                }, ApplyValueToEditElement: (e) => {
                    let allInputs = e.querySelectorAll(`input`);
                    allInputs[0].checked = this.UseTanks;
                    allInputs[1].checked = this.LimitTanks;
                    allInputs[2].value = this.TanksVolume.toString();
                    e.querySelectorAll("span")[1].innerHTML = `${this.GetTankSizeEstimate()}L`;
                    e.children[1].style.display = this.UseTanks ? "grid" : "none";
                    allInputs[2].disabled = !this.LimitTanks;
                    let table = e.querySelector("tbody");
                    let rows = e.querySelectorAll("tr");
                    rows.forEach((v, i) => {
                        if (i != 0) {
                            v.remove();
                        }
                    });
                    this.TanksContents.forEach(v => {
                        let tr = document.createElement("tr");
                        let select = FuelInfo.Dropdown.cloneNode(true);
                        select.querySelector(`option[value="${v[0]}"]`).selected = true;
                        tr.innerHTML = `
                        <td></td>
                        <td><input style="width: calc(100%);" value="${v[1]}"></td>
                        <td><input style="width: calc(100%);" value="${v[1] * FuelInfo.GetFuelInfo(v[0]).Density}"></td>
                    `;
                        let inputs = tr.querySelectorAll("input");
                        select.addEventListener("change", () => {
                            inputs[1].value = (parseFloat(inputs[0].value.replace(",", ".")) * FuelInfo.GetFuelInfo(parseInt(select.value)).Density).toString();
                        });
                        inputs[0].addEventListener("keydown", (e) => {
                            setTimeout(() => {
                                inputs[1].value = (parseFloat(inputs[0].value.replace(",", ".")) * FuelInfo.GetFuelInfo(parseInt(select.value)).Density).toString();
                            }, 10);
                        });
                        inputs[1].addEventListener("keydown", (e) => {
                            setTimeout(() => {
                                inputs[0].value = (parseFloat(inputs[1].value.replace(",", ".")) / FuelInfo.GetFuelInfo(parseInt(select.value)).Density).toString();
                            }, 10);
                        });
                        tr.children[0].appendChild(select);
                        table.appendChild(tr);
                    });
                }, ApplyChangesToValue: (e) => {
                    let selects = e.querySelectorAll("select");
                    let inputs = e.querySelector("table").querySelectorAll(`input`);
                    let allInputs = e.querySelectorAll(`input`);
                    this.UseTanks = allInputs[0].checked;
                    this.LimitTanks = allInputs[1].checked;
                    this.TanksVolume = parseFloat(allInputs[2].value.replace(",", "."));
                    if (selects.length != inputs.length) {
                        console.warn("table misaligned?");
                    }
                    this.TanksContents = [];
                    for (let i = 0; i < selects.length; ++i) {
                        this.TanksContents.push([parseInt(selects[i].value), parseFloat(inputs[2 * i].value.replace(",", "."))]);
                    }
                }
            }, TestFlight: {
                GetDisplayElement: () => {
                    let tmp = document.createElement("div");
                    tmp.classList.add("content-cell-content");
                    return tmp;
                }, ApplyValueToDisplayElement: (e) => {
                    if (this.EnableTestFlight) {
                        e.innerHTML = `Enabled | ${this.StartReliability0}% - ${this.StartReliability10k}% | ${Math.round((1 / (1 - (this.CycleReliability0 / 100))) * this.RatedBurnTime)}s - ${Math.round((1 / (1 - (this.CycleReliability10k / 100))) * this.RatedBurnTime)}s`;
                    }
                    else {
                        if (this.IsTestFlightDefault()) {
                            e.innerHTML = `Disabled`;
                        }
                        else {
                            e.innerHTML = `Disabled, but configured`;
                        }
                    }
                }, GetEditElement: () => {
                    let tmp = document.createElement("div");
                    tmp.classList.add("content-cell-content");
                    tmp.style.height = "147px";
                    tmp.style.padding = "0";
                    tmp.innerHTML = `
                    <div class="content-cell-content" style="height: 24px;"><input type="checkbox"><span style="position: relative; left: 4px; top: -4px;">Enable Test Flight</span></div>
                `;
                    let grid = document.createElement("div");
                    grid.style.display = "grid";
                    grid.style.gridTemplateColumns = "310px auto 26px";
                    grid.style.gridTemplateRows = "24px 24px 24px 24px 24px";
                    grid.style.gridTemplateAreas = `
                    "c d e"
                    "f g h"
                    "i j k"
                    "l m n"
                    "o p q"
                `;
                    let checkbox = tmp.querySelector("input");
                    checkbox.addEventListener("change", () => {
                        grid.style.display = checkbox.checked ? "grid" : "none";
                    });
                    grid.innerHTML = `
                    <div class="content-cell-content" style="grid-area: c;">Rated burn time</div>
                    <div style="grid-area: d;"><input style="width: calc(100%);"></div>
                    <div class="content-cell-content" style="grid-area: e;">s</div>
                    
                    <div class="content-cell-content" style="grid-area: f;">Ignition success chance (0% data)</div>
                    <div style="grid-area: g;"><input style="width: calc(100%);"></div>
                    <div class="content-cell-content" style="grid-area: h;">%</div>
                    
                    <div class="content-cell-content" style="grid-area: i;">Ignition success chance (100% data)</div>
                    <div style="grid-area: j;"><input style="width: calc(100%);"></div>
                    <div class="content-cell-content" style="grid-area: k;">%</div>
                    
                    <div class="content-cell-content" style="grid-area: l;">Burn cycle reliability (0% data)</div>
                    <div style="grid-area: m;"><input style="width: calc(100%);"></div>
                    <div class="content-cell-content" style="grid-area: n;">%</div>
                    
                    <div class="content-cell-content" style="grid-area: o;">Burn cycle reliability (100% data)</div>
                    <div style="grid-area: p;"><input style="width: calc(100%);"></div>
                    <div class="content-cell-content" style="grid-area: q;">%</div>
                `;
                    tmp.appendChild(grid);
                    return tmp;
                }, ApplyValueToEditElement: (e) => {
                    let inputs = e.querySelectorAll("input");
                    e.children[1].style.display = this.EnableTestFlight ? "grid" : "none";
                    inputs[0].checked = this.EnableTestFlight;
                    inputs[1].value = this.RatedBurnTime.toString();
                    inputs[2].value = this.StartReliability0.toString();
                    inputs[3].value = this.StartReliability10k.toString();
                    inputs[4].value = this.CycleReliability0.toString();
                    inputs[5].value = this.CycleReliability10k.toString();
                }, ApplyChangesToValue: (e) => {
                    let inputs = e.querySelectorAll("input");
                    this.EnableTestFlight = inputs[0].checked;
                    this.RatedBurnTime = parseInt(inputs[1].value);
                    this.StartReliability0 = parseFloat(inputs[2].value.replace(",", "."));
                    this.StartReliability10k = parseFloat(inputs[3].value.replace(",", "."));
                    this.CycleReliability0 = parseFloat(inputs[4].value.replace(",", "."));
                    this.CycleReliability10k = parseFloat(inputs[5].value.replace(",", "."));
                }
            }, Visuals: {
                GetDisplayElement: () => {
                    let tmp = document.createElement("div");
                    tmp.classList.add("content-cell-content");
                    return tmp;
                }, ApplyValueToDisplayElement: (e) => {
                    e.innerHTML = `${ModelInfo.GetModelInfo(this.ModelID).ModelName}, ${PlumeInfo.GetPlumeInfo(this.PlumeID).PlumeName}`;
                }, GetEditElement: () => {
                    let tmp = document.createElement("div");
                    tmp.classList.add("content-cell-content");
                    tmp.style.height = "48px";
                    tmp.style.padding = "0";
                    let grid = document.createElement("div");
                    grid.style.display = "grid";
                    grid.style.gridTemplateColumns = "60px auto";
                    grid.style.gridTemplateRows = "24px 24px";
                    grid.style.gridTemplateAreas = `
                    "a b"
                    "c d"
                `;
                    grid.innerHTML = `
                    <div class="content-cell-content" style="grid-area: a;">Model</div>
                    <div style="grid-area: b;">${ModelInfo.Dropdown.outerHTML}</div>
                    <div class="content-cell-content" style="grid-area: c;">Plume</div>
                    <div style="grid-area: d;">${PlumeInfo.Dropdown.outerHTML}</div>
                `;
                    tmp.appendChild(grid);
                    return tmp;
                }, ApplyValueToEditElement: (e) => {
                    let selects = e.querySelectorAll("select");
                    selects[0].value = this.ModelID.toString();
                    selects[1].value = this.PlumeID.toString();
                    selects[0].disabled = (this.PolyType == PolymorphismType.MultiConfigSlave ||
                        this.PolyType == PolymorphismType.MultiModeSlave);
                }, ApplyChangesToValue: (e) => {
                    let selects = e.querySelectorAll("select");
                    this.ModelID = parseInt(selects[0].value);
                    this.PlumeID = parseInt(selects[1].value);
                }
            }
        };
        this.ListCols = [];
        this.Active = false;
        this.ID = "New-Engine";
        this.Mass = 1;
        this.Thrust = 1000;
        this.AtmIsp = 250;
        this.VacIsp = 300;
        this.Cost = 1000;
        this.EntryCost = 10000;
        this.MinThrust = 90;
        this.Ignitions = 1;
        this.PressureFed = false;
        this.NeedsUllage = true;
        this.AlternatorPower = 0;
        this.TechUnlockNode = TechNode.start;
        this.EngineVariant = EngineType.Liquid;
        this.ThrustCurve = [];
        this.UseBaseWidth = true;
        this.Width = 1;
        this.Height = 2;
        this.FuelRatioItems = [[Fuel.Hydrazine, 1]];
        this.FuelVolumeRatios = false;
        this.Gimbal = 6;
        this.AdvancedGimbal = false;
        this.GimbalNX = 30;
        this.GimbalPX = 30;
        this.GimbalNY = 0;
        this.GimbalPY = 0;
        this.EngineName = "";
        this.EngineManufacturer = "Generic Engines";
        this.EngineDescription = "This engine was generated by Generic Engines";
        this.PolyType = PolymorphismType.Single;
        this.MasterEngineName = "";
        this.UseTanks = false;
        this.LimitTanks = true;
        this.TanksVolume = 0;
        this.TanksContents = [];
        this.EnableTestFlight = false;
        this.RatedBurnTime = 180;
        this.StartReliability0 = 92;
        this.StartReliability10k = 96;
        this.CycleReliability0 = 90;
        this.CycleReliability10k = 98;
        this.ModelID = Model.LR91;
        this.PlumeID = Plume.Kerolox_Upper;
        this.EngineList = originList;
    }
    GetPlumeConfig() {
        let plumeInfo = PlumeInfo.GetPlumeInfo(this.PlumeID);
        let modelInfo;
        let engine;
        if (this.PolyType == PolymorphismType.MultiConfigSlave || this.PolyType == PolymorphismType.MultiModeSlave) {
            engine = this.EngineList.find(x => x.ID == this.MasterEngineName);
        }
        else {
            engine = this;
        }
        modelInfo = ModelInfo.GetModelInfo(engine.ModelID);
        return `
            @PART[GE-${engine.ID}]:FOR[RealPlume]:HAS[!PLUME[${plumeInfo.PlumeID}]]:NEEDS[SmokeScreen]
            {
                PLUME
                {
                    name = ${plumeInfo.PlumeID}
                    transformName = ${modelInfo.ThrustTransformName}
                    localRotation = 0,0,0
                    localPosition = 0,0,${(modelInfo.PlumePositionOffset + plumeInfo.PositionOffset + plumeInfo.FinalOffset)}
                    fixedScale = ${(modelInfo.PlumeSizeMultiplier * plumeInfo.Scale * engine.Width / (engine.UseBaseWidth ? modelInfo.OriginalBaseWidth : modelInfo.OriginalBellWidth))}
                    flareScale = 0
                    energy = ${(Math.log(engine.Thrust + 5) / Math.log(10) / 3 * plumeInfo.EnergyMultiplier)}
                    speed = ${Math.max((Math.log(engine.VacIsp) / Math.log(2) / 1.5) - 4.5, 0.2)}
                }
            }
        `;
    }
    GetHiddenObjectsConfig() {
        let modelInfo = ModelInfo.GetModelInfo(this.ModelID);
        let output = "";
        modelInfo.HiddenMuObjects.forEach(m => {
            output += `
                MODULE
                {
                    name = ModuleJettison
                    jettisonName = ${m}
                    bottomNodeName = hide
                    isFairing = True
                }
            `;
        });
        return output;
    }
    GetModelConfig() {
        let modelInfo = ModelInfo.GetModelInfo(this.ModelID);
        let heightScale = this.Height / modelInfo.OriginalHeight;
        let widthScale = this.Width / heightScale / (this.UseBaseWidth ? modelInfo.OriginalBaseWidth : modelInfo.OriginalBellWidth);
        let attachmentNode = (modelInfo.RadialAttachment ?
            `node_attach = ${modelInfo.RadialAttachmentPoint * widthScale}, 0.0, 0.0, 1.0, 0.0, 0.0` :
            `node_attach = 0.0, ${modelInfo.NodeStackTop}, 0.0, 0.0, 1.0, 0.0`);
        return `
            MODEL
            {
                model = ${modelInfo.ModelPath}
                ${modelInfo.TextureDefinitions}
                scale = ${widthScale}, 1, ${widthScale}
            }
            scale = 1
            rescaleFactor = ${heightScale}

            node_stack_top = 0.0, ${modelInfo.NodeStackTop}, 0.0, 0.0, 1.0, 0.0, 1
            node_stack_bottom = 0.0, ${modelInfo.NodeStackBottom}, 0.0, 0.0, -1.0, 0.0, 1
            node_stack_hide = 0.0, ${modelInfo.NodeStackBottom + 0.001}, 0.0, 0.0, 0.0, 1.0, 0

            ${attachmentNode}
        `;
    }
    IsTestFlightDefault() {
        let defaultConfig = new Engine();
        return (this.EnableTestFlight == defaultConfig.EnableTestFlight &&
            this.RatedBurnTime == defaultConfig.RatedBurnTime &&
            this.StartReliability0 == defaultConfig.StartReliability0 &&
            this.StartReliability10k == defaultConfig.StartReliability10k &&
            this.CycleReliability0 == defaultConfig.CycleReliability0 &&
            this.CycleReliability10k == defaultConfig.CycleReliability10k);
    }
    GetTestFlightConfig() {
        if (!this.EnableTestFlight ||
            this.PolyType == PolymorphismType.MultiModeMaster ||
            this.PolyType == PolymorphismType.MultiModeSlave) {
            return "";
        }
        else {
            return `
                @PART[*]:HAS[@MODULE[ModuleEngineConfigs]:HAS[@CONFIG[GE-${this.ID}]],!MODULE[TestFlightInterop]]:BEFORE[zTestFlight]
                {
                    TESTFLIGHT
                    {
                        name = GE-${this.ID}
                        ratedBurnTime = ${this.RatedBurnTime}
                        ignitionReliabilityStart = ${this.StartReliability0 / 100}
                        ignitionReliabilityEnd = ${this.StartReliability10k / 100}
                        cycleReliabilityStart = ${this.CycleReliability0 / 100}
                        cycleReliabilityEnd = ${this.CycleReliability10k / 100}
                    }
                }
            `;
        }
    }
    GetTankConfig() {
        if (!this.UseTanks) {
            return "";
        }
        let volume = 0;
        let contents = "";
        let items = this.GetConstrainedTankContents();
        items.forEach(i => {
            volume += i[1];
            let fuelInfo = FuelInfo.GetFuelInfo(i[0]);
            contents += `
                TANK
                {
                    name = ${fuelInfo.FuelID}
                    amount = ${i[1] * fuelInfo.TankUtilisation}
                    maxAmount = ${i[1] * fuelInfo.TankUtilisation}
                }
            `;
        });
        return `
            MODULE
            {
                name = ModuleFuelTanks
                basemass = -1
                type = All
                volume = ${this.LimitTanks ? this.TanksVolume : volume}
                
                ${contents}
                
            }
        `;
    }
    GetTankSizeEstimate() {
        let modelInfo = ModelInfo.GetModelInfo(this.ModelID);
        let output = modelInfo.OriginalTankVolume;
        output *= (Math.pow((this.GetBaseWidth() / modelInfo.OriginalBaseWidth), 2));
        output *= this.Height / modelInfo.OriginalHeight;
        return output;
    }
    GetConstrainedTankContents() {
        if (!this.LimitTanks) {
            return new Array().concat(this.TanksContents);
        }
        let output = [];
        let usedVolume = 0;
        this.TanksContents.forEach(v => {
            let thisVol = Math.min(v[1] / FuelInfo.GetFuelInfo(v[0]).TankUtilisation, this.TanksVolume - usedVolume);
            output.push([v[0], thisVol * FuelInfo.GetFuelInfo(v[0]).TankUtilisation]);
        });
        return output;
    }
    RebuildMasterSelect(e) {
        let selects = e.querySelectorAll("select");
        selects[1].innerHTML = "";
        let option1 = document.createElement("option");
        option1.value = "";
        option1.text = "";
        option1.selected = "" == this.MasterEngineName;
        selects[1].options.add(option1.cloneNode(true));
        if (parseInt(selects[0].value) == PolymorphismType.MultiModeSlave) {
            this.EngineList.filter(x => x.Active && x.PolyType == PolymorphismType.MultiModeMaster).forEach(e => {
                let option = document.createElement("option");
                option.value = `${e.ID}`;
                option.text = e.ID;
                option.selected = e.ID == this.MasterEngineName;
                selects[1].options.add(option);
            });
        }
        else if (parseInt(selects[0].value) == PolymorphismType.MultiConfigSlave) {
            this.EngineList.filter(x => x.Active && x.PolyType == PolymorphismType.MultiConfigMaster).forEach(e => {
                let option = document.createElement("option");
                option.value = `${e.ID}`;
                option.text = e.ID;
                option.selected = e.ID == this.MasterEngineName;
                selects[1].options.add(option);
            });
        }
        else {
        }
    }
    static BuildPolymorphismTypeDropdown() {
        let output = document.createElement("select");
        let option = document.createElement("option");
        option.value = PolymorphismType.Single.toString();
        option.text = "Single";
        output.options.add(option.cloneNode(true));
        option.value = PolymorphismType.MultiModeMaster.toString();
        option.text = "Multimode master";
        output.options.add(option.cloneNode(true));
        option.value = PolymorphismType.MultiModeSlave.toString();
        option.text = "Multimode slave";
        output.options.add(option.cloneNode(true));
        option.value = PolymorphismType.MultiConfigMaster.toString();
        option.text = "Multiconfig master";
        output.options.add(option.cloneNode(true));
        option.value = PolymorphismType.MultiConfigSlave.toString();
        option.text = "Multiconfig slave";
        output.options.add(option.cloneNode(true));
        return output;
    }
    IsManufacturerDefault() {
        let originalConfig = new Engine();
        return this.EngineManufacturer == originalConfig.EngineManufacturer;
    }
    IsDescriptionDefault() {
        let originalConfig = new Engine();
        return this.EngineDescription == originalConfig.EngineDescription;
    }
    IsGimbalDefault() {
        let defaultConfig = new Engine();
        return (this.AdvancedGimbal == defaultConfig.AdvancedGimbal &&
            this.GimbalNX == defaultConfig.GimbalNX &&
            this.GimbalPX == defaultConfig.GimbalPX &&
            this.GimbalNY == defaultConfig.GimbalNY &&
            this.GimbalPY == defaultConfig.GimbalPY);
    }
    GetGimbalConfig() {
        let modelInfo = ModelInfo.GetModelInfo(this.ModelID);
        if (this.AdvancedGimbal) {
            return `
                MODULE
                {
                    name = ModuleGimbal
                    gimbalTransformName = ${modelInfo.GimbalTransformName}
                    gimbalRangeYP = ${this.GimbalPY}
                    gimbalRangeYN = ${this.GimbalNY}
                    gimbalRangeXP = ${this.GimbalPX}
                    gimbalRangeXN = ${this.GimbalNX}
                    useGimbalResponseSpeed = false
                }
            `;
        }
        else {
            return `
                MODULE
                {
                    name = ModuleGimbal
                    gimbalTransformName = ${modelInfo.GimbalTransformName}
                    useGimbalResponseSpeed = false
                    gimbalRange = ${this.Gimbal}
                }
            `;
        }
    }
    GetPropellantConfig() {
        let electricPower = 0;
        let ratios = [];
        this.FuelRatioItems.forEach(i => {
            if (i[0] == Fuel.ElectricCharge) {
                electricPower = i[1];
            }
            else {
                if (this.FuelVolumeRatios) {
                    ratios.push(i);
                }
                else {
                    ratios.push([i[0], i[1] / FuelInfo.GetFuelInfo(i[0]).Density / 1000]);
                }
            }
        });
        if (electricPower > 0) {
            let normalFuelRatios = 0;
            let averageDensity = 0;
            ratios.forEach(r => {
                normalFuelRatios += r[1];
                averageDensity += r[1] * FuelInfo.GetFuelInfo(r[0]).Density;
            });
            averageDensity /= normalFuelRatios;
            let x = this.VacIsp;
            x *= 9.8066;
            x = 1 / x;
            x /= averageDensity;
            x *= this.Thrust;
            electricPower = electricPower * normalFuelRatios / x;
            ratios.push([Fuel.ElectricCharge, electricPower]);
        }
        let output = "";
        let firstPropellant = true;
        ratios.forEach(r => {
            output += `
                PROPELLANT
                {
                    name = ${FuelInfo.GetFuelInfo(r[0]).FuelID}
                    ratio = ${r[1]}
                    DrawGauge = ${firstPropellant}
                }
            `;
            firstPropellant = false;
        });
        return output;
    }
    GetBaseWidth() {
        if (this.UseBaseWidth) {
            return this.Width;
        }
        else {
            let modelInfo = ModelInfo.GetModelInfo(this.ModelID);
            return this.Width * modelInfo.OriginalBaseWidth / modelInfo.OriginalBellWidth;
        }
    }
    RehidePolyFields(cols) {
        if (cols.length == 0) {
            console.warn("Tried to rehide not displayed engine");
            return;
        }
        let x = 0;
        for (let i in Engine.ColumnDefinitions) {
            if (Engine.ColumnDefinitions[i].DisplayFlags != undefined) {
                if ((Engine.ColumnDefinitions[i].DisplayFlags & 1 << this.PolyType) != 0) {
                    cols[x].classList.add("hideCell");
                }
                else {
                    cols[x].classList.remove("hideCell");
                }
            }
            ++x;
        }
    }
    OnTableDraw(e) {
        this.ListCols = e;
        this.RehidePolyFields(e);
    }
    EngineTypeConfig() {
        switch (this.EngineVariant) {
            case EngineType.Liquid:
                return "LiquidFuel";
            case EngineType.Solid:
                return "SolidBooster";
            default:
                return "unknown";
        }
    }
    StagingIconConfig() {
        switch (this.EngineVariant) {
            case EngineType.Liquid:
                return "LIQUID_ENGINE";
            case EngineType.Solid:
                return "SOLID_BOOSTER";
            default:
                return "unknown";
        }
    }
    GetThrustCurveConfig() {
        this.ThrustCurve = this.ThrustCurve.sort((a, b) => {
            return b[0] - a[0];
        });
        if (this.ThrustCurve.length == 0) {
            return "";
        }
        let keys = "";
        let lastTangent = 0;
        let newTangent = 0;
        this.ThrustCurve.push([Number.MIN_VALUE, this.ThrustCurve[this.ThrustCurve.length - 1][1]]);
        for (let i = 0; i < this.ThrustCurve.length - 1; ++i) {
            newTangent = (this.ThrustCurve[i + 1][1] - this.ThrustCurve[i][1]) / (this.ThrustCurve[i + 1][0] - this.ThrustCurve[i][0]);
            keys += `
                key = ${this.ThrustCurve[i][0] / 100} ${this.ThrustCurve[i][1] / 100} ${newTangent} ${lastTangent}
            `;
            lastTangent = newTangent;
        }
        this.ThrustCurve.pop();
        return `
            curveResource = ${FuelInfo.GetFuelInfo(this.FuelRatioItems[0][0]).FuelID}
            thrustCurve
            {
                ${keys}
            }
        `;
    }
    GetAlternatorConfig() {
        if (this.AlternatorPower > 0) {
            return `
                MODULE
                {
                    name = ModuleAlternator
                    RESOURCE
                    {
                        name = ElectricCharge
                        rate = ${this.AlternatorPower}
                    }
                }
            `;
        }
        else {
            return "";
        }
    }
    GetEngineModuleConfig(allEngines) {
        if (this.PolyType == PolymorphismType.MultiModeMaster ||
            this.PolyType == PolymorphismType.MultiModeSlave) {
            return "";
        }
        else {
            return `
                MODULE
                {
                    name = ModuleEngineConfigs
                    configuration = GE-${this.ID}
                    modded = false
                    origMass = ${this.Mass}
                    
                    ${this.GetEngineConfig(allEngines)}
                    
                }
            `;
        }
    }
    GetEngineConfig(allEngines) {
        return `
            CONFIG
            {
                name = GE-${this.ID}
                description = ${this.EngineDescription}
                maxThrust = ${this.Thrust}
                minThrust = ${this.Thrust * this.MinThrust / 100}
                %powerEffectName = ${PlumeInfo.GetPlumeInfo(this.PlumeID).PlumeID}
                heatProduction = 100
                massMult = ${(this.PolyType == PolymorphismType.MultiConfigSlave ? (this.Mass / allEngines[this.MasterEngineName].Mass) : "1")}
                %techRequired = ${TechNode[this.TechUnlockNode]}
                cost = ${(this.PolyType == PolymorphismType.MultiConfigSlave ? this.Cost - allEngines[this.MasterEngineName].Cost : 0)}

                ${this.GetPropellantConfig()}

                atmosphereCurve
                {
                    key = 0 ${this.VacIsp}
                    key = 1 ${this.AtmIsp}
                }

                ${this.GetThrustCurveConfig()}

                ullage = ${this.NeedsUllage && this.EngineVariant != EngineType.Solid}
                pressureFed = ${this.PressureFed}
                ignitions = ${Math.max(this.Ignitions, 0)}
                IGNITOR_RESOURCE
                {
                    name = ElectricCharge
                    amount = 1
                }
            }
        `;
    }
}
Engine.ColumnDefinitions = {
    Active: {
        Name: "Active",
        DefaultWidth: 24,
        DisplayFlags: 0b00000
    }, ID: {
        Name: "ID",
        DefaultWidth: 200,
        DisplayFlags: 0b00000
    }, Labels: {
        Name: "Name",
        DefaultWidth: 300,
        DisplayFlags: 0b00100
    }, Polymorphism: {
        Name: "Polymorphism",
        DefaultWidth: 200,
        DisplayFlags: 0b00000
    }, EngineVariant: {
        Name: "Type",
        DefaultWidth: 80,
        DisplayFlags: 0b10100
    }, Mass: {
        Name: "Mass",
        DefaultWidth: 80,
        DisplayFlags: 0b00100
    }, Thrust: {
        Name: "Vacuum thrust",
        DefaultWidth: 120,
        DisplayFlags: 0b00000
    }, MinThrust: {
        Name: "Minimum thrust",
        DefaultWidth: 60,
        DisplayFlags: 0b00000
    }, AtmIsp: {
        Name: "Sea level Isp",
        DefaultWidth: 80,
        DisplayFlags: 0b00000
    }, VacIsp: {
        Name: "Vacuum Isp",
        DefaultWidth: 80,
        DisplayFlags: 0b00000
    }, PressureFed: {
        Name: "Pressure fed",
        DefaultWidth: 24,
        DisplayFlags: 0b00000
    }, NeedsUllage: {
        Name: "Ullage",
        DefaultWidth: 24,
        DisplayFlags: 0b00000
    }, FuelRatios: {
        Name: "Propellants",
        DefaultWidth: 240,
        DisplayFlags: 0b00000
    }, Ignitions: {
        Name: "Ignitions",
        DefaultWidth: 60,
        DisplayFlags: 0b00110
    }, Visuals: {
        Name: "Visuals",
        DefaultWidth: 240,
        DisplayFlags: 0b00000
    }, Dimensions: {
        Name: "Size",
        DefaultWidth: 160,
        DisplayFlags: 0b10100
    }, Gimbal: {
        Name: "Gimbal",
        DefaultWidth: 240,
        DisplayFlags: 0b10100
    }, TestFlight: {
        Name: "Test flight",
        DefaultWidth: 400,
        DisplayFlags: 0b00110
    }, TechUnlockNode: {
        Name: "R&D unlock node",
        DefaultWidth: 200,
        DisplayFlags: 0b00100
    }, EntryCost: {
        Name: "Entry cost",
        DefaultWidth: 120,
        DisplayFlags: 0b00100
    }, Cost: {
        Name: "Cost",
        DefaultWidth: 100,
        DisplayFlags: 0b00100
    }, AlternatorPower: {
        Name: "Alternator",
        DefaultWidth: 80,
        DisplayFlags: 0b10100
    }, Tank: {
        Name: "Tank",
        DefaultWidth: 320,
        DisplayFlags: 0b10100
    }, ThrustCurve: {
        Name: "Thrust curve",
        DefaultWidth: 200,
        DisplayFlags: 0b00000
    }, Spacer: {
        Name: "",
        DefaultWidth: 200,
        DisplayFlags: 0b00000
    }
};
Engine.PolymorphismTypeDropdown = Engine.BuildPolymorphismTypeDropdown();
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
var Fuel;
(function (Fuel) {
    Fuel[Fuel["ElectricCharge"] = 0] = "ElectricCharge";
    Fuel[Fuel["LqdOxygen"] = 1] = "LqdOxygen";
    Fuel[Fuel["Kerosene"] = 2] = "Kerosene";
    Fuel[Fuel["LqdHydrogen"] = 3] = "LqdHydrogen";
    Fuel[Fuel["NTO"] = 4] = "NTO";
    Fuel[Fuel["UDMH"] = 5] = "UDMH";
    Fuel[Fuel["Aerozine50"] = 6] = "Aerozine50";
    Fuel[Fuel["MMH"] = 7] = "MMH";
    Fuel[Fuel["HTP"] = 8] = "HTP";
    Fuel[Fuel["AvGas"] = 9] = "AvGas";
    Fuel[Fuel["IRFNA_III"] = 10] = "IRFNA_III";
    Fuel[Fuel["NitrousOxide"] = 11] = "NitrousOxide";
    Fuel[Fuel["Aniline"] = 12] = "Aniline";
    Fuel[Fuel["Ethanol75"] = 13] = "Ethanol75";
    Fuel[Fuel["Ethanol90"] = 14] = "Ethanol90";
    Fuel[Fuel["Ethanol"] = 15] = "Ethanol";
    Fuel[Fuel["LqdAmmonia"] = 16] = "LqdAmmonia";
    Fuel[Fuel["LqdMethane"] = 17] = "LqdMethane";
    Fuel[Fuel["ClF3"] = 18] = "ClF3";
    Fuel[Fuel["ClF5"] = 19] = "ClF5";
    Fuel[Fuel["Diborane"] = 20] = "Diborane";
    Fuel[Fuel["Pentaborane"] = 21] = "Pentaborane";
    Fuel[Fuel["Ethane"] = 22] = "Ethane";
    Fuel[Fuel["Ethylene"] = 23] = "Ethylene";
    Fuel[Fuel["OF2"] = 24] = "OF2";
    Fuel[Fuel["LqdFluorine"] = 25] = "LqdFluorine";
    Fuel[Fuel["N2F4"] = 26] = "N2F4";
    Fuel[Fuel["Methanol"] = 27] = "Methanol";
    Fuel[Fuel["Furfuryl"] = 28] = "Furfuryl";
    Fuel[Fuel["UH25"] = 29] = "UH25";
    Fuel[Fuel["Tonka250"] = 30] = "Tonka250";
    Fuel[Fuel["Tonka500"] = 31] = "Tonka500";
    Fuel[Fuel["IWFNA"] = 32] = "IWFNA";
    Fuel[Fuel["IRFNA_IV"] = 33] = "IRFNA_IV";
    Fuel[Fuel["AK20"] = 34] = "AK20";
    Fuel[Fuel["AK27"] = 35] = "AK27";
    Fuel[Fuel["MON3"] = 36] = "MON3";
    Fuel[Fuel["MON10"] = 37] = "MON10";
    Fuel[Fuel["Hydyne"] = 38] = "Hydyne";
    Fuel[Fuel["Syntin"] = 39] = "Syntin";
    Fuel[Fuel["Hydrazine"] = 40] = "Hydrazine";
    Fuel[Fuel["Nitrogen"] = 41] = "Nitrogen";
    Fuel[Fuel["Helium"] = 42] = "Helium";
    Fuel[Fuel["CaveaB"] = 43] = "CaveaB";
    Fuel[Fuel["LiquidFuel"] = 44] = "LiquidFuel";
    Fuel[Fuel["Oxidizer"] = 45] = "Oxidizer";
    Fuel[Fuel["MonoPropellant"] = 46] = "MonoPropellant";
    Fuel[Fuel["XenonGas"] = 47] = "XenonGas";
    Fuel[Fuel["IntakeAir"] = 48] = "IntakeAir";
    Fuel[Fuel["SolidFuel"] = 49] = "SolidFuel";
    Fuel[Fuel["HNIW"] = 50] = "HNIW";
    Fuel[Fuel["HTPB"] = 51] = "HTPB";
    Fuel[Fuel["NGNC"] = 52] = "NGNC";
    Fuel[Fuel["PBAN"] = 53] = "PBAN";
    Fuel[Fuel["PSPC"] = 54] = "PSPC";
})(Fuel || (Fuel = {}));
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
class AllTankDefinition {
    static Get() {
        let definitions = "";
        for (let i in Fuel) {
            if (isNaN(parseInt(i))) {
                break;
            }
            let fuelInfo = FuelInfo.GetFuelInfo(parseInt(i));
            definitions += `
                TANK
                {
                    name = ${fuelInfo.FuelID}
                    mass = 0.00007
                    utilization = ${fuelInfo.TankUtilisation}
                    fillable = True
                    amount = 0.0
                    maxAmount = 0.0
                }
            `;
        }
        return Exporter.CompactConfig(`
            TANK_DEFINITION {
                name = All
                highltPressurized = true
                basemass = 0.00007 * volume

                ${definitions}

            }
        `);
    }
}
class BitConverter {
    static ByteArrayToBase64(data) {
        return btoa(String.fromCharCode.apply(null, data));
    }
    static Base64ToByteArray(b64) {
        return new Uint8Array(atob(b64).split("").map(c => { return c.charCodeAt(0); }));
    }
    static ByteArrayToDouble(array, offset) {
        for (let i = 0; i < 8; ++i) {
            this.view8.setUint8(i, array[offset + i]);
        }
        return this.view8.getFloat64(0, true);
    }
    static ByteArrayToInt(array, offset) {
        for (let i = 0; i < 4; ++i) {
            this.view8.setUint8(i, array[offset + i]);
        }
        return this.view8.getInt32(0, true);
    }
    static DoubleToByteArray(number) {
        this.doubleBuffer[0] = number;
        return new Uint8Array(this.buffer8);
    }
    static IntToByteArray(number) {
        this.intBuffer[0] = number;
        return new Uint8Array(this.buffer4);
    }
}
BitConverter.buffer8 = new ArrayBuffer(8);
BitConverter.buffer4 = new ArrayBuffer(4);
BitConverter.view8 = new DataView(BitConverter.buffer8);
BitConverter.view4 = new DataView(BitConverter.buffer4);
BitConverter.doubleBuffer = new Float64Array(BitConverter.buffer8);
BitConverter.intBuffer = new Int32Array(BitConverter.buffer4);
BitConverter.encoder = new TextEncoder();
BitConverter.decoder = new TextDecoder();
class Exporter {
    static ConvertEngineListToConfig(engines) {
        if (Validator.Validate(engines).length > 0) {
            console.error("Tried to export a list with errors. Aborting");
            return "";
        }
        let output = "";
        let engineDict = {};
        engines.forEach(e => {
            if (!e.Active) {
                return;
            }
            engineDict[e.ID] = e;
        });
        engines.forEach(e => {
            if (!e.Active) {
                return;
            }
            switch (e.PolyType) {
                case PolymorphismType.Single:
                case PolymorphismType.MultiModeMaster:
                case PolymorphismType.MultiConfigMaster:
                    output += this.RegularEngineConfig(e, engineDict);
                    break;
                case PolymorphismType.MultiModeSlave:
                    output += this.MultiModeSlaveEngineConfig(e, engineDict);
                    break;
                case PolymorphismType.MultiConfigSlave:
                    output += this.MultiConfigSlaveEngineConfig(e, engineDict);
                    break;
            }
        });
        return Exporter.CompactConfig(output);
    }
    static CompactConfig(input) {
        let output = "";
        let lines = input.split("\n");
        lines.forEach(l => {
            let tmp = l.trim();
            if (tmp != "") {
                output += `${tmp}\n`;
            }
        });
        return output;
    }
    static RegularEngineConfig(engine, allEngines) {
        let modelInfo = ModelInfo.GetModelInfo(engine.ModelID);
        return `
            PART
            {
                name = GE-${engine.ID}
                module = Part
                author = Generic Engines
                
                ${engine.GetModelConfig()}

                TechRequired = ${TechNode[engine.TechUnlockNode]}
                entryCost = ${engine.EntryCost}
                cost = ${engine.Cost}
                category = Engine
                subcategory = 0
                title = ${engine.EngineName == "" ? engine.ID : engine.EngineName}
                manufacturer = ${engine.EngineManufacturer}
                description = ${engine.EngineDescription}
                attachRules = 1,1,1,${modelInfo.CanAttachOnModel ? 1 : 0},0
                mass = ${engine.Mass}
                heatConductivity = 0.06
                skinInternalConductionMult = 4.0
                emissiveConstant = 0.8
                dragModelType = default
                maximum_drag = 0.2
                minimum_drag = 0.2
                angularDrag = 2
                crashTolerance = 12
                maxTemp = 2200 // = 3600
                bulkheadProfiles = size1
                tags = REP

                MODULE
                {
                    name = GenericEnginesPlumeScaleFixer
                }

                ${engine.GetHiddenObjectsConfig()}

                MODULE
                {
                    name = ModuleEngines
                    thrustVectorTransformName = thrustTransform
                    exhaustDamage = True
                    allowShutdown = ${engine.EngineVariant != EngineType.Solid}
                    useEngineResponseTime = ${engine.EngineVariant != EngineType.Solid}
                    throttleLocked = ${engine.EngineVariant == EngineType.Solid}
                    ignitionThreshold = 0.1
                    minThrust = 0
                    maxThrust = 610
                    heatProduction = 200
                    EngineType = ${engine.EngineTypeConfig()}
                    useThrustCurve = ${engine.ThrustCurve.length > 0}
                    exhaustDamageDistanceOffset = 0.79

                    atmosphereCurve
                    {
                        key = 0 345
                        key = 1 204
                        key = 6 0.001
                    }
                    
                    ${engine.GetThrustCurveConfig()}
                    
                }

                ${engine.GetGimbalConfig()}

                ${engine.GetAlternatorConfig()}

                MODULE
                {
                    name = ModuleSurfaceFX
                    thrustProviderModuleIndex = 0
                    fxMax = 0.5
                    maxDistance = 30
                    falloff = 1.7
                    thrustTransformName = thrustTransform
                }
            }

            @PART[GE-${engine.ID}]:FOR[RealismOverhaul]
            {
                %RSSROConfig = True
                %RP0conf = True
                
                %breakingForce = 250
                %breakingTorque = 250
                @maxTemp = 573.15
                %skinMaxTemp = 673.15
                %stageOffset = 1
                %childStageOffset = 1
                %stagingIcon = ${engine.StagingIconConfig()}
                @bulkheadProfiles = srf, size3
                @tags = Generic Engine

                ${engine.GetTankConfig()}

                @MODULE[ModuleEngines*]
                {
                    %engineID = PrimaryMode
                    @minThrust = ${engine.Thrust * engine.MinThrust / 100}
                    @maxThrust = ${engine.Thrust}
                    @heatProduction = 180
                    @useThrustCurve = ${engine.ThrustCurve.length > 0}
                    %powerEffectName = ${PlumeInfo.GetPlumeInfo(engine.PlumeID).PlumeID}

                    ${engine.GetPropellantConfig()}

                    @atmosphereCurve
                    {
                        @key,0 = 0 ${engine.VacIsp}
                        @key,1 = 1 ${engine.AtmIsp}
                    }

                    ${engine.GetThrustCurveConfig()}

                }

                ${engine.GetEngineModuleConfig(allEngines)}

                !RESOURCE,*{}
            }

            ${engine.GetPlumeConfig()}

            ${engine.GetTestFlightConfig()}
        `;
    }
    static MultiModeSlaveEngineConfig(engine, allEngines) {
        return `
            @PART[GE-${engine.MasterEngineName}]
            {
                MODULE
                {
                    name = MultiModeEngine
                    primaryEngineID = PrimaryMode
                    primaryEngineModeDisplayName = Primary mode (GE-${engine.MasterEngineName})
                    secondaryEngineID = SecondaryMode
                    secondaryEngineModeDisplayName = Secondary mode (GE-${engine.ID})
                }
            }
            
            @PART[GE-${engine.MasterEngineName}]:FOR[RealismOverhaul]
            {
                +MODULE[ModuleEngines*]
                {
                    @engineID = SecondaryMode
                    @minThrust = ${engine.Thrust * engine.MinThrust / 100}
                    @maxThrust = ${engine.Thrust}
                    @heatProduction = 180
                    @useThrustCurve = ${engine.ThrustCurve.length > 0}
                    %powerEffectName = ${PlumeInfo.GetPlumeInfo(engine.PlumeID).PlumeID}

                    !PROPELLANT,*
                    {
                    }

                    ${engine.GetPropellantConfig()}

                    @atmosphereCurve
                    {
                        @key,0 = 0 ${engine.VacIsp}
                        @key,1 = 1 ${engine.AtmIsp}
                    }

                    ${engine.GetThrustCurveConfig()}

                }
            }

            ${engine.GetPlumeConfig()}
        `;
    }
    static MultiConfigSlaveEngineConfig(engine, allEngines) {
        return `
            @PART[GE-${engine.MasterEngineName}]:FOR[RealismOverhaul]
            {
                @MODULE[ModuleEngineConfigs]
                {
                    ${engine.GetEngineConfig(allEngines)}
                }
            }
            
            ${engine.GetPlumeConfig()}
            
            ${engine.GetTestFlightConfig()}
            
            @ENTRYCOSTMODS:FOR[xxxRP-0]
            {
                GE-${engine.ID} = ${engine.EntryCost}
            }
        `;
    }
}
class FileIO {
    static ToClipboard(value) {
        if (value.length == 0) {
            return false;
        }
        let textArea = document.createElement("textarea");
        document.body.appendChild(textArea);
        textArea.value = value;
        textArea.focus();
        textArea.select();
        let ok = document.execCommand("copy");
        document.body.removeChild(textArea);
        return ok;
    }
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
        this.Open(FileType.Text, extensions, (result, filename) => {
            if (callback) {
                if (result) {
                    if (typeof result === "string") {
                        callback(result, filename);
                    }
                    else {
                        callback(null, filename);
                    }
                }
                else {
                    callback(null, filename);
                }
            }
        });
    }
    static OpenBinary(extensions, callback) {
        this.Open(FileType.Binary, extensions, (result, filename) => {
            if (callback) {
                if (result) {
                    if (result instanceof Uint8Array) {
                        callback(result, filename);
                    }
                    else {
                        callback(null, filename);
                    }
                }
                else {
                    callback(null, filename);
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
                    callback(null, "");
                }
                return;
            }
            let file = fileDialog.files[0];
            let reader = new FileReader();
            reader.onload = () => {
                if (callback) {
                    if (reader.result instanceof ArrayBuffer) {
                        callback(new Uint8Array(reader.result), file.name);
                    }
                    else {
                        callback(reader.result, file.name);
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
class Input {
}
Input.MouseX = 0;
Input.MouseY = 0;
window.onpointermove = (event) => {
    Input.MouseX = event.clientX;
    Input.MouseY = event.clientY;
};
class Serializer {
    static Copy(engine) {
        let [copiedEngine, _] = Serializer.Deserialize(Serializer.Serialize(engine), 0, engine.EngineList);
        return copiedEngine;
    }
    static SerializeMany(engines) {
        let data = [];
        let length = 0;
        engines.forEach(engine => {
            data.push(Serializer.Serialize(engine));
            length += data[data.length - 1].length;
        });
        let output = new Uint8Array(length);
        let i = 0;
        data.forEach(array => {
            output.set(array, i);
            i += array.length;
        });
        return output;
    }
    static DeserializeMany(data, appendToExisting) {
        let offset = 0;
        let engineCount = 0;
        while (offset < data.length) {
            let [engine, addedOffset] = Serializer.Deserialize(data, offset, appendToExisting);
            MainEngineTable.AddItem(engine);
            offset += addedOffset;
            ++engineCount;
        }
        if (offset != data.length) {
            console.warn("Possible data corruption?");
        }
        return engineCount;
    }
    static Serialize(e) {
        let i = 0;
        let output = new Uint8Array(2 +
            1 +
            (e.ID.length + 2) +
            8 +
            8 +
            8 +
            8 +
            e.FuelRatioItems.length * 10 + 2 +
            8 +
            8 +
            8 +
            4 +
            8 +
            4 +
            1 +
            1 +
            1 +
            1 +
            (!e.IsTestFlightDefault() ? 1 : 0) * (1 +
                4 +
                8 +
                8 +
                8 +
                8) +
            8 +
            1 +
            (!e.IsGimbalDefault() ? 1 : 0) * (1 +
                8 +
                8 +
                8 +
                8) +
            2 +
            2 +
            2 +
            4 +
            (e.EngineName.length + 2) +
            1 +
            (!e.IsManufacturerDefault() ? 1 : 0) * (e.EngineManufacturer.length + 2) +
            1 +
            (!e.IsDescriptionDefault() ? 1 : 0) * (e.EngineDescription.length + 2) +
            1 +
            1 +
            8 +
            e.TanksContents.length * 10 + 2 +
            e.ThrustCurve.length * 16 + 2 +
            1 +
            1 +
            1 +
            e.MasterEngineName.length + 2);
        output[i++] = Serializer.Version / 256;
        output[i++] = Serializer.Version % 256;
        output[i++] = e.Active ? 1 : 0;
        output[i++] = e.ID.length % 256;
        output[i++] = e.ID.length / 256;
        for (let c = 0; c < e.ID.length; ++c) {
            output[i++] = e.ID.charCodeAt(c);
        }
        output.set(BitConverter.DoubleToByteArray(e.Mass), i);
        i += 8;
        output.set(BitConverter.DoubleToByteArray(e.Thrust), i);
        i += 8;
        output.set(BitConverter.DoubleToByteArray(e.AtmIsp), i);
        i += 8;
        output.set(BitConverter.DoubleToByteArray(e.VacIsp), i);
        i += 8;
        output[i++] = e.FuelRatioItems.length % 256;
        output[i++] = e.FuelRatioItems.length / 256;
        e.FuelRatioItems.forEach(f => {
            output[i++] = f[0] % 256;
            output[i++] = f[0] / 256;
            output.set(BitConverter.DoubleToByteArray(f[1]), i);
            i += 8;
        });
        output.set(BitConverter.DoubleToByteArray(e.Width), i);
        i += 8;
        output.set(BitConverter.DoubleToByteArray(e.Height), i);
        i += 8;
        output.set(BitConverter.DoubleToByteArray(e.Gimbal), i);
        i += 8;
        output.set(BitConverter.IntToByteArray(e.Cost), i);
        i += 4;
        output.set(BitConverter.DoubleToByteArray(e.MinThrust), i);
        i += 8;
        output.set(BitConverter.IntToByteArray(e.Ignitions), i);
        i += 4;
        output[i++] = e.PressureFed ? 1 : 0;
        output[i++] = e.NeedsUllage ? 1 : 0;
        output[i++] = e.FuelVolumeRatios ? 1 : 0;
        output[i++] = !e.IsTestFlightDefault() ? 1 : 0;
        if (!e.IsTestFlightDefault()) {
            output[i++] = e.EnableTestFlight ? 1 : 0;
            output.set(BitConverter.IntToByteArray(e.RatedBurnTime), i);
            i += 4;
            output.set(BitConverter.DoubleToByteArray(e.StartReliability0), i);
            i += 8;
            output.set(BitConverter.DoubleToByteArray(e.StartReliability10k), i);
            i += 8;
            output.set(BitConverter.DoubleToByteArray(e.CycleReliability0), i);
            i += 8;
            output.set(BitConverter.DoubleToByteArray(e.CycleReliability10k), i);
            i += 8;
        }
        output.set(BitConverter.DoubleToByteArray(e.AlternatorPower), i);
        i += 8;
        output[i++] = !e.IsGimbalDefault() ? 1 : 0;
        if (!e.IsGimbalDefault()) {
            output[i++] = e.AdvancedGimbal ? 1 : 0;
            output.set(BitConverter.DoubleToByteArray(e.GimbalNX), i);
            i += 8;
            output.set(BitConverter.DoubleToByteArray(e.GimbalPX), i);
            i += 8;
            output.set(BitConverter.DoubleToByteArray(e.GimbalNY), i);
            i += 8;
            output.set(BitConverter.DoubleToByteArray(e.GimbalPY), i);
            i += 8;
        }
        output[i++] = e.ModelID % 256;
        output[i++] = e.ModelID / 256;
        output[i++] = e.PlumeID % 256;
        output[i++] = e.PlumeID / 256;
        output[i++] = e.TechUnlockNode % 256;
        output[i++] = e.TechUnlockNode / 256;
        output.set(BitConverter.IntToByteArray(e.EntryCost), i);
        i += 4;
        output[i++] = e.EngineName.length % 256;
        output[i++] = e.EngineName.length / 256;
        for (let c = 0; c < e.EngineName.length; ++c) {
            output[i++] = e.EngineName.charCodeAt(c);
        }
        output[i++] = !e.IsManufacturerDefault() ? 1 : 0;
        if (!e.IsManufacturerDefault()) {
            output[i++] = e.EngineManufacturer.length % 256;
            output[i++] = e.EngineManufacturer.length / 256;
            for (let c = 0; c < e.EngineManufacturer.length; ++c) {
                output[i++] = e.EngineManufacturer.charCodeAt(c);
            }
        }
        output[i++] = !e.IsDescriptionDefault() ? 1 : 0;
        if (!e.IsDescriptionDefault()) {
            output[i++] = e.EngineDescription.length % 256;
            output[i++] = e.EngineDescription.length / 256;
            for (let c = 0; c < e.EngineDescription.length; ++c) {
                output[i++] = e.EngineDescription.charCodeAt(c);
            }
        }
        output[i++] = e.UseBaseWidth ? 1 : 0;
        output[i++] = e.EngineVariant;
        output.set(BitConverter.DoubleToByteArray(e.TanksVolume), i);
        i += 8;
        output[i++] = e.TanksContents.length % 256;
        output[i++] = e.TanksContents.length / 256;
        e.TanksContents.forEach(f => {
            output[i++] = f[0] % 256;
            output[i++] = f[0] / 256;
            output.set(BitConverter.DoubleToByteArray(f[1]), i);
            i += 8;
        });
        output[i++] = e.ThrustCurve.length % 256;
        output[i++] = e.ThrustCurve.length / 256;
        e.ThrustCurve.forEach(f => {
            output.set(BitConverter.DoubleToByteArray(f[0]), i);
            i += 8;
            output.set(BitConverter.DoubleToByteArray(f[1]), i);
            i += 8;
        });
        output[i++] = e.UseTanks ? 1 : 0;
        output[i++] = e.LimitTanks ? 1 : 0;
        output[i++] = e.PolyType;
        output[i++] = e.MasterEngineName.length % 256;
        output[i++] = e.MasterEngineName.length / 256;
        for (let c = 0; c < e.MasterEngineName.length; ++c) {
            output[i++] = e.MasterEngineName.charCodeAt(c);
        }
        return output;
    }
    static Deserialize(input, startOffset, originList) {
        let output = new Engine(originList);
        let i = startOffset;
        let version = 0;
        version += input[i++];
        version *= 256;
        version += input[i++];
        if (version >= 0) {
            output.Active = input[i++] == 1;
            let stringLength = 0;
            if (version >= 3) {
                stringLength += input[i++];
                stringLength += input[i++] * 256;
            }
            else {
                stringLength += input[i++] * 256;
                stringLength += input[i++];
            }
            output.ID = "";
            for (let c = 0; c < stringLength; ++c) {
                output.ID += String.fromCharCode(input[i++]);
            }
            output.Mass = BitConverter.ByteArrayToDouble(input, i);
            i += 8;
            output.Thrust = BitConverter.ByteArrayToDouble(input, i);
            i += 8;
            output.AtmIsp = BitConverter.ByteArrayToDouble(input, i);
            i += 8;
            output.VacIsp = BitConverter.ByteArrayToDouble(input, i);
            i += 8;
            let dataLength = 0;
            if (version >= 3) {
                dataLength += input[i++];
                dataLength += input[i++] * 256;
            }
            else {
                dataLength += input[i++] * 256;
                dataLength += input[i++];
            }
            output.FuelRatioItems = [];
            for (let c = 0; c < dataLength; ++c) {
                let fuelType = 0;
                if (version >= 3) {
                    fuelType += input[i++];
                    fuelType += input[i++] * 256;
                }
                else {
                    fuelType += input[i++] * 256;
                    fuelType += input[i++];
                }
                output.FuelRatioItems.push([fuelType, BitConverter.ByteArrayToDouble(input, i)]);
                i += 8;
            }
            output.Width = BitConverter.ByteArrayToDouble(input, i);
            i += 8;
            output.Height = BitConverter.ByteArrayToDouble(input, i);
            i += 8;
            output.Gimbal = BitConverter.ByteArrayToDouble(input, i);
            i += 8;
            output.Cost = BitConverter.ByteArrayToInt(input, i);
            i += 4;
        }
        if (version >= 1) {
            output.MinThrust = BitConverter.ByteArrayToDouble(input, i);
            i += 8;
            output.Ignitions = BitConverter.ByteArrayToInt(input, i);
            i += 4;
            output.PressureFed = input[i++] == 1;
            output.NeedsUllage = input[i++] == 1;
        }
        if (version >= 2) {
            output.FuelVolumeRatios = input[i++] == 1;
        }
        if (version >= 3) {
            if (input[i++] == 1) {
                output.EnableTestFlight = input[i++] == 1;
                output.RatedBurnTime = BitConverter.ByteArrayToInt(input, i);
                i += 4;
                output.StartReliability0 = BitConverter.ByteArrayToDouble(input, i);
                i += 8;
                output.StartReliability10k = BitConverter.ByteArrayToDouble(input, i);
                i += 8;
                output.CycleReliability0 = BitConverter.ByteArrayToDouble(input, i);
                i += 8;
                output.CycleReliability10k = BitConverter.ByteArrayToDouble(input, i);
                i += 8;
            }
        }
        if (version >= 4) {
            output.AlternatorPower = BitConverter.ByteArrayToDouble(input, i);
            i += 8;
        }
        if (version >= 5) {
            if (input[i++] == 1) {
                output.AdvancedGimbal = input[i++] == 1;
                output.GimbalNX = BitConverter.ByteArrayToDouble(input, i);
                i += 8;
                output.GimbalPX = BitConverter.ByteArrayToDouble(input, i);
                i += 8;
                output.GimbalNY = BitConverter.ByteArrayToDouble(input, i);
                i += 8;
                output.GimbalPY = BitConverter.ByteArrayToDouble(input, i);
                i += 8;
            }
        }
        if (version >= 6) {
            output.ModelID += input[i++];
            output.ModelID += input[i++] * 256;
            output.PlumeID += input[i++];
            output.PlumeID += input[i++] * 256;
        }
        if (version >= 7) {
            output.TechUnlockNode += input[i++];
            output.TechUnlockNode += input[i++] * 256;
            output.EntryCost = BitConverter.ByteArrayToInt(input, i);
            i += 4;
            let stringLength = 0;
            stringLength += input[i++];
            stringLength += input[i++] * 256;
            output.EngineName = "";
            for (let c = 0; c < stringLength; ++c) {
                output.EngineName += String.fromCharCode(input[i++]);
            }
            if (input[i++] == 1) {
                let stringLength = 0;
                stringLength += input[i++];
                stringLength += input[i++] * 256;
                output.EngineManufacturer = "";
                for (let c = 0; c < stringLength; ++c) {
                    output.EngineManufacturer += String.fromCharCode(input[i++]);
                }
            }
            if (input[i++] == 1) {
                let stringLength = 0;
                stringLength += input[i++];
                stringLength += input[i++] * 256;
                output.EngineDescription = "";
                for (let c = 0; c < stringLength; ++c) {
                    output.EngineDescription += String.fromCharCode(input[i++]);
                }
            }
        }
        if (version >= 8) {
            output.UseBaseWidth = input[i++] == 1;
        }
        else {
            output.UseBaseWidth = false;
        }
        if (version >= 9) {
            output.EngineVariant = input[i++];
            output.TanksVolume = BitConverter.ByteArrayToDouble(input, i);
            i += 8;
            let dataLength = 0;
            dataLength += input[i++];
            dataLength += input[i++] * 256;
            for (let c = 0; c < dataLength; ++c) {
                let fuelType = 0;
                fuelType += input[i++];
                fuelType += input[i++] * 256;
                output.TanksContents.push([fuelType, BitConverter.ByteArrayToDouble(input, i)]);
                i += 8;
            }
            dataLength = 0;
            dataLength += input[i++];
            dataLength += input[i++] * 256;
            for (let c = 0; c < dataLength; ++c) {
                let tmp = BitConverter.ByteArrayToDouble(input, i);
                i += 8;
                output.ThrustCurve.push([tmp, BitConverter.ByteArrayToDouble(input, i)]);
                i += 8;
            }
        }
        if (version >= 10) {
            output.UseTanks = input[i++] == 1;
            output.LimitTanks = input[i++] == 1;
        }
        if (version >= 11) {
            output.PolyType = input[i++];
            let stringLength = 0;
            stringLength += input[i++];
            stringLength += input[i++] * 256;
            output.MasterEngineName = "";
            for (let c = 0; c < stringLength; ++c) {
                output.MasterEngineName += String.fromCharCode(input[i++]);
            }
        }
        if (version == 12) {
            i += 12;
        }
        return [output, i - startOffset];
    }
}
Serializer.Version = 13;
class Store {
    static Exists(id) {
        return localStorage[id] != undefined;
    }
    static Remove(id) {
        localStorage.removeItem(id);
    }
    static Rename(oldID, newID) {
        let value = localStorage[oldID];
        localStorage.removeItem(oldID);
        localStorage[newID] = value;
    }
    static SetBinary(id, value) {
        localStorage[id] = String.fromCharCode.apply(null, value);
    }
    static GetBinary(id) {
        return new Uint8Array(localStorage[id].split("").map(c => { return c.charCodeAt(0); }));
    }
    static SetText(id, value) {
        localStorage[id] = value;
    }
    static GetText(id) {
        return localStorage[id];
    }
}
Store.encoder = new TextEncoder();
Store.decoder = new TextDecoder();
class Unit {
    static Display(value, unit, forceUnit) {
        if (forceUnit) {
            return `${value}${unit}`;
        }
        let targetUnit = this.ParseUnit(unit);
        let rawValue = value * targetUnit[0];
        if (targetUnit[1] == "t" && rawValue < 1) {
            targetUnit[1] = "g";
            rawValue *= 1000000;
        }
        else if (targetUnit[1] == "g" && rawValue >= 1000000) {
            targetUnit[1] = "t";
            rawValue /= 1000000;
        }
        let closestTo500 = Number.MAX_VALUE;
        let closestPrefix = ["", 1];
        if (rawValue != 0) {
            MetricPrefix.forEach(x => {
                let newDistanceTo500 = Math.abs(rawValue / x[1] - 500.5);
                if (newDistanceTo500 < closestTo500) {
                    closestTo500 = newDistanceTo500;
                    closestPrefix = x;
                }
            });
        }
        return `${rawValue / closestPrefix[1]}${closestPrefix[0]}${targetUnit[1]}`;
    }
    static ParseUnit(rawUnit) {
        if (rawUnit.length == 0) {
            console.error("Bad input unit");
            return [0, ""];
        }
        let prefix = MetricPrefix.find(x => x[0] == rawUnit[0]);
        if (prefix) {
            return [prefix[1], rawUnit.substring(1)];
        }
        else {
            return [1, rawUnit];
        }
    }
    static Parse(value, baseUnit) {
        let rawInputNumber = /^[0-9,.]+/.exec(value);
        let inputNumber = rawInputNumber ? parseFloat(rawInputNumber[0].replace(",", ".")) : 0;
        let rawInputUnit = /[^0-9,.]+$/.exec(value);
        let inputUnit = this.ParseUnit(rawInputUnit ? rawInputUnit[0] : baseUnit);
        let targetUnit = this.ParseUnit(baseUnit);
        if (inputUnit[1] == "g" && targetUnit[1] == "t") {
            inputUnit[0] /= 1000000;
            inputUnit[1] = "t";
        }
        else if (inputUnit[1] == "t" && targetUnit[1] == "g") {
            inputUnit[0] *= 1000000;
            inputUnit[1] = "g";
        }
        if (inputUnit[1] != targetUnit[1]) {
            console.warn("Units mismatched. Changing to expected unit");
            inputUnit[1] = targetUnit[1];
        }
        return inputNumber * inputUnit[0] / targetUnit[0];
    }
}
const MetricPrefix = [
    ["Y", 1e+24],
    ["Z", 1e+21],
    ["E", 1000000000000000000],
    ["P", 1000000000000000],
    ["T", 1000000000000],
    ["G", 1000000000],
    ["M", 1000000],
    ["k", 1000],
    ["", 1],
    ["m", 0.001],
    ["u", 0.000001],
    ["n", 1e-9],
    ["p", 1e-12],
    ["f", 1e-15],
    ["a", 1e-18],
    ["z", 1e-21],
    ["y", 1e-24],
];
class Validator {
    static Validate(engines) {
        let output = [];
        output = output.concat(this.CheckDuplicateIDs(engines));
        output = output.concat(this.CheckPolymorphismConsistency(engines));
        return output;
    }
    static CheckPolymorphismConsistency(engines) {
        let output = [];
        let Masters = {};
        engines.forEach(e => {
            if (!e.Active) {
                return;
            }
            switch (e.PolyType) {
                case PolymorphismType.MultiConfigMaster:
                    Masters[e.ID] = [false, 0];
                    break;
                case PolymorphismType.MultiModeMaster:
                    Masters[e.ID] = [true, 0];
                    break;
            }
        });
        engines.forEach(e => {
            if (!e.Active) {
                return;
            }
            switch (e.PolyType) {
                case PolymorphismType.MultiConfigSlave:
                    if (Masters[e.MasterEngineName] &&
                        !Masters[e.MasterEngineName][0]) {
                        Masters[e.MasterEngineName][1] += 1;
                    }
                    else {
                        output.push(`Polymorphism error in engine ${e.ID}. There is no active MultiConfigMaster with ID ${e.MasterEngineName}`);
                    }
                    break;
                case PolymorphismType.MultiModeSlave:
                    if (Masters[e.MasterEngineName] &&
                        Masters[e.MasterEngineName][0]) {
                        if (Masters[e.MasterEngineName][1] == 0) {
                        }
                        else {
                            output.push(`Polymorphism error in engine ${e.ID}. ${e.MasterEngineName} already has a slave MultiMode engine config`);
                        }
                        Masters[e.MasterEngineName][1] += 1;
                    }
                    else {
                        output.push(`Polymorphism error in engine ${e.ID}. There is no active MultiModeMaster with ID ${e.MasterEngineName}`);
                    }
                    break;
            }
        });
        return output;
    }
    static CheckDuplicateIDs(engines) {
        let output = [];
        let takenIDs = [];
        engines.forEach(e => {
            if (!e.Active) {
                return;
            }
            if (/[^A-Za-z0-9-]/.test(e.ID)) {
                output.push(`ID contains invalid characters: ${e.ID}. Change the ID`);
                return;
            }
            if (takenIDs.some(x => x == e.ID)) {
                output.push(`ID duplicate found: ${e.ID}. Change the ID`);
            }
            else {
                takenIDs.push(e.ID);
            }
        });
        return output;
    }
}
//# sourceMappingURL=index.js.map