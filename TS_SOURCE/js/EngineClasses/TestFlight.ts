class TestFlight implements IEditable {
    
    EnableTestFlight: boolean = false;
    RatedBurnTime: number = 180;
    StartReliability0: number = 92;
    StartReliability10k: number = 96;
    CycleReliability0: number = 90;
    CycleReliability10k: number = 98;
    
    public static IsDefault (config: TestFlight): boolean {
        let defaultConfig = new TestFlight ();
        return (
            config.EnableTestFlight == defaultConfig.EnableTestFlight &&
            config.RatedBurnTime == defaultConfig.RatedBurnTime &&
            config.StartReliability0 == defaultConfig.StartReliability0 &&
            config.StartReliability10k == defaultConfig.StartReliability10k &&
            config.CycleReliability0 == defaultConfig.CycleReliability0 &&
            config.CycleReliability10k == defaultConfig.CycleReliability10k
        );
    }
    
    public GetDisplayElement (): HTMLElement {
        let tmp = document.createElement ("div");
        tmp.classList.add ("content-cell-content");
        return tmp;
    }
    
    public ApplyValueToDisplayElement (e: HTMLElement): void {
        if (this.EnableTestFlight) {
            e.innerHTML = `Enabled | ${this.StartReliability0}% - ${this.StartReliability10k}% | ${Math.round ((1 / (1 - (this.CycleReliability0 / 100))) * this.RatedBurnTime)}s - ${Math.round ((1 / (1 - (this.CycleReliability10k / 100))) * this.RatedBurnTime)}s`;
        } else {
            if (TestFlight.IsDefault (this)) {
                e.innerHTML = `Disabled`;
            } else {
                e.innerHTML = `Disabled, but configured`;
            }
        }
    }
    
    public GetEditElement (): HTMLElement {
        let tmp = document.createElement ("div");
        tmp.classList.add ("content-cell-content");
        tmp.style.height = "147px";
        tmp.style.padding = "0";
        
        tmp.innerHTML = `
            <div class="content-cell-content" style="height: 24px;"><input type="checkbox"><span style="position: relative; left: 4px; top: -4px;">Enable Test Flight</span></div>
        `;
        
        let grid = document.createElement ("div");
        grid.style.display = "grid";
        grid.style.gridTemplateColumns = "310px auto 26px";
        grid.style.gridTemplateRows = "24px 24px 24px 24px 24px";
        grid.style.gridTemplateAreas = `
            "c d e"
            "f g h"
            "i j k"
            "l m n"
            "o p q"
        `;
        
        let checkbox = tmp.querySelector ("input")!;
        checkbox.addEventListener ("change", () => {
            grid.style.display = checkbox.checked ? "grid" : "none";
        });
        
        grid.innerHTML = `
            <div class="content-cell-content" style="grid-area: c;">Rated burn time</div>
            <div style="grid-area: d;"><input style="width: calc(100%);"></div>
            <div class="content-cell-content" style="grid-area: e;">s</div>
            
            <div class="content-cell-content" style="grid-area: f;">Ignition success chance (0% data)</div>
            <div style="grid-area: g;"><input style="width: calc(100%);"></div>
            <div class="content-cell-content" style="grid-area: h;">%</div>
            
            <div class="content-cell-content" style="grid-area: i;">Ignition success chance (100% data)</div>
            <div style="grid-area: j;"><input style="width: calc(100%);"></div>
            <div class="content-cell-content" style="grid-area: k;">%</div>
            
            <div class="content-cell-content" style="grid-area: l;">Burn cycle reliability (0% data)</div>
            <div style="grid-area: m;"><input style="width: calc(100%);"></div>
            <div class="content-cell-content" style="grid-area: n;">%</div>
            
            <div class="content-cell-content" style="grid-area: o;">Burn cycle reliability (100% data)</div>
            <div style="grid-area: p;"><input style="width: calc(100%);"></div>
            <div class="content-cell-content" style="grid-area: q;">%</div>
        `;
        
        tmp.appendChild (grid);
        
        return tmp;
    }
    
    public ApplyValueToEditElement (e: HTMLElement): void {
        let inputs = e.querySelectorAll ("input");
        
        (e.children[1] as HTMLElement).style.display = this.EnableTestFlight ? "grid" : "none";
        
        inputs[0].checked = this.EnableTestFlight;
        inputs[1].value = this.RatedBurnTime.toString ();
        inputs[2].value = this.StartReliability0.toString ();
        inputs[3].value = this.StartReliability10k.toString ();
        inputs[4].value = this.CycleReliability0.toString ();
        inputs[5].value = this.CycleReliability10k.toString ();
    }
    
    public ApplyChangesToValue (e: HTMLElement): void {
        let inputs = e.querySelectorAll ("input");
        
        this.EnableTestFlight = inputs[0].checked;
        this.RatedBurnTime = parseInt (inputs[1].value);
        this.StartReliability0 = parseFloat (inputs[2].value.replace (",", "."));
        this.StartReliability10k = parseFloat (inputs[3].value.replace (",", "."));
        this.CycleReliability0 = parseFloat (inputs[4].value.replace (",", "."));
        this.CycleReliability10k = parseFloat (inputs[5].value.replace (",", "."));
    }
    
}