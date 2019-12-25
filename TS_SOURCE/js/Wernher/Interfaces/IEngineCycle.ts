interface IEngineCycle {
    
    Variants: { [prop in PropellantMix]: IEngineVariantProperties };
    Ignitions: IRandomValueProvider;
    MinimumThrust: IRandomValueProvider;
    
    Ullage: boolean;
    Models: Model[];
    
    /**
     * Dry mass of the engine
     */
    Mass: (thrust: number, vacIsp: number) => number;
    
    /**
     * Height of the engine is calculated based on the bell size and selected model
     */
    BellWidth: (thrust: number, vacIsp: number) => number;
    
    /**
     * Engine's rated burn time duration
     */
    TestFlightRatedBurnTime: IRandomValueProvider;
    
    /**
     * Percent chance of succesful engine ignition at 100% data
     */
    TestFlight10kIgnition: IRandomValueProvider;
    
    /**
     * How many percent lower is the ignition chance at 0% data, compared to 100% data
     */
    TestFlight10kIgnitionDeficiency: IRandomValueProvider;
    
    /**
     * Percent chance of succesful engine firing during the entire rated butn time duration
     */
    TestFlight10kCycle: IRandomValueProvider;
    
    /**
     * How many percent lower is the succesful engine burn cycle at 0% data, compared to 100% data
     */
    TestFlight10kCycleDeficiency: IRandomValueProvider;
    
    /**
     * Which year does it become available
     */
    CanonAvailabilityYear: number;
    
}