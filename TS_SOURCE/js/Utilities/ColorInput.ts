class ColorInput {
    
    public static HookInput (trigger: HTMLElement, target: HTMLInputElement) {
        
        trigger.style.background = target.value;
        
        target.addEventListener ("input", () => {
            trigger.style.background = target.value;
        });
        
    }
    
}