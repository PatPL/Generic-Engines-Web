class FuelRatios implements IEditable {
    
    Items: [Fuel, number][] = [[Fuel.Hydrazine, 1]];
    
    public GetDisplayElement (): HTMLElement {
        let tmp = document.createElement ("div");
        tmp.classList.add ("content-cell-content");
        return tmp;
    }
    
    public ApplyValueToDisplayElement (e: HTMLElement): void {
        let fuels: [Fuel, number][] = [];
        let electric: number = 0;
        let output = "";
        
        this.Items.forEach (v => {
            if (v[0] == Fuel.ElectricCharge) {
                electric = v[1];
            } else {
                fuels.push (v);
            }
        });
        
        if (fuels.length == 0) {
            output += "Not set";
        } else if (fuels.length == 1) {
            output += FuelInfo.GetFuelInfo (fuels[0][0]).FuelName;
        } else {
            let ratios = "";
            let names = "";
            
            fuels.forEach (v => {
                ratios += `${v[1]}:`;
                names += `${FuelInfo.GetFuelInfo (v[0]).FuelName}:`;
            });
            
            ratios = ratios.substring (0, ratios.length - 1);
            names = names.substring (0, names.length - 1);
            
            output += `${ratios} ${names}`;
        }
        
        if (electric > 0) {
            output += ` | Electric: ${electric}kW`;
        }
        
        e.innerHTML = output;
    }
    
    public GetEditElement (): HTMLElement {
        let tmp = document.createElement ("div");
        tmp.classList.add ("content-cell-content");
        tmp.style.height = "72px";
        tmp.style.padding = "0";
        
        let grid = document.createElement ("div");
        grid.style.display = "grid";
        grid.style.gridTemplateColumns = "60px auto 24px";
        grid.style.gridTemplateRows = "24px 24px 24px";
        grid.style.gridTemplateAreas = `
            "a a a"
            "b c d"
            "e f g"
        `;
        
        grid.innerHTML = `
            <div class="content-cell-content" style="grid-area: a;"></div>
            <div class="content-cell-content" style="grid-area: b;">Width</div>
            <div style="grid-area: c;"><input style="width: calc(100%);"></div>
            <div class="content-cell-content" style="grid-area: d;">m</div>
            <div class="content-cell-content" style="grid-area: e;">Height</div>
            <div style="grid-area: f;"><input style="width: calc(100%);"></div>
            <div class="content-cell-content" style="grid-area: g;">m</div>
        `;
        
        let checkboxLabel = document.createElement ("span");
        let checkbox = document.createElement ("input");
        
        checkboxLabel.style.position = "relative";
        checkboxLabel.style.top = "-4px";
        checkboxLabel.style.left = "4px";
        
        checkbox.type = "checkbox";
        
        checkbox.addEventListener ("change", e => {
            checkboxLabel.innerHTML = checkbox.checked ? "Base width" : "Bell width";
        });
        
        grid.children[0].appendChild (checkbox);
        grid.children[0].appendChild (checkboxLabel);
        
        tmp.appendChild (grid);
        
        return tmp;
    }
    
}