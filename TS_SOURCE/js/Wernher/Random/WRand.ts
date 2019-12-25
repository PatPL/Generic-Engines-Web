/**
 * Provides random number generator functions
 */
class WRand {
    
    /**
     * Returns a random value between min and max
     * @param min Minimum value
     * @param max Maximum value
     */
    public static Linear (
        min: number,
        max: number,
    ) {
        return Math.random () * (max - min) + min;
    }
    
    /**
     * Returns a random value, with probability skewed to the center of the range
     * @param min Minimum value
     * @param max Maximum value
     * @param passes Bias towards the center of the range. https://imgur.com/nQjhSvq.png
     */
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
    
    /**
     * Returns a random value in log distrubution between min and max
     * ex.
     * * Linear (1, 1000) -> 410, 844, 274, 659: ~500
     * * Logarithmic (1, 1000) -> 2.86, 873.3, 35.12, 105.22
     * @param min Minimum value
     * @param max Maximum value
     * @param bellPasses Rounding of the output (Bias against extreme ranges)
     */
    public static Logarithmic (
        min: number,
        max: number,
        bellPasses: number = 2
    ): number {
        return Math.E ** (this.Bell (Math.log (min), Math.log (max), bellPasses));
    }
    
    /**
     * Returns a random value with a heavy bias towards lower values
     * @param min 
     * @param max 
     * @param bellPasses Bias towards lower values
     */
    public static Inverse (
        min: number,
        max: number,
        bellPasses: number = 2
    ): number {
        return 1 / (this.Bell (1 / max, 1 / min, bellPasses));
    }
    
}