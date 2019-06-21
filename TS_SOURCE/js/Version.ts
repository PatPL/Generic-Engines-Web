///<reference path="./Utilities/Notifier.ts" />
class Version {
    
    public static readonly CurrentVersion = "Web.0.8.4 Dev";
    
}

addEventListener ("DOMContentLoaded", () => {
    if (Store.Exists ("lastVersion")) {
        if (Store.GetText ("lastVersion") != Version.CurrentVersion) {
            Notifier.Info (`Generic Engines updated to version ${Version.CurrentVersion}; Click to dismiss`, 0);
        } else {
            
        }
    } else {
        Notifier.Info (`Thank you for using Generic Engines`, 10000);
    }
    
    Store.SetText ("lastVersion", Version.CurrentVersion);
    
    //Set version numbers
    
    document.head.querySelector ("title")!.innerHTML += Version.CurrentVersion;
    
    document.body.querySelectorAll (".js-insert-version").forEach (e => {
        e.innerHTML = Version.CurrentVersion;
    });
});