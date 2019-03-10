class Engine {
    Name: string = "";
    TT: number = 0;
    
    constructor () {
        
    }
    
    public GetStuff () {
        return `${this.Name}-${this.TT}`;
    }
}