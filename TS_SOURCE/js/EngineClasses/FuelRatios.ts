class FuelRatios implements IEditable {
    
    Items: [Fuel, number][] = [[Fuel.Hydrazine, 1]];
    FuelVolumeRatios: boolean = false;
    
    public GetPropellantConfig (engine: Engine): string {
        let electricPower = 0;
        let ratios: [Fuel, number][] = [];
        
        this.Items.forEach (i => {
            if (i[0] == Fuel.ElectricCharge) {
                electricPower = i[1];
            } else {
                if (this.FuelVolumeRatios) {
                    ratios.push (i);
                } else {
                    ratios.push ([i[0], i[1] / FuelInfo.GetFuelInfo (i[0]).Density / 1000]);
                }
            }
        });
        
        if (electricPower > 0) {
            let normalFuelRatios = 0;
            let averageDensity = 0;
            
            ratios.forEach (r => {
                normalFuelRatios += r[1];
                averageDensity += r[1] * FuelInfo.GetFuelInfo (r[0]).Density;
            });
            
            averageDensity /= normalFuelRatios;
            
            let x = engine.VacIsp;
            x *= 9.8066;
            x = 1 / x;
            x /= averageDensity;
            x *= engine.Thrust;
            
            electricPower = electricPower * normalFuelRatios / x;
            
            ratios.push ([Fuel.ElectricCharge, electricPower]);
        }
        
        let output = "";
        let firstPropellant = true;
        
        ratios.forEach (r => {
            output += `
                PROPELLANT
                {
                    name = ${FuelInfo.GetFuelInfo (r[0]).FuelID}
                    ratio = ${r[1]}
                    DrawGauge = ${firstPropellant}
                }
            `;
            
            firstPropellant = false;
        });
        
        return output;
    }
    
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
        tmp.style.height = "129px";
        tmp.style.padding = "0";
        
        let grid = document.createElement ("div");
        grid.style.display = "grid";
        grid.style.gridTemplateColumns = "24px 24px auto";
        grid.style.gridTemplateRows = "24px 105px";
        grid.style.gridTemplateAreas = `
            "a b c"
            "d d d"
        `;
        
        grid.innerHTML = `
            <div style="grid-area: a;"><img class="mini-button option-button" title="Add new propellant to the list" src="img/button/add-mini.png"></div>
            <div style="grid-area: b;"><img class="mini-button option-button" title="Remove last propellant from list" src="img/button/remove-mini.png"></div>
            <div class="content-cell-content" style="grid-area: c;"></div>
            <div class="content-cell-content" style="grid-area: d; overflow: auto;"><table><tr><th style="width: 65%;">Fuel</th><th style="width: 35%;">Ratio</th></tr></table></div>
        `;
        
        let table = grid.querySelector ("tbody")!;
        let imgs = grid.querySelectorAll ("img");
        
        imgs[0].addEventListener ("click", () => {
            let tr = document.createElement ("tr");
            let select = FuelInfo.Dropdown.cloneNode (true) as HTMLSelectElement;
            select.querySelector<HTMLOptionElement> (`option[value="${Fuel.Hydrazine}"]`)!.selected = true;
            
            tr.innerHTML = `
                <td></td>
                <td><input style="width: calc(100%);" value="1"></td>
            `;
            
            tr.children[0].appendChild (select);
            table.appendChild (tr);
        });
        
        imgs[1].addEventListener ("click", () => {
            let tmp = grid.querySelectorAll ("tr");
            if (tmp.length > 1) {
                tmp[tmp.length - 1].remove ();
            }
        });
        
        let checkboxLabel = document.createElement ("span");
        let checkbox = document.createElement ("input");
        
        checkboxLabel.style.position = "relative";
        checkboxLabel.style.top = "-4px";
        checkboxLabel.style.left = "4px";
        
        checkbox.type = "checkbox";
        
        checkbox.addEventListener ("change", e => {
            checkboxLabel.innerHTML = checkbox.checked ? "Volume ratio" : "Mass ratio";
        });
        
        grid.children[2].appendChild (checkbox);
        grid.children[2].appendChild (checkboxLabel);
        
        tmp.appendChild (grid);
        
        return tmp;
    }
    
    public ApplyValueToEditElement (e: HTMLElement): void {
        e.querySelector<HTMLInputElement> (`input[type="checkbox"]`)!.checked = this.FuelVolumeRatios;
        
        let table = e.querySelector ("tbody")!;
        let rows = e.querySelectorAll ("tr");
        
        rows.forEach ((v, i) => {
            if (i != 0) {
                v.remove ();
            }
        });
        
        this.Items.forEach(v => {
            let tr = document.createElement ("tr");
            let select = FuelInfo.Dropdown.cloneNode (true) as HTMLSelectElement;
            select.querySelector<HTMLOptionElement> (`option[value="${v[0]}"]`)!.selected = true;
            
            tr.innerHTML = `
                <td></td>
                <td><input style="width: calc(100%);" value="${v[1]}"></td>
            `;
            
            tr.children[0].appendChild (select);
            table.appendChild (tr);
        });
        
        e.querySelector ("span")!.innerHTML = this.FuelVolumeRatios ? "Volume ratio" : "Mass ratio";
    }
    
    public ApplyChangesToValue (e: HTMLElement): void {
        let selects = e.querySelectorAll ("select");
        let inputs = e.querySelectorAll<HTMLInputElement> (`input`);
        
        this.FuelVolumeRatios = inputs[0].checked;
        
        if (selects.length + 1 != inputs.length) {
            console.warn ("table misaligned?");
        }
        
        this.Items = [];
        
        for (let i = 0; i < selects.length; ++i) {
            this.Items.push ([parseInt (selects[i].value), parseFloat (inputs[i + 1].value.replace (",", "."))]);
        }
        
    }
    
}