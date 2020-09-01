namespace EngineEditableFieldMetadata {
    export const Dimensions: IEditable<Engine> = {
        GetDisplayElement: () => {
            let tmp = document.createElement ("div");
            tmp.classList.add ("content-cell-content");
            return tmp;
        }, ApplyValueToDisplayElement: (e, engine) => {
            e.innerHTML = `↔${ Unit.Display (engine.GetBaseWidth (), "m", false, 3) } x ↕${ Unit.Display (engine.Height, "m", false, 3) }`;
        }, GetEditElement: () => {
            let tmp = document.createElement ("div");
            tmp.classList.add ("content-cell-content");
            tmp.style.height = "80px";
            tmp.style.padding = "0";
            
            let grid = document.createElement ("div");
            grid.style.display = "grid";
            grid.style.gridTemplateColumns = "76px auto 2px 24px 2px";
            grid.style.gridTemplateRows = "2px 24px 2px 24px 2px 24px";
            grid.style.gridTemplateAreas = `
                ". . . . ."
                "a h h h ."
                ". . . . ."
                "b c c c ."
                ". . . . ."
                "e f q g ."
            `;
            
            grid.innerHTML = `
                <div class="content-cell-content" style="grid-area: a;">Bell ↔</div>
                <div style="grid-area: h;"><input style="width: calc(100%);"></div>
                <div class="content-cell-content" style="grid-area: b;">Base ↔</div>
                <div style="grid-area: c;"><input style="width: calc(100%);"></div>
                <div class="content-cell-content" style="grid-area: e;">Height ↕</div>
                <div style="grid-area: f;"><input style="width: calc(100%);"></div>
                <div style="grid-area: g;"><img class="option-button stretch" title="Set height matching the width and model" src="svg/button/aspectRatio.svg"></div>
            `;
            
            tmp.appendChild (grid);
            
            return tmp;
        }, ApplyValueToEditElement: (e, engine) => {
            let inputs = e.querySelectorAll ("input");
            const modelInfo = ModelInfo.GetModelInfo (engine.GetModelID ());
            const baseToBellRatio = modelInfo.OriginalBaseWidth / modelInfo.OriginalBellWidth;
            
            const updateBellWidth = () => {
                inputs[0].value = Unit.Display (Unit.Parse (inputs[1].value, "m") / baseToBellRatio, "m", false, 3);
            };
            
            const updateBaseWidth = () => {
                inputs[1].value = Unit.Display (Unit.Parse (inputs[0].value, "m") * baseToBellRatio, "m", false, 3);
            };
            
            // Legacy input handling
            if (engine.UseBaseWidth) {
                inputs[1].value = Unit.Display (engine.Width, "m", false, 3);
                updateBellWidth ();
            } else {
                inputs[0].value = Unit.Display (engine.Width, "m", false, 3);
                updateBaseWidth ();
            }
            
            inputs[2].value = Unit.Display (engine.Height, "m", false, 3);
            
            inputs[0].oninput = () => {
                updateBaseWidth ();
            };
            
            inputs[1].oninput = () => {
                updateBellWidth ();
            };
            
            // Not an 'addEventListener' to replace current listener, not add another one
            e.querySelector ("img")!.onclick = () => {
                inputs[2].value = Unit.Display (
                    Unit.Parse (inputs[1].value, "m") * modelInfo.OriginalHeight / modelInfo.OriginalBaseWidth,
                    "m",
                    false,
                    3
                );
            };
            
        }, ApplyChangesToValue: (e, engine) => {
            let inputs = e.querySelectorAll ("input");
            
            engine.UseBaseWidth = true;
            engine.Width = Unit.Parse (inputs[1].value, "m");
            engine.Height = Unit.Parse (inputs[2].value, "m");
        }
    };
}