namespace EngineEditableFieldMetadata {
    export const Thrust: IEditable<Engine> = {
        ApplyValueToDisplayElement: (e, engine) => {
            e.innerHTML = Unit.Display (engine.Thrust, "kN", Settings.classic_unit_display, 9);
        }, ApplyValueToEditElement: (e, engine) => {
            (e as HTMLInputElement).value = Unit.Display (engine.Thrust, "kN", Settings.classic_unit_display);
        }, ApplyChangesToValue: (e, engine) => {
            engine.Thrust = Unit.Parse ((e as HTMLInputElement).value, "kN");
        }
    };
}