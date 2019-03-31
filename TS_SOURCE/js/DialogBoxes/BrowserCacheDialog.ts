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
    
}