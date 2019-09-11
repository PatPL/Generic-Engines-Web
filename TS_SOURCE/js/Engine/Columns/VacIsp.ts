namespace EngineEditableFieldMetadata {
    export const VacIsp: IEditable<Engine> = {
        ApplyValueToDisplayElement: (e, engine) => {
            e.innerHTML = Unit.Display (engine.VacIsp, "s", true); //Keep true. Isp hardly ever goes above 1000, and kiloseconds look weird
        }, ApplyValueToEditElement: (e, engine) => {
            (e as HTMLInputElement).value = Unit.Display (engine.VacIsp, "s", true);
        }, ApplyChangesToValue: (e, engine) => {
            engine.VacIsp = Unit.Parse ((e as HTMLInputElement).value, "s");
        }
    };
}