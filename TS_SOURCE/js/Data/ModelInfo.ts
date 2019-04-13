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
            ModelPath: "GenericEngines/models/SXT/AJ10/model",
            ModelFiles: [
                "files/models/SXT/AJ10/model.mu",
                "files/models/SXT/AJ10/fairing.dds",
                "files/models/SXT/AJ10/model000.dds",
                "files/models/SXT/AJ10/model001.dds"
            ],
            TextureDefinitions: `
                texture = fairing , Squad/Parts/Engine/liquidEngineLV-T45/model002
                texture = model000 , Squad/Parts/Engine/liquidEngineLV-T45/model000
                texture = model001 , Squad/Parts/Engine/liquidEngineLV-T45/model001
            `,
            ThrustTransformName: "thrustTransform",
            GimbalTransformName: "thrustTransform",
            ModelName: "AJ10-142",
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
        }, { //Model.Rhino
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
            ImageSource: "img/modelPreviews/Rhino.png",
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
        }, { //Model.AJ10_137
            get OriginalHeight (): number { return this.NodeStackTop - this.NodeStackBottom; },
            OriginalBellWidth: 1.66,
            OriginalBaseWidth: 0.87,
            PlumeSizeMultiplier: 1.45,
            PlumePositionOffset: -0.5,
            NodeStackTop: 0.02,
            NodeStackBottom: -2.44,
            ModelPath: "GenericEngines/models/SSTU/AJ10-137/SC-ENG-AJ10-137",
            ModelFiles: [
                "files/models/SSTU/AJ10-137/SC-ENG-AJ10-137.mu",
                "files/models/SSTU/AJ10-137/SC-ENG-AJ10-137-DIFF.dds",
                "files/models/SSTU/AJ10-137/SC-ENG-AJ10-137-GLOW.dds",
                "files/models/SSTU/AJ10-137/SC-ENG-AJ10-137-NRM.dds"
            ],
            TextureDefinitions: "",
            ThrustTransformName: "AJ10-137-ThrustTransform",
            GimbalTransformName: "AJ10-137-Bell",
            ModelName: "AJ10-137",
            ModelType: EngineGroupType.IRL,
            HiddenMuObjects: [],
            CanAttachOnModel: false,
            OriginalTankVolume: 0,
            RadialAttachment: false,
            RadialAttachmentPoint: 0,
            ImageSource: "img/modelPreviews/AJ10_137.png",
            get ImageLabel(): string { return this.ModelName }
        }, { //Model.AJ10_190
            get OriginalHeight (): number { return this.NodeStackTop - this.NodeStackBottom; },
            OriginalBellWidth: 0.707,
            OriginalBaseWidth: 0.366,
            PlumeSizeMultiplier: 0.61,
            PlumePositionOffset: -0.23,
            NodeStackTop: -0.001,
            NodeStackBottom: -1.25,
            ModelPath: "GenericEngines/models/SSTU/AJ10-190/SC-ENG-AJ10-190",
            ModelFiles: [
                "files/models/SSTU/AJ10-190/SC-ENG-AJ10-190.mu",
                "files/models/SSTU/AJ10-190/SC-ENG-AJ10-190-DIFF.dds",
                "files/models/SSTU/AJ10-190/SC-ENG-AJ10-190-GLOW.dds",
                "files/models/SSTU/AJ10-190/SC-ENG-AJ10-190-NRM.dds"
            ],
            TextureDefinitions: "",
            ThrustTransformName: "AJ10-190-ThrustTransform",
            GimbalTransformName: "AJ10-190-GimbalYRing",
            ModelName: "AJ10-190",
            ModelType: EngineGroupType.IRL,
            HiddenMuObjects: [],
            CanAttachOnModel: false,
            OriginalTankVolume: 0,
            RadialAttachment: false,
            RadialAttachmentPoint: 0,
            ImageSource: "img/modelPreviews/AJ10_190.png",
            get ImageLabel(): string { return this.ModelName }
        }, { //Model.F1
            get OriginalHeight (): number { return this.NodeStackTop - this.NodeStackBottom; },
            OriginalBellWidth: 2.446,
            OriginalBaseWidth: 2.017,
            PlumeSizeMultiplier: 2.1,
            PlumePositionOffset: -0.7,
            NodeStackTop: -0.01,
            NodeStackBottom: -4.1,
            ModelPath: "GenericEngines/models/SSTU/F1/SC-ENG-F1",
            ModelFiles: [
                "files/models/SSTU/F1/SC-ENG-F1.mu",
                "files/models/SSTU/F1/SC-ENG-F1-DIFF.dds",
                "files/models/SSTU/F1/SC-ENG-F1-GLOW.dds",
                "files/models/SSTU/F1/SC-ENG-F1-NRM.dds"
            ],
            TextureDefinitions: "",
            ThrustTransformName: "F1-ThrustTransform",
            GimbalTransformName: "F1-Bell",
            ModelName: "F-1",
            ModelType: EngineGroupType.IRL,
            HiddenMuObjects: [],
            CanAttachOnModel: false,
            OriginalTankVolume: 0,
            RadialAttachment: false,
            RadialAttachmentPoint: 0,
            ImageSource: "img/modelPreviews/F1.png",
            get ImageLabel(): string { return this.ModelName }
        }, { //Model.F1B
            get OriginalHeight (): number { return this.NodeStackTop - this.NodeStackBottom; },
            OriginalBellWidth: 2.165,
            OriginalBaseWidth: 2.007,
            PlumeSizeMultiplier: 1.86,
            PlumePositionOffset: -0.6,
            NodeStackTop: -0.0075,
            NodeStackBottom: -3.25,
            ModelPath: "GenericEngines/models/SSTU/F1B/SC-ENG-F1B",
            ModelFiles: [
                "files/models/SSTU/F1B/SC-ENG-F1B.mu",
                "files/models/SSTU/F1B/SC-ENG-F1B-DIFF.dds",
                "files/models/SSTU/F1B/SC-ENG-F1B-GLOW.dds",
                "files/models/SSTU/F1B/SC-ENG-F1B-NRM.dds"
            ],
            TextureDefinitions: "",
            ThrustTransformName: "F1B-ThrustTransform",
            GimbalTransformName: "F1B-Bell",
            ModelName: "F-1B",
            ModelType: EngineGroupType.IRL,
            HiddenMuObjects: [],
            CanAttachOnModel: false,
            OriginalTankVolume: 0,
            RadialAttachment: false,
            RadialAttachmentPoint: 0,
            ImageSource: "img/modelPreviews/F1B.png",
            get ImageLabel(): string { return this.ModelName }
        }, { //Model.H1
            get OriginalHeight (): number { return this.NodeStackTop - this.NodeStackBottom; },
            OriginalBellWidth: 0.757,
            OriginalBaseWidth: 0.97,
            PlumeSizeMultiplier: 0.66,
            PlumePositionOffset: -0.3,
            NodeStackTop: -0.005,
            NodeStackBottom: -1.68,
            ModelPath: "GenericEngines/models/SSTU/H-1/SC-ENG-H-1",
            ModelFiles: [
                "files/models/SSTU/H-1/SC-ENG-H-1.mu",
                "files/models/SSTU/H-1/SC-ENG-H-1-DIFF.dds",
                "files/models/SSTU/H-1/SC-ENG-H-1-GLOW.dds",
                "files/models/SSTU/H-1/SC-ENG-H-1-NRM.dds"
            ],
            TextureDefinitions: "",
            ThrustTransformName: "H-1-ThrustTransform",
            GimbalTransformName: "H-1-Bell",
            ModelName: "H-1",
            ModelType: EngineGroupType.IRL,
            HiddenMuObjects: [],
            CanAttachOnModel: false,
            OriginalTankVolume: 0,
            RadialAttachment: false,
            RadialAttachmentPoint: 0,
            ImageSource: "img/modelPreviews/H1.png",
            get ImageLabel(): string { return this.ModelName }
        }, { //Model.J2
            get OriginalHeight (): number { return this.NodeStackTop - this.NodeStackBottom; },
            OriginalBellWidth: 1.332,
            OriginalBaseWidth: 0.841,
            PlumeSizeMultiplier: 1.2,
            PlumePositionOffset: -0.42,
            NodeStackTop: -0.01,
            NodeStackBottom: -2.1,
            ModelPath: "GenericEngines/models/SSTU/J-2/SC-ENG-J-2",
            ModelFiles: [
                "files/models/SSTU/J-2/SC-ENG-J-2.mu",
                "files/models/SSTU/J-2/SC-ENG-J-2-DIFF.dds",
                "files/models/SSTU/J-2/SC-ENG-J-2-GLOW.dds",
                "files/models/SSTU/J-2/SC-ENG-J-2-NRM.dds"
            ],
            TextureDefinitions: "",
            ThrustTransformName: "J-2-ThrustTransform",
            GimbalTransformName: "J-2-Bell",
            ModelName: "J-2",
            ModelType: EngineGroupType.IRL,
            HiddenMuObjects: [],
            CanAttachOnModel: false,
            OriginalTankVolume: 0,
            RadialAttachment: false,
            RadialAttachmentPoint: 0,
            ImageSource: "img/modelPreviews/J2.png",
            get ImageLabel(): string { return this.ModelName }
        }, { //Model.J2X
            get OriginalHeight (): number { return this.NodeStackTop - this.NodeStackBottom; },
            OriginalBellWidth: 1.943,
            OriginalBaseWidth: 1.575,
            PlumeSizeMultiplier: 1.75,
            PlumePositionOffset: -0.7,
            NodeStackTop: -0.02,
            NodeStackBottom: -3.22,
            ModelPath: "GenericEngines/models/SSTU/J-2X/SC-ENG-J-2X",
            ModelFiles: [
                "files/models/SSTU/J-2X/SC-ENG-J-2X.mu",
                "files/models/SSTU/J-2X/SC-ENG-J-2X-DIFF.dds",
                "files/models/SSTU/J-2X/SC-ENG-J-2X-GLOW.dds",
                "files/models/SSTU/J-2X/SC-ENG-J-2X-NRM.dds"
            ],
            TextureDefinitions: "",
            ThrustTransformName: "J-2X-ThrustTransform",
            GimbalTransformName: "J-2X-Bell",
            ModelName: "J-2X",
            ModelType: EngineGroupType.IRL,
            HiddenMuObjects: [],
            CanAttachOnModel: false,
            OriginalTankVolume: 0,
            RadialAttachment: false,
            RadialAttachmentPoint: 0,
            ImageSource: "img/modelPreviews/J2X.png",
            get ImageLabel(): string { return this.ModelName }
        }, { //Model.LMAE
            get OriginalHeight (): number { return this.NodeStackTop - this.NodeStackBottom; },
            OriginalBellWidth: 0.512,
            OriginalBaseWidth: 0.303,
            PlumeSizeMultiplier: 0.43,
            PlumePositionOffset: -0.15,
            NodeStackTop: -0.005,
            NodeStackBottom: -0.86,
            ModelPath: "GenericEngines/models/SSTU/LM/SC-ENG-LMAE",
            ModelFiles: [
                "files/models/SSTU/LM/SC-ENG-LMAE.mu",
                "files/models/SSTU/LM/SC-ENG-LM-DIFF.dds",
                "files/models/SSTU/LM/SC-ENG-LM-GLOW.dds",
                "files/models/SSTU/LM/SC-ENG-LM-NRM.dds"
            ],
            TextureDefinitions: "",
            ThrustTransformName: "LMAE-ThrustTransform",
            GimbalTransformName: "LMAE-ThrustTransform",
            ModelName: "Lunar Module Ascent Engine",
            ModelType: EngineGroupType.IRL,
            HiddenMuObjects: [],
            CanAttachOnModel: false,
            OriginalTankVolume: 0,
            RadialAttachment: false,
            RadialAttachmentPoint: 0,
            ImageSource: "img/modelPreviews/LMAE.png",
            get ImageLabel(): string { return this.ModelName }
        }, { //Model.LMDE
            get OriginalHeight (): number { return this.NodeStackTop - this.NodeStackBottom; },
            OriginalBellWidth: 0.904,
            OriginalBaseWidth: 0.612,
            PlumeSizeMultiplier: 0.8,
            PlumePositionOffset: -0.3,
            NodeStackTop: -0.01,
            NodeStackBottom: -1.5,
            ModelPath: "GenericEngines/models/SSTU/LM/SC-ENG-LMDE",
            ModelFiles: [
                "files/models/SSTU/LM/SC-ENG-LMDE.mu",
                "files/models/SSTU/LM/SC-ENG-LM-DIFF.dds",
                "files/models/SSTU/LM/SC-ENG-LM-GLOW.dds",
                "files/models/SSTU/LM/SC-ENG-LM-NRM.dds"
            ],
            TextureDefinitions: "",
            ThrustTransformName: "LMDE-ThrustTransform",
            GimbalTransformName: "LMDE-GimbalFrame",
            ModelName: "Lunar Module Descent Engine",
            ModelType: EngineGroupType.IRL,
            HiddenMuObjects: [],
            CanAttachOnModel: false,
            OriginalTankVolume: 0,
            RadialAttachment: false,
            RadialAttachmentPoint: 0,
            ImageSource: "img/modelPreviews/LMDE.png",
            get ImageLabel(): string { return this.ModelName }
        }, { //Model.Bell8048
            get OriginalHeight (): number { return this.NodeStackTop - this.NodeStackBottom; },
            OriginalBellWidth: 0.412,
            OriginalBaseWidth: 0.838,
            PlumeSizeMultiplier: 0.35,
            PlumePositionOffset: -0.12,
            NodeStackTop: -0.005,
            NodeStackBottom: -1.18,
            ModelPath: "GenericEngines/models/SSTU/LR-81/SC-ENG-LR-81-8048",
            ModelFiles: [
                "files/models/SSTU/LR-81/SC-ENG-LR-81-8048.mu",
                "files/models/SSTU/LR-81/SC-ENG-LR-81-DIFF.dds",
                "files/models/SSTU/LR-81/SC-ENG-LR-81-GLOW.dds",
                "files/models/SSTU/LR-81/SC-ENG-LR-81-NRM.dds"
            ],
            TextureDefinitions: "",
            ThrustTransformName: "LR-81-8048-ThrustTransform",
            GimbalTransformName: "LR-81-8048-Gimbal",
            ModelName: "Bell 8048",
            ModelType: EngineGroupType.IRL,
            HiddenMuObjects: [],
            CanAttachOnModel: false,
            OriginalTankVolume: 0,
            RadialAttachment: false,
            RadialAttachmentPoint: 0,
            ImageSource: "img/modelPreviews/Bell8048.png",
            get ImageLabel(): string { return this.ModelName }
        }, { //Model.Bell8096
            get OriginalHeight (): number { return this.NodeStackTop - this.NodeStackBottom; },
            OriginalBellWidth: 0.611,
            OriginalBaseWidth: 0.838,
            PlumeSizeMultiplier: 0.53,
            PlumePositionOffset: -0.22,
            NodeStackTop: -0.005,
            NodeStackBottom: -1.46,
            ModelPath: "GenericEngines/models/SSTU/LR-81/SC-ENG-LR-81-8096",
            ModelFiles: [
                "files/models/SSTU/LR-81/SC-ENG-LR-81-8096.mu",
                "files/models/SSTU/LR-81/SC-ENG-LR-81-DIFF.dds",
                "files/models/SSTU/LR-81/SC-ENG-LR-81-GLOW.dds",
                "files/models/SSTU/LR-81/SC-ENG-LR-81-NRM.dds"
            ],
            TextureDefinitions: "",
            ThrustTransformName: "LR-81-8096-ThrustTransform",
            GimbalTransformName: "LR-81-8096-Gimbal",
            ModelName: "Bell 8096",
            ModelType: EngineGroupType.IRL,
            HiddenMuObjects: [],
            CanAttachOnModel: false,
            OriginalTankVolume: 0,
            RadialAttachment: false,
            RadialAttachmentPoint: 0,
            ImageSource: "img/modelPreviews/Bell8096.png",
            get ImageLabel(): string { return this.ModelName }
        }, { //Model.Merlin1A
            get OriginalHeight (): number { return this.NodeStackTop - this.NodeStackBottom; },
            OriginalBellWidth: 0.597,
            OriginalBaseWidth: 0.74,
            PlumeSizeMultiplier: 0.53,
            PlumePositionOffset: -0.18,
            NodeStackTop: -0.015,
            NodeStackBottom: -1.3,
            ModelPath: "GenericEngines/models/SSTU/Merlin-1/SC-ENG-Merlin-1A",
            ModelFiles: [
                "files/models/SSTU/Merlin-1/SC-ENG-Merlin-1A.mu",
                "files/models/SSTU/Merlin-1/SC-ENG-Merlin-DIFF.dds",
                "files/models/SSTU/Merlin-1/SC-ENG-Merlin-GLOW.dds",
                "files/models/SSTU/Merlin-1/SC-ENG-Merlin-NRM.dds"
            ],
            TextureDefinitions: "",
            ThrustTransformName: "Merlin-1A-ThrustTransform",
            GimbalTransformName: "Merlin-1A-Bell",
            ModelName: "Merlin 1A",
            ModelType: EngineGroupType.IRL,
            HiddenMuObjects: [],
            CanAttachOnModel: false,
            OriginalTankVolume: 0,
            RadialAttachment: false,
            RadialAttachmentPoint: 0,
            ImageSource: "img/modelPreviews/Merlin1A.png",
            get ImageLabel(): string { return this.ModelName }
        }, { //Model.MerlinB
            get OriginalHeight (): number { return this.NodeStackTop - this.NodeStackBottom; },
            OriginalBellWidth: 0.599,
            OriginalBaseWidth: 0.73,
            PlumeSizeMultiplier: 0.54,
            PlumePositionOffset: -0.18,
            NodeStackTop: -0.015,
            NodeStackBottom: -1.39,
            ModelPath: "GenericEngines/models/SSTU/Merlin-1/SC-ENG-Merlin-1B",
            ModelFiles: [
                "files/models/SSTU/Merlin-1/SC-ENG-Merlin-1B.mu",
                "files/models/SSTU/Merlin-1/SC-ENG-Merlin-DIFF.dds",
                "files/models/SSTU/Merlin-1/SC-ENG-Merlin-GLOW.dds",
                "files/models/SSTU/Merlin-1/SC-ENG-Merlin-NRM.dds"
            ],
            TextureDefinitions: "",
            ThrustTransformName: "Merlin-1B-ThrustTransform",
            GimbalTransformName: "Merlin-1B-Bell",
            ModelName: "Merlin 1B",
            ModelType: EngineGroupType.IRL,
            HiddenMuObjects: [],
            CanAttachOnModel: false,
            OriginalTankVolume: 0,
            RadialAttachment: false,
            RadialAttachmentPoint: 0,
            ImageSource: "img/modelPreviews/Merlin1B.png",
            get ImageLabel(): string { return this.ModelName }
        }, { //Model.Merlin1BV
            get OriginalHeight (): number { return this.NodeStackTop - this.NodeStackBottom; },
            OriginalBellWidth: 1.599,
            OriginalBaseWidth: 0.73,
            PlumeSizeMultiplier: 1.4,
            PlumePositionOffset: -0.66,
            NodeStackTop: -0.015,
            NodeStackBottom: -2.87,
            ModelPath: "GenericEngines/models/SSTU/Merlin-1/SC-ENG-Merlin-1BV",
            ModelFiles: [
                "files/models/SSTU/Merlin-1/SC-ENG-Merlin-1BV.mu",
                "files/models/SSTU/Merlin-1/SC-ENG-Merlin-DIFF.dds",
                "files/models/SSTU/Merlin-1/SC-ENG-Merlin-GLOW.dds",
                "files/models/SSTU/Merlin-1/SC-ENG-Merlin-NRM.dds"
            ],
            TextureDefinitions: "",
            ThrustTransformName: "Merlin-1BV-ThrustTransform",
            GimbalTransformName: "Merlin-1BV-Bell",
            ModelName: "Merlin 1B Vacuum",
            ModelType: EngineGroupType.IRL,
            HiddenMuObjects: [],
            CanAttachOnModel: false,
            OriginalTankVolume: 0,
            RadialAttachment: false,
            RadialAttachmentPoint: 0,
            ImageSource: "img/modelPreviews/Merlin1BV.png",
            get ImageLabel(): string { return this.ModelName }
        }, { //Model.Merlin1D
            get OriginalHeight (): number { return this.NodeStackTop - this.NodeStackBottom; },
            OriginalBellWidth: 0.601,
            OriginalBaseWidth: 0.73,
            PlumeSizeMultiplier: 0.53,
            PlumePositionOffset: -0.2,
            NodeStackTop: -0.015,
            NodeStackBottom: -1.39,
            ModelPath: "GenericEngines/models/SSTU/Merlin-1/SC-ENG-Merlin-1D",
            ModelFiles: [
                "files/models/SSTU/Merlin-1/SC-ENG-Merlin-1D.mu",
                "files/models/SSTU/Merlin-1/SC-ENG-Merlin-DIFF.dds",
                "files/models/SSTU/Merlin-1/SC-ENG-Merlin-GLOW.dds",
                "files/models/SSTU/Merlin-1/SC-ENG-Merlin-NRM.dds"
            ],
            TextureDefinitions: "",
            ThrustTransformName: "Merlin-1D-ThrustTransform",
            GimbalTransformName: "Merlin-1D-Bell",
            ModelName: "Merlin 1D",
            ModelType: EngineGroupType.IRL,
            HiddenMuObjects: [],
            CanAttachOnModel: false,
            OriginalTankVolume: 0,
            RadialAttachment: false,
            RadialAttachmentPoint: 0,
            ImageSource: "img/modelPreviews/Merlin1D.png",
            get ImageLabel(): string { return this.ModelName }
        }, { //Model.Merlin1DV
            get OriginalHeight (): number { return this.NodeStackTop - this.NodeStackBottom; },
            OriginalBellWidth: 1.601,
            OriginalBaseWidth: 0.73,
            PlumeSizeMultiplier: 1.4,
            PlumePositionOffset: -0.5,
            NodeStackTop: -0.015,
            NodeStackBottom: -2.88,
            ModelPath: "GenericEngines/models/SSTU/Merlin-1/SC-ENG-Merlin-1DV",
            ModelFiles: [
                "files/models/SSTU/Merlin-1/SC-ENG-Merlin-1DV.mu",
                "files/models/SSTU/Merlin-1/SC-ENG-Merlin-DIFF.dds",
                "files/models/SSTU/Merlin-1/SC-ENG-Merlin-GLOW.dds",
                "files/models/SSTU/Merlin-1/SC-ENG-Merlin-NRM.dds"
            ],
            TextureDefinitions: "",
            ThrustTransformName: "Merlin-1DV-ThrustTransform",
            GimbalTransformName: "Merlin-1DV-Bell",
            ModelName: "Merlin 1D Vacuum",
            ModelType: EngineGroupType.IRL,
            HiddenMuObjects: [],
            CanAttachOnModel: false,
            OriginalTankVolume: 0,
            RadialAttachment: false,
            RadialAttachmentPoint: 0,
            ImageSource: "img/modelPreviews/Merlin1DV.png",
            get ImageLabel(): string { return this.ModelName }
        }, { //Model.RD107
            get OriginalHeight (): number { return this.NodeStackTop - this.NodeStackBottom; },
            OriginalBellWidth: 0.471,
            OriginalBaseWidth: 1.235,
            PlumeSizeMultiplier: 0.42,
            PlumePositionOffset: -0.145,
            NodeStackTop: -0.0075,
            NodeStackBottom: -1.78,
            ModelPath: "GenericEngines/models/SSTU/RD-107/SC-ENG-RD-107X",
            ModelFiles: [
                "files/models/SSTU/RD-107/SC-ENG-RD-107X.mu",
                "files/models/SSTU/RD-107/SC-ENG-RD-107-DIFF.dds",
                "files/models/SSTU/RD-107/SC-ENG-RD-107-GLOW.dds",
                "files/models/SSTU/RD-107/SC-ENG-RD-107-NRM.dds"
            ],
            TextureDefinitions: "",
            ThrustTransformName: "RD-107X-ThrustTransform",
            GimbalTransformName: "RD-107X-ThrustTransform",
            ModelName: "RD-107",
            ModelType: EngineGroupType.IRL,
            HiddenMuObjects: [],
            CanAttachOnModel: false,
            OriginalTankVolume: 0,
            RadialAttachment: false,
            RadialAttachmentPoint: 0,
            ImageSource: "img/modelPreviews/RD107.png",
            get ImageLabel(): string { return this.ModelName }
        }, { //Model.RD171
            get OriginalHeight (): number { return this.NodeStackTop - this.NodeStackBottom; },
            OriginalBellWidth: 0.964,
            OriginalBaseWidth: 2.49,
            PlumeSizeMultiplier: 0.85,
            PlumePositionOffset: -0.3,
            NodeStackTop: -0.01,
            NodeStackBottom: -2.41,
            ModelPath: "GenericEngines/models/SSTU/RD-180/SC-ENG-RD-171",
            ModelFiles: [
                "files/models/SSTU/RD-180/SC-ENG-RD-171.mu",
                "files/models/SSTU/RD-180/SC-ENG-RD-180-DIFF.dds",
                "files/models/SSTU/RD-180/SC-ENG-RD-180-GLOW.dds",
                "files/models/SSTU/RD-180/SC-ENG-RD-180-NRM.dds"
            ],
            TextureDefinitions: "",
            ThrustTransformName: "RD-171-ThrustTransform",
            GimbalTransformName: "RD-171-GimbalRing",
            ModelName: "RD-171",
            ModelType: EngineGroupType.IRL,
            HiddenMuObjects: [],
            CanAttachOnModel: false,
            OriginalTankVolume: 0,
            RadialAttachment: false,
            RadialAttachmentPoint: 0,
            ImageSource: "img/modelPreviews/RD171.png",
            get ImageLabel(): string { return this.ModelName }
        }, { //Model.RD180
            get OriginalHeight (): number { return this.NodeStackTop - this.NodeStackBottom; },
            OriginalBellWidth: 0.963,
            OriginalBaseWidth: 2.237,
            PlumeSizeMultiplier: 0.85,
            PlumePositionOffset: -0.3,
            NodeStackTop: -0.001,
            NodeStackBottom: -2.41,
            ModelPath: "GenericEngines/models/SSTU/RD-180/SC-ENG-RD-180",
            ModelFiles: [
                "files/models/SSTU/RD-180/SC-ENG-RD-180.mu",
                "files/models/SSTU/RD-180/SC-ENG-RD-180-DIFF.dds",
                "files/models/SSTU/RD-180/SC-ENG-RD-180-GLOW.dds",
                "files/models/SSTU/RD-180/SC-ENG-RD-180-NRM.dds"
            ],
            TextureDefinitions: "",
            ThrustTransformName: "RD-180-ThrustTransform",
            GimbalTransformName: "RD-180-GimbalRing",
            ModelName: "RD-180",
            ModelType: EngineGroupType.IRL,
            HiddenMuObjects: [],
            CanAttachOnModel: false,
            OriginalTankVolume: 0,
            RadialAttachment: false,
            RadialAttachmentPoint: 0,
            ImageSource: "img/modelPreviews/RD180.png",
            get ImageLabel(): string { return this.ModelName }
        }, { //Model.RD181
            get OriginalHeight (): number { return this.NodeStackTop - this.NodeStackBottom; },
            OriginalBellWidth: 0.964,
            OriginalBaseWidth: 1.67,
            PlumeSizeMultiplier: 0.85,
            PlumePositionOffset: -0.27,
            NodeStackTop: -0.001,
            NodeStackBottom: -2.41,
            ModelPath: "GenericEngines/models/SSTU/RD-180/SC-ENG-RD-181",
            ModelFiles: [
                "files/models/SSTU/RD-180/SC-ENG-RD-181.mu",
                "files/models/SSTU/RD-180/SC-ENG-RD-180-DIFF.dds",
                "files/models/SSTU/RD-180/SC-ENG-RD-180-GLOW.dds",
                "files/models/SSTU/RD-180/SC-ENG-RD-180-NRM.dds"
            ],
            TextureDefinitions: "",
            ThrustTransformName: "RD-181-ThrustTransform",
            GimbalTransformName: "RD-181-GimbalRing",
            ModelName: "RD-181",
            ModelType: EngineGroupType.IRL,
            HiddenMuObjects: [],
            CanAttachOnModel: false,
            OriginalTankVolume: 0,
            RadialAttachment: false,
            RadialAttachmentPoint: 0,
            ImageSource: "img/modelPreviews/RD181.png",
            get ImageLabel(): string { return this.ModelName }
        }, { //Model.RL10A3
            get OriginalHeight (): number { return this.NodeStackTop - this.NodeStackBottom; },
            OriginalBellWidth: 0.671,
            OriginalBaseWidth: 0.568,
            PlumeSizeMultiplier: 0.6,
            PlumePositionOffset: -0.145,
            NodeStackTop: -0.005,
            NodeStackBottom: -1.14,
            ModelPath: "GenericEngines/models/SSTU/RL10/SC-ENG-RL10A-3",
            ModelFiles: [
                "files/models/SSTU/RL10/SC-ENG-RL10A-3.mu",
                "files/models/SSTU/RL10/SC-ENG-RL10-DIFF.dds",
                "files/models/SSTU/RL10/SC-ENG-RL10-GLOW.dds",
                "files/models/SSTU/RL10/SC-ENG-RL10-NRM.dds"
            ],
            TextureDefinitions: "",
            ThrustTransformName: "RL10A-3-ThrustTransform",
            GimbalTransformName: "RL10A-3-Bell",
            ModelName: "RL10A-3",
            ModelType: EngineGroupType.IRL,
            HiddenMuObjects: [],
            CanAttachOnModel: false,
            OriginalTankVolume: 0,
            RadialAttachment: false,
            RadialAttachmentPoint: 0,
            ImageSource: "img/modelPreviews/RL10A3.png",
            get ImageLabel(): string { return this.ModelName }
        }, { //Model.RL10A4
            get OriginalHeight (): number { return this.NodeStackTop - this.NodeStackBottom; },
            OriginalBellWidth: 0.798,
            OriginalBaseWidth: 0.568,
            PlumeSizeMultiplier: 0.71,
            PlumePositionOffset: -0.27,
            NodeStackTop: -0.01,
            NodeStackBottom: -1.49,
            ModelPath: "GenericEngines/models/SSTU/RL10/SC-ENG-RL10A-4",
            ModelFiles: [
                "files/models/SSTU/RL10/SC-ENG-RL10A-4.mu",
                "files/models/SSTU/RL10/SC-ENG-RL10-DIFF.dds",
                "files/models/SSTU/RL10/SC-ENG-RL10-GLOW.dds",
                "files/models/SSTU/RL10/SC-ENG-RL10-NRM.dds"
            ],
            TextureDefinitions: "",
            ThrustTransformName: "RL10A-4-ThrustTransform",
            GimbalTransformName: "RL10A-4-Bell",
            ModelName: "RL10A-4",
            ModelType: EngineGroupType.IRL,
            HiddenMuObjects: [],
            CanAttachOnModel: false,
            OriginalTankVolume: 0,
            RadialAttachment: false,
            RadialAttachmentPoint: 0,
            ImageSource: "img/modelPreviews/RL10A4.png",
            get ImageLabel(): string { return this.ModelName }
        }, { //Model.RL10A5
            get OriginalHeight (): number { return this.NodeStackTop - this.NodeStackBottom; },
            OriginalBellWidth: 0.25,
            OriginalBaseWidth: 0.568,
            PlumeSizeMultiplier: 0.22,
            PlumePositionOffset: -0.1,
            NodeStackTop: -0.005,
            NodeStackBottom: -0.75,
            ModelPath: "GenericEngines/models/SSTU/RL10/SC-ENG-RL10A-5",
            ModelFiles: [
                "files/models/SSTU/RL10/SC-ENG-RL10A-5.mu",
                "files/models/SSTU/RL10/SC-ENG-RL10-DIFF.dds",
                "files/models/SSTU/RL10/SC-ENG-RL10-GLOW.dds",
                "files/models/SSTU/RL10/SC-ENG-RL10-NRM.dds"
            ],
            TextureDefinitions: "",
            ThrustTransformName: "RL10A-5-ThrustTransform",
            GimbalTransformName: "RL10A-5-Bell",
            ModelName: "RL10A-5",
            ModelType: EngineGroupType.IRL,
            HiddenMuObjects: [],
            CanAttachOnModel: false,
            OriginalTankVolume: 0,
            RadialAttachment: false,
            RadialAttachmentPoint: 0,
            ImageSource: "img/modelPreviews/RL10A5.png",
            get ImageLabel(): string { return this.ModelName }
        }, { //Model.RL10B2
            get OriginalHeight (): number { return this.NodeStackTop - this.NodeStackBottom; },
            OriginalBellWidth: 1.27,
            OriginalBaseWidth: 0.568,
            PlumeSizeMultiplier: 1.13,
            PlumePositionOffset: -0.5,
            NodeStackTop: -0.005,
            NodeStackBottom: -2.56,
            ModelPath: "GenericEngines/models/SSTU/RL10/SC-ENG-RL10B-2",
            ModelFiles: [
                "files/models/SSTU/RL10/SC-ENG-RL10B-2.mu",
                "files/models/SSTU/RL10/SC-ENG-RL10-DIFF.dds",
                "files/models/SSTU/RL10/SC-ENG-RL10-GLOW.dds",
                "files/models/SSTU/RL10/SC-ENG-RL10-NRM.dds"
            ],
            TextureDefinitions: "",
            ThrustTransformName: "RL10B-2-ThrustTransform",
            GimbalTransformName: "RL10B-2-Bell",
            ModelName: "RL10B-2",
            ModelType: EngineGroupType.IRL,
            HiddenMuObjects: [],
            CanAttachOnModel: false,
            OriginalTankVolume: 0,
            RadialAttachment: false,
            RadialAttachmentPoint: 0,
            ImageSource: "img/modelPreviews/RL10B2.png",
            get ImageLabel(): string { return this.ModelName }
        }, { //Model.RS25_2
            get OriginalHeight (): number { return this.NodeStackTop - this.NodeStackBottom; },
            OriginalBellWidth: 1.569,
            OriginalBaseWidth: 1.373,
            PlumeSizeMultiplier: 1.4,
            PlumePositionOffset: -0.5,
            NodeStackTop: -0.005,
            NodeStackBottom: -2.7,
            ModelPath: "GenericEngines/models/SSTU/RS-25/SC-ENG-RS-25",
            ModelFiles: [
                "files/models/SSTU/RS-25/SC-ENG-RS-25.mu",
                "files/models/SSTU/RS-25/SC-ENG-RS-25-DIFF.dds",
                "files/models/SSTU/RS-25/SC-ENG-RS-25-GLOW.dds",
                "files/models/SSTU/RS-25/SC-ENG-RS-25-NRM.dds"
            ],
            TextureDefinitions: "",
            ThrustTransformName: "RS-25-ThrustTransform",
            GimbalTransformName: "RS-25-Bell",
            ModelName: "RS-25",
            ModelType: EngineGroupType.IRL,
            HiddenMuObjects: [],
            CanAttachOnModel: false,
            OriginalTankVolume: 0,
            RadialAttachment: false,
            RadialAttachmentPoint: 0,
            ImageSource: "img/modelPreviews/RS25_2.png",
            get ImageLabel(): string { return this.ModelName }
        }, { //Model.RS68
            get OriginalHeight (): number { return this.NodeStackTop - this.NodeStackBottom; },
            OriginalBellWidth: 1.61,
            OriginalBaseWidth: 2.272,
            PlumeSizeMultiplier: 1.43,
            PlumePositionOffset: -0.6,
            NodeStackTop: -0.01,
            NodeStackBottom: -3.6,
            ModelPath: "GenericEngines/models/SSTU/RS-68/SC-ENG-RS-68",
            ModelFiles: [
                "files/models/SSTU/RS-68/SC-ENG-RS-68.mu",
                "files/models/SSTU/RS-68/SC-ENG-RS-68-DIFF.dds",
                "files/models/SSTU/RS-68/SC-ENG-RS-68-GLOW.dds",
                "files/models/SSTU/RS-68/SC-ENG-RS-68-NRM.dds"
            ],
            TextureDefinitions: "",
            ThrustTransformName: "RS-68-ThrustTransform",
            GimbalTransformName: "RS-68-Bell",
            ModelName: "RS-68",
            ModelType: EngineGroupType.IRL,
            HiddenMuObjects: [],
            CanAttachOnModel: false,
            OriginalTankVolume: 0,
            RadialAttachment: false,
            RadialAttachmentPoint: 0,
            ImageSource: "img/modelPreviews/RS68.png",
            get ImageLabel(): string { return this.ModelName }
        }, { //Model.SuperDraco
            get OriginalHeight (): number { return this.NodeStackTop - this.NodeStackBottom; },
            OriginalBellWidth: 0.128,
            OriginalBaseWidth: 0.09,
            PlumeSizeMultiplier: 0.11,
            PlumePositionOffset: 0.03,
            NodeStackTop: -0.005,
            NodeStackBottom: -0.365,
            ModelPath: "GenericEngines/models/SSTU/SuperDraco/SC-ENG-SuperDraco",
            ModelFiles: [
                "files/models/SSTU/SuperDraco/SC-ENG-SuperDraco.mu",
                "files/models/SSTU/SuperDraco/SC-ENG-SuperDraco-DIFF.dds",
                "files/models/SSTU/SuperDraco/SC-ENG-SuperDraco-GLOW.png"
            ],
            TextureDefinitions: "",
            ThrustTransformName: "SuperDraco-ThrustTransform",
            GimbalTransformName: "SuperDraco-ThrustTransform",
            ModelName: "SuperDraco",
            ModelType: EngineGroupType.IRL,
            HiddenMuObjects: [],
            CanAttachOnModel: false,
            OriginalTankVolume: 0,
            RadialAttachment: false,
            RadialAttachmentPoint: 0,
            ImageSource: "img/modelPreviews/SuperDraco.png",
            get ImageLabel(): string { return this.ModelName }
        }, { //Model.SuperDracoV
            get OriginalHeight (): number { return this.NodeStackTop - this.NodeStackBottom; },
            OriginalBellWidth: 0.321,
            OriginalBaseWidth: 0.09,
            PlumeSizeMultiplier: 0.29,
            PlumePositionOffset: 0.2,
            NodeStackTop: -0.005,
            NodeStackBottom: -0.615,
            ModelPath: "GenericEngines/models/SSTU/SuperDraco/SC-ENG-SuperDraco-L",
            ModelFiles: [
                "files/models/SSTU/SuperDraco/SC-ENG-SuperDraco-L.mu",
                "files/models/SSTU/SuperDraco/SC-ENG-SuperDraco-DIFF.dds",
                "files/models/SSTU/SuperDraco/SC-ENG-SuperDraco-GLOW.png"
            ],
            TextureDefinitions: "",
            ThrustTransformName: "SuperDraco-L-ThrustTransform",
            GimbalTransformName: "SuperDraco-L-ThrustTransform",
            ModelName: "SuperDraco Vacuum",
            ModelType: EngineGroupType.IRL,
            HiddenMuObjects: [],
            CanAttachOnModel: false,
            OriginalTankVolume: 0,
            RadialAttachment: false,
            RadialAttachmentPoint: 0,
            ImageSource: "img/modelPreviews/SuperDracoV.png",
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