class BitConverter {
    
    private static buffer8: ArrayBuffer = new ArrayBuffer (8);
    private static buffer4: ArrayBuffer = new ArrayBuffer (4);
    private static view8: DataView = new DataView (BitConverter.buffer8);
    private static view4: DataView = new DataView (BitConverter.buffer4);
    private static doubleBuffer: Float64Array = new Float64Array (BitConverter.buffer8);
    private static intBuffer: Int32Array = new Int32Array (BitConverter.buffer4);
    
    private static readonly encoder = new TextEncoder ();
    private static readonly decoder = new TextDecoder ();
    
    public static ByteArrayToBase64 (data: Uint8Array): string {
        // return btoa (this.decoder.decode (data));
        
        // Yoinked off net, should work. btoa and atob don't support full unicode, and (en|de)codeURI doesn't line unicode literals.
        return btoa (String.fromCharCode.apply (null, data as unknown as number[]));
    }
    
    public static Base64ToByteArray (b64: string): Uint8Array {
        // return this.encoder.encode (atob (b64));
        
        // Yoinked off net, should work. btoa and atob don't support full unicode, and (en|de)codeURI doesn't line unicode literals.
        return new Uint8Array (atob (b64).split ("").map (c => { return c.charCodeAt (0); }));
    }
    
    public static ByteArrayToDouble (array: Uint8Array, offset: number): number {
        for (let i = 0; i < 8; ++i) {
            this.view8.setUint8 (i, array[offset + i]);
        }
        return this.view8.getFloat64 (0, true);
    }
    
    public static ByteArrayToInt (array: Uint8Array, offset: number): number {
        for (let i = 0; i < 4; ++i) {
            this.view8.setUint8 (i, array[offset + i]);
        }
        return this.view8.getInt32 (0, true);
    }
    
    public static DoubleToByteArray (number: number): Uint8Array {
        this.doubleBuffer[0] = number;
        return new Uint8Array (this.buffer8);
    }
    
    public static IntToByteArray (number: number): Uint8Array {
        this.intBuffer[0] = number;
        return new Uint8Array (this.buffer4);
    }
    
}