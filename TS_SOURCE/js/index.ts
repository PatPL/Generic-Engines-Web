var ListName = "Unnamed";
let ListNameDisplay: EditableField;
let MainEngineTable: HtmlTable;

//Website exit confirmation
window.onbeforeunload = (e) => {
    if (MainEngineTable.Items.length != 0) {
        e.returnValue = "Are you sure that you want to leave this page? You will lose all unsaved data";
        return "Are you sure that you want to leave this page? You will lose all unsaved data";
    } else {
        return;
    }
}

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
        FileIO.OpenBinary (".enl", (data, filename) => {
            if (data) {
                filename = filename.replace (".enl", "");
                ListNameDisplay.SetValue (filename);
                
                MainEngineTable.Items = [];
                Serializer.DeserializeMany (data, MainEngineTable);
                MainEngineTable.RebuildTable ();
            } else {
                //No file chosen?
            }
        });
    }
}

function AppendButton_Click () {
    FileIO.OpenBinary (".enl", (data) => { //TODO: Multiple file input
        if (data) {
            Serializer.DeserializeMany (data, MainEngineTable);
            MainEngineTable.RebuildTable ();
        } else {
            //No file chosen?
        }
    });
}

function SaveButton_Click () {
    let data = Serializer.SerializeMany (MainEngineTable.Items);
    
    FileIO.SaveBinary (`${ListName}.enl`, data);
}

function ValidateButton_Click () {
    let errors = Validator.Validate (MainEngineTable.Items);
    
    if (errors.length == 0) {
        alert ("No errors found in this list");
    } else {
        alert (`Following errors were found:\n\n-> ${errors.join ("\n-> ")}`);
    }
}

function ExportButton_Click () {
    console.log (Exporter.ConvertEngineListToConfig (MainEngineTable.Items));
}

function DuplicateButton_Click () {
    let indices = MainEngineTable.SelectedRows.sort ((a, b) => { return a - b; });
    indices.forEach (index => {
        MainEngineTable.Items.push (Serializer.Copy (MainEngineTable.Rows[index][1]));
    });
    
    MainEngineTable.RebuildTable ();
}

function AddButton_Click () {
    MainEngineTable.AddItem (new Engine (MainEngineTable));
}

function RemoveButton_Click () {
    if (MainEngineTable.SelectedRows.length > 0 && confirm (`You are about to delete ${MainEngineTable.SelectedRows.length} items from the list.\n\nAre you sure?`)) {
        MainEngineTable.RemoveSelectedItems ();
    }
}

function SettingsButton_Click () {
    
}

function HelpButton_Click () {
    
}
