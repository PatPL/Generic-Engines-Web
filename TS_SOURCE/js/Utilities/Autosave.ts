class Autosave {
    
    // Can be changed in browser's console later
    private static readonly LOGGING = false;
    
    // Used to temporarily disable autosave
    public static Enabled = true;
    
    private static readonly AUTOSAVE_TIMEOUT = 45 * 1000;
    private static autosaveTimeoutID?: number;
    private static recentlyAutosaved = false;
    
    private static readonly IDLE_AUTOSAVE_TIMEOUT = 15 * 1000;
    private static inactivityAutosaveTimeoutID?: number;
    
    private static GetCurrentAutosaveName (): string {
        if (this.sessionStartTimestamp) {
            let timestamp = this.sessionStartTimestamp.getTime ().toString ();
            timestamp = "0".repeat (24 - timestamp.length) + timestamp;
            
            return `${ timestamp }-${ this.currentEngineListName }.enl.autosave2`;
        } else {
            throw "No session in progress";
        }
    }
    
    private static RequestAutosaveToken (force: boolean = false) {
        if (!force) {
            clearTimeout (this.inactivityAutosaveTimeoutID);
            this.inactivityAutosaveTimeoutID = setTimeout (() => {
                Autosave.Save (true);
            }, this.IDLE_AUTOSAVE_TIMEOUT);
        }
        
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
    
    public static Save (force: boolean = false) {
        if (this.Enabled && this.RequestAutosaveToken (force)) {
            if (this.currentEngineListName && this.sessionStartTimestamp) {
                let data = Serializer.SerializeMany (MainEngineTable.Items);
                Store.SetBinary (this.GetCurrentAutosaveName (), data);
                
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
    
    // Deletes current autosave file and resets the session
    // (Called for example while saving current file)
    // TODO: Hook it up & test
    public static RestartSession () {
        if (this.currentEngineListName) {
            Store.Remove (this.GetCurrentAutosaveName ());
            
            if (this.LOGGING) {
                console.log (
                    "Ended autosave session: ",
                    this.currentEngineListName,
                    this.sessionStartTimestamp
                );
            }
            
            this.SetSession (this.currentEngineListName);
        } else {
            console.warn ("No session in progress that could be restarted");
        }
    }
    
}