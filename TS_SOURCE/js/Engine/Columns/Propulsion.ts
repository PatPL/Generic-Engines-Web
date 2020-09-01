namespace EngineEditableFieldMetadata {
    const MF_GetFlow_t = (thrust_kN: number, impulse_s: number) => thrust_kN / GRAVITY / impulse_s;
    const MF_GetThrust_kN = (massflow_t: number, impulse_s: number) => massflow_t * GRAVITY * impulse_s;
    const MF_GetIsp_s = (thrust_kN: number, massflow_t: number) => thrust_kN / GRAVITY / massflow_t;
    
    export const Propulsion: IEditable<Engine> = {
        ApplyValueToDisplayElement: (e, engine) => {
            e.innerHTML = `${
                Unit.Display (engine.Thrust, "kN", Settings.classic_unit_display, 6)
            } | ${
                Unit.Display (engine.VacIsp, "s", true, 3)
            }-${
                Unit.Display (engine.AtmIsp, "s", true, 3)
            }`;
        }, GetEditElement: () => {
            let output = document.createElement ("div");
            
            let container = document.createElement ("div");
            container.classList.add ("propulsionContainer");
            container.classList.add ("content-cell-content");
            output.appendChild (container);
            
            let thrustLabel = document.createElement ("div");
            let vacImpulseLabel = document.createElement ("div");
            let massFlowLabel = document.createElement ("div");
            let slImpulseLabel = document.createElement ("div");
            
            let thrustInput = document.createElement ("input");
            let vacImpulseInput = document.createElement ("input");
            let massFlowInput = document.createElement ("input");
            let slImpulseInput = document.createElement ("input");
            
            let thrustCheckbox = document.createElement ("input");
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
                massFlowCheckbox.style.gridArea = "mc";
                slImpulseCheckbox.style.gridArea = "sc";
            }
            
            { // Appending to container element
                container.appendChild (thrustLabel);
                container.appendChild (vacImpulseLabel);
                container.appendChild (massFlowLabel);
                container.appendChild (slImpulseLabel);
                
                container.appendChild (thrustInput);
                container.appendChild (vacImpulseInput);
                container.appendChild (massFlowInput);
                container.appendChild (slImpulseInput);
                
                container.appendChild (thrustCheckbox);
                container.appendChild (massFlowCheckbox);
                container.appendChild (slImpulseCheckbox);
            }
            
            { // HTML Setup
                // Labels
                thrustLabel.innerHTML = "Thrust";
                vacImpulseLabel.innerHTML = "Vac Isp";
                massFlowLabel.innerHTML = "Mass flow";
                slImpulseLabel.innerHTML = "SL Isp";
                
                vacImpulseLabel.classList.add ("abbr");
                vacImpulseLabel.title = "Vacuum specific impulse";
                
                slImpulseLabel.classList.add ("abbr");
                slImpulseLabel.title = "Sea level specific impulse";
                
                massFlowLabel.classList.add ("abbr");
                massFlowLabel.title = "Fuel mass consumed per second at 100% thrust";
                
                // Checkboxes
                thrustCheckbox.type = "checkbox";
                massFlowCheckbox.type = "checkbox";
                slImpulseCheckbox.type = "checkbox";
                
                thrustCheckbox.title = "Lock";
                massFlowCheckbox.title = "Lock";
                slImpulseCheckbox.title = "Keep the Vac/SL Isp ratio";
            }
            
            { // Checkbox events
                const clearLock = () => {
                    thrustInput.disabled = false;
                    vacImpulseInput.disabled = false;
                    massFlowInput.disabled = false;
                    slImpulseInput.disabled = false;
                    
                    thrustCheckbox.checked = false;
                    massFlowCheckbox.checked = false;
                }
                
                thrustCheckbox.addEventListener ("change", () => {
                    if (thrustCheckbox.checked) {
                        thrustInput.disabled = true;
                        vacImpulseInput.disabled = false;
                        massFlowInput.disabled = false;
                        slImpulseInput.disabled = false;
                        
                        massFlowCheckbox.checked = false;
                    } else {
                        clearLock ();
                    }
                });
                
                massFlowCheckbox.addEventListener ("change", () => {
                    if (massFlowCheckbox.checked) {
                        thrustInput.disabled = false;
                        vacImpulseInput.disabled = false;
                        massFlowInput.disabled = true;
                        slImpulseInput.disabled = false;
                        
                        thrustCheckbox.checked = false;
                    } else {
                        clearLock ();
                    }
                });
                
                // slImpulseCheckbox needs no special handling
            }
            
            { // Input events
                const getCurrentInputValues = () => ({
                    thrust: Unit.Parse (thrustInput.value, "kN"),
                    vacIsp: Unit.Parse (vacImpulseInput.value, "s"),
                    massFlow: Unit.Parse (massFlowInput.value, "t"),
                    slIsp: Unit.Parse (slImpulseInput.value, "s")
                });
                
                const setDerivedThrust = () => {
                    let currentValues = getCurrentInputValues ();
                    
                    thrustInput.value = Unit.Display (
                        MF_GetThrust_kN (currentValues.massFlow, currentValues.vacIsp),
                        "kN",
                        Settings.classic_unit_display
                    );
                }
                
                const setDerivedIsp = () => {
                    let currentValues = getCurrentInputValues ();
                    
                    vacImpulseInput.value = Unit.Display (
                        MF_GetIsp_s (currentValues.thrust, currentValues.massFlow),
                        "s",
                        true
                    );
                    
                    handlePossibleIspChange ();
                }
                
                const setDerivedMassFlow = () => {
                    let currentValues = getCurrentInputValues ();
                    
                    massFlowInput.value = Unit.Display (
                        MF_GetFlow_t (currentValues.thrust, currentValues.vacIsp),
                        "t",
                        Settings.classic_unit_display
                    );
                }
                
                const handlePossibleIspChange = () => {
                    let currentValues = getCurrentInputValues ();
                    let previousVacIsp = Unit.Parse (vacImpulseInput.getAttribute ("previousValue")!, "s");
                    let previousSLIsp = Unit.Parse (slImpulseInput.getAttribute ("previousValue")!, "s");
                    if (slImpulseCheckbox.checked && currentValues.vacIsp && currentValues.slIsp) {
                        // Isp lock enabled
                        // Can only handle one change at a time
                        if (currentValues.vacIsp != previousVacIsp) {
                            // VacIsp was changed
                            slImpulseInput.value = Unit.Display (previousSLIsp * currentValues.vacIsp / previousVacIsp, "s", true);
                        } else if (currentValues.slIsp != previousSLIsp) {
                            // SLIsp was changed
                            vacImpulseInput.value = Unit.Display (previousVacIsp * currentValues.slIsp / previousSLIsp, "s", true);
                        }
                    }
                    
                    // If != 0 and != NaN
                    if (currentValues.vacIsp && currentValues.slIsp) {
                        vacImpulseInput.setAttribute ("previousValue", vacImpulseInput.value);
                        slImpulseInput.setAttribute ("previousValue", slImpulseInput.value);
                    }
                }
                
                thrustInput.addEventListener ("input", () => {
                    if (massFlowCheckbox.checked) {
                        // Mass flow locked, change Isp.
                        setDerivedIsp ();
                    } else {
                        // Mass flow not locked, change it.
                        setDerivedMassFlow ();
                    }
                });
                
                vacImpulseInput.addEventListener ("input", () => {
                    if (massFlowCheckbox.checked) {
                        // Mass flow locked, change thrust.
                        setDerivedThrust ();
                    } else {
                        // Mass flow not locked, change it.
                        setDerivedMassFlow ();
                    }
                    
                    handlePossibleIspChange ();
                });
                
                massFlowInput.addEventListener ("input", () => {
                    if (thrustCheckbox.checked) {
                        // Thrust locked, change Isp.
                        setDerivedIsp ();
                    } else {
                        // Thrust not locked, change it.
                        setDerivedThrust ();
                    }
                });
                
                slImpulseInput.addEventListener ("input", () => {
                    handlePossibleIspChange ();
                    
                    if (massFlowCheckbox.checked) {
                        // Mass flow locked, change thrust.
                        setDerivedThrust ();
                    } else {
                        // Mass flow not locked, change it.
                        setDerivedMassFlow ();
                    }
                    
                    handlePossibleIspChange ();
                });
                
            }
            
            return output;
        }, ApplyValueToEditElement: (e, engine) => {
            // Fetch elements
            let thrustInput = e.querySelector<HTMLInputElement> (".thrustInput")!;
            let vacImpulseInput = e.querySelector<HTMLInputElement> (".vacImpulseInput")!;
            let massFlowInput = e.querySelector<HTMLInputElement> (".massFlowInput")!;
            let slImpulseInput = e.querySelector<HTMLInputElement> (".slImpulseInput")!;
            
            let thrustCheckbox = e.querySelector<HTMLInputElement> (".thrustCheckbox")!;
            let massFlowCheckbox = e.querySelector<HTMLInputElement> (".massFlowCheckbox")!;
            let slImpulseCheckbox = e.querySelector<HTMLInputElement> (".slImpulseCheckbox")!;
            
            // Reset checkboxes
            thrustCheckbox.checked = false;
            massFlowCheckbox.checked = false;
            slImpulseCheckbox.checked = false;
            
            // Reset input field locks
            thrustInput.disabled = false;
            vacImpulseInput.disabled = false;
            massFlowInput.disabled = false;
            slImpulseInput.disabled = false;
            
            // Apply current values to input fields
            thrustInput.value = Unit.Display (engine.Thrust, "kN", Settings.classic_unit_display);
            vacImpulseInput.value = Unit.Display (engine.VacIsp, "s", true);
            massFlowInput.value = Unit.Display (MF_GetFlow_t (engine.Thrust, engine.VacIsp), "t", Settings.classic_unit_display);
            slImpulseInput.value = Unit.Display (engine.AtmIsp, "s", true);
            
            // Data needed for SL/Vac Isp lock
            vacImpulseInput.setAttribute ("previousValue", vacImpulseInput.value);
            slImpulseInput.setAttribute ("previousValue", slImpulseInput.value);
            
        }, ApplyChangesToValue: (e, engine) => {
            // Fetch elements
            let thrustInput = e.querySelector<HTMLInputElement> (".thrustInput")!;
            let vacImpulseInput = e.querySelector<HTMLInputElement> (".vacImpulseInput")!;
            let slImpulseInput = e.querySelector<HTMLInputElement> (".slImpulseInput")!;
            
            // Apply final values
            engine.Thrust = Unit.Parse (thrustInput.value, "kN");
            engine.VacIsp = Unit.Parse (vacImpulseInput.value, "s");
            engine.AtmIsp = Unit.Parse (slImpulseInput.value, "s");
        }
    };
}