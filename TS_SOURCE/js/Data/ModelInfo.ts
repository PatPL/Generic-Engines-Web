/// <reference path="../Enums/EngineGroupType.ts" />
class ModelInfo {
    
    public static GetModelInfo (id: Model) {
        return ModelInfo.models[id];
    }
    
    private static readonly models: IModelInfo[] = [
        { //Model.LR91
            OriginalHeight: 1.885,
            OriginalBellWidth: 0.9635,
            OriginalBaseWidth: 0.892,
            PlumeSizeMultiplier: 1.0,
            PlumePositionOffset: 0.8,
            NodeStackTop: 0.7215,
            NodeStackBottom: -1.1635,
            ModelPath: "GenericEngines/models/RealismOverhaul/LR-91eng",
            ModelFiles: [
                "files/models/RealismOverhaul/LR-91eng.mu",
                "files/models/RealismOverhaul/LR87diff.dds",
                "files/models/RealismOverhaul/LR87emis.dds"
            ],
            TextureDefinitions: "",
            ThrustTransformName: "thrustTransform",
            GimbalTransformName: "thrustTransform",
            ModelName: "LR-91-AJ-5",
            ModelType: EngineGroupType.IRL,
            HiddenMuObjects: [],
            CanAttachOnModel: false,
            OriginalTankVolume: 0,
            RadialAttachment: false,
            RadialAttachmentPoint: 0,
            ImageSource: "img/modelPreviews/LR91.png",
            get ImageLabel(): string { return this.ModelName }
        }, { //Model.AJ10
            OriginalHeight: 0.654,
            OriginalBellWidth: 0.285,
            OriginalBaseWidth: 0.395,
            PlumeSizeMultiplier: 0.295,
            PlumePositionOffset: -0.09,
            NodeStackTop: 0.33,
            NodeStackBottom: -0.324,
            ModelPath: "GenericEngines/models/SXT/AJ-10/model",
            ModelFiles: [
                "files/models/SXT/AJ-10/model.mu",
                "files/models/SXT/AJ-10/fairing.dds",
                "files/models/SXT/AJ-10/model000.dds",
                "files/models/SXT/AJ-10/model001.dds"
            ],
            TextureDefinitions: `
                texture = fairing , Squad/Parts/Engine/liquidEngineLV-T45/model002
                texture = model000 , Squad/Parts/Engine/liquidEngineLV-T45/model000
                texture = model001 , Squad/Parts/Engine/liquidEngineLV-T45/model001
            `,
            ThrustTransformName: "thrustTransform",
            GimbalTransformName: "thrustTransform",
            ModelName: "AJ-10-142",
            ModelType: EngineGroupType.IRL,
            HiddenMuObjects: [
                "Cylinder_002"
            ],
            CanAttachOnModel: false,
            OriginalTankVolume: 0,
            RadialAttachment: false,
            RadialAttachmentPoint: 0,
            ImageSource: "img/modelPreviews/AJ10.png",
            get ImageLabel(): string { return this.ModelName }
        }, { //Model.RS25
            OriginalHeight: 1.5,
            OriginalBellWidth: 0.865,
            OriginalBaseWidth: 0.989,
            PlumeSizeMultiplier: 0.85,
            PlumePositionOffset: -0.8,
            NodeStackTop: -0.025,
            NodeStackBottom: -1.525,
            ModelPath: "GenericEngines/models/VenStockRevamp/KS-25",
            ModelFiles: [
                "files/models/VenStockRevamp/KS-25.mu",
                "files/models/VenStockRevamp/RCS_CLR.dds",
                "files/models/VenStockRevamp/RCS_NRM.dds",
                "files/models/VenStockRevamp/Size3Engines_CLR.dds",
                "files/models/VenStockRevamp/Size3Engines_LUM.dds"
            ],
            TextureDefinitions: "",
            ThrustTransformName: "thrustTransform",
            GimbalTransformName: "Nozzle",
            ModelName: "RS-25",
            ModelType: EngineGroupType.IRL,
            HiddenMuObjects: [
                "Size2A"
            ],
            CanAttachOnModel: false,
            OriginalTankVolume: 0,
            RadialAttachment: false,
            RadialAttachmentPoint: 0,
            ImageSource: "img/modelPreviews/RS25.png",
            get ImageLabel(): string { return this.ModelName }
        }, { //Model.Thruster
            OriginalHeight: 0.3055,
            OriginalBellWidth: 0.12,
            OriginalBaseWidth: 0.222,
            PlumeSizeMultiplier: 0.11,
            PlumePositionOffset: -0.04,
            NodeStackTop: 0.0495,
            NodeStackBottom: -0.256,
            ModelPath: "GenericEngines/models/VenStockRevamp/LV-1B",
            ModelFiles: [
                "files/models/VenStockRevamp/LV-1B.mu",
                "files/models/VenStockRevamp/SmallEngines_CLR.dds",
                "files/models/VenStockRevamp/SmallEngines_LUM.dds"
            ],
            TextureDefinitions: "",
            ThrustTransformName: "thrustTransform",
            GimbalTransformName: "Gimbal",
            ModelName: "Generic thruster",
            ModelType: EngineGroupType.Fake,
            HiddenMuObjects: [],
            CanAttachOnModel: false,
            OriginalTankVolume: 0,
            RadialAttachment: false,
            RadialAttachmentPoint: 0,
            ImageSource: "img/modelPreviews/Thruster.png",
            get ImageLabel(): string { return this.ModelName }
        }, { //Model.Aestus
            OriginalHeight: 0.393,
            OriginalBellWidth: 0.234,
            OriginalBaseWidth: 0.616,
            PlumeSizeMultiplier: 0.225,
            PlumePositionOffset: -0.06,
            NodeStackTop: 0.0,
            NodeStackBottom: -0.393,
            ModelPath: "GenericEngines/models/VenStockRevamp/48-7S",
            ModelFiles: [
                "files/models/VenStockRevamp/48-7S.mu",
                "files/models/VenStockRevamp/SmallEngines_CLR.dds",
                "files/models/VenStockRevamp/SmallEngines_LUM.dds"
            ],
            TextureDefinitions: "",
            ThrustTransformName: "thrustTransform",
            GimbalTransformName: "Obj_Gimbal",
            ModelName: "Spark",
            ModelType: EngineGroupType.Fake,
            HiddenMuObjects: [
                "Size2A",
                "node_fairing_collider"
            ],
            CanAttachOnModel: false,
            OriginalTankVolume: 0,
            RadialAttachment: false,
            RadialAttachmentPoint: 0,
            ImageSource: "img/modelPreviews/Aestus.png",
            get ImageLabel(): string { return this.ModelName }
        }, { //Model.IonThruster
            OriginalHeight: 0.3935,
            OriginalBellWidth: 0.459,
            OriginalBaseWidth: 0.627,
            PlumeSizeMultiplier: 0.42,
            PlumePositionOffset: 0,
            NodeStackTop: 0.1965,
            NodeStackBottom: -0.197,
            ModelPath: "GenericEngines/models/VenStockRevamp/IonEngine",
            ModelFiles: [
                "files/models/VenStockRevamp/IonEngine.mu",
                "files/models/VenStockRevamp/Ion_CLR.dds",
                "files/models/VenStockRevamp/Ion_LUM.dds"
            ],
            TextureDefinitions: "",
            ThrustTransformName: "thrustTransform",
            GimbalTransformName: "thrustTransform",
            ModelName: "Ion thruster",
            ModelType: EngineGroupType.Ion,
            HiddenMuObjects: [
                "Size1B",
                "fairing"
            ],
            CanAttachOnModel: false,
            OriginalTankVolume: 0,
            RadialAttachment: false,
            RadialAttachmentPoint: 0,
            ImageSource: "img/modelPreviews/IonThruster.png",
            get ImageLabel(): string { return this.ModelName }
        }, { //Model.F1
            OriginalHeight: 4.48,
            OriginalBellWidth: 1.802,
            OriginalBaseWidth: 3.78,
            PlumeSizeMultiplier: 1.6,
            PlumePositionOffset: -0.7,
            NodeStackTop: 1.49,
            NodeStackBottom: -2.99,
            ModelPath: "GenericEngines/models/VenStockRevamp/KR-2L",
            ModelFiles: [
                "files/models/VenStockRevamp/KR-2L.mu",
                "files/models/VenStockRevamp/Size3Engines_CLR.dds",
                "files/models/VenStockRevamp/Size3Engines_LUM.dds"
            ],
            TextureDefinitions: "",
            ThrustTransformName: "thrustTransform",
            GimbalTransformName: "Nozzle",
            ModelName: "Rhino",
            ModelType: EngineGroupType.Fake,
            HiddenMuObjects: [
                "fairing"
            ],
            CanAttachOnModel: false,
            OriginalTankVolume: 0,
            RadialAttachment: false,
            RadialAttachmentPoint: 0,
            ImageSource: "img/modelPreviews/F1.png",
            get ImageLabel(): string { return this.ModelName }
        }, { //Model.RD0105T
            OriginalHeight: 0.727,
            OriginalBellWidth: 0.445,
            OriginalBaseWidth: 0.989,
            PlumeSizeMultiplier: 0.4,
            PlumePositionOffset: -0.12,
            NodeStackTop: 0.195,
            NodeStackBottom: -0.532,
            OriginalTankVolume: 110,
            ModelPath: "GenericEngines/models/VenStockRevamp/LV900",
            ModelFiles: [
                "files/models/VenStockRevamp/LV900.mu",
                "files/models/VenStockRevamp/JebEngines_CLR.dds",
                "files/models/VenStockRevamp/JebEngines_LUM.dds"
            ],
            TextureDefinitions: "",
            ThrustTransformName: "thrustTransform",
            GimbalTransformName: "Obj_Gimbal",
            ModelName: "Beagle",
            ModelType: EngineGroupType.Fake,
            HiddenMuObjects: [
                "Size2B",
                "fairing",
                "Hoses"
            ],
            CanAttachOnModel: false,
            RadialAttachment: false,
            RadialAttachmentPoint: 0,
            ImageSource: "img/modelPreviews/RD0105T.png",
            get ImageLabel(): string { return this.ModelName }
        }, { //Model.SRBLong
            OriginalHeight: 8.018,
            OriginalBellWidth: 1.05265,
            OriginalBaseWidth: 1.276,
            PlumeSizeMultiplier: 1.1,
            PlumePositionOffset: -0.4,
            NodeStackTop: 3.89,
            NodeStackBottom: -4.128,
            RadialAttachmentPoint: 0.639,
            OriginalTankVolume: 6780,
            RadialAttachment: true,
            CanAttachOnModel: true,
            ModelPath: "GenericEngines/models/VenStockRevamp/BACC",
            ModelFiles: [
                "files/models/VenStockRevamp/BACC.mu",
                "files/models/VenStockRevamp/SolidBoosters_CLR.dds",
                "files/models/VenStockRevamp/SolidBoosters_LUM.dds"
            ],
            TextureDefinitions: "",
            ThrustTransformName: "thrustTransform",
            GimbalTransformName: "thrustTransform",
            ModelName: "BACC",
            ModelType: EngineGroupType.SRB,
            HiddenMuObjects: [
                "fairing"
            ],
            ImageSource: "img/modelPreviews/SRBLong.png",
            get ImageLabel(): string { return this.ModelName }
        }, { //Model.RT5
            OriginalHeight: 1.444,
            OriginalBellWidth: 0.773,
            OriginalBaseWidth: 1.003,
            PlumeSizeMultiplier: 0.7,
            PlumePositionOffset: -0.18,
            NodeStackTop: 0.552,
            NodeStackBottom: -0.892,
            RadialAttachmentPoint: 0.503,
            OriginalTankVolume: 528,
            RadialAttachment: true,
            CanAttachOnModel: true,
            ModelPath: "GenericEngines/models/VenStockRevamp/RT5",
            ModelFiles: [
                "files/models/VenStockRevamp/RT5.mu",
                "files/models/VenStockRevamp/SolidBoosters_CLR.dds",
                "files/models/VenStockRevamp/SolidBoosters_LUM.dds"
            ],
            TextureDefinitions: "",
            ThrustTransformName: "thrustTransform",
            GimbalTransformName: "thrustTransform",
            ModelName: "RT-5",
            ModelType: EngineGroupType.SRB,
            HiddenMuObjects: [
                "fairing"
            ],
            ImageSource: "img/modelPreviews/RT5.png",
            get ImageLabel(): string { return this.ModelName }
        }, { //Model.RT2
            OriginalHeight: 3.5,
            OriginalBellWidth: 0.5945,
            OriginalBaseWidth: 0.613,
            PlumeSizeMultiplier: 0.55,
            PlumePositionOffset: -0.16,
            NodeStackTop: 1.8,
            NodeStackBottom: -1.7,
            RadialAttachmentPoint: 0.307,
            OriginalTankVolume: 640,
            RadialAttachment: true,
            CanAttachOnModel: true,
            ModelPath: "GenericEngines/models/VenStockRevamp/RT2",
            ModelFiles: [
                "files/models/VenStockRevamp/RT2.mu",
                "files/models/VenStockRevamp/NewSolidboosters_CLR.dds",
                "files/models/VenStockRevamp/NewSolidboosters_LUM.dds"
            ],
            TextureDefinitions: "",
            ThrustTransformName: "thrustTransform",
            GimbalTransformName: "thrustTransform",
            ModelName: "RT-2",
            ModelType: EngineGroupType.SRB,
            HiddenMuObjects: [],
            ImageSource: "img/modelPreviews/RT2.png",
            get ImageLabel(): string { return this.ModelName }
        }, { //Model.S1
            OriginalHeight: 14.81,
            OriginalBellWidth: 1.043,
            OriginalBaseWidth: 1.183,
            PlumeSizeMultiplier: 1.1,
            PlumePositionOffset: 0.55,
            NodeStackTop: 7.445,
            NodeStackBottom: -7.365,
            RadialAttachmentPoint: 0.595,
            OriginalTankVolume: 11190,
            RadialAttachment: true,
            CanAttachOnModel: true,
            ModelPath: "GenericEngines/models/VenStockRevamp/S1",
            ModelFiles: [
                "files/models/VenStockRevamp/S1.mu",
                "files/models/VenStockRevamp/SolidBoosters_CLR.dds",
                "files/models/VenStockRevamp/SolidBoosters_LUM.dds"
            ],
            TextureDefinitions: "",
            ThrustTransformName: "thrustTransform",
            GimbalTransformName: "thrustTransform", //This model has separate Nozzle object but its origin is in wrong place :(
            ModelName: "S-1",
            ModelType: EngineGroupType.SRB,
            HiddenMuObjects: [],
            ImageSource: "img/modelPreviews/S1.png",
            get ImageLabel(): string { return this.ModelName }
        }, { //Model.RD0105
            OriginalHeight: 0.633,
            OriginalBellWidth: 0.445,
            OriginalBaseWidth: 0.991,
            PlumeSizeMultiplier: 0.4,
            PlumePositionOffset: -0.14,
            NodeStackTop: 0.193,
            NodeStackBottom: -0.44,
            ModelPath: "GenericEngines/models/VenStockRevamp/LV909",
            ModelFiles: [
                "files/models/VenStockRevamp/LV909.mu",
                "files/models/VenStockRevamp/JebEngines_CLR.dds",
                "files/models/VenStockRevamp/JebEngines_LUM.dds"
            ],
            TextureDefinitions: "",
            ThrustTransformName: "thrustTransform",
            GimbalTransformName: "Obj_Gimbal",
            ModelName: "LV-909",
            ModelType: EngineGroupType.Fake,
            HiddenMuObjects: [
                "fairing",
                "Size2B"
            ],
            CanAttachOnModel: false,
            OriginalTankVolume: 0,
            RadialAttachment: false,
            RadialAttachmentPoint: 0,
            ImageSource: "img/modelPreviews/RD0105.png",
            get ImageLabel(): string { return this.ModelName }
        }, { //Model.NERVA
            OriginalHeight: 3.25,
            OriginalBellWidth: 0.996,
            OriginalBaseWidth: 1.245,
            PlumeSizeMultiplier: 0.9,
            PlumePositionOffset: 0.56,
            NodeStackTop: 1.414,
            NodeStackBottom: -1.836,
            ModelPath: "GenericEngines/models/VenStockRevamp/LVN",
            ModelFiles: [
                "files/models/VenStockRevamp/LVN.mu",
                "files/models/VenStockRevamp/JebEngines_CLR.dds",
                "files/models/VenStockRevamp/JebEngines_LUM.dds"
            ],
            TextureDefinitions: "",
            ThrustTransformName: "thrustTransform",
            GimbalTransformName: "thrustTransform",
            ModelName: "NERVA",
            ModelType: EngineGroupType.IRL,
            HiddenMuObjects: [
                "fairingL",
                "fairingR",
                "Size2A"
            ],
            CanAttachOnModel: false,
            OriginalTankVolume: 0,
            RadialAttachment: false,
            RadialAttachmentPoint: 0,
            ImageSource: "img/modelPreviews/NERVA.png",
            get ImageLabel(): string { return this.ModelName }
        }, { //Model.LVT30
            OriginalHeight: 1.574,
            OriginalBellWidth: 0.653,
            OriginalBaseWidth: 1.001,
            PlumeSizeMultiplier: 0.57,
            PlumePositionOffset: -0.1,
            NodeStackTop: 0.774,
            NodeStackBottom: -0.8,
            ModelPath: "GenericEngines/models/VenStockRevamp/LVT30",
            ModelFiles: [
                "files/models/VenStockRevamp/LVT30.mu",
                "files/models/VenStockRevamp/JebEngines_CLR.dds",
                "files/models/VenStockRevamp/JebEngines_LUM.dds"
            ],
            TextureDefinitions: "",
            ThrustTransformName: "thrustTransform",
            GimbalTransformName: "thrustTransform",
            ModelName: "LV-T30",
            ModelType: EngineGroupType.Fake,
            HiddenMuObjects: [
                "fairing",
                "Size2A"
            ],
            CanAttachOnModel: false,
            OriginalTankVolume: 0,
            RadialAttachment: false,
            RadialAttachmentPoint: 0,
            ImageSource: "img/modelPreviews/LVT30.png",
            get ImageLabel(): string { return this.ModelName }
        }, { //Model.LVT45
            OriginalHeight: 1.643,
            OriginalBellWidth: 0.602,
            OriginalBaseWidth: 0.998,
            PlumeSizeMultiplier: 0.53,
            PlumePositionOffset: -0.16,
            NodeStackTop: 0.75,
            NodeStackBottom: -0.893,
            ModelPath: "GenericEngines/models/VenStockRevamp/LVT45",
            ModelFiles: [
                "files/models/VenStockRevamp/LVT45.mu",
                "files/models/VenStockRevamp/JebEngines_CLR.dds",
                "files/models/VenStockRevamp/JebEngines_LUM.dds"
            ],
            TextureDefinitions: "",
            ThrustTransformName: "thrustTransform",
            GimbalTransformName: "Obj_Gimbal",
            ModelName: "LV-T45",
            ModelType: EngineGroupType.Fake,
            HiddenMuObjects: [
                "fairing",
                "Size2A",
                "Cube_006_031_001"
            ],
            CanAttachOnModel: false,
            OriginalTankVolume: 0,
            RadialAttachment: false,
            RadialAttachmentPoint: 0,
            ImageSource: "img/modelPreviews/LVT45.png",
            get ImageLabel(): string { return this.ModelName }
        }, { //Model.P1057
            OriginalHeight: 0.615,
            OriginalBellWidth: 0.226,
            OriginalBaseWidth: 0.584,
            PlumeSizeMultiplier: 0.19,
            PlumePositionOffset: -0.075,
            NodeStackTop: 0.02,
            NodeStackBottom: -0.595,
            ModelPath: "GenericEngines/models/VenStockRevamp/105-7P",
            ModelFiles: [
                "files/models/VenStockRevamp/105-7P.mu",
                "files/models/VenStockRevamp/SmallEngines_CLR.dds",
                "files/models/VenStockRevamp/SmallEngines_LUM.dds"
            ],
            TextureDefinitions: "",
            ThrustTransformName: "thrustTransform",
            GimbalTransformName: "nozzle",
            ModelName: "105-7P",
            ModelType: EngineGroupType.Fake,
            HiddenMuObjects: [
                "Size2A",
                "node_fairing_collider"
            ],
            CanAttachOnModel: false,
            OriginalTankVolume: 0,
            RadialAttachment: false,
            RadialAttachmentPoint: 0,
            ImageSource: "img/modelPreviews/P1057.png",
            get ImageLabel(): string { return this.ModelName }
        }, { //Model.OMSL
            OriginalHeight: 1.228,
            OriginalBellWidth: 0.773,
            OriginalBaseWidth: 0.653,
            PlumeSizeMultiplier: 0.72,
            PlumePositionOffset: -0.3,
            NodeStackTop: -0.012,
            NodeStackBottom: -1.24,
            ModelPath: "GenericEngines/models/VenStockRevamp/OMS-L",
            ModelFiles: [
                "files/models/VenStockRevamp/OMS-L.mu",
                "files/models/VenStockRevamp/RCS_CLR.dds",
                "files/models/VenStockRevamp/RCS_NRM.dds"
            ],
            TextureDefinitions: "",
            ThrustTransformName: "thrustTransform",
            GimbalTransformName: "Nozzle",
            ModelName: "OMS-L",
            ModelType: EngineGroupType.Fake,
            HiddenMuObjects: [],
            CanAttachOnModel: false,
            OriginalTankVolume: 0,
            RadialAttachment: false,
            RadialAttachmentPoint: 0,
            ImageSource: "img/modelPreviews/OMSL.png",
            get ImageLabel(): string { return this.ModelName }
        }, { //Model.Poodle
            OriginalHeight: 1.584,
            OriginalBellWidth: 1.222,
            OriginalBaseWidth: 1.196,
            PlumeSizeMultiplier: 1.12,
            PlumePositionOffset: 0.0,
            NodeStackTop: 0.722,
            NodeStackBottom: -0.862,
            ModelPath: "GenericEngines/models/VenStockRevamp/Poodle",
            ModelFiles: [
                "files/models/VenStockRevamp/Poodle.mu",
                "files/models/VenStockRevamp/RockoMaxEngines_CLR.dds",
                "files/models/VenStockRevamp/RockoMaxEngines_LUM.dds"
            ],
            TextureDefinitions: "",
            ThrustTransformName: "thrustTransform",
            GimbalTransformName: "Obj_Gimbal",
            ModelName: "Poodle",
            ModelType: EngineGroupType.Fake,
            HiddenMuObjects: [
                "Size2B",
                "fairing"
            ],
            CanAttachOnModel: false,
            OriginalTankVolume: 0,
            RadialAttachment: false,
            RadialAttachmentPoint: 0,
            ImageSource: "img/modelPreviews/Poodle.png",
            get ImageLabel(): string { return this.ModelName }
        }, { //Model.BallNuke
            OriginalHeight: 1.868,
            OriginalBellWidth: 0.886,
            OriginalBaseWidth: 2.5,
            PlumeSizeMultiplier: 0.82,
            PlumePositionOffset: -0.4,
            NodeStackTop: 0.0,
            NodeStackBottom: -1.868,
            ModelPath: "GenericEngines/models/VenStockRevamp/PoodleLargeNTR",
            ModelFiles: [
                "files/models/VenStockRevamp/PoodleLargeNTR.mu",
                "files/models/VenStockRevamp/RockoMaxEngines_CLR.dds",
                "files/models/VenStockRevamp/RockoMaxEngines_LUM.dds"
            ],
            TextureDefinitions: "",
            ThrustTransformName: "thrustTransform",
            GimbalTransformName: "thrustTransform",
            ModelName: "Sphere NTR",
            ModelType: EngineGroupType.Fake,
            HiddenMuObjects: [
                "fairing"
            ],
            CanAttachOnModel: false,
            OriginalTankVolume: 0,
            RadialAttachment: false,
            RadialAttachmentPoint: 0,
            ImageSource: "img/modelPreviews/BallNuke.png",
            get ImageLabel(): string { return this.ModelName }
        }, { //Model.BallNukeS
            OriginalHeight: 0.767,
            OriginalBellWidth: 0.407,
            OriginalBaseWidth: 0.585,
            PlumeSizeMultiplier: 0.36,
            PlumePositionOffset: -0.03,
            NodeStackTop: 0.065,
            NodeStackBottom: -0.702,
            ModelPath: "GenericEngines/models/VenStockRevamp/PoodleNTR",
            ModelFiles: [
                "files/models/VenStockRevamp/PoodleNTR.mu",
                "files/models/VenStockRevamp/SmallEngines_CLR.dds",
                "files/models/VenStockRevamp/SmallEngines_LUM.dds"
            ],
            TextureDefinitions: "",
            ThrustTransformName: "thrustTransform",
            GimbalTransformName: "thrustTransform",
            ModelName: "Small Sphere NTR",
            ModelType: EngineGroupType.Fake,
            HiddenMuObjects: [
                "Size1B",
                "fairing"
            ],
            CanAttachOnModel: false,
            OriginalTankVolume: 0,
            RadialAttachment: false,
            RadialAttachmentPoint: 0,
            ImageSource: "img/modelPreviews/BallNukeS.png",
            get ImageLabel(): string { return this.ModelName }
        }, { //Model.Skipper
            OriginalHeight: 3.514,
            OriginalBellWidth: 1.6,
            OriginalBaseWidth: 2.504,
            PlumeSizeMultiplier: 1.45,
            PlumePositionOffset: -0.65,
            NodeStackTop: 1.19,
            NodeStackBottom: -2.324,
            ModelPath: "GenericEngines/models/VenStockRevamp/Size2MedEngineB",
            ModelFiles: [
                "files/models/VenStockRevamp/Size2MedEngineB.mu",
                "files/models/VenStockRevamp/RockoMaxEnginesB_CLR.dds",
                "files/models/VenStockRevamp/RockoMaxEnginesB_LUM.dds"
            ],
            TextureDefinitions: "",
            ThrustTransformName: "thrustTransform",
            GimbalTransformName: "Nozzle",
            ModelName: "Gas Generator",
            ModelType: EngineGroupType.Fake,
            HiddenMuObjects: [
                "fairing"
            ],
            CanAttachOnModel: false,
            OriginalTankVolume: 0,
            RadialAttachment: false,
            RadialAttachmentPoint: 0,
            ImageSource: "img/modelPreviews/Skipper.png",
            get ImageLabel(): string { return this.ModelName }
        }, { //Model.SkipperR
            OriginalHeight: 2.655,
            OriginalBellWidth: 1.415,
            OriginalBaseWidth: 1.225,
            PlumeSizeMultiplier: 1.3,
            PlumePositionOffset: 0.0,
            NodeStackTop: 0.007,
            NodeStackBottom: -2.648,
            ModelPath: "GenericEngines/models/VenStockRevamp/Skipper",
            ModelFiles: [
                "files/models/VenStockRevamp/Skipper.mu",
                "files/models/VenStockRevamp/RockoMaxEngines_CLR.dds",
                "files/models/VenStockRevamp/RockoMaxEngines_LUM.dds"
            ],
            TextureDefinitions: "",
            ThrustTransformName: "thrustTransform",
            GimbalTransformName: "Obj_Gimbal",
            ModelName: "Skipper",
            ModelType: EngineGroupType.Fake,
            HiddenMuObjects: [
                "obj_fairing",
                "Size2A"
            ],
            CanAttachOnModel: false,
            OriginalTankVolume: 0,
            RadialAttachment: false,
            RadialAttachmentPoint: 0,
            ImageSource: "img/modelPreviews/SkipperR.png",
            get ImageLabel(): string { return this.ModelName }
        }, { //Model.NERVA2
            get OriginalHeight (): number { return this.NodeStackTop - this.NodeStackBottom; },
            OriginalBellWidth: 1.96,
            OriginalBaseWidth: 3.73,
            PlumeSizeMultiplier: 1.8,
            PlumePositionOffset: -1,
            NodeStackTop: 0.3,
            NodeStackBottom: -8.06,
            ModelPath: "GenericEngines/models/SXT/NERVA/model",
            ModelFiles: [
                "files/models/SXT/NERVA/model.mu",
                "files/models/SXT/NERVA/fairing.dds",
                "files/models/SXT/NERVA/model000.dds",
                "files/models/SXT/NERVA/model001_NRM.dds",
                "files/models/SXT/NERVA/model002.dds"
            ],
            TextureDefinitions: `
                texture = model000 , Squad/Parts/Engine/liquidEngineLV-N/model000
                texture = model001_NRM , Squad/Parts/Engine/liquidEngineLV-N/model001
                texture = model002 , Squad/Parts/Engine/liquidEngineLV-N/model002
                texture = fairing , Squad/Parts/Engine/liquidEngineLV-N/model003
            `,
            ThrustTransformName: "thrustTransform",
            GimbalTransformName: "thrustTransform",
            ModelName: "NERVA 2",
            ModelType: EngineGroupType.IRL,
            HiddenMuObjects: [
                "fairing"
            ],
            CanAttachOnModel: false,
            OriginalTankVolume: 0,
            RadialAttachment: false,
            RadialAttachmentPoint: 0,
            ImageSource: "img/modelPreviews/NERVA2.png",
            get ImageLabel(): string { return this.ModelName }
        }, { //Model.NERVAwide
            get OriginalHeight (): number { return this.NodeStackTop - this.NodeStackBottom; },
            OriginalBellWidth: 2.074,
            OriginalBaseWidth: 2.895,
            PlumeSizeMultiplier: 1.8,
            PlumePositionOffset: -2,
            NodeStackTop: 0.05,
            NodeStackBottom: -5.74,
            ModelPath: "GenericEngines/models/SXT/NERVA/portlyman",
            ModelFiles: [
                "files/models/SXT/NERVA/portlyman.mu",
                "files/models/SXT/NERVA/fairing.dds",
                "files/models/SXT/NERVA/model000.dds",
                "files/models/SXT/NERVA/model001_NRM.dds",
                "files/models/SXT/NERVA/model002.dds"
            ],
            TextureDefinitions: `
                texture = model000 , Squad/Parts/Engine/liquidEngineLV-N/model000
                texture = model001_NRM , Squad/Parts/Engine/liquidEngineLV-N/model001	
                texture = model002 , Squad/Parts/Engine/liquidEngineLV-N/model002
                texture = fairing , Squad/Parts/Engine/liquidEngineLV-N/model003
            `,
            ThrustTransformName: "thrustTransform",
            GimbalTransformName: "thrustTransform", // No gimbal obj, and the thrust transform is below the engine, so gimballing makes the plume's origin change. :/
            ModelName: "NERVA wide",
            ModelType: EngineGroupType.Fake,
            HiddenMuObjects: [
                "fairing"
            ],
            CanAttachOnModel: false,
            OriginalTankVolume: 0,
            RadialAttachment: false,
            RadialAttachmentPoint: 0,
            ImageSource: "img/modelPreviews/NERVAwide.png",
            get ImageLabel(): string { return this.ModelName }
        }, { //Model.Pancake
            get OriginalHeight (): number { return this.NodeStackTop - this.NodeStackBottom; },
            OriginalBellWidth: 0.5,
            OriginalBaseWidth: 2,
            PlumeSizeMultiplier: 0.43,
            PlumePositionOffset: 0.13,
            NodeStackTop: 0,
            NodeStackBottom: -0.288,
            ModelPath: "GenericEngines/models/SXT/Kopo4e/model",
            ModelFiles: [
                "files/models/SXT/Kopo4e/model.mu",
                "files/models/SXT/Kopo4e/model000.dds",
                "files/models/SXT/Kopo4e/model002.dds"
            ],
            TextureDefinitions: `
                texture = model000 , Squad/Parts/Engine/liquidEngineSkipper/ksp_l_midrangeEngine_diff
                texture = model002 , Squad/Parts/Engine/liquidEngineSkipper/ksp_l_midrangeEngine_emissive
            `,
            ThrustTransformName: "thrustTransform",
            GimbalTransformName: "obj_gimbal",
            ModelName: "Pancake",
            ModelType: EngineGroupType.Fake,
            HiddenMuObjects: [],
            CanAttachOnModel: true,
            OriginalTankVolume: 0,
            RadialAttachment: false,
            RadialAttachmentPoint: 0,
            ImageSource: "img/modelPreviews/Pancake.png",
            get ImageLabel(): string { return this.ModelName }
        }, { //Model.RT3
            get OriginalHeight (): number { return this.NodeStackTop - this.NodeStackBottom; },
            OriginalBellWidth: 0.512, // The nozzle on the model is not centered, this is an approximation
                                      // https://github.com/linuxgurugamer/SXTContinued/issues/68
            OriginalBaseWidth: 1.25,
            PlumeSizeMultiplier: 0.44,
            PlumePositionOffset: 0.4,
            NodeStackTop: 0.594,
            NodeStackBottom: -0.75,
            ModelPath: "GenericEngines/models/SXT/KickMotor/model",
            ModelFiles: [
                "files/models/SXT/KickMotor/model.mu",
                "files/models/SXT/KickMotor/model000.dds",
                "files/models/SXT/KickMotor/model001.dds",
                "files/models/SXT/KickMotor/model002.dds"
            ],
            TextureDefinitions: `
                texture = model000 , Squad/Parts/Engine/solidBoosterBACC/model000
                texture = model002 , Squad/Parts/Engine/solidBoosterBACC/model002
            `,
            ThrustTransformName: "thrustTransform",
            GimbalTransformName: "thrustTransform",
            ModelName: "RT-3",
            ModelType: EngineGroupType.Fake,
            HiddenMuObjects: [
                "solidBooster2_001"
            ],
            CanAttachOnModel: true,
            OriginalTankVolume: 607,
            RadialAttachment: true,
            RadialAttachmentPoint: 0.625,
            ImageSource: "img/modelPreviews/RT3.png",
            get ImageLabel(): string { return this.ModelName }
        }, { //Model.RD170
            get OriginalHeight (): number { return this.NodeStackTop - this.NodeStackBottom; },
            OriginalBellWidth: 1.517,
            OriginalBaseWidth: 3.74,
            PlumeSizeMultiplier: 1.33,
            PlumePositionOffset: -0.25,
            NodeStackTop: 0.1,
            NodeStackBottom: -3.54,
            ModelPath: "GenericEngines/models/SXT/K170/model",
            ModelFiles: [
                "files/models/SXT/K170/model.mu",
                "files/models/SXT/K170/model000.dds",
                "files/models/SXT/K170/model001_NRM.dds",
                "files/models/SXT/K170/model002.dds"
            ],
            TextureDefinitions: `
                texture = model000 , Squad/Parts/Engine/liquidEngineSkipper/ksp_l_midrangeEngine_diff
                texture = model001_NRM , Squad/Parts/Engine/liquidEngineSkipper/ksp_l_midrangeEngine_normal
                texture = model002 , Squad/Parts/Engine/liquidEngineSkipper/ksp_l_midrangeEngine_emissive
            `,
            ThrustTransformName: "thrustTransform",
            GimbalTransformName: "obj_gimbal",
            ModelName: "RD-170",
            ModelType: EngineGroupType.IRL,
            HiddenMuObjects: [],
            CanAttachOnModel: false,
            OriginalTankVolume: 0,
            RadialAttachment: false,
            RadialAttachmentPoint: 0,
            ImageSource: "img/modelPreviews/RD170.png",
            get ImageLabel(): string { return this.ModelName }
        }, { //Model.RD0120
            get OriginalHeight (): number { return this.NodeStackTop - this.NodeStackBottom; },
            OriginalBellWidth: 1.671,
            OriginalBaseWidth: 2.548, // Off center -> https://github.com/linuxgurugamer/SXTContinued/issues/68
            PlumeSizeMultiplier: 1.45,
            PlumePositionOffset: -0.4,
            NodeStackTop: 0.7,
            NodeStackBottom: -1.92,
            ModelPath: "GenericEngines/models/SXT/K170/model25m",
            ModelFiles: [
                "files/models/SXT/K170/model25m.mu",
                "files/models/SXT/K170/fairing.dds",
                "files/models/SXT/K170/model000.dds",
                "files/models/SXT/K170/model001_NRM.dds",
                "files/models/SXT/K170/model002.dds"
            ],
            TextureDefinitions: `
                texture = model000 , Squad/Parts/Engine/liquidEngineSkipper/ksp_l_midrangeEngine_diff
                texture = model001_NRM , Squad/Parts/Engine/liquidEngineSkipper/ksp_l_midrangeEngine_normal
                texture = model002 , Squad/Parts/Engine/liquidEngineSkipper/ksp_l_midrangeEngine_emissive
                texture = fairing , Squad/Parts/Engine/liquidEngineLV-T45/model002
            `,
            ThrustTransformName: "thrustTransform",
            GimbalTransformName: "obj_gimbal",
            ModelName: "RD-0120 (Shroud)",
            ModelType: EngineGroupType.IRL,
            HiddenMuObjects: [
                "bottom"
            ],
            CanAttachOnModel: false,
            OriginalTankVolume: 0,
            RadialAttachment: false,
            RadialAttachmentPoint: 0,
            ImageSource: "img/modelPreviews/RD0120.png",
            get ImageLabel(): string { return this.ModelName }
        }, { //Model.Gamma2
            get OriginalHeight (): number { return this.NodeStackTop - this.NodeStackBottom; },
            OriginalBellWidth: 0.143,
            OriginalBaseWidth: 0.361,
            PlumeSizeMultiplier: 0.12,
            PlumePositionOffset: 0, // The bells are pointed outwards, so I'm not sure what to do.
            NodeStackTop: -0.034,
            NodeStackBottom: -0.49,
            ModelPath: "GenericEngines/models/SXT/BlackAdder/gamma2",
            ModelFiles: [
                "files/models/SXT/BlackAdder/gamma2.mu",
                "files/models/SXT/BlackAdder/model000.dds",
                "files/models/SXT/BlackAdder/model001.dds",
                "files/models/SXT/BlackAdder/fairing.dds"
            ],
            TextureDefinitions: `
                texture = model000 , Squad/Parts/Engine/liquidEngineLV-T45/model000
                texture = model001 , Squad/Parts/Engine/liquidEngineLV-T45/model001	
                texture = fairing , Squad/Parts/Engine/liquidEngineLV-T45/model002
            `,
            ThrustTransformName: "thrustTransform",
            GimbalTransformName: "thrustTransform",
            ModelName: "Gamma 2",
            ModelType: EngineGroupType.IRL,
            HiddenMuObjects: [
                "bottom",
                "Cylinder" // Should look OK without the shroud
            ],
            CanAttachOnModel: false,
            OriginalTankVolume: 0,
            RadialAttachment: false,
            RadialAttachmentPoint: 0,
            ImageSource: "img/modelPreviews/Gamma2.png",
            get ImageLabel(): string { return this.ModelName }
        }, { //Model.Gamma8
            get OriginalHeight (): number { return this.NodeStackTop - this.NodeStackBottom; },
            OriginalBellWidth: 0.142,
            OriginalBaseWidth: 1.031,
            PlumeSizeMultiplier: 0.10, // Thrust transform is not in the middle of the bell
            PlumePositionOffset: -0.05,
            NodeStackTop: 0,
            NodeStackBottom: -0.575,
            ModelPath: "GenericEngines/models/SXT/BlackAdder/model",
            ModelFiles: [
                "files/models/SXT/BlackAdder/model.mu",
                "files/models/SXT/BlackAdder/model000.dds",
                "files/models/SXT/BlackAdder/model001.dds"
            ],
            TextureDefinitions: `
                texture = model000 , Squad/Parts/Engine/liquidEngineLV-T45/model000
                texture = model001 , Squad/Parts/Engine/liquidEngineLV-T45/model001	
            `,
            ThrustTransformName: "thrustTransform",
            GimbalTransformName: "thrustTransform",
            ModelName: "Gamma 8",
            ModelType: EngineGroupType.IRL,
            HiddenMuObjects: [],
            CanAttachOnModel: true,
            OriginalTankVolume: 0,
            RadialAttachment: false,
            RadialAttachmentPoint: 0,
            ImageSource: "img/modelPreviews/Gamma8.png",
            get ImageLabel(): string { return this.ModelName }
        }
    ];
    
