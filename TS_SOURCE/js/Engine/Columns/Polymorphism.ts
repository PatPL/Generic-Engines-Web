namespace EngineEditableFieldMetadata {
    export const Polymorphism: IEditable<Engine> = {
        GetDisplayElement: () => {
            let tmp = document.createElement ("div");
            tmp.classList.add ("content-cell-content");
            return tmp;
        }, ApplyValueToDisplayElement: (e, engine) => {
            switch (engine.PolyType) {
                case PolymorphismType.Single:
                e.innerHTML = `Single`;
                break; case PolymorphismType.MultiModeMaster:
                e.innerHTML = `Multimode master`;
                break; case PolymorphismType.MultiModeSlave:
                e.innerHTML = `Multimode slave to ${engine.MasterEngineName}`;
                break; case PolymorphismType.MultiConfigMaster:
                e.innerHTML = `Multiconfig master`;
                break; case PolymorphismType.MultiConfigSlave:
                e.innerHTML = `Multiconfig slave to ${engine.MasterEngineName}`;
                break;
            }
        }, GetEditElement: () => {
            let tmp = document.createElement ("div");
            tmp.classList.add ("content-cell-content");
            tmp.style.height = "46px";
            tmp.style.padding = "0";
            
            let grid = document.createElement ("div");
            grid.style.display = "grid";
            grid.style.gridTemplateColumns = "auto";
            grid.style.gridTemplateRows = "23px 23px";
            grid.style.gridTemplateAreas = `
                "a"
                "b"
            `;
            
            grid.innerHTML = `
                <div style="grid-area: a;">${Engine.PolymorphismTypeDropdown.outerHTML}</div>
                <div style="grid-area: b;"><select></select></div>
            `;
            
            tmp.appendChild (grid);
            
            return tmp;
        }, ApplyValueToEditElement: (e, engine) => {
            let selects = e.querySelectorAll ("select");
            
            // Not an 'addEventListener' to replace current listener, not add another one
            selects[0].onchange = () => {
                engine.RebuildMasterSelect (e);
            };
            
            selects[0].value = engine.PolyType.toString ();
            engine.RebuildMasterSelect (e);
        }, ApplyChangesToValue: (e, engine) => {
            let selects = e.querySelectorAll ("select");
            
            engine.PolyType = parseInt (selects[0].value);
            engine.MasterEngineName = selects[1].value;
            
            engine.RehidePolyFields (engine.ListCols);
        }
    };
}