///<reference path="DialogBoxes/SettingsDialog.ts" />
var ListName = "Unnamed";
var EditableFieldMetadata: { [id: string]: IEditable<any> } = {
    ListName: {
        ApplyValueToDisplayElement: e => {
            e.innerHTML = `${ListName}.enl`;
        }
    }
}
let ListNameDisplay: EditableField;
let MainEngineTable: HtmlTable<Engine>;

let FullscreenWindows: { [id: string]: HTMLElement } = {};

//Website exit confirmation
window.onbeforeunload = (e: any) => {
    if (MainEngineTable.Items.length != 0) {
        e.returnValue = "Are you sure that you want to leave this page? You will lose all unsaved data";
        return "Are you sure that you want to leave this page? You will lose all unsaved data";
    } else {
        return;
    }
}

function ApplySettings () {
    //Set color palette for dark/other theme
    (document.getElementById ("css-palette")! as HTMLLinkElement).href = Settings.dark_theme ? "css/darkPalette.css" : "css/classicPalette.css";

    //Toggle info panel
    document.documentElement.style.setProperty ("--infoPanelWidth", `${Settings.show_info_panel ? 320 : 0}px`);
}

ApplySettings ();

function ApplyEngineToInfoPanel (engine: Engine, clear: boolean = false) {
    if (!Settings.show_info_panel) {
        return;
    }
    
    let gravity = 9.8066;
    let infoPanel = document.getElementById ("info-panel")!;    
    let properties: { [id: string]: string } = {};
    
    let engineMass = engine.GetMass ();
    
    let propellantMass = 0;
    engine.GetConstrainedTankContents ().forEach (i => {
        propellantMass += i[1] * FuelInfo.GetFuelInfo (i[0]).Density;
    });
    
    let massFlow = engine.VacIsp; // s
    massFlow *= 9.8066; // N*s/kg
    massFlow = 1 / massFlow; // kg/N*s -> t/kN*s
    massFlow *= engine.Thrust // t/s
    
    let detailedMassFlow = engine.GetEngineMassFlow ();
    let detailedBurnTime = engine.GetEngineBurnTime ();
    
    // ==
    
    properties["id"] = engine.ID;
    
    properties["dry_mass"] = Unit.Display (engineMass, "t", Settings.classic_unit_display, 6);
    properties["wet_mass"] = Unit.Display (engineMass+ propellantMass, "t", Settings.classic_unit_display, 6);
    
    properties["thrust_min_vac"] = Unit.Display (engine.Thrust * engine.MinThrust / 100, "kN", Settings.classic_unit_display, 3);
    properties["thrust_max_vac"] = Unit.Display (engine.Thrust, "kN", Settings.classic_unit_display, 3);
    properties["thrust_min_atm"] = Unit.Display (engine.Thrust * engine.MinThrust / 100 * engine.AtmIsp / engine.VacIsp, "kN", Settings.classic_unit_display, 3);
    properties["thrust_max_atm"] = Unit.Display (engine.Thrust * engine.AtmIsp / engine.VacIsp, "kN", Settings.classic_unit_display, 3);
    
    properties["twr_wet_vac"] = (engine.Thrust / (engineMass + propellantMass) / gravity).toFixed (3);
    properties["twr_dry_vac"] = (engine.Thrust / (engineMass) / gravity).toFixed (3);
    properties["twr_wet_atm"] = (engine.Thrust * engine.AtmIsp / engine.VacIsp / (engineMass + propellantMass) / gravity).toFixed (3);
    properties["twr_dry_atm"] = (engine.Thrust * engine.AtmIsp / engine.VacIsp / (engineMass) / gravity).toFixed (3);
    
    properties["twr_wet_vac_min"] = (engine.Thrust * engine.MinThrust / 100 / (engineMass + propellantMass) / gravity).toFixed (3);
    properties["twr_dry_vac_min"] = (engine.Thrust * engine.MinThrust / 100 / (engineMass) / gravity).toFixed (3);
    properties["twr_wet_atm_min"] = (engine.Thrust * engine.MinThrust / 100 * engine.AtmIsp / engine.VacIsp / (engineMass + propellantMass) / gravity).toFixed (3);
    properties["twr_dry_atm_min"] = (engine.Thrust * engine.MinThrust / 100 * engine.AtmIsp / engine.VacIsp / (engineMass) / gravity).toFixed (3);
    
    properties["min_mass_flow"] = `${Unit.Display (massFlow * engine.MinThrust / 100, "t", Settings.classic_unit_display, 3)}/s`;
    properties["max_mass_flow"] = `${Unit.Display (massFlow, "t", Settings.classic_unit_display, 3)}/s`;
    
    properties["mass_flow_detail"] = "<ul>";
    detailedMassFlow.forEach (([fuel, flow]) => {
        if (fuel == Fuel.ElectricCharge) {
            properties["mass_flow_detail"] += `<li><span class='abbr' title='1 kilowatt (kW) is equal to 1 unit of Electric Charge per second (u/s) in game'>Electricity: ${Unit.Display (flow, "kW", Settings.classic_unit_display, 3)}</span></li>`
        } else {
            let fuelInfo = FuelInfo.GetFuelInfo (fuel);
            properties["mass_flow_detail"] += `<li>${fuelInfo.FuelName}: ${Unit.Display (flow, "t", Settings.classic_unit_display, 3)}/s<br>`;
            properties["mass_flow_detail"] += `<span class='abbr' title='1 litre per second (L/s) is equal to 1 unit per second (u/s) in game'>${Unit.Display (flow / fuelInfo.Density, "L", Settings.classic_unit_display, 3)}/s</li>`;
        }
    })
    properties["mass_flow_detail"] += "</ul>";
    
    properties["burn_time_detail"] = "<ul>";
    detailedBurnTime.forEach (([fuel, time]) => {
        if (fuel == Fuel.ElectricCharge) {
            // Don't include Electric Charge
        } else {
            let fuelInfo = FuelInfo.GetFuelInfo (fuel);
            properties["burn_time_detail"] += `<li>${fuelInfo.FuelName}: ${Unit.Display (time, "", true, 2)}s<br>`;
        }
    })
    properties["burn_time_detail"] += "</ul>";
    
    // ==
    
    for (let i in properties) {
        let element = infoPanel.querySelector (`span[info-field="${i}"]`);
        
        if (element) {
            element.innerHTML = clear ? "" : properties[i];
        }
    }
}

