namespace EngineEditableFieldMetadata {
    export const Propulsion: IEditable<Engine> = {
        ApplyValueToDisplayElement: (e, engine) => {
            e.innerHTML = `${
                Unit.Display (engine.Thrust, "kN", Settings.classic_unit_display, 6)
            } | ${
                Unit.Display (engine.AtmIsp, "s", true, 3)
            }-${
                Unit.Display (engine.VacIsp, "s", true, 3)
            }`;
        }, GetEditElement: () => {
            let output = document.createElement ("div");
            output.classList.add ("propulsionContainer");
            output.classList.add ("content-cell-content");
            output.style.height = "100px";
            output.style.padding = "0";
            
            let thrustLabel = document.createElement ("div");
            let vacImpulseLabel = document.createElement ("div");
            let massFlowLabel = document.createElement ("div");
            let slImpulseLabel = document.createElement ("div");
            
            let thrustInput = document.createElement ("input");
            let vacImpulseInput = document.createElement ("input");
            let massFlowInput = document.createElement ("input");
            let slImpulseInput = document.createElement ("input");
            
            let thrustCheckbox = document.createElement ("input");
            let vacImpulseCheckbox = document.createElement ("input");
            let massFlowCheckbox = document.createElement ("input");
            let slImpulseCheckbox = document.createElement ("input");
            
            { // Classes
                thrustLabel.classList.add ("thrustLabel");
                vacImpulseLabel.classList.add ("vacImpulseLabel");
                massFlowLabel.classList.add ("massFlowLabel");
                slImpulseLabel.classList.add ("slImpulseLabel");
                
                thrustInput.classList.add ("thrustInput");
                vacImpulseInput.classList.add ("vacImpulseInput");
                massFlowInput.classList.add ("massFlowInput");
                slImpulseInput.classList.add ("slImpulseInput");
                
                thrustCheckbox.classList.add ("thrustCheckbox");
                vacImpulseCheckbox.classList.add ("vacImpulseCheckbox");
                massFlowCheckbox.classList.add ("massFlowCheckbox");
                slImpulseCheckbox.classList.add ("slImpulseCheckbox");
            }
            
            { // Grid setup
                thrustLabel.style.gridArea = "tl";
                vacImpulseLabel.style.gridArea = "vl";
                massFlowLabel.style.gridArea = "ml";
                slImpulseLabel.style.gridArea = "sl";
                
                thrustInput.style.gridArea = "ti";
                vacImpulseInput.style.gridArea = "vi";
                massFlowInput.style.gridArea = "mi";
                slImpulseInput.style.gridArea = "si";
                
                thrustCheckbox.style.gridArea = "tc";
                vacImpulseCheckbox.style.gridArea = "vc";
                massFlowCheckbox.style.gridArea = "mc";
                slImpulseCheckbox.style.gridArea = "sc";
            }
            
            { // HTML Setup
                thrustLabel.innerHTML = "Thrust";
                vacImpulseLabel.innerHTML = "Vac Isp";
                massFlowLabel.innerHTML = "Mass flow";
                slImpulseLabel.innerHTML = "SL Isp";
                
                vacImpulseLabel.classList.add ("abbr");
                vacImpulseLabel.title = "Vacuum specific impulse";
                
                slImpulseLabel.classList.add ("abbr");
                slImpulseLabel.title = "Sea level specific impulse";
                
            }
            
            return output;
        }, ApplyValueToEditElement: (e, engine) => {
            (e as HTMLInputElement).value = Unit.Display (engine.VacIsp, "s", true);
        }, ApplyChangesToValue: (e, engine) => {
            engine.VacIsp = Unit.Parse ((e as HTMLInputElement).value, "s");
        }
    };
}