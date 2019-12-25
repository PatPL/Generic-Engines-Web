enum EngineCycle {
    /**
     * Regular gas generator, where propellant powers the turbine
     */
    GasGenerator,
    
    /**
     * Gas generator engine, which uses a different fuel to power the turbine (like RD-107)
     */
    AuxiliaryGasGenerator,
    
    /**
     * Staged combustion engine with oxidiser rich preburner
     */
    OxidiserStagedCombustion,
    
    /**
     * Staged combustion engine with fuel rich preburner
     */
    FuelStagedCombustion,
    
    /**
     * Staged combustion engine with oxidiser and fuel rich preburners
     */
    FullStagedCombustion,
    
    /**
     * Regular pressure fed engine
     */
    PressureFed,
    
    /**
     * Small, simple pressure fed engine for orbital maneuvers
     */
    Thruster,
    
    /**
     * Expander cycle engine, which dumps propellant used to drive the turbine overboard, trading efficiency for thrust
     */
    OpenExpander,
    
    /**
     * Regular expander cycle engine, where propellant driving the turbine is piped to the combustion chamber
     */
    ClosedExpander,
    
    /**
     * Rocket engine, which uses gasses from the combustion chamber to power the turbine. Spent gasses are dumped overboard.
     */
    TapOff,
    
    /**
     * Rocket engine with an electric propellant pump
     */
    Electric,
}