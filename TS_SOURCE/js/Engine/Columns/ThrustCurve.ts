namespace EngineEditableFieldMetadata {
    export const ThrustCurve: IEditable<Engine> = {
        ApplyValueToDisplayElement: (e, engine) => {
            e.innerHTML = engine.ThrustCurve.length > 0 ? `Custom: ${ engine.GetThrustCurveBurnTimeMultiplier ().toFixed (3) } * Burn time` : "Default";
        }, GetEditElement: () => {
            let tmp = document.createElement ("div");
            
            tmp.style.width = "466px";
            tmp.style.height = "500px";
            
            let chartElement = document.createElement ("div");
            chartElement.style.width = "466px";
            chartElement.style.height = "467px";
            chartElement.style.padding = "8px";
            chartElement.style.boxSizing = "border-box";
            chartElement.style.borderBottom = "var(--darkBorder) solid 1px";
            
            let chartBackground = document.createElement ("canvas");
            chartBackground.height = 450;
            chartBackground.width = 450;
            chartElement.appendChild (chartBackground);
            
            tmp.appendChild (chartElement);
            
            return tmp;
        }, ApplyValueToEditElement: (e, engine) => {
            
        }, ApplyChangesToValue: (e, engine) => {
            
        },
    };
}