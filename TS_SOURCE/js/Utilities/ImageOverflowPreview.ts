class ImageOverflowPreview {
    
    // Tracks mouse on root element, and accordingly moves larger child element
    // Child needs 'pointer-events: none;' in CSS
    public static Hook (root: HTMLElement) {
        
        const deadzone = 16; // in px
        
        if (!root.firstChild) {
            console.warn ("Root has no child. Ignoring...");
            return;
        }
        
        let child = root.firstChild as HTMLElement;
        child.style.position = "relative";
        root.addEventListener ("mousemove", e => {
            if (child.clientHeight <= root.clientHeight && child.clientWidth <= root.clientWidth) {
                return;
            }
            
            let xOffset = (e.layerX - deadzone) / (root.clientWidth - deadzone * 2);
            let yOffset = (e.layerY - deadzone) / (root.clientHeight - deadzone * 2);
            
            xOffset = Math.min (Math.max (xOffset, 0.0), 1.0);
            yOffset = Math.min (Math.max (yOffset, 0.0), 1.0);
            
            child.style.left = `-${(child.clientWidth - root.clientWidth) * xOffset}px`;
            child.style.top = `-${(child.clientHeight - root.clientHeight) * yOffset}px`;
        });
        
        root.addEventListener ("mouseleave", () => {
            child.style.left = '0px';
            child.style.top = '0px';
        });
    }
    
}