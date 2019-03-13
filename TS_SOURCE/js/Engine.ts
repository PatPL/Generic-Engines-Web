class Engine {
    Name: string = "DEFAULT";
    TT: number = 0;
    TestNumber: number = 1234.5678;
    
    constructor () {
        
    }
    
    public GetStuff () {
        return `${this.Name}-${this.TT}`;
    }
}