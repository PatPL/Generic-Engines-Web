class Packager {
    
    /**
     * Returns finished zip as a Uint8Array.
     */
    public static BuildMod (name: string, engines: Engine[], callback: (data: Uint8Array) => void) {
        
        let blobs: {[blobname: string]: Uint8Array | string} = {};
        /**
         * [resourceLocation, resourceDestination]
         */
        let toFetch: [string, string][] = [];
        
        blobs[`${name}.cfg`] = Exporter.ConvertEngineListToConfig (engines);
        blobs[`GEAllTankDefinition.cfg`] = AllTankDefinition.Get ();
        
        toFetch.push (["files/PlumeScaleFixer.dll", "PlumeScaleFixer.dll"]);
        
        engines.forEach (e => {
            if (!e.Active) {
                return; //continue;
            }
            
            let modelInfo = ModelInfo.GetModelInfo (e.ModelID);
            
            modelInfo.ModelFiles.forEach (f => {
                if (!toFetch.some (x => x[0] == f)) {
                    //Add to the list if it's not on it already
                    toFetch.push ([f, f.replace (/^files\//, "")]);
                }
            });
        });
        
        const SendCallbackIfDone = () => {
            /**/console.log (`Remaining: ${toFetch.length}`);
            if (toFetch.length == 0) {
                /**/console.log (`ZIP start`);
                FileIO.ZipBlobs ("GenericEngines", blobs, zipData => {
                    /**/console.log (`ZIP end`);
                    callback (zipData);
                });
            }
        }
        
        toFetch.forEach (resource => {
            /**/console.log (`Fetching ${resource[0]}`);
            fetch (resource[0]).then (res => {
                if (!res.ok) {
                    console.warn (`Resource not fetched: ${resource[0]}`);
                    toFetch = toFetch.filter (x => x != resource);
                    SendCallbackIfDone ();
                    return;
                }
                /**/console.log (`Fetched ${resource[0]}`);
                if (res) {
                    res.arrayBuffer ().then (data => {
                        /**/console.log (`Read ${resource[0]}`);
                        blobs[resource[1]] = new Uint8Array (data);
                        toFetch = toFetch.filter (x => x != resource);
                        SendCallbackIfDone ();
                    });
                }
            });
        });
        
    }
    
}