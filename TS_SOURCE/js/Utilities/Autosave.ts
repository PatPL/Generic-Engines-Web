class Autosave {
    
    // Can be changed in browser's console later
    private static readonly LOGGING = false;
    
    // Used to temporarily disable autosave
    public static Enabled = true;
    
    private static readonly AUTOSAVE_TIMEOUT = 60 * 1000;
    private static autosaveTimeoutID?: number;
    private static recentlyAutosaved = false;
    
    private static RequestAutosaveToken (force: boolean = false) {
        if (force) {
            this.ResetAutosaveTimeout ();
        }
        
        if (this.recentlyAutosaved) {
            return false;
        } else {
            this.recentlyAutosaved = true;
            
            this.autosaveTimeoutID = setTimeout (() => {
                this.recentlyAutosaved = false;
                if (this.LOGGING) { console.log ("Autosave armed"); }
            }, this.AUTOSAVE_TIMEOUT);
            
            return true;
        }
    }
    
    private static ResetAutosaveTimeout () {
        clearTimeout (this.autosaveTimeoutID);
        this.recentlyAutosaved = false;
        if (this.LOGGING) { console.log ("Autosave armed"); }
    }
    
    public static Save (list: Engine[]) {
        if (this.Enabled && this.RequestAutosaveToken ()) {
            if (this.currentEngineListName && this.sessionStartTimestamp) {
                let data = Serializer.SerializeMany (list);
                
                let timestamp = this.sessionStartTimestamp.getTime ().toString ();
                timestamp = "0".repeat (24 - timestamp.length) + timestamp;
                
                let autosaveName = `${ timestamp }-${ this.currentEngineListName }.enl.autosave2`;
                Store.SetBinary (autosaveName, data);
                
                if (this.LOGGING) { console.log ("Autosave fired"); }
            } else {
                console.warn ("Can't autosave without setting any session first. Use `Autosave.SetSession (filename)` first.");
            }
        }
    }
    
    private static currentEngineListName?: string;
    private static sessionStartTimestamp?: Date;
    // Sets a new session if a new listName string is passed
    public static SetSession (listName: string) {
        if (listName != this.currentEngineListName) {
            this.currentEngineListName = listName;
            this.sessionStartTimestamp = new Date ();
            this.ResetAutosaveTimeout ();
            
            if (this.LOGGING) {
                console.log (
                    "Started a new autosave session: ",
                    this.currentEngineListName,
                    this.sessionStartTimestamp
                );
            }
        }
    };
    
}