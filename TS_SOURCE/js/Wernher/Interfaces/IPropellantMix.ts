interface IPropellantMix {
    
    /**
     * Vacuum Isp at 100% engine efficiency
     */
    readonly MaximumIsp: number;
    
    /**
     * SL Isp bonus roughly based on propellant's density
     */
    readonly SLIspMultiplier: number;
    
    /**
     * Propellants and their respective ratio be weight
     */
    readonly Propellants: [Fuel, IRandomValueProvider][];
    readonly Plume: Plume;
    
}