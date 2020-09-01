interface IPlumeInfo extends IImageSelectable {
    
    readonly Scale: number;
    readonly EnergyMultiplier: number;
    readonly PositionOffset: number;
    readonly FinalOffset: number;
    readonly PlumeID: string; // Config ID
    readonly PlumeName: string; // Displayed name
    
    // Generic Plume additions
    readonly PlumeFiles: string[];
    readonly PlumeMod: "RealPlume" | "GenericPlumes";
    readonly PlumeEffectName: string;
    
}