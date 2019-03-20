///<reference path="../Enums/FuelType.ts" />
class FuelInfo {

    public static GetFuelInfo(id: Fuel): IFuelInfo {
        return FuelInfo.fuels[id];
    }

    private static readonly fuels: IFuelInfo[] = [
        {
            FuelName: "Electric Charge",
            FuelID: "ElectricCharge",
            FuelType: FuelType.Other,
            TankUtilisation: 1000,
            Density: 0.0
        }, {//^^^ElectricCharge
            FuelName: "Liquid Oxygen",
            FuelID: "LqdOxygen",
            FuelType: FuelType.Oxidiser,
            TankUtilisation: 1,
            Density: 0.001141
        }, {//^^^LqdOxygen
            FuelName: "Kerosene",
            FuelID: "Kerosene",
            FuelType: FuelType.Fuel,
            TankUtilisation: 1,
            Density: 0.00082
        }, {//^^^Kerosene
            FuelName: "Liquid Hydrogen",
            FuelID: "LqdHydrogen",
            FuelType: FuelType.Fuel,
            TankUtilisation: 1,
            Density: 0.00007085
        }, {//^^^LqdHydrogen
            FuelName: "NTO",
            FuelID: "NTO",
            FuelType: FuelType.Oxidiser,
            TankUtilisation: 1,
            Density: 0.00145
        }, {//^^^NTO
            FuelName: "UDMH",
            FuelID: "UDMH",
            FuelType: FuelType.Fuel,
            TankUtilisation: 1,
            Density: 0.000791
        }, {//^^^UDMH
            FuelName: "Aerozine50",
            FuelID: "Aerozine50",
            FuelType: FuelType.Fuel,
            TankUtilisation: 1,
            Density: 0.0009
        }, {//^^^Aerozine50
            FuelName: "MMH",
            FuelID: "MMH",
            FuelType: FuelType.Fuel,
            TankUtilisation: 1,
            Density: 0.00088
        }, {//^^^MMH
            FuelName: "HTP",
            FuelID: "HTP",
            FuelType: FuelType.MonoPropellant,
            TankUtilisation: 1,
            Density: 0.001431
        }, {//^^^HTP
            FuelName: "Aviation Gasoline (Avgas)",
            FuelID: "AvGas",
            FuelType: FuelType.Fuel,
            TankUtilisation: 1,
            Density: 0.000719
        }, {//^^^AvGas
            FuelName: "IRFNA III",
            FuelID: "IRFNA_III",
            FuelType: FuelType.Oxidiser,
            TankUtilisation: 1,
            Density: 0.001658
        }, {//^^^IRFNA_III
            FuelName: "Nitrous Oxide",
            FuelID: "NitrousOxide",
            FuelType: FuelType.Gas,
            TankUtilisation: 100,
            Density: 0.00000196
        }, {//^^^NitrousOxide
            FuelName: "Aniline",
            FuelID: "Aniline",
            FuelType: FuelType.Fuel,
            TankUtilisation: 1,
            Density: 0.00102
        }, {//^^^Aniline
            FuelName: "Ethanol 75%",
            FuelID: "Ethanol75",
            FuelType: FuelType.Fuel,
            TankUtilisation: 1,
            Density: 0.00084175
        }, {//^^^Ethanol75
            FuelName: "Ethanol 90%",
            FuelID: "Ethanol90",
            FuelType: FuelType.Fuel,
            TankUtilisation: 1,
            Density: 0.0008101
        }, {//^^^Ethanol90
            FuelName: "Ethanol",
            FuelID: "Ethanol",
            FuelType: FuelType.Fuel,
            TankUtilisation: 1,
            Density: 0.000789
        }, {//^^^Ethanol
            FuelName: "Liquid Ammonia",
            FuelID: "LqdAmmonia",
            FuelType: FuelType.Fuel,
            TankUtilisation: 1,
            Density: 0.0007021
        }, {//^^^LqdAmmonia
            FuelName: "Liquid Methane",
            FuelID: "LqdMethane",
            FuelType: FuelType.Fuel,
            TankUtilisation: 1,
            Density: 0.00042561
        }, {//^^^LqdMethane
            FuelName: "ClF3",
            FuelID: "ClF3",
            FuelType: FuelType.Oxidiser,
            TankUtilisation: 1,
            Density: 0.00177
        }, {//^^^ClF3
            FuelName: "ClF5",
            FuelID: "ClF5",
            FuelType: FuelType.Oxidiser,
            TankUtilisation: 1,
            Density: 0.0019
        }, {//^^^ClF5
            FuelName: "Diborane",
            FuelID: "Diborane",
            FuelType: FuelType.Fuel,
            TankUtilisation: 1,
            Density: 0.000421
        }, {//^^^Diborane
            FuelName: "Pentaborane",
            FuelID: "Pentaborane",
            FuelType: FuelType.Fuel,
            TankUtilisation: 1,
            Density: 0.000618
        }, {//^^^Pentaborane
            FuelName: "Ethane",
            FuelID: "Ethane",
            FuelType: FuelType.Fuel,
            TankUtilisation: 1,
            Density: 0.000544
        }, {//^^^Ethane
            FuelName: "Ethylene",
            FuelID: "Ethylene",
            FuelType: FuelType.Fuel,
            TankUtilisation: 1,
            Density: 0.000568
        }, {//^^^Ethylene
            FuelName: "OF2",
            FuelID: "OF2",
            FuelType: FuelType.Oxidiser,
            TankUtilisation: 1,
            Density: 0.0019
        }, {//^^^OF2
            FuelName: "Liquid Fluorine",
            FuelID: "LqdFluorine",
            FuelType: FuelType.Oxidiser,
            TankUtilisation: 1,
            Density: 0.001505
        }, {//^^^LqdFluorine
            FuelName: "N2F4",
            FuelID: "N2F4",
            FuelType: FuelType.Oxidiser,
            TankUtilisation: 1,
            Density: 0.001604
        }, {//^^^N2F4
            FuelName: "Methanol",
            FuelID: "Methanol",
            FuelType: FuelType.Fuel,
            TankUtilisation: 1,
            Density: 0.0007918
        }, {//^^^Methanol
            FuelName: "Furfuryl",
            FuelID: "Furfuryl",
            FuelType: FuelType.Fuel,
            TankUtilisation: 1,
            Density: 0.00113
        }, {//^^^Furfuryl
            FuelName: "UH25",
            FuelID: "UH25",
            FuelType: FuelType.Fuel,
            TankUtilisation: 1,
            Density: 0.000829
        }, {//^^^UH25
            FuelName: "Tonka250",
            FuelID: "Tonka250",
            FuelType: FuelType.Fuel,
            TankUtilisation: 1,
            Density: 0.000873
        }, {//^^^Tonka250
            FuelName: "Tonka500",
            FuelID: "Tonka500",
            FuelType: FuelType.Fuel,
            TankUtilisation: 1,
            Density: 0.000811
        }, {//^^^Tonka500
            FuelName: "IWFNA",
            FuelID: "IWFNA",
            FuelType: FuelType.Oxidiser,
            TankUtilisation: 1,
            Density: 0.001513
        }, {//^^^IWFNA
            FuelName: "IRFNA IV",
            FuelID: "IRFNA_IV",
            FuelType: FuelType.Oxidiser,
            TankUtilisation: 1,
            Density: 0.001995
        }, {//^^^IRFNA_IV
            FuelName: "AK20",
            FuelID: "AK20",
            FuelType: FuelType.Oxidiser,
            TankUtilisation: 1,
            Density: 0.001499
        }, {//^^^AK20
            FuelName: "AK27",
            FuelID: "AK27",
            FuelType: FuelType.Oxidiser,
            TankUtilisation: 1,
            Density: 0.001494
        }, {//^^^AK27
            FuelName: "MON3",
            FuelID: "MON3",
            FuelType: FuelType.Oxidiser,
            TankUtilisation: 1,
            Density: 0.001423
        }, {//^^^MON3
            FuelName: "MON10",
            FuelID: "MON10",
            FuelType: FuelType.Oxidiser,
            TankUtilisation: 1,
            Density: 0.001407
        }, {//^^^MON10
            FuelName: "Hydyne",
            FuelID: "Hydyne",
            FuelType: FuelType.Fuel,
            TankUtilisation: 1,
            Density: 0.00086
        }, {//^^^Hydyne
            FuelName: "Syntin",
            FuelID: "Syntin",
            FuelType: FuelType.Fuel,
            TankUtilisation: 1,
            Density: 0.000851
        }, {//^^^Syntin
            FuelName: "Hydrazine",
            FuelID: "Hydrazine",
            FuelType: FuelType.MonoPropellant,
            TankUtilisation: 1,
            Density: 0.001004
        }, {//^^^Hydrazine
            FuelName: "Nitrogen",
            FuelID: "Nitrogen",
            FuelType: FuelType.Gas,
            TankUtilisation: 200,
            Density: 0.000001251
        }, {//^^^Nitrogen
            FuelName: "Helium",
            FuelID: "Helium",
            FuelType: FuelType.Gas,
            TankUtilisation: 200,
            Density: 0.0000001786
        }, {//^^^Helium
            FuelName: "CaveaB",
            FuelID: "CaveaB",
            FuelType: FuelType.MonoPropellant,
            TankUtilisation: 1,
            Density: 0.001501
        }, {//^^^CaveaB
            FuelName: "Liquid Fuel",
            FuelID: "LiquidFuel",
            FuelType: FuelType.Stock,
            TankUtilisation: 1,
            Density: 0.001
        }, {//^^^LiquidFuel
            FuelName: "Oxidizer",
            FuelID: "Oxidizer",
            FuelType: FuelType.Stock,
            TankUtilisation: 1,
            Density: 0.001
        }, {//^^^Oxidizer
            FuelName: "Monopropellant",
            FuelID: "MonoPropellant",
            FuelType: FuelType.Stock,
            TankUtilisation: 1,
            Density: 0.0008
        }, {//^^^MonoPropellant
            FuelName: "Xenon Gas",
            FuelID: "XenonGas",
            FuelType: FuelType.Stock,
            TankUtilisation: 100,
            Density: 0.000005894
        }, {//^^^XenonGas
            FuelName: "Intake Air",
            FuelID: "IntakeAir",
            FuelType: FuelType.Stock,
            TankUtilisation: 1,
            Density: 0.001225
        }, {//^^^IntakeAir
            FuelName: "Solid Fuel",
            FuelID: "SolidFuel",
            FuelType: FuelType.Stock,
            TankUtilisation: 1,
            Density: 0.0075
        }, {//^^^SolidFuel
            FuelName: "HNIW",
            FuelID: "HNIW",
            FuelType: FuelType.Solid,
            TankUtilisation: 1,
            Density: 0.002044
        }, {//^^^HNIW
            FuelName: "HTPB",
            FuelID: "HTPB",
            FuelType: FuelType.Solid,
            TankUtilisation: 1,
            Density: 0.00177
        }, {//^^^HTPB
            FuelName: "NGNC",
            FuelID: "NGNC",
            FuelType: FuelType.Solid,
            TankUtilisation: 1,
            Density: 0.0016
        }, {//^^^NGNC
            FuelName: "PBAN",
            FuelID: "PBAN",
            FuelType: FuelType.Solid,
            TankUtilisation: 1,
            Density: 0.001772
        }, {//^^^PBAN
            FuelName: "PSPC",
            FuelID: "PSPC",
            FuelType: FuelType.Solid,
            TankUtilisation: 1,
            Density: 0.00174
        } //^^^PSPC
    ];

    public static readonly Dropdown: HTMLSelectElement = FuelInfo.BuildDropdown();
    private static BuildDropdown(): HTMLSelectElement {
        let output = document.createElement("select");

        let groups: { [id: string]: HTMLOptGroupElement } = {};
        for (let i in FuelType) {
            let group = document.createElement("optgroup");
            group.label = FuelType[i];
            output.appendChild(group);
            groups[FuelType[i]] = group;
        }

        FuelInfo.fuels.forEach((v, i) => {
            let option = document.createElement("option");
            option.value = i.toString();
            option.text = v.FuelName;

            groups[v.FuelType].appendChild (option);
        });

        return output;
    }

}