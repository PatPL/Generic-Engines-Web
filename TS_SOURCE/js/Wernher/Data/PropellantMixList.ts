/// <reference path="../Random/ConstantValue.ts" />
/// <reference path="../Random/RandomValue.ts" />
/// <reference path="../Enums/PropellantMix.ts" />
const PropellantMixList: { [propmix in PropellantMix]: IPropellantMix } = {
    [PropellantMix.Hydrolox]: {
        Plume: Plume.GP_Hydrolox,
        Propellants: [
            [Fuel.LqdHydrogen, new ConstantValue (1)],
            [Fuel.LqdOxygen, new RandomValue (5.0, 6.5, "bell", "float")]
        ]
    }, [PropellantMix.Kerolox]: {
        Plume: Plume.GP_Kerolox,
        Propellants: [
            [Fuel.Kerosene, new ConstantValue (1)],
            [Fuel.LqdOxygen, new RandomValue (2.0, 3.0, "bell", "float")]
        ]
    }, [PropellantMix.Methalox]: {
        Plume: Plume.GP_Methalox,
        Propellants: [
            [Fuel.LqdMethane, new ConstantValue (1)],
            [Fuel.LqdOxygen, new RandomValue (3.4, 4.2, "bell", "float")]
        ]
    }, [PropellantMix.Alcolox]: {
        Plume: Plume.GP_Methalox,
        Propellants: [
            [Fuel.Ethanol, new ConstantValue (1)],
            [Fuel.LqdOxygen, new RandomValue (1.2, 1.8, "bell", "float")]
        ]
    }, [PropellantMix.Ammonialox]: {
        Plume: Plume.GP_Methalox,
        Propellants: [
            [Fuel.LqdAmmonia, new ConstantValue (1)],
            [Fuel.LqdOxygen, new RandomValue (2.7, 3.4, "bell", "float")] // Couldn't find any good info on it. This value is just my guess
        ]
    }, [PropellantMix.UDMH_NTO]: {
        Plume: Plume.GP_Hypergolic,
        Propellants: [
            [Fuel.UDMH, new ConstantValue (1)],
            [Fuel.NTO, new RandomValue (2.1, 3.1, "bell", "float")]
        ]
    }, [PropellantMix.UH25_NTO]: {
        Plume: Plume.GP_Hypergolic,
        Propellants: [
            [Fuel.UH25, new ConstantValue (1)],
            [Fuel.NTO, new RandomValue (1.5, 2.0, "bell", "float")]
        ]
    }, [PropellantMix.AE50_NTO]: {
        Plume: Plume.GP_OmsRed,
        Propellants: [
            [Fuel.Aerozine50, new ConstantValue (1)],
            [Fuel.NTO, new RandomValue (1.6, 2.3, "bell", "float")]
        ]
    }, [PropellantMix.MMH_NTO]: {
        Plume: Plume.GP_OmsRed,
        Propellants: [
            [Fuel.MMH, new ConstantValue (1)],
            [Fuel.NTO, new RandomValue (1.6, 2.2, "bell", "float")]
        ]
    }, [PropellantMix.Hydrazine]: {
        Plume: Plume.GP_OmsRed,
        Propellants: [
            [Fuel.Hydrazine, new ConstantValue (1)]
        ]
    }, [PropellantMix.HTP]: {
        Plume: Plume.GP_OmsWhite,
        Propellants: [
            [Fuel.HTP, new ConstantValue (1)]
        ]
    }, [PropellantMix.CaveaB]: {
        Plume: Plume.GP_OmsWhite,
        Propellants: [
            [Fuel.CaveaB, new ConstantValue (1)]
        ]
    }
};