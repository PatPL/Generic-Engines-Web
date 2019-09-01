namespace EngineEditableFieldMetadata {
    export const Ignitions: IEditable<Engine> = {
        ApplyValueToDisplayElement: (e, engine) => {
            e.innerHTML = engine.Ignitions <= 0 ? "Infinite" : engine.Ignitions.toString ();
        }, ApplyChangesToValue: (e, engine) => {
            engine.Ignitions = parseInt ((e as HTMLInputElement).value);
        }
    };
}