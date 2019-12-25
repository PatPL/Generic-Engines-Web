interface IEngineVariantProperties {
    
    readonly Thrust: IRandomValueProvider;
    readonly SLIsp: IRandomValueProvider;
    readonly VacIsp: IRandomValueProvider;
    
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
     * Height of the engine is calculated based on the bell size and selected model
     */
    readonly BellWidth: (thrust: number, vacIsp: number, year: number) => number;
    
    /**
     * Cost * EntryCostMultiplier -> EntryCost
     */
    readonly EntryCostMultiplier: IRandomValueProvider;
    
    /**
     * Which year does it become available
     */
    readonly CanonAvailabilityYear: number;
}