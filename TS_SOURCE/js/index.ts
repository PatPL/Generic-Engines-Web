var ListName = "Unnamed";
var EditableFieldMetadata: { [id: string]: IEditable } = {
    ListName: {
        ApplyValueToDisplayElement: e => {
            e.innerHTML = `${ListName}.enl`;
        }
    }
}
let ListNameDisplay: EditableField;
let MainEngineTable: HtmlTable;

let FullscreenWindows: { [id: string]: HTMLElement } = {};

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
    
    //Set correct browser icons
    let imgs = document.querySelectorAll<HTMLImageElement> ("img.browser-relevant");
    imgs.forEach (i => {
        //@ts-ignore
        let isFirefox = typeof InstallTrigger !== 'undefined';
        //@ts-ignore
        let isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
        
        if (isFirefox) {
            i.src += "firefox.png";
        } else if (isOpera) {
            i.src += "opera.png";
        } else {
            i.src += "chrome.png";
        }
    });
    
    //Setup fullscreen windows
    let windows = document.querySelectorAll<HTMLElement> (".fullscreen-box");
    windows.forEach (w => {
        let bg = w.querySelector<HTMLElement> (".fullscreen-grayout")!;
        let content = w.querySelector<HTMLElement> (".fullscreen-content")!;
        
        bg.addEventListener ("click", () => {
            w.style.display = "none";
        });
        
        w.style.display = "none";
        FullscreenWindows[w.id] = w;
    });
    
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
    
    document.getElementById ("option-button-download-list")!.addEventListener ("click", DownloadListButton_Click);
    document.getElementById ("option-button-cache-list")!.addEventListener ("click", CacheListButton_Click);
    document.getElementById ("option-button-clipboard-list")!.addEventListener ("click", ClipboardListButton_Click);
    
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
    FullscreenWindows["save-box"].style.display = "flex";
}

function DownloadListButton_Click () {
    let data = Serializer.SerializeMany (MainEngineTable.Items);
    
    FileIO.SaveBinary (`${ListName}.enl`, data);
    FullscreenWindows["save-box"].style.display = "none";
}

function CacheListButton_Click () {
    let data = Serializer.SerializeMany (MainEngineTable.Items);
    
    if (Store.Exists (`${ListName}.enl`)) {
        Notifier.Error (`${ListName}.enl already exists in the cache. Rename the list or remove the list from cache`);
    } else {
        Notifier.Info (`${ListName}.enl saved in cache`);
        Store.SetBinary (`${ListName}.enl`, data);
        FullscreenWindows["save-box"].style.display = "none";
    }
}

function ClipboardListButton_Click () {
    let data = Serializer.SerializeMany (MainEngineTable.Items);
    
    let b64: string = BitConverter.ByteArrayToBase64 (data);
    
    let success = FileIO.ToClipboard (b64);
    
    if (success) {
        Notifier.Info ("Engine list has been copied to clipboard");
        FullscreenWindows["save-box"].style.display = "none";
    } else {
        Notifier.Warn ("There was an error. Engine list was NOT copied to clipboard");
    }
}

function ValidateButton_Click () {
    let errors = Validator.Validate (MainEngineTable.Items);
    
    if (errors.length == 0) {
        Notifier.Info ("No errors found in this list");
    } else {
        Notifier.Warn ("There are errors in this list");
        alert (`Following errors were found:\n\n-> ${errors.join ("\n-> ")}`);
    }
}

function ExportButton_Click () {
    if (MainEngineTable.Items.length > 0) {
        
        let errors = Validator.Validate (MainEngineTable.Items);
        if (errors.length != 0) {
            Notifier.Error ("Fix validation errors before exporting");
            alert (`Fix following errors before exporting the engine:\n\n-> ${errors.join ("\n-> ")}`);
            return;
        }
        
        let blobs: {[blobname: string]: Uint8Array | string} = {};
        
        blobs[`${ListName}.cfg`] = Exporter.ConvertEngineListToConfig (MainEngineTable.Items);
        blobs[`GEAllTankDefinition.cfg`] = AllTankDefinition.Get ();
        
        let dll = new XMLHttpRequest ();
        dll.open ("GET", "./files/PlumeScaleFixer.dll", true);
        dll.responseType = "arraybuffer";
        dll.addEventListener ("loadend", () => {
            blobs["PlumeScaleFixer.dll"] = new Uint8Array (dll.response);
            
            FileIO.ZipBlobs ("GenericEngines", blobs, zipData => {
                FileIO.SaveBinary (`${ListName}.zip`, zipData);
            });
        });
        dll.send (null);
    }
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
