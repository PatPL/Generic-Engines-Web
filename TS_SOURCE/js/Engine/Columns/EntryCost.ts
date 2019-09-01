namespace EngineEditableFieldMetadata {
    export const EntryCost: IEditable<Engine> = {
        ApplyValueToDisplayElement: (e, engine) => {
            e.innerHTML = Unit.Display (engine.EntryCost, " VF", Settings.classic_unit_display);
        }, ApplyValueToEditElement: (e, engine) => {
            (e as HTMLInputElement).value = Unit.Display (engine.EntryCost, " VF", Settings.classic_unit_display);
        }, ApplyChangesToValue: (e, engine) => {
            engine.EntryCost = Unit.Parse ((e as HTMLInputElement).value, " VF");
        }
    };
}