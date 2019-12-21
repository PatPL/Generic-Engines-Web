class StyleDialog {
    
    private static _initialized = false;
    private static readonly ThemeFiles: { [name: string]: string | false } = {
        "Classic": "classic-Palette.css",
        "Azure": "azure-Palette.css",
        "Sunset": "sunset-Palette.css",
        "Dark (blue accent)": "darkBlue-Palette.css",
        "Dark (red accent)": "darkRed-Palette.css",
        "Deep sea": "deepSea-Palette.css",
        "Night sky": "nightSky-Palette.css",
        "High contrast": "highContrast-Palette.css",
        "Hot dog stand": "hotDogStand-Palette.css",
        "Custom": false
    };
    
    private static readonly ThemeGroups: [string, string[]][] = [
        ["Light", [
            "Classic",
            "Azure"
        ]], ["Dark", [
            "Dark (blue accent)",
            "Dark (red accent)",
            "Deep sea",
            "High contrast"
        ]], ["Themed", [
            "Sunset",
            "Night sky"
        ]], ["Other", [
            "Custom"
        ]]
    ];
    
    /*
    Adding a theme:
     - Add a file with "*Palette.css" name to "css/" folder
     - Add the theme name and file name in ThemeFiles object
     - Add the theme name to the ThemeGroups
     - Done
    */
    
    public static Show () {
        FullscreenWindows["style-box"].style.display = "flex";
    }
    
    public static Init () {
        let select = document.getElementById ("styles-select")! as HTMLSelectElement;
        let customContainer = document.getElementById ("custom-styles-container")! as HTMLDivElement;
        let customTable = document.getElementById ("styles-custom")! as HTMLTableElement;
        let customReloadButton = document.getElementById ("custom-styles-reload")! as HTMLButtonElement;
        let customExportButton = document.getElementById ("custom-styles-export")! as HTMLButtonElement;
        let customImportButton = document.getElementById ("custom-styles-import")! as HTMLButtonElement;
        let themeOverrideStyle = document.getElementById ("custom-theme-override")! as HTMLStyleElement;
        
        let indexMap: [string, number][] = [];
        let indexMapCounter = 0;
        
        const applyCurrentTheme = () => {
            let themeFile = this.ThemeFiles[Settings.current_theme];
            if (themeFile) {
                // Theme file
                this.SetThemeFile (themeFile);
                themeOverrideStyle.innerHTML = "";
            } else {
                // Custom theme
                themeOverrideStyle.innerHTML = this.BuildOverrideThemeStyle (Settings.custom_theme);
            }
        }
        
        const getCurrentCustomThemeFromTable = () => {
            let output: [string, string][] = [];
            let trs = customTable.querySelectorAll ("tr");
            trs.forEach (e => {
                output.push ([e.children[0].innerHTML, (e.children[1].children[0] as HTMLInputElement).value]);
            });
            
            return output;
        }
        
        const applyCurrentCustomThemeToTable = () => {
            let varMap: { [cssVar: string]: string } = {};
        
            this.GetCurrentCSSVars ().forEach (([cssVar, value]) => { varMap[cssVar] = value });
            
            try { 
                let customVars = JSON.parse (atob (Settings.custom_theme)) as [string, string][];
                customVars.forEach (([cssVar, value]) => { varMap[cssVar] = value });
            } catch (e) {
                console.error ("Couldn't parse the custom theme: ", e, Settings.custom_theme);
            }
            
            customTable.innerHTML = "";
            
            for (let i in varMap) {
                let tr = document.createElement ("tr");
                let input = document.createElement ("input");
                input.style.margin = "0px 45px 0px 6px";
                
                input.value = varMap[i];
                
                input.addEventListener ("input", () => {
                    Settings.custom_theme = btoa (JSON.stringify (getCurrentCustomThemeFromTable ()));
                    applyCurrentTheme ();
                });
                
                input.addEventListener ("focusin", () => {
                    // Autoselect the color in fields. Omit the '#' in fields with #________ values
                    if (/^#[0-9a-f]*/.test (input.value.toLowerCase ())) {
                        input.selectionStart = 1;
                        input.selectionEnd = input.value.length;
                    } else {
                        input.selectionStart = 0;
                        input.selectionEnd = input.value.length;
                    }
                });
                
                // This one is horrible
                const inputHeight = 23;
                const inputBorderWidth = 0;
                let colorPicker = document.createElement ("div");
                colorPicker.style.position = "absolute";
                colorPicker.style.width = `${ inputHeight }px`;
                colorPicker.style.height = `${ inputHeight }px`;
                colorPicker.style.top = `${ 1 + inputBorderWidth }px`;
                colorPicker.style.right = `${ inputHeight + inputBorderWidth - 1 }px`;
                colorPicker.style.cursor = "pointer";
                colorPicker.style.background = `var(${ i })`;
                colorPicker.title = "Open a color selector";
                let pickerGridBG = document.createElement ("div");
                pickerGridBG.style.position = "absolute";
                pickerGridBG.style.width = `${ inputHeight }px`;
                pickerGridBG.style.height = `${ inputHeight }px`;
                pickerGridBG.style.top = `${ 1 + inputBorderWidth }px`;
                pickerGridBG.style.right = `${ inputHeight + inputBorderWidth - 1 }px`;
                pickerGridBG.style.background = "url(img/transparent.png)"
                
                ColorInput.HookInput (colorPicker, input);
                
                tr.innerHTML = "<td></td><td style='position: relative'></td>";
                tr.children[0].innerHTML = i;
                tr.children[1].appendChild (input);
                tr.children[1].appendChild (pickerGridBG);
                tr.children[1].appendChild (colorPicker);
                
                customTable.appendChild (tr);
            }
        }
        
        applyCurrentTheme ();
        
        select.innerHTML = "";
        this.ThemeGroups.forEach (([groupName, themes]) => {
            select.innerHTML += `<optgroup label="${ groupName }">`;
            
            themes.forEach (themeName => {
                if (this.ThemeFiles [themeName] != undefined) {
                    select.innerHTML += `<option value="${ themeName }">${ themeName }</option>`;
                    indexMap.push ([themeName, indexMapCounter++]);
                } else {
                    console.warn (
                        `Theme named "${ themeName }" not found in ThemeFiles, but is assigned in ThemeGroups (skipping). Is it a typo?`
                    );
                }
            });
            
            select.innerHTML += `</optgroup>`
        });
        // for (let i in StyleDialog.ThemeFiles) {
        //     select.innerHTML += `<option value="${ i }">${ i }</option>`
        //     indexMap.push ([i, indexMapCounter++]);
        // }
        
        let currentTheme = indexMap.find (x => x[0] == Settings.current_theme);
        if (currentTheme) {
            select.selectedIndex = currentTheme[1];
            if (currentTheme[0] == "Custom") {
                customContainer.style.display = "block";
                applyCurrentCustomThemeToTable ();
                // Called a few lines higher anyway
                // applyCurrentTheme ();
            } else {
                customContainer.style.display = "none";
            }
        } else {
            console.warn ("Theme not found: ", Settings.current_theme);
            console.warn ("Themes: ", indexMap);
        }
        
        select.addEventListener ("change", () => {
            let selectedTheme = indexMap.find (x => x[1] == select.selectedIndex)![0];
            Settings.current_theme = selectedTheme;
            if (selectedTheme == "Custom") {
                customContainer.style.display = "block";
                applyCurrentCustomThemeToTable ();
                applyCurrentTheme ();
            } else {
                customContainer.style.display = "none";
            }
            
            applyCurrentTheme ();
        });
        
        customReloadButton.addEventListener ("click", () => {
            if (confirm ("Are you sure you want to rebuild the custom theme?\n\nYou will lose the current custom theme.")) {
                Settings.custom_theme = btoa (JSON.stringify (this.GetCurrentCSSVars ()));
                applyCurrentCustomThemeToTable ();
                applyCurrentTheme ();
            }
        });
        
        customExportButton.addEventListener ("click", () => {
            if (FileIO.ToClipboard (Settings.custom_theme)) {
                Notifier.Info ("Theme copied to clipboard");
            } else {
                Notifier.Warn ("Couldn't put the custom style in clipboard. Check dev console (F12) for the theme");
                console.log ("Custom theme:", Settings.custom_theme);
            }
        });
        
        customImportButton.addEventListener ("click", () => {
            if (confirm ("Importing custom theme will overwrite your current custom theme.\n\nAre you sure you want to continue?")) {
                let newTheme = prompt ("Paste the custom theme (Base64)");
                if (newTheme != null) {
                    Settings.custom_theme = newTheme;
                    applyCurrentCustomThemeToTable ();
                    applyCurrentTheme ();
                }
            }
        });
        
        // Debug button
        document.getElementById ("custom-styles-randomize")!.addEventListener ("click", () => {
            if (confirm ("Are you sure? You'll lose your current custom theme.")) {
                const hex = "0123456789abcdef";
                customTable.querySelectorAll ("input").forEach (i => {
                    let color = "#";
                    color += hex[Math.floor (Math.random () * 16)];
                    color += hex[Math.floor (Math.random () * 16)];
                    color += hex[Math.floor (Math.random () * 16)];
                    color += hex[Math.floor (Math.random () * 16)];
                    color += hex[Math.floor (Math.random () * 16)];
                    color += hex[Math.floor (Math.random () * 16)];
                    i.value = color;
                });
                Settings.custom_theme = btoa (JSON.stringify (getCurrentCustomThemeFromTable ()));
                applyCurrentTheme ();
            }
        })
    }
    
    private static GetCurrentCSSVars (): [string, string][] {
        let output: [string, string][] = [];
        let paletteSheet = Array.from<any> (document.styleSheets).find (x => /(.)*Palette.css$/.test (x.href!));
        if (paletteSheet) {
            let paletteRule = Array.from<any> (paletteSheet.rules).find (x => x.selectorText == ":root");
            if (paletteRule) {
                let paletteStyle = paletteRule.style;
                if (paletteStyle) {
                    Array.from<any> (paletteStyle).forEach (v => {
                        output.push ([v, paletteStyle.getPropertyValue (v).trim ()]);
                    });
                } else {
                    console.warn ("Didn't find the palette styles");
                }
            } else {
                console.warn ("Didn't find the ':root' rule in the palette file");
            }
        } else {
            console.warn ("Didn't find the '*.Palette.css' palette file");
        }
        
        return output;
    }
    
    private static SetThemeFile (file: string) {
        (document.getElementById ("css-palette")! as HTMLLinkElement).href = `css/${ file }`;
    }
    
    private static BuildOverrideThemeStyle (b64CustomTheme: string): string {
        let output = ":root {";
        
        let varMap: { [cssVar: string]: string } = {};
        
        this.GetCurrentCSSVars ().forEach (([cssVar, value]) => { varMap[cssVar] = value });
        
        try { 
            let customVars = JSON.parse (atob (b64CustomTheme)) as [string, string][];
            customVars.forEach (([cssVar, value]) => { varMap[cssVar] = value });
        } catch (e) {
            console.error ("Couldn't parse the custom theme: ", e, b64CustomTheme);
        }
        
        for (let i in varMap) {
            output += `
                ${ i }: ${ varMap[i] };
            `;
        }
        
        output += "}";
        
        // For easier exporting into built-in themes
        output = Exporter.PrettifyConfig (Exporter.CompactConfig (output));
        
        return output;
    }
    
}

