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
    
    public readonly EditableFieldMetadata: { [id: string]: IEditable<Engine> } = {
        Spacer: EngineEditableFieldMetadata.Spacer,
        ID: EngineEditableFieldMetadata.ID,
        Mass: EngineEditableFieldMetadata.Mass,
        Thrust: EngineEditableFieldMetadata.Thrust,
        AtmIsp: EngineEditableFieldMetadata.AtmIsp,
        VacIsp: EngineEditableFieldMetadata.VacIsp,
        Cost: EngineEditableFieldMetadata.Cost,
        EntryCost: EngineEditableFieldMetadata.EntryCost,
        MinThrust: EngineEditableFieldMetadata.MinThrust,
        AlternatorPower: EngineEditableFieldMetadata.AlternatorPower,
        Ignitions: EngineEditableFieldMetadata.Ignitions,
        TechUnlockNode: EngineEditableFieldMetadata.TechUnlockNode,
        EngineVariant: EngineEditableFieldMetadata.EngineVariant,
        ThrustCurve: EngineEditableFieldMetadata.ThrustCurve,
        Dimensions: EngineEditableFieldMetadata.Dimensions,
        FuelRatios: EngineEditableFieldMetadata.FuelRatios,
        Gimbal: EngineEditableFieldMetadata.Gimbal,
        Labels: EngineEditableFieldMetadata.Labels,
        Polymorphism: EngineEditableFieldMetadata.Polymorphism,
        Tank: EngineEditableFieldMetadata.Tank,
        TestFlight: EngineEditableFieldMetadata.TestFlight,
        Visuals: EngineEditableFieldMetadata.Visuals,
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
        
        // Extendable nozzle config
        let deployableEnginesConfig = "";
        if (modelInfo.ExtendNozzleAnimation) {
            deployableEnginesConfig = `
                MODULE
                {
                    name = ModuleDeployableEngine
                    EngineAnimationName = ${ modelInfo.ExtendNozzleAnimation }
                    WaitForAnimation = 0.9
                    Layer = ${ Math.ceil (Math.random () * 2_000_000_000) }
                }
            `;
        }
        
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
            
            ${deployableEnginesConfig}
            
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
    
    public RebuildMasterSelect (e: HTMLElement) {
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