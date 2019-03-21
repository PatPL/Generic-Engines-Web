class Engine {
    
    EditableFieldMetadata: { [id: string]: IEditable } = {
        ID: {
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
                e.innerHTML = `${this.Mass}t`;
            }
        }, Thrust: {
            ApplyValueToDisplayElement: (e) => {
                e.innerHTML = `${this.Thrust}kN`;
            }
        }, AtmIsp: {
            ApplyValueToDisplayElement: (e) => {
                e.innerHTML = `${this.AtmIsp}s`;
            }
        }, VacIsp: {
            ApplyValueToDisplayElement: (e) => {
                e.innerHTML = `${this.VacIsp}s`;
            }
        }, Cost: {
            ApplyValueToDisplayElement: (e) => {
                e.innerHTML = `${this.Cost}VF`;
            }
        }, EntryCost: {
            ApplyValueToDisplayElement: (e) => {
                e.innerHTML = `${this.EntryCost}VF`;
            }
        }, MinThrust: {
            ApplyValueToDisplayElement: (e) => {
                e.innerHTML = `${this.MinThrust}%`;
            }
        }, AlternatorPower: {
            ApplyValueToDisplayElement: (e) => {
                e.innerHTML = `${this.AlternatorPower}kW`;
            }
        }, Ignitions: {
            ApplyValueToDisplayElement: (e) => {
                e.innerHTML = this.Ignitions <= 0 ? "Infinite" : this.Ignitions.toString ();
            }
        }, TechUnlockNode: {
            ApplyValueToDisplayElement: (e) => {
                e.innerHTML = TechNode[this.TechUnlockNode];
            }, GetEditElement: () => {
                let tmp = document.createElement ("input");
                tmp.classList.add ("content-cell-content");
                tmp.setAttribute ("list", "techNodeItems"); //tmp.list is readonly because reasons, apparently
                return tmp;
            }, ApplyValueToEditElement: (e) => {
                (e as HTMLInputElement).value = TechNode[this.TechUnlockNode];
            }, ApplyChangesToValue: (e) => {
                //@ts-ignore kurwa wiem co robie
                let value = parseInt (TechNode[(e as HTMLInputElement).value]);
                
                value = isNaN (value) ? 0 : value;
                
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
                tmp.style.height = "153px";
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
                        tmpCurve.push ([parseFloat (inputs[i].value), parseFloat (inputs[i + 1].value)]);
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
                    this.ThrustCurve.push ([parseFloat (inputs[i].value), parseFloat (inputs[i + 1].value)]);
                }
            }
        }
    }
    
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
    
    Tank: Tank = new Tank (this);
    FuelRatios: FuelRatios = new FuelRatios ();
    Dimensions: Dimensions = new Dimensions (this);
    Gimbal: Gimbal = new Gimbal ();
    TestFlight: TestFlight = new TestFlight ();
    Visuals: Visuals = new Visuals ();
    Labels: Labels = new Labels ();
    Polymorphism: Polymorphism;
    
    constructor (originList: Engine[]) {
        this.Polymorphism = new Polymorphism (originList);
        this.EngineList = originList;
    }
}