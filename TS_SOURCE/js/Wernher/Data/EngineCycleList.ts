/// <reference path="../Enums/EngineCycle.ts" />
/// <reference path="../Enums/PropellantMix.ts" />
/// <reference path="../Random/AgeRandomValue.ts" />
/// <reference path="../Random/RandomValue.ts" />
/// <reference path="../Random/FunctionRandom.ts" />
// why the hell do I have to do this by hand?

const EngineCycleList: { [cycle: number]: IEngineCycle } = { // { [cycle in EngineCycle]: IEngineCycle } = {
    [EngineCycle.GasGenerator]: {
        Variants: {
            [PropellantMix.Hydrolox]: {
                Thrust: new AgeRandomValue (
                    [
                        [1950, 150,  1000],
                        [1965, 140,  2000],
                        [1980, 130,  4000],
                        [2005, 120,  6000],
                        [2020, 110,  8000],
                        [2050, 100, 10000],
                        [2100,  80, 11000],
                        [2150,  60, 12000],
                        [2200,  40, 12500],
                    ], "logarithmic", "float", "flat"
                ), SLIsp: new AgeRandomValue (
                    [
                        [1950, 250, 300],
                        [1965, 240, 330],
                        [1980, 230, 350],
                        [2005, 220, 360],
                        [2020, 210, 370],
                        [2050, 200, 380],
                        [2100, 190, 390],
                        [2150, 180, 400],
                        [2200, 170, 410],
                    ], "logarithmic", "float", "flat"
                ), VacIsp: new AgeRandomValue (
                    [
                        [1950, 360, 420],
                        [1965, 370, 430],
                        [1980, 380, 435],
                        [2005, 390, 437],
                        [2020, 400, 440],
                        [2050, 410, 443],
                        [2100, 417, 445],
                        [2150, 425, 447],
                        [2200, 430, 450],
                    ], "bell", "float", "flat"
                ), CostMultiplier: new RandomValue (0.7, 1.3, "triangle", "float"),
                Cost: (thrust, vacIsp, year, costMultiplier) => {
                    let cost = 1000;
                    // https://www.desmos.com/calculator/r9t9auslhb
                    let thrustCostMultiplier = (1.0002 ** thrust) - 0.7 + (thrust / 1500);
                    let ispCostMultiplier = 27 / (458 - vacIsp) + 0.3;
                    let yearCostMultiplier = WernherHelper.RegularYearCostMultiplier (year);
                    
                    return cost * thrustCostMultiplier * ispCostMultiplier * yearCostMultiplier * costMultiplier;
                }, BellWidth: (thrust: number, vacIsp: number, year: number) => {
                    let width = 2;
                    let thrustMultiplier = WernherHelper.ThrustBellWidthMultiplier (thrust, 1000);
                    let IspMultiplier = WernherHelper.ImpulseBellWidthMultiplier (vacIsp, 410);
                    
                    return width * thrustMultiplier * IspMultiplier;
                }, EntryCostMultiplier: new RandomValue (30, 120, "logSmooth", "float"),
                CanonAvailabilityYear: 1960
            }
        }, Ignitions: new FunctionRandom (0.5, 1, new RandomValue (2, 10, "logSmooth", "integer")),
        MinimumThrust: new FunctionRandom (0.25, 1, new RandomValue (50, 90, "linear", "integer")),
        Ullage: true,
        Models: [
            Model.Bell8048,
            Model.Bell8096,
            Model.E1,
            Model.F1,
            Model.F1B,
            Model.F1_BDB,
            Model.Skipper,
            Model.H1,
            Model.H1C,
            Model.H1D,
            Model.J2,
            Model.J2_BDB,
            Model.J2SL,
            Model.J2T,
            Model.J2X,
            Model.Juno45K,
            Model.Juno6K,
            Model.LR105,
            Model.LR87,
            Model.LR87S,
            Model.LR87_11,
            Model.LR87_11S,
            Model.LR87_11SH,
            Model.LR87_11SHV,
            Model.LR87_11SV,
            Model.LR87_5,
            Model.LR89,
            Model.LR91,
            Model.LR91_BDB,
            Model.LR91_11,
            Model.LR91_5,
            Model.LVT30,
            Model.LVT45,
            Model.Merlin1A,
            Model.Merlin1B,
            Model.Merlin1BV,
            Model.Merlin1D,
            Model.Merlin1DV,
            Model.Navaho,
            Model.RD107,
            Model.RS68,
            Model.S3D,
            Model.Thor,
            Model.Vanguard,
            Model.Viking,
            Model.VikingVac
        ], Mass: (bellWidth: number, year: number) => {
            let mass = 1.8;
            let bellMultiplier = WernherHelper.BellWidthMassMultiplier (bellWidth, 2.2);
            let yearMultiplier = WernherHelper.YearMassMultiplier (year);
            
            return mass * bellMultiplier * yearMultiplier;
        }, TestFlightRatedBurnTime: new AgeRandomValue ([
            [1940,  60, 120],
            [1945,  90, 180],
            [1950, 120, 240],
            [1960, 150, 300],
            [1980, 180, 360],
            [2000, 210, 420],
            [2020, 240, 480],
            [2050, 265, 540],
            [2100, 270, 600],
            [2150, 285, 700],
            [2200, 300, 800],
        ], "logarithmic", "integer", "continue"),
        TestFlight10kIgnition: new AgeRandomValue ([
            [1940, 80, 90],
            [1945, 86, 94],
            [1950, 90, 96],
            [1960, 95, 99],
            [1980, 98, 99.5],
            [2000, 99, 99.9],
            [2020, 99.9, 99.99],
            [2200, 99.99, 99.999],
        ], "bell", "float", "continue"),
        TestFlight10kIgnitionDeficiency: new AgeRandomValue ([
            [1940, 15, 25],
            [1945, 12, 20],
            [1950, 9, 17],
            [1960, 7, 14],
            [1980, 5, 8],
            [2000, 3, 6],
            [2020, 2, 4],
            [2200, 1, 2],
        ], "bell", "float", "continue"),
        TestFlight10kCycle: new AgeRandomValue ([
            [1940, 80, 90],
            [1945, 86, 94],
            [1950, 90, 96],
            [1960, 95, 99],
            [1980, 98, 99.5],
            [2000, 99, 99.9],
            [2020, 99.9, 99.99],
            [2200, 99.99, 99.999],
        ], "bell", "float", "continue"),
        TestFlight10kCycleDeficiency: new AgeRandomValue ([
            [1940, 15, 25],
            [1945, 12, 20],
            [1950, 9, 17],
            [1960, 7, 14],
            [1980, 5, 8],
            [2000, 3, 6],
            [2020, 2, 4],
            [2200, 1, 2],
        ], "bell", "float", "continue"),
        CanonAvailabilityYear: 1940
    }
};