    public static readonly Dropdown: HTMLSelectElement = ModelInfo.BuildDropdown ();
    private static BuildDropdown (): HTMLSelectElement {
        let output = document.createElement ("select");
        
        let groups: { [id: string]: HTMLOptGroupElement } = {};
        for (let i in EngineGroupType) {
            let group = document.createElement ("optgroup");
            group.label = EngineGroupType[i];
            output.appendChild (group);
            groups[EngineGroupType[i]] = group;
        }
        
        ModelInfo.models.forEach ((v, i) => {
            let option = document.createElement ("option");
            option.value = i.toString ();
            option.text = v.ModelName;
            
            groups[v.ModelType].appendChild (option);
        });
        
        return output;
    }
    
}
/* NEW MODEL TEMPLATE
, { //Model.
    get OriginalHeight (): number { return this.NodeStackTop - this.NodeStackBottom; },
    OriginalBellWidth: ,
    OriginalBaseWidth: ,
    PlumeSizeMultiplier: ,
    PlumePositionOffset: ,
    NodeStackTop: ,
    NodeStackBottom: ,
    ModelPath: "GenericEngines/models/",
    ModelFiles: [
        "files/models/",
        "files/models/",
        "files/models/"
    ],
    TextureDefinitions: "",
    ThrustTransformName: "thrustTransform",
    GimbalTransformName: "",
    ModelName: "",
    ModelType: EngineGroupType.,
    HiddenMuObjects: [
        ""
    ],
    CanAttachOnModel: false,
    OriginalTankVolume: 0,
    RadialAttachment: false,
    RadialAttachmentPoint: 0,
    ImageSource: "img/modelPreviews/.png",
    get ImageLabel(): string { return this.ModelName }
}
*/