namespace EngineEditableFieldMetadata {
    export const Tank: IEditable<Engine> = {
        GetDisplayElement: () => {
            let tmp = document.createElement ("div");
            tmp.classList.add ("content-cell-content");
            return tmp;
        }, ApplyValueToDisplayElement: (e, engine) => {
            let output = "";
            
            if (engine.UseTanks) {
                if (engine.LimitTanks) {
                    if (engine.TanksVolume == 0) {
                        output = "Enabled, but empty";
                    } else {
                        let usedVolume = 0;
                        
                        engine.TanksContents.forEach (v => {
                            usedVolume += v[1] / FuelInfo.GetFuelInfo (v[0]).TankUtilisation;
                        });
                        
                        usedVolume = Math.min (usedVolume, engine.TanksVolume);
                        
                        output = `Enabled, ${Unit.Display (usedVolume, "L",  Settings.classic_unit_display, 3)}/${Unit.Display (engine.TanksVolume, "L",  Settings.classic_unit_display, 3)}`;
                    }
                } else {
                    if (engine.TanksContents.length == 0) {
                        output = "Enabled, but empty";
                    } else {
                        let usedVolume = 0;
                        
                        engine.TanksContents.forEach (v => {
                            usedVolume += v[1] / FuelInfo.GetFuelInfo (v[0]).TankUtilisation;
                        });
                        
                        output = `Enabled, ${Unit.Display (usedVolume, "L",  Settings.classic_unit_display, 3)}`;
                    }
                }
            } else {
                output = "Disabled";
            }
            
            e.innerHTML = output;
        }, GetEditElement: () => {
            let tmp = document.createElement ("div");
            tmp.classList.add ("content-cell-content");
            tmp.style.height = "222px";
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
                
                <div class="content-cell-content" style="grid-area: d"><input style="position: relative; top: -1px; left: -1px;" class="abbr" title="Enable tank volume restriction" type="checkbox"></div>
                <div style="grid-area: e; padding-top: 1px;"><input style="width: calc(100%);"></div>
                
                <div class="content-cell-content" style="grid-area:f; padding-top: 4px;">Estimated tank volume: <span></span></div>
                
                <div style="grid-area: g;"><img class="mini-button option-button" title="Add new propellant to the list" src="img/button/add-mini.png"></div>
                <div style="grid-area: h;"><img class="mini-button option-button" title="Remove last propellant from list" src="img/button/remove-mini.png"></div>
                <div class="content-cell-content" style="grid-area: j; overflow: auto;"><table><tr><th style="width: 35%;">Fuel</th><th style="width: 35%;">Volume</th><th style="width: 30%;">Mass</th></tr></table></div>
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
                    <td><input style="width: calc(100%);" value="${Unit.Display (1, "L",  Settings.classic_unit_display)}"></td>
                    <td><input style="width: calc(100%);" value="${Unit.Display (1 * FuelInfo.GetFuelInfo (Fuel.Hydrazine).Density, "t",  Settings.classic_unit_display)}"></td>
                `;
                
                let inputs = tr.querySelectorAll ("input");
                
                select.addEventListener ("change", () => {
                    inputs[1].value = Unit.Display (Unit.Parse (inputs[0].value, "L") * FuelInfo.GetFuelInfo (parseInt (select.value)).Density, "t",  Settings.classic_unit_display);
                });
                
                inputs[0].addEventListener ("keydown", (e) => {
                    setTimeout (() => {
                        inputs[1].value = Unit.Display (Unit.Parse (inputs[0].value, "L") * FuelInfo.GetFuelInfo (parseInt (select.value)).Density, "t",  Settings.classic_unit_display);
                    }, 20); //Update value before using it
                });
                
                inputs[1].addEventListener ("keydown", (e) => {
                    setTimeout (() => {
                        inputs[0].value = Unit.Display (Unit.Parse (inputs[1].value, "t") / FuelInfo.GetFuelInfo (parseInt (select.value)).Density, "L",  Settings.classic_unit_display);
                    }, 20); //Update value before using it
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
        }, ApplyValueToEditElement: (e, engine) => {
            let allInputs = e.querySelectorAll<HTMLInputElement> (`input`);
            
            allInputs[0].checked = engine.UseTanks;
            allInputs[1].checked = engine.LimitTanks;
            allInputs[2].value = Unit.Display (engine.TanksVolume, "L",  Settings.classic_unit_display);
            
            e.querySelectorAll ("span")[1].innerHTML = Unit.Display (engine.GetTankSizeEstimate (), "L",  Settings.classic_unit_display, 3);
            
            (e.children[1] as HTMLElement).style.display = engine.UseTanks ? "grid" : "none";
            allInputs[2].disabled = !engine.LimitTanks;
            
            let table = e.querySelector ("tbody")!;
            let rows = e.querySelectorAll ("tr");
            
            rows.forEach ((v, i) => {
                if (i != 0) {
                    v.remove ();
                }
            });
            
            engine.TanksContents.forEach(v => {
                let tr = document.createElement ("tr");
                let select = FuelInfo.Dropdown.cloneNode (true) as HTMLSelectElement;
                select.querySelector<HTMLOptionElement> (`option[value="${v[0]}"]`)!.selected = true;
                
                tr.innerHTML = `
                    <td></td>
                    <td><input style="width: calc(100%);" value="${Unit.Display (v[1], "L",  Settings.classic_unit_display)}"></td>
                    <td><input style="width: calc(100%);" value="${Unit.Display (v[1] * FuelInfo.GetFuelInfo (v[0]).Density, "t",  Settings.classic_unit_display)}"></td>
                `;
                
                let inputs = tr.querySelectorAll ("input");
                
                select.addEventListener ("change", () => {
                    inputs[1].value = Unit.Display (Unit.Parse (inputs[0].value, "L") * FuelInfo.GetFuelInfo (parseInt (select.value)).Density, "t",  Settings.classic_unit_display);
                });
                
                inputs[0].addEventListener ("keydown", (e) => {
                    setTimeout (() => {
                        inputs[1].value = Unit.Display (Unit.Parse (inputs[0].value, "L") * FuelInfo.GetFuelInfo (parseInt (select.value)).Density, "t",  Settings.classic_unit_display);
                    }, 20); //Update value before using it
                });
                
                inputs[1].addEventListener ("keydown", (e) => {
                    setTimeout (() => {
                        inputs[0].value = Unit.Display (Unit.Parse (inputs[1].value, "t") / FuelInfo.GetFuelInfo (parseInt (select.value)).Density, "L",  Settings.classic_unit_display);
                    }, 20); //Update value before using it
                });
                
                tr.children[0].appendChild (select);
                table.appendChild (tr);
            });
        }, ApplyChangesToValue: (e, engine) => {
            let selects = e.querySelectorAll ("select");
            let inputs = e.querySelector ("table")!.querySelectorAll<HTMLInputElement> (`input`);
            let allInputs = e.querySelectorAll<HTMLInputElement> (`input`);
            
            engine.UseTanks = allInputs[0].checked;
            engine.LimitTanks = allInputs[1].checked;
            engine.TanksVolume = Unit.Parse (allInputs[2].value, "L");
            
            if (selects.length * 2 != inputs.length) {
                console.warn ("table misaligned?");
            }
            
            engine.TanksContents = [];
            
            for (let i = 0; i < selects.length; ++i) {
                engine.TanksContents.push ([parseInt (selects[i].value), Unit.Parse (inputs[2 * i].value, "L")]);
            }
        }
    };
}