interface IEngineVariantProperties {
    
    readonly CostMultiplier: IRandomValueProvider;
    
    /**
     * Cost * EntryCostMultiplier -> EntryCost
     */
    readonly EntryCostMultiplier: IRandomValueProvider;
    
    /**
     * Which year does it become available
     */
    readonly CanonAvailabilityYear: number;
}