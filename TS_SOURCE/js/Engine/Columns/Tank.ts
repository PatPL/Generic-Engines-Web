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
                <div class="content-cell-content" style="grid-area: j; overflow: auto; white-space: unset;">
                    <table>
                        <tr>
                            <th style="width: 25%;">Fuel</th>
                            <th style="width: 25%;">Volume</th>
                            <th style="width: 25%;">Mass</th>
                            <th class="abbr" title="Engine burn time using only the in-part tank and full throttle" style="width: 25%;">Time</th>
                        </tr>
                    </table>
                </div>
            `;
            
            let inputs = grid.querySelectorAll ("input");
            inputs[0].addEventListener ("change", () => {
                inputs[1].disabled = !inputs[0].checked;
            });
            
            let imgs = grid.querySelectorAll ("img");
            
            imgs[1].addEventListener ("click", () => {
                let tmp = grid.querySelectorAll ("tr");
                if (tmp.length > 1) {
                    tmp[tmp.length - 1].remove ();
                }
            });
            
            tmp.appendChild (grid);
            
            return tmp;
        }, ApplyValueToEditElement: (e, engine) => {
            // https://i.pinimg.com/originals/81/ff/12/81ff129f0fc9391845c38057ef24535d.png
            // This deserves a rewrite. I think using EditableField would be nice here
            // because you could store the more accurate value in the input field, and
            // display the prettier, trimmed version.
            // Right now WYSIWYG, so the value gets trimmed, and the decimal places are lost
            // Also, you wouldn't accidentally lose a value due to unintended input.
            // 
            // Not sure how well EditableField would handle this kind of recursion. Some changes
            // might be necessary to make this work.
            const addRow = (tableElement: HTMLTableElement, v: [Fuel, number]) => {
                let thisRawMassFlow = massFlow.find (x => v[0] == x[0]);
                let fuelInfo = FuelInfo.GetFuelInfo (v[0]);
                let thisMassFlow = thisRawMassFlow ? thisRawMassFlow[1] / thrustCurveMultiplier : 0;
                let thisBurnTime = thisRawMassFlow ? ((v[1] * fuelInfo.Density) / thisRawMassFlow[1]) * thrustCurveMultiplier : 0;
                
                let tr = document.createElement ("tr");
                let select = FuelInfo.Dropdown.cloneNode (true) as HTMLSelectElement;
                select.querySelector<HTMLOptionElement> (`option[value="${v[0]}"]`)!.selected = true;
                
                tr.innerHTML = `
                    <td></td>
                    <td><input style="width: calc(100%);" value="${Unit.Display (v[1], "L",  Settings.classic_unit_display, 3)}"></td>
                    <td><input style="width: calc(100%);" value="${Unit.Display (v[1] * fuelInfo.Density, "t",  Settings.classic_unit_display, 3)}"></td>
                    <td><input style="width: calc(100%);" ${ thisBurnTime == 0 ? "disabled" : "" } value="${ Unit.Display (thisBurnTime, "s", true, 3) }"></td>
                `;
                
                let inputs = tr.querySelectorAll ("input");
                
                select.addEventListener ("change", () => {
                    let newFuel: Fuel = parseInt (select.value);
                    inputs[1].value = Unit.Display (Unit.Parse (inputs[0].value, "L") * FuelInfo.GetFuelInfo (newFuel).Density, "t",  Settings.classic_unit_display, 3);
                    
                    thisRawMassFlow = massFlow.find (x => newFuel == x[0]);
                    fuelInfo = FuelInfo.GetFuelInfo (newFuel);
                    thisMassFlow = thisRawMassFlow ? thisRawMassFlow[1] / thrustCurveMultiplier : 0;
                    thisBurnTime = thisRawMassFlow ? ((parseFloat (inputs[0].value) * fuelInfo.Density) / thisRawMassFlow[1]) * thrustCurveMultiplier : 0;
                    
                    inputs[2].disabled = thisBurnTime == 0;
                    newVolume (); // Refresh values, without changing the volume
                });
                
                const newVolume = () => {
                    inputs[1].value = Unit.Display (Unit.Parse (inputs[0].value, "L") * FuelInfo.GetFuelInfo (parseInt (select.value)).Density, "t",  Settings.classic_unit_display, 3);
                    if (!inputs[2].disabled) {
                        inputs[2].value = Unit.Display ((Unit.Parse (inputs[0].value, "L") * FuelInfo.GetFuelInfo (parseInt (select.value)).Density) / thisMassFlow, "s", true, 3);
                    } else {
                        inputs[2].value = Unit.Display (0, "s", true, 3);
                    }
                }
                
                const newMass = () => {
                    inputs[0].value = Unit.Display (Unit.Parse (inputs[1].value, "t") / FuelInfo.GetFuelInfo (parseInt (select.value)).Density, "L", Settings.classic_unit_display, 3);
                    if (!inputs[2].disabled) {
                        inputs[2].value = Unit.Display (Unit.Parse (inputs[1].value, "t") / thisMassFlow, "s", true, 3);
                    }
                }
                
                const newTime = () => {
                    inputs[0].value = Unit.Display ((Unit.Parse (inputs[2].value, "s") * thisMassFlow) / FuelInfo.GetFuelInfo (parseInt (select.value)).Density, "L",  Settings.classic_unit_display, 3);
                    inputs[1].value = Unit.Display (Unit.Parse (inputs[2].value, "s") * thisMassFlow, "t",  Settings.classic_unit_display, 3);
                }
                
                inputs[0].addEventListener ("keydown", (e) => {
                    setTimeout (() => {
                        newVolume ();
                    }, 20); //Update value before using it
                });
                
                inputs[1].addEventListener ("keydown", (e) => {
                    setTimeout (() => {
                        newMass ();
                    }, 20); //Update value before using it
                });
                
                inputs[2].addEventListener ("keydown", (e) => {
                    setTimeout (() => {
                        newTime ();
                    }, 20); //Update value before using it
                });
                
                tr.children[0].appendChild (select);
                tableElement.appendChild (tr);
            }
            
            let allInputs = e.querySelectorAll<HTMLInputElement> (`input`);
            let addElementButton = e.querySelector ("img")!;
            
            addElementButton.onclick = () => {
                addRow (table, [Fuel.Hydrazine, 1]);
                // setTimeout (() => {
                //     let newAllInputs = e.querySelectorAll<HTMLInputElement> (`input`);
                //     let thisMassFlow = massFlow.find (x => Fuel.Hydrazine == x[0]);
                //     let fuelInfo = FuelInfo.GetFuelInfo (Fuel.Hydrazine);
                //     let thisBurnTime = thisMassFlow ? ((1 * fuelInfo.Density) / thisMassFlow[1]) * thrustCurveMultiplier : 0;
                    
                //     newAllInputs[newAllInputs.length - 1].disabled = thisBurnTime == 0;
                //     newAllInputs[newAllInputs.length - 1].value = Unit.Display (thisBurnTime, "s", true, 3);
                // }, 20); // Ensure the other event listener fires first
            }
            
            let massFlow = engine.GetEngineMassFlow ();
            let thrustCurveMultiplier = engine.GetThrustCurveBurnTimeMultiplier ();
            
            allInputs[0].checked = engine.UseTanks;
            allInputs[1].checked = engine.LimitTanks;
            allInputs[2].value = Unit.Display (engine.TanksVolume, "L",  Settings.classic_unit_display, 3);
            
            e.querySelectorAll ("span")[1].innerHTML = Unit.Display (engine.GetTankSizeEstimate (), "L",  Settings.classic_unit_display, 3);
            
            (e.children[1] as HTMLElement).style.display = engine.UseTanks ? "grid" : "none";
            allInputs[2].disabled = !engine.LimitTanks;
            
            let table = e.querySelector<HTMLTableElement> ("tbody")!;
            let rows = e.querySelectorAll ("tr");
            
            rows.forEach ((v, i) => {
                if (i != 0) {
                    v.remove ();
                }
            });
            
            engine.TanksContents.forEach(v => {
                addRow (table, v);
            });
        }, ApplyChangesToValue: (e, engine) => {
            let selects = e.querySelectorAll ("select");
            let inputs = e.querySelector ("table")!.querySelectorAll<HTMLInputElement> (`input`);
            let allInputs = e.querySelectorAll<HTMLInputElement> (`input`);
            
            engine.UseTanks = allInputs[0].checked;
            engine.LimitTanks = allInputs[1].checked;
            engine.TanksVolume = Unit.Parse (allInputs[2].value, "L");
            
            if (selects.length * 3 != inputs.length) {
                console.warn ("table misaligned?");
            }
            
            engine.TanksContents = [];
            
            for (let i = 0; i < selects.length; ++i) {
                engine.TanksContents.push ([parseInt (selects[i].value), Unit.Parse (inputs[3 * i].value, "L")]);
            }
        }
    };
}