document.addEventListener ("DOMContentLoaded", () => {
    StyleDialog.Init ();
});

/* ye
"W1siLS1saWdodGVyR3JheUJhY2tncm91bmQiLCJ1cmwoaHR0cHM6Ly9leHRlcm5hbC1jb250ZW50LmR1Y2tkdWNrZ28uY29tL2l1Lz91PWh0dHBzJTNBJTJGJTJGbWVkaWEuZ2lwaHkuY29tJTJGbWVkaWElMkYzbzdaZU9EVEd1UU9lTHIzbDYlMkZnaXBoeS5naWYmZj0xJm5vZmI9MSkiXSxbIi0tbGlnaHRHcmF5QmFja2dyb3VuZCIsInVybChodHRwczovL2V4dGVybmFsLWNvbnRlbnQuZHVja2R1Y2tnby5jb20vaXUvP3U9aHR0cHMlM0ElMkYlMkZtZWRpYS5naXBoeS5jb20lMkZtZWRpYSUyRjExaTRocHRDNzFjOTBjJTJGZ2lwaHkuZ2lmJmY9MSZub2ZiPTEpIl0sWyItLXNpZGVQYW5lbEJhY2tncm91bmQiLCJ1cmwoaHR0cHM6Ly9leHRlcm5hbC1jb250ZW50LmR1Y2tkdWNrZ28uY29tL2l1Lz91PWh0dHBzJTNBJTJGJTJGbWVkaWEuZ2lwaHkuY29tJTJGbWVkaWElMkYzbzZnYmNocmNOSXQ0TWE4VHUlMkZnaXBoeS5naWYmZj0xJm5vZmI9MSkiXSxbIi0tZ3JheUJhY2tncm91bmQiLCJ1cmwoaHR0cHM6Ly9pLnBpbmltZy5jb20vb3JpZ2luYWxzL2JiL2ZhL2I0L2JiZmFiNDE5MzA2OGQ1OWU1MGVlNjNmNTA0YjU4YzQ5LmdpZikiXSxbIi0tZ3JheUJvcmRlciIsIiMyMjIiXSxbIi0tZGFya0JvcmRlciIsIiM2NjYiXSxbIi0tZGFya0JhY2tncm91bmQiLCIjMTExIl0sWyItLWRhcmtUZXh0IiwiIzAwMCJdLFsiLS1kYXJrZXJCb3JkZXIiLCIjQkJCIl0sWyItLWRhcmtlclRleHQiLCIjMDAwIl0sWyItLXJvd0V2ZW4iLCJ1cmwoaHR0cHM6Ly9iZW5qYW1pbmJlbmJlbi5jb20vaW1nL2V4YW1wbGUtdHJlZm9pbC5naWYpIDUwJSJdLFsiLS1yb3dPZGQiLCJ1cmwoaHR0cHM6Ly93d3cucmV0cm8tc3ludGh3YXZlLmNvbS93cC1jb250ZW50L3VwbG9hZHMvMjAxNi8xMC9yZXRyby1zeW50aHdhdmVfR0lGLTAwLTQ5LmdpZik1MCUiXSxbIi0tY29uZmlybSIsInJhZGlhbC1ncmFkaWVudCgjQjgwLCAjODAwKSJdLFsiLS10ZXh0U2VsZWN0aW9uIiwiIzhCRiJdLFsiLS1zZWxlY3Rpb24iLCJ1cmwoaHR0cDovL3N5bHZhaW4yMWV1Z2VuaWUucy55LnBpYy5jZW50ZXJibG9nLm5ldC85MGM0ZGUxYy5naWYpIl0sWyItLXNlbGVjdGlvbk1ham9yIiwidXJsKGh0dHA6Ly9zeWx2YWluMjFldWdlbmllLnMueS5waWMuY2VudGVyYmxvZy5uZXQvOTBjNGRlMWMuZ2lmKSJdLFsiLS1zZWxlY3Rpb25DZWxsIiwidXJsKGh0dHA6Ly9zeWx2YWluMjFldWdlbmllLnMueS5waWMuY2VudGVyYmxvZy5uZXQvOTBjNGRlMWMuZ2lmKSJdLFsiLS1pbmZvIiwiIzIyOCJdLFsiLS13YXJuIiwiIzg0MiJdLFsiLS1lcnJvciIsIiM4MjIiXSxbIi0tc29ydE1pbiIsIiMyMjIiXSxbIi0tc29ydE1heCIsIiNCMjIiXSxbIi0tdGFibGVCYWNrZ3JvdW5kIiwidXJsKGh0dHBzOi8vdXBsb2FkLndpa2ltZWRpYS5vcmcvd2lraXBlZGlhL2VuLzcvN2QvRGVmYXVsdF9EYW5jaW5nX1N0aWNrX0ZpZ3VyZS5naWYpIDUwJSAxMCUiXSxbIi0tdGFibGVCb3JkZXIiLCIjMDAwIl0sWyItLXRhYmxlRGlzdGluY3QiLCIjMDAwIl0sWyItLXRhYmxlUmVndWxhciIsIiM0NDQiXSxbIi0tdGFibGVSZWQiLCIjRjAwIl0sWyItLXRhYmxlTGluZSIsIiMwMjQiXV0="
*/