class DebugLists {
    
    public static AppendListForExhaustPreviews () {
        let toAppend: Engine[] = [];
        let modelCount = Object.getOwnPropertyNames (Model).length / 2;
        
        for (let i = 0; i < modelCount; ++i) {
            let newEngine = new Engine ();
            newEngine.EngineList = MainEngineTable.Items;
            let modelInfo = ModelInfo.GetModelInfo (i);
            
            if (!modelInfo.Exhaust) {
                continue;
            }
            
            newEngine.Active = true;
            newEngine.ID = `PREVIEW-E${ ("0000" + i).slice (-4) }`;
            newEngine.EngineName = `(E${ ("0000" + i).slice (-4) }) Exhaust preview - ${ modelInfo.ModelName }`;
            newEngine.ModelID = i;
            newEngine.UseBaseWidth = true;
            
            newEngine.Width = 2; // 2m wide & keep correct width:height ratio to make the engine look good
            // Trim to 3 closest decimal places (1mm)
            newEngine.Height = 2 * (modelInfo.OriginalHeight / modelInfo.OriginalBaseWidth);
            let trimmed = newEngine.Height.toFixed (3);
            let numberString = newEngine.Height.toString ().length >= trimmed.length ? trimmed : newEngine.Height.toString ();
            newEngine.Height = parseFloat (numberString);
            
            newEngine.NeedsUllage = false;
            newEngine.Mass = 0.5;
            newEngine.Thrust = 100;
            newEngine.VacIsp = 1500;
            newEngine.AtmIsp = 1000;
            newEngine.AlternatorPower = 10;
            
            newEngine.Gimbal = 5;
            newEngine.FuelRatioItems = [[Fuel.Kerosene, 1]];
            newEngine.Ignitions = 0;
            let plumes = [Plume.GP_Alcolox, Plume.GP_Ammonialox, Plume.GP_Hydrolox, Plume.GP_Hydynelox, Plume.GP_Hypergolic, Plume.GP_Kerolox, Plume.GP_Methalox, Plume.GP_Solid];
            newEngine.PlumeID = plumes[Math.floor (plumes.length * Math.random ())];
            let exhaustPlumes = [Plume.GP_OmsWhite, Plume.GP_OmsRed, Plume.GP_TurbopumpSmoke, Plume.GP_HydrogenNTR];
            newEngine.UseExhaustEffect = true;
            newEngine.ExhaustThrustPercent = 10;
            newEngine.ExhaustIspPercent = 90;
            newEngine.ExhaustGimbal = 20;
            newEngine.ExhaustGimbalOnlyRoll = false;
            newEngine.ExhaustPlumeID = exhaustPlumes[Math.floor (exhaustPlumes.length * Math.random ())];
            
            toAppend.push (newEngine);
        }
        
        MainEngineTable.AddItems (toAppend);
    }
    
    public static AppendListForModelPreviews () {
        let toAppend: Engine[] = [];
        let modelCount = Object.getOwnPropertyNames (Model).length / 2;
        
        for (let i = 0; i < modelCount; ++i) {
            let newEngine = new Engine ();
            newEngine.EngineList = MainEngineTable.Items;
            let modelInfo = ModelInfo.GetModelInfo (i);
            newEngine.Active = true;
            newEngine.ID = `PREVIEW-P${ ("0000" + i).slice (-4) }`;
            newEngine.EngineName = `(P${ ("0000" + i).slice (-4) }) Model preview - ${ modelInfo.ModelName }`;
            newEngine.ModelID = i;
            newEngine.UseBaseWidth = true;
            
            newEngine.Width = 2; // 2m wide & keep correct width:height ratio to make the engine look good
            // Trim to 3 closest decimal places (1mm)
            newEngine.Height = 2 * (modelInfo.OriginalHeight / modelInfo.OriginalBaseWidth);
            let trimmed = newEngine.Height.toFixed (3);
            let numberString = newEngine.Height.toString ().length >= trimmed.length ? trimmed : newEngine.Height.toString ();
            newEngine.Height = parseFloat (numberString);
            
            newEngine.NeedsUllage = false;
            newEngine.Mass = 0.05;
            newEngine.Thrust = 10;
            newEngine.VacIsp = 15000;
            newEngine.AtmIsp = 10000;
            newEngine.AlternatorPower = 10;
            
            newEngine.Gimbal = 20;
            newEngine.FuelRatioItems = [[Fuel.Kerosene, 1]];
            newEngine.Ignitions = 0;
            let plumes = [Plume.GP_Alcolox, Plume.GP_Ammonialox, Plume.GP_Hydrolox, Plume.GP_Hydynelox, Plume.GP_Hypergolic, Plume.GP_Kerolox, Plume.GP_Methalox, Plume.GP_Solid];
            newEngine.PlumeID = plumes[Math.floor (plumes.length * Math.random ())];
            toAppend.push (newEngine);
        }
        
        MainEngineTable.AddItems (toAppend);
    }
    
