interface IModelInfo extends IImageSelectable {
    
    /**
     * Engine's height (Most likely NodeStackTop - NodeStackBottom)
     */
    readonly OriginalHeight: number;
    /**
     * Engine's bell width
     */
    readonly OriginalBellWidth: number;
    /**
     * Width of the widest point near the engine base
     */
    readonly OriginalBaseWidth: number;
    /**
     * Plume size (Roughly 0.85 * OriginalBellWidth, tweak if necessary)
     */
    readonly PlumeSizeMultiplier: number;
    /**
     * Thrust vector's Z-axis offset necessary to move it near the middle of the bell
     * 
     * This value is negative - if thrust vector is below the bell, the value is most likely negative
     * (Because you'd need to move the thrust transform along positive-Z to place it in the bell)
     */
    readonly PlumePositionOffset: number;
    /**
     * Z-position of the top stack node
     */
    readonly NodeStackTop: number;
    /**
     * Z-position of the bottom stack node
     */
    readonly NodeStackBottom: number;
    /**
     * Volume of the tank with model's original scale
     * 
     * [How to get this value (Link)](https://camo.githubusercontent.com/1e4ba8a9dab6acf767344d72e353e50627862df1/68747470733a2f2f696d6775722e636f6d2f6c79734a4963792e706e67)
     */
    readonly OriginalTankVolume: number;
    /**
     * How far off center should be this engine's radial attachment node
     * 
     * Should be (~0.5 * OriginalBaseWidth) for a simple cylinder shape
     */
    readonly RadialAttachmentPoint: number;
    /**
     * Makes the engine rotate like an SRB instead of regular engine when placed radially
     * 
     * true if primarly side mounted
     */
    readonly RadialAttachment: boolean;
    /**
     * Can other parts be placed on this part?
     */
    readonly CanAttachOnModel: boolean;
    /**
     * All required files relative to the index.html of the website
     * 
     * example: "files/models/SXT/NERVA/portlyman.mu"
     */
    readonly ModelFiles: string[];
    /**
     * In-GameData path to the model
     * 
     * example: "GenericEngines/models/SXT/NERVA/portlyman"
     */
    readonly ModelPath: string;
    /**
     * Additional texture definitions used if part uses other mod's or stock game's textures
     * 
     * Use backtick \` strings, and separate entries using new line
     * 
     * example: 
     * ```
     * `
     *  texture = model000 , Squad/Parts/Engine/liquidEngineLV-N/model000
     *  texture = model001_NRM , Squad/Parts/Engine/liquidEngineLV-N/model001	
     *  texture = model002 , Squad/Parts/Engine/liquidEngineLV-N/model002
     *  texture = fairing , Squad/Parts/Engine/liquidEngineLV-N/model003
     * `
     * ```
     */
    readonly TextureDefinitions: string;
    /**
     * Name of the thrust transforms node in model
     */
    readonly ThrustTransformName: string;
    /**
     * Name of the gimbal node in model.
     * 
     * Make sure thrust transform's node is this node's child
     * 
     * Should be the same as ThrustTransformName if there's no usable gimbal
     */
    readonly GimbalTransformName: string;
    /**
     * Name of the model visible on website
     */
    readonly ModelName: string;
    /**
     * Legacy metadata
     */
    readonly ModelType: EngineGroupType;
    /**
     * Names of nodes that will be hidden in game
     */
    readonly HiddenMuObjects: string[];
    /**
     * Array of [targetName, rotatorsName] in CONSTRAINLOOKFX elements in FXModuleLookAtConstraint
     */
    readonly LookatPairs: [string, string][];
    /**
     * Names of heat animation clips on the model.
     * 
     * Use this to get the clip names: https://patpl.github.io/muTS/animations.html
     */
    readonly HeatAnimations: string[];
    /**
     * Object with data about model's exhaust for gas generator exhaust, and verniers
     */
    readonly Exhaust?: IExhaustInfo;
    
}

interface IExhaustInfo {
    
}