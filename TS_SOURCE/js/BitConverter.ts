class BitConverter {
    
    private static buffer8: ArrayBuffer = new ArrayBuffer (8);
    private static buffer4: ArrayBuffer = new ArrayBuffer (4);
    private static doubleBuffer: Float64Array = new Float64Array (BitConverter.buffer8);
    private static intBuffer: Int32Array = new Int32Array (BitConverter.buffer4);
    
    public static DoubleToByteArray (number: number): Uint8Array {
        this.doubleBuffer[0] = number;
        return new Uint8Array(this.buffer8);
    }
    
    public static IntToByteArray (number: number): Uint8Array {
        this.intBuffer[0] = number;
        return new Uint8Array(this.buffer4);
    }
    
}