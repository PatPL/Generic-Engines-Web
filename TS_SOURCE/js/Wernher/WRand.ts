/**
 * Provides random number generator functions
 */
class WRand {
    
    public static Linear (
        min: number,
        max: number,
    ) {
        return Math.random () * (max - min) + min;
    }
    
    public static Bell (
        min: number,
        max: number,
        passes: number = 3
    ): number {
        let output = 0;
        
        for (let i = 0; i < passes; ++i) {
            output += Math.random ();
        } // output -> <0, passes>
        
        output /= passes; // output -> <0, 1>
        output *= max - min // output -> <0, max - min>
        output += min // output -> <min, max>
        
        return output;
    }
    
    public static Logarithmic (
        min: number,
        max: number,
        bellPasses: number = 2
    ): number {
        return Math.E ** (this.Bell (Math.log (min), Math.log (max), bellPasses));
    }
    
}