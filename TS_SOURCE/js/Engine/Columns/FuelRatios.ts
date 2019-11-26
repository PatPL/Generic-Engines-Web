namespace EngineEditableFieldMetadata {
    export const FuelRatios: IEditable<Engine> = {
        GetDisplayElement: () => {
            let tmp = document.createElement ("div");
            tmp.classList.add ("content-cell-content");
            return tmp;
        }, ApplyValueToDisplayElement: (e, engine) => {
            let fuels: [Fuel, number][] = [];
            let electric: number = 0;
            let output = "";
            
            engine.FuelRatioItems.forEach (v => {
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
                output += ` | Electric: ${Unit.Display (electric, "kW", Settings.classic_unit_display, 9)}`;
            }
            
            e.innerHTML = output;
        }, GetEditElement: () => {
            let tmp = document.createElement ("div");
            tmp.classList.add ("content-cell-content");
            tmp.style.height = "126px";
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
                <div style="grid-area: a;"><img class="mini-button option-button" title="Add new propellant to the list" src="svg/button/add-mini.svg"></div>
                <div style="grid-area: b;"><img class="mini-button option-button" title="Remove last propellant from list" src="svg/button/remove-mini.svg"></div>
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
        }, ApplyValueToEditElement: (e, engine) => {
            e.querySelector<HTMLInputElement> (`input[type="checkbox"]`)!.checked = engine.FuelVolumeRatios;
            
            let table = e.querySelector ("tbody")!;
            let rows = e.querySelectorAll ("tr");
            
            rows.forEach ((v, i) => {
                if (i != 0) {
                    v.remove ();
                }
            });
            
            engine.FuelRatioItems.forEach(v => {
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
            
            e.querySelector ("span")!.innerHTML = engine.FuelVolumeRatios ? "Volume ratio" : "Mass ratio";
        }, ApplyChangesToValue: (e, engine) => {
            let selects = e.querySelectorAll ("select");
            let inputs = e.querySelectorAll<HTMLInputElement> (`input`);
            
            engine.FuelVolumeRatios = inputs[0].checked;
            
            if (selects.length + 1 != inputs.length) {
                console.warn ("table misaligned?");
            }
            
            engine.FuelRatioItems = [];
            
            for (let i = 0; i < selects.length; ++i) {
                engine.FuelRatioItems.push ([parseInt (selects[i].value), parseFloat (inputs[i + 1].value.replace (",", "."))]);
            }
        }
    };
}