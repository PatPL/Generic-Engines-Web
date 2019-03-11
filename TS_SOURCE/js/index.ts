addEventListener ("DOMContentLoaded", () => {
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
    
    let test = new HtmlTable (document.getElementById ("list-container")!);
    let test1: Engine[] = [
        new Engine (),
        new Engine (),
        new Engine (),
    ];
    
    test.Columns = HtmlTable.AutoGenerateColumns (new Engine ());
    test.Items = test1;
    test.RebuildTable ();
    
    console.log (test);
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
    
}

function RemoveButton_Click () {
    
}

function SettingsButton_Click () {
    
}

function HelpButton_Click () {
    
}