    public static AppendListForPlumeTest () {
        let toAppend: Engine[] = [];
        let plumeCount = Object.getOwnPropertyNames (Plume).length / 2;
        
        for (let i = 0; i < plumeCount; ++i) {
            let newEngine = new Engine ();
            newEngine.EngineList = MainEngineTable.Items;
            let plumeInfo = PlumeInfo.GetPlumeInfo (i);
            newEngine.Active = true;
            newEngine.ID = `PREVIEW-P${ ("0000" + i).slice (-4) }PLUMETEST`;
            newEngine.EngineName = `(P${ ("0000" + i).slice (-4) }) Plume test - ${ plumeInfo.PlumeName }`;
            newEngine.UseBaseWidth = true;
            
            newEngine.Width = Math.random () * 2 + 0.5;
            newEngine.Height = Math.random () * 3 + 1;
            newEngine.Gimbal = 15;
            newEngine.Thrust = Math.pow (10, Math.random () * 4);
            newEngine.FuelRatioItems = [[Fuel.Kerosene, 1]];
            newEngine.Ignitions = 0;
            newEngine.ModelID = Math.floor (Math.random () * 9999) % (Object.getOwnPropertyNames (Model).length / 2);
            newEngine.PlumeID = i;
            toAppend.push (newEngine);
        }
        
        MainEngineTable.AddItems (toAppend);
    }
    
    public static AppendListForPlumePreviews () {
        let toAppend: Engine[] = [];
        let plumeCount = Object.getOwnPropertyNames (Plume).length / 2;
        
        for (let i = 0; i < plumeCount; ++i) {
            let newEngine = new Engine ();
            newEngine.EngineList = MainEngineTable.Items;
            let modelInfo = ModelInfo.GetModelInfo (Model.RS25_2);
            let plumeInfo = PlumeInfo.GetPlumeInfo (i);
            newEngine.Active = true;
            newEngine.ID = `PREVIEW-P${ ("0000" + i).slice (-4) }PLUME`;
            newEngine.EngineName = `(P${ ("0000" + i).slice (-4) }) Plume preview - ${ plumeInfo.PlumeName }`;
            newEngine.UseBaseWidth = true;
            
            newEngine.Width = 2; // 2m wide & keep correct width:height ratio to make the engine look good
            // Trim to 3 closest decimal places (1mm)
            newEngine.Height = 2 * (modelInfo.OriginalHeight / modelInfo.OriginalBaseWidth);
            let trimmed = newEngine.Height.toFixed (3);
            let numberString = newEngine.Height.toString ().length >= trimmed.length ? trimmed : newEngine.Height.toString ();
            newEngine.Height = parseFloat (numberString);
            
            newEngine.Gimbal = 15;
            newEngine.Thrust = Math.pow (10, Math.random () * 4);
            newEngine.FuelRatioItems = [[Fuel.Kerosene, 1]];
            newEngine.Ignitions = 0;
            newEngine.ModelID = Model.RS25_2;
            newEngine.PlumeID = i;
            toAppend.push (newEngine);
        }
        
        MainEngineTable.AddItems (toAppend);
    }
    
