
function Debug_RemoveAllAutosaves () {
    if (confirm ("You are about to permanently remove all autosaves.\n\nAre you sure?")) {
        for (let i in localStorage) {
            if (/.enl.autosave2$/.test (i)) {
                localStorage.removeItem (i);
            }
        }
    }
}

function Debug_LogLocalStorageUsage () {
    let usedB = 0;
    for (var k in localStorage) {
        if (
            k == "key" ||
            k == "getItem" ||
            k == "setItem" ||
            k == "removeItem" ||
            k == "clear" ||
            k == "length"
        ) {
            // Ignore built-in stuff
            continue;
        }
        
        // JS uses UTF-16 internally (* 2)
        usedB += (k.length + localStorage[k].length) * 2;
    }
    
    console.log (`Used bytes: ${ usedB }`);
    console.log (`Used chars: ${ usedB / 2 }`);
    console.log ("Check your total localStorage size here: ", "https://arty.name/localstorage.html");
    console.log ("Maximum should be around 5MB or 5 million chars, It's a poorly defined standard tbh");
}

function Debug_GetCurrentCustomThemeAsCSSRule () {
    let vars: [string, string][] = JSON.parse (atob (Settings.custom_theme));
    let output = ":root {\n";
    
    vars.forEach (([cssVar, value]) => {
        output += `    ${ cssVar }: ${ value };\n`;
    });
    
    output += "}\n";
    
    console.log (output);
}

function Debug_DisplayCustomThemeRandomizer () {
    document.getElementById ("custom-styles-randomize")!.style.display = "block";
}

function Debug_SendExampleNotifierMessages () {
    Notifier.Info ("This is an information", 0);
    Notifier.Warn ("This is a warning", 0);
    Notifier.Error ("This is an error", 0);
}