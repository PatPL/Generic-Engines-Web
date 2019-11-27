interface IFuelInfo {
    
    readonly FuelName: string;
    readonly FuelID: string;
    readonly FuelType: FuelType;
    /**
     * Stored in tonnes of resource per unit
     * (t/l)
     */
    readonly Density: number;
    readonly TankUtilisation: number;
    
}