class ImageOverflowPreview {
    
    // Tracks mouse on root element, and accordingly moves larger child element
    // Child needs 'pointer-events: none;' in CSS
    public static Hook (root: HTMLElement) {
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
            
            let xPercent = e.layerX / root.clientWidth;
            let yPercent = e.layerY / root.clientHeight;
            
            child.style.left = `-${(child.clientWidth - root.clientWidth) * xPercent}px`;
            child.style.top = `-${(child.clientHeight - root.clientHeight) * yPercent}px`;
        });
        
        root.addEventListener ("mouseleave", () => {
            child.style.left = '0px';
            child.style.top = '0px';
        });
    }
    
}