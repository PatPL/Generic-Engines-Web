declare var zip: any;
zip.workerScriptsPath = "lib/";

class FileIO {
    
    public static ToClipboard (value: string): boolean {
        if (value.length == 0) {
            return false;
        }
        
        let textArea = document.createElement ("textarea");
        document.body.appendChild (textArea);
        
        textArea.value = value;
        textArea.focus ();
        textArea.select ();
        let ok = document.execCommand ("copy");
        
        document.body.removeChild (textArea);
        return ok;
    }
    
    // Benchmark: 330 files:
    // JSZip DEFLATE1: Zipped in 99'726ms, 91.3MB
    // JSZIP STORE: Zipped in 76'360ms, 262MB
    // zip.js DEFLATE: Zipped in 27'936ms, 84.7MB 
    // zip.js STORE: Zipped in 3'207ms, 262MB << the way to go
    public static ZipBlobs (
        rootDirName: string,
        blobs: {[blobname: string]: Uint8Array | string},
        callback: (zipBlob: Uint8Array) => void,
        progressStatus?: (alreadyZipped: number, toZip: number) => void
    ) {
        
        let zippedCount = 0;
        let fileCount = Object.getOwnPropertyNames (blobs).length;
        
        if (progressStatus) { progressStatus (0, fileCount); }
        zip.createWriter (new zip.BlobWriter (), (writer: any) => {
            for (let blobname in blobs) {
                let blob = blobs[blobname];
                const onEnd = () => {
                    writer.close ((blob: Blob) => {
                        new Response (blob).arrayBuffer ().then (a => {
                            callback (new Uint8Array (a));
                        });
                    })
                }
                
                if (blob instanceof Uint8Array) {
                    writer.add (`${rootDirName}/${blobname}`, new zip.BlobReader (new Blob ([blob])), () => {
                        ++zippedCount;
                        if (progressStatus) { progressStatus (zippedCount, fileCount); }
                        if (zippedCount == fileCount) {
                            onEnd ();
                        }
                    });
                } else {
                    writer.add (`${rootDirName}/${blobname}`, new zip.TextReader (blob), () => {
                        ++zippedCount;
                        if (progressStatus) { progressStatus (zippedCount, fileCount); }
                        if (zippedCount == fileCount) {
                            onEnd ();
                        }
                    });
                }
            }
        }, (error: any) => {
            Notifier.Error ("There was an error during zip.js initialization");
            console.error ("zip.js error:", error);
        }, true);
        
    }
    
    public static OpenText(extensions?: string, callback?: (data: string | null, filename: string) => void) {
        this.Open(FileType.Text, extensions, (result, filename) => {
            if (callback) {
                if (result) {
                    if (typeof result === "string") {
                        callback (result, filename);
                    } else {
                        callback (null, filename);
                    }
                } else {
                    callback (null, filename);
                }
            }
        });
    }
    
    public static OpenBinary(extensions?: string, callback?: (data: Uint8Array | null, filename: string) => void) {
        this.Open(FileType.Binary, extensions, (result, filename) => {
            if (callback) {
                if (result) {
                    if (result instanceof Uint8Array) {
                        callback (result, filename);
                    } else {
                        callback (null, filename);
                    }
                } else {
                    callback (null, filename);
                }
            }
        });
    }

    private static Open(type: FileType, extensions?: string, callback?: (data: string | Uint8Array | null, filename: string) => void) {
        let fileDialog: HTMLInputElement = document.createElement("input");
        fileDialog.type = "file";
        if (extensions && extensions != "") {
            fileDialog.accept = extensions;
        }
        fileDialog.click();

        fileDialog.addEventListener("change", () => {
            if (!fileDialog.files || !fileDialog.files[0]) {
                console.log("No file selected?");

                if (callback) {
                    callback(null, "");
                }

                return;
            }

            let file = fileDialog.files[0];

            let reader = new FileReader();
            reader.onload = () => {
                if (callback) {
                    if (reader.result instanceof ArrayBuffer) {
                        callback(new Uint8Array(reader.result), file.name);
                    } else {
                        callback(reader.result, file.name);
                    }

                }
            }

            if (type == FileType.Text) {
                reader.readAsText(file);
            } else if (type == FileType.Binary) {
                reader.readAsArrayBuffer(file);
            }
        });
    }
    
    public static SaveText (filename: string, contents: string) {
        let saveDialog = document.createElement ("a");
        saveDialog.href = `data:application/x-none;charset=UTF-8;base64,${btoa(contents)}`;
        saveDialog.download = filename;
        
        //saveDialog.click ();
        let evt = document.createEvent("MouseEvents"); 
        evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null); 
        saveDialog.dispatchEvent(evt);
    }
    
    public static SaveBinary (filename: string, contents: Uint8Array) {
        let saveDialog = document.createElement ("a");
        let blob = new Blob ([contents], {
            type: "application/octet-stream"
        });
        
        saveDialog.href = URL.createObjectURL (blob);
        saveDialog.download = filename;
        
        //saveDialog.click ();
        let evt = document.createEvent("MouseEvents"); 
        evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null); 
        saveDialog.dispatchEvent(evt);
    }
    
}