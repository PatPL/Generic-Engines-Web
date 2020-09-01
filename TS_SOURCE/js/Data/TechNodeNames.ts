///<reference path="../Enums/TechNode.ts" />
const TechNodeNames: Map<TechNode, string> = new Map<TechNode, string> ([
    [TechNode.start, "Start"],
    [TechNode.supersonicDev, "Supersonic Plane Development"],
    [TechNode.supersonicFlightRP0, "Supersonic Flight"],
    [TechNode.matureSupersonic, "Mature Supersonic Flight"],
    [TechNode.highSpeedFlight, "High Speed Flight"],
    [TechNode.advancedJetEngines, "Advanced Jet Engines"],
    [TechNode.matureTurbofans, "Mature Turbofans"],
    [TechNode.refinedTurbofans, "Refined Turbofans"],
    [TechNode.scramjetEngines, "Scramjet Engines"],
    [TechNode.experimentalAircraft, "Experimental Aircraft Engines"],
    [TechNode.colonization2051Flight, "2051-2099 Regular Flight"],
    [TechNode.colonization2100Flight, "2100-2149 Regular Flight"],
    [TechNode.colonization2150Flight, "2150+ Regular Flight"],
    [TechNode.hypersonicFlightRP0, "Hypersonic Flight"],
    [TechNode.prototypeSpaceplanes, "Prototype Spaceplaces"],
    [TechNode.effectiveSpaceplanes, "Effective Spaceplanes"],
    [TechNode.spaceShuttles, "Space Shuttles"],
    [TechNode.improvedSpaceplanes, "Improved Spaceplanes"],
    [TechNode.advancedSpaceplanes, "Advanced Spaceplanes"],
    [TechNode.highTechSpaceplanes, "High-Tech Spaceplanes"],
    [TechNode.experimentalSpaceplanes, "Experimental Spaceplanes"],
    [TechNode.sstoSpaceplanes, "SSTO Spaceplanes"],
    [TechNode.colonization2100Spaceplanes, "2100-2149 Spaceplanes"],
    [TechNode.colonization2150Spaceplanes, "2150+ Spaceplanes"],
    [TechNode.basicCapsules, "Basic Capsules"],
    [TechNode.secondGenCapsules, "Second Generation Capsules"],
    [TechNode.matureCapsules, "Mature Capsules"],
    [TechNode.improvedCapsules, "Improved Capsules"],
    [TechNode.advancedCapsules, "Advanced Capsules"],
    [TechNode.modernCapsules, "Modern Capsules"],
    [TechNode.capsulesNF, "Near Future Capsules"],
    [TechNode.highTechCapsules, "High-Tech Capsules"],
    [TechNode.colonization2100Command, "2100-2149 Command Modules"],
    [TechNode.colonization2150Command, "2150+ Command Modules"],
    [TechNode.spaceStationPrototypes, "Space Station Prototypes"],
    [TechNode.spaceStationDev, "Space Station Development"],
    [TechNode.earlySpaceStations, "Early Space Stations"],
    [TechNode.modularSpaceStations, "Modular Space Stations"],
    [TechNode.largeScaleOrbitalCon, "Large Scale Orbital Construction"],
    [TechNode.improvedOrbitalConstruction, "Improved Orbital Construction"],
    [TechNode.inflatableHabitats, "Inflatable Habitats"],
    [TechNode.improvedHabitats, "Improved Habitats"],
    [TechNode.advancedHabitats, "Advanced Habitats"],
    [TechNode.largeScaleHabitats, "Large Scale Habitats"],
    [TechNode.colonization2100SpaceStations, "2100-2149 Space Stations"],
    [TechNode.colonization2150SpaceStations, "2150+ Space Stations"],
    [TechNode.earlyFlightControl, "Early Flight Control"],
    [TechNode.stabilityRP0, "Stability"],
    [TechNode.earlyDocking, "Early Docking Procedures"],
    [TechNode.improvedFlightControl, "Improved Flight Control"],
    [TechNode.advancedFlightControl, "Advanced Flight Control"],
    [TechNode.dockingCrewTransfer, "Docking and Crew Transfer"],
    [TechNode.spaceStationControl, "Space Station Attitude Control"],
    [TechNode.largeSpaceplaneControl, "Large Spaceplane Control"],
    [TechNode.standardDockingPorts, "Standardized Docking Ports"],
    [TechNode.largeStationControl, "Large Station Attitude Control"],
    [TechNode.largeDockingPorts, "Large Docking Ports"],
    [TechNode.gridFins, "Grid Fins"],
    [TechNode.flightControlNF, "Near Future Flight Control"],
    [TechNode.colonization2051Control, "2051-2099 Control"],
    [TechNode.colonization2100Control, "2100-2149 Control"],
    [TechNode.colonization2150Control, "2150+ Control"],
    [TechNode.entryDescentLanding, "Entry, Descent and Landing"],
    [TechNode.humanRatedEDL, "Human Rated EDL"],
    [TechNode.earlyLanding, "Early Landing"],
    [TechNode.lunarRatedHeatshields, "Lunar Rated Heatshields"],
    [TechNode.lunarLanding, "Lunar Landing"],
    [TechNode.improvedLandingEngines, "Improved Landing Engines"],
    [TechNode.advancedUncrewedLanding, "Advanced Uncrewed Landing"],
    [TechNode.interplanetaryRovers, "Interplanetary Rovers"],
    [TechNode.largeRoverDesigns, "Large Rover Designs"],
    [TechNode.reusability, "Reusability"],
    [TechNode.advancedLanding, "Advanced Landing"],
    [TechNode.SIAD, "Supersonic Inflatable Aerodynamic Decelerator"],
    [TechNode.HIAD, "Hypersonic Inflatable Aerodynamic Decelerator"],
    [TechNode.colonization2051EDL, "2051-2099 EDL"],
    [TechNode.colonization2100EDL, "2100-2149 EDL"],
    [TechNode.colonization2150EDL, "2150+ EDL"],
    [TechNode.prototypeHydrolox, "Prototype Hydrolox Engines"],
    [TechNode.earlyHydrolox, "Early Hydrolox Engines"],
    [TechNode.improvedHydrolox, "Improved Hydrolox Engines"],
    [TechNode.largeHydrolox, "Large Hydrolox Engines"],
    [TechNode.hydrolox1968, "1968 Hydrolox Engines"],
    [TechNode.hydrolox1972, "1972-1975 Hydrolox Engines"],
    [TechNode.hydrolox1976, "1976-1980 Hydrolox Engines"],
    [TechNode.hydrolox1981, "1981-1985 Hydrolox Engines"],
    [TechNode.hydrolox1986, "1986-1991 Hydrolox Engines"],
    [TechNode.hydrolox1992, "1992-1997 Hydrolox Engines"],
    [TechNode.hydrolox1998, "1998-2008 Hydrolox Engines"],
    [TechNode.hydrolox2009, "2009-2018 Hydrolox Engines"],
    [TechNode.hydroloxNF, "Near Future Hydrolox Engines"],
    [TechNode.colonization2051Hydrolox, "2051-2099 Hydrolox Engines"],
    [TechNode.colonization2100Hydrolox, "2100-2149 Hydrolox Engines"],
    [TechNode.colonization2150Hydrolox, "2150+ Hydrolox Engines"],
    [TechNode.rocketryTesting, "Post-War Rocketry Testing"],
    [TechNode.earlyRocketry, "Early Rocketry"],
    [TechNode.basicRocketryRP0, "Basic Rocketry"],
    [TechNode.orbitalRocketry1956, "1956-1957 Orbital Rocketry"],
    [TechNode.orbitalRocketry1958, "1958 Orbital Rocketry"],
    [TechNode.orbitalRocketry1959, "1959 Orbital Rocketry"],
    [TechNode.orbitalRocketry1960, "1960 Orbital Rocketry"],
    [TechNode.orbitalRocketry1961, "1961 Orbital Rocketry"],
    [TechNode.orbitalRocketry1962, "1962 Orbital Rocketry"],
    [TechNode.orbitalRocketry1963, "1963 Orbital Rocketry"],
    [TechNode.orbitalRocketry1964, "1964 Orbital Rocketry"],
    [TechNode.orbitalRocketry1965, "1965 Orbital Rocketry"],
    [TechNode.orbitalRocketry1966, "1966 Orbital Rocketry"],
    [TechNode.orbitalRocketry1967, "1967-1968 Orbital Rocketry"],
    [TechNode.orbitalRocketry1970, "1970-1971 Orbital Rocketry"],
    [TechNode.orbitalRocketry1972, "1972-1975 Orbital Rocketry"],
    [TechNode.orbitalRocketry1976, "1976-1980 Orbital Rocketry"],
    [TechNode.orbitalRocketry1981, "1981-1985 Orbital Rocketry"],
    [TechNode.orbitalRocketry1986, "1986-1991 Orbital Rocketry"],
    [TechNode.orbitalRocketry1992, "1992-1997 Orbital Rocketry"],
    [TechNode.orbitalRocketry1998, "1998-2003 Orbital Rocketry"],
    [TechNode.orbitalRocketry2004, "2004-2008 Orbital Rocketry"],
    [TechNode.orbitalRocketry2009, "2009-2013 Orbital Rocketry"],
    [TechNode.orbitalRocketry2014, "2014-2018 Orbital Rocketry"],
    [TechNode.orbitalRocketryNF, "Near Future Orbital Rocketry"],
    [TechNode.colonization2051Orbital, "2051-2099 Orbital Rocketry"],
    [TechNode.colonization2100Orbital, "2100-2149 Orbital Rocketry"],
    [TechNode.colonization2150Orbital, "2150+ Orbital Rocketry"],
    [TechNode.firstStagedCombustion, "First Staged Combustion Engines"],
    [TechNode.stagedCombustion1964, "1964 Staged Combustion Engines"],
    [TechNode.stagedCombustion1966, "1966 Staged Combustion Engines"],
    [TechNode.stagedCombustion1967, "1967-1968 Staged Combustion Engines"],
    [TechNode.stagedCombustion1969, "1969 Staged Combustion Engines"],
    [TechNode.stagedCombustion1970, "1970-1971 Staged Combustion Engines"],
    [TechNode.stagedCombustion1972, "1972-1980 Staged Combustion Engines"],
    [TechNode.stagedCombustion1981, "1981-1985 Staged Combustion Engines"],
    [TechNode.stagedCombustion1986, "1986-1991 Staged Combustion Engines"],
    [TechNode.stagedCombustion1992, "1992-1997 Staged Combustion Engines"],
    [TechNode.stagedCombustion1998, "1998-2003 Staged Combustion Engines"],
    [TechNode.stagedCombustion2004, "2004-2008 Staged Combustion Engines"],
    [TechNode.stagedCombustion2009, "2009-2013 Staged Combustion Engines"],
    [TechNode.stagedCombustion2014, "2014-2018 Staged Combustion Engines"],
    [TechNode.stagedCombustionNF, "Near Future Staged Combustion Engines"],
    [TechNode.colonization2051Staged, "2051-2099 Staged Combustion"],
    [TechNode.colonization2100Staged, "2100-2149 Staged Combustion"],
    [TechNode.colonization2150Staged, "2150+ Staged Combustion"],
    [TechNode.earlySolids, "Early Solid Rocket Engines"],
    [TechNode.solids1956, "1956-1957 Solid Rocket Engines"],
    [TechNode.solids1958, "1958 Solid Rocket Engines"],
    [TechNode.solids1959, "1959-1960 Solid Rocket Engines"],
    [TechNode.solids1962, "1962-1963 Solid Rocket Engines"],
    [TechNode.solids1964, "1964-1965 Solid Rocket Engines"],
    [TechNode.solids1966, "1966 Solid Rocket Engines"],
    [TechNode.solids1967, "1967-1968 Solid Rocket Engines"],
    [TechNode.solids1969, "1969-1971 Solid Rocket Engines"],
    [TechNode.solids1972, "1972-1975 Solid Rocket Engines"],
    [TechNode.solids1976, "1976-1980 Solid Rocket Engines"],
    [TechNode.solids1981, "1981-1985 Solid Rocket Engines"],
    [TechNode.solids1986, "1986-1991 Solid Rocket Engines"],
    [TechNode.solids1992, "1992-1997 Solid Rocket Engines"],
    [TechNode.solids1998, "1998-2008 Solid Rocket Engines"],
    [TechNode.solids2009, "2009-2018 Solid Rocket Engines"],
    [TechNode.solidsNF, "Near Future Solid Rocket Engines"],
    [TechNode.colonization2051Solid, "2051-2099 Solids"],
    [TechNode.colonization2100Solid, "2100-2149 Solids"],
    [TechNode.colonization2150Solid, "2150+ Solids"],
    [TechNode.earlyElecPropulsion, "Early Electric Propulsion"],
    [TechNode.basicElecPropulsion, "Basic Electric Propulsion"],
    [TechNode.improvedElecPropulsion, "Improved Electric Propulsion"],
    [TechNode.advancedElecPropulsion, "Advanced Electric Propulsion"],
    [TechNode.colonization2051ElecProp, "2051-2099 Electric Propulsion"],
    [TechNode.colonization2100ElecProp, "2100-2149 Electric Propulsion"],
    [TechNode.colonization2150ElecProp, "2150+ Electric Propulsion"],
    [TechNode.prototypeNuclearPropulsion, "Prototype Nuclear Propulsion"],
    [TechNode.earlyNuclearPropulsion, "Early Nuclear Propulsion"],
    [TechNode.basicNuclearPropulsion, "Basic Nuclear Propulsion"],
    [TechNode.improvedNuclearPropulsion, "Improved Nuclear Propulsion"],
    [TechNode.advancedNuclearPropulsion, "Advanced Nuclear Propulsion"],
    [TechNode.efficientNuclearPropulsion, "Efficient Nuclear Propulsion"],
    [TechNode.nuclearPropulsionNF, "Near Future Nuclear Propulsion"],
    [TechNode.nuclearPropulsionNF2, "Advanced Near Future Nuclear Propulsion"],
    [TechNode.colonization2051NuclearProp, "2051-2099 Nuclear Propulsion"],
    [TechNode.colonization2100NuclearProp, "2100-2149 Nuclear Propulsion"],
    [TechNode.colonization2150NuclearProp, "2150+ Nuclear Propulsion"],
    [TechNode.crewSurvivability, "Crew Survivability"],
    [TechNode.earlyLifeSupport, "Early Life Support and ISRU"],
    [TechNode.lifeSupportISRU, "Life Support and ISRU"],
    [TechNode.basicLifeSupport, "Basic Life Support and ISRU"],
    [TechNode.improvedLifeSupport, "Improved Life Support and ISRU"],
    [TechNode.longTermLifeSupport, "Long-Life Support and ISRU"],
    [TechNode.advancedLifeSupport, "Long-Term Life Support and ISRU"],
    [TechNode.efficientLifeSupport, "Efficient Life Support and ISRU"],
    [TechNode.lifeSupportNF, "Near Future Life Support and ISRU"],
    [TechNode.colonization2051LifeSupport, "2051-2099 Life Support and ISRU"],
    [TechNode.colonization2100LifeSupport, "2100-2149 Life Support and ISRU"],
    [TechNode.colonization2150LifeSupport, "2150+ Life Support and ISRU"],
    [TechNode.postWarMaterialsScience, "Post-War Materials Science"],
    [TechNode.earlyMaterialsScience, "Early Materials Science"],
    [TechNode.materialsScienceSatellite, "Satellite Era Materials Science"],
    [TechNode.materialsScienceHuman, "Early Human Spaceflight Materials Science"],
    [TechNode.materialsScienceAdvCapsules, "Advanced Capsules Era Materials Science"],
    [TechNode.materialsScienceLunar, "Lunar Exploration Era Materials Science"],
    [TechNode.materialsScienceSpaceStation, "Space Station Era Materials Science"],
    [TechNode.materialsScienceSpaceplanes, "Spaceplanes Era Materials Science"],
    [TechNode.materialsScienceLongTerm, "Long-Term Space Habitation Era Materials Science"],
    [TechNode.materialsScienceInternational, "International Cooperation Era Materials Science"],
    [TechNode.materialsScienceCommercial, "Commercial Spaceflight Era Materials Science"],
    [TechNode.materialsScienceNF, "Near Future Era Materials Science"],
    [TechNode.materialsScienceColonization, "Colonization Era Materials Science"],
    [TechNode.electronicsSatellite, "Satellite Era Electronics Research"],
    [TechNode.electronicsHuman, "Early Human Spaceflight Electronics Research"],
    [TechNode.electronicsAdvCapsules, "Advanced Capsules Era Electronics Research"],
    [TechNode.electronicsLunar, "Lunar Exploration Era Electronics Research"],
    [TechNode.electronicsSpaceStation, "Space Station Era Electronics Research"],
    [TechNode.electronicsSpaceplanes, "Spaceplanes Era Electronics Research"],
    [TechNode.electronicsLongTerm, "Long-Term Space Habitation Era Electronics Research"],
    [TechNode.electronicsInternational, "International Cooperation Era Electronics Research"],
    [TechNode.electronicsCommercial, "Commercial Spaceflight Era Electronics Research"],
    [TechNode.electronicsNF, "Near Future Era Electronics Research"],
    [TechNode.electronicsColonization, "Colonization Era Electronics Research"],
    [TechNode.firstRTG, "First RTG's"],
    [TechNode.earlyRTG, "Early RTG's"],
    [TechNode.nuclearFissionReactors, "Small Nuclear Fission Reactors"],
    [TechNode.improvedRTG, "Improved RTG's"],
    [TechNode.multihundredWattRTG, "Multihundred-Watt RTG's"],
    [TechNode.gphsRTG, "GPHS-RTG's"],
    [TechNode.improvedNuclearPower, "Improved Nuclear Power Generation"],
    [TechNode.advancedNuclearPower, "Advanced Nuclear Power Generation"],
    [TechNode.modernNuclearPower, "Modern Nuclear Power Generation"],
    [TechNode.nuclearPowerNF, "Near Future Nuclear Power Generation"],
    [TechNode.colonization2051NuclearPower, "2051-2099 Nuclear Power"],
    [TechNode.colonization2100NuclearPower, "2100-2149 Nuclear Power"],
    [TechNode.colonization2150NuclearPower, "2150+ Nuclear Power"],
    [TechNode.primitiveSolarPanels, "Primitive Solar Panels"],
    [TechNode.earlyPower, "Early Power Generation and Storage"],
    [TechNode.basicPower, "Basic Power Generation and Storage"],
    [TechNode.improvedPower, "Improved Power Generation and Storage"],
    [TechNode.lunarRatedPower, "Lunar Rated Power Generation"],
    [TechNode.spaceStationSolarPanels, "Space Station Solar Panels"],
    [TechNode.maturePower, "Mature Power Generation and Storage"],
    [TechNode.largeScaleSolarArrays, "Large Scale Solar Arrays"],
    [TechNode.advancedPower, "Advanced Power Generation and Storage"],
    [TechNode.modernPower, "Modern Power Generation and Storage"],
    [TechNode.powerNF, "Near Future Power Generation and Storage"],
    [TechNode.colonization2051Power, "2051-2099 Power Generation and Storage"],
    [TechNode.colonization2100Power, "2100-2149 Power Generation and Storage"],
    [TechNode.colonization2150Power, "2150+ Power Generation and Storage"],
    [TechNode.lunarRangeComms, "Lunar Range Communications"],
    [TechNode.interplanetaryComms, "Interplanetary Communications"],
    [TechNode.improvedComms, "Improved Communications"],
    [TechNode.advancedComms, "Advanced Communications"],
    [TechNode.deepSpaceComms, "Deep Space Communications"],
    [TechNode.largeScaleComms, "Large Scale Communications"],
    [TechNode.massiveScaleComms, "Massive Scale Communications"],
    [TechNode.efficientComms, "Efficient Communications"],
    [TechNode.modernComms, "Modern Communications"],
    [TechNode.commsNF, "Near Future Communications"],
    [TechNode.colonization2051Comms, "2051-2099 Communications"],
    [TechNode.colonization2100Comms, "2100-2149 Communications"],
    [TechNode.colonization2150Comms, "2150+ Communications"],
    [TechNode.postWarAvionics, "Post-War Avionics"],
    [TechNode.avionicsPrototypes, "Avionics Prototypes"],
    [TechNode.earlyAvionics, "Early Avionics and Probes"],
    [TechNode.basicAvionics, "Basic Avionics and Probes"],
    [TechNode.interplanetaryProbes, "Interplanetary Probes"],
    [TechNode.improvedAvionics, "Improved Avionics"],
    [TechNode.matureAvionics, "Mature Avionics and Probes"],
    [TechNode.largeScaleAvionics, "Large Scale Avionics"],
    [TechNode.advancedAvionics, "Advanced Avionics and Probes"],
    [TechNode.nextGenAvionics, "Next Generation Avionics and Probes"],
    [TechNode.longTermAvionics, "Long-Term Space Habitation Era Avionics and Probes"],
    [TechNode.internationalAvionics, "International Era Avionics and Probes"],
    [TechNode.modernAvionics, "Modern Avionics and Probes"],
    [TechNode.avionicsNF, "Near Future Avionics and Probes"],
    [TechNode.colonization2051Avionics, "2051-2099 Avionics and Probes"],
    [TechNode.colonization2100Avionics, "2100-2149 Avionics and Probes"],
    [TechNode.colonization2150Avionics, "2150+ Avionics and Probes"],
    [TechNode.earlyScience, "Early Science"],
    [TechNode.scienceSatellite, "Satellite Era Science"],
    [TechNode.scienceHuman, "Early Human Spaceflight Era Science"],
    [TechNode.scienceAdvCapsules, "Interplanetary Era Science"],
    [TechNode.scienceLunar, "Lunar Exploration Era Science"],
    [TechNode.surfaceScience, "Surface Science"],
    [TechNode.deepSpaceScience, "Deep Space Science Experiments"],
    [TechNode.scienceExploration, "Exploration Era Science"],
    [TechNode.sampleReturnScience, "Sample Return Science Experiments"],
    [TechNode.advancedScience, "Advanced Science Experiments"],
    [TechNode.advancedSurfaceScience, "Advanced Surface Experiments"],
    [TechNode.scienceNF, "Near Future Science"],
    [TechNode.colonization2051Science, "2051-2099 Science"],
    [TechNode.colonization2100Science, "2100-2149 Science"],
    [TechNode.colonization2150Science, "2150+ Science"],
]);