addEventListener ("DOMContentLoaded", () => {
    ListNameDisplay = new EditableField (window, "ListName", document.getElementById ("list-name")!);
    
    //Info panel resize
    let infoPanel = document.getElementById ("info-panel")!;
    let mainCSS = document.getElementById ("main-css")!;
    document.getElementById ("info-panel-resize")!.addEventListener ("pointerdown", e => {
        // Only listen for LMB presses
        if (e.which != 1) { return; }
        
        let originalX = Input.MouseX;
        let originalWidth = parseFloat (document.documentElement.style.getPropertyValue ("--infoPanelWidth"));
        originalWidth = isNaN (originalWidth) ? 200 : originalWidth;
        Dragger.Drag (() => {
            let newWidth = originalWidth - Input.MouseX + originalX;
            newWidth = Math.max (50, newWidth);
            document.documentElement.style.setProperty ("--infoPanelWidth", `${newWidth}px`);
        });
    });
    
    //File drag&drop (append list)
    window.addEventListener ("dragover", e => {
        e.stopPropagation ();
        e.preventDefault ();
        
        if (e.dataTransfer) {
            e.dataTransfer.dropEffect = "copy";
        }
    });
    window.addEventListener ("drop", e => {
        e.stopPropagation ();
        e.preventDefault ();
        
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
                let data = new Uint8Array (reader.result as ArrayBuffer);
                
                let newEngines = Serializer.DeserializeMany (data);
                newEngines.forEach (e => {
                    e.EngineList = MainEngineTable.Items;
                });
                MainEngineTable.AddItems (newEngines);
                
                Notifier.Info (`Appended ${newEngines.length} engine${newEngines.length > 1 ? "s" : ""} using drag&drop`);
            }

            reader.readAsArrayBuffer(files[i]);
        }
        
    });
    
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
            i.src = i.src.replace ("()", "firefox");
        } else if (isOpera) {
            i.src = i.src.replace ("()", "opera");
        } else {
            i.src = i.src.replace ("()", "chrome");
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
        
        TechNodeAutocomplete.innerHTML += `<option>${TechNodeNames.get (x)}</option>`;
    }
    document.body.appendChild (TechNodeAutocomplete);
    
    document.getElementById ("option-button-new")!.addEventListener ("click", NewButton_Click);
    document.getElementById ("option-button-open")!.addEventListener ("click", OpenButton_Click);
    document.getElementById ("option-button-save")!.addEventListener ("click", SaveButton_Click);
    document.getElementById ("option-button-cache")!.addEventListener ("click", CacheButton_Click);
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
    document.getElementById ("option-button-clipboard-selection")!.addEventListener ("click", ClipboardSelectionButton_Click);
    
    document.getElementById ("option-button-open-upload-list")!.addEventListener ("click", OpenUploadButton_Click);
    document.getElementById ("option-button-append-upload-list")!.addEventListener ("click", AppendUploadButton_Click);
    document.getElementById ("option-button-open-cache-list")!.addEventListener ("click", OpenCacheButton_Click);
    document.getElementById ("option-button-append-cache-list")!.addEventListener ("click", AppendCacheButton_Click);
    document.getElementById ("option-button-open-clipboard-list")!.addEventListener ("click", OpenClipboardButton_Click);
    document.getElementById ("option-button-append-clipboard-list")!.addEventListener ("click", AppendClipboardButton_Click);
    document.getElementById ("option-button-open-autosave-list")!.addEventListener ("click", OpenAutosaveButton_Click);
    document.getElementById ("option-button-append-autosave-list")!.addEventListener ("click", AppendAutosaveButton_Click);
    
    MainEngineTable = new HtmlTable (document.getElementById ("list-container")!);
    MainEngineTable.ColumnsDefinitions = Engine.ColumnDefinitions;
    MainEngineTable.OnSelectedItemChange = selectedEngine => {
        if (selectedEngine) {
            ApplyEngineToInfoPanel (selectedEngine);
        } else {
            ApplyEngineToInfoPanel (new Engine (), true);
        }
    };
    MainEngineTable.RebuildTable ();
    
    // Autosave
    setInterval (
        () => {
            Autosave.Save (MainEngineTable.Items, ListName);
        },
        1000 * 60 * 2
    );
    
});

