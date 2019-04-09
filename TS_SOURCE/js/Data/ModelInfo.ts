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
            ImageSource: "img/modelPreviews/LR91.jpg",
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
            ImageSource: "img/modelPreviews/AJ10.jpg",
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
            ImageSource: "img/modelPreviews/RS25.jpg",
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
            ImageSource: "img/modelPreviews/Thruster.jpg",
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
            ImageSource: "img/modelPreviews/Aestus.jpg",
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
            ImageSource: "img/modelPreviews/IonThruster.jpg",
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
            ImageSource: "img/modelPreviews/F1.jpg",
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
            ImageSource: "img/modelPreviews/RD0105T.jpg",
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
            ImageSource: "img/modelPreviews/SRBLong.jpg",
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
            ImageSource: "img/modelPreviews/RT5.jpg",
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
            ImageSource: "img/modelPreviews/RT2.jpg",
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
            ImageSource: "img/modelPreviews/S1.jpg",
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
            ImageSource: "img/modelPreviews/RD0105.jpg",
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
            ImageSource: "img/modelPreviews/NERVA.jpg",
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
            ImageSource: "img/modelPreviews/LVT30.jpg",
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
            ImageSource: "img/modelPreviews/LVT45.jpg",
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
            ImageSource: "img/modelPreviews/P1057.jpg",
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
            ImageSource: "img/modelPreviews/OMSL.jpg",
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
            ImageSource: "img/modelPreviews/Poodle.jpg",
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
            ImageSource: "img/modelPreviews/BallNuke.jpg",
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
            ImageSource: "img/modelPreviews/BallNukeS.jpg",
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
            ImageSource: "img/modelPreviews/Skipper.jpg",
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
            ImageSource: "img/modelPreviews/SkipperR.jpg",
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