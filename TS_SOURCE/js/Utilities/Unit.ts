class Unit {
    
    public static Display (value: number, unit: string, forceUnit: boolean, decimalPlaces: number = 20): string {
        if (forceUnit) {
            return `${value}${unit}`;
        }
        
        let targetUnit = this.ParseUnit (unit);
        let rawValue = value * targetUnit[0];
        
        if (targetUnit[1] == "t" && rawValue < 1) {
            targetUnit[1] = "g";
            rawValue *= 1_000_000;
        } else if (targetUnit[1] == "g" && rawValue >= 1_000_000) {
            targetUnit[1] = "t";
            rawValue /= 1_000_000;
        }
        
        let closestTo500: number = Number.MAX_VALUE;
        let closestPrefix: [string, number] = ["", 1];
        
        if (rawValue != 0) {
            MetricPrefix.forEach (x => {
                let newDistanceTo500 = Math.abs (rawValue / x[1] - 500.5);
                if (newDistanceTo500 < closestTo500) {
                    closestTo500 = newDistanceTo500;
                    closestPrefix = x;
                }
            });
        }
        
        let number = rawValue / closestPrefix[1];
        let trimmed = number.toFixed (decimalPlaces);
        let numberString = number.toString ().length >= trimmed.length ? trimmed : number.toString ();
        return `${numberString}${closestPrefix[0]}${targetUnit[1]}`;
    }
    
    /** Changes string into a unit
     * 
     * Examples:
     * * `"N" => [1, "N"]`
     * * `"kg" => [1000, "g"]`
     * * `"ul" => [0.000001, "l"]`
     */
    public static ParseUnit (rawUnit: string): [number, string] {
        if (rawUnit.length == 0) {
            console.error ("Bad input unit");
            return [0, ""];
        }
        
        if (rawUnit.length == 1) {
            //Stuff like m
            return [1, rawUnit];
        }
        
        let prefix = MetricPrefix.find (x => x[0] == rawUnit[0]);
        if (prefix) {
            //Metric prefix, i.e kg or mN
            return [prefix[1], rawUnit.substring (1)];
        } else {
            // No metric prefix, i.e. N or s
            if (rawUnit[0] == "c") { //Allow centi- ONLY for input. (For cm)
                return [0.01, rawUnit.substring (1)];
            } else {
                return [1, rawUnit];
            }
        }
    }
    
    public static Parse (value: string, baseUnit: string): number {
        let rawInputNumber = /^[0-9,.]+/.exec (value);
        let inputNumber = rawInputNumber ? parseFloat (rawInputNumber[0].replace (",", ".")) : 0;
        
        let rawInputUnit = /[^0-9,.]+$/.exec (value);
        let inputUnit: [number, string] = this.ParseUnit (rawInputUnit ? rawInputUnit[0] : baseUnit);
        let targetUnit: [number, string] = this.ParseUnit (baseUnit);
        
        if (inputUnit[1] == "g" && targetUnit[1] == "t") {
            inputUnit[0] /= 1_000_000;
            inputUnit[1] = "t";
        } else if (inputUnit[1] == "t" && targetUnit[1] == "g") {
            inputUnit[0] *= 1_000_000;
            inputUnit[1] = "g";
        }
        
        if (inputUnit[1] != targetUnit[1]) {
            console.warn ("Units mismatched. Changing to expected unit");
            inputUnit[1] = targetUnit[1];
        }
        
        return inputNumber * inputUnit[0] / targetUnit[0];
    }
    
}

const MetricPrefix: [string, number][] = [
    ["Y", 1_000_000_000_000_000_000_000_000],
    ["Z", 1_000_000_000_000_000_000_000],
    ["E", 1_000_000_000_000_000_000],
    ["P", 1_000_000_000_000_000],
    ["T", 1_000_000_000_000],
    ["G", 1_000_000_000],
    ["M", 1_000_000],
    ["k", 1_000],
    ["", 1],
    ["m", 0.001],
    ["u", 0.000_001],
    ["n", 0.000_000_001],
    ["p", 0.000_000_000_001],
    ["f", 0.000_000_000_000_001],
    ["a", 0.000_000_000_000_000_001],
    ["z", 0.000_000_000_000_000_000_001],
    ["y", 0.000_000_000_000_000_000_000_001],
]