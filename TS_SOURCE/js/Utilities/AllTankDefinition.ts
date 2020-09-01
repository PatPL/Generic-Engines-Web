class AllTankDefinition {
    
    public static Get (): string {
        let definitions = "";
        
        for (let i in Fuel) {
            if (isNaN (parseInt (i))) {
                break;
            }
            
            let fuelInfo = FuelInfo.GetFuelInfo (parseInt (i));
            
            definitions += `
                TANK
                {
                    name = ${ fuelInfo.FuelID }
                    mass = 0.00007
                    utilization = ${ fuelInfo.TankUtilisation }
                    fillable = True
                    amount = 0.0
                    maxAmount = 0.0
                }
            `;
        }
        
        return Exporter.CompactConfig (`
            TANK_DEFINITION {
                name = All
                highltPressurized = true
                basemass = 0.00007 * volume

                ${ definitions }

            }
        `);
    }
    
}