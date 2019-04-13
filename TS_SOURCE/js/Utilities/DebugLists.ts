class DebugLists {
    
    public static AppendListForPreviews () {
        let toAppend: Engine[] = [];
        let modelCount = Object.getOwnPropertyNames (Model).length / 2;
        
        for (let i = 0; i < modelCount; ++i) {
            let newEngine = new Engine ();
            let modelInfo = ModelInfo.GetModelInfo (i);
            newEngine.Active = true;
            newEngine.ID = `PREVIEW-${("0000" + i).slice(-4)}`;
            newEngine.EngineName = `(${("0000" + i).slice(-4)}) Model preview - ${modelInfo.ModelName}`;
            newEngine.ModelID = i;
            newEngine.UseBaseWidth = true;
            newEngine.Width = 2; //2m wide & keep correct width:height ratio to make the engine look good
            newEngine.Height = 2 * (modelInfo.OriginalHeight / modelInfo.OriginalBaseWidth);
            newEngine.Gimbal = 15;
            newEngine.FuelRatioItems = [[Fuel.Kerosene, 1]];
            newEngine.Ignitions = 0;
            newEngine.PlumeID = Plume.Hypergolic_Lower;
            toAppend.push (newEngine);
        }
        
        MainEngineTable.Items = MainEngineTable.Items.concat (toAppend);
        MainEngineTable.RebuildTable ();
    }
    
    public static AppendListForModelTest () {
        let toAppend: Engine[] = [];
        let modelCount = Object.getOwnPropertyNames (Model).length / 2;
        
        let newEngine: Engine;
        let modelInfo: IModelInfo;
        for (let i = 0; i < modelCount; ++i) {
            newEngine = new Engine ();
            modelInfo = ModelInfo.GetModelInfo (i);
            newEngine.Active = true;
            newEngine.ID = `MODEL-${("0000" + i).slice(-4)}-1`;
            newEngine.EngineName = `(${("0000" + i).slice(-4)}) Model check 1 - ${modelInfo.ModelName}`;
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
            newEngine.ID = `MODEL-${("0000" + i).slice(-4)}-2`;
            newEngine.EngineName = `(${("0000" + i).slice(-4)}) Model check 2 - ${modelInfo.ModelName}`;
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
            newEngine.ID = `MODEL-${("0000" + i).slice(-4)}-3`;
            newEngine.EngineName = `(${("0000" + i).slice(-4)}) Model check 3 - ${modelInfo.ModelName}`;
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
        
        MainEngineTable.Items = MainEngineTable.Items.concat (toAppend);
        MainEngineTable.RebuildTable ();
    }
    
}