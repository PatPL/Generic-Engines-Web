namespace EngineEditableFieldMetadata {
    export const Cost: IEditable<Engine> = {
        ApplyValueToDisplayElement: (e, engine) => {
            e.innerHTML = Unit.Display (engine.Cost, " VF", Settings.classic_unit_display);
        }, ApplyValueToEditElement: (e, engine) => {
            (e as HTMLInputElement).value = Unit.Display (engine.Cost, " VF", Settings.classic_unit_display);
        }, ApplyChangesToValue: (e, engine) => {
            engine.Cost = Unit.Parse ((e as HTMLInputElement).value, " VF");
        }
    };
}