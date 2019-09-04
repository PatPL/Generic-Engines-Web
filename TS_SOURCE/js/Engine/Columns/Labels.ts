namespace EngineEditableFieldMetadata {
    export const Labels: IEditable<Engine> = {
        GetDisplayElement: () => {
            let tmp = document.createElement ("div");
            tmp.classList.add ("content-cell-content");
            return tmp;
        }, ApplyValueToDisplayElement: (e, engine) => {
            e.innerHTML = engine.GetDisplayLabel ();
        }, GetEditElement: () => {
            let tmp = document.createElement ("div");
            tmp.classList.add ("content-cell-content");
            tmp.style.height = "192px";
            tmp.style.padding = "0";
            
            let grid = document.createElement ("div");
            grid.style.display = "grid";
            grid.style.gridTemplateColumns = "116px auto";
            grid.style.gridTemplateRows = "24px 24px 24px 120px";
            grid.style.gridTemplateAreas = `
                "a b"
                "c d"
                "e e"
                "f f"
            `;
            
            grid.innerHTML = `
                <div class="content-cell-content" style="grid-area: a;">Name</div>
                <div style="grid-area: b;"><input style="width: calc(100%);"></div>
                
                <div class="content-cell-content" style="grid-area: c;">Manufacturer</div>
                <div style="grid-area: d;"><input style="width: calc(100%);"></div>
                
                <div class="content-cell-content" style="grid-area: e;">Description</div>
                <div style="grid-area: f;"><textarea style="resize: none; width: calc(100%); height: 100%;"></textarea></div>
            `;
            
            tmp.appendChild (grid);
            
            return tmp;
        }, ApplyValueToEditElement: (e, engine) => {
            let inputs = e.querySelectorAll ("input");
            
            inputs[0].value = engine.EngineName;
            inputs[1].value = engine.EngineManufacturer;
            
            inputs[0].disabled = engine.PolyType == PolymorphismType.MultiConfigSlave;
            inputs[1].disabled = engine.PolyType == PolymorphismType.MultiConfigSlave;
            
            e.querySelector ("textarea")!.value = engine.EngineDescription;
        }, ApplyChangesToValue: (e, engine) => {
            let inputs = e.querySelectorAll ("input");
            
            engine.EngineName = inputs[0].value;
            engine.EngineManufacturer = inputs[1].value;
            engine.EngineDescription = e.querySelector ("textarea")!.value;
        }
    };
}