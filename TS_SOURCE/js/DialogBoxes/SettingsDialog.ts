///<reference path="../Utilities/Store.ts" />
document.addEventListener ("DOMContentLoaded", () => {
    
    SettingsDialog.SettingsBoxElement = document.getElementById ("settings-box")!;
    
    SettingsDialog.SettingsBoxElement.querySelector ("div.fullscreen-grayout")!.addEventListener ("click", () => {
        SettingsDialog.Apply ();
    })
});

class SettingsDialog {
    
    public static SettingsBoxElement: HTMLElement;
    
    public static Show () {
        let inputs = this.SettingsBoxElement.querySelectorAll ("input");
        
        inputs.forEach (i => {
            let field = i.getAttribute ("setting-field");
            
            if (field) {
                
                if (Settings[field] != undefined) {
                    if (typeof Settings[field] == "boolean") {
                        i.checked = Settings[field] as boolean;
                    } else if (typeof Settings[field] == "string") {
                        i.value = Settings[field] as string;
                    } else {
                        console.error ("Unsupported setting type");
                    }
                } else {
                    console.error ("Unknown setting field");
                }
            } else {
                return; //continue
            }
        });
        
        FullscreenWindows["settings-box"].style.display = "flex";
    }
    
    public static Apply () {
        let inputs = this.SettingsBoxElement.querySelectorAll ("input");
        
        inputs.forEach (i => {
            let field = i.getAttribute ("setting-field");
            
            if (field) {
                
                if (Settings[field] != undefined) {
                    if (typeof Settings[field] == "boolean") {
                        Settings[field] = i.checked;
                    } else if (typeof Settings[field] == "string") {
                        Settings[field] = i.value;
                    } else {
                        console.error ("Unsupported setting type");
                    }
                } else {
                    console.error ("Unknown setting field");
                }
            } else {
                return; //continue
            }
        });
        
        //Update stuff
        ApplySettings ();
        MainEngineTable.RebuildTable ();
    }
    
}

const Settings: ISettings = {
    get classic_unit_display(): boolean {
        return Store.GetText ("setting:classic_unit_display", "0") == "1";
    }, set classic_unit_display(value: boolean) {
        Store.SetText ("setting:classic_unit_display", value ? "1" : "0");
    }, get dark_theme(): boolean {
        return Store.GetText ("setting:dark_theme", "0") == "1";
    }, set dark_theme(value: boolean) {
        Store.SetText ("setting:dark_theme", value ? "1" : "0");
    }, get show_info_panel(): boolean {
        return Store.GetText ("setting:show_info_panel", "1") == "1";
    }, set show_info_panel(value: boolean) {
        Store.SetText ("setting:show_info_panel", value ? "1" : "0");
    }, get prettify_config(): boolean {
        return Store.GetText ("setting:prettify_config", "0") == "1";
    }, set prettify_config(value: boolean) {
        Store.SetText ("setting:prettify_config", value ? "1" : "0");
    }, get async_sort(): boolean {
        return Store.GetText ("setting:async_sort", "0") == "1";
    }, set async_sort(value: boolean) {
        Store.SetText ("setting:async_sort", value ? "1" : "0");
    }, get hide_disabled_fields_on_sort(): boolean {
        return Store.GetText ("setting:hide_disabled_fields_on_sort", "1") == "1";
    }, set hide_disabled_fields_on_sort(value: boolean) {
        Store.SetText ("setting:hide_disabled_fields_on_sort", value ? "1" : "0");
    }
}

// To add a setting, set it in the object above, the interface below, and in index.html, in '#settings-box' element

interface ISettings {
    [id: string]: string | boolean;
    classic_unit_display: boolean;
    dark_theme: boolean;
    show_info_panel: boolean;
    prettify_config: boolean;
    async_sort: boolean;
    hide_disabled_fields_on_sort: boolean;
}