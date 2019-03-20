class Tank implements IEditable {
    
    UseTanks: boolean = false;
    LimitTanks: boolean = true;
    TanksVolume: number = 0;
    TanksContents: [Fuel, number][] = [];
    
    Parent: Engine;
    
    constructor (parentObject: Engine) {
        //Necessary for estimation calculation
        this.Parent = parentObject;
    }
    
    public GetTankSizeEstimate (): number {
        let modelInfo = ModelInfo.GetModelInfo (this.Parent.Visuals.ModelID);
        let output = modelInfo.OriginalTankVolume;
        
        output *= ((this.Parent.Dimensions.GetBaseWidth () / modelInfo.OriginalBaseWidth) ** 2);
        output *= this.Parent.Dimensions.Height / modelInfo.OriginalHeight;
        
        return output;
    }
    
    public GetConstrainedTankContents (): [Fuel, number][] {
        
        if (!this.LimitTanks) { //Returns a copy, just like the code below
            return new Array<[Fuel, number]> ().concat (this.TanksContents);
        }
        
        let output: [Fuel, number][] = [];
        
        let usedVolume = 0;
        output.forEach (v => {
            let thisVol = Math.min (
                v[1] / FuelInfo.GetFuelInfo (v[0]).TankUtilisation, //This entry's volume
                this.TanksVolume - usedVolume //Remaining volume
            );
            
            output.push ([v[0], thisVol * v[1] * FuelInfo.GetFuelInfo (v[0]).TankUtilisation]);
        });
        
        return output;
    }
    
    public GetDisplayElement (): HTMLElement {
        let tmp = document.createElement ("div");
        tmp.classList.add ("content-cell-content");
        return tmp;
    }
    
    public ApplyValueToDisplayElement (e: HTMLElement): void {
        let output = "";
        
        if (this.UseTanks) {
            if (this.LimitTanks) {
                if (this.TanksVolume == 0) {
                    output = "Enabled, but empty";
                } else {
                    let usedVolume = 0;
                    
                    this.TanksContents.forEach (v => {
                        usedVolume += v[1] / FuelInfo.GetFuelInfo (v[0]).TankUtilisation;
                    });
                    
                    usedVolume = Math.min (usedVolume, this.TanksVolume);
                    
                    output = `Enabled, ${usedVolume}L/${this.TanksVolume}L`;
                }
            } else {
                if (this.TanksContents.length == 0) {
                    output = "Enabled, but empty";
                } else {
                    let usedVolume = 0;
                    
                    this.TanksContents.forEach (v => {
                        usedVolume += v[1] / FuelInfo.GetFuelInfo (v[0]).TankUtilisation;
                    });
                    
                    output = `Enabled, ${usedVolume}L`;
                }
            }
        } else {
            output = "Disabled";
        }
        
        e.innerHTML = output;
    }
    
    public GetEditElement (): HTMLElement {
        let tmp = document.createElement ("div");
        tmp.classList.add ("content-cell-content");
        tmp.style.height = "225px";
        tmp.style.padding = "0";
        
        tmp.innerHTML = `
            <div class="content-cell-content" style="height: 24px;"><input type="checkbox"><span style="position: relative; left: 4px; top: -4px;">Add tank</span></div>
        `;
        
        let grid = document.createElement ("div");
        grid.style.display = "grid";
        grid.style.gridTemplateColumns = "24px 24px auto 3px";
        grid.style.gridTemplateRows = "24px 24px 24px 24px 105px";
        grid.style.gridTemplateAreas = `
            "c c c z"
            "d e e z"
            "f f f z"
            "g h i z"
            "j j j j"
        `;
        
        tmp.querySelector ("input")!.addEventListener ("change", () => {
            grid.style.display = tmp.querySelector ("input")!.checked ? "grid" : "none";
        });
        
        grid.innerHTML = `
            <div class="content-cell-content" style="grid-area: c; padding-top: 4px;">Limit tank volume (L)</div>
            
            <div class="content-cell-content" style="grid-area: d"><input type="checkbox"></div>
            <div style="grid-area: e; padding-top: 1px;"><input style="width: calc(100%);"></div>
            
            <div class="content-cell-content" style="grid-area:f; padding-top: 4px;">Estimated tank volume: <span></span></div>
            
            <div style="grid-area: g;"><img class="mini-button option-button" title="Add new propellant to the list" src="img/button/add-mini.png"></div>
            <div style="grid-area: h;"><img class="mini-button option-button" title="Remove last propellant from list" src="img/button/remove-mini.png"></div>
            <div class="content-cell-content" style="grid-area: j; overflow: auto;"><table><tr><th style="width: 35%;">Fuel</th><th style="width: 35%;">Volume (L)</th><th style="width: 30%;">Mass (t)</th></tr></table></div>
        `;
        
        let inputs = grid.querySelectorAll ("input");
        inputs[0].addEventListener ("change", () => {
            inputs[1].disabled = !inputs[0].checked;
        });
        
        let table = grid.querySelector ("tbody")!;
        let imgs = grid.querySelectorAll ("img");
        
        imgs[0].addEventListener ("click", () => {
            let tr = document.createElement ("tr");
            let select = FuelInfo.Dropdown.cloneNode (true) as HTMLSelectElement;
            select.querySelector<HTMLOptionElement> (`option[value="${Fuel.Hydrazine}"]`)!.selected = true;
            
            tr.innerHTML = `
                <td></td>
                <td><input style="width: calc(100%);" value="1"></td>
                <td><input style="width: calc(100%);" value="${1 * FuelInfo.GetFuelInfo (Fuel.Hydrazine).Density}"></td>
            `;
            
            let inputs = tr.querySelectorAll ("input");
            
            select.addEventListener ("change", () => {
                inputs[1].value = (parseFloat (inputs[0].value.replace (",", ".")) * FuelInfo.GetFuelInfo (parseInt (select.value)).Density).toString ();
            });
            
            inputs[0].addEventListener ("keydown", (e) => {
                setTimeout (() => {
                    inputs[1].value = (parseFloat (inputs[0].value.replace (",", ".")) * FuelInfo.GetFuelInfo (parseInt (select.value)).Density).toString ();
                }, 10); //Update value before using it
            });
            
            inputs[1].addEventListener ("keydown", (e) => {
                setTimeout (() => {
                    inputs[0].value = (parseFloat (inputs[1].value.replace (",", ".")) / FuelInfo.GetFuelInfo (parseInt (select.value)).Density).toString ();
                }, 10); //Update value before using it
            });
            
            tr.children[0].appendChild (select);
            table.appendChild (tr);
        });
        
        imgs[1].addEventListener ("click", () => {
            let tmp = grid.querySelectorAll ("tr");
            if (tmp.length > 1) {
                tmp[tmp.length - 1].remove ();
            }
        });
        
        tmp.appendChild (grid);
        
        return tmp;
    }
    
    public ApplyValueToEditElement (e: HTMLElement): void {
        let allInputs = e.querySelectorAll<HTMLInputElement> (`input`);
        
        allInputs[0].checked = this.UseTanks;
        allInputs[1].checked = this.LimitTanks;
        allInputs[2].value = this.TanksVolume.toString ();
        
        e.querySelectorAll ("span")[1].innerHTML = `${this.GetTankSizeEstimate ()}L`;
        
        (e.children[1] as HTMLElement).style.display = this.UseTanks ? "grid" : "none";
        allInputs[2].disabled = !this.LimitTanks;
        
        let table = e.querySelector ("tbody")!;
        let rows = e.querySelectorAll ("tr");
        
        rows.forEach ((v, i) => {
            if (i != 0) {
                v.remove ();
            }
        });
        
        this.TanksContents.forEach(v => {
            let tr = document.createElement ("tr");
            let select = FuelInfo.Dropdown.cloneNode (true) as HTMLSelectElement;
            select.querySelector<HTMLOptionElement> (`option[value="${v[0]}"]`)!.selected = true;
            
            tr.innerHTML = `
                <td></td>
                <td><input style="width: calc(100%);" value="${v[1]}"></td>
                <td><input style="width: calc(100%);" value="${v[1] * FuelInfo.GetFuelInfo (v[0]).Density}"></td>
            `;
            
            let inputs = tr.querySelectorAll ("input");
            
            select.addEventListener ("change", () => {
                inputs[1].value = (parseFloat (inputs[0].value.replace (",", ".")) * FuelInfo.GetFuelInfo (parseInt (select.value)).Density).toString ();
            });
            
            inputs[0].addEventListener ("keydown", (e) => {
                setTimeout (() => {
                    inputs[1].value = (parseFloat (inputs[0].value.replace (",", ".")) * FuelInfo.GetFuelInfo (parseInt (select.value)).Density).toString ();
                }, 10); //Update value before using it
            });
            
            inputs[1].addEventListener ("keydown", (e) => {
                setTimeout (() => {
                    inputs[0].value = (parseFloat (inputs[1].value.replace (",", ".")) / FuelInfo.GetFuelInfo (parseInt (select.value)).Density).toString ();
                }, 10); //Update value before using it
            });
            
            tr.children[0].appendChild (select);
            table.appendChild (tr);
        });
    }
    
    public ApplyChangesToValue (e: HTMLElement): void {
        let selects = e.querySelectorAll ("select");
        let inputs = e.querySelector ("table")!.querySelectorAll<HTMLInputElement> (`input`);
        let allInputs = e.querySelectorAll<HTMLInputElement> (`input`);
        
        this.UseTanks = allInputs[0].checked;
        this.LimitTanks = allInputs[1].checked;
        this.TanksVolume = parseFloat (allInputs[2].value.replace (",", "."));
        
        if (selects.length != inputs.length) {
            console.warn ("table misaligned?");
        }
        
        this.TanksContents = [];
        
        for (let i = 0; i < selects.length; ++i) {
            this.TanksContents.push ([parseInt (selects[i].value), parseFloat (inputs[2 * i].value.replace (",", "."))]);
        }
    }
    
}