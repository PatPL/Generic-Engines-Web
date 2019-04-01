class Input {
    
    public static MouseX: number = 0;
    public static MouseY: number = 0;
    
}

window.onpointermove = (event) => {
    Input.MouseX = event.clientX;
    Input.MouseY = event.clientY;
}