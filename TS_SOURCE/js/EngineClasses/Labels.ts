class Labels implements IEditable {
    
    EngineName: string = "";
    EngineManufacturer: string = "Generic Engines";
    EngineDescription: string = "This engine was generated by Generic Engines";
    
    ParentEngine: Engine | null;
    
    constructor (parent: Engine | null) {
        this.ParentEngine = parent;
    }
    
    public static IsManufacturerDefault (config: Labels): boolean {
        let originalConfig = new Labels (null);
        return config.EngineManufacturer == originalConfig.EngineManufacturer;
    }
    
    public static IsDescriptionDefault (config: Labels): boolean {
        let originalConfig = new Labels (null);
        return config.EngineDescription == originalConfig.EngineDescription;
    }
    
    public GetDisplayElement (): HTMLElement {
        let tmp = document.createElement ("div");
        tmp.classList.add ("content-cell-content");
        return tmp;
    }
    
    public ApplyValueToDisplayElement (e: HTMLElement): void {
        if (this.EngineName == "") {
            e.innerHTML = `<<< Same as ID`;
        } else {
            e.innerHTML = `${this.EngineName}`;
        }
    }
    
    public GetEditElement (): HTMLElement {
        let tmp = document.createElement ("div");
        tmp.classList.add ("content-cell-content");
        tmp.style.height = "192px";
        tmp.style.padding = "0";
        
        let grid = document.createElement ("div");
        grid.style.display = "grid";
        grid.style.gridTemplateColumns = "116px auto";
        grid.style.gridTemplateRows = "24px 24px 24px 120px";
        grid.style.gridTemplateAreas = `
            "a b"
            "c d"
            "e e"
            "f f"
        `;
        
        grid.innerHTML = `
            <div class="content-cell-content" style="grid-area: a;">Name</div>
            <div style="grid-area: b;"><input style="width: calc(100%);"></div>
            
            <div class="content-cell-content" style="grid-area: c;">Manufacturer</div>
            <div style="grid-area: d;"><input style="width: calc(100%);"></div>
            
            <div class="content-cell-content" style="grid-area: e;">Description</div>
            <div style="grid-area: f;"><textarea style="resize: none; width: calc(100%); height: 100%;"></textarea></div>
        `;
        
        tmp.appendChild (grid);
        
        return tmp;
    }
    
    public ApplyValueToEditElement (e: HTMLElement): void {
        let inputs = e.querySelectorAll ("input");
        
        inputs[0].value = this.EngineName;
        inputs[1].value = this.EngineManufacturer;
        
        inputs[0].disabled = this.ParentEngine!.Polymorphism.PolyType == PolymorphismType.MultiConfigSlave;
        inputs[1].disabled = this.ParentEngine!.Polymorphism.PolyType == PolymorphismType.MultiConfigSlave;
        
        e.querySelector ("textarea")!.value = this.EngineDescription;
    }
    
    public ApplyChangesToValue (e: HTMLElement): void {
        let inputs = e.querySelectorAll ("input");
        
        this.EngineName = inputs[0].value;
        this.EngineManufacturer = inputs[1].value;
        this.EngineDescription = e.querySelector ("textarea")!.value;
    }
    
}