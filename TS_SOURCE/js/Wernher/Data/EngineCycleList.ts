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
                CostMultiplier: new RandomValue (0.7, 1.3, "triangle", "float"),
                Cost: (thrust, vacIsp, year, costMultiplier) => {
                    let cost = 1000;
                    // https://www.desmos.com/calculator/r9t9auslhb
                    let thrustCostMultiplier = (1.0002 ** thrust) - 0.7 + (thrust / 1500);
                    let ispCostMultiplier = 27 / (458 - vacIsp) + 0.3;
                    let yearCostMultiplier = WernherHelper.RegularYearCostMultiplier (year);
                    
                    return cost * thrustCostMultiplier * ispCostMultiplier * yearCostMultiplier * costMultiplier;
                },
                EntryCostMultiplier: new RandomValue (30, 120, "logSmooth", "float"),
                CanonAvailabilityYear: 1960
            }
        },
        
        // * * * * References from RP-1 tech tree:
        // * Start:
        // * * RD-100:           307kN, 203s - 237s Alcolox (aux HTP)
        // * * A-4:              312kN, 203s - 239s Alcolox (aux HTP)
        // * Post-war:
        // * * RD-101:           404kN, 210s - 237s Alcolox (aux HTP)
        // * * A-9:              289kN, 220s - 255s Alcolox (aux HTP)
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
        // * * X-405H:           156kN, 209s - 312s Kerolox (ignitions) (aux HTP)
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
        // * 1968:
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
            [Year.Start, 200,   400],
        ], "logarithmic", "float", "flat"),
        VacEfficiency: new AgeRandomValue ([
            [Year.Start, 55, 60],
        ], "bell", "float", "flat"),
        SLEfficiency: new AgeRandomValue ([
            [1940, 55, 60],
            [1945, 60, 65],
        ], "bell", "float", "flat"),
        BellWidth: (thrust, isp, year) => 1,
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
            let mass = 2.5;
            let bellMultiplier = WernherHelper.BellWidthMassMultiplier (bellWidth, 2.0);
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