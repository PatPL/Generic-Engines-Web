namespace EngineEditableFieldMetadata {
    export const AlternatorPower: IEditable<Engine> = {
        ApplyValueToDisplayElement: (e, engine) => {
            e.innerHTML = Unit.Display (engine.AlternatorPower, "kW", Settings.classic_unit_display, 9);
        }, ApplyValueToEditElement: (e, engine) => {
            (e as HTMLInputElement).value = Unit.Display (engine.AlternatorPower, "kW", Settings.classic_unit_display);
        }, ApplyChangesToValue: (e, engine) => {
            engine.AlternatorPower = Unit.Parse ((e as HTMLInputElement).value, "kW");
        }
    };
}