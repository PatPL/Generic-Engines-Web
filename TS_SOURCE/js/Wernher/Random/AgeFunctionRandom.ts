class AgeFunctionRandom implements IRandomValueProvider {
    
    constructor (
        private biasPoints: [number, number][],
        private leftFunction: ((...args: number[]) => number) | IRandomValueProvider | number,
        private rightFunction: ((...args: number[]) => number) | IRandomValueProvider | number,
        private ends: "flat" | "continue",
    ) {
        if (biasPoints.length < 2) {
            throw "AgeFunctionRandom needs at least two year range points";
        }
        
        biasPoints.sort ((a, b) => {
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
    
    public Get (year: number): number {
        let bias = 0;
        
        if (year < this.biasPoints[0][0] || year > this.biasPoints[this.biasPoints.length - 1][0]) {
            // The year is out of the given scope, so correctly extrapolate the values, depending on 'ends' property
            switch (this.ends) {
                case "flat":
                    if (year < this.biasPoints[0][0]) {
                        bias = this.biasPoints[0][1];
                    } else {
                        bias = this.biasPoints[this.biasPoints.length - 1][1];
                    }
                break; case "continue":
                    let p1: [number, number];
                    let p2: [number, number];
                    
                    if (year < this.biasPoints[0][0]) {
                        p1 = this.biasPoints[0];
                        p2 = this.biasPoints[1];
                    } else {
                        p1 = this.biasPoints[this.biasPoints.length - 1];
                        p2 = this.biasPoints[this.biasPoints.length - 2];
                    }
                    
                    let dx = p2[0] - p1[0];
                    let dbias = p2[1] - p1[1];
                    
                    bias = ((year - p1[0]) / dx) * dbias + p1[1];
                break;
            }
        } else {
            // The year is in the given scope, find the range and use that to set min/max
            let index = 0;
            
            for (let i = 0; i < this.biasPoints.length - 1; ++i) {
                // If the next one is higher, the range is in points (i, i + 1)
                if (this.biasPoints[i + 1][0] >= year) {
                    index = i;
                    break;
                }
            }
            
            let p1 = this.biasPoints[index];
            let p2 = this.biasPoints[index + 1];
            
            let dx = p2[0] - p1[0];
            let dbias = p2[1] - p1[1];
            
            bias = ((year - p1[0]) / dx) * dbias + p1[1];
        }
        
        if (Math.random () > bias) {
            if (typeof this.leftFunction == "function") {
                return this.leftFunction (year);
            } else if (typeof this.leftFunction == "number") {
                return this.leftFunction;
            } else {
                return this.leftFunction.Get (year);
            }
        } else {
            if (typeof this.rightFunction == "function") {
                return this.rightFunction (year);
            } else if (typeof this.rightFunction == "number") {
                return this.rightFunction;
            } else {
                return this.rightFunction.Get (year);
            }
        }
        
    }
    
}