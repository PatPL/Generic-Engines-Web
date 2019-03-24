var ListName = "Unnamed";
let ListNameDisplay: EditableField;
let MainEngineTable: HtmlTable;

addEventListener ("DOMContentLoaded", () => {
    ListNameDisplay = new EditableField (window, "ListName", document.getElementById ("list-name")!);
    
    //Disable default RMB context menu
    //document.addEventListener('contextmenu', event => event.preventDefault());
    
    //Disable option image dragging (user-select: none; doesn't do it)
    let images = document.querySelectorAll<HTMLElement> (".option-button");
    images.forEach (image => {
        image.ondragstart = () => { return false; }
    });
    
    //Build datalist for Technode input
    let TechNodeAutocomplete = document.createElement ("datalist");
    TechNodeAutocomplete.id = "techNodeItems";
    for (let i in TechNode) {
        let x = parseInt (i);
        if (isNaN (x)) {
            break;
        }
        TechNodeAutocomplete.innerHTML += `<option>${TechNode[x]}</option>`;
    }
    document.body.appendChild (TechNodeAutocomplete);
    
    document.getElementById ("option-button-new")!.addEventListener ("click", NewButton_Click);
    document.getElementById ("option-button-open")!.addEventListener ("click", OpenButton_Click);
    document.getElementById ("option-button-append")!.addEventListener ("click", AppendButton_Click);
    document.getElementById ("option-button-save")!.addEventListener ("click", SaveButton_Click);
    document.getElementById ("option-button-validate")!.addEventListener ("click", ValidateButton_Click);
    document.getElementById ("option-button-export")!.addEventListener ("click", ExportButton_Click);
    document.getElementById ("option-button-duplicate")!.addEventListener ("click", DuplicateButton_Click);
    document.getElementById ("option-button-add")!.addEventListener ("click", AddButton_Click);
    document.getElementById ("option-button-remove")!.addEventListener ("click", RemoveButton_Click);
    
    document.getElementById ("option-button-settings")!.addEventListener ("click", SettingsButton_Click);
    document.getElementById ("option-button-help")!.addEventListener ("click", HelpButton_Click);
    
    MainEngineTable = new HtmlTable (document.getElementById ("list-container")!);
    MainEngineTable.ColumnsDefinitions = Engine.ColumnDefinitions;
    MainEngineTable.RebuildTable ();
    
});

function NewButton_Click () {
    if (MainEngineTable.Items.length == 0 || confirm ("All unsaved changes to this list will be lost.\n\nAre you sure you want to open an empty list?")) {
        MainEngineTable.Items = [];
        MainEngineTable.RebuildTable ();
        
        ListNameDisplay.SetValue ("Unnamed");
    }
}

function OpenButton_Click () {
    if (MainEngineTable.Items.length == 0 || confirm ("All unsaved changes to this list will be lost.\n\nAre you sure you want to open a list from file?")) {
        FileIO.OpenBinary (".enl", (data) => {
            if (data) {
                alert (`got file ${data.length}`);
            } else {
                //No file chosen?
            }
        });
    }
}

function AppendButton_Click () {
    
}

function SaveButton_Click () {
    
}

function ValidateButton_Click () {
    
}

function ExportButton_Click () {
    
}

function DuplicateButton_Click () {
    
}

function AddButton_Click () {
    MainEngineTable.AddItem (new Engine (MainEngineTable.Items));
}

function RemoveButton_Click () {
    MainEngineTable.RemoveSelectedItems ();
}

function SettingsButton_Click () {
    
}

function HelpButton_Click () {
    
}
