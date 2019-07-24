class Exporter {
    
    public static ConvertEngineListToConfig (engines: Engine[]): string {
        if (Validator.Validate (engines).length > 0) {
            console.error ("Tried to export a list with errors. Aborting");
            return "";
        }
        
        let output = "";
        let engineDict: { [id: string]: Engine } = {};
        
        engines.forEach (e => {
            if (!e.Active) {
                return;
            }
            
            engineDict[e.ID] = e;
        });
        
        engines.forEach (e => {
            if (!e.Active) {
                return;
            }
            
            switch (e.PolyType) {
                case PolymorphismType.Single:
                case PolymorphismType.MultiModeMaster:
                case PolymorphismType.MultiConfigMaster:
                output += this.RegularEngineConfig (e, engineDict);
                break;
                
                case PolymorphismType.MultiModeSlave:
                output += this.MultiModeSlaveEngineConfig (e, engineDict);
                break;
                
                case PolymorphismType.MultiConfigSlave:
                output += this.MultiConfigSlaveEngineConfig (e, engineDict);
                break;
            }
        });
        
        output = Exporter.CompactConfig (output);
        
        if (Settings.prettify_config) {
            output = Exporter.PrettifyConfig (output);
        }
        
        return output;
    }
    
    public static CompactConfig (input: string): string {
        let output = "";
        let lines = input.split ("\n");
        
        lines.forEach (l => {
            let tmp = l.trim ();
            
            if (tmp != "") {
                output += `${tmp}\n`;
            }
        });
        
        return output;
    }
    
    public static PrettifyConfig (input: string): string {
        let output = "";
        let lines = input.split ("\n");
        let tabCount = 0;
        
        lines.forEach (l => {
            // Remove tabs before 
            let closeBracketCount = (l.match (/}/g) || []).length;
            tabCount -= closeBracketCount;
            
            // Add opening tabs if there is a closing tab to make it work well with a line like this:
            // !RESOURCE,*{}
            if (closeBracketCount > 0) {
                tabCount += (l.match (/{/g) || []).length;
            }
            
            // Add the parsed line, with tabs
            output += `${ "\t".repeat (tabCount) }${ l }\n`;
            
            if (closeBracketCount > 0) {
                // Add an empty line after a closing bracket
                output += `${ "\t".repeat (tabCount) }\n`;
            } else {
                // Now add new tabs of there were no closing braces
                tabCount += (l.match (/{/g) || []).length;
            }
        });
        
        return output;
    }
    
    private static RegularEngineConfig (engine: Engine, allEngines: { [id: string]: Engine }): string {
        let modelInfo = ModelInfo.GetModelInfo (engine.GetModelID ());
        return `
            PART
            {
                name = GE-${engine.ID}
                module = Part
                author = Generic Engines
                
                ${engine.GetModelConfig ()}
                
                RSSROConfig = True
                RP0conf = True
                breakingForce = 250
                breakingTorque = 250
                stageOffset = 1
                childStageOffset = 1
                TechRequired = ${TechNode[engine.TechUnlockNode]}
                entryCost = ${engine.EntryCost}
                cost = ${engine.Cost}
                category = Engine
                subcategory = 0
                title = ${engine.EngineName == "" ? engine.ID : engine.EngineName}
                manufacturer = ${engine.EngineManufacturer}
                description = ${engine.EngineDescription}
                attachRules = 1,1,1,${modelInfo.CanAttachOnModel ? 1 : 0},0
                mass = ${engine.Mass}
                heatConductivity = 0.06
                skinInternalConductionMult = 4.0
                emissiveConstant = 0.8
                dragModelType = default
                maximum_drag = 0.2
                minimum_drag = 0.2
                angularDrag = 2
                crashTolerance = 12
                maxTemp = 573.15
                skinMaxTemp = 673.15
                bulkheadProfiles = srf, size3
                tags = Generic Engine
                stagingIcon = ${engine.StagingIconConfig ()}
                
                MODULE
                {
                    name = GenericEnginesPlumeScaleFixer
                }
                
                ${engine.GetHiddenObjectsConfig ()}
                
                ${engine.GetGimbalConfig ()}
                
                MODULE
                {
                    name = ModuleEnginesFX
                    engineID = PrimaryMode
                    thrustVectorTransformName = ${modelInfo.ThrustTransformName}
                    exhaustDamage = True
                    allowShutdown = ${engine.EngineVariant != EngineType.Solid}
                    useEngineResponseTime = ${engine.EngineVariant != EngineType.Solid}
                    throttleLocked = ${engine.EngineVariant == EngineType.Solid}
                    ignitionThreshold = 0.1
                    minThrust = ${engine.Thrust * engine.MinThrust / 100}
                    maxThrust = ${engine.Thrust}
                    heatProduction = 180
                    EngineType = ${engine.EngineTypeConfig ()}
                    exhaustDamageDistanceOffset = 0.79
                    useThrustCurve = ${engine.ThrustCurve.length > 0}
                    
                    ${engine.GetPropellantConfig ()}
                    
                    atmosphereCurve
                    {
                        key = 0 ${engine.VacIsp}
                        key = 1 ${engine.AtmIsp}
                    }
                    
                    ${engine.GetThrustCurveConfig ()}
                    
                }
                
                ${engine.GetTankConfig ()}
                !RESOURCE,*{}
                
                ${engine.GetAlternatorConfig ()}
                
                MODULE
                {
                    name = ModuleSurfaceFX
                    thrustProviderModuleIndex = 0
                    fxMax = 0.5
                    maxDistance = 30
                    falloff = 1.7
                    thrustTransformName = ${modelInfo.ThrustTransformName}
                }
            }
            
            @PART[GE-${engine.ID}]:FOR[RealismOverhaul] {
                ${engine.GetEngineModuleConfig (allEngines)}
            }

            ${engine.GetPlumeConfig ()}

            ${engine.GetTestFlightConfig ()}
        `;
    }
    
    private static MultiConfigSlaveEngineConfig (engine: Engine, allEngines: { [id: string]: Engine }): string {
        return `
            @PART[GE-${engine.MasterEngineName}]:FOR[RealismOverhaul]
            {
                @MODULE[ModuleEngineConfigs]
                {
                    ${engine.GetEngineConfig (allEngines)}
                }
            }
            
            ${engine.GetPlumeConfig ()}
            
            ${engine.GetTestFlightConfig ()}
            
            @ENTRYCOSTMODS:FOR[xxxRP-0]
            {
                GE-${engine.ID} = ${engine.EntryCost}
            }
        `;
    }
    
    private static MultiModeSlaveEngineConfig (engine: Engine, allEngines: { [id: string]: Engine }): string {
        return `
            @PART[GE-${engine.MasterEngineName}]
            {
                MODULE
                {
                    name = MultiModeEngine
                    primaryEngineID = PrimaryMode
                    primaryEngineModeDisplayName = Primary mode (GE-${engine.MasterEngineName})
                    secondaryEngineID = SecondaryMode
                    secondaryEngineModeDisplayName = Secondary mode (GE-${engine.ID})
                }
            }
            
            @PART[GE-${engine.MasterEngineName}]:FOR[RealismOverhaul]
            {
                +MODULE[ModuleEnginesFX]
                {
                    @engineID = SecondaryMode
                    @minThrust = ${engine.Thrust * engine.MinThrust / 100}
                    @maxThrust = ${engine.Thrust}
                    @useThrustCurve = ${engine.ThrustCurve.length > 0}
                    %powerEffectName = ${PlumeInfo.GetPlumeInfo (engine.PlumeID).PlumeEffectName}
                    
                    !PROPELLANT,*{}
                    
                    ${engine.GetPropellantConfig ()}
                    
                    @atmosphereCurve
                    {
                        @key,0 = 0 ${engine.VacIsp}
                        @key,1 = 1 ${engine.AtmIsp}
                    }
                    
                    !curveResource
                    !thrustCurve
                    ${engine.GetThrustCurveConfig ()}
                    
                }
            }

            ${engine.GetPlumeConfig ()}
        `;
    }
    
}