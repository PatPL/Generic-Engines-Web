class PlumeInfo {
    
    public static GetPlumeInfo (id: Plume): IPlumeInfo {
        return PlumeInfo.plumes[id];
    }
    
    private static readonly plumes: IPlumeInfo[] = [
        {
            PlumeID: "Kerolox-Upper",
            PlumeName: "Kerolox Upper",
            Scale: 0.4,
            PositionOffset: -0.002, //mu offset
            FinalOffset: 0.0,
            EnergyMultiplier: 1.0
        }, {
            PlumeID: "Kerolox-Lower",
            PlumeName: "Kerolox Lower",
            Scale: 0.4,
            PositionOffset: -0.002, //mu offset
            FinalOffset: 0.0,
            EnergyMultiplier: 1.0
        }, {
            PlumeID: "Kerolox-Vernier",
            PlumeName: "Kerolox Vernier",
            Scale: 8.5,
            PositionOffset: 0.0, //mu offset
            FinalOffset: 0.0,
            EnergyMultiplier: 0.5
        }, {
            PlumeID: "Cryogenic-UpperLower-125",
            PlumeName: "Cryogenic 1.25",
            Scale: 0.35,
            PositionOffset: 0.0, //mu offset
            FinalOffset: 0.0,
            EnergyMultiplier: 1.0
        }, {
            PlumeID: "Cryogenic-UpperLower-25",
            PlumeName: "Cryogenic 2.5",
            Scale: 0.6,
            PositionOffset: 0.0, //mu offset
            FinalOffset: 0.0,
            EnergyMultiplier: 1.0
        }, {
            PlumeID: "Cryogenic-UpperLower-375",
            PlumeName: "Cryogenic 3.75",
            Scale: 0.3,
            PositionOffset: 0.0, //mu offset
            FinalOffset: 0.0,
            EnergyMultiplier: 1.0
        }, {
            PlumeID: "Alcolox-Lower-A6",
            PlumeName: "Alcolox Lower (A6)",
            Scale: 0.6,
            PositionOffset: 0.032638, //mu offset
            FinalOffset: 0.0,
            EnergyMultiplier: 1.0
        }, {
            PlumeID: "Ammonialox",
            PlumeName: "Ammonialox",
            Scale: 0.85,
            PositionOffset: 1.0319, //mu offset
            FinalOffset: 0.0,
            EnergyMultiplier: 1.0
        }, {
            PlumeID: "Hydrogen-NTR",
            PlumeName: "Hydrogen NTR",
            Scale: 0.8,
            PositionOffset: -0.8, //mu offset
            FinalOffset: 0.0,
            EnergyMultiplier: 1.0
        }, {
            PlumeID: "Hydrolox-Lower",
            PlumeName: "Hydrolox Lower",
            Scale: 0.7,
            PositionOffset: 1.0, //mu offset
            FinalOffset: 0.0,
            EnergyMultiplier: 1.0
        }, {
            PlumeID: "Hydrolox-Upper",
            PlumeName: "Hydrolox Upper",
            Scale: 0.8,
            PositionOffset: 1.0, //mu offset
            FinalOffset: 0.0,
            EnergyMultiplier: 1.0
        }, {
            PlumeID: "Hydynelox-A7",
            PlumeName: "Hydynelox (A7)",
            Scale: 0.7,
            PositionOffset: -0.854729, //mu offset
            FinalOffset: 0.0,
            EnergyMultiplier: 1.0
        }, {
            PlumeID: "Hypergolic-Lower",
            PlumeName: "Hypergolic Lower",
            Scale: 0.95,
            PositionOffset: 0.0, //mu offset
            FinalOffset: 0.0,
            EnergyMultiplier: 1.0
        }, {
            PlumeID: "Hypergolic-Upper",
            PlumeName: "Hypergolic Upper",
            Scale: 1.1,
            PositionOffset: 0.0, //mu offset
            FinalOffset: 0.0,
            EnergyMultiplier: 1.0
        }, {
            PlumeID: "Hypergolic-OMS-Red",
            PlumeName: "Hypergolic OMS (Red)",
            Scale: 1.7,
            PositionOffset: 0.514995, //mu offset
            FinalOffset: 0.0,
            EnergyMultiplier: 1.0
        }, {
            PlumeID: "Hypergolic-OMS-White",
            PlumeName: "Hypergolic OMS (White)", // (?) - Doesn't have plume definition in RealPlume preset, only flare
            Scale: 1.8,                          //       Flares get scale 0, so the plume might not show at all
            PositionOffset: 0, //mu offset (Of plume boundary)
            FinalOffset: -0.04,
            EnergyMultiplier: 1.0
        }, {
            PlumeID: "Hypergolic-Vernier",
            PlumeName: "Hypergolic Vernier",
            Scale: 4.0,
            PositionOffset: 1.0, //mu offset
            FinalOffset: 0.0,
            EnergyMultiplier: 1.0
        }, {
            PlumeID: "Ion-Argon-Gridded",
            PlumeName: "Ion Argon (Gridded)",
            Scale: 1.2,
            PositionOffset: 0.0, //mu offset
            FinalOffset: 0.0,
            EnergyMultiplier: 1.0
        }, {
            PlumeID: "Ion-Krypton-Gridded",
            PlumeName: "Ion Krypton (Gridded)",
            Scale: 1.5,
            PositionOffset: -0.854729, //mu offset
            FinalOffset: 0.0,
            EnergyMultiplier: 1.0
        }, {
            PlumeID: "Ion-Krypton-Hall",
            PlumeName: "Ion Krypton (Hall)",
            Scale: 1.5,
            PositionOffset: -0.015503, //mu offset
            FinalOffset: 0.0,
            EnergyMultiplier: 1.0
        }, {
            PlumeID: "Ion-Xenon-Gridded",
            PlumeName: "Ion Xenon (Gridded)",
            Scale: 1.0,
            PositionOffset: 1.0, //mu offset
            FinalOffset: 0.0,
            EnergyMultiplier: 1.0
        }, {
            PlumeID: "Ion-Xenon-Hall",
            PlumeName: "Ion Xenon (Hall)",
            Scale: 1.6,
            PositionOffset: -0.015503, //mu offset
            FinalOffset: 0.0,
            EnergyMultiplier: 1.0
        }, {
            PlumeID: "Solid-Lower",
            PlumeName: "Solid Lower",
            Scale: 0.3,
            PositionOffset: -0.002, //mu offset
            FinalOffset: 0.0,
            EnergyMultiplier: 1.0
        }, {
            PlumeID: "Solid-Upper",
            PlumeName: "Solid Upper",
            Scale: 0.3,
            PositionOffset: -0.002, //mu offset
            FinalOffset: 0.0,
            EnergyMultiplier: 1.0
        }, {
            PlumeID: "Solid-Sepmotor",
            PlumeName: "Solid Sepmotor",
            Scale: 3.0,
            PositionOffset: 0.0, //mu offset
            FinalOffset: 0.0,
            EnergyMultiplier: 1.0
        }, {
            PlumeID: "Solid-Vacuum",
            PlumeName: "Solid Vacuum",
            Scale: 1.44,
            PositionOffset: 0.35831, //mu offset
            FinalOffset: 0.0,
            EnergyMultiplier: 1.0
        }, {
            PlumeID: "Turbofan",
            PlumeName: "Turbofan",
            Scale: 1.2,
            PositionOffset: -0.41932, //mu offset
            FinalOffset: 0.0,
            EnergyMultiplier: 1.0
        }, {
            PlumeID: "Turbojet",
            PlumeName: "Turbojet",
            Scale: 1.2,
            PositionOffset: 1.0, //mu offset
            FinalOffset: -0.6,
            EnergyMultiplier: 1.0
        }
    ];
    
    public static readonly Dropdown: HTMLSelectElement = PlumeInfo.BuildDropdown ();
    private static BuildDropdown (): HTMLSelectElement {
        let output = document.createElement ("select");
        
        PlumeInfo.plumes.forEach ((v, i) => {
            let option = document.createElement ("option");
            option.value = i.toString ();
            option.text = v.PlumeName;
            
            output.options.add (option);
        });
        
        return output;
    }
    
}