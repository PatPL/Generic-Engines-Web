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
            let modelInfo = ModelInfo.GetModelInfo (e.ModelID);
            
            modelInfo.ModelFiles.forEach (f => {
                if (!toFetch.some (x => x[0] == f)) {
                    //Add to the list if it's not on it already
                    toFetch.push ([f, f.replace (/^files\//, "")]);
                }
            });
        });
        
        const SendCallbackIfDone = () => {
            console.log (`Remaining: ${toFetch.length}`);
            if (toFetch.length == 0) {
                FileIO.ZipBlobs ("GenericEngines", blobs, zipData => {
                    callback (zipData);
                });
            }
        }
        
        toFetch.forEach (resource => {
            fetch (resource[0]).then (res => {
                if (!res.ok) {
                    console.warn (`Resource not fetched: ${resource[0]}`);
                    toFetch = toFetch.filter (x => x != resource);
                    SendCallbackIfDone ();
                    return;
                }
                
                if (res.body) {
                    res.body.getReader ().read ().then (data => {
                        if (data) {
                            blobs[resource[1]] = data.value;
                            toFetch = toFetch.filter (x => x != resource);
                            SendCallbackIfDone ();
                        }
                    });
                }
            });
        });
        
    }
    
}