/* Interferes with copy-pasting other values

window.addEventListener ("keydown", e => {
    // Copy selected engines (Ctrl + C)
    if (e.ctrlKey && e.key == "c") {
        ClipboardSelectionButton_Click ();
    }
    
    // Paste engines from clipboard (Ctrl + V)
    // Due to security reasons, you can't read clipboard using JS. User has to paste the value.
    // Real shortcut is therefore (Ctrl + V + V + Enter)
    if (e.ctrlKey && e.key == "v") {
        AppendClipboardButton_Click ();
    }
});
*/

function NewButton_Click () {
    if (MainEngineTable.Items.length == 0 || confirm ("All unsaved changes to this list will be lost.\n\nAre you sure you want to clear current list?")) {
        MainEngineTable.Items = [];
        MainEngineTable.RebuildTable ();
        
        ListNameDisplay.SetValue ("Unnamed");
    }
}

/* Open dialog */

function OpenButton_Click () {
    FullscreenWindows["open-box"].style.display = "flex";
}

function OpenUploadButton_Click () {
    if (MainEngineTable.Items.length == 0 || confirm ("All unsaved changes to this list will be lost.\n\nAre you sure you want to open a list from file?")) {
        FileIO.OpenBinary (".enl", (data, filename) => {
            if (data) {
                filename = filename.replace (/\.enl$/, "");
                ListNameDisplay.SetValue (filename);
                
                MainEngineTable.Items = Serializer.DeserializeMany (data);
                MainEngineTable.RebuildTable ();
                MainEngineTable.Items.forEach (e => {
                    e.EngineList = MainEngineTable.Items;
                });
                
                FullscreenWindows["open-box"].style.display = "none";
                Notifier.Info (`Opened ${MainEngineTable.Items.length} engine${MainEngineTable.Items.length > 1 ? "s" : ""}`);
            } else {
                //No file chosen?
                Notifier.Warn ("You didn't choose any file");
            }
        });
    }
}

