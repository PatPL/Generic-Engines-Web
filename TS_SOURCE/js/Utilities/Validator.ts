class Validator {
    
    public static Validate (engines: Engine[]): string[] {
        let output: string[] = [];
        
        output = output.concat (this.CheckDuplicateIDs (engines));
        output = output.concat (this.CheckPolymorphismConsistency (engines));
        
        return output;
    }
    
    private static CheckPolymorphismConsistency (engines: Engine[]): string[] {
        let output: string[] = [];
        // Name, isModeMaster, Links
        let Masters: { [id: string]: [boolean, number] } = {};
        
        engines.forEach (e => {
            if (!e.Active) {
                //Ignore inactive engines
                return; //continue?
            }
            
            //Find all masters for later
            switch (e.Polymorphism.PolyType) {
                case PolymorphismType.MultiConfigMaster:
                Masters[e.ID] = [false, 0];
                break;
                case PolymorphismType.MultiModeMaster:
                Masters[e.ID] = [true, 0];
                break;
            }
        });
        
        engines.forEach (e => {
            if (!e.Active) {
                //Ignore inactive engines
                return; //continue?
            }
            
            //Check every slave
            switch (e.Polymorphism.PolyType) {
                case PolymorphismType.MultiConfigSlave:
                if ( //Check whether ConfigMaster exists
                    Masters[e.Polymorphism.MasterEngineName] &&
                    !Masters[e.Polymorphism.MasterEngineName][0]
                ) {
                    //Master exists
                    Masters[e.Polymorphism.MasterEngineName][1] += 1;
                } else {
                    //Master doesn't exist
                    output.push (`Polymorphism error in engine ${e.ID}. There is no active MultiConfigMaster with ID ${e.Polymorphism.MasterEngineName}`);
                }
                break;
                case PolymorphismType.MultiModeSlave:
                if ( //Check whether ModeMaster exists
                    Masters[e.Polymorphism.MasterEngineName] &&
                    Masters[e.Polymorphism.MasterEngineName][0]
                ) {
                    //Master exists
                    if (Masters[e.Polymorphism.MasterEngineName][1] == 0) {
                        //Not linked yet, OK
                    } else {
                        //Already linked, Error
                        output.push (`Polymorphism error in engine ${e.ID}. ${e.Polymorphism.MasterEngineName} already has a slave MultiMode engine config`);
                    }
                    Masters[e.Polymorphism.MasterEngineName][1] += 1;
                } else {
                    //Master doesn't exist
                    output.push (`Polymorphism error in engine ${e.ID}. There is no active MultiModeMaster with ID ${e.Polymorphism.MasterEngineName}`);
                }
                break;
            }
        });
        
        return output;
    }
    
    private static CheckDuplicateIDs (engines: Engine[]): string[] {
        let output: string[] = [];
        let takenIDs: string[] = [];
        
        engines.forEach (e => {
            if (!e.Active) {
                //Ignore inactive engines
                return; //continue?
            }
            
            if (/[^A-Za-z0-9-]/.test (e.ID)) {
                output.push (`ID contains invalid characters: ${e.ID}. Change the ID`);
                return; //continue
            }
            
            if (takenIDs.some (x => x == e.ID)) {
                output.push (`ID duplicate found: ${e.ID}. Change the ID`);
            } else {
                takenIDs.push (e.ID);
            }
        });
        
        return output;
    }
    
}