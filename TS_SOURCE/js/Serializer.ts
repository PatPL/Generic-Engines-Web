class Serializer {

    public static readonly Version = 12;

    public static Serialize(e: Engine): Uint8Array {
        let i = 0;
        let output = new Uint8Array(
            2 + //short - Version (BIG ENDIAN - BACKWARDS COMPATIBILITY)
            1 + //bool - Active
            (e.ID.length + 2) + //1B * length + 2B length header - ID
            8 + //double - Mass
            8 + //double - Thrust
            8 + //double - AtmIsp
            8 + //double - VacIsp
            e.FuelRatios.Items.length * 10 + 2 + //(2B + 8B) * count + 2B length header - PropellantRatio
            8 + //double - Width
            8 + //double - Height
            8 + //double - Gimbal
            4 + //int - Cost
            8 + //double - MinThrust
            4 + //int - Ignitions
            1 + //bool - PressureFed
            1 + //bool - NeedsUllage
            1 + //bool - FuelVolumeRatios
            1 + //bool - TestFlightConfigNotDefault
            (!TestFlight.IsDefault (e.TestFlight) ? 1 : 0) * ( //Include all properties inside brackets only if any Test Flight properties were changed
            1 + //bool - EnableTestFlight
            4 + //int - RatedBurnTime
            8 + //double - StartReliability0
            8 + //double - StartReliability10k
            8 + //double - CycleReliability0
            8)+ //double - CycleReliability10k
            8 + //double - AlternatorPower
            1 + //bool - GimbalConfigNotDefault
            (!Gimbal.IsDefault (e.Gimbal) ? 1 : 0) * ( //Include all properties inside brackets only if any Gimbal properties were changed
            1 + //bool - AdvancedGimbal
            8 + //double - GimbalNX
            8 + //double - GimbalPX
            8 + //double - GimbalNY
            8)+ //double - GimbalPY
            2 + //short - ModelID
            2 + //short - PlumeID
            2 + //short - TechUnlockNode
            4 + //int - EntryCost
            (e.Labels.EngineName.length + 2) + //1B * length + 2B length header - EngineName
            1 + //bool - ManufacturerNotDefault
            (!Labels.IsManufacturerDefault (e.Labels) ? 1 : 0) * (e.Labels.EngineManufacturer.length + 2) + //(1B * length + 2B length header) if manufacturer was changed - EngineManufacturer
            1 + //bool - DescriptionNotDefault
            (!Labels.IsDescriptionDefault (e.Labels) ? 1 : 0) * (e.Labels.EngineDescription.length + 2) + //(1B * length + 2B length header) if description was changed - EngineDescription
            1 + //bool - UseBaseWidth
            1 + //EngineType - EngineVariant
            8 + //double - TanksVolume
            e.Tank.TanksContents.length * 10 + 2 + //(2B + 8B) * count + 2B length header - TanksContents
            e.ThrustCurve.length * 16 + 2 + //(8B + 8B) * count + 2B length header - ThrustCurve
            1 + //bool - UseTanks
            1 + //bool - LimitTanks
            1 + //Polymorphism - PolyType
            e.Polymorphism.MasterEngineName.length + 2 + //1B * length + 2B length header - MasterEngineName
            4 + //int - MasterEngineCost
            8 //double - MasterEngineMass
        );
        
        //short - Version (BIG ENDIAN - BACKWARDS COMPATIBILITY)
        output[i++] = Serializer.Version / 256;
        output[i++] = Serializer.Version % 256;
        
        //bool - Active
        output[i++] = e.Active ? 1 : 0;
        
        //String + 2B length header - Name
        //String length header
        output[i++] = e.ID.length % 256;
        output[i++] = e.ID.length / 256;
        //String data
        for (let i = 0; i < e.ID.length; ++i) {
            output[i++] = e.ID.charCodeAt (i);
        }
        
        //double - Mass
        output.set (BitConverter.DoubleToByteArray (e.Mass), i);
        i += 8;
        
        //double - Thrust
        output.set (BitConverter.DoubleToByteArray (e.Thrust), i);
        i += 8;
        
        //double - AtmIsp
        output.set (BitConverter.DoubleToByteArray (e.AtmIsp), i);
        i += 8;
        
        //double - VacIsp
        output.set (BitConverter.DoubleToByteArray (e.VacIsp), i);
        i += 8;
        
        //(2B + 8B) * count + 2B length header - PropellantRatio
        //Length header
        output[i++] = e.FuelRatios.Items.length % 256;
        output[i++] = e.FuelRatios.Items.length / 256;
        //Data
        e.FuelRatios.Items.forEach (f => {
            output[i++] = f[0] % 256;
            output[i++] = f[0] / 256;
            output.set (BitConverter.DoubleToByteArray (f[1]), i);
            i += 8;
        });
        
        //double - Width
        output.set (BitConverter.DoubleToByteArray (e.Dimensions.Width), i);
        i += 8;
        
        //double - Height
        output.set (BitConverter.DoubleToByteArray (e.Dimensions.Height), i);
        i += 8;
        
        //double - Gimbal
        output.set (BitConverter.DoubleToByteArray (e.Gimbal.Gimbal), i);
        i += 8;
        
        //int - Cost
        output.set (BitConverter.IntToByteArray (e.Cost), i);
        i += 4;
        
        //double - MinThrust
        output.set (BitConverter.DoubleToByteArray (e.MinThrust), i);
        i += 8;
        
        //int - Ignitions
        output.set (BitConverter.IntToByteArray (e.Ignitions), i);
        i += 4;
        
        //bool - PressureFed
        output[i++] = e.PressureFed ? 1 : 0;
        
        //bool - NeedsUllage
        output[i++] = e.NeedsUllage ? 1 : 0;
        
        //bool - FuelVolumeRatios
        output[i++] = e.FuelRatios.FuelVolumeRatios ? 1 : 0;
        
        //bool - TestFlightConfigNotDefault
        output[i++] = !TestFlight.IsDefault (e.TestFlight) ? 1 : 0;
        
        //Include all properties inside brackets only if any Test Flight properties were changed
        if (!TestFlight.IsDefault (e.TestFlight)) {
            //bool - EnableTestFlight
            output[i++] = e.TestFlight.EnableTestFlight ? 1 : 0;
            
            //int - RatedBurnTime
            output.set (BitConverter.IntToByteArray (e.TestFlight.RatedBurnTime), i);
            i += 4;
            
            //double - StartReliability0
            output.set (BitConverter.DoubleToByteArray (e.TestFlight.StartReliability0), i);
            i += 8;
            
            //double - StartReliability10k
            output.set (BitConverter.DoubleToByteArray (e.TestFlight.StartReliability10k), i);
            i += 8;
            
            //double - CycleReliability0
            output.set (BitConverter.DoubleToByteArray (e.TestFlight.CycleReliability0), i);
            i += 8;
            
            //double - CycleReliability10k
            output.set (BitConverter.DoubleToByteArray (e.TestFlight.CycleReliability10k), i);
            i += 8;
        }
        
        //short - ModelID
        output[i++] = e.Visuals.ModelID % 256;
        output[i++] = e.Visuals.ModelID / 256;
        
        //short - PlumeID
        output[i++] = e.Visuals.PlumeID % 256;
        output[i++] = e.Visuals.PlumeID / 256;
        
        //short - TechUnlockNode
        output[i++] = e.TechUnlockNode % 256;
        output[i++] = e.TechUnlockNode / 256;
        
        //int - EntryCost
        output.set (BitConverter.IntToByteArray (e.EntryCost), i);
        i += 4;
        
        //1B * length + 2B length header - EngineName
        //String header
        output[i++] = e.Labels.EngineName.length % 256;
        output[i++] = e.Labels.EngineName.length / 256;
        //String data
        for (let i = 0; i < e.ID.length; ++i) {
            output[i++] = e.Labels.EngineName.charCodeAt (i);
        }
        
        //bool - ManufacturerNotDefault
        output[i++] = !Labels.IsManufacturerDefault (e.Labels) ? 1 : 0;
        
        if (!Labels.IsManufacturerDefault (e.Labels)) {
            //1B * length + 2B length header - EngineManufacturer
            //String header
            output[i++] = e.Labels.EngineManufacturer.length % 256;
            output[i++] = e.Labels.EngineManufacturer.length / 256;
            //String data
            for (let i = 0; i < e.ID.length; ++i) {
                output[i++] = e.Labels.EngineManufacturer.charCodeAt (i);
            }
        }
        
        //bool - DescriptionNotDefault
        output[i++] = !Labels.IsDescriptionDefault (e.Labels) ? 1 : 0;
        
        if (!Labels.IsDescriptionDefault (e.Labels)) {
            //1B * length + 2B length header - EngineDescription
            //String header
            output[i++] = e.Labels.EngineDescription.length % 256;
            output[i++] = e.Labels.EngineDescription.length / 256;
            //String data
            for (let i = 0; i < e.ID.length; ++i) {
                output[i++] = e.Labels.EngineDescription.charCodeAt (i);
            }
        }
        
        //bool - UseBaseWidth
        output[i++] = e.Dimensions.UseBaseWidth ? 1 : 0;
        
        //byte - EngineVariant
        output[i++] = e.EngineVariant;
        
        //double - TanksVolume
        output.set (BitConverter.DoubleToByteArray (e.Tank.TanksVolume), i);
        i += 8;
        
        //(2B + 8B) * count + 2B length header - TanksContents
        //Length header
        output[i++] = e.Tank.TanksContents.length % 256;
        output[i++] = e.Tank.TanksContents.length / 256;
        //Data
        e.Tank.TanksContents.forEach (f => {
            output[i++] = f[0] % 256;
            output[i++] = f[0] / 256;
            output.set (BitConverter.DoubleToByteArray (f[1]), i);
            i += 8;
        });
        
        //(8B + 8B) * count + 2B length header - ThrustCurve
        //Length header
        output[i++] = e.ThrustCurve.length % 256;
        output[i++] = e.ThrustCurve.length / 256;
        //Data
        e.ThrustCurve.forEach (f => {
            output.set (BitConverter.DoubleToByteArray (f[0]), i);
            i += 8;
            output.set (BitConverter.DoubleToByteArray (f[1]), i);
            i += 8;
        });
        
        //bool - UseTanks
        output[i++] = e.Tank.UseTanks ? 1 : 0;
        
        //bool - LimitTanks
        output[i++] = e.Tank.LimitTanks ? 1 : 0;
        
        //byte - PolyType
        //output[i++] = 
        //TODO: Create Polymorphism object and finish Serializer method
        
        return output;
    }

}