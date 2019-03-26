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
            DefaultWidth: 240,
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
            DefaultWidth: 200,
            DisplayFlags: 0b00000
        }
    }
    Spacer: boolean = false; // For an empty space at the end of the table
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
    
    public RehidePolyFields (cols: HTMLElement[]) {
        if (cols.length == 0) {
            console.warn ("Tried to rehide not displayed engine");
            return;
        }
        
        let x = 0;
        for (let i in Engine.ColumnDefinitions) {
            if (Engine.ColumnDefinitions[i].DisplayFlags != undefined) {
                if ((Engine.ColumnDefinitions[i].DisplayFlags! & 1 << this.Polymorphism.PolyType) != 0) {
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
    
    ListCols: HTMLElement[] = [];
    EngineList: HtmlTable;
    
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
    Visuals: Visuals = new Visuals (this);
    Labels: Labels = new Labels (this);
    Polymorphism: Polymorphism;
    
    constructor (originList: HtmlTable) {
        this.Polymorphism = new Polymorphism (originList.Items, this);
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
}