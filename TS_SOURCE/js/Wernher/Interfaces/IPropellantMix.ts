interface IPropellantMix {
    
    /**
     * Propellants and their respective ratio be weight
     */
    readonly Propellants: [Fuel, IRandomValueProvider][];
    readonly Plume: Plume;
    
}