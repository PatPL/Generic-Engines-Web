type RGBA = [number, number, number, number];
type HSVA = [number, number, number, number];
class ColorInput {
    
    // I really want to avoid passing this bool over 4 functions just for this one little feature
    // Set to true by input event for ApplyCurrentColorToInputs, and set back to false afterwards
    private static DO_NOT_UPDATE_INPUT_OVERRIDE: boolean = false;
    
    private static CurrentColorRGB: RGBA = [0, 0, 0, 1.0];
    private static CurrentColorHSV: HSVA = [0, 0, 0, 1.0];
    private static CurrentColorAlpha: number = 1.0;
    
    private static CurrentLock: "R" | "G" | "B" = "R";
    private static CurrentlyTargetedInput: HTMLInputElement | null = null;
    private static CurrentResizeListener: (() => void) | null = null;
    
    private static ElementContainer: HTMLDivElement;
    private static ElementSquareX: HTMLDivElement;
    private static ElementSquareY: HTMLDivElement;
    private static ElementSquareOverlay: HTMLDivElement;
    private static ElementSquareMeter: HTMLDivElement;
    private static ElementR: HTMLDivElement;
    private static ElementRMeter: HTMLDivElement;
    private static ElementG: HTMLDivElement;
    private static ElementGMeter: HTMLDivElement;
    private static ElementB: HTMLDivElement;
    private static ElementBMeter: HTMLDivElement;
    private static ElementS: HTMLDivElement;
    private static ElementSMeter: HTMLDivElement;
    private static ElementV: HTMLDivElement;
    private static ElementVMeter: HTMLDivElement;
    private static ElementA: HTMLDivElement;
    private static ElementAOverlay: HTMLDivElement;
    private static ElementAMeter: HTMLDivElement;
    private static ElementPreview: HTMLDivElement;
    private static ElementPreviewInput: HTMLInputElement;
    private static ElementApply: HTMLImageElement;
    private static ElementRevert: HTMLImageElement;
    
    private static readonly hexLookup: string[] = [
        "0", "1", "2", "3", "4", "5", "6", "7",
        "8", "9", "A", "B", "C", "D", "E", "F",
    ]
    private static readonly hexValue: { [hex: string]: number } = {
        "0":  0, "1":  1, "2":  2, "3":  3,
        "4":  4, "5":  5, "6":  6, "7":  7,
        "8":  8, "9":  9, "a": 10, "b": 11,
        "c": 12, "d": 13, "e": 14, "f": 15
    };
    
