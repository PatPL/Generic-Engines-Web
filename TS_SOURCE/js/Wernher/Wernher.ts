/// <reference path="./Enums/EngineCycle.ts" />
/// <reference path="./Enums/PropellantMix.ts" />
/// <reference path="./Data/EngineCycleList.ts" />
class Wernher {
    
    public static RollEngine (_year?: number, _cycle?: EngineCycle, _prop?: PropellantMix): Engine | null {
        let year = _year ?? Math.floor (Math.random () * 200) + 1940;
        let cycle: EngineCycle;
        let prop: PropellantMix;
        
        // Roll a cycle if not explicitly passed
        if (_cycle) {
            cycle = _cycle;
        } else {
            let cycles = Object.getOwnPropertyNames (EngineCycleList);
            cycle = parseInt (cycles[Math.floor (Math.random () * cycles.length)]);
        }
        
        // Check if given cycle is defined
        if (!EngineCycleList[cycle]) {
            return null;
        }
        
        // Roll a propellant mix if not explicitly passed
        if (_prop) {
            prop = _prop;
        } else {
            let props = Object.getOwnPropertyNames (EngineCycleList[cycle].Variants);
            prop = parseInt (props[Math.floor (Math.random () * props.length)]);
        }
        
        // Check is given prop mix is defined in the given cycle
        if (!EngineCycleList[cycle].Variants[prop]) {
            return null;
        }
        
        // At this point we have a valid cycle:prop combination
        
        let engineCycle = EngineCycleList[cycle];
        let propellantMix = PropellantMixList[prop];
        let engineVariant = EngineCycleList[cycle].Variants[prop]!;
        let engine = new Engine ();
        
        // Set engine values
        
        // engine.Active = true;
        // engine.ID = `Wernher-${ Math.floor (Math.random () * 1000000000) }`;
        // engine.EngineName = `${ Math.random () > 0.5 ? "RD-" : "LR" }${ Math.floor (Math.random () * 500) }, (${ year })`;
        // engine.EngineManufacturer = "Wernher";
        // engine.EngineDescription = "MVP Wernher engine generator test";
        
        // engine.PlumeID = propellantMix.Plume;
        // engine.FuelRatioItems = [];
        // propellantMix.Propellants.forEach (([fuel, rng]) => {
        //     engine.FuelRatioItems.push ([fuel, rng.Get (year)]);
        // });
        
        // engine.Thrust = engineVariant.Thrust.Get (year);
        // engine.AtmIsp = engineVariant.SLIsp.Get (year);
        // engine.VacIsp = engineVariant.VacIsp.Get (year);
        // engine.Cost = engineVariant.CostMultiplier.Get (year);
        // engine.Cost = engineVariant.Cost (engine.Thrust, engine.VacIsp, year, engine.Cost);
        // engine.EntryCost = engine.Cost * engineVariant.EntryCostMultiplier.Get (year);
        
        // engine.UseBaseWidth = false;
        // engine.Width = engineVariant.BellWidth (engine.Thrust, engine.VacIsp, year);
        // engine.Mass = engineCycle.Mass (engine.Width, engine.VacIsp);
        
        // engine.NeedsUllage = engineCycle.Ullage;
        // engine.ModelID = engineCycle.Models[Math.floor (Math.random () * engineCycle.Models.length)];
        
        // engine.EnableTestFlight = true;
        // engine.StartReliability10k = engineCycle.TestFlight10kIgnition.Get (year);
        // engine.StartReliability0 = engine.StartReliability10k - engineCycle.TestFlight10kIgnitionDeficiency.Get (year);
        // engine.CycleReliability10k = engineCycle.TestFlight10kCycle.Get (year);
        // engine.CycleReliability0 = engine.CycleReliability10k - engineCycle.TestFlight10kCycleDeficiency.Get (year);
        
        return engine;
    }
    
}