function AppendUploadButton_Click () {
    FileIO.OpenBinary (".enl", (data) => {
        if (data) {
            let newEngines = Serializer.DeserializeMany (data);
            newEngines.forEach (e => {
                e.EngineList = MainEngineTable.Items;
            });
            MainEngineTable.AddItems (newEngines);
            
            FullscreenWindows["open-box"].style.display = "none";
            Notifier.Info (`Appended ${newEngines.length} engine${newEngines.length > 1 ? "s" : ""}`);
        } else {
            //No file chosen?
        }
    });
}

function OpenCacheButton_Click () {
    if (MainEngineTable.Items.length == 0 || confirm ("All unsaved changes to this list will be lost.\n\nAre you sure you want to open a list from cache?")) {
        BrowserCacheDialog.GetListFromCache ((data, newFilename) => {
            if (!data) {
                // Maybe send a notification?
                return;
            }
            
            if (newFilename) {
                ListNameDisplay.SetValue (newFilename);
            }
            
            MainEngineTable.Items = Serializer.DeserializeMany (data);
            MainEngineTable.RebuildTable ();
            MainEngineTable.Items.forEach (e => {
                e.EngineList = MainEngineTable.Items;
            });
            
            FullscreenWindows["open-box"].style.display = "none";
            Notifier.Info (`Opened ${MainEngineTable.Items.length} engine${MainEngineTable.Items.length > 1 ? "s" : ""}`);
        }, "Choose a list to open");
    }
}

function AppendCacheButton_Click () {
    BrowserCacheDialog.GetListFromCache (data => {
        if (!data) {
            // Maybe send a notification?
            return;
        }
        
        let newEngines = Serializer.DeserializeMany (data);
        newEngines.forEach (e => {
            e.EngineList = MainEngineTable.Items;
        });
        MainEngineTable.AddItems (newEngines);
        
        FullscreenWindows["open-box"].style.display = "none";
        Notifier.Info (`Appended ${newEngines.length} engine${newEngines.length > 1 ? "s" : ""}`);
    }, "Choose a list to append");
}

function OpenClipboardButton_Click () {
    if (MainEngineTable.Items.length == 0 || confirm ("All unsaved changes to this list will be lost.\n\nAre you sure you want to open a list from base64 string?")) {
        let b64 = prompt ("Enter the base64 string:");
        
        if (b64 == null || b64.length == 0) {
            Notifier.Warn ("Base64 string was not entered");
            return;
        }
        
        try {
            let data = BitConverter.Base64ToByteArray (b64);
            
            MainEngineTable.Items = Serializer.DeserializeMany (data);
            MainEngineTable.RebuildTable ();
            MainEngineTable.Items.forEach (e => {
                e.EngineList = MainEngineTable.Items;
            });
            
            FullscreenWindows["open-box"].style.display = "none";
            Notifier.Info (`Opened ${MainEngineTable.Items.length} engine${MainEngineTable.Items.length > 1 ? "s" : ""}`);
        } catch (e) {
            Notifier.Warn ("There was an error while parsing the string");
            return;
        }
    }
}

function AppendClipboardButton_Click () {
    let b64 = prompt ("Enter the base64 string:");
        
        if (b64 == null || b64.length == 0) {
            Notifier.Warn ("Base64 string was not entered");
            return;
        }
        
        try {
            let data = BitConverter.Base64ToByteArray (b64);
            
            let newEngines = Serializer.DeserializeMany (data);
            newEngines.forEach (e => {
                e.EngineList = MainEngineTable.Items;
            });
            MainEngineTable.AddItems (newEngines);
            
            FullscreenWindows["open-box"].style.display = "none";
            Notifier.Info (`Appended ${newEngines.length} engine${newEngines.length > 1 ? "s" : ""}`);
        } catch (e) {
            Notifier.Warn ("There was an error while parsing the string");
            return;
        }
}

