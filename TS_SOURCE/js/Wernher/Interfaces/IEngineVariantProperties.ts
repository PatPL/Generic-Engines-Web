interface IEngineVariantProperties {
    
    readonly CostMultiplier: IRandomValueProvider;
    
    /**
     * Per-unit cost of the engine
     */
    readonly Cost: (
        thrust: number,
        vacIsp: number,
        year: number,
        costMultiplier: number
    ) => number;
    
    /**
     * Cost * EntryCostMultiplier -> EntryCost
     */
    readonly EntryCostMultiplier: IRandomValueProvider;
    
    /**
     * Which year does it become available
     */
    readonly CanonAvailabilityYear: number;
}