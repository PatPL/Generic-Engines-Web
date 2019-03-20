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
        if (!this.ValueOwner || !this.ValueOwner.hasOwnProperty(this.ValueName)) {
            throw `${this.ValueOwner} or ${this.ValueOwner}.${this.ValueName} is null/undefined`;
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
    for (let i = 0; i < 8; ++i) {
        MainEngineTable.Items.push(new Engine());
    }
    MainEngineTable.Items[1].Gimbal.AdvancedGimbal = true;
    MainEngineTable.Items[1].Gimbal.GimbalNX = 3;
    MainEngineTable.Items[1].Gimbal.GimbalPX = 6;
    MainEngineTable.Items[1].Gimbal.GimbalNY = 9;
    MainEngineTable.Items[1].Gimbal.GimbalPY = 12;
    MainEngineTable.Items[2].Labels.EngineName = "Custom Name";
    MainEngineTable.Items[2].Labels.EngineManufacturer = "R";
    MainEngineTable.Items[2].Labels.EngineDescription = `Mój stary to fanatyk wędkarstwa. Pół mieszkania zajebane wędkami najgorsze. Średnio raz w miesiącu ktoś wdepnie w leżący na ziemi haczyk czy kotwicę i trzeba wyciągać w szpitalu bo mają zadziory na końcu. W swoim 22 letnim życiu już z 10 razy byłem na takim zabiegu. Tydzień temu poszedłem na jakieś losowe badania to baba z recepcji jak mnie tylko zobaczyła to kazała buta ściągać xD bo myślała, że znowu hak w nodze.

    Druga połowa mieszkania zajebana Wędkarzem Polskim, Światem Wędkarza, Super Karpiem xD itp. Co tydzień ojciec robi objazd po wszystkich kioskach w mieście, żeby skompletować wszystkie wędkarskie tygodniki. Byłem na tyle głupi, że nauczyłem go into internety bo myślałem, że trochę pieniędzy zaoszczędzimy na tych gazetkach ale teraz nie dosyć, że je kupuje to jeszcze siedzi na jakichś forach dla wędkarzy i kręci gównoburze z innymi wędkarzami o najlepsze zanęty itp. Potrafi drzeć mordę do monitora albo wypierdolić klawiaturę za okno. Kiedyś ojciec mnie wkurwił to założyłem tam konto i go trolowałem pisząc w jego tematach jakieś losowe głupoty typu karasie jedzo guwno. Matka nie nadążała z gotowaniem bigosu na uspokojenie. Aha, ma już na forum rangę SUM, za najebanie 10k postów."
    
    "Jak jest ciepło to co weekend zapierdala na ryby. Od jakichś 5 lat w każdą niedzielę jem rybę na obiad a ojciec pierdoli o zaletach jedzenia tego wodnego gówna. Jak się dostałem na studia to stary przez tydzień pie**olił że to dzięki temu, że jem dużo ryb bo zawierają fosfor i mózg mi lepiej pracuje.
    
    Co sobotę budzi ze swoim znajomym mirkiem całą rodzinę o 4 w nocy bo hałasują pakując wędki, robiąc kanapki itd.
    
    Przy jedzeniu zawsze pierdoli o rybach i za każdym razem temat schodzi w końcu na Polski Związek Wędkarski, ojciec sam się nakręca i dostaje strasznego bólu dupy durr niedostatecznie zarybiajo tylko kradno hurr, robi się przy tym cały czerwony i odchodzi od stołu klnąc i idzie czytać Wielką Encyklopedię Ryb Rzecznych żeby się uspokoić.
    
    W tym roku sam sobie kupił na święta ponton. Oczywiście do wigilii nie wytrzymał tylko już wczoraj go rozpakował i nadmuchał w dużym pokoju. Ubrał się w ten swój cały strój wędkarski i siedział cały dzień w tym pontonie na środku mieszkania. Obiad (karp) też w nim zjadł [cool][cześć]
    
    Gdybym mnie na długość ręki dopuścili do wszystkich ryb w polsce to bym wziął i zapierdolił.
    
    Jak któregoś razu, jeszcze w podbazie czy gimbazie, miałem urodziny to stary jako prezent wziął mnie ze sobą na ryby w drodze wyjątku. Super prezent kurwo.
    
    Pojechaliśmy gdzieś wpizdu za miasto, dochodzimy nad jezioro a ojcu już się oczy świecą i oblizuje wargi podniecony. Rozłożył cały sprzęt i siedzimy nad woda i patrzymy na spławiki. Po pięciu minutach mi się znudziło więc włączyłem discmana to mnie ojciec pierdolnął wędką po głowie, że ryby słyszą muzykę z moich słuchawek i się płoszą. Jak się chciałem podrapać po dupie to zaraz 'krzyczał szeptem', żebym się nie wiercił bo szeleszczę i ryby z wody widzą jak się ruszam i uciekają. 6 godzin musiałem siedzieć w bezruchu i patrzeć na wodę jak w jakimś jebanym Guantanamo. Urodziny mam w listopadzie więc jeszcze do tego było zimno jak sam skurwysyn. W pewnym momencie ojciec odszedł kilkanaście metrów w las i się spierdział. Wytłumaczył mi, że trzeba w lesie pierdzieć bo inaczej ryby słyszą i czują.
    
    Wspomniałem, że ojciec ma kolegę mirka, z którym jeździ na ryby. Kiedyś towarzyszem wypraw rybnych był hehe Zbyszek. Człowiek o kształcie piłki z wąsem i 365 dni w roku w kamizelce BOMBER. Byli z moim ojcem prawie jak bracia, przychodził z żoną Bożeną na wigilie do nas itd. Raz ojciec miał imieniny zbysio przyszedł na hehe kielicha. Najebali się i oczywiście cały czas gadali o wędkowaniu i rybach. Ja siedziałem u siebie w pokoju. W pewnym momencie zaczeli drzeć na siebie mordę, czy generalnie lepsze są szczupaki czy sumy.`;
    MainEngineTable.Items[3].Visuals.ModelID = Model.Skipper;
    MainEngineTable.Items[3].Visuals.PlumeID = Plume.Hypergolic_Lower;
    MainEngineTable.Items[1].TestFlight.RatedBurnTime = 240;
    MainEngineTable.Items[2].TestFlight.EnableTestFlight = true;
    MainEngineTable.Items[3].TestFlight.EnableTestFlight = true;
    MainEngineTable.Items[3].TestFlight.RatedBurnTime = 240;
    MainEngineTable.Items[1].FuelRatios.Items.push([Fuel.NTO, 4]);
    MainEngineTable.Items[2].FuelRatios.Items.push([Fuel.ElectricCharge, 60]);
    MainEngineTable.Items[3].FuelRatios.Items.push([Fuel.LqdOxygen, 2]);
    MainEngineTable.Items[3].FuelRatios.Items.push([Fuel.ElectricCharge, 800]);
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
class FuelInfo {
    static GetFuelInfo(id) {
        return FuelInfo.fuels[id];
    }
    static BuildDropdown() {
        let output = document.createElement("select");
        FuelInfo.fuels.forEach((v, i) => {
            let option = document.createElement("option");
            option.value = i.toString();
            option.text = v.FuelName;
            output.appendChild(option);
        });
        return output;
    }
}
FuelInfo.fuels = [
    {
        FuelName: "Electric Charge",
        FuelID: "ElectricCharge",
        TankUtilisation: 1000,
        Density: 0.0
    }, {
        FuelName: "Liquid Oxygen",
        FuelID: "LqdOxygen",
        TankUtilisation: 1,
        Density: 0.001141
    }, {
        FuelName: "Kerosene",
        FuelID: "Kerosene",
        TankUtilisation: 1,
        Density: 0.00082
    }, {
        FuelName: "Liquid Hydrogen",
        FuelID: "LqdHydrogen",
        TankUtilisation: 1,
        Density: 0.00007085
    }, {
        FuelName: "NTO",
        FuelID: "NTO",
        TankUtilisation: 1,
        Density: 0.00145
    }, {
        FuelName: "UDMH",
        FuelID: "UDMH",
        TankUtilisation: 1,
        Density: 0.000791
    }, {
        FuelName: "Aerozine50",
        FuelID: "Aerozine50",
        TankUtilisation: 1,
        Density: 0.0009
    }, {
        FuelName: "MMH",
        FuelID: "MMH",
        TankUtilisation: 1,
        Density: 0.00088
    }, {
        FuelName: "HTP",
        FuelID: "HTP",
        TankUtilisation: 1,
        Density: 0.001431
    }, {
        FuelName: "Aviation Gasoline (Avgas)",
        FuelID: "AvGas",
        TankUtilisation: 1,
        Density: 0.000719
    }, {
        FuelName: "IRFNA III",
        FuelID: "IRFNA_III",
        TankUtilisation: 1,
        Density: 0.001658
    }, {
        FuelName: "Nitrous Oxide",
        FuelID: "NitrousOxide",
        TankUtilisation: 1,
        Density: 0.00000196
    }, {
        FuelName: "Aniline",
        FuelID: "Aniline",
        TankUtilisation: 100,
        Density: 0.00102
    }, {
        FuelName: "Ethanol 75%",
        FuelID: "Ethanol75",
        TankUtilisation: 1,
        Density: 0.00084175
    }, {
        FuelName: "Ethanol 90%",
        FuelID: "Ethanol90",
        TankUtilisation: 1,
        Density: 0.0008101
    }, {
        FuelName: "Ethanol",
        FuelID: "Ethanol",
        TankUtilisation: 1,
        Density: 0.000789
    }, {
        FuelName: "Liquid Ammonia",
        FuelID: "LqdAmmonia",
        TankUtilisation: 1,
        Density: 0.0007021
    }, {
        FuelName: "Liquid Methane",
        FuelID: "LqdMethane",
        TankUtilisation: 1,
        Density: 0.00042561
    }, {
        FuelName: "ClF3",
        FuelID: "ClF3",
        TankUtilisation: 1,
        Density: 0.00177
    }, {
        FuelName: "ClF5",
        FuelID: "ClF5",
        TankUtilisation: 1,
        Density: 0.0019
    }, {
        FuelName: "Diborane",
        FuelID: "Diborane",
        TankUtilisation: 1,
        Density: 0.000421
    }, {
        FuelName: "Pentaborane",
        FuelID: "Pentaborane",
        TankUtilisation: 1,
        Density: 0.000618
    }, {
        FuelName: "Ethane",
        FuelID: "Ethane",
        TankUtilisation: 1,
        Density: 0.000544
    }, {
        FuelName: "Ethylene",
        FuelID: "Ethylene",
        TankUtilisation: 1,
        Density: 0.000568
    }, {
        FuelName: "OF2",
        FuelID: "",
        TankUtilisation: 1,
        Density: 0.0019
    }, {
        FuelName: "Liquid Fluorine",
        FuelID: "LqdFluorine",
        TankUtilisation: 1,
        Density: 0.001505
    }, {
        FuelName: "N2F4",
        FuelID: "N2F4",
        TankUtilisation: 1,
        Density: 0.001604
    }, {
        FuelName: "Methanol",
        FuelID: "Methanol",
        TankUtilisation: 1,
        Density: 0.0007918
    }, {
        FuelName: "Furfuryl",
        FuelID: "Furfuryl",
        TankUtilisation: 1,
        Density: 0.00113
    }, {
        FuelName: "UH25",
        FuelID: "UH25",
        TankUtilisation: 1,
        Density: 0.000829
    }, {
        FuelName: "Tonka250",
        FuelID: "Tonka250",
        TankUtilisation: 1,
        Density: 0.000873
    }, {
        FuelName: "Tonka500",
        FuelID: "Tonka500",
        TankUtilisation: 1,
        Density: 0.000811
    }, {
        FuelName: "IWFNA",
        FuelID: "IWFNA",
        TankUtilisation: 1,
        Density: 0.001513
    }, {
        FuelName: "IRFNA IV",
        FuelID: "IRFNA_IV",
        TankUtilisation: 1,
        Density: 0.001995
    }, {
        FuelName: "AK20",
        FuelID: "AK20",
        TankUtilisation: 1,
        Density: 0.001499
    }, {
        FuelName: "AK27",
        FuelID: "AK27",
        TankUtilisation: 1,
        Density: 0.001494
    }, {
        FuelName: "MON3",
        FuelID: "MON3",
        TankUtilisation: 1,
        Density: 0.001423
    }, {
        FuelName: "MON10",
        FuelID: "MON10",
        TankUtilisation: 1,
        Density: 0.001407
    }, {
        FuelName: "Hydyne",
        FuelID: "Hydyne",
        TankUtilisation: 1,
        Density: 0.00086
    }, {
        FuelName: "Syntin",
        FuelID: "Syntin",
        TankUtilisation: 1,
        Density: 0.000851
    }, {
        FuelName: "Hydrazine",
        FuelID: "Hydrazine",
        TankUtilisation: 1,
        Density: 0.001004
    }, {
        FuelName: "Nitrogen",
        FuelID: "Nitrogen",
        TankUtilisation: 1,
        Density: 0.000001251
    }, {
        FuelName: "Helium",
        FuelID: "Helium",
        TankUtilisation: 200,
        Density: 0.0000001786
    }, {
        FuelName: "CaveaB",
        FuelID: "CaveaB",
        TankUtilisation: 200,
        Density: 0.001501
    }, {
        FuelName: "Liquid Fuel",
        FuelID: "LiquidFuel",
        TankUtilisation: 1,
        Density: 0.001
    }, {
        FuelName: "Oxidizer",
        FuelID: "Oxidizer",
        TankUtilisation: 1,
        Density: 0.001
    }, {
        FuelName: "Monopropellant",
        FuelID: "MonoPropellant",
        TankUtilisation: 1,
        Density: 0.0008
    }, {
        FuelName: "Xenon Gas",
        FuelID: "XenonGas",
        TankUtilisation: 1,
        Density: 0.000005894
    }, {
        FuelName: "Intake Air",
        FuelID: "IntakeAir",
        TankUtilisation: 100,
        Density: 0.001225
    }, {
        FuelName: "Solid Fuel",
        FuelID: "SolidFuel",
        TankUtilisation: 1,
        Density: 0.0075
    }, {
        FuelName: "HNIW",
        FuelID: "HNIW",
        TankUtilisation: 1,
        Density: 0.002044
    }, {
        FuelName: "HTPB",
        FuelID: "HTPB",
        TankUtilisation: 1,
        Density: 0.00177
    }, {
        FuelName: "NGNC",
        FuelID: "NGNC",
        TankUtilisation: 1,
        Density: 0.0016
    }, {
        FuelName: "PBAN",
        FuelID: "PBAN",
        TankUtilisation: 1,
        Density: 0.001772
    }, {
        FuelName: "PSPC",
        FuelID: "PSPC",
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
class Dimensions {
    constructor() {
        this.UseBaseWidth = true;
        this.Width = 1;
        this.Height = 2;
    }
    GetDisplayElement() {
        let tmp = document.createElement("div");
        tmp.classList.add("content-cell-content");
        return tmp;
    }
    ApplyValueToDisplayElement(e) {
        e.innerHTML = `${this.Width}m x ${this.Height}m`;
    }
    GetEditElement() {
        let tmp = document.createElement("div");
        tmp.classList.add("content-cell-content");
        tmp.style.height = "72px";
        tmp.style.padding = "0";
        let grid = document.createElement("div");
        grid.style.display = "grid";
        grid.style.gridTemplateColumns = "60px auto 24px";
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
    }
    ApplyValueToEditElement(e) {
        let inputs = e.querySelectorAll("input");
        inputs[0].checked = this.UseBaseWidth;
        inputs[1].value = this.Width.toString();
        inputs[2].value = this.Height.toString();
        e.querySelector("span").innerHTML = inputs[0].checked ? "Base width" : "Bell width";
    }
    ApplyChangesToValue(e) {
        let inputs = e.querySelectorAll("input");
        this.UseBaseWidth = inputs[0].checked;
        this.Width = parseFloat(inputs[1].value.replace(",", "."));
        this.Height = parseFloat(inputs[2].value.replace(",", "."));
    }
}
class Engine {
    constructor() {
        this.EditableFieldMetadata = {
            Mass: {
                ApplyValueToDisplayElement: (e) => {
                    e.innerHTML = `${this.Mass}t`;
                }
            }, Thrust: {
                ApplyValueToDisplayElement: (e) => {
                    e.innerHTML = `${this.Thrust}kN`;
                }
            }, AtmIsp: {
                ApplyValueToDisplayElement: (e) => {
                    e.innerHTML = `${this.AtmIsp}s`;
                }
            }, VacIsp: {
                ApplyValueToDisplayElement: (e) => {
                    e.innerHTML = `${this.VacIsp}s`;
                }
            }, Cost: {
                ApplyValueToDisplayElement: (e) => {
                    e.innerHTML = `${this.Cost}VF`;
                }
            }, MinThrust: {
                ApplyValueToDisplayElement: (e) => {
                    e.innerHTML = `${this.MinThrust}%`;
                }
            }, AlternatorPower: {
                ApplyValueToDisplayElement: (e) => {
                    e.innerHTML = `${this.AlternatorPower}kW`;
                }
            }
        };
        this.Active = false;
        this.ID = "New-Engine";
        this.Mass = 1;
        this.Thrust = 1000;
        this.AtmIsp = 250;
        this.VacIsp = 300;
        this.Cost = 1000;
        this.MinThrust = 90;
        this.Ignitions = 1;
        this.PressureFed = false;
        this.NeedsUllage = true;
        this.AlternatorPower = 0;
        this.TechUnlockNode = TechNode.start;
        this.EngineVariant = EngineType.Liquid;
        this.FuelRatios = new FuelRatios();
        this.Dimensions = new Dimensions();
        this.Gimbal = new Gimbal();
        this.TestFlight = new TestFlight();
        this.Visuals = new Visuals();
        this.Labels = new Labels();
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
class FuelRatios {
    constructor() {
        this.Items = [[Fuel.Hydrazine, 1]];
        this.FuelVolumeRatios = false;
    }
    GetDisplayElement() {
        let tmp = document.createElement("div");
        tmp.classList.add("content-cell-content");
        return tmp;
    }
    ApplyValueToDisplayElement(e) {
        let fuels = [];
        let electric = 0;
        let output = "";
        this.Items.forEach(v => {
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
    }
    GetEditElement() {
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
            <div style="grid-area: a;"><img class="mini-button option-button" src="img/button/add-mini.png"></div>
            <div style="grid-area: b;"><img class="mini-button option-button" src="img/button/remove-mini.png"></div>
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
            tmp[tmp.length - 1].remove();
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
    }
    ApplyValueToEditElement(e) {
        let table = e.querySelector("tbody");
        let rows = e.querySelectorAll("tr");
        rows.forEach((v, i) => {
            if (i != 0) {
                v.remove();
            }
        });
        this.Items.forEach(v => {
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
        e.querySelector("span").innerHTML = e.querySelector(`input[type="checkbox"]`).checked ? "Volume ratio" : "Mass ratio";
    }
    ApplyChangesToValue(e) {
        let selects = e.querySelectorAll("select");
        let inputs = e.querySelectorAll(`input`);
        if (selects.length + 1 != inputs.length) {
            console.warn("table misaligned?");
        }
        this.Items = [];
        for (let i = 0; i < selects.length; ++i) {
            this.Items.push([parseInt(selects[i].value), parseFloat(inputs[i + 1].value)]);
        }
    }
}
class Gimbal {
    constructor() {
        this.Gimbal = 6;
        this.AdvancedGimbal = false;
        this.GimbalNX = 30;
        this.GimbalPX = 30;
        this.GimbalNY = 0;
        this.GimbalPY = 0;
    }
    GetDisplayElement() {
        let tmp = document.createElement("div");
        tmp.classList.add("content-cell-content");
        return tmp;
    }
    ApplyValueToDisplayElement(e) {
        if (this.AdvancedGimbal) {
            e.innerHTML = `X:<-${this.GimbalNX}°:${this.GimbalPX}°>, Y:<-${this.GimbalNY}°:${this.GimbalPY}°>`;
        }
        else {
            e.innerHTML = `${this.Gimbal}°`;
        }
    }
    GetEditElement() {
        let tmp = document.createElement("div");
        tmp.classList.add("content-cell-content");
        tmp.style.height = "72px";
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
        checkboxLabel.style.top = "-3px";
        checkboxLabel.style.left = "4px";
        checkboxLabel.innerHTML = "Advanced gimbal";
        tmp.children[0].appendChild(checkbox);
        tmp.children[0].appendChild(checkboxLabel);
        baseDiv.setAttribute("data-ref", "basediv");
        baseDiv.style.display = "grid";
        baseDiv.style.gridTemplateColumns = "94px auto 4px";
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
        advDiv.style.gridTemplateColumns = "114px auto auto 4px";
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
    }
    ApplyValueToEditElement(e) {
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
    }
    ApplyChangesToValue(e) {
        this.AdvancedGimbal = e.querySelector(`input[data-ref="checkbox"]`).checked;
        this.Gimbal = parseFloat(e.querySelector(`input[data-ref="gimbal"]`).value.replace(",", "."));
        this.GimbalPX = parseFloat(e.querySelector(`input[data-ref="gimbalpx"]`).value.replace(",", "."));
        this.GimbalNY = parseFloat(e.querySelector(`input[data-ref="gimbalny"]`).value.replace(",", "."));
        this.GimbalPY = parseFloat(e.querySelector(`input[data-ref="gimbalpy"]`).value.replace(",", "."));
        this.GimbalNX = parseFloat(e.querySelector(`input[data-ref="gimbalnx"]`).value.replace(",", "."));
    }
}
class Labels {
    constructor() {
        this.EngineName = "";
        this.EngineManufacturer = "Generic Engines";
        this.EngineDescription = "This engine was generated by Generic Engines";
    }
    GetDisplayElement() {
        let tmp = document.createElement("div");
        tmp.classList.add("content-cell-content");
        return tmp;
    }
    ApplyValueToDisplayElement(e) {
        if (this.EngineName == "") {
            e.innerHTML = `<<< Same as ID`;
        }
        else {
            e.innerHTML = `${this.EngineName}`;
        }
    }
    GetEditElement() {
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
    }
    ApplyValueToEditElement(e) {
        let inputs = e.querySelectorAll("input");
        inputs[0].value = this.EngineName;
        inputs[1].value = this.EngineManufacturer;
        e.querySelector("textarea").value = this.EngineDescription;
    }
    ApplyChangesToValue(e) {
        let inputs = e.querySelectorAll("input");
        this.EngineName = inputs[0].value;
        this.EngineManufacturer = inputs[1].value;
        this.EngineDescription = e.querySelector("textarea").value;
    }
}
class TestFlight {
    constructor() {
        this.EnableTestFlight = false;
        this.RatedBurnTime = 180;
        this.StartReliability0 = 92;
        this.StartReliability10k = 96;
        this.CycleReliability0 = 90;
        this.CycleReliability10k = 98;
    }
    static IsDefault(config) {
        let defaultConfig = new TestFlight();
        return (config.EnableTestFlight == defaultConfig.EnableTestFlight &&
            config.RatedBurnTime == defaultConfig.RatedBurnTime &&
            config.StartReliability0 == defaultConfig.StartReliability0 &&
            config.StartReliability10k == defaultConfig.StartReliability10k &&
            config.CycleReliability0 == defaultConfig.CycleReliability0 &&
            config.CycleReliability10k == defaultConfig.CycleReliability10k);
    }
    GetDisplayElement() {
        let tmp = document.createElement("div");
        tmp.classList.add("content-cell-content");
        return tmp;
    }
    ApplyValueToDisplayElement(e) {
        if (this.EnableTestFlight) {
            e.innerHTML = `Enabled | ${this.StartReliability0}% - ${this.StartReliability10k}% | ${Math.round((1 / (1 - (this.CycleReliability0 / 100))) * this.RatedBurnTime)}s - ${Math.round((1 / (1 - (this.CycleReliability10k / 100))) * this.RatedBurnTime)}s`;
        }
        else {
            if (TestFlight.IsDefault(this)) {
                e.innerHTML = `Disabled`;
            }
            else {
                e.innerHTML = `Disabled, but configured`;
            }
        }
    }
    GetEditElement() {
        let tmp = document.createElement("div");
        tmp.classList.add("content-cell-content");
        tmp.style.height = "144px";
        tmp.style.padding = "0";
        let grid = document.createElement("div");
        grid.style.display = "grid";
        grid.style.gridTemplateColumns = "310px auto 26px";
        grid.style.gridTemplateRows = "24px 24px 24px 24px 24px 24px";
        grid.style.gridTemplateAreas = `
            "a b b"
            "c d e"
            "f g h"
            "i j k"
            "l m n"
            "o p q"
        `;
        grid.innerHTML = `
            <div class="content-cell-content" style="grid-area: a;">Enable Test Flight</div>
            <div class="content-cell-content" style="grid-area: b;"><input type="checkbox" style="position: relative; top: -1px;"></div>
            
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
    }
    ApplyValueToEditElement(e) {
        let inputs = e.querySelectorAll("input");
        inputs[0].checked = this.EnableTestFlight;
        inputs[1].value = this.RatedBurnTime.toString();
        inputs[2].value = this.StartReliability0.toString();
        inputs[3].value = this.StartReliability10k.toString();
        inputs[4].value = this.CycleReliability0.toString();
        inputs[5].value = this.CycleReliability10k.toString();
    }
    ApplyChangesToValue(e) {
        let inputs = e.querySelectorAll("input");
        this.EnableTestFlight = inputs[0].checked;
        this.RatedBurnTime = parseInt(inputs[1].value);
        this.StartReliability0 = parseFloat(inputs[2].value.replace(",", "."));
        this.StartReliability10k = parseFloat(inputs[3].value.replace(",", "."));
        this.CycleReliability0 = parseFloat(inputs[4].value.replace(",", "."));
        this.CycleReliability10k = parseFloat(inputs[5].value.replace(",", "."));
    }
}
class Visuals {
    constructor() {
        this.ModelID = Model.LR91;
        this.PlumeID = Plume.Kerolox_Upper;
    }
    GetDisplayElement() {
        let tmp = document.createElement("div");
        tmp.classList.add("content-cell-content");
        return tmp;
    }
    ApplyValueToDisplayElement(e) {
        e.innerHTML = `${ModelInfo.GetModelInfo(this.ModelID).ModelName}, ${PlumeInfo.GetPlumeInfo(this.PlumeID).PlumeName}`;
    }
    GetEditElement() {
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
    }
    ApplyValueToEditElement(e) {
        let selects = e.querySelectorAll("select");
        selects[0].value = this.ModelID.toString();
        selects[1].value = this.PlumeID.toString();
    }
    ApplyChangesToValue(e) {
        let selects = e.querySelectorAll("select");
        this.ModelID = parseInt(selects[0].value);
        this.PlumeID = parseInt(selects[1].value);
    }
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