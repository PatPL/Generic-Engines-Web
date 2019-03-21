class Engine {
    
    EditableFieldMetadata: { [id: string]: IEditable } = {
        Mass: {
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
        }, MinThrust: {
            ApplyValueToDisplayElement: (e) => {
                e.innerHTML = `${this.MinThrust}%`;
            }
        }, AlternatorPower: {
            ApplyValueToDisplayElement: (e) => {
                e.innerHTML = `${this.AlternatorPower}kW`;
            }
        }
    }
    
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
    
    Tank: Tank = new Tank (this);
    FuelRatios: FuelRatios = new FuelRatios ();
    Dimensions: Dimensions = new Dimensions (this);
    Gimbal: Gimbal = new Gimbal ();
    TestFlight: TestFlight = new TestFlight ();
    Visuals: Visuals = new Visuals ();
    Labels: Labels = new Labels ();
    
    ThrustCurve: [number, number][] = [];
    
    PolyType: Polymorphism = Polymorphism.Single; //Create separate polymorphism object?
    MasterEngineName: string = "";
    MasterEngineCost: number = 0;
    MasterEngineMass: number = 0;
    
    constructor () {
        
    }
}