interface IModelInfo extends IImageSelectable {
    
    readonly OriginalHeight: number;
    readonly OriginalBellWidth: number;
    readonly OriginalBaseWidth: number;
    readonly PlumeSizeMultiplier: number;
    readonly PlumePositionOffset: number;
    readonly NodeStackTop: number;
    readonly NodeStackBottom: number;
    readonly OriginalTankVolume: number;
    readonly RadialAttachmentPoint: number;
    
    readonly RadialAttachment: boolean;
    readonly CanAttachOnModel: boolean;
    
    readonly ModelFiles: string[];
    readonly ModelPath: string;
    readonly TextureDefinitions: string;
    readonly ThrustTransformName: string;
    readonly GimbalTransformName: string;
    readonly ModelName: string;
    readonly ModelType: EngineGroupType;
    readonly HiddenMuObjects: string[];
    
}