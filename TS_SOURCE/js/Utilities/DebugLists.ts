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
            
            toAppend.push (newEngine);
        }
        
        MainEngineTable.Items = MainEngineTable.Items.concat (toAppend);
        MainEngineTable.RebuildTable ();
    }
    
}