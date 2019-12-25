class RandomValue implements IRandomValueProvider {
    
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
        private type: "linear" | "triangle" | "bell" | "logarithmic" | "logSmooth",
        private value: "float" | "integer"
    ) { }
    
    public Get (): number {
        let output = 0;
        
        switch (this.type) {
            case "linear":
                output = WRand.Linear (this.minimum, this.maximum);
            break; case "triangle":
                output = WRand.Bell (this.minimum, this.maximum, 2);
            break; case "bell":
                output = WRand.Bell (this.minimum, this.maximum, 3);
            break; case "logarithmic":
                output = WRand.Logarithmic (this.minimum, this.maximum, 1);
            break; case "logSmooth":
                output = WRand.Logarithmic (this.minimum, this.maximum, 2);
            break; default:
                console.error ("Unknown randomness type. Did you forget to link that here?", this.type);
            break;
        }
        
        if (this.value == "integer") {
            output = Math.round (output);
        }
        
        return output;
    }
    
}