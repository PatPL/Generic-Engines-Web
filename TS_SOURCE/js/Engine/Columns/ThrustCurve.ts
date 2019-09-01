namespace EngineEditableFieldMetadata {
    export const ThrustCurve: IEditable<Engine> = {
        ApplyValueToDisplayElement: (e, engine) => {
            e.innerHTML = engine.ThrustCurve.length > 0 ? "Custom" : "Default";
        }, GetEditElement: () => {
            let tmp = document.createElement ("div");
            tmp.classList.add ("content-cell-content");
            tmp.style.height = "150px";
            tmp.style.padding = "0";
            
            let grid = document.createElement ("div");
            grid.style.display = "grid";
            grid.style.gridTemplateColumns = "24px 24px 24px auto";
            grid.style.gridTemplateRows = "24px 129px";
            grid.style.gridTemplateAreas = `
                "a b c d"
                "e e e e"
            `;
            
            grid.innerHTML = `
                <div style="grid-area: a;"><img class="mini-button option-button" title="Add new entry" src="img/button/add-mini.png"></div>
                <div style="grid-area: b;"><img class="mini-button option-button" title="Remove last entry" src="img/button/remove-mini.png"></div>
                <div style="grid-area: c;"><img class="mini-button option-button" title="Sort entries by Fuel% (Descending)" src="img/button/sort-mini.png"></div>
                <div class="content-cell-content" style="grid-area: d;"></div>
                <div class="content-cell-content" style="grid-area: e; overflow: auto;"><table><tr><th style="width: 50%;">Fuel%</th><th style="width: 50%;">Thrust%</th></tr></table></div>
            `;
            
            let table = grid.querySelector ("tbody")!;
            let imgs = grid.querySelectorAll ("img");
            
            imgs[0].addEventListener ("click", () => {
                let tr = document.createElement ("tr");
                
                tr.innerHTML = `
                    <td><input style="width: calc(100%);" value="0"></td>
                    <td><input style="width: calc(100%);" value="0"></td>
                `;
                
                table.appendChild (tr);
            });
            
            imgs[1].addEventListener ("click", () => {
                let tmp = grid.querySelectorAll ("tr");
                if (tmp.length > 1) {
                    tmp[tmp.length - 1].remove ();
                }
            });
            
            imgs[2].addEventListener ("click", () => {
                let tmpCurve: [number, number][] = [];
                
                let inputs = tmp.querySelectorAll<HTMLInputElement> (`input`);
                
                for (let i = 0; i < inputs.length; i += 2) {
                    tmpCurve.push ([parseFloat (inputs[i].value.replace (",", ".")), parseFloat (inputs[i + 1].value.replace (",", "."))]);
                }
                
                tmpCurve = tmpCurve.sort ((a, b) => {
                    return b[0] - a[0];
                });
                
                let table = tmp.querySelector ("tbody")!;
                let rows = tmp.querySelectorAll ("tr");
                
                rows.forEach ((v, i) => {
                    if (i != 0) {
                        v.remove ();
                    }
                });
                
                tmpCurve.forEach(v => {
                    let tr = document.createElement ("tr");
                    
                    tr.innerHTML = `
                        <td><input style="width: calc(100%);" value="${v[0]}"></td>
                        <td><input style="width: calc(100%);" value="${v[1]}"></td>
                    `;
                    
                    table.appendChild (tr);
                });
            });
            
            tmp.appendChild (grid);
            
            return tmp;
        }, ApplyValueToEditElement: (e, engine) => {
            let table = e.querySelector ("tbody")!;
            let rows = e.querySelectorAll ("tr");
            
            engine.ThrustCurve = engine.ThrustCurve.sort ((a, b) => {
                return b[0] - a[0];
            });
            
            rows.forEach ((v, i) => {
                if (i != 0) {
                    v.remove ();
                }
            });
            
            engine.ThrustCurve.forEach(v => {
                let tr = document.createElement ("tr");
                
                tr.innerHTML = `
                    <td><input style="width: calc(100%);" value="${v[0]}"></td>
                    <td><input style="width: calc(100%);" value="${v[1]}"></td>
                `;
                
                table.appendChild (tr);
            });
        }, ApplyChangesToValue: (e, engine) => {
            let inputs = e.querySelectorAll<HTMLInputElement> (`input`);
            
            engine.ThrustCurve = [];
            
            for (let i = 0; i < inputs.length; i += 2) {
                engine.ThrustCurve.push ([parseFloat (inputs[i].value.replace (",", ".")), parseFloat (inputs[i + 1].value.replace (",", "."))]);
            }
            
            engine.ThrustCurve = engine.ThrustCurve.sort ((a, b) => {
                return b[0] - a[0];
            });
        },
    };
}