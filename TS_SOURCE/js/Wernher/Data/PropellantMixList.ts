/// <reference path="../Random/ConstantValue.ts" />
/// <reference path="../Random/RandomValue.ts" />
/// <reference path="../Enums/PropellantMix.ts" />
const PropellantMixList: { [propmix in PropellantMix]: IPropellantMix } = {
    [PropellantMix.Hydrolox]: {
        MaximumIsp: 520,
        SLIspLossCoefficient: 1.35,
        Plume: Plume.GP_Hydrolox,
        Propellants: [
            [Fuel.LqdHydrogen, new ConstantValue (1)],
            [Fuel.LqdOxygen, new RandomValue (5.0, 6.5, "bell", "float")]
        ]
    }, [PropellantMix.Kerolox]: {
        MaximumIsp: 400,
        SLIspLossCoefficient: 1.1,
        Plume: Plume.GP_Kerolox,
        Propellants: [
            [Fuel.Kerosene, new ConstantValue (1)],
            [Fuel.LqdOxygen, new RandomValue (2.0, 3.0, "bell", "float")]
        ]
    }, [PropellantMix.Methalox]: {
        MaximumIsp: 430,
        SLIspLossCoefficient: 1.18,
        Plume: Plume.GP_Methalox,
        Propellants: [
            [Fuel.LqdMethane, new ConstantValue (1)],
            [Fuel.LqdOxygen, new RandomValue (3.4, 4.2, "bell", "float")]
        ]
    }, [PropellantMix.Hydynelox]: {
        MaximumIsp: 372,
        SLIspLossCoefficient: 1.0,
        Plume: Plume.GP_Hydynelox,
        Propellants: [
            [Fuel.Hydyne, new ConstantValue (1)],
            [Fuel.LqdOxygen, new RandomValue (1.1, 1.5, "bell", "float")] // Couldn't find any good info on it. This value is just my guess
        ]
    }, [PropellantMix.Alcolox]: {
        MaximumIsp: 360,
        SLIspLossCoefficient: 1.0,
        Plume: Plume.GP_Alcolox,
        Propellants: [
            [Fuel.Ethanol, new ConstantValue (1)],
            [Fuel.LqdOxygen, new RandomValue (1.2, 1.8, "bell", "float")]
        ]
    }, [PropellantMix.Ammonialox]: {
        MaximumIsp: 350,
        SLIspLossCoefficient: 1.05,
        Plume: Plume.GP_Ammonialox,
        Propellants: [
            [Fuel.LqdAmmonia, new ConstantValue (1)],
            [Fuel.LqdOxygen, new RandomValue (1.3, 1.7, "bell", "float")] // Couldn't find any good info on it. This value is just my guess
        ]
    }, [PropellantMix.UDMH_NTO]: {
        MaximumIsp: 390,
        SLIspLossCoefficient: 0.94,
        Plume: Plume.GP_Hypergolic,
        Propellants: [
            [Fuel.UDMH, new ConstantValue (1)],
            [Fuel.NTO, new RandomValue (2.1, 3.1, "bell", "float")]
        ]
    }, [PropellantMix.UH25_NTO]: {
        MaximumIsp: 385,
        SLIspLossCoefficient: 0.93,
        Plume: Plume.GP_Hypergolic,
        Propellants: [
            [Fuel.UH25, new ConstantValue (1)],
            [Fuel.NTO, new RandomValue (1.5, 2.0, "bell", "float")]
        ]
    }, [PropellantMix.AE50_NTO]: {
        MaximumIsp: 380,
        SLIspLossCoefficient: 0.92,
        Plume: Plume.GP_OmsRed,
        Propellants: [
            [Fuel.Aerozine50, new ConstantValue (1)],
            [Fuel.NTO, new RandomValue (1.6, 2.3, "bell", "float")]
        ]
    }, [PropellantMix.MMH_NTO]: {
        MaximumIsp: 375,
        SLIspLossCoefficient: 0.92,
        Plume: Plume.GP_OmsRed,
        Propellants: [
            [Fuel.MMH, new ConstantValue (1)],
            [Fuel.NTO, new RandomValue (1.6, 2.2, "bell", "float")]
        ]
    }, [PropellantMix.Hydrazine]: {
        MaximumIsp: 320,
        SLIspLossCoefficient: 1.4,
        Plume: Plume.GP_OmsRed,
        Propellants: [
            [Fuel.Hydrazine, new ConstantValue (1)]
        ]
    }, [PropellantMix.HTP]: {
        MaximumIsp: 240,
        SLIspLossCoefficient: 1.0,
        Plume: Plume.GP_OmsWhite,
        Propellants: [
            [Fuel.HTP, new ConstantValue (1)]
        ]
    }, [PropellantMix.CaveaB]: {
        MaximumIsp: 350,
        SLIspLossCoefficient: 1.2,
        Plume: Plume.GP_OmsWhite,
        Propellants: [
            [Fuel.CaveaB, new ConstantValue (1)]
        ]
    }
};