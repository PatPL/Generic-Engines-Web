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
        let latestData: Uint8Array | null = null;
        exportBoxContainer.innerHTML = "";
        
        let RequestRound = 0;
        let fetchAborter: AbortController = new AbortController ();
        
        document.getElementById ("export-refresh")!.onclick = () => {
            SendRequests ();
        }
        document.getElementById ("export-abort")!.onclick = () => {
            fetchAborter.abort ();
            RequestRound++;
            if (this.IsWorking) {
                callback (null);
            }
            this.IsWorking = false;
            latestData = null;
            this.StatusWindowElement.style.display = "none";
        }
        
        let blobs: {[blobname: string]: Uint8Array | string} = {};
        /**
         * [resourceLocation, resourceDestination]
         */
        let toFetch: [string, string, HTMLElement?][] = [];
        
        blobs[`GenericEngines/${ name }.cfg`] = Exporter.ConvertEngineListToConfig (engines);
        blobs[`GenericEngines/GEAllTankDefinition.cfg`] = AllTankDefinition.Get ();
        
        toFetch.push (["files/PlumeScaleFixer.dll", "GenericEngines/PlumeScaleFixer.dll"]);
        
        let needsDeployableEngines = false;
        engines.forEach (e => {
            if (!e.Active) {
                return; // continue;
            }
            
            let modelInfo = ModelInfo.GetModelInfo (e.GetModelID ());
            let plumeInfo = PlumeInfo.GetPlumeInfo (e.PlumeID);
            let exhaustPlumeInfo = e.UseExhaustEffect && modelInfo.Exhaust ? PlumeInfo.GetPlumeInfo (e.ExhaustPlumeID) : null;
            
            needsDeployableEngines = needsDeployableEngines || modelInfo.ExtendNozzleAnimation != undefined;
            
            modelInfo.ModelFiles.forEach (f => {
                if (!toFetch.some (x => x[0] == f)) {
                    // Add to the list if it's not on it already
                    toFetch.push ([f, f.replace (/^files\//, "GenericEngines/")]);
                }
            });
            
            plumeInfo.PlumeFiles.forEach (f => {
                if (!toFetch.some (x => x[0] == f)) {
                    // Add to the list if it's not on it already
                    toFetch.push ([f, f.replace (/^files\//, "")]);
                }
            });
            
            if (exhaustPlumeInfo) {
                exhaustPlumeInfo.PlumeFiles.forEach (f => {
                    if (!toFetch.some (x => x[0] == f)) {
                        // Add to the list if it's not on it already
                        toFetch.push ([f, f.replace (/^files\//, "")]);
                    }
                });
            }
            
        });
        
        if (needsDeployableEngines) {
            // Add DeployableEngines if we export an engine with a model that has a deployable engine
            toFetch.push (["files/DeployableEngines/Plugins/DeployableEngines.dll", "DeployableEngines/Plugins/DeployableEngines.dll"]);
            toFetch.push (["files/DeployableEngines/Versioning/DeployableEngines.version", "DeployableEngines/Versioning/DeployableEngines.version"]);
        }
        
        downloadedFilesCountElement.innerHTML = "0";
        toDownload = toFetch.length;
        document.getElementById ("export-to-download")!.innerHTML = toDownload.toString ();
        exportStatusElement.innerHTML = "Downloading files";
        
        let SendCallbackIfDone = () => {
            downloadedFilesCountElement.innerHTML = (toDownload - toFetch.length).toString ();
            if (toFetch.length == 0) {
                exportStatusElement.innerHTML = `<img src="svg/load16.svg"> Zipping all files <progress />`;
                let progressElement = exportStatusElement.querySelector<HTMLProgressElement> ("progress")!;
                let thisRequest = ++RequestRound;
                let zipStart = new Date ().getTime ();
                FileIO.ZipBlobs ("GameData", blobs, zipData => {
                    console.info (`Zipped in ${ (new Date ().getTime () - zipStart).toLocaleString ("us").replace (/[^0-9]/g, "'") }ms`);
                    if (this.IsWorking && thisRequest == RequestRound) {
                        latestData = zipData;
                        exportStatusElement.innerHTML = "Done. <button>Redownload finished zip</button>";
                        exportStatusElement.querySelector ("button")!.onclick = () => {
                            if (latestData) {
                                callback (latestData);
                            }
                        }
                        this.IsWorking = false;
                        callback (zipData);
                    }
                }, (alreadyZippedCount, toZipCount) => {
                    progressElement.value = alreadyZippedCount;
                    progressElement.max = toZipCount;
                });
            }
        }
        
        toFetch.forEach (resource => {
            resource[2] = document.createElement ("div");
            resource[2].innerHTML = `
                <span class="left">${ resource[1] }</span>
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
                        console.warn (`(fetch) Promise finished for expired round: ${ resource[0] }`);
                    }
                    
                    if (!res.ok) {
                        resource[2]!.children[1].innerHTML = "Error. Not fetched";
                        console.warn (`Resource not fetched: ${ resource[0] }`);
                        return;
                    }
                    
                    resource[2]!.children[1].innerHTML = "Downloading";
                    if (this.IsWorking) {
                        res.arrayBuffer ().then (data => {
                            if (thisRound != RequestRound) {
                                console.warn (`(download) Promise finished for expired round: ${ resource[0] }`);
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
                        console.warn (`(Fetch error) Resource not fetched: ${ resource[0] }`);
                    }
                    return;
                });
            });
        }
        
        SendRequests ();
    }
    
}