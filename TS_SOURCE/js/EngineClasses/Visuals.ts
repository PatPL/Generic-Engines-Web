class Visuals implements IEditable {
    
    ModelID: Model = Model.LR91;
    PlumeID: Plume = Plume.Kerolox_Upper;
    
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
    }
    
    public ApplyChangesToValue (e: HTMLElement): void {
        let selects = e.querySelectorAll ("select");
        
        this.ModelID = parseInt (selects[0].value);
        this.PlumeID = parseInt (selects[1].value);
    }
    
}