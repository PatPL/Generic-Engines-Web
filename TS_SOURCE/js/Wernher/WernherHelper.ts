class WernherHelper {
    
    // Year cost curves
    // https://www.desmos.com/calculator/4hi8tvk7mz
    
    /** For regular tech
     * * 1940 - 1.4
     * * 1955 - 1.2
     * * 1980 - 1.0
     * * 2030 - 0.8
     * * 2180 - 0.6
     */
    public static RegularYearCostMultiplier (year: number): number {
        return 60 / (year - 1880) + 0.4;
    }
    
    /** For simple tech
     * * 1940 - 1.4
     * * 1947 - 1.2
     * * 1958 - 1.0
     * * 1978 - 0.8
     * * 2019 - 0.6
     * * 2172 - 0.4
     */
    public static EarlyYearCostMultiplier (year: number): number {
        return 40 / (year - 1905) + 0.25
    }
    
    /** For modern tech
     * * 1943 - 1.8
     * * 1949 - 1.6
     * * 1958 - 1.4
     * * 1975 - 1.2
     * * 2013 - 1.0
     * * 2189 - 0.8
     */
    public static ModernYearCostMultiplier (year: number): number {
        return 30 / (year - 1916) + 0.69;
    }
    
    /**
     * Bell width size improvements across time
     * (Better materials -> tighter throats)
     * * 1940 - 1.35
     * * 1948 - 1.2
     * * 1975 - 1.0
     * * 2015 - 0.9
     * * 2200 - 0.8
     */
    public static YearBellWidthMultiplier (year: number): number {
        return 15 / (year - 1915) + 0.75;
    }
    
    /** Improvements in material science... or something
     * * 1940 - 1.2
     * * 1961 - 1.0
     * * 2007 - 0.8
     * * 2194 - 0.6
     */
    public static YearMassMultiplier (year: number) {
        return 40 / (year - 1886) + 0.47;
    }
    
}