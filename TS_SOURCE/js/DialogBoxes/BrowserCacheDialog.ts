document.addEventListener ("DOMContentLoaded", () => {
    
    BrowserCacheDialog.DialogBoxElement = document.getElementById ("cache-box")!;
    
    document.querySelector ("#cache-box > div.fullscreen-grayout")!.addEventListener ("click", () => {
        BrowserCacheDialog.FinishTransaction (null);
    })
});

class BrowserCacheDialog {
    
    public static DialogBoxElement: HTMLElement;
    private static CurrentTransaction: ((data: Uint8Array | null, name?: string) => void) | null;
    
    private static SetTransaction (transaction: (data: Uint8Array | null, name?: string) => void) {
        if (this.CurrentTransaction) {
            this.CurrentTransaction (null);
        }
        
        this.DialogBoxElement.style.display = "flex";
        this.CurrentTransaction = transaction;
    }
    
    public static FinishTransaction (message: Uint8Array | null, name?: string) {
        if (this.CurrentTransaction) {
            this.CurrentTransaction (message, name);
        }
        
        this.DialogBoxElement.style.display = "none";
        this.CurrentTransaction = null;
    }
    
    public static GetEngineListData (callback: (data: Uint8Array | null, name?: string) => void, message: string = "Browser cache") {
        this.SetTransaction (callback);
        
        this.DialogBoxElement.querySelector ("span")!.innerHTML = message;
        
        let container = document.getElementById ("cache-box-content")!;
        container.innerHTML = "";
        
        let lists: string[] = [];
        
        for (let i in localStorage) {
            if (/^(.)+\.enl$/.test (i)) {
                lists.push (i);
            }
        }
        
        lists = lists.sort ();
        
        lists.forEach (i => {
            let listItem = document.createElement ("div");
            listItem.classList.add ("option-button");
            
            listItem.addEventListener ("click", () => {
                this.FinishTransaction (Store.GetBinary (i), i.replace (/\.enl$/, ""));
            });
            
            listItem.innerHTML = i;
            container.appendChild (listItem);
        });
        
    }
    
    public static DisplayCache (message: string = "Browser cache") {
        this.DialogBoxElement.style.display = "flex";
        this.DialogBoxElement.querySelector ("span")!.innerHTML = message;
        
        let container = document.getElementById ("cache-box-content")!;
        container.innerHTML = "";
        
        let lists: string[] = [];
        
        for (let i in localStorage) {
            if (/^(.)+\.enl$/.test (i)) {
                lists.push (i);
            }
        }
        
        lists = lists.sort ();
        
        lists.forEach (i => {
            let listItem = document.createElement ("div");
            listItem.innerHTML = i;
            
            let removeButton = document.createElement ("img");
            removeButton.src = "img/button/remove-cache.png";
            removeButton.title = "Remove this list from cache";
            removeButton.classList.add ("option-button");
            removeButton.classList.add ("cache-option-button");
            removeButton.addEventListener ("click", () => {
                if (confirm (`You are going to delete ${i}\n\nAre you sure?`)) {
                    Store.Remove (i);
                    this.DisplayCache ();
                    Notifier.Info (`${i} deleted from cache`);
                }
            });
            listItem.appendChild (removeButton);
            
            let renameButton = document.createElement ("img");
            renameButton.src = "img/button/rename-cache.png";
            renameButton.title = "Rename this list";
            renameButton.classList.add ("option-button");
            renameButton.classList.add ("cache-option-button");
            renameButton.addEventListener ("click", () => {
                let newName = prompt ("Enter a new name:", i.replace (/\.enl$/, ""));
                if (newName) {
                    newName = newName.replace (/\.enl$/, "");
                    newName += ".enl";
                    Store.Rename (i, newName);
                    this.DisplayCache ();
                }
            });
            listItem.appendChild (renameButton);
            
            let appendButton = document.createElement ("img");
            appendButton.src = "img/button/append-cache.png";
            appendButton.title = "Append this list";
            appendButton.classList.add ("option-button");
            appendButton.classList.add ("cache-option-button");
            appendButton.addEventListener ("click", () => {
                
                Serializer.DeserializeMany (Store.GetBinary (i), MainEngineTable);
                MainEngineTable.RebuildTable ();
                
                this.DialogBoxElement.style.display = "none";
            });
            listItem.appendChild (appendButton);
            
            let openButton = document.createElement ("img");
            openButton.src = "img/button/open-cache.png";
            openButton.title = "Open this list";
            openButton.classList.add ("option-button");
            openButton.classList.add ("cache-option-button");
            openButton.addEventListener ("click", () => {
                if (MainEngineTable.Items.length == 0 || confirm ("All unsaved changes to this list will be lost.\n\nAre you sure you want to open a list from cache?")) {
                    ListNameDisplay.SetValue (i.replace (/\.enl$/, ""))
                    
                    MainEngineTable.Items = [];
                    Serializer.DeserializeMany (Store.GetBinary (i), MainEngineTable);
                    MainEngineTable.RebuildTable ();
                    this.DialogBoxElement.style.display = "none";
                }
            });
            listItem.appendChild (openButton);
            
            container.appendChild (listItem);
        });
    }
    
}