    private static ParseRGB (cssColor: string): RGBA {
        cssColor = cssColor.toLowerCase ();
        if (/^[0-9a-f]{3,}$/.test (cssColor)) {
            // Hex color without #. Allow, and add # for parsing
            cssColor = `#${ cssColor }`;
        }
        
        let output: RGBA = [0, 0, 0, 1.0];
        
        if (/^#[0-9a-f]{8,}$/.test (cssColor)) {
            // #125489FF
            output[0] += ColorInput.hexValue[cssColor[1]] * 16;
            output[0] += ColorInput.hexValue[cssColor[2]];
            output[1] += ColorInput.hexValue[cssColor[3]] * 16;
            output[1] += ColorInput.hexValue[cssColor[4]];
            output[2] += ColorInput.hexValue[cssColor[5]] * 16;
            output[2] += ColorInput.hexValue[cssColor[6]];
            output[3] = ColorInput.hexValue[cssColor[7]] * 16;
            output[3] += ColorInput.hexValue[cssColor[8]];
            output[3] /= 255;
        } else if (/^#[0-9a-f]{6,}$/.test (cssColor)) {
            // #86cdab
            output[0] += ColorInput.hexValue[cssColor[1]] * 16;
            output[0] += ColorInput.hexValue[cssColor[2]];
            output[1] += ColorInput.hexValue[cssColor[3]] * 16;
            output[1] += ColorInput.hexValue[cssColor[4]];
            output[2] += ColorInput.hexValue[cssColor[5]] * 16;
            output[2] += ColorInput.hexValue[cssColor[6]];
        } else if (/^#[0-9a-f]{4,}$/.test (cssColor)) {
            // #abcd
            output[0] += ColorInput.hexValue[cssColor[1]] * 17;
            output[1] += ColorInput.hexValue[cssColor[2]] * 17;
            output[2] += ColorInput.hexValue[cssColor[3]] * 17;
            output[3] += ColorInput.hexValue[cssColor[4]] * 17;
            output[3] /= 255;
        } else if (/^#[0-9a-f]{3,}$/.test (cssColor)) {
            // #abc
            output[0] += ColorInput.hexValue[cssColor[1]] * 17;
            output[1] += ColorInput.hexValue[cssColor[2]] * 17;
            output[2] += ColorInput.hexValue[cssColor[3]] * 17;
        } else if (/^rgb(a)?\([ ]*[0-9]{1,3}[ ]*,[ ]*[0-9]{1,3}[ ]*,[ ]*[0-9]{1,3}(.)*$/.test (cssColor)) {
            // rgb(1,1,1)
            // rgb(100, 200, 250)
            // rgba(12, 1, 123, 0.6)
            // rgba( 0 , 0 , 0 , 0 )
            // Only parse RGB for rbga values
            let rawValues = cssColor.split ("(")[1].split (",");
            
            output[0] = parseInt (rawValues[0]);
            output[1] = parseInt (rawValues[1]);
            output[2] = parseInt (rawValues[2]);
            if (output.length > 3) {
                output[3] = parseFloat (rawValues[3]);
            }
        } else {
            console.warn ("CSSColor didn't match any regex: ", cssColor);
        }
        
        output[0] = Math.min (Math.max (output[0], 0), 255);
        output[1] = Math.min (Math.max (output[1], 0), 255);
        output[2] = Math.min (Math.max (output[2], 0), 255);
        output[3] = Math.min (Math.max (output[3], 0), 1.0);
        
        return output;
    }
    
    private static RGBtoHSV (color: RGBA): HSVA {
        // https://www.rapidtables.com/convert/color/rgb-to-hsv.html
        let color0_1: [number, number, number] = [
            color[0] / 255,
            color[1] / 255,
            color[2] / 255
        ];
        
        let Cmax = Math.max (color0_1[0], color0_1[1], color0_1[2]);
        let Cmin = Math.min (color0_1[0], color0_1[1], color0_1[2]);
        let delta = Cmax - Cmin;
        
        let h: number;
        if (delta == 0) {
            h = 0;
        } else if (Cmax == color0_1[0]) {
            h = 60 * (((color0_1[1] - color0_1[2]) / delta) % 6);
        } else if (Cmax == color0_1[1]) {
            h = 60 * (((color0_1[2] - color0_1[0]) / delta) + 2);
        } else {
            h = 60 * (((color0_1[0] - color0_1[1]) / delta) + 4);
        }
        
        let s: number;
        if (Cmax == 0) {
            s = 0;
        } else {
            s = delta / Cmax;
        }
        
        let v = Cmax;
        
        return [h, s, v, color[3]];
    }
    
    private static HSVtoRGB (color: HSVA): RGBA {
        // https://www.rapidtables.com/convert/color/hsv-to-rgb.html
        let [h, s, v, a] = color;
        
        let c = v * s;
        let x = c * (1 - Math.abs (((h / 60) % 2) - 1));
        let m = v - c;
        
        let RGBtmp: [number, number, number];
        
        if (h < 60) {
            RGBtmp = [c, x, 0];
        } else if (h < 120) {
            RGBtmp = [x, c, 0];
        } else if (h < 180) {
            RGBtmp = [0, c, x];
        } else if (h < 240) {
            RGBtmp = [0, x, c];
        } else if (h < 300) {
            RGBtmp = [x, 0, c];
        } else {
            RGBtmp = [c, 0, x];
        }
        
        let r = Math.round ((RGBtmp[0] + m) * 255);
        let g = Math.round ((RGBtmp[1] + m) * 255);
        let b = Math.round ((RGBtmp[2] + m) * 255);
        
        return [r, g, b, a];
    }
    
    private static RGBToCSSColor (color: RGBA) {
        return `rgba(${ color[0] }, ${ color[1] }, ${ color[2] }, ${ color[3] })`;
    }
    
    private static RGBToHTMLColor (color: RGBA) {
        let [r, g, b, a] = color;
        a = Math.round (a * 255);
        return `#${
            this.hexLookup[Math.floor (r / 16)] }${ this.hexLookup[r % 16]
        }${ this.hexLookup[Math.floor (g / 16)] }${ this.hexLookup[g % 16]
        }${ this.hexLookup[Math.floor (b / 16)] }${ this.hexLookup[b % 16]
        }${ this.hexLookup[Math.floor (a / 16)] }${ this.hexLookup[a % 16]
        }`; // #12345678 <- #RRGGBBAA
    }
    
    private static HSVToCSSColor (color: HSVA) {
        return this.RGBToCSSColor (this.HSVtoRGB (color));
    }
    
    public static HookInput (trigger: HTMLElement, target: HTMLInputElement) {
        trigger.addEventListener ("click", () => {
            this.StartTransaction (trigger, target);
        });
    }
    
    private static StartTransaction (trigger: HTMLElement, target: HTMLInputElement) {
        // Setup the revert button
        let valueBackup = target.value;
        this.ElementRevert.onclick = () => {
            target.value = valueBackup;
            // Doesn't fire on its own
            let event = document.createEvent("HTMLEvents");
            event.initEvent("input", false, true);
            target.dispatchEvent(event);
            
            FullscreenWindows["color-box"].style.display = "none";
            this.EndTransaction ();
        };
        
        // Display the picker
        document.getElementById ("color-box")!.style.display = "block";
        
        // Move the picker in the right position
        if (this.CurrentResizeListener != null) {
            window.removeEventListener ("resize", this.CurrentResizeListener);
        }
        
        this.CurrentResizeListener = () => {
            let triggerBox = trigger.getBoundingClientRect ();
            let containerBox = this.ElementContainer.getBoundingClientRect ();
            
            let finalX = triggerBox.left - containerBox.width;
            finalX = Math.max (finalX, 0);
            let finalY = triggerBox.top;
            if (finalY + containerBox.height > window.innerHeight) {
                finalY = triggerBox.top + triggerBox.height - containerBox.height;
            }
            finalY = Math.max (finalY, 0);
            
            this.ElementContainer.style.left = `${ finalX }px`;
            this.ElementContainer.style.top = `${ finalY }px`;
        }
        
        this.CurrentResizeListener ();
        window.addEventListener ("resize", this.CurrentResizeListener);
        
        // Set current input's value to the picker
        this.SetRGBColor (this.ParseRGB (target.value));
        
        // Bind the input to the picker's output
        this.CurrentlyTargetedInput = target;
        
    }
    
    private static EndTransaction () {
        this.CurrentlyTargetedInput = null;
        if (this.CurrentResizeListener) {
            window.removeEventListener ("resize", this.CurrentResizeListener);
            this.CurrentResizeListener = null;
        }
    }
    
    private static SetRGBColor (color: RGBA) {
        this.CurrentColorRGB = color;
        this.CurrentColorHSV = this.RGBtoHSV (color);
        this.OnColorUpdate ();
    }
    
    private static SetHSVColor (color: HSVA) {
        this.CurrentColorHSV = color;
        this.CurrentColorRGB = this.HSVtoRGB (color);
        this.OnColorUpdate ();
    }
    
    private static OnColorUpdate () {
        this.ApplyCurrentColorToInputs ();
        this.ApplyCurrentColorToTargetedInput ();
    }
    
    private static SetLock (lock: "R" | "G" | "B") {
        this.CurrentLock = lock;
        this.ApplyCurrentColorToInputs ();
    }
    
    private static ApplyCurrentColorToInputs () {
        let A, B, C, D: RGBA;
        let [r, g, b, a] = this.CurrentColorRGB;
        let [h, s, v] = this.CurrentColorHSV;
        
        if (this.CurrentLock == "R") {
            A = [r,   0, 255, 1.0] as RGBA;
            B = [r, 255, 255, 1.0] as RGBA;
            C = [r,   0,   0, 1.0] as RGBA;
            D = [r, 255,   0, 1.0] as RGBA;
            this.ElementSquareMeter.style.left = `${ g }px`;
            this.ElementSquareMeter.style.top = `${ 255 - b }px`;
        } else if (this.CurrentLock == "G") {
            A = [  0, g, 255, 1.0] as RGBA;
            B = [255, g, 255, 1.0] as RGBA;
            C = [  0, g,   0, 1.0] as RGBA;
            D = [255, g,   0, 1.0] as RGBA;
            this.ElementSquareMeter.style.left = `${ r }px`;
            this.ElementSquareMeter.style.top = `${ 255 - b }px`;
        } else {
            A = [  0, 255, b, 1.0] as RGBA;
            B = [255, 255, b, 1.0] as RGBA;
            C = [  0,   0, b, 1.0] as RGBA;
            D = [255,   0, b, 1.0] as RGBA;
            this.ElementSquareMeter.style.left = `${ r }px`;
            this.ElementSquareMeter.style.top = `${ 255 - g }px`;
        }
        
        this.ElementSquareX.style.background =
        `linear-gradient(to right, ${ this.RGBToCSSColor (A) }, ${ this.RGBToCSSColor (B) })`;
        this.ElementSquareY.style.background =
        `linear-gradient(to right, ${ this.RGBToCSSColor (C) }, ${ this.RGBToCSSColor (D) })`;
        
        this.ElementR.style.background =
        `linear-gradient(to right, ${
            this.RGBToCSSColor ([  0, g, b, 1.0])
        }, ${
            this.RGBToCSSColor ([255, g, b, 1.0])
        })`;
        this.ElementRMeter.style.left = `${ r }px`;
        
        this.ElementG.style.background =
        `linear-gradient(to right, ${
            this.RGBToCSSColor ([r,   0, b, 1.0])
        }, ${
            this.RGBToCSSColor ([r, 255, b, 1.0])
        })`;
        this.ElementGMeter.style.left = `${ g }px`;
        
        this.ElementB.style.background =
        `linear-gradient(to right, ${
            this.RGBToCSSColor ([r, g,   0, 1.0])
        }, ${
            this.RGBToCSSColor ([r, g, 255, 1.0])
        })`;
        this.ElementBMeter.style.left = `${ b }px`;
        
        this.ElementS.style.background =
        `linear-gradient(to top, ${
            this.HSVToCSSColor ([h, 0.0, v, 1.0])
        }, ${
            this.HSVToCSSColor ([h, 1.0, v, 1.0])
        })`;
        this.ElementSMeter.style.bottom = `${ s * 255 }px`;
        
        this.ElementV.style.background =
        `linear-gradient(to top, ${
            this.HSVToCSSColor ([h, s, 0.0, 1.0])
        }, ${
            this.HSVToCSSColor ([h, s, 1.0, 1.0])
        })`;
        this.ElementVMeter.style.bottom = `${ v * 255 }px`;
        
        this.ElementA.style.background = this.RGBToCSSColor ([r, g, b, 1.0]);
        this.ElementAMeter.style.bottom = `${ a * 255 }px`;
        
        this.ElementPreview.style.background = this.RGBToCSSColor ([r, g, b, a]);
        if (!this.DO_NOT_UPDATE_INPUT_OVERRIDE) {
            this.ElementPreviewInput.value = this.RGBToHTMLColor ([r, g, b, a]);
        }
    }
    
    private static ApplyCurrentColorToTargetedInput () {
        if (this.CurrentlyTargetedInput != null) {
            this.CurrentlyTargetedInput.value = this.RGBToCSSColor (this.CurrentColorRGB);
            
            // Doesn't fire on its own
            let event = document.createEvent("HTMLEvents");
            event.initEvent("input", false, true);
            this.CurrentlyTargetedInput.dispatchEvent(event);
        }
    }
    
    private static Initialized = false;
    public static Initialize () {
        if (this.Initialized) { return; }
        
        this.ElementContainer = document.getElementById ("color-selector-container") as HTMLDivElement;
        this.ElementSquareX = document.getElementById ("color-selector-squareX") as HTMLDivElement;
        this.ElementSquareY = document.getElementById ("color-selector-squareY") as HTMLDivElement;
        this.ElementSquareOverlay = document.getElementById ("color-selector-squareOverlay") as HTMLDivElement;
        this.ElementSquareMeter = this.ElementSquareOverlay.querySelector (".circular-color-meter") as HTMLDivElement;
        this.ElementR = document.getElementById ("color-selector-r") as HTMLDivElement;
        this.ElementRMeter = this.ElementR.querySelector (".color-meter-vertical") as HTMLDivElement;
        this.ElementG = document.getElementById ("color-selector-g") as HTMLDivElement;
        this.ElementGMeter = this.ElementG.querySelector (".color-meter-vertical") as HTMLDivElement;
        this.ElementB = document.getElementById ("color-selector-b") as HTMLDivElement;
        this.ElementBMeter = this.ElementB.querySelector (".color-meter-vertical") as HTMLDivElement;
        this.ElementS = document.getElementById ("color-selector-s") as HTMLDivElement;
        this.ElementSMeter = this.ElementS.querySelector (".color-meter-horizontal") as HTMLDivElement;
        this.ElementV = document.getElementById ("color-selector-v") as HTMLDivElement;
        this.ElementVMeter = this.ElementV.querySelector (".color-meter-horizontal") as HTMLDivElement;
        this.ElementA = document.getElementById ("color-selector-a") as HTMLDivElement;
        this.ElementAOverlay = document.getElementById ("color-selector-a-overlay") as HTMLDivElement;
        this.ElementAMeter = this.ElementAOverlay.querySelector (".color-meter-horizontal") as HTMLDivElement;
        this.ElementPreview = document.getElementById ("color-selector-preview") as HTMLDivElement;
        this.ElementPreviewInput = document.getElementById ("color-selector-preview-input") as HTMLInputElement;
        this.ElementApply = document.getElementById ("color-selector-apply") as HTMLImageElement;
        this.ElementRevert = document.getElementById ("color-selector-revert") as HTMLImageElement;
        
        document.getElementById ("color-box")!.querySelector (".fullscreen-grayout")!.addEventListener ("click", () => {
            this.EndTransaction ();
        });
        
        this.ElementSquareOverlay.oncontextmenu = () => false;
        this.ElementSquareOverlay.addEventListener ("pointerdown", _e => {
            // TS doesn't see these properties of this event
            let e = _e as PointerEvent & { layerX: number, layerY: number };
            let [r, g, b, a] = this.CurrentColorRGB;
            
            // RMB
            if (e.button == 2) {
                if (this.CurrentLock == "R") {
                    this.SetLock ("G");
                } else if (this.CurrentLock == "G") {
                    this.SetLock ("B");
                } else {
                    this.SetLock ("R");
                }
                
                return;
            }
            
            let startX = Input.MouseX;
            let startY = Input.MouseY;
            Dragger.Drag (() => {
                if (this.CurrentLock == "R") {
                    g =       Math.min (Math.max (Input.MouseX - startX + e.layerX, 0), 255);
                    b = 255 - Math.min (Math.max (Input.MouseY - startY + e.layerY, 0), 255);
                } else if (this.CurrentLock == "G") {
                    r =       Math.min (Math.max (Input.MouseX - startX + e.layerX, 0), 255);
                    b = 255 - Math.min (Math.max (Input.MouseY - startY + e.layerY, 0), 255);
                } else {
                    r =       Math.min (Math.max (Input.MouseX - startX + e.layerX, 0), 255);
                    g = 255 - Math.min (Math.max (Input.MouseY - startY + e.layerY, 0), 255);
                }
                
                this.SetRGBColor ([r, g, b, a]);
            });
        });
        
        this.ElementR.oncontextmenu = () => false;
        this.ElementR.addEventListener ("pointerdown", _e => {
            // TS doesn't see these properties of this event
            let e = _e as PointerEvent & { layerX: number, layerY: number };
            let [r, g, b, a] = this.CurrentColorRGB;
            
            // RMB
            if (e.button == 2) {
                this.SetLock ("R");
                return;
            }
            
            let startX = Input.MouseX;
            Dragger.Drag (() => {
                r = Math.min (Math.max (Input.MouseX - startX + e.layerX, 0), 255);
                this.SetRGBColor ([r, g, b, a]);
            });
        });
        
        this.ElementG.oncontextmenu = () => false;
        this.ElementG.addEventListener ("pointerdown", _e => {
            // TS doesn't see these properties of this event
            let e = _e as PointerEvent & { layerX: number, layerY: number };
            let [r, g, b, a] = this.CurrentColorRGB;
            
            // RMB
            if (e.button == 2) {
                this.SetLock ("G");
                return;
            }
            
            let startX = Input.MouseX;
            Dragger.Drag (() => {
                g = Math.min (Math.max (Input.MouseX - startX + e.layerX, 0), 255);
                this.SetRGBColor ([r, g, b, a]);
            });
        });
        
        this.ElementB.oncontextmenu = () => false;
        this.ElementB.addEventListener ("pointerdown", _e => {
            // TS doesn't see these properties of this event
            let e = _e as PointerEvent & { layerX: number, layerY: number };
            let [r, g, b, a] = this.CurrentColorRGB;
            
            // RMB
            if (e.button == 2) {
                this.SetLock ("B");
                return;
            }
            
            let startX = Input.MouseX;
            Dragger.Drag (() => {
                b = Math.min (Math.max (Input.MouseX - startX + e.layerX, 0), 255);
                this.SetRGBColor ([r, g, b, a]);
            });
        });
        
        this.ElementS.oncontextmenu = () => false;
        this.ElementS.addEventListener ("pointerdown", _e => {
            // TS doesn't see these properties of this event
            let e = _e as PointerEvent & { layerX: number, layerY: number };
            let [h, s, v, a] = this.CurrentColorHSV;
            
            let startY = Input.MouseY;
            Dragger.Drag (() => {
                s = Math.min (Math.max ((startY - Input.MouseY + 255 - e.layerY) / 255, 0), 1);
                this.SetHSVColor ([h, s, v, a]);
            });
        });
        
        this.ElementV.oncontextmenu = () => false;
        this.ElementV.addEventListener ("pointerdown", _e => {
            // TS doesn't see these properties of this event
            let e = _e as PointerEvent & { layerX: number, layerY: number };
            let [h, s, v, a] = this.CurrentColorHSV;
            
            let startY = Input.MouseY;
            Dragger.Drag (() => {
                v = Math.min (Math.max ((startY - Input.MouseY + 255 - e.layerY) / 255, 0), 1);
                this.SetHSVColor ([h, s, v, a]);
            });
        });
        
        this.ElementAOverlay.oncontextmenu = () => false;
        this.ElementAOverlay.addEventListener ("pointerdown", _e => {
            // TS doesn't see these properties of this event
            let e = _e as PointerEvent & { layerX: number, layerY: number };
            let [h, s, v, a] = this.CurrentColorHSV;
            
            let startY = Input.MouseY;
            Dragger.Drag (() => {
                a = Math.min (Math.max ((startY - Input.MouseY + 255 - e.layerY) / 255, 0), 1);
                this.SetHSVColor ([h, s, v, a]);
            });
        });
        
        this.ElementApply.addEventListener ("click", () => {
            FullscreenWindows["color-box"].style.display = "none";
            this.EndTransaction ();
        });
        
        this.ElementPreviewInput.addEventListener ("input", () => {
            this.DO_NOT_UPDATE_INPUT_OVERRIDE = true;
            this.SetRGBColor (this.ParseRGB (this.ElementPreviewInput.value));
            this.DO_NOT_UPDATE_INPUT_OVERRIDE = false;
        });
        
    }
    
}

// Setup the color picker
document.addEventListener ("DOMContentLoaded", () => {
    ColorInput.Initialize ();
});