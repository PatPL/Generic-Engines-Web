class FuelInfo {

    public static GetFuelInfo (id: Fuel): IFuelInfo {
        return FuelInfo.fuels[id];
    }

    private static readonly fuels: IFuelInfo[] = [
        {
            FuelName: "Electric Charge",
            FuelID: "ElectricCharge",
            TankUtilisation: 1000,
            Density: 0.0
        }, {//^^^ElectricCharge
            FuelName: "Liquid Oxygen",
            FuelID: "LqdOxygen",
            TankUtilisation: 1,
            Density: 0.001141
        }, {//^^^LqdOxygen
            FuelName: "Kerosene",
            FuelID: "Kerosene",
            TankUtilisation: 1,
            Density: 0.00082
        }, {//^^^Kerosene
            FuelName: "Liquid Hydrogen",
            FuelID: "LqdHydrogen",
            TankUtilisation: 1,
            Density: 0.00007085
        }, {//^^^LqdHydrogen
            FuelName: "NTO",
            FuelID: "NTO",
            TankUtilisation: 1,
            Density: 0.00145
        }, {//^^^NTO
            FuelName: "UDMH",
            FuelID: "UDMH",
            TankUtilisation: 1,
            Density: 0.000791
        }, {//^^^UDMH
            FuelName: "Aerozine50",
            FuelID: "Aerozine50",
            TankUtilisation: 1,
            Density: 0.0009
        }, {//^^^Aerozine50
            FuelName: "MMH",
            FuelID: "MMH",
            TankUtilisation: 1,
            Density: 0.00088
        }, {//^^^MMH
            FuelName: "HTP",
            FuelID: "HTP",
            TankUtilisation: 1,
            Density: 0.001431
        }, {//^^^HTP
            FuelName: "Aviation Gasoline (Avgas)",
            FuelID: "AvGas",
            TankUtilisation: 1,
            Density: 0.000719
        }, {//^^^AvGas
            FuelName: "IRFNA III",
            FuelID: "IRFNA_III",
            TankUtilisation: 1,
            Density: 0.001658
        }, {//^^^IRFNA_III
            FuelName: "Nitrous Oxide",
            FuelID: "NitrousOxide",
            TankUtilisation: 1,
            Density: 0.00000196
        }, {//^^^NitrousOxide
            FuelName: "Aniline",
            FuelID: "Aniline",
            TankUtilisation: 100,
            Density: 0.00102
        }, {//^^^Aniline
            FuelName: "Ethanol 75%",
            FuelID: "Ethanol75",
            TankUtilisation: 1,
            Density: 0.00084175
        }, {//^^^Ethanol75
            FuelName: "Ethanol 90%",
            FuelID: "Ethanol90",
            TankUtilisation: 1,
            Density: 0.0008101
        }, {//^^^Ethanol90
            FuelName: "Ethanol",
            FuelID: "Ethanol",
            TankUtilisation: 1,
            Density: 0.000789
        }, {//^^^Ethanol
            FuelName: "Liquid Ammonia",
            FuelID: "LqdAmmonia",
            TankUtilisation: 1,
            Density: 0.0007021
        }, {//^^^LqdAmmonia
            FuelName: "Liquid Methane",
            FuelID: "LqdMethane",
            TankUtilisation: 1,
            Density: 0.00042561
        }, {//^^^LqdMethane
            FuelName: "ClF3",
            FuelID: "ClF3",
            TankUtilisation: 1,
            Density: 0.00177
        }, {//^^^ClF3
            FuelName: "ClF5",
            FuelID: "ClF5",
            TankUtilisation: 1,
            Density: 0.0019
        }, {//^^^ClF5
            FuelName: "Diborane",
            FuelID: "Diborane",
            TankUtilisation: 1,
            Density: 0.000421
        }, {//^^^Diborane
            FuelName: "Pentaborane",
            FuelID: "Pentaborane",
            TankUtilisation: 1,
            Density: 0.000618
        }, {//^^^Pentaborane
            FuelName: "Ethane",
            FuelID: "Ethane",
            TankUtilisation: 1,
            Density: 0.000544
        }, {//^^^Ethane
            FuelName: "Ethylene",
            FuelID: "Ethylene",
            TankUtilisation: 1,
            Density: 0.000568
        }, {//^^^Ethylene
            FuelName: "OF2",
            FuelID: "",
            TankUtilisation: 1,
            Density: 0.0019
        }, {//^^^OF2
            FuelName: "Liquid Fluorine",
            FuelID: "LqdFluorine",
            TankUtilisation: 1,
            Density: 0.001505
        }, {//^^^LqdFluorine
            FuelName: "N2F4",
            FuelID: "N2F4",
            TankUtilisation: 1,
            Density: 0.001604
        }, {//^^^N2F4
            FuelName: "Methanol",
            FuelID: "Methanol",
            TankUtilisation: 1,
            Density: 0.0007918
        }, {//^^^Methanol
            FuelName: "Furfuryl",
            FuelID: "Furfuryl",
            TankUtilisation: 1,
            Density: 0.00113
        }, {//^^^Furfuryl
            FuelName: "UH25",
            FuelID: "UH25",
            TankUtilisation: 1,
            Density: 0.000829
        }, {//^^^UH25
            FuelName: "Tonka250",
            FuelID: "Tonka250",
            TankUtilisation: 1,
            Density: 0.000873
        }, {//^^^Tonka250
            FuelName: "Tonka500",
            FuelID: "Tonka500",
            TankUtilisation: 1,
            Density: 0.000811
        }, {//^^^Tonka500
            FuelName: "IWFNA",
            FuelID: "IWFNA",
            TankUtilisation: 1,
            Density: 0.001513
        }, {//^^^IWFNA
            FuelName: "IRFNA IV",
            FuelID: "IRFNA_IV",
            TankUtilisation: 1,
            Density: 0.001995
        }, {//^^^IRFNA_IV
            FuelName: "AK20",
            FuelID: "AK20",
            TankUtilisation: 1,
            Density: 0.001499
        }, {//^^^AK20
            FuelName: "AK27",
            FuelID: "AK27",
            TankUtilisation: 1,
            Density: 0.001494
        }, {//^^^AK27
            FuelName: "MON3",
            FuelID: "MON3",
            TankUtilisation: 1,
            Density: 0.001423
        }, {//^^^MON3
            FuelName: "MON10",
            FuelID: "MON10",
            TankUtilisation: 1,
            Density: 0.001407
        }, {//^^^MON10
            FuelName: "Hydyne",
            FuelID: "Hydyne",
            TankUtilisation: 1,
            Density: 0.00086
        }, {//^^^Hydyne
            FuelName: "Syntin",
            FuelID: "Syntin",
            TankUtilisation: 1,
            Density: 0.000851
        }, {//^^^Syntin
            FuelName: "Hydrazine",
            FuelID: "Hydrazine",
            TankUtilisation: 1,
            Density: 0.001004
        }, {//^^^Hydrazine
            FuelName: "Nitrogen",
            FuelID: "Nitrogen",
            TankUtilisation: 1,
            Density: 0.000001251
        }, {//^^^Nitrogen
            FuelName: "Helium",
            FuelID: "Helium",
            TankUtilisation: 200,
            Density: 0.0000001786
        }, {//^^^Helium
            FuelName: "CaveaB",
            FuelID: "CaveaB",
            TankUtilisation: 200,
            Density: 0.001501
        }, {//^^^CaveaB
            FuelName: "Liquid Fuel",
            FuelID: "LiquidFuel",
            TankUtilisation: 1,
            Density: 0.001
        }, {//^^^LiquidFuel
            FuelName: "Oxidizer",
            FuelID: "Oxidizer",
            TankUtilisation: 1,
            Density: 0.001
        }, {//^^^Oxidizer
            FuelName: "Monopropellant",
            FuelID: "MonoPropellant",
            TankUtilisation: 1,
            Density: 0.0008
        }, {//^^^MonoPropellant
            FuelName: "Xenon Gas",
            FuelID: "XenonGas",
            TankUtilisation: 1,
            Density: 0.000005894
        }, {//^^^XenonGas
            FuelName: "Intake Air",
            FuelID: "IntakeAir",
            TankUtilisation: 100,
            Density: 0.001225
        }, {//^^^IntakeAir
            FuelName: "Solid Fuel",
            FuelID: "SolidFuel",
            TankUtilisation: 1,
            Density: 0.0075
        }, {//^^^SolidFuel
            FuelName: "HNIW",
            FuelID: "HNIW",
            TankUtilisation: 1,
            Density: 0.002044
        }, {//^^^HNIW
            FuelName: "HTPB",
            FuelID: "HTPB",
            TankUtilisation: 1,
            Density: 0.00177
        }, {//^^^HTPB
            FuelName: "NGNC",
            FuelID: "NGNC",
            TankUtilisation: 1,
            Density: 0.0016
        }, {//^^^NGNC
            FuelName: "PBAN",
            FuelID: "PBAN",
            TankUtilisation: 1,
            Density: 0.001772
        }, {//^^^PBAN
            FuelName: "PSPC",
            FuelID: "PSPC",
            TankUtilisation: 1,
            Density: 0.00174
        } //^^^PSPC
    ];
    
    public static readonly Dropdown: HTMLSelectElement = FuelInfo.BuildDropdown ();
    private static BuildDropdown (): HTMLSelectElement {
        let output = document.createElement ("select");
        
        FuelInfo.fuels.forEach ((v, i) => {
            let option = document.createElement ("option");
            option.value = i.toString ();
            option.text = v.FuelName;
            
            output.appendChild (option);
        });
        
        return output;
    }
    
}