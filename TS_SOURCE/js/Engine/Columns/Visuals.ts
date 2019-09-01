namespace EngineEditableFieldMetadata {
    export const Visuals: IEditable<Engine> = {
        GetDisplayElement: () => {
            let tmp = document.createElement ("div");
            tmp.classList.add ("content-cell-content");
            return tmp;
        }, ApplyValueToDisplayElement: (e, engine) => {
            let isSlave = engine.PolyType == PolymorphismType.MultiModeSlave || engine.PolyType == PolymorphismType.MultiConfigSlave;
            
            if (isSlave) {
                e.innerHTML = `${PlumeInfo.GetPlumeInfo (engine.PlumeID).PlumeName}`;
            } else {
                e.innerHTML = `${ModelInfo.GetModelInfo (engine.ModelID).ModelName}, ${PlumeInfo.GetPlumeInfo (engine.PlumeID).PlumeName}`;
            }
        }, GetEditElement: () => {
            let tmp = document.createElement ("div");
            tmp.classList.add ("content-cell-content");
            tmp.style.padding = "0";
            
            let grid = document.createElement ("div");
            grid.style.display = "grid";
            grid.style.gridTemplateColumns = "60px auto";
            grid.style.gridTemplateAreas = `
                "a b"
                "c d"
                "e e"
            `;
            tmp.style.height = "168px";
            grid.style.gridTemplateRows = "24px 24px 120px";
            
            grid.innerHTML = `
                <div class="content-cell-content" style="grid-area: a;">Model</div>
                <div style="grid-area: b;"><span class="clickable-text modelText" value="999">Placeholder</span></div>
                <div class="content-cell-content" style="grid-area: c;">Plume</div>
                <div style="grid-area: d;"><span class="clickable-text plumeText" value="999">Placeholder</span></div>
                <div class="exhaustBox" style="grid-area: e; display: grid; grid-template: 'ea ea' 24px 'eb eb' 96px / auto">
                <div class="content-cell-content" style="grid-area: ea;"><input class="enableExhaust" type="checkbox"><span style="position: relative; left: 4px; top: -4px;">Enable exhaust effects</span></div>
                <div class="exhaustSettings" style="grid-area: eb; display: grid; grid-template: 'eba ebb' 24px 'ebc ebd' 24px 'ebe ebf' 24px 'ebg ebh' 24px / 140px auto">
                <div class="content-cell-content" style="grid-area: eba;">Exhaust plume</div>
                <div style="grid-area: ebb;"><span class="clickable-text exhaustPlumeText" value="999">Placeholder</span></div>
                <div class="content-cell-content" style="grid-area: ebc; cursor: help;" title="What fraction of engine's overall thrust is produced by engine exhaust?">Exhaust thrust</div>
                <div style="grid-area: ebd;"><input class="exhaustThrust" style="width: calc(100% - 24px);">%</div>
                <div class="content-cell-content" style="grid-area: ebe; cursor: help;" title="Multiplier of exhaust's efficiency, compared to main engine">Exhaust impulse</div>
                <div style="grid-area: ebf;"><input class="exhaustImpulse" style="width: calc(100% - 24px);">%</div>
                <div class="content-cell-content" style="grid-area: ebg;">Exhaust gimbal</div>
                <div style="grid-area: ebh;"><input class="exhaustGimbal" style="width: calc(100% - 24px);"><input title="Restrict engine gimbal to only roll control" class="exhaustGimbalRoll" type="checkbox" style="cursor: help; margin: -1px 0px 0px 0px; position: relative; top: 2px; left: 2px;"></div>
                </div>
                </div>
            `;
            
            let modelText = grid.querySelector (".modelText")!;
            modelText.addEventListener ("click", () => {
                ModelSelector.GetModel (m => {
                    if (m != null) {
                        modelText.setAttribute ("value", m.toString ());
                        modelText.innerHTML = ModelInfo.GetModelInfo (m).ModelName;
                        grid.querySelector<HTMLDivElement> (".exhaustBox")!.style.display = ModelInfo.GetModelInfo (m).Exhaust ? "grid" : "none";
                    }
                });
            });
            
            let plumeText = grid.querySelector (".plumeText")!;
            plumeText.addEventListener ("click", () => {
                PlumeSelector.GetPlume (m => {
                    if (m != null) {
                        plumeText.setAttribute ("value", m.toString ());
                        plumeText.innerHTML = PlumeInfo.GetPlumeInfo (m).PlumeName;
                    }
                });
            });
            
            let exhaustPlumeText = grid.querySelector (".exhaustPlumeText")!;
            exhaustPlumeText.addEventListener ("click", () => {
                PlumeSelector.GetPlume (m => {
                    if (m != null) {
                        exhaustPlumeText.setAttribute ("value", m.toString ());
                        exhaustPlumeText.innerHTML = PlumeInfo.GetPlumeInfo (m).PlumeName;
                    }
                });
            });
            
            let exhaustCheckbox = grid.querySelector<HTMLInputElement> (".enableExhaust")!;
            exhaustCheckbox.addEventListener ("change", () => {
                grid.querySelector<HTMLDivElement> (".exhaustSettings")!.style.display = exhaustCheckbox.checked ? "grid" : "none";
            })
            
            tmp.appendChild (grid);
            
            return tmp;
        }, ApplyValueToEditElement: (e, engine) => {
            let targetEngine = (
                engine.PolyType == PolymorphismType.MultiModeSlave ||
                engine.PolyType == PolymorphismType.MultiConfigSlave
            ) ? engine.EngineList.find (x => x.ID == engine.MasterEngineName) : engine;
            targetEngine = targetEngine != undefined ? targetEngine : engine;
            let isSlave = engine.PolyType == PolymorphismType.MultiConfigSlave || engine.PolyType == PolymorphismType.MultiModeSlave;
            
            let select = e.querySelector ("select")!;
            let modelText = e.querySelector<HTMLSpanElement> (".modelText")!;
            let plumeText = e.querySelector<HTMLSpanElement> (".plumeText")!;
            let exhaustPlumeText = e.querySelector<HTMLSpanElement> (".exhaustPlumeText")!;
            
            modelText.setAttribute ("value", targetEngine.ModelID.toString ());
            modelText.innerHTML = ModelInfo.GetModelInfo (targetEngine.ModelID).ModelName;
            
            plumeText.setAttribute ("value", engine.PlumeID.toString ());
            plumeText.innerHTML = PlumeInfo.GetPlumeInfo (engine.PlumeID).PlumeName;
            
            exhaustPlumeText.setAttribute ("value", engine.ExhaustPlumeID.toString ());
            exhaustPlumeText.innerHTML = PlumeInfo.GetPlumeInfo (engine.ExhaustPlumeID).PlumeName;
            
            e.querySelector<HTMLDivElement> (".exhaustBox")!.style.display = ModelInfo.GetModelInfo (engine.ModelID).Exhaust ? "grid" : "none";
            e.querySelector<HTMLInputElement> (".enableExhaust")!.checked = targetEngine.UseExhaustEffect;
            e.querySelector<HTMLDivElement> (".exhaustSettings")!.style.display = targetEngine.UseExhaustEffect ? "grid" : "none";
            
            e.querySelector<HTMLInputElement> (".exhaustThrust")!.value = engine.ExhaustThrustPercent.toString ();
            e.querySelector<HTMLInputElement> (".exhaustImpulse")!.value = engine.ExhaustIspPercent.toString ();
            e.querySelector<HTMLInputElement> (".exhaustGimbal")!.value = targetEngine.ExhaustGimbal.toString ();
            e.querySelector<HTMLInputElement> (".exhaustGimbalRoll")!.checked = targetEngine.ExhaustGimbalOnlyRoll;
            
            modelText.style.pointerEvents = isSlave ? "none" : "all";
            e.querySelector<HTMLInputElement> (".enableExhaust")!.disabled = isSlave;
            e.querySelector<HTMLInputElement> (".exhaustGimbal")!.disabled = isSlave;
            e.querySelector<HTMLInputElement> (".exhaustGimbalRoll")!.disabled = isSlave;
        }, ApplyChangesToValue: (e, engine) => {
            let modelText = e.querySelector (".modelText")!;
            let plumeText = e.querySelector (".plumeText")!;
            let exhaustPlumeText = e.querySelector (".exhaustPlumeText")!;
            
            let exhaustThrust = e.querySelector<HTMLInputElement> (".exhaustThrust")!;
            let exhaustImpulse = e.querySelector<HTMLInputElement> (".exhaustImpulse")!;
            let exhaustGimbal = e.querySelector<HTMLInputElement> (".exhaustGimbal")!;
            
            engine.ModelID = parseInt (modelText.getAttribute ("value")!);
            engine.PlumeID = parseInt (plumeText.getAttribute ("value")!);
            engine.ExhaustPlumeID = parseInt (exhaustPlumeText.getAttribute ("value")!);
            
            engine.UseExhaustEffect = e.querySelector<HTMLInputElement> (".enableExhaust")!.checked;
            engine.ExhaustThrustPercent = parseFloat (exhaustThrust.value.replace (",", "."));
            engine.ExhaustIspPercent = parseFloat (exhaustImpulse.value.replace (",", "."));
            engine.ExhaustGimbal = parseFloat (exhaustGimbal.value.replace (",", "."));
            engine.ExhaustGimbalOnlyRoll = e.querySelector<HTMLInputElement> (".exhaustGimbalRoll")!.checked;
        }
    };
}