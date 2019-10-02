class RandomValue {
    
    /**
     * Creates a RNG with set parameters
     * @param minimum Lowest possible value
     * @param maximum Highest possible value
     * @param type Randomness type
     * @param value Output type
     */
    constructor (
        private minimum: number,
        private maximum: number,
        private type: "linear" | "bell",
        private value: "float" | "integer"
    ) { }
    
    public Get (): number {
        let output = 0;
        
        switch (this.type) {
            case "linear":
                output = WRand.Linear (this.minimum, this.maximum);
            break; case "bell":
                output = WRand.Bell (this.minimum, this.maximum, 3);
            break;
        }
        
        if (this.value == "integer") {
            output = Math.round (output);
        }
        
        return output;
    }
    
}