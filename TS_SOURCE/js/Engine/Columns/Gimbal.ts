namespace EngineEditableFieldMetadata {
    export const Gimbal: IEditable<Engine> = {
        GetDisplayElement: () => {
            let tmp = document.createElement ("div");
            tmp.classList.add ("content-cell-content");
            return tmp;
        }, ApplyValueToDisplayElement: (e, engine) => {
            if (engine.AdvancedGimbal) {
                e.innerHTML = `X:<-${ engine.GimbalNX }°:${ engine.GimbalPX }°>, Y:<-${ engine.GimbalNY }°:${ engine.GimbalPY }°>`;
            } else {
                e.innerHTML = `${ engine.Gimbal }°`;
            }
        }, GetEditElement: () => {
            let tmp = document.createElement ("div");
            tmp.classList.add ("content-cell-content");
            tmp.style.height = "75px";
            tmp.style.padding = "0";
            
            tmp.innerHTML = `
                <div class="content-cell-content" style="height: 24px"></div>
            `;
            
            let baseDiv = document.createElement ("div");
            let advDiv = document.createElement ("div");
            let checkbox = document.createElement ("input");
            let checkboxLabel = document.createElement ("span");
            
            tmp.appendChild (baseDiv);
            tmp.appendChild (advDiv);
            
            checkbox.setAttribute ("data-ref", "checkbox");
            checkbox.type = "checkbox";
            checkbox.addEventListener ("change", (e) => {
                if (checkbox.checked) {
                    baseDiv.style.display = "none";
                    advDiv.style.display = "grid";
                } else {
                    baseDiv.style.display = "grid";
                    advDiv.style.display = "none";
                }
            });
            
            checkboxLabel.style.position = "relative";
            checkboxLabel.style.top = "-4px";
            checkboxLabel.style.left = "4px";
            checkboxLabel.innerHTML = "Advanced gimbal";
            
            tmp.children[0].appendChild (checkbox);
            tmp.children[0].appendChild (checkboxLabel);
            
            baseDiv.setAttribute ("data-ref", "basediv");
            baseDiv.style.display = "grid";
            baseDiv.style.gridTemplateColumns = "94px auto 3px";
            baseDiv.style.gridTemplateRows = "24px";
            baseDiv.style.gridTemplateAreas = `
                "a b c"
            `;
            
            baseDiv.innerHTML = `
                <div class="content-cell-content" style="grid-area: a;">Gimbal (°)</div>
                <div style="grid-area: b;"><input data-ref="gimbal" style="width: calc(100%);"></div>
            `;
            
            advDiv.setAttribute ("data-ref", "advdiv");
            advDiv.style.display = "grid";
            advDiv.style.gridTemplateColumns = "114px auto auto 3px";
            advDiv.style.gridTemplateRows = "24px 24px";
            advDiv.style.gridTemplateAreas = `
                "a b c d"
                "e f g h"
            `;
            
            advDiv.innerHTML = `
                <div class="content-cell-content" style="grid-area: a;">X axis (-|+)°</div>
                <div style="grid-area: b;"><input data-ref="gimbalnx" style="width: calc(100%);"></div>
                <div style="grid-area: c;"><input data-ref="gimbalpx" style="width: calc(100%);"></div>
                
                <div class="content-cell-content" style="grid-area: e;">Y axis (-|+)°</div>
                <div style="grid-area: f;"><input data-ref="gimbalny" style="width: calc(100%);"></div>
                <div style="grid-area: g;"><input data-ref="gimbalpy" style="width: calc(100%);"></div>
            `;
            
            return tmp;
        }, ApplyValueToEditElement: (e, engine) => {
            
            e.querySelector<HTMLInputElement> (`input[data-ref="checkbox"]`)!.checked = engine.AdvancedGimbal;
            e.querySelector<HTMLInputElement> (`input[data-ref="gimbal"]`)!.value = engine.Gimbal.toString ();
            e.querySelector<HTMLInputElement> (`input[data-ref="gimbalnx"]`)!.value = engine.GimbalNX.toString ();
            e.querySelector<HTMLInputElement> (`input[data-ref="gimbalpx"]`)!.value = engine.GimbalPX.toString ();
            e.querySelector<HTMLInputElement> (`input[data-ref="gimbalny"]`)!.value = engine.GimbalNY.toString ();
            e.querySelector<HTMLInputElement> (`input[data-ref="gimbalpy"]`)!.value = engine.GimbalPY.toString ();
            
            if (engine.AdvancedGimbal) {
                (<HTMLElement> e.querySelector (`div[data-ref="basediv"]`)!).style.display = "none";
                (<HTMLElement> e.querySelector (`div[data-ref="advdiv"]`)!).style.display = "grid";
            } else {
                (<HTMLElement> e.querySelector (`div[data-ref="basediv"]`)!).style.display = "grid";
                (<HTMLElement> e.querySelector (`div[data-ref="advdiv"]`)!).style.display = "none";
            }
        }, ApplyChangesToValue: (e, engine) => {
            
            engine.AdvancedGimbal = e.querySelector<HTMLInputElement> (`input[data-ref="checkbox"]`)!.checked;
            engine.Gimbal = parseFloat (e.querySelector<HTMLInputElement> (`input[data-ref="gimbal"]`)!.value.replace (",", "."));
            engine.GimbalPX = parseFloat (e.querySelector<HTMLInputElement> (`input[data-ref="gimbalpx"]`)!.value.replace (",", "."));
            engine.GimbalNY = parseFloat (e.querySelector<HTMLInputElement> (`input[data-ref="gimbalny"]`)!.value.replace (",", "."));
            engine.GimbalPY = parseFloat (e.querySelector<HTMLInputElement> (`input[data-ref="gimbalpy"]`)!.value.replace (",", "."));
            engine.GimbalNX = parseFloat (e.querySelector<HTMLInputElement> (`input[data-ref="gimbalnx"]`)!.value.replace (",", "."));
            
        }
    };
}