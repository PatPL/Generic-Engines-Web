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
        "Hot dog stand": "hotDogStand-Palette.css", // 🥚🥚
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
        
        // For some reason Chrome (Probably opera as well) doesn't draw the element correcly
        // on the first run so it has to be forcefully redrawn
        let customTable = document.getElementById ("styles-custom")! as HTMLTableElement;
        requestAnimationFrame (() => {
            customTable.style.display = "inline";
            requestAnimationFrame (() => {
                customTable.style.display = "block";
            });
        });
    }
    
    public static Init () {
        let select = document.getElementById ("styles-select")! as HTMLSelectElement;
        let customContainer = document.getElementById ("custom-styles-container")! as HTMLDivElement;
        let customTable = document.getElementById ("styles-custom")! as HTMLTableElement;
        let customReloadButton = document.getElementById ("custom-styles-reload")! as HTMLButtonElement;
        let customExportButton = document.getElementById ("custom-styles-export")! as HTMLButtonElement;
        let customImportButton = document.getElementById ("custom-styles-import")! as HTMLButtonElement;
        let themeOverrideStyle = document.getElementById ("custom-theme-override")! as HTMLStyleElement;
        
        if (!isFirefox) {
            // (I assume...)
            // Chrome / Opera handle scrollbar "display" differently (block / inline)
            // And this results in huge gaps near tightly packed elements in this container
            customContainer.style.paddingRight = "24px";
        }
        
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
                        input.selectionDirection = "backward";
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
                colorPicker.style.right = `-${ inputHeight + inputBorderWidth - 1 }px`;
                colorPicker.style.cursor = "pointer";
                colorPicker.style.background = `var(${ i })`;
                colorPicker.title = "Open a color selector";
                let pickerGridBG = document.createElement ("div");
                pickerGridBG.style.position = "absolute";
                pickerGridBG.style.width = `${ inputHeight }px`;
                pickerGridBG.style.height = `${ inputHeight }px`;
                pickerGridBG.style.top = `${ 1 + inputBorderWidth }px`;
                pickerGridBG.style.right = `-${ inputHeight + inputBorderWidth - 1 }px`;
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
