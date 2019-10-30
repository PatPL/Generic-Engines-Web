namespace EngineEditableFieldMetadata {
    export const ThrustCurve: IEditable<Engine> = {
        ApplyValueToDisplayElement: (e, engine) => {
            e.innerHTML = engine.ThrustCurve.length > 0 ? `Custom: ${ engine.GetThrustCurveBurnTimeMultiplier ().toFixed (3) } * Burn time` : "Default";
        }, GetEditElement: () => {
            let tmp = document.createElement ("div");
            
            tmp.style.width = "416px";
            tmp.style.height = "500px";
            
            let chartElement = document.createElement ("div");
            chartElement.style.width = "416px";
            chartElement.style.height = "417px";
            chartElement.style.padding = "8px";
            chartElement.style.boxSizing = "border-box";
            chartElement.style.borderBottom = "var(--darkBorder) solid 1px";
            
            let chartBackground = document.createElement ("canvas");
            chartBackground.height = 400;
            chartBackground.width = 400;
            chartElement.appendChild (chartBackground);
            
            let canvas = chartBackground.getContext ("2d")!;
            CanvasHelper.DrawGrid (
                0, 0,
                399, 399,
                9, 3, true,
                canvas, "#666", 1,
                { 5: { Color: "#444", Label: "50%" } },
                { 2: { Color: "#F00", Width: 1.66, Label: "100%" }, 3: { Color: "#444", Label: "50%" } },
                { Color: "#444", Width: 4 }
            );
            
            tmp.appendChild (chartElement);
            
            return tmp;
        }, ApplyValueToEditElement: (e, engine) => {
            
        }, ApplyChangesToValue: (e, engine) => {
            
        },
    };
}