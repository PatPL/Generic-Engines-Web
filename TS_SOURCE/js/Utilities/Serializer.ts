class Serializer {
    
    public static readonly Version = 14;
    
    public static Copy (engine: Engine): Engine {
        let [copiedEngine, _] = Serializer.Deserialize (Serializer.Serialize (engine), 0);
        copiedEngine.EngineList = engine.EngineList;
        return copiedEngine;
    }
    
    public static SerializeMany (engines: Engine[]): Uint8Array {
        let data: Uint8Array[] = [];
        let length = 0;
        engines.forEach (engine => {
            data.push (Serializer.Serialize (engine));
            length += data[data.length - 1].length;
        });
        
        let output = new Uint8Array (length);
        let i = 0;
        
        data.forEach (array => {
            output.set (array, i);
            i += array.length;
        });
        
        return output;
    }
    
    public static DeserializeMany (data: Uint8Array): Engine[] {
        let offset = 0;
        let deserializedEngines: Engine[] = [];
        
        while (offset < data.length) {
            let [engine, addedOffset] = Serializer.Deserialize (data, offset);
            deserializedEngines.push (engine);
            offset += addedOffset;
        }
        
        if (offset != data.length) {
            console.warn ("Possible data corruption?");
        }
        
        return deserializedEngines;
    }
    
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
            e.FuelRatioItems.length * 10 + 2 + //(2B + 8B) * count + 2B length header - PropellantRatio
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
            (!e.IsTestFlightDefault () ? 1 : 0) * ( //Include all properties inside brackets only if any Test Flight properties were changed
            1 + //bool - EnableTestFlight
            4 + //int - RatedBurnTime
            8 + //double - StartReliability0
            8 + //double - StartReliability10k
            8 + //double - CycleReliability0
            8)+ //double - CycleReliability10k
            8 + //double - AlternatorPower
            1 + //bool - GimbalConfigNotDefault
            (!e.IsGimbalDefault () ? 1 : 0) * ( //Include all properties inside brackets only if any Gimbal properties were changed
            1 + //bool - AdvancedGimbal
            8 + //double - GimbalNX
            8 + //double - GimbalPX
            8 + //double - GimbalNY
            8)+ //double - GimbalPY
            2 + //short - ModelID
            2 + //short - PlumeID
            2 + //short - TechUnlockNode
            4 + //int - EntryCost
            (e.EngineName.length + 2) + //1B * length + 2B length header - EngineName
            1 + //bool - ManufacturerNotDefault
            (!e.IsManufacturerDefault () ? 1 : 0) * (e.EngineManufacturer.length + 2) + //(1B * length + 2B length header) if manufacturer was changed - EngineManufacturer
            1 + //bool - DescriptionNotDefault
            (!e.IsDescriptionDefault () ? 1 : 0) * (e.EngineDescription.length + 2) + //(1B * length + 2B length header) if description was changed - EngineDescription
            1 + //bool - UseBaseWidth
            1 + //EngineType - EngineVariant
            8 + //double - TanksVolume
            e.TanksContents.length * 10 + 2 + //(2B + 8B) * count + 2B length header - TanksContents
            e.ThrustCurve.length * 16 + 2 + //(8B + 8B) * count + 2B length header - ThrustCurve
            1 + //bool - UseTanks
            1 + //bool - LimitTanks
            1 + //Polymorphism - PolyType
            e.MasterEngineName.length + 2 + //1B * length + 2B length header - MasterEngineName
            1 + //bool - ExhaustConfigNotDefault
            (!e.IsExhaustDefault () ? 1 : 0) * ( //Include exhaust settings if they're not default
            1 + //bool - UseExhaustEffect
            2 + //short - ExhaustPlumeID
            8 + //double - ExhaustThrustPercent
            8 + //double - ExhaustIspMultiplier
            8 + //double - ExhaustGimbal
            1 //bool - ExhaustGimbalOnlyRoll
            )
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
        for (let c = 0; c < e.ID.length; ++c) {
            output[i++] = e.ID.charCodeAt (c);
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
        output[i++] = e.FuelRatioItems.length % 256;
        output[i++] = e.FuelRatioItems.length / 256;
        //Data
        e.FuelRatioItems.forEach (f => {
            output[i++] = f[0] % 256;
            output[i++] = f[0] / 256;
            output.set (BitConverter.DoubleToByteArray (f[1]), i);
            i += 8;
        });
        
        //double - Width
        output.set (BitConverter.DoubleToByteArray (e.Width), i);
        i += 8;
        
        //double - Height
        output.set (BitConverter.DoubleToByteArray (e.Height), i);
        i += 8;
        
        //double - Gimbal
        output.set (BitConverter.DoubleToByteArray (e.Gimbal), i);
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
        output[i++] = e.FuelVolumeRatios ? 1 : 0;
        
        //bool - TestFlightConfigNotDefault
        output[i++] = !e.IsTestFlightDefault () ? 1 : 0;
        
        //Include all properties inside brackets only if any Test Flight properties were changed
        if (!e.IsTestFlightDefault ()) {
            //bool - EnableTestFlight
            output[i++] = e.EnableTestFlight ? 1 : 0;
            
            //int - RatedBurnTime
            output.set (BitConverter.IntToByteArray (e.RatedBurnTime), i);
            i += 4;
            
            //double - StartReliability0
            output.set (BitConverter.DoubleToByteArray (e.StartReliability0), i);
            i += 8;
            
            //double - StartReliability10k
            output.set (BitConverter.DoubleToByteArray (e.StartReliability10k), i);
            i += 8;
            
            //double - CycleReliability0
            output.set (BitConverter.DoubleToByteArray (e.CycleReliability0), i);
            i += 8;
            
            //double - CycleReliability10k
            output.set (BitConverter.DoubleToByteArray (e.CycleReliability10k), i);
            i += 8;
        }
        
        //double - AlternatorPower
        output.set (BitConverter.DoubleToByteArray (e.AlternatorPower), i);
        i += 8;
        
        //bool - GimbalConfigNotDefault
        output[i++] = !e.IsGimbalDefault () ? 1 : 0;
        
        //Include all properties inside brackets only if any Gimbal properties were changed
        if (!e.IsGimbalDefault ()) {
            //bool - AdvancedGimbal
            output[i++] = e.AdvancedGimbal ? 1 : 0;

            //double - GimbalNX
            output.set (BitConverter.DoubleToByteArray (e.GimbalNX), i);
            i += 8;

            //double - GimbalPX
            output.set (BitConverter.DoubleToByteArray (e.GimbalPX), i);
            i += 8;

            //double - GimbalNY
            output.set (BitConverter.DoubleToByteArray (e.GimbalNY), i);
            i += 8;

            //double - GimbalPY
            output.set (BitConverter.DoubleToByteArray (e.GimbalPY), i);
            i += 8;
        }
        
        //short - ModelID
        output[i++] = e.ModelID % 256;
        output[i++] = e.ModelID / 256;
        
        //short - PlumeID
        output[i++] = e.PlumeID % 256;
        output[i++] = e.PlumeID / 256;
        
        //short - TechUnlockNode
        output[i++] = e.TechUnlockNode % 256;
        output[i++] = e.TechUnlockNode / 256;
        
        //int - EntryCost
        output.set (BitConverter.IntToByteArray (e.EntryCost), i);
        i += 4;
        
        //1B * length + 2B length header - EngineName
        //String header
        output[i++] = e.EngineName.length % 256;
        output[i++] = e.EngineName.length / 256;
        //String data
        for (let c = 0; c < e.EngineName.length; ++c) {
            output[i++] = e.EngineName.charCodeAt (c);
        }
        
        //bool - ManufacturerNotDefault
        output[i++] = !e.IsManufacturerDefault () ? 1 : 0;
        
        if (!e.IsManufacturerDefault ()) {
            //1B * length + 2B length header - EngineManufacturer
            //String header
            output[i++] = e.EngineManufacturer.length % 256;
            output[i++] = e.EngineManufacturer.length / 256;
            //String data
            for (let c = 0; c < e.EngineManufacturer.length; ++c) {
                output[i++] = e.EngineManufacturer.charCodeAt (c);
            }
        }
        
        //bool - DescriptionNotDefault
        output[i++] = !e.IsDescriptionDefault () ? 1 : 0;
        
        if (!e.IsDescriptionDefault ()) {
            //1B * length + 2B length header - EngineDescription
            //String header
            output[i++] = e.EngineDescription.length % 256;
            output[i++] = e.EngineDescription.length / 256;
            //String data
            for (let c = 0; c < e.EngineDescription.length; ++c) {
                output[i++] = e.EngineDescription.charCodeAt (c);
            }
        }
        
        //bool - UseBaseWidth
        output[i++] = e.UseBaseWidth ? 1 : 0;
        
        //byte - EngineVariant
        output[i++] = e.EngineVariant;
        
        //double - TanksVolume
        output.set (BitConverter.DoubleToByteArray (e.TanksVolume), i);
        i += 8;
        
        //(2B + 8B) * count + 2B length header - TanksContents
        //Length header
        output[i++] = e.TanksContents.length % 256;
        output[i++] = e.TanksContents.length / 256;
        //Data
        e.TanksContents.forEach (f => {
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
        output[i++] = e.UseTanks ? 1 : 0;
        
        //bool - LimitTanks
        output[i++] = e.LimitTanks ? 1 : 0;
        
        //byte - PolyType
        output[i++] = e.PolyType;
        
        //1B * length + 2B length header - MasterEngineName
        //String header
        output[i++] = e.MasterEngineName.length % 256;
        output[i++] = e.MasterEngineName.length / 256;
        //String data
        for (let c = 0; c < e.MasterEngineName.length; ++c) {
            output[i++] = e.MasterEngineName.charCodeAt (c);
        }
        
        //bool - ExhaustNotDefault
        output[i++] = !e.IsExhaustDefault () ? 1 : 0;
        
        if (!e.IsExhaustDefault ()) {
            //bool - UseExhaustEffect
            output[i++] = e.UseExhaustEffect ? 1 : 0;
            
            //short - ExhaustPlumeID
            output[i++] = e.ExhaustPlumeID % 256;
            output[i++] = e.ExhaustPlumeID / 256;
            
            //double - ExhaustThrustPercent
            output.set (BitConverter.DoubleToByteArray (e.ExhaustThrustPercent), i);
            i += 8;
            
            //double - ExhaustIspMultiplier
            output.set (BitConverter.DoubleToByteArray (e.ExhaustIspPercent), i);
            i += 8;
            
            //double - ExhaustGimbal
            output.set (BitConverter.DoubleToByteArray (e.ExhaustGimbal), i);
            i += 8;
            
            //bool - ExhaustGimbalOnlyRoll
            output[i++] = e.ExhaustGimbalOnlyRoll ? 1 : 0;
        }
        
        return output;
    }
    
    public static Deserialize (input: Uint8Array, startOffset: number): [Engine, number] {
        let output = new Engine ();
        let i = startOffset;
        
        //short - Version
        let version = 0;
        version += input[i++];
        version *= 256;
        version += input[i++];
        
        if (version >= 0) {
            //bool - Active
            output.Active = input[i++] == 1;
            
            //string - ID
            let stringLength = 0;
            if (version >= 3) {
                stringLength += input[i++];
                stringLength += input[i++] * 256;
            } else {
                stringLength += input[i++] * 256;
                stringLength += input[i++];
            }
            
            output.ID = "";
            for (let c = 0; c < stringLength; ++c) {
                output.ID += String.fromCharCode (input[i++]);
            }
            
            //double - Mass
            output.Mass = BitConverter.ByteArrayToDouble (input, i);
            i += 8;
            
            //double - Thrust
            output.Thrust = BitConverter.ByteArrayToDouble (input, i);
            i += 8;
            
            //double - AtmIsp
            output.AtmIsp = BitConverter.ByteArrayToDouble (input, i);
            i += 8;
            
            //double - VacIsp
            output.VacIsp = BitConverter.ByteArrayToDouble (input, i);
            i += 8;
            
            //PropellantRatio
            let dataLength = 0;
            if (version >= 3) {
                dataLength += input[i++];
                dataLength += input[i++] * 256;
            } else {
                dataLength += input[i++] * 256;
                dataLength += input[i++];
            }
            
            output.FuelRatioItems = []; //Constructor gives one element to this list
            for (let c = 0; c < dataLength; ++c) {
                let fuelType: Fuel = 0;
                if (version >= 3) {
                    fuelType += input[i++];
                    fuelType += input[i++] * 256;
                } else {
                    fuelType += input[i++] * 256;
                    fuelType += input[i++];
                }
                
                output.FuelRatioItems.push ([fuelType, BitConverter.ByteArrayToDouble (input, i)]);
                i += 8;
            }
            
            //double - Width
            output.Width = BitConverter.ByteArrayToDouble (input, i);
            i += 8;
            
            //double - Height
            output.Height = BitConverter.ByteArrayToDouble (input, i);
            i += 8;
            
            //double - Gimbal
            output.Gimbal = BitConverter.ByteArrayToDouble (input, i);
            i += 8;
            
            //int - Cost
            output.Cost = BitConverter.ByteArrayToInt (input, i);
            i += 4;
        }
        
        if (version >= 1) {
            //double - MinThrust
            output.MinThrust = BitConverter.ByteArrayToDouble (input, i);
            i += 8;
            
            //int - Ignitions
            output.Ignitions = BitConverter.ByteArrayToInt (input, i);
            i += 4;
            
            //bool - PressureFed
            output.PressureFed = input[i++] == 1;
            
            //bool - NeedsUllage
            output.NeedsUllage = input[i++] == 1;
        }
        
        if (version >= 2) {
            //bool - FuelVolumeRatios
            output.FuelVolumeRatios = input[i++] == 1;
        }
        
        if (version >= 3) {
            //bool - TestFlightConfigNotDefault
            if (input[i++] == 1) {
                //bool - EnableTestFlight
                output.EnableTestFlight = input[i++] == 1;
                
                //int - RatedBurnTime
                output.RatedBurnTime = BitConverter.ByteArrayToInt (input, i);
                i += 4;
                
                //double - StartReliability0
                output.StartReliability0 = BitConverter.ByteArrayToDouble (input, i);
                i += 8;
                
                //double - StartReliability10k
                output.StartReliability10k = BitConverter.ByteArrayToDouble (input, i);
                i += 8;
                
                //double - CycleReliability0
                output.CycleReliability0 = BitConverter.ByteArrayToDouble (input, i);
                i += 8;
                
                //double - CycleReliability10k
                output.CycleReliability10k = BitConverter.ByteArrayToDouble (input, i);
                i += 8;
            }
        }
        
        if (version >= 4) {
            //double - AlternatorPower
            output.AlternatorPower = BitConverter.ByteArrayToDouble (input, i);
            i += 8;
        }
        
        if (version >= 5) {
            //bool - GimbalConfigNotDefault
            if (input[i++] == 1) {
                //bool - AdvancedGimbal
                output.AdvancedGimbal = input[i++] == 1;
                
                //double - GimbalNX
                output.GimbalNX = BitConverter.ByteArrayToDouble (input, i);
                i += 8;
                
                //double - GimbalPX
                output.GimbalPX = BitConverter.ByteArrayToDouble (input, i);
                i += 8;
                
                //double - GimbalNY
                output.GimbalNY = BitConverter.ByteArrayToDouble (input, i);
                i += 8;
                
                //double - GimbalPY
                output.GimbalPY = BitConverter.ByteArrayToDouble (input, i);
                i += 8;
            }
        }
        
        if (version >= 6) {
            //short - ModelID
            output.ModelID = input[i++]; //Might be a problem if I change default engine from value 0
            output.ModelID += input[i++] * 256; //Will keep as it is for now though.
            
            //short - PlumeID
            output.PlumeID = input[i++]; //Same here
            output.PlumeID += input[i++] * 256; // EDIT: This became a problem. Fixed.
            
            // As of 0.9.0, Real Plume is deprecated
            output.PlumeID = PlumeInfo.MapRealPlumesToGenericPlumes (output.PlumeID);
        }
        
        if (version >= 7) {
            //short - TechUnlockNode
            output.TechUnlockNode += input[i++]; //Same as with ModelID & PlumeID
            output.TechUnlockNode += input[i++] * 256;
            
            //int - EntryCost
            output.EntryCost = BitConverter.ByteArrayToInt (input, i);
            i += 4;
            
            //string - EngineName
            let stringLength = 0;
            stringLength += input[i++];
            stringLength += input[i++] * 256;
            
            output.EngineName = "";
            for (let c = 0; c < stringLength; ++c) {
                output.EngineName += String.fromCharCode (input[i++]);
            }
            
            //bool - ManufacturerNotDefault
            if (input[i++] == 1) {
                //string - EngineManufacturer
                let stringLength = 0;
                stringLength += input[i++];
                stringLength += input[i++] * 256;
                
                output.EngineManufacturer = "";
                for (let c = 0; c < stringLength; ++c) {
                    output.EngineManufacturer += String.fromCharCode (input[i++]);
                }
            }
            
            //bool - DescriptionNotDefault
            if (input[i++] == 1) {
                //string - EngineDescription
                let stringLength = 0;
                stringLength += input[i++];
                stringLength += input[i++] * 256;
                
                output.EngineDescription = "";
                for (let c = 0; c < stringLength; ++c) {
                    output.EngineDescription += String.fromCharCode (input[i++]);
                }
            }
        }
        
        if (version >= 8) {
            //bool - UseBaseWidth
            output.UseBaseWidth = input[i++] == 1;
        } else { //Versions lower than 8
            //Default value before version 8 was false. Now the default value is true, so this has to be changed.
            output.UseBaseWidth = false;
        }
        
        if (version >= 9) {
            //byte - EngineVariant
            output.EngineVariant = input[i++];
            
            //double - TanksVolume
            output.TanksVolume = BitConverter.ByteArrayToDouble (input, i);
            i += 8;
            
            //TanksContents
            let dataLength = 0;
            dataLength += input[i++];
            dataLength += input[i++] * 256;
            
            for (let c = 0; c < dataLength; ++c) {
                let fuelType: Fuel = 0;
                fuelType += input[i++];
                fuelType += input[i++] * 256;
                
                output.TanksContents.push ([fuelType, BitConverter.ByteArrayToDouble (input, i)]);
                i += 8;
            }
            
            //ThrustCurve
            dataLength = 0;
            dataLength += input[i++];
            dataLength += input[i++] * 256;
            
            for (let c = 0; c < dataLength; ++c) {
                let tmp = BitConverter.ByteArrayToDouble (input, i);
                i += 8;
                
                output.ThrustCurve.push ([tmp, BitConverter.ByteArrayToDouble (input, i)]);
                i += 8;
            }
        }
        
        if (version >= 10) {
            //bool - UseTanks
            output.UseTanks = input[i++] == 1;

            //bool - LimitTanks
            output.LimitTanks = input[i++] == 1;
        }
        
        if (version >= 11) {
            //byte - PolyType
            output.PolyType = input[i++];
            
            //string - MasterEngineName
            let stringLength = 0;
            stringLength += input[i++];
            stringLength += input[i++] * 256;
            
            output.MasterEngineName = "";
            for (let c = 0; c < stringLength; ++c) {
                output.MasterEngineName += String.fromCharCode (input[i++]);
            }
        }
        
        if (version == 12) {
            //Version 12 added two variables, that were removed in version 13
            //Only version 12 has these in the file
            //They are not read, but we need to add 12B to the byte counter to avoid errors.
            i += 12;
        }
        
        if (version >= 14) {
            //bool - ExhaustNotDefault
            if (input[i++] == 1) {
                //bool - UseExhaustEffect
                output.UseExhaustEffect = input[i++] == 1;
                
                //short - ExhaustPlumeID
                output.ExhaustPlumeID = input[i++];
                output.ExhaustPlumeID += input[i++] * 256;
                
                //double - ExhaustThrustPercent
                output.ExhaustThrustPercent = BitConverter.ByteArrayToDouble (input, i);
                i += 8;
                
                //double - ExhaustIspMultiplier
                output.ExhaustIspPercent = BitConverter.ByteArrayToDouble (input, i);
                i += 8;
                
                //double - ExhaustGimbal
                output.ExhaustGimbal = BitConverter.ByteArrayToDouble (input, i);
                i += 8;
                
                //bool - ExhaustGimbalOnlyRoll
                output.ExhaustGimbalOnlyRoll = input[i++] == 1;
            }
        }
        
        return [output, i - startOffset];
    }

}