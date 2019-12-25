class ConstantValue implements IRandomValueProvider {
    
    /**
     * Always returns the given value
     * @param value The value
     */
    constructor (
        private value: number
    ) { }
    
    public Get (): number {
        return this.value;
    }
    
}