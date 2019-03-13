class Engine {
    Name: string = "DEFAULT";
    TT: number = Math.random ();
    TestNumber: number = 1234.5678;
    debug1: string = "placeholder";
    debug2: string = "text";
    debug3: string = "qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq";
    
    constructor () {
        
    }
    
    public GetStuff () {
        return `${this.Name}-${this.TT}`;
    }
}