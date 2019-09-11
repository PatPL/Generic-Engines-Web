namespace EngineEditableFieldMetadata {
    export const AtmIsp: IEditable<Engine> = {
        ApplyValueToDisplayElement: (e, engine) => {
            e.innerHTML = Unit.Display (engine.AtmIsp, "s", true); //Keep true. Isp hardly ever goes above 1000, and kiloseconds look weird
        }, ApplyValueToEditElement: (e, engine) => {
            (e as HTMLInputElement).value = Unit.Display (engine.AtmIsp, "s", true);
        }, ApplyChangesToValue: (e, engine) => {
            engine.AtmIsp = Unit.Parse ((e as HTMLInputElement).value, "s");
        }
    };
}