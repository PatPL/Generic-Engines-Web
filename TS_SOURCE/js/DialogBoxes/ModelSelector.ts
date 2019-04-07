document.addEventListener ("DOMContentLoaded", () => {
    
    ModelSelector.DialogBoxElement = document.getElementById ("model-selector")!;
    
    ModelSelector.DialogBoxElement.querySelector ("div.fullscreen-grayout")!.addEventListener ("click", () => {
        ModelSelector.FinishTransaction (null);
    });
    
    let container = ModelSelector.DialogBoxElement.querySelector ("#model-selector-content")!;
    container.innerHTML = "";
    
    for (let i in Model) {
        if (isNaN (parseInt (i))) {
            break;
        }
        
        let modelInfo = ModelInfo.GetModelInfo (parseInt (i));
        let newElement = document.createElement ("div");
        newElement.innerHTML = `
            <img class="option-button" src="${modelInfo.ImageSource}"><br>
            ${modelInfo.ImageLabel}
        `;
        
        newElement.querySelector ("img")!.addEventListener ("click", () => {
            ModelSelector.FinishTransaction (parseInt (i));
        });
        
        container.appendChild (newElement);
        
    }
    
});

class ModelSelector {
    
    public static DialogBoxElement: HTMLElement;
    private static CurrentTransaction: ((data: Model | null) => void) | null;
    
    private static SetTransaction (transaction: (data: Model | null) => void) {
        if (this.CurrentTransaction) {
            this.CurrentTransaction (null);
        }
        
        this.DialogBoxElement.style.display = "flex";
        this.CurrentTransaction = transaction;
    }
    
    public static FinishTransaction (message: Model | null) {
        if (this.CurrentTransaction) {
            this.CurrentTransaction (message);
        }
        
        this.DialogBoxElement.style.display = "none";
        this.CurrentTransaction = null;
    }
    
    public static GetModel (callback: (data: Model | null) => void) {
        this.SetTransaction (callback);
    }
    
}