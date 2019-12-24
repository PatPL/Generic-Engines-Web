class Dragger {
    
    public static currentInterval: (() => void) | null;
    
    public static Drop () {
        if (this.currentInterval) {
            this.currentInterval = null;
        }
    }
    
    public static Drag (action: () => void) {
        if (this.currentInterval) {
            this.Drop ();
        }
        
        this.currentInterval = action;
        
        let callFrame = () => {
            if (this.currentInterval) {
                this.currentInterval ();
                requestAnimationFrame (callFrame);
            }
        };
        
        requestAnimationFrame (callFrame);
    }
    
}

window.addEventListener ("pointerup", () => {
    Dragger.Drop ();
});