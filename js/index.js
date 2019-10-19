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
        if (this.ValueOwner.hasOwnProperty("OnEditEnd")) {
            this.ValueOwner.OnEditEnd();
        }
        EditableField.EditedField = null;
        this.ShowEditMode(false);
        if (this.OnSaveEdit && saveChanges) {
            this.OnSaveEdit();
        }
    }
    SetValue(newValue) {
        this.ValueOwner[this.ValueName] = newValue;
        this.ApplyValueToDisplayElement();
    }
    RefreshDisplayElement() {
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
                if (this.OnSaveEdit) {
                    this.OnSaveEdit();
                }
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
        output.classList.add("content-cell-edit");
        return output;
    }
    ApplyValueToDisplayElement() {
        if (!(this.ValueOwner && (this.ValueOwner.hasOwnProperty(this.ValueName) || (this.ValueOwner.hasOwnProperty("EditableFieldMetadata") &&
            this.ValueOwner.EditableFieldMetadata.hasOwnProperty(this.ValueName))))) {
            throw `${this.ValueOwner} or ${this.ValueOwner}.${this.ValueName} is not set up as EditableField`;
        }
        if (typeof this.ValueOwner[this.ValueName] == "object" && "ApplyValueToDisplayElement" in this.ValueOwner[this.ValueName]) {
            this.ValueOwner[this.ValueName].ApplyValueToDisplayElement(this.DisplayElement, this.ValueOwner);
        }
        else if (this.ValueOwner.EditableFieldMetadata &&
            this.ValueOwner.EditableFieldMetadata[this.ValueName] &&
            "ApplyValueToDisplayElement" in this.ValueOwner.EditableFieldMetadata[this.ValueName]) {
            this.ValueOwner.EditableFieldMetadata[this.ValueName].ApplyValueToDisplayElement(this.DisplayElement, this.ValueOwner);
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
            this.ValueOwner[this.ValueName].ApplyValueToEditElement(this.EditElement, this.ValueOwner);
        }
        else if (this.ValueOwner.EditableFieldMetadata &&
            this.ValueOwner.EditableFieldMetadata[this.ValueName] &&
            "ApplyValueToEditElement" in this.ValueOwner.EditableFieldMetadata[this.ValueName]) {
            this.ValueOwner.EditableFieldMetadata[this.ValueName].ApplyValueToEditElement(this.EditElement, this.ValueOwner);
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
            this.ValueOwner[this.ValueName].ApplyChangesToValue(this.EditElement, this.ValueOwner);
        }
        else if (this.ValueOwner.EditableFieldMetadata &&
            this.ValueOwner.EditableFieldMetadata[this.ValueName] &&
            "ApplyChangesToValue" in this.ValueOwner.EditableFieldMetadata[this.ValueName]) {
            this.ValueOwner.EditableFieldMetadata[this.ValueName].ApplyChangesToValue(this.EditElement, this.ValueOwner);
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
    if (e.which != 1) {
        return;
    }
    if (EditableField.EditedField) {
        if (e.srcElement) {
            let currentElement = e.srcElement;
            let foundEdited = false;
            while (currentElement != null) {
                if (currentElement.getAttribute("data-FieldID") == EditableField.EditedField.FieldID.toString() ||
                    currentElement.getAttribute("data-FieldID") == "-1" ||
                    currentElement.classList.contains("fullscreen-box")) {
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
        this.ColumnHeaders = {};
        this.Columns = {};
        this.Rows = {};
        this.DisplayedRowOrder = [];
        this.SelectedRows = [];
        this.TableContainer = container;
        this.TableElement = document.createElement("div");
        this.TableElement.classList.add("content-table");
        this.TableContainer.innerHTML = "";
        this.TableContainer.appendChild(this.TableElement);
        window.addEventListener("pointerdown", (e) => {
            if (e.which != 1) {
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
    RawAddItem(newItem) {
        this.Items.push(newItem);
        this.Rows[HtmlTable.RowCounter] = [Array(Object.getOwnPropertyNames(this.ColumnsDefinitions).length), newItem];
        let x = 0;
        for (let columnID in this.ColumnsDefinitions) {
            let columnCell = document.createElement("div");
            columnCell.classList.add("content-cell");
            columnCell.setAttribute("data-tableRow", (HtmlTable.RowCounter).toString());
            let cellField = new EditableField(newItem, columnID, columnCell);
            cellField.OnSaveEdit = () => {
                this.SortItems();
            };
            if (newItem.hasOwnProperty("EditableFields")) {
                newItem.EditableFields.push(cellField);
            }
            this.Rows[HtmlTable.RowCounter][0][x] = columnCell;
            this.Columns[columnID].appendChild(columnCell);
            ++x;
        }
        if (newItem.OnTableDraw && typeof newItem.OnTableDraw == "function") {
            newItem.OnTableDraw(this.Rows[HtmlTable.RowCounter][0]);
        }
        this.DisplayedRowOrder.push(HtmlTable.RowCounter.toString());
        ++HtmlTable.RowCounter;
    }
    AddItems(newItem) {
        if (Array.isArray(newItem)) {
            newItem.forEach(item => {
                this.RawAddItem(item);
            });
        }
        else {
            this.RawAddItem(newItem);
        }
        if (this.currentSort) {
            this.SortItems();
        }
    }
    RemoveSelectedItems() {
        this.SelectedRows.forEach(row => {
            this.Rows[row][0].forEach(element => {
                element.remove();
            });
            this.Items.splice(this.Items.indexOf(this.Rows[row][1]), 1);
            this.DisplayedRowOrder.splice(this.DisplayedRowOrder.findIndex(x => x == row.toString()), 1);
            delete this.Rows[row];
        });
        this.SelectedRows = [];
        if (this.OnSelectedItemChange) {
            this.OnSelectedItemChange(undefined);
        }
        if (this.currentSort) {
            this.SortItems();
        }
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
            let lastSelectedID = this.DisplayedRowOrder.findIndex(x => x == this.SelectedRows[this.SelectedRows.length - 1].toString());
            let currentSelectedID = this.DisplayedRowOrder.findIndex(x => x == row.toString());
            for (let i = lastSelectedID;; i += (currentSelectedID > lastSelectedID ? 1 : -1)) {
                let decodedI = parseInt(this.DisplayedRowOrder[i]);
                if (this.SelectedRows.some(x => x == decodedI)) {
                }
                else {
                    this.SelectedRows.push(decodedI);
                    this.Rows[decodedI][0].forEach(cell => {
                        cell.classList.add("selected");
                    });
                }
                if (decodedI == row) {
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
            if (this.OnSelectedItemChange) {
                this.OnSelectedItemChange(this.Rows[this.SelectedRows[this.SelectedRows.length - 1]][1]);
            }
            this.Rows[this.SelectedRows[this.SelectedRows.length - 1]][0].forEach(cell => {
                cell.classList.add("last");
            });
        }
    }
    RebuildTable() {
        if (Object.getOwnPropertyNames(this.ColumnsDefinitions).length == 0) {
            console.warn(this);
            console.warn("No columns were set.");
            return;
        }
        let ItemsBackup = new Array().concat(this.Items);
        this.Items = [];
        this.SelectedRows = [];
        for (let i in this.Rows) {
            this.SelectedRows.push(parseInt(i));
        }
        this.RemoveSelectedItems();
        this.currentSort = undefined;
        this.TableElement.remove();
        this.TableElement = document.createElement("div");
        this.TableElement.classList.add("content-table");
        this.TableContainer.appendChild(this.TableElement);
        this.ColumnHeaders = {};
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
            columnHeader.addEventListener("pointerdown", e => {
                if (e.which != 1) {
                    return;
                }
                this.Sort(columnID);
            });
            this.ColumnHeaders[columnID] = columnHeader;
            let columnResizer = document.createElement("div");
            columnResizer.classList.add("content-column-resizer");
            columnResizer.setAttribute("data-FieldID", "-1");
            columnResizer.addEventListener("pointerdown", e => {
                if (e.which != 1) {
                    return;
                }
                e.stopPropagation();
                let originalX = Input.MouseX;
                let originalWidth = column.style.width ? parseInt(column.style.width) : 400;
                Dragger.Drag(() => {
                    let newWidth = originalWidth + Input.MouseX - originalX;
                    newWidth = Math.max(24, newWidth);
                    column.style.width = `${newWidth}px`;
                    columnHeader.style.width = `${newWidth}px`;
                });
            });
            columnHeader.appendChild(columnResizer);
            this.TableElement.appendChild(column);
        }
        this.AddItems(ItemsBackup);
    }
    Sort(columnID) {
        if (columnID) {
            if (this.currentSort && this.currentSort[0] != columnID) {
                this.ColumnHeaders[this.currentSort[0]].classList.remove(this.currentSort[1] == 1 ? "sortAsc" : "sortDesc");
                this.currentSort = undefined;
            }
            if (this.currentSort) {
                if (this.currentSort[1] == 1) {
                    this.currentSort[1] = -1;
                    this.ColumnHeaders[columnID].classList.remove("sortAsc");
                    this.ColumnHeaders[columnID].classList.add("sortDesc");
                }
                else {
                    this.currentSort = undefined;
                    this.ColumnHeaders[columnID].classList.remove("sortDesc");
                }
            }
            else {
                this.currentSort = [columnID, 1];
                this.ColumnHeaders[columnID].classList.add("sortAsc");
            }
        }
        else {
            if (this.currentSort) {
                this.ColumnHeaders[this.currentSort[0]].classList.remove(this.currentSort[1] == 1 ? "sortAsc" : "sortDesc");
                this.currentSort = undefined;
            }
        }
        this.SortItems();
    }
    SortItems() {
        if (Settings.async_sort) {
            setTimeout(() => this._SortItems(), 0);
        }
        else {
            this._SortItems();
        }
    }
    _SortItems() {
        this.DisplayedRowOrder.length = 0;
        if (this.currentSort && this.Items.length > 0) {
            let sorts = this.Items[0].ColumnSorts();
            if (sorts.hasOwnProperty(this.currentSort[0])) {
                let sortFunction = sorts[this.currentSort[0]];
                let map = [];
                for (let i in this.Rows) {
                    map.push([i, this.Rows[i][0], this.Rows[i][1]]);
                }
                map.sort((a, b) => {
                    return sortFunction(a[2], b[2]) * this.currentSort[1];
                });
                map.forEach(row => {
                    let hideRow = null;
                    if (Settings.hide_disabled_fields_on_sort && row[2] instanceof Engine) {
                        hideRow = (this.ColumnsDefinitions[this.currentSort[0]].DisplayFlags & 1 << row[2].PolyType) != 0;
                    }
                    this.DisplayedRowOrder.push(row[0]);
                    row[1].forEach(cell => {
                        if (hideRow != null) {
                            if (!hideRow) {
                                cell.parentNode.appendChild(cell);
                            }
                            cell.style.display = hideRow ? "none" : "block";
                        }
                        else {
                            cell.parentNode.appendChild(cell);
                        }
                    });
                });
                return;
            }
            else {
            }
        }
        else {
        }
        for (let i in this.Rows) {
            this.DisplayedRowOrder.push(i);
            this.Rows[i][0].forEach(cell => {
                cell.parentNode.appendChild(cell);
                cell.style.display = "block";
            });
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
Version.CurrentVersion = "Web.0.9.2 Dev";
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
    static GetText(id, defaultValue = "undefined") {
        if (localStorage[id] == undefined) {
            this.SetText(id, defaultValue);
            return this.GetText(id);
        }
        else {
            return localStorage[id];
        }
    }
}
Store.encoder = new TextEncoder();
Store.decoder = new TextDecoder();
document.addEventListener("DOMContentLoaded", () => {
    SettingsDialog.SettingsBoxElement = document.getElementById("settings-box");
    SettingsDialog.SettingsBoxElement.querySelector("div.fullscreen-grayout").addEventListener("click", () => {
        SettingsDialog.Apply();
    });
});
class SettingsDialog {
    static Show() {
        let inputs = this.SettingsBoxElement.querySelectorAll("input");
        inputs.forEach(i => {
            let field = i.getAttribute("setting-field");
            if (field) {
                if (Settings[field] != undefined) {
                    if (typeof Settings[field] == "boolean") {
                        i.checked = Settings[field];
                    }
                    else if (typeof Settings[field] == "string") {
                        i.value = Settings[field];
                    }
                    else {
                        console.error("Unsupported setting type");
                    }
                }
                else {
                    console.error("Unknown setting field");
                }
            }
            else {
                return;
            }
        });
        FullscreenWindows["settings-box"].style.display = "flex";
    }
    static Apply() {
        let inputs = this.SettingsBoxElement.querySelectorAll("input");
        inputs.forEach(i => {
            let field = i.getAttribute("setting-field");
            if (field) {
                if (Settings[field] != undefined) {
                    if (typeof Settings[field] == "boolean") {
                        Settings[field] = i.checked;
                    }
                    else if (typeof Settings[field] == "string") {
                        Settings[field] = i.value;
                    }
                    else {
                        console.error("Unsupported setting type");
                    }
                }
                else {
                    console.error("Unknown setting field");
                }
            }
            else {
                return;
            }
        });
        ApplySettings();
        MainEngineTable.RebuildTable();
    }
}
const Settings = {
    get classic_unit_display() {
        return Store.GetText("setting:classic_unit_display", "0") == "1";
    }, set classic_unit_display(value) {
        Store.SetText("setting:classic_unit_display", value ? "1" : "0");
    }, get dark_theme() {
        return Store.GetText("setting:dark_theme", "0") == "1";
    }, set dark_theme(value) {
        Store.SetText("setting:dark_theme", value ? "1" : "0");
    }, get show_info_panel() {
        return Store.GetText("setting:show_info_panel", "1") == "1";
    }, set show_info_panel(value) {
        Store.SetText("setting:show_info_panel", value ? "1" : "0");
    }, get prettify_config() {
        return Store.GetText("setting:prettify_config", "0") == "1";
    }, set prettify_config(value) {
        Store.SetText("setting:prettify_config", value ? "1" : "0");
    }, get async_sort() {
        return Store.GetText("setting:async_sort", "0") == "1";
    }, set async_sort(value) {
        Store.SetText("setting:async_sort", value ? "1" : "0");
    }, get hide_disabled_fields_on_sort() {
        return Store.GetText("setting:hide_disabled_fields_on_sort", "1") == "1";
    }, set hide_disabled_fields_on_sort(value) {
        Store.SetText("setting:hide_disabled_fields_on_sort", value ? "1" : "0");
    }
};
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
function ApplySettings() {
    document.getElementById("css-palette").href = Settings.dark_theme ? "css/darkPalette.css" : "css/classicPalette.css";
    document.documentElement.style.setProperty("--infoPanelWidth", `${Settings.show_info_panel ? 320 : 0}px`);
}
ApplySettings();
function ApplyEngineToInfoPanel(engine, clear = false) {
    if (!Settings.show_info_panel) {
        return;
    }
    let gravity = 9.80665;
    let infoPanel = document.getElementById("info-panel");
    let properties = {};
    let engineMass = engine.GetMass();
    let propellantMass = 0;
    engine.GetConstrainedTankContents().forEach(i => {
        propellantMass += i[1] * FuelInfo.GetFuelInfo(i[0]).Density;
    });
    let massFlow = engine.VacIsp;
    massFlow *= 9.8066;
    massFlow = 1 / massFlow;
    massFlow *= engine.Thrust;
    let detailedMassFlow = engine.GetEngineMassFlow();
    let detailedBurnTime = engine.GetEngineBurnTime();
    properties["id"] = engine.ID;
    properties["dry_mass"] = Unit.Display(engineMass, "t", Settings.classic_unit_display, 6);
    properties["wet_mass"] = Unit.Display(engineMass + propellantMass, "t", Settings.classic_unit_display, 6);
    properties["thrust_min_vac"] = Unit.Display(engine.Thrust * engine.MinThrust / 100, "kN", Settings.classic_unit_display, 3);
    properties["thrust_max_vac"] = Unit.Display(engine.Thrust, "kN", Settings.classic_unit_display, 3);
    properties["thrust_min_atm"] = Unit.Display(engine.Thrust * engine.MinThrust / 100 * engine.AtmIsp / engine.VacIsp, "kN", Settings.classic_unit_display, 3);
    properties["thrust_max_atm"] = Unit.Display(engine.Thrust * engine.AtmIsp / engine.VacIsp, "kN", Settings.classic_unit_display, 3);
    properties["twr_wet_vac"] = (engine.Thrust / (engineMass + propellantMass) / gravity).toFixed(3);
    properties["twr_dry_vac"] = (engine.Thrust / (engineMass) / gravity).toFixed(3);
    properties["twr_wet_atm"] = (engine.Thrust * engine.AtmIsp / engine.VacIsp / (engineMass + propellantMass) / gravity).toFixed(3);
    properties["twr_dry_atm"] = (engine.Thrust * engine.AtmIsp / engine.VacIsp / (engineMass) / gravity).toFixed(3);
    properties["twr_wet_vac_min"] = (engine.Thrust * engine.MinThrust / 100 / (engineMass + propellantMass) / gravity).toFixed(3);
    properties["twr_dry_vac_min"] = (engine.Thrust * engine.MinThrust / 100 / (engineMass) / gravity).toFixed(3);
    properties["twr_wet_atm_min"] = (engine.Thrust * engine.MinThrust / 100 * engine.AtmIsp / engine.VacIsp / (engineMass + propellantMass) / gravity).toFixed(3);
    properties["twr_dry_atm_min"] = (engine.Thrust * engine.MinThrust / 100 * engine.AtmIsp / engine.VacIsp / (engineMass) / gravity).toFixed(3);
    properties["min_mass_flow"] = `${Unit.Display(massFlow * engine.MinThrust / 100, "t", Settings.classic_unit_display, 3)}/s`;
    properties["max_mass_flow"] = `${Unit.Display(massFlow, "t", Settings.classic_unit_display, 3)}/s`;
    properties["mass_flow_detail"] = "<ul>";
    detailedMassFlow.forEach(([fuel, flow]) => {
        if (fuel == Fuel.ElectricCharge) {
            properties["mass_flow_detail"] += `<li><span class='abbr' title='1 kilowatt (kW) is equal to 1 unit of Electric Charge per second (u/s) in game'>Electricity: ${Unit.Display(flow, "kW", Settings.classic_unit_display, 3)}</span></li>`;
        }
        else {
            let fuelInfo = FuelInfo.GetFuelInfo(fuel);
            properties["mass_flow_detail"] += `<li>${fuelInfo.FuelName}: ${Unit.Display(flow, "t", Settings.classic_unit_display, 3)}/s<br>`;
            properties["mass_flow_detail"] += `<span class='abbr' title='1 litre per second (L/s) is equal to 1 unit per second (u/s) in game'>${Unit.Display(flow / fuelInfo.Density, "L", Settings.classic_unit_display, 3)}/s</li>`;
        }
    });
    properties["mass_flow_detail"] += "</ul>";
    properties["burn_time_detail"] = "<ul>";
    detailedBurnTime.forEach(([fuel, time]) => {
        if (fuel == Fuel.ElectricCharge) {
        }
        else {
            let fuelInfo = FuelInfo.GetFuelInfo(fuel);
            properties["burn_time_detail"] += `<li>${fuelInfo.FuelName}: ${Unit.Display(time, "", true, 2)}s<br>`;
        }
    });
    properties["burn_time_detail"] += "</ul>";
    for (let i in properties) {
        let element = infoPanel.querySelector(`span[info-field="${i}"]`);
        if (element) {
            element.innerHTML = clear ? "" : properties[i];
        }
    }
}
addEventListener("DOMContentLoaded", () => {
    ListNameDisplay = new EditableField(window, "ListName", document.getElementById("list-name"));
    let infoPanel = document.getElementById("info-panel");
    let mainCSS = document.getElementById("main-css");
    document.getElementById("info-panel-resize").addEventListener("pointerdown", e => {
        if (e.which != 1) {
            return;
        }
        let originalX = Input.MouseX;
        let originalWidth = parseFloat(document.documentElement.style.getPropertyValue("--infoPanelWidth"));
        originalWidth = isNaN(originalWidth) ? 200 : originalWidth;
        Dragger.Drag(() => {
            let newWidth = originalWidth - Input.MouseX + originalX;
            newWidth = Math.max(50, newWidth);
            document.documentElement.style.setProperty("--infoPanelWidth", `${newWidth}px`);
        });
    });
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
        for (let i = 0; i < files.length; ++i) {
            let reader = new FileReader();
            reader.onload = () => {
                let data = new Uint8Array(reader.result);
                let newEngines = Serializer.DeserializeMany(data);
                newEngines.forEach(e => {
                    e.EngineList = MainEngineTable.Items;
                });
                MainEngineTable.AddItems(newEngines);
                Notifier.Info(`Appended ${newEngines.length} engine${newEngines.length > 1 ? "s" : ""} using drag&drop`);
            };
            reader.readAsArrayBuffer(files[i]);
        }
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
        TechNodeAutocomplete.innerHTML += `<option>${TechNodeNames.get(x)}</option>`;
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
    document.getElementById("option-button-clipboard-selection").addEventListener("click", ClipboardSelectionButton_Click);
    document.getElementById("option-button-open-upload-list").addEventListener("click", OpenUploadButton_Click);
    document.getElementById("option-button-append-upload-list").addEventListener("click", AppendUploadButton_Click);
    document.getElementById("option-button-open-cache-list").addEventListener("click", OpenCacheButton_Click);
    document.getElementById("option-button-append-cache-list").addEventListener("click", AppendCacheButton_Click);
    document.getElementById("option-button-open-clipboard-list").addEventListener("click", OpenClipboardButton_Click);
    document.getElementById("option-button-append-clipboard-list").addEventListener("click", AppendClipboardButton_Click);
    MainEngineTable = new HtmlTable(document.getElementById("list-container"));
    MainEngineTable.ColumnsDefinitions = Engine.ColumnDefinitions;
    MainEngineTable.OnSelectedItemChange = selectedEngine => {
        if (selectedEngine) {
            ApplyEngineToInfoPanel(selectedEngine);
        }
        else {
            ApplyEngineToInfoPanel(new Engine(), true);
        }
    };
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
                MainEngineTable.Items = Serializer.DeserializeMany(data);
                MainEngineTable.RebuildTable();
                MainEngineTable.Items.forEach(e => {
                    e.EngineList = MainEngineTable.Items;
                });
                FullscreenWindows["open-box"].style.display = "none";
                Notifier.Info(`Opened ${MainEngineTable.Items.length} engine${MainEngineTable.Items.length > 1 ? "s" : ""}`);
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
            let newEngines = Serializer.DeserializeMany(data);
            newEngines.forEach(e => {
                e.EngineList = MainEngineTable.Items;
            });
            MainEngineTable.AddItems(newEngines);
            FullscreenWindows["open-box"].style.display = "none";
            Notifier.Info(`Appended ${newEngines.length} engine${newEngines.length > 1 ? "s" : ""}`);
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
            MainEngineTable.Items = Serializer.DeserializeMany(data);
            MainEngineTable.RebuildTable();
            MainEngineTable.Items.forEach(e => {
                e.EngineList = MainEngineTable.Items;
            });
            FullscreenWindows["open-box"].style.display = "none";
            Notifier.Info(`Opened ${MainEngineTable.Items.length} engine${MainEngineTable.Items.length > 1 ? "s" : ""}`);
        }, "Choose a list to open");
    }
}
function AppendCacheButton_Click() {
    BrowserCacheDialog.GetEngineListData(data => {
        if (!data) {
            return;
        }
        let newEngines = Serializer.DeserializeMany(data);
        newEngines.forEach(e => {
            e.EngineList = MainEngineTable.Items;
        });
        MainEngineTable.AddItems(newEngines);
        FullscreenWindows["open-box"].style.display = "none";
        Notifier.Info(`Appended ${newEngines.length} engine${newEngines.length > 1 ? "s" : ""}`);
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
            MainEngineTable.Items = Serializer.DeserializeMany(data);
            MainEngineTable.RebuildTable();
            MainEngineTable.Items.forEach(e => {
                e.EngineList = MainEngineTable.Items;
            });
            FullscreenWindows["open-box"].style.display = "none";
            Notifier.Info(`Opened ${MainEngineTable.Items.length} engine${MainEngineTable.Items.length > 1 ? "s" : ""}`);
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
        let newEngines = Serializer.DeserializeMany(data);
        newEngines.forEach(e => {
            e.EngineList = MainEngineTable.Items;
        });
        MainEngineTable.AddItems(newEngines);
        FullscreenWindows["open-box"].style.display = "none";
        Notifier.Info(`Appended ${newEngines.length} engine${newEngines.length > 1 ? "s" : ""}`);
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
function ClipboardSelectionButton_Click() {
    if (MainEngineTable.SelectedRows.length <= 0) {
        Notifier.Warn("No engine was selected. Select some engines and try again");
        return;
    }
    let Engines = [];
    MainEngineTable.SelectedRows.forEach(index => {
        Engines.push(MainEngineTable.Rows[index][1]);
    });
    let data = Serializer.SerializeMany(Engines);
    let b64 = BitConverter.ByteArrayToBase64(data);
    let success = FileIO.ToClipboard(b64);
    if (success) {
        Notifier.Info("Selected engines have been copied to clipboard");
        FullscreenWindows["save-box"].style.display = "none";
    }
    else {
        Notifier.Warn("There was an error. Selected engines were NOT copied to clipboard");
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
    if (Packager.IsWorking) {
        FullscreenWindows["export-box"].style.display = "flex";
    }
    else {
        if (MainEngineTable.Items.length > 0) {
            let errors = Validator.Validate(MainEngineTable.Items);
            if (errors.length != 0) {
                Notifier.Error("Fix validation errors before exporting");
                alert(`Fix following errors before exporting the engine:\n\n-> ${errors.join("\n-> ")}`);
                return;
            }
            Packager.BuildMod(ListName, MainEngineTable.Items, (data) => {
                if (data) {
                    Notifier.Info("Exporting finished");
                    FileIO.SaveBinary(`${ListName}.zip`, data);
                }
                else {
                    Notifier.Warn("Exporting aborted");
                }
            });
        }
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
    let newEngine = new Engine();
    newEngine.EngineList = MainEngineTable.Items;
    MainEngineTable.AddItems(newEngine);
}
function RemoveButton_Click() {
    if (MainEngineTable.SelectedRows.length > 0 && confirm(`You are about to delete ${MainEngineTable.SelectedRows.length} items from the list.\n\nAre you sure?`)) {
        MainEngineTable.RemoveSelectedItems();
    }
}
function SettingsButton_Click() {
    SettingsDialog.Show();
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
        for (let type in FuelType) {
            let i = type;
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
    EngineGroupType["AlternativeHistory"] = "Alternative History";
})(EngineGroupType || (EngineGroupType = {}));
class ModelInfo {
    static GetModelInfo(id) {
        return ModelInfo.models[id];
    }
}
ModelInfo.models = [
    {
        get OriginalHeight() { return this.NodeStackTop - this.NodeStackBottom; },
        OriginalBellWidth: 0.9635,
        OriginalBaseWidth: 0.892,
        PlumeSizeMultiplier: 1.0,
        PlumePositionOffset: 0.8,
        NodeStackTop: 0.7215,
        NodeStackBottom: -1.1635,
        ModelPath: "GenericEngines/models/RealismOverhaul/LR-91eng",
        ModelFiles: [
            "files/models/RealismOverhaul/LR-91eng.mu",
            "files/models/RealismOverhaul/LR87diff.dds",
            "files/models/RealismOverhaul/LR87emis.dds"
        ],
        TextureDefinitions: "",
        ThrustTransformName: "thrustTransform",
        GimbalTransformName: "thrustTransform",
        ModelName: "LR91-5",
        ModelType: EngineGroupType.IRL,
        HiddenMuObjects: [],
        CanAttachOnModel: false,
        OriginalTankVolume: 0,
        RadialAttachment: false,
        RadialAttachmentPoint: 0,
        ImageSource: "img/modelPreviews/LR91.webp",
        get ImageLabel() { return this.ModelName; },
        LookatPairs: [],
        HeatAnimations: [
            "HeatEmissiveAnimation"
        ],
        Exhaust: {
            exhaustThrustTransform: "exhaustTransform",
            exhaustGimbalTransform: "exhaustTransform",
            exhaustEffectTransform: "exhaustEffect",
            exhaustBellWidth: 0.0757
        }
    }, {
        get OriginalHeight() { return this.NodeStackTop - this.NodeStackBottom; },
        OriginalBellWidth: 0.285,
        OriginalBaseWidth: 0.395,
        PlumeSizeMultiplier: 0.295,
        PlumePositionOffset: -0.09,
        NodeStackTop: 0.33,
        NodeStackBottom: -0.324,
        ModelPath: "GenericEngines/models/SXT/AJ10/model",
        ModelFiles: [
            "files/models/SXT/AJ10/model.mu",
            "files/models/SXT/AJ10/fairing.dds",
            "files/models/SXT/AJ10/model000.dds",
            "files/models/SXT/AJ10/model001.dds"
        ],
        TextureDefinitions: `
                texture = fairing , Squad/Parts/Engine/liquidEngineLV-T45/model002
                texture = model000 , Squad/Parts/Engine/liquidEngineLV-T45/model000
                texture = model001 , Squad/Parts/Engine/liquidEngineLV-T45/model001
            `,
        ThrustTransformName: "thrustTransform",
        GimbalTransformName: "thrustTransform",
        ModelName: "AJ10-142",
        ModelType: EngineGroupType.IRL,
        HiddenMuObjects: [
            "Cylinder_002"
        ],
        CanAttachOnModel: false,
        OriginalTankVolume: 0,
        RadialAttachment: false,
        RadialAttachmentPoint: 0,
        ImageSource: "img/modelPreviews/AJ10.webp",
        get ImageLabel() { return this.ModelName; },
        LookatPairs: [
            ["marker1", "susp1"],
            ["marker2", "susp2"],
            ["marker3", "susp3"],
            ["marker4", "susp4"],
        ],
        HeatAnimations: [
            "aj10"
        ]
    }, {
        get OriginalHeight() { return this.NodeStackTop - this.NodeStackBottom; },
        OriginalBellWidth: 0.865,
        OriginalBaseWidth: 0.989,
        PlumeSizeMultiplier: 0.85,
        PlumePositionOffset: -0.8,
        NodeStackTop: -0.025,
        NodeStackBottom: -1.525,
        ModelPath: "GenericEngines/models/VenStockRevamp/KS-25",
        ModelFiles: [
            "files/models/VenStockRevamp/KS-25.mu",
            "files/models/VenStockRevamp/RCS_CLR.dds",
            "files/models/VenStockRevamp/RCS_NRM.dds",
            "files/models/VenStockRevamp/Size3Engines_CLR.dds",
            "files/models/VenStockRevamp/Size3Engines_LUM.dds"
        ],
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
        RadialAttachmentPoint: 0,
        ImageSource: "img/modelPreviews/RS25.webp",
        get ImageLabel() { return this.ModelName; },
        LookatPairs: [],
        HeatAnimations: []
    }, {
        get OriginalHeight() { return this.NodeStackTop - this.NodeStackBottom; },
        OriginalBellWidth: 0.12,
        OriginalBaseWidth: 0.222,
        PlumeSizeMultiplier: 0.11,
        PlumePositionOffset: -0.04,
        NodeStackTop: 0.0495,
        NodeStackBottom: -0.256,
        ModelPath: "GenericEngines/models/VenStockRevamp/LV-1B",
        ModelFiles: [
            "files/models/VenStockRevamp/LV-1B.mu",
            "files/models/VenStockRevamp/SmallEngines_CLR.dds",
            "files/models/VenStockRevamp/SmallEngines_LUM.dds"
        ],
        TextureDefinitions: "",
        ThrustTransformName: "thrustTransform",
        GimbalTransformName: "Gimbal",
        ModelName: "Generic thruster",
        ModelType: EngineGroupType.Fake,
        HiddenMuObjects: [],
        CanAttachOnModel: false,
        OriginalTankVolume: 0,
        RadialAttachment: false,
        RadialAttachmentPoint: 0,
        ImageSource: "img/modelPreviews/Thruster.webp",
        get ImageLabel() { return this.ModelName; },
        LookatPairs: [],
        HeatAnimations: []
    }, {
        get OriginalHeight() { return this.NodeStackTop - this.NodeStackBottom; },
        OriginalBellWidth: 0.234,
        OriginalBaseWidth: 0.616,
        PlumeSizeMultiplier: 0.225,
        PlumePositionOffset: -0.06,
        NodeStackTop: 0.0,
        NodeStackBottom: -0.393,
        ModelPath: "GenericEngines/models/VenStockRevamp/48-7S",
        ModelFiles: [
            "files/models/VenStockRevamp/48-7S.mu",
            "files/models/VenStockRevamp/SmallEngines_CLR.dds",
            "files/models/VenStockRevamp/SmallEngines_LUM.dds"
        ],
        TextureDefinitions: "",
        ThrustTransformName: "thrustTransform",
        GimbalTransformName: "Obj_Gimbal",
        ModelName: "Spark",
        ModelType: EngineGroupType.Fake,
        HiddenMuObjects: [
            "Size2A",
            "node_fairing_collider"
        ],
        CanAttachOnModel: false,
        OriginalTankVolume: 0,
        RadialAttachment: false,
        RadialAttachmentPoint: 0,
        ImageSource: "img/modelPreviews/Aestus.webp",
        get ImageLabel() { return this.ModelName; },
        LookatPairs: [
            ["Piston1", "PistonBase1"],
            ["PistonBase1", "Piston1"],
            ["Piston2", "PistonBase2"],
            ["PistonBase2", "Piston2"],
            ["Piston3", "PistonBase3"],
            ["PistonBase3", "Piston3"],
            ["Piston4", "PistonBase4"],
            ["PistonBase4", "Piston4"],
        ],
        HeatAnimations: [
            "48-7SHeat"
        ]
    }, {
        get OriginalHeight() { return this.NodeStackTop - this.NodeStackBottom; },
        OriginalBellWidth: 0.459,
        OriginalBaseWidth: 0.627,
        PlumeSizeMultiplier: 0.42,
        PlumePositionOffset: 0,
        NodeStackTop: 0.1965,
        NodeStackBottom: -0.197,
        ModelPath: "GenericEngines/models/VenStockRevamp/IonEngine",
        ModelFiles: [
            "files/models/VenStockRevamp/IonEngine.mu",
            "files/models/VenStockRevamp/Ion_CLR.dds",
            "files/models/VenStockRevamp/Ion_LUM.dds"
        ],
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
        RadialAttachmentPoint: 0,
        ImageSource: "img/modelPreviews/IonThruster.webp",
        get ImageLabel() { return this.ModelName; },
        LookatPairs: [],
        HeatAnimations: [
            "colorAnimation"
        ]
    }, {
        get OriginalHeight() { return this.NodeStackTop - this.NodeStackBottom; },
        OriginalBellWidth: 1.802,
        OriginalBaseWidth: 3.78,
        PlumeSizeMultiplier: 1.6,
        PlumePositionOffset: -0.7,
        NodeStackTop: 1.49,
        NodeStackBottom: -2.99,
        ModelPath: "GenericEngines/models/VenStockRevamp/KR-2L",
        ModelFiles: [
            "files/models/VenStockRevamp/KR-2L.mu",
            "files/models/VenStockRevamp/Size3Engines_CLR.dds",
            "files/models/VenStockRevamp/Size3Engines_LUM.dds"
        ],
        TextureDefinitions: "",
        ThrustTransformName: "thrustTransform",
        GimbalTransformName: "Nozzle",
        ModelName: "Rhino",
        ModelType: EngineGroupType.Fake,
        HiddenMuObjects: [
            "fairing"
        ],
        CanAttachOnModel: false,
        OriginalTankVolume: 0,
        RadialAttachment: false,
        RadialAttachmentPoint: 0,
        ImageSource: "img/modelPreviews/Rhino.webp",
        get ImageLabel() { return this.ModelName; },
        LookatPairs: [
            ["Piston1", "PistonBase1"],
            ["PistonBase1", "Piston1"],
            ["Piston2", "PistonBase2"],
            ["PistonBase2", "Piston2"],
            ["Piston3", "PistonBase3"],
            ["PistonBase3", "Piston3"],
            ["Piston4", "PistonBase4"],
            ["PistonBase4", "Piston4"],
        ],
        HeatAnimations: [
            "HeatAnimationAdvancedEngine"
        ]
    }, {
        get OriginalHeight() { return this.NodeStackTop - this.NodeStackBottom; },
        OriginalBellWidth: 0.445,
        OriginalBaseWidth: 0.989,
        PlumeSizeMultiplier: 0.4,
        PlumePositionOffset: -0.12,
        NodeStackTop: 0.195,
        NodeStackBottom: -0.532,
        OriginalTankVolume: 110,
        ModelPath: "GenericEngines/models/VenStockRevamp/LV900",
        ModelFiles: [
            "files/models/VenStockRevamp/LV900.mu",
            "files/models/VenStockRevamp/JebEngines_CLR.dds",
            "files/models/VenStockRevamp/JebEngines_LUM.dds"
        ],
        TextureDefinitions: "",
        ThrustTransformName: "thrustTransform",
        GimbalTransformName: "Obj_Gimbal",
        ModelName: "Beagle",
        ModelType: EngineGroupType.Fake,
        HiddenMuObjects: [
            "Size2B",
            "fairing",
            "Hoses"
        ],
        CanAttachOnModel: false,
        RadialAttachment: false,
        RadialAttachmentPoint: 0,
        ImageSource: "img/modelPreviews/RD0105T.webp",
        get ImageLabel() { return this.ModelName; },
        LookatPairs: [
            ["Piston1", "PistonBase1"],
            ["PistonBase1", "Piston1"],
            ["Piston2", "PistonBase2"],
            ["PistonBase2", "Piston2"],
            ["Piston3", "PistonBase3"],
            ["PistonBase3", "Piston3"],
            ["Piston4", "PistonBase4"],
            ["PistonBase4", "Piston4"],
        ],
        HeatAnimations: [
            "HeatAnimatioEmissiveLiquidEngine3"
        ]
    }, {
        get OriginalHeight() { return this.NodeStackTop - this.NodeStackBottom; },
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
        ModelPath: "GenericEngines/models/VenStockRevamp/BACC",
        ModelFiles: [
            "files/models/VenStockRevamp/BACC.mu",
            "files/models/VenStockRevamp/SolidBoosters_CLR.dds",
            "files/models/VenStockRevamp/SolidBoosters_LUM.dds"
        ],
        TextureDefinitions: "",
        ThrustTransformName: "thrustTransform",
        GimbalTransformName: "thrustTransform",
        ModelName: "BACC",
        ModelType: EngineGroupType.SRB,
        HiddenMuObjects: [
            "fairing"
        ],
        ImageSource: "img/modelPreviews/SRBLong.webp",
        get ImageLabel() { return this.ModelName; },
        LookatPairs: [],
        HeatAnimations: []
    }, {
        get OriginalHeight() { return this.NodeStackTop - this.NodeStackBottom; },
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
        ModelPath: "GenericEngines/models/VenStockRevamp/RT5",
        ModelFiles: [
            "files/models/VenStockRevamp/RT5.mu",
            "files/models/VenStockRevamp/SolidBoosters_CLR.dds",
            "files/models/VenStockRevamp/SolidBoosters_LUM.dds"
        ],
        TextureDefinitions: "",
        ThrustTransformName: "thrustTransform",
        GimbalTransformName: "thrustTransform",
        ModelName: "RT-5",
        ModelType: EngineGroupType.SRB,
        HiddenMuObjects: [
            "fairing"
        ],
        ImageSource: "img/modelPreviews/RT5.webp",
        get ImageLabel() { return this.ModelName; },
        LookatPairs: [],
        HeatAnimations: [
            "Flea"
        ]
    }, {
        get OriginalHeight() { return this.NodeStackTop - this.NodeStackBottom; },
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
        ModelPath: "GenericEngines/models/VenStockRevamp/RT2",
        ModelFiles: [
            "files/models/VenStockRevamp/RT2.mu",
            "files/models/VenStockRevamp/NewSolidboosters_CLR.dds",
            "files/models/VenStockRevamp/NewSolidboosters_LUM.dds"
        ],
        TextureDefinitions: "",
        ThrustTransformName: "thrustTransform",
        GimbalTransformName: "thrustTransform",
        ModelName: "RT-2",
        ModelType: EngineGroupType.SRB,
        HiddenMuObjects: [],
        ImageSource: "img/modelPreviews/RT2.webp",
        get ImageLabel() { return this.ModelName; },
        LookatPairs: [],
        HeatAnimations: [
            "RT-2"
        ]
    }, {
        get OriginalHeight() { return this.NodeStackTop - this.NodeStackBottom; },
        OriginalBellWidth: 1.043,
        OriginalBaseWidth: 1.183,
        PlumeSizeMultiplier: 1.1,
        PlumePositionOffset: 0,
        NodeStackTop: 7.445,
        NodeStackBottom: -7.365,
        RadialAttachmentPoint: 0.595,
        OriginalTankVolume: 11190,
        RadialAttachment: true,
        CanAttachOnModel: true,
        ModelPath: "GenericEngines/models/VenStockRevamp/S1",
        ModelFiles: [
            "files/models/VenStockRevamp/S1.mu",
            "files/models/VenStockRevamp/SolidBoosters_CLR.dds",
            "files/models/VenStockRevamp/SolidBoosters_LUM.dds"
        ],
        TextureDefinitions: "",
        ThrustTransformName: "thrustTransform",
        GimbalTransformName: "thrustTransform",
        ModelName: "S-1",
        ModelType: EngineGroupType.SRB,
        HiddenMuObjects: [],
        ImageSource: "img/modelPreviews/S1.webp",
        get ImageLabel() { return this.ModelName; },
        LookatPairs: [],
        HeatAnimations: [
            "HeatAnimationSRB"
        ]
    }, {
        get OriginalHeight() { return this.NodeStackTop - this.NodeStackBottom; },
        OriginalBellWidth: 0.445,
        OriginalBaseWidth: 0.991,
        PlumeSizeMultiplier: 0.4,
        PlumePositionOffset: -0.14,
        NodeStackTop: 0.193,
        NodeStackBottom: -0.44,
        ModelPath: "GenericEngines/models/VenStockRevamp/LV909",
        ModelFiles: [
            "files/models/VenStockRevamp/LV909.mu",
            "files/models/VenStockRevamp/JebEngines_CLR.dds",
            "files/models/VenStockRevamp/JebEngines_LUM.dds"
        ],
        TextureDefinitions: "",
        ThrustTransformName: "thrustTransform",
        GimbalTransformName: "Obj_Gimbal",
        ModelName: "LV-909",
        ModelType: EngineGroupType.Fake,
        HiddenMuObjects: [
            "fairing",
            "Size2B"
        ],
        CanAttachOnModel: false,
        OriginalTankVolume: 0,
        RadialAttachment: false,
        RadialAttachmentPoint: 0,
        ImageSource: "img/modelPreviews/RD0105.webp",
        get ImageLabel() { return this.ModelName; },
        LookatPairs: [
            ["Piston1", "PistonBase1"],
            ["PistonBase1", "Piston1"],
            ["Piston2", "PistonBase2"],
            ["PistonBase2", "Piston2"],
            ["Piston3", "PistonBase3"],
            ["PistonBase3", "Piston3"],
            ["Piston4", "PistonBase4"],
            ["PistonBase4", "Piston4"],
        ],
        HeatAnimations: [
            "HeatAnimatioEmissiveLiquidEngine3"
        ]
    }, {
        get OriginalHeight() { return this.NodeStackTop - this.NodeStackBottom; },
        OriginalBellWidth: 0.996,
        OriginalBaseWidth: 1.245,
        PlumeSizeMultiplier: 0.9,
        PlumePositionOffset: 0,
        NodeStackTop: 1.414,
        NodeStackBottom: -1.836,
        ModelPath: "GenericEngines/models/VenStockRevamp/LVN",
        ModelFiles: [
            "files/models/VenStockRevamp/LVN.mu",
            "files/models/VenStockRevamp/JebEngines_CLR.dds",
            "files/models/VenStockRevamp/JebEngines_LUM.dds"
        ],
        TextureDefinitions: "",
        ThrustTransformName: "thrustTransform",
        GimbalTransformName: "thrustTransform",
        ModelName: "NERVA",
        ModelType: EngineGroupType.IRL,
        HiddenMuObjects: [],
        CanAttachOnModel: false,
        OriginalTankVolume: 0,
        RadialAttachment: false,
        RadialAttachmentPoint: 0,
        ImageSource: "img/modelPreviews/NERVA.webp",
        get ImageLabel() { return this.ModelName; },
        LookatPairs: [
            ["piston1", "pistonBase1"],
            ["pistonBase1", "piston1"],
            ["piston2", "pistonBase2"],
            ["pistonBase2", "piston2"],
            ["piston3", "pistonBase3"],
            ["pistonBase3", "piston3"],
            ["piston4", "pistonBase4"],
            ["pistonBase4", "piston4"],
            ["piston5", "pistonBase5"],
            ["pistonBase5", "piston5"],
            ["piston6", "pistonBase6"],
            ["pistonBase6", "piston6"],
            ["piston7", "pistonBase7"],
            ["pistonBase7", "piston7"],
            ["piston8", "pistonBase8"],
            ["pistonBase8", "piston8"],
        ],
        HeatAnimations: [
            "overheat"
        ],
        Exhaust: {
            exhaustBellWidth: 0.098,
            exhaustThrustTransform: "exhaustTransform",
            exhaustGimbalTransform: "exhaustTransform",
            exhaustEffectTransform: "exhaustTransform",
        }
    }, {
        get OriginalHeight() { return this.NodeStackTop - this.NodeStackBottom; },
        OriginalBellWidth: 0.653,
        OriginalBaseWidth: 1.001,
        PlumeSizeMultiplier: 0.57,
        PlumePositionOffset: 0,
        NodeStackTop: 0.774,
        NodeStackBottom: -0.8,
        ModelPath: "GenericEngines/models/VenStockRevamp/LVT30",
        ModelFiles: [
            "files/models/VenStockRevamp/LVT30.mu",
            "files/models/VenStockRevamp/JebEngines_CLR.dds",
            "files/models/VenStockRevamp/JebEngines_LUM.dds"
        ],
        TextureDefinitions: "",
        ThrustTransformName: "thrustTransform",
        GimbalTransformName: "thrustTransform",
        ModelName: "LV-T30",
        ModelType: EngineGroupType.Fake,
        HiddenMuObjects: [],
        CanAttachOnModel: false,
        OriginalTankVolume: 0,
        RadialAttachment: false,
        RadialAttachmentPoint: 0,
        ImageSource: "img/modelPreviews/LVT30.webp",
        get ImageLabel() { return this.ModelName; },
        LookatPairs: [],
        HeatAnimations: [
            "LVT30"
        ],
        Exhaust: {
            exhaustBellWidth: 0.054,
            exhaustThrustTransform: "exhaustTransform",
            exhaustGimbalTransform: "exhaustTransform",
            exhaustEffectTransform: "exhaustEffect",
        }
    }, {
        get OriginalHeight() { return this.NodeStackTop - this.NodeStackBottom; },
        OriginalBellWidth: 0.602,
        OriginalBaseWidth: 0.998,
        PlumeSizeMultiplier: 0.53,
        PlumePositionOffset: 0,
        NodeStackTop: 0.75,
        NodeStackBottom: -0.893,
        ModelPath: "GenericEngines/models/VenStockRevamp/LVT45",
        ModelFiles: [
            "files/models/VenStockRevamp/LVT45.mu",
            "files/models/VenStockRevamp/JebEngines_CLR.dds",
            "files/models/VenStockRevamp/JebEngines_LUM.dds"
        ],
        TextureDefinitions: "",
        ThrustTransformName: "thrustTransform",
        GimbalTransformName: "Obj_Gimbal",
        ModelName: "LV-T45",
        ModelType: EngineGroupType.Fake,
        HiddenMuObjects: [],
        CanAttachOnModel: false,
        OriginalTankVolume: 0,
        RadialAttachment: false,
        RadialAttachmentPoint: 0,
        ImageSource: "img/modelPreviews/LVT45.webp",
        get ImageLabel() { return this.ModelName; },
        LookatPairs: [
            ["Piston1", "PistonBase1"],
            ["PistonBase1", "Piston1"],
            ["Piston2", "PistonBase2"],
            ["PistonBase2", "Piston2"],
            ["Piston3", "PistonBase3"],
            ["PistonBase3", "Piston3"],
            ["Piston4", "PistonBase4"],
            ["PistonBase4", "Piston4"],
        ],
        HeatAnimations: [
            "LV45Heat"
        ],
        Exhaust: {
            exhaustBellWidth: 0.054,
            exhaustThrustTransform: "exhaustTransform",
            exhaustGimbalTransform: "exhaustTransform",
            exhaustEffectTransform: "exhaustEffect",
        }
    }, {
        get OriginalHeight() { return this.NodeStackTop - this.NodeStackBottom; },
        OriginalBellWidth: 0.226,
        OriginalBaseWidth: 0.584,
        PlumeSizeMultiplier: 0.19,
        PlumePositionOffset: -0.075,
        NodeStackTop: 0.02,
        NodeStackBottom: -0.595,
        ModelPath: "GenericEngines/models/VenStockRevamp/105-7P",
        ModelFiles: [
            "files/models/VenStockRevamp/105-7P.mu",
            "files/models/VenStockRevamp/SmallEngines_CLR.dds",
            "files/models/VenStockRevamp/SmallEngines_LUM.dds"
        ],
        TextureDefinitions: "",
        ThrustTransformName: "thrustTransform",
        GimbalTransformName: "nozzle",
        ModelName: "105-7P",
        ModelType: EngineGroupType.Fake,
        HiddenMuObjects: [
            "Size2A",
            "node_fairing_collider"
        ],
        CanAttachOnModel: false,
        OriginalTankVolume: 0,
        RadialAttachment: false,
        RadialAttachmentPoint: 0,
        ImageSource: "img/modelPreviews/P1057.webp",
        get ImageLabel() { return this.ModelName; },
        LookatPairs: [
            ["Piston1", "PistonBase1"],
            ["PistonBase1", "Piston1"],
            ["Piston2", "PistonBase2"],
            ["PistonBase2", "Piston2"],
            ["Piston3", "PistonBase3"],
            ["PistonBase3", "Piston3"],
            ["Piston4", "PistonBase4"],
            ["PistonBase4", "Piston4"],
            ["Piston5", "PistonBase5"],
            ["PistonBase5", "Piston5"],
            ["Piston6", "PistonBase6"],
            ["PistonBase6", "Piston6"],
            ["Piston7", "PistonBase7"],
            ["PistonBase7", "Piston7"],
            ["Piston8", "PistonBase8"],
            ["PistonBase8", "Piston8"],
        ],
        HeatAnimations: [
            "105-7PHeat"
        ]
    }, {
        get OriginalHeight() { return this.NodeStackTop - this.NodeStackBottom; },
        OriginalBellWidth: 0.773,
        OriginalBaseWidth: 0.653,
        PlumeSizeMultiplier: 0.72,
        PlumePositionOffset: -0.3,
        NodeStackTop: -0.012,
        NodeStackBottom: -1.24,
        ModelPath: "GenericEngines/models/VenStockRevamp/OMS-L",
        ModelFiles: [
            "files/models/VenStockRevamp/OMS-L.mu",
            "files/models/VenStockRevamp/RCS_CLR.dds",
            "files/models/VenStockRevamp/RCS_NRM.dds"
        ],
        TextureDefinitions: "",
        ThrustTransformName: "thrustTransform",
        GimbalTransformName: "Nozzle",
        ModelName: "OMS-L",
        ModelType: EngineGroupType.Fake,
        HiddenMuObjects: [],
        CanAttachOnModel: false,
        OriginalTankVolume: 0,
        RadialAttachment: false,
        RadialAttachmentPoint: 0,
        ImageSource: "img/modelPreviews/OMSL.webp",
        get ImageLabel() { return this.ModelName; },
        LookatPairs: [],
        HeatAnimations: []
    }, {
        get OriginalHeight() { return this.NodeStackTop - this.NodeStackBottom; },
        OriginalBellWidth: 1.225,
        OriginalBaseWidth: 1.192,
        PlumeSizeMultiplier: 1.12,
        PlumePositionOffset: 0.0,
        NodeStackTop: 0.817,
        NodeStackBottom: -0.702,
        ModelPath: "GenericEngines/models/VenStockRevamp/Poodle",
        ModelFiles: [
            "files/models/VenStockRevamp/Poodle.mu",
            "files/models/VenStockRevamp/RockoMaxEngines_CLR.dds",
            "files/models/VenStockRevamp/RockoMaxEngines_LUM.dds"
        ],
        TextureDefinitions: "",
        ThrustTransformName: "thrustTransform",
        GimbalTransformName: "Obj_Gimbal",
        ModelName: "Poodle",
        ModelType: EngineGroupType.Fake,
        HiddenMuObjects: [],
        CanAttachOnModel: false,
        OriginalTankVolume: 0,
        RadialAttachment: false,
        RadialAttachmentPoint: 0,
        ImageSource: "img/modelPreviews/Poodle.webp",
        get ImageLabel() { return this.ModelName; },
        LookatPairs: [],
        HeatAnimations: [
            "overheatService"
        ]
    }, {
        get OriginalHeight() { return this.NodeStackTop - this.NodeStackBottom; },
        OriginalBellWidth: 0.9,
        OriginalBaseWidth: 2.54,
        PlumeSizeMultiplier: 0.82,
        PlumePositionOffset: 0,
        NodeStackTop: 0.6,
        NodeStackBottom: -1.267,
        ModelPath: "GenericEngines/models/VenStockRevamp/PoodleLargeNTR",
        ModelFiles: [
            "files/models/VenStockRevamp/PoodleLargeNTR.mu",
            "files/models/VenStockRevamp/RockoMaxEngines_CLR.dds",
            "files/models/VenStockRevamp/RockoMaxEngines_LUM.dds"
        ],
        TextureDefinitions: "",
        ThrustTransformName: "thrustTransform",
        GimbalTransformName: "thrustTransform",
        ModelName: "Sphere NTR",
        ModelType: EngineGroupType.Fake,
        HiddenMuObjects: [],
        CanAttachOnModel: false,
        OriginalTankVolume: 0,
        RadialAttachment: false,
        RadialAttachmentPoint: 0,
        ImageSource: "img/modelPreviews/BallNuke.webp",
        get ImageLabel() { return this.ModelName; },
        LookatPairs: [],
        HeatAnimations: [
            "ShortNTR"
        ]
    }, {
        get OriginalHeight() { return this.NodeStackTop - this.NodeStackBottom; },
        OriginalBellWidth: 0.407,
        OriginalBaseWidth: 0.585,
        PlumeSizeMultiplier: 0.36,
        PlumePositionOffset: -0.03,
        NodeStackTop: 0.065,
        NodeStackBottom: -0.702,
        ModelPath: "GenericEngines/models/VenStockRevamp/PoodleNTR",
        ModelFiles: [
            "files/models/VenStockRevamp/PoodleNTR.mu",
            "files/models/VenStockRevamp/SmallEngines_CLR.dds",
            "files/models/VenStockRevamp/SmallEngines_LUM.dds"
        ],
        TextureDefinitions: "",
        ThrustTransformName: "thrustTransform",
        GimbalTransformName: "thrustTransform",
        ModelName: "Small Sphere NTR",
        ModelType: EngineGroupType.Fake,
        HiddenMuObjects: [
            "Size1B",
            "fairing"
        ],
        CanAttachOnModel: false,
        OriginalTankVolume: 0,
        RadialAttachment: false,
        RadialAttachmentPoint: 0,
        ImageSource: "img/modelPreviews/BallNukeS.webp",
        get ImageLabel() { return this.ModelName; },
        LookatPairs: [],
        HeatAnimations: [
            "PoodleHeat"
        ]
    }, {
        get OriginalHeight() { return this.NodeStackTop - this.NodeStackBottom; },
        OriginalBellWidth: 0.16,
        OriginalBaseWidth: 0.2504,
        PlumeSizeMultiplier: 0.145,
        PlumePositionOffset: 0,
        NodeStackTop: 0.119,
        NodeStackBottom: -0.2324,
        ModelPath: "GenericEngines/models/VenStockRevamp/Size2MedEngineB",
        ModelFiles: [
            "files/models/VenStockRevamp/Size2MedEngineB.mu",
            "files/models/VenStockRevamp/RockoMaxEnginesB_CLR.dds",
            "files/models/VenStockRevamp/RockoMaxEnginesB_LUM.dds"
        ],
        TextureDefinitions: "",
        ThrustTransformName: "thrustTransform",
        GimbalTransformName: "Nozzle",
        ModelName: "Gas Generator",
        ModelType: EngineGroupType.Fake,
        HiddenMuObjects: [],
        CanAttachOnModel: false,
        OriginalTankVolume: 0,
        RadialAttachment: false,
        RadialAttachmentPoint: 0,
        ImageSource: "img/modelPreviews/Skipper.webp",
        get ImageLabel() { return this.ModelName; },
        LookatPairs: [
            ["Piston1", "pistonBase1"],
            ["pistonBase1", "Piston1"],
            ["Piston2", "pistonBase2"],
            ["pistonBase2", "Piston2"],
            ["Piston3", "pistonBase3"],
            ["pistonBase3", "Piston3"],
            ["Piston4", "pistonBase4"],
            ["pistonBase4", "Piston4"],
        ],
        HeatAnimations: [
            "Size2MedEngineBEmmissive"
        ],
        Exhaust: {
            exhaustBellWidth: 0.0252,
            exhaustThrustTransform: "exhaustTransform",
            exhaustGimbalTransform: "exhaustTransform",
            exhaustEffectTransform: "exhaustEffect",
        }
    }, {
        get OriginalHeight() { return this.NodeStackTop - this.NodeStackBottom; },
        OriginalBellWidth: 0.01155,
        OriginalBaseWidth: 0.01,
        PlumeSizeMultiplier: 0.001,
        PlumePositionOffset: 0.0,
        NodeStackTop: 0.0063,
        NodeStackBottom: -0.01534,
        ModelPath: "GenericEngines/models/VenStockRevamp/Skipper",
        ModelFiles: [
            "files/models/VenStockRevamp/Skipper.mu",
            "files/models/VenStockRevamp/RockoMaxEngines_CLR.dds",
            "files/models/VenStockRevamp/RockoMaxEngines_LUM.dds"
        ],
        TextureDefinitions: "",
        ThrustTransformName: "thrustTransform",
        GimbalTransformName: "Obj_Gimbal",
        ModelName: "Skipper",
        ModelType: EngineGroupType.Fake,
        HiddenMuObjects: [],
        CanAttachOnModel: false,
        OriginalTankVolume: 0,
        RadialAttachment: false,
        RadialAttachmentPoint: 0,
        ImageSource: "img/modelPreviews/SkipperR.webp",
        get ImageLabel() { return this.ModelName; },
        LookatPairs: [
            ["Piston1", "PistonBase1"],
            ["PistonBase1", "Piston1"],
            ["Piston2", "PistonBase2"],
            ["PistonBase2", "Piston2"],
            ["Piston3", "PistonBase3"],
            ["PistonBase3", "Piston3"],
            ["Piston4", "PistonBase4"],
            ["PistonBase4", "Piston4"],
        ],
        HeatAnimations: [
            "ksp_l_midrangeEngine_anim"
        ]
    }, {
        get OriginalHeight() { return this.NodeStackTop - this.NodeStackBottom; },
        OriginalBellWidth: 1.96,
        OriginalBaseWidth: 3.73,
        PlumeSizeMultiplier: 1.8,
        PlumePositionOffset: -1,
        NodeStackTop: 0.3,
        NodeStackBottom: -8.06,
        ModelPath: "GenericEngines/models/SXT/NERVA/model",
        ModelFiles: [
            "files/models/SXT/NERVA/model.mu",
            "files/models/SXT/NERVA/fairing.dds",
            "files/models/SXT/NERVA/model000.dds",
            "files/models/SXT/NERVA/model001_NRM.dds",
            "files/models/SXT/NERVA/model002.dds"
        ],
        TextureDefinitions: `
                texture = model000 , Squad/Parts/Engine/liquidEngineLV-N/model000
                texture = model001_NRM , Squad/Parts/Engine/liquidEngineLV-N/model001
                texture = model002 , Squad/Parts/Engine/liquidEngineLV-N/model002
                texture = fairing , Squad/Parts/Engine/liquidEngineLV-N/model003
            `,
        ThrustTransformName: "thrustTransform",
        GimbalTransformName: "thrustTransform",
        ModelName: "NERVA 2",
        ModelType: EngineGroupType.IRL,
        HiddenMuObjects: [
            "fairing"
        ],
        CanAttachOnModel: false,
        OriginalTankVolume: 0,
        RadialAttachment: false,
        RadialAttachmentPoint: 0,
        ImageSource: "img/modelPreviews/NERVA2.webp",
        get ImageLabel() { return this.ModelName; },
        LookatPairs: [],
        HeatAnimations: [
            "nerva"
        ]
    }, {
        get OriginalHeight() { return this.NodeStackTop - this.NodeStackBottom; },
        OriginalBellWidth: 2.074,
        OriginalBaseWidth: 2.895,
        PlumeSizeMultiplier: 1.8,
        PlumePositionOffset: 0,
        NodeStackTop: 0.05,
        NodeStackBottom: -5.74,
        ModelPath: "GenericEngines/models/SXT/NERVA/portlyman",
        ModelFiles: [
            "files/models/SXT/NERVA/portlyman.mu",
            "files/models/SXT/NERVA/fairing.dds",
            "files/models/SXT/NERVA/model000.dds",
            "files/models/SXT/NERVA/model001_NRM.dds",
            "files/models/SXT/NERVA/model002.dds"
        ],
        TextureDefinitions: `
                texture = model000 , Squad/Parts/Engine/liquidEngineLV-N/model000
                texture = model001_NRM , Squad/Parts/Engine/liquidEngineLV-N/model001	
                texture = model002 , Squad/Parts/Engine/liquidEngineLV-N/model002
                texture = fairing , Squad/Parts/Engine/liquidEngineLV-N/model003
            `,
        ThrustTransformName: "thrustTransform",
        GimbalTransformName: "thrustTransform",
        ModelName: "NERVA wide",
        ModelType: EngineGroupType.Fake,
        HiddenMuObjects: [],
        CanAttachOnModel: false,
        OriginalTankVolume: 0,
        RadialAttachment: false,
        RadialAttachmentPoint: 0,
        ImageSource: "img/modelPreviews/NERVAwide.webp",
        get ImageLabel() { return this.ModelName; },
        LookatPairs: [],
        HeatAnimations: [
            "nerva"
        ]
    }, {
        get OriginalHeight() { return this.NodeStackTop - this.NodeStackBottom; },
        OriginalBellWidth: 0.5,
        OriginalBaseWidth: 2,
        PlumeSizeMultiplier: 0.43,
        PlumePositionOffset: 0.12,
        NodeStackTop: 0,
        NodeStackBottom: -0.288,
        ModelPath: "GenericEngines/models/SXT/Kopo4e/model",
        ModelFiles: [
            "files/models/SXT/Kopo4e/model.mu",
            "files/models/SXT/Kopo4e/model000.dds",
            "files/models/SXT/Kopo4e/model002.dds"
        ],
        TextureDefinitions: `
                texture = model000 , Squad/Parts/Engine/liquidEngineSkipper/ksp_l_midrangeEngine_diff
                texture = model002 , Squad/Parts/Engine/liquidEngineSkipper/ksp_l_midrangeEngine_emissive
            `,
        ThrustTransformName: "thrustTransform",
        GimbalTransformName: "obj_gimbal",
        ModelName: "Pancake",
        ModelType: EngineGroupType.Fake,
        HiddenMuObjects: [],
        CanAttachOnModel: true,
        OriginalTankVolume: 0,
        RadialAttachment: false,
        RadialAttachmentPoint: 0,
        ImageSource: "img/modelPreviews/Pancake.webp",
        get ImageLabel() { return this.ModelName; },
        LookatPairs: [],
        HeatAnimations: [
            "kopo4e"
        ]
    }, {
        get OriginalHeight() { return this.NodeStackTop - this.NodeStackBottom; },
        OriginalBellWidth: 0.512,
        OriginalBaseWidth: 1.25,
        PlumeSizeMultiplier: 0.44,
        PlumePositionOffset: 0.0,
        NodeStackTop: 0.594,
        NodeStackBottom: -0.75,
        ModelPath: "GenericEngines/models/SXT/KickMotor/model",
        ModelFiles: [
            "files/models/SXT/KickMotor/model.mu",
            "files/models/SXT/KickMotor/model000.dds",
            "files/models/SXT/KickMotor/model001.dds",
            "files/models/SXT/KickMotor/model002.dds"
        ],
        TextureDefinitions: `
                texture = model000 , Squad/Parts/Engine/solidBoosterBACC/model000
                texture = model002 , Squad/Parts/Engine/solidBoosterBACC/model002
            `,
        ThrustTransformName: "thrustTransform",
        GimbalTransformName: "thrustTransform",
        ModelName: "RT-3",
        ModelType: EngineGroupType.Fake,
        HiddenMuObjects: [],
        CanAttachOnModel: true,
        OriginalTankVolume: 607,
        RadialAttachment: true,
        RadialAttachmentPoint: 0.625,
        ImageSource: "img/modelPreviews/RT3.webp",
        get ImageLabel() { return this.ModelName; },
        LookatPairs: [],
        HeatAnimations: [
            "castoranim"
        ]
    }, {
        get OriginalHeight() { return this.NodeStackTop - this.NodeStackBottom; },
        OriginalBellWidth: 1.517,
        OriginalBaseWidth: 3.74,
        PlumeSizeMultiplier: 1.33,
        PlumePositionOffset: -0.23,
        NodeStackTop: 0.1,
        NodeStackBottom: -3.54,
        ModelPath: "GenericEngines/models/SXT/K170/model",
        ModelFiles: [
            "files/models/SXT/K170/model.mu",
            "files/models/SXT/K170/model000.dds",
            "files/models/SXT/K170/model001_NRM.dds",
            "files/models/SXT/K170/model002.dds"
        ],
        TextureDefinitions: `
                texture = model000 , Squad/Parts/Engine/liquidEngineSkipper/ksp_l_midrangeEngine_diff
                texture = model001_NRM , Squad/Parts/Engine/liquidEngineSkipper/ksp_l_midrangeEngine_normal
                texture = model002 , Squad/Parts/Engine/liquidEngineSkipper/ksp_l_midrangeEngine_emissive
            `,
        ThrustTransformName: "thrustTransform",
        GimbalTransformName: "obj_gimbal",
        ModelName: "RD-170",
        ModelType: EngineGroupType.IRL,
        HiddenMuObjects: [],
        CanAttachOnModel: false,
        OriginalTankVolume: 0,
        RadialAttachment: false,
        RadialAttachmentPoint: 0,
        ImageSource: "img/modelPreviews/RD170.webp",
        get ImageLabel() { return this.ModelName; },
        LookatPairs: [],
        HeatAnimations: [
            "k170heat"
        ]
    }, {
        get OriginalHeight() { return this.NodeStackTop - this.NodeStackBottom; },
        OriginalBellWidth: 1.671,
        OriginalBaseWidth: 2.548,
        PlumeSizeMultiplier: 1.45,
        PlumePositionOffset: -0.4,
        NodeStackTop: 0.7,
        NodeStackBottom: -1.92,
        ModelPath: "GenericEngines/models/SXT/K170/model25m",
        ModelFiles: [
            "files/models/SXT/K170/model25m.mu",
            "files/models/SXT/K170/fairing.dds",
            "files/models/SXT/K170/model000.dds",
            "files/models/SXT/K170/model001_NRM.dds",
            "files/models/SXT/K170/model002.dds"
        ],
        TextureDefinitions: `
                texture = model000 , Squad/Parts/Engine/liquidEngineSkipper/ksp_l_midrangeEngine_diff
                texture = model001_NRM , Squad/Parts/Engine/liquidEngineSkipper/ksp_l_midrangeEngine_normal
                texture = model002 , Squad/Parts/Engine/liquidEngineSkipper/ksp_l_midrangeEngine_emissive
                texture = fairing , Squad/Parts/Engine/liquidEngineLV-T45/model002
            `,
        ThrustTransformName: "thrustTransform",
        GimbalTransformName: "obj_gimbal",
        ModelName: "RD-0120 (Shroud)",
        ModelType: EngineGroupType.IRL,
        HiddenMuObjects: [
            "bottom"
        ],
        CanAttachOnModel: false,
        OriginalTankVolume: 0,
        RadialAttachment: false,
        RadialAttachmentPoint: 0,
        ImageSource: "img/modelPreviews/RD0120.webp",
        get ImageLabel() { return this.ModelName; },
        LookatPairs: [],
        HeatAnimations: [
            "25midenganim"
        ]
    }, {
        get OriginalHeight() { return this.NodeStackTop - this.NodeStackBottom; },
        OriginalBellWidth: 0.143,
        OriginalBaseWidth: 0.361,
        PlumeSizeMultiplier: 0.11,
        PlumePositionOffset: 0,
        NodeStackTop: -0.034,
        NodeStackBottom: -0.49,
        ModelPath: "GenericEngines/models/SXT/BlackAdder/gamma2",
        ModelFiles: [
            "files/models/SXT/BlackAdder/gamma2.mu",
            "files/models/SXT/BlackAdder/model000.dds",
            "files/models/SXT/BlackAdder/model001.dds",
            "files/models/SXT/BlackAdder/fairing.dds"
        ],
        TextureDefinitions: `
                texture = model000 , Squad/Parts/Engine/liquidEngineLV-T45/model000
                texture = model001 , Squad/Parts/Engine/liquidEngineLV-T45/model001	
                texture = fairing , Squad/Parts/Engine/liquidEngineLV-T45/model002
            `,
        ThrustTransformName: "thrustTransform",
        GimbalTransformName: "thrustTransform",
        ModelName: "Gamma 2",
        ModelType: EngineGroupType.IRL,
        HiddenMuObjects: [
            "bottom",
            "Cylinder"
        ],
        CanAttachOnModel: false,
        OriginalTankVolume: 0,
        RadialAttachment: false,
        RadialAttachmentPoint: 0,
        ImageSource: "img/modelPreviews/Gamma2.webp",
        get ImageLabel() { return this.ModelName; },
        LookatPairs: [],
        HeatAnimations: [
            "blackadderheatanim"
        ]
    }, {
        get OriginalHeight() { return this.NodeStackTop - this.NodeStackBottom; },
        OriginalBellWidth: 0.142,
        OriginalBaseWidth: 1.031,
        PlumeSizeMultiplier: 0.10,
        PlumePositionOffset: -0.05,
        NodeStackTop: 0,
        NodeStackBottom: -0.575,
        ModelPath: "GenericEngines/models/SXT/BlackAdder/model",
        ModelFiles: [
            "files/models/SXT/BlackAdder/model.mu",
            "files/models/SXT/BlackAdder/model000.dds",
            "files/models/SXT/BlackAdder/model001.dds"
        ],
        TextureDefinitions: `
                texture = model000 , Squad/Parts/Engine/liquidEngineLV-T45/model000
                texture = model001 , Squad/Parts/Engine/liquidEngineLV-T45/model001	
            `,
        ThrustTransformName: "thrustTransform",
        GimbalTransformName: "thrustTransform",
        ModelName: "Gamma 8",
        ModelType: EngineGroupType.IRL,
        HiddenMuObjects: [],
        CanAttachOnModel: true,
        OriginalTankVolume: 0,
        RadialAttachment: false,
        RadialAttachmentPoint: 0,
        ImageSource: "img/modelPreviews/Gamma8.webp",
        get ImageLabel() { return this.ModelName; },
        LookatPairs: [],
        HeatAnimations: [
            "blackadderheatanim"
        ]
    }, {
        get OriginalHeight() { return this.NodeStackTop - this.NodeStackBottom; },
        OriginalBellWidth: 1.66,
        OriginalBaseWidth: 0.87,
        PlumeSizeMultiplier: 1.45,
        PlumePositionOffset: -0.5,
        NodeStackTop: 0.02,
        NodeStackBottom: -2.44,
        ModelPath: "GenericEngines/models/SSTU/AJ10-137/SC-ENG-AJ10-137",
        ModelFiles: [
            "files/models/SSTU/AJ10-137/SC-ENG-AJ10-137.mu",
            "files/models/SSTU/AJ10-137/SC-ENG-AJ10-137-DIFF.dds",
            "files/models/SSTU/AJ10-137/SC-ENG-AJ10-137-GLOW.dds",
            "files/models/SSTU/AJ10-137/SC-ENG-AJ10-137-NRM.dds"
        ],
        TextureDefinitions: "",
        ThrustTransformName: "AJ10-137-ThrustTransform",
        GimbalTransformName: "AJ10-137-Bell",
        ModelName: "AJ10-137",
        ModelType: EngineGroupType.IRL,
        HiddenMuObjects: [],
        CanAttachOnModel: false,
        OriginalTankVolume: 0,
        RadialAttachment: false,
        RadialAttachmentPoint: 0,
        ImageSource: "img/modelPreviews/AJ10_137.webp",
        get ImageLabel() { return this.ModelName; },
        LookatPairs: [
            ["AJ10-137-Target-Upper1", "AJ10-137-Strut-Lower1"],
            ["AJ10-137-Target-Lower1", "AJ10-137-Strut-Upper1"],
            ["AJ10-137-Target-Upper2", "AJ10-137-Strut-Lower2"],
            ["AJ10-137-Target-Lower2", "AJ10-137-Strut-Upper2"],
            ["AJ10-137-Target-Upper3", "AJ10-137-Strut-Lower3"],
            ["AJ10-137-Target-Lower3", "AJ10-137-Strut-Upper3"],
            ["AJ10-137-Target-Upper4", "AJ10-137-Strut-Lower4"],
            ["AJ10-137-Target-Lower4", "AJ10-137-Strut-Upper4"],
            ["AJ10-137-Target-Fuel1", "AJ10-137-FuelJoint1"],
            ["AJ10-137-Target-Fuel2", "AJ10-137-FuelJoint2"],
        ],
        HeatAnimations: []
    }, {
        get OriginalHeight() { return this.NodeStackTop - this.NodeStackBottom; },
        OriginalBellWidth: 0.707,
        OriginalBaseWidth: 0.366,
        PlumeSizeMultiplier: 0.61,
        PlumePositionOffset: -0.23,
        NodeStackTop: -0.001,
        NodeStackBottom: -1.25,
        ModelPath: "GenericEngines/models/SSTU/AJ10-190/SC-ENG-AJ10-190",
        ModelFiles: [
            "files/models/SSTU/AJ10-190/SC-ENG-AJ10-190.mu",
            "files/models/SSTU/AJ10-190/SC-ENG-AJ10-190-DIFF.dds",
            "files/models/SSTU/AJ10-190/SC-ENG-AJ10-190-GLOW.dds",
            "files/models/SSTU/AJ10-190/SC-ENG-AJ10-190-NRM.dds"
        ],
        TextureDefinitions: "",
        ThrustTransformName: "AJ10-190-ThrustTransform",
        GimbalTransformName: "AJ10-190-GimbalYRing",
        ModelName: "AJ10-190",
        ModelType: EngineGroupType.IRL,
        HiddenMuObjects: [],
        CanAttachOnModel: false,
        OriginalTankVolume: 0,
        RadialAttachment: false,
        RadialAttachmentPoint: 0,
        ImageSource: "img/modelPreviews/AJ10_190.webp",
        get ImageLabel() { return this.ModelName; },
        LookatPairs: [
            ["AJ10-190-Strut-Lower1", "AJ10-190-Strut-Upper1"],
            ["AJ10-190-Strut-Upper1", "AJ10-190-Strut-Lower1"],
            ["AJ10-190-Strut-Lower2", "AJ10-190-Strut-Upper2"],
            ["AJ10-190-Strut-Upper2", "AJ10-190-Strut-Lower2"],
            ["AJ10-190-Target-Fuel1", "AJ10-190-FuelJoint1"],
            ["AJ10-190-Target-Fuel2", "AJ10-190-FuelJoint2"],
        ],
        HeatAnimations: []
    }, {
        get OriginalHeight() { return this.NodeStackTop - this.NodeStackBottom; },
        OriginalBellWidth: 2.446,
        OriginalBaseWidth: 2.017,
        PlumeSizeMultiplier: 2.1,
        PlumePositionOffset: -0.7,
        NodeStackTop: -0.01,
        NodeStackBottom: -4.1,
        ModelPath: "GenericEngines/models/SSTU/F1/SC-ENG-F1",
        ModelFiles: [
            "files/models/SSTU/F1/SC-ENG-F1.mu",
            "files/models/SSTU/F1/SC-ENG-F1-DIFF.dds",
            "files/models/SSTU/F1/SC-ENG-F1-GLOW.dds",
            "files/models/SSTU/F1/SC-ENG-F1-NRM.dds"
        ],
        TextureDefinitions: "",
        ThrustTransformName: "F1-ThrustTransform",
        GimbalTransformName: "F1-Bell",
        ModelName: "F-1",
        ModelType: EngineGroupType.IRL,
        HiddenMuObjects: [],
        CanAttachOnModel: false,
        OriginalTankVolume: 0,
        RadialAttachment: false,
        RadialAttachmentPoint: 0,
        ImageSource: "img/modelPreviews/F1.webp",
        get ImageLabel() { return this.ModelName; },
        LookatPairs: [
            ["F1-Target-LeftLower", "F1-Strut-LeftUpper"],
            ["F1-Target-LeftUpper", "F1-Strut-LeftLower"],
            ["F1-Target-RightLower", "F1-Strut-RightUpper"],
            ["F1-Target-RightUpper", "F1-Strut-RightLower"],
            ["F1-Target-FuelLeft", "F1-FuelLineLeft"],
            ["F1-Target-FuelRight", "F1-FuelLineRight"],
            ["F1-Target-FuelCenter", "F1-FuelLineCenter"],
        ],
        HeatAnimations: []
    }, {
        get OriginalHeight() { return this.NodeStackTop - this.NodeStackBottom; },
        OriginalBellWidth: 2.165,
        OriginalBaseWidth: 2.007,
        PlumeSizeMultiplier: 1.86,
        PlumePositionOffset: 0,
        NodeStackTop: -0.0075,
        NodeStackBottom: -3.25,
        ModelPath: "GenericEngines/models/SSTU/F1B/SC-ENG-F1B",
        ModelFiles: [
            "files/models/SSTU/F1B/SC-ENG-F1B.mu",
            "files/models/SSTU/F1B/SC-ENG-F1B-DIFF.dds",
            "files/models/SSTU/F1B/SC-ENG-F1B-GLOW.dds",
            "files/models/SSTU/F1B/SC-ENG-F1B-NRM.dds"
        ],
        TextureDefinitions: "",
        ThrustTransformName: "F1B-ThrustTransform",
        GimbalTransformName: "F1B-Bell",
        ModelName: "F-1B",
        ModelType: EngineGroupType.IRL,
        HiddenMuObjects: [],
        CanAttachOnModel: false,
        OriginalTankVolume: 0,
        RadialAttachment: false,
        RadialAttachmentPoint: 0,
        ImageSource: "img/modelPreviews/F1B.webp",
        get ImageLabel() { return this.ModelName; },
        LookatPairs: [
            ["F1B-Target-LeftUpper", "F1B-Strut-LeftLower"],
            ["F1B-Target-LeftLower", "F1B-Strut-LeftUpper"],
            ["F1B-Target-RightUpper", "F1B-Strut-RightLower"],
            ["F1B-Target-RightLower", "F1B-Strut-RightUpper"],
            ["F1B-Target-FuelLeft", "F1B-FuelLineLeft"],
            ["F1B-Target-FuelRight", "F1B-FuelLineRight"],
            ["F1B-Target-FuelCenter", "F1B-FuelLineCenter"],
        ],
        HeatAnimations: [],
        Exhaust: {
            exhaustBellWidth: 0.4,
            exhaustThrustTransform: "exhaustTransform",
            exhaustGimbalTransform: "exhaustTransform",
            exhaustEffectTransform: "exhaustEffect",
        }
    }, {
        get OriginalHeight() { return this.NodeStackTop - this.NodeStackBottom; },
        OriginalBellWidth: 0.757,
        OriginalBaseWidth: 0.97,
        PlumeSizeMultiplier: 0.66,
        PlumePositionOffset: -0.3,
        NodeStackTop: -0.005,
        NodeStackBottom: -1.68,
        ModelPath: "GenericEngines/models/SSTU/H-1/SC-ENG-H-1",
        ModelFiles: [
            "files/models/SSTU/H-1/SC-ENG-H-1.mu",
            "files/models/SSTU/H-1/SC-ENG-H-1-DIFF.dds",
            "files/models/SSTU/H-1/SC-ENG-H-1-GLOW.dds",
            "files/models/SSTU/H-1/SC-ENG-H-1-NRM.dds"
        ],
        TextureDefinitions: "",
        ThrustTransformName: "H-1-ThrustTransform",
        GimbalTransformName: "H-1-Bell",
        ModelName: "H-1",
        ModelType: EngineGroupType.IRL,
        HiddenMuObjects: [],
        CanAttachOnModel: false,
        OriginalTankVolume: 0,
        RadialAttachment: false,
        RadialAttachmentPoint: 0,
        ImageSource: "img/modelPreviews/H1.webp",
        get ImageLabel() { return this.ModelName; },
        LookatPairs: [
            ["H-1-Target-LeftUpper", "H-1-Strut-LeftLower"],
            ["H-1-Target-LeftLower", "H-1-Strut-LeftUpper"],
            ["H-1-Target-RightUpper", "H-1-Strut-RightLower"],
            ["H-1-Target-RightLower", "H-1-Strut-RightUpper"],
            ["H-1-Target-FuelLeft", "H-1-FuelJointLeft"],
            ["H-1-Target-FuelRight", "H-1-FuelJointRight"],
        ],
        HeatAnimations: []
    }, {
        get OriginalHeight() { return this.NodeStackTop - this.NodeStackBottom; },
        OriginalBellWidth: 1.332,
        OriginalBaseWidth: 0.841,
        PlumeSizeMultiplier: 1.2,
        PlumePositionOffset: -0.42,
        NodeStackTop: -0.01,
        NodeStackBottom: -2.1,
        ModelPath: "GenericEngines/models/SSTU/J-2/SC-ENG-J-2",
        ModelFiles: [
            "files/models/SSTU/J-2/SC-ENG-J-2.mu",
            "files/models/SSTU/J-2/SC-ENG-J-2-DIFF.dds",
            "files/models/SSTU/J-2/SC-ENG-J-2-GLOW.dds",
            "files/models/SSTU/J-2/SC-ENG-J-2-NRM.dds"
        ],
        TextureDefinitions: "",
        ThrustTransformName: "J-2-ThrustTransform",
        GimbalTransformName: "J-2-Bell",
        ModelName: "J-2",
        ModelType: EngineGroupType.IRL,
        HiddenMuObjects: [],
        CanAttachOnModel: false,
        OriginalTankVolume: 0,
        RadialAttachment: false,
        RadialAttachmentPoint: 0,
        ImageSource: "img/modelPreviews/J2.webp",
        get ImageLabel() { return this.ModelName; },
        LookatPairs: [
            ["J-2-Target-LeftUpper", "J-2-Strut-LeftLower"],
            ["J-2-Target-LeftLower", "J-2-Strut-LeftUpper"],
            ["J-2-Target-RightUpper", "J-2-Strut-RightLower"],
            ["J-2-Target-RightLower", "J-2-Strut-RightUpper"],
            ["J-2-Target-FuelLeft", "J-2-FuelLineLeft"],
            ["J-2-Target-FuelRight", "J-2-FuelLineRight"],
        ],
        HeatAnimations: []
    }, {
        get OriginalHeight() { return this.NodeStackTop - this.NodeStackBottom; },
        OriginalBellWidth: 1.943,
        OriginalBaseWidth: 1.575,
        PlumeSizeMultiplier: 1.75,
        PlumePositionOffset: -0.7,
        NodeStackTop: -0.02,
        NodeStackBottom: -3.22,
        ModelPath: "GenericEngines/models/SSTU/J-2X/SC-ENG-J-2X",
        ModelFiles: [
            "files/models/SSTU/J-2X/SC-ENG-J-2X.mu",
            "files/models/SSTU/J-2X/SC-ENG-J-2X-DIFF.dds",
            "files/models/SSTU/J-2X/SC-ENG-J-2X-GLOW.dds",
            "files/models/SSTU/J-2X/SC-ENG-J-2X-NRM.dds"
        ],
        TextureDefinitions: "",
        ThrustTransformName: "J-2X-ThrustTransform",
        GimbalTransformName: "J-2X-Bell",
        ModelName: "J-2X",
        ModelType: EngineGroupType.IRL,
        HiddenMuObjects: [],
        CanAttachOnModel: false,
        OriginalTankVolume: 0,
        RadialAttachment: false,
        RadialAttachmentPoint: 0,
        ImageSource: "img/modelPreviews/J2X.webp",
        get ImageLabel() { return this.ModelName; },
        LookatPairs: [
            ["J-2X-Target-LowerLeft", "J-2X-Strut-UpperLeft"],
            ["J-2X-Target-UpperLeft", "J-2X-Strut-LowerLeft"],
            ["J-2X-Target-LowerRight", "J-2X-Strut-UpperRight"],
            ["J-2X-Target-UpperRight", "J-2X-Strut-LowerRight"],
            ["J-2X-Target-FuelLeft", "J-2X-FuelLineLeft"],
            ["J-2X-Target-FuelRight", "J-2X-FuelLineRight"],
        ],
        HeatAnimations: []
    }, {
        get OriginalHeight() { return this.NodeStackTop - this.NodeStackBottom; },
        OriginalBellWidth: 0.512,
        OriginalBaseWidth: 0.303,
        PlumeSizeMultiplier: 0.43,
        PlumePositionOffset: -0.15,
        NodeStackTop: -0.005,
        NodeStackBottom: -0.86,
        ModelPath: "GenericEngines/models/SSTU/LM/SC-ENG-LMAE",
        ModelFiles: [
            "files/models/SSTU/LM/SC-ENG-LMAE.mu",
            "files/models/SSTU/LM/SC-ENG-LM-DIFF.dds",
            "files/models/SSTU/LM/SC-ENG-LM-GLOW.dds",
            "files/models/SSTU/LM/SC-ENG-LM-NRM.dds"
        ],
        TextureDefinitions: "",
        ThrustTransformName: "LMAE-ThrustTransform",
        GimbalTransformName: "LMAE-ThrustTransform",
        ModelName: "Lunar Module Ascent Engine",
        ModelType: EngineGroupType.IRL,
        HiddenMuObjects: [],
        CanAttachOnModel: false,
        OriginalTankVolume: 0,
        RadialAttachment: false,
        RadialAttachmentPoint: 0,
        ImageSource: "img/modelPreviews/LMAE.webp",
        get ImageLabel() { return this.ModelName; },
        LookatPairs: [],
        HeatAnimations: []
    }, {
        get OriginalHeight() { return this.NodeStackTop - this.NodeStackBottom; },
        OriginalBellWidth: 0.904,
        OriginalBaseWidth: 0.612,
        PlumeSizeMultiplier: 0.8,
        PlumePositionOffset: -0.3,
        NodeStackTop: -0.01,
        NodeStackBottom: -1.5,
        ModelPath: "GenericEngines/models/SSTU/LM/SC-ENG-LMDE",
        ModelFiles: [
            "files/models/SSTU/LM/SC-ENG-LMDE.mu",
            "files/models/SSTU/LM/SC-ENG-LM-DIFF.dds",
            "files/models/SSTU/LM/SC-ENG-LM-GLOW.dds",
            "files/models/SSTU/LM/SC-ENG-LM-NRM.dds"
        ],
        TextureDefinitions: "",
        ThrustTransformName: "LMDE-ThrustTransform",
        GimbalTransformName: "LMDE-GimbalFrame",
        ModelName: "Lunar Module Descent Engine",
        ModelType: EngineGroupType.IRL,
        HiddenMuObjects: [],
        CanAttachOnModel: false,
        OriginalTankVolume: 0,
        RadialAttachment: false,
        RadialAttachmentPoint: 0,
        ImageSource: "img/modelPreviews/LMDE.webp",
        get ImageLabel() { return this.ModelName; },
        LookatPairs: [
            ["LMDE-GimbalUpper1", "LMDE-GimbalLower1"],
            ["LMDE-GimbalLower1", "LMDE-GimbalUpper1"],
            ["LMDE-GimbalUpper2", "LMDE-GimbalLower2"],
            ["LMDE-GimbalLower2", "LMDE-GimbalUpper2"],
        ],
        HeatAnimations: []
    }, {
        get OriginalHeight() { return this.NodeStackTop - this.NodeStackBottom; },
        OriginalBellWidth: 0.412,
        OriginalBaseWidth: 0.838,
        PlumeSizeMultiplier: 0.35,
        PlumePositionOffset: 0,
        NodeStackTop: -0.005,
        NodeStackBottom: -1.18,
        ModelPath: "GenericEngines/models/SSTU/LR-81/SC-ENG-LR-81-8048",
        ModelFiles: [
            "files/models/SSTU/LR-81/SC-ENG-LR-81-8048.mu",
            "files/models/SSTU/LR-81/SC-ENG-LR-81-DIFF.dds",
            "files/models/SSTU/LR-81/SC-ENG-LR-81-GLOW.dds",
            "files/models/SSTU/LR-81/SC-ENG-LR-81-NRM.dds"
        ],
        TextureDefinitions: "",
        ThrustTransformName: "LR-81-8048-ThrustTransform",
        GimbalTransformName: "LR-81-8048-Gimbal",
        ModelName: "Bell 8048",
        ModelType: EngineGroupType.IRL,
        HiddenMuObjects: [],
        CanAttachOnModel: false,
        OriginalTankVolume: 0,
        RadialAttachment: false,
        RadialAttachmentPoint: 0,
        ImageSource: "img/modelPreviews/Bell8048.webp",
        get ImageLabel() { return this.ModelName; },
        LookatPairs: [
            ["LR-81-8048-ExhaustTarget", "LR-81-8048-ExhaustJoint"],
            ["LR-81-8048-FuelTarget", "LR-81-8048-FuelJoint"],
            ["LR-81-8048-Strut-LeftUpper", "LR-81-8048-Strut-LeftLower"],
            ["LR-81-8048-Strut-LeftLower", "LR-81-8048-Strut-LeftUpper"],
            ["LR-81-8048-Strut-RightUpper", "LR-81-8048-Strut-RightLower"],
            ["LR-81-8048-Strut-RightLower", "LR-81-8048-Strut-RightUpper"],
        ],
        HeatAnimations: [],
        Exhaust: {
            exhaustBellWidth: 0.045,
            exhaustThrustTransform: "exhaustTransform",
            exhaustGimbalTransform: "exhaustTransform",
            exhaustEffectTransform: "exhaustEffect",
        }
    }, {
        get OriginalHeight() { return this.NodeStackTop - this.NodeStackBottom; },
        OriginalBellWidth: 0.611,
        OriginalBaseWidth: 0.838,
        PlumeSizeMultiplier: 0.53,
        PlumePositionOffset: 0,
        NodeStackTop: -0.005,
        NodeStackBottom: -1.46,
        ModelPath: "GenericEngines/models/SSTU/LR-81/SC-ENG-LR-81-8096",
        ModelFiles: [
            "files/models/SSTU/LR-81/SC-ENG-LR-81-8096.mu",
            "files/models/SSTU/LR-81/SC-ENG-LR-81-DIFF.dds",
            "files/models/SSTU/LR-81/SC-ENG-LR-81-GLOW.dds",
            "files/models/SSTU/LR-81/SC-ENG-LR-81-NRM.dds"
        ],
        TextureDefinitions: "",
        ThrustTransformName: "LR-81-8096-ThrustTransform",
        GimbalTransformName: "LR-81-8096-Gimbal",
        ModelName: "Bell 8096",
        ModelType: EngineGroupType.IRL,
        HiddenMuObjects: [],
        CanAttachOnModel: false,
        OriginalTankVolume: 0,
        RadialAttachment: false,
        RadialAttachmentPoint: 0,
        ImageSource: "img/modelPreviews/Bell8096.webp",
        get ImageLabel() { return this.ModelName; },
        LookatPairs: [
            ["LR-81-8096-ExhaustTarget", "LR-81-8096-ExhaustJoint"],
            ["LR-81-8096-FuelTarget", "LR-81-8096-FuelJoint"],
            ["LR-81-8096-Strut-LeftUpper", "LR-81-8096-Strut-LeftLower"],
            ["LR-81-8096-Strut-LeftLower", "LR-81-8096-Strut-LeftUpper"],
            ["LR-81-8096-Strut-RightUpper", "LR-81-8096-Strut-RightLower"],
            ["LR-81-8096-Strut-RightLower", "LR-81-8096-Strut-RightUpper"],
        ],
        HeatAnimations: [],
        Exhaust: {
            exhaustBellWidth: 0.045,
            exhaustThrustTransform: "exhaustTransform",
            exhaustGimbalTransform: "exhaustTransform",
            exhaustEffectTransform: "exhaustEffect",
        }
    }, {
        get OriginalHeight() { return this.NodeStackTop - this.NodeStackBottom; },
        OriginalBellWidth: 0.597,
        OriginalBaseWidth: 0.74,
        PlumeSizeMultiplier: 0.53,
        PlumePositionOffset: 0,
        NodeStackTop: -0.015,
        NodeStackBottom: -1.3,
        ModelPath: "GenericEngines/models/SSTU/Merlin-1/SC-ENG-Merlin-1A",
        ModelFiles: [
            "files/models/SSTU/Merlin-1/SC-ENG-Merlin-1A.mu",
            "files/models/SSTU/Merlin-1/SC-ENG-Merlin-DIFF.dds",
            "files/models/SSTU/Merlin-1/SC-ENG-Merlin-GLOW.dds",
            "files/models/SSTU/Merlin-1/SC-ENG-Merlin-NRM.dds"
        ],
        TextureDefinitions: "",
        ThrustTransformName: "Merlin-1A-ThrustTransform",
        GimbalTransformName: "Merlin-1A-Bell",
        ModelName: "Merlin 1A",
        ModelType: EngineGroupType.IRL,
        HiddenMuObjects: [],
        CanAttachOnModel: false,
        OriginalTankVolume: 0,
        RadialAttachment: false,
        RadialAttachmentPoint: 0,
        ImageSource: "img/modelPreviews/Merlin1A.webp",
        get ImageLabel() { return this.ModelName; },
        LookatPairs: [
            ["Merlin-1A-Strut-Lower1", "Merlin-1A-Strut-Upper1"],
            ["Merlin-1A-Strut-Upper1", "Merlin-1A-Strut-Lower1"],
            ["Merlin-1A-Strut-Lower2", "Merlin-1A-Strut-Upper2"],
            ["Merlin-1A-Strut-Upper2", "Merlin-1A-Strut-Lower2"],
        ],
        HeatAnimations: [],
        Exhaust: {
            exhaustBellWidth: 0.084,
            exhaustThrustTransform: "Merlin-1A-RollGimbal",
            exhaustGimbalTransform: "Merlin-1A-RollGimbal",
            exhaustEffectTransform: "Merlin-1A-RollFXTransform",
        }
    }, {
        get OriginalHeight() { return this.NodeStackTop - this.NodeStackBottom; },
        OriginalBellWidth: 0.599,
        OriginalBaseWidth: 0.73,
        PlumeSizeMultiplier: 0.54,
        PlumePositionOffset: 0,
        NodeStackTop: -0.015,
        NodeStackBottom: -1.39,
        ModelPath: "GenericEngines/models/SSTU/Merlin-1/SC-ENG-Merlin-1B",
        ModelFiles: [
            "files/models/SSTU/Merlin-1/SC-ENG-Merlin-1B.mu",
            "files/models/SSTU/Merlin-1/SC-ENG-Merlin-DIFF.dds",
            "files/models/SSTU/Merlin-1/SC-ENG-Merlin-GLOW.dds",
            "files/models/SSTU/Merlin-1/SC-ENG-Merlin-NRM.dds"
        ],
        TextureDefinitions: "",
        ThrustTransformName: "Merlin-1B-ThrustTransform",
        GimbalTransformName: "Merlin-1B-Bell",
        ModelName: "Merlin 1B",
        ModelType: EngineGroupType.IRL,
        HiddenMuObjects: [],
        CanAttachOnModel: false,
        OriginalTankVolume: 0,
        RadialAttachment: false,
        RadialAttachmentPoint: 0,
        ImageSource: "img/modelPreviews/Merlin1B.webp",
        get ImageLabel() { return this.ModelName; },
        LookatPairs: [
            ["Merlin-1B-Strut-Lower1", "Merlin-1B-Strut-Upper1"],
            ["Merlin-1B-Strut-Upper1", "Merlin-1B-Strut-Lower1"],
            ["Merlin-1B-Strut-Lower2", "Merlin-1B-Strut-Upper2"],
            ["Merlin-1B-Strut-Upper2", "Merlin-1B-Strut-Lower2"],
        ],
        HeatAnimations: [],
        Exhaust: {
            exhaustBellWidth: 0.084,
            exhaustThrustTransform: "Merlin-1B-RollGimbal",
            exhaustGimbalTransform: "Merlin-1B-RollGimbal",
            exhaustEffectTransform: "Merlin-1B-RollFXTransform",
        }
    }, {
        get OriginalHeight() { return this.NodeStackTop - this.NodeStackBottom; },
        OriginalBellWidth: 1.599,
        OriginalBaseWidth: 0.73,
        PlumeSizeMultiplier: 1.4,
        PlumePositionOffset: 0,
        NodeStackTop: -0.015,
        NodeStackBottom: -2.87,
        ModelPath: "GenericEngines/models/SSTU/Merlin-1/SC-ENG-Merlin-1BV",
        ModelFiles: [
            "files/models/SSTU/Merlin-1/SC-ENG-Merlin-1BV.mu",
            "files/models/SSTU/Merlin-1/SC-ENG-Merlin-DIFF.dds",
            "files/models/SSTU/Merlin-1/SC-ENG-Merlin-GLOW.dds",
            "files/models/SSTU/Merlin-1/SC-ENG-Merlin-NRM.dds"
        ],
        TextureDefinitions: "",
        ThrustTransformName: "Merlin-1BV-ThrustTransform",
        GimbalTransformName: "Merlin-1BV-Bell",
        ModelName: "Merlin 1B Vacuum",
        ModelType: EngineGroupType.IRL,
        HiddenMuObjects: [],
        CanAttachOnModel: false,
        OriginalTankVolume: 0,
        RadialAttachment: false,
        RadialAttachmentPoint: 0,
        ImageSource: "img/modelPreviews/Merlin1BV.webp",
        get ImageLabel() { return this.ModelName; },
        LookatPairs: [
            ["Merlin-1BV-Strut-Lower1", "Merlin-1BV-Strut-Upper1"],
            ["Merlin-1BV-Strut-Upper1", "Merlin-1BV-Strut-Lower1"],
            ["Merlin-1BV-Strut-Lower2", "Merlin-1BV-Strut-Upper2"],
            ["Merlin-1BV-Strut-Upper2", "Merlin-1BV-Strut-Lower2"],
        ],
        HeatAnimations: [],
        Exhaust: {
            exhaustBellWidth: 0.084,
            exhaustThrustTransform: "Merlin-1BV-RollGimbal",
            exhaustGimbalTransform: "Merlin-1BV-RollGimbal",
            exhaustEffectTransform: "Merlin-1BV-RollFXTransform",
        }
    }, {
        get OriginalHeight() { return this.NodeStackTop - this.NodeStackBottom; },
        OriginalBellWidth: 0.601,
        OriginalBaseWidth: 0.73,
        PlumeSizeMultiplier: 0.53,
        PlumePositionOffset: 0,
        NodeStackTop: -0.015,
        NodeStackBottom: -1.39,
        ModelPath: "GenericEngines/models/SSTU/Merlin-1/SC-ENG-Merlin-1D",
        ModelFiles: [
            "files/models/SSTU/Merlin-1/SC-ENG-Merlin-1D.mu",
            "files/models/SSTU/Merlin-1/SC-ENG-Merlin-DIFF.dds",
            "files/models/SSTU/Merlin-1/SC-ENG-Merlin-GLOW.dds",
            "files/models/SSTU/Merlin-1/SC-ENG-Merlin-NRM.dds"
        ],
        TextureDefinitions: "",
        ThrustTransformName: "Merlin-1D-ThrustTransform",
        GimbalTransformName: "Merlin-1D-Bell",
        ModelName: "Merlin 1D",
        ModelType: EngineGroupType.IRL,
        HiddenMuObjects: [],
        CanAttachOnModel: false,
        OriginalTankVolume: 0,
        RadialAttachment: false,
        RadialAttachmentPoint: 0,
        ImageSource: "img/modelPreviews/Merlin1D.webp",
        get ImageLabel() { return this.ModelName; },
        LookatPairs: [
            ["Merlin-1D-Strut-Lower1", "Merlin-1D-Strut-Upper1"],
            ["Merlin-1D-Strut-Upper1", "Merlin-1D-Strut-Lower1"],
            ["Merlin-1D-Strut-Lower2", "Merlin-1D-Strut-Upper2"],
            ["Merlin-1D-Strut-Upper2", "Merlin-1D-Strut-Lower2"],
        ],
        HeatAnimations: [],
        Exhaust: {
            exhaustBellWidth: 0.143,
            exhaustThrustTransform: "exhaustTransform",
            exhaustGimbalTransform: "exhaustTransform",
            exhaustEffectTransform: "effectTransform",
        }
    }, {
        get OriginalHeight() { return this.NodeStackTop - this.NodeStackBottom; },
        OriginalBellWidth: 1.601,
        OriginalBaseWidth: 0.73,
        PlumeSizeMultiplier: 1.4,
        PlumePositionOffset: -0.5,
        NodeStackTop: -0.015,
        NodeStackBottom: -2.88,
        ModelPath: "GenericEngines/models/SSTU/Merlin-1/SC-ENG-Merlin-1DV",
        ModelFiles: [
            "files/models/SSTU/Merlin-1/SC-ENG-Merlin-1DV.mu",
            "files/models/SSTU/Merlin-1/SC-ENG-Merlin-DIFF.dds",
            "files/models/SSTU/Merlin-1/SC-ENG-Merlin-GLOW.dds",
            "files/models/SSTU/Merlin-1/SC-ENG-Merlin-NRM.dds"
        ],
        TextureDefinitions: "",
        ThrustTransformName: "Merlin-1DV-ThrustTransform",
        GimbalTransformName: "Merlin-1DV-Bell",
        ModelName: "Merlin 1D Vacuum",
        ModelType: EngineGroupType.IRL,
        HiddenMuObjects: [],
        CanAttachOnModel: false,
        OriginalTankVolume: 0,
        RadialAttachment: false,
        RadialAttachmentPoint: 0,
        ImageSource: "img/modelPreviews/Merlin1DV.webp",
        get ImageLabel() { return this.ModelName; },
        LookatPairs: [
            ["Merlin-1DV-Strut-Lower1", "Merlin-1DV-Strut-Upper1"],
            ["Merlin-1DV-Strut-Upper1", "Merlin-1DV-Strut-Lower1"],
            ["Merlin-1DV-Strut-Lower2", "Merlin-1DV-Strut-Upper2"],
            ["Merlin-1DV-Strut-Upper2", "Merlin-1DV-Strut-Lower2"],
        ],
        HeatAnimations: []
    }, {
        get OriginalHeight() { return this.NodeStackTop - this.NodeStackBottom; },
        OriginalBellWidth: 0.471,
        OriginalBaseWidth: 1.235,
        PlumeSizeMultiplier: 0.42,
        PlumePositionOffset: -0.145,
        NodeStackTop: -0.0075,
        NodeStackBottom: -1.78,
        ModelPath: "GenericEngines/models/SSTU/RD-107/SC-ENG-RD-107X",
        ModelFiles: [
            "files/models/SSTU/RD-107/SC-ENG-RD-107X.mu",
            "files/models/SSTU/RD-107/SC-ENG-RD-107-DIFF.dds",
            "files/models/SSTU/RD-107/SC-ENG-RD-107-GLOW.dds",
            "files/models/SSTU/RD-107/SC-ENG-RD-107-NRM.dds"
        ],
        TextureDefinitions: "",
        ThrustTransformName: "RD-107X-ThrustTransform",
        GimbalTransformName: "RD-107X-ThrustTransform",
        ModelName: "RD-107",
        ModelType: EngineGroupType.IRL,
        HiddenMuObjects: [],
        CanAttachOnModel: false,
        OriginalTankVolume: 0,
        RadialAttachment: false,
        RadialAttachmentPoint: 0,
        ImageSource: "img/modelPreviews/RD107.webp",
        get ImageLabel() { return this.ModelName; },
        LookatPairs: [],
        HeatAnimations: []
    }, {
        get OriginalHeight() { return this.NodeStackTop - this.NodeStackBottom; },
        OriginalBellWidth: 0.964,
        OriginalBaseWidth: 2.49,
        PlumeSizeMultiplier: 0.85,
        PlumePositionOffset: -0.3,
        NodeStackTop: -0.01,
        NodeStackBottom: -2.41,
        ModelPath: "GenericEngines/models/SSTU/RD-180/SC-ENG-RD-171",
        ModelFiles: [
            "files/models/SSTU/RD-180/SC-ENG-RD-171.mu",
            "files/models/SSTU/RD-180/SC-ENG-RD-180-DIFF.dds",
            "files/models/SSTU/RD-180/SC-ENG-RD-180-GLOW.dds",
            "files/models/SSTU/RD-180/SC-ENG-RD-180-NRM.dds"
        ],
        TextureDefinitions: "",
        ThrustTransformName: "RD-171-ThrustTransform",
        GimbalTransformName: "RD-171-GimbalRing",
        ModelName: "RD-171",
        ModelType: EngineGroupType.IRL,
        HiddenMuObjects: [],
        CanAttachOnModel: false,
        OriginalTankVolume: 0,
        RadialAttachment: false,
        RadialAttachmentPoint: 0,
        ImageSource: "img/modelPreviews/RD171.webp",
        get ImageLabel() { return this.ModelName; },
        LookatPairs: [
            ["RD-171-GimbalUpper1", "RD-171-GimbalLower1"],
            ["RD-171-GimbalLower1", "RD-171-GimbalUpper1"],
            ["RD-171-GimbalUpper2", "RD-171-GimbalLower2"],
            ["RD-171-GimbalLower2", "RD-171-GimbalUpper2"],
            ["RD-171-GimbalUpper3", "RD-171-GimbalLower3"],
            ["RD-171-GimbalLower3", "RD-171-GimbalUpper3"],
            ["RD-171-GimbalUpper4", "RD-171-GimbalLower4"],
            ["RD-171-GimbalLower4", "RD-171-GimbalUpper4"],
            ["RD-171-GimbalUpper5", "RD-171-GimbalLower5"],
            ["RD-171-GimbalLower5", "RD-171-GimbalUpper5"],
            ["RD-171-GimbalUpper6", "RD-171-GimbalLower6"],
            ["RD-171-GimbalLower6", "RD-171-GimbalUpper6"],
            ["RD-171-GimbalUpper7", "RD-171-GimbalLower7"],
            ["RD-171-GimbalLower7", "RD-171-GimbalUpper7"],
            ["RD-171-GimbalUpper8", "RD-171-GimbalLower8"],
            ["RD-171-GimbalLower8", "RD-171-GimbalUpper8"],
        ],
        HeatAnimations: []
    }, {
        get OriginalHeight() { return this.NodeStackTop - this.NodeStackBottom; },
        OriginalBellWidth: 0.963,
        OriginalBaseWidth: 2.237,
        PlumeSizeMultiplier: 0.85,
        PlumePositionOffset: -0.3,
        NodeStackTop: -0.001,
        NodeStackBottom: -2.41,
        ModelPath: "GenericEngines/models/SSTU/RD-180/SC-ENG-RD-180",
        ModelFiles: [
            "files/models/SSTU/RD-180/SC-ENG-RD-180.mu",
            "files/models/SSTU/RD-180/SC-ENG-RD-180-DIFF.dds",
            "files/models/SSTU/RD-180/SC-ENG-RD-180-GLOW.dds",
            "files/models/SSTU/RD-180/SC-ENG-RD-180-NRM.dds"
        ],
        TextureDefinitions: "",
        ThrustTransformName: "RD-180-ThrustTransform",
        GimbalTransformName: "RD-180-GimbalRing",
        ModelName: "RD-180",
        ModelType: EngineGroupType.IRL,
        HiddenMuObjects: [],
        CanAttachOnModel: false,
        OriginalTankVolume: 0,
        RadialAttachment: false,
        RadialAttachmentPoint: 0,
        ImageSource: "img/modelPreviews/RD180.webp",
        get ImageLabel() { return this.ModelName; },
        LookatPairs: [
            ["RD-180-GimbalLeftLower1", "RD-180-GimbalLeftUpper1X"],
            ["RD-180-GimbalLeftLower1", "RD-180-GimbalLeftUpper1"],
            ["RD-180-GimbalLeftUpper1", "RD-180-GimbalLeftLower1"],
            ["RD-180-GimbalLeftLower2", "RD-180-GimbalLeftUpper2X"],
            ["RD-180-GimbalLeftLower2", "RD-180-GimbalLeftUpper2"],
            ["RD-180-GimbalLeftUpper2", "RD-180-GimbalLeftLower2"],
            ["RD-180-GimbalRightLower1", "RD-180-GimbalRightUpper1X"],
            ["RD-180-GimbalRightLower1", "RD-180-GimbalRightUpper1"],
            ["RD-180-GimbalRightUpper1", "RD-180-GimbalRightLower1"],
            ["RD-180-GimbalRightLower2", "RD-180-GimbalRightUpper2X"],
            ["RD-180-GimbalRightLower2", "RD-180-GimbalRightUpper2"],
            ["RD-180-GimbalRightUpper2", "RD-180-GimbalRightLower2"],
        ],
        HeatAnimations: []
    }, {
        get OriginalHeight() { return this.NodeStackTop - this.NodeStackBottom; },
        OriginalBellWidth: 0.964,
        OriginalBaseWidth: 1.67,
        PlumeSizeMultiplier: 0.85,
        PlumePositionOffset: -0.27,
        NodeStackTop: -0.001,
        NodeStackBottom: -2.41,
        ModelPath: "GenericEngines/models/SSTU/RD-180/SC-ENG-RD-181",
        ModelFiles: [
            "files/models/SSTU/RD-180/SC-ENG-RD-181.mu",
            "files/models/SSTU/RD-180/SC-ENG-RD-180-DIFF.dds",
            "files/models/SSTU/RD-180/SC-ENG-RD-180-GLOW.dds",
            "files/models/SSTU/RD-180/SC-ENG-RD-180-NRM.dds"
        ],
        TextureDefinitions: "",
        ThrustTransformName: "RD-181-ThrustTransform",
        GimbalTransformName: "RD-181-GimbalRing",
        ModelName: "RD-181",
        ModelType: EngineGroupType.IRL,
        HiddenMuObjects: [],
        CanAttachOnModel: false,
        OriginalTankVolume: 0,
        RadialAttachment: false,
        RadialAttachmentPoint: 0,
        ImageSource: "img/modelPreviews/RD181.webp",
        get ImageLabel() { return this.ModelName; },
        LookatPairs: [
            ["RD-181-GimbalLower1", "RD-181-GimbalUpperX1"],
            ["RD-181-GimbalUpper1", "RD-181-GimbalLower1"],
            ["RD-181-GimbalLower1", "RD-181-GimbalUpper1"],
            ["RD-181-GimbalLower2", "RD-181-GimbalUpperX2"],
            ["RD-181-GimbalUpper2", "RD-181-GimbalLower2"],
            ["RD-181-GimbalLower2", "RD-181-GimbalUpper2"],
        ],
        HeatAnimations: []
    }, {
        get OriginalHeight() { return this.NodeStackTop - this.NodeStackBottom; },
        OriginalBellWidth: 0.671,
        OriginalBaseWidth: 0.568,
        PlumeSizeMultiplier: 0.6,
        PlumePositionOffset: -0.145,
        NodeStackTop: -0.005,
        NodeStackBottom: -1.14,
        ModelPath: "GenericEngines/models/SSTU/RL10/SC-ENG-RL10A-3",
        ModelFiles: [
            "files/models/SSTU/RL10/SC-ENG-RL10A-3.mu",
            "files/models/SSTU/RL10/SC-ENG-RL10-DIFF.dds",
            "files/models/SSTU/RL10/SC-ENG-RL10-GLOW.dds",
            "files/models/SSTU/RL10/SC-ENG-RL10-NRM.dds"
        ],
        TextureDefinitions: "",
        ThrustTransformName: "RL10A-3-ThrustTransform",
        GimbalTransformName: "RL10A-3-Bell",
        ModelName: "RL10A-3",
        ModelType: EngineGroupType.IRL,
        HiddenMuObjects: [],
        CanAttachOnModel: false,
        OriginalTankVolume: 0,
        RadialAttachment: false,
        RadialAttachmentPoint: 0,
        ImageSource: "img/modelPreviews/RL10A3.webp",
        get ImageLabel() { return this.ModelName; },
        LookatPairs: [
            ["RL10A-3-Target-LeftUpper", "RL10A-3-Strut-LeftLower"],
            ["RL10A-3-Target-LeftLower", "RL10A-3-Strut-LeftUpper"],
            ["RL10A-3-Target-RightUpper", "RL10A-3-Strut-RightLower"],
            ["RL10A-3-Target-RightLower", "RL10A-3-Strut-RightUpper"],
            ["RL10A-3-Target-FuelLeft", "RL10A-3-FuelJointLeft"],
            ["RL10A-3-Target-FuelRight", "RL10A-3-FuelJointRight"],
        ],
        HeatAnimations: []
    }, {
        OriginalHeight: 1.48,
        OriginalBellWidth: 0.798,
        OriginalBaseWidth: 0.568,
        PlumeSizeMultiplier: 0.71,
        PlumePositionOffset: -0.27,
        NodeStackTop: -0.01,
        NodeStackBottom: -1.125,
        ModelPath: "GenericEngines/models/SSTU/RL10/SC-ENG-RL10A-4",
        ModelFiles: [
            "files/models/SSTU/RL10/SC-ENG-RL10A-4.mu",
            "files/models/SSTU/RL10/SC-ENG-RL10-DIFF.dds",
            "files/models/SSTU/RL10/SC-ENG-RL10-GLOW.dds",
            "files/models/SSTU/RL10/SC-ENG-RL10-NRM.dds"
        ],
        TextureDefinitions: "",
        ThrustTransformName: "RL10A-4-ThrustTransform",
        GimbalTransformName: "RL10A-4-Bell",
        ModelName: "RL10A-4",
        ModelType: EngineGroupType.IRL,
        HiddenMuObjects: [],
        CanAttachOnModel: false,
        OriginalTankVolume: 0,
        RadialAttachment: false,
        RadialAttachmentPoint: 0,
        ImageSource: "img/modelPreviews/RL10A4.webp",
        get ImageLabel() { return this.ModelName; },
        LookatPairs: [
            ["RL10A-4-Target-LeftUpper", "RL10A-4-Strut-LeftLower"],
            ["RL10A-4-Target-LeftLower", "RL10A-4-Strut-LeftUpper"],
            ["RL10A-4-Target-RightUpper", "RL10A-4-Strut-RightLower"],
            ["RL10A-4-Target-RightLower", "RL10A-4-Strut-RightUpper"],
            ["RL10A-4-Target-FuelLeft", "RL10A-4-FuelJointLeft"],
            ["RL10A-4-Target-FuelRight", "RL10A-4-FuelJointRight"],
        ],
        HeatAnimations: [],
        ExtendNozzleAnimation: "SC-ENG-RL10A-4-Deploy"
    }, {
        get OriginalHeight() { return this.NodeStackTop - this.NodeStackBottom; },
        OriginalBellWidth: 0.25,
        OriginalBaseWidth: 0.568,
        PlumeSizeMultiplier: 0.22,
        PlumePositionOffset: -0.1,
        NodeStackTop: -0.005,
        NodeStackBottom: -0.75,
        ModelPath: "GenericEngines/models/SSTU/RL10/SC-ENG-RL10A-5",
        ModelFiles: [
            "files/models/SSTU/RL10/SC-ENG-RL10A-5.mu",
            "files/models/SSTU/RL10/SC-ENG-RL10-DIFF.dds",
            "files/models/SSTU/RL10/SC-ENG-RL10-GLOW.dds",
            "files/models/SSTU/RL10/SC-ENG-RL10-NRM.dds"
        ],
        TextureDefinitions: "",
        ThrustTransformName: "RL10A-5-ThrustTransform",
        GimbalTransformName: "RL10A-5-Bell",
        ModelName: "RL10A-5",
        ModelType: EngineGroupType.IRL,
        HiddenMuObjects: [],
        CanAttachOnModel: false,
        OriginalTankVolume: 0,
        RadialAttachment: false,
        RadialAttachmentPoint: 0,
        ImageSource: "img/modelPreviews/RL10A5.webp",
        get ImageLabel() { return this.ModelName; },
        LookatPairs: [
            ["RL10A-5-Target-LeftUpper", "RL10A-5-Strut-LeftLower"],
            ["RL10A-5-Target-LeftLower", "RL10A-5-Strut-LeftUpper"],
            ["RL10A-5-Target-RightUpper", "RL10A-5-Strut-RightLower"],
            ["RL10A-5-Target-RightLower", "RL10A-5-Strut-RightUpper"],
            ["RL10A-5-Target-FuelLeft", "RL10A-5-FuelJointLeft"],
            ["RL10A-5-Target-FuelRight", "RL10A-5-FuelJointRight"],
        ],
        HeatAnimations: []
    }, {
        OriginalHeight: 2.555,
        OriginalBellWidth: 1.27,
        OriginalBaseWidth: 0.568,
        PlumeSizeMultiplier: 1.13,
        PlumePositionOffset: 0,
        NodeStackTop: -0.005,
        NodeStackBottom: -1.362,
        ModelPath: "GenericEngines/models/SSTU/RL10/SC-ENG-RL10B-2",
        ModelFiles: [
            "files/models/SSTU/RL10/SC-ENG-RL10B-2.mu",
            "files/models/SSTU/RL10/SC-ENG-RL10-DIFF.dds",
            "files/models/SSTU/RL10/SC-ENG-RL10-GLOW.dds",
            "files/models/SSTU/RL10/SC-ENG-RL10-NRM.dds"
        ],
        TextureDefinitions: "",
        ThrustTransformName: "RL10B-2-ThrustTransform",
        GimbalTransformName: "RL10B-2-Bell",
        ModelName: "RL10B-2",
        ModelType: EngineGroupType.IRL,
        HiddenMuObjects: [],
        CanAttachOnModel: false,
        OriginalTankVolume: 0,
        RadialAttachment: false,
        RadialAttachmentPoint: 0,
        ImageSource: "img/modelPreviews/RL10B2.webp",
        get ImageLabel() { return this.ModelName; },
        LookatPairs: [
            ["RL10B-2-Target-LeftUpper", "RL10B-2-Strut-LeftLower"],
            ["RL10B-2-Target-LeftLower", "RL10B-2-Strut-LeftUpper"],
            ["RL10B-2-Target-RightUpper", "RL10B-2-Strut-RightLower"],
            ["RL10B-2-Target-RightLower", "RL10B-2-Strut-RightUpper"],
            ["RL10B-2-Target-FuelLeft", "RL10B-2-FuelJointLeft"],
            ["RL10B-2-Target-FuelRight", "RL10B-2-FuelJointRight"],
        ],
        HeatAnimations: [],
        ExtendNozzleAnimation: "SC-ENG-RL10B-2-Deploy"
    }, {
        get OriginalHeight() { return this.NodeStackTop - this.NodeStackBottom; },
        OriginalBellWidth: 1.569,
        OriginalBaseWidth: 1.373,
        PlumeSizeMultiplier: 1.4,
        PlumePositionOffset: -0.5,
        NodeStackTop: -0.005,
        NodeStackBottom: -2.7,
        ModelPath: "GenericEngines/models/SSTU/RS-25/SC-ENG-RS-25",
        ModelFiles: [
            "files/models/SSTU/RS-25/SC-ENG-RS-25.mu",
            "files/models/SSTU/RS-25/SC-ENG-RS-25-DIFF.dds",
            "files/models/SSTU/RS-25/SC-ENG-RS-25-GLOW.dds",
            "files/models/SSTU/RS-25/SC-ENG-RS-25-NRM.dds"
        ],
        TextureDefinitions: "",
        ThrustTransformName: "RS-25-ThrustTransform",
        GimbalTransformName: "RS-25-Bell",
        ModelName: "RS-25",
        ModelType: EngineGroupType.IRL,
        HiddenMuObjects: [],
        CanAttachOnModel: false,
        OriginalTankVolume: 0,
        RadialAttachment: false,
        RadialAttachmentPoint: 0,
        ImageSource: "img/modelPreviews/RS25_2.webp",
        get ImageLabel() { return this.ModelName; },
        LookatPairs: [
            ["RS-25-Target-LeftUpper", "RS-25-Strut-LeftLower"],
            ["RS-25-Target-LeftLower", "RS-25-Strut-LeftUpper"],
            ["RS-25-Target-RightUpper", "RS-25-Strut-RightLower"],
            ["RS-25-Target-RightLower", "RS-25-Strut-RightUpper"],
            ["RS-25-Target-FuelLeft", "RS-25-FuelJointLeft"],
            ["RS-25-Target-FuelRight", "RS-25-FuelJointRight"],
        ],
        HeatAnimations: []
    }, {
        get OriginalHeight() { return this.NodeStackTop - this.NodeStackBottom; },
        OriginalBellWidth: 1.61,
        OriginalBaseWidth: 2.272,
        PlumeSizeMultiplier: 1.43,
        PlumePositionOffset: 0,
        NodeStackTop: -0.01,
        NodeStackBottom: -3.6,
        ModelPath: "GenericEngines/models/SSTU/RS-68/SC-ENG-RS-68",
        ModelFiles: [
            "files/models/SSTU/RS-68/SC-ENG-RS-68.mu",
            "files/models/SSTU/RS-68/SC-ENG-RS-68-DIFF.dds",
            "files/models/SSTU/RS-68/SC-ENG-RS-68-GLOW.dds",
            "files/models/SSTU/RS-68/SC-ENG-RS-68-NRM.dds"
        ],
        TextureDefinitions: "",
        ThrustTransformName: "RS-68-ThrustTransform",
        GimbalTransformName: "RS-68-Bell",
        ModelName: "RS-68",
        ModelType: EngineGroupType.IRL,
        HiddenMuObjects: [],
        CanAttachOnModel: false,
        OriginalTankVolume: 0,
        RadialAttachment: false,
        RadialAttachmentPoint: 0,
        ImageSource: "img/modelPreviews/RS68.webp",
        get ImageLabel() { return this.ModelName; },
        LookatPairs: [
            ["RS-68-Target-LeftUpper", "RS-68-Strut-LeftLower"],
            ["RS-68-Target-LeftLower", "RS-68-Strut-LeftUpper"],
            ["RS-68-Target-RightUpper", "RS-68-Strut-RightLower"],
            ["RS-68-Target-RightLower", "RS-68-Strut-RightUpper"],
            ["RS-68-Target-FuelFront", "RS-68-FuelJointFront"],
            ["RS-68-Target-FuelRear", "RS-68-FuelJointRear"],
        ],
        HeatAnimations: [],
        Exhaust: {
            exhaustBellWidth: 0.24,
            exhaustThrustTransform: "exhaustTransform",
            exhaustGimbalTransform: "exhaustTransform",
            exhaustEffectTransform: "exhaustEffect",
        }
    }, {
        get OriginalHeight() { return this.NodeStackTop - this.NodeStackBottom; },
        OriginalBellWidth: 0.128,
        OriginalBaseWidth: 0.09,
        PlumeSizeMultiplier: 0.11,
        PlumePositionOffset: 0,
        NodeStackTop: -0.005,
        NodeStackBottom: -0.365,
        ModelPath: "GenericEngines/models/SSTU/SuperDraco/SC-ENG-SuperDraco",
        ModelFiles: [
            "files/models/SSTU/SuperDraco/SC-ENG-SuperDraco.mu",
            "files/models/SSTU/SuperDraco/SC-ENG-SuperDraco-DIFF.dds",
            "files/models/SSTU/SuperDraco/SC-ENG-SuperDraco-GLOW.png"
        ],
        TextureDefinitions: "",
        ThrustTransformName: "SuperDraco-ThrustTransform",
        GimbalTransformName: "SuperDraco-ThrustTransform",
        ModelName: "SuperDraco",
        ModelType: EngineGroupType.IRL,
        HiddenMuObjects: [],
        CanAttachOnModel: false,
        OriginalTankVolume: 0,
        RadialAttachment: false,
        RadialAttachmentPoint: 0,
        ImageSource: "img/modelPreviews/SuperDraco.webp",
        get ImageLabel() { return this.ModelName; },
        LookatPairs: [],
        HeatAnimations: []
    }, {
        get OriginalHeight() { return this.NodeStackTop - this.NodeStackBottom; },
        OriginalBellWidth: 0.321,
        OriginalBaseWidth: 0.09,
        PlumeSizeMultiplier: 0.29,
        PlumePositionOffset: 0,
        NodeStackTop: -0.005,
        NodeStackBottom: -0.615,
        ModelPath: "GenericEngines/models/SSTU/SuperDraco/SC-ENG-SuperDraco-L",
        ModelFiles: [
            "files/models/SSTU/SuperDraco/SC-ENG-SuperDraco-L.mu",
            "files/models/SSTU/SuperDraco/SC-ENG-SuperDraco-DIFF.dds",
            "files/models/SSTU/SuperDraco/SC-ENG-SuperDraco-GLOW.png"
        ],
        TextureDefinitions: "",
        ThrustTransformName: "SuperDraco-L-ThrustTransform",
        GimbalTransformName: "SuperDraco-L-ThrustTransform",
        ModelName: "SuperDraco Vacuum",
        ModelType: EngineGroupType.IRL,
        HiddenMuObjects: [],
        CanAttachOnModel: false,
        OriginalTankVolume: 0,
        RadialAttachment: false,
        RadialAttachmentPoint: 0,
        ImageSource: "img/modelPreviews/SuperDracoV.webp",
        get ImageLabel() { return this.ModelName; },
        LookatPairs: [],
        HeatAnimations: []
    }, {
        get OriginalHeight() { return this.NodeStackTop - this.NodeStackBottom; },
        OriginalBellWidth: 0.824,
        OriginalBaseWidth: 0.824,
        PlumeSizeMultiplier: 0.72,
        PlumePositionOffset: -0.01,
        NodeStackTop: 1,
        NodeStackBottom: -0.533,
        ModelPath: "GenericEngines/models/FRE/FRE-1/FRE-1",
        ModelFiles: [
            "files/models/FRE/FRE-1/FRE-1.mu",
            "files/models/FRE/FRE-1/FRE-1Texture_Compiled.dds",
            "files/models/FRE/FRE-1/FRE-1TextureEmissive.dds"
        ],
        TextureDefinitions: "",
        ThrustTransformName: "thrustTransform",
        GimbalTransformName: "gimbalTransform",
        ModelName: "FRE-1",
        ModelType: EngineGroupType.IRL,
        HiddenMuObjects: [],
        CanAttachOnModel: false,
        OriginalTankVolume: 0,
        RadialAttachment: false,
        RadialAttachmentPoint: 0,
        ImageSource: "img/modelPreviews/FRE1.webp",
        get ImageLabel() { return this.ModelName; },
        LookatPairs: [
            ["Base1", "Piston1"],
            ["Base2", "Piston2"],
            ["Base3", "Piston3"],
            ["Base4", "Piston4"]
        ],
        HeatAnimations: [
            "FRE-1Heat"
        ]
    }, {
        get OriginalHeight() { return this.NodeStackTop - this.NodeStackBottom; },
        OriginalBellWidth: 0.38,
        OriginalBaseWidth: 1.824,
        PlumeSizeMultiplier: 0.33,
        PlumePositionOffset: 0,
        NodeStackTop: 0.59,
        NodeStackBottom: -0.7,
        ModelPath: "GenericEngines/models/FRE/FRE-2/FRE-2",
        ModelFiles: [
            "files/models/FRE/FRE-2/FRE-2.mu",
            "files/models/FRE/FRE-2/FRE-2Texture_Compiled.dds",
            "files/models/FRE/FRE-2/FRE-2TextureEmissive.dds"
        ],
        TextureDefinitions: "",
        ThrustTransformName: "thrustTransform",
        GimbalTransformName: "gimbalTransform",
        ModelName: "FRE-2",
        ModelType: EngineGroupType.IRL,
        HiddenMuObjects: [],
        CanAttachOnModel: false,
        OriginalTankVolume: 0,
        RadialAttachment: false,
        RadialAttachmentPoint: 0,
        ImageSource: "img/modelPreviews/FRE2.webp",
        get ImageLabel() { return this.ModelName; },
        LookatPairs: [
            ["Base1", "Piston1"],
            ["Base2", "Piston2"],
            ["Base3", "Piston3"],
            ["Base4", "Piston4"],
            ["Base1.001", "Piston1.001"],
            ["Base2.001", "Piston2.001"],
            ["Base3.001", "Piston3.001"],
            ["Base4.001", "Piston4.001"],
            ["Base1.002", "Piston1.002"],
            ["Base2.002", "Piston2.002"],
            ["Base3.002", "Piston3.002"],
            ["Base4.002", "Piston4.002"],
            ["Base1.003", "Piston1.003"],
            ["Base2.003", "Piston2.003"],
            ["Base3.003", "Piston3.003"],
            ["Base4.003", "Piston4.003"],
            ["Base1.004", "Piston1.004"],
            ["Base2.004", "Piston2.004"],
            ["Base3.004", "Piston3.004"],
            ["Base4.004", "Piston4.004"],
            ["Base1.005", "Piston1.005"],
            ["Base2.005", "Piston2.005"],
            ["Base3.005", "Piston3.005"],
            ["Base4.005", "Piston4.005"],
            ["Base1.006", "Piston1.006"],
            ["Base2.006", "Piston2.006"],
            ["Base3.006", "Piston3.006"],
            ["Base4.006", "Piston4.006"],
            ["Base1.007", "Piston1.007"],
            ["Base2.007", "Piston2.007"],
            ["Base3.007", "Piston3.007"],
            ["Base4.007", "Piston4.007"],
            ["Base1.008", "Piston1.008"],
            ["Base2.008", "Piston2.008"],
            ["Base3.008", "Piston3.008"],
            ["Base4.008", "Piston4.008"],
            ["Base1.009", "Piston1.009"],
            ["Base2.009", "Piston2.009"],
            ["Base3.009", "Piston3.009"],
            ["Base4.009", "Piston4.009"],
            ["Base1.010", "Piston1.010"],
            ["Base2.010", "Piston2.010"],
            ["Base3.010", "Piston3.010"],
            ["Base4.010", "Piston4.010"],
            ["Base1.011", "Piston1.011"],
            ["Base2.011", "Piston2.011"],
            ["Base3.011", "Piston3.011"],
            ["Base4.011", "Piston4.011"],
        ],
        HeatAnimations: []
    }, {
        get OriginalHeight() { return this.NodeStackTop - this.NodeStackBottom; },
        OriginalBellWidth: 1.517,
        OriginalBaseWidth: 0.72,
        PlumeSizeMultiplier: 1.35,
        PlumePositionOffset: 0.6,
        NodeStackTop: 1.52,
        NodeStackBottom: -1.2,
        ModelPath: "GenericEngines/models/FRE/LE-5/LE-5",
        ModelFiles: [
            "files/models/FRE/LE-5/LE-5.mu",
            "files/models/FRE/LE-5/LE-5Bump_NRM.dds",
            "files/models/FRE/LE-5/LE-5Emissive.dds",
            "files/models/FRE/LE-5/LE-5Texture_Compiled.dds"
        ],
        TextureDefinitions: "",
        ThrustTransformName: "thrustTransform",
        GimbalTransformName: "gimbalTransform",
        ModelName: "LE-5",
        ModelType: EngineGroupType.IRL,
        HiddenMuObjects: [],
        CanAttachOnModel: false,
        OriginalTankVolume: 0,
        RadialAttachment: false,
        RadialAttachmentPoint: 0,
        ImageSource: "img/modelPreviews/LE5.webp",
        get ImageLabel() { return this.ModelName; },
        LookatPairs: [
            ["Base1", "Piston1"],
            ["Base2", "Piston2"],
            ["Base3", "Piston3"],
            ["Base4", "Piston4"]
        ],
        HeatAnimations: [
            "LE-5Heat"
        ]
    }, {
        get OriginalHeight() { return this.NodeStackTop - this.NodeStackBottom; },
        OriginalBellWidth: 2.12,
        OriginalBaseWidth: 1.164,
        PlumeSizeMultiplier: 1.85,
        PlumePositionOffset: 0.3,
        NodeStackTop: 2.1,
        NodeStackBottom: -1.3,
        ModelPath: "GenericEngines/models/FRE/LE-7/LE-7",
        ModelFiles: [
            "files/models/FRE/LE-7/LE-7.mu",
            "files/models/FRE/LE-7/LE-7Bump_NRM.dds",
            "files/models/FRE/LE-7/LE-7Emissive.dds",
            "files/models/FRE/LE-7/LE-7Texture_Compiled.dds"
        ],
        TextureDefinitions: "",
        ThrustTransformName: "thrustTransform",
        GimbalTransformName: "gimbalTransform",
        ModelName: "LE-7",
        ModelType: EngineGroupType.IRL,
        HiddenMuObjects: [],
        CanAttachOnModel: false,
        OriginalTankVolume: 0,
        RadialAttachment: false,
        RadialAttachmentPoint: 0,
        ImageSource: "img/modelPreviews/LE7.webp",
        get ImageLabel() { return this.ModelName; },
        LookatPairs: [
            ["Base1", "Piston1"],
            ["Base2", "Piston2"],
            ["Base3", "Piston3"],
            ["Base4", "Piston4"]
        ],
        HeatAnimations: [
            "LE-7Heat"
        ]
    }, {
        get OriginalHeight() { return this.NodeStackTop - this.NodeStackBottom; },
        OriginalBellWidth: 0.276,
        OriginalBaseWidth: 0.3,
        PlumeSizeMultiplier: 0.23,
        PlumePositionOffset: 0.042,
        NodeStackTop: 0.316,
        NodeStackBottom: -0.198,
        ModelPath: "GenericEngines/models/FRE/RD-843/RD-843",
        ModelFiles: [
            "files/models/FRE/RD-843/RD-843.mu",
            "files/models/FRE/RD-843/TextureRD-843_Compiled.dds"
        ],
        TextureDefinitions: "",
        ThrustTransformName: "thrustTransform",
        GimbalTransformName: "gimbalTransform",
        ModelName: "RD-843",
        ModelType: EngineGroupType.IRL,
        HiddenMuObjects: [],
        CanAttachOnModel: false,
        OriginalTankVolume: 0,
        RadialAttachment: false,
        RadialAttachmentPoint: 0,
        ImageSource: "img/modelPreviews/RD843.webp",
        get ImageLabel() { return this.ModelName; },
        LookatPairs: [
            ["Base1", "Piston1"],
            ["Base2", "Piston2"],
            ["Base3", "Piston3"],
            ["Base4", "Piston4"]
        ],
        HeatAnimations: []
    }, {
        get OriginalHeight() { return this.NodeStackTop - this.NodeStackBottom; },
        OriginalBellWidth: 0.322,
        OriginalBaseWidth: 0.506,
        PlumeSizeMultiplier: 0.28,
        PlumePositionOffset: 0.14,
        NodeStackTop: 0.348,
        NodeStackBottom: -0.405,
        ModelPath: "GenericEngines/models/FRE/Rutherford/Rutherford",
        ModelFiles: [
            "files/models/FRE/Rutherford/Rutherford.mu",
            "files/models/FRE/Rutherford/RutherfordEmissive.dds",
            "files/models/FRE/Rutherford/RutherfordMountTexture_Compiled.dds",
            "files/models/FRE/Rutherford/RutherfordNozzleTexture_Compiled.dds"
        ],
        TextureDefinitions: "",
        ThrustTransformName: "thrustTransform",
        GimbalTransformName: "gimbalTransform",
        ModelName: "Rutherford",
        ModelType: EngineGroupType.IRL,
        HiddenMuObjects: [],
        CanAttachOnModel: false,
        OriginalTankVolume: 0,
        RadialAttachment: false,
        RadialAttachmentPoint: 0,
        ImageSource: "img/modelPreviews/Rutherford.webp",
        get ImageLabel() { return this.ModelName; },
        LookatPairs: [
            ["Base1", "Piston1"],
            ["Base2", "Piston2"],
            ["Base3", "Piston3"],
            ["Base4", "Piston4"]
        ],
        HeatAnimations: [
            "RutherfordHeat"
        ]
    }, {
        get OriginalHeight() { return this.NodeStackTop - this.NodeStackBottom; },
        OriginalBellWidth: 0.679,
        OriginalBaseWidth: 0.506,
        PlumeSizeMultiplier: 0.6,
        PlumePositionOffset: 0.57,
        NodeStackTop: 0.348,
        NodeStackBottom: -1.015,
        ModelPath: "GenericEngines/models/FRE/Rutherford/RutherfordVac",
        ModelFiles: [
            "files/models/FRE/Rutherford/RutherfordVac.mu",
            "files/models/FRE/Rutherford/RutherfordVacEmissive.dds",
            "files/models/FRE/Rutherford/RutherfordMountTexture_Compiled.dds",
            "files/models/FRE/Rutherford/RutherfordVacNozzleTexture_Compiled.dds"
        ],
        TextureDefinitions: "",
        ThrustTransformName: "thrustTransform",
        GimbalTransformName: "gimbalTransform",
        ModelName: "Rutherford Vacuum",
        ModelType: EngineGroupType.IRL,
        HiddenMuObjects: [],
        CanAttachOnModel: false,
        OriginalTankVolume: 0,
        RadialAttachment: false,
        RadialAttachmentPoint: 0,
        ImageSource: "img/modelPreviews/RutherfordVac.webp",
        get ImageLabel() { return this.ModelName; },
        LookatPairs: [
            ["Base1", "Piston1"],
            ["Base2", "Piston2"],
            ["Base3", "Piston3"],
            ["Base4", "Piston4"]
        ],
        HeatAnimations: [
            "RutherfordHeat",
            "RutherfordVacHeat"
        ]
    }, {
        get OriginalHeight() { return this.NodeStackTop - this.NodeStackBottom; },
        OriginalBellWidth: 2.326,
        OriginalBaseWidth: 2.999,
        PlumeSizeMultiplier: 2,
        PlumePositionOffset: 0.88,
        NodeStackTop: 5.33,
        NodeStackBottom: -6.40,
        ModelPath: "GenericEngines/models/FRE/VegaSRM/P80",
        ModelFiles: [
            "files/models/FRE/VegaSRM/P80.mu",
            "files/models/FRE/VegaSRM/TextureP80_Compiled.dds",
            "files/models/FRE/VegaSRM/VegaEmissive.dds"
        ],
        TextureDefinitions: "",
        ThrustTransformName: "thrustTransform",
        GimbalTransformName: "thrustTransform",
        ModelName: "P80",
        ModelType: EngineGroupType.SRB,
        HiddenMuObjects: [],
        CanAttachOnModel: true,
        OriginalTankVolume: 54649,
        RadialAttachment: true,
        RadialAttachmentPoint: 1.5,
        ImageSource: "img/modelPreviews/P80.webp",
        get ImageLabel() { return this.ModelName; },
        LookatPairs: [
            ["Base1", "Piston1"],
            ["Base2", "Piston2"],
            ["Attach1", "Piston3"],
            ["Attach2", "Piston4"]
        ],
        HeatAnimations: [
            "P80Heat"
        ]
    }, {
        get OriginalHeight() { return this.NodeStackTop - this.NodeStackBottom; },
        OriginalBellWidth: 1.036,
        OriginalBaseWidth: 1.9,
        PlumeSizeMultiplier: 0.9,
        PlumePositionOffset: 0.32,
        NodeStackTop: 1.7,
        NodeStackBottom: -1.8,
        ModelPath: "GenericEngines/models/FRE/VegaSRM/Zefiro9",
        ModelFiles: [
            "files/models/FRE/VegaSRM/Zefiro9.mu",
            "files/models/FRE/VegaSRM/TextureZefiro9_Compiled.dds",
            "files/models/FRE/VegaSRM/VegaEmissive.dds"
        ],
        TextureDefinitions: "",
        ThrustTransformName: "thrustTransform",
        GimbalTransformName: "thrustTransform",
        ModelName: "Zefiro 9",
        ModelType: EngineGroupType.SRB,
        HiddenMuObjects: [],
        CanAttachOnModel: true,
        OriginalTankVolume: 4940,
        RadialAttachment: true,
        RadialAttachmentPoint: 0.95,
        ImageSource: "img/modelPreviews/Zefiro9.webp",
        get ImageLabel() { return this.ModelName; },
        LookatPairs: [
            ["Base1", "Piston1"],
            ["Base2", "Piston2"],
            ["Attach1", "Piston3"],
            ["Attach2", "Piston4"]
        ],
        HeatAnimations: [
            "Zefiro9Heat"
        ]
    }, {
        get OriginalHeight() { return this.NodeStackTop - this.NodeStackBottom; },
        OriginalBellWidth: 1.449,
        OriginalBaseWidth: 1.9,
        PlumeSizeMultiplier: 1.3,
        PlumePositionOffset: 0.64,
        NodeStackTop: 3.4,
        NodeStackBottom: -4.18,
        ModelPath: "GenericEngines/models/FRE/VegaSRM/Zefiro23",
        ModelFiles: [
            "files/models/FRE/VegaSRM/Zefiro23.mu",
            "files/models/FRE/VegaSRM/TextureZefiro23_Compiled.dds",
            "files/models/FRE/VegaSRM/VegaEmissive.dds"
        ],
        TextureDefinitions: "",
        ThrustTransformName: "thrustTransform",
        GimbalTransformName: "thrustTransform",
        ModelName: "Zefiro 23",
        ModelType: EngineGroupType.SRB,
        HiddenMuObjects: [],
        CanAttachOnModel: true,
        OriginalTankVolume: 12267,
        RadialAttachment: true,
        RadialAttachmentPoint: 0.95,
        ImageSource: "img/modelPreviews/Zefiro23.webp",
        get ImageLabel() { return this.ModelName; },
        LookatPairs: [
            ["Base1", "Piston1"],
            ["Base2", "Piston2"],
            ["Attach1", "Piston3"],
            ["Attach2", "Piston4"]
        ],
        HeatAnimations: [
            "Zefiro23Heat"
        ]
    }, {
        get OriginalHeight() { return this.NodeStackTop - this.NodeStackBottom; },
        OriginalBellWidth: 0.944,
        OriginalBaseWidth: 0.947,
        PlumeSizeMultiplier: 0.8,
        PlumePositionOffset: 0,
        NodeStackTop: 1.6,
        NodeStackBottom: -1.03,
        ModelPath: "GenericEngines/models/FRE/Viking/VikingLower",
        ModelFiles: [
            "files/models/FRE/Viking/VikingLower.mu",
            "files/models/FRE/Viking/TextureVikingLower_Compiled.dds",
            "files/models/FRE/Viking/VikingLowerEmissive.dds"
        ],
        TextureDefinitions: "",
        ThrustTransformName: "thrustTransform",
        GimbalTransformName: "gimbalTransform",
        ModelName: "Viking",
        ModelType: EngineGroupType.IRL,
        HiddenMuObjects: [],
        CanAttachOnModel: false,
        OriginalTankVolume: 0,
        RadialAttachment: false,
        RadialAttachmentPoint: 0,
        ImageSource: "img/modelPreviews/Viking.webp",
        get ImageLabel() { return this.ModelName; },
        LookatPairs: [],
        HeatAnimations: [
            "VikingHeat"
        ],
        Exhaust: {
            exhaustBellWidth: 0.11,
            exhaustThrustTransform: "exhaustTransform",
            exhaustGimbalTransform: "exhaustTransform",
            exhaustEffectTransform: "exhaustEffect",
        }
    }, {
        get OriginalHeight() { return this.NodeStackTop - this.NodeStackBottom; },
        OriginalBellWidth: 1.8,
        OriginalBaseWidth: 0.947,
        PlumeSizeMultiplier: 1.55,
        PlumePositionOffset: 0.9,
        NodeStackTop: 1.59,
        NodeStackBottom: -2.04,
        ModelPath: "GenericEngines/models/FRE/VikingVac/VikingUpper",
        ModelFiles: [
            "files/models/FRE/VikingVac/VikingUpper.mu",
            "files/models/FRE/VikingVac/VikingUpperEmissive.dds",
            "files/models/FRE/VikingVac/TextureVikingUpper_Compiled.dds"
        ],
        TextureDefinitions: "",
        ThrustTransformName: "thrustTransform",
        GimbalTransformName: "gimbalTransform",
        ModelName: "Viking Vacuum",
        ModelType: EngineGroupType.IRL,
        HiddenMuObjects: [],
        CanAttachOnModel: false,
        OriginalTankVolume: 0,
        RadialAttachment: false,
        RadialAttachmentPoint: 0,
        ImageSource: "img/modelPreviews/VikingVac.webp",
        get ImageLabel() { return this.ModelName; },
        LookatPairs: [],
        HeatAnimations: [
            "VikingHeat"
        ],
        Exhaust: {
            exhaustBellWidth: 0.11,
            exhaustThrustTransform: "exhaustTransform",
            exhaustGimbalTransform: "exhaustTransform",
            exhaustEffectTransform: "exhaustEffect",
        }
    }, {
        get OriginalHeight() { return this.NodeStackTop - this.NodeStackBottom; },
        OriginalBellWidth: 1.639,
        OriginalBaseWidth: 2.5,
        PlumeSizeMultiplier: 1.4,
        PlumePositionOffset: 1.08,
        NodeStackTop: 0.03,
        NodeStackBottom: -1.91,
        ModelPath: "GenericEngines/models/BDB/Apollo/bluedog_Apollo_Block2_ServiceEngine",
        ModelFiles: [
            "files/models/BDB/Apollo/bluedog_Apollo_Block2_ServiceEngine.mu",
            "files/models/BDB/Apollo/bluedog_Apollo_Service.dds",
            "files/models/BDB/Apollo/bluedog_Apollo_Service_Emit.dds",
            "files/models/BDB/Apollo/bluedog_Apollo_Service_NRM.dds",
            "files/models/BDB/Apollo/bluedog_StructuralTop.dds"
        ],
        TextureDefinitions: "",
        ThrustTransformName: "thrustTransform",
        GimbalTransformName: "thrustTransform",
        ModelName: "Apollo Service Propulsion System Block II",
        ModelType: EngineGroupType.IRL,
        HiddenMuObjects: [
            "fairing"
        ],
        CanAttachOnModel: false,
        OriginalTankVolume: 0,
        RadialAttachment: false,
        RadialAttachmentPoint: 0,
        ImageSource: "img/modelPreviews/ApolloSPSBlockII.webp",
        get ImageLabel() { return this.ModelName; },
        LookatPairs: [],
        HeatAnimations: [
            "bluedog_ApolloBlock2Service_Emit"
        ]
    }, {
        get OriginalHeight() { return this.NodeStackTop - this.NodeStackBottom; },
        OriginalBellWidth: 0.578,
        OriginalBaseWidth: 2.5,
        PlumeSizeMultiplier: 0.5,
        PlumePositionOffset: 0,
        NodeStackTop: 0.03,
        NodeStackBottom: -0.844,
        ModelPath: "GenericEngines/models/BDB/Apollo/bluedog_Apollo_Block3_ServiceEngine",
        ModelFiles: [
            "files/models/BDB/Apollo/bluedog_Apollo_Block3_ServiceEngine.mu",
            "files/models/BDB/Apollo/bluedog_LEM.dds",
            "files/models/BDB/Apollo/bluedog_LEM_Emit.dds",
            "files/models/BDB/Apollo/bluedog_LEM_NRM.dds",
            "files/models/BDB/Apollo/bluedog_Apollo_Service.dds",
            "files/models/BDB/Apollo/bluedog_Apollo_Service_NRM.dds",
            "files/models/BDB/Apollo/bluedog_StructuralTop.dds",
            "files/models/BDB/Apollo/bluedog_StructuralTop_NRM.dds",
        ],
        TextureDefinitions: "",
        ThrustTransformName: "thrustTransform",
        GimbalTransformName: "thrustTransform",
        ModelName: "Apollo Service Propulsion System Block III",
        ModelType: EngineGroupType.AlternativeHistory,
        HiddenMuObjects: [
            "fairing"
        ],
        CanAttachOnModel: false,
        OriginalTankVolume: 0,
        RadialAttachment: false,
        RadialAttachmentPoint: 0,
        ImageSource: "img/modelPreviews/ApolloSPSBlockIII.webp",
        get ImageLabel() { return this.ModelName; },
        LookatPairs: [],
        HeatAnimations: [
            "LEM_spsA_Emit_Anim"
        ]
    }, {
        get OriginalHeight() { return this.NodeStackTop - this.NodeStackBottom; },
        OriginalBellWidth: 0.81,
        OriginalBaseWidth: 2.5,
        PlumeSizeMultiplier: 0.7,
        PlumePositionOffset: 0.46,
        NodeStackTop: 0.02,
        NodeStackBottom: -1.06,
        ModelPath: "GenericEngines/models/BDB/Apollo/bluedog_Apollo_Block5_ServiceEngine",
        ModelFiles: [
            "files/models/BDB/Apollo/bluedog_Apollo_Block5_ServiceEngine.mu",
            "files/models/BDB/Apollo/bluedog_LEM.dds",
            "files/models/BDB/Apollo/bluedog_LEM_NRM.dds",
            "files/models/BDB/Apollo/bluedog_Apollo_Service.dds",
            "files/models/BDB/Apollo/bluedog_Apollo_Service_NRM.dds",
            "files/models/BDB/Apollo/bluedog_Apollo_ExtraParts1.dds",
            "files/models/BDB/Apollo/bluedog_Apollo_ExtraParts1_NRM.dds",
            "files/models/BDB/Apollo/bluedog_StructuralTop.dds",
        ],
        TextureDefinitions: "",
        ThrustTransformName: "thrustTransform",
        GimbalTransformName: "thrustTransform",
        ModelName: "Apollo Service Propulsion System Block V",
        ModelType: EngineGroupType.AlternativeHistory,
        HiddenMuObjects: [
            "fairing"
        ],
        CanAttachOnModel: false,
        OriginalTankVolume: 0,
        RadialAttachment: false,
        RadialAttachmentPoint: 0,
        ImageSource: "img/modelPreviews/ApolloSPSBlockV.webp",
        get ImageLabel() { return this.ModelName; },
        LookatPairs: [],
        HeatAnimations: []
    }, {
        get OriginalHeight() { return this.NodeStackTop - this.NodeStackBottom; },
        OriginalBellWidth: 0.531,
        OriginalBaseWidth: 0.373,
        PlumeSizeMultiplier: 0.45,
        PlumePositionOffset: 0,
        NodeStackTop: 0.28,
        NodeStackBottom: -0.58,
        ModelPath: "GenericEngines/models/BDB/Apollo/bluedog_LEM_Ascent_Engine",
        ModelFiles: [
            "files/models/BDB/Apollo/bluedog_LEM_Ascent_Engine.mu",
            "files/models/BDB/Apollo/bluedog_LEM.dds",
            "files/models/BDB/Apollo/bluedog_LEM_NRM.dds",
            "files/models/BDB/Apollo/bluedog_LEM_Emit.dds"
        ],
        TextureDefinitions: "",
        ThrustTransformName: "thrustTransform",
        GimbalTransformName: "thrustTransform",
        ModelName: "Lunar Module Ascent Engine",
        ModelType: EngineGroupType.IRL,
        HiddenMuObjects: [],
        CanAttachOnModel: false,
        OriginalTankVolume: 0,
        RadialAttachment: false,
        RadialAttachmentPoint: 0,
        ImageSource: "img/modelPreviews/LMAE_BDB.webp",
        get ImageLabel() { return this.ModelName; },
        LookatPairs: [],
        HeatAnimations: [
            "LEM_Ascent_Emit_Anim"
        ]
    }, {
        get OriginalHeight() { return this.NodeStackTop - this.NodeStackBottom; },
        OriginalBellWidth: 0.811,
        OriginalBaseWidth: 0.391,
        PlumeSizeMultiplier: 0.7,
        PlumePositionOffset: 0.52,
        NodeStackTop: 0.138,
        NodeStackBottom: -0.99,
        ModelPath: "GenericEngines/models/BDB/Apollo/bluedog_LEM_Descent_Engine",
        ModelFiles: [
            "files/models/BDB/Apollo/bluedog_LEM_Descent_Engine.mu",
            "files/models/BDB/Apollo/bluedog_LEM.dds",
            "files/models/BDB/Apollo/bluedog_LEM_NRM.dds",
            "files/models/BDB/Apollo/bluedog_LEM_Emit.dds"
        ],
        TextureDefinitions: "",
        ThrustTransformName: "thrustTransform",
        GimbalTransformName: "thrustTransform",
        ModelName: "Lunar Module Descent Engine",
        ModelType: EngineGroupType.IRL,
        HiddenMuObjects: [],
        CanAttachOnModel: false,
        OriginalTankVolume: 0,
        RadialAttachment: false,
        RadialAttachmentPoint: 0,
        ImageSource: "img/modelPreviews/LMDE_BDB.webp",
        get ImageLabel() { return this.ModelName; },
        LookatPairs: [],
        HeatAnimations: [
            "LEM_Descent_Emit_Anim"
        ]
    }, {
        get OriginalHeight() { return this.NodeStackTop - this.NodeStackBottom; },
        OriginalBellWidth: 0.723,
        OriginalBaseWidth: 0.66,
        PlumeSizeMultiplier: 0.62,
        PlumePositionOffset: 0,
        NodeStackTop: 0.33,
        NodeStackBottom: -1.02,
        ModelPath: "GenericEngines/models/BDB/Atlas/bluedog_Atlas_LR89",
        ModelFiles: [
            "files/models/BDB/Atlas/bluedog_Atlas_LR89.mu",
            "files/models/BDB/Atlas/bluedog_Atlas_Engines.dds",
            "files/models/BDB/Atlas/bluedog_Atlas_Engines_NRM.dds",
            "files/models/BDB/Atlas/bluedog_Atlas_Engines_Emissive.dds"
        ],
        TextureDefinitions: "",
        ThrustTransformName: "thrustTransform",
        GimbalTransformName: "gimbalTransform",
        ModelName: "LR89",
        ModelType: EngineGroupType.IRL,
        HiddenMuObjects: [],
        CanAttachOnModel: false,
        OriginalTankVolume: 0,
        RadialAttachment: false,
        RadialAttachmentPoint: 0,
        ImageSource: "img/modelPreviews/LR89.webp",
        get ImageLabel() { return this.ModelName; },
        LookatPairs: [
            ["Gimbal1_Upper", "Gimbal1_Lower"],
            ["Gimbal1_Lower", "Gimbal1_Upper"],
            ["Gimbal2_Upper", "Gimbal2_Lower"],
            ["Gimbal2_Lower", "Gimbal2_Upper"],
        ],
        HeatAnimations: [
            "LR89_Heat_Anim"
        ]
    }, {
        get OriginalHeight() { return this.NodeStackTop - this.NodeStackBottom; },
        OriginalBellWidth: 0.111,
        OriginalBaseWidth: 0.25,
        PlumeSizeMultiplier: 0.095,
        PlumePositionOffset: 0.028,
        NodeStackTop: 0.075,
        NodeStackBottom: -0.505,
        ModelPath: "GenericEngines/models/BDB/Atlas/bluedog_Atlas_LR101_Inline",
        ModelFiles: [
            "files/models/BDB/Atlas/bluedog_Atlas_LR101_Inline.mu",
            "files/models/BDB/Atlas/bluedog_Atlas_Engines.dds",
            "files/models/BDB/Atlas/bluedog_Atlas_Engines_NRM.dds",
            "files/models/BDB/Atlas/bluedog_Atlas_Engines_Emissive.dds"
        ],
        TextureDefinitions: "",
        ThrustTransformName: "thrustTransform",
        GimbalTransformName: "YawGimbal",
        ModelName: "LR101",
        ModelType: EngineGroupType.IRL,
        HiddenMuObjects: [],
        CanAttachOnModel: false,
        OriginalTankVolume: 0,
        RadialAttachment: false,
        RadialAttachmentPoint: 0,
        ImageSource: "img/modelPreviews/LR101.webp",
        get ImageLabel() { return this.ModelName; },
        LookatPairs: [],
        HeatAnimations: [
            "LR101_Heat_Anim"
        ]
    }, {
        get OriginalHeight() { return this.NodeStackTop - this.NodeStackBottom; },
        OriginalBellWidth: 0.73,
        OriginalBaseWidth: 0.66,
        PlumeSizeMultiplier: 0.64,
        PlumePositionOffset: -0.07,
        NodeStackTop: 0.774,
        NodeStackBottom: -0.774,
        ModelPath: "GenericEngines/models/BDB/Atlas/bluedog_Atlas_LR105",
        ModelFiles: [
            "files/models/BDB/Atlas/bluedog_Atlas_LR105.mu",
            "files/models/BDB/Atlas/bluedog_Atlas_Engines.dds",
            "files/models/BDB/Atlas/bluedog_Atlas_Engines_NRM.dds",
            "files/models/BDB/Atlas/bluedog_Atlas_Engines_Emissive.dds"
        ],
        TextureDefinitions: "",
        ThrustTransformName: "thrustTransform",
        GimbalTransformName: "gimbalTransform",
        ModelName: "LR105",
        ModelType: EngineGroupType.IRL,
        HiddenMuObjects: [],
        CanAttachOnModel: false,
        OriginalTankVolume: 0,
        RadialAttachment: false,
        RadialAttachmentPoint: 0,
        ImageSource: "img/modelPreviews/LR105.webp",
        get ImageLabel() { return this.ModelName; },
        LookatPairs: [
            ["Gimbal1_Upper", "Gimbal1_Lower"],
            ["Gimbal1_Lower", "Gimbal1_Upper"],
            ["Gimbal2_Upper", "Gimbal2_Lower"],
            ["Gimbal2_Lower", "Gimbal2_Upper"],
        ],
        HeatAnimations: [
            "bluedog_Atlas_LR105_Emit"
        ]
    }, {
        get OriginalHeight() { return this.NodeStackTop - this.NodeStackBottom; },
        OriginalBellWidth: 0.819,
        OriginalBaseWidth: 1.6,
        PlumeSizeMultiplier: 0.71,
        PlumePositionOffset: -0.32,
        NodeStackTop: 0.4,
        NodeStackBottom: -1.65,
        ModelPath: "GenericEngines/models/BDB/AtlasV/bluedog_AtlasV_RD180_Naked",
        ModelFiles: [
            "files/models/BDB/AtlasV/bluedog_AtlasV_RD180_Naked.mu",
            "files/models/BDB/AtlasV/bluedog_RD180.dds",
            "files/models/BDB/AtlasV/bluedog_RD180_emit.dds",
            "files/models/BDB/AtlasV/bluedog_RD180_NRM.dds"
        ],
        TextureDefinitions: "",
        ThrustTransformName: "thrustTransform",
        GimbalTransformName: "pitchGimbalTransform",
        ModelName: "RD-180",
        ModelType: EngineGroupType.IRL,
        HiddenMuObjects: [],
        CanAttachOnModel: false,
        OriginalTankVolume: 0,
        RadialAttachment: false,
        RadialAttachmentPoint: 0,
        ImageSource: "img/modelPreviews/RD180_BDB.webp",
        get ImageLabel() { return this.ModelName; },
        LookatPairs: [
            ["PistonPN", "GimbalActuatorPN"],
            ["GimbalActuatorPN", "PistonPN"],
            ["PistonPZ", "GimbalActuatorPZ"],
            ["GimbalActuatorPZ", "PistonPZ"],
            ["PistonSN", "GimbalActuatorSN"],
            ["GimbalActuatorSN", "PistonSN"],
            ["PistonSZ", "GimbalActuatorSZ"],
            ["GimbalActuatorSZ", "PistonSZ"],
        ],
        HeatAnimations: [
            "RD180_Heat_Anim"
        ]
    }, {
        get OriginalHeight() { return this.NodeStackTop - this.NodeStackBottom; },
        OriginalBellWidth: 0.641,
        OriginalBaseWidth: 0.352,
        PlumeSizeMultiplier: 0.57,
        PlumePositionOffset: 0,
        NodeStackTop: 0.326,
        NodeStackBottom: -0.81,
        ModelPath: "GenericEngines/models/BDB/Centaur/bluedog_Centaur_RL10_Shroudless",
        ModelFiles: [
            "files/models/BDB/Centaur/bluedog_Centaur_RL10_Shroudless.mu",
            "files/models/BDB/Centaur/bluedog_RL10.dds",
            "files/models/BDB/Centaur/bluedog_RL10_Emit.dds",
            "files/models/BDB/Centaur/bluedog_RL10_NRM.dds",
            "files/models/BDB/Centaur/bluedog_Centaur.dds",
            "files/models/BDB/Centaur/bluedog_Centaur_NRM.dds"
        ],
        TextureDefinitions: "",
        ThrustTransformName: "thrustTransform",
        GimbalTransformName: "gimbalTransform",
        ModelName: "RL10",
        ModelType: EngineGroupType.IRL,
        HiddenMuObjects: [],
        CanAttachOnModel: false,
        OriginalTankVolume: 0,
        RadialAttachment: false,
        RadialAttachmentPoint: 0,
        ImageSource: "img/modelPreviews/RL10.webp",
        get ImageLabel() { return this.ModelName; },
        LookatPairs: [
            ["lowerGimbal", "upperGimbal"],
            ["upperGimbal", "lowerGimbal"],
        ],
        HeatAnimations: []
    }, {
        OriginalHeight: 1.512,
        OriginalBellWidth: 0.73,
        OriginalBaseWidth: 0.352,
        PlumeSizeMultiplier: 0.64,
        PlumePositionOffset: 0,
        NodeStackTop: 0.332,
        NodeStackBottom: -0.805,
        ModelPath: "GenericEngines/models/BDB/Centaur/bluedog_Centaur_RL10A41_Shroudless_Extended",
        ModelFiles: [
            "files/models/BDB/Centaur/bluedog_Centaur_RL10A41_Shroudless_Extended.mu",
            "files/models/BDB/Centaur/bluedog_RL10.dds",
            "files/models/BDB/Centaur/bluedog_RL10_Emit.dds",
            "files/models/BDB/Centaur/bluedog_RL10_NRM.dds",
            "files/models/BDB/Centaur/bluedog_Centaur.dds",
            "files/models/BDB/Centaur/bluedog_Centaur_NRM.dds"
        ],
        TextureDefinitions: "",
        ThrustTransformName: "thrustTransform",
        GimbalTransformName: "gimbalTransform",
        ModelName: "RL10A-4-1",
        ModelType: EngineGroupType.IRL,
        HiddenMuObjects: [],
        CanAttachOnModel: false,
        OriginalTankVolume: 0,
        RadialAttachment: false,
        RadialAttachmentPoint: 0,
        ImageSource: "img/modelPreviews/RL10A41.webp",
        get ImageLabel() { return this.ModelName; },
        LookatPairs: [
            ["lowerGimbal", "upperGimbal"],
            ["upperGimbal", "lowerGimbal"],
        ],
        HeatAnimations: [
            "RL10A41_Emit"
        ],
        ExtendNozzleAnimation: "extend"
    }, {
        OriginalHeight: 2.08,
        OriginalBellWidth: 0.905,
        OriginalBaseWidth: 0.64,
        PlumeSizeMultiplier: 0.8,
        PlumePositionOffset: 0,
        NodeStackTop: 0.33,
        NodeStackBottom: -0.807,
        ModelPath: "GenericEngines/models/BDB/Centaur/bluedog_Centaur_RL10B2_Shroudless_Extended",
        ModelFiles: [
            "files/models/BDB/Centaur/bluedog_Centaur_RL10B2_Shroudless_Extended.mu",
            "files/models/BDB/Centaur/bluedog_RL10.dds",
            "files/models/BDB/Centaur/bluedog_RL10_Emit.dds",
            "files/models/BDB/Centaur/bluedog_RL10_NRM.dds",
            "files/models/BDB/Centaur/bluedog_Centaur.dds",
            "files/models/BDB/Centaur/bluedog_Centaur_NRM.dds",
            "files/models/BDB/Centaur/bluedog_Centaur_NozzleExtension.dds",
            "files/models/BDB/Centaur/bluedog_Centaur_NozzleExtension_Emit.dds",
            "files/models/BDB/Centaur/bluedog_Centaur_NozzleExtension_Nrm.dds"
        ],
        TextureDefinitions: "",
        ThrustTransformName: "thrustTransform",
        GimbalTransformName: "gimbalTransform",
        ModelName: "RL10B-2",
        ModelType: EngineGroupType.IRL,
        HiddenMuObjects: [],
        CanAttachOnModel: false,
        OriginalTankVolume: 0,
        RadialAttachment: false,
        RadialAttachmentPoint: 0,
        ImageSource: "img/modelPreviews/RL10B2_BDB.webp",
        get ImageLabel() { return this.ModelName; },
        LookatPairs: [
            ["lowerGimbal", "upperGimbal"],
            ["upperGimbal", "lowerGimbal"],
        ],
        HeatAnimations: [
            "RL10B2_Emit"
        ],
        ExtendNozzleAnimation: "extend"
    }, {
        get OriginalHeight() { return this.NodeStackTop - this.NodeStackBottom; },
        OriginalBellWidth: 0.508,
        OriginalBaseWidth: 0.625,
        PlumeSizeMultiplier: 0.42,
        PlumePositionOffset: -0.08,
        NodeStackTop: 3.055,
        NodeStackBottom: -3.8,
        ModelPath: "GenericEngines/models/BDB/Delta/bluedog_Delta_GEM40_Inline",
        ModelFiles: [
            "files/models/BDB/Delta/bluedog_Delta_GEM40_Inline.mu",
            "files/models/BDB/Delta/bluedog_Delta2_Engines.dds",
            "files/models/BDB/Delta/bluedog_Delta2_Engines_Emit.dds",
            "files/models/BDB/Delta/bluedog_Delta2_Engines_NRM.dds"
        ],
        TextureDefinitions: "",
        ThrustTransformName: "thrustTransform",
        GimbalTransformName: "gimbalTransform",
        ModelName: "GEM 40",
        ModelType: EngineGroupType.SRB,
        HiddenMuObjects: [],
        CanAttachOnModel: true,
        OriginalTankVolume: 1337,
        RadialAttachment: true,
        RadialAttachmentPoint: 0.3125,
        ImageSource: "img/modelPreviews/GEM40.webp",
        get ImageLabel() { return this.ModelName; },
        LookatPairs: [],
        HeatAnimations: [
            "GEM60_Emit_Anim"
        ]
    }, {
        get OriginalHeight() { return this.NodeStackTop - this.NodeStackBottom; },
        OriginalBellWidth: 0.813,
        OriginalBaseWidth: 0.54,
        PlumeSizeMultiplier: 0.73,
        PlumePositionOffset: 0,
        NodeStackTop: 0.033,
        NodeStackBottom: -1.21,
        ModelPath: "GenericEngines/models/BDB/Delta/bluedog_DeltaK_AJ10_Shroudless",
        ModelFiles: [
            "files/models/BDB/Delta/bluedog_DeltaK_AJ10_Shroudless.mu",
            "files/models/BDB/Delta/bluedog_DeltaK.dds",
            "files/models/BDB/Delta/bluedog_DeltaK_Emit.dds",
            "files/models/BDB/Delta/bluedog_DeltaK_NRM.dds"
        ],
        TextureDefinitions: "",
        ThrustTransformName: "thrustTransform",
        GimbalTransformName: "thrustTransform1",
        ModelName: "AJ10",
        ModelType: EngineGroupType.IRL,
        HiddenMuObjects: [],
        CanAttachOnModel: false,
        OriginalTankVolume: 0,
        RadialAttachment: false,
        RadialAttachmentPoint: 0,
        ImageSource: "img/modelPreviews/AJ10_BDB.webp",
        get ImageLabel() { return this.ModelName; },
        LookatPairs: [],
        HeatAnimations: []
    }, {
        get OriginalHeight() { return this.NodeStackTop - this.NodeStackBottom; },
        OriginalBellWidth: 0.865,
        OriginalBaseWidth: 1.377,
        PlumeSizeMultiplier: 0.76,
        PlumePositionOffset: 0.55,
        NodeStackTop: 0.88,
        NodeStackBottom: -1.29,
        ModelPath: "GenericEngines/models/BDB/Diamant/bluedog_Diamant_Rita_Shroudless_ColliderTweaked",
        ModelFiles: [
            "files/models/BDB/Diamant/bluedog_Diamant_Rita_Shroudless_ColliderTweaked.mu",
            "files/models/BDB/Diamant/bluedog_DiamantEngines.dds",
            "files/models/BDB/Diamant/bluedog_DiamantEngines_NRM.dds"
        ],
        TextureDefinitions: "",
        ThrustTransformName: "thrustTransform",
        GimbalTransformName: "thrustTransform",
        ModelName: "P4 Rita",
        ModelType: EngineGroupType.SRB,
        HiddenMuObjects: [],
        CanAttachOnModel: true,
        OriginalTankVolume: 1395,
        RadialAttachment: true,
        RadialAttachmentPoint: 0.6885,
        ImageSource: "img/modelPreviews/Rita.webp",
        get ImageLabel() { return this.ModelName; },
        LookatPairs: [],
        HeatAnimations: []
    }, {
        get OriginalHeight() { return this.NodeStackTop - this.NodeStackBottom; },
        OriginalBellWidth: 0.498,
        OriginalBaseWidth: 0.591,
        PlumeSizeMultiplier: 0.43,
        PlumePositionOffset: 0.186,
        NodeStackTop: 0.485,
        NodeStackBottom: -0.725,
        ModelPath: "GenericEngines/models/BDB/Diamant/bluedog_Diamant_Rubis_Shroudless_ColliderTweaked",
        ModelFiles: [
            "files/models/BDB/Diamant/bluedog_Diamant_Rubis_Shroudless_ColliderTweaked.mu",
            "files/models/BDB/Diamant/bluedog_DiamantEngines.dds",
            "files/models/BDB/Diamant/bluedog_DiamantEngines_NRM.dds"
        ],
        TextureDefinitions: "",
        ThrustTransformName: "thrustTransform",
        GimbalTransformName: "thrustTransform",
        ModelName: "Rubis",
        ModelType: EngineGroupType.SRB,
        HiddenMuObjects: [],
        CanAttachOnModel: true,
        OriginalTankVolume: 130,
        RadialAttachment: true,
        RadialAttachmentPoint: 0.2955,
        ImageSource: "img/modelPreviews/Rubis.webp",
        get ImageLabel() { return this.ModelName; },
        LookatPairs: [],
        HeatAnimations: []
    }, {
        get OriginalHeight() { return this.NodeStackTop - this.NodeStackBottom; },
        OriginalBellWidth: 0.219,
        OriginalBaseWidth: 0.623,
        PlumeSizeMultiplier: 0.19,
        PlumePositionOffset: 0,
        NodeStackTop: 1.275,
        NodeStackBottom: -1.452,
        ModelPath: "GenericEngines/models/BDB/Diamant/bluedog_Diamant_Topaze_Shroudless_Tweaked",
        ModelFiles: [
            "files/models/BDB/Diamant/bluedog_Diamant_Topaze_Shroudless_Tweaked.mu",
            "files/models/BDB/Diamant/bluedog_DiamantEngines.dds",
            "files/models/BDB/Diamant/bluedog_DiamantEngines_NRM.dds"
        ],
        TextureDefinitions: "",
        ThrustTransformName: "thrustTransform",
        GimbalTransformName: "gimbalTransform",
        ModelName: "Topaze",
        ModelType: EngineGroupType.SRB,
        HiddenMuObjects: [
            "fairing"
        ],
        CanAttachOnModel: true,
        OriginalTankVolume: 432,
        RadialAttachment: true,
        RadialAttachmentPoint: 0.3115,
        ImageSource: "img/modelPreviews/Topaze.webp",
        get ImageLabel() { return this.ModelName; },
        LookatPairs: [],
        HeatAnimations: []
    }, {
        get OriginalHeight() { return this.NodeStackTop - this.NodeStackBottom; },
        OriginalBellWidth: 0.346,
        OriginalBaseWidth: 0.337,
        PlumeSizeMultiplier: 0.3,
        PlumePositionOffset: 0.18,
        NodeStackTop: 0.5,
        NodeStackBottom: -0.29,
        ModelPath: "GenericEngines/models/BDB/EarlyRockets/bluedog_ableEngine",
        ModelFiles: [
            "files/models/BDB/EarlyRockets/bluedog_ableEngine.mu",
            "files/models/BDB/EarlyRockets/bluedog_earlyEngines.dds",
            "files/models/BDB/EarlyRockets/bluedog_earlyEngines_Emissive.dds",
            "files/models/BDB/EarlyRockets/bluedog_earlyEngines_NRM.dds"
        ],
        TextureDefinitions: "",
        ThrustTransformName: "thrustTransform",
        GimbalTransformName: "thrustTransform",
        ModelName: "Able",
        ModelType: EngineGroupType.IRL,
        HiddenMuObjects: [],
        CanAttachOnModel: false,
        OriginalTankVolume: 0,
        RadialAttachment: false,
        RadialAttachmentPoint: 0,
        ImageSource: "img/modelPreviews/Able.webp",
        get ImageLabel() { return this.ModelName; },
        LookatPairs: [],
        HeatAnimations: [
            "Able_Emit_Anim"
        ]
    }, {
        get OriginalHeight() { return this.NodeStackTop - this.NodeStackBottom; },
        OriginalBellWidth: 0.480,
        OriginalBaseWidth: 0.585,
        PlumeSizeMultiplier: 0.42,
        PlumePositionOffset: 0.265,
        NodeStackTop: 0.666,
        NodeStackBottom: -0.425,
        ModelPath: "GenericEngines/models/BDB/EarlyRockets/bluedog_ablestarEngine",
        ModelFiles: [
            "files/models/BDB/EarlyRockets/bluedog_ablestarEngine.mu",
            "files/models/BDB/EarlyRockets/bluedog_earlyEngines.dds",
            "files/models/BDB/EarlyRockets/bluedog_earlyEngines_Emissive.dds",
            "files/models/BDB/EarlyRockets/bluedog_earlyEngines_NRM.dds"
        ],
        TextureDefinitions: "",
        ThrustTransformName: "thrustTransform",
        GimbalTransformName: "thrustTransform",
        ModelName: "Ablestar",
        ModelType: EngineGroupType.IRL,
        HiddenMuObjects: [],
        CanAttachOnModel: false,
        OriginalTankVolume: 0,
        RadialAttachment: false,
        RadialAttachmentPoint: 0,
        ImageSource: "img/modelPreviews/Ablestar.webp",
        get ImageLabel() { return this.ModelName; },
        LookatPairs: [],
        HeatAnimations: [
            "Able_Emit_Anim"
        ]
    }, {
        get OriginalHeight() { return this.NodeStackTop - this.NodeStackBottom; },
        OriginalBellWidth: 0.269,
        OriginalBaseWidth: 0.81,
        PlumeSizeMultiplier: 0.235,
        PlumePositionOffset: 0,
        NodeStackTop: 0.52,
        NodeStackBottom: -0.535,
        ModelPath: "GenericEngines/models/BDB/EarlyRockets/bluedog_navaho_Tweaked",
        ModelFiles: [
            "files/models/BDB/EarlyRockets/bluedog_navaho_Tweaked.mu",
            "files/models/BDB/EarlyRockets/bluedog_earlyEngines_NRM.dds",
            "files/models/BDB/EarlyRockets/bluedog_earlyEngines.dds",
            "files/models/BDB/EarlyRockets/bluedog_thorEngine_NRM.dds",
            "files/models/BDB/EarlyRockets/bluedog_thorEngine.dds"
        ],
        TextureDefinitions: "",
        ThrustTransformName: "thrustTransform",
        GimbalTransformName: "gimbal",
        ModelName: "Navaho",
        ModelType: EngineGroupType.IRL,
        HiddenMuObjects: [],
        CanAttachOnModel: false,
        OriginalTankVolume: 0,
        RadialAttachment: false,
        RadialAttachmentPoint: 0,
        ImageSource: "img/modelPreviews/Navaho.webp",
        get ImageLabel() { return this.ModelName; },
        LookatPairs: [],
        HeatAnimations: [],
        Exhaust: {
            exhaustBellWidth: 0.059,
            exhaustThrustTransform: "exhaustTransform",
            exhaustGimbalTransform: "polySurface27",
            exhaustEffectTransform: "exhaustEffect",
        }
    }, {
        get OriginalHeight() { return this.NodeStackTop - this.NodeStackBottom; },
        OriginalBellWidth: 0.885,
        OriginalBaseWidth: 1.499,
        PlumeSizeMultiplier: 0.78,
        PlumePositionOffset: 0.58,
        NodeStackTop: 0.125,
        NodeStackBottom: -2.13,
        ModelPath: "GenericEngines/models/BDB/EarlyRockets/bluedog_thorEngine",
        ModelFiles: [
            "files/models/BDB/EarlyRockets/bluedog_thorEngine.mu",
            "files/models/BDB/EarlyRockets/bluedog_thorEngine_NRM.dds",
            "files/models/BDB/EarlyRockets/bluedog_thorEngine.dds"
        ],
        TextureDefinitions: "",
        ThrustTransformName: "thrustTransform",
        GimbalTransformName: "thrustTransform",
        ModelName: "Thor",
        ModelType: EngineGroupType.IRL,
        HiddenMuObjects: [],
        CanAttachOnModel: false,
        OriginalTankVolume: 0,
        RadialAttachment: false,
        RadialAttachmentPoint: 0,
        ImageSource: "img/modelPreviews/Thor.webp",
        get ImageLabel() { return this.ModelName; },
        LookatPairs: [],
        HeatAnimations: [],
        Exhaust: {
            exhaustBellWidth: 0.135,
            exhaustThrustTransform: "exhaustTransform",
            exhaustGimbalTransform: "vernierTransform",
            exhaustEffectTransform: "exhaustEffect",
        }
    }, {
        get OriginalHeight() { return this.NodeStackTop - this.NodeStackBottom; },
        OriginalBellWidth: 0.284,
        OriginalBaseWidth: 0.605,
        PlumeSizeMultiplier: 0.25,
        PlumePositionOffset: 0.62,
        NodeStackTop: 0.37,
        NodeStackBottom: -0.87,
        ModelPath: "GenericEngines/models/BDB/EarlyRockets/bluedog_vanguardEngine",
        ModelFiles: [
            "files/models/BDB/EarlyRockets/bluedog_vanguardEngine.mu",
            "files/models/BDB/EarlyRockets/bluedog_earlyEngines.dds",
            "files/models/BDB/EarlyRockets/bluedog_earlyEngines_Emissive.dds",
            "files/models/BDB/EarlyRockets/bluedog_earlyEngines_NRM.dds"
        ],
        TextureDefinitions: "",
        ThrustTransformName: "thrustTransform",
        GimbalTransformName: "thrustTransform",
        ModelName: "Vanguard",
        ModelType: EngineGroupType.IRL,
        HiddenMuObjects: [],
        CanAttachOnModel: false,
        OriginalTankVolume: 0,
        RadialAttachment: false,
        RadialAttachmentPoint: 0,
        ImageSource: "img/modelPreviews/Vanguard.webp",
        get ImageLabel() { return this.ModelName; },
        LookatPairs: [],
        HeatAnimations: [
            "Vanguard_Engine_Anim"
        ],
        Exhaust: {
            exhaustBellWidth: 0.0975,
            exhaustThrustTransform: "vernierTransform",
            exhaustGimbalTransform: "vernierTransform",
            exhaustEffectTransform: "vernierTransform",
        }
    }, {
        get OriginalHeight() { return this.NodeStackTop - this.NodeStackBottom; },
        OriginalBellWidth: 0.975,
        OriginalBaseWidth: 1.061,
        PlumeSizeMultiplier: 0.86,
        PlumePositionOffset: 0,
        NodeStackTop: 1.2,
        NodeStackBottom: -0.86,
        ModelPath: "GenericEngines/models/BDB/Engines/bluedog_E1",
        ModelFiles: [
            "files/models/BDB/Engines/bluedog_E1.mu",
            "files/models/BDB/Engines/bluedog_E1.dds",
            "files/models/BDB/Engines/bluedog_E1_Emit.dds",
            "files/models/BDB/Engines/bluedog_E1_NRM.dds"
        ],
        TextureDefinitions: "",
        ThrustTransformName: "thrustTransform",
        GimbalTransformName: "gimbalTransform",
        ModelName: "E-1",
        ModelType: EngineGroupType.IRL,
        HiddenMuObjects: [],
        CanAttachOnModel: false,
        OriginalTankVolume: 0,
        RadialAttachment: false,
        RadialAttachmentPoint: 0,
        ImageSource: "img/modelPreviews/E1.webp",
        get ImageLabel() { return this.ModelName; },
        LookatPairs: [
            ["gimbalBone1", "gimbalArm1_1"],
            ["gimbalBone1", "gimbalArm1_2"],
            ["gimbalBone2", "gimbalArm2_1"],
            ["gimbalBone2", "gimbalArm2_2"],
        ],
        HeatAnimations: [
            "E1_Heat_Anim"
        ],
        Exhaust: {
            exhaustBellWidth: 0.168,
            exhaustThrustTransform: "exhaustTransform",
            exhaustGimbalTransform: "exhaustTransform",
            exhaustEffectTransform: "exhaustEffect",
        }
    }, {
        get OriginalHeight() { return this.NodeStackTop - this.NodeStackBottom; },
        OriginalBellWidth: 0.106,
        OriginalBaseWidth: 0.12,
        PlumeSizeMultiplier: 0.095,
        PlumePositionOffset: 0,
        NodeStackTop: 0.3,
        NodeStackBottom: -0.52,
        ModelPath: "GenericEngines/models/BDB/Explorer/bluedog_Sargent_1x",
        ModelFiles: [
            "files/models/BDB/Explorer/bluedog_Sargent_1x.mu",
            "files/models/BDB/Explorer/bluedog_JunoProbes.dds",
            "files/models/BDB/Explorer/bluedog_JunoProbes_NRM.dds"
        ],
        TextureDefinitions: "",
        ThrustTransformName: "thrustTransform",
        GimbalTransformName: "thrustTransform",
        ModelName: "Sargent",
        ModelType: EngineGroupType.SRB,
        HiddenMuObjects: [],
        CanAttachOnModel: true,
        OriginalTankVolume: 4.3,
        RadialAttachment: true,
        RadialAttachmentPoint: 0.06,
        ImageSource: "img/modelPreviews/Sargent.webp",
        get ImageLabel() { return this.ModelName; },
        LookatPairs: [],
        HeatAnimations: []
    }, {
        get OriginalHeight() { return this.NodeStackTop - this.NodeStackBottom; },
        OriginalBellWidth: 0.376,
        OriginalBaseWidth: 0.898,
        PlumeSizeMultiplier: 0.32,
        PlumePositionOffset: 0.28,
        NodeStackTop: 0.013,
        NodeStackBottom: -1.09,
        ModelPath: "GenericEngines/models/BDB/Juno/bluedog_Juno_Engine6K",
        ModelFiles: [
            "files/models/BDB/Juno/bluedog_Juno_Engine6K.mu",
            "files/models/BDB/Juno/bluedog_JunoEngines.dds"
        ],
        TextureDefinitions: "",
        ThrustTransformName: "thrustTransform",
        GimbalTransformName: "thrustTransform",
        ModelName: "Juno 6K",
        ModelType: EngineGroupType.IRL,
        HiddenMuObjects: [
            "fairing"
        ],
        CanAttachOnModel: false,
        OriginalTankVolume: 0,
        RadialAttachment: false,
        RadialAttachmentPoint: 0,
        ImageSource: "img/modelPreviews/Juno6K.webp",
        get ImageLabel() { return this.ModelName; },
        LookatPairs: [],
        HeatAnimations: [],
        Exhaust: {
            exhaustBellWidth: 0.0945,
            exhaustThrustTransform: "vernierEffects",
            exhaustGimbalTransform: "vernierTransform",
            exhaustEffectTransform: "vernierEffects",
        }
    }, {
        get OriginalHeight() { return this.NodeStackTop - this.NodeStackBottom; },
        OriginalBellWidth: 0.7,
        OriginalBaseWidth: 1.231,
        PlumeSizeMultiplier: 0.6,
        PlumePositionOffset: 0.0,
        NodeStackTop: 0.0198,
        NodeStackBottom: -1.6836,
        ModelPath: "GenericEngines/models/BDB/Juno/bluedog_Juno_Engine45K",
        ModelFiles: [
            "files/models/BDB/Juno/bluedog_Juno_Engine45K.mu",
            "files/models/BDB/Juno/bluedog_JunoEngines.dds"
        ],
        TextureDefinitions: "",
        ThrustTransformName: "thrustTransform",
        GimbalTransformName: "gimbalTransform",
        ModelName: "Juno 45K",
        ModelType: EngineGroupType.IRL,
        HiddenMuObjects: [],
        CanAttachOnModel: false,
        OriginalTankVolume: 0,
        RadialAttachment: false,
        RadialAttachmentPoint: 0,
        ImageSource: "img/modelPreviews/Juno45K.webp",
        get ImageLabel() { return this.ModelName; },
        LookatPairs: [
            ["LowerGimbal", "UpperGimbal"],
            ["UpperGimbal", "LowerGimbal"],
        ],
        HeatAnimations: [],
        Exhaust: {
            exhaustBellWidth: 0.134,
            exhaustThrustTransform: "vernierEffects",
            exhaustGimbalTransform: "vernierTransform",
            exhaustEffectTransform: "vernierEffects",
        }
    }, {
        get OriginalHeight() { return this.NodeStackTop - this.NodeStackBottom; },
        OriginalBellWidth: 1.99,
        OriginalBaseWidth: 2.4864,
        PlumeSizeMultiplier: 1.8,
        PlumePositionOffset: 0.0,
        NodeStackTop: 0.198,
        NodeStackBottom: -3.92,
        ModelPath: "GenericEngines/models/BDB/Juno/bluedog_Juno_EngineS3D",
        ModelFiles: [
            "files/models/BDB/Juno/bluedog_Juno_EngineS3D.mu",
            "files/models/BDB/Juno/bluedog_JunoEngines.dds"
        ],
        TextureDefinitions: "",
        ThrustTransformName: "thrustTransform",
        GimbalTransformName: "gimbalTransform",
        ModelName: "S3D",
        ModelType: EngineGroupType.IRL,
        HiddenMuObjects: [],
        CanAttachOnModel: false,
        OriginalTankVolume: 0,
        RadialAttachment: false,
        RadialAttachmentPoint: 0,
        ImageSource: "img/modelPreviews/S3D.webp",
        get ImageLabel() { return this.ModelName; },
        LookatPairs: [
            ["LowerGimbal", "UpperGimbal"],
            ["UpperGimbal", "LowerGimbal"],
        ],
        HeatAnimations: [],
        Exhaust: {
            exhaustBellWidth: 0.292,
            exhaustThrustTransform: "exhaustTransform",
            exhaustGimbalTransform: "exhaustTransform",
            exhaustEffectTransform: "exhaustEffect",
        }
    }, {
        get OriginalHeight() { return this.NodeStackTop - this.NodeStackBottom; },
        OriginalBellWidth: 1.96,
        OriginalBaseWidth: 2.036,
        PlumeSizeMultiplier: 1.68,
        PlumePositionOffset: 0,
        NodeStackTop: 1.13,
        NodeStackBottom: -2,
        ModelPath: "GenericEngines/models/BDB/Saturn/bluedog_F1",
        ModelFiles: [
            "files/models/BDB/Saturn/bluedog_F1.mu",
            "files/models/BDB/Saturn/bluedog_F1.dds",
            "files/models/BDB/Saturn/bluedog_F1_NRM.dds"
        ],
        TextureDefinitions: "",
        ThrustTransformName: "thrustTransform",
        GimbalTransformName: "gimbalTransform",
        ModelName: "F-1",
        ModelType: EngineGroupType.IRL,
        HiddenMuObjects: [],
        CanAttachOnModel: false,
        OriginalTankVolume: 0,
        RadialAttachment: false,
        RadialAttachmentPoint: 0,
        ImageSource: "img/modelPreviews/F1_BDB.webp",
        get ImageLabel() { return this.ModelName; },
        LookatPairs: [
            ["lowerGimbal2", "upperGimbal2"],
            ["upperGimbal2", "lowerGimbal2"],
            ["lowerGimbal1", "upperGimbal1"],
            ["upperGimbal1", "lowerGimbal1"],
        ],
        HeatAnimations: []
    }, {
        get OriginalHeight() { return this.NodeStackTop - this.NodeStackBottom; },
        OriginalBellWidth: 0.589,
        OriginalBaseWidth: 0.535,
        PlumeSizeMultiplier: 0.53,
        PlumePositionOffset: 0,
        NodeStackTop: 0.59,
        NodeStackBottom: -0.76,
        ModelPath: "GenericEngines/models/BDB/Saturn/bluedog_H1C_Tweaked",
        ModelFiles: [
            "files/models/BDB/Saturn/bluedog_H1C_Tweaked.mu",
            "files/models/BDB/Saturn/bluedog_H1.dds",
            "files/models/BDB/Saturn/bluedog_H1_nrm.dds"
        ],
        TextureDefinitions: "",
        ThrustTransformName: "thrustTransform",
        GimbalTransformName: "thrustTransform",
        ModelName: "H-1C",
        ModelType: EngineGroupType.IRL,
        HiddenMuObjects: [],
        CanAttachOnModel: false,
        OriginalTankVolume: 0,
        RadialAttachment: false,
        RadialAttachmentPoint: 0,
        ImageSource: "img/modelPreviews/H1C.webp",
        get ImageLabel() { return this.ModelName; },
        LookatPairs: [],
        HeatAnimations: [],
        Exhaust: {
            exhaustBellWidth: 0.0555,
            exhaustThrustTransform: "exhaustTransform",
            exhaustGimbalTransform: "exhaustTransform",
            exhaustEffectTransform: "exhaustEffect",
        }
    }, {
        get OriginalHeight() { return this.NodeStackTop - this.NodeStackBottom; },
        OriginalBellWidth: 0.588,
        OriginalBaseWidth: 0.536,
        PlumeSizeMultiplier: 0.52,
        PlumePositionOffset: 0,
        NodeStackTop: 0.593,
        NodeStackBottom: -0.765,
        ModelPath: "GenericEngines/models/BDB/Saturn/bluedog_H1D_Tweaked",
        ModelFiles: [
            "files/models/BDB/Saturn/bluedog_H1D_Tweaked.mu",
            "files/models/BDB/Saturn/bluedog_H1.dds",
            "files/models/BDB/Saturn/bluedog_H1_nrm.dds"
        ],
        TextureDefinitions: "",
        ThrustTransformName: "thrustTransform",
        GimbalTransformName: "Gimbal",
        ModelName: "H-1D",
        ModelType: EngineGroupType.IRL,
        HiddenMuObjects: [],
        CanAttachOnModel: false,
        OriginalTankVolume: 0,
        RadialAttachment: false,
        RadialAttachmentPoint: 0,
        ImageSource: "img/modelPreviews/H1D.webp",
        get ImageLabel() { return this.ModelName; },
        LookatPairs: [
            ["LowerGimbal2", "UpperGimbal2"],
            ["UpperGimbal2", "LowerGimbal2"],
            ["LowerGimbal1", "UpperGimbal1"],
            ["UpperGimbal1", "LowerGimbal1"],
        ],
        HeatAnimations: []
    }, {
        get OriginalHeight() { return this.NodeStackTop - this.NodeStackBottom; },
        OriginalBellWidth: 1.147,
        OriginalBaseWidth: 0.85,
        PlumeSizeMultiplier: 1,
        PlumePositionOffset: 0,
        NodeStackTop: 0.737,
        NodeStackBottom: -0.93,
        ModelPath: "GenericEngines/models/BDB/Saturn/bluedog_J2",
        ModelFiles: [
            "files/models/BDB/Saturn/bluedog_J2.mu",
            "files/models/BDB/Saturn/bluedog_J2.dds",
            "files/models/BDB/Saturn/bluedog_J2_NRM.dds",
            "files/models/BDB/Saturn/bluedog_saturn4B.dds",
            "files/models/BDB/Saturn/bluedog_saturn4B_NRM.dds"
        ],
        TextureDefinitions: "",
        ThrustTransformName: "thrustTransform",
        GimbalTransformName: "gimbalTransform",
        ModelName: "J-2",
        ModelType: EngineGroupType.IRL,
        HiddenMuObjects: [],
        CanAttachOnModel: false,
        OriginalTankVolume: 0,
        RadialAttachment: false,
        RadialAttachmentPoint: 0,
        ImageSource: "img/modelPreviews/J2_BDB.webp",
        get ImageLabel() { return this.ModelName; },
        LookatPairs: [],
        HeatAnimations: [],
        Exhaust: {
            exhaustBellWidth: 0.063,
            exhaustThrustTransform: "exhaustTransform",
            exhaustGimbalTransform: "exhaustTransform",
            exhaustEffectTransform: "exhaustEffect",
        }
    }, {
        get OriginalHeight() { return this.NodeStackTop - this.NodeStackBottom; },
        OriginalBellWidth: 1.248,
        OriginalBaseWidth: 1.248,
        PlumeSizeMultiplier: 1.3,
        PlumePositionOffset: 0,
        NodeStackTop: 0.06,
        NodeStackBottom: -0.365,
        ModelPath: "GenericEngines/models/BDB/Saturn/bluedog_J2_Toroidal",
        ModelFiles: [
            "files/models/BDB/Saturn/bluedog_J2_Toroidal.mu",
            "files/models/BDB/Saturn/bluedog_J2.dds",
            "files/models/BDB/Saturn/bluedog_J2_NRM.dds",
            "files/models/BDB/Saturn/bluedog_J2_Variants.dds",
            "files/models/BDB/Saturn/bluedog_J2_Variants_NRM.dds"
        ],
        TextureDefinitions: "",
        ThrustTransformName: "thrustTransform",
        GimbalTransformName: "thrustTransform",
        ModelName: "J-2T",
        ModelType: EngineGroupType.AlternativeHistory,
        HiddenMuObjects: [],
        CanAttachOnModel: false,
        OriginalTankVolume: 0,
        RadialAttachment: false,
        RadialAttachmentPoint: 0,
        ImageSource: "img/modelPreviews/J2T.webp",
        get ImageLabel() { return this.ModelName; },
        LookatPairs: [],
        HeatAnimations: []
    }, {
        get OriginalHeight() { return this.NodeStackTop - this.NodeStackBottom; },
        OriginalBellWidth: 0.904,
        OriginalBaseWidth: 0.852,
        PlumeSizeMultiplier: 0.8,
        PlumePositionOffset: 0,
        NodeStackTop: 0.7,
        NodeStackBottom: -0.64,
        ModelPath: "GenericEngines/models/BDB/Saturn/bluedog_J2sl",
        ModelFiles: [
            "files/models/BDB/Saturn/bluedog_J2sl.mu",
            "files/models/BDB/Saturn/bluedog_saturn4B.dds",
            "files/models/BDB/Saturn/bluedog_saturn4B_NRM.dds",
            "files/models/BDB/Saturn/bluedog_J2.dds",
            "files/models/BDB/Saturn/bluedog_J2_NRM.dds"
        ],
        TextureDefinitions: "",
        ThrustTransformName: "thrustTransform",
        GimbalTransformName: "gimbalTransform",
        ModelName: "J-2SL",
        ModelType: EngineGroupType.AlternativeHistory,
        HiddenMuObjects: [],
        CanAttachOnModel: false,
        OriginalTankVolume: 0,
        RadialAttachment: false,
        RadialAttachmentPoint: 0,
        ImageSource: "img/modelPreviews/J2SL.webp",
        get ImageLabel() { return this.ModelName; },
        LookatPairs: [],
        HeatAnimations: [],
        Exhaust: {
            exhaustBellWidth: 0.063,
            exhaustThrustTransform: "exhaustTransform",
            exhaustGimbalTransform: "exhaustTransform",
            exhaustEffectTransform: "exhaustEffect",
        }
    }, {
        get OriginalHeight() { return this.NodeStackTop - this.NodeStackBottom; },
        OriginalBellWidth: 3.914,
        OriginalBaseWidth: 3.83,
        PlumeSizeMultiplier: 3.4,
        PlumePositionOffset: -0.6,
        NodeStackTop: 9.56,
        NodeStackBottom: -11.59,
        ModelPath: "GenericEngines/models/BDB/Saturn/bluedog_saturn_AJ260_LongFlared",
        ModelFiles: [
            "files/models/BDB/Saturn/bluedog_saturn_AJ260_LongFlared.mu",
            "files/models/BDB/Saturn/bluedog_saturn_AJ260.dds",
            "files/models/BDB/Saturn/bluedog_saturn_AJ260_Emit.dds",
            "files/models/BDB/Saturn/bluedog_saturn_AJ260_NRM.dds"
        ],
        TextureDefinitions: "",
        ThrustTransformName: "thrustTransform",
        GimbalTransformName: "gimbalTransform",
        ModelName: "AJ-260",
        ModelType: EngineGroupType.SRB,
        HiddenMuObjects: [],
        CanAttachOnModel: true,
        OriginalTankVolume: 134500,
        RadialAttachment: true,
        RadialAttachmentPoint: 1.915,
        ImageSource: "img/modelPreviews/AJ260.webp",
        get ImageLabel() { return this.ModelName; },
        LookatPairs: [],
        HeatAnimations: [
            "AJ260_Vernier_Emit"
        ],
        Exhaust: {
            exhaustBellWidth: 0.73,
            exhaustThrustTransform: "vernierTransform",
            exhaustGimbalTransform: "vernierGimbal",
            exhaustEffectTransform: "vernierTransform",
        }
    }, {
        get OriginalHeight() { return this.NodeStackTop - this.NodeStackBottom; },
        OriginalBellWidth: 0.708,
        OriginalBaseWidth: 1.873,
        PlumeSizeMultiplier: 0.6,
        PlumePositionOffset: 0.61,
        NodeStackTop: 0.46,
        NodeStackBottom: -1.6,
        ModelPath: "GenericEngines/models/BDB/Titan/bluedog_LR87_Tweaked",
        ModelFiles: [
            "files/models/BDB/Titan/bluedog_LR87_Tweaked.mu",
            "files/models/BDB/Titan/bluedog_TitanEngines.dds",
            "files/models/BDB/Titan/bluedog_TitanEngines_nrm.dds"
        ],
        TextureDefinitions: "",
        ThrustTransformName: "thrustTransform",
        GimbalTransformName: "thrustTransform",
        ModelName: "LR87",
        ModelType: EngineGroupType.IRL,
        HiddenMuObjects: [],
        CanAttachOnModel: false,
        OriginalTankVolume: 0,
        RadialAttachment: false,
        RadialAttachmentPoint: 0,
        ImageSource: "img/modelPreviews/LR87.webp",
        get ImageLabel() { return this.ModelName; },
        LookatPairs: [],
        HeatAnimations: [],
        Exhaust: {
            exhaustBellWidth: 0.11,
            exhaustThrustTransform: "exhaustTransform",
            exhaustGimbalTransform: "exhaustTransform",
            exhaustEffectTransform: "exhaustEffect",
        }
    }, {
        get OriginalHeight() { return this.NodeStackTop - this.NodeStackBottom; },
        OriginalBellWidth: 0.692,
        OriginalBaseWidth: 0.734,
        PlumeSizeMultiplier: 0.61,
        PlumePositionOffset: 0.58,
        NodeStackTop: 0.17,
        NodeStackBottom: -1.05,
        ModelPath: "GenericEngines/models/BDB/Titan/bluedog_LR87S_Tweaked",
        ModelFiles: [
            "files/models/BDB/Titan/bluedog_LR87S_Tweaked.mu",
            "files/models/BDB/Titan/bluedog_TitanEngines.dds",
            "files/models/BDB/Titan/bluedog_TitanEngines_nrm.dds"
        ],
        TextureDefinitions: "",
        ThrustTransformName: "thrustTransform",
        GimbalTransformName: "thrustTransform",
        ModelName: "LR87 Single",
        ModelType: EngineGroupType.IRL,
        HiddenMuObjects: [],
        CanAttachOnModel: false,
        OriginalTankVolume: 0,
        RadialAttachment: false,
        RadialAttachmentPoint: 0,
        ImageSource: "img/modelPreviews/LR87S.webp",
        get ImageLabel() { return this.ModelName; },
        LookatPairs: [],
        HeatAnimations: [],
        Exhaust: {
            exhaustBellWidth: 0.1,
            exhaustThrustTransform: "exhaustTransform",
            exhaustGimbalTransform: "exhaustTransform",
            exhaustEffectTransform: "exhaustEffect",
        }
    }, {
        get OriginalHeight() { return this.NodeStackTop - this.NodeStackBottom; },
        OriginalBellWidth: 0.854,
        OriginalBaseWidth: 1.35,
        PlumeSizeMultiplier: 0.75,
        PlumePositionOffset: 0.65,
        NodeStackTop: -0.06,
        NodeStackBottom: -1.38,
        ModelPath: "GenericEngines/models/BDB/Titan/bluedog_LR91_Tweaked",
        ModelFiles: [
            "files/models/BDB/Titan/bluedog_LR91_Tweaked.mu",
            "files/models/BDB/Titan/bluedog_TitanEngines.dds",
            "files/models/BDB/Titan/bluedog_TitanEngines_nrm.dds"
        ],
        TextureDefinitions: "",
        ThrustTransformName: "thrustTransform",
        GimbalTransformName: "thrustTransform",
        ModelName: "LR91",
        ModelType: EngineGroupType.IRL,
        HiddenMuObjects: [],
        CanAttachOnModel: false,
        OriginalTankVolume: 0,
        RadialAttachment: false,
        RadialAttachmentPoint: 0,
        ImageSource: "img/modelPreviews/LR91_BDB.webp",
        get ImageLabel() { return this.ModelName; },
        LookatPairs: [],
        HeatAnimations: [],
        Exhaust: {
            exhaustBellWidth: 0.15,
            exhaustThrustTransform: "exhaustTransform",
            exhaustGimbalTransform: "exhaustGimbal",
            exhaustEffectTransform: "exhaustEffect",
        }
    }, {
        get OriginalHeight() { return this.NodeStackTop - this.NodeStackBottom; },
        OriginalBellWidth: 1.497,
        OriginalBaseWidth: 1.497,
        PlumeSizeMultiplier: 1.3,
        PlumePositionOffset: -0.15,
        NodeStackTop: 6.95,
        NodeStackBottom: -4.59,
        ModelPath: "GenericEngines/models/BDB/Titan/bluedog_Soltan_Tweaked",
        ModelFiles: [
            "files/models/BDB/Titan/bluedog_Soltan_Tweaked.mu",
            "files/models/BDB/Titan/bluedog_TitanSRBs.dds",
            "files/models/BDB/Titan/bluedog_TitanSRBs_nrm.dds"
        ],
        TextureDefinitions: "",
        ThrustTransformName: "thrustTransform",
        GimbalTransformName: "thrustTransform",
        ModelName: "Soltan",
        ModelType: EngineGroupType.SRB,
        HiddenMuObjects: [],
        CanAttachOnModel: true,
        OriginalTankVolume: 12500,
        RadialAttachment: true,
        RadialAttachmentPoint: 0.75,
        ImageSource: "img/modelPreviews/Soltan.webp",
        get ImageLabel() { return this.ModelName; },
        LookatPairs: [],
        HeatAnimations: []
    }, {
        get OriginalHeight() { return this.NodeStackTop - this.NodeStackBottom; },
        OriginalBellWidth: 1.9,
        OriginalBaseWidth: 1.87,
        PlumeSizeMultiplier: 1.65,
        PlumePositionOffset: 0,
        NodeStackTop: 8.1,
        NodeStackBottom: -6.25,
        ModelPath: "GenericEngines/models/BDB/Titan/bluedog_Titan_SRB5segStack",
        ModelFiles: [
            "files/models/BDB/Titan/bluedog_Titan_SRB5segStack.mu",
            "files/models/BDB/Titan/bluedog_TitanSRBs.dds",
            "files/models/BDB/Titan/bluedog_TitanSRBs_nrm.dds"
        ],
        TextureDefinitions: "",
        ThrustTransformName: "thrustTransform",
        GimbalTransformName: "thrustTransform",
        ModelName: "UA1205",
        ModelType: EngineGroupType.SRB,
        HiddenMuObjects: [],
        CanAttachOnModel: true,
        OriginalTankVolume: 22600,
        RadialAttachment: true,
        RadialAttachmentPoint: 0.935,
        ImageSource: "img/modelPreviews/UA1205.webp",
        get ImageLabel() { return this.ModelName; },
        LookatPairs: [],
        HeatAnimations: []
    }, {
        get OriginalHeight() { return this.NodeStackTop - this.NodeStackBottom; },
        OriginalBellWidth: 1.9,
        OriginalBaseWidth: 1.87,
        PlumeSizeMultiplier: 1.65,
        PlumePositionOffset: 0,
        NodeStackTop: 11.85,
        NodeStackBottom: -6.25,
        ModelPath: "GenericEngines/models/BDB/Titan/bluedog_Titan_SRB7segStack",
        ModelFiles: [
            "files/models/BDB/Titan/bluedog_Titan_SRB7segStack.mu",
            "files/models/BDB/Titan/bluedog_TitanSRBs.dds",
            "files/models/BDB/Titan/bluedog_TitanSRBs_nrm.dds"
        ],
        TextureDefinitions: "",
        ThrustTransformName: "thrustTransform",
        GimbalTransformName: "thrustTransform",
        ModelName: "UA1207",
        ModelType: EngineGroupType.SRB,
        HiddenMuObjects: [],
        CanAttachOnModel: true,
        OriginalTankVolume: 28900,
        RadialAttachment: true,
        RadialAttachmentPoint: 0.935,
        ImageSource: "img/modelPreviews/UA1207.webp",
        get ImageLabel() { return this.ModelName; },
        LookatPairs: [],
        HeatAnimations: []
    }, {
        get OriginalHeight() { return this.NodeStackTop - this.NodeStackBottom; },
        OriginalBellWidth: 0.742,
        OriginalBaseWidth: 1.87,
        PlumeSizeMultiplier: 0.65,
        PlumePositionOffset: 0.41,
        NodeStackTop: 0.025,
        NodeStackBottom: -1.66,
        ModelPath: "GenericEngines/models/BDB/Titan/bluedog_Transtage_Tweaked",
        ModelFiles: [
            "files/models/BDB/Titan/bluedog_Transtage_Tweaked.mu",
            "files/models/BDB/Titan/bluedog_Transtage.dds",
            "files/models/BDB/Titan/bluedog_Transtage_NRM.dds"
        ],
        TextureDefinitions: "",
        ThrustTransformName: "thrustTransform",
        GimbalTransformName: "thrustTransform",
        ModelName: "Transtage",
        ModelType: EngineGroupType.IRL,
        HiddenMuObjects: [],
        CanAttachOnModel: false,
        OriginalTankVolume: 1200,
        RadialAttachment: false,
        RadialAttachmentPoint: 0,
        ImageSource: "img/modelPreviews/Transtage.webp",
        get ImageLabel() { return this.ModelName; },
        LookatPairs: [],
        HeatAnimations: []
    }, {
        get OriginalHeight() { return this.NodeStackTop - this.NodeStackBottom; },
        OriginalBellWidth: 0.677,
        OriginalBaseWidth: 1.884,
        PlumeSizeMultiplier: 0.6,
        PlumePositionOffset: 0,
        NodeStackTop: 0.83,
        NodeStackBottom: -1.02,
        ModelPath: "GenericEngines/models/BDB/TitanRemake/bluedog_LR87_5_Tweaked",
        ModelFiles: [
            "files/models/BDB/TitanRemake/bluedog_LR87_5_Tweaked.mu",
            "files/models/BDB/TitanRemake/bluedog_TitanEngines_New.dds",
            "files/models/BDB/TitanRemake/bluedog_TitanEngines_New_Emit.dds",
            "files/models/BDB/TitanRemake/bluedog_TitanEngines_New_NRM.dds",
            "files/models/BDB/TitanRemake/bluedog_Titan_innerGlow.dds"
        ],
        TextureDefinitions: "",
        ThrustTransformName: "thrustTransform",
        GimbalTransformName: "gimbalTransform",
        ModelName: "LR87-5",
        ModelType: EngineGroupType.IRL,
        HiddenMuObjects: [],
        CanAttachOnModel: false,
        OriginalTankVolume: 0,
        RadialAttachment: false,
        RadialAttachmentPoint: 0,
        ImageSource: "img/modelPreviews/LR87_5.webp",
        get ImageLabel() { return this.ModelName; },
        LookatPairs: [
            ["yawPivot_1_Upper", "yawPivot_1_Lower"],
            ["yawPivot_1_Lower", "yawPivot_1_Upper"],
            ["yawPivot_2_Upper", "yawPivot_2_Lower"],
            ["yawPivot_2_Lower", "yawPivot_2_Upper"],
            ["pitchPivot_1_Upper", "pitchPivot_1_Lower"],
            ["pitchPivot_1_Lower", "pitchPivot_1_Upper"],
            ["pitchPivot_2_Upper", "pitchPivot_2_Lower"],
            ["pitchPivot_2_Lower", "pitchPivot_2_Upper"],
        ],
        HeatAnimations: [],
        Exhaust: {
            exhaustBellWidth: 0.121,
            exhaustThrustTransform: "exhaustTransform",
            exhaustGimbalTransform: "exhaustTransform",
            exhaustEffectTransform: "exhaustTransform",
        }
    }, {
        get OriginalHeight() { return this.NodeStackTop - this.NodeStackBottom; },
        OriginalBellWidth: 0.735,
        OriginalBaseWidth: 1.882,
        PlumeSizeMultiplier: 0.65,
        PlumePositionOffset: 0,
        NodeStackTop: 0.49,
        NodeStackBottom: -1.674,
        ModelPath: "GenericEngines/models/BDB/TitanRemake/bluedog_LR87_11_Tweaked",
        ModelFiles: [
            "files/models/BDB/TitanRemake/bluedog_LR87_11_Tweaked.mu",
            "files/models/BDB/TitanRemake/bluedog_TitanEngines_New.dds",
            "files/models/BDB/TitanRemake/bluedog_TitanEngines_New_Emit.dds",
            "files/models/BDB/TitanRemake/bluedog_TitanEngines_New_NRM.dds",
            "files/models/BDB/TitanRemake/bluedog_Titan_innerGlow.dds"
        ],
        TextureDefinitions: "",
        ThrustTransformName: "thrustTransform",
        GimbalTransformName: "gimbalTransform",
        ModelName: "LR87-11",
        ModelType: EngineGroupType.IRL,
        HiddenMuObjects: [],
        CanAttachOnModel: false,
        OriginalTankVolume: 0,
        RadialAttachment: false,
        RadialAttachmentPoint: 0,
        ImageSource: "img/modelPreviews/LR87_11.webp",
        get ImageLabel() { return this.ModelName; },
        LookatPairs: [
            ["yawPivot_1_Upper", "yawPivot_1_Lower"],
            ["yawPivot_1_Lower", "yawPivot_1_Upper"],
            ["yawPivot_2_Upper", "yawPivot_2_Lower"],
            ["yawPivot_2_Lower", "yawPivot_2_Upper"],
            ["pitchPivot_1_Upper", "pitchPivot_1_Lower"],
            ["pitchPivot_1_Lower", "pitchPivot_1_Upper"],
            ["pitchPivot_2_Upper", "pitchPivot_2_Lower"],
            ["pitchPivot_2_Lower", "pitchPivot_2_Upper"],
        ],
        HeatAnimations: [],
        Exhaust: {
            exhaustBellWidth: 0.121,
            exhaustThrustTransform: "exhaustTransform",
            exhaustGimbalTransform: "exhaustTransform",
            exhaustEffectTransform: "exhaustTransform",
        }
    }, {
        get OriginalHeight() { return this.NodeStackTop - this.NodeStackBottom; },
        OriginalBellWidth: 0.733,
        OriginalBaseWidth: 0.78,
        PlumeSizeMultiplier: 0.66,
        PlumePositionOffset: 0.63,
        NodeStackTop: 0.722,
        NodeStackBottom: -1.07,
        ModelPath: "GenericEngines/models/BDB/TitanRemake/bluedog_LR87_11S_Tweaked",
        ModelFiles: [
            "files/models/BDB/TitanRemake/bluedog_LR87_11S_Tweaked.mu",
            "files/models/BDB/TitanRemake/bluedog_TitanEngines_New.dds",
            "files/models/BDB/TitanRemake/bluedog_TitanEngines_New_Emit.dds",
            "files/models/BDB/TitanRemake/bluedog_TitanEngines_New_NRM.dds",
            "files/models/BDB/TitanRemake/bluedog_Titan_innerGlow.dds"
        ],
        TextureDefinitions: "",
        ThrustTransformName: "thrustTransform",
        GimbalTransformName: "gimbalTransform",
        ModelName: "LR87-11 Single",
        ModelType: EngineGroupType.IRL,
        HiddenMuObjects: [],
        CanAttachOnModel: false,
        OriginalTankVolume: 0,
        RadialAttachment: false,
        RadialAttachmentPoint: 0,
        ImageSource: "img/modelPreviews/LR87_11S.webp",
        get ImageLabel() { return this.ModelName; },
        LookatPairs: [
            ["yawPivot_Upper", "yawPivot_Lower"],
            ["yawPivot_Lower", "yawPivot_Upper"],
            ["pitchPivot_Upper", "pitchPivot_Lower"],
            ["pitchPivot_Lower", "pitchPivot_Upper"],
        ],
        HeatAnimations: [],
        Exhaust: {
            exhaustBellWidth: 0.121,
            exhaustThrustTransform: "exhaustTransform",
            exhaustGimbalTransform: "exhaustTransform",
            exhaustEffectTransform: "exhaustEffect",
        }
    }, {
        get OriginalHeight() { return this.NodeStackTop - this.NodeStackBottom; },
        OriginalBellWidth: 0.918,
        OriginalBaseWidth: 0.78,
        PlumeSizeMultiplier: 0.83,
        PlumePositionOffset: 0.88,
        NodeStackTop: 0.722,
        NodeStackBottom: -1.377,
        ModelPath: "GenericEngines/models/BDB/TitanRemake/bluedog_LR87_11SV_Tweaked",
        ModelFiles: [
            "files/models/BDB/TitanRemake/bluedog_LR87_11SV_Tweaked.mu",
            "files/models/BDB/TitanRemake/bluedog_TitanEngines_New.dds",
            "files/models/BDB/TitanRemake/bluedog_TitanEngines_New_Emit.dds",
            "files/models/BDB/TitanRemake/bluedog_TitanEngines_New_NRM.dds",
            "files/models/BDB/TitanRemake/bluedog_Titan_innerGlow.dds"
        ],
        TextureDefinitions: "",
        ThrustTransformName: "thrustTransform",
        GimbalTransformName: "gimbalTransform",
        ModelName: "LR87-11 Vacuum Single",
        ModelType: EngineGroupType.IRL,
        HiddenMuObjects: [],
        CanAttachOnModel: false,
        OriginalTankVolume: 0,
        RadialAttachment: false,
        RadialAttachmentPoint: 0,
        ImageSource: "img/modelPreviews/LR87_11SV.webp",
        get ImageLabel() { return this.ModelName; },
        LookatPairs: [
            ["yawPivot_Upper", "yawPivot_Lower"],
            ["yawPivot_Lower", "yawPivot_Upper"],
            ["pitchPivot_Upper", "pitchPivot_Lower"],
            ["pitchPivot_Lower", "pitchPivot_Upper"],
        ],
        HeatAnimations: [],
        Exhaust: {
            exhaustBellWidth: 0.121,
            exhaustThrustTransform: "exhaustTransform",
            exhaustGimbalTransform: "exhaustTransform",
            exhaustEffectTransform: "exhaustEffect",
        }
    }, {
        get OriginalHeight() { return this.NodeStackTop - this.NodeStackBottom; },
        OriginalBellWidth: 0.67,
        OriginalBaseWidth: 0.78,
        PlumeSizeMultiplier: 0.6,
        PlumePositionOffset: 0,
        NodeStackTop: 0.722,
        NodeStackBottom: -0.762,
        ModelPath: "GenericEngines/models/BDB/TitanRemake/bluedog_LR87_11SH_Tweaked",
        ModelFiles: [
            "files/models/BDB/TitanRemake/bluedog_LR87_11SH_Tweaked.mu",
            "files/models/BDB/TitanRemake/bluedog_TitanEngines_New.dds",
            "files/models/BDB/TitanRemake/bluedog_TitanEngines_New_Emit.dds",
            "files/models/BDB/TitanRemake/bluedog_TitanEngines_New_NRM.dds",
            "files/models/BDB/TitanRemake/bluedog_Titan_innerGlow.dds"
        ],
        TextureDefinitions: "",
        ThrustTransformName: "thrustTransform",
        GimbalTransformName: "gimbalTransform",
        ModelName: "LR87-11 Hydrolox Single",
        ModelType: EngineGroupType.IRL,
        HiddenMuObjects: [],
        CanAttachOnModel: false,
        OriginalTankVolume: 0,
        RadialAttachment: false,
        RadialAttachmentPoint: 0,
        ImageSource: "img/modelPreviews/LR87_11SH.webp",
        get ImageLabel() { return this.ModelName; },
        LookatPairs: [
            ["yawPivot_Upper", "yawPivot_Lower"],
            ["yawPivot_Lower", "yawPivot_Upper"],
            ["pitchPivot_Upper", "pitchPivot_Lower"],
            ["pitchPivot_Lower", "pitchPivot_Upper"],
        ],
        HeatAnimations: [],
        Exhaust: {
            exhaustBellWidth: 0.121,
            exhaustThrustTransform: "exhaustTransform",
            exhaustGimbalTransform: "exhaustTransform",
            exhaustEffectTransform: "exhaustEffect",
        }
    }, {
        get OriginalHeight() { return this.NodeStackTop - this.NodeStackBottom; },
        OriginalBellWidth: 0.977,
        OriginalBaseWidth: 0.78,
        PlumeSizeMultiplier: 0.88,
        PlumePositionOffset: 0,
        NodeStackTop: 0.722,
        NodeStackBottom: -1.792,
        ModelPath: "GenericEngines/models/BDB/TitanRemake/bluedog_LR87_11SHV_Tweaked",
        ModelFiles: [
            "files/models/BDB/TitanRemake/bluedog_LR87_11SHV_Tweaked.mu",
            "files/models/BDB/TitanRemake/bluedog_TitanEngines_New.dds",
            "files/models/BDB/TitanRemake/bluedog_TitanEngines_New_Emit.dds",
            "files/models/BDB/TitanRemake/bluedog_TitanEngines_New_NRM.dds",
            "files/models/BDB/TitanRemake/bluedog_Titan_innerGlow.dds"
        ],
        TextureDefinitions: "",
        ThrustTransformName: "thrustTransform",
        GimbalTransformName: "gimbalTransform",
        ModelName: "LR87-11 Vacuum Hydrolox Single",
        ModelType: EngineGroupType.IRL,
        HiddenMuObjects: [],
        CanAttachOnModel: false,
        OriginalTankVolume: 0,
        RadialAttachment: false,
        RadialAttachmentPoint: 0,
        ImageSource: "img/modelPreviews/LR87_11SHV.webp",
        get ImageLabel() { return this.ModelName; },
        LookatPairs: [
            ["yawPivot_Upper", "yawPivot_Lower"],
            ["yawPivot_Lower", "yawPivot_Upper"],
            ["pitchPivot_Upper", "pitchPivot_Lower"],
            ["pitchPivot_Lower", "pitchPivot_Upper"],
        ],
        HeatAnimations: [],
        Exhaust: {
            exhaustBellWidth: 0.121,
            exhaustThrustTransform: "exhaustTransform",
            exhaustGimbalTransform: "exhaustTransform",
            exhaustEffectTransform: "exhaustEffect",
        }
    }, {
        get OriginalHeight() { return this.NodeStackTop - this.NodeStackBottom; },
        OriginalBellWidth: 0.95,
        OriginalBaseWidth: 0.79,
        PlumeSizeMultiplier: 0.85,
        PlumePositionOffset: -0.1,
        NodeStackTop: 0.603,
        NodeStackBottom: -0.923,
        ModelPath: "GenericEngines/models/BDB/TitanRemake/bluedog_LR91_5_Tweaked",
        ModelFiles: [
            "files/models/BDB/TitanRemake/bluedog_LR91_5_Tweaked.mu",
            "files/models/BDB/TitanRemake/bluedog_TitanEngines_New.dds",
            "files/models/BDB/TitanRemake/bluedog_TitanEngines_New_Emit.dds",
            "files/models/BDB/TitanRemake/bluedog_TitanEngines_New_NRM.dds",
            "files/models/BDB/TitanRemake/bluedog_Titan_innerGlow.dds"
        ],
        TextureDefinitions: "",
        ThrustTransformName: "thrustTransform",
        GimbalTransformName: "gimbalTransform",
        ModelName: "LR91-5",
        ModelType: EngineGroupType.IRL,
        HiddenMuObjects: [],
        CanAttachOnModel: false,
        OriginalTankVolume: 0,
        RadialAttachment: false,
        RadialAttachmentPoint: 0,
        ImageSource: "img/modelPreviews/LR91_5.webp",
        get ImageLabel() { return this.ModelName; },
        LookatPairs: [
            ["pivot_1_Upper", "pivot_1_Lower"],
            ["pivot_1_Lower", "pivot_1_Upper"],
            ["pivot_2_Upper", "pivot_2_Lower"],
            ["pivot_2_Lower", "pivot_2_Upper"],
        ],
        HeatAnimations: [],
        Exhaust: {
            exhaustBellWidth: 0.17,
            exhaustThrustTransform: "vernierThrust",
            exhaustGimbalTransform: "vernierGimbal",
            exhaustEffectTransform: "vernierFX",
        }
    }, {
        get OriginalHeight() { return this.NodeStackTop - this.NodeStackBottom; },
        OriginalBellWidth: 0.934,
        OriginalBaseWidth: 0.79,
        PlumeSizeMultiplier: 0.84,
        PlumePositionOffset: 0,
        NodeStackTop: 0.603,
        NodeStackBottom: -1.021,
        ModelPath: "GenericEngines/models/BDB/TitanRemake/bluedog_LR91_11_Tweaked",
        ModelFiles: [
            "files/models/BDB/TitanRemake/bluedog_LR91_11_Tweaked.mu",
            "files/models/BDB/TitanRemake/bluedog_TitanEngines_New.dds",
            "files/models/BDB/TitanRemake/bluedog_TitanEngines_New_Emit.dds",
            "files/models/BDB/TitanRemake/bluedog_TitanEngines_New_NRM.dds",
            "files/models/BDB/TitanRemake/bluedog_Titan_innerGlow.dds"
        ],
        TextureDefinitions: "",
        ThrustTransformName: "thrustTransform",
        GimbalTransformName: "gimbalTransform",
        ModelName: "LR91-11",
        ModelType: EngineGroupType.IRL,
        HiddenMuObjects: [],
        CanAttachOnModel: false,
        OriginalTankVolume: 0,
        RadialAttachment: false,
        RadialAttachmentPoint: 0,
        ImageSource: "img/modelPreviews/LR91_11.webp",
        get ImageLabel() { return this.ModelName; },
        LookatPairs: [
            ["pivot_1_Upper", "pivot_1_Lower"],
            ["pivot_1_Lower", "pivot_1_Upper"],
            ["pivot_2_Upper", "pivot_2_Lower"],
            ["pivot_2_Lower", "pivot_2_Upper"],
        ],
        HeatAnimations: [],
        Exhaust: {
            exhaustBellWidth: 0.17,
            exhaustThrustTransform: "vernierThrust",
            exhaustGimbalTransform: "vernierGimbal",
            exhaustEffectTransform: "vernierFX",
        }
    }, {
        get OriginalHeight() { return this.NodeStackTop - this.NodeStackBottom; },
        OriginalBellWidth: 1.9,
        OriginalBaseWidth: 1.874,
        PlumeSizeMultiplier: 1.7,
        PlumePositionOffset: 0,
        NodeStackTop: 13.176,
        NodeStackBottom: -4.986,
        ModelPath: "GenericEngines/models/BDB/TitanRemake/bluedog_SRMU_Tweaked",
        ModelFiles: [
            "files/models/BDB/TitanRemake/bluedog_SRMU_Tweaked.mu",
            "files/models/BDB/TitanRemake/bluedog_Titan_innerGlow.dds",
            "files/models/BDB/TitanRemake/bluedog_SRMU.dds",
            "files/models/BDB/TitanRemake/bluedog_SRMU_Emit.dds",
            "files/models/BDB/TitanRemake/bluedog_SRMU_NRM.dds",
            "files/models/BDB/TitanRemake/bluedog_Titan2_SecondStageTank_NRM.dds",
            "files/models/BDB/TitanRemake/bluedog_Titan2_SecondStageTank_White.dds",
            "files/models/BDB/TitanRemake/bluedog_TitanSolids_Misc.dds",
            "files/models/BDB/TitanRemake/bluedog_TitanSolids_Misc_NRM.dds"
        ],
        TextureDefinitions: "",
        ThrustTransformName: "thrustTransform",
        GimbalTransformName: "gimbalTransform",
        ModelName: "SRMU",
        ModelType: EngineGroupType.SRB,
        HiddenMuObjects: [],
        CanAttachOnModel: true,
        OriginalTankVolume: 32250,
        RadialAttachment: true,
        RadialAttachmentPoint: 0.937,
        ImageSource: "img/modelPreviews/SRMU.webp",
        get ImageLabel() { return this.ModelName; },
        LookatPairs: [],
        HeatAnimations: []
    }, {
        get OriginalHeight() { return this.NodeStackTop - this.NodeStackBottom; },
        OriginalBellWidth: 1.75,
        OriginalBaseWidth: 1.874,
        PlumeSizeMultiplier: 1.57,
        PlumePositionOffset: 0,
        NodeStackTop: 8.79,
        NodeStackBottom: -5,
        ModelPath: "GenericEngines/models/BDB/TitanRemake/bluedog_UA1205_Tweaked",
        ModelFiles: [
            "files/models/BDB/TitanRemake/bluedog_UA1205_Tweaked.mu",
            "files/models/BDB/TitanRemake/bluedog_Titan_innerGlow.dds",
            "files/models/BDB/TitanRemake/bluedog_Titan2_SecondStageTank_NRM.dds",
            "files/models/BDB/TitanRemake/bluedog_Titan2_SecondStageTank.dds",
            "files/models/BDB/TitanRemake/bluedog_TitanSolids_Misc.dds",
            "files/models/BDB/TitanRemake/bluedog_TitanSolids_Misc_NRM.dds",
            "files/models/BDB/TitanRemake/bluedog_TitanSolids_Misc_Emit.dds",
            "files/models/BDB/TitanRemake/bluedog_TitanSolids_Striped.dds"
        ],
        TextureDefinitions: "",
        ThrustTransformName: "thrustTransform",
        GimbalTransformName: "thrustTransform",
        ModelName: "UA1205",
        ModelType: EngineGroupType.SRB,
        HiddenMuObjects: [],
        CanAttachOnModel: true,
        OriginalTankVolume: 23400,
        RadialAttachment: true,
        RadialAttachmentPoint: 0.937,
        ImageSource: "img/modelPreviews/UA1205_NEW.webp",
        get ImageLabel() { return this.ModelName; },
        LookatPairs: [],
        HeatAnimations: []
    }, {
        get OriginalHeight() { return this.NodeStackTop - this.NodeStackBottom; },
        OriginalBellWidth: 1.75,
        OriginalBaseWidth: 1.874,
        PlumeSizeMultiplier: 1.57,
        PlumePositionOffset: 0,
        NodeStackTop: 13.19,
        NodeStackBottom: -5,
        ModelPath: "GenericEngines/models/BDB/TitanRemake/bluedog_UA1207_Tweaked",
        ModelFiles: [
            "files/models/BDB/TitanRemake/bluedog_UA1207_Tweaked.mu",
            "files/models/BDB/TitanRemake/bluedog_Titan_innerGlow.dds",
            "files/models/BDB/TitanRemake/bluedog_Titan2_SecondStageTank_NRM.dds",
            "files/models/BDB/TitanRemake/bluedog_Titan2_SecondStageTank_White.dds",
            "files/models/BDB/TitanRemake/bluedog_TitanSolids_Misc.dds",
            "files/models/BDB/TitanRemake/bluedog_TitanSolids_Misc_NRM.dds",
            "files/models/BDB/TitanRemake/bluedog_TitanSolids_Misc_Emit.dds",
            "files/models/BDB/TitanRemake/bluedog_TitanSolids_Striped.dds"
        ],
        TextureDefinitions: "",
        ThrustTransformName: "thrustTransform",
        GimbalTransformName: "thrustTransform",
        ModelName: "UA1207",
        ModelType: EngineGroupType.SRB,
        HiddenMuObjects: [],
        CanAttachOnModel: true,
        OriginalTankVolume: 32500,
        RadialAttachment: true,
        RadialAttachmentPoint: 0.937,
        ImageSource: "img/modelPreviews/UA1207_NEW.webp",
        get ImageLabel() { return this.ModelName; },
        LookatPairs: [],
        HeatAnimations: []
    }
];
class PlumeInfo {
    static GetPlumeInfo(id) {
        return PlumeInfo.plumes[id];
    }
    static MapRealPlumesToGenericPlumes(plume) {
        switch (plume) {
            case Plume.Alcolox_Lower: return Plume.GP_Alcolox;
            case Plume.Amonnialox: return Plume.GP_Ammonialox;
            case Plume.Cryogenic_UpperLower_125: return Plume.GP_Hydrolox;
            case Plume.Cryogenic_UpperLower_25: return Plume.GP_Hydrolox;
            case Plume.Cryogenic_UpperLower_375: return Plume.GP_Hydrolox;
            case Plume.Hydrogen_NTR: return Plume.GP_HydrogenNTR;
            case Plume.Hydrolox_Lower: return Plume.GP_Hydrolox;
            case Plume.Hydrolox_Upper: return Plume.GP_Hydrolox;
            case Plume.Hydynelox_A7: return Plume.GP_Hydynelox;
            case Plume.Hypergolic_Lower: return Plume.GP_Hypergolic;
            case Plume.Hypergolic_OMS_Red: return Plume.GP_OmsRed;
            case Plume.Hypergolic_OMS_White: return Plume.GP_OmsWhite;
            case Plume.Hypergolic_Upper: return Plume.GP_Hypergolic;
            case Plume.Hypergolic_Vernier: return Plume.GP_Hypergolic;
            case Plume.Ion_Argon_Gridded: return Plume.GP_IonArgon;
            case Plume.Ion_Krypton_Gridded: return Plume.GP_IonKrypton;
            case Plume.Ion_Krypton_Hall: return Plume.GP_IonKrypton;
            case Plume.Ion_Xenon_Gridded: return Plume.GP_IonXenon;
            case Plume.Ion_Xenon_Hall: return Plume.GP_IonXenon;
            case Plume.Kerolox_Lower: return Plume.GP_Kerolox;
            case Plume.Kerolox_Upper: return Plume.GP_Kerolox;
            case Plume.Kerolox_Vernier: return Plume.GP_Kerolox;
            case Plume.Solid_Lower: return Plume.GP_Solid;
            case Plume.Solid_Sepmotor: return Plume.GP_Solid;
            case Plume.Solid_Upper: return Plume.GP_Solid;
            case Plume.Solid_Vacuum: return Plume.GP_Solid;
            case Plume.Turbofan: return Plume.GP_OmsRed;
            case Plume.Turbojet: return Plume.GP_OmsRed;
            default: return plume;
        }
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
        EnergyMultiplier: 1.0,
        PlumeFiles: [],
        ImageSource: "img/plumePreviews/RP_Kerolox_Upper.webp",
        get ImageLabel() { return this.PlumeName; },
        PlumeMod: "RealPlume",
        get PlumeEffectName() { return this.PlumeID; }
    }, {
        PlumeID: "Kerolox-Lower",
        PlumeName: "Kerolox Lower",
        Scale: 0.4,
        PositionOffset: -0.002,
        FinalOffset: 0.0,
        EnergyMultiplier: 1.0,
        PlumeFiles: [],
        ImageSource: "img/plumePreviews/RP_Kerolox_Lower.webp",
        get ImageLabel() { return this.PlumeName; },
        PlumeMod: "RealPlume",
        get PlumeEffectName() { return this.PlumeID; }
    }, {
        PlumeID: "Kerolox-Vernier",
        PlumeName: "Kerolox Vernier",
        Scale: 8.5,
        PositionOffset: 0.0,
        FinalOffset: 0.0,
        EnergyMultiplier: 0.5,
        PlumeFiles: [],
        ImageSource: "img/plumePreviews/RP_Kerolox_Vernier.webp",
        get ImageLabel() { return this.PlumeName; },
        PlumeMod: "RealPlume",
        get PlumeEffectName() { return this.PlumeID; }
    }, {
        PlumeID: "Cryogenic-UpperLower-125",
        PlumeName: "Cryogenic 1.25",
        Scale: 0.35,
        PositionOffset: 0.0,
        FinalOffset: 0.0,
        EnergyMultiplier: 1.0,
        PlumeFiles: [],
        ImageSource: "img/plumePreviews/RP_Cryogenic_125.webp",
        get ImageLabel() { return this.PlumeName; },
        PlumeMod: "RealPlume",
        get PlumeEffectName() { return this.PlumeID; }
    }, {
        PlumeID: "Cryogenic-UpperLower-25",
        PlumeName: "Cryogenic 2.5",
        Scale: 0.6,
        PositionOffset: 0.0,
        FinalOffset: 0.0,
        EnergyMultiplier: 1.0,
        PlumeFiles: [],
        ImageSource: "img/plumePreviews/RP_Cryogenic_25.webp",
        get ImageLabel() { return this.PlumeName; },
        PlumeMod: "RealPlume",
        get PlumeEffectName() { return this.PlumeID; }
    }, {
        PlumeID: "Cryogenic-UpperLower-375",
        PlumeName: "Cryogenic 3.75",
        Scale: 0.3,
        PositionOffset: 0.0,
        FinalOffset: 0.0,
        EnergyMultiplier: 1.0,
        PlumeFiles: [],
        ImageSource: "img/plumePreviews/RP_Cryogenic_375.webp",
        get ImageLabel() { return this.PlumeName; },
        PlumeMod: "RealPlume",
        get PlumeEffectName() { return this.PlumeID; }
    }, {
        PlumeID: "Alcolox-Lower-A6",
        PlumeName: "Alcolox Lower (A6)",
        Scale: 0.6,
        PositionOffset: 0.032638,
        FinalOffset: 0.0,
        EnergyMultiplier: 1.0,
        PlumeFiles: [],
        ImageSource: "img/plumePreviews/RP_Alcolox_Lower_A6.webp",
        get ImageLabel() { return this.PlumeName; },
        PlumeMod: "RealPlume",
        get PlumeEffectName() { return this.PlumeID; }
    }, {
        PlumeID: "Ammonialox",
        PlumeName: "Ammonialox",
        Scale: 0.85,
        PositionOffset: 1.0319,
        FinalOffset: 0.0,
        EnergyMultiplier: 1.0,
        PlumeFiles: [],
        ImageSource: "img/plumePreviews/RP_Ammonialox.webp",
        get ImageLabel() { return this.PlumeName; },
        PlumeMod: "RealPlume",
        get PlumeEffectName() { return this.PlumeID; }
    }, {
        PlumeID: "Hydrogen-NTR",
        PlumeName: "Hydrogen NTR",
        Scale: 0.8,
        PositionOffset: -0.8,
        FinalOffset: 0.0,
        EnergyMultiplier: 1.0,
        PlumeFiles: [],
        ImageSource: "img/plumePreviews/RP_HydrogenNTR.webp",
        get ImageLabel() { return this.PlumeName; },
        PlumeMod: "RealPlume",
        get PlumeEffectName() { return this.PlumeID; }
    }, {
        PlumeID: "Hydrolox-Lower",
        PlumeName: "Hydrolox Lower",
        Scale: 0.7,
        PositionOffset: 1.0,
        FinalOffset: 0.0,
        EnergyMultiplier: 1.0,
        PlumeFiles: [],
        ImageSource: "img/plumePreviews/RP_Hydrolox_Lower.webp",
        get ImageLabel() { return this.PlumeName; },
        PlumeMod: "RealPlume",
        get PlumeEffectName() { return this.PlumeID; }
    }, {
        PlumeID: "Hydrolox-Upper",
        PlumeName: "Hydrolox Upper",
        Scale: 0.8,
        PositionOffset: 1.0,
        FinalOffset: 0.0,
        EnergyMultiplier: 1.0,
        PlumeFiles: [],
        ImageSource: "img/plumePreviews/RP_Hydrolox_Upper.webp",
        get ImageLabel() { return this.PlumeName; },
        PlumeMod: "RealPlume",
        get PlumeEffectName() { return this.PlumeID; }
    }, {
        PlumeID: "Hydynelox-A7",
        PlumeName: "Hydynelox (A7)",
        Scale: 0.7,
        PositionOffset: -0.854729,
        FinalOffset: 0.0,
        EnergyMultiplier: 1.0,
        PlumeFiles: [],
        ImageSource: "img/plumePreviews/RP_Hydynelox_A7.webp",
        get ImageLabel() { return this.PlumeName; },
        PlumeMod: "RealPlume",
        get PlumeEffectName() { return this.PlumeID; }
    }, {
        PlumeID: "Hypergolic-Lower",
        PlumeName: "Hypergolic Lower",
        Scale: 0.95,
        PositionOffset: 0.0,
        FinalOffset: 0.0,
        EnergyMultiplier: 1.0,
        PlumeFiles: [],
        ImageSource: "img/plumePreviews/RP_Hypergolic_Lower.webp",
        get ImageLabel() { return this.PlumeName; },
        PlumeMod: "RealPlume",
        get PlumeEffectName() { return this.PlumeID; }
    }, {
        PlumeID: "Hypergolic-Upper",
        PlumeName: "Hypergolic Upper",
        Scale: 1.1,
        PositionOffset: 0.0,
        FinalOffset: 0.0,
        EnergyMultiplier: 1.0,
        PlumeFiles: [],
        ImageSource: "img/plumePreviews/RP_Hypergolic_Upper.webp",
        get ImageLabel() { return this.PlumeName; },
        PlumeMod: "RealPlume",
        get PlumeEffectName() { return this.PlumeID; }
    }, {
        PlumeID: "Hypergolic-OMS-Red",
        PlumeName: "Hypergolic OMS (Red)",
        Scale: 1.7,
        PositionOffset: 0.514995,
        FinalOffset: 0.0,
        EnergyMultiplier: 1.0,
        PlumeFiles: [],
        ImageSource: "img/plumePreviews/RP_Hypergolic_OMS_Red.webp",
        get ImageLabel() { return this.PlumeName; },
        PlumeMod: "RealPlume",
        get PlumeEffectName() { return this.PlumeID; }
    }, {
        PlumeID: "Hypergolic-OMS-White",
        PlumeName: "Hypergolic OMS (White)",
        Scale: 1.8,
        PositionOffset: 0,
        FinalOffset: -0.04,
        EnergyMultiplier: 1.0,
        PlumeFiles: [],
        ImageSource: "img/plumePreviews/RP_Hypergolic_OMS_White.webp",
        get ImageLabel() { return this.PlumeName; },
        PlumeMod: "RealPlume",
        get PlumeEffectName() { return this.PlumeID; }
    }, {
        PlumeID: "Hypergolic-Vernier",
        PlumeName: "Hypergolic Vernier",
        Scale: 4.0,
        PositionOffset: 1.0,
        FinalOffset: 0.0,
        EnergyMultiplier: 1.0,
        PlumeFiles: [],
        ImageSource: "img/plumePreviews/RP_Hypergolic_Vernier.webp",
        get ImageLabel() { return this.PlumeName; },
        PlumeMod: "RealPlume",
        get PlumeEffectName() { return this.PlumeID; }
    }, {
        PlumeID: "Ion-Argon-Gridded",
        PlumeName: "Ion Argon (Gridded)",
        Scale: 1.2,
        PositionOffset: 0.0,
        FinalOffset: 0.0,
        EnergyMultiplier: 1.0,
        PlumeFiles: [],
        ImageSource: "img/plumePreviews/RP_Ion_Argon_Gridded.webp",
        get ImageLabel() { return this.PlumeName; },
        PlumeMod: "RealPlume",
        get PlumeEffectName() { return this.PlumeID; }
    }, {
        PlumeID: "Ion-Krypton-Gridded",
        PlumeName: "Ion Krypton (Gridded)",
        Scale: 1.5,
        PositionOffset: -0.854729,
        FinalOffset: 0.0,
        EnergyMultiplier: 1.0,
        PlumeFiles: [],
        ImageSource: "img/plumePreviews/RP_Ion_Krypton_Gridded.webp",
        get ImageLabel() { return this.PlumeName; },
        PlumeMod: "RealPlume",
        get PlumeEffectName() { return this.PlumeID; }
    }, {
        PlumeID: "Ion-Krypton-Hall",
        PlumeName: "Ion Krypton (Hall)",
        Scale: 1.5,
        PositionOffset: -0.015503,
        FinalOffset: 0.0,
        EnergyMultiplier: 1.0,
        PlumeFiles: [],
        ImageSource: "img/plumePreviews/RP_Ion_Krypton_Hall.webp",
        get ImageLabel() { return this.PlumeName; },
        PlumeMod: "RealPlume",
        get PlumeEffectName() { return this.PlumeID; }
    }, {
        PlumeID: "Ion-Xenon-Gridded",
        PlumeName: "Ion Xenon (Gridded)",
        Scale: 1.0,
        PositionOffset: 1.0,
        FinalOffset: 0.0,
        EnergyMultiplier: 1.0,
        PlumeFiles: [],
        ImageSource: "img/plumePreviews/RP_Ion_Xenon_Gridded.webp",
        get ImageLabel() { return this.PlumeName; },
        PlumeMod: "RealPlume",
        get PlumeEffectName() { return this.PlumeID; }
    }, {
        PlumeID: "Ion-Xenon-Hall",
        PlumeName: "Ion Xenon (Hall)",
        Scale: 1.6,
        PositionOffset: -0.015503,
        FinalOffset: 0.0,
        EnergyMultiplier: 1.0,
        PlumeFiles: [],
        ImageSource: "img/plumePreviews/RP_Ion_Xenon_Hall.webp",
        get ImageLabel() { return this.PlumeName; },
        PlumeMod: "RealPlume",
        get PlumeEffectName() { return this.PlumeID; }
    }, {
        PlumeID: "Solid-Lower",
        PlumeName: "Solid Lower",
        Scale: 0.3,
        PositionOffset: -0.002,
        FinalOffset: 0.0,
        EnergyMultiplier: 1.0,
        PlumeFiles: [],
        ImageSource: "img/plumePreviews/RP_Solid_Lower.webp",
        get ImageLabel() { return this.PlumeName; },
        PlumeMod: "RealPlume",
        get PlumeEffectName() { return this.PlumeID; }
    }, {
        PlumeID: "Solid-Upper",
        PlumeName: "Solid Upper",
        Scale: 0.3,
        PositionOffset: -0.002,
        FinalOffset: 0.0,
        EnergyMultiplier: 1.0,
        PlumeFiles: [],
        ImageSource: "img/plumePreviews/RP_Solid_Upper.webp",
        get ImageLabel() { return this.PlumeName; },
        PlumeMod: "RealPlume",
        get PlumeEffectName() { return this.PlumeID; }
    }, {
        PlumeID: "Solid-Sepmotor",
        PlumeName: "Solid Sepmotor",
        Scale: 3.0,
        PositionOffset: 0.0,
        FinalOffset: 0.0,
        EnergyMultiplier: 1.0,
        PlumeFiles: [],
        ImageSource: "img/plumePreviews/RP_Solid_Sepmotor.webp",
        get ImageLabel() { return this.PlumeName; },
        PlumeMod: "RealPlume",
        get PlumeEffectName() { return this.PlumeID; }
    }, {
        PlumeID: "Solid-Vacuum",
        PlumeName: "Solid Vacuum",
        Scale: 1.44,
        PositionOffset: 0.35831,
        FinalOffset: 0.0,
        EnergyMultiplier: 1.0,
        PlumeFiles: [],
        ImageSource: "img/plumePreviews/RP_Solid_Vacuum.webp",
        get ImageLabel() { return this.PlumeName; },
        PlumeMod: "RealPlume",
        get PlumeEffectName() { return this.PlumeID; }
    }, {
        PlumeID: "Turbofan",
        PlumeName: "Turbofan",
        Scale: 1.2,
        PositionOffset: -0.41932,
        FinalOffset: 0.0,
        EnergyMultiplier: 1.0,
        PlumeFiles: [],
        ImageSource: "img/plumePreviews/RP_Turbofan.webp",
        get ImageLabel() { return this.PlumeName; },
        PlumeMod: "RealPlume",
        get PlumeEffectName() { return this.PlumeID; }
    }, {
        PlumeID: "Turbojet",
        PlumeName: "Turbojet",
        Scale: 1.2,
        PositionOffset: 1.0,
        FinalOffset: -0.6,
        EnergyMultiplier: 1.0,
        PlumeFiles: [],
        ImageSource: "img/plumePreviews/RP_Turbojet.webp",
        get ImageLabel() { return this.PlumeName; },
        PlumeMod: "RealPlume",
        get PlumeEffectName() { return this.PlumeID; }
    }, {
        PlumeID: "alcolox",
        PlumeName: "Alcolox",
        Scale: 1.0,
        PositionOffset: 0.0,
        FinalOffset: 0.0,
        EnergyMultiplier: 1.0,
        PlumeFiles: [
            "files/GenericPlumes/Assets/alcolox.mu",
            "files/GenericPlumes/Presets/Flames/alcolox.cfg",
            "files/GenericPlumes/Assets/particle.png",
            "files/GenericPlumes/Sounds/loop1.wav",
        ],
        ImageSource: "img/plumePreviews/GP_Alcolox.webp",
        get ImageLabel() { return this.PlumeName; },
        PlumeMod: "GenericPlumes",
        get PlumeEffectName() { return `${this.PlumeID}Flame`; }
    }, {
        PlumeID: "ammonialox",
        PlumeName: "Ammonialox",
        Scale: 1.0,
        PositionOffset: 0.0,
        FinalOffset: 0.0,
        EnergyMultiplier: 1.0,
        PlumeFiles: [
            "files/GenericPlumes/Assets/ammonialox.mu",
            "files/GenericPlumes/Presets/Flames/ammonialox.cfg",
            "files/GenericPlumes/Assets/particle.png",
            "files/GenericPlumes/Sounds/loop1.wav",
        ],
        ImageSource: "img/plumePreviews/GP_Ammonialox.webp",
        get ImageLabel() { return this.PlumeName; },
        PlumeMod: "GenericPlumes",
        get PlumeEffectName() { return `${this.PlumeID}Flame`; }
    }, {
        PlumeID: "hydrogenNTR",
        PlumeName: "Thermal rocket hydrogen exhaust",
        Scale: 1.0,
        PositionOffset: 0.0,
        FinalOffset: 0.0,
        EnergyMultiplier: 1.0,
        PlumeFiles: [
            "files/GenericPlumes/Assets/hydrogenNTR.mu",
            "files/GenericPlumes/Presets/Flames/hydrogenNTR.cfg",
            "files/GenericPlumes/Assets/particleSolid.png",
            "files/GenericPlumes/Sounds/loop3.wav",
        ],
        ImageSource: "img/plumePreviews/GP_Thermal_Rocket_Hydrogen_Exhaust.webp",
        get ImageLabel() { return this.PlumeName; },
        PlumeMod: "GenericPlumes",
        get PlumeEffectName() { return `${this.PlumeID}Flame`; }
    }, {
        PlumeID: "hydrolox",
        PlumeName: "Hydrolox",
        Scale: 1.0,
        PositionOffset: 0.0,
        FinalOffset: 0.0,
        EnergyMultiplier: 1.0,
        PlumeFiles: [
            "files/GenericPlumes/Assets/hydrolox.mu",
            "files/GenericPlumes/Presets/Flames/hydrolox.cfg",
            "files/GenericPlumes/Assets/particleSolid.png",
            "files/GenericPlumes/Sounds/loop1.wav",
        ],
        ImageSource: "img/plumePreviews/GP_Hydrolox.webp",
        get ImageLabel() { return this.PlumeName; },
        PlumeMod: "GenericPlumes",
        get PlumeEffectName() { return `${this.PlumeID}Flame`; }
    }, {
        PlumeID: "hydynelox",
        PlumeName: "Hydynelox",
        Scale: 1.0,
        PositionOffset: 0.0,
        FinalOffset: 0.0,
        EnergyMultiplier: 1.0,
        PlumeFiles: [
            "files/GenericPlumes/Assets/hydynelox.mu",
            "files/GenericPlumes/Presets/Flames/hydynelox.cfg",
            "files/GenericPlumes/Assets/particle.png",
            "files/GenericPlumes/Sounds/loop1.wav",
        ],
        ImageSource: "img/plumePreviews/GP_Hydynelox.webp",
        get ImageLabel() { return this.PlumeName; },
        PlumeMod: "GenericPlumes",
        get PlumeEffectName() { return `${this.PlumeID}Flame`; }
    }, {
        PlumeID: "hypergolic",
        PlumeName: "Hypergolic",
        Scale: 1.0,
        PositionOffset: 0.0,
        FinalOffset: 0.0,
        EnergyMultiplier: 1.0,
        PlumeFiles: [
            "files/GenericPlumes/Assets/hypergolic.mu",
            "files/GenericPlumes/Presets/Flames/hypergolic.cfg",
            "files/GenericPlumes/Assets/particleSolid.png",
            "files/GenericPlumes/Sounds/loop1.wav",
        ],
        ImageSource: "img/plumePreviews/GP_Hypergolic.webp",
        get ImageLabel() { return this.PlumeName; },
        PlumeMod: "GenericPlumes",
        get PlumeEffectName() { return `${this.PlumeID}Flame`; }
    }, {
        PlumeID: "ionArgon",
        PlumeName: "Ion Argon",
        Scale: 1.0,
        PositionOffset: 0.0,
        FinalOffset: 0.0,
        EnergyMultiplier: 1.0,
        PlumeFiles: [
            "files/GenericPlumes/Assets/ionArgon.mu",
            "files/GenericPlumes/Presets/Flames/ionArgon.cfg",
            "files/GenericPlumes/Assets/particleSolid.png",
            "files/GenericPlumes/Sounds/loop3.wav",
        ],
        ImageSource: "img/plumePreviews/GP_Ion_Argon.webp",
        get ImageLabel() { return this.PlumeName; },
        PlumeMod: "GenericPlumes",
        get PlumeEffectName() { return `${this.PlumeID}Flame`; }
    }, {
        PlumeID: "ionKrypton",
        PlumeName: "Ion Krypton",
        Scale: 1.0,
        PositionOffset: 0.0,
        FinalOffset: 0.0,
        EnergyMultiplier: 1.0,
        PlumeFiles: [
            "files/GenericPlumes/Assets/ionKrypton.mu",
            "files/GenericPlumes/Presets/Flames/ionKrypton.cfg",
            "files/GenericPlumes/Assets/particleSolid.png",
            "files/GenericPlumes/Sounds/loop3.wav",
        ],
        ImageSource: "img/plumePreviews/GP_Ion_Krypton.webp",
        get ImageLabel() { return this.PlumeName; },
        PlumeMod: "GenericPlumes",
        get PlumeEffectName() { return `${this.PlumeID}Flame`; }
    }, {
        PlumeID: "ionXenon",
        PlumeName: "Ion Xenon",
        Scale: 1.0,
        PositionOffset: 0.0,
        FinalOffset: 0.0,
        EnergyMultiplier: 1.0,
        PlumeFiles: [
            "files/GenericPlumes/Assets/ionXenon.mu",
            "files/GenericPlumes/Presets/Flames/ionXenon.cfg",
            "files/GenericPlumes/Assets/particleSolid.png",
            "files/GenericPlumes/Sounds/loop3.wav",
        ],
        ImageSource: "img/plumePreviews/GP_Ion_Xenon.webp",
        get ImageLabel() { return this.PlumeName; },
        PlumeMod: "GenericPlumes",
        get PlumeEffectName() { return `${this.PlumeID}Flame`; }
    }, {
        PlumeID: "kerolox",
        PlumeName: "Kerolox",
        Scale: 1.0,
        PositionOffset: 0.0,
        FinalOffset: 0.0,
        EnergyMultiplier: 1.0,
        PlumeFiles: [
            "files/GenericPlumes/Assets/kerolox.mu",
            "files/GenericPlumes/Presets/Flames/kerolox.cfg",
            "files/GenericPlumes/Assets/particle.png",
            "files/GenericPlumes/Sounds/loop1.wav",
        ],
        ImageSource: "img/plumePreviews/GP_Kerolox.webp",
        get ImageLabel() { return this.PlumeName; },
        PlumeMod: "GenericPlumes",
        get PlumeEffectName() { return `${this.PlumeID}Flame`; }
    }, {
        PlumeID: "methalox",
        PlumeName: "Methalox",
        Scale: 1.0,
        PositionOffset: 0.0,
        FinalOffset: 0.0,
        EnergyMultiplier: 1.0,
        PlumeFiles: [
            "files/GenericPlumes/Assets/methalox.mu",
            "files/GenericPlumes/Presets/Flames/methalox.cfg",
            "files/GenericPlumes/Assets/particle.png",
            "files/GenericPlumes/Sounds/loop1.wav",
        ],
        ImageSource: "img/plumePreviews/GP_Methalox.webp",
        get ImageLabel() { return this.PlumeName; },
        PlumeMod: "GenericPlumes",
        get PlumeEffectName() { return `${this.PlumeID}Flame`; }
    }, {
        PlumeID: "omsRed",
        PlumeName: "OMS Red",
        Scale: 1.0,
        PositionOffset: 0.0,
        FinalOffset: 0.0,
        EnergyMultiplier: 1.0,
        PlumeFiles: [
            "files/GenericPlumes/Assets/omsRed.mu",
            "files/GenericPlumes/Presets/Flames/omsRed.cfg",
            "files/GenericPlumes/Assets/particle.png",
            "files/GenericPlumes/Sounds/loop2.wav",
        ],
        ImageSource: "img/plumePreviews/GP_OMS_Red.webp",
        get ImageLabel() { return this.PlumeName; },
        PlumeMod: "GenericPlumes",
        get PlumeEffectName() { return `${this.PlumeID}Flame`; }
    }, {
        PlumeID: "omsWhite",
        PlumeName: "OMS White",
        Scale: 1.0,
        PositionOffset: 0.0,
        FinalOffset: 0.0,
        EnergyMultiplier: 1.0,
        PlumeFiles: [
            "files/GenericPlumes/Assets/omsWhite.mu",
            "files/GenericPlumes/Presets/Flames/omsWhite.cfg",
            "files/GenericPlumes/Assets/particle.png",
            "files/GenericPlumes/Sounds/loop2.wav",
        ],
        ImageSource: "img/plumePreviews/GP_OMS_White.webp",
        get ImageLabel() { return this.PlumeName; },
        PlumeMod: "GenericPlumes",
        get PlumeEffectName() { return `${this.PlumeID}Flame`; }
    }, {
        PlumeID: "solid",
        PlumeName: "Solid",
        Scale: 1.0,
        PositionOffset: 0.0,
        FinalOffset: 0.0,
        EnergyMultiplier: 1.0,
        PlumeFiles: [
            "files/GenericPlumes/Assets/solid.mu",
            "files/GenericPlumes/Presets/Flames/solid.cfg",
            "files/GenericPlumes/Assets/particle.png",
            "files/GenericPlumes/Sounds/loop4.wav",
        ],
        ImageSource: "img/plumePreviews/GP_Solid.webp",
        get ImageLabel() { return this.PlumeName; },
        PlumeMod: "GenericPlumes",
        get PlumeEffectName() { return `${this.PlumeID}Flame`; }
    }, {
        PlumeID: "turbopumpSmoke",
        PlumeName: "Turbopump Smoke",
        Scale: 1.0,
        PositionOffset: 0.0,
        FinalOffset: 0.0,
        EnergyMultiplier: 1.0,
        PlumeFiles: [
            "files/GenericPlumes/Assets/turbopumpSmoke.mu",
            "files/GenericPlumes/Presets/Flames/turbopumpSmoke.cfg",
            "files/GenericPlumes/Assets/particleRough.png",
            "files/GenericPlumes/Sounds/loop2.wav",
        ],
        ImageSource: "img/plumePreviews/GP_Turbopump_Smoke.webp",
        get ImageLabel() { return this.PlumeName; },
        PlumeMod: "GenericPlumes",
        get PlumeEffectName() { return `${this.PlumeID}Flame`; }
    }
];
PlumeInfo.Dropdown = PlumeInfo.BuildDropdown();
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
const TechNodeNames = new Map([
    [TechNode.start, "Start"],
    [TechNode.supersonicDev, "Supersonic Plane Development"],
    [TechNode.supersonicFlightRP0, "Supersonic Flight"],
    [TechNode.matureSupersonic, "Mature Supersonic Flight"],
    [TechNode.highSpeedFlight, "High Speed Flight"],
    [TechNode.advancedJetEngines, "Advanced Jet Engines"],
    [TechNode.matureTurbofans, "Mature Turbofans"],
    [TechNode.refinedTurbofans, "Refined Turbofans"],
    [TechNode.scramjetEngines, "Scramjet Engines"],
    [TechNode.experimentalAircraft, "Experimental Aircraft Engines"],
    [TechNode.colonization2051Flight, "2051-2099 Regular Flight"],
    [TechNode.colonization2100Flight, "2100-2149 Regular Flight"],
    [TechNode.colonization2150Flight, "2150+ Regular Flight"],
    [TechNode.hypersonicFlightRP0, "Hypersonic Flight"],
    [TechNode.prototypeSpaceplanes, "Prototype Spaceplaces"],
    [TechNode.effectiveSpaceplanes, "Effective Spaceplanes"],
    [TechNode.spaceShuttles, "Space Shuttles"],
    [TechNode.improvedSpaceplanes, "Improved Spaceplanes"],
    [TechNode.advancedSpaceplanes, "Advanced Spaceplanes"],
    [TechNode.highTechSpaceplanes, "High-Tech Spaceplanes"],
    [TechNode.experimentalSpaceplanes, "Experimental Spaceplanes"],
    [TechNode.sstoSpaceplanes, "SSTO Spaceplanes"],
    [TechNode.colonization2100Spaceplanes, "2100-2149 Spaceplanes"],
    [TechNode.colonization2150Spaceplanes, "2150+ Spaceplanes"],
    [TechNode.basicCapsules, "Basic Capsules"],
    [TechNode.secondGenCapsules, "Second Generation Capsules"],
    [TechNode.matureCapsules, "Mature Capsules"],
    [TechNode.improvedCapsules, "Improved Capsules"],
    [TechNode.advancedCapsules, "Advanced Capsules"],
    [TechNode.modernCapsules, "Modern Capsules"],
    [TechNode.capsulesNF, "Near Future Capsules"],
    [TechNode.highTechCapsules, "High-Tech Capsules"],
    [TechNode.colonization2100Command, "2100-2149 Command Modules"],
    [TechNode.colonization2150Command, "2150+ Command Modules"],
    [TechNode.spaceStationPrototypes, "Space Station Prototypes"],
    [TechNode.spaceStationDev, "Space Station Development"],
    [TechNode.earlySpaceStations, "Early Space Stations"],
    [TechNode.modularSpaceStations, "Modular Space Stations"],
    [TechNode.largeScaleOrbitalCon, "Large Scale Orbital Construction"],
    [TechNode.improvedOrbitalConstruction, "Improved Orbital Construction"],
    [TechNode.inflatableHabitats, "Inflatable Habitats"],
    [TechNode.improvedHabitats, "Improved Habitats"],
    [TechNode.advancedHabitats, "Advanced Habitats"],
    [TechNode.largeScaleHabitats, "Large Scale Habitats"],
    [TechNode.colonization2100SpaceStations, "2100-2149 Space Stations"],
    [TechNode.colonization2150SpaceStations, "2150+ Space Stations"],
    [TechNode.earlyFlightControl, "Early Flight Control"],
    [TechNode.stabilityRP0, "Stability"],
    [TechNode.earlyDocking, "Early Docking Procedures"],
    [TechNode.improvedFlightControl, "Improved Flight Control"],
    [TechNode.advancedFlightControl, "Advanced Flight Control"],
    [TechNode.dockingCrewTransfer, "Docking and Crew Transfer"],
    [TechNode.spaceStationControl, "Space Station Attitude Control"],
    [TechNode.largeSpaceplaneControl, "Large Spaceplane Control"],
    [TechNode.standardDockingPorts, "Standardized Docking Ports"],
    [TechNode.largeStationControl, "Large Station Attitude Control"],
    [TechNode.largeDockingPorts, "Large Docking Ports"],
    [TechNode.gridFins, "Grid Fins"],
    [TechNode.flightControlNF, "Near Future Flight Control"],
    [TechNode.colonization2051Control, "2051-2099 Control"],
    [TechNode.colonization2100Control, "2100-2149 Control"],
    [TechNode.colonization2150Control, "2150+ Control"],
    [TechNode.entryDescentLanding, "Entry, Descent and Landing"],
    [TechNode.humanRatedEDL, "Human Rated EDL"],
    [TechNode.earlyLanding, "Early Landing"],
    [TechNode.lunarRatedHeatshields, "Lunar Rated Heatshields"],
    [TechNode.lunarLanding, "Lunar Landing"],
    [TechNode.improvedLandingEngines, "Improved Landing Engines"],
    [TechNode.advancedUncrewedLanding, "Advanced Uncrewed Landing"],
    [TechNode.interplanetaryRovers, "Interplanetary Rovers"],
    [TechNode.largeRoverDesigns, "Large Rover Designs"],
    [TechNode.reusability, "Reusability"],
    [TechNode.advancedLanding, "Advanced Landing"],
    [TechNode.SIAD, "Supersonic Inflatable Aerodynamic Decelerator"],
    [TechNode.HIAD, "Hypersonic Inflatable Aerodynamic Decelerator"],
    [TechNode.colonization2051EDL, "2051-2099 EDL"],
    [TechNode.colonization2100EDL, "2100-2149 EDL"],
    [TechNode.colonization2150EDL, "2150+ EDL"],
    [TechNode.prototypeHydrolox, "Prototype Hydrolox Engines"],
    [TechNode.earlyHydrolox, "Early Hydrolox Engines"],
    [TechNode.improvedHydrolox, "Improved Hydrolox Engines"],
    [TechNode.largeHydrolox, "Large Hydrolox Engines"],
    [TechNode.hydrolox1968, "1968 Hydrolox Engines"],
    [TechNode.hydrolox1972, "1972-1975 Hydrolox Engines"],
    [TechNode.hydrolox1976, "1976-1980 Hydrolox Engines"],
    [TechNode.hydrolox1981, "1981-1985 Hydrolox Engines"],
    [TechNode.hydrolox1986, "1986-1991 Hydrolox Engines"],
    [TechNode.hydrolox1992, "1992-1997 Hydrolox Engines"],
    [TechNode.hydrolox1998, "1998-2008 Hydrolox Engines"],
    [TechNode.hydrolox2009, "2009-2018 Hydrolox Engines"],
    [TechNode.hydroloxNF, "Near Future Hydrolox Engines"],
    [TechNode.colonization2051Hydrolox, "2051-2099 Hydrolox Engines"],
    [TechNode.colonization2100Hydrolox, "2100-2149  Hydrolox Engines"],
    [TechNode.colonization2150Hydrolox, "2150+  Hydrolox Engines"],
    [TechNode.rocketryTesting, "Post-War Rocketry Testing"],
    [TechNode.earlyRocketry, "Early Rocketry"],
    [TechNode.basicRocketryRP0, "Basic Rocketry"],
    [TechNode.orbitalRocketry1956, "1956-1957 Orbital Rocketry"],
    [TechNode.orbitalRocketry1958, "1958 Orbital Rocketry"],
    [TechNode.orbitalRocketry1959, "1959 Orbital Rocketry"],
    [TechNode.orbitalRocketry1960, "1960 Orbital Rocketry"],
    [TechNode.orbitalRocketry1961, "1961 Orbital Rocketry"],
    [TechNode.orbitalRocketry1962, "1962 Orbital Rocketry"],
    [TechNode.orbitalRocketry1963, "1963 Orbital Rocketry"],
    [TechNode.orbitalRocketry1964, "1964 Orbital Rocketry"],
    [TechNode.orbitalRocketry1965, "1965 Orbital Rocketry"],
    [TechNode.orbitalRocketry1966, "1966 Orbital Rocketry"],
    [TechNode.orbitalRocketry1967, "1967-1968 Orbital Rocketry"],
    [TechNode.orbitalRocketry1970, "1970-1971 Orbital Rocketry"],
    [TechNode.orbitalRocketry1972, "1972-1975 Orbital Rocketry"],
    [TechNode.orbitalRocketry1976, "1976-1980 Orbital Rocketry"],
    [TechNode.orbitalRocketry1981, "1981-1985 Orbital Rocketry"],
    [TechNode.orbitalRocketry1986, "1986-1991 Orbital Rocketry"],
    [TechNode.orbitalRocketry1992, "1992-1997 Orbital Rocketry"],
    [TechNode.orbitalRocketry1998, "1998-2003 Orbital Rocketry"],
    [TechNode.orbitalRocketry2004, "2004-2008 Orbital Rocketry"],
    [TechNode.orbitalRocketry2009, "2009-2013 Orbital Rocketry"],
    [TechNode.orbitalRocketry2014, "2014-2018 Orbital Rocketry"],
    [TechNode.orbitalRocketryNF, "Near Future Orbital Rocketry"],
    [TechNode.colonization2051Orbital, "2051-2099 Orbital Rocketry"],
    [TechNode.colonization2100Orbital, "2100-2149  Orbital Rocketry"],
    [TechNode.colonization2150Orbital, "2150+  Orbital Rocketry"],
    [TechNode.firstStagedCombustion, "First Staged Combustion Engines"],
    [TechNode.stagedCombustion1964, "1964 Staged Combustion Engines"],
    [TechNode.stagedCombustion1966, "1966 Staged Combustion Engines"],
    [TechNode.stagedCombustion1967, "1967-1968 Staged Combustion Engines"],
    [TechNode.stagedCombustion1969, "1969 Staged Combustion Engines"],
    [TechNode.stagedCombustion1970, "1970-1971 Staged Combustion Engines"],
    [TechNode.stagedCombustion1972, "1972-1980 Staged Combustion Engines"],
    [TechNode.stagedCombustion1981, "1981-1985 Staged Combustion Engines"],
    [TechNode.stagedCombustion1986, "1986-1991 Staged Combustion Engines"],
    [TechNode.stagedCombustion1992, "1992-1997 Staged Combustion Engines"],
    [TechNode.stagedCombustion1998, "1998-2003 Staged Combustion Engines"],
    [TechNode.stagedCombustion2004, "2004-2008 Staged Combustion Engines"],
    [TechNode.stagedCombustion2009, "2009-2013 Staged Combustion Engines"],
    [TechNode.stagedCombustion2014, "2014-2018 Staged Combustion Engines"],
    [TechNode.stagedCombustionNF, "Near Future Staged Combustion Engines"],
    [TechNode.colonization2051Staged, "2051-2099 Staged Combustion"],
    [TechNode.colonization2100Staged, "2100-2149  Staged Combustion"],
    [TechNode.colonization2150Staged, "2150+  Staged Combustion"],
    [TechNode.earlySolids, "Early Solid Rocket Engines"],
    [TechNode.solids1956, "1956-1957 Solid Rocket Engines"],
    [TechNode.solids1958, "1958 Solid Rocket Engines"],
    [TechNode.solids1959, "1959-1960 Solid Rocket Engines"],
    [TechNode.solids1962, "1962-1963 Solid Rocket Engines"],
    [TechNode.solids1964, "1964-1965 Solid Rocket Engines"],
    [TechNode.solids1966, "1966 Solid Rocket Engines"],
    [TechNode.solids1967, "1967-1968 Solid Rocket Engines"],
    [TechNode.solids1969, "1969-1971 Solid Rocket Engines"],
    [TechNode.solids1972, "1972-1975 Solid Rocket Engines"],
    [TechNode.solids1976, "1976-1980 Solid Rocket Engines"],
    [TechNode.solids1981, "1981-1985 Solid Rocket Engines"],
    [TechNode.solids1986, "1986-1991 Solid Rocket Engines"],
    [TechNode.solids1992, "1992-1997 Solid Rocket Engines"],
    [TechNode.solids1998, "1998-2008 Solid Rocket Engines"],
    [TechNode.solids2009, "2009-2018 Solid Rocket Engines"],
    [TechNode.solidsNF, "Near Future Solid Rocket Engines"],
    [TechNode.colonization2051Solid, "2051-2099 Solids"],
    [TechNode.colonization2100Solid, "2100-2149 Solids"],
    [TechNode.colonization2150Solid, "2150+ Solids"],
    [TechNode.earlyElecPropulsion, "Early Electric Propulsion"],
    [TechNode.basicElecPropulsion, "Basic Electric Propulsion"],
    [TechNode.improvedElecPropulsion, "Improved Electric Propulsion"],
    [TechNode.advancedElecPropulsion, "Advanced Electric Propulsion"],
    [TechNode.colonization2051ElecProp, "2051-2099 Electric Propulsion"],
    [TechNode.colonization2100ElecProp, "2100-2149 Electric Propulsion"],
    [TechNode.colonization2150ElecProp, "2150+ Electric Propulsion"],
    [TechNode.prototypeNuclearPropulsion, "Prototype Nuclear Propulsion"],
    [TechNode.earlyNuclearPropulsion, "Early Nuclear Propulsion"],
    [TechNode.basicNuclearPropulsion, "Basic Nuclear Propulsion"],
    [TechNode.improvedNuclearPropulsion, "Improved Nuclear Propulsion"],
    [TechNode.advancedNuclearPropulsion, "Advanced Nuclear Propulsion"],
    [TechNode.efficientNuclearPropulsion, "Efficient Nuclear Propulsion"],
    [TechNode.nuclearPropulsionNF, "Near Future Nuclear Propulsion"],
    [TechNode.nuclearPropulsionNF2, "Advanced Near Future Nuclear Propulsion"],
    [TechNode.colonization2051NuclearProp, "2051-2099 Nuclear Propulsion"],
    [TechNode.colonization2100NuclearProp, "2100-2149 Nuclear Propulsion"],
    [TechNode.colonization2150NuclearProp, "2150+ Nuclear Propulsion"],
    [TechNode.crewSurvivability, "Crew Survivability"],
    [TechNode.earlyLifeSupport, "Early Life Support and ISRU"],
    [TechNode.lifeSupportISRU, "Life Support and ISRU"],
    [TechNode.basicLifeSupport, "Basic Life Support and ISRU"],
    [TechNode.improvedLifeSupport, "Improved Life Support and ISRU"],
    [TechNode.longTermLifeSupport, "Long-Life Support and ISRU"],
    [TechNode.advancedLifeSupport, "Long-Term Life Support and ISRU"],
    [TechNode.efficientLifeSupport, "Efficient Life Support and ISRU"],
    [TechNode.lifeSupportNF, "Near Future Life Support and ISRU"],
    [TechNode.colonization2051LifeSupport, "2051-2099 Life Support and ISRU"],
    [TechNode.colonization2100LifeSupport, "2100-2149 Life Support and ISRU"],
    [TechNode.colonization2150LifeSupport, "2150+ Life Support and ISRU"],
    [TechNode.postWarMaterialsScience, "Post-War Materials Science"],
    [TechNode.earlyMaterialsScience, "Early Materials Science"],
    [TechNode.materialsScienceSatellite, "Satellite Era Materials Science"],
    [TechNode.materialsScienceHuman, "Early Human Spaceflight Materials Science"],
    [TechNode.materialsScienceAdvCapsules, "Advanced Capsules Era Materials Science"],
    [TechNode.materialsScienceLunar, "Lunar Exploration Era Materials Science"],
    [TechNode.materialsScienceSpaceStation, "Space Station Era Materials Science"],
    [TechNode.materialsScienceSpaceplanes, "Spaceplanes Era Materials Science"],
    [TechNode.materialsScienceLongTerm, "Long-Term Space Habitation Era Materials Science"],
    [TechNode.materialsScienceInternational, "International Cooperation Era Materials Science"],
    [TechNode.materialsScienceCommercial, "Commercial Spaceflight Era Materials Science"],
    [TechNode.materialsScienceNF, "Near Future Era Materials Science"],
    [TechNode.materialsScienceColonization, "Colonization Era Materials Science"],
    [TechNode.electronicsSatellite, "Satellite Era Electronics Research"],
    [TechNode.electronicsHuman, "Early Human Spaceflight Electronics Research"],
    [TechNode.electronicsAdvCapsules, "Advanced Capsules Era Electronics Research"],
    [TechNode.electronicsLunar, "Lunar Exploration Era Electronics Research"],
    [TechNode.electronicsSpaceStation, "Space Station Era Electronics Research"],
    [TechNode.electronicsSpaceplanes, "Spaceplanes Era Electronics Research"],
    [TechNode.electronicsLongTerm, "Long-Term Space Habitation Era Electronics Research"],
    [TechNode.electronicsInternational, "International Cooperation Era Electronics Research"],
    [TechNode.electronicsCommercial, "Commercial Spaceflight Era Electronics Research"],
    [TechNode.electronicsNF, "Near Future Era Electronics Research"],
    [TechNode.electronicsColonization, "Colonization Era Electronics Research"],
    [TechNode.firstRTG, "First RTG's"],
    [TechNode.earlyRTG, "Early RTG's"],
    [TechNode.nuclearFissionReactors, "Small Nuclear Fission Reactors"],
    [TechNode.improvedRTG, "Improved RTG's"],
    [TechNode.multihundredWattRTG, "Multihundred-Watt RTG's"],
    [TechNode.gphsRTG, "GPHS-RTG's"],
    [TechNode.improvedNuclearPower, "Improved Nuclear Power Generation"],
    [TechNode.advancedNuclearPower, "Advanced Nuclear Power Generation"],
    [TechNode.modernNuclearPower, "Modern Nuclear Power Generation"],
    [TechNode.nuclearPowerNF, "Near Future Nuclear Power Generation"],
    [TechNode.colonization2051NuclearPower, "2051-2099 Nuclear Power"],
    [TechNode.colonization2100NuclearPower, "2100-2149 Nuclear Power"],
    [TechNode.colonization2150NuclearPower, "2150+ Nuclear Power"],
    [TechNode.primitiveSolarPanels, "Primitive Solar Panels"],
    [TechNode.earlyPower, "Early Power Generation and Storage"],
    [TechNode.basicPower, "Basic Power Generation and Storage"],
    [TechNode.improvedPower, "Improved Power Generation and Storage"],
    [TechNode.lunarRatedPower, "Lunar Rated Power Generation"],
    [TechNode.spaceStationSolarPanels, "Space Station Solar Panels"],
    [TechNode.maturePower, "Mature Power Generation and Storage"],
    [TechNode.largeScaleSolarArrays, "Large Scale Solar Arrays"],
    [TechNode.advancedPower, "Advanced Power Generation and Storage"],
    [TechNode.modernPower, "Modern Power Generation and Storage"],
    [TechNode.powerNF, "Near Future Power Generation and Storage"],
    [TechNode.colonization2051Power, "2051-2099 Power Generation and Storage"],
    [TechNode.colonization2100Power, "2100-2149 Power Generation and Storage"],
    [TechNode.colonization2150Power, "2150+ Power Generation and Storage"],
    [TechNode.lunarRangeComms, "Lunar Range Communications"],
    [TechNode.interplanetaryComms, "Interplanetary Communications"],
    [TechNode.improvedComms, "Improved Communications"],
    [TechNode.advancedComms, "Advanced Communications"],
    [TechNode.deepSpaceComms, "Deep Space Communications"],
    [TechNode.largeScaleComms, "Large Scale Communications"],
    [TechNode.massiveScaleComms, "Massive Scale Communications"],
    [TechNode.efficientComms, "Efficient Communications"],
    [TechNode.modernComms, "Modern Communications"],
    [TechNode.commsNF, "Near Future Communications"],
    [TechNode.colonization2051Comms, "2051-2099 Communications"],
    [TechNode.colonization2100Comms, "2100-2149 Communications"],
    [TechNode.colonization2150Comms, "2150+ Communications"],
    [TechNode.postWarAvionics, "Post-War Avionics"],
    [TechNode.avionicsPrototypes, "Avionics Prototypes"],
    [TechNode.earlyAvionics, "Early Avionics and Probes"],
    [TechNode.basicAvionics, "Basic Avionics and Probes"],
    [TechNode.interplanetaryProbes, "Interplanetary Probes"],
    [TechNode.improvedAvionics, "Improved Avionics"],
    [TechNode.matureAvionics, "Mature Avionics and Probes"],
    [TechNode.largeScaleAvionics, "Large Scale Avionics"],
    [TechNode.advancedAvionics, "Advanced Avionics and Probes"],
    [TechNode.nextGenAvionics, "Next Generation Avionics and Probes"],
    [TechNode.longTermAvionics, "Long-Term Space Habitation Era Avionics and Probes"],
    [TechNode.internationalAvionics, "International Era Avionics and Probes"],
    [TechNode.modernAvionics, "Modern Avionics and Probes"],
    [TechNode.avionicsNF, "Near Future Avionics and Probes"],
    [TechNode.colonization2051Avionics, "2051-2099 Avionics and Probes"],
    [TechNode.colonization2100Avionics, "2100-2149 Avionics and Probes"],
    [TechNode.colonization2150Avionics, "2150+ Avionics and Probes"],
    [TechNode.earlyScience, "Early Science"],
    [TechNode.scienceSatellite, "Satellite Era Science"],
    [TechNode.scienceHuman, "Early Human Spaceflight Era Science"],
    [TechNode.scienceAdvCapsules, "Interplanetary Era Science"],
    [TechNode.scienceLunar, "Lunar Exploration Era Science"],
    [TechNode.surfaceScience, "Surface Science"],
    [TechNode.deepSpaceScience, "Deep Space Science Experiments"],
    [TechNode.scienceExploration, "Exploration Era Science"],
    [TechNode.sampleReturnScience, "Sample Return Science Experiments"],
    [TechNode.advancedScience, "Advanced Science Experiments"],
    [TechNode.advancedSurfaceScience, "Advanced Surface Experiments"],
    [TechNode.scienceNF, "Near Future Science"],
    [TechNode.colonization2051Science, "2051-2099 Science"],
    [TechNode.colonization2100Science, "2100-2149 Science"],
    [TechNode.colonization2150Science, "2150+ Science"],
]);
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
                let newEngines = Serializer.DeserializeMany(Store.GetBinary(i));
                newEngines.forEach(e => {
                    e.EngineList = MainEngineTable.Items;
                });
                MainEngineTable.AddItems(newEngines);
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
                    MainEngineTable.Items = Serializer.DeserializeMany(Store.GetBinary(i));
                    MainEngineTable.RebuildTable();
                    MainEngineTable.Items.forEach(e => {
                        e.EngineList = MainEngineTable.Items;
                    });
                    this.DialogBoxElement.style.display = "none";
                }
            });
            listItem.appendChild(openButton);
            container.appendChild(listItem);
        });
    }
}
document.addEventListener("DOMContentLoaded", () => {
    ModelSelector.DialogBoxElement = document.getElementById("model-selector");
    ModelSelector.DialogBoxElement.querySelector("div.fullscreen-grayout").addEventListener("click", () => {
        ModelSelector.FinishTransaction(null);
    });
    let container = ModelSelector.DialogBoxElement.querySelector("#model-selector-content");
    container.innerHTML = "";
    let models = [];
    for (let i in Model) {
        if (isNaN(parseInt(i))) {
            break;
        }
        let id = parseInt(i);
        models.push([id, ModelInfo.GetModelInfo(id)]);
    }
    models.sort((a, b) => {
        if (a[1].ModelName > b[1].ModelName) {
            return 1;
        }
        else if (a[1].ModelName < b[1].ModelName) {
            return -1;
        }
        else {
            return 0;
        }
    });
    models.forEach(([id, modelInfo]) => {
        let newElement = document.createElement("div");
        newElement.innerHTML = `
            <span>${modelInfo.ImageLabel}</span>
            <div class="option-button"><img src="${modelInfo.ImageSource}"></div>
        `;
        newElement.querySelector("div").addEventListener("click", () => {
            ModelSelector.FinishTransaction(id);
        });
        ImageOverflowPreview.Hook(newElement.querySelector("div"));
        container.appendChild(newElement);
    });
});
class ModelSelector {
    static SetTransaction(transaction) {
        if (this.CurrentTransaction) {
            this.CurrentTransaction(null);
        }
        this.DialogBoxElement.style.display = "flex";
        this.CurrentTransaction = transaction;
    }
    static FinishTransaction(message) {
        if (this.CurrentTransaction) {
            this.CurrentTransaction(message);
        }
        this.DialogBoxElement.style.display = "none";
        this.CurrentTransaction = null;
    }
    static GetModel(callback) {
        this.SetTransaction(callback);
    }
}
document.addEventListener("DOMContentLoaded", () => {
    PlumeSelector.DialogBoxElement = document.getElementById("plume-selector");
    PlumeSelector.DialogBoxElement.querySelector("div.fullscreen-grayout").addEventListener("click", () => {
        PlumeSelector.FinishTransaction(null);
    });
    let container = PlumeSelector.DialogBoxElement.querySelector("#plume-selector-content");
    container.innerHTML = "";
    let plumes = [];
    for (let i in Plume) {
        if (isNaN(parseInt(i))) {
            break;
        }
        let id = parseInt(i);
        let plumeInfo = PlumeInfo.GetPlumeInfo(id);
        if (plumeInfo.PlumeMod != "RealPlume") {
            plumes.push([id, plumeInfo]);
        }
    }
    plumes.sort((a, b) => {
        if (a[1].PlumeMod > b[1].PlumeMod) {
            return 1;
        }
        else if (a[1].PlumeMod < b[1].PlumeMod) {
            return -1;
        }
        else {
            if (a[1].PlumeName > b[1].PlumeName) {
                return 1;
            }
            else if (a[1].PlumeName < b[1].PlumeName) {
                return -1;
            }
            else {
                return 0;
            }
        }
    });
    plumes.forEach(([id, plumeInfo]) => {
        let newElement = document.createElement("div");
        newElement.innerHTML = `
            <span>${plumeInfo.ImageLabel}</span>
            <div class="option-button"><img src="${plumeInfo.ImageSource}"></div>
        `;
        newElement.querySelector("div").addEventListener("click", () => {
            PlumeSelector.FinishTransaction(id);
        });
        ImageOverflowPreview.Hook(newElement.querySelector("div"));
        container.appendChild(newElement);
    });
});
class PlumeSelector {
    static SetTransaction(transaction) {
        if (this.CurrentTransaction) {
            this.CurrentTransaction(null);
        }
        this.DialogBoxElement.style.display = "flex";
        this.CurrentTransaction = transaction;
    }
    static FinishTransaction(message) {
        if (this.CurrentTransaction) {
            this.CurrentTransaction(message);
        }
        this.DialogBoxElement.style.display = "none";
        this.CurrentTransaction = null;
    }
    static GetPlume(callback) {
        this.SetTransaction(callback);
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
    constructor() {
        this.Spacer = false;
        this.EditableFieldMetadata = {
            Spacer: EngineEditableFieldMetadata.Spacer,
            ID: EngineEditableFieldMetadata.ID,
            Mass: EngineEditableFieldMetadata.Mass,
            Thrust: EngineEditableFieldMetadata.Thrust,
            AtmIsp: EngineEditableFieldMetadata.AtmIsp,
            VacIsp: EngineEditableFieldMetadata.VacIsp,
            Cost: EngineEditableFieldMetadata.Cost,
            EntryCost: EngineEditableFieldMetadata.EntryCost,
            MinThrust: EngineEditableFieldMetadata.MinThrust,
            AlternatorPower: EngineEditableFieldMetadata.AlternatorPower,
            Ignitions: EngineEditableFieldMetadata.Ignitions,
            TechUnlockNode: EngineEditableFieldMetadata.TechUnlockNode,
            EngineVariant: EngineEditableFieldMetadata.EngineVariant,
            ThrustCurve: EngineEditableFieldMetadata.ThrustCurve,
            Dimensions: EngineEditableFieldMetadata.Dimensions,
            FuelRatios: EngineEditableFieldMetadata.FuelRatios,
            Gimbal: EngineEditableFieldMetadata.Gimbal,
            Labels: EngineEditableFieldMetadata.Labels,
            Polymorphism: EngineEditableFieldMetadata.Polymorphism,
            Tank: EngineEditableFieldMetadata.Tank,
            TestFlight: EngineEditableFieldMetadata.TestFlight,
            Visuals: EngineEditableFieldMetadata.Visuals,
        };
        this.ListCols = [];
        this.EditableFields = [];
        this.EngineList = [];
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
        this.PlumeID = Plume.GP_Kerolox;
        this.UseExhaustEffect = false;
        this.ExhaustPlumeID = Plume.GP_TurbopumpSmoke;
        this.ExhaustThrustPercent = 1;
        this.ExhaustIspPercent = 75;
        this.ExhaustGimbal = 10;
        this.ExhaustGimbalOnlyRoll = true;
        this.OnEditEnd = () => {
            this.UpdateEveryDisplay();
        };
    }
    static RegularSort(...args) {
        for (let i = 0; i <= args.length - 2; i += 2) {
            let a = args[i];
            let b = args[i + 1];
            a = typeof a == "string" ? a.toLowerCase() : a;
            b = typeof b == "string" ? b.toLowerCase() : b;
            if (a > b) {
                return 1;
            }
            else if (a < b) {
                return -1;
            }
            else {
                continue;
            }
        }
        return 0;
    }
    ColumnSorts() {
        return Engine._ColumnSorts;
    }
    GetDisplayLabel() {
        let isSlave = this.PolyType == PolymorphismType.MultiModeSlave || this.PolyType == PolymorphismType.MultiConfigSlave;
        if (this.EngineName == "" || isSlave) {
            return `${this.ID}`;
        }
        else {
            return `${this.EngineName}`;
        }
    }
    UpdateEveryDisplay() {
        this.EditableFields.forEach(f => {
            f.RefreshDisplayElement();
        });
        ApplyEngineToInfoPanel(this);
    }
    IsSlave() {
        return (this.PolyType == PolymorphismType.MultiModeSlave ||
            this.PolyType == PolymorphismType.MultiConfigSlave);
    }
    IsMultiMode() {
        return (this.PolyType == PolymorphismType.MultiModeSlave ||
            this.PolyType == PolymorphismType.MultiModeMaster);
    }
    GetMass() {
        let targetEngine = (this.PolyType == PolymorphismType.MultiModeSlave) ? this.EngineList.find(x => x.ID == this.MasterEngineName) : this;
        targetEngine = targetEngine != undefined ? targetEngine : this;
        return targetEngine.Mass;
    }
    GetWidth() {
        if (this.PolyType == PolymorphismType.MultiConfigSlave || this.PolyType == PolymorphismType.MultiModeSlave) {
            return this.EngineList.find(x => x.ID == this.MasterEngineName).Width;
        }
        else {
            return this.Width;
        }
    }
    GetHeight() {
        if (this.PolyType == PolymorphismType.MultiConfigSlave || this.PolyType == PolymorphismType.MultiModeSlave) {
            return this.EngineList.find(x => x.ID == this.MasterEngineName).Height;
        }
        else {
            return this.Height;
        }
    }
    GetModelID() {
        if (this.PolyType == PolymorphismType.MultiConfigSlave || this.PolyType == PolymorphismType.MultiModeSlave) {
            return this.EngineList.find(x => x.ID == this.MasterEngineName).ModelID;
        }
        else {
            return this.ModelID;
        }
    }
    GetPlumeConfig() {
        let engine;
        if (this.PolyType == PolymorphismType.MultiConfigSlave || this.PolyType == PolymorphismType.MultiModeSlave) {
            engine = this.EngineList.find(x => x.ID == this.MasterEngineName);
        }
        else {
            engine = this;
        }
        let plumeInfo = PlumeInfo.GetPlumeInfo(this.PlumeID);
        let modelInfo = ModelInfo.GetModelInfo(engine.ModelID);
        let exhaustConfig = "";
        if (engine.UseExhaustEffect && modelInfo.Exhaust) {
            let exhaustBellWidth = modelInfo.Exhaust.exhaustBellWidth * engine.Width / (engine.UseBaseWidth ? modelInfo.OriginalBaseWidth : modelInfo.OriginalBellWidth);
            exhaustConfig = `
                @MODULE[ModuleEngine*] {
                    !GENERIC_PLUME[${PlumeInfo.GetPlumeInfo(this.ExhaustPlumeID).PlumeID}]{}
                    GENERIC_PLUME {
                        name = ${PlumeInfo.GetPlumeInfo(this.ExhaustPlumeID).PlumeID}
                        effectTransform = ${modelInfo.Exhaust.exhaustEffectTransform}
                        bellWidth = ${exhaustBellWidth}
                        verticalOffset = 0
                        volume = ${(this.ExhaustThrustPercent / 100) * this.Thrust / 100 + 1}
                        pitch = ${Math.max(Math.min(Math.log10(this.Thrust / 10 + 1) / 3, 2), 0.4)}
                    }
                }
            `;
        }
        let bellWidth = modelInfo.OriginalBellWidth * engine.Width / (engine.UseBaseWidth ? modelInfo.OriginalBaseWidth : modelInfo.OriginalBellWidth);
        let output = `
            @PART[GE-${engine.ID}]:FOR[zGenericPlumesPass0200] {
                @MODULE[ModuleEngine*] {
                    !GENERIC_PLUME[${plumeInfo.PlumeID}]{}
                    GENERIC_PLUME {
                        name = ${plumeInfo.PlumeID}
                        effectTransform = ${modelInfo.ThrustTransformName}
                        bellWidth = ${bellWidth}
                        verticalOffset = ${modelInfo.PlumePositionOffset + modelInfo.OriginalBellWidth * 0.33}
                        volume = ${this.Thrust / 100 + 1}
                        pitch = ${Math.max(Math.min(Math.log10(this.Thrust / 10 + 1) / 3, 2), 0.4)}
                    }
                }
                
                ${exhaustConfig}
                
            }
        `;
        return output;
    }
    GetHiddenObjectsConfig() {
        let modelInfo = ModelInfo.GetModelInfo(this.GetModelID());
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
        let modelInfo = ModelInfo.GetModelInfo(this.GetModelID());
        let heightScale = this.Height / modelInfo.OriginalHeight;
        let widthScale = this.Width / heightScale / (this.UseBaseWidth ? modelInfo.OriginalBaseWidth : modelInfo.OriginalBellWidth);
        let attachmentNode = (modelInfo.RadialAttachment ?
            `node_attach = ${modelInfo.RadialAttachmentPoint * widthScale}, 0.0, 0.0, 1.0, 0.0, 0.0` :
            `node_attach = 0.0, ${modelInfo.NodeStackTop}, 0.0, 0.0, 1.0, 0.0`);
        let deployableEnginesConfig = "";
        if (modelInfo.ExtendNozzleAnimation) {
            deployableEnginesConfig = `
                MODULE
                {
                    name = ModuleDeployableEngine
                    EngineAnimationName = ${modelInfo.ExtendNozzleAnimation}
                    WaitForAnimation = 0.9
                    Layer = ${Math.ceil(Math.random() * 2000000000)}
                }
            `;
        }
        let heatAnims = "";
        modelInfo.HeatAnimations.forEach(clip => {
            heatAnims += `
                MODULE
                {
                    name = FXModuleAnimateThrottle
                    animationName = ${clip}
                    responseSpeed = 0.001
                    dependOnEngineState = True
                    dependOnThrottle = True
                }
            `;
        });
        let lookAtConfig = "";
        if (modelInfo.LookatPairs.length > 0) {
            modelInfo.LookatPairs.forEach(pair => {
                lookAtConfig += `
                    CONSTRAINLOOKFX
                    {
                        targetName = ${pair[0]}
                        rotatorsName = ${pair[1]}
                    }
                `;
            });
            lookAtConfig = `
                MODULE
                {
                    name = FXModuleLookAtConstraint
                    ${lookAtConfig}
                }
            `;
        }
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
            
            ${heatAnims}
            
            ${lookAtConfig}
            
            ${deployableEnginesConfig}
            
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
    IsExhaustDefault() {
        let defaultConfig = new Engine();
        return (this.UseExhaustEffect == defaultConfig.UseExhaustEffect &&
            this.ExhaustPlumeID == defaultConfig.ExhaustPlumeID &&
            this.ExhaustThrustPercent == defaultConfig.ExhaustThrustPercent &&
            this.ExhaustIspPercent == defaultConfig.ExhaustIspPercent &&
            this.ExhaustGimbal == defaultConfig.ExhaustGimbal);
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
        let modelInfo = ModelInfo.GetModelInfo(this.GetModelID());
        let output = modelInfo.OriginalTankVolume;
        output *= (Math.pow((this.GetBaseWidth() / modelInfo.OriginalBaseWidth), 2));
        output *= this.Height / modelInfo.OriginalHeight;
        return output;
    }
    GetConstrainedTankContents() {
        let targetEngine = (this.PolyType == PolymorphismType.MultiModeSlave ||
            this.PolyType == PolymorphismType.MultiConfigSlave) ? this.EngineList.find(x => x.ID == this.MasterEngineName) : this;
        targetEngine = targetEngine != undefined ? targetEngine : this;
        let output = [];
        if (!targetEngine.LimitTanks) {
            targetEngine.TanksContents.forEach(v => {
                let currentVolume = output.findIndex(x => v[0] == x[0]);
                if (currentVolume == -1) {
                    output.push([v[0], v[1]]);
                }
                else {
                    output[currentVolume][1] += v[1];
                }
            });
        }
        else {
            let usedVolume = 0;
            targetEngine.TanksContents.forEach(v => {
                let thisVol = Math.min(v[1] / FuelInfo.GetFuelInfo(v[0]).TankUtilisation, targetEngine.TanksVolume - usedVolume);
                let currentVolume = output.findIndex(x => v[0] == x[0]);
                if (currentVolume == -1) {
                    output.push([v[0], thisVol * FuelInfo.GetFuelInfo(v[0]).TankUtilisation]);
                }
                else {
                    output[currentVolume][1] += thisVol * FuelInfo.GetFuelInfo(v[0]).TankUtilisation;
                }
                usedVolume += thisVol;
            });
        }
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
            this.EngineList.filter(x => x.ID != this.ID &&
                x.Active &&
                x.PolyType == PolymorphismType.MultiModeMaster).forEach(e => {
                let option = document.createElement("option");
                option.value = `${e.ID}`;
                option.text = e.ID;
                option.selected = e.ID == this.MasterEngineName;
                selects[1].options.add(option);
            });
        }
        else if (parseInt(selects[0].value) == PolymorphismType.MultiConfigSlave) {
            this.EngineList.filter(x => x.ID != this.ID &&
                x.Active &&
                x.PolyType == PolymorphismType.MultiConfigMaster).forEach(e => {
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
        let modelInfo = ModelInfo.GetModelInfo(this.GetModelID());
        let output = "";
        if (this.AdvancedGimbal) {
            output += `
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
            output += `
                MODULE
                {
                    name = ModuleGimbal
                    gimbalTransformName = ${modelInfo.GimbalTransformName}
                    useGimbalResponseSpeed = false
                    gimbalRange = ${this.Gimbal}
                }
            `;
        }
        if (this.UseExhaustEffect && modelInfo.Exhaust) {
            output += `
                MODULE
                {
                    name = ModuleGimbal
                    gimbalTransformName = ${modelInfo.Exhaust.exhaustGimbalTransform}
                    useGimbalResponseSpeed = false
                    gimbalRange = ${this.ExhaustGimbal}
                    enableYaw = ${!this.ExhaustGimbalOnlyRoll}
                    enablePitch = ${!this.ExhaustGimbalOnlyRoll}
                }
            `;
        }
        return output;
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
    GetEngineMassFlow() {
        let massFlow = this.VacIsp;
        massFlow *= 9.8066;
        massFlow = 1 / massFlow;
        massFlow *= this.Thrust;
        let propellantMassRatios = [];
        let electricRatio = this.FuelRatioItems.find(x => x[0] == Fuel.ElectricCharge);
        let electric = electricRatio ? electricRatio[1] : null;
        if (this.FuelVolumeRatios) {
            this.FuelRatioItems.forEach(([fuel, ratio]) => {
                propellantMassRatios.push([fuel, ratio * FuelInfo.GetFuelInfo(fuel).Density]);
            });
        }
        else {
            propellantMassRatios = this.FuelRatioItems;
        }
        let overallRatio = 0;
        propellantMassRatios.forEach(([fuel, ratio]) => {
            if (fuel == Fuel.ElectricCharge) {
                return;
            }
            overallRatio += ratio;
        });
        let output = [];
        propellantMassRatios.forEach(([fuel, ratio]) => {
            if (fuel == Fuel.ElectricCharge) {
                return;
            }
            output.push([fuel, massFlow * ratio / overallRatio]);
        });
        if (electric) {
            output.push([Fuel.ElectricCharge, electric]);
        }
        return output;
    }
    GetEngineBurnTime() {
        let output = [];
        const thrustCurveMultiplier = this.GetThrustCurveBurnTimeMultiplier();
        let tankContents = this.GetConstrainedTankContents();
        let massFlow = this.GetEngineMassFlow();
        massFlow.forEach(fuel => {
            let fuelReserves = tankContents.find(x => x[0] == fuel[0]);
            let fuelMass = fuelReserves ? fuelReserves[1] * FuelInfo.GetFuelInfo(fuelReserves[0]).Density : 0;
            output.push([
                fuel[0],
                thrustCurveMultiplier * fuelMass / fuel[1]
            ]);
        });
        return output;
    }
    GetThrustCurveBurnTimeMultiplier() {
        if (this.ThrustCurve.length == 0) {
            return 1;
        }
        if (this.ThrustCurve.length == 1) {
            return 100 / this.ThrustCurve[0][1];
        }
        let curve = this.ThrustCurve.sort((a, b) => b[0] - a[0]);
        let ranges = [];
        let previousFuelPoint = 100;
        let previousThrustPoint = curve[0][1];
        curve.forEach(point => {
            if (point[0] == 100) {
                return;
            }
            let a;
            let b;
            if (point[1] - previousThrustPoint == 0) {
                a = Infinity;
                b = previousThrustPoint / 100;
            }
            else {
                a = (previousFuelPoint - point[0]) / (previousThrustPoint - point[1]);
                b = (point[1] - point[0] * (1 / a)) / 100;
            }
            ranges.push([
                point[0] / 100,
                previousFuelPoint / 100,
                a,
                b
            ]);
            previousFuelPoint = point[0];
            previousThrustPoint = point[1];
        });
        let lastPoint = curve[curve.length - 1];
        if (lastPoint[0] != 100) {
            ranges.push([
                0,
                lastPoint[0] / 100,
                Infinity,
                lastPoint[1] / 100
            ]);
        }
        const antiderivative = (x, a, b) => {
            if (a == Infinity) {
                return x / b;
            }
            else {
                return a * Math.log(Math.abs(x + a * b));
            }
        };
        let output = 0;
        ranges.forEach(range => {
            if (range[0] != range[1]) {
                output += antiderivative(range[1], range[2], range[3]) - antiderivative(range[0], range[2], range[3]);
            }
        });
        return output;
    }
    GetBaseWidth() {
        if (this.UseBaseWidth) {
            return this.Width;
        }
        else {
            let modelInfo = ModelInfo.GetModelInfo(this.GetModelID());
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
    OnTableDraw(rowElements) {
        this.ListCols = rowElements;
        this.RehidePolyFields(rowElements);
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
            let modelInfo = ModelInfo.GetModelInfo(this.GetModelID());
            if (modelInfo.Exhaust && this.UseExhaustEffect) {
                return `
                    MODULE
                    {
                        name = ModuleEngineConfigs
                        configuration = GE-${this.ID}
                        modded = false
                        origMass = ${this.Mass}
                        moduleIndex = 0
                        
                        ${this.GetEngineConfig(allEngines)}
                        
                    }
                    
                    MODULE
                    {
                        name = ModuleEngineConfigs
                        configuration = GE-${this.ID}-vernier
                        modded = false
                        origMass = ${this.Mass}
                        moduleIndex = 1
                        
                        ${this.GetExhaustConfig(allEngines)}
                        
                    }
                `;
            }
            else {
                return `
                    MODULE
                    {
                        name = ModuleEngineConfigs
                        configuration = GE-${this.ID}
                        modded = false
                        origMass = ${this.Mass}
                        moduleIndex = 0
                        
                        ${this.GetEngineConfig(allEngines)}
                        
                    }
                `;
            }
        }
    }
    GetEngineConfig(allEngines) {
        let masterEngine;
        if (this.PolyType == PolymorphismType.MultiConfigSlave || this.PolyType == PolymorphismType.MultiModeSlave) {
            masterEngine = this.EngineList.find(x => x.ID == this.MasterEngineName);
        }
        else {
            masterEngine = this;
        }
        let modelInfo = ModelInfo.GetModelInfo(masterEngine.GetModelID());
        let hasExhaust = !!(modelInfo.Exhaust && masterEngine.UseExhaustEffect);
        return `
            CONFIG
            {
                name = GE-${this.ID}
                description = ${this.EngineDescription}
                maxThrust = ${(hasExhaust ? 1 - (this.ExhaustThrustPercent / 100) : 1) * this.Thrust}
                minThrust = ${(hasExhaust ? 1 - (this.ExhaustThrustPercent / 100) : 1) * this.Thrust * this.MinThrust / 100}
                %powerEffectName = ${PlumeInfo.GetPlumeInfo(this.PlumeID).PlumeEffectName}
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
    GetExhaustConfig(allEngines) {
        return `
            CONFIG
            {
                name = GE-${this.ID}-vernier
                description = ${this.EngineDescription}
                maxThrust = ${(this.ExhaustThrustPercent / 100) * this.Thrust}
                minThrust = ${(this.ExhaustThrustPercent / 100) * this.Thrust * this.MinThrust / 100}
                %powerEffectName = ${PlumeInfo.GetPlumeInfo(this.ExhaustPlumeID).PlumeEffectName}
                heatProduction = 100
                massMult = 1
                %techRequired = ${TechNode[this.TechUnlockNode]}
                cost = 0
                
                ${this.GetPropellantConfig()}
                
                atmosphereCurve
                {
                    key = 0 ${(this.ExhaustIspPercent / 100) * this.VacIsp}
                    key = 1 ${(this.ExhaustIspPercent / 100) * this.AtmIsp}
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
        DefaultWidth: 300,
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
        DefaultWidth: 420,
        DisplayFlags: 0b10100
    }, ThrustCurve: {
        Name: "Thrust curve",
        DefaultWidth: 200,
        DisplayFlags: 0b00000
    }, Spacer: {
        Name: "",
        DefaultWidth: 300,
        DisplayFlags: 0b00000
    }
};
Engine._ColumnSorts = {
    Active: (a, b) => Engine.RegularSort(a.Active, b.Active, a.ID, b.ID),
    ID: (a, b) => Engine.RegularSort(a.ID, b.ID),
    Labels: (a, b) => Engine.RegularSort(a.PolyType == PolymorphismType.MultiModeSlave, b.PolyType == PolymorphismType.MultiModeSlave, a.GetDisplayLabel(), b.GetDisplayLabel(), a.ID, b.ID), EngineVariant: (a, b) => Engine.RegularSort(a.IsSlave(), b.IsSlave(), a.EngineVariant, b.EngineVariant, a.ID, b.ID), Mass: (a, b) => Engine.RegularSort(a.GetMass(), b.GetMass(), a.ID, b.ID),
    Thrust: (a, b) => Engine.RegularSort(a.Thrust, b.Thrust, a.ID, b.ID),
    MinThrust: (a, b) => Engine.RegularSort(a.MinThrust, b.MinThrust, a.ID, b.ID),
    AtmIsp: (a, b) => Engine.RegularSort(a.AtmIsp, b.AtmIsp, a.ID, b.ID),
    VacIsp: (a, b) => Engine.RegularSort(a.VacIsp, b.VacIsp, a.ID, b.ID),
    PressureFed: (a, b) => Engine.RegularSort(a.PressureFed, b.PressureFed, a.ID, b.ID),
    NeedsUllage: (a, b) => Engine.RegularSort(a.NeedsUllage, b.NeedsUllage, a.ID, b.ID),
    TechUnlockNode: (a, b) => Engine.RegularSort(a.PolyType == PolymorphismType.MultiModeSlave, b.PolyType == PolymorphismType.MultiModeSlave, a.TechUnlockNode, b.TechUnlockNode, a.ID, b.ID), EntryCost: (a, b) => Engine.RegularSort(a.PolyType == PolymorphismType.MultiModeSlave, b.PolyType == PolymorphismType.MultiModeSlave, a.EntryCost, b.EntryCost, a.ID, b.ID), Cost: (a, b) => Engine.RegularSort(a.PolyType == PolymorphismType.MultiModeSlave, b.PolyType == PolymorphismType.MultiModeSlave, a.Cost, b.Cost, a.ID, b.ID), AlternatorPower: (a, b) => Engine.RegularSort(a.IsSlave(), b.IsSlave(), a.AlternatorPower, b.AlternatorPower, a.ID, b.ID), ThrustCurve: (a, b) => Engine.RegularSort(a.ThrustCurve.length, b.ThrustCurve.length, a.ID, b.ID),
    Polymorphism: (a, b) => {
        let output = Engine.RegularSort(a.PolyType, b.PolyType);
        if (output) {
            return output;
        }
        if (a.PolyType == PolymorphismType.MultiModeSlave ||
            a.PolyType == PolymorphismType.MultiConfigSlave) {
            output = Engine.RegularSort(a.MasterEngineName, b.MasterEngineName);
            if (output) {
                return output;
            }
        }
        return Engine.RegularSort(a.ID, b.ID);
    }, FuelRatios: (a, b) => {
        let output = Engine.RegularSort(a.FuelRatioItems.length, b.FuelRatioItems.length);
        if (output) {
            return output;
        }
        for (let i = 0; i < a.FuelRatioItems.length; ++i) {
            output = Engine.RegularSort(a.FuelRatioItems[i][0], b.FuelRatioItems[i][0]);
            if (output) {
                return output;
            }
        }
        return Engine.RegularSort(a.ID, b.ID);
    }, Ignitions: (a, b) => Engine.RegularSort(a.IsMultiMode(), b.IsMultiMode(), a.Ignitions <= 0 ? 999999999 : a.Ignitions, b.Ignitions <= 0 ? 999999999 : b.Ignitions, a.ID, b.ID), Visuals: (a, b) => Engine.RegularSort(a.GetModelID(), b.GetModelID(), a.PlumeID, b.PlumeID, a.ID, b.ID), Dimensions: (a, b) => Engine.RegularSort(a.GetWidth(), b.GetWidth(), a.GetHeight(), b.GetHeight(), a.ID, b.ID), Gimbal: (a, b) => {
        let output = Engine.RegularSort(a.IsSlave(), b.IsSlave());
        if (output) {
            return output;
        }
        output = Engine.RegularSort(a.AdvancedGimbal, b.AdvancedGimbal);
        if (output) {
            return output;
        }
        if (a.AdvancedGimbal) {
            let output = Engine.RegularSort(a.GimbalNX + a.GimbalNY + a.GimbalPX + a.GimbalPY, b.GimbalNX + b.GimbalNY + b.GimbalPX + b.GimbalPY);
            if (output) {
                return output;
            }
        }
        else {
            let output = Engine.RegularSort(a.Gimbal, b.Gimbal);
            if (output) {
                return output;
            }
        }
        return Engine.RegularSort(a.ID, b.ID);
    }, TestFlight: (a, b) => {
        let output = Engine.RegularSort(a.IsMultiMode(), b.IsMultiMode());
        if (output) {
            return output;
        }
        output = Engine.RegularSort(a.EnableTestFlight, b.EnableTestFlight);
        if (output) {
            return output;
        }
        if (a.EnableTestFlight) {
            output = Engine.RegularSort(a.RatedBurnTime / (1 - a.CycleReliability10k / 100), b.RatedBurnTime / (1 - b.CycleReliability10k / 100));
            if (output) {
                return output;
            }
        }
        return Engine.RegularSort(a.ID, b.ID);
    }, Tank: (a, b) => {
        let output = Engine.RegularSort(a.IsSlave(), b.IsSlave());
        if (output) {
            return output;
        }
        output = Engine.RegularSort(a.UseTanks, b.UseTanks);
        if (output) {
            return output;
        }
        if (a.UseTanks) {
            let aVolume = 0;
            let bVolume = 0;
            a.GetConstrainedTankContents().forEach(r => {
                aVolume += r[1];
            });
            b.GetConstrainedTankContents().forEach(r => {
                bVolume += r[1];
            });
            output = Engine.RegularSort(aVolume, bVolume);
            if (output) {
                return output;
            }
        }
        return Engine.RegularSort(a.ID, b.ID);
    },
};
Engine.PolymorphismTypeDropdown = Engine.BuildPolymorphismTypeDropdown();
var EngineEditableFieldMetadata;
(function (EngineEditableFieldMetadata) {
    EngineEditableFieldMetadata.AlternatorPower = {
        ApplyValueToDisplayElement: (e, engine) => {
            e.innerHTML = Unit.Display(engine.AlternatorPower, "kW", Settings.classic_unit_display, 9);
        }, ApplyValueToEditElement: (e, engine) => {
            e.value = Unit.Display(engine.AlternatorPower, "kW", Settings.classic_unit_display);
        }, ApplyChangesToValue: (e, engine) => {
            engine.AlternatorPower = Unit.Parse(e.value, "kW");
        }
    };
})(EngineEditableFieldMetadata || (EngineEditableFieldMetadata = {}));
var EngineEditableFieldMetadata;
(function (EngineEditableFieldMetadata) {
    EngineEditableFieldMetadata.AtmIsp = {
        ApplyValueToDisplayElement: (e, engine) => {
            e.innerHTML = Unit.Display(engine.AtmIsp, "s", true);
        }, ApplyValueToEditElement: (e, engine) => {
            e.value = Unit.Display(engine.AtmIsp, "s", true);
        }, ApplyChangesToValue: (e, engine) => {
            engine.AtmIsp = Unit.Parse(e.value, "s");
        }
    };
})(EngineEditableFieldMetadata || (EngineEditableFieldMetadata = {}));
var EngineEditableFieldMetadata;
(function (EngineEditableFieldMetadata) {
    EngineEditableFieldMetadata.Cost = {
        ApplyValueToDisplayElement: (e, engine) => {
            e.innerHTML = Unit.Display(engine.Cost, " VF", Settings.classic_unit_display);
        }, ApplyValueToEditElement: (e, engine) => {
            e.value = Unit.Display(engine.Cost, " VF", Settings.classic_unit_display);
        }, ApplyChangesToValue: (e, engine) => {
            engine.Cost = Unit.Parse(e.value, " VF");
        }
    };
})(EngineEditableFieldMetadata || (EngineEditableFieldMetadata = {}));
var EngineEditableFieldMetadata;
(function (EngineEditableFieldMetadata) {
    EngineEditableFieldMetadata.Dimensions = {
        GetDisplayElement: () => {
            let tmp = document.createElement("div");
            tmp.classList.add("content-cell-content");
            return tmp;
        }, ApplyValueToDisplayElement: (e, engine) => {
            e.innerHTML = `↔${Unit.Display(engine.Width, "m", false, 9)} x ↕${Unit.Display(engine.Height, "m", false, 9)}`;
        }, GetEditElement: () => {
            let tmp = document.createElement("div");
            tmp.classList.add("content-cell-content");
            tmp.style.height = "76px";
            tmp.style.padding = "0";
            let grid = document.createElement("div");
            grid.style.display = "grid";
            grid.style.gridTemplateColumns = "62px auto 2px 24px 2px";
            grid.style.gridTemplateRows = "24px 24px 2px 24px";
            grid.style.gridTemplateAreas = `
                "a a a a z"
                "b c c c z"
                "x x x x x"
                "e f q g y"
            `;
            grid.innerHTML = `
                <div class="content-cell-content" style="grid-area: a;"></div>
                <div class="content-cell-content" style="grid-area: b;">Width</div>
                <div style="grid-area: c;"><input style="width: calc(100%);"></div>
                <div class="content-cell-content" style="grid-area: e;">Height</div>
                <div style="grid-area: f;"><input style="width: calc(100%);"></div>
                <div style="grid-area: g;"><img class="option-button stretch" title="Set height matching the width and model" src="img/button/aspectRatio.png"></div>
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
        }, ApplyValueToEditElement: (e, engine) => {
            let inputs = e.querySelectorAll("input");
            inputs[0].checked = engine.UseBaseWidth;
            inputs[1].value = Unit.Display(engine.Width, "m", false);
            inputs[2].value = Unit.Display(engine.Height, "m", false);
            e.querySelector("img").onclick = () => {
                let modelInfo = ModelInfo.GetModelInfo(engine.GetModelID());
                inputs[2].value = Unit.Display(Unit.Parse(inputs[1].value, "m") * modelInfo.OriginalHeight / (inputs[0].checked ? modelInfo.OriginalBaseWidth : modelInfo.OriginalBellWidth), "m", false, 3);
            };
            e.querySelector("span").innerHTML = inputs[0].checked ? "Base width" : "Bell width";
        }, ApplyChangesToValue: (e, engine) => {
            let inputs = e.querySelectorAll("input");
            engine.UseBaseWidth = inputs[0].checked;
            engine.Width = Unit.Parse(inputs[1].value, "m");
            engine.Height = Unit.Parse(inputs[2].value, "m");
        }
    };
})(EngineEditableFieldMetadata || (EngineEditableFieldMetadata = {}));
var EngineEditableFieldMetadata;
(function (EngineEditableFieldMetadata) {
    EngineEditableFieldMetadata.EngineVariant = {
        ApplyValueToDisplayElement: (e, engine) => {
            e.innerHTML = EngineType[engine.EngineVariant];
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
    };
})(EngineEditableFieldMetadata || (EngineEditableFieldMetadata = {}));
var EngineEditableFieldMetadata;
(function (EngineEditableFieldMetadata) {
    EngineEditableFieldMetadata.EntryCost = {
        ApplyValueToDisplayElement: (e, engine) => {
            e.innerHTML = Unit.Display(engine.EntryCost, " VF", Settings.classic_unit_display);
        }, ApplyValueToEditElement: (e, engine) => {
            e.value = Unit.Display(engine.EntryCost, " VF", Settings.classic_unit_display);
        }, ApplyChangesToValue: (e, engine) => {
            engine.EntryCost = Unit.Parse(e.value, " VF");
        }
    };
})(EngineEditableFieldMetadata || (EngineEditableFieldMetadata = {}));
var EngineEditableFieldMetadata;
(function (EngineEditableFieldMetadata) {
    EngineEditableFieldMetadata.FuelRatios = {
        GetDisplayElement: () => {
            let tmp = document.createElement("div");
            tmp.classList.add("content-cell-content");
            return tmp;
        }, ApplyValueToDisplayElement: (e, engine) => {
            let fuels = [];
            let electric = 0;
            let output = "";
            engine.FuelRatioItems.forEach(v => {
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
                output += ` | Electric: ${Unit.Display(electric, "kW", Settings.classic_unit_display, 9)}`;
            }
            e.innerHTML = output;
        }, GetEditElement: () => {
            let tmp = document.createElement("div");
            tmp.classList.add("content-cell-content");
            tmp.style.height = "126px";
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
        }, ApplyValueToEditElement: (e, engine) => {
            e.querySelector(`input[type="checkbox"]`).checked = engine.FuelVolumeRatios;
            let table = e.querySelector("tbody");
            let rows = e.querySelectorAll("tr");
            rows.forEach((v, i) => {
                if (i != 0) {
                    v.remove();
                }
            });
            engine.FuelRatioItems.forEach(v => {
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
            e.querySelector("span").innerHTML = engine.FuelVolumeRatios ? "Volume ratio" : "Mass ratio";
        }, ApplyChangesToValue: (e, engine) => {
            let selects = e.querySelectorAll("select");
            let inputs = e.querySelectorAll(`input`);
            engine.FuelVolumeRatios = inputs[0].checked;
            if (selects.length + 1 != inputs.length) {
                console.warn("table misaligned?");
            }
            engine.FuelRatioItems = [];
            for (let i = 0; i < selects.length; ++i) {
                engine.FuelRatioItems.push([parseInt(selects[i].value), parseFloat(inputs[i + 1].value.replace(",", "."))]);
            }
        }
    };
})(EngineEditableFieldMetadata || (EngineEditableFieldMetadata = {}));
var EngineEditableFieldMetadata;
(function (EngineEditableFieldMetadata) {
    EngineEditableFieldMetadata.Gimbal = {
        GetDisplayElement: () => {
            let tmp = document.createElement("div");
            tmp.classList.add("content-cell-content");
            return tmp;
        }, ApplyValueToDisplayElement: (e, engine) => {
            if (engine.AdvancedGimbal) {
                e.innerHTML = `X:<-${engine.GimbalNX}°:${engine.GimbalPX}°>, Y:<-${engine.GimbalNY}°:${engine.GimbalPY}°>`;
            }
            else {
                e.innerHTML = `${engine.Gimbal}°`;
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
        }, ApplyValueToEditElement: (e, engine) => {
            e.querySelector(`input[data-ref="checkbox"]`).checked = engine.AdvancedGimbal;
            e.querySelector(`input[data-ref="gimbal"]`).value = engine.Gimbal.toString();
            e.querySelector(`input[data-ref="gimbalnx"]`).value = engine.GimbalNX.toString();
            e.querySelector(`input[data-ref="gimbalpx"]`).value = engine.GimbalPX.toString();
            e.querySelector(`input[data-ref="gimbalny"]`).value = engine.GimbalNY.toString();
            e.querySelector(`input[data-ref="gimbalpy"]`).value = engine.GimbalPY.toString();
            if (engine.AdvancedGimbal) {
                e.querySelector(`div[data-ref="basediv"]`).style.display = "none";
                e.querySelector(`div[data-ref="advdiv"]`).style.display = "grid";
            }
            else {
                e.querySelector(`div[data-ref="basediv"]`).style.display = "grid";
                e.querySelector(`div[data-ref="advdiv"]`).style.display = "none";
            }
        }, ApplyChangesToValue: (e, engine) => {
            engine.AdvancedGimbal = e.querySelector(`input[data-ref="checkbox"]`).checked;
            engine.Gimbal = parseFloat(e.querySelector(`input[data-ref="gimbal"]`).value.replace(",", "."));
            engine.GimbalPX = parseFloat(e.querySelector(`input[data-ref="gimbalpx"]`).value.replace(",", "."));
            engine.GimbalNY = parseFloat(e.querySelector(`input[data-ref="gimbalny"]`).value.replace(",", "."));
            engine.GimbalPY = parseFloat(e.querySelector(`input[data-ref="gimbalpy"]`).value.replace(",", "."));
            engine.GimbalNX = parseFloat(e.querySelector(`input[data-ref="gimbalnx"]`).value.replace(",", "."));
        }
    };
})(EngineEditableFieldMetadata || (EngineEditableFieldMetadata = {}));
var EngineEditableFieldMetadata;
(function (EngineEditableFieldMetadata) {
    EngineEditableFieldMetadata.ID = {
        ApplyChangesToValue: (e, engine) => {
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
            engine.ID = output;
        }
    };
})(EngineEditableFieldMetadata || (EngineEditableFieldMetadata = {}));
var EngineEditableFieldMetadata;
(function (EngineEditableFieldMetadata) {
    EngineEditableFieldMetadata.Ignitions = {
        ApplyValueToDisplayElement: (e, engine) => {
            e.innerHTML = engine.Ignitions <= 0 ? "Infinite" : engine.Ignitions.toString();
        }, ApplyChangesToValue: (e, engine) => {
            engine.Ignitions = parseInt(e.value);
        }
    };
})(EngineEditableFieldMetadata || (EngineEditableFieldMetadata = {}));
var EngineEditableFieldMetadata;
(function (EngineEditableFieldMetadata) {
    EngineEditableFieldMetadata.Labels = {
        GetDisplayElement: () => {
            let tmp = document.createElement("div");
            tmp.classList.add("content-cell-content");
            return tmp;
        }, ApplyValueToDisplayElement: (e, engine) => {
            e.innerHTML = engine.GetDisplayLabel();
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
                <div style="grid-area: f;"><textarea style="resize: none; width: calc(100% - 6px); height: calc(100% - 3px);"></textarea></div>
            `;
            tmp.appendChild(grid);
            return tmp;
        }, ApplyValueToEditElement: (e, engine) => {
            let inputs = e.querySelectorAll("input");
            inputs[0].value = engine.EngineName;
            inputs[1].value = engine.EngineManufacturer;
            inputs[0].disabled = engine.PolyType == PolymorphismType.MultiConfigSlave;
            inputs[1].disabled = engine.PolyType == PolymorphismType.MultiConfigSlave;
            e.querySelector("textarea").value = engine.EngineDescription;
        }, ApplyChangesToValue: (e, engine) => {
            let inputs = e.querySelectorAll("input");
            engine.EngineName = inputs[0].value;
            engine.EngineManufacturer = inputs[1].value;
            engine.EngineDescription = e.querySelector("textarea").value;
        }
    };
})(EngineEditableFieldMetadata || (EngineEditableFieldMetadata = {}));
var EngineEditableFieldMetadata;
(function (EngineEditableFieldMetadata) {
    EngineEditableFieldMetadata.Mass = {
        ApplyValueToDisplayElement: (e, engine) => {
            e.innerHTML = Unit.Display(engine.Mass, "t", Settings.classic_unit_display, 9);
        }, ApplyValueToEditElement: (e, engine) => {
            e.value = Unit.Display(engine.Mass, "t", Settings.classic_unit_display);
        }, ApplyChangesToValue: (e, engine) => {
            engine.Mass = Unit.Parse(e.value, "t");
        }
    };
})(EngineEditableFieldMetadata || (EngineEditableFieldMetadata = {}));
var EngineEditableFieldMetadata;
(function (EngineEditableFieldMetadata) {
    EngineEditableFieldMetadata.MinThrust = {
        ApplyValueToDisplayElement: (e, engine) => {
            e.innerHTML = `${engine.MinThrust}%`;
        }
    };
})(EngineEditableFieldMetadata || (EngineEditableFieldMetadata = {}));
var EngineEditableFieldMetadata;
(function (EngineEditableFieldMetadata) {
    EngineEditableFieldMetadata.Polymorphism = {
        GetDisplayElement: () => {
            let tmp = document.createElement("div");
            tmp.classList.add("content-cell-content");
            return tmp;
        }, ApplyValueToDisplayElement: (e, engine) => {
            switch (engine.PolyType) {
                case PolymorphismType.Single:
                    e.innerHTML = `Single`;
                    break;
                case PolymorphismType.MultiModeMaster:
                    e.innerHTML = `Multimode master`;
                    break;
                case PolymorphismType.MultiModeSlave:
                    e.innerHTML = `Multimode slave to ${engine.MasterEngineName}`;
                    break;
                case PolymorphismType.MultiConfigMaster:
                    e.innerHTML = `Multiconfig master`;
                    break;
                case PolymorphismType.MultiConfigSlave:
                    e.innerHTML = `Multiconfig slave to ${engine.MasterEngineName}`;
                    break;
            }
        }, GetEditElement: () => {
            let tmp = document.createElement("div");
            tmp.classList.add("content-cell-content");
            tmp.style.height = "46px";
            tmp.style.padding = "0";
            let grid = document.createElement("div");
            grid.style.display = "grid";
            grid.style.gridTemplateColumns = "auto";
            grid.style.gridTemplateRows = "23px 23px";
            grid.style.gridTemplateAreas = `
                "a"
                "b"
            `;
            grid.innerHTML = `
                <div style="grid-area: a;">${Engine.PolymorphismTypeDropdown.outerHTML}</div>
                <div style="grid-area: b;"><select></select></div>
            `;
            tmp.appendChild(grid);
            return tmp;
        }, ApplyValueToEditElement: (e, engine) => {
            let selects = e.querySelectorAll("select");
            selects[0].onchange = () => {
                engine.RebuildMasterSelect(e);
            };
            selects[0].value = engine.PolyType.toString();
            engine.RebuildMasterSelect(e);
        }, ApplyChangesToValue: (e, engine) => {
            let selects = e.querySelectorAll("select");
            engine.PolyType = parseInt(selects[0].value);
            engine.MasterEngineName = selects[1].value;
            engine.RehidePolyFields(engine.ListCols);
        }
    };
})(EngineEditableFieldMetadata || (EngineEditableFieldMetadata = {}));
var EngineEditableFieldMetadata;
(function (EngineEditableFieldMetadata) {
    EngineEditableFieldMetadata.Spacer = {
        GetDisplayElement: () => {
            let tmp = document.createElement("div");
            tmp.classList.add("content-cell-content");
            return tmp;
        }
    };
})(EngineEditableFieldMetadata || (EngineEditableFieldMetadata = {}));
var EngineEditableFieldMetadata;
(function (EngineEditableFieldMetadata) {
    EngineEditableFieldMetadata.Tank = {
        GetDisplayElement: () => {
            let tmp = document.createElement("div");
            tmp.classList.add("content-cell-content");
            return tmp;
        }, ApplyValueToDisplayElement: (e, engine) => {
            let output = "";
            if (engine.UseTanks) {
                if (engine.LimitTanks) {
                    if (engine.TanksVolume == 0) {
                        output = "Enabled, but empty";
                    }
                    else {
                        let usedVolume = 0;
                        engine.TanksContents.forEach(v => {
                            usedVolume += v[1] / FuelInfo.GetFuelInfo(v[0]).TankUtilisation;
                        });
                        usedVolume = Math.min(usedVolume, engine.TanksVolume);
                        output = `Enabled, ${Unit.Display(usedVolume, "L", Settings.classic_unit_display, 3)}/${Unit.Display(engine.TanksVolume, "L", Settings.classic_unit_display, 3)}`;
                    }
                }
                else {
                    if (engine.TanksContents.length == 0) {
                        output = "Enabled, but empty";
                    }
                    else {
                        let usedVolume = 0;
                        engine.TanksContents.forEach(v => {
                            usedVolume += v[1] / FuelInfo.GetFuelInfo(v[0]).TankUtilisation;
                        });
                        output = `Enabled, ${Unit.Display(usedVolume, "L", Settings.classic_unit_display, 3)}`;
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
            tmp.style.height = "222px";
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
                
                <div class="content-cell-content" style="grid-area: d"><input style="position: relative; top: -1px; left: -1px;" class="abbr" title="Enable tank volume restriction" type="checkbox"></div>
                <div style="grid-area: e; padding-top: 1px;"><input style="width: calc(100%);"></div>
                
                <div class="content-cell-content" style="grid-area:f; padding-top: 4px;">Estimated tank volume: <span></span></div>
                
                <div style="grid-area: g;"><img class="mini-button option-button" title="Add new propellant to the list" src="img/button/add-mini.png"></div>
                <div style="grid-area: h;"><img class="mini-button option-button" title="Remove last propellant from list" src="img/button/remove-mini.png"></div>
                <div class="content-cell-content" style="grid-area: j; overflow: auto; white-space: unset;">
                    <table>
                        <tr>
                            <th style="width: 25%;">Fuel</th>
                            <th style="width: 25%;">Volume</th>
                            <th style="width: 25%;">Mass</th>
                            <th class="abbr" title="Engine burn time using only the in-part tank and full throttle" style="width: 25%;">Time</th>
                        </tr>
                    </table>
                </div>
            `;
            let inputs = grid.querySelectorAll("input");
            inputs[0].addEventListener("change", () => {
                inputs[1].disabled = !inputs[0].checked;
            });
            let imgs = grid.querySelectorAll("img");
            imgs[1].addEventListener("click", () => {
                let tmp = grid.querySelectorAll("tr");
                if (tmp.length > 1) {
                    tmp[tmp.length - 1].remove();
                }
            });
            tmp.appendChild(grid);
            return tmp;
        }, ApplyValueToEditElement: (e, engine) => {
            const addRow = (tableElement, v) => {
                let thisRawMassFlow = massFlow.find(x => v[0] == x[0]);
                let fuelInfo = FuelInfo.GetFuelInfo(v[0]);
                let thisMassFlow = thisRawMassFlow ? thisRawMassFlow[1] / thrustCurveMultiplier : 0;
                let thisBurnTime = thisRawMassFlow ? ((v[1] * fuelInfo.Density) / thisRawMassFlow[1]) * thrustCurveMultiplier : 0;
                let tr = document.createElement("tr");
                let select = FuelInfo.Dropdown.cloneNode(true);
                select.querySelector(`option[value="${v[0]}"]`).selected = true;
                tr.innerHTML = `
                    <td></td>
                    <td><input style="width: calc(100%);" value="${Unit.Display(v[1], "L", Settings.classic_unit_display, 3)}"></td>
                    <td><input style="width: calc(100%);" value="${Unit.Display(v[1] * fuelInfo.Density, "t", Settings.classic_unit_display, 3)}"></td>
                    <td><input style="width: calc(100%);" ${thisBurnTime == 0 ? "disabled" : ""} value="${Unit.Display(thisBurnTime, "s", true, 3)}"></td>
                `;
                let inputs = tr.querySelectorAll("input");
                select.addEventListener("change", () => {
                    let newFuel = parseInt(select.value);
                    inputs[1].value = Unit.Display(Unit.Parse(inputs[0].value, "L") * FuelInfo.GetFuelInfo(newFuel).Density, "t", Settings.classic_unit_display, 3);
                    thisRawMassFlow = massFlow.find(x => newFuel == x[0]);
                    fuelInfo = FuelInfo.GetFuelInfo(newFuel);
                    thisMassFlow = thisRawMassFlow ? thisRawMassFlow[1] / thrustCurveMultiplier : 0;
                    thisBurnTime = thisRawMassFlow ? ((parseFloat(inputs[0].value) * fuelInfo.Density) / thisRawMassFlow[1]) * thrustCurveMultiplier : 0;
                    inputs[2].disabled = thisBurnTime == 0;
                    newVolume();
                });
                const newVolume = () => {
                    inputs[1].value = Unit.Display(Unit.Parse(inputs[0].value, "L") * FuelInfo.GetFuelInfo(parseInt(select.value)).Density, "t", Settings.classic_unit_display, 3);
                    if (!inputs[2].disabled) {
                        inputs[2].value = Unit.Display((Unit.Parse(inputs[0].value, "L") * FuelInfo.GetFuelInfo(parseInt(select.value)).Density) / thisMassFlow, "s", true, 3);
                    }
                    else {
                        inputs[2].value = Unit.Display(0, "s", true, 3);
                    }
                };
                const newMass = () => {
                    inputs[0].value = Unit.Display(Unit.Parse(inputs[1].value, "t") / FuelInfo.GetFuelInfo(parseInt(select.value)).Density, "L", Settings.classic_unit_display, 3);
                    if (!inputs[2].disabled) {
                        inputs[2].value = Unit.Display(Unit.Parse(inputs[1].value, "t") / thisMassFlow, "s", true, 3);
                    }
                };
                const newTime = () => {
                    inputs[0].value = Unit.Display((Unit.Parse(inputs[2].value, "s") * thisMassFlow) / FuelInfo.GetFuelInfo(parseInt(select.value)).Density, "L", Settings.classic_unit_display, 3);
                    inputs[1].value = Unit.Display(Unit.Parse(inputs[2].value, "s") * thisMassFlow, "t", Settings.classic_unit_display, 3);
                };
                inputs[0].addEventListener("keydown", (e) => {
                    setTimeout(() => {
                        newVolume();
                    }, 20);
                });
                inputs[1].addEventListener("keydown", (e) => {
                    setTimeout(() => {
                        newMass();
                    }, 20);
                });
                inputs[2].addEventListener("keydown", (e) => {
                    setTimeout(() => {
                        newTime();
                    }, 20);
                });
                tr.children[0].appendChild(select);
                tableElement.appendChild(tr);
            };
            let allInputs = e.querySelectorAll(`input`);
            let addElementButton = e.querySelector("img");
            addElementButton.onclick = () => {
                addRow(table, [Fuel.Hydrazine, 1]);
            };
            let massFlow = engine.GetEngineMassFlow();
            let thrustCurveMultiplier = engine.GetThrustCurveBurnTimeMultiplier();
            allInputs[0].checked = engine.UseTanks;
            allInputs[1].checked = engine.LimitTanks;
            allInputs[2].value = Unit.Display(engine.TanksVolume, "L", Settings.classic_unit_display, 3);
            e.querySelectorAll("span")[1].innerHTML = Unit.Display(engine.GetTankSizeEstimate(), "L", Settings.classic_unit_display, 3);
            e.children[1].style.display = engine.UseTanks ? "grid" : "none";
            allInputs[2].disabled = !engine.LimitTanks;
            let table = e.querySelector("tbody");
            let rows = e.querySelectorAll("tr");
            rows.forEach((v, i) => {
                if (i != 0) {
                    v.remove();
                }
            });
            engine.TanksContents.forEach(v => {
                addRow(table, v);
            });
        }, ApplyChangesToValue: (e, engine) => {
            let selects = e.querySelectorAll("select");
            let inputs = e.querySelector("table").querySelectorAll(`input`);
            let allInputs = e.querySelectorAll(`input`);
            engine.UseTanks = allInputs[0].checked;
            engine.LimitTanks = allInputs[1].checked;
            engine.TanksVolume = Unit.Parse(allInputs[2].value, "L");
            if (selects.length * 3 != inputs.length) {
                console.warn("table misaligned?");
            }
            engine.TanksContents = [];
            for (let i = 0; i < selects.length; ++i) {
                engine.TanksContents.push([parseInt(selects[i].value), Unit.Parse(inputs[3 * i].value, "L")]);
            }
        }
    };
})(EngineEditableFieldMetadata || (EngineEditableFieldMetadata = {}));
var EngineEditableFieldMetadata;
(function (EngineEditableFieldMetadata) {
    EngineEditableFieldMetadata.TechUnlockNode = {
        ApplyValueToDisplayElement: (e, engine) => {
            e.innerHTML = TechNodeNames.get(engine.TechUnlockNode);
        }, GetEditElement: () => {
            let tmp = document.createElement("input");
            tmp.classList.add("content-cell-content");
            tmp.setAttribute("list", "techNodeItems");
            return tmp;
        }, ApplyValueToEditElement: (e, engine) => {
            e.value = TechNodeNames.get(engine.TechUnlockNode);
        }, ApplyChangesToValue: (e, engine) => {
            let value = 0;
            TechNodeNames.forEach((name, node) => {
                if (e.value.trim() == name) {
                    value = node;
                }
            });
            engine.TechUnlockNode = value;
        }
    };
})(EngineEditableFieldMetadata || (EngineEditableFieldMetadata = {}));
var EngineEditableFieldMetadata;
(function (EngineEditableFieldMetadata) {
    EngineEditableFieldMetadata.TestFlight = {
        GetDisplayElement: () => {
            let tmp = document.createElement("div");
            tmp.classList.add("content-cell-content");
            return tmp;
        }, ApplyValueToDisplayElement: (e, engine) => {
            if (engine.EnableTestFlight) {
                e.innerHTML = `Enabled | ${engine.StartReliability0}% - ${engine.StartReliability10k}% | ${Math.round((1 / (1 - (engine.CycleReliability0 / 100))) * engine.RatedBurnTime)}s - ${Math.round((1 / (1 - (engine.CycleReliability10k / 100))) * engine.RatedBurnTime)}s`;
            }
            else {
                if (engine.IsTestFlightDefault()) {
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
        }, ApplyValueToEditElement: (e, engine) => {
            let inputs = e.querySelectorAll("input");
            e.children[1].style.display = engine.EnableTestFlight ? "grid" : "none";
            inputs[0].checked = engine.EnableTestFlight;
            inputs[1].value = engine.RatedBurnTime.toString();
            inputs[2].value = engine.StartReliability0.toString();
            inputs[3].value = engine.StartReliability10k.toString();
            inputs[4].value = engine.CycleReliability0.toString();
            inputs[5].value = engine.CycleReliability10k.toString();
        }, ApplyChangesToValue: (e, engine) => {
            let inputs = e.querySelectorAll("input");
            engine.EnableTestFlight = inputs[0].checked;
            engine.RatedBurnTime = parseInt(inputs[1].value);
            engine.StartReliability0 = parseFloat(inputs[2].value.replace(",", "."));
            engine.StartReliability10k = parseFloat(inputs[3].value.replace(",", "."));
            engine.CycleReliability0 = parseFloat(inputs[4].value.replace(",", "."));
            engine.CycleReliability10k = parseFloat(inputs[5].value.replace(",", "."));
        }
    };
})(EngineEditableFieldMetadata || (EngineEditableFieldMetadata = {}));
var EngineEditableFieldMetadata;
(function (EngineEditableFieldMetadata) {
    EngineEditableFieldMetadata.Thrust = {
        ApplyValueToDisplayElement: (e, engine) => {
            e.innerHTML = Unit.Display(engine.Thrust, "kN", Settings.classic_unit_display, 9);
        }, ApplyValueToEditElement: (e, engine) => {
            e.value = Unit.Display(engine.Thrust, "kN", Settings.classic_unit_display);
        }, ApplyChangesToValue: (e, engine) => {
            engine.Thrust = Unit.Parse(e.value, "kN");
        }
    };
})(EngineEditableFieldMetadata || (EngineEditableFieldMetadata = {}));
var EngineEditableFieldMetadata;
(function (EngineEditableFieldMetadata) {
    EngineEditableFieldMetadata.ThrustCurve = {
        ApplyValueToDisplayElement: (e, engine) => {
            e.innerHTML = engine.ThrustCurve.length > 0 ? "Custom" : "Default";
        }, GetEditElement: () => {
            let tmp = document.createElement("div");
            tmp.classList.add("content-cell-content");
            tmp.style.height = "150px";
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
        }, ApplyValueToEditElement: (e, engine) => {
            let table = e.querySelector("tbody");
            let rows = e.querySelectorAll("tr");
            engine.ThrustCurve = engine.ThrustCurve.sort((a, b) => {
                return b[0] - a[0];
            });
            rows.forEach((v, i) => {
                if (i != 0) {
                    v.remove();
                }
            });
            engine.ThrustCurve.forEach(v => {
                let tr = document.createElement("tr");
                tr.innerHTML = `
                    <td><input style="width: calc(100%);" value="${v[0]}"></td>
                    <td><input style="width: calc(100%);" value="${v[1]}"></td>
                `;
                table.appendChild(tr);
            });
        }, ApplyChangesToValue: (e, engine) => {
            let inputs = e.querySelectorAll(`input`);
            engine.ThrustCurve = [];
            for (let i = 0; i < inputs.length; i += 2) {
                engine.ThrustCurve.push([parseFloat(inputs[i].value.replace(",", ".")), parseFloat(inputs[i + 1].value.replace(",", "."))]);
            }
            engine.ThrustCurve = engine.ThrustCurve.sort((a, b) => {
                return b[0] - a[0];
            });
        },
    };
})(EngineEditableFieldMetadata || (EngineEditableFieldMetadata = {}));
var EngineEditableFieldMetadata;
(function (EngineEditableFieldMetadata) {
    EngineEditableFieldMetadata.VacIsp = {
        ApplyValueToDisplayElement: (e, engine) => {
            e.innerHTML = Unit.Display(engine.VacIsp, "s", true);
        }, ApplyValueToEditElement: (e, engine) => {
            e.value = Unit.Display(engine.VacIsp, "s", true);
        }, ApplyChangesToValue: (e, engine) => {
            engine.VacIsp = Unit.Parse(e.value, "s");
        }
    };
})(EngineEditableFieldMetadata || (EngineEditableFieldMetadata = {}));
var EngineEditableFieldMetadata;
(function (EngineEditableFieldMetadata) {
    EngineEditableFieldMetadata.Visuals = {
        GetDisplayElement: () => {
            let tmp = document.createElement("div");
            tmp.classList.add("content-cell-content");
            return tmp;
        }, ApplyValueToDisplayElement: (e, engine) => {
            let isSlave = engine.PolyType == PolymorphismType.MultiModeSlave || engine.PolyType == PolymorphismType.MultiConfigSlave;
            if (isSlave) {
                e.innerHTML = `${PlumeInfo.GetPlumeInfo(engine.PlumeID).PlumeName}`;
            }
            else {
                e.innerHTML = `${ModelInfo.GetModelInfo(engine.ModelID).ModelName}, ${PlumeInfo.GetPlumeInfo(engine.PlumeID).PlumeName}`;
            }
        }, GetEditElement: () => {
            let tmp = document.createElement("div");
            tmp.classList.add("content-cell-content");
            tmp.style.padding = "0";
            let grid = document.createElement("div");
            grid.style.display = "grid";
            grid.style.gridTemplateColumns = "60px auto";
            grid.style.gridTemplateAreas = `
                "a b"
                "c d"
                "e e"
            `;
            tmp.style.height = "168px";
            grid.style.gridTemplateRows = "24px 24px 120px";
            grid.innerHTML = `
                <div class="content-cell-content" style="grid-area: a;">Model</div>
                <div style="grid-area: b;"><span class="clickable-text modelText" value="999">Placeholder</span></div>
                <div class="content-cell-content" style="grid-area: c;">Plume</div>
                <div style="grid-area: d;"><span class="clickable-text plumeText" value="999">Placeholder</span></div>
                <div class="exhaustBox" style="grid-area: e; display: grid; grid-template: 'ea ea' 24px 'eb eb' 96px / auto">
                <div class="content-cell-content" style="grid-area: ea;"><input class="enableExhaust" type="checkbox"><span style="position: relative; left: 4px; top: -4px;">Enable exhaust effects</span></div>
                <div class="exhaustSettings" style="grid-area: eb; display: grid; grid-template: 'eba ebb' 24px 'ebc ebd' 24px 'ebe ebf' 24px 'ebg ebh' 24px / 140px auto">
                <div class="content-cell-content" style="grid-area: eba;">Exhaust plume</div>
                <div style="grid-area: ebb;"><span class="clickable-text exhaustPlumeText" value="999">Placeholder</span></div>
                <div class="content-cell-content" style="grid-area: ebc; cursor: help;" title="What fraction of engine's overall thrust is produced by engine exhaust?">Exhaust thrust</div>
                <div style="grid-area: ebd;"><input class="exhaustThrust" style="width: calc(100% - 24px);">%</div>
                <div class="content-cell-content" style="grid-area: ebe; cursor: help;" title="Multiplier of exhaust's efficiency, compared to main engine">Exhaust impulse</div>
                <div style="grid-area: ebf;"><input class="exhaustImpulse" style="width: calc(100% - 24px);">%</div>
                <div class="content-cell-content" style="grid-area: ebg;">Exhaust gimbal</div>
                <div style="grid-area: ebh;"><input class="exhaustGimbal" style="width: calc(100% - 24px);"><input title="Restrict engine gimbal to only roll control" class="exhaustGimbalRoll" type="checkbox" style="cursor: help; margin: -1px 0px 0px 0px; position: relative; top: 2px; left: 2px;"></div>
                </div>
                </div>
            `;
            let modelText = grid.querySelector(".modelText");
            modelText.addEventListener("click", () => {
                ModelSelector.GetModel(m => {
                    if (m != null) {
                        modelText.setAttribute("value", m.toString());
                        modelText.innerHTML = ModelInfo.GetModelInfo(m).ModelName;
                        grid.querySelector(".exhaustBox").style.display = ModelInfo.GetModelInfo(m).Exhaust ? "grid" : "none";
                    }
                });
            });
            let plumeText = grid.querySelector(".plumeText");
            plumeText.addEventListener("click", () => {
                PlumeSelector.GetPlume(m => {
                    if (m != null) {
                        plumeText.setAttribute("value", m.toString());
                        plumeText.innerHTML = PlumeInfo.GetPlumeInfo(m).PlumeName;
                    }
                });
            });
            let exhaustPlumeText = grid.querySelector(".exhaustPlumeText");
            exhaustPlumeText.addEventListener("click", () => {
                PlumeSelector.GetPlume(m => {
                    if (m != null) {
                        exhaustPlumeText.setAttribute("value", m.toString());
                        exhaustPlumeText.innerHTML = PlumeInfo.GetPlumeInfo(m).PlumeName;
                    }
                });
            });
            let exhaustCheckbox = grid.querySelector(".enableExhaust");
            exhaustCheckbox.addEventListener("change", () => {
                grid.querySelector(".exhaustSettings").style.display = exhaustCheckbox.checked ? "grid" : "none";
            });
            tmp.appendChild(grid);
            return tmp;
        }, ApplyValueToEditElement: (e, engine) => {
            let targetEngine = (engine.PolyType == PolymorphismType.MultiModeSlave ||
                engine.PolyType == PolymorphismType.MultiConfigSlave) ? engine.EngineList.find(x => x.ID == engine.MasterEngineName) : engine;
            targetEngine = targetEngine != undefined ? targetEngine : engine;
            let isSlave = engine.PolyType == PolymorphismType.MultiConfigSlave || engine.PolyType == PolymorphismType.MultiModeSlave;
            let select = e.querySelector("select");
            let modelText = e.querySelector(".modelText");
            let plumeText = e.querySelector(".plumeText");
            let exhaustPlumeText = e.querySelector(".exhaustPlumeText");
            modelText.setAttribute("value", targetEngine.ModelID.toString());
            modelText.innerHTML = ModelInfo.GetModelInfo(targetEngine.ModelID).ModelName;
            plumeText.setAttribute("value", engine.PlumeID.toString());
            plumeText.innerHTML = PlumeInfo.GetPlumeInfo(engine.PlumeID).PlumeName;
            exhaustPlumeText.setAttribute("value", engine.ExhaustPlumeID.toString());
            exhaustPlumeText.innerHTML = PlumeInfo.GetPlumeInfo(engine.ExhaustPlumeID).PlumeName;
            e.querySelector(".exhaustBox").style.display = ModelInfo.GetModelInfo(engine.ModelID).Exhaust ? "grid" : "none";
            e.querySelector(".enableExhaust").checked = targetEngine.UseExhaustEffect;
            e.querySelector(".exhaustSettings").style.display = targetEngine.UseExhaustEffect ? "grid" : "none";
            e.querySelector(".exhaustThrust").value = engine.ExhaustThrustPercent.toString();
            e.querySelector(".exhaustImpulse").value = engine.ExhaustIspPercent.toString();
            e.querySelector(".exhaustGimbal").value = targetEngine.ExhaustGimbal.toString();
            e.querySelector(".exhaustGimbalRoll").checked = targetEngine.ExhaustGimbalOnlyRoll;
            modelText.style.pointerEvents = isSlave ? "none" : "all";
            e.querySelector(".enableExhaust").disabled = isSlave;
            e.querySelector(".exhaustGimbal").disabled = isSlave;
            e.querySelector(".exhaustGimbalRoll").disabled = isSlave;
        }, ApplyChangesToValue: (e, engine) => {
            let modelText = e.querySelector(".modelText");
            let plumeText = e.querySelector(".plumeText");
            let exhaustPlumeText = e.querySelector(".exhaustPlumeText");
            let exhaustThrust = e.querySelector(".exhaustThrust");
            let exhaustImpulse = e.querySelector(".exhaustImpulse");
            let exhaustGimbal = e.querySelector(".exhaustGimbal");
            engine.ModelID = parseInt(modelText.getAttribute("value"));
            engine.PlumeID = parseInt(plumeText.getAttribute("value"));
            engine.ExhaustPlumeID = parseInt(exhaustPlumeText.getAttribute("value"));
            engine.UseExhaustEffect = e.querySelector(".enableExhaust").checked;
            engine.ExhaustThrustPercent = parseFloat(exhaustThrust.value.replace(",", "."));
            engine.ExhaustIspPercent = parseFloat(exhaustImpulse.value.replace(",", "."));
            engine.ExhaustGimbal = parseFloat(exhaustGimbal.value.replace(",", "."));
            engine.ExhaustGimbalOnlyRoll = e.querySelector(".exhaustGimbalRoll").checked;
        }
    };
})(EngineEditableFieldMetadata || (EngineEditableFieldMetadata = {}));
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
    Model[Model["Rhino"] = 6] = "Rhino";
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
    Model[Model["NERVA2"] = 23] = "NERVA2";
    Model[Model["NERVAwide"] = 24] = "NERVAwide";
    Model[Model["Pancake"] = 25] = "Pancake";
    Model[Model["RT3"] = 26] = "RT3";
    Model[Model["RD170"] = 27] = "RD170";
    Model[Model["RD0120"] = 28] = "RD0120";
    Model[Model["Gamma2"] = 29] = "Gamma2";
    Model[Model["Gamma8"] = 30] = "Gamma8";
    Model[Model["AJ10_137"] = 31] = "AJ10_137";
    Model[Model["AJ10_190"] = 32] = "AJ10_190";
    Model[Model["F1"] = 33] = "F1";
    Model[Model["F1B"] = 34] = "F1B";
    Model[Model["H1"] = 35] = "H1";
    Model[Model["J2"] = 36] = "J2";
    Model[Model["J2X"] = 37] = "J2X";
    Model[Model["LMAE"] = 38] = "LMAE";
    Model[Model["LMDE"] = 39] = "LMDE";
    Model[Model["Bell8048"] = 40] = "Bell8048";
    Model[Model["Bell8096"] = 41] = "Bell8096";
    Model[Model["Merlin1A"] = 42] = "Merlin1A";
    Model[Model["Merlin1B"] = 43] = "Merlin1B";
    Model[Model["Merlin1BV"] = 44] = "Merlin1BV";
    Model[Model["Merlin1D"] = 45] = "Merlin1D";
    Model[Model["Merlin1DV"] = 46] = "Merlin1DV";
    Model[Model["RD107"] = 47] = "RD107";
    Model[Model["RD171"] = 48] = "RD171";
    Model[Model["RD180"] = 49] = "RD180";
    Model[Model["RD181"] = 50] = "RD181";
    Model[Model["RL10A3"] = 51] = "RL10A3";
    Model[Model["RL10A4"] = 52] = "RL10A4";
    Model[Model["RL10A5"] = 53] = "RL10A5";
    Model[Model["RL10B2"] = 54] = "RL10B2";
    Model[Model["RS25_2"] = 55] = "RS25_2";
    Model[Model["RS68"] = 56] = "RS68";
    Model[Model["SuperDraco"] = 57] = "SuperDraco";
    Model[Model["SuperDracoV"] = 58] = "SuperDracoV";
    Model[Model["FRE1"] = 59] = "FRE1";
    Model[Model["FRE2"] = 60] = "FRE2";
    Model[Model["LE5"] = 61] = "LE5";
    Model[Model["LE7"] = 62] = "LE7";
    Model[Model["RD843"] = 63] = "RD843";
    Model[Model["Rutherford"] = 64] = "Rutherford";
    Model[Model["RutherfordVac"] = 65] = "RutherfordVac";
    Model[Model["P80"] = 66] = "P80";
    Model[Model["Zefiro9"] = 67] = "Zefiro9";
    Model[Model["Zefiro23"] = 68] = "Zefiro23";
    Model[Model["Viking"] = 69] = "Viking";
    Model[Model["VikingVac"] = 70] = "VikingVac";
    Model[Model["ApolloSPSBlockII"] = 71] = "ApolloSPSBlockII";
    Model[Model["ApolloSPSBlockIII"] = 72] = "ApolloSPSBlockIII";
    Model[Model["ApolloSPSBlockV"] = 73] = "ApolloSPSBlockV";
    Model[Model["LMAE_BDB"] = 74] = "LMAE_BDB";
    Model[Model["LMDE_BDB"] = 75] = "LMDE_BDB";
    Model[Model["LR89"] = 76] = "LR89";
    Model[Model["LR101"] = 77] = "LR101";
    Model[Model["LR105"] = 78] = "LR105";
    Model[Model["RD180_BDB"] = 79] = "RD180_BDB";
    Model[Model["RL10"] = 80] = "RL10";
    Model[Model["RL10A41"] = 81] = "RL10A41";
    Model[Model["RL10B2_BDB"] = 82] = "RL10B2_BDB";
    Model[Model["GEM40"] = 83] = "GEM40";
    Model[Model["AJ10_BDB"] = 84] = "AJ10_BDB";
    Model[Model["Rita"] = 85] = "Rita";
    Model[Model["Rubis"] = 86] = "Rubis";
    Model[Model["Topaze"] = 87] = "Topaze";
    Model[Model["Able"] = 88] = "Able";
    Model[Model["Ablestar"] = 89] = "Ablestar";
    Model[Model["Navaho"] = 90] = "Navaho";
    Model[Model["Thor"] = 91] = "Thor";
    Model[Model["Vanguard"] = 92] = "Vanguard";
    Model[Model["E1"] = 93] = "E1";
    Model[Model["Sargent"] = 94] = "Sargent";
    Model[Model["Juno6K"] = 95] = "Juno6K";
    Model[Model["Juno45K"] = 96] = "Juno45K";
    Model[Model["S3D"] = 97] = "S3D";
    Model[Model["F1_BDB"] = 98] = "F1_BDB";
    Model[Model["H1C"] = 99] = "H1C";
    Model[Model["H1D"] = 100] = "H1D";
    Model[Model["J2_BDB"] = 101] = "J2_BDB";
    Model[Model["J2T"] = 102] = "J2T";
    Model[Model["J2SL"] = 103] = "J2SL";
    Model[Model["AJ260"] = 104] = "AJ260";
    Model[Model["LR87"] = 105] = "LR87";
    Model[Model["LR87S"] = 106] = "LR87S";
    Model[Model["LR91_BDB"] = 107] = "LR91_BDB";
    Model[Model["Soltan"] = 108] = "Soltan";
    Model[Model["UA1205"] = 109] = "UA1205";
    Model[Model["UA1207"] = 110] = "UA1207";
    Model[Model["Transtage"] = 111] = "Transtage";
    Model[Model["LR87_5"] = 112] = "LR87_5";
    Model[Model["LR87_11"] = 113] = "LR87_11";
    Model[Model["LR87_11S"] = 114] = "LR87_11S";
    Model[Model["LR87_11SV"] = 115] = "LR87_11SV";
    Model[Model["LR87_11SH"] = 116] = "LR87_11SH";
    Model[Model["LR87_11SHV"] = 117] = "LR87_11SHV";
    Model[Model["LR91_5"] = 118] = "LR91_5";
    Model[Model["LR91_11"] = 119] = "LR91_11";
    Model[Model["SRMU"] = 120] = "SRMU";
    Model[Model["UA1205_NEW"] = 121] = "UA1205_NEW";
    Model[Model["UA1207_NEW"] = 122] = "UA1207_NEW";
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
    Plume[Plume["GP_Alcolox"] = 28] = "GP_Alcolox";
    Plume[Plume["GP_Ammonialox"] = 29] = "GP_Ammonialox";
    Plume[Plume["GP_HydrogenNTR"] = 30] = "GP_HydrogenNTR";
    Plume[Plume["GP_Hydrolox"] = 31] = "GP_Hydrolox";
    Plume[Plume["GP_Hydynelox"] = 32] = "GP_Hydynelox";
    Plume[Plume["GP_Hypergolic"] = 33] = "GP_Hypergolic";
    Plume[Plume["GP_IonArgon"] = 34] = "GP_IonArgon";
    Plume[Plume["GP_IonKrypton"] = 35] = "GP_IonKrypton";
    Plume[Plume["GP_IonXenon"] = 36] = "GP_IonXenon";
    Plume[Plume["GP_Kerolox"] = 37] = "GP_Kerolox";
    Plume[Plume["GP_Methalox"] = 38] = "GP_Methalox";
    Plume[Plume["GP_OmsRed"] = 39] = "GP_OmsRed";
    Plume[Plume["GP_OmsWhite"] = 40] = "GP_OmsWhite";
    Plume[Plume["GP_Solid"] = 41] = "GP_Solid";
    Plume[Plume["GP_TurbopumpSmoke"] = 42] = "GP_TurbopumpSmoke";
})(Plume || (Plume = {}));
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
class DebugLists {
    static AppendListForExhaustPreviews() {
        let toAppend = [];
        let modelCount = Object.getOwnPropertyNames(Model).length / 2;
        for (let i = 0; i < modelCount; ++i) {
            let newEngine = new Engine();
            newEngine.EngineList = MainEngineTable.Items;
            let modelInfo = ModelInfo.GetModelInfo(i);
            if (!modelInfo.Exhaust) {
                continue;
            }
            newEngine.Active = true;
            newEngine.ID = `PREVIEW-E${("0000" + i).slice(-4)}`;
            newEngine.EngineName = `(E${("0000" + i).slice(-4)}) Exhaust preview - ${modelInfo.ModelName}`;
            newEngine.ModelID = i;
            newEngine.UseBaseWidth = true;
            newEngine.Width = 2;
            newEngine.Height = 2 * (modelInfo.OriginalHeight / modelInfo.OriginalBaseWidth);
            let trimmed = newEngine.Height.toFixed(3);
            let numberString = newEngine.Height.toString().length >= trimmed.length ? trimmed : newEngine.Height.toString();
            newEngine.Height = parseFloat(numberString);
            newEngine.NeedsUllage = false;
            newEngine.Mass = 0.5;
            newEngine.Thrust = 100;
            newEngine.VacIsp = 1500;
            newEngine.AtmIsp = 1000;
            newEngine.AlternatorPower = 10;
            newEngine.Gimbal = 5;
            newEngine.FuelRatioItems = [[Fuel.Kerosene, 1]];
            newEngine.Ignitions = 0;
            let plumes = [Plume.GP_Alcolox, Plume.GP_Ammonialox, Plume.GP_Hydrolox, Plume.GP_Hydynelox, Plume.GP_Hypergolic, Plume.GP_Kerolox, Plume.GP_Methalox, Plume.GP_Solid];
            newEngine.PlumeID = plumes[Math.floor(plumes.length * Math.random())];
            let exhaustPlumes = [Plume.GP_OmsWhite, Plume.GP_OmsRed, Plume.GP_TurbopumpSmoke, Plume.GP_HydrogenNTR];
            newEngine.UseExhaustEffect = true;
            newEngine.ExhaustThrustPercent = 10;
            newEngine.ExhaustIspPercent = 90;
            newEngine.ExhaustGimbal = 20;
            newEngine.ExhaustGimbalOnlyRoll = false;
            newEngine.ExhaustPlumeID = exhaustPlumes[Math.floor(exhaustPlumes.length * Math.random())];
            toAppend.push(newEngine);
        }
        MainEngineTable.AddItems(toAppend);
    }
    static AppendListForModelPreviews() {
        let toAppend = [];
        let modelCount = Object.getOwnPropertyNames(Model).length / 2;
        for (let i = 0; i < modelCount; ++i) {
            let newEngine = new Engine();
            newEngine.EngineList = MainEngineTable.Items;
            let modelInfo = ModelInfo.GetModelInfo(i);
            newEngine.Active = true;
            newEngine.ID = `PREVIEW-P${("0000" + i).slice(-4)}`;
            newEngine.EngineName = `(P${("0000" + i).slice(-4)}) Model preview - ${modelInfo.ModelName}`;
            newEngine.ModelID = i;
            newEngine.UseBaseWidth = true;
            newEngine.Width = 2;
            newEngine.Height = 2 * (modelInfo.OriginalHeight / modelInfo.OriginalBaseWidth);
            let trimmed = newEngine.Height.toFixed(3);
            let numberString = newEngine.Height.toString().length >= trimmed.length ? trimmed : newEngine.Height.toString();
            newEngine.Height = parseFloat(numberString);
            newEngine.NeedsUllage = false;
            newEngine.Mass = 0.05;
            newEngine.Thrust = 10;
            newEngine.VacIsp = 15000;
            newEngine.AtmIsp = 10000;
            newEngine.AlternatorPower = 10;
            newEngine.Gimbal = 20;
            newEngine.FuelRatioItems = [[Fuel.Kerosene, 1]];
            newEngine.Ignitions = 0;
            let plumes = [Plume.GP_Alcolox, Plume.GP_Ammonialox, Plume.GP_Hydrolox, Plume.GP_Hydynelox, Plume.GP_Hypergolic, Plume.GP_Kerolox, Plume.GP_Methalox, Plume.GP_Solid];
            newEngine.PlumeID = plumes[Math.floor(plumes.length * Math.random())];
            toAppend.push(newEngine);
        }
        MainEngineTable.AddItems(toAppend);
    }
    static AppendListForPlumeTest() {
        let toAppend = [];
        let plumeCount = Object.getOwnPropertyNames(Plume).length / 2;
        for (let i = 0; i < plumeCount; ++i) {
            let newEngine = new Engine();
            newEngine.EngineList = MainEngineTable.Items;
            let plumeInfo = PlumeInfo.GetPlumeInfo(i);
            newEngine.Active = true;
            newEngine.ID = `PREVIEW-P${("0000" + i).slice(-4)}PLUMETEST`;
            newEngine.EngineName = `(P${("0000" + i).slice(-4)}) Plume test - ${plumeInfo.PlumeName}`;
            newEngine.UseBaseWidth = true;
            newEngine.Width = Math.random() * 2 + 0.5;
            newEngine.Height = Math.random() * 3 + 1;
            newEngine.Gimbal = 15;
            newEngine.Thrust = Math.pow(10, Math.random() * 4);
            newEngine.FuelRatioItems = [[Fuel.Kerosene, 1]];
            newEngine.Ignitions = 0;
            newEngine.ModelID = Math.floor(Math.random() * 9999) % (Object.getOwnPropertyNames(Model).length / 2);
            newEngine.PlumeID = i;
            toAppend.push(newEngine);
        }
        MainEngineTable.AddItems(toAppend);
    }
    static AppendListForPlumePreviews() {
        let toAppend = [];
        let plumeCount = Object.getOwnPropertyNames(Plume).length / 2;
        for (let i = 0; i < plumeCount; ++i) {
            let newEngine = new Engine();
            newEngine.EngineList = MainEngineTable.Items;
            let modelInfo = ModelInfo.GetModelInfo(Model.RS25_2);
            let plumeInfo = PlumeInfo.GetPlumeInfo(i);
            newEngine.Active = true;
            newEngine.ID = `PREVIEW-P${("0000" + i).slice(-4)}PLUME`;
            newEngine.EngineName = `(P${("0000" + i).slice(-4)}) Plume preview - ${plumeInfo.PlumeName}`;
            newEngine.UseBaseWidth = true;
            newEngine.Width = 2;
            newEngine.Height = 2 * (modelInfo.OriginalHeight / modelInfo.OriginalBaseWidth);
            let trimmed = newEngine.Height.toFixed(3);
            let numberString = newEngine.Height.toString().length >= trimmed.length ? trimmed : newEngine.Height.toString();
            newEngine.Height = parseFloat(numberString);
            newEngine.Gimbal = 15;
            newEngine.Thrust = Math.pow(10, Math.random() * 4);
            newEngine.FuelRatioItems = [[Fuel.Kerosene, 1]];
            newEngine.Ignitions = 0;
            newEngine.ModelID = Model.RS25_2;
            newEngine.PlumeID = i;
            toAppend.push(newEngine);
        }
        MainEngineTable.AddItems(toAppend);
    }
    static AppendListForModelTest() {
        let toAppend = [];
        let modelCount = Object.getOwnPropertyNames(Model).length / 2;
        let newEngine;
        let modelInfo;
        for (let i = 0; i < modelCount; ++i) {
            newEngine = new Engine();
            newEngine.EngineList = MainEngineTable.Items;
            modelInfo = ModelInfo.GetModelInfo(i);
            newEngine.Active = true;
            newEngine.ID = `MODEL-${("0000" + i).slice(-4)}-1`;
            newEngine.EngineName = `(${("0000" + i).slice(-4)}) Model check 1 - ${modelInfo.ModelName}`;
            newEngine.ModelID = i;
            newEngine.UseBaseWidth = true;
            newEngine.Width = 2;
            newEngine.Height = 2;
            newEngine.Gimbal = 15;
            newEngine.FuelRatioItems = [[Fuel.Kerosene, 1]];
            newEngine.Ignitions = 0;
            newEngine.PlumeID = Plume.Hypergolic_Lower;
            toAppend.push(newEngine);
            newEngine = new Engine();
            modelInfo = ModelInfo.GetModelInfo(i);
            newEngine.Active = true;
            newEngine.ID = `MODEL-${("0000" + i).slice(-4)}-2`;
            newEngine.EngineName = `(${("0000" + i).slice(-4)}) Model check 2 - ${modelInfo.ModelName}`;
            newEngine.ModelID = i;
            newEngine.UseBaseWidth = false;
            newEngine.Width = 2;
            newEngine.Height = 2;
            newEngine.Gimbal = 15;
            newEngine.FuelRatioItems = [[Fuel.Kerosene, 1]];
            newEngine.Ignitions = 0;
            newEngine.PlumeID = Plume.Kerolox_Vernier;
            toAppend.push(newEngine);
            newEngine = new Engine();
            modelInfo = ModelInfo.GetModelInfo(i);
            newEngine.Active = true;
            newEngine.ID = `MODEL-${("0000" + i).slice(-4)}-3`;
            newEngine.EngineName = `(${("0000" + i).slice(-4)}) Model check 3 - ${modelInfo.ModelName}`;
            newEngine.ModelID = i;
            newEngine.UseBaseWidth = true;
            newEngine.Width = 2;
            newEngine.Height = 6;
            newEngine.Gimbal = 15;
            newEngine.FuelRatioItems = [[Fuel.Kerosene, 1]];
            newEngine.Ignitions = 0;
            newEngine.PlumeID = Plume.Solid_Lower;
            toAppend.push(newEngine);
        }
        MainEngineTable.AddItems(toAppend);
    }
    static AppendListForTankTest() {
        let toAppend = [];
        let modelCount = Object.getOwnPropertyNames(Model).length / 2;
        for (let i = 0; i < modelCount; ++i) {
            let modelInfo = ModelInfo.GetModelInfo(i);
            if (modelInfo.OriginalTankVolume == 0) {
                continue;
            }
            let newEngine = new Engine();
            newEngine.EngineList = MainEngineTable.Items;
            newEngine.Active = true;
            newEngine.ID = `TANKTEST-${("0000" + i).slice(-4)}`;
            newEngine.EngineName = `(${("0000" + i).slice(-4)}) Tank volume test - ${modelInfo.ModelName}`;
            newEngine.ModelID = i;
            newEngine.UseBaseWidth = true;
            newEngine.Width = 4;
            newEngine.Height = 4;
            newEngine.UseTanks = true;
            newEngine.TanksVolume = newEngine.GetTankSizeEstimate();
            toAppend.push(newEngine);
        }
        MainEngineTable.AddItems(toAppend);
    }
}
class Dragger {
    static Drop() {
        if (this.currentInterval) {
            clearInterval(this.currentInterval);
            this.currentInterval = null;
        }
    }
    static Drag(action) {
        if (this.currentInterval) {
            this.Drop();
        }
        this.currentInterval = setInterval(action, 20);
    }
}
window.addEventListener("pointerup", () => {
    Dragger.Drop();
});
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
        output = Exporter.CompactConfig(output);
        if (Settings.prettify_config) {
            output = Exporter.PrettifyConfig(output);
        }
        return output;
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
    static PrettifyConfig(input) {
        let output = "";
        let lines = input.split("\n");
        let tabCount = 0;
        lines.forEach(l => {
            let closeBracketCount = (l.match(/}/g) || []).length;
            tabCount -= closeBracketCount;
            if (closeBracketCount > 0) {
                tabCount += (l.match(/{/g) || []).length;
            }
            output += `${"\t".repeat(tabCount)}${l}\n`;
            if (closeBracketCount > 0) {
                output += `${"\t".repeat(tabCount)}\n`;
            }
            else {
                tabCount += (l.match(/{/g) || []).length;
            }
        });
        return output;
    }
    static RegularEngineConfig(engine, allEngines) {
        let modelInfo = ModelInfo.GetModelInfo(engine.GetModelID());
        let baseEngineConfig = "";
        if (modelInfo.Exhaust && engine.UseExhaustEffect) {
            baseEngineConfig = `
                MODULE
                {
                    name = ModuleEnginesFX
                    engineID = PrimaryMode
                    thrustVectorTransformName = ${modelInfo.ThrustTransformName}
                    exhaustDamage = True
                    allowShutdown = ${engine.EngineVariant != EngineType.Solid}
                    useEngineResponseTime = ${engine.EngineVariant != EngineType.Solid}
                    throttleLocked = ${engine.EngineVariant == EngineType.Solid}
                    ignitionThreshold = 0.1
                    minThrust = ${(1 - engine.ExhaustThrustPercent / 100) * engine.Thrust * engine.MinThrust / 100}
                    maxThrust = ${(1 - engine.ExhaustThrustPercent / 100) * engine.Thrust}
                    heatProduction = 180
                    EngineType = ${engine.EngineTypeConfig()}
                    exhaustDamageDistanceOffset = 0.79
                    useThrustCurve = ${engine.ThrustCurve.length > 0}
                    powerEffectName = ${PlumeInfo.GetPlumeInfo(engine.PlumeID).PlumeEffectName}
                    
                    ${engine.GetPropellantConfig()}
                    
                    atmosphereCurve
                    {
                        key = 0 ${engine.VacIsp}
                        key = 1 ${engine.AtmIsp}
                    }
                    
                    ${engine.GetThrustCurveConfig()}
                    
                }
                
                MODULE
                {
                    name = ModuleEnginesFX
                    engineID = PrimaryModeVernier
                    thrustVectorTransformName = ${modelInfo.Exhaust.exhaustThrustTransform}
                    exhaustDamage = True
                    allowShutdown = ${engine.EngineVariant != EngineType.Solid}
                    useEngineResponseTime = ${engine.EngineVariant != EngineType.Solid}
                    throttleLocked = ${engine.EngineVariant == EngineType.Solid}
                    ignitionThreshold = 0.1
                    minThrust = ${(engine.ExhaustThrustPercent / 100) * engine.Thrust * engine.MinThrust / 100}
                    maxThrust = ${(engine.ExhaustThrustPercent / 100) * engine.Thrust}
                    heatProduction = 180
                    EngineType = ${engine.EngineTypeConfig()}
                    exhaustDamageDistanceOffset = 0.79
                    useThrustCurve = ${engine.ThrustCurve.length > 0}
                    powerEffectName = ${PlumeInfo.GetPlumeInfo(engine.ExhaustPlumeID).PlumeEffectName}
                    
                    ${engine.GetPropellantConfig()}
                    
                    atmosphereCurve
                    {
                        key = 0 ${(engine.ExhaustIspPercent / 100) * engine.VacIsp}
                        key = 1 ${(engine.ExhaustIspPercent / 100) * engine.AtmIsp}
                    }
                    
                    ${engine.GetThrustCurveConfig()}
                    
                }
            `;
        }
        else {
            baseEngineConfig = `
                MODULE
                {
                    name = ModuleEnginesFX
                    engineID = PrimaryMode
                    thrustVectorTransformName = ${modelInfo.ThrustTransformName}
                    exhaustDamage = True
                    allowShutdown = ${engine.EngineVariant != EngineType.Solid}
                    useEngineResponseTime = ${engine.EngineVariant != EngineType.Solid}
                    throttleLocked = ${engine.EngineVariant == EngineType.Solid}
                    ignitionThreshold = 0.1
                    minThrust = ${engine.Thrust * engine.MinThrust / 100}
                    maxThrust = ${engine.Thrust}
                    heatProduction = 180
                    EngineType = ${engine.EngineTypeConfig()}
                    exhaustDamageDistanceOffset = 0.79
                    useThrustCurve = ${engine.ThrustCurve.length > 0}
                    powerEffectName = ${PlumeInfo.GetPlumeInfo(engine.PlumeID).PlumeEffectName}
                    
                    ${engine.GetPropellantConfig()}
                    
                    atmosphereCurve
                    {
                        key = 0 ${engine.VacIsp}
                        key = 1 ${engine.AtmIsp}
                    }
                    
                    ${engine.GetThrustCurveConfig()}
                    
                }
            `;
        }
        return `
            PART
            {
                name = GE-${engine.ID}
                module = Part
                author = Generic Engines
                
                ${engine.GetModelConfig()}
                
                RSSROConfig = True
                RP0conf = True
                breakingForce = 250
                breakingTorque = 250
                stageOffset = 1
                childStageOffset = 1
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
                maxTemp = 573.15
                skinMaxTemp = 673.15
                bulkheadProfiles = srf, size3
                tags = Generic Engine
                stagingIcon = ${engine.StagingIconConfig()}
                
                MODULE
                {
                    name = GenericEnginesPlumeScaleFixer
                }
                
                ${engine.GetHiddenObjectsConfig()}
                
                ${engine.GetGimbalConfig()}
                
                ${baseEngineConfig}
                
                ${engine.GetTankConfig()}
                !RESOURCE,*{}
                
                ${engine.GetAlternatorConfig()}
                
                MODULE
                {
                    name = ModuleSurfaceFX
                    thrustProviderModuleIndex = 0
                    fxMax = 0.5
                    maxDistance = 30
                    falloff = 1.7
                    thrustTransformName = ${modelInfo.ThrustTransformName}
                }
            }
            
            @PART[GE-${engine.ID}]:FOR[RealismOverhaul] {
                ${engine.GetEngineModuleConfig(allEngines)}
            }

            ${engine.GetPlumeConfig()}

            ${engine.GetTestFlightConfig()}
        `;
    }
    static MultiConfigSlaveEngineConfig(engine, allEngines) {
        let masterEngine = allEngines[engine.MasterEngineName];
        let moduleEngineConfigs = "";
        if (masterEngine.UseExhaustEffect && ModelInfo.GetModelInfo(masterEngine.ModelID).Exhaust) {
            moduleEngineConfigs = `
                @MODULE[ModuleEngineConfigs],0
                {
                    ${engine.GetEngineConfig(allEngines)}
                }
                
                @MODULE[ModuleEngineConfigs],1
                {
                    ${engine.GetExhaustConfig(allEngines)}
                }
            `;
        }
        else {
            moduleEngineConfigs = `
                @MODULE[ModuleEngineConfigs]
                {
                    ${engine.GetEngineConfig(allEngines)}
                }
            `;
        }
        return `
            @PART[GE-${engine.MasterEngineName}]:FOR[RealismOverhaul]
            {
                ${moduleEngineConfigs}
            }
            
            ${engine.GetPlumeConfig()}
            
            ${engine.GetTestFlightConfig()}
            
            @ENTRYCOSTMODS:FOR[xxxRP-0]
            {
                GE-${engine.ID} = ${engine.EntryCost}
            }
        `;
    }
    static MultiModeSlaveEngineConfig(engine, allEngines) {
        let exhaustMultiModeConfig = "";
        let copiedEngineConfig = "";
        let masterEngine = allEngines[engine.MasterEngineName];
        if (masterEngine.UseExhaustEffect && ModelInfo.GetModelInfo(masterEngine.ModelID).Exhaust) {
            exhaustMultiModeConfig = `
                MODULE
                {
                    name = MultiModeEngine
                    autoSwitchAvailable = false
                    carryOverThrottle = true
                    primaryEngineID = PrimaryModeVernier
                    primaryEngineModeDisplayName = Primary mode vernier (GE-${engine.MasterEngineName})
                    secondaryEngineID = SecondaryModeVernier
                    secondaryEngineModeDisplayName = Secondary mode vernier (GE-${engine.ID})
                }
            `;
            copiedEngineConfig = `
                +MODULE[ModuleEnginesFX]
                {
                    @engineID = SecondaryMode
                    @minThrust = ${(1 - engine.ExhaustThrustPercent / 100) * engine.Thrust * engine.MinThrust / 100}
                    @maxThrust = ${(1 - engine.ExhaustThrustPercent / 100) * engine.Thrust}
                    @useThrustCurve = ${engine.ThrustCurve.length > 0}
                    @powerEffectName = ${PlumeInfo.GetPlumeInfo(engine.PlumeID).PlumeEffectName}
                    
                    !PROPELLANT,*{}
                    
                    ${engine.GetPropellantConfig()}
                    
                    @atmosphereCurve
                    {
                        @key,0 = 0 ${engine.VacIsp}
                        @key,1 = 1 ${engine.AtmIsp}
                    }
                    
                    !curveResource
                    !thrustCurve
                    ${engine.GetThrustCurveConfig()}
                    
                }
                
                +MODULE[ModuleEnginesFX]
                {
                    @engineID = SecondaryModeVernier
                    @minThrust = ${(engine.ExhaustThrustPercent / 100) * engine.Thrust * engine.MinThrust / 100}
                    @maxThrust = ${(engine.ExhaustThrustPercent / 100) * engine.Thrust}
                    @useThrustCurve = ${engine.ThrustCurve.length > 0}
                    @powerEffectName = ${PlumeInfo.GetPlumeInfo(engine.ExhaustPlumeID).PlumeEffectName}
                    
                    !PROPELLANT,*{}
                    
                    ${engine.GetPropellantConfig()}
                    
                    @atmosphereCurve
                    {
                        @key,0 = 0 ${(engine.ExhaustIspPercent / 100) * engine.VacIsp}
                        @key,1 = 1 ${(engine.ExhaustIspPercent / 100) * engine.AtmIsp}
                    }
                    
                    !curveResource
                    !thrustCurve
                    ${engine.GetThrustCurveConfig()}
                    
                }
            `;
        }
        else {
            copiedEngineConfig = `
                +MODULE[ModuleEnginesFX]
                {
                    @engineID = SecondaryMode
                    @minThrust = ${engine.Thrust * engine.MinThrust / 100}
                    @maxThrust = ${engine.Thrust}
                    @useThrustCurve = ${engine.ThrustCurve.length > 0}
                    @powerEffectName = ${PlumeInfo.GetPlumeInfo(engine.PlumeID).PlumeEffectName}
                    
                    !PROPELLANT,*{}
                    
                    ${engine.GetPropellantConfig()}
                    
                    @atmosphereCurve
                    {
                        @key,0 = 0 ${engine.VacIsp}
                        @key,1 = 1 ${engine.AtmIsp}
                    }
                    
                    !curveResource
                    !thrustCurve
                    ${engine.GetThrustCurveConfig()}
                    
                }
            `;
        }
        return `
            @PART[GE-${engine.MasterEngineName}]
            {
                MODULE
                {
                    name = MultiModeEngine
                    autoSwitchAvailable = false
                    carryOverThrottle = true
                    primaryEngineID = PrimaryMode
                    primaryEngineModeDisplayName = Primary mode (GE-${engine.MasterEngineName})
                    secondaryEngineID = SecondaryMode
                    secondaryEngineModeDisplayName = Secondary mode (GE-${engine.ID})
                }
                
                ${exhaustMultiModeConfig}
                
            }
            
            @PART[GE-${engine.MasterEngineName}]:FOR[RealismOverhaul]
            {
                
                ${copiedEngineConfig}
                
            }

            ${engine.GetPlumeConfig()}
        `;
    }
}
zip.workerScriptsPath = "lib/";
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
    static ZipBlobs(rootDirName, blobs, callback, progressStatus) {
        let zippedCount = 0;
        let fileCount = Object.getOwnPropertyNames(blobs).length;
        if (progressStatus) {
            progressStatus(0, fileCount);
        }
        zip.createWriter(new zip.BlobWriter(), (writer) => {
            let blobnames = [];
            for (let blobname in blobs) {
                blobnames.push(blobname);
            }
            const onEnd = () => {
                writer.close((blob) => {
                    new Response(blob).arrayBuffer().then(a => {
                        callback(new Uint8Array(a));
                    });
                });
            };
            const processBlob = (index) => {
                let blobname = blobnames[index];
                let blob = blobs[blobname];
                if (blob instanceof Uint8Array) {
                    writer.add(`${rootDirName}/${blobname}`, new zip.BlobReader(new Blob([blob])), () => {
                        ++zippedCount;
                        if (progressStatus) {
                            progressStatus(zippedCount, fileCount);
                        }
                        if (zippedCount == fileCount) {
                            onEnd();
                        }
                        else {
                            processBlob(zippedCount);
                        }
                    });
                }
                else {
                    writer.add(`${rootDirName}/${blobname}`, new zip.TextReader(blob), () => {
                        ++zippedCount;
                        if (progressStatus) {
                            progressStatus(zippedCount, fileCount);
                        }
                        if (zippedCount == fileCount) {
                            onEnd();
                        }
                        else {
                            processBlob(zippedCount);
                        }
                    });
                }
            };
            processBlob(0);
        }, (error) => {
            Notifier.Error("There was an error during zip.js initialization");
            console.error("zip.js error:", error);
        }, true);
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
                console.warn("No file selected?");
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
class ImageOverflowPreview {
    static Hook(root) {
        const deadzone = 16;
        if (!root.firstChild) {
            console.warn("Root has no child. Ignoring...");
            return;
        }
        let child = root.firstChild;
        child.style.position = "relative";
        root.addEventListener("mousemove", event => {
            let e = event;
            if (child.clientHeight <= root.clientHeight && child.clientWidth <= root.clientWidth) {
                return;
            }
            let xOffset = (e.layerX - deadzone) / (root.clientWidth - deadzone * 2);
            let yOffset = (e.layerY - deadzone) / (root.clientHeight - deadzone * 2);
            xOffset = Math.min(Math.max(xOffset, 0.0), 1.0);
            yOffset = Math.min(Math.max(yOffset, 0.0), 1.0);
            child.style.left = `-${(child.clientWidth - root.clientWidth) * xOffset}px`;
            child.style.top = `-${(child.clientHeight - root.clientHeight) * yOffset}px`;
        });
        root.addEventListener("mouseleave", () => {
            child.style.left = '0px';
            child.style.top = '0px';
        });
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
window.addEventListener("DOMContentLoaded", () => {
    Packager.StatusWindowElement = document.getElementById("export-box");
});
class Packager {
    static BuildMod(name, engines, callback) {
        this.IsWorking = true;
        this.StatusWindowElement.style.display = "flex";
        let downloadedFilesCountElement = document.getElementById("export-done");
        let exportBoxContainer = document.getElementById("export-box-container");
        let exportStatusElement = document.getElementById("export-status");
        let toDownload;
        let latestData = null;
        exportBoxContainer.innerHTML = "";
        let RequestRound = 0;
        let fetchAborter = new AbortController();
        document.getElementById("export-refresh").onclick = () => {
            SendRequests();
        };
        document.getElementById("export-abort").onclick = () => {
            fetchAborter.abort();
            RequestRound++;
            if (this.IsWorking) {
                callback(null);
            }
            this.IsWorking = false;
            latestData = null;
            this.StatusWindowElement.style.display = "none";
        };
        let blobs = {};
        let toFetch = [];
        blobs[`GenericEngines/${name}.cfg`] = Exporter.ConvertEngineListToConfig(engines);
        blobs[`GenericEngines/GEAllTankDefinition.cfg`] = AllTankDefinition.Get();
        toFetch.push(["files/PlumeScaleFixer.dll", "GenericEngines/PlumeScaleFixer.dll"]);
        let needsDeployableEngines = false;
        engines.forEach(e => {
            if (!e.Active) {
                return;
            }
            let modelInfo = ModelInfo.GetModelInfo(e.GetModelID());
            let plumeInfo = PlumeInfo.GetPlumeInfo(e.PlumeID);
            let exhaustPlumeInfo = e.UseExhaustEffect && modelInfo.Exhaust ? PlumeInfo.GetPlumeInfo(e.ExhaustPlumeID) : null;
            needsDeployableEngines = needsDeployableEngines || modelInfo.ExtendNozzleAnimation != undefined;
            modelInfo.ModelFiles.forEach(f => {
                if (!toFetch.some(x => x[0] == f)) {
                    toFetch.push([f, f.replace(/^files\//, "GenericEngines/")]);
                }
            });
            plumeInfo.PlumeFiles.forEach(f => {
                if (!toFetch.some(x => x[0] == f)) {
                    toFetch.push([f, f.replace(/^files\//, "")]);
                }
            });
            if (exhaustPlumeInfo) {
                exhaustPlumeInfo.PlumeFiles.forEach(f => {
                    if (!toFetch.some(x => x[0] == f)) {
                        toFetch.push([f, f.replace(/^files\//, "")]);
                    }
                });
            }
        });
        if (needsDeployableEngines) {
            toFetch.push(["files/DeployableEngines/Plugins/DeployableEngines.dll", "DeployableEngines/Plugins/DeployableEngines.dll"]);
            toFetch.push(["files/DeployableEngines/Versioning/DeployableEngines.version", "DeployableEngines/Versioning/DeployableEngines.version"]);
        }
        downloadedFilesCountElement.innerHTML = "0";
        toDownload = toFetch.length;
        document.getElementById("export-to-download").innerHTML = toDownload.toString();
        exportStatusElement.innerHTML = "Downloading files";
        let SendCallbackIfDone = () => {
            downloadedFilesCountElement.innerHTML = (toDownload - toFetch.length).toString();
            if (toFetch.length == 0) {
                exportStatusElement.innerHTML = `<img src="img/load16.gif"> Zipping all files <progress />`;
                let progressElement = exportStatusElement.querySelector("progress");
                let thisRequest = ++RequestRound;
                let zipStart = new Date().getTime();
                FileIO.ZipBlobs("GameData", blobs, zipData => {
                    console.info(`Zipped in ${(new Date().getTime() - zipStart).toLocaleString("us").replace(/[^0-9]/g, "'")}ms`);
                    if (this.IsWorking && thisRequest == RequestRound) {
                        latestData = zipData;
                        exportStatusElement.innerHTML = "Done. <button>Redownload finished zip</button>";
                        exportStatusElement.querySelector("button").onclick = () => {
                            if (latestData) {
                                callback(latestData);
                            }
                        };
                        this.IsWorking = false;
                        callback(zipData);
                    }
                }, (alreadyZippedCount, toZipCount) => {
                    progressElement.value = alreadyZippedCount;
                    progressElement.max = toZipCount;
                });
            }
        };
        toFetch.forEach(resource => {
            resource[2] = document.createElement("div");
            resource[2].innerHTML = `
                <span class="left">${resource[1]}</span>
                <span class="right">Waiting</span>
            `;
            exportBoxContainer.appendChild(resource[2]);
        });
        const SendRequests = () => {
            fetchAborter.abort();
            fetchAborter = new AbortController();
            let thisRound = ++RequestRound;
            toFetch.forEach(resource => {
                resource[2].children[1].innerHTML = "Fetching resource";
                fetch(resource[0], {
                    signal: fetchAborter.signal
                }).then(res => {
                    if (thisRound != RequestRound) {
                        console.warn(`(fetch) Promise finished for expired round: ${resource[0]}`);
                    }
                    if (!res.ok) {
                        resource[2].children[1].innerHTML = "Error. Not fetched";
                        console.warn(`Resource not fetched: ${resource[0]}`);
                        return;
                    }
                    resource[2].children[1].innerHTML = "Downloading";
                    if (this.IsWorking) {
                        res.arrayBuffer().then(data => {
                            if (thisRound != RequestRound) {
                                console.warn(`(download) Promise finished for expired round: ${resource[0]}`);
                            }
                            blobs[resource[1]] = new Uint8Array(data);
                            toFetch = toFetch.filter(x => x != resource);
                            resource[2].remove();
                            SendCallbackIfDone();
                        });
                    }
                }).catch((e) => {
                    if (e.code == 20) {
                        resource[2].children[1].innerHTML = "Refetching resource";
                    }
                    else {
                        resource[2].children[1].innerHTML = "Fetch error";
                        console.warn(`(Fetch error) Resource not fetched: ${resource[0]}`);
                    }
                    return;
                });
            });
        };
        SendRequests();
    }
}
class Serializer {
    static Copy(engine) {
        let [copiedEngine, _] = Serializer.Deserialize(Serializer.Serialize(engine), 0);
        copiedEngine.EngineList = engine.EngineList;
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
    static DeserializeMany(data) {
        let offset = 0;
        let deserializedEngines = [];
        while (offset < data.length) {
            let [engine, addedOffset] = Serializer.Deserialize(data, offset);
            deserializedEngines.push(engine);
            offset += addedOffset;
        }
        if (offset != data.length) {
            console.warn("Possible data corruption?");
        }
        return deserializedEngines;
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
            e.MasterEngineName.length + 2 +
            1 +
            (!e.IsExhaustDefault() ? 1 : 0) * (1 +
                2 +
                8 +
                8 +
                8 +
                1));
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
        output[i++] = !e.IsExhaustDefault() ? 1 : 0;
        if (!e.IsExhaustDefault()) {
            output[i++] = e.UseExhaustEffect ? 1 : 0;
            output[i++] = e.ExhaustPlumeID % 256;
            output[i++] = e.ExhaustPlumeID / 256;
            output.set(BitConverter.DoubleToByteArray(e.ExhaustThrustPercent), i);
            i += 8;
            output.set(BitConverter.DoubleToByteArray(e.ExhaustIspPercent), i);
            i += 8;
            output.set(BitConverter.DoubleToByteArray(e.ExhaustGimbal), i);
            i += 8;
            output[i++] = e.ExhaustGimbalOnlyRoll ? 1 : 0;
        }
        return output;
    }
    static Deserialize(input, startOffset) {
        let output = new Engine();
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
            output.ModelID = input[i++];
            output.ModelID += input[i++] * 256;
            output.PlumeID = input[i++];
            output.PlumeID += input[i++] * 256;
            output.PlumeID = PlumeInfo.MapRealPlumesToGenericPlumes(output.PlumeID);
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
        if (version >= 14) {
            if (input[i++] == 1) {
                output.UseExhaustEffect = input[i++] == 1;
                output.ExhaustPlumeID = input[i++];
                output.ExhaustPlumeID += input[i++] * 256;
                output.ExhaustThrustPercent = BitConverter.ByteArrayToDouble(input, i);
                i += 8;
                output.ExhaustIspPercent = BitConverter.ByteArrayToDouble(input, i);
                i += 8;
                output.ExhaustGimbal = BitConverter.ByteArrayToDouble(input, i);
                i += 8;
                output.ExhaustGimbalOnlyRoll = input[i++] == 1;
            }
        }
        return [output, i - startOffset];
    }
}
Serializer.Version = 14;
class Unit {
    static Display(value, unit, forceUnit, decimalPlaces = 12) {
        if (forceUnit) {
            let trimmed = value.toFixed(decimalPlaces);
            let valueString = value.toString().length >= trimmed.length ? trimmed : value.toString();
            return `${parseFloat(valueString)}${unit}`;
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
        let number = rawValue / closestPrefix[1];
        let trimmed = number.toFixed(decimalPlaces);
        let numberString = number.toString().length >= trimmed.length ? trimmed : number.toString();
        return `${parseFloat(numberString)}${closestPrefix[0]}${targetUnit[1]}`;
    }
    static ParseUnit(rawUnit) {
        if (rawUnit.length == 0) {
            console.error("Bad input unit");
            return [0, ""];
        }
        let imperial = ImperialUnits[rawUnit];
        if (imperial) {
            return imperial;
        }
        if (rawUnit.length == 1) {
            return [1, rawUnit];
        }
        let prefix = MetricPrefix.find(x => x[0] == rawUnit[0]);
        if (prefix) {
            return [prefix[1], rawUnit.substring(1)];
        }
        else {
            if (rawUnit[0] == "c") {
                return [0.01, rawUnit.substring(1)];
            }
            else {
                return [1, rawUnit];
            }
        }
    }
    static Parse(value, baseUnit) {
        let rawInputNumber = /^[0-9,.]+/.exec(value.replace(/ /g, ""));
        let inputNumber = rawInputNumber ? parseFloat(rawInputNumber[0].replace(",", ".")) : 0;
        let rawInputUnit = /[^0-9,.]+$/.exec(value.replace(/ /g, ""));
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
const ImperialUnits = {
    "th": [0.0000254, "m"],
    "in": [0.0254, "m"],
    "''": [0.0254, "m"],
    "ft": [0.3048, "m"],
    "'": [0.3048, "m"],
    "yd": [0.9144, "m"],
    "ch": [20.1168, "m"],
    "fur": [201.168, "m"],
    "mi": [1609.344, "m"],
    "nm": [1852, "m"],
    "gi": [0.1420653125, "l"],
    "pt": [0.56826125, "l"],
    "qt": [1.1365225, "l"],
    "gal": [4.54609, "l"],
    "gr": [0.06479891, "g"],
    "dr": [1.7718451953125, "g"],
    "oz": [28.349523125, "g"],
    "lb": [453.59237, "g"],
    "st": [6350.29318, "g"],
    "qr": [12700.58636, "g"],
    "qtr": [12700.58636, "g"],
    "cwt": [50802.34544, "g"],
    "lbf": [4.4482216152605, "N"],
    "klbf": [4448.2216152605, "N"],
};
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