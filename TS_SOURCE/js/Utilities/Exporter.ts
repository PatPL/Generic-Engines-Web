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
        
        return Exporter.CompactConfig (output);
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
    
    private static RegularEngineConfig (engine: Engine, allEngines: { [id: string]: Engine }): string {
        let modelInfo = ModelInfo.GetModelInfo (engine.ModelID);
        return `
            PART
            {
                name = GE-${engine.ID}
                module = Part
                author = Generic Engines
                
                ${engine.GetModelConfig ()}

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
                maxTemp = 2200 // = 3600
                bulkheadProfiles = size1
                tags = REP

                MODULE
                {
                    name = GenericEnginesPlumeScaleFixer
                }

                ${engine.GetHiddenObjectsConfig ()}

                MODULE
                {
                    name = ModuleEngines
                    thrustVectorTransformName = thrustTransform
                    exhaustDamage = True
                    allowShutdown = ${engine.EngineVariant != EngineType.Solid}
                    useEngineResponseTime = ${engine.EngineVariant != EngineType.Solid}
                    throttleLocked = ${engine.EngineVariant == EngineType.Solid}
                    ignitionThreshold = 0.1
                    minThrust = 0
                    maxThrust = 610
                    heatProduction = 200
                    EngineType = ${engine.EngineTypeConfig ()}
                    useThrustCurve = ${engine.ThrustCurve.length > 0}
                    exhaustDamageDistanceOffset = 0.79

                    atmosphereCurve
                    {
                        key = 0 345
                        key = 1 204
                        key = 6 0.001
                    }
                    
                    ${engine.GetThrustCurveConfig ()}
                    
                }

                ${engine.GetGimbalConfig ()}

                ${engine.GetAlternatorConfig ()}

                MODULE
                {
                    name = ModuleSurfaceFX
                    thrustProviderModuleIndex = 0
                    fxMax = 0.5
                    maxDistance = 30
                    falloff = 1.7
                    thrustTransformName = thrustTransform
                }
            }

            @PART[GE-${engine.ID}]:FOR[RealismOverhaul]
            {
                %RSSROConfig = True
                %RP0conf = True
                
                %breakingForce = 250
                %breakingTorque = 250
                @maxTemp = 573.15
                %skinMaxTemp = 673.15
                %stageOffset = 1
                %childStageOffset = 1
                %stagingIcon = ${engine.StagingIconConfig ()}
                @bulkheadProfiles = srf, size3
                @tags = Generic Engine

                ${engine.GetTankConfig ()}

                @MODULE[ModuleEngines*]
                {
                    %engineID = PrimaryMode
                    @minThrust = ${engine.Thrust * engine.MinThrust / 100}
                    @maxThrust = ${engine.Thrust}
                    @heatProduction = 180
                    @useThrustCurve = ${engine.ThrustCurve.length > 0}
                    %powerEffectName = ${PlumeInfo.GetPlumeInfo (engine.PlumeID).PlumeID}

                    ${engine.GetPropellantConfig ()}

                    @atmosphereCurve
                    {
                        @key,0 = 0 ${engine.VacIsp}
                        @key,1 = 1 ${engine.AtmIsp}
                    }

                    ${engine.GetThrustCurveConfig ()}

                }

                ${engine.GetEngineModuleConfig (allEngines)}

                !RESOURCE,*{}
            }

            ${engine.GetPlumeConfig ()}

            ${engine.GetTestFlightConfig ()}
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
                +MODULE[ModuleEngines*]
                {
                    @engineID = SecondaryMode
                    @minThrust = ${engine.Thrust * engine.MinThrust / 100}
                    @maxThrust = ${engine.Thrust}
                    @heatProduction = 180
                    @useThrustCurve = ${engine.ThrustCurve.length > 0}
                    %powerEffectName = ${PlumeInfo.GetPlumeInfo (engine.PlumeID).PlumeID}

                    !PROPELLANT,*
                    {
                    }

                    ${engine.GetPropellantConfig ()}

                    @atmosphereCurve
                    {
                        @key,0 = 0 ${engine.VacIsp}
                        @key,1 = 1 ${engine.AtmIsp}
                    }

                    ${engine.GetThrustCurveConfig ()}

                }
            }

            ${engine.GetPlumeConfig ()}
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
    
}