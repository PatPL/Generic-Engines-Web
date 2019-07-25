///<reference path="../Enums/PolymorphismType.ts" />
class Engine {
    
    public static readonly ColumnDefinitions: { [id: string]: IColumnInfo } = {
        Active: {
            Name: "Active",
            DefaultWidth: 24,
            DisplayFlags: 0b00000
        }, ID: {
            Name: "ID",
            DefaultWidth: 200,
            DisplayFlags: 0b00000
        }, Labels: {
            Name: "Name",
            DefaultWidth: 300,
            DisplayFlags: 0b00100
        }, Polymorphism: {
            Name: "Polymorphism",
            DefaultWidth: 200,
            DisplayFlags: 0b00000
        }, EngineVariant: {
            Name: "Type",
            DefaultWidth: 80,
            DisplayFlags: 0b10100
        }, Mass: {
            Name: "Mass",
            DefaultWidth: 80,
            DisplayFlags: 0b00100
        }, Thrust: {
            Name: "Vacuum thrust",
            DefaultWidth: 120,
            DisplayFlags: 0b00000
        }, MinThrust: {
            Name: "Minimum thrust",
            DefaultWidth: 60,
            DisplayFlags: 0b00000
        }, AtmIsp: {
            Name: "Sea level Isp",
            DefaultWidth: 80,
            DisplayFlags: 0b00000
        }, VacIsp: {
            Name: "Vacuum Isp",
            DefaultWidth: 80,
            DisplayFlags: 0b00000
        }, PressureFed: {
            Name: "Pressure fed",
            DefaultWidth: 24,
            DisplayFlags: 0b00000
        }, NeedsUllage: {
            Name: "Ullage",
            DefaultWidth: 24,
            DisplayFlags: 0b00000
        }, FuelRatios: {
            Name: "Propellants",
            DefaultWidth: 240,
            DisplayFlags: 0b00000
        }, Ignitions: {
            Name: "Ignitions",
            DefaultWidth: 60,
            DisplayFlags: 0b00110
        }, Visuals: {
            Name: "Visuals",
            DefaultWidth: 300,
            DisplayFlags: 0b00000
        }, Dimensions: {
            Name: "Size",
            DefaultWidth: 160,
            DisplayFlags: 0b10100
        }, Gimbal: {
            Name: "Gimbal",
            DefaultWidth: 240,
            DisplayFlags: 0b10100
        }, TestFlight: {
            Name: "Test flight",
            DefaultWidth: 400,
            DisplayFlags: 0b00110
        }, TechUnlockNode: {
            Name: "R&D unlock node",
            DefaultWidth: 200,
            DisplayFlags: 0b00100
        }, EntryCost: {
            Name: "Entry cost",
            DefaultWidth: 120,
            DisplayFlags: 0b00100
        }, Cost: {
            Name: "Cost",
            DefaultWidth: 100,
            DisplayFlags: 0b00100
        }, AlternatorPower: {
            Name: "Alternator",
            DefaultWidth: 80,
            DisplayFlags: 0b10100
        }, Tank: {
            Name: "Tank",
            DefaultWidth: 320,
            DisplayFlags: 0b10100
        }, ThrustCurve: {
            Name: "Thrust curve",
            DefaultWidth: 200,
            DisplayFlags: 0b00000
        }, Spacer: {
            Name: "",
            DefaultWidth: 300,
            DisplayFlags: 0b00000
        }
    }
    Spacer: boolean = false; // For an empty space at the end of the table
    // Fuck me I wish I used React or Vue instead of dealing with this clusterfuck
    // I genuinely hope noone will have to debug this, ever.
    public readonly EditableFieldMetadata: { [id: string]: IEditable } = {
        Spacer: {
            GetDisplayElement: () => {
                let tmp = document.createElement ("div");
                tmp.classList.add ("content-cell-content");
                return tmp;
            }
        }, ID: {
            ApplyChangesToValue: (e) => {
                let output = "";
                let rawInput = (e as HTMLInputElement).value;
                
                rawInput.replace (" ", "-");
                
                for (let i = 0; i < rawInput.length; ++i) {
                    if (/[a-zA-Z0-9-]{1}/.test (rawInput[i])) {
                        output += rawInput[i];
                    }
                }
                
                if (output == "") {
                    output = "EnterCorrectID";
                }
                
                this.ID = output;
            }
        }, Mass: {
            ApplyValueToDisplayElement: (e) => {
                e.innerHTML = Unit.Display (this.Mass, "t", Settings.classic_unit_display, 9);
            }, ApplyValueToEditElement: (e) => {
                (e as HTMLInputElement).value = Unit.Display (this.Mass, "t", Settings.classic_unit_display);
            }, ApplyChangesToValue: (e) => {
                this.Mass = Unit.Parse ((e as HTMLInputElement).value, "t");
            }
        }, Thrust: {
            ApplyValueToDisplayElement: (e) => {
                e.innerHTML = Unit.Display (this.Thrust, "kN", Settings.classic_unit_display, 9);
            }, ApplyValueToEditElement: (e) => {
                (e as HTMLInputElement).value = Unit.Display (this.Thrust, "kN", Settings.classic_unit_display);
            }, ApplyChangesToValue: (e) => {
                this.Thrust = Unit.Parse ((e as HTMLInputElement).value, "kN");
            }
        }, AtmIsp: {
            ApplyValueToDisplayElement: (e) => {
                e.innerHTML = Unit.Display (this.AtmIsp, "s", true); //Keep true. Isp hardly ever goes above 1000, and kiloseconds look weird
            }, ApplyValueToEditElement: (e) => {
                (e as HTMLInputElement).value = Unit.Display (this.AtmIsp, "s", true);
            }, ApplyChangesToValue: (e) => {
                this.AtmIsp = Unit.Parse ((e as HTMLInputElement).value, "s");
            }
        }, VacIsp: {
            ApplyValueToDisplayElement: (e) => {
                e.innerHTML = Unit.Display (this.VacIsp, "s", true); //Keep true. Isp hardly ever goes above 1000, and kiloseconds look weird
            }, ApplyValueToEditElement: (e) => {
                (e as HTMLInputElement).value = Unit.Display (this.VacIsp, "s", true);
            }, ApplyChangesToValue: (e) => {
                this.VacIsp = Unit.Parse ((e as HTMLInputElement).value, "s");
            }
        }, Cost: {
            ApplyValueToDisplayElement: (e) => {
                e.innerHTML = Unit.Display (this.Cost, " VF", Settings.classic_unit_display);
            }, ApplyValueToEditElement: (e) => {
                (e as HTMLInputElement).value = Unit.Display (this.Cost, " VF", Settings.classic_unit_display);
            }, ApplyChangesToValue: (e) => {
                this.Cost = Unit.Parse ((e as HTMLInputElement).value, " VF");
            }
        }, EntryCost: {
            ApplyValueToDisplayElement: (e) => {
                e.innerHTML = Unit.Display (this.EntryCost, " VF", Settings.classic_unit_display);
            }, ApplyValueToEditElement: (e) => {
                (e as HTMLInputElement).value = Unit.Display (this.EntryCost, " VF", Settings.classic_unit_display);
            }, ApplyChangesToValue: (e) => {
                this.EntryCost = Unit.Parse ((e as HTMLInputElement).value, " VF");
            }
        }, MinThrust: {
            ApplyValueToDisplayElement: (e) => {
                e.innerHTML = `${this.MinThrust}%`;
            }
        }, AlternatorPower: {
            ApplyValueToDisplayElement: (e) => {
                e.innerHTML = Unit.Display (this.AlternatorPower, "kW", Settings.classic_unit_display, 9);
            }, ApplyValueToEditElement: (e) => {
                (e as HTMLInputElement).value = Unit.Display (this.AlternatorPower, "kW", Settings.classic_unit_display);
            }, ApplyChangesToValue: (e) => {
                this.AlternatorPower = Unit.Parse ((e as HTMLInputElement).value, "kW");
            }
        }, Ignitions: {
            ApplyValueToDisplayElement: (e) => {
                e.innerHTML = this.Ignitions <= 0 ? "Infinite" : this.Ignitions.toString ();
            }, ApplyChangesToValue: (e) => {
                this.Ignitions = parseInt ((e as HTMLInputElement).value);
            }
        }, TechUnlockNode: {
            ApplyValueToDisplayElement: (e) => {
                e.innerHTML = TechNodeNames.get (this.TechUnlockNode)!;
            }, GetEditElement: () => {
                let tmp = document.createElement ("input");
                tmp.classList.add ("content-cell-content");
                tmp.setAttribute ("list", "techNodeItems"); //tmp.list is readonly because reasons, apparently
                return tmp;
            }, ApplyValueToEditElement: (e) => {
                (e as HTMLInputElement).value = TechNodeNames.get (this.TechUnlockNode)!;
            }, ApplyChangesToValue: (e) => {
                let value: number = 0;
                TechNodeNames.forEach ((name, node) => {
                    if ((e as HTMLInputElement).value.trim () == name) {
                        value = node;
                    }
                });
                
                this.TechUnlockNode = value;
            }
        }, EngineVariant: {
            ApplyValueToDisplayElement: (e) => {
                e.innerHTML = EngineType[this.EngineVariant];
            }, GetEditElement: () => {
                let tmp = document.createElement ("select");
                tmp.classList.add ("content-cell-content");
                for (let i in EngineType) {
                    let x = parseInt (i);
                    if (isNaN (x)) {
                        break;
                    }
                    let option = document.createElement ("option");
                    option.value = x.toString ();
                    option.text = EngineType[x];
                    tmp.options.add (option);
                }
                return tmp;
            }
        }, ThrustCurve: {
            ApplyValueToDisplayElement: (e) => {
                e.innerHTML = this.ThrustCurve.length > 0 ? "Custom" : "Default";
            }, GetEditElement: () => {
                let tmp = document.createElement ("div");
                tmp.classList.add ("content-cell-content");
                tmp.style.height = "150px";
                tmp.style.padding = "0";
                
                let grid = document.createElement ("div");
                grid.style.display = "grid";
                grid.style.gridTemplateColumns = "24px 24px 24px auto";
                grid.style.gridTemplateRows = "24px 129px";
                grid.style.gridTemplateAreas = `
                    "a b c d"
                    "e e e e"
                `;
                
                grid.innerHTML = `
                    <div style="grid-area: a;"><img class="mini-button option-button" title="Add new entry" src="img/button/add-mini.png"></div>
                    <div style="grid-area: b;"><img class="mini-button option-button" title="Remove last entry" src="img/button/remove-mini.png"></div>
                    <div style="grid-area: c;"><img class="mini-button option-button" title="Sort entries by Fuel% (Descending)" src="img/button/sort-mini.png"></div>
                    <div class="content-cell-content" style="grid-area: d;"></div>
                    <div class="content-cell-content" style="grid-area: e; overflow: auto;"><table><tr><th style="width: 50%;">Fuel%</th><th style="width: 50%;">Thrust%</th></tr></table></div>
                `;
                
                let table = grid.querySelector ("tbody")!;
                let imgs = grid.querySelectorAll ("img");
                
                imgs[0].addEventListener ("click", () => {
                    let tr = document.createElement ("tr");
                    
                    tr.innerHTML = `
                        <td><input style="width: calc(100%);" value="0"></td>
                        <td><input style="width: calc(100%);" value="0"></td>
                    `;
                    
                    table.appendChild (tr);
                });
                
                imgs[1].addEventListener ("click", () => {
                    let tmp = grid.querySelectorAll ("tr");
                    if (tmp.length > 1) {
                        tmp[tmp.length - 1].remove ();
                    }
                });
                
                imgs[2].addEventListener ("click", () => {
                    let tmpCurve: [number, number][] = [];
                    
                    let inputs = tmp.querySelectorAll<HTMLInputElement> (`input`);
                    
                    for (let i = 0; i < inputs.length; i += 2) {
                        tmpCurve.push ([parseFloat (inputs[i].value.replace (",", ".")), parseFloat (inputs[i + 1].value.replace (",", "."))]);
                    }
                    
                    tmpCurve = tmpCurve.sort ((a, b) => {
                        return b[0] - a[0];
                    });
                    
                    let table = tmp.querySelector ("tbody")!;
                    let rows = tmp.querySelectorAll ("tr");
                    
                    rows.forEach ((v, i) => {
                        if (i != 0) {
                            v.remove ();
                        }
                    });
                    
                    tmpCurve.forEach(v => {
                        let tr = document.createElement ("tr");
                        
                        tr.innerHTML = `
                            <td><input style="width: calc(100%);" value="${v[0]}"></td>
                            <td><input style="width: calc(100%);" value="${v[1]}"></td>
                        `;
                        
                        table.appendChild (tr);
                    });
                });
                
                tmp.appendChild (grid);
                
                return tmp;
            }, ApplyValueToEditElement: (e) => {
                let table = e.querySelector ("tbody")!;
                let rows = e.querySelectorAll ("tr");
                
                this.ThrustCurve = this.ThrustCurve.sort ((a, b) => {
                    return b[0] - a[0];
                });
                
                rows.forEach ((v, i) => {
                    if (i != 0) {
                        v.remove ();
                    }
                });
                
                this.ThrustCurve.forEach(v => {
                    let tr = document.createElement ("tr");
                    
                    tr.innerHTML = `
                        <td><input style="width: calc(100%);" value="${v[0]}"></td>
                        <td><input style="width: calc(100%);" value="${v[1]}"></td>
                    `;
                    
                    table.appendChild (tr);
                });
            }, ApplyChangesToValue: (e) => {
                let inputs = e.querySelectorAll<HTMLInputElement> (`input`);
                
                this.ThrustCurve = [];
                
                for (let i = 0; i < inputs.length; i += 2) {
                    this.ThrustCurve.push ([parseFloat (inputs[i].value.replace (",", ".")), parseFloat (inputs[i + 1].value.replace (",", "."))]);
                }
                
                this.ThrustCurve = this.ThrustCurve.sort ((a, b) => {
                    return b[0] - a[0];
                });
            },
        }, Dimensions: {
            GetDisplayElement: () => {
                let tmp = document.createElement ("div");
                tmp.classList.add ("content-cell-content");
                return tmp;
            }, ApplyValueToDisplayElement: (e: HTMLElement) => {
                e.innerHTML = `↔${Unit.Display (this.Width, "m", false, 9)} x ↕${Unit.Display (this.Height, "m", false, 9)}`;
            }, GetEditElement: () => {
                let tmp = document.createElement ("div");
                tmp.classList.add ("content-cell-content");
                tmp.style.height = "76px";
                tmp.style.padding = "0";
                
                let grid = document.createElement ("div");
                grid.style.display = "grid";
                grid.style.gridTemplateColumns = "62px auto 2px 24px 2px";
                grid.style.gridTemplateRows = "24px 24px 2px 24px";
                grid.style.gridTemplateAreas = `
                    "a a a a z"
                    "b c c c z"
                    "x x x x x"
                    "e f q g y"
                `;
                
                grid.innerHTML = `
                    <div class="content-cell-content" style="grid-area: a;"></div>
                    <div class="content-cell-content" style="grid-area: b;">Width</div>
                    <div style="grid-area: c;"><input style="width: calc(100%);"></div>
                    <div class="content-cell-content" style="grid-area: e;">Height</div>
                    <div style="grid-area: f;"><input style="width: calc(100%);"></div>
                    <div style="grid-area: g;"><img class="option-button stretch" title="Set height matching the width and model" src="img/button/aspectRatio.png"></div>
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
                
                grid.querySelector ("img")!.addEventListener ("click", () => {
                    let inputs = grid.querySelectorAll ("input");
                    let modelInfo = ModelInfo.GetModelInfo (this.GetModelID ());
                    inputs[2].value = Unit.Display (
                        Unit.Parse (inputs[1].value, "m") * modelInfo.OriginalHeight / (inputs[0].checked ? modelInfo.OriginalBaseWidth : modelInfo.OriginalBellWidth),
                        "m",
                        false,
                        3
                    );
                });
                
                tmp.appendChild (grid);
                
                return tmp;
            }, ApplyValueToEditElement: (e: HTMLElement) => {
                let inputs = e.querySelectorAll ("input");
                
                inputs[0].checked = this.UseBaseWidth;
                inputs[1].value = Unit.Display (this.Width, "m", false);
                inputs[2].value = Unit.Display (this.Height, "m", false);
                
                e.querySelector ("span")!.innerHTML = inputs[0].checked ? "Base width" : "Bell width";
            }, ApplyChangesToValue: (e: HTMLElement) => {
                let inputs = e.querySelectorAll ("input");
                
                this.UseBaseWidth = inputs[0].checked;
                this.Width = Unit.Parse (inputs[1].value, "m");
                this.Height = Unit.Parse (inputs[2].value, "m");
            }
        }, FuelRatios: {
            GetDisplayElement: () => {
                let tmp = document.createElement ("div");
                tmp.classList.add ("content-cell-content");
                return tmp;
            }, ApplyValueToDisplayElement: (e: HTMLElement) => {
                let fuels: [Fuel, number][] = [];
                let electric: number = 0;
                let output = "";
                
                this.FuelRatioItems.forEach (v => {
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
            }, ApplyValueToEditElement: (e: HTMLElement) => {
                e.querySelector<HTMLInputElement> (`input[type="checkbox"]`)!.checked = this.FuelVolumeRatios;
                
                let table = e.querySelector ("tbody")!;
                let rows = e.querySelectorAll ("tr");
                
                rows.forEach ((v, i) => {
                    if (i != 0) {
                        v.remove ();
                    }
                });
                
                this.FuelRatioItems.forEach(v => {
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
            }, ApplyChangesToValue: (e: HTMLElement) => {
                let selects = e.querySelectorAll ("select");
                let inputs = e.querySelectorAll<HTMLInputElement> (`input`);
                
                this.FuelVolumeRatios = inputs[0].checked;
                
                if (selects.length + 1 != inputs.length) {
                    console.warn ("table misaligned?");
                }
                
                this.FuelRatioItems = [];
                
                for (let i = 0; i < selects.length; ++i) {
                    this.FuelRatioItems.push ([parseInt (selects[i].value), parseFloat (inputs[i + 1].value.replace (",", "."))]);
                }
            }
        }, Gimbal: {
            GetDisplayElement: () => {
                let tmp = document.createElement ("div");
                tmp.classList.add ("content-cell-content");
                return tmp;
            }, ApplyValueToDisplayElement: (e: HTMLElement) => {
                if (this.AdvancedGimbal) {
                    e.innerHTML = `X:<-${this.GimbalNX}°:${this.GimbalPX}°>, Y:<-${this.GimbalNY}°:${this.GimbalPY}°>`;
                } else {
                    e.innerHTML = `${this.Gimbal}°`;
                }
            }, GetEditElement: () => {
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
            }, ApplyValueToEditElement: (e: HTMLElement) => {
                
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
            }, ApplyChangesToValue: (e: HTMLElement) => {
                
                this.AdvancedGimbal = e.querySelector<HTMLInputElement> (`input[data-ref="checkbox"]`)!.checked;
                this.Gimbal = parseFloat (e.querySelector<HTMLInputElement> (`input[data-ref="gimbal"]`)!.value.replace (",", "."));
                this.GimbalPX = parseFloat (e.querySelector<HTMLInputElement> (`input[data-ref="gimbalpx"]`)!.value.replace (",", "."));
                this.GimbalNY = parseFloat (e.querySelector<HTMLInputElement> (`input[data-ref="gimbalny"]`)!.value.replace (",", "."));
                this.GimbalPY = parseFloat (e.querySelector<HTMLInputElement> (`input[data-ref="gimbalpy"]`)!.value.replace (",", "."));
                this.GimbalNX = parseFloat (e.querySelector<HTMLInputElement> (`input[data-ref="gimbalnx"]`)!.value.replace (",", "."));
                
            }
        }, Labels: {
            GetDisplayElement: () => {
                let tmp = document.createElement ("div");
                tmp.classList.add ("content-cell-content");
                return tmp;
            }, ApplyValueToDisplayElement: (e: HTMLElement) => {
                let isSlave = this.PolyType == PolymorphismType.MultiModeSlave || this.PolyType == PolymorphismType.MultiConfigSlave;
                
                if (this.EngineName == "" || isSlave) {
                    e.innerHTML = `${this.ID}`;
                } else {
                    e.innerHTML = `${this.EngineName}`;
                }
            }, GetEditElement: () => {
                let tmp = document.createElement ("div");
                tmp.classList.add ("content-cell-content");
                tmp.style.height = "192px";
                tmp.style.padding = "0";
                
                let grid = document.createElement ("div");
                grid.style.display = "grid";
                grid.style.gridTemplateColumns = "116px auto";
                grid.style.gridTemplateRows = "24px 24px 24px 120px";
                grid.style.gridTemplateAreas = `
                    "a b"
                    "c d"
                    "e e"
                    "f f"
                `;
                
                grid.innerHTML = `
                    <div class="content-cell-content" style="grid-area: a;">Name</div>
                    <div style="grid-area: b;"><input style="width: calc(100%);"></div>
                    
                    <div class="content-cell-content" style="grid-area: c;">Manufacturer</div>
                    <div style="grid-area: d;"><input style="width: calc(100%);"></div>
                    
                    <div class="content-cell-content" style="grid-area: e;">Description</div>
                    <div style="grid-area: f;"><textarea style="resize: none; width: calc(100%); height: 100%;"></textarea></div>
                `;
                
                tmp.appendChild (grid);
                
                return tmp;
            }, ApplyValueToEditElement: (e: HTMLElement) => {
                let inputs = e.querySelectorAll ("input");
                
                inputs[0].value = this.EngineName;
                inputs[1].value = this.EngineManufacturer;
                
                inputs[0].disabled = this.PolyType == PolymorphismType.MultiConfigSlave;
                inputs[1].disabled = this.PolyType == PolymorphismType.MultiConfigSlave;
                
                e.querySelector ("textarea")!.value = this.EngineDescription;
            }, ApplyChangesToValue: (e: HTMLElement) => {
                let inputs = e.querySelectorAll ("input");
                
                this.EngineName = inputs[0].value;
                this.EngineManufacturer = inputs[1].value;
                this.EngineDescription = e.querySelector ("textarea")!.value;
            }
        }, Polymorphism: {
            GetDisplayElement: () => {
                let tmp = document.createElement ("div");
                tmp.classList.add ("content-cell-content");
                return tmp;
            }, ApplyValueToDisplayElement: (e: HTMLElement) => {
                switch (this.PolyType) {
                    case PolymorphismType.Single:
                    e.innerHTML = `Single`;
                    break; case PolymorphismType.MultiModeMaster:
                    e.innerHTML = `Multimode master`;
                    break; case PolymorphismType.MultiModeSlave:
                    e.innerHTML = `Multimode slave to ${this.MasterEngineName}`;
                    break; case PolymorphismType.MultiConfigMaster:
                    e.innerHTML = `Multiconfig master`;
                    break; case PolymorphismType.MultiConfigSlave:
                    e.innerHTML = `Multiconfig slave to ${this.MasterEngineName}`;
                    break;
                }
            }, GetEditElement: () => {
                let tmp = document.createElement ("div");
                tmp.classList.add ("content-cell-content");
                tmp.style.height = "48px";
                tmp.style.padding = "0";
                
                let grid = document.createElement ("div");
                grid.style.display = "grid";
                grid.style.gridTemplateColumns = "auto";
                grid.style.gridTemplateRows = "24px 24px";
                grid.style.gridTemplateAreas = `
                    "a"
                    "b"
                `;
                
                grid.innerHTML = `
                    <div style="grid-area: a;">${Engine.PolymorphismTypeDropdown.outerHTML}</div>
                    <div style="grid-area: b;"><select></select></div>
                `;
                
                let selects = grid.querySelectorAll ("select");
                selects[0].addEventListener ("change", () => {
                    this.RebuildMasterSelect (tmp);
                });
                
                tmp.appendChild (grid);
                
                return tmp;
            }, ApplyValueToEditElement: (e: HTMLElement) => {
                let selects = e.querySelectorAll ("select");
                
                selects[0].value = this.PolyType.toString ();
                this.RebuildMasterSelect (e);
            }, ApplyChangesToValue: (e: HTMLElement) => {
                let selects = e.querySelectorAll ("select");
                
                this.PolyType = parseInt (selects[0].value);
                this.MasterEngineName = selects[1].value;
                
                this.RehidePolyFields (this.ListCols);
            }
        }, Tank: {
            GetDisplayElement: () => {
                let tmp = document.createElement ("div");
                tmp.classList.add ("content-cell-content");
                return tmp;
            }, ApplyValueToDisplayElement: (e: HTMLElement) => {
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
                            
                            output = `Enabled, ${Unit.Display (usedVolume, "L",  Settings.classic_unit_display, 3)}/${Unit.Display (this.TanksVolume, "L",  Settings.classic_unit_display, 3)}`;
                        }
                    } else {
                        if (this.TanksContents.length == 0) {
                            output = "Enabled, but empty";
                        } else {
                            let usedVolume = 0;
                            
                            this.TanksContents.forEach (v => {
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
                    
                    <div class="content-cell-content" style="grid-area: d"><input style="cursor: help;" title="Enable tank volume restriction" type="checkbox"></div>
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
            }, ApplyValueToEditElement: (e: HTMLElement) => {
                let allInputs = e.querySelectorAll<HTMLInputElement> (`input`);
                
                allInputs[0].checked = this.UseTanks;
                allInputs[1].checked = this.LimitTanks;
                allInputs[2].value = Unit.Display (this.TanksVolume, "L",  Settings.classic_unit_display);
                
                e.querySelectorAll ("span")[1].innerHTML = Unit.Display (this.GetTankSizeEstimate (), "L",  Settings.classic_unit_display, 3);
                
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
            }, ApplyChangesToValue: (e: HTMLElement) => {
                let selects = e.querySelectorAll ("select");
                let inputs = e.querySelector ("table")!.querySelectorAll<HTMLInputElement> (`input`);
                let allInputs = e.querySelectorAll<HTMLInputElement> (`input`);
                
                this.UseTanks = allInputs[0].checked;
                this.LimitTanks = allInputs[1].checked;
                this.TanksVolume = Unit.Parse (allInputs[2].value, "L");
                
                if (selects.length * 2 != inputs.length) {
                    console.warn ("table misaligned?");
                }
                
                this.TanksContents = [];
                
                for (let i = 0; i < selects.length; ++i) {
                    this.TanksContents.push ([parseInt (selects[i].value), Unit.Parse (inputs[2 * i].value, "L")]);
                }
            }
        }, TestFlight: {
            GetDisplayElement: () => {
                let tmp = document.createElement ("div");
                tmp.classList.add ("content-cell-content");
                return tmp;
            }, ApplyValueToDisplayElement: (e: HTMLElement) => {
                if (this.EnableTestFlight) {
                    e.innerHTML = `Enabled | ${this.StartReliability0}% - ${this.StartReliability10k}% | ${Math.round ((1 / (1 - (this.CycleReliability0 / 100))) * this.RatedBurnTime)}s - ${Math.round ((1 / (1 - (this.CycleReliability10k / 100))) * this.RatedBurnTime)}s`;
                } else {
                    if (this.IsTestFlightDefault ()) {
                        e.innerHTML = `Disabled`;
                    } else {
                        e.innerHTML = `Disabled, but configured`;
                    }
                }
            }, GetEditElement: () => {
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
            }, ApplyValueToEditElement: (e: HTMLElement) => {
                let inputs = e.querySelectorAll ("input");
                
                (e.children[1] as HTMLElement).style.display = this.EnableTestFlight ? "grid" : "none";
                
                inputs[0].checked = this.EnableTestFlight;
                inputs[1].value = this.RatedBurnTime.toString ();
                inputs[2].value = this.StartReliability0.toString ();
                inputs[3].value = this.StartReliability10k.toString ();
                inputs[4].value = this.CycleReliability0.toString ();
                inputs[5].value = this.CycleReliability10k.toString ();
            }, ApplyChangesToValue: (e: HTMLElement) => {
                let inputs = e.querySelectorAll ("input");
                
                this.EnableTestFlight = inputs[0].checked;
                this.RatedBurnTime = parseInt (inputs[1].value);
                this.StartReliability0 = parseFloat (inputs[2].value.replace (",", "."));
                this.StartReliability10k = parseFloat (inputs[3].value.replace (",", "."));
                this.CycleReliability0 = parseFloat (inputs[4].value.replace (",", "."));
                this.CycleReliability10k = parseFloat (inputs[5].value.replace (",", "."));
            }
        }, Visuals: {
            GetDisplayElement: () => {
                let tmp = document.createElement ("div");
                tmp.classList.add ("content-cell-content");
                return tmp;
            }, ApplyValueToDisplayElement: (e: HTMLElement) => {
                let isSlave = this.PolyType == PolymorphismType.MultiModeSlave || this.PolyType == PolymorphismType.MultiConfigSlave;
                
                if (isSlave) {
                    e.innerHTML = `${PlumeInfo.GetPlumeInfo (this.PlumeID).PlumeName}`;
                } else {
                    e.innerHTML = `${ModelInfo.GetModelInfo (this.ModelID).ModelName}, ${PlumeInfo.GetPlumeInfo (this.PlumeID).PlumeName}`;
                }
            }, GetEditElement: () => {
                let targetEngine = (
                    this.PolyType == PolymorphismType.MultiModeSlave ||
                    this.PolyType == PolymorphismType.MultiConfigSlave
                ) ? this.EngineList.find (x => x.ID == this.MasterEngineName) : this;
                targetEngine = targetEngine != undefined ? targetEngine : this;
                
                let tmp = document.createElement ("div");
                tmp.classList.add ("content-cell-content");
                tmp.style.padding = "0";
                
                let grid = document.createElement ("div");
                grid.style.display = "grid";
                grid.style.gridTemplateColumns = "60px auto";
                grid.style.gridTemplateAreas = `
                    "a b"
                    "c d"
                    "e e"
                `;
                tmp.style.height = "168px";
                grid.style.gridTemplateRows = "24px 24px 120px";
                
                grid.innerHTML = `
                    <div class="content-cell-content" style="grid-area: a;">Model</div>
                    <div style="grid-area: b;"><span class="clickable-text modelText" value="999">Placeholder</span></div>
                    <div class="content-cell-content" style="grid-area: c;">Plume</div>
                    <div style="grid-area: d;"><span class="clickable-text plumeText" value="999">Placeholder</span></div>
                    <div class="exhaustBox" style="grid-area: e; display: grid; grid-template: 'ea ea' 24px 'eb eb' 96px / auto">
                    <div class="content-cell-content" style="grid-area: ea;"><input class="enableExhaust" type="checkbox"><span style="position: relative; left: 4px; top: -4px;">Enable exhaust effects</span></div>
                    <div class="exhaustSettings" style="grid-area: eb; display: grid; grid-template: 'eba ebb' 24px 'ebc ebd' 24px 'ebe ebf' 24px 'ebg ebh' 24px / 140px auto">
                    <div class="content-cell-content" style="grid-area: eba;">Exhaust plume</div>
                    <div style="grid-area: ebb;"><span class="clickable-text exhaustPlumeText" value="999">Placeholder</span></div>
                    <div class="content-cell-content" style="grid-area: ebc; cursor: help;" title="What fraction of engine's overall thrust is produced by this exhaust?">Exhaust thrust</div>
                    <div style="grid-area: ebd;"><input class="exhaustThrust" style="width: calc(100% - 24px);">%</div>
                    <div class="content-cell-content" style="grid-area: ebe; cursor: help;" title="Multiplier of exhaust's efficiency, compared to main engine">Exhaust impulse</div>
                    <div style="grid-area: ebf;"><input class="exhaustImpulse" style="width: calc(100% - 24px);">%</div>
                    <div class="content-cell-content" style="grid-area: ebg;">Exhaust gimbal</div>
                    <div style="grid-area: ebh;"><input class="exhaustGimbal" style="width: calc(100% - 24px);"><input title="Restrict this gimbal to only roll control" class="exhaustGimbalRoll" type="checkbox" style="cursor: help; margin: -1px 0px 0px 0px; position: relative; top: 2px; left: 2px;"></div>
                    </div>
                    </div>
                `;
                
                let modelText = grid.querySelector (".modelText")!;
                modelText.addEventListener ("click", () => {
                    ModelSelector.GetModel (m => {
                        if (m != null) {
                            modelText.setAttribute ("value", m.toString ());
                            modelText.innerHTML = ModelInfo.GetModelInfo (m).ModelName;
                            grid.querySelector<HTMLDivElement> (".exhaustBox")!.style.display = ModelInfo.GetModelInfo (m).Exhaust ? "grid" : "none";
                        }
                    });
                });
                
                let plumeText = grid.querySelector (".plumeText")!;
                plumeText.addEventListener ("click", () => {
                    PlumeSelector.GetPlume (m => {
                        if (m != null) {
                            plumeText.setAttribute ("value", m.toString ());
                            plumeText.innerHTML = PlumeInfo.GetPlumeInfo (m).PlumeName;
                        }
                    });
                });
                
                let exhaustPlumeText = grid.querySelector (".exhaustPlumeText")!;
                exhaustPlumeText.addEventListener ("click", () => {
                    PlumeSelector.GetPlume (m => {
                        if (m != null) {
                            exhaustPlumeText.setAttribute ("value", m.toString ());
                            exhaustPlumeText.innerHTML = PlumeInfo.GetPlumeInfo (m).PlumeName;
                        }
                    });
                });
                
                let exhaustCheckbox = grid.querySelector<HTMLInputElement> (".enableExhaust")!;
                exhaustCheckbox.addEventListener ("change", () => {
                    grid.querySelector<HTMLDivElement> (".exhaustSettings")!.style.display = exhaustCheckbox.checked ? "grid" : "none";
                })
                
                tmp.appendChild (grid);
                
                return tmp;
            }, ApplyValueToEditElement: (e: HTMLElement) => {
                let targetEngine = (
                    this.PolyType == PolymorphismType.MultiModeSlave ||
                    this.PolyType == PolymorphismType.MultiConfigSlave
                ) ? this.EngineList.find (x => x.ID == this.MasterEngineName) : this;
                targetEngine = targetEngine != undefined ? targetEngine : this;
                let isSlave = this.PolyType == PolymorphismType.MultiConfigSlave || this.PolyType == PolymorphismType.MultiModeSlave;
                
                let select = e.querySelector ("select")!;
                let modelText = e.querySelector<HTMLSpanElement> (".modelText")!;
                let plumeText = e.querySelector<HTMLSpanElement> (".plumeText")!;
                let exhaustPlumeText = e.querySelector<HTMLSpanElement> (".exhaustPlumeText")!;
                
                modelText.setAttribute ("value", targetEngine.ModelID.toString ());
                modelText.innerHTML = ModelInfo.GetModelInfo (targetEngine.ModelID).ModelName;
                
                plumeText.setAttribute ("value", this.PlumeID.toString ());
                plumeText.innerHTML = PlumeInfo.GetPlumeInfo (this.PlumeID).PlumeName;
                
                exhaustPlumeText.setAttribute ("value", this.ExhaustPlumeID.toString ());
                exhaustPlumeText.innerHTML = PlumeInfo.GetPlumeInfo (this.ExhaustPlumeID).PlumeName;
                
                e.querySelector<HTMLDivElement> (".exhaustBox")!.style.display = ModelInfo.GetModelInfo (this.ModelID).Exhaust ? "grid" : "none";
                e.querySelector<HTMLInputElement> (".enableExhaust")!.checked = targetEngine.UseExhaustEffect;
                e.querySelector<HTMLDivElement> (".exhaustSettings")!.style.display = targetEngine.UseExhaustEffect ? "grid" : "none";
                
                e.querySelector<HTMLInputElement> (".exhaustThrust")!.value = this.ExhaustThrustPercent.toString ();
                e.querySelector<HTMLInputElement> (".exhaustImpulse")!.value = this.ExhaustIspPercent.toString ();
                e.querySelector<HTMLInputElement> (".exhaustGimbal")!.value = targetEngine.ExhaustGimbal.toString ();
                e.querySelector<HTMLInputElement> (".exhaustGimbalRoll")!.checked = targetEngine.ExhaustGimbalOnlyRoll;
                
                modelText.style.pointerEvents = isSlave ? "none" : "all";
                e.querySelector<HTMLInputElement> (".enableExhaust")!.disabled = isSlave;
                e.querySelector<HTMLInputElement> (".exhaustGimbal")!.disabled = isSlave;
                e.querySelector<HTMLInputElement> (".exhaustGimbalRoll")!.disabled = isSlave;
            }, ApplyChangesToValue: (e: HTMLElement) => {
                let modelText = e.querySelector (".modelText")!;
                let plumeText = e.querySelector (".plumeText")!;
                let exhaustPlumeText = e.querySelector (".exhaustPlumeText")!;
                
                let exhaustThrust = e.querySelector<HTMLInputElement> (".exhaustThrust")!;
                let exhaustImpulse = e.querySelector<HTMLInputElement> (".exhaustImpulse")!;
                let exhaustGimbal = e.querySelector<HTMLInputElement> (".exhaustGimbal")!;
                
                this.ModelID = parseInt (modelText.getAttribute ("value")!);
                this.PlumeID = parseInt (plumeText.getAttribute ("value")!);
                this.ExhaustPlumeID = parseInt (exhaustPlumeText.getAttribute ("value")!);
                
                this.UseExhaustEffect = e.querySelector<HTMLInputElement> (".enableExhaust")!.checked;
                this.ExhaustThrustPercent = parseFloat (exhaustThrust.value.replace (",", "."));
                this.ExhaustIspPercent = parseFloat (exhaustImpulse.value.replace (",", "."));
                this.ExhaustGimbal = parseFloat (exhaustGimbal.value.replace (",", "."));
                this.ExhaustGimbalOnlyRoll = e.querySelector<HTMLInputElement> (".exhaustGimbalRoll")!.checked;
            }
        }
    }
    
    ListCols: HTMLElement[] = [];
    EditableFields: EditableField[] = [];
    EngineList: Engine[];
    
    Active: boolean = false;
    ID: string = "New-Engine";
    Mass: number = 1;
    Thrust: number = 1000;
    AtmIsp: number = 250;
    VacIsp: number = 300;
    Cost: number = 1000;
    EntryCost: number = 10000;
    MinThrust: number = 90;
    Ignitions: number = 1;
    PressureFed: boolean = false;
    NeedsUllage: boolean = true;
    AlternatorPower: number = 0;
    TechUnlockNode: TechNode = TechNode.start;
    EngineVariant: EngineType = EngineType.Liquid;
    ThrustCurve: [number, number][] = [];
    
    UseBaseWidth: boolean = true; //Dimensions
    Width: number = 1;
    Height: number = 2;
    
    FuelRatioItems: [Fuel, number][] = [[Fuel.Hydrazine, 1]]; //FuelRatios
    FuelVolumeRatios: boolean = false;
    
    Gimbal: number = 6; //Gimbal
    AdvancedGimbal: boolean = false;
    GimbalNX: number = 30;
    GimbalPX: number = 30;
    GimbalNY: number = 0;
    GimbalPY: number = 0;
    
    EngineName: string = ""; //Labels
    EngineManufacturer: string = "Generic Engines";
    EngineDescription: string = "This engine was generated by Generic Engines";
    
    PolyType: PolymorphismType = PolymorphismType.Single; //Polymorphism
    MasterEngineName: string = "";
    
    UseTanks: boolean = false; //Tank
    LimitTanks: boolean = true;
    TanksVolume: number = 0;
    TanksContents: [Fuel, number][] = [];
    
    EnableTestFlight: boolean = false; //TestFlight
    RatedBurnTime: number = 180;
    StartReliability0: number = 92;
    StartReliability10k: number = 96;
    CycleReliability0: number = 90;
    CycleReliability10k: number = 98;
    
    ModelID: Model = Model.LR91; //Visuals
    PlumeID: Plume = Plume.GP_Kerolox;
    UseExhaustEffect: boolean = false; // Exhaust
    ExhaustPlumeID: Plume = Plume.GP_TurbopumpSmoke;
    ExhaustThrustPercent: number = 1;
    ExhaustIspPercent: number = 75;
    ExhaustGimbal: number = 10;
    ExhaustGimbalOnlyRoll: boolean = true;
    
    public readonly OnEditEnd = () => {
        this.UpdateEveryDisplay ();
    }
    
    public UpdateEveryDisplay () {
        this.EditableFields.forEach (f => {
            f.RefreshDisplayElement ();
        });
        
        ApplyEngineToInfoPanel (this);
    }
    
    public GetMass (): number {
        let targetEngine = (
            this.PolyType == PolymorphismType.MultiModeSlave
        ) ? this.EngineList.find (x => x.ID == this.MasterEngineName) : this;
        targetEngine = targetEngine != undefined ? targetEngine : this;
        
        return targetEngine.Mass;
    }
    
    public GetModelID (): Model {
        if (this.PolyType == PolymorphismType.MultiConfigSlave || this.PolyType == PolymorphismType.MultiModeSlave) {
            return this.EngineList.find (x => x.ID == this.MasterEngineName)!.ModelID;
        } else {
            return this.ModelID;
        }
    }
    
    public GetPlumeConfig (): string {
        let engine: Engine;
        
        if (this.PolyType == PolymorphismType.MultiConfigSlave || this.PolyType == PolymorphismType.MultiModeSlave) {
            engine = this.EngineList.find (x => x.ID == this.MasterEngineName)!;
        } else {
            engine = this;
        }
        
        let plumeInfo: IPlumeInfo = PlumeInfo.GetPlumeInfo (this.PlumeID);
        let modelInfo: IModelInfo = ModelInfo.GetModelInfo (engine.ModelID);
        let exhaustConfig = "";
        
        if (engine.UseExhaustEffect && modelInfo.Exhaust) {
            let exhaustBellWidth = modelInfo.Exhaust.exhaustBellWidth * engine.Width / (engine.UseBaseWidth ? modelInfo.OriginalBaseWidth : modelInfo.OriginalBellWidth);
            exhaustConfig = `
                @MODULE[ModuleEngine*] {
                    !GENERIC_PLUME[${ PlumeInfo.GetPlumeInfo (this.ExhaustPlumeID).PlumeID }]{}
                    GENERIC_PLUME {
                        name = ${ PlumeInfo.GetPlumeInfo (this.ExhaustPlumeID).PlumeID }
                        effectTransform = ${ modelInfo.Exhaust.exhaustEffectTransform }
                        bellWidth = ${ exhaustBellWidth }
                        verticalOffset = 0
                        volume = ${ (this.ExhaustThrustPercent / 100) * this.Thrust / 100 + 1 }
                        pitch = ${ Math.max (Math.min (Math.log10 (this.Thrust / 10 + 1) / 3, 2), 0.4) }
                    }
                }
            `;
        }
        
        let bellWidth = modelInfo.OriginalBellWidth * engine.Width / (engine.UseBaseWidth ? modelInfo.OriginalBaseWidth : modelInfo.OriginalBellWidth);
        let output = `
            @PART[GE-${engine.ID}]:FOR[zGenericPlumesPass0200] {
                @MODULE[ModuleEngine*] {
                    !GENERIC_PLUME[${ plumeInfo.PlumeID }]{}
                    GENERIC_PLUME {
                        name = ${ plumeInfo.PlumeID }
                        effectTransform = ${ modelInfo.ThrustTransformName }
                        bellWidth = ${ bellWidth }
                        verticalOffset = ${ modelInfo.PlumePositionOffset + modelInfo.OriginalBellWidth * 0.33 }
                        volume = ${ this.Thrust / 100 + 1 }
                        pitch = ${ Math.max (Math.min (Math.log10 (this.Thrust / 10 + 1) / 3, 2), 0.4) }
                    }
                }
                
                ${exhaustConfig}
                
            }
        `;
        
        return output;
    }
    
    public GetHiddenObjectsConfig (): string {
        let modelInfo: IModelInfo = ModelInfo.GetModelInfo (this.GetModelID ());
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
    
    public GetModelConfig (): string {
        let modelInfo: IModelInfo = ModelInfo.GetModelInfo (this.GetModelID ());
        let heightScale = this.Height / modelInfo.OriginalHeight;
        let widthScale = this.Width / heightScale / (this.UseBaseWidth ? modelInfo.OriginalBaseWidth : modelInfo.OriginalBellWidth);
        
        let attachmentNode = (
            modelInfo.RadialAttachment ?
            `node_attach = ${modelInfo.RadialAttachmentPoint * widthScale}, 0.0, 0.0, 1.0, 0.0, 0.0` :
            `node_attach = 0.0, ${modelInfo.NodeStackTop}, 0.0, 0.0, 1.0, 0.0`
        );
        
        // Heat animations
        let heatAnims = "";
        modelInfo.HeatAnimations.forEach (clip => {
            heatAnims += `
                MODULE
                {
                    name = FXModuleAnimateThrottle
                    animationName = ${ clip }
                    responseSpeed = 0.001
                    dependOnEngineState = True
                    dependOnThrottle = True
                }
            `;
        });
        
        let lookAtConfig = "";
        if (modelInfo.LookatPairs.length > 0) {
            modelInfo.LookatPairs.forEach (pair => {
                lookAtConfig += `
                    CONSTRAINLOOKFX
                    {
                        targetName = ${ pair[0] }
                        rotatorsName = ${ pair[1] }
                    }
                `;
            });
            
            lookAtConfig = `
                MODULE
                {
                    name = FXModuleLookAtConstraint
                    ${ lookAtConfig }
                }
            `;
        }
        
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
            
            ${heatAnims}
            
            ${lookAtConfig}
        `;
    }
    
    public IsTestFlightDefault (): boolean {
        let defaultConfig = new Engine ();
        return (
            this.EnableTestFlight == defaultConfig.EnableTestFlight &&
            this.RatedBurnTime == defaultConfig.RatedBurnTime &&
            this.StartReliability0 == defaultConfig.StartReliability0 &&
            this.StartReliability10k == defaultConfig.StartReliability10k &&
            this.CycleReliability0 == defaultConfig.CycleReliability0 &&
            this.CycleReliability10k == defaultConfig.CycleReliability10k
        );
    }
    
    public IsExhaustDefault (): boolean {
        let defaultConfig = new Engine ();
        return (
            this.UseExhaustEffect == defaultConfig.UseExhaustEffect &&
            this.ExhaustPlumeID == defaultConfig.ExhaustPlumeID &&
            this.ExhaustThrustPercent == defaultConfig.ExhaustThrustPercent &&
            this.ExhaustIspPercent == defaultConfig.ExhaustIspPercent &&
            this.ExhaustGimbal == defaultConfig.ExhaustGimbal
        );
    }
    
    public GetTestFlightConfig (): string {
        if (
            !this.EnableTestFlight ||
            this.PolyType == PolymorphismType.MultiModeMaster ||
            this.PolyType == PolymorphismType.MultiModeSlave
        ) {
            return "";
        } else {
            return `
                @PART[*]:HAS[@MODULE[ModuleEngineConfigs]:HAS[@CONFIG[GE-${this.ID}]],!MODULE[TestFlightInterop]]:BEFORE[zTestFlight]
                {
                    TESTFLIGHT
                    {
                        name = GE-${this.ID}
                        ratedBurnTime = ${this.RatedBurnTime}
                        ignitionReliabilityStart = ${this.StartReliability0 / 100}
                        ignitionReliabilityEnd = ${this.StartReliability10k / 100}
                        cycleReliabilityStart = ${this.CycleReliability0 / 100}
                        cycleReliabilityEnd = ${this.CycleReliability10k / 100}
                    }
                }
            `;
        }
    }
    
    public GetTankConfig (): string {
        if (!this.UseTanks) {
            return "";
        }
        
        let volume = 0;
        let contents = "";
        let items = this.GetConstrainedTankContents ();
        
        items.forEach (i => {
            volume += i[1];
            let fuelInfo: IFuelInfo = FuelInfo.GetFuelInfo (i[0]);
            contents += `
                TANK
                {
                    name = ${fuelInfo.FuelID}
                    amount = ${i[1] * fuelInfo.TankUtilisation}
                    maxAmount = ${i[1] * fuelInfo.TankUtilisation}
                }
            `;
        });
        
        return `
            MODULE
            {
                name = ModuleFuelTanks
                basemass = -1
                type = All
                volume = ${this.LimitTanks ? this.TanksVolume : volume}
                
                ${contents}
                
            }
        `;
    }
    
    public GetTankSizeEstimate (): number {
        let modelInfo = ModelInfo.GetModelInfo (this.GetModelID ());
        let output = modelInfo.OriginalTankVolume;
        
        output *= ((this.GetBaseWidth () / modelInfo.OriginalBaseWidth) ** 2);
        output *= this.Height / modelInfo.OriginalHeight;
        
        return output;
    }
    
    public GetConstrainedTankContents (): [Fuel, number][] {
        let targetEngine = (
            this.PolyType == PolymorphismType.MultiModeSlave ||
            this.PolyType == PolymorphismType.MultiConfigSlave
        ) ? this.EngineList.find (x => x.ID == this.MasterEngineName) : this;
        targetEngine = targetEngine != undefined ? targetEngine : this;
        
        if (!targetEngine.LimitTanks) { //Returns a copy, just like the code below
            return new Array<[Fuel, number]> ().concat (targetEngine.TanksContents);
        }
        
        let output: [Fuel, number][] = [];
        
        let usedVolume = 0;
        targetEngine.TanksContents.forEach (v => {
            let thisVol = Math.min (
                v[1] / FuelInfo.GetFuelInfo (v[0]).TankUtilisation, //This entry's volume
                targetEngine!.TanksVolume - usedVolume //Remaining volume
            );
            
            output.push ([v[0], thisVol * FuelInfo.GetFuelInfo (v[0]).TankUtilisation]);
        });
        
        return output;
    }
    
    private RebuildMasterSelect (e: HTMLElement) {
        let selects = e.querySelectorAll ("select");
        selects[1].innerHTML = "";
        let option1: HTMLOptionElement = document.createElement ("option");
        
        option1.value = "";
        option1.text = "";
        option1.selected = "" == this.MasterEngineName;
        selects[1].options.add (option1.cloneNode (true) as HTMLOptionElement);
        
        if (parseInt (selects[0].value) == PolymorphismType.MultiModeSlave) {
            this.EngineList.filter (x => x.Active && x.PolyType == PolymorphismType.MultiModeMaster).forEach (e => {
                let option: HTMLOptionElement = document.createElement ("option");
                option.value = `${e.ID}`;
                option.text = e.ID;
                option.selected = e.ID == this.MasterEngineName;
                selects[1].options.add (option);
            });
        } else if (parseInt (selects[0].value) == PolymorphismType.MultiConfigSlave) {
            this.EngineList.filter (x => x.Active && x.PolyType == PolymorphismType.MultiConfigMaster).forEach (e => {
                let option: HTMLOptionElement = document.createElement ("option");
                option.value = `${e.ID}`;
                option.text = e.ID;
                option.selected = e.ID == this.MasterEngineName;
                selects[1].options.add (option);
            });
        } else {
            
        }
        
    }
    
    public static readonly PolymorphismTypeDropdown: HTMLSelectElement = Engine.BuildPolymorphismTypeDropdown ();
    private static BuildPolymorphismTypeDropdown (): HTMLSelectElement {
        let output = document.createElement ("select");
        let option = document.createElement ("option");
        
        option.value = PolymorphismType.Single.toString ();
        option.text = "Single";
        output.options.add (option.cloneNode (true) as HTMLOptionElement);
        
        option.value = PolymorphismType.MultiModeMaster.toString ();
        option.text = "Multimode master";
        output.options.add (option.cloneNode (true) as HTMLOptionElement);
        
        option.value = PolymorphismType.MultiModeSlave.toString ();
        option.text = "Multimode slave";
        output.options.add (option.cloneNode (true) as HTMLOptionElement);
        
        option.value = PolymorphismType.MultiConfigMaster.toString ();
        option.text = "Multiconfig master";
        output.options.add (option.cloneNode (true) as HTMLOptionElement);
        
        option.value = PolymorphismType.MultiConfigSlave.toString ();
        option.text = "Multiconfig slave";
        output.options.add (option.cloneNode (true) as HTMLOptionElement);
        
        return output;
    }
    
    public IsManufacturerDefault (): boolean {
        let originalConfig = new Engine ();
        return this.EngineManufacturer == originalConfig.EngineManufacturer;
    }
    
    public IsDescriptionDefault (): boolean {
        let originalConfig = new Engine ();
        return this.EngineDescription == originalConfig.EngineDescription;
    }
    
    public IsGimbalDefault (): boolean {
        let defaultConfig = new Engine ();
        return (
            this.AdvancedGimbal == defaultConfig.AdvancedGimbal &&
            this.GimbalNX == defaultConfig.GimbalNX &&
            this.GimbalPX == defaultConfig.GimbalPX &&
            this.GimbalNY == defaultConfig.GimbalNY &&
            this.GimbalPY == defaultConfig.GimbalPY
        );
    }
    
    public GetGimbalConfig (): string {
        let modelInfo = ModelInfo.GetModelInfo (this.GetModelID ());
        let output = ""
        
        if (this.AdvancedGimbal) {
            output += `
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
            output += `
                MODULE
                {
                    name = ModuleGimbal
                    gimbalTransformName = ${modelInfo.GimbalTransformName}
                    useGimbalResponseSpeed = false
                    gimbalRange = ${this.Gimbal}
                }
            `;
        }
        
        if (this.UseExhaustEffect && modelInfo.Exhaust) {
            output += `
                MODULE
                {
                    name = ModuleGimbal
                    gimbalTransformName = ${modelInfo.Exhaust.exhaustGimbalTransform}
                    useGimbalResponseSpeed = false
                    gimbalRange = ${this.ExhaustGimbal}
                    enableYaw = ${!this.ExhaustGimbalOnlyRoll}
                    enablePitch = ${!this.ExhaustGimbalOnlyRoll}
                }
            `;
        }
        
        return output;
    }
    
    public GetPropellantConfig (): string {
        let electricPower = 0;
        let ratios: [Fuel, number][] = [];
        
        this.FuelRatioItems.forEach (i => {
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
            
            let x = this.VacIsp;
            x *= 9.8066;
            x = 1 / x;
            x /= averageDensity;
            x *= this.Thrust;
            
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
    
    public GetBaseWidth (): number {
        if (this.UseBaseWidth) {
            return this.Width;
        } else {
            let modelInfo = ModelInfo.GetModelInfo (this.GetModelID ());
            return this.Width * modelInfo.OriginalBaseWidth / modelInfo.OriginalBellWidth;
        }
    }
    
    public RehidePolyFields (cols: HTMLElement[]) {
        if (cols.length == 0) {
            console.warn ("Tried to rehide not displayed engine");
            return;
        }
        
        let x = 0;
        for (let i in Engine.ColumnDefinitions) {
            if (Engine.ColumnDefinitions[i].DisplayFlags != undefined) {
                if ((Engine.ColumnDefinitions[i].DisplayFlags! & 1 << this.PolyType) != 0) {
                    cols[x].classList.add ("hideCell");
                } else {
                    cols[x].classList.remove ("hideCell");
                }
            }
            
            ++x;
        }
    }
    
    public OnTableDraw (e: HTMLElement[]) {
        this.ListCols = e;
        this.RehidePolyFields (e);
    }
    
    constructor (originList: Engine[] = []) {
        this.EngineList = originList;
    }
    
    public EngineTypeConfig (): string {
        switch (this.EngineVariant) {
            case EngineType.Liquid:
            return "LiquidFuel";
            
            case EngineType.Solid:
            return "SolidBooster";
            
            default:
            return "unknown";
        }
    }
    
    public StagingIconConfig (): string {
        switch (this.EngineVariant) {
            case EngineType.Liquid:
            return "LIQUID_ENGINE";
            
            case EngineType.Solid:
            return "SOLID_BOOSTER";
            
            default:
            return "unknown";
        }
    }
    
    public GetThrustCurveConfig (): string {
        this.ThrustCurve = this.ThrustCurve.sort ((a, b) => {
            return b[0] - a[0];
        });
        
        if (this.ThrustCurve.length == 0) {
            return "";
        }
        
        let keys = "";
        let lastTangent: number = 0;
        let newTangent: number = 0;
        this.ThrustCurve.push ([Number.MIN_VALUE, this.ThrustCurve[this.ThrustCurve.length - 1][1]]);
        
        for (let i = 0; i < this.ThrustCurve.length - 1; ++i) {
            newTangent = (this.ThrustCurve[i + 1][1] - this.ThrustCurve[i][1]) / (this.ThrustCurve[i + 1][0] - this.ThrustCurve[i][0])
            keys += `
                key = ${this.ThrustCurve[i][0] / 100} ${this.ThrustCurve[i][1] / 100} ${newTangent} ${lastTangent}
            `;
            lastTangent = newTangent;
        }
        
        this.ThrustCurve.pop ();
        
        return `
            curveResource = ${FuelInfo.GetFuelInfo (this.FuelRatioItems[0][0]).FuelID}
            thrustCurve
            {
                ${keys}
            }
        `;
    }
    
    public GetAlternatorConfig (): string {
        if (this.AlternatorPower > 0) {
            return `
                MODULE
                {
                    name = ModuleAlternator
                    RESOURCE
                    {
                        name = ElectricCharge
                        rate = ${this.AlternatorPower}
                    }
                }
            `;
        } else {
            return "";
        }
    }
    
    public GetEngineModuleConfig (allEngines: { [id: string]: Engine }): string {
        if (
            this.PolyType == PolymorphismType.MultiModeMaster ||
            this.PolyType == PolymorphismType.MultiModeSlave
        ) {
            return "";
        } else {
            let modelInfo = ModelInfo.GetModelInfo (this.GetModelID ());
            if (modelInfo.Exhaust && this.UseExhaustEffect) {
                return `
                    MODULE
                    {
                        name = ModuleEngineConfigs
                        configuration = GE-${this.ID}
                        modded = false
                        origMass = ${this.Mass}
                        moduleIndex = 0
                        
                        ${this.GetEngineConfig (allEngines)}
                        
                    }
                    
                    MODULE
                    {
                        name = ModuleEngineConfigs
                        configuration = GE-${this.ID}-vernier
                        modded = false
                        origMass = ${this.Mass}
                        moduleIndex = 1
                        
                        ${this.GetExhaustConfig (allEngines)}
                        
                    }
                `;
            } else {
                return `
                    MODULE
                    {
                        name = ModuleEngineConfigs
                        configuration = GE-${this.ID}
                        modded = false
                        origMass = ${this.Mass}
                        moduleIndex = 0
                        
                        ${this.GetEngineConfig (allEngines)}
                        
                    }
                `;
            }
        }
    }
    
    public GetEngineConfig (allEngines: { [id: string]: Engine }): string {
        let masterEngine: Engine;
        if (this.PolyType == PolymorphismType.MultiConfigSlave || this.PolyType == PolymorphismType.MultiModeSlave) {
            masterEngine = this.EngineList.find (x => x.ID == this.MasterEngineName)!;
        } else {
            masterEngine = this;
        }
        let modelInfo = ModelInfo.GetModelInfo (masterEngine.GetModelID ());
        
        let hasExhaust = !!(modelInfo.Exhaust && masterEngine.UseExhaustEffect);
        return `
            CONFIG
            {
                name = GE-${this.ID}
                description = ${this.EngineDescription}
                maxThrust = ${(hasExhaust ? 1 - (this.ExhaustThrustPercent / 100) : 1) * this.Thrust}
                minThrust = ${(hasExhaust ? 1 - (this.ExhaustThrustPercent / 100) : 1) * this.Thrust * this.MinThrust / 100}
                %powerEffectName = ${PlumeInfo.GetPlumeInfo (this.PlumeID).PlumeEffectName}
                heatProduction = 100
                massMult = ${(this.PolyType == PolymorphismType.MultiConfigSlave ? (this.Mass / allEngines[this.MasterEngineName].Mass) : "1")}
                %techRequired = ${TechNode[this.TechUnlockNode]}
                cost = ${(this.PolyType == PolymorphismType.MultiConfigSlave ? this.Cost - allEngines[this.MasterEngineName].Cost : 0)}
                
                ${this.GetPropellantConfig ()}
                
                atmosphereCurve
                {
                    key = 0 ${this.VacIsp}
                    key = 1 ${this.AtmIsp}
                }
                
                ${this.GetThrustCurveConfig ()}
                
                ullage = ${this.NeedsUllage && this.EngineVariant != EngineType.Solid}
                pressureFed = ${this.PressureFed}
                ignitions = ${Math.max (this.Ignitions, 0)}
                IGNITOR_RESOURCE
                {
                    name = ElectricCharge
                    amount = 1
                }
            }
        `;
    }
    
    public GetExhaustConfig (allEngines: { [id: string]: Engine }): string {
        return `
            CONFIG
            {
                name = GE-${this.ID}-vernier
                description = ${this.EngineDescription}
                maxThrust = ${(this.ExhaustThrustPercent / 100) * this.Thrust}
                minThrust = ${(this.ExhaustThrustPercent / 100) * this.Thrust * this.MinThrust / 100}
                %powerEffectName = ${PlumeInfo.GetPlumeInfo (this.ExhaustPlumeID).PlumeEffectName}
                heatProduction = 100
                massMult = 1
                %techRequired = ${TechNode[this.TechUnlockNode]}
                cost = 0
                
                ${this.GetPropellantConfig ()}
                
                atmosphereCurve
                {
                    key = 0 ${(this.ExhaustIspPercent / 100) * this.VacIsp}
                    key = 1 ${(this.ExhaustIspPercent / 100) * this.AtmIsp}
                }
                
                ${this.GetThrustCurveConfig ()}
                
                ullage = ${this.NeedsUllage && this.EngineVariant != EngineType.Solid}
                pressureFed = ${this.PressureFed}
                ignitions = ${Math.max (this.Ignitions, 0)}
                IGNITOR_RESOURCE
                {
                    name = ElectricCharge
                    amount = 1
                }
            }
        `;
    }
    
}