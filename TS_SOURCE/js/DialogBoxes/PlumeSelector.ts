// Populate the modal form with all of the plumes on page load
document.addEventListener ("DOMContentLoaded", () => {
    
    // Tell PlumeSelector which element is the root of the modal
    PlumeSelector.DialogBoxElement = document.getElementById ("plume-selector")!;
    
    // Cancel the ongoing transaction if user clicked off the modal
    PlumeSelector.DialogBoxElement.querySelector ("div.fullscreen-grayout")!.addEventListener ("click", () => {
        PlumeSelector.FinishTransaction (null);
    });
    
    // The HTMLObject with all of the options
    let container = PlumeSelector.DialogBoxElement.querySelector ("#plume-selector-content")!;
    container.innerHTML = "";
    
    let plumes: [Plume, IPlumeInfo][] = [];
    // Get every plume in the array to sort later
    for (let i in Plume) {
        if (isNaN (parseInt (i))) {
            break;
        }
        
        let id = parseInt (i);
        plumes.push ([id, PlumeInfo.GetPlumeInfo (id)]);
    }
    
    //Sort first by plume mod, than by plume name
    plumes.sort ((a, b) => {
        if (a[1].PlumeMod > b[1].PlumeMod) {
            return 1;
        } else if (a[1].PlumeMod < b[1].PlumeMod) {
            return -1;
        } else {
            if (a[1].PlumeName > b[1].PlumeName) {
                return 1;
            } else if (a[1].PlumeName < b[1].PlumeName) {
                return -1;
            } else {
                return 0;
            }
        }
    })
    
    //Serve
    plumes.forEach (([id, plumeInfo]) => {
        let newElement = document.createElement ("div");
        newElement.innerHTML = `
            <span>${plumeInfo.ImageLabel}</span>
            <div class="option-button"><img src="${plumeInfo.ImageSource}"></div>
        `;
        
        newElement.querySelector ("div")!.addEventListener ("click", () => {
            PlumeSelector.FinishTransaction (id);
        });
        
        ImageOverflowPreview.Hook (newElement.querySelector ("div")!);
        
        container.appendChild (newElement);
    });
    
});

class PlumeSelector {
    
    public static DialogBoxElement: HTMLElement;
    private static CurrentTransaction: ((data: Plume | null) => void) | null;
    
    private static SetTransaction (transaction: (data: Plume | null) => void) {
        if (this.CurrentTransaction) {
            this.CurrentTransaction (null);
        }
        
        this.DialogBoxElement.style.display = "flex";
        this.CurrentTransaction = transaction;
    }
    
    public static FinishTransaction (message: Plume | null) {
        if (this.CurrentTransaction) {
            this.CurrentTransaction (message);
        }
        
        this.DialogBoxElement.style.display = "none";
        this.CurrentTransaction = null;
    }
    
    public static GetPlume (callback: (data: Plume | null) => void) {
        this.SetTransaction (callback);
    }
    
}