function OpenAutosaveButton_Click () {
    if (MainEngineTable.Items.length == 0 || confirm ("All unsaved changes to this list will be lost.\n\nAre you sure you want to open a list from cache?")) {
        BrowserCacheDialog.GetListFromAutosave ((data, newFilename) => {
            if (!data) {
                // Maybe send a notification?
                return;
            }
            
            if (newFilename) {
                ListNameDisplay.SetValue (newFilename);
            }
            
            MainEngineTable.Items = Serializer.DeserializeMany (data);
            MainEngineTable.RebuildTable ();
            MainEngineTable.Items.forEach (e => {
                e.EngineList = MainEngineTable.Items;
            });
            
            FullscreenWindows["open-box"].style.display = "none";
            Notifier.Info (`Opened ${MainEngineTable.Items.length} engine${MainEngineTable.Items.length > 1 ? "s" : ""}`);
        }, "Open autosave:");
    }
}

function AppendAutosaveButton_Click () {
    BrowserCacheDialog.GetListFromAutosave (data => {
        if (!data) {
            // Maybe send a notification?
            return;
        }
        
        let newEngines = Serializer.DeserializeMany (data);
        newEngines.forEach (e => {
            e.EngineList = MainEngineTable.Items;
        });
        MainEngineTable.AddItems (newEngines);
        
        FullscreenWindows["open-box"].style.display = "none";
        Notifier.Info (`Appended ${newEngines.length} engine${newEngines.length > 1 ? "s" : ""}`);
    }, "Append autosave:");
}

/* /Open dialog */
/* Save dialog */

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
    
    if (!Store.Exists (`${ListName}.enl`) || confirm (`${ListName}.enl already exists in cache.\n\nDo you want to overwrite? Old file will be lost.`)) {
        Notifier.Info (`${ListName}.enl saved in cache`);
        Store.SetBinary (`${ListName}.enl`, data);
        FullscreenWindows["save-box"].style.display = "none";
    } else {
        Notifier.Warn (`${ListName}.enl already exists in the cache. Current file was not saved`);
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

function ClipboardSelectionButton_Click () {
    if (MainEngineTable.SelectedRows.length <= 0) {
        Notifier.Warn ("No engine was selected. Select some engines and try again");
        return;
    }
    
    let Engines: Engine[] = [];
    
    MainEngineTable.SelectedRows.forEach (index => {
        Engines.push (MainEngineTable.Rows[index][1]);
    });
    
    let data = Serializer.SerializeMany (Engines);
    
    let b64: string = BitConverter.ByteArrayToBase64 (data);
    
    let success = FileIO.ToClipboard (b64);
    
    if (success) {
        Notifier.Info ("Selected engines have been copied to clipboard");
        FullscreenWindows["save-box"].style.display = "none";
    } else {
        Notifier.Warn ("There was an error. Selected engines were NOT copied to clipboard");
    }
}

/* /Save dialog */

function CacheButton_Click () {
    BrowserCacheDialog.DisplayCache ();
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
    if (Packager.IsWorking) {
        FullscreenWindows["export-box"].style.display = "flex";
    } else {
        if (MainEngineTable.Items.length > 0) {
            
            let errors = Validator.Validate (MainEngineTable.Items);
            if (errors.length != 0) {
                Notifier.Error ("Fix validation errors before exporting");
                alert (`Fix following errors before exporting the engine:\n\n-> ${errors.join ("\n-> ")}`);
                return;
            }
            
            Packager.BuildMod (ListName, MainEngineTable.Items, (data) => {
                if (data) {
                    Notifier.Info ("Exporting finished");
                    FileIO.SaveBinary (`${ListName}.zip`, data);
                } else {
                    Notifier.Warn ("Exporting aborted");
                }
            });
            
        }
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
    let newEngine = new Engine ();
    newEngine.EngineList = MainEngineTable.Items;
    MainEngineTable.AddItems (newEngine);
}

function RemoveButton_Click () {
    if (MainEngineTable.SelectedRows.length > 0 && confirm (`You are about to delete ${MainEngineTable.SelectedRows.length} items from the list.\n\nAre you sure?`)) {
        MainEngineTable.RemoveSelectedItems ();
    }
}

function SettingsButton_Click () {
    SettingsDialog.Show ();
}

function HelpButton_Click () {
    FullscreenWindows["about-box"].style.display = "flex";
}
