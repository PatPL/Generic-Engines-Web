window.addEventListener ("DOMContentLoaded", () => {
    Packager.StatusWindowElement = document.getElementById ("export-box")!;
});

/* 
 * I am not proud of this code.
 * Promise chains are kinda tough to handle
 * 
 * I *promise* I'll try better next time
 * 
 */

class Packager {
    
    public static StatusWindowElement: HTMLElement;
    public static IsWorking: boolean;
    
    /**
     * Returns finished zip as a Uint8Array.
     */
    public static BuildMod (name: string, engines: Engine[], callback: (data: Uint8Array | null) => void) {
        
        this.IsWorking = true;
        
        this.StatusWindowElement.style.display = "flex";
        let downloadedFilesCountElement = document.getElementById ("export-done")!;
        let exportBoxContainer = document.getElementById ("export-box-container")!;
        let exportStatusElement = document.getElementById ("export-status")!;
        let toDownload: number;
        exportBoxContainer.innerHTML = "";
        
        let RequestRound = 0;
        let fetchAborter: AbortController = new AbortController ();
        
        document.getElementById ("export-refresh")!.onclick = () => {
            SendRequests ();
        }
        document.getElementById ("export-abort")!.onclick = () => {
            fetchAborter.abort ();
            RequestRound++;
            callback (null);
            this.IsWorking = false;
            this.StatusWindowElement.style.display = "none";
        }
        
        let blobs: {[blobname: string]: Uint8Array | string} = {};
        /**
         * [resourceLocation, resourceDestination]
         */
        let toFetch: [string, string, HTMLElement?][] = [];
        
        blobs[`${name}.cfg`] = Exporter.ConvertEngineListToConfig (engines);
        blobs[`GEAllTankDefinition.cfg`] = AllTankDefinition.Get ();
        
        toFetch.push (["files/PlumeScaleFixer.dll", "PlumeScaleFixer.dll"]);
        
        engines.forEach (e => {
            if (!e.Active) {
                return; //continue;
            }
            
            let modelInfo = ModelInfo.GetModelInfo (e.GetModelID ());
            
            modelInfo.ModelFiles.forEach (f => {
                if (!toFetch.some (x => x[0] == f)) {
                    //Add to the list if it's not on it already
                    toFetch.push ([f, f.replace (/^files\//, "")]);
                }
            });
        });
        
        downloadedFilesCountElement.innerHTML = "0";
        toDownload = toFetch.length;
        document.getElementById ("export-to-download")!.innerHTML = toDownload.toString ();
        exportStatusElement.innerHTML = "Downloading files";
        
        let SendCallbackIfDone = () => {
            downloadedFilesCountElement.innerHTML = (toDownload - toFetch.length).toString ();
            if (toFetch.length == 0) {
                exportStatusElement.innerHTML = `<img src="img/load16.gif"> Zipping all files`;
                let thisRequest = ++RequestRound;
                FileIO.ZipBlobs ("GenericEngines", blobs, zipData => {
                    if (this.IsWorking && thisRequest == RequestRound) {
                        exportStatusElement.innerHTML = "Done";
                        this.IsWorking = false;
                        callback (zipData);
                    }
                });
            }
        }
        
        toFetch.forEach (resource => {
            resource[2] = document.createElement ("div");
            resource[2].innerHTML = `
                <span class="left">${resource[1]}</span>
                <span class="right">Waiting</span>
            `;
            
            exportBoxContainer.appendChild (resource[2]);
        })
        
        const SendRequests = () => {
            fetchAborter.abort ();
            fetchAborter = new AbortController ();
            
            let thisRound = ++RequestRound;
            toFetch.forEach (resource => {
                resource[2]!.children[1].innerHTML = "Fetching resource";
                fetch (resource[0], {
                    signal: fetchAborter.signal
                }).then (res => {
                    if (thisRound != RequestRound) {
                        console.warn (`(fetch) Promise finished for expired round: ${resource[0]}`);
                    }
                    
                    if (!res.ok) {
                        resource[2]!.children[1].innerHTML = "Error. Not fetched";
                        console.warn (`Resource not fetched: ${resource[0]}`);
                        return;
                    }
                    
                    resource[2]!.children[1].innerHTML = "Downloading";
                    if (this.IsWorking) {
                        res.arrayBuffer ().then (data => {
                            if (thisRound != RequestRound) {
                                console.warn (`(download) Promise finished for expired round: ${resource[0]}`);
                            }
                            
                            blobs[resource[1]] = new Uint8Array (data);
                            toFetch = toFetch.filter (x => x != resource);
                            resource[2]!.remove ();
                            SendCallbackIfDone ();
                        });
                    }
                }).catch ((e) => {
                    if (e.code == 20) {
                        resource[2]!.children[1].innerHTML = "Refetching resource";
                    } else {
                        resource[2]!.children[1].innerHTML = "Fetch error";
                        console.warn (`(Fetch error) Resource not fetched: ${resource[0]}`);
                    }
                    return;
                });
            });
        }
        
        SendRequests ();
    }
    
}