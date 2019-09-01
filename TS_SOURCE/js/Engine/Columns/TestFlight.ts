namespace EngineEditableFieldMetadata {
    export const TestFlight: IEditable<Engine> = {
        GetDisplayElement: () => {
            let tmp = document.createElement ("div");
            tmp.classList.add ("content-cell-content");
            return tmp;
        }, ApplyValueToDisplayElement: (e, engine) => {
            if (engine.EnableTestFlight) {
                e.innerHTML = `Enabled | ${engine.StartReliability0}% - ${engine.StartReliability10k}% | ${Math.round ((1 / (1 - (engine.CycleReliability0 / 100))) * engine.RatedBurnTime)}s - ${Math.round ((1 / (1 - (engine.CycleReliability10k / 100))) * engine.RatedBurnTime)}s`;
            } else {
                if (engine.IsTestFlightDefault ()) {
                    e.innerHTML = `Disabled`;
                } else {
                    e.innerHTML = `Disabled, but configured`;
                }
            }
        }, GetEditElement: () => {
            let tmp = document.createElement ("div");
            tmp.classList.add ("content-cell-content");
            tmp.style.height = "147px";
            tmp.style.padding = "0";
            
            tmp.innerHTML = `
                <div class="content-cell-content" style="height: 24px;"><input type="checkbox"><span style="position: relative; left: 4px; top: -4px;">Enable Test Flight</span></div>
            `;
            
            let grid = document.createElement ("div");
            grid.style.display = "grid";
            grid.style.gridTemplateColumns = "310px auto 26px";
            grid.style.gridTemplateRows = "24px 24px 24px 24px 24px";
            grid.style.gridTemplateAreas = `
                "c d e"
                "f g h"
                "i j k"
                "l m n"
                "o p q"
            `;
            
            let checkbox = tmp.querySelector ("input")!;
            checkbox.addEventListener ("change", () => {
                grid.style.display = checkbox.checked ? "grid" : "none";
            });
            
            grid.innerHTML = `
                <div class="content-cell-content" style="grid-area: c;">Rated burn time</div>
                <div style="grid-area: d;"><input style="width: calc(100%);"></div>
                <div class="content-cell-content" style="grid-area: e;">s</div>
                
                <div class="content-cell-content" style="grid-area: f;">Ignition success chance (0% data)</div>
                <div style="grid-area: g;"><input style="width: calc(100%);"></div>
                <div class="content-cell-content" style="grid-area: h;">%</div>
                
                <div class="content-cell-content" style="grid-area: i;">Ignition success chance (100% data)</div>
                <div style="grid-area: j;"><input style="width: calc(100%);"></div>
                <div class="content-cell-content" style="grid-area: k;">%</div>
                
                <div class="content-cell-content" style="grid-area: l;">Burn cycle reliability (0% data)</div>
                <div style="grid-area: m;"><input style="width: calc(100%);"></div>
                <div class="content-cell-content" style="grid-area: n;">%</div>
                
                <div class="content-cell-content" style="grid-area: o;">Burn cycle reliability (100% data)</div>
                <div style="grid-area: p;"><input style="width: calc(100%);"></div>
                <div class="content-cell-content" style="grid-area: q;">%</div>
            `;
            
            tmp.appendChild (grid);
            
            return tmp;
        }, ApplyValueToEditElement: (e, engine) => {
            let inputs = e.querySelectorAll ("input");
            
            (e.children[1] as HTMLElement).style.display = engine.EnableTestFlight ? "grid" : "none";
            
            inputs[0].checked = engine.EnableTestFlight;
            inputs[1].value = engine.RatedBurnTime.toString ();
            inputs[2].value = engine.StartReliability0.toString ();
            inputs[3].value = engine.StartReliability10k.toString ();
            inputs[4].value = engine.CycleReliability0.toString ();
            inputs[5].value = engine.CycleReliability10k.toString ();
        }, ApplyChangesToValue: (e, engine) => {
            let inputs = e.querySelectorAll ("input");
            
            engine.EnableTestFlight = inputs[0].checked;
            engine.RatedBurnTime = parseInt (inputs[1].value);
            engine.StartReliability0 = parseFloat (inputs[2].value.replace (",", "."));
            engine.StartReliability10k = parseFloat (inputs[3].value.replace (",", "."));
            engine.CycleReliability0 = parseFloat (inputs[4].value.replace (",", "."));
            engine.CycleReliability10k = parseFloat (inputs[5].value.replace (",", "."));
        }
    };
}