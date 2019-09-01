namespace EngineEditableFieldMetadata {
    export const Mass: IEditable<Engine> = {
        ApplyValueToDisplayElement: (e, engine) => {
            e.innerHTML = Unit.Display (engine.Mass, "t", Settings.classic_unit_display, 9);
        }, ApplyValueToEditElement: (e, engine) => {
            (e as HTMLInputElement).value = Unit.Display (engine.Mass, "t", Settings.classic_unit_display);
        }, ApplyChangesToValue: (e, engine) => {
            engine.Mass = Unit.Parse ((e as HTMLInputElement).value, "t");
        }
    };
}