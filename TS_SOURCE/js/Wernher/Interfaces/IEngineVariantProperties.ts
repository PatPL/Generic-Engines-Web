interface IEngineVariantProperties {
    
    Thrust: IRandomValueProvider;
    SLIsp: IRandomValueProvider;
    VacIsp: IRandomValueProvider;
    
    /**
     * Per-unit cost of the engine
     */
    Cost: (thrust: number, vacIsp: number) => number;
    
    /**
     * Cost * EntryCostMultiplier -> EntryCost
     */
    EntryCostMultiplier: IRandomValueProvider;
    
    /**
     * Which year does it become available
     */
    CanonAvailabilityYear: number;
}