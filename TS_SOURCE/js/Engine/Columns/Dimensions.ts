namespace EngineEditableFieldMetadata {
    export const Dimensions: IEditable<Engine> = {
        GetDisplayElement: () => {
            let tmp = document.createElement ("div");
            tmp.classList.add ("content-cell-content");
            return tmp;
        }, ApplyValueToDisplayElement: (e, engine) => {
            e.innerHTML = `↔${Unit.Display (engine.Width, "m", false, 9)} x ↕${Unit.Display (engine.Height, "m", false, 9)}`;
        }, GetEditElement: () => {
            let tmp = document.createElement ("div");
            tmp.classList.add ("content-cell-content");
            tmp.style.height = "76px";
            tmp.style.padding = "0";
            
            let grid = document.createElement ("div");
            grid.style.display = "grid";
            grid.style.gridTemplateColumns = "62px auto 2px 24px 2px";
            grid.style.gridTemplateRows = "24px 24px 2px 24px";
            grid.style.gridTemplateAreas = `
                "a a a a z"
                "b c c c z"
                "x x x x x"
                "e f q g y"
            `;
            
            grid.innerHTML = `
                <div class="content-cell-content" style="grid-area: a;"></div>
                <div class="content-cell-content" style="grid-area: b;">Width</div>
                <div style="grid-area: c;"><input style="width: calc(100%);"></div>
                <div class="content-cell-content" style="grid-area: e;">Height</div>
                <div style="grid-area: f;"><input style="width: calc(100%);"></div>
                <div style="grid-area: g;"><img class="option-button stretch" title="Set height matching the width and model" src="img/button/aspectRatio.png"></div>
            `;
            
            let checkboxLabel = document.createElement ("span");
            let checkbox = document.createElement ("input");
            
            checkboxLabel.style.position = "relative";
            checkboxLabel.style.top = "-4px";
            checkboxLabel.style.left = "4px";
            
            checkbox.type = "checkbox";
            
            checkbox.addEventListener ("change", e => {
                checkboxLabel.innerHTML = checkbox.checked ? "Base width" : "Bell width";
            });
            
            grid.children[0].appendChild (checkbox);
            grid.children[0].appendChild (checkboxLabel);
            
            tmp.appendChild (grid);
            
            return tmp;
        }, ApplyValueToEditElement: (e, engine) => {
            let inputs = e.querySelectorAll ("input");
            
            inputs[0].checked = engine.UseBaseWidth;
            inputs[1].value = Unit.Display (engine.Width, "m", false);
            inputs[2].value = Unit.Display (engine.Height, "m", false);
            
            // Not an 'addEventListener' to replace current listener, not add another one
            e.querySelector ("img")!.onclick = () => {
                console.log ("p");
                
                let modelInfo = ModelInfo.GetModelInfo (engine.GetModelID ());
                inputs[2].value = Unit.Display (
                    Unit.Parse (inputs[1].value, "m") * modelInfo.OriginalHeight / (inputs[0].checked ? modelInfo.OriginalBaseWidth : modelInfo.OriginalBellWidth),
                    "m",
                    false,
                    3
                );
            };
            
            e.querySelector ("span")!.innerHTML = inputs[0].checked ? "Base width" : "Bell width";
        }, ApplyChangesToValue: (e, engine) => {
            let inputs = e.querySelectorAll ("input");
            
            engine.UseBaseWidth = inputs[0].checked;
            engine.Width = Unit.Parse (inputs[1].value, "m");
            engine.Height = Unit.Parse (inputs[2].value, "m");
        }
    };
}