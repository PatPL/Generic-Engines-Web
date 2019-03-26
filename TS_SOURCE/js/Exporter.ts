class Exporter {
    
    public static ConvertEngineListToConfig (engines: Engine[]): string {
        if (Validator.Validate (engines).length > 0) {
            console.error ("Tried to export a list with errors. Aborting");
            return "";
        }
        
        let output = "";
        let engineDict: { [id: string]: Engine } = {};
        
        engines.forEach (e => {
            engineDict[e.ID] = e;
        });
        
        engines.forEach (e => {
            switch (e.Polymorphism.PolyType) {
                case PolymorphismType.Single:
                case PolymorphismType.MultiModeMaster:
                case PolymorphismType.MultiConfigMaster:
                output += this.RegularEngineConfig (e);
                break;
                
                case PolymorphismType.MultiModeSlave:
                output += this.MultiModeSlaveEngineConfig (e, engineDict[e.Polymorphism.MasterEngineName]);
                break;
                
                case PolymorphismType.MultiConfigSlave:
                output += this.MultiConfigSlaveEngineConfig (e, engineDict[e.Polymorphism.MasterEngineName]);
                break;
            }
        });
        
        return output;
    }
    
    private static RegularEngineConfig (engine: Engine): string {
        let modelInfo = ModelInfo.GetModelInfo (engine.Visuals.ModelID);
        return `
            PART
            {
                name = GE-${engine.ID}
                module = Part
                author = Generic Engines
                
                ${engine.Visuals.GetModelConfig (engine.Dimensions)}

                TechRequired = ${TechNode[engine.TechUnlockNode]}
                entryCost = ${engine.EntryCost}
                cost = ${engine.Cost}
                category = Engine
                subcategory = 0
                title = ${engine.Labels.EngineName == "" ? engine.ID : engine.Labels.EngineName}
                manufacturer = ${engine.Labels.EngineManufacturer}
                description = ${engine.Labels.EngineDescription}
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

                ${engine.Visuals.GetHiddenObjectsConfig ()}

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
                    
                    ${engine.ThrustCurveConfig}
                    
                }

                ${engine.GimbalConfig}

                ${engine.AlternatorConfig}

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

            @PART[${engine.EngineID}]:FOR[RealismOverhaul]
            {
                %RSSROConfig = True
                %RP0conf = True
                
                %breakingForce = 250
                %breakingTorque = 250
                @maxTemp = 573.15
                %skinMaxTemp = 673.15
                %stageOffset = 1
                %childStageOffset = 1
                %stagingIcon = ${engine.StagingIcon}
                @bulkheadProfiles = srf, size3
                @tags = Generic Engine

                ${engine.TankConfig}

                @MODULE[ModuleEngines*]
                {
                    %engineID = PrimaryMode
                    @minThrust = ${(engine.Thrust * engine.MinThrustPercent).Str ()}
                    @maxThrust = ${engine.Thrust.Str ()}
                    @heatProduction = 180
                    @useThrustCurve = ${engine.UsesThrustCurve}
                    %powerEffectName = ${engine.GetPlumeInfo.PlumeID}

                    ${engine.PropellantConfig}

                    @atmosphereCurve
                    {
                        @key,0 = 0 ${engine.VacIsp.Str ()}
                        @key,1 = 1 ${engine.AtmIsp.Str ()}
                    }

                    ${engine.ThrustCurveConfig}

                }

                ${engine.GetModuleEngineConfigs}

                !RESOURCE,*{}
            }

            ${engine.PlumeConfig}

            ${engine.TestFlightConfig}
        `;
    }
    
    private static MultiModeSlaveEngineConfig (engine: Engine, master: Engine): string {
        return "";
    }
    
    private static MultiConfigSlaveEngineConfig (engine: Engine, master: Engine): string {
        return "";
    }
    
}