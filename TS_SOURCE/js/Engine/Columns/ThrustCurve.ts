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
            chartElement.style.background = "var(--tableBackground)";
            
            // === Static background, separated to not redraw it on update
            let chartBackground = document.createElement ("canvas");
            chartBackground.classList.add ("chartBackground");
            chartBackground.height = 400;
            chartBackground.width = 400;
            chartBackground.style.position = "absolute";
            chartBackground.style.top = "8px";
            chartBackground.style.left = "8px";
            chartElement.appendChild (chartBackground);
            
            let canvas = chartBackground.getContext ("2d")!;
            let style = getComputedStyle (document.body);
            CanvasHelper.DrawGrid (
                0, 0,
                399, 399,
                9, 3, true,
                canvas, style.getPropertyValue ("--tableRegular"), 1,
                { 5: { Color: style.getPropertyValue ("--tableDistinct"), Label: "50%" } },
                { 2: { Color: style.getPropertyValue ("--tableRed"), Width: 1, Label: "100%" }, 3: { Color: style.getPropertyValue ("--tableDistinct"), Label: "50%" } },
                { Color: style.getPropertyValue ("--tableBorder"), Width: 3 },
                "Fuel", "Thrust"
            );
            
            tmp.appendChild (chartElement);
            // !== Static background
            // === Dynamic foreground: Lines on canvas
            let chartLines = document.createElement ("canvas");
            chartBackground.classList.add ("chartLines");
            chartLines.height = 400;
            chartLines.width = 400;
            chartLines.style.position = "absolute";
            chartLines.style.top = "8px";
            chartLines.style.left = "8px";
            chartElement.appendChild (chartLines);
            // !== Dynamic foreground
            // === Point container
            let chartPoints = document.createElement ("div");
            chartPoints.classList.add ("chartPoints");
            chartPoints.style.position = "absolute";
            chartPoints.style.top = "8px";
            chartPoints.style.left = "8px";
            chartPoints.style.width = "400px";
            chartPoints.style.height = "400px";
            chartElement.appendChild (chartPoints);
            // !== Point container
            
            return tmp;
        }, ApplyValueToEditElement: (e, engine) => {
            
        }, ApplyChangesToValue: (e, engine) => {
            
        },
    };
}