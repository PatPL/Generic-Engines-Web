class Serializer {
    
    public static readonly Version = 13;
    
    public static Copy (engine: Engine): Engine {
        let [copiedEngine, _] = Serializer.Deserialize (Serializer.Serialize (engine), 0, engine.EngineList);
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
    
    public static DeserializeMany (data: Uint8Array, appendToExisting?: Engine[]): Engine[] {
        let output: Engine[];
        if (appendToExisting) {
            output = appendToExisting;
        } else {
            output = [];
        }
        
        let offset = 0;
        
        while (offset < data.length) {
            let [engine, addedOffset] = Serializer.Deserialize (data, offset, output);
            output.push (engine);
            offset += addedOffset;
        }
        
        if (offset != data.length) {
            console.warn ("Possible data corruption?");
        }
        
        return output;
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
            e.Polymorphism.MasterEngineName.length + 2 //1B * length + 2B length header - MasterEngineName
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
        
        //double - AlternatorPower
        output.set (BitConverter.DoubleToByteArray (e.AlternatorPower), i);
        i += 8;
        
        //bool - GimbalConfigNotDefault
        output[i++] = !Gimbal.IsDefault (e.Gimbal) ? 1 : 0;
        
        //Include all properties inside brackets only if any Gimbal properties were changed
        if (!Gimbal.IsDefault (e.Gimbal)) {
            //bool - AdvancedGimbal
            output[i++] = e.Gimbal.AdvancedGimbal ? 1 : 0;

            //double - GimbalNX
            output.set (BitConverter.DoubleToByteArray (e.Gimbal.GimbalNX), i);
            i += 8;

            //double - GimbalPX
            output.set (BitConverter.DoubleToByteArray (e.Gimbal.GimbalPX), i);
            i += 8;

            //double - GimbalNY
            output.set (BitConverter.DoubleToByteArray (e.Gimbal.GimbalNY), i);
            i += 8;

            //double - GimbalPY
            output.set (BitConverter.DoubleToByteArray (e.Gimbal.GimbalPY), i);
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
        for (let c = 0; c < e.Labels.EngineName.length; ++c) {
            output[i++] = e.Labels.EngineName.charCodeAt (c);
        }
        
        //bool - ManufacturerNotDefault
        output[i++] = !Labels.IsManufacturerDefault (e.Labels) ? 1 : 0;
        
        if (!Labels.IsManufacturerDefault (e.Labels)) {
            //1B * length + 2B length header - EngineManufacturer
            //String header
            output[i++] = e.Labels.EngineManufacturer.length % 256;
            output[i++] = e.Labels.EngineManufacturer.length / 256;
            //String data
            for (let c = 0; c < e.ID.length; ++c) {
                output[i++] = e.Labels.EngineManufacturer.charCodeAt (c);
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
            for (let c = 0; c < e.Labels.EngineDescription.length; ++c) {
                output[i++] = e.Labels.EngineDescription.charCodeAt (c);
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
        output[i++] = e.Polymorphism.PolyType;
        
        //1B * length + 2B length header - MasterEngineName
        //String header
        output[i++] = e.Polymorphism.MasterEngineName.length % 256;
        output[i++] = e.Polymorphism.MasterEngineName.length / 256;
        //String data
        for (let c = 0; c < e.Polymorphism.MasterEngineName.length; ++c) {
            output[i++] = e.Polymorphism.MasterEngineName.charCodeAt (c);
        }
        
        return output;
    }
    
    public static Deserialize (input: Uint8Array, startOffset: number, originList: Engine[]): [Engine, number] {
        let output = new Engine (originList);
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
            
            output.FuelRatios.Items = []; //Constructor gives one element to this list
            for (let c = 0; c < dataLength; ++c) {
                let fuelType: Fuel = 0;
                if (version >= 3) {
                    fuelType += input[i++];
                    fuelType += input[i++] * 256;
                } else {
                    fuelType += input[i++] * 256;
                    fuelType += input[i++];
                }
                
                output.FuelRatios.Items.push ([fuelType, BitConverter.ByteArrayToDouble (input, i)]);
                i += 8;
            }
            
            //double - Width
            output.Dimensions.Width = BitConverter.ByteArrayToDouble (input, i);
            i += 8;
            
            //double - Height
            output.Dimensions.Height = BitConverter.ByteArrayToDouble (input, i);
            i += 8;
            
            //double - Gimbal
            output.Gimbal.Gimbal = BitConverter.ByteArrayToDouble (input, i);
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
            output.FuelRatios.FuelVolumeRatios = input[i++] == 1;
        }
        
        if (version >= 3) {
            //bool - TestFlightConfigNotDefault
            if (input[i++] == 1) {
                //bool - EnableTestFlight
                output.TestFlight.EnableTestFlight = input[i++] == 1;
                
                //int - RatedBurnTime
                output.TestFlight.RatedBurnTime = BitConverter.ByteArrayToInt (input, i);
                i += 4;
                
                //double - StartReliability0
                output.TestFlight.StartReliability0 = BitConverter.ByteArrayToDouble (input, i);
                i += 8;
                
                //double - StartReliability10k
                output.TestFlight.StartReliability10k = BitConverter.ByteArrayToDouble (input, i);
                i += 8;
                
                //double - CycleReliability0
                output.TestFlight.CycleReliability0 = BitConverter.ByteArrayToDouble (input, i);
                i += 8;
                
                //double - CycleReliability10k
                output.TestFlight.CycleReliability10k = BitConverter.ByteArrayToDouble (input, i);
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
                output.Gimbal.AdvancedGimbal = input[i++] == 1;
                
                //double - GimbalNX
                output.Gimbal.GimbalNX = BitConverter.ByteArrayToDouble (input, i);
                i += 8;
                
                //double - GimbalPX
                output.Gimbal.GimbalPX = BitConverter.ByteArrayToDouble (input, i);
                i += 8;
                
                //double - GimbalNY
                output.Gimbal.GimbalNY = BitConverter.ByteArrayToDouble (input, i);
                i += 8;
                
                //double - GimbalPY
                output.Gimbal.GimbalPY = BitConverter.ByteArrayToDouble (input, i);
                i += 8;
            }
        }
        
        if (version >= 6) {
            //short - ModelID
            output.Visuals.ModelID += input[i++]; //Might be a problem if I change default engine from value 0
            output.Visuals.ModelID += input[i++] * 256; //Will keep as it is for now though.
            
            //short - PlumeID
            output.Visuals.PlumeID += input[i++]; //Same here
            output.Visuals.PlumeID += input[i++] * 256;
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
            
            output.Labels.EngineName = "";
            for (let c = 0; c < stringLength; ++c) {
                output.Labels.EngineName += String.fromCharCode (input[i++]);
            }
            
            //bool - ManufacturerNotDefault
            if (input[i++] == 1) {
                //string - EngineManufacturer
                let stringLength = 0;
                stringLength += input[i++];
                stringLength += input[i++] * 256;
                
                output.Labels.EngineManufacturer = "";
                for (let c = 0; c < stringLength; ++c) {
                    output.Labels.EngineManufacturer += String.fromCharCode (input[i++]);
                }
            }
            
            //bool - DescriptionNotDefault
            if (input[i++] == 1) {
                //string - EngineDescription
                let stringLength = 0;
                stringLength += input[i++];
                stringLength += input[i++] * 256;
                
                output.Labels.EngineDescription = "";
                for (let c = 0; c < stringLength; ++c) {
                    output.Labels.EngineDescription += String.fromCharCode (input[i++]);
                }
            }
        }
        
        if (version >= 8) {
            //bool - UseBaseWidth
            output.Dimensions.UseBaseWidth = input[i++] == 1;
        } else { //Versions lower than 8
            //Default value before version 8 was false. Now the default value is true, so this has to be changed.
            output.Dimensions.UseBaseWidth = false;
        }
        
        if (version >= 9) {
            //byte - EngineVariant
            output.EngineVariant = input[i++];
            
            //double - TanksVolume
            output.Tank.TanksVolume = BitConverter.ByteArrayToDouble (input, i);
            i += 8;
            
            //TanksContents
            let dataLength = 0;
            dataLength += input[i++];
            dataLength += input[i++] * 256;
            
            for (let c = 0; c < dataLength; ++c) {
                let fuelType: Fuel = 0;
                fuelType += input[i++];
                fuelType += input[i++] * 256;
                
                output.Tank.TanksContents.push ([fuelType, BitConverter.ByteArrayToDouble (input, i)]);
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
            output.Tank.UseTanks = input[i++] == 1;

            //bool - LimitTanks
            output.Tank.LimitTanks = input[i++] == 1;
        }
        
        if (version >= 11) {
            //byte - PolyType
            output.Polymorphism.PolyType = input[i++];
            
            //string - MasterEngineName
            let stringLength = 0;
            stringLength += input[i++];
            stringLength += input[i++] * 256;
            
            output.Polymorphism.MasterEngineName = "";
            for (let c = 0; c < stringLength; ++c) {
                output.Polymorphism.MasterEngineName += String.fromCharCode (input[i++]);
            }
        }
        
        if (version == 12) {
            //Version 12 added two variables, that were removed in version 13
            //Only version 12 has these in the file
            //They are not read, but we need to add 12B to the byte counter to avoid errors.
            i += 12;
        }
        
        return [output, i - startOffset];
    }

}