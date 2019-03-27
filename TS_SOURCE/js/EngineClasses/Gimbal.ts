class Gimbal implements IEditable {
    
    Gimbal: number = 6;
    AdvancedGimbal: boolean = false;
    GimbalNX: number = 30;
    GimbalPX: number = 30;
    GimbalNY: number = 0;
    GimbalPY: number = 0;
    
    public GetConfig (modelInfo: IModelInfo): string {
        if (this.AdvancedGimbal) {
            return `
                MODULE
                {
                    name = ModuleGimbal
                    gimbalTransformName = ${modelInfo.GimbalTransformName}
                    gimbalRangeYP = ${this.GimbalPY}
                    gimbalRangeYN = ${this.GimbalNY}
                    gimbalRangeXP = ${this.GimbalPX}
                    gimbalRangeXN = ${this.GimbalNX}
                    useGimbalResponseSpeed = false
                }
            `;
        } else {
            return `
                MODULE
                {
                    name = ModuleGimbal
                    gimbalTransformName = ${modelInfo.GimbalTransformName}
                    useGimbalResponseSpeed = false
                    gimbalRange = ${this.Gimbal}
                }
            `;
        }
    }
    
    public GetDisplayElement (): HTMLElement {
        let tmp = document.createElement ("div");
        tmp.classList.add ("content-cell-content");
        return tmp;
    }
    
    public static IsDefault (config: Gimbal): boolean {
        let defaultConfig = new Gimbal ();
        return (
            config.AdvancedGimbal == defaultConfig.AdvancedGimbal &&
            config.GimbalNX == defaultConfig.GimbalNX &&
            config.GimbalPX == defaultConfig.GimbalPX &&
            config.GimbalNY == defaultConfig.GimbalNY &&
            config.GimbalPY == defaultConfig.GimbalPY
        );
    }
    
    public ApplyValueToDisplayElement (e: HTMLElement): void {
        if (this.AdvancedGimbal) {
            e.innerHTML = `X:<-${this.GimbalNX}°:${this.GimbalPX}°>, Y:<-${this.GimbalNY}°:${this.GimbalPY}°>`;
        } else {
            e.innerHTML = `${this.Gimbal}°`;
        }
    }
    
    public GetEditElement (): HTMLElement {
        let tmp = document.createElement ("div");
        tmp.classList.add ("content-cell-content");
        tmp.style.height = "75px";
        tmp.style.padding = "0";
        
        tmp.innerHTML = `
            <div class="content-cell-content" style="height: 24px"></div>
        `;
        
        let baseDiv = document.createElement ("div");
        let advDiv = document.createElement ("div");
        let checkbox = document.createElement ("input");
        let checkboxLabel = document.createElement ("span");
        
        tmp.appendChild (baseDiv);
        tmp.appendChild (advDiv);
        
        checkbox.setAttribute ("data-ref", "checkbox");
        checkbox.type = "checkbox";
        checkbox.addEventListener ("change", (e) => {
            if (checkbox.checked) {
                baseDiv.style.display = "none";
                advDiv.style.display = "grid";
            } else {
                baseDiv.style.display = "grid";
                advDiv.style.display = "none";
            }
        });
        
        checkboxLabel.style.position = "relative";
        checkboxLabel.style.top = "-4px";
        checkboxLabel.style.left = "4px";
        checkboxLabel.innerHTML = "Advanced gimbal";
        
        tmp.children[0].appendChild (checkbox);
        tmp.children[0].appendChild (checkboxLabel);
        
        baseDiv.setAttribute ("data-ref", "basediv");
        baseDiv.style.display = "grid";
        baseDiv.style.gridTemplateColumns = "94px auto 3px";
        baseDiv.style.gridTemplateRows = "24px";
        baseDiv.style.gridTemplateAreas = `
            "a b c"
        `;
        
        baseDiv.innerHTML = `
            <div class="content-cell-content" style="grid-area: a;">Gimbal (°)</div>
            <div style="grid-area: b;"><input data-ref="gimbal" style="width: calc(100%);"></div>
        `;
        
        advDiv.setAttribute ("data-ref", "advdiv");
        advDiv.style.display = "grid";
        advDiv.style.gridTemplateColumns = "114px auto auto 3px";
        advDiv.style.gridTemplateRows = "24px 24px";
        advDiv.style.gridTemplateAreas = `
            "a b c d"
            "e f g h"
        `;
        
        advDiv.innerHTML = `
            <div class="content-cell-content" style="grid-area: a;">X axis (-|+)°</div>
            <div style="grid-area: b;"><input data-ref="gimbalnx" style="width: calc(100%);"></div>
            <div style="grid-area: c;"><input data-ref="gimbalpx" style="width: calc(100%);"></div>
            
            <div class="content-cell-content" style="grid-area: e;">Y axis (-|+)°</div>
            <div style="grid-area: f;"><input data-ref="gimbalny" style="width: calc(100%);"></div>
            <div style="grid-area: g;"><input data-ref="gimbalpy" style="width: calc(100%);"></div>
        `;
        
        return tmp;
    }
    
    public ApplyValueToEditElement (e: HTMLElement): void {
        
        e.querySelector<HTMLInputElement> (`input[data-ref="checkbox"]`)!.checked = this.AdvancedGimbal;
        e.querySelector<HTMLInputElement> (`input[data-ref="gimbal"]`)!.value = this.Gimbal.toString ();
        e.querySelector<HTMLInputElement> (`input[data-ref="gimbalnx"]`)!.value = this.GimbalNX.toString ();
        e.querySelector<HTMLInputElement> (`input[data-ref="gimbalpx"]`)!.value = this.GimbalPX.toString ();
        e.querySelector<HTMLInputElement> (`input[data-ref="gimbalny"]`)!.value = this.GimbalNY.toString ();
        e.querySelector<HTMLInputElement> (`input[data-ref="gimbalpy"]`)!.value = this.GimbalPY.toString ();
        
        if (this.AdvancedGimbal) {
            (<HTMLElement> e.querySelector (`div[data-ref="basediv"]`)!).style.display = "none";
            (<HTMLElement> e.querySelector (`div[data-ref="advdiv"]`)!).style.display = "grid";
        } else {
            (<HTMLElement> e.querySelector (`div[data-ref="basediv"]`)!).style.display = "grid";
            (<HTMLElement> e.querySelector (`div[data-ref="advdiv"]`)!).style.display = "none";
        }
    }
    
    public ApplyChangesToValue (e: HTMLElement): void {
        
        this.AdvancedGimbal = e.querySelector<HTMLInputElement> (`input[data-ref="checkbox"]`)!.checked;
        this.Gimbal = parseFloat (e.querySelector<HTMLInputElement> (`input[data-ref="gimbal"]`)!.value.replace (",", "."));
        this.GimbalPX = parseFloat (e.querySelector<HTMLInputElement> (`input[data-ref="gimbalpx"]`)!.value.replace (",", "."));
        this.GimbalNY = parseFloat (e.querySelector<HTMLInputElement> (`input[data-ref="gimbalny"]`)!.value.replace (",", "."));
        this.GimbalPY = parseFloat (e.querySelector<HTMLInputElement> (`input[data-ref="gimbalpy"]`)!.value.replace (",", "."));
        this.GimbalNX = parseFloat (e.querySelector<HTMLInputElement> (`input[data-ref="gimbalnx"]`)!.value.replace (",", "."));
        
    }
    
}