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
            EnergyMultiplier: 1.0,
            PlumeFiles: [], // No required files. This plume depends on RealPlume
            ImageSource: "img/plumePreviews/RP_Kerolox_Upper.webp",
            get ImageLabel (): string { return this.PlumeName },
            PlumeMod: "RealPlume",
            get PlumeEffectName (): string { return this.PlumeID }
        }, {
            PlumeID: "Kerolox-Lower",
            PlumeName: "Kerolox Lower",
            Scale: 0.4,
            PositionOffset: -0.002, //mu offset
            FinalOffset: 0.0,
            EnergyMultiplier: 1.0,
            PlumeFiles: [], // No required files. This plume depends on RealPlume
            ImageSource: "img/plumePreviews/RP_Kerolox_Lower.webp",
            get ImageLabel (): string { return this.PlumeName },
            PlumeMod: "RealPlume",
            get PlumeEffectName (): string { return this.PlumeID }
        }, {
            PlumeID: "Kerolox-Vernier",
            PlumeName: "Kerolox Vernier",
            Scale: 8.5,
            PositionOffset: 0.0, //mu offset
            FinalOffset: 0.0,
            EnergyMultiplier: 0.5,
            PlumeFiles: [], // No required files. This plume depends on RealPlume
            ImageSource: "img/plumePreviews/RP_Kerolox_Vernier.webp",
            get ImageLabel (): string { return this.PlumeName },
            PlumeMod: "RealPlume",
            get PlumeEffectName (): string { return this.PlumeID }
        }, {
            PlumeID: "Cryogenic-UpperLower-125",
            PlumeName: "Cryogenic 1.25",
            Scale: 0.35,
            PositionOffset: 0.0, //mu offset
            FinalOffset: 0.0,
            EnergyMultiplier: 1.0,
            PlumeFiles: [], // No required files. This plume depends on RealPlume
            ImageSource: "img/plumePreviews/RP_Cryogenic_125.webp",
            get ImageLabel (): string { return this.PlumeName },
            PlumeMod: "RealPlume",
            get PlumeEffectName (): string { return this.PlumeID }
        }, {
            PlumeID: "Cryogenic-UpperLower-25",
            PlumeName: "Cryogenic 2.5",
            Scale: 0.6,
            PositionOffset: 0.0, //mu offset
            FinalOffset: 0.0,
            EnergyMultiplier: 1.0,
            PlumeFiles: [], // No required files. This plume depends on RealPlume
            ImageSource: "img/plumePreviews/RP_Cryogenic_25.webp",
            get ImageLabel (): string { return this.PlumeName },
            PlumeMod: "RealPlume",
            get PlumeEffectName (): string { return this.PlumeID }
        }, {
            PlumeID: "Cryogenic-UpperLower-375",
            PlumeName: "Cryogenic 3.75",
            Scale: 0.3,
            PositionOffset: 0.0, //mu offset
            FinalOffset: 0.0,
            EnergyMultiplier: 1.0,
            PlumeFiles: [], // No required files. This plume depends on RealPlume
            ImageSource: "img/plumePreviews/RP_Cryogenic_375.webp",
            get ImageLabel (): string { return this.PlumeName },
            PlumeMod: "RealPlume",
            get PlumeEffectName (): string { return this.PlumeID }
        }, {
            PlumeID: "Alcolox-Lower-A6",
            PlumeName: "Alcolox Lower (A6)",
            Scale: 0.6,
            PositionOffset: 0.032638, //mu offset
            FinalOffset: 0.0,
            EnergyMultiplier: 1.0,
            PlumeFiles: [], // No required files. This plume depends on RealPlume
            ImageSource: "img/plumePreviews/RP_Alcolox_Lower_A6.webp",
            get ImageLabel (): string { return this.PlumeName },
            PlumeMod: "RealPlume",
            get PlumeEffectName (): string { return this.PlumeID }
        }, {
            PlumeID: "Ammonialox",
            PlumeName: "Ammonialox",
            Scale: 0.85,
            PositionOffset: 1.0319, //mu offset
            FinalOffset: 0.0,
            EnergyMultiplier: 1.0,
            PlumeFiles: [], // No required files. This plume depends on RealPlume
            ImageSource: "img/plumePreviews/RP_Ammonialox.webp",
            get ImageLabel (): string { return this.PlumeName },
            PlumeMod: "RealPlume",
            get PlumeEffectName (): string { return this.PlumeID }
        }, {
            PlumeID: "Hydrogen-NTR",
            PlumeName: "Hydrogen NTR",
            Scale: 0.8,
            PositionOffset: -0.8, //mu offset
            FinalOffset: 0.0,
            EnergyMultiplier: 1.0,
            PlumeFiles: [], // No required files. This plume depends on RealPlume
            ImageSource: "img/plumePreviews/RP_HydrogenNTR.webp",
            get ImageLabel (): string { return this.PlumeName },
            PlumeMod: "RealPlume",
            get PlumeEffectName (): string { return this.PlumeID }
        }, {
            PlumeID: "Hydrolox-Lower",
            PlumeName: "Hydrolox Lower",
            Scale: 0.7,
            PositionOffset: 1.0, //mu offset
            FinalOffset: 0.0,
            EnergyMultiplier: 1.0,
            PlumeFiles: [], // No required files. This plume depends on RealPlume
            ImageSource: "img/plumePreviews/RP_Hydrolox_Lower.webp",
            get ImageLabel (): string { return this.PlumeName },
            PlumeMod: "RealPlume",
            get PlumeEffectName (): string { return this.PlumeID }
        }, {
            PlumeID: "Hydrolox-Upper",
            PlumeName: "Hydrolox Upper",
            Scale: 0.8,
            PositionOffset: 1.0, //mu offset
            FinalOffset: 0.0,
            EnergyMultiplier: 1.0,
            PlumeFiles: [], // No required files. This plume depends on RealPlume
            ImageSource: "img/plumePreviews/RP_Hydrolox_Upper.webp",
            get ImageLabel (): string { return this.PlumeName },
            PlumeMod: "RealPlume",
            get PlumeEffectName (): string { return this.PlumeID }
        }, {
            PlumeID: "Hydynelox-A7",
            PlumeName: "Hydynelox (A7)",
            Scale: 0.7,
            PositionOffset: -0.854729, //mu offset
            FinalOffset: 0.0,
            EnergyMultiplier: 1.0,
            PlumeFiles: [], // No required files. This plume depends on RealPlume
            ImageSource: "img/plumePreviews/RP_Hydynelox_A7.webp",
            get ImageLabel (): string { return this.PlumeName },
            PlumeMod: "RealPlume",
            get PlumeEffectName (): string { return this.PlumeID }
        }, {
            PlumeID: "Hypergolic-Lower",
            PlumeName: "Hypergolic Lower",
            Scale: 0.95,
            PositionOffset: 0.0, //mu offset
            FinalOffset: 0.0,
            EnergyMultiplier: 1.0,
            PlumeFiles: [], // No required files. This plume depends on RealPlume
            ImageSource: "img/plumePreviews/RP_Hypergolic_Lower.webp",
            get ImageLabel (): string { return this.PlumeName },
            PlumeMod: "RealPlume",
            get PlumeEffectName (): string { return this.PlumeID }
        }, {
            PlumeID: "Hypergolic-Upper",
            PlumeName: "Hypergolic Upper",
            Scale: 1.1,
            PositionOffset: 0.0, //mu offset
            FinalOffset: 0.0,
            EnergyMultiplier: 1.0,
            PlumeFiles: [], // No required files. This plume depends on RealPlume
            ImageSource: "img/plumePreviews/RP_Hypergolic_Upper.webp",
            get ImageLabel (): string { return this.PlumeName },
            PlumeMod: "RealPlume",
            get PlumeEffectName (): string { return this.PlumeID }
        }, {
            PlumeID: "Hypergolic-OMS-Red",
            PlumeName: "Hypergolic OMS (Red)",
            Scale: 1.7,
            PositionOffset: 0.514995, //mu offset
            FinalOffset: 0.0,
            EnergyMultiplier: 1.0,
            PlumeFiles: [], // No required files. This plume depends on RealPlume
            ImageSource: "img/plumePreviews/RP_Hypergolic_OMS_Red.webp",
            get ImageLabel (): string { return this.PlumeName },
            PlumeMod: "RealPlume",
            get PlumeEffectName (): string { return this.PlumeID }
        }, {
            PlumeID: "Hypergolic-OMS-White",
            PlumeName: "Hypergolic OMS (White)", // (?) - Doesn't have plume definition in RealPlume preset, only flare
            Scale: 1.8,                          //       Flares get scale 0, so the plume might not show at all
            PositionOffset: 0, //mu offset (Of plume boundary)
            FinalOffset: -0.04,
            EnergyMultiplier: 1.0,
            PlumeFiles: [], // No required files. This plume depends on RealPlume
            ImageSource: "img/plumePreviews/RP_Hypergolic_OMS_White.webp",
            get ImageLabel (): string { return this.PlumeName },
            PlumeMod: "RealPlume",
            get PlumeEffectName (): string { return this.PlumeID }
        }, {
            PlumeID: "Hypergolic-Vernier",
            PlumeName: "Hypergolic Vernier",
            Scale: 4.0,
            PositionOffset: 1.0, //mu offset
            FinalOffset: 0.0,
            EnergyMultiplier: 1.0,
            PlumeFiles: [], // No required files. This plume depends on RealPlume
            ImageSource: "img/plumePreviews/RP_Hypergolic_Vernier.webp",
            get ImageLabel (): string { return this.PlumeName },
            PlumeMod: "RealPlume",
            get PlumeEffectName (): string { return this.PlumeID }
        }, {
            PlumeID: "Ion-Argon-Gridded",
            PlumeName: "Ion Argon (Gridded)",
            Scale: 1.2,
            PositionOffset: 0.0, //mu offset
            FinalOffset: 0.0,
            EnergyMultiplier: 1.0,
            PlumeFiles: [], // No required files. This plume depends on RealPlume
            ImageSource: "img/plumePreviews/RP_Ion_Argon_Gridded.webp",
            get ImageLabel (): string { return this.PlumeName },
            PlumeMod: "RealPlume",
            get PlumeEffectName (): string { return this.PlumeID }
        }, {
            PlumeID: "Ion-Krypton-Gridded",
            PlumeName: "Ion Krypton (Gridded)",
            Scale: 1.5,
            PositionOffset: -0.854729, //mu offset
            FinalOffset: 0.0,
            EnergyMultiplier: 1.0,
            PlumeFiles: [], // No required files. This plume depends on RealPlume
            ImageSource: "img/plumePreviews/RP_Ion_Krypton_Gridded.webp",
            get ImageLabel (): string { return this.PlumeName },
            PlumeMod: "RealPlume",
            get PlumeEffectName (): string { return this.PlumeID }
        }, {
            PlumeID: "Ion-Krypton-Hall",
            PlumeName: "Ion Krypton (Hall)",
            Scale: 1.5,
            PositionOffset: -0.015503, //mu offset
            FinalOffset: 0.0,
            EnergyMultiplier: 1.0,
            PlumeFiles: [], // No required files. This plume depends on RealPlume
            ImageSource: "img/plumePreviews/RP_Ion_Krypton_Hall.webp",
            get ImageLabel (): string { return this.PlumeName },
            PlumeMod: "RealPlume",
            get PlumeEffectName (): string { return this.PlumeID }
        }, {
            PlumeID: "Ion-Xenon-Gridded",
            PlumeName: "Ion Xenon (Gridded)",
            Scale: 1.0,
            PositionOffset: 1.0, //mu offset
            FinalOffset: 0.0,
            EnergyMultiplier: 1.0,
            PlumeFiles: [], // No required files. This plume depends on RealPlume
            ImageSource: "img/plumePreviews/RP_Ion_Xenon_Gridded.webp",
            get ImageLabel (): string { return this.PlumeName },
            PlumeMod: "RealPlume",
            get PlumeEffectName (): string { return this.PlumeID }
        }, {
            PlumeID: "Ion-Xenon-Hall",
            PlumeName: "Ion Xenon (Hall)",
            Scale: 1.6,
            PositionOffset: -0.015503, //mu offset
            FinalOffset: 0.0,
            EnergyMultiplier: 1.0,
            PlumeFiles: [], // No required files. This plume depends on RealPlume
            ImageSource: "img/plumePreviews/RP_Ion_Xenon_Hall.webp",
            get ImageLabel (): string { return this.PlumeName },
            PlumeMod: "RealPlume",
            get PlumeEffectName (): string { return this.PlumeID }
        }, {
            PlumeID: "Solid-Lower",
            PlumeName: "Solid Lower",
            Scale: 0.3,
            PositionOffset: -0.002, //mu offset
            FinalOffset: 0.0,
            EnergyMultiplier: 1.0,
            PlumeFiles: [], // No required files. This plume depends on RealPlume
            ImageSource: "img/plumePreviews/RP_Solid_Lower.webp",
            get ImageLabel (): string { return this.PlumeName },
            PlumeMod: "RealPlume",
            get PlumeEffectName (): string { return this.PlumeID }
        }, {
            PlumeID: "Solid-Upper",
            PlumeName: "Solid Upper",
            Scale: 0.3,
            PositionOffset: -0.002, //mu offset
            FinalOffset: 0.0,
            EnergyMultiplier: 1.0,
            PlumeFiles: [], // No required files. This plume depends on RealPlume
            ImageSource: "img/plumePreviews/RP_Solid_Upper.webp",
            get ImageLabel (): string { return this.PlumeName },
            PlumeMod: "RealPlume",
            get PlumeEffectName (): string { return this.PlumeID }
        }, {
            PlumeID: "Solid-Sepmotor",
            PlumeName: "Solid Sepmotor",
            Scale: 3.0,
            PositionOffset: 0.0, //mu offset
            FinalOffset: 0.0,
            EnergyMultiplier: 1.0,
            PlumeFiles: [], // No required files. This plume depends on RealPlume
            ImageSource: "img/plumePreviews/RP_Solid_Sepmotor.webp",
            get ImageLabel (): string { return this.PlumeName },
            PlumeMod: "RealPlume",
            get PlumeEffectName (): string { return this.PlumeID }
        }, {
            PlumeID: "Solid-Vacuum",
            PlumeName: "Solid Vacuum",
            Scale: 1.44,
            PositionOffset: 0.35831, //mu offset
            FinalOffset: 0.0,
            EnergyMultiplier: 1.0,
            PlumeFiles: [], // No required files. This plume depends on RealPlume
            ImageSource: "img/plumePreviews/RP_Solid_Vacuum.webp",
            get ImageLabel (): string { return this.PlumeName },
            PlumeMod: "RealPlume",
            get PlumeEffectName (): string { return this.PlumeID }
        }, {
            PlumeID: "Turbofan",
            PlumeName: "Turbofan",
            Scale: 1.2,
            PositionOffset: -0.41932, //mu offset
            FinalOffset: 0.0,
            EnergyMultiplier: 1.0,
            PlumeFiles: [], // No required files. This plume depends on RealPlume
            ImageSource: "img/plumePreviews/RP_Turbofan.webp",
            get ImageLabel (): string { return this.PlumeName },
            PlumeMod: "RealPlume",
            get PlumeEffectName (): string { return this.PlumeID }
        }, {
            PlumeID: "Turbojet",
            PlumeName: "Turbojet",
            Scale: 1.2,
            PositionOffset: 1.0, //mu offset
            FinalOffset: -0.6,
            EnergyMultiplier: 1.0,
            PlumeFiles: [], // No required files. This plume depends on RealPlume
            ImageSource: "img/plumePreviews/RP_Turbojet.webp",
            get ImageLabel (): string { return this.PlumeName },
            PlumeMod: "RealPlume",
            get PlumeEffectName (): string { return this.PlumeID }
        }, { // Generic Plumes below this point
            PlumeID: "alcolox",
            PlumeName: "Alcolox",
            Scale: 1.0,
            PositionOffset: 0.0,
            FinalOffset: 0.0,
            EnergyMultiplier: 1.0,
            PlumeFiles: [
                "files/GenericPlumes/Assets/alcolox.mu", // Plume .mu
                "files/GenericPlumes/Presets/Flames/alcolox.cfg", // Plume .cfg
                "files/GenericPlumes/Assets/particle.png", // Plume .png
                "files/GenericPlumes/Sounds/loop1.wav", // Plume .wav
            ],
            ImageSource: "img/plumePreviews/GP_Alcolox.webp",
            get ImageLabel (): string { return this.PlumeName },
            PlumeMod: "GenericPlumes",
            get PlumeEffectName (): string { return `${this.PlumeID}Flame` }
        }, {
            PlumeID: "ammonialox",
            PlumeName: "Ammonialox",
            Scale: 1.0,
            PositionOffset: 0.0,
            FinalOffset: 0.0,
            EnergyMultiplier: 1.0,
            PlumeFiles: [
                "files/GenericPlumes/Assets/ammonialox.mu", // Plume .mu
                "files/GenericPlumes/Presets/Flames/ammonialox.cfg", // Plume .cfg
                "files/GenericPlumes/Assets/particle.png", // Plume .png
                "files/GenericPlumes/Sounds/loop1.wav", // Plume .wav
            ],
            ImageSource: "img/plumePreviews/GP_Ammonialox.webp",
            get ImageLabel (): string { return this.PlumeName },
            PlumeMod: "GenericPlumes",
            get PlumeEffectName (): string { return `${this.PlumeID}Flame` }
        }, {
            PlumeID: "hydrogenNTR",
            PlumeName: "Thermal rocket hydrogen exhaust",
            Scale: 1.0,
            PositionOffset: 0.0,
            FinalOffset: 0.0,
            EnergyMultiplier: 1.0,
            PlumeFiles: [
                "files/GenericPlumes/Assets/hydrogenNTR.mu", // Plume .mu
                "files/GenericPlumes/Presets/Flames/hydrogenNTR.cfg", // Plume .cfg
                "files/GenericPlumes/Assets/particleSolid.png", // Plume .png
                "files/GenericPlumes/Sounds/loop3.wav", // Plume .wav
            ],
            ImageSource: "img/plumePreviews/GP_Thermal_Rocket_Hydrogen_Exhaust.webp",
            get ImageLabel (): string { return this.PlumeName },
            PlumeMod: "GenericPlumes",
            get PlumeEffectName (): string { return `${this.PlumeID}Flame` }
        }, {
            PlumeID: "hydrolox",
            PlumeName: "Hydrolox",
            Scale: 1.0,
            PositionOffset: 0.0,
            FinalOffset: 0.0,
            EnergyMultiplier: 1.0,
            PlumeFiles: [
                "files/GenericPlumes/Assets/hydrolox.mu", // Plume .mu
                "files/GenericPlumes/Presets/Flames/hydrolox.cfg", // Plume .cfg
                "files/GenericPlumes/Assets/particleSolid.png", // Plume .png
                "files/GenericPlumes/Sounds/loop1.wav", // Plume .wav
            ],
            ImageSource: "img/plumePreviews/GP_Hydrolox.webp",
            get ImageLabel (): string { return this.PlumeName },
            PlumeMod: "GenericPlumes",
            get PlumeEffectName (): string { return `${this.PlumeID}Flame` }
        }, {
            PlumeID: "hydynelox",
            PlumeName: "Hydynelox",
            Scale: 1.0,
            PositionOffset: 0.0,
            FinalOffset: 0.0,
            EnergyMultiplier: 1.0,
            PlumeFiles: [
                "files/GenericPlumes/Assets/hydynelox.mu", // Plume .mu
                "files/GenericPlumes/Presets/Flames/hydynelox.cfg", // Plume .cfg
                "files/GenericPlumes/Assets/particle.png", // Plume .png
                "files/GenericPlumes/Sounds/loop1.wav", // Plume .wav
            ],
            ImageSource: "img/plumePreviews/GP_Hydynelox.webp",
            get ImageLabel (): string { return this.PlumeName },
            PlumeMod: "GenericPlumes",
            get PlumeEffectName (): string { return `${this.PlumeID}Flame` }
        }, {
            PlumeID: "hypergolic",
            PlumeName: "Hypergolic",
            Scale: 1.0,
            PositionOffset: 0.0,
            FinalOffset: 0.0,
            EnergyMultiplier: 1.0,
            PlumeFiles: [
                "files/GenericPlumes/Assets/hypergolic.mu", // Plume .mu
                "files/GenericPlumes/Presets/Flames/hypergolic.cfg", // Plume .cfg
                "files/GenericPlumes/Assets/particleSolid.png", // Plume .png
                "files/GenericPlumes/Sounds/loop1.wav", // Plume .wav
            ],
            ImageSource: "img/plumePreviews/GP_Hypergolic.webp",
            get ImageLabel (): string { return this.PlumeName },
            PlumeMod: "GenericPlumes",
            get PlumeEffectName (): string { return `${this.PlumeID}Flame` }
        }, {
            PlumeID: "ionArgon",
            PlumeName: "Ion Argon",
            Scale: 1.0,
            PositionOffset: 0.0,
            FinalOffset: 0.0,
            EnergyMultiplier: 1.0,
            PlumeFiles: [
                "files/GenericPlumes/Assets/ionArgon.mu", // Plume .mu
                "files/GenericPlumes/Presets/Flames/ionArgon.cfg", // Plume .cfg
                "files/GenericPlumes/Assets/particleSolid.png", // Plume .png
                "files/GenericPlumes/Sounds/loop3.wav", // Plume .wav
            ],
            ImageSource: "img/plumePreviews/GP_Ion_Argon.webp",
            get ImageLabel (): string { return this.PlumeName },
            PlumeMod: "GenericPlumes",
            get PlumeEffectName (): string { return `${this.PlumeID}Flame` }
        }, {
            PlumeID: "ionKrypton",
            PlumeName: "Ion Krypton",
            Scale: 1.0,
            PositionOffset: 0.0,
            FinalOffset: 0.0,
            EnergyMultiplier: 1.0,
            PlumeFiles: [
                "files/GenericPlumes/Assets/ionKrypton.mu", // Plume .mu
                "files/GenericPlumes/Presets/Flames/ionKrypton.cfg", // Plume .cfg
                "files/GenericPlumes/Assets/particleSolid.png", // Plume .png
                "files/GenericPlumes/Sounds/loop3.wav", // Plume .wav
            ],
            ImageSource: "img/plumePreviews/GP_Ion_Krypton.webp",
            get ImageLabel (): string { return this.PlumeName },
            PlumeMod: "GenericPlumes",
            get PlumeEffectName (): string { return `${this.PlumeID}Flame` }
        }, {
            PlumeID: "ionXenon",
            PlumeName: "Ion Xenon",
            Scale: 1.0,
            PositionOffset: 0.0,
            FinalOffset: 0.0,
            EnergyMultiplier: 1.0,
            PlumeFiles: [
                "files/GenericPlumes/Assets/ionXenon.mu", // Plume .mu
                "files/GenericPlumes/Presets/Flames/ionXenon.cfg", // Plume .cfg
                "files/GenericPlumes/Assets/particleSolid.png", // Plume .png
                "files/GenericPlumes/Sounds/loop3.wav", // Plume .wav
            ],
            ImageSource: "img/plumePreviews/GP_Ion_Xenon.webp",
            get ImageLabel (): string { return this.PlumeName },
            PlumeMod: "GenericPlumes",
            get PlumeEffectName (): string { return `${this.PlumeID}Flame` }
        }, {
            PlumeID: "kerolox",
            PlumeName: "Kerolox",
            Scale: 1.0,
            PositionOffset: 0.0,
            FinalOffset: 0.0,
            EnergyMultiplier: 1.0,
            PlumeFiles: [
                "files/GenericPlumes/Assets/kerolox.mu", // Plume .mu
                "files/GenericPlumes/Presets/Flames/kerolox.cfg", // Plume .cfg
                "files/GenericPlumes/Assets/particle.png", // Plume .png
                "files/GenericPlumes/Sounds/loop1.wav", // Plume .wav
            ],
            ImageSource: "img/plumePreviews/GP_Kerolox.webp",
            get ImageLabel (): string { return this.PlumeName },
            PlumeMod: "GenericPlumes",
            get PlumeEffectName (): string { return `${this.PlumeID}Flame` }
        }, {
            PlumeID: "methalox",
            PlumeName: "Methalox",
            Scale: 1.0,
            PositionOffset: 0.0,
            FinalOffset: 0.0,
            EnergyMultiplier: 1.0,
            PlumeFiles: [
                "files/GenericPlumes/Assets/methalox.mu", // Plume .mu
                "files/GenericPlumes/Presets/Flames/methalox.cfg", // Plume .cfg
                "files/GenericPlumes/Assets/particle.png", // Plume .png
                "files/GenericPlumes/Sounds/loop1.wav", // Plume .wav
            ],
            ImageSource: "img/plumePreviews/GP_Methalox.webp",
            get ImageLabel (): string { return this.PlumeName },
            PlumeMod: "GenericPlumes",
            get PlumeEffectName (): string { return `${this.PlumeID}Flame` }
        }, {
            PlumeID: "omsRed",
            PlumeName: "OMS Red",
            Scale: 1.0,
            PositionOffset: 0.0,
            FinalOffset: 0.0,
            EnergyMultiplier: 1.0,
            PlumeFiles: [
                "files/GenericPlumes/Assets/omsRed.mu", // Plume .mu
                "files/GenericPlumes/Presets/Flames/omsRed.cfg", // Plume .cfg
                "files/GenericPlumes/Assets/particle.png", // Plume .png
                "files/GenericPlumes/Sounds/loop2.wav", // Plume .wav
            ],
            ImageSource: "img/plumePreviews/GP_OMS_Red.webp",
            get ImageLabel (): string { return this.PlumeName },
            PlumeMod: "GenericPlumes",
            get PlumeEffectName (): string { return `${this.PlumeID}Flame` }
        }, {
            PlumeID: "omsWhite",
            PlumeName: "OMS White",
            Scale: 1.0,
            PositionOffset: 0.0,
            FinalOffset: 0.0,
            EnergyMultiplier: 1.0,
            PlumeFiles: [
                "files/GenericPlumes/Assets/omsWhite.mu", // Plume .mu
                "files/GenericPlumes/Presets/Flames/omsWhite.cfg", // Plume .cfg
                "files/GenericPlumes/Assets/particle.png", // Plume .png
                "files/GenericPlumes/Sounds/loop2.wav", // Plume .wav
            ],
            ImageSource: "img/plumePreviews/GP_OMS_White.webp",
            get ImageLabel (): string { return this.PlumeName },
            PlumeMod: "GenericPlumes",
            get PlumeEffectName (): string { return `${this.PlumeID}Flame` }
        }, {
            PlumeID: "solid",
            PlumeName: "Solid",
            Scale: 1.0,
            PositionOffset: 0.0,
            FinalOffset: 0.0,
            EnergyMultiplier: 1.0,
            PlumeFiles: [
                "files/GenericPlumes/Assets/solid.mu", // Plume .mu
                "files/GenericPlumes/Presets/Flames/solid.cfg", // Plume .cfg
                "files/GenericPlumes/Assets/particle.png", // Plume .png
                "files/GenericPlumes/Sounds/loop4.wav", // Plume .wav
            ],
            ImageSource: "img/plumePreviews/GP_Solid.webp",
            get ImageLabel (): string { return this.PlumeName },
            PlumeMod: "GenericPlumes",
            get PlumeEffectName (): string { return `${this.PlumeID}Flame` }
        }, {
            PlumeID: "turbopumpSmoke",
            PlumeName: "Turbopump Smoke",
            Scale: 1.0,
            PositionOffset: 0.0,
            FinalOffset: 0.0,
            EnergyMultiplier: 1.0,
            PlumeFiles: [
                "files/GenericPlumes/Assets/turbopumpSmoke.mu", // Plume .mu
                "files/GenericPlumes/Presets/Flames/turbopumpSmoke.cfg", // Plume .cfg
                "files/GenericPlumes/Assets/particleRough.png", // Plume .png
                "files/GenericPlumes/Sounds/loop2.wav", // Plume .wav
            ],
            ImageSource: "img/plumePreviews/GP_Turbopump_Smoke.webp",
            get ImageLabel (): string { return this.PlumeName },
            PlumeMod: "GenericPlumes",
            get PlumeEffectName (): string { return `${this.PlumeID}Flame` }
        }
    ];

    public static readonly Dropdown: HTMLSelectElement = PlumeInfo.BuildDropdown();
    private static BuildDropdown (): HTMLSelectElement {
        let output = document.createElement("select");

        PlumeInfo.plumes.forEach((v, i) => {
            let option = document.createElement("option");
            option.value = i.toString();
            option.text = v.PlumeName;

            output.options.add(option);
        });

        return output;
    }

}