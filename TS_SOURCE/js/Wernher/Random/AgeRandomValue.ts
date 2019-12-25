///<reference path="WRand.ts" />
class AgeRandomValue implements IRandomValueProvider {
    
    /**
     * Creates a RNG with min/max changing with given year
     * @param points Year (ex. 1960), Min, Max | >2 entries
     * @param type Randomness type
     * @param value Output type
     */
    constructor (
        private points: [number, number, number][],
        private type: "linear" | "bell" | "logarithmic",
        private value: "float" | "integer",
        private ends: "flat" | "continue"
    ) {
        if (points.length < 2) {
            throw "AgeRandomValue needs at least two year range points"
        }
        
        points.sort ((a, b) => {
            if (a[0] > b[0]) {
                return 1;
            } else if (a[0] < b[0]) {
                return -1;
            } else {
                console.warn ("Age duplicate in this RNG: ", this);
                return 0;
            }
        });
    }
    
    /**
     * Get a random value at a given year
     * @param year Year of the roll
     */
    public Get (year: number): number {
        let output = 0;
        
        let min = 0;
        let max = 0;
        
        if (year < this.points[0][0] || year > this.points[this.points.length - 1][0]) {
            // The year is out of the given scope, so correctly extrapolate the values, depending on 'ends' property
            switch (this.ends) {
                case "flat":
                    if (year < this.points[0][0]) {
                        min = this.points[0][1];
                        max = this.points[0][2];
                    } else {
                        min = this.points[this.points.length - 1][1];
                        max = this.points[this.points.length - 1][2];
                    }
                break; case "continue":
                    let p1: [number, number, number];
                    let p2: [number, number, number];
                    
                    if (year < this.points[0][0]) {
                        p1 = this.points[0];
                        p2 = this.points[1];
                    } else {
                        p1 = this.points[this.points.length - 1];
                        p2 = this.points[this.points.length - 2];
                    }
                    
                    let dx = p2[0] - p1[0];
                    let dmin = p2[1] - p1[1];
                    let dmax = p2[2] - p1[2];
                    
                    min = ((year - p1[0]) / dx) * dmin + p1[1];
                    max = ((year - p1[0]) / dx) * dmax + p1[2];
                break;
            }
        } else {
            // The year is in the given scope, find the range and use that to set min/max
            let index = 0;
            
            for (let i = 0; i < this.points.length - 1; ++i) {
                // If the next one is higher, the range is in points (i, i + 1)
                if (this.points[i + 1][0] >= year) {
                    index = i;
                    break;
                }
            }
            
            let p1 = this.points[index];
            let p2 = this.points[index + 1];
            
            let dx = p2[0] - p1[0];
            let dmin = p2[1] - p1[1];
            let dmax = p2[2] - p1[2];
            
            min = ((year - p1[0]) / dx) * dmin + p1[1];
            max = ((year - p1[0]) / dx) * dmax + p1[2];
        }
        
        switch (this.type) {
            case "linear":
                output = WRand.Linear (min, max);
            break; case "bell":
                output = WRand.Bell (min, max);
            break; case "logarithmic":
                output = WRand.Logarithmic (min, max);
            break; default:
                console.error ("You didn't link the randomness function: ", this.type);
            break;
        }
        
        if (this.value == "integer") {
            output = Math.round (output);
        }
        
        return output;
    }
    
}
