
function Debug_RemoveAllAutosaves () {
    if (confirm ("You are about to permanently remove all autosaves.\n\nAre you sure?")) {
        for (let i in localStorage) {
            if (/.enl.autosave2$/.test (i)) {
                localStorage.removeItem (i);
            }
        }
    }
}

function Debug_GetLocalStorageUsage (matchRegex?: RegExp) {
    let usedChars = 0;
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
        
        if (matchRegex && !matchRegex.test (k)) {
            // Ignore keys that don't match the given Regex
            continue;
        }
        
        // JS uses UTF-16 internally (* 2)
        usedChars += (k.length + localStorage[k].length);
    }
    
    return usedChars;
}

function Debug_LogLocalStorageUsage () {
    let usedChars = Debug_GetLocalStorageUsage ();
    
    console.log (`Used bytes: ${ usedChars * 2 }`);
    console.log (`Used chars: ${ usedChars }`);
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

function Debug_AppendRandomWernherEngine (year?: number) {
    let newEngine = Wernher.RollEngine (year);
    
    if (newEngine) {
        MainEngineTable.AddItems (newEngine);
    } else {
        console.warn ("Error while rolling an engine");
    }
}