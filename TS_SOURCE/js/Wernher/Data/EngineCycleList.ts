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
                CostMultiplier: new RandomValue (2.0, 5.0, "triangle", "float"),
                EntryCostMultiplier: new RandomValue (20, 80, "logSmooth", "float"),
                CanonAvailabilityYear: Year.HydroloxPrototype,
            }, [PropellantMix.Kerolox]: {
                CostMultiplier: new RandomValue (0.7, 1.3, "triangle", "float"),
                EntryCostMultiplier: new RandomValue (30, 90, "logSmooth", "float"),
                CanonAvailabilityYear: Year.Rocketry1956,
            }, [PropellantMix.Hydynelox]: {
                CostMultiplier: new RandomValue (1.0, 2.5, "triangle", "float"),
                EntryCostMultiplier: new RandomValue (30, 90, "logSmooth", "float"),
                CanonAvailabilityYear: Year.PostWar,
            }, [PropellantMix.Alcolox]: {
                CostMultiplier: new RandomValue (0.5, 1.2, "triangle", "float"),
                EntryCostMultiplier: new RandomValue (20, 60, "logSmooth", "float"),
                CanonAvailabilityYear: Year.Start,
            }, [PropellantMix.Ammonialox]: {
                CostMultiplier: new RandomValue (1.0, 2.0, "triangle", "float"),
                EntryCostMultiplier: new RandomValue (30, 90, "logSmooth", "float"),
                CanonAvailabilityYear: Year.Rocketry1958,
            }, [PropellantMix.UDMH_NTO]: {
                CostMultiplier: new RandomValue (0.7, 1.3, "triangle", "float"),
                EntryCostMultiplier: new RandomValue (30, 90, "logSmooth", "float"),
                CanonAvailabilityYear: Year.Rocketry1965,
            }, [PropellantMix.UH25_NTO]: {
                CostMultiplier: new RandomValue (0.7, 1.3, "triangle", "float"),
                EntryCostMultiplier: new RandomValue (30, 90, "logSmooth", "float"),
                CanonAvailabilityYear: Year.Rocketry1965,
            }
        },
        
        // * * * * References from RP-1 tech tree:
        // * Start:
        // * * RD-100:           307kN, 203s - 237s Alcolox (aux HTP)
        // * * A-4:              312kN, 203s - 239s Alcolox (aux HTP)
        // * Post-war:
        // * * RD-101:           404kN, 210s - 237s Alcolox (aux HTP)
        // * * A-9:              289kN, 220s - 255s Hydynelox (aux HTP) (1945 dev only, should be in a later node tbh, doesn't really fit here)
        // * Early:
        // * * RD-102:           428kN, 214s - 235s Alcolox (aux HTP)
        // * Basic:
        // * * RD-103:           490kN, 220s - 248s Alcolox (aux HTP)
        // * * A-6:              396kN, 216s - 249s Alcolox (aux HTP)
        // * 1956:
        // * * RD-103M:          500kN, 220s - 248s Alcolox (aux HTP)
        // * * A-7:              416kN, 235s - 265s Hydynelox (aux HTP)
        // * * X-405:            136kN, 254s - 278s Kerolox (aux HTP)
        // * * RD-107:          1000kN, 249s - 304s Kerolox (aux HTP)
        // * * RD-108:           941kN, 241s - 306s Kerolox (aux HTP) (long burn time trait)
        // * * LR89:             667kN, 245s - 278s Kerolox
        // * * LR105:            240kN, 210s - 301s Kerolox (sustainer trait)
        // * * S-3:              697kN, 248s - 288s Kerolox
        // * 1958:
        // * * RD-0105:           49kN, 257s - 316s Kerolox (vacuum trait) (This SLIsp seems way too high)
        // * * LR89-3:           759kN, 248s - 282s Kerolox
        // * * LR105-3:          352kN, 215s - 309s Kerolox (sustainer trait)
        // * * S-3D:             766kN, 248s - 288s Kerolox
        // * 1959:
        // * * XLR99:            262kN, 239s - 276s Ammonialox (ignitions, throttling)
        // * * LR87:             766kN, 250s - 286s Kerolox
        // * * LR91:             363kN, 233s - 310s Kerolox (vacuum trait)
        // * * LR79-9:           783kN, 245s - 284s Kerolox
        // * 1960:
        // * * RD-0107:          298kN, 141s - 326s Kerolox (vacuum trait, minor throttling)
        // * * X-405H:           156kN, 209s - 312s Kerolox (vacuum trait, ignitions, aux HTP)
        // * * LR105-5:          366kN, 217s - 313s Kerolox (sustainer trait)
        // * * LR79-11:          850kN, 248s - 286s Kerolox
        // * * LR89-5:           831kN, 251s - 290s Kerolox
        // * * RD-0109:           55kN, 264s - 324s Kerolox (vacuum trait) (this SLIsp seems way too high)
        // * 1961:
        // * * H-1:              807kN, 263s - 292s Kerolox
        // * 1962:
        // * * LR105-6:          373kN, 217s - 313s Kerolox (sustainer trait)
        // * * LR87-5:          1075kN, 257s - 289s Kerolox
        // * * LR89-6:           847kN, 256s - 290s Kerolox
        // * * LR91-5:           448kN, 200s - 312s Kerolox (vacuum trait)
        // * 1963:
        // * * E-1:             1885kN, 260s - 290s Kerolox
        // * * LR79-13:          873kN, 252s - 291s Kerolox
        // ### LR87-LH2:         667kN, 350s - 403s Hydrolox
        // * 1964:
        // * * RD-855:            83kN, 254s - 292s UDMH+NTO
        // * * H-1-188:          920kN, 263s - 292s Kerolox
        // * * LR87-7:          1093kN, 261s - 296s Kerolox
        // * * LR91-7:           456kN, 200s - 315s Kerolox (vacuum trait)
        // * 1965:
        // * * LR105-7.1:        385kN, 220s - 316s Kerolox (sustainer trait)
        // * * LR87-9:          1130kN, 262s - 298s Kerolox
        // * * LR89-7.1:         932kN, 258s - 292s Kerolox
        // * * LR91-9:           456kN, 200s - 316s Kerolox (vacuum trait)
        // * * RD-0110:          298kN, 141s - 330s Kerolox (vacuum trait, minor throttling)
        // * 1966:
        // * * H-1-200:          979kN, 263s - 292s Kerolox
        // ### J-2:              890kN, 100s - 418s Hydrolox (vacuum trait, ignitions, throttling)
        // * 1967:
        // * * F-1:             7741kN, 263s - 304s Kerolox
        // * * LR105-7.2:        386kN, 220s - 316s Kerolox (sustainer trait)
        // * * LR89-7.2:         951kN, 259s - 293s Kerolox
        // ### LR87-LH2-Vac:     778kN, 312s - 419s Hydrolox (sustainer trait, ignitions)
        // ### J-2-225:         1001kN, 100s - 424s Hydrolox (vacuum trait, ignitions, throttling)
        // # 1968: (Hydrolox-only node)
        // ### J-2-230:         1023kN, 100s - 425s Hydrolox (vacuum trait, ignitions, throttling)
        // ### LR87-LH2+         801kN, 358s - 409s Hydrolox (ignitions)
        // * 1970:
        // * * LR87-11:         1170kN, 254s - 302s Kerolox (sustainer-ish trait)
        // * * LR91-11:          456kN, 200s - 318s Kerolox (vacuum trait)
        // * 1972:
        // * * E-1+:            2335kN, 256s - 291s Kerolox
        // * * H-1-205:         1018kN, 263s - 292s Kerolox
        // * * LR87-11A:        1211kN, 252s - 304s Kerolox (sustainer-ish trait)
        // * * RS-27:           1023kN, 264s - 295s Kerolox
        // ### J-2S:            1179kN, 320s - 436s Hydrolox (sustainer trait, ignitions, throttling)
        // ### LR87-LH2-Vac+     889kN, 233s - 434s Hydrolox (vacuum trait, ignitions)
        // ### M-1-Spec:        5338kN, 250s - 428s Hydrolox (vacuum trait)
        // * 1976:
        // * * E-1++:           2355kN, 264s - 301s Kerolox
        // * * F-1A:            9190kN, 270s - 310s Kerolox (long burn time trait)
        // ### HM-7:              62kN, 308s - 440s Hydrolox (vacuum trait)
        // ### M-1:             6672kN, 250s - 430s Hydrolox (vacuum trait)
        // ### M-1SL:           6672kN, 310s - 428s Hydrolox (sustainer trait)
        // * 1981:
        // * * LR91-11A:         475kN, 200s - 318s Kerolox (vacuum trait)
        // ### HM-7B-Early:       64kN, 310s - 442s Hydrolox (vacuum trait)
        // ### HM-7B:             65kN, 310s - 446s Hydrolox (vacuum trait)
        // * 1986:
        // * * RS-27A:          1054kN, 255s - 302s Kerolox (sustainer-ish trait)
        // * * LR89-RS-56:      1078kN, 262s - 296s Kerolox
        // * * LR105-RS-56:      386kN, 220s - 316s Kerolox (sustainer trait)
        // ### M-1U:            8007kN, 250s - 430s Hydrolox (vacuum trait)
        // * 1992:
        // * * Vikas-1:          681kN, 248s - 281s UDMH+NTO
        // ### Vulcain 1:       1113kN, 315s - 439s Hydrolox (Sustainer trait)
        // * 1998:
        // * * S5.92:             20kN, 158s - 327s UDMH+NTO (vacuum trait)
        // ### RS-68:           3370kN, 357s - 409s Hydrolox (throttling)
        // ### Vulcain-2:       1359kN, 320s - 429s Hydrolox (sustainer trait)
        // * 2004:
        // * * Merlin-1A:        369kN, 254s - 289s Kerolox
        // * * Vikas-1+:         766kN, 255s - 288s UDMH+NTO
        // * * Vikas-2:          725kN, 261s - 296s UDMH+NTO
        // * 2009:
        // * * Merlin-1C:        483kN, 267s - 305s Kerolox
        // * * Merlin-1C-Vac:    412kN, 173s - 342s Kerolox (vacuum trait, throttling, ignitions)
        // * * Merlin-1D:        722kN, 282s - 311s Kerolox (throttling, ignitions)
        // * * Merlin-1D-Vac:    805kN, 200s - 345s Kerolox (vacuum trait, throttling, ignitions)
        // * * Vikas-2B:         805kN, 261s - 302s UH25+NTO
        // ### RS-68A:          3570kN, 362s - 412s Hydrolox (throttling) (No clue if it's the correct year)
        // ### J-2X:            1308kN, 200s - 448s Hydrolox (vacuum trait, minor throttling, ignitions)
        // * 2014:
        // * * Merlin-1D+:       825kN, 282s - 311s Kerolox (throttling, ignitions)
        // * * Merlin-1D++:      914kN, 289s - 311s Kerolox (throttling, ignitions)
        // * * Merlin-1D-Vac+:   934kN, 200s - 348s Kerolox (vacuum trait, throttling, ignitions)
        // * 2020 (Near future):
        // * * F-1B:            8815kN, 272s - 299s (throttling)
        // * * * *
        
        Thrust: new AgeRandomValue ([
            [Year.Start, 200, 400],
            [Year.PostWar, 170, 550],
            [Year.EarlyRocketry, 140, 700],
            [Year.BasicRocketry, 120, 900],
            [Year.Rocketry1956, 100, 1300],
            [Year.Rocketry1958, 80, 1500],
            [Year.Rocketry1959, 60, 1700],
            [Year.Rocketry1960, 40, 1900],
            [Year.Rocketry1961, 36, 2200],
            [Year.Rocketry1962, 32, 2500],
            [Year.Rocketry1963, 28, 3500],
            [Year.Rocketry1964, 24, 4500],
            [Year.Rocketry1965, 22, 5500],
            [Year.Rocketry1966, 20, 6500],
            [Year.Rocketry1967, 18, 8000],
            [Year.Rocketry1970, 15, 9500],
            [Year.Rocketry1972, 13, 10000],
            [Year.Rocketry1976, 12, 10500],
            [Year.Rocketry1981, 11, 11000],
            [Year.Rocketry1986, 10, 11500],
            [Year.Rocketry1992, 9.5, 12000],
            [Year.Rocketry1998, 9, 12500],
            [Year.Rocketry2004, 8.5, 13000],
            [Year.Rocketry2009, 8, 13500],
            [Year.Rocketry2014, 7.5, 14000],
            [Year.Rocketry2020, 7, 14500],
            [Year.Rocketry2050, 6.5, 15000],
            [Year.Rocketry2100, 6, 16500],
            [Year.Rocketry2150, 5.5, 18000],
            [Year.Rocketry2200, 5, 20000],
        ], "logarithmic", "float", "flat"),
        VacEfficiency: new AgeRandomValue ([
            [Year.Start, 64, 68],
            [Year.PostWar, 64.5, 68.5],
            [Year.EarlyRocketry, 65, 69],
            [Year.BasicRocketry, 67, 71],
            [Year.Rocketry1956, 69, 73],
            [Year.Rocketry1958, 69.5, 73.5],
            [Year.Rocketry1959, 70, 74],
            [Year.Rocketry1960, 70.5, 74.5],
            [Year.Rocketry1961, 71, 75],
            [Year.Rocketry1962, 71.1, 75.25],
            [Year.Rocketry1963, 71.2, 75.5],
            [Year.Rocketry1964, 71.3, 75.75],
            [Year.Rocketry1965, 71.4, 76],
            [Year.Rocketry1966, 71.5, 76.25],
            [Year.Rocketry1967, 71.6, 76.5],
            [Year.Rocketry1970, 72, 77],
            [Year.Rocketry1972, 72.5, 77.5],
            [Year.Rocketry1976, 73, 78],
            [Year.Rocketry1981, 73.25, 78.3],
            [Year.Rocketry1986, 73.5, 78.6],
            [Year.Rocketry1992, 73.75, 79],
            [Year.Rocketry1998, 74, 79.25],
            [Year.Rocketry2004, 74.3, 79.5],
            [Year.Rocketry2009, 74.6, 79.75],
            [Year.Rocketry2014, 75, 80],
            [Year.Rocketry2020, 75.2, 80.1],
            [Year.Rocketry2050, 76, 80.5],
            [Year.Rocketry2100, 77, 81],
            [Year.Rocketry2150, 78, 81.5],
            [Year.Rocketry2200, 79, 82],
        ], "bell", "float", "flat"),
        SLEfficiency: new AgeRandomValue ([
            [Year.Start, 84, 87],
            [Year.PostWar, 85, 88.5],
            [Year.EarlyRocketry, 85.5, 89.5],
            [Year.BasicRocketry, 86, 90],
            [Year.Rocketry1956, 86.5, 90],
            [Year.Rocketry1958, 86.6, 90.5],
            [Year.Rocketry1959, 86.7, 91],
            [Year.Rocketry1960, 86.8, 91.1],
            [Year.Rocketry1961, 86.9, 91.2],
            [Year.Rocketry1962, 87, 91.3],
            [Year.Rocketry1963, 87.1, 91.4],
            [Year.Rocketry1964, 87.2, 91.5],
            [Year.Rocketry1965, 87.3, 91.6],
            [Year.Rocketry1966, 87.4, 91.7],
            [Year.Rocketry1967, 87.5, 91.8],
            [Year.Rocketry1970, 87.6, 91.9],
            [Year.Rocketry1972, 87.7, 92],
            [Year.Rocketry1976, 87.8, 92.1],
            [Year.Rocketry1981, 88, 92.4],
            [Year.Rocketry1986, 88.5, 92.7],
            [Year.Rocketry1992, 89, 93],
            [Year.Rocketry1998, 89.5, 93.25],
            [Year.Rocketry2004, 90, 93.5],
            [Year.Rocketry2009, 91, 93.75],
            [Year.Rocketry2014, 92, 94],
            [Year.Rocketry2020, 92.15, 94.1],
            [Year.Rocketry2050, 92.5, 94.3],
            [Year.Rocketry2100, 93, 94.5],
            [Year.Rocketry2150, 93.5, 94.75],
            [Year.Rocketry2200, 94, 95],
        ], "bell", "float", "flat"),
        Cost: (thrust, year, costMultiplier) => {
            // https://www.desmos.com/calculator/kjhbiusugt
            let cost = (0.00004 * thrust * thrust) + (0.3 * thrust) + 30;
            cost *= WernherHelper.RegularYearCostMultiplier (year);
            cost *= costMultiplier;
            
            return cost;
        },
        BellWidth: (thrust, year) => {
            // https://www.desmos.com/calculator/ast1szeb9y
            let width = ((thrust ** 0.534) / (1440 ** 0.445)) - (thrust / 8500);
            width *= WernherHelper.YearBellWidthMultiplier (year);
            
            return width;
        },
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
            // https://www.desmos.com/calculator/vjqyuqab8e
            let mass = (250 * bellWidth) + (200 * bellWidth ** 2.75) - 5;
            mass *= WernherHelper.YearMassMultiplier (year);
            
            return mass;
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