class Dragger {
    
    public static currentInterval: number | null;
    
    public static Drop () {
        if (this.currentInterval) {
            clearInterval (this.currentInterval);
            this.currentInterval = null;
        }
    }
    
    public static Drag (action: () => void) {
        if (this.currentInterval) {
            this.Drop ();
        }
        
        this.currentInterval = setInterval (action, 20);
    }
    
}

window.addEventListener ("pointerup", () => {
    Dragger.Drop ();
});