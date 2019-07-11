// Populate the modal form with all of the models on page load
document.addEventListener ("DOMContentLoaded", () => {
    
    // Tell ModelSelector which element is the root of the modal
    ModelSelector.DialogBoxElement = document.getElementById ("model-selector")!;
    
    // Cancel the ongoing transaction if user clicked off the modal
    ModelSelector.DialogBoxElement.querySelector ("div.fullscreen-grayout")!.addEventListener ("click", () => {
        ModelSelector.FinishTransaction (null);
    });
    
    // The HTMLObject with all of the options
    let container = ModelSelector.DialogBoxElement.querySelector ("#model-selector-content")!;
    container.innerHTML = "";
    
    let models: [Model, IModelInfo][] = [];
    // Get every model in the array to sort by name
    for (let i in Model) {
        if (isNaN (parseInt (i))) {
            break;
        }
        
        let id = parseInt (i);
        models.push ([id, ModelInfo.GetModelInfo (id)]);
    }
    
    //Sort
    models.sort ((a, b) => {
        if (a[1].ModelName > b[1].ModelName) {
            return 1;
        } else if (a[1].ModelName < b[1].ModelName) {
            return -1;
        } else {
            return 0;
        }
    })
    
    //Serve
    models.forEach (([id, modelInfo]) => {
        let newElement = document.createElement ("div");
        newElement.innerHTML = `
            <span>${modelInfo.ImageLabel}</span>
            <div class="option-button"><img src="${modelInfo.ImageSource}"></div>
        `;
        
        newElement.querySelector ("div")!.addEventListener ("click", () => {
            ModelSelector.FinishTransaction (id);
        });
        
        ImageOverflowPreview.Hook (newElement.querySelector ("div")!);
        
        container.appendChild (newElement);
    });
    
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