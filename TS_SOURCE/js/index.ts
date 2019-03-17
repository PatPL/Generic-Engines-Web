let ListName = "Unnamed";
let MainEngineTable: HtmlTable;

addEventListener ("DOMContentLoaded", () => {
    //Disable default RMB context menu
    document.addEventListener('contextmenu', event => event.preventDefault());
    
    //Disable option image dragging (user-select: none; doesn't do it)
    let images = document.querySelectorAll<HTMLElement> (".option-button");
    images.forEach (image => {
        image.ondragstart = () => { return false; }
    });
    
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
    
    let ListNameDisplay = new EditableField (window, "ListName", document.getElementById ("list-name")!);
    
    //=
    
    MainEngineTable = new HtmlTable (document.getElementById ("list-container")!);
    
    for (let i = 0; i < 64; ++i) {
        MainEngineTable.Items.push (new Engine ());
    }
    
    MainEngineTable.ColumnsDefinitions = HtmlTable.AutoGenerateColumns (new Engine ());
    
    MainEngineTable.RebuildTable ();
    
});

function NewButton_Click () {
    
}

function OpenButton_Click () {
    
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
    MainEngineTable.AddItem (new Engine ());
}

function RemoveButton_Click () {
    MainEngineTable.RemoveSelectedItems ();
}

function SettingsButton_Click () {
    
}

function HelpButton_Click () {
    
}
