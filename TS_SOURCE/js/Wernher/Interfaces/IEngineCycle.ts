interface IEngineCycle {
    
    readonly Variants: { [prop: number]: IEngineVariantProperties | undefined };
    
    readonly Ullage: boolean;
    readonly Models: Model[];
    
    readonly Thrust: IRandomValueProvider;
    readonly SLEfficiency: IRandomValueProvider;
    readonly VacEfficiency: IRandomValueProvider;
    
    /**
     * Per-unit cost of the engine (VF)
     */
    readonly Cost: (
        thrust: number,
        year: number,
        costMultiplier: number
    ) => number;
    
    /**
     * Height of the engine is calculated based on the bell size and selected model
     * Bell width returned in (m)
     */
    readonly BellWidth: (thrust: number, year: number) => number;
    
    /**
     * Dry mass of the engine, in (kg)
     */
    readonly Mass: (bellWidth: number, year: number) => number;
    
    /**
     * Engine's rated burn time duration (s)
     */
    readonly TestFlightRatedBurnTime: IRandomValueProvider;
    
    /**
     * Percent chance of succesful engine ignition at 100% data (%)
     */
    readonly TestFlight10kIgnition: IRandomValueProvider;
    
    /**
     * How many percent lower is the ignition chance at 0% data, compared to 100% data (%)
     */
    readonly TestFlight10kIgnitionDeficiency: IRandomValueProvider;
    
    /**
     * Percent chance of succesful engine firing during the entire rated butn time duration (%)
     */
    readonly TestFlight10kCycle: IRandomValueProvider;
    
    /**
     * How many percent lower is the succesful engine burn cycle at 0% data, compared to 100% data (%)
     */
    readonly TestFlight10kCycleDeficiency: IRandomValueProvider;
    
    /**
     * Which year does it become available
     */
    readonly CanonAvailabilityYear: number;
    
}