    public static AppendListForModelTest () {
        let toAppend: Engine[] = [];
        let modelCount = Object.getOwnPropertyNames (Model).length / 2;
        
        let newEngine: Engine;
        let modelInfo: IModelInfo;
        for (let i = 0; i < modelCount; ++i) {
            newEngine = new Engine ();
            newEngine.EngineList = MainEngineTable.Items;
            modelInfo = ModelInfo.GetModelInfo (i);
            newEngine.Active = true;
            newEngine.ID = `MODEL-${ ("0000" + i).slice (-4) }-1`;
            newEngine.EngineName = `(${ ("0000" + i).slice (-4) }) Model check 1 - ${ modelInfo.ModelName }`;
            newEngine.ModelID = i;
            newEngine.UseBaseWidth = true;
            newEngine.Width = 2;
            newEngine.Height = 2;
            newEngine.Gimbal = 15;
            newEngine.FuelRatioItems = [[Fuel.Kerosene, 1]];
            newEngine.Ignitions = 0;
            newEngine.PlumeID = Plume.Hypergolic_Lower;
            toAppend.push (newEngine);
            
            newEngine = new Engine ();
            modelInfo = ModelInfo.GetModelInfo (i);
            newEngine.Active = true;
            newEngine.ID = `MODEL-${ ("0000" + i).slice (-4) }-2`;
            newEngine.EngineName = `(${ ("0000" + i).slice (-4) }) Model check 2 - ${ modelInfo.ModelName }`;
            newEngine.ModelID = i;
            newEngine.UseBaseWidth = false;
            newEngine.Width = 2;
            newEngine.Height = 2;
            newEngine.Gimbal = 15;
            newEngine.FuelRatioItems = [[Fuel.Kerosene, 1]];
            newEngine.Ignitions = 0;
            newEngine.PlumeID = Plume.Kerolox_Vernier;
            toAppend.push (newEngine);
            
            newEngine = new Engine ();
            modelInfo = ModelInfo.GetModelInfo (i);
            newEngine.Active = true;
            newEngine.ID = `MODEL-${ ("0000" + i).slice (-4) }-3`;
            newEngine.EngineName = `(${ ("0000" + i).slice (-4) }) Model check 3 - ${ modelInfo.ModelName }`;
            newEngine.ModelID = i;
            newEngine.UseBaseWidth = true;
            newEngine.Width = 2;
            newEngine.Height = 6;
            newEngine.Gimbal = 15;
            newEngine.FuelRatioItems = [[Fuel.Kerosene, 1]];
            newEngine.Ignitions = 0;
            newEngine.PlumeID = Plume.Solid_Lower;
            toAppend.push (newEngine);
        }
        
        MainEngineTable.AddItems (toAppend);
    }
    
    public static AppendListForTankTest () {
        let toAppend: Engine[] = [];
        let modelCount = Object.getOwnPropertyNames (Model).length / 2;
        
        for (let i = 0; i < modelCount; ++i) {
            let modelInfo = ModelInfo.GetModelInfo (i);
            if (modelInfo.OriginalTankVolume == 0) {
                continue;
            }
            
            let newEngine = new Engine ();
            newEngine.EngineList = MainEngineTable.Items;
            
            newEngine.Active = true;
            newEngine.ID = `TANKTEST-${ ("0000" + i).slice (-4) }`;
            newEngine.EngineName = `(${ ("0000" + i).slice (-4) }) Tank volume test - ${ modelInfo.ModelName }`;
            newEngine.ModelID = i;
            
            newEngine.UseBaseWidth = true;
            newEngine.Width = 4;
            newEngine.Height = 4;
            
            newEngine.UseTanks = true;
            newEngine.TanksVolume = newEngine.GetTankSizeEstimate ();
            
            toAppend.push (newEngine);
        }
        
        MainEngineTable.AddItems (toAppend);
    }
    
    public static JustSpawnEngines (count?: number) {
        if (!count) {
            console.warn ("Usage: DebugLists.JustSpawnEngines (engineCount), ex. DebugLists.JustSpawnEngines (500)");
            return;
        }
        
        let toAppend = [];
        for (let i = 0; i < count; ++i) {
            let newEngine = new Engine ();
            
            newEngine.Active = true;
            newEngine.ID = `SPAMMED-ENGINES-${ ("000000" + i).slice (-6) }`;
            newEngine.EngineName = `ENGINE ${ ("00000000" + Math.floor (Math.random () * 100000000)).slice (-8) }; @${ ("000000" + i).slice (-6) }`;
            
            newEngine.Thrust = Math.random () * 10000;
            newEngine.MinThrust = Math.random () * 100;
            newEngine.AtmIsp = Math.random () * 400;
            newEngine.VacIsp = Math.random () * 500;
            
            newEngine.Active = Math.random () > 0.5;
            newEngine.PressureFed = Math.random () > 0.5;
            newEngine.NeedsUllage = Math.random () > 0.5;
            
            toAppend.push (newEngine);
        }
        
        MainEngineTable.AddItems (toAppend);
    }
    
}