class Autosave {
    
    public static Save (list: Engine[], name: string) {
        let data = Serializer.SerializeMany (list);
        
        let timestamp = new Date ().getTime ().toString ();
        timestamp = "0".repeat (24 - timestamp.length) + timestamp;
        
        let autosaveName = `${ timestamp }-${ name }.enl.autosave`;
        Store.SetBinary (autosaveName, data);
        
        this.Trim ();
        
    }
    
    private static readonly AUTOSAVE_LIMIT = 128;
    private static Trim () {
        let autosaves: string[] = [];
        
        for (let i in localStorage) {
            if (/^(.)+\.enl.autosave$/.test (i)) {
                autosaves.push (i);
            }
        }
        
        autosaves = autosaves.sort ((a, b) => a < b ? 1 : -1);
        
        for (let i = autosaves.length - 1; i >= this.AUTOSAVE_LIMIT; --i) {
            localStorage.removeItem (autosaves[i]);
        }
    }
    
}