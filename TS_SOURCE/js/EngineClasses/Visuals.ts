class Visuals implements IEditable {
    
    ModelID: Model = Model.LR91;
    PlumeID: Plume = Plume.Kerolox_Upper;
    
    ParentEngine: Engine;
    
    constructor (parent: Engine) {
        this.ParentEngine = parent;
    }
    
    public GetPlumeConfig (engine: Engine): string {
        let modelInfo: IModelInfo = ModelInfo.GetModelInfo (engine.Visuals.ModelID);
        let plumeInfo: IPlumeInfo = PlumeInfo.GetPlumeInfo (this.PlumeID);
        
        let targetID = (
            engine.Polymorphism.PolyType == PolymorphismType.MultiConfigSlave ||
            engine.Polymorphism.PolyType == PolymorphismType.MultiModeSlave ?
            engine.Polymorphism.MasterEngineName :
            engine.ID
        );
        
        return `
            @PART[GE-${targetID}]:FOR[RealPlume]:HAS[!PLUME[${plumeInfo.PlumeID}]]:NEEDS[SmokeScreen]
            {
                PLUME
                {
                    name = ${plumeInfo.PlumeID}
                    transformName = ${modelInfo.ThrustTransformName}
                    localRotation = 0,0,0
                    localPosition = 0,0,${(modelInfo.PlumePositionOffset + plumeInfo.PositionOffset + plumeInfo.FinalOffset)}
                    fixedScale = ${(modelInfo.PlumeSizeMultiplier * plumeInfo.Scale * engine.Dimensions.Width / (engine.Dimensions.UseBaseWidth ? modelInfo.OriginalBaseWidth : modelInfo.OriginalBellWidth))}
                    flareScale = 0
                    energy = ${(Math.log (engine.Thrust + 5) / Math.log (10) / 3 * plumeInfo.EnergyMultiplier)}
                    speed = ${Math.max ((Math.log (engine.VacIsp) / Math.log (2) / 1.5) - 4.5, 0.2)}
                }
            }
        `;
    }
    
    public GetHiddenObjectsConfig (): string {
        let modelInfo: IModelInfo = ModelInfo.GetModelInfo (this.ModelID);
        let output = "";
        
        modelInfo.HiddenMuObjects.forEach (m => {
            output += `
                MODULE
                {
                    name = ModuleJettison
                    jettisonName = ${m}
                    bottomNodeName = hide
                    isFairing = True
                }
            `;
        });
        
        return output;
    }
    
    public GetModelConfig (size: Dimensions): string {
        let modelInfo: IModelInfo = ModelInfo.GetModelInfo (this.ModelID);
        let heightScale = size.Height / modelInfo.OriginalHeight;
        let widthScale = size.Width / heightScale / (size.UseBaseWidth ? modelInfo.OriginalBaseWidth : modelInfo.OriginalBellWidth);
        
        let attachmentNode = (
            modelInfo.RadialAttachment ?
            `node_attach = ${modelInfo.RadialAttachmentPoint * widthScale}, 0.0, 0.0, 1.0, 0.0, 0.0` :
            `node_attach = 0.0, ${modelInfo.NodeStackTop}, 0.0, 0.0, 1.0, 0.0`
        );
        
        return `
            MODEL
            {
                model = ${modelInfo.ModelPath}
                ${modelInfo.TextureDefinitions}
                scale = ${widthScale}, 1, ${widthScale}
            }
            scale = 1
            rescaleFactor = ${heightScale}

            node_stack_top = 0.0, ${modelInfo.NodeStackTop}, 0.0, 0.0, 1.0, 0.0, 1
            node_stack_bottom = 0.0, ${modelInfo.NodeStackBottom}, 0.0, 0.0, -1.0, 0.0, 1
            node_stack_hide = 0.0, ${modelInfo.NodeStackBottom + 0.001}, 0.0, 0.0, 0.0, 1.0, 0

            ${attachmentNode}
        `;
    }
    
    public GetDisplayElement (): HTMLElement {
        let tmp = document.createElement ("div");
        tmp.classList.add ("content-cell-content");
        return tmp;
    }
    
    public ApplyValueToDisplayElement (e: HTMLElement): void {
        e.innerHTML = `${ModelInfo.GetModelInfo (this.ModelID).ModelName}, ${PlumeInfo.GetPlumeInfo (this.PlumeID).PlumeName}`;
    }
    
    public GetEditElement (): HTMLElement {
        let tmp = document.createElement ("div");
        tmp.classList.add ("content-cell-content");
        tmp.style.height = "48px";
        tmp.style.padding = "0";
        
        let grid = document.createElement ("div");
        grid.style.display = "grid";
        grid.style.gridTemplateColumns = "60px auto";
        grid.style.gridTemplateRows = "24px 24px";
        grid.style.gridTemplateAreas = `
            "a b"
            "c d"
        `;
        
        grid.innerHTML = `
            <div class="content-cell-content" style="grid-area: a;">Model</div>
            <div style="grid-area: b;">${ModelInfo.Dropdown.outerHTML}</div>
            <div class="content-cell-content" style="grid-area: c;">Plume</div>
            <div style="grid-area: d;">${PlumeInfo.Dropdown.outerHTML}</div>
        `;
        
        tmp.appendChild (grid);
        
        return tmp;
    }
    
    public ApplyValueToEditElement (e: HTMLElement): void {
        let selects = e.querySelectorAll ("select");
        
        selects[0].value = this.ModelID.toString ();
        selects[1].value = this.PlumeID.toString ();
        
        selects[0].disabled = (
            this.ParentEngine.Polymorphism.PolyType == PolymorphismType.MultiConfigSlave ||
            this.ParentEngine.Polymorphism.PolyType == PolymorphismType.MultiModeSlave
        );
    }
    
    public ApplyChangesToValue (e: HTMLElement): void {
        let selects = e.querySelectorAll ("select");
        
        this.ModelID = parseInt (selects[0].value);
        this.PlumeID = parseInt (selects[1].value);
    }
    
}