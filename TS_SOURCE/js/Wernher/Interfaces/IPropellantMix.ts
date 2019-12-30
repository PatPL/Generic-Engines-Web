interface IPropellantMix {
    
    /**
     * Vacuum Isp at 100% engine efficiency
     */
    readonly MaximumIsp: number;
    
    /**
     * Higher - propmix worse in SL (More Isp loss in atm)
     */
    readonly SLIspLossCoefficient: number;
    
    /**
     * Propellants and their respective ratio be weight
     */
    readonly Propellants: [Fuel, IRandomValueProvider][];
    readonly Plume: Plume;
    
}