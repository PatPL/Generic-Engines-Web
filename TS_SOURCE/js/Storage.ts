class Store {
    
    private static readonly encoder = new TextEncoder ();
    private static readonly decoder = new TextDecoder ();
    
    public static SetBinary (id: string, value: Uint8Array) {
        localStorage[id] = this.decoder.decode (value);
    }
    
    public static GetBinary (id: string): Uint8Array {
        return this.encoder.encode (localStorage[id]);
    }
    
    public static SetText (id: string, value: string) {
        localStorage[id] = value;
    }
    
    public static GetText (id: string): string {
        return localStorage[id];
    }
    
}