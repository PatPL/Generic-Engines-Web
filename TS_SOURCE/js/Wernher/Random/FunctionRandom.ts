class FunctionRandom implements IRandomValueProvider {
    
    /**
     * Rolls a random value from a random function
     * @param funcBias ONLY LEFT 0.0 <-> 1.0 ONLY RIGHT
     * @param leftFunction Left function
     * @param rightFunction Right function
     */
    constructor (
        private funcBias: number,
        private leftFunction: ((...args: number[]) => number) | IRandomValueProvider | number,
        private rightFunction: ((...args: number[]) => number) | IRandomValueProvider | number,
    ) { }
    
    public Get (...args: number[]) {
        if (Math.random () > this.funcBias) {
            if (typeof this.leftFunction == "function") {
                return this.leftFunction (...args);
            } else if (typeof this.leftFunction == "number") {
                return this.leftFunction;
            } else {
                return this.leftFunction.Get (...args);
            }
        } else {
            if (typeof this.rightFunction == "function") {
                return this.rightFunction (...args);
            } else if (typeof this.rightFunction == "number") {
                return this.rightFunction;
            } else {
                return this.rightFunction.Get (...args);
            }
        }
    }
    
}