class Store {
    
    private static readonly encoder = new TextEncoder ();
    private static readonly decoder = new TextDecoder ();
    
    public static Exists (id: string) {
        return localStorage[id] != undefined;
    }
    
    public static Remove (id: string) {
        localStorage.removeItem (id);
    }
    
    public static Rename (oldID: string, newID: string) {
        let value = localStorage[oldID];
        localStorage.removeItem (oldID);
        localStorage[newID] = value;
    }
    
    public static SetBinary (id: string, value: Uint8Array) {
        localStorage[id] = String.fromCharCode.apply (null, value as unknown as number[]);
    }
    
    public static GetBinary (id: string): Uint8Array {
        return new Uint8Array ((localStorage[id] as string).split ("").map (c => { return c.charCodeAt(0); }));
    }
    
    public static SetText (id: string, value: string) {
        localStorage[id] = value;
    }
    
    public static GetText (id: string): string {
        return localStorage[id];
    }
    
}